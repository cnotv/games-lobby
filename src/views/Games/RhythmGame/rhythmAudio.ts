import { createNoteScheduler, type NoteScheduler } from '@webgamekit/audio'
import { BACKING_VOLUME } from './config'
import { startSlowedBacking } from './slowedBacking'
import { songMsFromPosition } from './strudelSong'
import type { StrudelLiveSong } from '@/views/Tools/StrudelEditor/types'

/**
 * The sound of a round: the note scheduler, and either a shipped song's recording played at the
 * round's tempo or a Strudel song played live. A live song is also the round's clock, so the
 * falling notes follow what is heard rather than drifting from it.
 * @param tempoRate - Share of full speed, 1 for the recording as it is
 * @param strudelCode - Code of a Strudel song to play live, its tempo already set; none for others
 * @returns The scheduler, the round's clock, and functions to start and stop the song
 */
export const createRhythmAudio = (
  tempoRate: number,
  strudelCode: string | null | undefined
): {
  scheduler: NoteScheduler
  readCurrentMs: () => number
  startSong: (startAt: number, loadBacking: () => Promise<ArrayBuffer | null>) => void
  stopSong: () => void
} => {
  const audio: {
    context: AudioContext | null
    backing: AudioBufferSourceNode | null
    liveSong: StrudelLiveSong | null
    liveTimer: ReturnType<typeof setTimeout> | null
    stopped: boolean
  } = { context: null, backing: null, liveSong: null, liveTimer: null, stopped: false }
  const scheduler = createNoteScheduler(() => {
    audio.context = new AudioContext()
    return audio.context
  })

  const startBacking = async (audioData: ArrayBuffer): Promise<void> => {
    if (tempoRate === 1 || audio.context === null) {
      await scheduler.startBacking(audioData, BACKING_VOLUME).catch(() => undefined)
      return
    }
    audio.backing = await startSlowedBacking(
      audio.context,
      audioData,
      BACKING_VOLUME,
      () => scheduler.currentMs,
      tempoRate
    ).catch(() => null)
  }

  const playLiveSong = async (code: string): Promise<void> => {
    const { playStrudelSong } = await import('@/views/Tools/StrudelEditor/strudelPlayback')
    const liveSong = await playStrudelSong(code).catch(() => null)
    if (audio.stopped) {
      await liveSong?.stop()
      return
    }
    audio.liveSong = liveSong
  }

  return {
    scheduler,
    readCurrentMs: () => {
      const position = audio.liveSong?.readPosition()
      return position === undefined ? scheduler.currentMs : songMsFromPosition(position)
    },
    // A missing recording or song is only a quieter round, so the notes play on without it.
    startSong: (startAt, loadBacking) => {
      if (strudelCode) {
        audio.liveTimer = setTimeout(
          () => void playLiveSong(strudelCode),
          Math.max(0, startAt - Date.now())
        )
        return
      }
      void loadBacking().then((backing) => {
        if (backing !== null && !audio.stopped) void startBacking(backing)
      })
    },
    stopSong: () => {
      audio.stopped = true
      if (audio.liveTimer !== null) clearTimeout(audio.liveTimer)
      audio.backing?.stop()
      void audio.liveSong?.stop()
      audio.liveSong = null
    }
  }
}
