import { reactive } from 'vue'
import { GAME_MUSIC, GAME_SFX } from '@/config/gameAudio'
import { readStorage, writeStorage } from '@/utils/storage'
import type {
  GameAudioId,
  MusicTrack,
  ScheduledTone,
  SfxTone,
  SoundSettings
} from '@/types/gameAudio'

const SETTINGS_STORAGE_KEY = 'games-audio-settings'
const SEMITONES: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }
const NOTE_NAME_PATTERN = /^([a-g])(#|b)?(\d)$/
const EIGHTH_NOTES_PER_BEAT = 2
const NOTE_LENGTH_RATIO = 0.9
const LEAD_VOLUME = 0.045
const BASS_VOLUME = 0.07
const LOOP_LOOKAHEAD_SECONDS = 0.3
const MILLISECONDS_PER_SECOND = 1000

const readStoredSettings = (): SoundSettings => {
  try {
    const stored: unknown = JSON.parse(readStorage(SETTINGS_STORAGE_KEY) ?? '{}')
    const record = typeof stored === 'object' && stored !== null ? stored : {}
    return {
      music: !('music' in record && record.music === false),
      effects: !('effects' in record && record.effects === false)
    }
  } catch {
    return { music: true, effects: true }
  }
}

/** What is switched on, for every game: Rock Runner's own sounds follow it too. */
export const gameAudioSettings = reactive<SoundSettings>(readStoredSettings())

const audioState: {
  context: AudioContext | null
  musicTimer: ReturnType<typeof setTimeout> | null
  musicBus: GainNode | null
  musicGame: GameAudioId | null
  musicPlaying: boolean
} = { context: null, musicTimer: null, musicBus: null, musicGame: null, musicPlaying: false }

/**
 * The pitch of a note name.
 * @param noteName - A name such as `c4`, `f#3` or `bb2`
 * @returns The frequency in hertz, or null for a rest or anything that is not a note
 */
export const noteNameToFrequency = (noteName: string): number | null => {
  const match = NOTE_NAME_PATTERN.exec(noteName)
  if (match === null) return null
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0
  const midiNote = (Number(match[3]) + 1) * 12 + SEMITONES[match[1]] + accidental
  return 440 * 2 ** ((midiNote - 69) / 12)
}

const scheduleLayer = (
  line: string,
  secondsPerStep: number,
  layer: ScheduledTone['layer']
): ScheduledTone[] =>
  line.split(' ').flatMap((token, stepIndex) => {
    const frequency = noteNameToFrequency(token)
    return frequency === null
      ? []
      : [
          {
            startSeconds: stepIndex * secondsPerStep,
            durationSeconds: secondsPerStep * NOTE_LENGTH_RATIO,
            frequency,
            layer
          }
        ]
  })

/**
 * Lays a track out in time: one eighth note per token, rests skipped.
 * @param track - The tune
 * @returns Every note of one pass through the loop, lead first
 */
export const scheduleMusicTones = (track: MusicTrack): ScheduledTone[] => {
  const secondsPerStep = 60 / track.beatsPerMinute / EIGHTH_NOTES_PER_BEAT
  return [
    ...scheduleLayer(track.lead, secondsPerStep, 'lead'),
    ...scheduleLayer(track.bass, secondsPerStep, 'bass')
  ]
}

const getContext = (): AudioContext | null => {
  audioState.context ??= new AudioContext()
  if (audioState.context.state === 'suspended') audioState.context.resume().catch(() => undefined)
  return audioState.context
}

const playTone = (
  context: AudioContext,
  tone: Pick<
    SfxTone,
    'waveType' | 'startFrequency' | 'endFrequency' | 'durationSeconds' | 'volume'
  >,
  startTime: number,
  destination: AudioNode
): void => {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = tone.waveType
  oscillator.frequency.setValueAtTime(tone.startFrequency, startTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    tone.endFrequency,
    startTime + tone.durationSeconds
  )
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(tone.volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tone.durationSeconds)
  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + tone.durationSeconds + 0.02)
}

/**
 * Plays one of a game's effects. Nothing happens while muted or for a name the game has no effect for.
 * @param game - The game the effect belongs to
 * @param effectName - The interaction, such as `correct` or `bounce`
 */
export const playGameSound = (game: GameAudioId, effectName: string): void => {
  const effect = gameAudioSettings.effects ? GAME_SFX[game]?.[effectName] : undefined
  const context = effect === undefined ? null : getContext()
  if (effect === undefined || context === null) return
  effect.forEach((tone) =>
    playTone(context, tone, context.currentTime + (tone.delaySeconds ?? 0), context.destination)
  )
}

// A loop's notes are all scheduled ahead of time, so silencing them means cutting the bus they share.
const stopMusicTimer = (): void => {
  if (audioState.musicTimer !== null) clearTimeout(audioState.musicTimer)
  audioState.musicTimer = null
  audioState.musicBus?.disconnect()
  audioState.musicBus = null
}

const scheduleLoop = (
  context: AudioContext,
  track: MusicTrack,
  loopStartTime: number,
  bus: AudioNode
): void => {
  const tones = scheduleMusicTones(track)
  const loopSeconds =
    (track.lead.split(' ').length * 60) / track.beatsPerMinute / EIGHTH_NOTES_PER_BEAT
  tones.forEach((tone) =>
    playTone(
      context,
      {
        waveType: tone.layer === 'lead' ? track.leadWave : track.bassWave,
        startFrequency: tone.frequency,
        endFrequency: tone.frequency,
        durationSeconds: tone.durationSeconds,
        volume: tone.layer === 'lead' ? LEAD_VOLUME : BASS_VOLUME
      },
      loopStartTime + tone.startSeconds,
      bus
    )
  )
  const nextLoopStart = loopStartTime + loopSeconds
  audioState.musicTimer = setTimeout(
    () => scheduleLoop(context, track, nextLoopStart, bus),
    Math.max(
      0,
      (nextLoopStart - context.currentTime - LOOP_LOOKAHEAD_SECONDS) * MILLISECONDS_PER_SECOND
    )
  )
}

const applyMusic = (): void => {
  stopMusicTimer()
  const track = audioState.musicGame === null ? undefined : GAME_MUSIC[audioState.musicGame]
  const wanted = track !== undefined && audioState.musicPlaying && gameAudioSettings.music
  const context = wanted ? getContext() : null
  if (track === undefined || context === null) return
  const bus = context.createGain()
  bus.connect(context.destination)
  audioState.musicBus = bus
  scheduleLoop(context, track, context.currentTime + 0.05, bus)
}

/**
 * Starts a game's looping music. While muted it is remembered and starts when sound comes back on.
 * @param game - The game whose tune to play
 */
export const startGameMusic = (game: GameAudioId): void => {
  audioState.musicGame = game
  audioState.musicPlaying = true
  applyMusic()
}

/** Stops the music and forgets the game, so nothing restarts it. */
export const stopGameMusic = (): void => {
  audioState.musicPlaying = false
  audioState.musicGame = null
  stopMusicTimer()
}

/**
 * Switches music or the effects on or off and remembers the choice. The music starts again from
 * the top when it comes back on.
 * @param kind - Which of the two to switch
 */
export const toggleGameAudioSetting = (kind: keyof SoundSettings): void => {
  gameAudioSettings[kind] = !gameAudioSettings[kind]
  writeStorage(SETTINGS_STORAGE_KEY, JSON.stringify(gameAudioSettings))
  if (kind === 'music') applyMusic()
}
