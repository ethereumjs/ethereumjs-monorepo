const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const test = require('tape')
const util = require('../src/util')
const ECIES = require('../src/rlpx/ecies')

const testdata = require('./testdata.json')

function randomBefore (fn) {
  return (t) => {
    const privateKey1 = util.genPrivateKey(32)
    const privateKey2 = util.genPrivateKey(32)
    const publicKey1 = secp256k1.publicKeyCreate(privateKey1, false)
    const publicKey2 = secp256k1.publicKeyCreate(privateKey2, false)
    t.context = {
      a: new ECIES(privateKey1, util.pk2id(publicKey1), util.pk2id(publicKey2)),
      b: new ECIES(privateKey2, util.pk2id(publicKey2), util.pk2id(publicKey1))
    }

    fn(t)
  }
}

function testdataBefore (fn) {
  return (t) => {
    const v = testdata.eip8Values
    const keyA = Buffer.from(v.keyA, 'hex')
    const keyB = Buffer.from(v.keyB, 'hex')
    const pubA = Buffer.from(v.pubA, 'hex')
    const pubB = Buffer.from(v.pubB, 'hex')
    const h = testdata.eip8Handshakes

    t.context = {
      a: new ECIES(keyA, util.pk2id(pubA), util.pk2id(pubB)),
      b: new ECIES(keyB, util.pk2id(pubB), util.pk2id(pubA)),
      h0: {
        'auth': Buffer.from(h[0].auth.join(''), 'hex'),
        'ack': Buffer.from(h[0].ack.join(''), 'hex')
      },
      h1: {
        'auth': Buffer.from(h[1].auth.join(''), 'hex'),
        'ack': Buffer.from(h[1].ack.join(''), 'hex')
      }
    }
    fn(t)
  }
}

test('Random: message encryption', randomBefore((t) => {
  const message = Buffer.from('The Magic Words are Squeamish Ossifrage')
  const encrypted = t.context.a._encryptMessage(message)
  const decrypted = t.context.b._decryptMessage(encrypted)
  t.same(message, decrypted, 'encryptMessage -> decryptMessage should lead to same')
  t.end()
}))

test('Random: auth -> ack -> header -> body (old format/no EIP8)', randomBefore((t) => {
  t.doesNotThrow(() => {
    const auth = t.context.a.createAuthNonEIP8()
    t.context.b._gotEIP8Auth = false
    t.context.b.parseAuthPlain(auth)
  }, 'should not throw on auth creation/parsing')

  t.doesNotThrow(() => {
    t.context.b._gotEIP8Ack = false
    const ack = t.context.b.createAckOld()
    t.context.a.parseAckPlain(ack)
  }, 'should not throw on ack creation/parsing')

  const body = randomBytes(600)
  const header = t.context.b.parseHeader(t.context.a.createHeader(body.length))
  t.same(header, body.length, 'createHeader -> parseHeader should lead to same')

  const parsedBody = t.context.b.parseBody(t.context.a.createBody(body))
  t.same(parsedBody, body, 'createBody -> parseBody should lead to same')

  t.end()
}))

test('Random: auth -> ack (EIP8)', randomBefore((t) => {
  t.doesNotThrow(() => {
    const auth = t.context.a.createAuthEIP8()
    t.context.b._gotEIP8Auth = true
    t.context.b.parseAuthEIP8(auth)
  }, 'should not throw on auth creation/parsing')

  t.doesNotThrow(() => {
    const ack = t.context.b.createAckEIP8()
    t.context.a._gotEIP8Ack = true
    t.context.a.parseAckEIP8(ack)
  }, 'should not throw on ack creation/parsing')

  t.end()
}))

test('Testdata: auth -> ack (old format/no EIP8)', testdataBefore((t) => {
  t.doesNotThrow(() => {
    t.context.b._gotEIP8Auth = false
    t.context.b.parseAuthPlain(t.context.h0.auth)
    t.context.a._initMsg = t.context.h0.auth
  }, 'should not throw on auth parsing')

  t.doesNotThrow(() => {
    t.context.a._gotEIP8Ack = false
    t.context.a.parseAckPlain(t.context.h0.ack)
  }, 'should not throw on ack parsing')

  t.end()
}))

test('Testdata: auth -> ack (EIP8)', testdataBefore((t) => {
  t.doesNotThrow(() => {
    t.context.b._gotEIP8Auth = true
    t.context.b.parseAuthEIP8(t.context.h1.auth)
    t.context.a._initMsg = t.context.h1.auth
  }, 'should not throw on auth parsing')
  t.doesNotThrow(() => {
    t.context.a._gotEIP8Ack = true
    t.context.a.parseAckEIP8(t.context.h1.ack)
  }, 'should not throw on ack parsing')

  t.end()
}))
