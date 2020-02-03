import assert = require('assert')

import * as BN_export from 'bn.js'
import * as rlp_export from 'rlp'
import * as secp256k1_export from 'secp256k1'

const ethjsUtil = require('ethjs-util')

import * as src from '../src'

describe('externals', function() {
  it('should export `BN`', function() {
    assert.equal(src.BN, BN_export)
  })

  it('should export `rlp`', function() {
    assert.equal(src.rlp, rlp_export)
  })

  it('should export `scep256k1`', function() {
    assert.equal(src.secp256k1, secp256k1_export)
  })

  it('should have `ethjs-util` methods', function() {
    for (const property in ethjsUtil) {
      assert.ok(src.hasOwnProperty(property))
    }
  })
})
