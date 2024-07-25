/**
 * Ported to Typescript from original implementation below:
 * https://github.com/hokaccha/node-jwt-simple -- MIT licensed
 */

/**
 * module dependencies
 */
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'
import { base64url, base64urlnopad } from '@scure/base'
import crypto from 'crypto'

/**
 * support algorithm mapping
 */
export type TAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256'
const algorithmMap: Record<string, string> = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
  RS256: 'RSA-SHA256',
}

/**
 * Map algorithm to hmac or sign type, to determine which crypto function to use
 */
const typeMap: Record<string, string> = {
  HS256: 'hmac',
  HS384: 'hmac',
  HS512: 'hmac',
  RS256: 'sign',
}

/**
 * expose object
 */

/**
 * private util functions
 */

function assignProperties(dest: any, source: any) {
  for (const [attr] of Object.entries(source)) {
    if (Object.prototype.hasOwnProperty.call(source, attr)) {
      dest[attr] = source[attr]
    }
  }
}

function assertAlgorithm(alg: any): asserts alg is Algorithm {
  if (!['HS256', 'HS384', 'HS512', 'RS256'].includes(alg)) {
    throw new Error('Algorithm not supported')
  }
}

function base64urlUnescape(str: string) {
  str += new Array(5 - (str.length % 4)).join('=')
  return str.replace(/-/g, '+').replace(/_/g, '/')
}

function base64urlEscape(str: string) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function sign(input: any, key: string, method: string, type: string) {
  let base64str
  if (type === 'hmac') {
    base64str = crypto.createHmac(method, key).update(input).digest('base64')
  } else if (type === 'sign') {
    base64str = crypto.createSign(method).update(input).sign(key, 'base64')
  } else {
    throw new Error('Algorithm type not recognized')
  }

  return base64urlEscape(base64str)
}

function verify(input: any, key: string, method: string, type: string, signature: string) {
  if (type === 'hmac') {
    return signature === sign(input, key, method, type)
  } else if (type === 'sign') {
    return crypto
      .createVerify(method)
      .update(input)
      .verify(key, base64urlUnescape(signature), 'base64')
  } else {
    throw new Error('Algorithm type not recognized')
  }
}

/**
 * Decode jwt
 *
 * @param {Object} token
 * @param {String} key
 * @param {Boolean} [noVerify]
 * @param {String} [algorithm]
 * @return {Object} payload
 * @api public
 */
const decode = function jwt_decode(
  token: string,
  key: string,
  noVerify: boolean = false,
  algorithm: string = '',
) {
  // check token
  if (!token) {
    throw new Error('No token supplied')
  }
  // check segments
  const segments = token.split('.')
  if (segments.length !== 3) {
    throw new Error('Not enough or too many segments')
  }

  // All segment should be base64
  const headerSeg = segments[0]
  const payloadSeg = segments[1]
  const signatureSeg = segments[2]

  // base64 decode and parse JSON
  const header = JSON.parse(bytesToUtf8(base64url.decode(headerSeg)))
  const payload = JSON.parse(bytesToUtf8(base64urlnopad.decode(payloadSeg)))

  if (!noVerify) {
    if (!algorithm && /BEGIN( RSA)? PUBLIC KEY/.test(key.toString())) {
      algorithm = 'RS256'
    }

    algorithm = algorithm || header.alg

    assertAlgorithm(algorithm)
    const signingMethod = algorithmMap[algorithm]
    const signingType = typeMap[algorithm]

    // verify signature. `sign` will return base64 string.
    const signingInput = [headerSeg, payloadSeg].join('.')
    if (verify(signingInput, key, signingMethod, signingType, signatureSeg) === false) {
      throw new Error('Signature verification failed')
    }

    // Support for nbf and exp claims.
    // According to the RFC, they should be in seconds.
    if (payload.nbf !== undefined && Date.now() < payload.nbf * 1000) {
      throw new Error('Token not yet active')
    }

    if (payload.exp !== undefined && Date.now() > payload.exp * 1000) {
      throw new Error('Token expired')
    }
  }

  return payload
}

/**
 * Encode jwt
 *
 * @param {Object} payload
 * @param {String} key
 * @param {String} algorithm
 * @param {Object} options
 * @return {String} token
 * @api public
 */
const encode = function jwt_encode(
  payload: any,
  key: string,
  algorithm: string = '',
  options: any = undefined,
) {
  // Check key
  if (!key) {
    throw new Error('Require key')
  }

  // Check algorithm, default is HS256
  if (!algorithm) {
    algorithm = 'HS256'
  }

  assertAlgorithm(algorithm)
  const signingMethod = algorithmMap[algorithm]
  const signingType = typeMap[algorithm]

  // header, typ is fixed value.
  const header = { typ: 'JWT', alg: algorithm }
  if (options !== undefined && options.header !== undefined) {
    assignProperties(header, options.header)
  }

  // create segments, all segments should be base64 string
  const segments = []
  segments.push(base64url.encode(utf8ToBytes(JSON.stringify(header))))
  segments.push(base64urlnopad.encode(utf8ToBytes(JSON.stringify(payload))))
  segments.push(sign(segments.join('.'), key, signingMethod, signingType))

  return segments.join('.')
}

export const jwt = { encode, decode }
