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
      extraTabLabel: 'Songs'
    },
    slots: { extra: '<p>Pasted songs</p>' }
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
    expect(text).not.toContain('Pasted songs')
  })

  it('shows the extra slot on its own tab', async () => {
    // Arrange
    const wrapper = mountWizard()
    const songsTab = wrapper.findAll('button').find((button) => button.text() === 'Songs')

    // Act
    await songsTab?.trigger('click')

    // Assert
    expect(wrapper.text()).toContain('Pasted songs')
  })
})
