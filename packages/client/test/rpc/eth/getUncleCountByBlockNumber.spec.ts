import tape from 'tape'
import { BN } from 'ethereumjs-util'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

function createBlockchain() {
  const block = {
    uncleHeaders: ['0x1', '0x2', '0x3'],
  }
  const header = {
    number: new BN('5'),
  }
  return {
    getBlock: () => block,
    getLatestHeader: () => header,
  }
}

const method = 'eth_getUncleCountByBlockNumber'

tape(`${method}: call with valid arguments`, (t) => {
  const mockUncleCount = 3

  const manager = createManager(createClient({ blockchain: createBlockchain() }))
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0x1'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct number'
    if (res.body.result !== mockUncleCount) {
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

  const req = params(method, ['0x5a'])
  const expectRes = (res: any) => {
    const msg = 'should return invalid params'
    if (
      res.body.result.code !== INVALID_PARAMS &&
      res.body.result.message !== 'specified block greater than current height'
    ) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }

  baseRequest(t, server, req, 200, expectRes)
})
