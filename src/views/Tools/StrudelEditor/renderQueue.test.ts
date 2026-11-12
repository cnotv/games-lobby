import { describe, expect, it } from 'vitest'
import { createRenderQueue } from './renderQueue'

const deferred = () => {
  const handle: { resolve: (value: string) => void } = { resolve: () => undefined }
  const promise = new Promise<string>((resolve) => {
    handle.resolve = resolve
  })
  return { promise, resolve: (value: string) => handle.resolve(value) }
}

describe('createRenderQueue', () => {
  it('starts a job only once the one before it has finished', async () => {
    // Arrange
    const runInTurn = createRenderQueue()
    const started: string[] = []
    const first = deferred()

    // Act
    const firstResult = runInTurn(() => {
      started.push('first')
      return first.promise
    })
    const secondResult = runInTurn(async () => {
      started.push('second')
      return 'second done'
    })
    await Promise.resolve()

    // Assert
    expect(started).toEqual(['first'])
    first.resolve('first done')
    await expect(firstResult).resolves.toBe('first done')
    await expect(secondResult).resolves.toBe('second done')
    expect(started).toEqual(['first', 'second'])
  })

  it('runs the next job even when the one before it failed', async () => {
    const runInTurn = createRenderQueue()

    const failing = runInTurn(() => Promise.reject(new Error('broken')))
    const next = runInTurn(async () => 'still runs')

    await expect(failing).rejects.toThrow('broken')
    await expect(next).resolves.toBe('still runs')
  })
})
