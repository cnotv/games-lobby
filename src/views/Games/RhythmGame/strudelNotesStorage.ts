import type { SongNotes } from './types'

const STORAGE_KEY_PREFIX = 'rhythm-strudel-notes:'
const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193
const HEX_RADIX = 16
const BYTES_PER_CHUNK = 0x8000

// The song's own code is the key, so an edited song finds nothing and is written again. A short
// hash keeps the key small; the code's length goes with it so a clash needs both to match.
const keyFor = (songCode: string): string => {
  const hash = [...songCode].reduce(
    (running, character) => Math.imul(running ^ character.charCodeAt(0), FNV_PRIME) >>> 0,
    FNV_OFFSET_BASIS
  )
  return `${STORAGE_KEY_PREFIX}${hash.toString(HEX_RADIX)}:${songCode.length}`
}

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  const chunks = Array.from({ length: Math.ceil(bytes.length / BYTES_PER_CHUNK) }, (_, index) =>
    String.fromCharCode(...bytes.subarray(index * BYTES_PER_CHUNK, (index + 1) * BYTES_PER_CHUNK))
  )
  return btoa(chunks.join(''))
}

const fromBase64 = (text: string): ArrayBuffer =>
  Uint8Array.from(atob(text), (character) => character.charCodeAt(0)).buffer

const isStoredNotes = (value: unknown): value is { midi: string; cyclesPerSecond: number } =>
  typeof value === 'object' &&
  value !== null &&
  'midi' in value &&
  typeof value.midi === 'string' &&
  'cyclesPerSecond' in value &&
  typeof value.cyclesPerSecond === 'number'

/**
 * Reads a song's notes written on an earlier visit, so picking it needs no Strudel engine.
 * @param songCode - The song as written
 * @returns The notes, or null when none were stored or what is stored cannot be read
 */
export const readStoredNotes = (songCode: string): SongNotes | null => {
  try {
    const raw = localStorage.getItem(keyFor(songCode))
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isStoredNotes(parsed)) return null
    return { midi: fromBase64(parsed.midi), cyclesPerSecond: parsed.cyclesPerSecond }
  } catch {
    return null
  }
}

/**
 * Keeps a song's notes for the next visit. A browser that refuses, say because storage is full,
 * only costs the next visit a write, so it is not an error.
 * @param songCode - The song as written
 * @param notes - The notes written from it
 */
export const storeNotes = (songCode: string, notes: SongNotes): void => {
  try {
    localStorage.setItem(
      keyFor(songCode),
      JSON.stringify({ midi: toBase64(notes.midi), cyclesPerSecond: notes.cyclesPerSecond })
    )
  } catch {
    return
  }
}
