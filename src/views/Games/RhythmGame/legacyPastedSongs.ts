import { saveStrudelSavedSong } from '@webgamekit/strudel-editor/helpers'
import { readStorage, writeStorage } from '@/utils/storage'
import { LEGACY_PASTED_SONGS_STORAGE_KEY } from './config'

type LegacySong = { label: string; code: string }

const isLegacySong = (value: unknown): value is LegacySong =>
  typeof value === 'object' &&
  value !== null &&
  'label' in value &&
  'code' in value &&
  typeof value.label === 'string' &&
  value.label.trim().length > 0 &&
  typeof value.code === 'string' &&
  value.code.trim().length > 0

const parseLegacySongs = (storedText: string | null): LegacySong[] => {
  try {
    const parsed: unknown = storedText === null ? null : JSON.parse(storedText)
    return Array.isArray(parsed) ? parsed.filter(isLegacySong) : []
  } catch {
    return []
  }
}

/**
 * Moves the songs pasted with the old Songs tab into the Strudel editor's saved songs, once, so
 * they stay in the dropdown. The old list is emptied so a song deleted in the editor stays gone.
 */
export const migrateLegacyPastedSongs = (): void => {
  const legacySongs = parseLegacySongs(readStorage(LEGACY_PASTED_SONGS_STORAGE_KEY))
  if (legacySongs.length === 0) return
  // The old list is newest first, and a save goes to the top, so the oldest is saved first.
  legacySongs.toReversed().forEach((song) => saveStrudelSavedSong(song.label, song.code))
  writeStorage(LEGACY_PASTED_SONGS_STORAGE_KEY, '[]')
}
