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
