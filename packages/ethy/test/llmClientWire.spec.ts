import { describe, expect, it } from 'vitest'

import { buildOllamaChatBody, buildOpenAiChatBody } from '../src/ai/llmClient.ts'

describe('llmClient wire bodies', () => {
  const messages = [{ role: 'system' as const, content: 'hi' }]

  it('includes JSON format for pulse', () => {
    const ollama = buildOllamaChatBody('pulse', messages, 'm')
    const openai = buildOpenAiChatBody('pulse', messages, 'm')
    expect(ollama.format).toBe('json')
    expect(openai.response_format).toEqual({ type: 'json_object' })
  })

  it('omits JSON format for story text mode', () => {
    const ollama = buildOllamaChatBody('story', messages, 'm', { responseMode: 'text' })
    const openai = buildOpenAiChatBody('story', messages, 'm', { responseMode: 'text' })
    expect(ollama.format).toBeUndefined()
    expect(openai.response_format).toBeUndefined()
  })
})
