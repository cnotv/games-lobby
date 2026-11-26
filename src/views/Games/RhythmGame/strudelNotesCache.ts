import { readStoredNotes, storeNotes } from './strudelNotesStorage'
import type { SongNotes, SongNotesStorage } from './types'

/**
 * Keeps each Strudel song's notes once they are written, and writes them ahead in the
 * background, so picking a song is instant instead of waiting for the engine and its instruments.
 * Notes written once are also stored, so a later visit does not start the engine for them at all.
 * @param render - Writes one song's notes from its code
 * @param storage - Where written notes are kept between visits
 * @returns A lookup that writes a song only the first time, and a background pass over a list
 */
export const createStrudelNotesCache = (
  render: (songCode: string) => Promise<SongNotes>,
  storage: SongNotesStorage
): {
  notesFor: (songId: string, songCode: string) => Promise<SongNotes>
  forgetSong: (songId: string) => void
  prefetch: (songs: { id: string; code: string }[], shouldStop: () => boolean) => Promise<void>
} => {
  const written = new Map<string, Promise<SongNotes>>()

  const notesFor = (songId: string, songCode: string): Promise<SongNotes> => {
    const cached = written.get(songId)
    if (cached !== undefined) return cached
    const stored = storage.read(songCode)
    // A failed song is forgotten, so the next pick tries it again.
    const pending =
      stored !== null
        ? Promise.resolve(stored)
        : render(songCode)
            .then((notes) => {
              storage.write(songCode, notes)
              return notes
            })
            .catch((error: unknown) => {
              written.delete(songId)
              throw error
            })
    written.set(songId, pending)
    return pending
  }

  /**
   * Drops a song's written notes, so editing its code re-renders it instead of playing the old one.
   * @param songId - The song whose notes to forget
   */
  const forgetSong = (songId: string): void => {
    written.delete(songId)
  }

  // One song at a time, so a song the player picks waits for at most one other.
  const prefetch = (songs: { id: string; code: string }[], shouldStop: () => boolean) =>
    songs.reduce<Promise<void>>(async (previous, song) => {
      await previous
      if (shouldStop()) return
      await notesFor(song.id, song.code).catch(() => undefined)
    }, Promise.resolve())

  return { notesFor, forgetSong, prefetch }
}

/** The page's one cache, so notes written in the lobby are still there after a round. */
export const strudelSongNotes = createStrudelNotesCache(
  async (songCode) => {
    // Loaded here so the Strudel engine only downloads once the lobby asks for a song.
    const { renderStrudelCodeToNotes } = await import('@webgamekit/strudel-editor/helpers')
    return renderStrudelCodeToNotes(songCode)
  },
  { read: readStoredNotes, write: storeNotes }
)
