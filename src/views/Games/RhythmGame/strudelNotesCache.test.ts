import { describe, expect, it, vi } from 'vitest'
import { createStrudelNotesCache } from './strudelNotesCache'

const notes = (code: string) => ({ midi: new ArrayBuffer(code.length), cyclesPerSecond: 0.5 })
const songs = [
  { id: 'first', code: 'a' },
  { id: 'second', code: 'bb' },
  { id: 'third', code: 'ccc' }
]

describe('createStrudelNotesCache', () => {
  it('writes a song once, however often it is asked for', async () => {
    // Arrange
    const render = vi.fn(async (code: string) => notes(code))
    const cache = createStrudelNotesCache(render)

    // Act
    const [first, again] = await Promise.all([
      cache.notesFor('first', 'a'),
      cache.notesFor('first', 'a')
    ])

    // Assert
    expect(render).toHaveBeenCalledTimes(1)
    expect(again).toBe(first)
  })

  it('writes every song ahead, one after another, so a pick later is already done', async () => {
    const order: string[] = []
    const render = vi.fn(async (code: string) => {
      order.push(code)
      return notes(code)
    })
    const cache = createStrudelNotesCache(render)

    await cache.prefetch(songs, () => false)
    await cache.notesFor('second', 'bb')

    expect(order).toEqual(['a', 'bb', 'ccc'])
    expect(render).toHaveBeenCalledTimes(3)
  })

  it('stops writing ahead once told to', async () => {
    const render = vi.fn(async (code: string) => notes(code))
    const cache = createStrudelNotesCache(render)
    const stopAfterFirst = vi.fn().mockReturnValueOnce(false).mockReturnValue(true)

    await cache.prefetch(songs, stopAfterFirst)

    expect(render).toHaveBeenCalledTimes(1)
  })

  it('tries a song again after it failed', async () => {
    const render = vi
      .fn<(code: string) => Promise<ReturnType<typeof notes>>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockImplementation(async (code) => notes(code))
    const cache = createStrudelNotesCache(render)

    await expect(cache.notesFor('first', 'a')).rejects.toThrow('offline')
    await expect(cache.notesFor('first', 'a')).resolves.toEqual(notes('a'))
  })
})
