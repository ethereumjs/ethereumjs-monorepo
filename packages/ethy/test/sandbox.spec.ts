import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { createAddressFromString, createZeroAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEthySandbox } from '../src/evm/sandbox.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function buildSandbox(sm: ReturnType<typeof createFlatStateManager>) {
  const spine = createSpine('sepolia', 11155111n)
  spine.phase = 'HEAD_FOLLOWING'
  spine.headBlockNumber = 1n
  spine.lastVerifiedBlockNumber = 1n
  spine.totalAccountsSynced = 1
  const chain = chainConfigForNetwork('sepolia')
  const hardfork = activeHardfork(chain)
  const blockWindow = new RpcBlockWindowStore(chain, hardfork)
  return createEthySandbox({ spine, stateManager: sm, chain, hardfork, blockWindow })
}

describe('[Ethy/sandbox]: WP-08b overlays', () => {
  it('eth_call returns 0x2a from override bytecode', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const sm = createFlatStateManager({
      common: new Common({ chain, hardfork: activeHardfork(chain) }),
    })
    const sandbox = buildSandbox(sm)
    const to = '0x5555555555555555555555555555555555555555'
    const out = await sandbox.runEthCall(
      { to, data: '0x' },
      { [to]: { code: '0x602a6000526001601ff3' } },
    )
    assert.isUndefined((out as { error?: unknown }).error)
    assert.equal((out as { result: string }).result, '0x2a')
  })

  it('revert is JSON-RPC code 3 with execution reverted', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const sm = createFlatStateManager({
      common: new Common({ chain, hardfork: activeHardfork(chain) }),
    })
    const sandbox = buildSandbox(sm)
    const to = '0x6666666666666666666666666666666666666666'
    const out = await sandbox.runEthCall({ to, data: '0x' }, { [to]: { code: '0x60006000fd' } })
    const err = (out as { error: { code: number; message: string } }).error
    assert.equal(err.code, 3)
    assert.include(err.message, 'execution reverted')
  })

  it('stateOverride balance funds value transfer without touching root', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const sm = createFlatStateManager({
      common: new Common({ chain, hardfork: activeHardfork(chain) }),
    })
    const sandbox = buildSandbox(sm)
    const from = createZeroAddress()
    const to = createAddressFromString('0x7777777777777777777777777777777777777777')
    const out = await sandbox.runEthCall(
      {
        from: from.toString(),
        to: to.toString(),
        value: '0x64',
        data: '0x',
      },
      { [from.toString()]: { balance: '0x1000' } },
    )
    assert.isUndefined((out as { error?: unknown }).error)
    const rootBal = (await sm.getAccount(to))?.balance ?? 0n
    assert.equal(rootBal, 0n)
  })

  it('two sandbox runs use separate overlays on the root', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const sm = createFlatStateManager({
      common: new Common({ chain, hardfork: activeHardfork(chain) }),
    })
    const sandbox = buildSandbox(sm)
    const to = '0x8888888888888888888888888888888888888888'
    const codeA = '0x602a6000526001601ff3'
    const codeB = '0x601b6000526001601ff3'
    const a = await sandbox.runEthCall({ to, data: '0x' }, { [to]: { code: codeA } })
    const b = await sandbox.runEthCall({ to, data: '0x' }, { [to]: { code: codeB } })
    assert.equal((a as { result: string }).result, '0x2a')
    assert.equal((b as { result: string }).result, '0x1b')
  })
})
