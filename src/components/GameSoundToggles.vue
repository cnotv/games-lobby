<script setup lang="ts">
import { Music, Volume2 } from 'lucide-vue-next'
import { LobbyUIButton } from '@/components/LobbyUI'
import { gameAudioSettings, toggleGameAudioSetting } from '@/utils/gameAudio'
</script>

<template>
  <LobbyUIButton
    variant="ghost"
    icon
    :title="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
    :aria-label="gameAudioSettings.music ? 'Turn the music off' : 'Turn the music on'"
    :aria-pressed="gameAudioSettings.music"
    @click="toggleGameAudioSetting('music')"
  >
    <Music aria-hidden="true" />
    <span v-if="!gameAudioSettings.music" class="game-sound-toggles__bar" aria-hidden="true"></span>
  </LobbyUIButton>
  <LobbyUIButton
    variant="ghost"
    icon
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
</template>

<style scoped>
/* The bar is what says "off": the icon alone cannot, since it is the same glyph either way. */
.game-sound-toggles__bar {
  position: absolute;
  width: 1.2em;
  height: 0.15em;
  border-radius: var(--lui-radius-sketch-round);
  background: currentcolor;
  transform: rotate(-45deg);
  filter: var(--lui-icon-shadow);
}
</style>
