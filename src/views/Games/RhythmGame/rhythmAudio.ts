import { createNoteScheduler, type NoteScheduler } from '@webgamekit/audio'
import { BACKING_VOLUME } from './config'
import { startSlowedBacking } from './slowedBacking'

/**
 * The note scheduler of a round and the recording behind it, played at the round's tempo.
 * @param tempoRate - Share of full speed, 1 for the recording as it is
 * @returns The scheduler, a function that starts the recording and one that stops it
 */
export const createRhythmAudio = (
  tempoRate: number
): {
  scheduler: NoteScheduler
  startBacking: (audioData: ArrayBuffer) => Promise<void>
  stopBacking: () => void
} => {
  const audio: { context: AudioContext | null; backing: AudioBufferSourceNode | null } = {
    context: null,
    backing: null
  }
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
  return { scheduler, startBacking, stopBacking: () => audio.backing?.stop() }
}
