import { describe, expect, it } from 'vitest'
import {
  addPastedSong,
  findGameInstrumentName,
  findStrudelTrackIndex,
  parseStrudelInstrumentFlag,
  readPastedSongs,
  removePastedSong,
  updatePastedSong
} from './pastedStrudelSongs'

describe('parseStrudelInstrumentFlag', () => {
  it.each([
    ['// instrument: bass', 'bass'],
    ['// Instrument: Piano', 'piano'],
    ['//instrument:sawtooth', 'sawtooth'],
    ['// instrument: "gm_overdriven_guitar"', 'gm_overdriven_guitar'],
    ['// intro\n// instrument: lead\ns("bd")', 'lead'],
    ['// instrument: harp, drums: bd', 'harp'],
    ['no instrument comment', null],
    ['// instrument:', null],
    ['// instrument:   ', null]
  ])('reads %s as %s', (code, expectedInstrument) => {
    // Arrange
    const patternCode = code

    // Act
    const instrument = parseStrudelInstrumentFlag(patternCode)

    // Assert
    expect(instrument).toBe(expectedInstrument)
  })
})

describe('findGameInstrumentName', () => {
  it.each([
    ['piano', 'piano'],
    ['bass', 'bass'],
    ['Piano', 'piano'],
    ['fuzzbass', 'bass'],
    ['gm_overdriven_guitar', 'guitar'],
    ['sawtooth', null],
    [null, null]
  ])('reads %s as the game instrument %s', (name, expected) => {
    // Arrange
    const instrumentName = name

    // Act
    const gameInstrument = findGameInstrumentName(instrumentName)

    // Assert
    expect(gameInstrument).toBe(expected)
  })
})

describe('findStrudelTrackIndex', () => {
  const tracks = [
    { index: 2, name: 'lead' },
    { index: 5, name: 'bass' },
    { index: 7, name: 'gm_overdriven_guitar' }
  ]

  it.each([
    ['bass', 5],
    ['BASS', 5],
    ['guitar', 7],
    ['lead ', 2],
    ['drums', null],
    [null, null]
  ])('finds the track for %s at index %s', (instrument, expectedIndex) => {
    // Arrange
    const instrumentFlag = instrument

    // Act
    const trackIndex = findStrudelTrackIndex(tracks, instrumentFlag)

    // Assert
    expect(trackIndex).toBe(expectedIndex)
  })
})

describe('readPastedSongs', () => {
  it.each([
    ['nothing stored', null, []],
    ['text that is not JSON', 'not json', []],
    ['JSON that is not a list', '{"id":"a","label":"A","code":"s(\\"bd\\")"}', []],
    [
      'a malformed entry among good ones',
      '[{"id":"a","label":"A","code":"s(\\"bd\\")"},{"id":"","label":"B","code":"x"},{"id":"c","label":"","code":"y"},{"id":"d","label":"D","code":3}]',
      [{ id: 'a', label: 'A', code: 's("bd")' }]
    ]
  ])('reads %s safely', (_case, storedText, expectedSongs) => {
    // Arrange
    const stored = storedText

    // Act
    const songs = readPastedSongs(stored)

    // Assert
    expect(songs).toEqual(expectedSongs)
  })
})

describe('addPastedSong', () => {
  it('adds the new song at the top', () => {
    // Arrange
    const songs = [{ id: 'old', label: 'Old', code: 's("bd")' }]
    const newSong = { id: 'new', label: 'New', code: 's("hh")' }

    // Act
    const nextSongs = addPastedSong(songs, newSong)

    // Assert
    expect(nextSongs).toEqual([newSong, ...songs])
  })

  it('replaces a song with the same id instead of listing it twice', () => {
    // Arrange
    const songs = [{ id: 'same', label: 'Old', code: 's("bd")' }]
    const replacement = { id: 'same', label: 'New', code: 's("hh")' }

    // Act
    const nextSongs = addPastedSong(songs, replacement)

    // Assert
    expect(nextSongs).toEqual([replacement])
  })
})

describe('removePastedSong', () => {
  it('removes only the song with the id', () => {
    // Arrange
    const songs = [
      { id: 'a', label: 'A', code: 's("bd")' },
      { id: 'b', label: 'B', code: 's("hh")' }
    ]

    // Act
    const nextSongs = removePastedSong(songs, 'a')

    // Assert
    expect(nextSongs).toEqual([songs[1]])
  })
})

describe('updatePastedSong', () => {
  it('replaces the name and code of the song with the id, keeping its position', () => {
    // Arrange
    const songs = [
      { id: 'a', label: 'A', code: 's("bd")' },
      { id: 'b', label: 'B', code: 's("hh")' }
    ]
    const updated = { id: 'b', label: 'Bass', code: 's("bass")' }

    // Act
    const nextSongs = updatePastedSong(songs, updated)

    // Assert
    expect(nextSongs).toEqual([songs[0], updated])
  })

  it('keeps the old name when the new one is blank', () => {
    // Arrange
    const songs = [{ id: 'a', label: 'A', code: 's("bd")' }]
    const updated = { id: 'a', label: '   ', code: 's("hh")' }

    // Act
    const nextSongs = updatePastedSong(songs, updated)

    // Assert
    expect(nextSongs).toEqual([{ id: 'a', label: 'A', code: 's("hh")' }])
  })

  it('returns the same list when the id is absent', () => {
    // Arrange
    const songs = [{ id: 'a', label: 'A', code: 's("bd")' }]
    const updated = { id: 'missing', label: 'X', code: 's("hh")' }

    // Act
    const nextSongs = updatePastedSong(songs, updated)

    // Assert
    expect(nextSongs).toBe(songs)
  })
})
