import { ref } from 'vue'
import type { Ref } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'
import type { StrudelExample } from '@/views/Tools/StrudelEditor/types'
import { PASTED_STRUDEL_SONGS_STORAGE_KEY } from './config'
import {
  addPastedSong,
  readPastedSongs,
  removePastedSong,
  updatePastedSong
} from './pastedStrudelSongs'
import { strudelSongNotes } from './strudelNotesCache'

type PastedStrudelSongsState = {
  /** The songs pasted on this machine, newest first. */
  pastedSongs: Ref<StrudelExample[]>
  /** Saves code under a name, or a numbered one when the name is blank. */
  addSong: (label: string, code: string) => StrudelExample
  /** Replaces a song's name and code, keeping its id. */
  updateSong: (song: StrudelExample) => void
  removeSong: (songId: string) => void
}

/**
 * The Strudel songs a player pasted in the lobby, kept in local storage across visits.
 * @returns the songs and the actions that change them
 */
export const usePastedStrudelSongs = (): PastedStrudelSongsState => {
  const pastedSongs = ref<StrudelExample[]>(
    readPastedSongs(readStorage(PASTED_STRUDEL_SONGS_STORAGE_KEY))
  )

  const storeSongs = (nextSongs: StrudelExample[]): void => {
    pastedSongs.value = nextSongs
    writeStorage(PASTED_STRUDEL_SONGS_STORAGE_KEY, JSON.stringify(nextSongs))
  }

  const updateSong = (song: StrudelExample): void => {
    const nextSongs = updatePastedSong(pastedSongs.value, song)
    if (nextSongs === pastedSongs.value) return
    storeSongs(nextSongs)
    strudelSongNotes.forgetSong(song.id)
  }

  const addSong = (label: string, code: string): StrudelExample => {
    const trimmedLabel = label.trim()
    const song = {
      id: `pasted-${Date.now()}-${pastedSongs.value.length}`,
      label: trimmedLabel.length > 0 ? trimmedLabel : `Pasted song ${pastedSongs.value.length + 1}`,
      code
    }
    storeSongs(addPastedSong(pastedSongs.value, song))
    return song
  }

  return {
    pastedSongs,
    addSong,
    updateSong,
    removeSong: (songId: string) => storeSongs(removePastedSong(pastedSongs.value, songId))
  }
}
