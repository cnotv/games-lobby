import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  noteNameToFrequency,
  scheduleMusicTones,
  gameAudioSettings,
  toggleGameAudioSetting,
  startGameMusic,
  stopGameMusic,
  playGameSound
} from './gameAudio'
import { GAME_MUSIC, GAME_SFX } from '@/config/gameAudio'

describe('noteNameToFrequency', () => {
  it.each([
    ['a4', 440],
    ['a3', 220],
    ['c4', 261.63],
    ['f#4', 369.99],
    ['bb3', 233.08]
  ])('%s is %f Hz', (name, expected) => {
    expect(noteNameToFrequency(name)).toBeCloseTo(expected, 1)
  })

  it.each(['-', 'x', ''])('%j has no pitch', (name) => {
    expect(noteNameToFrequency(name)).toBeNull()
  })
})

describe('scheduleMusicTones', () => {
  it('places one eighth note per token at the track tempo and skips rests', () => {
    const tones = scheduleMusicTones({
      beatsPerMinute: 120,
      leadWave: 'square',
      bassWave: 'triangle',
      lead: 'a4 - a5 -',
      bass: 'a2 - - -'
    })
    expect(tones.filter((tone) => tone.layer === 'lead').map((tone) => tone.startSeconds)).toEqual([
      0, 0.5
    ])
    expect(tones.filter((tone) => tone.layer === 'bass')).toHaveLength(1)
    expect(tones[0].durationSeconds).toBeCloseTo(0.25 * 0.9)
  })
})

describe('game audio config', () => {
  const tracks = Object.entries(GAME_MUSIC)

  it('gives every game with music a lead and bass of equal length', () => {
    expect(tracks.length).toBeGreaterThanOrEqual(8)
    tracks.forEach(([, track]) => {
      expect(track.lead.split(' ').length).toBe(track.bass.split(' ').length)
      expect(scheduleMusicTones(track).length).toBeGreaterThan(0)
    })
  })

  it('loops for at least 50 seconds, so a tune is not heard over and over', () => {
    const MIN_LOOP_SECONDS = 50
    tracks.forEach(([game, track]) => {
      const loopSeconds = (track.lead.split(' ').length * 30) / track.beatsPerMinute
      expect(loopSeconds, game).toBeGreaterThanOrEqual(MIN_LOOP_SECONDS)
    })
  })

  it('gives Bubble Shooter a sound for the ceiling trembling and for it dropping', () => {
    expect(GAME_SFX.bubbles?.tremble).toBeDefined()
    expect(GAME_SFX.bubbles?.ceilingDrop).toBeDefined()
  })

  it('only uses note names the parser understands', () => {
    tracks.forEach(([game, track]) => {
      const tokens = [...track.lead.split(' '), ...track.bass.split(' ')].filter(
        (token) => token !== '-'
      )
      tokens.forEach((token) =>
        expect(noteNameToFrequency(token), `${game}: ${token}`).not.toBeNull()
      )
    })
  })

  it('has effects for each game', () => {
    expect(Object.keys(GAME_SFX).length).toBeGreaterThanOrEqual(9)
    Object.values(GAME_SFX).forEach((effects) =>
      Object.values(effects).forEach((tones) => expect(tones.length).toBeGreaterThan(0))
    )
  })
})

describe('sound settings', () => {
  const AudioContextSpy = vi.fn()

  beforeEach(() => {
    AudioContextSpy.mockClear()
    vi.stubGlobal('AudioContext', AudioContextSpy)
    gameAudioSettings.music = true
    gameAudioSettings.effects = true
  })

  it('switches music and effects on their own and remembers each', () => {
    toggleGameAudioSetting('effects')
    expect(gameAudioSettings).toEqual({ music: true, effects: false })
    expect(localStorage.getItem('games-audio-settings')).toBe('{"music":true,"effects":false}')
  })

  it('never touches the audio hardware with the effects off', () => {
    gameAudioSettings.effects = false
    playGameSound('pictionary', 'correct')
    expect(AudioContextSpy).not.toHaveBeenCalled()
  })

  it('never touches the audio hardware with the music off', () => {
    gameAudioSettings.music = false
    startGameMusic('pictionary')
    expect(AudioContextSpy).not.toHaveBeenCalled()
    stopGameMusic()
  })
})
