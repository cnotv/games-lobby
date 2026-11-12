// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { Midi } from '@tonejs/midi'
import { buildStrudelSong } from './strudelSong'
import { DIFFICULTY_TEMPO } from './config'

const DRUM_CHANNEL = 9

const buildMidi = (): ArrayBuffer => {
  const midi = new Midi()
  const drums = midi.addTrack()
  drums.channel = DRUM_CHANNEL
  Array.from({ length: 12 }, (_, index) =>
    drums.addNote({ midi: 36, time: index * 0.5, duration: 0.1 })
  )
  const bass = midi.addTrack()
  bass.addNote({ midi: 40, time: 0, duration: 1 })
  const lead = midi.addTrack()
  Array.from({ length: 6 }, (_, index) =>
    lead.addNote({ midi: 60 + index, time: index * 1, duration: 0.5 })
  )
  const bytes = midi.toArray()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

describe('buildStrudelSong', () => {
  it('charts the pitched track with the most notes, never the drums', () => {
    const { chart } = buildStrudelSong(buildMidi(), 'hard')
    expect(chart.map((note) => note.midiNote)).toEqual([60, 61, 62, 63, 64, 65])
  })

  it('plays every pitched track behind the chart and leaves the drums out', () => {
    const { background } = buildStrudelSong(buildMidi(), 'hard')
    expect(background).toHaveLength(7)
  })

  it.each(['easy', 'medium', 'hard'] as const)('slows the %s chart by its tempo', (difficulty) => {
    const { chart } = buildStrudelSong(buildMidi(), difficulty)
    expect(chart[1].time).toBe(Math.round(1000 / DIFFICULTY_TEMPO[difficulty]))
  })

  it('refuses a song with no pitched notes', () => {
    const midi = new Midi()
    const drums = midi.addTrack()
    drums.channel = DRUM_CHANNEL
    drums.addNote({ midi: 36, time: 0, duration: 0.1 })
    const bytes = midi.toArray()
    expect(() =>
      buildStrudelSong(
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        'hard'
      )
    ).toThrow('no pitched notes')
  })
})
