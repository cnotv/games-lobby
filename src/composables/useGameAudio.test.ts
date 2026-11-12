import { describe, expect, it, vi, beforeEach } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

const { startGameMusic, stopGameMusic, playGameSound } = vi.hoisted(() => ({
  startGameMusic: vi.fn(),
  stopGameMusic: vi.fn(),
  playGameSound: vi.fn()
}))
vi.mock('@/utils/gameAudio', () => ({ startGameMusic, stopGameMusic, playGameSound }))

import { useGameAudio } from './useGameAudio'

describe('useGameAudio', () => {
  beforeEach(() => vi.clearAllMocks())

  const mountWith = (phase: ReturnType<typeof ref<string>>): void => {
    effectScope().run(() => useGameAudio('minigolf', () => phase.value ?? '', { playing: 'start' }))
  }

  it('keeps the music off in the lobby', () => {
    mountWith(ref('lobby'))
    expect(startGameMusic).not.toHaveBeenCalled()
  })

  it('starts the music and the start effect when the game starts, and stops it back in the lobby', async () => {
    const phase = ref('lobby')
    mountWith(phase)
    phase.value = 'playing'
    await nextTick()
    expect(startGameMusic).toHaveBeenCalledWith('minigolf')
    expect(playGameSound).toHaveBeenCalledWith('minigolf', 'start')
    phase.value = 'lobby'
    await nextTick()
    expect(stopGameMusic).toHaveBeenCalled()
  })

  it('stops the music on the results', async () => {
    const phase = ref('playing')
    mountWith(phase)
    phase.value = 'summary'
    await nextTick()
    expect(stopGameMusic).toHaveBeenCalled()
  })
})
