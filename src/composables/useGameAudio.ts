import { onBeforeUnmount, onMounted, watch } from 'vue'
import { playGameSound, startGameMusic, stopGameMusic } from '@/utils/gameAudio'
import type { GameAudioId } from '@/types/gameAudio'

/**
 * Plays a game's music while its view is open, plays an effect when the game enters a phase
 * that has one, and hands back the game's effects for everything else.
 * @param game - The game
 * @param readPhase - Reads the game's current phase
 * @param phaseEffects - The effect to play on entering each phase, by phase name
 * @returns A function that plays one of the game's effects by name
 */
export const useGameAudio = (
  game: GameAudioId,
  readPhase?: () => string,
  phaseEffects: Record<string, string> = {}
): { play: (effectName: string) => void } => {
  const play = (effectName: string): void => playGameSound(game, effectName)
  onMounted(() => startGameMusic(game))
  onBeforeUnmount(stopGameMusic)
  if (readPhase !== undefined) {
    watch(readPhase, (phase) => {
      const effectName = phaseEffects[phase]
      if (effectName !== undefined) play(effectName)
    })
  }
  return { play }
}
