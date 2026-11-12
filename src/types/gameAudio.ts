export type GameAudioId =
  | 'pictionary'
  | 'wordle'
  | 'squares'
  | 'minigolf'
  | 'bubbles'
  | 'rhythm'
  | 'marbles'
  | 'marbleBuilder'
  | 'rockRunner'
  | 'wordRunner'

/** One synthesized effect: a tone swept from one pitch to another, optionally layered. */
export type SfxTone = {
  waveType: OscillatorNode['type']
  startFrequency: number
  endFrequency: number
  durationSeconds: number
  volume: number
  /** Seconds after the effect starts, so a few tones make an arpeggio. */
  delaySeconds?: number
}

export type SfxDefinition = SfxTone[]

/** A looping tune. Each token of a line is one eighth note: a note name such as `c4`, `f#3`, or `-` for a rest. */
export type MusicTrack = {
  beatsPerMinute: number
  leadWave: OscillatorNode['type']
  bassWave: OscillatorNode['type']
  lead: string
  bass: string
}

export type ScheduledTone = {
  startSeconds: number
  durationSeconds: number
  frequency: number
  layer: 'lead' | 'bass'
}
