import { Midi } from '@tonejs/midi'
import { midiNoteToFreq, type ScheduledNote } from '@webgamekit/audio'
import { DIFFICULTY_TEMPO, type RgDifficulty, type RhythmNote } from './config'
import { parseMidiTrack } from './parseMidi'
import { slowChartNotes, slowScheduledNotes } from './tempo'

const MILLISECONDS_PER_SECOND = 1000
const BACKGROUND_VOLUME = 0.1

type Track = Midi['tracks'][number]

/**
 * Turns a Strudel song's MIDI export into a chart and the music that plays behind it: the pitched
 * track with the most notes becomes the chart, every pitched track plays behind it, and the
 * drums, which have no melody to chase, are left out. The difficulty sets how dense the chart is
 * and how slowly the whole song plays.
 * @param midiBuffer - The song as a MIDI file
 * @param difficulty - The difficulty the song is played at
 * @returns The chart and the notes to schedule behind it, both at the difficulty's tempo
 * @throws {Error} when the song has no pitched notes
 */
export const buildStrudelSong = (
  midiBuffer: ArrayBuffer,
  difficulty: RgDifficulty
): { chart: RhythmNote[]; background: ScheduledNote[] } => {
  const midi = new Midi(midiBuffer)
  const pitchedTracks = midi.tracks.filter(
    (track: Track) => track.notes.length > 0 && !track.instrument.percussion
  )
  const melody = pitchedTracks.reduce<Track | null>(
    (best, track) => (best === null || track.notes.length > best.notes.length ? track : best),
    null
  )
  if (melody === null) throw new Error('This song has no pitched notes to play')
  const tempoRate = DIFFICULTY_TEMPO[difficulty]
  const background = pitchedTracks.flatMap((track) =>
    track.notes.map(
      (note): ScheduledNote => ({
        time: note.time * MILLISECONDS_PER_SECOND,
        freq: midiNoteToFreq(note.midi),
        duration: note.duration * MILLISECONDS_PER_SECOND,
        volume: BACKGROUND_VOLUME
      })
    )
  )
  return {
    chart: slowChartNotes(
      parseMidiTrack(midiBuffer, midi.tracks.indexOf(melody), difficulty),
      tempoRate
    ),
    background: slowScheduledNotes(
      [...background].sort((left, right) => left.time - right.time),
      tempoRate
    )
  }
}
