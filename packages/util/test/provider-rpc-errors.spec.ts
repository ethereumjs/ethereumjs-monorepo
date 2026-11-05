import { assert, describe, it, vi } from 'vitest'

import { EthereumJSError, fetchFromProvider } from '../src/index.ts'

const providerUrl = 'https://myfakeprovider.com'

describe('[Util]: fetchFromProvider JSON-RPC errors', () => {
  it('reports JSON-RPC errors returned with a successful HTTP status', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            error: { code: -32601, message: 'Method not found', data: 'provider details' },
          }),
        ),
    )
    try {
      await fetchFromProvider(providerUrl, { method: 'eth_unknownMethod', params: [] })
      assert.fail('expected the provider error')
    } catch (error: unknown) {
      assert.instanceOf(error, EthereumJSError)
      const providerError = error as EthereumJSError<{ code: string }>
      assert.strictEqual(providerError.type.code, 'ETHEREUMJS_JSON_RPC_ERROR')
      assert.include(providerError.message, 'eth_unknownMethod')
      assert.include(providerError.message, '-32601')
      assert.include(providerError.message, 'Method not found')
      assert.include(providerError.message, 'provider details')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  for (const result of [null, false, 0]) {
    it(`preserves a successful ${result} result`, async () => {
      vi.stubGlobal(
        'fetch',
        async () => new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result })),
      )
      try {
        assert.strictEqual(
          await fetchFromProvider(providerUrl, { method: 'eth_test', params: [] }),
          result,
        )
      } finally {
        vi.unstubAllGlobals()
      }
    })
  }
})
