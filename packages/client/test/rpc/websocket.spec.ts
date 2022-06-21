import * as tape from 'tape'
import { encode, TAlgorithm } from 'jwt-simple'
import { startRPC, closeRPC } from './helpers'
import { METHOD_NOT_FOUND } from '../../lib/rpc/error-code'
const request = require('superwstest')

const jwtSecret = Buffer.from(Array.from({ length: 32 }, () => Math.round(Math.random() * 255)))
const wsPort = 3000

tape('call JSON-RPC auth protected server with valid token', (t) => {
  const server = startRPC({}, { wsServer: true }, { jwtSecret })
  const claims = { iat: Math.floor(new Date().getTime() / 1000) }
  const token = encode(claims, jwtSecret as never as string, 'HS256' as TAlgorithm)
  const req = {
    jsonrpc: '2.0',
    method: 'METHOD_DOES_NOT_EXIST',
    params: ['0x1', true],
    id: 1,
  }

  const testFn = async () => {
    try {
      await request(server)
        .ws('/')
        .set('Authorization', `Bearer ${token}`)
        .sendJson(req)
        .expectJson((res: any) => res.error.code === METHOD_NOT_FOUND)
        .close()
        .expectClosed()
      t.end()
    } catch (err) {
      t.end(err)
    } finally {
      closeRPC(server)
    }
  }
  server.listen(wsPort, 'localhost', testFn)
})

tape('call JSON-RPC auth protected server without any auth headers', (t) => {
  const server = startRPC({}, { wsServer: true }, { jwtSecret })
  const testFn = async () => {
    try {
      await request(server).ws('/').expectConnectionError(401)
      t.end()
    } catch (err) {
      t.end(err)
    } finally {
      closeRPC(server)
    }
  }
  server.listen(wsPort, 'localhost', testFn)
})

tape('call JSON-RPC server without any auth headers', (t) => {
  const server = startRPC({}, { wsServer: true })
  const req = {
    jsonrpc: '2.0',
    method: 'METHOD_DOES_NOT_EXIST',
    params: ['0x1', true],
    id: 1,
  }

  const testFn = async () => {
    try {
      await request(server)
        .ws('/')
        .sendJson(req)
        .expectJson((res: any) => res.error.code === METHOD_NOT_FOUND)
        .close()
        .expectClosed()
      t.end()
    } catch (err) {
      t.end(err)
    } finally {
      closeRPC(server)
    }
  }
  server.listen(wsPort, 'localhost', testFn)
})
