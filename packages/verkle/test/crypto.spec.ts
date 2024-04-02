import { Address, bytesToHex } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { getStem } from '../src/index.js'

import type { VerkleCrypto } from '../src/index.js'

describe('Verkle cryptographic helpers', () => {
  let verkle: VerkleCrypto
  beforeAll(async () => {
    verkle = await loadVerkleCrypto()
  })

  it('getStem(): returns the expected stems', () => {
    // Empty address
    assert.equal(
      bytesToHex(getStem(verkle, Address.fromString('0x0000000000000000000000000000000000000000'))),
      '0x1a100684fd68185060405f3f160e4bb6e034194336b547bdae323f888d5332'
    )

    // Non-empty address
    assert.equal(
      bytesToHex(getStem(verkle, Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7'))),
      '0x1540dfad7755b40be0768c6aa0a5096fbf0215e0e8cf354dd928a178346466'
    )
  })
})
