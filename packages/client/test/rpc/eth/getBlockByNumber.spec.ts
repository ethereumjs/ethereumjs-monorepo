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
  }
}

const method = 'eth_getBlockByNumber'

tape(`${method}: call with valid arguments`, (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1', true])
  const expectRes = (res: any) => {
    const msg = 'should return the correct number'
    if (res.body.result.number !== 1) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with false for second argument`, (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1', false])
  const expectRes = (res: any) => {
    let msg = 'should return the correct number'
    if (res.body.result.number !== 1) {
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
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block number`, (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['WRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without second parameter`, (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid second parameter`, (t) => {
  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  baseRequest(t, server, req, 200, expectRes)
})
