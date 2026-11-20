// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { Midi } from '@tonejs/midi'
import {
  listStrudelTracks,
  buildStrudelChart,
  buildLiveSongCode,
  songMsFromPosition
} from './strudelSong'

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

describe('buildLiveSongCode', () => {
  it.each([
    [0.5, 1, 'setcps(0.5)'],
    [0.5, 0.75, 'setcps(0.375)'],
    [1, 0.85, 'setcps(0.85)']
  ])(
    'plays a song written at %f cycles a second at %f of its speed with %s first',
    (cyclesPerSecond, tempoRate, firstLine) => {
      const code = buildLiveSongCode('setcps(1)\ns("bd sd")', cyclesPerSecond, tempoRate)

      expect(code.split('\n')[0]).toBe(firstLine)
    }
  )

  it('keeps a song written as one bare pattern ending with that pattern, which is what plays', () => {
    const code = buildLiveSongCode('note("48 52").sound("piano")', 0.5, 1)

    expect(code.trim().split('\n').at(-1)).toBe('note("48 52").sound("piano")')
  })

  it("stops the song's own tempo from winning over the round's", () => {
    const code = buildLiveSongCode('setcpm(100/4)\nsetcps(0.4)\n$: s("bd")', 0.5, 1)

    expect(code).not.toMatch(/setcp[ms]\((100|0\.4)/)
    expect(code).toContain('void(100/4)')
    expect(code).toContain('void(0.4)')
  })
})

describe('songMsFromPosition', () => {
  it.each([
    [0, 0.5, 0],
    [1, 0.5, 2000],
    [3, 0.375, 8000]
  ])(
    'reads cycle %f at %f cycles a second as %f ms into the song',
    (cycle, cyclesPerSecond, ms) => {
      expect(songMsFromPosition({ cycle, cyclesPerSecond })).toBeCloseTo(ms)
    }
  )
})
