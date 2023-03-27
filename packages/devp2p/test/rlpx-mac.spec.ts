import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import * as test from 'tape'

import { MAC } from '../src/rlpx/mac'

const secret = hexToBytes('4caf4671e713d083128973de159d02688dc86f51535a80178264631e193ed2ea')

test('digest should work on empty data', (t) => {
  const mac = new MAC(secret)
  t.equal(bytesToHex(mac.digest()), 'c5d2460186f7233c927e7db2dcc703c0')
  t.end()
})

test('#update', (t) => {
  const mac = new MAC(secret)
  mac.update('test')
  t.equal(bytesToHex(mac.digest()), '9c22ff5f21f0b81b113e63f7db6da94f')
  t.end()
})

test('#updateHeader', (t) => {
  const mac = new MAC(secret)
  mac.updateHeader('this is a header data struct')
  t.equal(bytesToHex(mac.digest()), '52235ed491a4c9224d94788762ead6a6')
  t.end()
})

test('#updateBody', (t) => {
  const mac = new MAC(secret)
  mac.updateBody('this is a body data struct')
  t.equal(bytesToHex(mac.digest()), '134a755450b1ed9d3ff90ef5dcecdd7d')
  t.end()
})

test('#updateHeader and #updateBody', (t) => {
  const mac = new MAC(secret)
  mac.updateHeader('this is a header data struct')
  mac.updateBody('this is a body data struct')
  t.equal(bytesToHex(mac.digest()), '5d98967578ec8edbb45e1d75992f394c')
  t.end()
})
