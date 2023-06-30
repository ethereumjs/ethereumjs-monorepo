import { bytesToHex, bytesToPrefixedHexString, randomBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../src/rpc/error-code'
import { middleware, validators } from '../../src/rpc/validation'

import { baseRequest, startRPC } from './helpers'
import { checkError } from './util'

const prefix = 'rpc/validation:'

tape(`${prefix} should work without \`params\` when it's optional`, async (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((_params: any) => true, 0, []),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }
  const expectRes = (res: any) => {
    t.equal(res.body.error, undefined, 'should not return an error object')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${prefix} should return error without \`params\` when it's required`, async (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((_params: any) => true, 1, []),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }

  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')

  await baseRequest(t, server, req, 200, expectRes)
})

const validatorResult = (result: Object | undefined) => {
  // result is valid if validator returns undefined
  // result is invalid if validator returns object
  return result === undefined ? true : false
}

tape(`${prefix} address`, (t) => {
  // valid
  // zero address
  t.ok(validatorResult(validators.address(['0x0000000000000000000000000000000000000000'], 0)))
  // lowercase address
  t.ok(validatorResult(validators.address(['0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'], 0)))
  // checksummed address
  t.ok(validatorResult(validators.address(['0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270'], 0)))

  // invalid
  t.notOk(validatorResult(validators.address(['0x'], 0)))
  t.notOk(validatorResult(validators.address(['0x0'], 0)))
  t.notOk(validatorResult(validators.address(['0x00'], 0)))
  t.notOk(validatorResult(validators.address(['0x1'], 0)))
  // invalid length: 38 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000'], 0)))
  // invalidlength: 39 chars
  t.notOk(validatorResult(validators.address(['0x000000000000000000000000000000000000000'], 0)))
  // invalidlength: 41 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0)))
  // invalid length: 42 chars
  t.notOk(validatorResult(validators.address(['0x00000000000000000000000000000000000000000'], 0)))
  // invalid character
  t.notOk(validatorResult(validators.address(['0x62223651d6a33d58be70eb9876c3caf7096169ez'], 0)))

  t.end()
})

tape(`${prefix} blockHash`, (t) => {
  // valid
  t.ok(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )
  t.ok(
    validatorResult(
      validators.blockHash(
        ['0xf79d019c58d58a4efcfdf100c9596dd38014dcec6cf6f52000d4fae4e139b703'],
        0
      )
    )
  )
  // invalid length
  t.notOk(
    validatorResult(
      validators.blockHash(['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2'], 0)
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24'], 0)
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a2499'],
        0
      )
    )
  )
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a24999'],
        0
      )
    )
  )
  // invalid character
  t.notOk(
    validatorResult(
      validators.blockHash(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66z249'],
        0
      )
    )
  )

  t.end()
})

tape(`${prefix} blockOption`, (t) => {
  // valid
  t.ok(validatorResult(validators.blockOption(['latest'], 0)))
  t.ok(validatorResult(validators.blockOption(['earliest'], 0)))
  t.ok(validatorResult(validators.blockOption(['pending'], 0)))
  t.ok(
    validatorResult(
      validators.blockOption(
        ['0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )
  t.ok(validatorResult(validators.blockOption(['0x1'], 0)))
  t.ok(validatorResult(validators.blockOption(['0x01'], 0)))

  // invalid
  t.notOk(validatorResult(validators.blockOption(['lates'], 0)))
  t.notOk(validatorResult(validators.blockOption(['arliest'], 0)))
  t.notOk(validatorResult(validators.blockOption(['pendin'], 0)))
  t.notOk(validatorResult(validators.blockOption(['0'], 0)))
  t.notOk(validatorResult(validators.blockOption(['00'], 0)))
  t.notOk(validatorResult(validators.blockOption(['1'], 0)))
  t.notOk(validatorResult(validators.blockOption(['11'], 0)))
  t.notOk(
    validatorResult(
      validators.blockOption(
        ['573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249'],
        0
      )
    )
  )

  t.end()
})

tape(`${prefix} bool`, (t) => {
  // valid
  t.ok(validatorResult(validators.bool([true], 0)))
  t.ok(validatorResult(validators.bool([false], 0)))

  // invalid
  t.notOk(validatorResult(validators.bool(['true'], 0)))
  t.notOk(validatorResult(validators.bool(['false'], 0)))
  t.notOk(validatorResult(validators.bool(['tru'], 0)))
  t.notOk(validatorResult(validators.bool(['fals'], 0)))

  t.end()
})

tape(`${prefix} hex`, (t) => {
  // valid
  t.ok(validatorResult(validators.hex(['0x0'], 0)))
  t.ok(validatorResult(validators.hex(['0x00'], 0)))
  t.ok(validatorResult(validators.hex(['0x1'], 0)))

  // invalid
  t.notOk(validatorResult(validators.hex(['0'], 0)))
  t.notOk(validatorResult(validators.hex(['00'], 0)))
  t.notOk(validatorResult(validators.hex(['1'], 0)))
  t.notOk(validatorResult(validators.hex(['1'], 0)))

  t.end()
})
tape(`${prefix} byteVectors`, (t) => {
  const bytes = (byteLength: number, prefix: boolean = true) => {
    return prefix ? '0x'.padEnd(byteLength * 2 + 2, '0') : ''.padEnd(byteLength * 2, '0')
  }
  const badhex = (byteLength: number) => {
    return '0x'.padEnd(byteLength * 2 + 2, 'G')
  }
  t.test('Bytes8', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes8([bytesToPrefixedHexString(randomBytes(8))], 0)))
    st.ok(validatorResult(validators.bytes8([bytes(8)], 0)))
    st.ok(validatorResult(validators.bytes8([bytes(1)], 0)))
    st.ok(validatorResult(validators.bytes8([bytes(2)], 0)))
    st.ok(validatorResult(validators.bytes8([bytes(4)], 0)))
    // invalid
    st.notOk(validatorResult(validators.bytes8([bytes(10)], 0)))
    st.notOk(validatorResult(validators.bytes8([bytes(8, false)], 0)))
    st.notOk(validatorResult(validators.bytes8([bytesToHex(randomBytes(8))], 0)))
    st.end()
  })
  t.test('Uint64', (st) => {
    // valid
    st.ok(validatorResult(validators.uint64([bytesToPrefixedHexString(randomBytes(8))], 0)))
    st.ok(validatorResult(validators.uint64([bytes(8)], 0)))
    st.ok(validatorResult(validators.uint64([bytes(1)], 0)))
    st.ok(validatorResult(validators.uint64([bytes(2)], 0)))
    st.ok(validatorResult(validators.uint64([bytes(4)], 0)))

    // invalid
    st.notOk(validatorResult(validators.bytes8([badhex(8)], 0)))
    st.notOk(validatorResult(validators.uint64([bytes(10)], 0)))
    st.notOk(validatorResult(validators.uint64([bytes(8, false)], 0)))
    st.notOk(validatorResult(validators.uint64([bytesToHex(randomBytes(8))], 0)))
    st.end()
  })
  t.test('Bytes16', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes16([bytesToPrefixedHexString(randomBytes(16))], 0)))
    st.ok(validatorResult(validators.bytes16([bytes(16)], 0)))
    st.ok(validatorResult(validators.bytes16([bytes(1)], 0)))
    st.ok(validatorResult(validators.bytes16([bytes(2)], 0)))
    st.ok(validatorResult(validators.bytes16([bytes(4)], 0)))
    st.ok(validatorResult(validators.bytes16([bytes(8)], 0)))
    // invalid
    st.notOk(validatorResult(validators.bytes16([badhex(16)], 0)))
    st.notOk(validatorResult(validators.bytes16([bytes(20)], 0)))
    st.notOk(validatorResult(validators.bytes16([bytes(16, false)], 0)))
    st.notOk(validatorResult(validators.bytes16([bytesToHex(randomBytes(16))], 0)))
    st.end()
  })
  t.test('Bytes20', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes20([bytes(20)], 0)))
    st.ok(validatorResult(validators.bytes20([bytesToPrefixedHexString(randomBytes(20))], 0)))
    st.ok(validatorResult(validators.bytes20([bytes(8)], 0)))
    st.ok(validatorResult(validators.bytes20([bytes(16)], 0)))
    // invalid
    st.notOk(validatorResult(validators.bytes20([badhex(20)], 0)))
    st.notOk(validatorResult(validators.bytes20([bytes(20, false)], 0)))
    st.notOk(validatorResult(validators.bytes20([bytes(32)], 0)))
    st.notOk(validatorResult(validators.bytes20([bytesToHex(randomBytes(20))], 0)))
    st.end()
  })
  t.test('Bytes32', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes32([bytesToPrefixedHexString(randomBytes(32))], 0)))
    st.ok(validatorResult(validators.bytes32([bytes(32)], 0)))
    st.ok(validatorResult(validators.bytes32([bytes(8)], 0)))
    st.ok(validatorResult(validators.bytes32([bytes(16)], 0)))
    st.ok(validatorResult(validators.bytes32([bytes(20)], 0)))
    // invalid
    st.notOk(validatorResult(validators.bytes32([badhex(32)], 0)))
    st.notOk(validatorResult(validators.bytes32([bytes(48)], 0)))
    st.notOk(validatorResult(validators.bytes32([bytes(32, false)], 0)))
    st.notOk(validatorResult(validators.bytes32([bytesToHex(randomBytes(32))], 0)))
    st.end()
  })
  t.test('Uint256', (st) => {
    // valid
    st.ok(validatorResult(validators.uint256([bytesToPrefixedHexString(randomBytes(32))], 0)))
    st.ok(validatorResult(validators.uint256([bytes(32)], 0)))
    st.ok(validatorResult(validators.uint256([bytes(8)], 0)))
    st.ok(validatorResult(validators.uint256([bytes(16)], 0)))
    st.ok(validatorResult(validators.uint256([bytes(20)], 0)))
    // invalid
    st.notOk(validatorResult(validators.uint256([badhex(32)], 0)))
    st.notOk(validatorResult(validators.uint256([bytes(48)], 0)))
    st.notOk(validatorResult(validators.uint256([bytes(32, false)], 0)))
    st.notOk(validatorResult(validators.uint256([bytesToHex(randomBytes(32))], 0)))
    st.end()
  })
  t.test('Bytes48', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes48([bytesToPrefixedHexString(randomBytes(48))], 0)))
    st.ok(validatorResult(validators.bytes48([bytes(48)], 0)))
    st.ok(validatorResult(validators.bytes48([bytes(8)], 0)))
    st.ok(validatorResult(validators.bytes48([bytes(16)], 0)))
    st.ok(validatorResult(validators.bytes48([bytes(20)], 0)))
    st.ok(validatorResult(validators.bytes48([bytes(32)], 0)))

    // invalid
    st.notOk(validatorResult(validators.bytes48([badhex(48)], 0)))
    st.notOk(validatorResult(validators.bytes48([bytes(64)], 0)))
    st.notOk(validatorResult(validators.bytes48([bytes(48, false)], 0)))
    st.notOk(validatorResult(validators.bytes48([bytesToHex(randomBytes(48))], 0)))
    st.end()
  })
  t.test('Bytes256', (st) => {
    // valid
    st.ok(validatorResult(validators.bytes256([bytesToPrefixedHexString(randomBytes(256))], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(256)], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(8)], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(16)], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(32)], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(64)], 0)))
    st.ok(validatorResult(validators.bytes256([bytes(128)], 0)))

    // invalid
    st.notOk(validatorResult(validators.bytes256([badhex(256)], 0)))
    st.notOk(validatorResult(validators.bytes256([bytes(512)], 0)))
    st.notOk(validatorResult(validators.bytes256([bytes(256, false)], 0)))
    st.notOk(validatorResult(validators.bytes256([bytesToHex(randomBytes(256))], 0)))
    st.end()
  })

  t.end()
})

tape(`${prefix} transaction`, (t) => {
  // valid
  t.ok(validatorResult(validators.transaction([])([{}], 0)))
  t.ok(
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
  t.ok(
    validatorResult(
      validators.transaction(['to'])([{ to: '0x0000000000000000000000000000000000000000' }], 0)
    )
  )

  // invalid
  t.notOk(validatorResult(validators.transaction([])([], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{}], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ gas: '0xcf08' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x0' }], 0)))
  t.notOk(validatorResult(validators.transaction(['to'])([{ to: '0x00' }], 0)))
  t.notOk(
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
  t.notOk(
    validatorResult(
      validators.transaction(['to'])(
        [{ from: '0x573155e65afb5cc55035aa9113d29d4ca3625454b33d32b2dff7b6673c66a249' }],
        0
      )
    )
  )
  t.notOk(validatorResult(validators.transaction([])([{ gas: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ gasPrice: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ value: '12' }], 0)))
  t.notOk(validatorResult(validators.transaction([])([{ data: '12' }], 0)))

  t.end()
})

tape(`${prefix} object`, (t) => {
  // valid
  t.ok(
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
  t.notOk(
    validatorResult(validators.object({ address: validators.address })([{ address: '0x0' }], 0))
  )
  t.notOk(
    validatorResult(
      validators.object({ blockHash: validators.blockHash })([{ blockHash: '0x0' }], 0)
    )
  )
  t.notOk(validatorResult(validators.object({ bool: validators.bool })([{ bool: '0x0' }], 0)))
  t.notOk(validatorResult(validators.object({ hex: validators.hex })([{ hex: '1' }], 0)))

  t.end()
})

tape(`${prefix} array`, (t) => {
  // valid
  t.ok(validatorResult(validators.array(validators.hex)([['0x0', '0x1', '0x2']], 0)))
  t.ok(
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
  t.ok(
    validatorResult(
      validators.array(validators.blockHash)(
        [['0xb6dbbc1c702583de187e1284a00a23f9d322bf96f70fd4968b6339d0ace066b3']],
        0
      )
    )
  )
  t.ok(validatorResult(validators.array(validators.bool)([[true, false]], 0)))

  // invalid
  t.notOk(validatorResult(validators.array(validators.hex)([['0x0', '0x1', '0x2', 'true']], 0)))
  t.notOk(
    validatorResult(
      validators.array(validators.address)(
        [['0xb7e390864a90b7b923c9f9310c6f98aafe43f707', '0x0']],
        0
      )
    )
  )
  t.notOk(validatorResult(validators.array(validators.blockHash)([['0xb6dbbc1cd0ace066b3']], 0)))
  t.notOk(validatorResult(validators.array(validators.bool)([['0x123', '0x456', '0x789']], 0)))
  t.notOk(validatorResult(validators.array(validators.bool)([[true, 'true']], 0)))

  t.end()
})

tape(`${prefix} values`, (t) => {
  // valid
  t.ok(validatorResult(validators.values(['VALID', 'INVALID'])(['VALID'], 0)))
  t.ok(validatorResult(validators.values(['VALID', 'INVALID'])(['INVALID'], 0)))

  // invalid
  t.notOk(validatorResult(validators.values(['VALID', 'INVALID'])(['ANOTHER'], 0)))
  t.notOk(validatorResult(validators.values(['VALID', 'INVALID'])(['valid'], 0)))

  t.end()
})

tape(`${prefix} optional`, (t) => {
  // valid
  t.ok(validatorResult(validators.optional(validators.bool)([true], 0)))
  t.ok(validatorResult(validators.optional(validators.bool)([], 0)))
  t.ok(validatorResult(validators.optional(validators.blockHash)([''], 0)))
  t.ok(validatorResult(validators.optional(validators.blockHash)([], 0)))
  t.ok(
    validatorResult(
      validators.optional(validators.blockHash)(
        ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        0
      )
    )
  )
  t.ok(
    validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))(['INVALID'], 0))
  )
  t.ok(validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))([''], 0)))
  t.ok(validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))([], 0)))

  // invalid
  t.notOk(validatorResult(validators.optional(validators.bool)(['hey'], 0)))
  t.notOk(validatorResult(validators.optional(validators.blockHash)(['0x0'], 0)))
  t.notOk(
    validatorResult(validators.optional(validators.values(['VALID', 'INVALID']))(['ANOTHER'], 0))
  )

  t.end()
})

tape(`${prefix} either`, (t) => {
  // valid
  t.ok(validatorResult(validators.either(validators.bool, validators.blockHash)([true], 0)))
  t.ok(validatorResult(validators.either(validators.bool, validators.hex)(['0xaaa'], 0)))
  t.ok(
    validatorResult(
      validators.either(
        validators.bool,
        validators.hex,
        validators.array(validators.hex)
      )([['0xaaa']], 0)
    )
  )
  t.ok(
    validatorResult(
      validators.either(validators.bool, validators.blockHash)(
        ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        0
      )
    )
  )

  // invalid
  t.notOk(validatorResult(validators.either(validators.bool, validators.blockHash)(['0xabc'], 0)))
  t.notOk(validatorResult(validators.either(validators.bool, validators.hex)(['abc'], 0)))
  t.notOk(validatorResult(validators.either(validators.hex, validators.blockHash)([true], 0)))
  t.notOk(
    validatorResult(
      validators.either(
        validators.hex,
        validators.blockHash,
        validators.array(validators.hex)
      )([[false]], 0)
    )
  )

  t.end()
})
