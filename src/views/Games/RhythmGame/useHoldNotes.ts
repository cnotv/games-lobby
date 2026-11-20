import type { RhythmNote } from './config'
import type { useRoundScore } from './useRoundScore'
import { evaluateRelease, findHeldNoteIndex, getHoldBonus } from './rhythmGameUtilities'

type LaneFlash = { alpha: number; result: 'perfect' | 'good' | 'miss' }

type HoldDeps = {
  /** A getter, because the chart is only loaded after the game is created. */
  getNotes: () => RhythmNote[]
  readCurrentMs: () => number
  round: Pick<ReturnType<typeof useRoundScore>, 'score' | 'combo' | 'registerHit' | 'emitScore'>
  laneFlashes: LaneFlash[]
}

/**
 * Settles the long presses of a round: a hold carried to its end pays a bonus, one dropped early
 * is a miss.
 * @param deps - The round's chart and score
 * @returns `finishHold` for a hold that ended by itself and `releaseLane` for a lane let go
 */
export const useHoldNotes = (deps: HoldDeps) => {
  const finishHold = (index: number, outcome: 'complete' | 'broken'): void => {
    const note = deps.getNotes()[index]
    note.holding = false
    const isComplete = outcome === 'complete'
    if (isComplete) deps.round.score.value += getHoldBonus(deps.round.combo.value)
    else deps.round.registerHit('miss')
    deps.laneFlashes[note.lane] = { alpha: 0.6, result: isComplete ? 'perfect' : 'miss' }
    deps.round.emitScore()
  }

  const releaseLane = (lane: number): void => {
    const notes = deps.getNotes()
    const index = findHeldNoteIndex(notes, lane)
    if (index === -1) return
    finishHold(index, evaluateRelease(notes[index], deps.readCurrentMs()))
  }

  return { finishHold, releaseLane }
}
