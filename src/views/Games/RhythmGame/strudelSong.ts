import { Midi } from '@tonejs/midi'
import { midiNoteToFreq, type MidiTrackInfo, type ScheduledNote } from '@webgamekit/audio'
import type { RgDifficulty, RhythmNote } from './config'
import { parseMidiTrack } from './parseMidi'

/**
 * The tracks of a Strudel song a player can chase: the pitched ones, busiest first. The drums are
 * left out, since they have no melody to follow.
 * @param midiBuffer - The song as a MIDI file
 * @returns Each track's index in the file, name and note count
 */
export const listStrudelTracks = (midiBuffer: ArrayBuffer): MidiTrackInfo[] =>
  new Midi(midiBuffer).tracks
    .map((track, index) => ({ index, name: track.name, noteCount: track.notes.length, track }))
    .filter(({ track, noteCount }) => noteCount > 0 && !track.instrument.percussion)
    .map(({ index, name, noteCount }) => ({ index, name, noteCount }))
    .sort((left, right) => right.noteCount - left.noteCount)

/**
 * The falling notes of one track of a Strudel song. The whole song plays from its rendered
 * recording, so only the picked track becomes the chart.
 * @param midiBuffer - The song as a MIDI file
 * @param trackIndex - The track to chart, from `listStrudelTracks`
 * @param difficulty - Sets how dense the chart is
 * @returns The chart, at the song's own tempo
 */
export const buildStrudelChart = (
  midiBuffer: ArrayBuffer,
  trackIndex: number,
  difficulty: RgDifficulty
): RhythmNote[] => parseMidiTrack(midiBuffer, trackIndex, difficulty)

const MILLISECONDS_PER_SECOND = 1000
const BACKGROUND_VOLUME = 0.1

/**
 * Every pitched track of a Strudel song as notes to play behind the chart, for a song whose
 * recording could not be rendered in time. The drums are left out.
 * @param midiBuffer - The song as a MIDI file
 * @returns The notes, in the order they play
 */
export const buildStrudelBackground = (midiBuffer: ArrayBuffer): ScheduledNote[] =>
  new Midi(midiBuffer).tracks
    .filter((track) => !track.instrument.percussion)
    .flatMap((track) =>
      track.notes.map((note) => ({
        time: note.time * MILLISECONDS_PER_SECOND,
        freq: midiNoteToFreq(note.midi),
        duration: note.duration * MILLISECONDS_PER_SECOND,
        volume: BACKGROUND_VOLUME
      }))
    )
    .sort((left, right) => left.time - right.time)
