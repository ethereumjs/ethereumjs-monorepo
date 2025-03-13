import { createBlock } from '@ethereumjs/block'
import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createBlob4844Tx, createLegacyTx } from '@ethereumjs/tx'
import { createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { createClient, createManager, dummy, getRPCClient, startRPC } from '../helpers.ts'
const kzg = new microEthKZG(trustedSetup)

const common = createCustomCommon({ chainId: 1 }, Mainnet, { customCrypto: { kzg } })

common.setHardfork('cancun')
const mockedTx1 = createLegacyTx({}).sign(dummy.privKey)
const mockedTx2 = createLegacyTx({ nonce: 1 }).sign(dummy.privKey)
const mockedBlobTx3 = createBlob4844Tx(
  { nonce: 2, blobsData: ['0x1234'], to: createZeroAddress() },
  { common },
).sign(dummy.privKey)
const blockHash = hexToBytes('0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5')
const transactions = [mockedTx1]
const transactions2 = [mockedTx2]

const block = {
  hash: () => blockHash,
  serialize: () => createBlock({ header: { number: 1 }, transactions: transactions2 }).serialize(),
  header: {
    number: BigInt(1),
    hash: () => blockHash,
  },
  toJSON: () => ({
    ...createBlock({ header: { number: 1 } }).toJSON(),
    transactions: transactions2,
  }),
  transactions: transactions2,
  uncleHeaders: [],
}

function createChain(headBlock = block) {
  const genesisBlockHash = hexToBytes(
    '0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5',
  )
  const genesisBlock = {
    hash: () => genesisBlockHash,
    serialize: () => createBlock({ header: { number: 0 }, transactions }).serialize(),
    header: {
      number: BigInt(0),
    },
    toJSON: () => ({
      ...createBlock({ header: { number: 0 } }).toJSON(),
      transactions,
    }),
    transactions,
    uncleHeaders: [],
  }
  const block = headBlock
  return {
    blocks: { latest: block },
    getBlock: () => genesisBlock,
    getCanonicalHeadBlock: () => block,
    getCanonicalHeadHeader: () => block.header,
    getTd: () => BigInt(0),
  }
}

const method = 'eth_getBlockByNumber'

describe(method, async () => {
  it('call with valid arguments', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x0', false])
    assert.equal(res.result.number, '0x0', 'should return a valid block')
  })

  it('call with false for second argument', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x0', false])
    assert.equal(res.result.number, '0x0', 'should return a valid block')
    assert.equal(
      typeof res.result.transactions[0],
      'string',
      'should return only the hashes of the transactions',
    )
  })

  it('call with earliest param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['earliest', false])
    assert.equal(res.result.number, '0x0', 'should return the genesis block number')
  })

  it('call with latest param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['latest', false])
    assert.equal(res.result.number, '0x1', 'should return a block number')
    assert.equal(typeof res.result.transactions[0], 'string', 'should only include tx hashes')
  })

  it('call with unimplemented pending param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['pending', true])

    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })

  it('call with non-string block number', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [10, true])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: argument must be a string'))
  })

  it('call with invalid block number', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['WRONG BLOCK NUMBER', true])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes(
        'invalid argument 0: block option must be a valid 0x-prefixed block hash or hex integer, or "latest", "earliest" or "pending"',
      ),
    )
  })

  it('call without second parameter', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x0'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('missing value for required argument 1'))
  })

  it('call with invalid second parameter', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x0', 'INVALID PARAMETER'])
    assert.equal(res.error.code, INVALID_PARAMS)
  })

  it('call with transaction objects', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    const res = await rpc.request(method, ['latest', true])

    assert.equal(typeof res.result.transactions[0], 'object', 'should include tx objects')
  })

  describe('call with block with blob txs', () => {
    it('retrieves a block with a blob tx in it', async () => {
      const genesisBlock = createBlock({ header: { number: 0 } })
      const block1 = createBlock(
        {
          header: { number: 1, parentHash: genesisBlock.header.hash() },
          transactions: [mockedBlobTx3],
        },
        { common },
      )
      const manager = createManager(await createClient({ chain: createChain(block1 as any) }))
      const rpc = getRPCClient(startRPC(manager.getMethods()))
      const res = await rpc.request(method, ['latest', true])

      assert.equal(
        res.result.transactions[0].blobVersionedHashes.length,
        1,
        'block body contains a transaction with the blobVersionedHashes field',
      )
    })
  })
})
