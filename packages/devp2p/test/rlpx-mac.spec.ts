import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MAC } from '../src/rlpx/mac.js'

const secret = hexToBytes('0x4caf4671e713d083128973de159d02688dc86f51535a80178264631e193ed2ea')

describe('RLPx MAC tests', () => {
  it('digest should work on empty data', () => {
    const mac = new MAC(secret)
    assert.equal(bytesToHex(mac.digest()), '0xc5d2460186f7233c927e7db2dcc703c0')
  })

  it('#update', () => {
    const mac = new MAC(secret)
    mac.update('test')
    assert.equal(bytesToHex(mac.digest()), '0x9c22ff5f21f0b81b113e63f7db6da94f')
  })

  it('#updateHeader', () => {
    const mac = new MAC(secret)
    mac.updateHeader('this is a header data struct')
    assert.equal(bytesToHex(mac.digest()), '0x52235ed491a4c9224d94788762ead6a6')
  })

  it('#updateBody', () => {
    const mac = new MAC(secret)
    mac.updateBody('this is a body data struct')
    assert.equal(bytesToHex(mac.digest()), '0x134a755450b1ed9d3ff90ef5dcecdd7d')
  })

  it('#updateHeader and #updateBody', () => {
    const mac = new MAC(secret)
    mac.updateHeader('this is a header data struct')
    mac.updateBody('this is a body data struct')
    assert.equal(bytesToHex(mac.digest()), '0x5d98967578ec8edbb45e1d75992f394c')
  })
})
