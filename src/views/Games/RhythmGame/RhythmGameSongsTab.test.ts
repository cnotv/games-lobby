import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RhythmGameSongsTab from './RhythmGameSongsTab.vue'

const findButton = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.findAll('button').find((button) => button.text() === label)

describe('RhythmGameSongsTab', () => {
  it('emits the pasted code with its name and clears the form', async () => {
    // Arrange
    const wrapper = mount(RhythmGameSongsTab, { props: { songs: [] } })
    await wrapper.find('input').setValue('Night drive')
    await wrapper.find('textarea').setValue('// instrument: bass\ns("bass")')

    // Act
    await findButton(wrapper, 'Add song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toEqual([['Night drive', '// instrument: bass\ns("bass")']])
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('does not emit an empty song', async () => {
    // Arrange
    const wrapper = mount(RhythmGameSongsTab, { props: { songs: [] } })

    // Act
    await findButton(wrapper, 'Add song')?.trigger('click')

    // Assert
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('lists a pasted song with the instrument its comment names', () => {
    // Arrange
    const wrapper = mount(RhythmGameSongsTab, {
      props: {
        songs: [{ id: 'a', label: 'Night drive', code: '// instrument: bass\ns("bass")' }]
      }
    })

    // Act
    const text = wrapper.text()

    // Assert
    expect(text).toContain('Night drive')
    expect(text).toContain('Instrument: bass')
  })

  it('asks for the song to be removed', async () => {
    // Arrange
    const wrapper = mount(RhythmGameSongsTab, {
      props: { songs: [{ id: 'a', label: 'Night drive', code: 's("bass")' }] }
    })

    // Act
    await findButton(wrapper, 'Remove')?.trigger('click')

    // Assert
    expect(wrapper.emitted('remove')).toEqual([['a']])
  })
})
