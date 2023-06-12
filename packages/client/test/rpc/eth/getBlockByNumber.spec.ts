import { Block } from '@ethereumjs/block'
import { Transaction } from '@ethereumjs/tx'
import { hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, dummy, params, startRPC } from '../helpers'
import { checkError } from '../util'

const mockedTx1 = Transaction.fromTxData({}).sign(dummy.privKey)
const mockedTx2 = Transaction.fromTxData({ nonce: 1 }).sign(dummy.privKey)

function createChain() {
  const genesisBlockHash = hexStringToBytes(
    'dcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5'
  )
  const blockHash = hexStringToBytes(
    'dcf93da321b27bca12087d6526d2c10540a4c8dc29db1b36610c3004e0e5d2d5'
  )
  const transactions = [mockedTx1]
  const transactions2 = [mockedTx2]
  const genesisBlock = {
    hash: () => genesisBlockHash,
    header: {
      number: BigInt(0),
    },
    toJSON: () => ({ ...Block.fromBlockData({ header: { number: 0 } }).toJSON(), transactions }),
    transactions,
    uncleHeaders: [],
  }
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
  return {
    blocks: { latest: block },
    getBlock: () => genesisBlock,
    getCanonicalHeadBlock: () => block,
    getCanonicalHeadHeader: () => block.header,
    getTd: () => BigInt(0),
  }
}

const method = 'eth_getBlockByNumber'

tape(`${method}: call with valid arguments`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0', false])
  const expectRes = (res: any) => {
    const msg = 'should return a valid block'
    t.equal(res.body.result.number, '0x0', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with false for second argument`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0', false])
  const expectRes = (res: any) => {
    let msg = 'should return a valid block'
    t.equal(res.body.result.number, '0x0', msg)
    msg = 'should return only the hashes of the transactions'
    t.equal(typeof res.body.result.transactions[0], 'string', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with earliest param`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['earliest', false])
  const expectRes = (res: any) => {
    const msg = 'should return the genesis block number'
    t.equal(res.body.result.number, '0x0', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with latest param`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['latest', false])
  const expectRes = (res: any) => {
    const msg = 'should return a block number'
    t.equal(res.body.result.number, '0x1', msg)
    t.equal(typeof res.body.result.transactions[0], 'string', 'should only include tx hashes')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unimplemented pending param`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['pending', true])

  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with non-string block number`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [10, true])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: argument must be a string')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block number`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['WRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: block option must be a valid 0x-prefixed block hash or hex integer, or "latest", "earliest" or "pending"'
  )

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without second parameter`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid second parameter`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with transaction objects`, async (t) => {
  const manager = createManager(createClient({ chain: createChain() }))
  const server = startRPC(manager.getMethods())
  const req = params(method, ['latest', true])

  const expectRes = (res: any) => {
    t.equal(typeof res.body.result.transactions[0], 'object', 'should include tx objects')
  }
  await baseRequest(t, server, req, 200, expectRes)
})
