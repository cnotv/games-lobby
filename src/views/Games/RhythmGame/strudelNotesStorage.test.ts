import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStoredNotes, storeNotes } from './strudelNotesStorage'

const notesOf = (bytes: number[]) => ({
  midi: new Uint8Array(bytes).buffer,
  cyclesPerSecond: 0.5
})

describe('strudelNotesStorage', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('gives back the notes stored for the same code', () => {
    // Arrange
    storeNotes('s("bd")', notesOf([0, 1, 254, 255]))

    // Act
    const stored = readStoredNotes('s("bd")')

    // Assert
    expect(stored?.cyclesPerSecond).toBe(0.5)
    expect([...new Uint8Array(stored?.midi ?? new ArrayBuffer(0))]).toEqual([0, 1, 254, 255])
  })

  it('keeps each song apart, so an edited song is not played from its old notes', () => {
    // Arrange
    storeNotes('s("bd")', notesOf([1]))

    // Act
    const edited = readStoredNotes('s("bd sd")')

    // Assert
    expect(edited).toBeNull()
  })

  it.each([
    ['nothing was stored', null],
    ['the stored text is not JSON', 'not json'],
    ['the stored notes are the wrong shape', JSON.stringify({ midi: 3 })]
  ])('reads nothing when %s', (_description, raw) => {
    // Arrange
    storeNotes('code', notesOf([1]))
    const key = Object.keys(localStorage)[0]
    localStorage.clear()
    if (raw !== null) localStorage.setItem(key, raw)

    // Act
    const stored = readStoredNotes('code')

    // Assert
    expect(stored).toBeNull()
  })

  it('carries on when the browser refuses to store', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })

    // Act
    const store = () => storeNotes('code', notesOf([1]))

    // Assert
    expect(store).not.toThrow()
    expect(readStoredNotes('code')).toBeNull()
  })
})
