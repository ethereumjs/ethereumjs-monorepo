import { Address, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { getStem } from '../src/index.js'

describe('Verkle cryptographic helpers', () => {
  it('getStem(): returns the expected stems', async () => {
    // Empty address
    assert.equal(
      bytesToHex(getStem(Address.fromString('0x0000000000000000000000000000000000000000'))),
      '0xbf101a6e1c8e83c11bd203a582c7981b91097ec55cbd344ce09005c1f26d19'
    )

    // Non-empty address
    assert.equal(
      bytesToHex(getStem(Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7'))),
      '0x274cde18dd9dbb04caf16ad5ee969c19fe6ca764d5688b5e1d419f4ac6cd16'
    )
  })
})
