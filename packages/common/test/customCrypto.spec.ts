import { concatBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Chain, Common, createCustomCommon } from '../src/index.js'

import type { ECDSASignature } from '@ethereumjs/util'

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

  const customEcSign = (_msg: Uint8Array, _pk: Uint8Array, chainId?: bigint): ECDSASignature => {
    return { v: chainId ?? 27n, r: Uint8Array.from([0, 1, 2, 3]), s: Uint8Array.from([0, 1, 2, 3]) }
  }

  it('keccak256', () => {
    const customCrypto = {
      keccak256: customKeccak256,
    }
    const value = new Uint8Array([2])

    let c = new Common({ chain: Chain.Mainnet, customCrypto })
    let msg = 'Should initialize with custom keccak256 function and use properly (main constructor)'
    assert.deepEqual(c.customCrypto.keccak256!(value), new Uint8Array([2, 1]), msg)

    msg = 'Should still work on a copied instance'
    assert.deepEqual(c.copy().customCrypto.keccak256!(value), new Uint8Array([2, 1]), msg)

    const customChainParams = { name: 'custom', chainId: 123 }
    c = createCustomCommon(customChainParams, { customCrypto })
    msg = 'Should initialize with custom keccak256 function and use properly (custom() constructor)'
    assert.deepEqual(c.customCrypto.keccak256!(value), new Uint8Array([2, 1]), msg)
  })

  it('ecrecover', () => {
    const customCrypto = {
      ecrecover: customEcrecover,
    }
    const c = new Common({ chain: Chain.Mainnet, customCrypto })
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
    const c = new Common({ chain: Chain.Mainnet, customCrypto })
    assert.equal(c.customCrypto.sha256!(msg)[0], 0xff, 'used custom sha256 function')
  })

  it('ecsign', () => {
    const customCrypto = {
      ecsign: customEcSign,
    }
    const c = new Common({ chain: Chain.Mainnet, customCrypto })
    assert.equal(c.customCrypto.ecsign!(randomBytes(32), randomBytes(32), 0n).v, 0n)
    assert.equal(c.customCrypto.ecsign!(randomBytes(32), randomBytes(32)).v, 27n)
  })
})
