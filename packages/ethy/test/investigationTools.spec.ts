import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { Address, hexToBytes } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import { probeContractViewLive, runInvestigationTool } from '../src/ai/investigationTools.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('investigationTools', () => {
  it('rejects non-whitelisted probe fn and invalid addresses without throwing', () => {
    const spine = createSpine('sepolia', 11155111n)
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const stateManager = createFlatStateManager({ common })
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager,
    })
    const raw = runInvestigationTool(
      'probe_contract_view',
      { address: '0x00000000000000000000000000000000000000aa', fn: 'transfer' },
      { economy, stateManager, chain, spine },
    )
    const obj = JSON.parse(raw) as { error?: string }
    expect(obj.error).toBe('fn_not_whitelisted')

    const badAddr = JSON.parse(
      runInvestigationTool(
        'inspect_contract',
        { address: 'not-an-address' },
        { economy, stateManager, chain, spine },
      ),
    ) as { error?: string }
    expect(badAddr.error).toBe('invalid_address')
  })

  it('serializes bigint L2 stats safely and caps JSON output size', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.economy = {
      hasBlocks: true,
      topContracts: [],
      recentBlocks: [],
      blobBaseFeeGwei: '0.05',
      l2RollupStats: [
        {
          inbox: '0xff00000000000000000000000000000000008453',
          displayName: 'Base Batcher',
          blobCount: 12,
          estimatedEthWei: 123_456_789_000_000n,
        },
      ],
    }
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const stateManager = createFlatStateManager({ common })
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager,
    })
    const raw = runInvestigationTool(
      'inspect_l2_blobs',
      {},
      { economy, stateManager, chain, spine },
    )
    const parsed = JSON.parse(raw) as { inboxes: Array<{ estimatedEthWei: string }> }
    expect(parsed.inboxes[0]?.estimatedEthWei).toBe('123456789000000')
    expect(raw.length).toBeLessThan(2000)
  })

  it('probes camelCase totalSupply via real EthySandbox with hex gas and decodes uint256', async () => {
    const chain = Mainnet
    const hardfork = Hardfork.Cancun
    const common = new Common({ chain, hardfork })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.phase = 'HEAD_FOLLOWING'
    const blockWindow = new RpcBlockWindowStore(chain, hardfork)
    const sandbox = createEthySandbox({ spine, stateManager, chain, hardfork, blockWindow })
    const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager, sandbox })

    // Runtime bytecode returning uint256(1000): PUSH2 0x03e8, PUSH1 0, MSTORE, PUSH1 32, PUSH1 0, RETURN
    const addrHex = '0x0000000000000000000000000000000000002222' as const
    await stateManager.putCode(
      new Address(hexToBytes(addrHex)),
      hexToBytes('0x6103e860005260206000f3'),
    )
    const out = await probeContractViewLive(addrHex, 'totalSupply', {
      economy,
      stateManager,
      chain,
      sandbox,
      spine,
    })
    expect(out.fn).toBe('totalSupply')
    expect(out.value).toBe('1000')
  })
})
