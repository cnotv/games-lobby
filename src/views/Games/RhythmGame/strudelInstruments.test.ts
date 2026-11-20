import { describe, expect, it } from 'vitest'
import {
  findGameInstrumentName,
  findStrudelTrackIndex,
  parseStrudelInstrumentFlag
} from './strudelInstruments'

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
