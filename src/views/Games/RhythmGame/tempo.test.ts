import { describe, expect, it } from 'vitest'
import { DIFFICULTY_TEMPO } from './config'
import { slowChartNotes, slowScheduledNotes } from './tempo'

describe('DIFFICULTY_TEMPO', () => {
  it('plays easy slower than medium and medium slower than hard, which is full speed', () => {
    expect(DIFFICULTY_TEMPO.easy).toBeLessThan(DIFFICULTY_TEMPO.medium)
    expect(DIFFICULTY_TEMPO.medium).toBeLessThan(DIFFICULTY_TEMPO.hard)
    expect(DIFFICULTY_TEMPO.hard).toBe(1)
  })
})

describe('slowChartNotes', () => {
  it('stretches every note time by the inverse of the rate and keeps lane and pitch', () => {
    const slowed = slowChartNotes([{ lane: 2, midiNote: 60, time: 1000 }], 0.5)
    expect(slowed).toEqual([{ lane: 2, midiNote: 60, time: 2000 }])
  })

  it('leaves a full speed chart as it was', () => {
    const chart = [{ lane: 0 as const, midiNote: 64, time: 333 }]
    expect(slowChartNotes(chart, 1)).toEqual(chart)
  })
})

describe('slowScheduledNotes', () => {
  it('stretches time and length and lowers the pitch, like a record played slow', () => {
    const [slowed] = slowScheduledNotes(
      [{ time: 1000, duration: 100, freq: 440, volume: 0.2 }],
      0.5
    )
    expect(slowed).toEqual({ time: 2000, duration: 200, freq: 220, volume: 0.2 })
  })
})
