import { assert, describe, it } from 'vitest'

import { bytesToBigInt, bytesToHex, randomBytes } from '../src/bytes.js'
import { CLRequest } from '../src/requests.js'

describe('should create a request', () => {
  it('should create a request', () => {
    const requestType = 0x1
    const data = randomBytes(32)
    const request = new CLRequest(requestType, data)
    const serialized = request.serialize()
    assert.equal(serialized[0], requestType)
    assert.deepEqual(serialized.slice(1), data)
  })
  it('should create a request from RequestData', () => {
    const request1 = CLRequest.fromRequestsData({ type: 0x1, data: '0x1234' })
    assert.equal(request1.type, 0x1)
    assert.equal(bytesToHex(request1.data), '0x1234')

    const request2 = CLRequest.fromRequestsData({ type: 0x2, data: 123n })
    assert.equal(request2.type, 0x2)
    assert.equal(bytesToBigInt(request2.data), 123n)
  })
})
