import type { ScheduledNote } from '@webgamekit/audio'
import type { RhythmNote } from './config'

/**
 * Plays a chart slower: every note arrives later by the inverse of the rate.
 * @param notes - The chart at its own tempo
 * @param tempoRate - Share of full speed, 1 for as written, below 1 for slower
 * @returns The chart's notes at the new tempo
 */
export const slowChartNotes = (notes: RhythmNote[], tempoRate: number): RhythmNote[] =>
  notes.map((note) => ({ ...note, time: Math.round(note.time / tempoRate) }))

/**
 * Slows scheduled sound the way a record played slow is slowed: later, longer and lower, so it
 * stays in tune with a backing track played at the same rate.
 * @param notes - The notes at their own tempo
 * @param tempoRate - Share of full speed, 1 for as written, below 1 for slower
 * @returns The notes at the new tempo
 */
export const slowScheduledNotes = (notes: ScheduledNote[], tempoRate: number): ScheduledNote[] =>
  notes.map((note) => ({
    ...note,
    time: note.time / tempoRate,
    duration: note.duration / tempoRate,
    freq: note.freq * tempoRate
  }))
