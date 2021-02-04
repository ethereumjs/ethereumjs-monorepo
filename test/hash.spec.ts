import assert from 'assert'
import {
  keccak,
  keccak256,
  keccakFromString,
  keccakFromHexString,
  keccakFromArray,
  sha256,
  sha256FromString,
  sha256FromArray,
  ripemd160,
  ripemd160FromString,
  ripemd160FromArray,
  rlphash,
  toBuffer
} from '../src'

describe('keccak', function() {
  it('should produce a keccak224 hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '9e66938bd8f32c8610444bb524630db496bd58b689f9733182df63ba'
    const hash = keccak(toBuffer(msg), 224)
    assert.equal(hash.toString('hex'), r)
  })
  it('should produce a keccak256 hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccak(toBuffer(msg))
    assert.equal(hash.toString('hex'), r)
  })
  it('should produce a keccak384 hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r =
      '923e0f6a1c324a698139c3f3abbe88ac70bf2e7c02b26192c6124732555a32cef18e81ac91d5d97ce969745409c5bbc6'
    const hash = keccak(toBuffer(msg), 384)
    assert.equal(hash.toString('hex'), r)
  })
  it('should produce a keccak512 hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r =
      '36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24'
    const hash = keccak(toBuffer(msg), 512)
    assert.equal(hash.toString('hex'), r)
  })
  it('should error if input is not Buffer', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      keccak((<unknown>msg) as Buffer)
    })
  })
  it('should error if provided incorrect bits', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      keccak(toBuffer(msg), 1024)
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
  it('should produce a hash', function() {
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

describe('keccakFromHexString', function() {
  it('should produce a hash', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
    const hash = keccakFromHexString(msg)
    assert.equal(hash.toString('hex'), r)
  })
  it('should throw if input is not hex-prefixed', function() {
    const msg = '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      keccakFromHexString(msg)
    })
  })
  it('should throw if input is not a string', function() {
    const buf = toBuffer('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
    assert.throws(function() {
      keccakFromHexString((<unknown>buf) as string)
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
    const hash = sha256(toBuffer(msg))
    assert.equal(hash.toString('hex'), r)
  })
  it('should error if input is not Buffer', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      sha256((<unknown>msg) as Buffer)
    })
  })
})

describe('sha256FromString', function() {
  it('should produce a sha256', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '58bbda5e10bc11a32d808e40f9da2161a64f00b5557762a161626afe19137445'
    const hash = sha256FromString(msg)
    assert.equal(hash.toString('hex'), r)
  })
  it('should error if input is not Buffer', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      sha256FromString((<unknown>toBuffer(msg)) as string)
    })
  })
})

describe('sha256FromArray', function() {
  it('should produce a sha256', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    const r = '5443c487d45d01c56150d91e7a071c69a97939b1c57874b73989a9ff7875e86b'
    const hash = sha256FromArray(arr)
    assert.equal(hash.toString('hex'), r)
  })
  it('should error if input is not Buffer', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    assert.throws(function() {
      sha256FromArray((<unknown>toBuffer(arr)) as number[])
    })
  })
})

describe('ripemd160', function() {
  it('should produce a ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '4bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160(toBuffer(msg), false)
    assert.equal(hash.toString('hex'), r)
  })

  it('should produce a padded ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160(toBuffer(msg), true)
    assert.equal(hash.toString('hex'), r)
  })

  it('should error if input is not Buffer', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      ripemd160((<unknown>msg) as Buffer, false)
    })
  })
})

describe('ripemd160FromString', function() {
  it('should produce a ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '4bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160FromString(msg, false)
    assert.equal(hash.toString('hex'), r)
  })

  it('should produce a padded ripemd160', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    const r = '0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd'
    const hash = ripemd160FromString(msg, true)
    assert.equal(hash.toString('hex'), r)
  })

  it('should error if input is not a string', function() {
    const msg = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
    assert.throws(function() {
      ripemd160FromString((<unknown>toBuffer(msg)) as string, false)
    })
  })
})

describe('ripemd160FromArray', function() {
  it('should produce a ripemd160', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    const r = 'ddbb5062318b209e3dbfc389fe61840363050071'
    const hash = ripemd160FromArray(arr, false)
    assert.equal(hash.toString('hex'), r)
  })

  it('should produce a padded ripemd160', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    const r = '000000000000000000000000ddbb5062318b209e3dbfc389fe61840363050071'
    const hash = ripemd160FromArray(arr, true)
    assert.equal(hash.toString('hex'), r)
  })

  it('should error if input is not an array', function() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
    assert.throws(function() {
      ripemd160FromArray((<unknown>toBuffer(arr)) as number[], false)
    })
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
