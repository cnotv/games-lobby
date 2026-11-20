import { beforeEach, describe, expect, it, vi } from 'vitest'
import { migrateLegacyPastedSongs } from './legacyPastedSongs'
import { LEGACY_PASTED_SONGS_STORAGE_KEY } from './config'

const { mockSave } = vi.hoisted(() => ({ mockSave: vi.fn() }))
vi.mock('@webgamekit/strudel-editor/helpers', () => ({ saveStrudelSavedSong: mockSave }))

describe('migrateLegacyPastedSongs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('saves each old song into the editor, oldest first, and empties the old list', () => {
    // Arrange
    localStorage.setItem(
      LEGACY_PASTED_SONGS_STORAGE_KEY,
      JSON.stringify([
        { id: 'b', label: 'Funk', code: 's("cp")' },
        { id: 'a', label: 'Psy test', code: 's("bd")' },
        { id: 'c', label: '', code: 'broken' }
      ])
    )

    // Act
    migrateLegacyPastedSongs()

    // Assert
    expect(mockSave.mock.calls).toEqual([
      ['Psy test', 's("bd")'],
      ['Funk', 's("cp")']
    ])
    expect(localStorage.getItem(LEGACY_PASTED_SONGS_STORAGE_KEY)).toBe('[]')
  })

  it('does nothing when there is nothing to move', () => {
    // Arrange
    localStorage.setItem(LEGACY_PASTED_SONGS_STORAGE_KEY, 'not json')

    // Act
    migrateLegacyPastedSongs()

    // Assert
    expect(mockSave).not.toHaveBeenCalled()
  })
})
