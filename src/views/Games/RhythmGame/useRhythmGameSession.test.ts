import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRhythmGameStore } from '@/stores/rhythmGame'
import { applyConfigPayload, applyStartPayload } from './useRhythmGameSession'

const chart = [{ lane: 1 as const, midiNote: 60, time: 500 }]

describe('the song a host shares', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it.each([
    ['the room config', applyConfigPayload],
    ['the start of a round', applyStartPayload]
  ])('reaches a peer at the host tempo with %s', (_moment, apply) => {
    // Arrange
    const store = useRhythmGameStore()

    const sharedSong = {
      song: 'custom' as const,
      difficulty: 'easy' as const,
      instrument: 'piano' as const,
      startAt: 0,
      customNotes: chart,
      customTempoRate: 0.75,
      customStrudelCode: 's("bd")\nsetcps(0.375)'
    }

    // Act
    apply(store, sharedSong)

    // Assert
    expect(store.customNotes).toEqual(chart)
    expect(store.customTempoRate).toBe(0.75)
    expect(store.customStrudelCode).toBe('s("bd")\nsetcps(0.375)')
  })

  it('plays a song shared without a tempo at full speed', () => {
    const store = useRhythmGameStore()
    store.customTempoRate = 0.75
    store.customStrudelCode = 's("bd")'

    applyConfigPayload(store, { song: 'electric-pulse', difficulty: 'hard', instrument: 'bass' })

    expect(store.customTempoRate).toBe(1)
    expect(store.customStrudelCode).toBeNull()
  })
})
