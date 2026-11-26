import { describe, expect, it } from 'vitest'

import { parseEthyArgs } from '../src/cli/args.ts'
import { noteAccountProvenance, provenanceLabelForAccountHash } from '../src/custody/provenance.ts'
import { getCommandAvailability } from '../src/domains/commandAvailability.ts'
import { awaitSandboxIdle, enqueueSandbox, resolveSandboxOpts } from '../src/evm/queue.ts'
import { resolveEffectiveCustodyCount } from '../src/persist/userConfig.ts'
import { custodyStatusPayload } from '../src/rpc/custodyStatus.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('WP-16h client-wide custody leverage', () => {
  it('priority pool: hot rpc completes while ai_probe work is in flight', async () => {
    const order: string[] = []
    const slow = enqueueSandbox(
      async () => {
        order.push('ai-start')
        await new Promise((r) => setTimeout(r, 60))
        order.push('ai-end')
        return 'ai'
      },
      { lane: 'ai_probe', timeoutMs: 800 },
    )
    await new Promise((r) => setTimeout(r, 5))
    const fast = enqueueSandbox(
      async () => {
        order.push('rpc')
        return 'rpc'
      },
      { lane: 'rpc', timeoutMs: 800 },
    )
    expect(await fast).toBe('rpc')
    expect(order).toContain('rpc')
    await slow
    await awaitSandboxIdle()
  })

  it('ai_probe lane defaults to swarm-only resolution policy', () => {
    const opts = resolveSandboxOpts({ lane: 'ai_probe' })
    expect(opts.resolutionPolicy).toBe('swarm-only')
    expect(opts.timeoutMs).toBe(600)
  })

  it('HEAD_FOLLOWING unlocks /account and /simulate without 16 snap buckets', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.phase = 'HEAD_FOLLOWING'
    expect(getCommandAvailability('/account', spine).status).toBe('ready')
    expect(getCommandAvailability('/simulate', spine).status).toBe('ready')
    expect(getCommandAvailability('/contract', spine).status).toBe('ready')
  })

  it('provenance LRU labels account hashes', () => {
    noteAccountProvenance('abcd', 'ETHY 1-Hop Proof')
    expect(provenanceLabelForAccountHash('AbCd')).toBe('ETHY 1-Hop Proof')
  })

  it('ethy_custodyStatus payload includes masks and dial count', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.custodyDialCount = 2
    spine.custodyBuckets = [0, 8]
    spine.closedBucketsMask = 1
    spine.custodyResolve = { local: 1, tombstone: 0, ethyProof: 0, ethyChunk: 0, snap: 0 }
    const payload = custodyStatusPayload(spine)
    expect(payload.custodyCount).toBe(2)
    expect(payload.closedBucketsMask).toMatch(/^0x/)
    expect(payload.resolutionStats).toBeDefined()
  })

  it('custodyCount precedence: explicit CLI beats saved config', () => {
    const cli = parseEthyArgs(['node', 'sepolia', '--custody', '4'])
    const resolved = resolveEffectiveCustodyCount(
      { schemaVersion: 1, updatedAt: '', custodyCount: 8 },
      cli,
    )
    expect(resolved.count).toBe(4)
    expect(resolved.persistOnBoot).toBe(true)
  })

  it('custodyCount precedence: saved config when CLI omits --custody', () => {
    const cli = parseEthyArgs(['node', 'sepolia'])
    const resolved = resolveEffectiveCustodyCount(
      { schemaVersion: 1, updatedAt: '', custodyCount: 6 },
      cli,
    )
    expect(resolved.count).toBe(6)
  })
})
