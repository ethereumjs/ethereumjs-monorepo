import * as assert from 'assert'
import { keccak, keccak256, sha256, ripemd160, rlphash } from '../src'

describe('keccak', function() {
  it('should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccak(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('keccak256', function() {
  it('should produce a hash (keccak(a, 256) alias)', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccak256(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('keccak without hexprefix', function() {
  it('should produce a hash', function() {
    const msg = '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '22ae1937ff93ec72c4d46ff3e854661e3363440acd6f6e4adf8f1a8978382251'
    const hash = keccak(msg)
    assert.equal(hash.toString('hex'), r)
  })
})

describe('keccak-512', function() {
  it('should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r =
      '36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24'
    const hash = keccak(msg, 512)
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
