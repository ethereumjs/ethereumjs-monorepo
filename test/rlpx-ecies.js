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
      }
    }
    fn(t)
  }
}

test('Random: #_encryptMessage/#_encryptMessage', randomBefore((t) => {
  const message = Buffer.from('The Magic Words are Squeamish Ossifrage')
  const encypted = t.context.a._encryptMessage(message)
  const decrypted = t.context.b._decryptMessage(encypted)
  t.same(message, decrypted)
  t.end()
}))

test('Random: auth -> ack -> header -> body', randomBefore((t) => {
  t.doesNotThrow(() => {
    t.context.b.parseAuth(t.context.a.createAuth())
    t.context.a.parseAck(t.context.b.createAck())
  })
  const body = randomBytes(600)
  t.same(t.context.b.parseHeader(t.context.a.createHeader(body.length)), body.length)
  t.same(t.context.b.parseBody(t.context.a.createBody(body)), body)
  t.end()
}))

test('Testdata: auth -> ack (old format/no EIP8)', testdataBefore((t) => {
  t.doesNotThrow(() => {
    t.context.b.parseAuth(t.context.h0.auth)
    t.context.a._initMsg = t.context.h0.auth
    t.context.a.parseAck(t.context.h0.ack)
  })
  t.end()
}))
