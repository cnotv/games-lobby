import { ref } from 'vue'
import type { HitResult } from './config'
import { getHitScore } from './rhythmGameUtilities'
import type { RgScore } from '@/stores/rhythmGame'

/**
 * The running score of one round.
 * @param onScoreUpdate - Told the new totals after every change
 * @returns The counters, `registerHit` to count a judged note and `emitScore` to publish the totals
 */
export const useRoundScore = (onScoreUpdate: (score: RgScore) => void) => {
  const score = ref(0)
  const combo = ref(0)
  const maxCombo = ref(0)
  const perfect = ref(0)
  const good = ref(0)
  const miss = ref(0)

  const emitScore = (): void =>
    onScoreUpdate({
      score: score.value,
      combo: combo.value,
      maxCombo: maxCombo.value,
      perfect: perfect.value,
      good: good.value,
      miss: miss.value
    })

  const registerHit = (result: HitResult): void => {
    if (result === 'miss') {
      miss.value++
      combo.value = 0
      return
    }
    score.value += getHitScore(result, combo.value)
    combo.value++
    maxCombo.value = Math.max(maxCombo.value, combo.value)
    if (result === 'perfect') perfect.value++
    else good.value++
  }

  return { score, combo, maxCombo, perfect, good, miss, emitScore, registerHit }
}
