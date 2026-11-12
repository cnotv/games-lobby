import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { gameAudioSettings } from '@/utils/gameAudio'
import GameSoundToggles from './GameSoundToggles.vue'

const mountToggles = (music: boolean, effects: boolean) => {
  gameAudioSettings.music = music
  gameAudioSettings.effects = effects
  return mount(GameSoundToggles)
}

describe('GameSoundToggles', () => {
  it('shows two plain icons while both are on', () => {
    const wrapper = mountToggles(true, true)

    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.findAll('.game-sound-toggles__bar')).toHaveLength(0)
    expect(wrapper.findAll('button').map((button) => button.attributes('aria-pressed'))).toEqual([
      'true',
      'true'
    ])
  })

  it('bars only the icon that is off', () => {
    const wrapper = mountToggles(false, true)
    const [music, effects] = wrapper.findAll('button')

    expect(music.find('.game-sound-toggles__bar').exists()).toBe(true)
    expect(effects.find('.game-sound-toggles__bar').exists()).toBe(false)
    expect(music.attributes('aria-label')).toBe('Turn the music on')
    expect(effects.attributes('aria-label')).toBe('Turn the sounds off')
  })

  it('switches the one that was clicked, for every game', async () => {
    const wrapper = mountToggles(true, true)
    const [music, effects] = wrapper.findAll('button')

    await music.trigger('click')
    await effects.trigger('click')

    expect(gameAudioSettings).toEqual({ music: false, effects: false })
  })
})
