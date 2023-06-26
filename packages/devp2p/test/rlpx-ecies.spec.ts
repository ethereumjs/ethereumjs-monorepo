import { getRandomBytesSync } from 'ethereum-cryptography/random.js'
import { publicKeyCreate } from 'ethereum-cryptography/secp256k1-compat.js'
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils.js'
import { assert, it } from 'vitest'

import { ECIES } from '../src/rlpx/ecies.js'
import * as util from '../src/util.js'

import * as testdata from './testdata.json'

export interface EciesTestContext {
  context: {
    a: ECIES
    b: ECIES
    h0?: { auth: Uint8Array; ack: Uint8Array }
    h1?: { auth: Uint8Array; ack: Uint8Array }
  }
}

function randomBefore(fn: Function) {
  return (t: EciesTestContext) => {
    const privateKey1 = util.genPrivateKey()
    const privateKey2 = util.genPrivateKey()
    const publicKey1 = publicKeyCreate(privateKey1, false)
    const publicKey2 = publicKeyCreate(privateKey2, false)
    t.context = {
      a: new ECIES(privateKey1, util.pk2id(publicKey1), util.pk2id(publicKey2)),
      b: new ECIES(privateKey2, util.pk2id(publicKey2), util.pk2id(publicKey1)),
    }

    fn(t)
  }
}

function testdataBefore(fn: Function) {
  return (t: EciesTestContext) => {
    const v = testdata.eip8Values
    const keyA = hexToBytes(v.keyA)
    const keyB = hexToBytes(v.keyB)
    const pubA = hexToBytes(v.pubA)
    const pubB = hexToBytes(v.pubB)
    const h = testdata.eip8Handshakes

    t.context = {
      a: new ECIES(keyA, util.pk2id(pubA), util.pk2id(pubB)),
      b: new ECIES(keyB, util.pk2id(pubB), util.pk2id(pubA)),
      h0: {
        auth: hexToBytes(h[0].auth.join('')),
        ack: hexToBytes(h[0].ack.join('')),
      },
      h1: {
        auth: hexToBytes(h[1].auth.join('')),
        ack: hexToBytes(h[1].ack.join('')),
      },
    }
    fn(t)
  }
}

it(
  'Random: message encryption',
  randomBefore((t: EciesTestContext) => {
    const message = utf8ToBytes('The Magic Words are Squeamish Ossifrage')
    const encrypted = t.context.a._encryptMessage(message)
    const decrypted = t.context.b._decryptMessage(encrypted as Uint8Array)
    assert.deepEqual(message, decrypted, 'encryptMessage -> decryptMessage should lead to same')
  })
)

it(
  'Random: auth -> ack -> header -> body (old format/no EIP8)',
  randomBefore((t: EciesTestContext) => {
    assert.doesNotThrow(() => {
      const auth = t.context.a.createAuthNonEIP8()
      t.context.b._gotEIP8Auth = false
      t.context.b.parseAuthPlain(auth as Uint8Array)
    }, 'should not throw on auth creation/parsing')

    assert.doesNotThrow(() => {
      t.context.b._gotEIP8Ack = false
      const ack = t.context.b.createAckOld()
      t.context.a.parseAckPlain(ack as Uint8Array)
    }, 'should not throw on ack creation/parsing')

    const body = getRandomBytesSync(600)

    const header = t.context.b.parseHeader(t.context.a.createHeader(body.length) as Uint8Array)
    assert.equal(header, body.length, 'createHeader -> parseHeader should lead to same')

    const parsedBody = t.context.b.parseBody(t.context.a.createBody(body) as Uint8Array)
    assert.deepEqual(parsedBody, body, 'createBody -> parseBody should lead to same')
  })
)

it(
  'Random: auth -> ack (EIP8)',
  randomBefore((t: EciesTestContext) => {
    assert.doesNotThrow(() => {
      const auth = t.context.a.createAuthEIP8()
      t.context.b._gotEIP8Auth = true
      t.context.b.parseAuthEIP8(auth as Uint8Array)
    }, 'should not throw on auth creation/parsing')

    assert.doesNotThrow(() => {
      const ack = t.context.b.createAckEIP8()
      t.context.a._gotEIP8Ack = true
      t.context.a.parseAckEIP8(ack as Uint8Array)
    }, 'should not throw on ack creation/parsing')
  })
)

it(
  'Testdata: auth -> ack (old format/no EIP8)',
  testdataBefore((t: EciesTestContext) => {
    assert.doesNotThrow(() => {
      t.context.b._gotEIP8Auth = false
      t.context.b.parseAuthPlain(t.context.h0?.auth as Uint8Array)
      t.context.a._initMsg = t.context.h0?.auth
    }, 'should not throw on auth parsing')

    assert.doesNotThrow(() => {
      t.context.a._gotEIP8Ack = false
      t.context.a.parseAckPlain(t.context.h0?.ack as Uint8Array)
    }, 'should not throw on ack parsing')
  })
)

it(
  'Testdata: auth -> ack (EIP8)',
  testdataBefore((t: EciesTestContext) => {
    assert.doesNotThrow(() => {
      t.context.b._gotEIP8Auth = true
      t.context.b.parseAuthEIP8(t.context.h1?.auth as Uint8Array)
      t.context.a._initMsg = t.context.h1?.auth
    }, 'should not throw on auth parsing')
    assert.doesNotThrow(() => {
      t.context.a._gotEIP8Ack = true
      t.context.a.parseAckEIP8(t.context.h1?.ack as Uint8Array)
    }, 'should not throw on ack parsing')
  })
)
