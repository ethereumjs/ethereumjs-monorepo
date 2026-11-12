import { createBlockHeader } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import {
  accountToBinaryAccount,
  bytesToHex,
  createAccount,
  createAddressFromString,
  hexToBytes,
  intToUnpaddedBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { getCommandAvailability } from '../src/domains/commandAvailability.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { type RpcHandlerContext, dispatchRpcMethod } from '../src/rpc/methods.ts'
import { startJsonRpcServer } from '../src/rpc/server.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { rpcGroupRows, rpcMicroscopeWidget } from '../src/tools/rpcTools.ts'

function buildCtx(sm: ReturnType<typeof createFlatStateManager>): RpcHandlerContext {
  const spine = createSpine('sepolia', 11155111n)
  spine.phase = 'HEAD_FOLLOWING'
  spine.headBlockNumber = 100n
  spine.lastVerifiedBlockNumber = 100n
  spine.totalAccountsSynced = 1
  const chain = chainConfigForNetwork('sepolia')
  const hardfork = activeHardfork(chain)
  const blockWindow = new RpcBlockWindowStore(chain, hardfork)
  const sandbox = createEthySandbox({
    spine,
    stateManager: sm,
    chain,
    hardfork,
    blockWindow,
  })
  return {
    spine,
    stateManager: sm,
    chain,
    hardfork,
    demo: false,
    blockWindow,
    sandbox,
  }
}

async function postJSON(port: number, body: unknown): Promise<unknown> {
  const res = await fetch(`http://127.0.0.1:${port}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

describe('[Ethy/JSON-RPC]: WP-08a server', () => {
  it('eth_chainId and eth_call over HTTP', async () => {
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
    const chainId = (await postJSON(port, {
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
      id: 1,
    })) as { result: string }
    assert.equal(chainId.result, '0xaa36a7')
    const to = '0x5555555555555555555555555555555555555555'
    const call = (await postJSON(port, {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to, data: '0x' }, 'latest', { [to]: { code: '0x602a6000526001601ff3' } }],
      id: 2,
    })) as { result: string }
    assert.equal(call.result, '0x2a')
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

  it('batch requests, empty batch error, tx/receipt/log decoding, and command availability', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain, hardfork })
    const pk = hexToBytes('0x0101010101010101010101010101010101010101010101010101010101010101')
    const tx1 = createLegacyTx(
      {
        nonce: 0n,
        gasPrice: 1_000_000_000n,
        gasLimit: 21_000n,
        to: '0x3333333333333333333333333333333333333333',
        value: 100n,
      },
      { common },
    ).sign(pk)
    const tx2 = createFeeMarket1559Tx(
      {
        nonce: 1n,
        maxFeePerGas: 2_000_000_000n,
        maxPriorityFeePerGas: 1_000_000_000n,
        gasLimit: 50_000n,
        to: '0x4444444444444444444444444444444444444444',
        data: '0xa9059cbb',
      },
      { common },
    ).sign(pk)

    const header = createBlockHeader(
      { number: 100n, gasLimit: 30_000_000n, gasUsed: 71_000n, baseFeePerGas: 1_000_000_000n },
      { common },
    )
    const bodyRlp = RLP.encode([[tx1.raw(), tx2.serialize()], [], []])
    const topic0 = keccak_256(new Uint8Array([1, 2, 3]))
    const logAddr = hexToBytes('0x4444444444444444444444444444444444444444')
    // eth/69 4-tuple receipts: [txType, status, cumulativeGas, logs]
    // tx1 succeeds (status 1), tx2 reverts (status 0 = empty bytes)
    const receiptsEth69Rlp = RLP.encode([
      [
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(1),
        intToUnpaddedBytes(21_000),
        [[logAddr, [topic0], hexToBytes('0xdead')]],
      ],
      [intToUnpaddedBytes(2), new Uint8Array(0), intToUnpaddedBytes(71_000), []],
    ])

    const ctx = buildCtx(createFlatStateManager({ common }))
    ctx.blockWindow.noteBundle({
      blockNumber: 100n,
      headerRlp: header.serialize(),
      bodyRlp,
      receiptsEth69Rlp,
    })

    const tx1Hash = bytesToHex(tx1.hash())
    const tx2Hash = bytesToHex(tx2.hash())
    const txOut = await dispatchRpcMethod(ctx, 'eth_getTransactionByHash', [tx1Hash])
    const txObj = txOut.result as Record<string, string>
    assert.equal(txObj.hash.toLowerCase(), tx1Hash.toLowerCase())
    assert.equal(txObj.gas, '0x5208')
    assert.equal(txObj.input, '0x')

    const rc1 = (await dispatchRpcMethod(ctx, 'eth_getTransactionReceipt', [tx1Hash]))
      .result as Record<string, unknown>
    assert.equal(rc1.status, '0x1')
    assert.equal(rc1.gasUsed, '0x5208')
    assert.lengthOf(rc1.logs as unknown[], 1)

    const rc2 = (await dispatchRpcMethod(ctx, 'eth_getTransactionReceipt', [tx2Hash]))
      .result as Record<string, unknown>
    assert.equal(rc2.status, '0x0')
    assert.equal(rc2.gasUsed, '0xc350')

    const logsOut = await dispatchRpcMethod(ctx, 'eth_getLogs', [
      { fromBlock: '0x64', toBlock: '0x64', topics: [bytesToHex(topic0)] },
    ])
    assert.lengthOf(logsOut.result as unknown[], 1)

    // EIP-1898 block object tag at head
    const balOut = await dispatchRpcMethod(ctx, 'eth_getBalance', [
      '0x3333333333333333333333333333333333333333',
      { blockNumber: '0x64' },
    ])
    assert.equal(balOut.result, '0x0')

    // Command availability: /peers stays ready even when RPC is not listening
    assert.equal(getCommandAvailability('/peers', ctx.spine).status, 'ready')
    assert.equal(getCommandAvailability('/buckets', ctx.spine).status, 'ready')
    assert.equal(getCommandAvailability('/rpc', ctx.spine).status, 'ready')

    // HTTP batch and empty batch
    const handle = await startJsonRpcServer({
      spine: ctx.spine,
      stateManager: ctx.stateManager,
      chain,
      hardfork,
      demo: true,
      host: '127.0.0.1',
      port: 0,
      portExplicit: true,
    })
    const port = ctx.spine.rpc!.port
    const batchRes = (await postJSON(port, [
      { jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 },
      { jsonrpc: '2.0', method: 'net_version', params: [], id: 2 },
    ])) as Array<{ id: number; result: string }>
    assert.lengthOf(batchRes, 2)
    assert.equal(batchRes[0]!.result, '0xaa36a7')
    assert.equal(batchRes[1]!.result, '11155111')

    const emptyBatch = (await postJSON(port, [])) as { error: { code: number } }
    assert.equal(emptyBatch.error.code, -32600)
    await handle!.stop()
  })
})

describe('[Ethy/RPC]: method matrix widget', () => {
  it('rpcGroupRows() lists seven groups with off status when not listening', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.rpc = {
      enabled: true,
      listening: false,
      host: '127.0.0.1',
      port: 8545,
      url: '(not listening)',
      totalRequests: 0,
      totalErrors: 0,
      methodStats: {},
      recentCalls: [],
    }
    const rows = rpcGroupRows(spine)
    assert.lengthOf(rows, 7)
    assert.include(
      rows.map((r) => r.label),
      'Chain & Net',
    )
    assert.include(
      rows.map((r) => r.label),
      'Tx Broadcast',
    )
    for (const row of rows) {
      assert.include(row.statusDisplay, 'off')
      assert.equal(row.calls, 0)
    }
  })

  it('rpcMicroscopeWidget() warms head state and tx broadcast when listening without peers', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.rpc = {
      enabled: true,
      listening: true,
      host: '127.0.0.1',
      port: 8545,
      url: 'http://127.0.0.1:8545',
      totalRequests: 0,
      totalErrors: 0,
      methodStats: {},
      recentCalls: [],
    }
    const groups = rpcGroupRows(spine)
    const chain = groups.find((g) => g.label === 'Chain & Net')!
    const head = groups.find((g) => g.label === 'Head State')!
    const fee = groups.find((g) => g.label === 'Fee Oracle')!
    const tx = groups.find((g) => g.label === 'Tx Broadcast')!
    assert.include(chain.statusDisplay, 'active')
    assert.include(head.statusDisplay, 'warming')
    assert.include(fee.statusDisplay, 'awaiting')
    assert.include(tx.statusDisplay, 'no peers')

    const w = rpcMicroscopeWidget(spine)
    assert.equal(w.kind, 'table')
    if (w.kind === 'table') {
      assert.lengthOf(w.rows, 7)
    }
  })
})
