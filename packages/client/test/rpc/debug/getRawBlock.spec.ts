import { createBlock, createHeader } from '@ethereumjs/block'
import { createCustomCommon } from '@ethereumjs/common'
import { create4844BlobTx, createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, dummy, getRpcClient, startRPC } from '../helpers.js'

const kzg = await loadKZG()

const common = createCustomCommon({ chainId: 1 }, { customCrypto: { kzg } })

common.setHardfork('cancun')
const mockedTx1 = createLegacyTx({}).sign(dummy.privKey)
const mockedTx2 = createLegacyTx({ nonce: 1 }).sign(dummy.privKey)
const mockedBlobTx3 = create4844BlobTx(
  { nonce: 2, blobsData: ['0x1234'], to: createZeroAddress() },
  { common },
).sign(dummy.privKey)
const blockHash = hexToBytes('0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5')
const transactions = [mockedTx1]
const transactions2 = [mockedTx2]

const block = {
  hash: () => blockHash,
  header: {
    number: BigInt(1),
    hash: () => blockHash,
    serialize: () => createHeader({ number: 1 }).serialize(),
  },
  toJSON: () => ({
    ...createBlock({ header: { number: 1 } }).toJSON(),
    transactions: transactions2,
  }),
  serialize: () => createBlock({ header: { number: 1 }, transactions: transactions2 }).serialize(),
  transactions: transactions2,
  uncleHeaders: [],
}

const genesisBlockHash = hexToBytes(
  '0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5',
)
const genesisBlock = {
  hash: () => genesisBlockHash,
  header: {
    number: BigInt(0),
  },
  toJSON: () => ({ ...createBlock({ header: { number: 0 } }).toJSON(), transactions }),
  serialize: () => createBlock({ header: { number: 0 }, transactions }).serialize(),
  transactions,
  uncleHeaders: [],
}
function createChain(headBlock = block) {
  const block = headBlock
  return {
    blocks: { latest: block },
    getBlock: () => genesisBlock,
    getCanonicalHeadBlock: () => block,
    getCanonicalHeadHeader: () => block.header,
    getTd: () => BigInt(0),
  }
}

const method = 'debug_getRawBlock'

describe(method, async () => {
  it('call with valid arguments', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0x0'])
    assert.equal(res.result, bytesToHex(genesisBlock.serialize()), 'should return a valid block')
  })

  it('call with earliest param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['earliest'])
    assert.equal(
      res.result,
      bytesToHex(genesisBlock.serialize()),
      'should return the genesis block as earliest',
    )
  })

  it('call with latest param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['latest'])
    assert.equal(res.result, bytesToHex(block.serialize()), 'should return block 1 RLP')
  })

  it('call with unimplemented pending param', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))
    const res = await rpc.request(method, ['pending'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })

  it('call with non-string block number', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))
    const res = await rpc.request(method, [10])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: argument must be a string'))
  })

  it('call with invalid block number', async () => {
    const manager = createManager(await createClient({ chain: createChain() }))
    const rpc = getRpcClient(startRPC(manager.getMethods()))
    const res = await rpc.request(method, ['WRONG BLOCK NUMBER'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes(
        'invalid argument 0: block option must be a valid 0x-prefixed block hash or hex integer, or "latest", "earliest" or "pending"',
      ),
    )
  })
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
    const rpc = getRpcClient(startRPC(manager.getMethods()))
    const res = await rpc.request(method, ['latest'])

    assert.equal(
      res.result,
      bytesToHex(block1.serialize()),
      'block body contains a transaction with the blobVersionedHashes field',
    )
  })
})
