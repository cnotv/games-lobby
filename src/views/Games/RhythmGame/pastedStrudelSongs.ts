import type { StrudelExample } from '@/views/Tools/StrudelEditor/types'
import { GAME_INSTRUMENTS } from './config'
import type { RgInstrument } from './config'

const INSTRUMENT_FLAG_PATTERN = /\/\/\s*instrument\s*:\s*([^\s,;]+)/i
const SURROUNDING_QUOTES_PATTERN = /^["']|["']$/g

/**
 * The instrument a Strudel song asks to be charted with, written as `// instrument: bass`.
 * @param code - The song as written
 * @returns The instrument name in lowercase, or null when the song names none
 */
export const parseStrudelInstrumentFlag = (code: string): string | null => {
  const match = INSTRUMENT_FLAG_PATTERN.exec(code)
  const instrument = match?.[1]?.replaceAll(SURROUNDING_QUOTES_PATTERN, '').trim().toLowerCase()
  return instrument ? instrument : null
}

/**
 * The game sound a song's instrument flag names, if any. An exact name wins; otherwise the
 * first instrument the name contains, so `fuzzbass` plays as bass.
 * @param name - The flag from `parseStrudelInstrumentFlag`
 * @returns The game instrument, or null when the name is only a sample or synth
 */
export const findGameInstrumentName = (name: string | null): RgInstrument | null => {
  if (name === null) return null
  const normalizedName = name.trim().toLowerCase()
  const exactMatch = GAME_INSTRUMENTS.find((instrument) => instrument === normalizedName)
  if (exactMatch !== undefined) return exactMatch
  return GAME_INSTRUMENTS.find((instrument) => normalizedName.includes(instrument)) ?? null
}

type NamedTrack = { index: number; name: string }

const normalizeTrackName = (name: string): string => name.trim().toLowerCase()

/**
 * The track a song's instrument flag names. An exact name wins; otherwise the first track whose
 * name contains it, so `guitar` finds `gm_overdriven_guitar`.
 * @param tracks - The song's pitched tracks, busiest first
 * @param instrument - The flag from `parseStrudelInstrumentFlag`
 * @returns The track's index, or null when none matches
 */
export const findStrudelTrackIndex = (
  tracks: NamedTrack[],
  instrument: string | null
): number | null => {
  if (instrument === null) return null
  const wanted = normalizeTrackName(instrument)
  const exactMatch = tracks.find((track) => normalizeTrackName(track.name) === wanted)
  if (exactMatch !== undefined) return exactMatch.index
  const partialMatch = tracks.find((track) => normalizeTrackName(track.name).includes(wanted))
  return partialMatch?.index ?? null
}

const isPastedSong = (value: unknown): value is StrudelExample =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'label' in value &&
  'code' in value &&
  typeof value.id === 'string' &&
  value.id.trim().length > 0 &&
  typeof value.label === 'string' &&
  value.label.trim().length > 0 &&
  typeof value.code === 'string' &&
  value.code.trim().length > 0

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * The pasted songs in local storage, which anyone with the browser's devtools can have edited,
 * so whatever is not a list of complete songs is dropped rather than trusted.
 * @param storedText - the stored JSON, or null when nothing is stored
 * @returns the valid pasted songs, newest first
 */
export const readPastedSongs = (storedText: string | null): StrudelExample[] => {
  const parsed = storedText === null ? null : parseJson(storedText)
  return Array.isArray(parsed) ? parsed.filter(isPastedSong) : []
}

/**
 * Puts a pasted song first, replacing a song with the same id.
 * @param songs - The pasted songs so far
 * @param song - The song to add
 * @returns The updated songs, newest first
 */
export const addPastedSong = (songs: StrudelExample[], song: StrudelExample): StrudelExample[] => [
  song,
  ...songs.filter((existingSong) => existingSong.id !== song.id)
]

/**
 * Removes the pasted song with an id.
 * @param songs - The pasted songs so far
 * @param songId - The id of the song to remove
 * @returns The remaining songs
 */
export const removePastedSong = (songs: StrudelExample[], songId: string): StrudelExample[] =>
  songs.filter((song) => song.id !== songId)
