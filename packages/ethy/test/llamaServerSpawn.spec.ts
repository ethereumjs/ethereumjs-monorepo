import { describe, expect, it } from 'vitest'

import { spawnLlamaServerCommand } from '../src/ai/llamaServerBin.ts'

describe('spawnLlamaServerCommand', () => {
  it('includes --reasoning-budget 0 by default', () => {
    const { args } = spawnLlamaServerCommand('/tmp/llama-server', '/tmp/model.gguf', 8080)
    expect(args).toContain('--reasoning-budget')
    expect(args[args.indexOf('--reasoning-budget') + 1]).toBe('0')
  })

  it('omits reasoning flag when disabled', () => {
    const { args } = spawnLlamaServerCommand('/tmp/llama-server', '/tmp/model.gguf', 8080, {
      reasoningBudgetZero: false,
    })
    expect(args).not.toContain('--reasoning-budget')
  })
})
