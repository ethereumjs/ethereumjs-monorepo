import { Common, Mainnet } from '@ethereumjs/common'
import { Address, hexToBytes } from '@ethereumjs/util'
import { p256 } from '@noble/curves/nist.js'
import { assert, beforeAll, describe, it } from 'vitest'

import { createEVM } from '../../src/index.ts'
import { precompile100 } from '../../src/precompiles/100-p256verify.ts'

import type { PrecompileInput } from '../../src/precompiles/types.ts'

const testCases = [
  {
    name: 'valid signature verification',
    input: (() => {
      // Generate a test key pair and signature
      const privateKey = p256.utils.randomSecretKey()
      const publicKey = p256.getPublicKey(privateKey, false) // Get uncompressed public key
      const message = new Uint8Array(32)
      message[31] = 1 // Simple test message

      const signatureBytes = p256.sign(message, privateKey, { lowS: false, prehash: false })

      // Format input: msgHash (32) + r (32) + s (32) + qx (32) + qy (32)
      const input = new Uint8Array(160)
      input.set(message, 0) // msgHash
      input.set(signatureBytes.slice(0, 32), 32) // r
      input.set(signatureBytes.slice(32, 64), 64) // s
      input.set(publicKey.slice(1, 33), 96) // qx (uncompressed public key)
      input.set(publicKey.slice(33, 65), 128) // qy

      return input
    })(),
    expectedReturn: new Uint8Array(32).fill(0).map((_, i) => (i === 31 ? 1 : 0)), // Success
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid input length',
    input: new Uint8Array(159), // Wrong length
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid signature - r out of bounds',
    input: (() => {
      const input = new Uint8Array(160)
      // Set r to curve order (invalid)
      const r = hexToBytes('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551')
      input.set(r, 32)
      return input
    })(),
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid signature - s out of bounds',
    input: (() => {
      const input = new Uint8Array(160)
      // Set s to curve order (invalid)
      const s = hexToBytes('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551')
      input.set(s, 64)
      return input
    })(),
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid public key - point not on curve',
    input: (() => {
      const input = new Uint8Array(160)
      // Set invalid public key coordinates
      input.set(new Uint8Array(32).fill(1), 96) // qx
      input.set(new Uint8Array(32).fill(2), 128) // qy
      return input
    })(),
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid public key - point at infinity',
    input: (() => {
      const input = new Uint8Array(160)
      // Set point at infinity (0, 0)
      input.set(new Uint8Array(32), 96) // qx = 0
      input.set(new Uint8Array(32), 128) // qy = 0
      return input
    })(),
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
  {
    name: 'invalid signature verification',
    input: (() => {
      // Generate a valid key pair but wrong signature
      const privateKey = p256.utils.randomSecretKey()
      const publicKey = p256.getPublicKey(privateKey, false) // Get uncompressed public key
      const message = new Uint8Array(32)
      message[31] = 1

      // Use wrong message for signature
      const wrongMessage = new Uint8Array(32)
      wrongMessage[31] = 2
      const signature = p256.sign(wrongMessage, privateKey, { lowS: false, prehash: false })

      const input = new Uint8Array(160)
      input.set(message, 0) // msgHash (different from signed message)
      input.set(signature.slice(0, 32), 32) // r
      input.set(signature.slice(32, 64), 64) // s
      input.set(publicKey.slice(1, 33), 96) // qx
      input.set(publicKey.slice(33, 65), 128) // qy

      return input
    })(),
    expectedReturn: new Uint8Array(0), // Failure
    expectedGasUsed: BigInt(6900),
  },
]

describe('P256VERIFY precompile', () => {
  let common: Common
  let evm: any

  beforeAll(async () => {
    common = new Common({ chain: Mainnet, eips: [7951] })
    evm = await createEVM({ common })
  })

  describe('precompile100', () => {
    for (const testCase of testCases) {
      it(`should handle ${testCase.name}`, () => {
        const opts: PrecompileInput = {
          data: testCase.input,
          gasLimit: BigInt(10000),
          common,
          _EVM: evm,
        }

        const result = precompile100(opts)

        assert.equal(result.executionGasUsed, testCase.expectedGasUsed)
        assert.deepEqual(result.returnValue, testCase.expectedReturn)
      })
    }
  })

  describe('integration with EVM', () => {
    it('should be callable from EVM', async () => {
      // Create a simple contract that calls the P256VERIFY precompile
      const code = hexToBytes(
        '0x6101006000526001601f600060003660006000610100611af4f13d6001556000553d600060003e3d600020600255',
      )

      const result = await evm.runCall({
        to: undefined, // Contract creation
        caller: new Address(hexToBytes('0x0000000000000000000000000000000000000000')),
        data: code,
        gasLimit: BigInt(100000),
      })

      assert.equal(result.execResult.exceptionError, undefined)
    })
  })
})
