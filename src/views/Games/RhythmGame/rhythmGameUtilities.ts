import { midiNoteToFreq, type ScheduledNote } from '@webgamekit/audio'
import {
  HIT_WINDOW_PERFECT_MS,
  HIT_WINDOW_GOOD_MS,
  SCORE_PERFECT,
  SCORE_GOOD,
  SCORE_HOLD_BONUS,
  COMBO_THRESHOLDS,
  COMBO_MULTIPLIERS,
  INSTRUMENT_PRESETS,
  type HitResult,
  type RgInstrument,
  type RhythmNote
} from './config'

/**
 * Turns a chart into the notes the chosen instrument plays, each at the song's own pitch.
 * @param songNotes - The chart's notes
 * @param instrument - The instrument the player picked
 * @returns The notes to schedule
 */
export const buildScheduledNotes = (
  songNotes: RhythmNote[],
  instrument: RgInstrument
): ScheduledNote[] => {
  const preset = INSTRUMENT_PRESETS[instrument]
  return songNotes.map((note) => ({
    time: note.time,
    freq: midiNoteToFreq(note.midiNote) * preset.freqMultiplier,
    duration: preset.durationMs,
    volume: preset.volume,
    waveType: preset.waveType,
    attackTime: preset.attackTimeSec
  }))
}

/**
 * Evaluates a hit attempt based on the timing delta from the target.
 * @param deltaMs - Absolute difference in ms between press time and note target time
 * @returns Hit quality rating
 */
export const evaluateHit = (deltaMs: number): HitResult => {
  if (deltaMs <= HIT_WINDOW_PERFECT_MS) return 'perfect'
  if (deltaMs <= HIT_WINDOW_GOOD_MS) return 'good'
  return 'miss'
}

/**
 * Calculates the score for a single hit, applying the combo multiplier.
 * @param result - Quality of the hit
 * @param combo - Current combo count before this hit
 * @returns Points earned
 */
export const getHitScore = (result: HitResult, combo: number): number => {
  const base = result === 'perfect' ? SCORE_PERFECT : result === 'good' ? SCORE_GOOD : 0
  return base * getComboMultiplier(combo)
}

/**
 * Returns the active score multiplier for the current combo streak.
 * @param combo - Current consecutive hit count
 * @returns Multiplier value (1, 2, 4, or 8)
 */
export const getComboMultiplier = (combo: number): number => {
  const index = COMBO_THRESHOLDS.reduce<number>(
    (found, threshold, i) => (combo >= threshold ? i : found),
    -1
  )
  return index === -1 ? 1 : COMBO_MULTIPLIERS[index]
}

/**
 * Calculates overall accuracy as a fraction of perfect + good hits.
 * @param perfect - Count of perfect hits
 * @param good - Count of good hits
 * @param miss - Count of misses
 * @returns Accuracy from 0 to 1
 */
export const getAccuracy = (perfect: number, good: number, miss: number): number => {
  const total = perfect + good + miss
  if (total === 0) return 1
  return (perfect + good * 0.5) / total
}

/**
 * Maps accuracy to a letter grade.
 * @param accuracy - Value from 0 to 1
 * @returns Grade letter
 */
export const getGrade = (accuracy: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
  if (accuracy >= 0.97) return 'S'
  if (accuracy >= 0.9) return 'A'
  if (accuracy >= 0.75) return 'B'
  if (accuracy >= 0.5) return 'C'
  return 'D'
}

/**
 * Returns the nearest unresolved note in a lane within the good hit window.
 * Searches backwards from currentMs to handle slightly late inputs.
 * @param notes - All notes in the song
 * @param lane - The lane that was pressed
 * @param currentMs - Current song elapsed time in ms
 * @returns Matching note index or -1
 */
export const findHittableNote = (notes: RhythmNote[], lane: number, currentMs: number): number => {
  let best = -1
  let bestDelta = Infinity
  notes.forEach((note, i) => {
    if (note.lane !== lane || note.hit !== undefined) return
    const delta = Math.abs(note.time - currentMs)
    if (delta <= HIT_WINDOW_GOOD_MS && delta < bestDelta) {
      best = i
      bestDelta = delta
    }
  })
  return best
}

/**
 * Returns indices of notes that have scrolled past the miss deadline.
 * @param notes - All notes
 * @param currentMs - Current elapsed ms
 * @returns Indices of notes to auto-miss
 */
export const findExpiredNotes = (notes: RhythmNote[], currentMs: number): number[] =>
  notes.reduce<number[]>((accumulator, note, i) => {
    if (note.hit === undefined && currentMs - note.time > HIT_WINDOW_GOOD_MS) accumulator.push(i)
    return accumulator
  }, [])

/**
 * Whether a held note was let go in time. Letting go within the good window of its end counts,
 * the same leniency a tap gets.
 * @param note - The held note
 * @param releaseMs - Song time of the release
 * @returns 'complete' for a hold carried to its end, 'broken' for one dropped early
 */
export const evaluateRelease = (note: RhythmNote, releaseMs: number): 'complete' | 'broken' =>
  releaseMs >= note.time + (note.durationMs ?? 0) - HIT_WINDOW_GOOD_MS ? 'complete' : 'broken'

/**
 * Finds the hold a lane is carrying, so letting go of the lane can settle it.
 * @param notes - All notes
 * @param lane - The lane that was released
 * @returns Index of the note held in that lane, or -1
 */
export const findHeldNoteIndex = (notes: RhythmNote[], lane: number): number =>
  notes.findIndex((note) => note.lane === lane && note.holding === true)

/**
 * Holds the player kept down all the way to their end, which finish without a release.
 * @param notes - All notes
 * @param currentMs - Current elapsed ms
 * @returns Indices of holds to complete
 */
export const findFinishedHolds = (notes: RhythmNote[], currentMs: number): number[] =>
  notes.flatMap((note, i) =>
    note.holding && currentMs >= note.time + (note.durationMs ?? 0) ? [i] : []
  )

/**
 * Turns a chart's sustained notes into taps, for a player who switched hold notes off.
 * @param notes - A chart
 * @returns The chart with every hold turned back into a tap
 */
export const stripHoldNotes = (notes: RhythmNote[]): RhythmNote[] =>
  notes.map(({ lane, midiNote, time }) => ({ lane, midiNote, time }))

/**
 * The score for completing a hold.
 * @param combo - Current combo count
 * @returns The bonus for completing a hold, with the combo multiplier applied
 */
export const getHoldBonus = (combo: number): number => SCORE_HOLD_BONUS * getComboMultiplier(combo)
