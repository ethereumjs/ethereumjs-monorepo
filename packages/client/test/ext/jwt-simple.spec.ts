import { bytesToUtf8 } from '@ethereumjs/util'
import { base64url } from '@scure/base'
import fs from 'fs'
import { describe, expect, it } from 'vitest'

import { jwt } from '../../src/ext/jwt-simple.js'

describe('jwt', function () {
  it('jwt has `encode` method', function () {
    expect(jwt.encode).to.be.a('function')
  })

  it('jwt has `decode` method', function () {
    expect(jwt.decode).to.be.a('function')
  })
})

describe('encode', function () {
  it('encode token', function () {
    const token = jwt.encode({ foo: 'bar' }, 'key')
    expect(token).to.be.a('string')
    expect(token.split('.')).to.have.length(3)
  })

  it('throw an error when the key is missing', function () {
    const fn = jwt.encode.bind(null, { foo: 'bar' })
    expect(fn).toThrowError(/Require key/)
  })

  it('throw an error when the specified algorithm is not supported', function () {
    const fn = jwt.encode.bind(null, { foo: 'bar' }, 'some_key', 'FooBar256')
    expect(fn).toThrowError(/Algorithm not supported/)
  })
})

describe('decode', function () {
  const key = 'key'
  const obj = { foo: 'bar' }
  const token = jwt.encode(obj, key)

  it('decode token', function () {
    const obj2 = jwt.decode(token, key)
    expect(obj2).to.eql(obj)
  })

  it('throw an error when no token is provided', function () {
    const fn = jwt.decode.bind(null, null, key)
    expect(fn).toThrowError(/No token supplied/)
  })

  it('throw an error when the token is not correctly formatted', function () {
    const fn = jwt.decode.bind(null, 'foo.bar', key)
    expect(fn).toThrowError(/Not enough or too many segments/)
  })

  it('throw an error when the specified algorithm is not supported', function () {
    const fn = jwt.decode.bind(null, token, key, false, 'FooBar256')
    expect(fn).toThrowError(/Algorithm not supported/)
  })

  it('throw an error when the signature verification fails', function () {
    const fn = jwt.decode.bind(null, token, 'invalid_key')
    expect(fn).toThrowError(/Signature verification failed/)
  })

  it('throw an error when the token is not yet active (optional nbf claim)', function () {
    const nbf = (Date.now() + 1000) / 1000
    const token = jwt.encode({ foo: 'bar', nbf }, key)
    const fn = jwt.decode.bind(null, token, key)
    expect(fn).toThrowError(/Token not yet active/)
  })

  it('throw an error when the token has expired (optional exp claim)', function () {
    const exp = (Date.now() - 1000) / 1000
    const token = jwt.encode({ foo: 'bar', exp }, key)
    const fn = jwt.decode.bind(null, token, key)
    expect(fn).toThrowError(/Token expired/)
  })

  it('do not throw any error when verification is disabled', function () {
    const obj = { foo: 'bar' }
    const key = 'key'
    const token = jwt.encode(obj, key)
    const fn1 = jwt.decode.bind(null, token, 'invalid_key1')
    const fn2 = jwt.decode.bind(null, token, 'invalid_key2', true)
    expect(fn1).toThrowError(/Signature verification failed/)
    expect(fn2()).to.eql(obj)
  })

  it('decode token given algorithm', function () {
    const obj = { foo: 'bar' }
    const key = 'key'
    const token = jwt.encode(obj, key, 'HS512')
    const obj2 = jwt.decode(token, key, false, 'HS512')
    expect(obj2).to.eql(obj)
    expect(jwt.decode.bind(null, token, key, false, 'HS256')).toThrowError(
      /Signature verification failed/,
    )
  })

  describe('RS256', function () {
    const obj = { foo: 'bar' }
    const pem = fs.readFileSync(__dirname + '/test.pem').toString('ascii')
    const cert = fs.readFileSync(__dirname + '/test.crt').toString('ascii')
    const alg = 'RS256'

    it('can add jwt header by options.header', function () {
      const token = jwt.encode(obj, pem, alg, { header: { kid: 'keyidX' } })
      const obj2 = jwt.decode(token, cert)
      expect(obj2).to.eql(obj)

      const jwtHeader = token.split('.')[0]
      expect(JSON.parse(bytesToUtf8(base64url.decode(jwtHeader)))).to.eql({
        typ: 'JWT',
        alg,
        kid: 'keyidX',
      })
    })

    it('decode token given RS256 algorithm', function () {
      const token = jwt.encode(obj, pem, alg)
      const obj2 = jwt.decode(token, cert)
      expect(obj2).to.eql(obj)
    })

    it('throw an error when the key is invalid', function () {
      const token = jwt.encode(obj, pem, alg)
      expect(jwt.decode.bind(null, token, 'invalid_key')).toThrowError()
    })
  })
})
