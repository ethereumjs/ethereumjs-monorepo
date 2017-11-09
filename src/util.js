const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const Buffer = require('safe-buffer').Buffer
const createKeccakHash = require('keccak')
const assert = require('assert')

function keccak256 (...buffers) {
  const buffer = Buffer.concat(buffers)
  return createKeccakHash('keccak256').update(buffer).digest()
}

function genPrivateKey () {
  while (true) {
    const privateKey = randomBytes(32)
    if (secp256k1.privateKeyVerify(privateKey)) return privateKey
  }
}

function pk2id (pk) {
  if (pk.length === 33) pk = secp256k1.publicKeyConvert(pk, false)
  return pk.slice(1)
}

function id2pk (id) {
  return Buffer.concat([ Buffer.from([ 0x04 ]), id ])
}

function int2buffer (v) {
  let hex = v.toString(16)
  if (hex.length % 2 === 1) hex = '0' + hex
  return Buffer.from(hex, 'hex')
}

function buffer2int (buffer) {
  if (buffer.length === 0) return NaN

  let n = 0
  for (let i = 0; i < buffer.length; ++i) n = n * 256 + buffer[i]
  return n
}

function zfill (buffer, size, leftpad) {
  if (buffer.length >= size) return buffer
  if (leftpad === undefined) leftpad = true
  const pad = Buffer.allocUnsafe(size - buffer.length).fill(0x00)
  return leftpad ? Buffer.concat([ pad, buffer ]) : Buffer.concat([ buffer, pad ])
}

function xor (a, b) {
  const length = Math.min(a.length, b.length)
  const buffer = Buffer.allocUnsafe(length)
  for (let i = 0; i < length; ++i) buffer[i] = a[i] ^ b[i]
  return buffer
}

function assertEq (expected, actual, msg) {
  if (Buffer.isBuffer(expected) && Buffer.isBuffer(actual)) {
    if (expected.equals(actual)) return
    throw new assert.AssertionError({
      message: `${msg}: ${expected.toString('hex')} / ${actual.toString('hex')}`
    })
  }

  if (expected === actual) return
  throw new assert.AssertionError({
    message: `${msg}: ${expected} / ${actual}`
  })
}

function createDeferred () {
  const deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

module.exports = {
  keccak256,
  genPrivateKey,
  pk2id,
  id2pk,
  int2buffer,
  buffer2int,
  zfill,
  xor,
  assertEq,
  createDeferred
}
