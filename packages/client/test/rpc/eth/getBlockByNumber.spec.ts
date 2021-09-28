import { bufferToHex } from 'ethereumjs-util'
import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'
import { checkError } from '../util'

function createBlockchain() {
  const txHash = Buffer.from(
    'c6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
    'hex'
  )
  const transactions = [{ hash: bufferToHex(txHash) }]
  const block = {
    transactions: [
      {
        hash: () => {
          return txHash
        },
      },
    ],
    toJSON: () => ({ number: 1, transactions }),
  }
  return {
    getBlock: () => block,
    getLatestBlock: () => block,
  }
}

const method = 'eth_getBlockByNumber'

tape(`${method}: call with valid arguments`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1', true])
  const expectRes = (res: any) => {
    const msg = 'should return a valid block with a number prop'
    if (typeof res.body.result.number !== 'number') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with false for second argument`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1', false])
  const expectRes = (res: any) => {
    let msg = 'should return a valid block with a number prop'
    if (typeof res.body.result.number !== 'number') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
    msg = 'should return only the hashes of the transactions'
    if (typeof res.body.result.transactions[0] !== 'string') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with earliest param`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['earliest', false])
  const expectRes = (res: any) => {
    const msg = 'should return the genesis block number'
    if (typeof res.body.result.number !== 'number') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with latest param`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['latest', false])
  const expectRes = (res: any) => {
    const msg = 'should return a block number'
    if (typeof res.body.result.number !== 'number') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unimplemented pending param`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['pending', true])

  const expectRes = (res: any) => {
    const msg = 'should return error if block argument is "pending"'
    if (res.body.result.message === '"pending" is not yet supported') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with non-string block number`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, [10, true])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: argument must be a string')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block number`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
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
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid second parameter`, async (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  await baseRequest(t, server, req, 200, expectRes)
})
