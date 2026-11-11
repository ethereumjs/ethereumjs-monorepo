import { createBlockHeader } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  accountToBinaryAccount,
  bytesToHex,
  createAccount,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { type RpcHandlerContext, dispatchRpcMethod } from '../src/rpc/methods.ts'
import { startJsonRpcServer } from '../src/rpc/server.ts'
import { WP08B_STUB_MESSAGE } from '../src/rpc/types.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function buildCtx(sm: ReturnType<typeof createFlatStateManager>): RpcHandlerContext {
  const spine = createSpine('sepolia', 11155111n)
  spine.phase = 'HEAD_FOLLOWING'
  spine.headBlockNumber = 100n
  spine.lastVerifiedBlockNumber = 100n
  spine.totalAccountsSynced = 1
  const chain = chainConfigForNetwork('sepolia')
  const hardfork = activeHardfork(chain)
  return {
    spine,
    stateManager: sm,
    chain,
    hardfork,
    demo: false,
    blockWindow: new RpcBlockWindowStore(chain, hardfork),
  }
}

async function postJson(port: number, body: unknown): Promise<unknown> {
  const res = await fetch(`http://127.0.0.1:${port}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

describe('[Ethy/JSON-RPC]: WP-08a server', () => {
  it('eth_chainId and execution stubs over HTTP', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const chain = chainConfigForNetwork('sepolia')
    const handle = await startJsonRpcServer({
      spine,
      stateManager: createFlatStateManager({
        common: new Common({ chain, hardfork: activeHardfork(chain) }),
      }),
      chain,
      hardfork: activeHardfork(chain),
      demo: true,
      host: '127.0.0.1',
      port: 0,
      portExplicit: true,
    })
    assert.isDefined(handle)
    assert.isDefined(spine.rpc?.port)
    const port = spine.rpc!.port
    const chainId = (await postJson(port, {
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
      id: 1,
    })) as { result: string }
    assert.equal(chainId.result, '0xaa36a7')
    const stub = (await postJson(port, {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [],
      id: 2,
    })) as { error: { code: number; message: string } }
    assert.equal(stub.error.code, -32601)
    assert.include(stub.error.message, WP08B_STUB_MESSAGE)
    await handle!.stop()
  })

  it('eth_getBalance reads flat state at head', async () => {
    const sm = createFlatStateManager()
    const addr = createAddressFromString('0x1111111111111111111111111111111111111111')
    const accountHash = keccak_256(addr.bytes)
    sm.putSnapBinaryAccountsBatch([
      {
        accountHash,
        binaryAccount: accountToBinaryAccount(createAccount({ balance: 42n })),
        address: addr,
      },
    ])
    const ctx = buildCtx(sm)
    const out = await dispatchRpcMethod(ctx, 'eth_getBalance', [addr.toString(), 'latest'])
    assert.equal(out.result, '0x2a')
  })

  it('eth_getStorageAt uses coldStorageLookup', async () => {
    const addr = createAddressFromString('0x2222222222222222222222222222222222222222')
    const accountHash = keccak_256(addr.bytes)
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const slotHash = keccak_256(slot)
    const value = setLengthLeft(hexToBytes('0xbeef'), 32)
    let lookups = 0
    const sm = createFlatStateManager({
      coldAccountLookup: (h) => {
        if (bytesToHex(h) === bytesToHex(accountHash)) {
          return accountToBinaryAccount(createAccount({}))
        }
        return undefined
      },
      coldStorageLookup: (a, s) => {
        lookups++
        if (bytesToHex(a) === bytesToHex(accountHash) && bytesToHex(s) === bytesToHex(slotHash)) {
          return value
        }
        return undefined
      },
    })
    const ctx = buildCtx(sm)
    const out = await dispatchRpcMethod(ctx, 'eth_getStorageAt', [
      addr.toString(),
      bytesToHex(slot),
      'latest',
    ])
    assert.strictEqual(lookups, 1)
    assert.equal(out.result, `0x${bytesToHex(value).slice(2).padStart(64, '0')}`)
  })

  it('historical state tag returns -32000', async () => {
    const ctx = buildCtx(createFlatStateManager())
    const out = await dispatchRpcMethod(ctx, 'eth_getBalance', [
      '0x1111111111111111111111111111111111111111',
      '0x63',
    ])
    assert.equal(out.error?.code, -32000)
  })

  it('eth_getBlockByNumber returns null outside window', async () => {
    const ctx = buildCtx(createFlatStateManager())
    const out = await dispatchRpcMethod(ctx, 'eth_getBlockByNumber', ['0x1', false])
    assert.isNull(out.result)
  })

  it('noteBundle indexes block for RPC window', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain, hardfork })
    const header = createBlockHeader({ number: 50n, gasLimit: 30_000_000n }, { common })
    const headerRlp = header.serialize()
    const ctx = buildCtx(createFlatStateManager())
    ctx.blockWindow.noteBundle({ blockNumber: 50n, headerRlp })
    const out = await dispatchRpcMethod(ctx, 'eth_getBlockByNumber', ['0x32', false])
    assert.isObject(out.result)
    assert.equal((out.result as { number: string }).number, '0x32')
  })
})
