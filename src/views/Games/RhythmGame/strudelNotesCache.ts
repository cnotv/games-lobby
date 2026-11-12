type SongNotes = { midi: ArrayBuffer; cyclesPerSecond: number }

/**
 * Keeps each Strudel song's notes once they are written, and writes them ahead in the
 * background, so picking a song is instant instead of waiting for the engine and its instruments.
 * @param render - Writes one song's notes from its code
 * @returns A lookup that writes a song only the first time, and a background pass over a list
 */
export const createStrudelNotesCache = (
  render: (songCode: string) => Promise<SongNotes>
): {
  notesFor: (songId: string, songCode: string) => Promise<SongNotes>
  prefetch: (songs: { id: string; code: string }[], shouldStop: () => boolean) => Promise<void>
} => {
  const written = new Map<string, Promise<SongNotes>>()

  const notesFor = (songId: string, songCode: string): Promise<SongNotes> => {
    const cached = written.get(songId)
    if (cached !== undefined) return cached
    // A failed song is forgotten, so the next pick tries it again.
    const pending = render(songCode).catch((error: unknown) => {
      written.delete(songId)
      throw error
    })
    written.set(songId, pending)
    return pending
  }

  // One song at a time, so a song the player picks waits for at most one other.
  const prefetch = (songs: { id: string; code: string }[], shouldStop: () => boolean) =>
    songs.reduce<Promise<void>>(async (previous, song) => {
      await previous
      if (shouldStop()) return
      await notesFor(song.id, song.code).catch(() => undefined)
    }, Promise.resolve())

  return { notesFor, prefetch }
}

/** The page's one cache, so notes written in the lobby are still there after a round. */
export const strudelSongNotes = createStrudelNotesCache(async (songCode) => {
  // Loaded here so the Strudel engine only downloads once the lobby asks for a song.
  const { renderStrudelCodeToNotes } = await import('@/views/Tools/StrudelEditor/strudelPlayback')
  return renderStrudelCodeToNotes(songCode)
})
