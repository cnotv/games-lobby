<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { LobbyUIFocusHint, LobbyUIIconButton } from '@/components/LobbyUI'
import { useDialogFocusTrap } from '@/composables/useDialogFocusTrap'
import { writeStrudelAddress } from '@webgamekit/strudel-editor/helpers'

const emit = defineEmits<{
  close: []
}>()

// The whole editor, with its patterns, sounds, timeline and MIDI, only loads when it is opened.
const StrudelEditor = defineAsyncComponent(() =>
  import('@webgamekit/strudel-editor').then((module) => module.StrudelEditor)
)

const SONGS_PANEL_TAB = 'import'

const route = useRoute()
const router = useRouter()
const dialogReference = ref<HTMLElement | null>(null)
const { focusedHint, inputSource } = useDialogFocusTrap(dialogReference)

// The Songs list sits in the editor's side panel, so it opens with the editor.
void router.replace({ query: writeStrudelAddress(route.query, { tabName: SONGS_PANEL_TAB }) })

const close = (): void => {
  // The editor writes its tab and pattern into the address; the lobby does not want them.
  void router.replace({
    query: writeStrudelAddress(route.query, { patternId: undefined, tabName: undefined })
  })
  emit('close')
}
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
        <LobbyUIIconButton title="Close the editor" @click="close">
          <X class="rgsed__icon" aria-hidden="true" />
        </LobbyUIIconButton>
      </div>

      <div class="rgsed__body">
        <StrudelEditor />
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
</style>
