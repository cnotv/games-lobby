import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useHoldNotes } from './useHoldNotes'
import type { RhythmNote } from './config'

const buildHold = (): RhythmNote => ({
  lane: 2,
  midiNote: 64,
  time: 1000,
  durationMs: 1000,
  hit: 'perfect',
  holding: true
})

const setup = (currentMs: number) => {
  const notes = [buildHold()]
  const score = ref(0)
  const combo = ref(5)
  const registerHit = vi.fn()
  const emitScore = vi.fn()
  const showResult = vi.fn()
  const laneFlashes = Array.from({ length: 4 }, () => ({ alpha: 0, result: 'perfect' as const }))
  const { releaseLane } = useHoldNotes({
    getNotes: () => notes,
    readCurrentMs: () => currentMs,
    round: { score, combo, registerHit, emitScore },
    laneFlashes,
    showResult
  })
  return { notes, score, registerHit, emitScore, laneFlashes, showResult, releaseLane }
}

describe('useHoldNotes', () => {
  it('pays a bonus when the lane is let go at the end of the hold', () => {
    const { notes, score, registerHit, showResult, releaseLane } = setup(1990)

    releaseLane(2)

    expect(notes[0].holding).toBe(false)
    expect(score.value).toBeGreaterThan(0)
    expect(registerHit).not.toHaveBeenCalled()
    expect(showResult).toHaveBeenCalledWith('perfect')
  })

  it('counts a miss when the lane is let go early', () => {
    const { notes, score, registerHit, laneFlashes, showResult, releaseLane } = setup(1300)

    releaseLane(2)

    expect(notes[0].holding).toBe(false)
    expect(score.value).toBe(0)
    expect(registerHit).toHaveBeenCalledWith('miss')
    expect(laneFlashes[2].result).toBe('miss')
    expect(showResult).toHaveBeenCalledWith('miss')
  })

  it('ignores a lane that holds nothing', () => {
    const { emitScore, releaseLane } = setup(1300)

    releaseLane(0)

    expect(emitScore).not.toHaveBeenCalled()
  })
})
