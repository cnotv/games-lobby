import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import LobbyUIWizard from './LobbyUIWizard.vue'

vi.mock('vue-router', () => ({ useRoute: () => ({ query: {} }) }))
vi.mock('@/composables/useGameLobby', () => ({
  useGameLobby: () => ({
    isSearching: ref(false),
    pendingRequests: ref([]),
    startSearching: vi.fn(),
    stopSearching: vi.fn(),
    acceptRequest: vi.fn(),
    ignoreRequest: vi.fn(),
    displayName: (peerId: string) => peerId
  })
}))

const mountWizard = () =>
  mount(LobbyUIWizard, {
    props: {
      playerName: 'Player',
      playerColor: '#fff',
      isHost: true,
      playerList: [],
      roomId: 'room',
      matchmakerRoom: 'matchmaker',
      configFields: [],
      actionTabLabel: 'Songs'
    }
  })

describe('LobbyUIWizard', () => {
  it('opens the game form on the Game tab', () => {
    // Arrange
    const wrapper = mountWizard()

    // Act
    const text = wrapper.text()

    // Assert
    expect(text).toContain('Game')
    expect(text).toContain('Songs')
  })

  it('runs the action of the Songs tab instead of opening a page', async () => {
    // Arrange
    const wrapper = mountWizard()
    const songsTab = wrapper.findAll('button').find((button) => button.text() === 'Songs')

    // Act
    await songsTab?.trigger('click')

    // Assert
    expect(wrapper.emitted('actionTab')).toEqual([[]])
    expect(wrapper.text()).toContain('Private')
  })
})
