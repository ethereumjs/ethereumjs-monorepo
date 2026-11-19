import { assert, describe, it } from 'vitest'

import { discoverOllamaModels, discoverOpenAiCompatibleModels } from '../src/ai/localProviders.ts'

describe('[Ethy/ai]: localProviders', () => {
  it('discoverOllamaModels() filters embedding models', async () => {
    const fetchFn = async () =>
      new Response(
        JSON.stringify({
          models: [{ name: 'qwen3:4b' }, { name: 'nomic-embed-text:latest' }],
        }),
        { status: 200 },
      )
    const models = await discoverOllamaModels(fetchFn as typeof fetch)
    assert.equal(models.length, 1)
    assert.equal(models[0]?.modelId, 'qwen3:4b')
  })

  it('discoverOpenAiCompatibleModels() parses /v1/models', async () => {
    const fetchFn = async () =>
      new Response(JSON.stringify({ data: [{ id: 'gemma-3-4b-it' }] }), { status: 200 })
    const models = await discoverOpenAiCompatibleModels(
      fetchFn as typeof fetch,
      'http://127.0.0.1:1234',
      'lm-studio',
    )
    assert.equal(models[0]?.modelId, 'gemma-3-4b-it')
  })

  it('discoverOllamaModels() returns empty on timeout', async () => {
    const fetchFn = async () => {
      throw new Error('aborted')
    }
    const models = await discoverOllamaModels(fetchFn as typeof fetch)
    assert.equal(models.length, 0)
  })
})
