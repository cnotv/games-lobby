export type SongNotes = { midi: ArrayBuffer; cyclesPerSecond: number }

export type SongNotesStorage = {
  read: (songCode: string) => SongNotes | null
  write: (songCode: string, notes: SongNotes) => void
}
