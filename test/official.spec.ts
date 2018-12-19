import * as assert from 'assert'
import * as RLP from '../src'
const BN = require('bn.js')
const testing = require('ethereumjs-testing')

describe('offical tests', function() {
  const officalTests = testing.getSingleFile('RLPTests/rlptest.json')

  for (const testName in officalTests) {
    it(`should pass ${testName}`, function(done) {
      let incoming = officalTests[testName].in
      // if we are testing a big number
      if (incoming[0] === '#') {
        const bn = new BN(incoming.slice(1))
        incoming = Buffer.from(bn.toArray())
      }

      const encoded = RLP.encode(incoming)
      assert.equal(encoded.toString('hex'), officalTests[testName].out.toLowerCase())
      done()
    })
  }
})
