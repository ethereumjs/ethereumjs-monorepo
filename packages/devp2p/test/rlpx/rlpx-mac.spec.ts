import { createCipheriv } from 'crypto'
import { bytesToHex, hexToBytes, utf8ToBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { MAC } from '../../src/rlpx/mac.ts'
import { xor } from '../../src/util.ts'

const secret = hexToBytes('0x4caf4671e713d083128973de159d02688dc86f51535a80178264631e193ed2ea')

describe('[Devp2p/RLPx]: MAC', () => {
  it('digest should work on empty data', () => {
    const mac = new MAC(secret)
    assert.strictEqual(bytesToHex(mac.digest()), '0xc5d2460186f7233c927e7db2dcc703c0')
  })

  it('#update', () => {
    const mac = new MAC(secret)
    mac.update('test')
    assert.strictEqual(bytesToHex(mac.digest()), '0x9c22ff5f21f0b81b113e63f7db6da94f')
  })

  it('#updateHeader', () => {
    const mac = new MAC(secret)
    mac.updateHeader('this is a header data struct')
    assert.strictEqual(bytesToHex(mac.digest()), '0x52235ed491a4c9224d94788762ead6a6')
  })

  it('#updateBody', () => {
    const mac = new MAC(secret)
    mac.updateBody('this is a body data struct')
    assert.strictEqual(bytesToHex(mac.digest()), '0x134a755450b1ed9d3ff90ef5dcecdd7d')
  })

  it('#updateHeader and #updateBody', () => {
    const mac = new MAC(secret)
    mac.updateHeader('this is a header data struct')
    mac.updateBody('this is a body data struct')
    assert.strictEqual(bytesToHex(mac.digest()), '0x5d98967578ec8edbb45e1d75992f394c')
  })

  it('reused cipher matches per-frame createCipheriv across many updates', () => {
    const mac = new MAC(secret)
    const headers = ['hdr-a', 'hdr-b', 'hdr-c']
    const bodies = ['body-a', 'body-b']
    for (let i = 0; i < headers.length; i++) {
      mac.updateHeader(headers[i]!)
      const cached = bytesToHex(mac.digest())
      const legacy = legacyMacDigest(secret, headers.slice(0, i + 1), [])
      assert.strictEqual(cached, legacy, `header frame ${i}`)
    }
    for (let j = 0; j < bodies.length; j++) {
      mac.updateBody(bodies[j]!)
      const cached = bytesToHex(mac.digest())
      const legacy = legacyMacDigest(secret, headers, bodies.slice(0, j + 1))
      assert.strictEqual(cached, legacy, `body frame ${j}`)
    }
  })
})

function legacyMacDigest(secret: Uint8Array, headers: string[], bodies: string[]): `0x${string}` {
  const hash = keccak_256.create()
  for (const header of headers) {
    const aes = createCipheriv('aes-256-ecb', secret, '')
    aes.setAutoPadding(false)
    const digest = Uint8Array.from(hash.clone().digest().subarray(0, 16))
    const encrypted = aes.update(digest)
    hash.update(xor(encrypted, header))
  }
  for (const body of bodies) {
    hash.update(utf8ToBytes(body))
    const aes = createCipheriv('aes-256-ecb', secret, '')
    aes.setAutoPadding(false)
    const prev = Uint8Array.from(hash.clone().digest().subarray(0, 16))
    const encrypted = aes.update(prev)
    hash.update(xor(encrypted, prev))
  }
  return bytesToHex(Uint8Array.from(hash.clone().digest().subarray(0, 16)))
}
