const tape = require('tape-catch')
const path = require('path')
const { parse } = require('../../lib/util')

tape('[Util/Parse]', t => {
  t.test('should parse bootnodes', t => {
    t.notOk(parse.bootnodes(), 'handle empty')
    t.deepEquals(parse.bootnodes('10.0.0.1:1234'), [
      {ip: '10.0.0.1', port: '1234'}
    ], 'parse ip:port')
    t.deepEquals(parse.bootnodes('enode://abc@10.0.0.1:1234'), [
      {id: 'abc', ip: '10.0.0.1', port: '1234'}
    ], 'parse url')
    t.deepEquals(parse.bootnodes('10.0.0.1:1234,enode://abc@127.0.0.1:2345'), [
      {ip: '10.0.0.1', port: '1234'},
      {id: 'abc', ip: '127.0.0.1', port: '2345'}
    ], 'parse multiple')
    t.throws(() => parse.bootnodes(10), /not a function/, 'throws error')
    t.end()
  })

  t.test('should parse transports', t => {
    t.deepEquals(parse.transports(['t1']), [{name: 't1', options: {}}], 'parsed transport without options')
    t.deepEquals(parse.transports(['t2:k1=v1,k:k=v2,k3="v3",k4,k5=']), [{
      name: 't2',
      options: { k1: 'v1', 'k:k': 'v2', k3: '"v3"', k4: undefined, k5: '' }
    }], 'parsed transport with options')
    t.end()
  })

  t.test('should parse geth params file', async (t) => {
    const params = await parse.params(path.resolve(__dirname, 'rinkeby.json'))
    const expected = require('./params.json')
    expected.genesis.hash = Buffer.from(expected.genesis.hash)
    expected.genesis.stateRoot = Buffer.from(expected.genesis.stateRoot)
    t.deepEquals(params, expected, 'parsed params correctly')
    t.end()
  })
})
