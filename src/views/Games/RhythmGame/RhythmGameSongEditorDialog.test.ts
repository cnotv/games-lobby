import { mount, type ComponentMountingOptions } from '@vue/test-utils'
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

describe('RhythmGameSongEditorDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('closes and strips the editor address', async () => {
    // Arrange
    const wrapper = mountDialog()
    await waitForEditor(wrapper)

    // Act
    await findButton(wrapper, 'Close the editor')?.trigger('click')

    // Assert
    expect(wrapper.emitted('close')).toEqual([[]])
    expect(mockReplace).toHaveBeenCalledTimes(2)
    const { query } = mockReplace.mock.calls[1][0]
    expect(query.game).toBe('RhythmGame')
    expect(query.pattern).toBeUndefined()
    expect(query.tab).toBeUndefined()
  })

  it('opens the editor on its songs side panel', async () => {
    // Arrange
    const wrapper = mountDialog()
    await waitForEditor(wrapper)

    // Act
    const { query } = mockReplace.mock.calls[0][0]

    // Assert
    expect(query.game).toBe('RhythmGame')
    expect(query.tab).toBe('import')
  })

  it('offers no save or full screen button', async () => {
    // Arrange
    const wrapper = mountDialog()
    await waitForEditor(wrapper)

    // Act
    const titles = wrapper.findAll('button').map((button) => button.attributes('title'))

    // Assert
    expect(titles).toEqual(['Close the editor'])
  })
})
