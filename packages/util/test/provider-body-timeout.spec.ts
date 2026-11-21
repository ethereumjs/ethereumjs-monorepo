import { assert, afterEach, beforeEach, describe, it, vi } from 'vitest'

import { fetchFromProvider } from '../src/index.ts'

const providerUrl = 'https://myfakeprovider.com'

describe('[Util]: fetchFromProvider timeout fallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('AbortSignal', { timeout: undefined })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  for (const ok of [true, false]) {
    it(`aborts a slow ${ok ? 'successful' : 'error'} response body`, async () => {
      let signal = new AbortController().signal
      vi.stubGlobal('fetch', async (_url: string, request: { signal: AbortSignal }) => {
        signal = request.signal
        const readBody = () =>
          new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason), { once: true })
          })
        return { ok, status: ok ? 200 : 503, json: readBody, text: readBody }
      })

      let failure: unknown
      const request = fetchFromProvider(
        providerUrl,
        { method: 'eth_getBalance', params: ['0xabcd'] },
        { timeout: 50 },
      ).catch((error: unknown) => {
        failure = error
      })

      await vi.advanceTimersByTimeAsync(49)
      assert.isFalse(signal.aborted)
      await vi.advanceTimersByTimeAsync(1)
      assert.isTrue(signal.aborted)
      await request
      if (ok) {
        assert.strictEqual((failure as Error).name, 'AbortError')
      } else {
        assert.include((failure as Error).message, 'JSONRPCError')
        assert.include((failure as Error).message, 'eth_getBalance')
      }
      assert.strictEqual(vi.getTimerCount(), 0)
    })
  }

  for (const outcome of ['success', 'fetch error', 'body error']) {
    it(`clears the fallback timer after ${outcome}`, async () => {
      let signal = new AbortController().signal
      const failure = new Error('provider failure')
      vi.stubGlobal('fetch', async (_url: string, request: { signal: AbortSignal }) => {
        signal = request.signal
        if (outcome === 'fetch error') throw failure
        return {
          ok: true,
          json: async () => {
            if (outcome === 'body error') throw failure
            return { result: '0x1' }
          },
        }
      })

      let result: unknown
      let error: unknown
      try {
        result = await fetchFromProvider(
          providerUrl,
          { method: 'eth_getBalance', params: ['0xabcd'] },
          { timeout: 50 },
        )
      } catch (cause: unknown) {
        error = cause
      }

      if (outcome === 'success') {
        assert.strictEqual(result, '0x1')
        assert.isUndefined(error)
      } else {
        assert.strictEqual(error, failure)
      }
      assert.strictEqual(vi.getTimerCount(), 0)
      await vi.advanceTimersByTimeAsync(50)
      assert.isFalse(signal.aborted)
    })
  }
})
