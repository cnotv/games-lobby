import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RhythmGameSongEditorDialog from './RhythmGameSongEditorDialog.vue'
import {
  DEFAULT_STRUDEL_EXAMPLE_ID,
  STRUDEL_EXAMPLES,
  STRUDEL_SAVED_CODE_STORAGE_KEY
} from '@/views/Tools/StrudelEditor/config'

const defaultExample =
  STRUDEL_EXAMPLES.find((example) => example.id === DEFAULT_STRUDEL_EXAMPLE_ID) ??
  STRUDEL_EXAMPLES[0]

vi.mock('@/views/Tools/StrudelEditor/StrudelEditor.vue', () => ({
  __esModule: true,
  default: { name: 'StrudelEditor', template: '<div data-testid="editor" />' }
}))

const { mockReplace } = vi.hoisted(() => ({ mockReplace: vi.fn() }))
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useRoute: () => ({ query: { game: 'RhythmGame' } })
}))

const setStorage = (map: Record<string, string>): void => {
  Object.entries(map).forEach(([key, value]) => localStorage.setItem(key, value))
}

const clearStorage = (): void => {
  localStorage.removeItem(STRUDEL_SAVED_CODE_STORAGE_KEY)
}

const importButton = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.findAll('button').find((button) => button.text() === label)

describe('RhythmGameSongEditorDialog', () => {
  beforeEach(() => {
    clearStorage()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearStorage()
  })

  it('opens the editor on the code the tab handed it', async () => {
    // Arrange + Act
    await mount(RhythmGameSongEditorDialog, {
      props: { initialName: 'Night line', initialCode: 's("bd")' }
    })

    // Assert
    expect(localStorage.getItem(STRUDEL_SAVED_CODE_STORAGE_KEY)).toBe('s("bd")')
  })

  it('does not overwrite the editor code when opened with none', async () => {
    // Arrange
    setStorage({ [STRUDEL_SAVED_CODE_STORAGE_KEY]: 's("sd")' })

    // Act
    await mount(RhythmGameSongEditorDialog)

    // Assert
    expect(localStorage.getItem(STRUDEL_SAVED_CODE_STORAGE_KEY)).toBe('s("sd")')
  })

  it('saves the code on the editor screen into the list', async () => {
    // Arrange
    setStorage({ [STRUDEL_SAVED_CODE_STORAGE_KEY]: 's("cp*3")' })
    const wrapper = mount(RhythmGameSongEditorDialog, { props: { initialName: 'Night line' } })

    // Act
    await importButton(wrapper, 'Save song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toEqual([['Night line', 's("cp*3")']])
  })

  it('seeds the default example when there is no saved code', async () => {
    // Act
    await mount(RhythmGameSongEditorDialog)

    // Assert
    expect(localStorage.getItem(STRUDEL_SAVED_CODE_STORAGE_KEY)).toBe(defaultExample.code)
  })

  it('saves the seeded default code when nothing was typed', async () => {
    // Arrange
    const wrapper = mount(RhythmGameSongEditorDialog)

    // Act
    await importButton(wrapper, 'Save song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toEqual([['', defaultExample.code]])
  })

  it('closes and strips the editor address', async () => {
    // Arrange
    const wrapper = mount(RhythmGameSongEditorDialog)

    // Act
    await importButton(wrapper, 'Close')?.trigger('click')

    // Assert
    expect(wrapper.emitted('close')).toEqual([[]])
    expect(mockReplace).toHaveBeenCalledOnce()
    const { query } = mockReplace.mock.calls[0][0]
    expect(query.game).toBe('RhythmGame')
    expect(query.pattern).toBeUndefined()
    expect(query.tab).toBeUndefined()
  })

  it('toggles full screen on the editor', async () => {
    // Arrange
    const requestFullscreen = vi.fn()
    const exitFullscreen = vi.fn()
    document.exitFullscreen = exitFullscreen
    const wrapper = mount(RhythmGameSongEditorDialog, { attachTo: document.body })
    const root = wrapper.find('.rgsed').element
    root.requestFullscreen = requestFullscreen

    // Act
    await importButton(wrapper, 'Full screen')?.trigger('click')

    // Assert
    expect(requestFullscreen).toHaveBeenCalledTimes(1)

    // Act: the browser reports the change, flipping the button label
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => document.body
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await wrapper.vm.$nextTick()

    // Assert
    expect(importButton(wrapper, 'Windowed')).toBeDefined()

    // Act
    await importButton(wrapper, 'Windowed')?.trigger('click')

    // Assert
    expect(exitFullscreen).toHaveBeenCalledTimes(1)
  })
})
