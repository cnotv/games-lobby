<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { LobbyUIButton, LobbyUIRow, LobbyUIWizard } from '@/components/LobbyUI'
import '@/assets/styles/lobby-ui.scss'
import RhythmGameSummary from './RhythmGameSummary.vue'
import type { LobbyConfigField, LobbyPlayer } from '@/types/lobbyWizard'
import { MATCHMAKER_ROOM, CONTROLS_CONFIG, DIFFICULTIES, DIFFICULTY_TEMPO, SONGS } from './config'
import { useRhythmGameStore, type RgPlayer } from '@/stores/rhythmGame'
import {
  midiStorageList,
  midiStorageLoad,
  midiStorageSave,
  midiStorageDelete,
  type MidiLibraryEntry
} from './midiStorage'
import { getMidiTracks, parseMidiTrack, parseAllMidiNotes } from './parseMidi'
import { buildLiveSongCode, buildStrudelChart, listStrudelTracks } from './strudelSong'
import { strudelSongNotes } from './strudelNotesCache'
import RhythmGameSongEditorDialog from './RhythmGameSongEditorDialog.vue'
import {
  findGameInstrumentName,
  findStrudelTrackIndex,
  parseStrudelInstrumentFlag
} from './strudelInstruments'
import { readStrudelSavedSongs, STRUDEL_SONGS } from '@webgamekit/strudel-editor/helpers'
import { migrateLegacyPastedSongs } from './legacyPastedSongs'
import type { StrudelExample } from '@webgamekit/strudel-editor/helpers'
import type { MidiTrackInfo, ScheduledNote } from '@webgamekit/audio'
import type { RgDifficulty, RgInstrument, RgSong, RhythmNote } from './config'

const props = defineProps<{
  playerName: string
  playerColor: string
  isHost: boolean
  playerList: LobbyPlayer[]
  rgPlayerList: RgPlayer[]
  roomId: string
  song: RgSong
  difficulty: RgDifficulty
  holdNotes: boolean
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
  midiParsed: [
    gameNotes: RhythmNote[],
    backgroundNotes: ScheduledNote[],
    songName: string,
    strudelCode?: string | null,
    tempoRate?: number
  ]
  songPicked: [song: RgSong]
  instrumentPicked: [instrument: RgInstrument]
  'update:difficulty': [difficulty: RgDifficulty]
  'update:holdNotes': [holdNotes: boolean]
}>()

const store = useRhythmGameStore()
const fileInput = ref<HTMLInputElement | null>(null)
const library = ref<MidiLibraryEntry[]>([])
const selectedMidiId = ref<string | null>(null)
const selectedTrackIndex = ref(0)
const STRUDEL_SONG_PREFIX = 'strudel:'
// The songs saved in the Strudel editor come first, then the songs it ships with.
migrateLegacyPastedSongs()
const savedSongs = ref<StrudelExample[]>(readStrudelSavedSongs())
const strudelSongs = computed(() => [...savedSongs.value, ...STRUDEL_SONGS])
const editorOpen = ref(false)
const selectedStrudelId = ref<string | null>(null)
const strudelSong = ref<{
  code: string
  cyclesPerSecond: number
  midi: ArrayBuffer
  tracks: MidiTrackInfo[]
} | null>(null)
// The song is not playable until it is rendered, so the round cannot start before. Only the
// song picked last counts: an earlier pick still rendering is ignored when it finishes.
const renderingStrudelId = ref<string | null>(null)

const loadLibrary = async (): Promise<void> => {
  library.value = await midiStorageList()
}

const lobbyClosed = { value: false }
const ACTIVATION_EVENTS = ['pointerdown', 'keydown'] as const

// Writing each Strudel song's notes ahead makes a pick instant, and stops when the lobby closes so
// it never competes with a round's song for the engine. It waits for the player's first click or
// key: the engine cannot start audio before one, and would wait for it with every pick queued
// behind.
const writeSongsAhead = (): void => {
  ACTIVATION_EVENTS.forEach((name) => window.removeEventListener(name, writeSongsAhead))
  void strudelSongNotes.prefetch(strudelSongs.value, () => lobbyClosed.value)
}

// The lobby is rebuilt when a round ends or is left, so the song picked before is picked again.
const restorePickedSong = async (): Promise<void> => {
  const pickedValue = store.customSongValue
  if (pickedValue === null) return
  const isStillThere = songField.value.options?.some((option) => option.value === pickedValue)
  if (isStillThere) await pickSong(pickedValue)
  else fallBackToDefaultSong()
}

onMounted(async () => {
  await loadLibrary()
  if (lobbyClosed.value) return
  void restorePickedSong()
  if (navigator.userActivation?.hasBeenActive) writeSongsAhead()
  else ACTIVATION_EVENTS.forEach((name) => window.addEventListener(name, writeSongsAhead))
})
onUnmounted(() => {
  lobbyClosed.value = true
  ACTIVATION_EVENTS.forEach((name) => window.removeEventListener(name, writeSongsAhead))
})

const selectedEntry = computed(() => library.value.find((e) => e.id === selectedMidiId.value))
const availableTracks = computed(
  () => strudelSong.value?.tracks ?? selectedEntry.value?.tracks ?? []
)

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

const holdNotesField = computed(
  (): LobbyConfigField => ({
    type: 'select',
    key: 'holdNotes',
    label: 'Hold notes',
    value: props.holdNotes ? 'on' : 'off',
    options: [
      { value: 'on', label: 'On' },
      { value: 'off', label: 'Off' }
    ]
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
  holdNotesField.value,
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
  if (song === undefined || strudelSong.value === null) return
  const { code, cyclesPerSecond, midi } = strudelSong.value
  const tempoRate = DIFFICULTY_TEMPO[difficulty]
  emit(
    'midiParsed',
    buildStrudelChart(midi, selectedTrackIndex.value, difficulty),
    [],
    song.label,
    buildLiveSongCode(code, cyclesPerSecond, tempoRate),
    tempoRate
  )
}

const pickStrudelSong = async (strudelId: string): Promise<void> => {
  const song = strudelSongs.value.find((candidate) => candidate.id === strudelId)
  if (song === undefined) return
  selectedMidiId.value = null
  selectedStrudelId.value = strudelId
  store.customSongValue = `${STRUDEL_SONG_PREFIX}${strudelId}`
  strudelSong.value = null
  renderingStrudelId.value = strudelId
  const isStillPicked = (): boolean => selectedStrudelId.value === strudelId
  try {
    const { midi, cyclesPerSecond } = await strudelSongNotes.notesFor(song.id, song.code)
    if (!isStillPicked()) return
    const tracks = listStrudelTracks(midi)
    if (tracks.length === 0) throw new Error('This song has no pitched notes to play')
    const instrumentFlag = parseStrudelInstrumentFlag(song.code)
    strudelSong.value = { code: song.code, cyclesPerSecond, midi, tracks }
    selectedTrackIndex.value = findStrudelTrackIndex(tracks, instrumentFlag) ?? tracks[0].index
    const gameInstrument = findGameInstrumentName(instrumentFlag)
    if (gameInstrument !== null) emit('instrumentPicked', gameInstrument)
    emitStrudelSong(props.difficulty)
  } catch {
    if (!isStillPicked()) return
    fallBackToDefaultSong()
  } finally {
    if (renderingStrudelId.value === strudelId) renderingStrudelId.value = null
  }
}

const pickSong = async (songValue: string): Promise<void> => {
  if (songValue.startsWith(STRUDEL_SONG_PREFIX)) {
    await pickStrudelSong(songValue.slice(STRUDEL_SONG_PREFIX.length))
    return
  }
  selectedStrudelId.value = null
  renderingStrudelId.value = null
  strudelSong.value = null
  const builtInSong = SONGS.find((song) => song.id === songValue)
  if (builtInSong !== undefined) {
    selectedMidiId.value = null
    store.customSongValue = null
    emit('songPicked', builtInSong.id)
    return
  }
  selectedMidiId.value = songValue
  store.customSongValue = songValue
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
  if (selectedStrudelId.value !== null) {
    selectedTrackIndex.value = trackIndex
    emitStrudelSong(props.difficulty)
    return
  }
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
  if (key === 'holdNotes') emit('update:holdNotes', value === 'on')
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
  renderingStrudelId.value = null
  strudelSong.value = null
  selectedMidiId.value = id
  store.customSongValue = id
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
  store.customSongValue = null
  selectedTrackIndex.value = 0
  emit('songPicked', SONGS[0].id)
  await loadLibrary()
}

const fallBackToDefaultSong = (): void => {
  selectedStrudelId.value = null
  renderingStrudelId.value = null
  strudelSong.value = null
  store.customSongValue = null
  selectedTrackIndex.value = 0
  emit('songPicked', SONGS[0].id)
}

// The editor can save, change or delete songs, so the list is read again when it closes, and a
// picked song whose code changed is written again rather than played from the old notes.
const refreshSavedSongs = (): void => {
  const previousSongs = savedSongs.value
  savedSongs.value = readStrudelSavedSongs()
  const changedSongIds = previousSongs
    .filter(
      (previousSong) =>
        savedSongs.value.find((song) => song.id === previousSong.id)?.code !== previousSong.code
    )
    .map((song) => song.id)
  changedSongIds.forEach((songId) => strudelSongNotes.forgetSong(songId))
  const pickedId = selectedStrudelId.value
  if (pickedId === null || !changedSongIds.includes(pickedId)) return
  if (strudelSongs.value.some((song) => song.id === pickedId)) {
    void pickSong(`${STRUDEL_SONG_PREFIX}${pickedId}`)
  } else {
    fallBackToDefaultSong()
  }
}

const closeEditor = (): void => {
  editorOpen.value = false
  refreshSavedSongs()
}
</script>

<template>
  <RhythmGameSongEditorDialog v-if="editorOpen" @close="closeEditor" />

  <LobbyUIWizard
    :player-name="playerName"
    :player-color="playerColor"
    :is-host="isHost"
    :player-list="playerList"
    :room-id="roomId"
    :matchmaker-room="MATCHMAKER_ROOM"
    :config-fields="configFields"
    :controls="CONTROLS_CONFIG"
    :action-tab-label="isHost ? 'Songs' : undefined"
    :show-results="showResults"
    :can-start="renderingStrudelId === null"
    @update:player-name="emit('update:playerName', $event)"
    @update:player-color="emit('update:playerColor', $event)"
    @name-change="emit('nameChange')"
    @config-change="handleConfig"
    @start-game="emit('startGame')"
    @match-found="emit('matchFound', $event)"
    @leave-room="emit('leaveRoom')"
    @play-again="emit('playAgain')"
    @action-tab="editorOpen = true"
    @instrument-picked="emit('instrumentPicked', $event)"
  >
    <template #profile-extra>
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
