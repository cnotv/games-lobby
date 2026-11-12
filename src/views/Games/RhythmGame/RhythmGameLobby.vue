<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { LobbyUIButton, LobbyUIRow, LobbyUIWizard } from '@/components/LobbyUI'
import '@/assets/styles/lobby-ui.scss'
import RhythmGameSummary from './RhythmGameSummary.vue'
import type { LobbyConfigField, LobbyPlayer } from '@/types/lobbyWizard'
import { MATCHMAKER_ROOM, CONTROLS_CONFIG, DIFFICULTIES, SONGS } from './config'
import type { RgPlayer } from '@/stores/rhythmGame'
import {
  midiStorageList,
  midiStorageLoad,
  midiStorageSave,
  midiStorageDelete,
  type MidiLibraryEntry
} from './midiStorage'
import { getMidiTracks, parseMidiTrack, parseAllMidiNotes } from './parseMidi'
import { buildStrudelSong } from './strudelSong'
import type { StrudelExample } from '@/views/Tools/StrudelEditor/types'
import type { ScheduledNote } from '@webgamekit/audio'
import type { RgDifficulty, RgSong, RhythmNote } from './config'

const props = defineProps<{
  playerName: string
  playerColor: string
  isHost: boolean
  playerList: LobbyPlayer[]
  rgPlayerList: RgPlayer[]
  roomId: string
  song: RgSong
  difficulty: RgDifficulty
  showResults?: boolean
  winnerId?: string | null
  localPeerId?: string
}>()

const emit = defineEmits<{
  'update:playerName': [value: string]
  'update:playerColor': [value: string]
  nameChange: []
  startGame: []
  matchFound: [roomId: string]
  leaveRoom: []
  playAgain: []
  midiParsed: [gameNotes: RhythmNote[], backgroundNotes: ScheduledNote[], songName: string]
  songPicked: [song: RgSong]
  'update:difficulty': [difficulty: RgDifficulty]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const library = ref<MidiLibraryEntry[]>([])
const selectedMidiId = ref<string | null>(null)
const selectedTrackIndex = ref(0)
const STRUDEL_SONG_PREFIX = 'strudel:'
const strudelSongs = ref<StrudelExample[]>([])
const selectedStrudelId = ref<string | null>(null)
const strudelMidi = ref<{ id: string; buffer: ArrayBuffer } | null>(null)
const strudelMessage = ref('')

const loadLibrary = async (): Promise<void> => {
  library.value = await midiStorageList()
}

// The song list is large, so it loads with the lobby rather than with the game.
const loadStrudelSongs = async (): Promise<void> => {
  const { ELECTRO_TUNES } = await import('@/views/Tools/StrudelEditor/config')
  strudelSongs.value = ELECTRO_TUNES
}

onMounted(() => Promise.all([loadLibrary(), loadStrudelSongs()]))

const selectedEntry = computed(() => library.value.find((e) => e.id === selectedMidiId.value))
const availableTracks = computed(() => selectedEntry.value?.tracks ?? [])

const songField = computed(
  (): LobbyConfigField => ({
    type: 'select',
    key: 'song',
    label: 'Song',
    value:
      selectedStrudelId.value === null
        ? (selectedMidiId.value ?? props.song)
        : `${STRUDEL_SONG_PREFIX}${selectedStrudelId.value}`,
    options: [
      ...SONGS.map((song) => ({ value: song.id, label: `${song.label} (${song.bpm} BPM)` })),
      ...strudelSongs.value.map((song) => ({
        value: `${STRUDEL_SONG_PREFIX}${song.id}`,
        label: song.label
      })),
      ...library.value.map((entry) => ({ value: entry.id, label: entry.name }))
    ]
  })
)

const difficultyField = computed(
  (): LobbyConfigField => ({
    type: 'select',
    key: 'difficulty',
    label: 'Difficulty',
    value: props.difficulty,
    options: DIFFICULTIES.map(({ id, label }) => ({ value: id, label }))
  })
)

const trackField = computed(
  (): LobbyConfigField => ({
    type: 'select',
    key: 'track',
    label: 'Channel',
    value: selectedTrackIndex.value,
    options: availableTracks.value.map((track) => ({
      value: track.index,
      label: `${track.name} (${track.noteCount}n)`
    }))
  })
)

// An uploaded song is always played whole, so only a built-in or Strudel song has a difficulty.
const configFields = computed((): LobbyConfigField[] => [
  songField.value,
  ...(selectedMidiId.value === null ? [difficultyField.value] : []),
  ...(availableTracks.value.length > 1 ? [trackField.value] : [])
])

const loadAndEmit = async (midiId: string, trackIndex: number, songName: string): Promise<void> => {
  const buf = await midiStorageLoad(midiId)
  if (!buf) return
  const gameNotes = parseMidiTrack(buf, trackIndex, 'hard')
  const backgroundNotes = parseAllMidiNotes(buf)
  emit('midiParsed', gameNotes, backgroundNotes, songName)
}

const resolveTrackLabel = (midiId: string, trackIndex: number): string => {
  const entry = library.value.find((e) => e.id === midiId)
  const trackInfo = entry?.tracks.find((t) => t.index === trackIndex)
  if (!entry) return ''
  return entry.tracks.length > 1
    ? `${entry.name} — ${trackInfo?.name ?? `Track ${trackIndex + 1}`}`
    : entry.name
}

const emitStrudelSong = (difficulty: RgDifficulty): void => {
  const song = strudelSongs.value.find((candidate) => candidate.id === selectedStrudelId.value)
  if (song === undefined || strudelMidi.value === null) return
  const { chart, background } = buildStrudelSong(strudelMidi.value.buffer, difficulty)
  emit('midiParsed', chart, background, song.label)
}

const pickStrudelSong = async (strudelId: string): Promise<void> => {
  const song = strudelSongs.value.find((candidate) => candidate.id === strudelId)
  if (song === undefined) return
  selectedMidiId.value = null
  selectedStrudelId.value = strudelId
  strudelMessage.value = `Rendering ${song.label}...`
  try {
    // Loaded here so the whole Strudel engine only downloads for a player who picks one of its songs.
    const { renderStrudelCodeToMidi } = await import('@/views/Tools/StrudelEditor/strudelPlayback')
    strudelMidi.value = { id: strudelId, buffer: await renderStrudelCodeToMidi(song.code) }
    emitStrudelSong(props.difficulty)
    strudelMessage.value = ''
  } catch (error) {
    selectedStrudelId.value = null
    strudelMessage.value =
      error instanceof Error ? error.message : 'The song could not be rendered.'
  }
}

const pickSong = async (songValue: string): Promise<void> => {
  if (songValue.startsWith(STRUDEL_SONG_PREFIX)) {
    await pickStrudelSong(songValue.slice(STRUDEL_SONG_PREFIX.length))
    return
  }
  selectedStrudelId.value = null
  strudelMessage.value = ''
  const builtInSong = SONGS.find((song) => song.id === songValue)
  if (builtInSong !== undefined) {
    selectedMidiId.value = null
    emit('songPicked', builtInSong.id)
    return
  }
  selectedMidiId.value = songValue
  const firstTrack = library.value.find((e) => e.id === songValue)?.tracks[0]
  if (!firstTrack) return
  selectedTrackIndex.value = firstTrack.index
  await loadAndEmit(songValue, firstTrack.index, resolveTrackLabel(songValue, firstTrack.index))
}

const pickDifficulty = (difficultyValue: string): void => {
  const pickedDifficulty = DIFFICULTIES.find((difficulty) => difficulty.id === difficultyValue)
  if (pickedDifficulty === undefined) return
  emit('update:difficulty', pickedDifficulty.id)
  if (selectedStrudelId.value !== null) emitStrudelSong(pickedDifficulty.id)
}

const pickTrack = async (trackIndex: number): Promise<void> => {
  if (!selectedMidiId.value) return
  selectedTrackIndex.value = trackIndex
  await loadAndEmit(
    selectedMidiId.value,
    trackIndex,
    resolveTrackLabel(selectedMidiId.value, trackIndex)
  )
}

const handleConfig = async (key: string, value: string | number): Promise<void> => {
  if (key === 'song') await pickSong(String(value))
  if (key === 'difficulty') pickDifficulty(String(value))
  if (key === 'track') await pickTrack(Number(value))
}

const handleFileChange = async (event: Event): Promise<void> => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (fileInput.value) fileInput.value.value = ''
  const name = file.name.replace(/\.midi?$/i, '')
  const buf = await file.arrayBuffer()
  const tracks = getMidiTracks(buf)
  const id = await midiStorageSave(name, buf, tracks)
  await loadLibrary()
  const firstTrack = tracks[0]
  if (!firstTrack) return
  selectedStrudelId.value = null
  selectedMidiId.value = id
  selectedTrackIndex.value = firstTrack.index
  const trackLabel = tracks.length > 1 ? `${name} — ${firstTrack.name}` : name
  const gameNotes = parseMidiTrack(buf, firstTrack.index, 'hard')
  const backgroundNotes = parseAllMidiNotes(buf)
  emit('midiParsed', gameNotes, backgroundNotes, trackLabel)
}

const handleDelete = async (): Promise<void> => {
  if (!selectedMidiId.value) return
  await midiStorageDelete(selectedMidiId.value)
  selectedMidiId.value = null
  selectedTrackIndex.value = 0
  emit('songPicked', SONGS[0].id)
  await loadLibrary()
}
</script>

<template>
  <LobbyUIWizard
    :player-name="playerName"
    :player-color="playerColor"
    :is-host="isHost"
    :player-list="playerList"
    :room-id="roomId"
    :matchmaker-room="MATCHMAKER_ROOM"
    :config-fields="configFields"
    :controls="CONTROLS_CONFIG"
    :show-results="showResults"
    :can-start="true"
    @update:player-name="emit('update:playerName', $event)"
    @update:player-color="emit('update:playerColor', $event)"
    @name-change="emit('nameChange')"
    @config-change="handleConfig"
    @start-game="emit('startGame')"
    @match-found="emit('matchFound', $event)"
    @leave-room="emit('leaveRoom')"
    @play-again="emit('playAgain')"
  >
    <template #profile-extra>
      <LobbyUIRow v-if="strudelMessage" label="Strudel" inline>{{ strudelMessage }}</LobbyUIRow>
      <LobbyUIRow v-if="isHost" label="Your MIDI" inline>
        <LobbyUIButton variant="ghost" size="sm" @click="fileInput?.click()">Upload</LobbyUIButton>
        <LobbyUIButton v-if="selectedMidiId" variant="ghost" size="sm" @click="handleDelete">
          Remove
        </LobbyUIButton>
        <input
          ref="fileInput"
          type="file"
          accept=".mid,.midi"
          class="rgl-file-input"
          @change="handleFileChange"
        />
      </LobbyUIRow>
    </template>

    <template #summary>
      <RhythmGameSummary
        :player-list="rgPlayerList"
        :winner-id="winnerId ?? null"
        :local-peer-id="localPeerId ?? ''"
        :is-host="isHost"
        results-only
      />
    </template>
  </LobbyUIWizard>
</template>

<style scoped>
.rgl-file-input {
  display: none;
}
</style>
