import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { BlobEIP4844Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { hexToBytes, initKZG } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, dummy, params, startRPC } from '../helpers'
import { checkError } from '../util'

try {
  initKZG(kzg, __dirname + '/../../../src/trustedSetups/devnet6.txt')
  // eslint-disable-next-line
} catch {}

const common = Common.custom({ chainId: 1 })
common.setHardfork('cancun')
const mockedTx1 = LegacyTransaction.fromTxData({}).sign(dummy.privKey)
const mockedTx2 = LegacyTransaction.fromTxData({ nonce: 1 }).sign(dummy.privKey)
const mockedBlobTx3 = BlobEIP4844Transaction.fromTxData(
  { nonce: 2, blobsData: ['0x1234'] },
  { common }
).sign(dummy.privKey)
const blockHash = hexToBytes('0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5')
const transactions = [mockedTx1]
const transactions2 = [mockedTx2]

const block = {
  hash: () => blockHash,
  header: {
    number: BigInt(1),
    hash: () => blockHash,
  },
  toJSON: () => ({
    ...Block.fromBlockData({ header: { number: 1 } }).toJSON(),
    transactions: transactions2,
  }),
  transactions: transactions2,
  uncleHeaders: [],
}

function createChain(headBlock = block) {
  const genesisBlockHash = hexToBytes(
    '0xdcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5'
  )
  const genesisBlock = {
    hash: () => genesisBlockHash,
    header: {
      number: BigInt(0),
    },
    toJSON: () => ({ ...Block.fromBlockData({ header: { number: 0 } }).toJSON(), transactions }),
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
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['0x0', false])
    const expectRes = (res: any) => {
      const msg = 'should return a valid block'
      assert.equal(res.body.result.number, '0x0', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with false for second argument', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['0x0', false])
    const expectRes = (res: any) => {
      let msg = 'should return a valid block'
      assert.equal(res.body.result.number, '0x0', msg)
      msg = 'should return only the hashes of the transactions'
      assert.equal(typeof res.body.result.transactions[0], 'string', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with earliest param', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['earliest', false])
    const expectRes = (res: any) => {
      const msg = 'should return the genesis block number'
      assert.equal(res.body.result.number, '0x0', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with latest param', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['latest', false])
    const expectRes = (res: any) => {
      const msg = 'should return a block number'
      assert.equal(res.body.result.number, '0x1', msg)
      assert.equal(
        typeof res.body.result.transactions[0],
        'string',
        'should only include tx hashes'
      )
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with unimplemented pending param', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['pending', true])

    const expectRes = checkError(INVALID_PARAMS, '"pending" is not yet supported')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with non-string block number', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, [10, true])
    const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: argument must be a string')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with invalid block number', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['WRONG BLOCK NUMBER', true])
    const expectRes = checkError(
      INVALID_PARAMS,
      'invalid argument 0: block option must be a valid 0x-prefixed block hash or hex integer, or "latest", "earliest" or "pending"'
    )

    await baseRequest(server, req, 200, expectRes)
  })

  it('call without second parameter', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['0x0'])
    const expectRes = checkError(INVALID_PARAMS, 'missing value for required argument 1')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with invalid second parameter', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())

    const req = params(method, ['0x0', 'INVALID PARAMETER'])
    const expectRes = checkError(INVALID_PARAMS)
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with transaction objects', async () => {
    const manager = createManager(createClient({ chain: createChain() }))
    const server = startRPC(manager.getMethods())
    const req = params(method, ['latest', true])

    const expectRes = (res: any) => {
      assert.equal(typeof res.body.result.transactions[0], 'object', 'should include tx objects')
    }
    await baseRequest(server, req, 200, expectRes)
  })
})

describe('call with block with blob txs', () => {
  it('retrieves a block with a blob tx in it', async () => {
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } })
    const block1 = Block.fromBlockData(
      {
        header: { number: 1, parentHash: genesisBlock.header.hash() },
        transactions: [mockedBlobTx3],
      },
      { common }
    )
    const manager = createManager(createClient({ chain: createChain(block1 as any) }))
    const server = startRPC(manager.getMethods())
    const req = params(method, ['latest', true])

    const expectRes = (res: any) => {
      assert.equal(
        res.body.result.transactions[0].blobVersionedHashes.length,
        1,
        'block body contains a transaction with the blobVersionedHashes field'
      )
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
