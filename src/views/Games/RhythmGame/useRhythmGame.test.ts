import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { midiNoteToFreq } from '@webgamekit/audio'
import { buildSongNotes } from './useRhythmGame'
import type { GameDeps } from './useRhythmGame'

const chart = [
  { lane: 0 as const, midiNote: 60, time: 1000 },
  { lane: 1 as const, midiNote: 64, time: 2000 }
]

const makeDeps = (overrides: Partial<GameDeps> = {}): GameDeps => ({
  canvas: ref(null),
  song: 'custom',
  difficulty: 'hard',
  holdNotes: true,
  instrument: 'bass',
  startAt: 0,
  customNotes: chart,
  onScoreUpdate: () => undefined,
  onSongEnd: () => undefined,
  ...overrides
})

describe('buildSongNotes', () => {
  it('plays the chart through the picked instrument for a live Strudel song', () => {
    // Arrange
    const deps = makeDeps({ customStrudelCode: 's("bd")' })

    // Act
    const song = buildSongNotes(chart, deps, 1)

    // Assert
    expect(song.scheduled).toHaveLength(chart.length)
    expect(song.scheduled.map((note) => note.time)).toEqual([1000, 2000])
  })

  it('keeps the backing beside the played notes', () => {
    // Arrange
    const deps = makeDeps({ backgroundNotes: [{ time: 500, freq: 110, duration: 100 }] })

    // Act
    const song = buildSongNotes(chart, deps, 1)

    // Assert
    expect(song.scheduled).toHaveLength(chart.length + 1)
  })

  it('slows the chart and the notes to the round tempo', () => {
    // Arrange
    const deps = makeDeps()

    // Act
    const song = buildSongNotes(chart, deps, 0.5)

    // Assert
    expect(song.chart.map((note) => note.time)).toEqual([2000, 4000])
    expect(song.scheduled.map((note) => note.time)).toEqual([2000, 4000])
  })

  it('keeps a live Strudel song in tune by slowing its notes without dropping their pitch', () => {
    // Arrange
    const deps = makeDeps({ customStrudelCode: 's("bd")' })

    // Act
    const song = buildSongNotes(chart, deps, 0.5)

    // Assert
    expect(song.scheduled.map((note) => note.time)).toEqual([2000, 4000])
    expect(song.scheduled.map((note) => note.freq)).toEqual([
      midiNoteToFreq(60) * 0.5,
      midiNoteToFreq(64) * 0.5
    ])
  })

  it("drops a recorded song's notes in pitch as a slow record would", () => {
    // Arrange
    const deps = makeDeps()

    // Act
    const song = buildSongNotes(chart, deps, 0.5)

    // Assert
    expect(song.scheduled.map((note) => note.freq)).toEqual([
      midiNoteToFreq(60) * 0.5 * 0.5,
      midiNoteToFreq(64) * 0.5 * 0.5
    ])
  })
})
