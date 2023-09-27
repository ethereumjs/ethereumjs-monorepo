import { randomBytes } from '@ethereumjs/util'
import { encode } from 'jwt-simple'
import { assert, describe, it } from 'vitest'

import { METHOD_NOT_FOUND } from '../../src/rpc/error-code'

import { baseRequest, closeRPC, createClient, createManager, params, startRPC } from './helpers'

import type { TAlgorithm } from 'jwt-simple'

const request = require('supertest')

const jwtSecret = randomBytes(32)

describe('JSON-RPC call', () => {
  it('without Content-Type header', () => {
    const server = startRPC({})
    const req = 'plaintext'

    request(server)
      .post('/')
      .send(req)
      .expect(415)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server without any auth headers', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'

    request(server)
      .post('/')
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with invalid token', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'

    request(server)
      .post('/')
      .set('Authorization', 'Bearer invalidtoken')
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with an invalid algorithm token', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS512' as TAlgorithm)

    request(server)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with a valid token', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)

    request(server)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(req)
      .expect(415)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with a valid but stale token', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'
    const claims = { iat: Math.floor(new Date().getTime() / 1000 - 61) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)

    request(server)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('without Content-Type header', () => {
    const server = startRPC({}, undefined, { jwtSecret })
    const req = 'plaintext'

    request(server)
      .post('/')
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('with nonexistent method', () => {
    const server = startRPC({})
    const req = {
      jsonrpc: '2.0',
      method: 'METHOD_DOES_NOT_EXIST',
      params: ['0x1', true],
      id: 1,
    }

    request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(req)
      .expect((res: any) => {
        if (res.body.error === undefined) {
          throw new Error('should return an error object')
        }
        if (res.body.error.code !== METHOD_NOT_FOUND) {
          throw new Error(`should have an error code ${METHOD_NOT_FOUND}`)
        }
      })
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with unprotected method without token', () => {
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => req.body.method.includes('unprotected_'),
    })

    const req = {
      jsonrpc: '2.0',
      method: 'unprotected_METHOD_DOES_NOT_EXIST',
      params: ['0x1', true],
      id: 1,
    }

    request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(req)
      .expect(200)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with protected method without token', () => {
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => !(req.body.method as string).includes('protected_'),
    })

    const req = {
      jsonrpc: '2.0',
      method: 'protected_METHOD_DOES_NOT_EXIST',
      params: ['0x1', true],
      id: 1,
    }

    request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(req)
      .expect(401)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })

  it('auth protected server with protected method with token', () => {
    const server = startRPC({}, undefined, {
      jwtSecret,
      unlessFn: (req: any) => !(req.body.method as string).includes('protected_'),
    })

    const req = {
      jsonrpc: '2.0',
      method: 'protected_METHOD_DOES_NOT_EXIST',
      params: ['0x1', true],
      id: 1,
    }
    const claims = { iat: Math.floor(new Date().getTime() / 1000) }
    const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)

    request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(req)
      .expect(200)
      .end((err: any) => {
        closeRPC(server)
        assert.notOk(err)
      })
  })
})

describe('callWithStackTrace', () => {
  it('call with stack trace and gets a stack trace in the error', async () => {
    const method = 'eth_getBlockByNumber'
    const mockBlockNumber = BigInt(123)
    const mockChain = {
      headers: { latest: { number: mockBlockNumber } },
      async getCanonicalHeadHeader(): Promise<any> {
        throw new Error('This is not the block you are looking for')
      },
    }
    const manager = createManager(createClient({ chain: mockChain }))
    const server = startRPC(manager.getMethods(false, true))

    const req = params(method, ['0x678', false])
    const expectRes = (res: any) => {
      assert.ok(res.body.error.trace !== undefined)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with stack trace and gets an error without a stack trace', async () => {
    const method = 'eth_getBlockByNumber'
    const mockBlockNumber = BigInt(123)
    const mockChain = {
      headers: { latest: { number: mockBlockNumber } },
      async getCanonicalHeadHeader(): Promise<any> {
        throw new Error('This is not the block you are looking for')
      },
    }
    const manager = createManager(createClient({ chain: mockChain }))
    const server = startRPC(manager.getMethods(false, false))

    const req = params(method, ['0x678', false])
    const expectRes = (res: any) => {
      assert.ok(res.body.error.trace === undefined)
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
