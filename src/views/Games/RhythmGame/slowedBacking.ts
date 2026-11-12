const MILLISECONDS_PER_SECOND = 1000

/**
 * Plays a backing track at a share of its speed, in time with a scheduler's clock. Playing it
 * slower also lowers it, the way a slowed record sounds, so the notes scheduled beside it are
 * lowered by the same rate to stay in tune.
 * @param context - The audio context the scheduler plays on
 * @param audioData - The encoded recording, which decoding takes ownership of
 * @param volume - Playback volume, 1 for as recorded
 * @param readElapsedMs - The scheduler's clock in milliseconds; negative before the song starts
 * @param tempoRate - Share of full speed, below 1 for slower
 * @returns The playing source, to stop it
 */
export const startSlowedBacking = async (
  context: AudioContext,
  audioData: ArrayBuffer,
  volume: number,
  readElapsedMs: () => number,
  tempoRate: number
): Promise<AudioBufferSourceNode> => {
  const buffer = await context.decodeAudioData(audioData)
  const source = context.createBufferSource()
  const gain = context.createGain()
  source.buffer = buffer
  source.playbackRate.value = tempoRate
  gain.gain.value = volume
  source.connect(gain)
  gain.connect(context.destination)
  const elapsedSeconds = readElapsedMs() / MILLISECONDS_PER_SECOND
  // Before the song starts the track waits; once it has started it joins at the matching point.
  if (elapsedSeconds >= 0) source.start(context.currentTime, elapsedSeconds * tempoRate)
  else source.start(context.currentTime - elapsedSeconds)
  return source
}
