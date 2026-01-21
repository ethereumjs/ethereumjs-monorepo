import { concatBytes, randomBytes, setLengthLeft } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Common, Mainnet, createCustomCommon } from '../src/index.ts'

describe('[Common]: Custom Crypto', () => {
  const customKeccak256 = (msg: Uint8Array) => {
    return concatBytes(msg, new Uint8Array([1]))
  }
  const customEcrecover = (
    msgHash: Uint8Array,
    v: bigint,
    r: Uint8Array,
    s: Uint8Array,
    _chainID?: bigint,
  ) => {
    return concatBytes(msgHash, Uint8Array.from([Number(v)]), r, s)
  }

  const customSha256 = (msg: Uint8Array) => {
    msg[0] = 0xff
    return msg
  }

  // Custom ecsign returns 65-byte signature in recovered format: r[32] + s[32] + recovery[1]
  const customEcSign = (_msg: Uint8Array, _pk: Uint8Array) => {
    return concatBytes(
      setLengthLeft(Uint8Array.from([0, 1, 2, 3]), 32), // r
      setLengthLeft(Uint8Array.from([0, 1, 2, 3]), 32), // s
      new Uint8Array([0]), // recovery
    )
  }

  it('keccak256', () => {
    const customCrypto = {
      keccak256: customKeccak256,
    }
    const value = new Uint8Array([2])

    let c = new Common({ chain: Mainnet, customCrypto })
    let msg = 'Should initialize with custom keccak256 function and use properly (main constructor)'
    assert.deepEqual(c.customCrypto.keccak256?.(value), new Uint8Array([2, 1]), msg)

    msg = 'Should still work on a copied instance'
    assert.deepEqual(c.copy().customCrypto.keccak256!(value), new Uint8Array([2, 1]), msg)

    const customChainParams = { name: 'custom', chainId: 123 }
    c = createCustomCommon(customChainParams, Mainnet, { customCrypto })
    msg = 'Should initialize with custom keccak256 function and use properly (custom() constructor)'
    assert.deepEqual(c.customCrypto.keccak256?.(value), new Uint8Array([2, 1]), msg)
  })

  it('ecrecover', () => {
    const customCrypto = {
      ecrecover: customEcrecover,
    }
    const c = new Common({ chain: Mainnet, customCrypto })
    assert.deepEqual(
      Uint8Array.from([1, 2, 3, 4]),
      c.customCrypto.ecrecover!(
        Uint8Array.from([1]),
        BigInt(2),
        Uint8Array.from([3]),
        Uint8Array.from([4]),
      ),
    )
  })

  it('sha256', () => {
    const customCrypto = {
      sha256: customSha256,
    }
    const msg = Uint8Array.from([0, 1, 2, 3])
    const c = new Common({ chain: Mainnet, customCrypto })
    assert.strictEqual(c.customCrypto.sha256!(msg)[0], 0xff, 'used custom sha256 function')
  })

  it('ecsign', () => {
    const customCrypto = {
      ecsign: customEcSign,
    }
    const c = new Common({ chain: Mainnet, customCrypto })
    const sig = c.customCrypto.ecsign!(randomBytes(32), randomBytes(32))
    // Check signature is 65 bytes and recovery byte is 0
    assert.strictEqual(sig.length, 65, 'signature should be 65 bytes')
    assert.strictEqual(sig[64], 0, 'recovery byte should be 0')
  })
})
