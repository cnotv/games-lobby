<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Maximize2, Minimize2, Save, X } from 'lucide-vue-next'
import { LobbyUIFocusHint, LobbyUIIconButton } from '@/components/LobbyUI'
import { useDialogFocusTrap } from '@/composables/useDialogFocusTrap'
import { writeStrudelAddress } from '@webgamekit/strudel-editor/helpers'

const props = defineProps<{
  /** The draft name and code the tab opened the editor with, if any. */
  initialName?: string
  initialCode?: string
}>()

const emit = defineEmits<{
  close: []
  add: [label: string, code: string]
}>()

// The whole editor, with its patterns, sounds, timeline and MIDI, only loads when it is opened.
const StrudelEditor = defineAsyncComponent(() =>
  import('@webgamekit/strudel-editor').then((module) => module.StrudelEditor)
)

// The editor reports the code on screen, its own starting song included, so Save straight after
// opening still has something to add.
const editorCode = ref(props.initialCode?.trim() ? props.initialCode : undefined)

const route = useRoute()
const router = useRouter()
const dialogReference = ref<HTMLElement | null>(null)
const { focusedHint, inputSource } = useDialogFocusTrap(dialogReference)
const isFullscreen = ref(false)

const saveCurrentCode = (): void => {
  const code = editorCode.value
  if (code === undefined || code.trim().length === 0) return
  emit('add', props.initialName ?? '', code)
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
  <Teleport to="body">
    <div
      ref="dialogReference"
      class="rgsed"
      role="dialog"
      aria-modal="true"
      aria-label="Strudel editor"
    >
      <div class="rgsed__bar">
        <LobbyUIIconButton variant="primary" title="Save the song" @click="saveCurrentCode">
          <Save class="rgsed__icon" aria-hidden="true" />
        </LobbyUIIconButton>
        <LobbyUIIconButton
          class="rgsed__fullscreen-toggle"
          :title="isFullscreen ? 'Exit full screen' : 'Full screen'"
          @click="toggleFullscreen"
        >
          <Minimize2 v-if="isFullscreen" class="rgsed__icon" aria-hidden="true" />
          <Maximize2 v-else class="rgsed__icon" aria-hidden="true" />
        </LobbyUIIconButton>
        <LobbyUIIconButton title="Close the editor" @click="close">
          <X class="rgsed__icon" aria-hidden="true" />
        </LobbyUIIconButton>
      </div>

      <div class="rgsed__body">
        <StrudelEditor v-model:code="editorCode" />
      </div>

      <LobbyUIFocusHint :hint="focusedHint" :visible="inputSource === 'gamepad'" />
    </div>
  </Teleport>
</template>

<style scoped>
.rgsed {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  padding: var(--spacing-4);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  background: var(--color-background);
  color: var(--color-foreground);

  --strudel-editor-height: 100%;
}

.rgsed__bar {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.rgsed__icon {
  width: 1.2em;
  height: 1.2em;
  filter: var(--lui-icon-shadow);
}

.rgsed__body {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

/* Phones have no reliable Fullscreen API and no room to spare, so the dialog is the screen. */
@media (width <= 720px) {
  .rgsed {
    padding: var(--spacing-2);
  }

  .rgsed__fullscreen-toggle {
    display: none;
  }
}
</style>
