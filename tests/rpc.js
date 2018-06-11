const test = require('tape')
const sinon = require('sinon')
const Manager = require('../lib/rpc/rpc-manager')

test('eth_getBlockByNumber', t => {
  const block = {
    toJSON: sinon.stub().returns({})
  }
  const blockchain = {
    getBlock: sinon.stub().yields(null, block)
  }
  const manager = new Manager(blockchain)
  const req = {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['0x1', true],
    id: 1
  }

  t.false(blockchain.getBlock.called)
  manager.execute(req, (err, block) => {
    t.error(err)
    t.true(blockchain.getBlock.called)
    t.equal(blockchain.getBlock.firstCall.args[0], 1)
    t.end()
  })
})
