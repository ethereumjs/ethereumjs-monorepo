import * as path from 'node:path'

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

  it('resolves relative modelPath to absolute path so cwd=binDir finds the GGUF file', () => {
    const { args } = spawnLlamaServerCommand(
      'tmp/node1/bin/llama-server',
      'tmp/node1/models/Qwen3.5-2B-Q4_K_M.gguf',
      8080,
    )
    const modelArg = args[args.indexOf('-m') + 1]
    expect(modelArg).toBeDefined()
    expect(path.isAbsolute(modelArg!)).toBe(true)
    expect(modelArg).toBe(path.resolve('tmp/node1/models/Qwen3.5-2B-Q4_K_M.gguf'))
  })
})
