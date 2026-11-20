import { describe, it, expect } from 'vitest'
import { Midi } from '@tonejs/midi'
import { parseMidiTrack } from './parseMidi'
import { HOLD_MIN_MS } from './config'

const buildMidi = (notes: { midi: number; time: number; duration: number }[]): ArrayBuffer => {
  const midi = new Midi()
  const track = midi.addTrack()
  notes.forEach((note) => track.addNote(note))
  return midi.toArray().buffer as ArrayBuffer
}

describe('parseMidiTrack hold notes', () => {
  it('keeps the length of a sustained note and leaves a short one a tap', () => {
    // Arrange
    const buffer = buildMidi([
      { midi: 60, time: 0, duration: 0.1 },
      { midi: 72, time: 1, duration: 1.5 }
    ])

    // Act
    const [tap, hold] = parseMidiTrack(buffer, 0, 'hard')

    // Assert
    expect(tap.durationMs).toBeUndefined()
    expect(hold.durationMs).toBeGreaterThanOrEqual(HOLD_MIN_MS)
  })

  it('drops a note that starts while an earlier hold is still going on easy', () => {
    const buffer = buildMidi([
      { midi: 60, time: 0, duration: 2 },
      { midi: 72, time: 1, duration: 0.1 },
      { midi: 62, time: 3, duration: 0.1 }
    ])

    const notes = parseMidiTrack(buffer, 0, 'easy')

    expect(notes.map((note) => note.time)).toEqual([0, 3000])
  })
})
