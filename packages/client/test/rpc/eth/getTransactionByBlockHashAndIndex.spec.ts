import { createLegacyTx } from '@ethereumjs/tx'
import { assert, describe, it } from 'vitest'

import { powData } from '@ethereumjs/testdata'
import { INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { baseSetup, dummy, getRPCClient, runBlockWithTxs, setupChain } from '../helpers.ts'

const method = 'eth_getTransactionByBlockHashAndIndex'

// build a server with 1 genesis block and one custom block containing 2 txs
async function setUp() {
  const { common, execution, server, chain } = await setupChain(powData, 'pow')
  const txs = [
    createLegacyTx(
      {
        gasLimit: 21000,
        gasPrice: 100,
        nonce: 0,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey),
    createLegacyTx(
      { gasLimit: 21000, gasPrice: 50, nonce: 1, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey),
  ]

  await runBlockWithTxs(chain, execution, txs)
  const rpc = getRPCClient(server)
  return { rpc }
}

describe(method, async () => {
  it('call with valid arguments', async () => {
    const { rpc } = await setUp()

    const mockBlockHash = '0x0d52ca94a881e32dfe40db79623745b29883f4fe2ae23c14d01889bce4c069c0'
    const mockTxHash = '0x13548b649129ad9beb57467a819d24b846fa0aa02a955f6e974541e1ebb8b02c'
    const mockTxIndex = '0x1'

    const res = await rpc.request(method, [mockBlockHash, mockTxIndex])

    assert.strictEqual(res.result.hash, mockTxHash, 'should return the correct tx hash')
  })

  it('call with no argument', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('missing value for required argument 0'))
  })

  it('call with unknown block hash', async () => {
    const { server } = await setupChain(powData, 'pow')
    const rpc = getRPCClient(server)
    const mockBlockHash = '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0'
    const mockTxIndex = '0x1'

    const res = await rpc.request(method, [mockBlockHash, mockTxIndex])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('not found in DB'))
  })

  it('call with invalid block hash', async () => {
    const { rpc } = await baseSetup()

    const mockBlockHash = 'INVALID_BLOCKHASH'
    const mockTxIndex = '0x1'

    const res = await rpc.request(method, [mockBlockHash, mockTxIndex])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('invalid argument 0: hex string without 0x prefix'))
  })

  it('call without tx hash', async () => {
    const { rpc } = await baseSetup()

    const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'

    const res = await rpc.request(method, [mockBlockHash])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('missing value for required argument 1'))
  })

  it('call with invalid tx hash', async () => {
    const { rpc } = await baseSetup()

    const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
    const mockTxIndex = 'INVALID_TXINDEX'
    const res = await rpc.request(method, [mockBlockHash, mockTxIndex])

    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('invalid argument 1: hex string without 0x prefix'))
  })

  it('call with out-of-bound tx hash ', async () => {
    const { rpc } = await baseSetup()

    const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
    const mockTxIndex = '0x10'
    const res = await rpc.request(method, [mockBlockHash, mockTxIndex])

    assert.strictEqual(res.result, null, 'should return null')
  })
})
