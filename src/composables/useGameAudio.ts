import { onBeforeUnmount, watch } from 'vue'
import { playGameSound, startGameMusic, stopGameMusic } from '@/utils/gameAudio'
import type { GameAudioId } from '@/types/gameAudio'

const SILENT_PHASES = ['lobby', 'summary']

/**
 * Plays a game's music only while a round is on, so it starts with the game and stops on
 * returning to the lobby, on the results and on leaving the view. Also plays an effect when the
 * game enters a phase that has one, and hands back the game's effects for everything else.
 * @param game - The game
 * @param readPhase - Reads the game's current phase
 * @param phaseEffects - The effect to play on entering each phase, by phase name
 * @returns A function that plays one of the game's effects by name
 */
export const useGameAudio = (
  game: GameAudioId,
  readPhase: () => string,
  phaseEffects: Record<string, string> = {}
): { play: (effectName: string) => void } => {
  const play = (effectName: string): void => playGameSound(game, effectName)
  watch(
    readPhase,
    (phase) => {
      if (SILENT_PHASES.includes(phase)) stopGameMusic()
      else startGameMusic(game)
      const effectName = phaseEffects[phase]
      if (effectName !== undefined) play(effectName)
    },
    { immediate: true }
  )
  onBeforeUnmount(stopGameMusic)
  return { play }
}
