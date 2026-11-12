<script setup lang="ts">
import { Music, Volume2 } from 'lucide-vue-next'
import { LobbyUIButton } from '@/components/LobbyUI'
import { gameAudioSettings, toggleGameAudioSetting } from '@/utils/gameAudio'
</script>

<template>
  <div class="game-sound-toggles">
    <LobbyUIButton
      variant="ghost"
      size="sm"
      :title="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
      :aria-label="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
      :aria-pressed="gameAudioSettings.music"
      @click="toggleGameAudioSetting('music')"
    >
      <Music aria-hidden="true" />
      <span
        v-if="!gameAudioSettings.music"
        class="game-sound-toggles__bar"
        aria-hidden="true"
      ></span>
    </LobbyUIButton>
    <LobbyUIButton
      variant="ghost"
      size="sm"
      :title="gameAudioSettings.effects ? 'Turn the sounds off' : 'Turn the sounds on'"
      :aria-label="gameAudioSettings.effects ? 'Turn the sounds off' : 'Turn the sounds on'"
      :aria-pressed="gameAudioSettings.effects"
      @click="toggleGameAudioSetting('effects')"
    >
      <Volume2 aria-hidden="true" />
      <span
        v-if="!gameAudioSettings.effects"
        class="game-sound-toggles__bar"
        aria-hidden="true"
      ></span>
    </LobbyUIButton>
  </div>
</template>

<style scoped>
.game-sound-toggles {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* The bar is what says "off": the icon alone cannot, since it is the same glyph either way. */
.game-sound-toggles__bar {
  position: absolute;
  width: 2em;
  height: 0.15em;
  border-radius: var(--lui-radius-sketch-round);
  background: currentcolor;
  transform: rotate(-45deg);
  filter: drop-shadow(2px 2px 0 #000);
}
</style>
