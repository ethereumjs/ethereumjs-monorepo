const test = require('tape')
const { toBuffer, intToHex } = require('ethereumjs-util')
const { startRPC, createManager, createNode, params, baseRequest } = require('../helpers')

const method = 'eth_blockNumber'

test(`${method}: call with valid arguments`, t => {
  const mockBlockNumber = 123
  const mockBlockChain = {
    getLatestHeader: () => {
      return Promise.resolve({
        number: toBuffer(mockBlockNumber)
      })
    }
  }
  const manager = createManager(createNode({ blockchain: mockBlockChain }))
  const server = startRPC(manager.getMethods())

  const req = params(method)
  const expectRes = res => {
    t.equal(res.body.result, intToHex(mockBlockNumber))
  }
  baseRequest(t, server, req, 200, expectRes)
})
