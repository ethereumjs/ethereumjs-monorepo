import * as assert from 'assert'
import {
  keccak,
  keccak256,
  keccakFromString,
  keccakFromArray,
  sha256,
  ripemd160,
  rlphash,
  toBuffer,
} from '../src'

describe('keccak', function() {
  it('should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccak(toBuffer(msg))
    assert.equal(hash.toString('hex'), r)
  })
  it('should error if input is not Buffer', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      keccak((<unknown>msg) as Buffer)
    })
  })
})

describe('keccak256', function() {
  it('should produce a hash (keccak(a, 256) alias)', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccak256(toBuffer(msg))
    assert.equal(hash.toString('hex'), r)
  })
})

describe('keccakFromString', function() {
  it('with hexprefix should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccakFromString(msg)
    assert.equal(hash.toString('hex'), r)
  })
  it('without hexprefix should produce a hash', function() {
    const msg = '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '22ae1937ff93ec72c4d46ff3e854661e3363440acd6f6e4adf8f1a8978382251'
    const hash = keccakFromString(msg)
    assert.equal(hash.toString('hex'), r)
  })
  it('should throw if input is not a string', function() {
    const buf = toBuffer('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
    assert.throws(function() {
      keccakFromString((<unknown>buf) as string)
    })
  })
})

describe('keccakFromArray', function() {
  it('should produce a hash', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    const r = 'fba8669bd39e3257e64752758f3a0d3218865a15757c6b0bc48b8ef95bc8bfd5'
    const hash = keccakFromArray(arr)
    assert.equal(hash.toString('hex'), r)
  })
  it('should throw if input is not an array', function() {
    const buf = toBuffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 0])
    assert.throws(function() {
      keccakFromArray((<unknown>buf) as number[])
    })
  })
})

describe('keccak-512', function() {
  it('should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r =
      '36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24'
    const hash = keccak(toBuffer(msg), 512)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('sha256', function() {
  it('should produce a sha256', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '58bbda5e10bc11a32d808e40f9da2161a64f00b5557762a161626afe19137445'
    const hash = sha256(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('ripemd160', function() {
  it('should produce a ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '4bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160(msg, false)
    assert.equal(hash.toString('hex'), r)
  })

  it('should produce a padded ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160(msg, true)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('rlphash', function() {
  it('should produce a keccak-256 hash of the rlp data', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '33f491f24abdbdbf175e812b94e7ede338d1c7f01efb68574acd279a15a39cbe'
    const hash = rlphash(msg)
    assert.equal(hash.toString('hex'), r)
  })
})
