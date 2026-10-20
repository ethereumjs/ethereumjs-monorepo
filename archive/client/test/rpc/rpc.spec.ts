import { randomBytes } from '@ethereumjs/util'
import { Client } from 'jayson/promise/index.js'
import { assert, describe, it } from 'vitest'

import { jwt } from '../../src/ext/jwt-simple.ts'

import { createClient, createManager, getRPCClient, startRPC } from './helpers.ts'

import type { AddressInfo } from 'net'
import type { TAlgorithm } from '../../src/ext/jwt-simple.ts'

const { encode } = jwt
const jwtSecret = randomBytes(32)

describe('JSON-RPC call', () => {
  it('without Content-Type header', async () => {
    const rpc = getRPCClient(startRPC({}))
    const req = 'plaintext'
    const res = await rpc.request(req, [])
    assert.strictEqual(res.error.code, -32601)
  })

  it('auth protected server without any auth headers', async () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const rpc = Client.http({ port: (server.address()! as AddressInfo).port })
    const req = 'plaintext'
    try {
      await rpc.request(req, [])
      assert.fail('should error when request not authenticated by JWT')
    } catch (err: any) {
      assert.strictEqual(err.code, 401, 'unauthorized request')
    }
  })

  it('auth protected server with invalid token', async () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
      headers: {
        Authorization: `Bearer invalidToken`,
      },
    })
    const req = 'plaintext'
    try {
      await rpc.request(req, [])
      assert.fail('should have thrown an error')
    } catch (err: any) {
      assert.strictEqual(err.code, 401, 'errored with invalid token')
    }
  })

  it('auth protected server with an invalid algorithm token', async () => {
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS512' as TAlgorithm)
    const server = startRPC({}, undefined, { jwtSecret })
    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const req = 'plaintext'
    try {
      await rpc.request(req, [])
      assert.fail('should have thrown an error')
    } catch (err: any) {
      assert.strictEqual(err.code, 401, 'errored with invalid token')
      assert.strictEqual(err.message, 'Unauthorized: Error: Signature verification failed')
    }
  })

  it('auth protected server with a valid token', async () => {
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)
    const server = startRPC({}, undefined, { jwtSecret })

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const req = 'plaintext'
    try {
      const res = await rpc.request(req, [])
      assert.strictEqual(res.error.message, 'Method not found')
    } catch {
      assert.fail('should have returned a valid response for an unknown method')
    }
  })

  it('auth protected server with a valid but stale token', async () => {
    const claims = { iat: Math.floor(new Date().getTime() / 1000 - 61) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)

    const server = startRPC({}, undefined, { jwtSecret })
    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const req = 'plaintext'
    try {
      await rpc.request(req, [])
      assert.fail('should have thrown an error')
    } catch (err: any) {
      assert.strictEqual(err.code, 401, 'errored with valid but stale token')
      assert.isTrue(err.message.includes('Stale jwt') === true, 'valid but stale token')
    }
  })

  it('auth protected server with unprotected method without token', async () => {
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => req.body.method.includes('unprotected_'),
    })

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
    })

    try {
      const res = await rpc.request('unprotected_METHOD_DOES_NOT_EXIST', ['0x1', true])
      assert.strictEqual(res.error.message, 'Method not found')
    } catch {
      assert.fail('should not have thrown error')
    }
  })

  it('auth protected server with protected method without token', async () => {
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => !(req.body.method as string).includes('protected_'),
    })

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
    })

    try {
      await rpc.request('protected_METHOD_DOES_NOT_EXIST', ['0x1', true])
      assert.fail('should have thrown')
    } catch (err: any) {
      assert.strictEqual(err.code, 401, 'errored with unauthorized')
      assert.isTrue(err.message.includes('Missing auth header') === true, 'no auth token provided')
    }
  })

  it('auth protected server with protected method with token', async () => {
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => !(req.body.method as string).includes('protected_'),
    })

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    try {
      const res = await rpc.request('protected_METHOD_DOES_NOT_EXIST', ['0x1', true])
      assert.strictEqual(res.error.message, 'Method not found')
    } catch {
      assert.fail('should have gotten valid response')
    }
  })
})
describe('callWithStackTrace', () => {
  it('call with stack trace and gets a stack trace in the error', async () => {
    const method = 'eth_getBlockTransactionCountByNumber'
    const mockBlockNumber = BigInt(123)
    const mockChain = {
      headers: { latest: { number: mockBlockNumber } },
      async getCanonicalHeadHeader(): Promise<any> {
        throw new Error('This is not the block you are looking for')
      },
    }
    const manager = createManager(await createClient({ chain: mockChain }))
    const server = startRPC(manager.getMethods(false, true))

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
    })
    const res = await rpc.request(method, ['0x678', false])

    assert.isTrue(res.error.trace !== undefined)
  })

  it('call with stack trace and gets an error without a stack trace', async () => {
    const method = 'eth_getStorageAt'
    const mockBlockNumber = BigInt(123)
    const mockChain = {
      headers: { latest: { number: mockBlockNumber } },
      async getCanonicalHeadHeader(): Promise<any> {
        throw new Error('This is not the block you are looking for')
      },
    }
    const manager = createManager(await createClient({ chain: mockChain }))
    const server = startRPC(manager.getMethods(false, false))

    const rpc = Client.http({
      port: (server.address()! as AddressInfo).port,
    })

    const res = await rpc.request(method, ['0xavc', false])

    assert.isTrue(res.error.trace === undefined)
  })
})
