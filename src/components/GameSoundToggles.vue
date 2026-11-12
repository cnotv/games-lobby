<script setup lang="ts">
import { Music, Volume2 } from 'lucide-vue-next'
import { LobbyUIIconButton } from '@/components/LobbyUI'
import { gameAudioSettings, toggleGameAudioSetting } from '@/utils/gameAudio'
</script>

<template>
  <div class="game-sound-toggles">
    <LobbyUIIconButton
      size="md"
      :title="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
      :aria-label="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
      :aria-pressed="gameAudioSettings.music"
      @click="toggleGameAudioSetting('music')"
    >
      <Music class="game-sound-toggles__icon" aria-hidden="true" />
      <span
        v-if="!gameAudioSettings.music"
        class="game-sound-toggles__bar"
        aria-hidden="true"
      ></span>
    </LobbyUIIconButton>
    <LobbyUIIconButton
      size="md"
      :title="gameAudioSettings.effects ? 'Turn the sounds off' : 'Turn the sounds on'"
      :aria-label="gameAudioSettings.effects ? 'Turn the sounds off' : 'Turn the sounds on'"
      :aria-pressed="gameAudioSettings.effects"
      @click="toggleGameAudioSetting('effects')"
    >
      <Volume2 class="game-sound-toggles__icon" aria-hidden="true" />
      <span
        v-if="!gameAudioSettings.effects"
        class="game-sound-toggles__bar"
        aria-hidden="true"
      ></span>
    </LobbyUIIconButton>
  </div>
</template>

<style scoped>
.game-sound-toggles {
  display: flex;
  gap: var(--spacing-2);
}

.game-sound-toggles__icon {
  width: 1.5em;
  height: 1.5em;
}

/* The bar is what says "off": the icon alone cannot, since it is the same glyph either way. */
.game-sound-toggles__bar {
  position: absolute;
  width: 2em;
  height: 0.15em;
  border-radius: var(--lui-radius-sketch-round);
  background: currentcolor;
  transform: rotate(-45deg);
}
</style>
