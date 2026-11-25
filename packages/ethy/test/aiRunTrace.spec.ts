import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { FlatStateManager } from '@ethereumjs/statemanager'
import { afterEach, describe, expect, it } from 'vitest'

import { capRawPreview, createAiRunLog } from '../src/ai/aiRunTrace.ts'
import { HybridIntentEngine } from '../src/ai/hybridEngine.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('aiRunTrace', () => {
  const dirs: string[] = []
  afterEach(() => {
    for (const d of dirs) {
      try {
        fs.rmSync(d, { recursive: true, force: true })
      } catch {
        // ignore
      }
    }
    dirs.length = 0
  })

  it('append and readRecent round-trip', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-ai-run-'))
    dirs.push(root)
    const log = createAiRunLog(root, 'sepolia')
    log.append({
      runId: 'a',
      ts: 1,
      trigger: 'pulse',
      network: 'sepolia',
      aiMode: 'local',
      modelTier: 'compact',
      llmCalls: [],
      source: 'fallback',
      fallbackReason: 'offline',
      totalLatencyMs: 12,
    })
    log.append({
      runId: 'b',
      ts: 2,
      trigger: 'manual',
      network: 'sepolia',
      aiMode: 'local',
      modelTier: 'compact',
      llmCalls: [],
      source: 'llm',
      headline: 'Hello',
      totalLatencyMs: 99,
    })
    await new Promise<void>((r) => setImmediate(r))
    const recent = log.readRecent(2)
    expect(recent).toHaveLength(2)
    expect(recent[0]?.runId).toBe('a')
    expect(recent[1]?.headline).toBe('Hello')
  })

  it('caps raw preview', () => {
    const long = 'x'.repeat(5000)
    expect(capRawPreview(long).length).toBeLessThan(long.length)
    expect(capRawPreview('short')).toBe('short')
  })

  it('serves /ai log through HybridIntentEngine with immediate flush', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-ai-hybrid-'))
    dirs.push(root)
    const log = createAiRunLog(root, 'sepolia')
    log.append({
      runId: 'immediate-1',
      ts: Date.now(),
      trigger: 'manual',
      network: 'sepolia',
      aiMode: 'default',
      modelTier: 'compact',
      director: { beat: 'contract_deep_dive' },
      llmCalls: [],
      source: 'llm',
      headline: 'Fresh contract deep dive',
      totalLatencyMs: 2400,
    })
    const engine = new HybridIntentEngine({
      stateManager: new FlatStateManager(),
      dataDir: root,
    })
    const spine = createSpine('sepolia', 11155111n)
    const res = await engine.handle({ text: '/ai log 5', spine })
    expect(res.widget.kind).toBe('table')
    if (res.widget.kind === 'table') {
      expect(res.widget.title).toBe('/ai log')
      expect(res.widget.rows.length).toBe(1)
      expect(res.widget.rows[0]?.[0]).toBe('LLM')
      expect(res.widget.rows[0]?.[1]).toBe('contract_deep_dive')
    }
  })
})
