<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LobbyUIButton, LobbyUIFocusHint } from '@/components/LobbyUI'
import { useDialogFocusTrap } from '@/composables/useDialogFocusTrap'
import { readStorage, writeStorage } from '@/utils/storage'
import {
  ELECTRO_TUNES,
  STRUDEL_SAVED_CODE_STORAGE_KEY,
  STRUDEL_SAVED_PATTERNS_STORAGE_KEY
} from '@/views/Tools/StrudelEditor/config'
import {
  readSavedPatterns,
  toSavedPatternExamples
} from '@/views/Tools/StrudelEditor/savedPatterns'
import { writeStrudelAddress } from '@/views/Tools/StrudelEditor/strudelAddress'
import type { StrudelExample } from '@/views/Tools/StrudelEditor/types'

const props = defineProps<{
  /** The draft name and code the tab opened the editor with, if any. */
  initialName?: string
  initialCode?: string
}>()

const emit = defineEmits<{
  close: []
  add: [label: string, code: string]
  import: [label: string, code: string]
}>()

// The whole editor, with its patterns, sounds, timeline and MIDI, only loads when it is opened.
const StrudelEditor = defineAsyncComponent(
  () => import('@/views/Tools/StrudelEditor/StrudelEditor.vue')
)

// Before the editor mounts, so it opens on the draft rather than on its last saved code.
if (props.initialCode !== undefined && props.initialCode.trim().length > 0) {
  writeStorage(STRUDEL_SAVED_CODE_STORAGE_KEY, props.initialCode)
}

const route = useRoute()
const router = useRouter()
const dialogReference = ref<HTMLElement | null>(null)
const { focusedHint, inputSource } = useDialogFocusTrap(dialogReference)
const isFullscreen = ref(false)

const librarySongs = computed<StrudelExample[]>(() => [
  ...ELECTRO_TUNES,
  ...toSavedPatternExamples(readSavedPatterns(readStorage(STRUDEL_SAVED_PATTERNS_STORAGE_KEY)))
])

const importCurrentCode = (): void => {
  const code = readStorage(STRUDEL_SAVED_CODE_STORAGE_KEY)
  if (code === null || code.trim().length === 0) return
  emit('import', props.initialName ?? '', code)
}

const close = (): void => {
  // The editor writes its tab and pattern into the address; the lobby does not want them.
  void router.replace({
    query: writeStrudelAddress(route.query, { patternId: undefined, tabName: undefined })
  })
  emit('close')
}

const toggleFullscreen = (): void => {
  if (isFullscreen.value) void document.exitFullscreen()
  else void dialogReference.value?.requestFullscreen()
}

const readFullscreen = (): void => {
  isFullscreen.value = document.fullscreenElement !== null
}

onMounted(() => document.addEventListener('fullscreenchange', readFullscreen))
onUnmounted(() => document.removeEventListener('fullscreenchange', readFullscreen))
</script>

<template>
  <div
    ref="dialogReference"
    class="rgsed"
    role="dialog"
    aria-modal="true"
    aria-label="Strudel editor"
  >
    <div class="rgsed__bar">
      <h2 class="rgsed__title">Strudel editor</h2>
      <div class="rgsed__actions">
        <LobbyUIButton variant="cta" size="sm" @click="importCurrentCode">
          Import code
        </LobbyUIButton>
        <LobbyUIButton variant="ghost" size="sm" @click="toggleFullscreen">
          {{ isFullscreen ? 'Windowed' : 'Full screen' }}
        </LobbyUIButton>
        <LobbyUIButton variant="ghost" size="sm" @click="close">Close</LobbyUIButton>
      </div>
    </div>

    <div class="rgsed__main">
      <div class="rgsed__library">
        <p class="rgsed__hint">Pick a song to import it into the list.</p>
        <div v-for="song in librarySongs" :key="song.id" class="rgsed__song">
          <span class="rgsed__song-label">{{ song.label }}</span>
          <LobbyUIButton
            variant="ghost"
            size="sm"
            :aria-label="`Import ${song.label}`"
            @click="emit('add', song.label, song.code)"
          >
            Import
          </LobbyUIButton>
        </div>
      </div>
      <div class="rgsed__body">
        <StrudelEditor />
      </div>
    </div>

    <LobbyUIFocusHint :hint="focusedHint" :visible="inputSource === 'gamepad'" />
  </div>
</template>

<style scoped>
.rgsed {
  position: fixed;
  inset: var(--spacing-4);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  background: var(--color-background);
  color: var(--color-foreground);

  --strudel-editor-height: 100%;
}

.rgsed:fullscreen {
  inset: 0;
}

.rgsed__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.rgsed__title {
  margin: 0;
  font-family: var(--lui-font);
  font-size: var(--lui-text-medium);
  color: var(--lui-text-color);
  text-shadow: var(--lui-text-shadow);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.rgsed__actions {
  display: flex;
  gap: var(--spacing-2);
}

.rgsed__main {
  display: flex;
  flex: 1;
  gap: var(--spacing-3);
  min-height: 0;
}

.rgsed__library {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  width: 16rem;
  min-height: 0;
  overflow-y: auto;
}

.rgsed__hint {
  margin: 0 0 var(--spacing-1);
  color: var(--lui-text-color);
  font-family: var(--lui-font);
  font-size: var(--lui-text-tiny);
  text-shadow: var(--lui-text-shadow);
}

.rgsed__song {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-1);
}

.rgsed__song-label {
  color: var(--lui-text-color);
  font-family: var(--lui-font);
  font-size: var(--lui-text-small);
  font-weight: 700;
  text-shadow: var(--lui-text-shadow);
  text-transform: uppercase;
}

.rgsed__body {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

@media (width <= 720px) {
  .rgsed__main {
    flex-direction: column;
  }

  .rgsed__library {
    width: auto;
    max-height: 8rem;
  }
}
</style>
