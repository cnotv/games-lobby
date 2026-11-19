import { flushPromises, mount, type ComponentMountingOptions } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RhythmGameSongEditorDialog from './RhythmGameSongEditorDialog.vue'

// The dialog teleports to the body so it can cover the viewport; the tests read it in place.
const mountDialog = (options: ComponentMountingOptions<typeof RhythmGameSongEditorDialog> = {}) =>
  mount(RhythmGameSongEditorDialog, {
    ...options,
    global: { ...options.global, stubs: { teleport: true } }
  })

vi.mock('@webgamekit/strudel-editor', () => ({
  StrudelEditor: {
    name: 'StrudelEditor',
    props: ['code'],
    template: '<div data-testid="editor" />'
  }
}))

const { mockReplace } = vi.hoisted(() => ({ mockReplace: vi.fn() }))
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useRoute: () => ({ query: { game: 'RhythmGame' } })
}))

const findButton = (wrapper: ReturnType<typeof mount>, title: string) =>
  wrapper.findAll('button').find((button) => button.attributes('title') === title)

// The editor loads on demand; a test that ends before it arrives leaves the import dangling.
const waitForEditor = (wrapper: ReturnType<typeof mount>) =>
  vi.waitFor(() => expect(wrapper.find('[data-testid="editor"]').exists()).toBe(true))

const reportEditorCode = async (wrapper: ReturnType<typeof mount>, code: string) => {
  await waitForEditor(wrapper)
  wrapper.findComponent({ name: 'StrudelEditor' }).vm.$emit('update:code', code)
  await nextTick()
}

describe('RhythmGameSongEditorDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('saves the code the tab handed it while the editor has reported none', async () => {
    // Arrange
    const wrapper = mountDialog({
      props: { initialName: 'Night line', initialCode: 's("bd")' }
    })

    await waitForEditor(wrapper)

    // Act
    await findButton(wrapper, 'Save the song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toEqual([['Night line', 's("bd")']])
  })

  it('saves the code the editor reports into the list', async () => {
    // Arrange
    const wrapper = mountDialog({ props: { initialName: 'Night line' } })
    await flushPromises()
    await reportEditorCode(wrapper, 's("cp*3")')

    // Act
    await findButton(wrapper, 'Save the song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toEqual([['Night line', 's("cp*3")']])
  })

  it('adds nothing while the editor has reported no code', async () => {
    // Arrange
    const wrapper = mountDialog()
    await flushPromises()

    // Act
    await findButton(wrapper, 'Save the song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('closes and strips the editor address', async () => {
    // Arrange
    const wrapper = mountDialog()

    // Act
    await findButton(wrapper, 'Close the editor')?.trigger('click')

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
    const wrapper = mountDialog({ attachTo: document.body })
    const root = wrapper.find('.rgsed').element
    root.requestFullscreen = requestFullscreen

    // Act
    await findButton(wrapper, 'Full screen')?.trigger('click')

    // Assert
    expect(requestFullscreen).toHaveBeenCalledTimes(1)

    // Act: the browser reports the change, flipping the button title
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => document.body
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await wrapper.vm.$nextTick()

    // Assert
    expect(findButton(wrapper, 'Exit full screen')).toBeDefined()

    // Act
    await findButton(wrapper, 'Exit full screen')?.trigger('click')

    // Assert
    expect(exitFullscreen).toHaveBeenCalledTimes(1)
  })
})
