import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LobbyLayout from './LobbyLayout.vue'

const mountLayout = () =>
  mount(LobbyLayout, {
    props: { phase: 'lobby' },
    slots: { rules: '<p>Rules</p>' }
  })

describe('LobbyLayout header', () => {
  it('opens the rules from an icon button, not a text glyph', async () => {
    // Arrange
    const wrapper = mountLayout()
    const rulesButton = wrapper.get('button[aria-label="Show the rules"]')

    // Act
    await rulesButton.trigger('click')

    // Assert
    expect(rulesButton.classes()).toContain('lui-btn--icon')
    expect(rulesButton.find('svg').exists()).toBe(true)
    expect(rulesButton.text()).toBe('')
    const closeButton = wrapper.get('button[aria-label="Close the rules"]')
    expect(closeButton.find('svg').exists()).toBe(true)
    expect(closeButton.text()).toBe('')
  })
})
