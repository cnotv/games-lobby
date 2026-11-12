import { describe, expect, it, vi, afterEach } from 'vitest'
import { withTimeout } from './strudelOfflineRender'

describe('withTimeout', () => {
  afterEach(() => vi.useRealTimers())

  it('gives what the promise gives when it settles in time', async () => {
    await expect(withTimeout(Promise.resolve('done'), 1000)).resolves.toBe('done')
  })

  it('fails when the promise never settles', async () => {
    vi.useFakeTimers()
    const result = expect(withTimeout(new Promise<never>(() => undefined), 1000)).rejects.toThrow(
      'took too long'
    )
    await vi.advanceTimersByTimeAsync(1000)
    await result
  })
})
