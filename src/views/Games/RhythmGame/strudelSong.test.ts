// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { Midi } from '@tonejs/midi'
import { listStrudelTracks, buildStrudelChart, buildStrudelBackground } from './strudelSong'

const DRUM_CHANNEL = 9

const buildMidi = (): ArrayBuffer => {
  const midi = new Midi()
  const drums = midi.addTrack()
  drums.channel = DRUM_CHANNEL
  Array.from({ length: 12 }, (_, index) =>
    drums.addNote({ midi: 36, time: index * 0.5, duration: 0.1 })
  )
  const bass = midi.addTrack()
  bass.name = 'bass'
  bass.addNote({ midi: 40, time: 0, duration: 1 })
  const lead = midi.addTrack()
  lead.name = 'lead'
  Array.from({ length: 6 }, (_, index) =>
    lead.addNote({ midi: 60 + index, time: index, duration: 0.5 })
  )
  const bytes = midi.toArray()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

describe('listStrudelTracks', () => {
  it('lists the pitched tracks, the busiest first, and never the drums', () => {
    const tracks = listStrudelTracks(buildMidi())
    expect(tracks.map((track) => [track.name, track.noteCount])).toEqual([
      ['lead', 6],
      ['bass', 1]
    ])
  })

  it('lists nothing for a song with only drums', () => {
    const midi = new Midi()
    const drums = midi.addTrack()
    drums.channel = DRUM_CHANNEL
    drums.addNote({ midi: 36, time: 0, duration: 0.1 })
    const bytes = midi.toArray()
    expect(
      listStrudelTracks(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
    ).toEqual([])
  })
})

describe('buildStrudelChart', () => {
  it('charts only the track that was picked, at its own tempo', () => {
    const buffer = buildMidi()
    const [lead, bass] = listStrudelTracks(buffer)

    expect(buildStrudelChart(buffer, lead.index, 'hard').map((note) => note.midiNote)).toEqual([
      60, 61, 62, 63, 64, 65
    ])
    expect(buildStrudelChart(buffer, bass.index, 'hard')).toHaveLength(1)
  })
})

describe('buildStrudelBackground', () => {
  it('plays every pitched track behind the chart, in time order, and leaves the drums out', () => {
    const background = buildStrudelBackground(buildMidi())

    expect(background).toHaveLength(7)
    expect(background.map((note) => note.time)).toEqual(
      [...background.map((note) => note.time)].sort((a, b) => a - b)
    )
  })
})
