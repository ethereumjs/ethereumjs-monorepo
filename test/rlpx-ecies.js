const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const test = require('tape')
const util = require('../es/util')
const ECIES = require('../es/rlpx/ecies')

function beforeEach (fn) {
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

test('#_encryptMessage/#_encryptMessage', beforeEach((t) => {
  const message = Buffer.from('The Magic Words are Squeamish Ossifrage')
  const encypted = t.context.a._encryptMessage(message)
  const decrypted = t.context.b._decryptMessage(encypted)
  t.same(message, decrypted)
  t.end()
}))

test('auth -> ack -> header -> body', beforeEach((t) => {
  t.doesNotThrow(() => {
    t.context.b.parseAuth(t.context.a.createAuth())
    t.context.a.parseAck(t.context.b.createAck())
  })
  const body = randomBytes(600)
  t.same(t.context.b.parseHeader(t.context.a.createHeader(body.length)), body.length)
  t.same(t.context.b.parseBody(t.context.a.createBody(body)), body)
  t.end()
}))
