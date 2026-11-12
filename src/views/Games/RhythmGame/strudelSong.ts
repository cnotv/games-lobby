import { Midi } from '@tonejs/midi'
import type { MidiTrackInfo } from '@webgamekit/audio'
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
