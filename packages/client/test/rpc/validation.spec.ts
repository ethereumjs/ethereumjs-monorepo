import { bytesToHex, bytesToUnprefixedHex, randomBytes } from '@ethereumjs/util'
import { Client } from 'jayson/promise'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../src/rpc/error-code'
import { middleware, validators } from '../../src/rpc/validation'

import { startRPC } from './helpers'

import type { AddressInfo } from 'node:net'

const prefix = 'rpc/validation:'

describe(prefix, () => {
  it('should work without `params` when it is optional', async () => {
    const mockMethodName = 'mock'
    const server = startRPC({
      [mockMethodName]: middleware((_params: any) => true, 0, []),
    })
    const rpc = Client.http({ port: (server.address()! as AddressInfo).port })

    const res = await rpc.request(mockMethodName, [])
    assert.isUndefined(res.error, 'should not return an error object')
  })

  it('should return error without `params` when it is required', async () => {
    const mockMethodName = 'mock'
    const server = startRPC({
      [mockMethodName]: middleware((_params: any) => true, 1, []),
    })
    const rpc = Client.http({ port: (server.address()! as AddressInfo).port })

    const res = await rpc.request(mockMethodName, [])

    assert.equal(res.error.code, INVALID_PARAMS, 'missing value for required argument 0')
  })

  const validatorResult = (result: Object | undefined) => {
    // result is valid if validator returns undefined
    // result is invalid if validator returns object
    return result === undefined ? true : false
  }

  const bytes = (byteLength: number, prefix: boolean = true) => {
    return prefix ? '0x'.padEnd(byteLength * 2 + 2, '0') : ''.padEnd(byteLength * 2, '0')
  }
  const badhex = (byteLength: number) => {
    return '0x'.padEnd(byteLength * 2 + 2, 'G')
  }

  it('address', () => {
    // valid
    // zero address
    assert.ok(
      validatorResult(validators.address(['0x0000000000000000000000000000000000000000'], 0))
    )
    // lowercase address
    assert.ok(
      validatorResult(validators.address(['0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'], 0))
    )
    // checksummed address
    assert.ok(
      validatorResult(validators.address(['0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270'], 0))
    )

    // invalid
    assert.notOk(validatorResult(validators.address(['0x'], 0)))
    assert.notOk(validatorResult(validators.address(['0x0'], 0)))
    assert.notOk(validatorResult(validators.address(['0x00'], 0)))
    assert.notOk(validatorResult(validators.address(['0x1'], 0)))
    // invalid length: 38 chars
    assert.notOk(
      validatorResult(validators.address(['0x00000000000000000000000000000000000000'], 0))
    )
    // invalidlength: 39 chars
    assert.notOk(
      validatorResult(validators.address(['0x000000000000000000000000000000000000000'], 0))
    )
    // invalidlength: 41 chars
    assert.notOk(
      validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0))
    )
    // invalid length: 42 chars
    assert.notOk(
      validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0))
    )
    // invalid character
    assert.notOk(
      validatorResult(validators.address(['0x62223651d6a33d58be70eb9876c3caf7096169ez'], 0))
    )
    assert.ok(validatorResult(validators.bytes8([bytesToHex(randomBytes(8))], 0)))
    assert.ok(validatorResult(validators.bytes8([bytes(8)], 0)))
    assert.ok(validatorResult(validators.bytes8([bytes(1)], 0)))
    assert.ok(validatorResult(validators.bytes8([bytes(2)], 0)))
    assert.ok(validatorResult(validators.bytes8([bytes(4)], 0)))
    // invalid
    assert.notOk(validatorResult(validators.bytes8([bytes(10)], 0)))
    assert.notOk(validatorResult(validators.bytes8([bytes(8, false)], 0)))
    assert.notOk(validatorResult(validators.bytes8([bytesToUnprefixedHex(randomBytes(8))], 0)))
  })

  it('Uint64', () => {
    // valid
    assert.ok(validatorResult(validators.uint64([bytesToHex(randomBytes(8))], 0)))
    assert.ok(validatorResult(validators.uint64([bytes(8)], 0)))
    assert.ok(validatorResult(validators.uint64([bytes(1)], 0)))
    assert.ok(validatorResult(validators.uint64([bytes(2)], 0)))
    assert.ok(validatorResult(validators.uint64([bytes(4)], 0)))

    // invalid
    assert.notOk(validatorResult(validators.bytes8([badhex(8)], 0)))
    assert.notOk(validatorResult(validators.uint64([bytes(10)], 0)))
    assert.notOk(validatorResult(validators.uint64([bytes(8, false)], 0)))
    assert.notOk(validatorResult(validators.uint64([bytesToUnprefixedHex(randomBytes(8))], 0)))
  })
  it('Bytes16', () => {
    // valid
    assert.ok(validatorResult(validators.bytes16([bytesToHex(randomBytes(16))], 0)))
    assert.ok(validatorResult(validators.bytes16([bytes(16)], 0)))
    assert.ok(validatorResult(validators.bytes16([bytes(1)], 0)))
    assert.ok(validatorResult(validators.bytes16([bytes(2)], 0)))
    assert.ok(validatorResult(validators.bytes16([bytes(4)], 0)))
    assert.ok(validatorResult(validators.bytes16([bytes(8)], 0)))
    // invalid
    assert.notOk(validatorResult(validators.bytes16([badhex(16)], 0)))
    assert.notOk(validatorResult(validators.bytes16([bytes(20)], 0)))
    assert.notOk(validatorResult(validators.bytes16([bytes(16, false)], 0)))
    assert.notOk(validatorResult(validators.bytes16([bytesToUnprefixedHex(randomBytes(16))], 0)))
  })
  it('Bytes20', () => {
    // valid
    assert.ok(validatorResult(validators.bytes20([bytes(20)], 0)))
    assert.ok(validatorResult(validators.bytes20([bytesToHex(randomBytes(20))], 0)))
    assert.ok(validatorResult(validators.bytes20([bytes(8)], 0)))
    assert.ok(validatorResult(validators.bytes20([bytes(16)], 0)))
    // invalid
    assert.notOk(validatorResult(validators.bytes20([badhex(20)], 0)))
    assert.notOk(validatorResult(validators.bytes20([bytes(20, false)], 0)))
    assert.notOk(validatorResult(validators.bytes20([bytes(32)], 0)))
    assert.notOk(validatorResult(validators.bytes20([bytesToUnprefixedHex(randomBytes(20))], 0)))
  })
  it('Bytes32', () => {
    // valid
    assert.ok(validatorResult(validators.bytes32([bytesToHex(randomBytes(32))], 0)))
    assert.ok(validatorResult(validators.bytes32([bytes(32)], 0)))
    assert.ok(validatorResult(validators.bytes32([bytes(8)], 0)))
    assert.ok(validatorResult(validators.bytes32([bytes(16)], 0)))
    assert.ok(validatorResult(validators.bytes32([bytes(20)], 0)))
    // invalid
    assert.notOk(validatorResult(validators.bytes32([badhex(32)], 0)))
    assert.notOk(validatorResult(validators.bytes32([bytes(48)], 0)))
    assert.notOk(validatorResult(validators.bytes32([bytes(32, false)], 0)))
    assert.notOk(validatorResult(validators.bytes32([bytesToUnprefixedHex(randomBytes(32))], 0)))
  })
  it('Uint256', () => {
    // valid
    assert.ok(validatorResult(validators.uint256([bytesToHex(randomBytes(32))], 0)))
    assert.ok(validatorResult(validators.uint256([bytes(32)], 0)))
    assert.ok(validatorResult(validators.uint256([bytes(8)], 0)))
    assert.ok(validatorResult(validators.uint256([bytes(16)], 0)))
    assert.ok(validatorResult(validators.uint256([bytes(20)], 0)))
    // invalid
    assert.notOk(validatorResult(validators.uint256([badhex(32)], 0)))
    assert.notOk(validatorResult(validators.uint256([bytes(48)], 0)))
    assert.notOk(validatorResult(validators.uint256([bytes(32, false)], 0)))
    assert.notOk(validatorResult(validators.uint256([bytesToUnprefixedHex(randomBytes(32))], 0)))
  })
  it('Bytes48', () => {
    // valid
    assert.ok(validatorResult(validators.bytes48([bytesToHex(randomBytes(48))], 0)))
    assert.ok(validatorResult(validators.bytes48([bytes(48)], 0)))
    assert.ok(validatorResult(validators.bytes48([bytes(8)], 0)))
    assert.ok(validatorResult(validators.bytes48([bytes(16)], 0)))
    assert.ok(validatorResult(validators.bytes48([bytes(20)], 0)))
    assert.ok(validatorResult(validators.bytes48([bytes(32)], 0)))

    // invalid
    assert.notOk(validatorResult(validators.bytes48([badhex(48)], 0)))
    assert.notOk(validatorResult(validators.bytes48([bytes(64)], 0)))
    assert.notOk(validatorResult(validators.bytes48([bytes(48, false)], 0)))
    assert.notOk(validatorResult(validators.bytes48([bytesToUnprefixedHex(randomBytes(48))], 0)))
  })
  it('Bytes256', () => {
    // valid
    assert.ok(validatorResult(validators.bytes256([bytesToHex(randomBytes(256))], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(256)], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(8)], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(16)], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(32)], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(64)], 0)))
    assert.ok(validatorResult(validators.bytes256([bytes(128)], 0)))

    // invalid
    assert.notOk(validatorResult(validators.bytes256([badhex(256)], 0)))
    assert.notOk(validatorResult(validators.bytes256([bytes(512)], 0)))
    assert.notOk(validatorResult(validators.bytes256([bytes(256, false)], 0)))
    assert.notOk(validatorResult(validators.bytes256([bytesToUnprefixedHex(randomBytes(256))], 0)))
  })

  it('unsignedInteger', () => {
    assert.ok(validatorResult(validators.unsignedInteger([0], 0)))
    assert.ok(validatorResult(validators.unsignedInteger([0.0], 0)))
    assert.ok(validatorResult(validators.unsignedInteger([1], 0)))
    assert.ok(validatorResult(validators.unsignedInteger([0x01], 0)))
    assert.ok(validatorResult(validators.unsignedInteger([Number.MAX_SAFE_INTEGER], 0)))

    assert.notOk(validatorResult(validators.unsignedInteger([-1], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.MAX_SAFE_INTEGER + 1], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.MIN_VALUE], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.MAX_VALUE], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.NEGATIVE_INFINITY], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.POSITIVE_INFINITY], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.NaN], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([Number.EPSILON], 0)))

    assert.notOk(validatorResult(validators.unsignedInteger(['1'], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([0.1], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([BigInt(1)], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([{ number: 1 }], 0)))

    assert.notOk(validatorResult(validators.unsignedInteger([null], 0)))
    assert.notOk(validatorResult(validators.unsignedInteger([undefined], 0)))
  })

  it('blockHash', () => {
    // valid
    assert.ok(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
          0
        )
      )
    )
    assert.ok(
      validatorResult(
        validators.blockHash(
          ['0xf79d019c58d58a4efcfdf100c9596dd38014dcec6cf6f52000d4fae4e139b703'],
          0
        )
      )
    )
    // invalid length
    assert.notOk(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2'],
          0
        )
      )
    )
    assert.notOk(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24'],
          0
        )
      )
    )
    assert.notOk(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2499'],
          0
        )
      )
    )
    assert.notOk(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24999'],
          0
        )
      )
    )
    // invalid character
    assert.notOk(
      validatorResult(
        validators.blockHash(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66z249'],
          0
        )
      )
    )
  })

  it('blockOption', () => {
    // valid
    assert.ok(validatorResult(validators.blockOption(['latest'], 0)))
    assert.ok(validatorResult(validators.blockOption(['earliest'], 0)))
    assert.ok(validatorResult(validators.blockOption(['pending'], 0)))
    assert.ok(
      validatorResult(
        validators.blockOption(
          ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
          0
        )
      )
    )
    assert.ok(validatorResult(validators.blockOption(['0x1'], 0)))
    assert.ok(validatorResult(validators.blockOption(['0x01'], 0)))

    // invalid
    assert.notOk(validatorResult(validators.blockOption(['lates'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['arliest'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['pendin'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['0'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['00'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['1'], 0)))
    assert.notOk(validatorResult(validators.blockOption(['11'], 0)))
    assert.notOk(
      validatorResult(
        validators.blockOption(
          ['573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
          0
        )
      )
    )
  })

  it('bool', () => {
    // valid
    assert.ok(validatorResult(validators.bool([true], 0)))
    assert.ok(validatorResult(validators.bool([false], 0)))

    // invalid
    assert.notOk(validatorResult(validators.bool(['true'], 0)))
    assert.notOk(validatorResult(validators.bool(['false'], 0)))
    assert.notOk(validatorResult(validators.bool(['tru'], 0)))
    assert.notOk(validatorResult(validators.bool(['fals'], 0)))
  })

  it('hex', () => {
    // valid
    assert.ok(validatorResult(validators.hex(['0x0'], 0)))
    assert.ok(validatorResult(validators.hex(['0x00'], 0)))
    assert.ok(validatorResult(validators.hex(['0x1'], 0)))

    // invalid
    assert.notOk(validatorResult(validators.hex(['0'], 0)))
    assert.notOk(validatorResult(validators.hex(['00'], 0)))
    assert.notOk(validatorResult(validators.hex(['1'], 0)))
    assert.notOk(validatorResult(validators.hex(['1'], 0)))
  })
  describe('byteVectors', () => {
    const bytes = (byteLength: number, prefix: boolean = true) => {
      return prefix ? '0x'.padEnd(byteLength * 2 + 2, '0') : ''.padEnd(byteLength * 2, '0')
    }
    const badhex = (byteLength: number) => {
      return '0x'.padEnd(byteLength * 2 + 2, 'G')
    }
    it('Bytes8', () => {
      // valid
      assert.ok(validatorResult(validators.bytes8([bytesToHex(randomBytes(8))], 0)))
      assert.ok(validatorResult(validators.bytes8([bytes(8)], 0)))
      assert.ok(validatorResult(validators.bytes8([bytes(1)], 0)))
      assert.ok(validatorResult(validators.bytes8([bytes(2)], 0)))
      assert.ok(validatorResult(validators.bytes8([bytes(4)], 0)))
      // invalid
      assert.notOk(validatorResult(validators.bytes8([bytes(10)], 0)))
      assert.notOk(validatorResult(validators.bytes8([bytes(8, false)], 0)))
    })
    it('Uint64', () => {
      // valid
      assert.ok(validatorResult(validators.uint64([bytesToHex(randomBytes(8))], 0)))
      assert.ok(validatorResult(validators.uint64([bytes(8)], 0)))
      assert.ok(validatorResult(validators.uint64([bytes(1)], 0)))
      assert.ok(validatorResult(validators.uint64([bytes(2)], 0)))
      assert.ok(validatorResult(validators.uint64([bytes(4)], 0)))

      // invalid
      assert.notOk(validatorResult(validators.bytes8([badhex(8)], 0)))
      assert.notOk(validatorResult(validators.uint64([bytes(10)], 0)))
      assert.notOk(validatorResult(validators.uint64([bytes(8, false)], 0)))
    })
    it('Bytes16', () => {
      // valid
      assert.ok(validatorResult(validators.bytes16([bytesToHex(randomBytes(16))], 0)))
      assert.ok(validatorResult(validators.bytes16([bytes(16)], 0)))
      assert.ok(validatorResult(validators.bytes16([bytes(1)], 0)))
      assert.ok(validatorResult(validators.bytes16([bytes(2)], 0)))
      assert.ok(validatorResult(validators.bytes16([bytes(4)], 0)))
      assert.ok(validatorResult(validators.bytes16([bytes(8)], 0)))
      // invalid
      assert.notOk(validatorResult(validators.bytes16([badhex(16)], 0)))
      assert.notOk(validatorResult(validators.bytes16([bytes(20)], 0)))
      assert.notOk(validatorResult(validators.bytes16([bytes(16, false)], 0)))
    })
    it('Bytes20', () => {
      // valid
      assert.ok(validatorResult(validators.bytes20([bytes(20)], 0)))
      assert.ok(validatorResult(validators.bytes20([bytesToHex(randomBytes(20))], 0)))
      assert.ok(validatorResult(validators.bytes20([bytes(8)], 0)))
      assert.ok(validatorResult(validators.bytes20([bytes(16)], 0)))
      // invalid
      assert.notOk(validatorResult(validators.bytes20([badhex(20)], 0)))
      assert.notOk(validatorResult(validators.bytes20([bytes(20, false)], 0)))
      assert.notOk(validatorResult(validators.bytes20([bytes(32)], 0)))
    })
    it('Bytes32', () => {
      // valid
      assert.ok(validatorResult(validators.bytes32([bytesToHex(randomBytes(32))], 0)))
      assert.ok(validatorResult(validators.bytes32([bytes(32)], 0)))
      assert.ok(validatorResult(validators.bytes32([bytes(8)], 0)))
      assert.ok(validatorResult(validators.bytes32([bytes(16)], 0)))
      assert.ok(validatorResult(validators.bytes32([bytes(20)], 0)))
      // invalid
      assert.notOk(validatorResult(validators.bytes32([badhex(32)], 0)))
      assert.notOk(validatorResult(validators.bytes32([bytes(48)], 0)))
      assert.notOk(validatorResult(validators.bytes32([bytes(32, false)], 0)))
    })
    it('Uint256', () => {
      // valid
      assert.ok(validatorResult(validators.uint256([bytesToHex(randomBytes(32))], 0)))
      assert.ok(validatorResult(validators.uint256([bytes(32)], 0)))
      assert.ok(validatorResult(validators.uint256([bytes(8)], 0)))
      assert.ok(validatorResult(validators.uint256([bytes(16)], 0)))
      assert.ok(validatorResult(validators.uint256([bytes(20)], 0)))
      // invalid
      assert.notOk(validatorResult(validators.uint256([badhex(32)], 0)))
      assert.notOk(validatorResult(validators.uint256([bytes(48)], 0)))
      assert.notOk(validatorResult(validators.uint256([bytes(32, false)], 0)))
    })
    it('Bytes48', () => {
      // valid
      assert.ok(validatorResult(validators.bytes48([bytesToHex(randomBytes(48))], 0)))
      assert.ok(validatorResult(validators.bytes48([bytes(48)], 0)))
      assert.ok(validatorResult(validators.bytes48([bytes(8)], 0)))
      assert.ok(validatorResult(validators.bytes48([bytes(16)], 0)))
      assert.ok(validatorResult(validators.bytes48([bytes(20)], 0)))
      assert.ok(validatorResult(validators.bytes48([bytes(32)], 0)))

      // invalid
      assert.notOk(validatorResult(validators.bytes48([badhex(48)], 0)))
      assert.notOk(validatorResult(validators.bytes48([bytes(64)], 0)))
      assert.notOk(validatorResult(validators.bytes48([bytes(48, false)], 0)))
    })
    it('Bytes256', () => {
      // valid
      assert.ok(validatorResult(validators.bytes256([bytesToHex(randomBytes(256))], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(256)], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(8)], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(16)], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(32)], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(64)], 0)))
      assert.ok(validatorResult(validators.bytes256([bytes(128)], 0)))

      // invalid
      assert.notOk(validatorResult(validators.bytes256([badhex(256)], 0)))
      assert.notOk(validatorResult(validators.bytes256([bytes(512)], 0)))
      assert.notOk(validatorResult(validators.bytes256([bytes(256, false)], 0)))
    })
  })

  it('transaction', () => {
    // valid
    assert.ok(validatorResult(validators.transaction([])([{}], 0)))
    assert.ok(
      validatorResult(
        validators.transaction([])(
          [
            {
              gas: '0xcf08',
            },
          ],
          0
        )
      )
    )
    assert.ok(
      validatorResult(
        validators.transaction(['to'])([{ to: '0x0000000000000000000000000000000000000000' }], 0)
      )
    )

    // invalid
    assert.notOk(validatorResult(validators.transaction([])([], 0)))
    assert.notOk(validatorResult(validators.transaction(['to'])([{}], 0)))
    assert.notOk(validatorResult(validators.transaction(['to'])([{ gas: '0xcf08' }], 0)))
    assert.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x' }], 0)))
    assert.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x0' }], 0)))
    assert.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x00' }], 0)))
    assert.notOk(
      validatorResult(
        validators.transaction(['to'])(
          [
            {
              to: '0x0000000000000000000000000000000000000000',
              from: '0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249',
            },
          ],
          0
        )
      )
    )
    assert.notOk(
      validatorResult(
        validators.transaction(['to'])(
          [{ from: '0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249' }],
          0
        )
      )
    )
    assert.notOk(validatorResult(validators.transaction([])([{ gas: '12' }], 0)))
    assert.notOk(validatorResult(validators.transaction([])([{ gasPrice: '12' }], 0)))
    assert.notOk(validatorResult(validators.transaction([])([{ value: '12' }], 0)))
    assert.notOk(validatorResult(validators.transaction([])([{ data: '12' }], 0)))
  })

  it('object', () => {
    // valid
    assert.ok(
      validatorResult(
        validators.object({
          address: validators.address,
          blockHash: validators.blockHash,
          bool: validators.bool,
          hex: validators.hex,
        })(
          [
            {
              address: '0x25ed58c027921e14d86380ea2646e3a1b5c55a8b',
              blockHash: '0x4152dae052dceaeaeff588aec17a88679fc61aa0c0ca362a2572b94f9c542b24',
              bool: true,
              hex: '0x1',
            },
          ],
          0
        )
      )
    )

    // invalid
    assert.notOk(
      validatorResult(validators.object({ address: validators.address })([{ address: '0x0' }], 0))
    )
    assert.notOk(
      validatorResult(
        validators.object({ blockHash: validators.blockHash })([{ blockHash: '0x0' }], 0)
      )
    )
    assert.notOk(
      validatorResult(validators.object({ bool: validators.bool })([{ bool: '0x0' }], 0))
    )
    assert.notOk(validatorResult(validators.object({ hex: validators.hex })([{ hex: '1' }], 0)))
  })

  it('array', () => {
    // valid
    assert.ok(validatorResult(validators.array(validators.hex)([['0x0', '0x1', '0x2']], 0)))
    assert.ok(
      validatorResult(
        validators.array(validators.address)(
          [
            [
              '0xb7e390864a90b7b923c9f9310c6f98aafe43f707',
              '0xda4a22ad0d0e9aff0846ca54225637ada5bf7a14',
            ],
          ],
          0
        )
      )
    )
    assert.ok(
      validatorResult(
        validators.array(validators.blockHash)(
          [['0xb6dbbc1c702583de187e1284a00a23f9d322bf96f70fd4968b6339d0ace066b3']],
          0
        )
      )
    )
    assert.ok(validatorResult(validators.array(validators.bool)([[true, false]], 0)))

    // invalid
    assert.notOk(
      validatorResult(validators.array(validators.hex)([['0x0', '0x1', '0x2', 'true']], 0))
    )
    assert.notOk(
      validatorResult(
        validators.array(validators.address)(
          [['0xb7e390864a90b7b923c9f9310c6f98aafe43f707', '0x0']],
          0
        )
      )
    )
    assert.notOk(
      validatorResult(validators.array(validators.blockHash)([['0xb6dbbc1cd0ace066b3']], 0))
    )
    assert.notOk(
      validatorResult(validators.array(validators.bool)([['0x123', '0x456', '0x789']], 0))
    )
    assert.notOk(validatorResult(validators.array(validators.bool)([[true, 'true']], 0)))
  })

  it('rewardPercentile', () => {
    // valid
    assert.equal(validators.rewardPercentile([0], 0), 0)
    assert.equal(validators.rewardPercentile([0.1], 0), 0.1)
    assert.equal(validators.rewardPercentile([10], 0), 10)
    assert.equal(validators.rewardPercentile([100], 0), 100)

    // invalid
    assert.deepEqual(validators.rewardPercentile([-1], 0), {
      code: INVALID_PARAMS,
      message: `entry at 0 is lower than 0`,
    })
    assert.deepEqual(validators.rewardPercentile([101], 0), {
      code: INVALID_PARAMS,
      message: `entry at 0 is higher than 100`,
    })
    assert.deepEqual(validators.rewardPercentile([], 0), {
      code: INVALID_PARAMS,
      message: `entry at 0 is not a number`,
    })
    assert.deepEqual(validators.rewardPercentile(['0'], 0), {
      code: INVALID_PARAMS,
      message: `entry at 0 is not a number`,
    })
  })

  it('rewardPercentiles', () => {
    // valid
    assert.ok(validatorResult(validators.rewardPercentiles([[]], 0)))
    assert.ok(validatorResult(validators.rewardPercentiles([[0]], 0)))
    assert.ok(validatorResult(validators.rewardPercentiles([[100]], 0)))
    assert.ok(validatorResult(validators.rewardPercentiles([[0, 2, 5, 30, 100]], 0)))
    assert.ok(validatorResult(validators.rewardPercentiles([[0, 2.1, 5.35, 30.999, 60, 100]], 0)))

    // invalid
    assert.notOk(validatorResult(validators.rewardPercentiles([[[]]], 0))) // Argument is not number
    assert.notOk(validatorResult(validators.rewardPercentiles([[-1]], 0))) // Argument < 0
    assert.notOk(validatorResult(validators.rewardPercentiles([[100.1]], 0))) // Argument > 100
    assert.notOk(validatorResult(validators.rewardPercentiles([[1, 2, 3, 2.5]], 0))) // Not monotonically increasing
    assert.notOk(validatorResult(validators.rewardPercentiles([0], 0))) // Input not array
  })

  it('integer', () => {
    //valid
    assert.ok(validatorResult(validators.integer([1], 0)))
    assert.ok(validatorResult(validators.integer([-1], 0)))
    assert.ok(validatorResult(validators.integer([0], 0)))

    //invalid
    assert.notOk(validatorResult(validators.integer(['a'], 0)))
    assert.notOk(validatorResult(validators.integer([1.234], 0)))
    assert.notOk(validatorResult(validators.integer([undefined], 0)))
    assert.notOk(validatorResult(validators.integer([null], 0)))
  })

  it('values', () => {
    // valid
    assert.ok(validatorResult(validators.values(['VALID', 'INVALID'])(['VALID'], 0)))
    assert.ok(validatorResult(validators.values(['VALID', 'INVALID'])(['INVALID'], 0)))

    // invalid
    assert.notOk(validatorResult(validators.values(['VALID', 'INVALID'])(['ANOTHER'], 0)))
    assert.notOk(validatorResult(validators.values(['VALID', 'INVALID'])(['valid'], 0)))
  })

  it('optional', () => {
    // valid
    assert.ok(validatorResult(validators.optional(validators.bool)([true], 0)))
    assert.ok(validatorResult(validators.optional(validators.bool)([], 0)))
    assert.ok(validatorResult(validators.optional(validators.blockHash)([''], 0)))
    assert.ok(validatorResult(validators.optional(validators.blockHash)([], 0)))
    assert.ok(
      validatorResult(
        validators.optional(validators.blockHash)(
          ['0x0000000000000000000000000000000000000000000000000000000000000000'],
          0
        )
      )
    )
    assert.ok(
      validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))(['INVALID'], 0))
    )
    assert.ok(
      validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))([''], 0))
    )
    assert.ok(validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))([], 0)))

    // invalid
    assert.notOk(validatorResult(validators.optional(validators.bool)(['hey'], 0)))
    assert.notOk(validatorResult(validators.optional(validators.blockHash)(['0x0'], 0)))
    assert.notOk(
      validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))(['ANOTHER'], 0))
    )
  })

  it('either', () => {
    // valid
    assert.ok(validatorResult(validators.either(validators.bool, validators.blockHash)([true], 0)))
    assert.ok(validatorResult(validators.either(validators.bool, validators.hex)(['0xaaa'], 0)))
    assert.ok(
      validatorResult(
        validators.either(
          validators.bool,
          validators.hex,
          validators.array(validators.hex)
        )([['0xaaa']], 0)
      )
    )
    assert.ok(
      validatorResult(
        validators.either(validators.bool, validators.blockHash)(
          ['0x0000000000000000000000000000000000000000000000000000000000000000'],
          0
        )
      )
    )

    // invalid
    assert.notOk(
      validatorResult(validators.either(validators.bool, validators.blockHash)(['0xabc'], 0))
    )
    assert.notOk(validatorResult(validators.either(validators.bool, validators.hex)(['abc'], 0)))
    assert.notOk(
      validatorResult(validators.either(validators.hex, validators.blockHash)([true], 0))
    )
    assert.notOk(
      validatorResult(
        validators.either(
          validators.hex,
          validators.blockHash,
          validators.array(validators.hex)
        )([[false]], 0)
      )
    )
  })
})
