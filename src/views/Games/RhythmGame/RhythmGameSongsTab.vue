<script setup lang="ts">
import { computed, ref } from 'vue'
import { LobbyUIButton, LobbyUINameInput, LobbyUIRow } from '@/components/LobbyUI'
import RhythmGameSongEditorDialog from './RhythmGameSongEditorDialog.vue'
import type { StrudelExample } from '@webgamekit/strudel-editor/helpers'
import { parseStrudelInstrumentFlag } from './pastedStrudelSongs'

const props = defineProps<{
  songs: StrudelExample[]
}>()

const emit = defineEmits<{
  add: [label: string, code: string]
  edit: [song: StrudelExample]
  remove: [songId: string]
}>()

const draftName = ref('')
const draftCode = ref('')
const editingId = ref<string | null>(null)
const editorOpen = ref(false)

const songRows = computed(() =>
  props.songs.map((song) => ({
    ...song,
    instrument: parseStrudelInstrumentFlag(song.code)
  }))
)

const startEdit = (song: StrudelExample): void => {
  editingId.value = song.id
  draftName.value = song.label
  draftCode.value = song.code
}

const cancelEdit = (): void => {
  editingId.value = null
  draftName.value = ''
  draftCode.value = ''
}

const addSong = (): void => {
  const code = draftCode.value.trim()
  if (code.length === 0) return
  if (editingId.value !== null) {
    const song = props.songs.find((candidate) => candidate.id === editingId.value)
    if (song !== undefined) {
      emit('edit', { ...song, label: draftName.value, code })
    }
    cancelEdit()
    return
  }
  emit('add', draftName.value, code)
  draftName.value = ''
  draftCode.value = ''
}

const openEditor = (): void => {
  editorOpen.value = true
}

const closeEditor = (): void => {
  editorOpen.value = false
}

const handleEditorAdd = (label: string, code: string): void => {
  emit('add', label, code)
  editorOpen.value = false
}
</script>

<template>
  <div class="rgs">
    <p class="rgs__hint">
      Paste a Strudel pattern. A <code>// instrument: bass</code> comment charts that instrument,
      and names piano, bass or guitar also set the hit sound. Without one, the busiest instrument
      charts.
    </p>

    <LobbyUIRow label="Name" inline>
      <LobbyUINameInput v-model="draftName" placeholder="Name (optional)" :maxlength="40" />
    </LobbyUIRow>

    <textarea
      v-model="draftCode"
      class="rgs__code"
      rows="8"
      aria-label="Strudel song code"
      placeholder='// instrument: bass
$: note("c2 eb2 g2").s("bass")'
      spellcheck="false"
    />

    <div class="rgs__actions">
      <LobbyUIButton v-if="editingId !== null" variant="ghost" size="sm" @click="cancelEdit">
        Cancel
      </LobbyUIButton>
      <LobbyUIButton variant="ghost" size="sm" @click="openEditor"> Editor </LobbyUIButton>
      <LobbyUIButton
        variant="cta"
        size="sm"
        :disabled="draftCode.trim().length === 0"
        @click="addSong"
      >
        {{ editingId !== null ? 'Update song' : 'Add song' }}
      </LobbyUIButton>
    </div>

    <p v-if="songRows.length === 0" class="rgs__empty">No songs pasted yet.</p>
    <template v-else>
      <LobbyUIRow v-for="song in songRows" :key="song.id" inline>
        <template #label>
          <button
            type="button"
            class="rgs__name"
            :aria-label="`Edit ${song.label}`"
            @click="startEdit(song)"
          >
            {{ song.label }}
          </button>
        </template>
        <span class="rgs__instrument">Instrument: {{ song.instrument ?? 'auto' }}</span>
        <LobbyUIButton
          variant="ghost"
          size="sm"
          :aria-label="`Remove ${song.label}`"
          @click="emit('remove', song.id)"
        >
          Remove
        </LobbyUIButton>
      </LobbyUIRow>
    </template>

    <RhythmGameSongEditorDialog
      v-if="editorOpen"
      :initial-name="draftName"
      :initial-code="draftCode"
      @close="closeEditor"
      @add="handleEditorAdd"
    />
  </div>
</template>

<style scoped>
.rgs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.rgs__hint,
.rgs__empty {
  margin: 0;
  color: var(--lui-text-color);
  font-family: var(--lui-font);
  font-size: var(--lui-text-tiny);
  text-shadow: var(--lui-text-shadow);
}

.rgs__hint code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--lui-text-micro);
}

.rgs__code {
  width: 100%;
  min-height: 8rem;
  padding: var(--spacing-2);
  border: 3px solid var(--lui-stroke-faint);
  border-radius: var(--lui-radius-sketch);
  background: rgb(0 0 0 / 0.3);
  color: var(--lui-text-color);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--lui-text-tiny);
  line-height: 1.4;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
}

.rgs__code::placeholder {
  color: var(--lui-text-color);
  opacity: 0.5;
}

.rgs__code:focus,
.rgs__code:focus-visible {
  border-color: var(--lui-focus-color);
}

.rgs__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.rgs__instrument {
  color: var(--lui-text-color);
  font-family: var(--lui-font);
  font-size: var(--lui-text-small);
  text-shadow: var(--lui-text-shadow);
  text-transform: uppercase;
}

.rgs__name {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  color: var(--lui-text-color);
  cursor: pointer;
  font-family: var(--lui-font);
  font-size: var(--lui-text-small);
  font-weight: 900;
  letter-spacing: 0.05em;
  text-align: left;
  text-shadow: var(--lui-text-shadow);
  text-transform: uppercase;
}

.rgs__name:hover,
.rgs__name:focus-visible {
  text-decoration: underline;
  outline: none;
}
</style>
