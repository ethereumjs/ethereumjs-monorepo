import { assert, describe, it } from 'vitest'

import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  hexToBytes,
  randomBytes,
} from '../src/bytes.js'
import { CLRequest, type CLRequestType } from '../src/requests.js'

class NumberRequest extends CLRequest implements CLRequestType<NumberRequest> {
  constructor(type: number, bytes: Uint8Array) {
    super(type, bytes)
  }

  public static fromRequestData(bytes: Uint8Array): CLRequestType<NumberRequest> {
    return new NumberRequest(0x1, bytes)
  }

  serialize() {
    return concatBytes(Uint8Array.from([this.type]), this.bytes)
  }
}
describe('should create a request', () => {
  it('should create a request', () => {
    const requestType = 0x1
    const data = randomBytes(32)
    const request = new NumberRequest(0x1, data)
    const serialized = request.serialize()
    assert.equal(serialized[0], requestType)
    assert.deepEqual(serialized.slice(1), data)
  })
  it('should create a request from RequestData', () => {
    const request1 = NumberRequest.fromRequestData(hexToBytes('0x1234'))
    assert.equal(request1.type, 0x1)
    assert.equal(bytesToHex(request1.bytes), '0x1234')

    const request2 = NumberRequest.fromRequestData(bigIntToBytes(123n))
    assert.equal(request2.type, 0x1)
    assert.equal(bytesToBigInt(request2.bytes), 123n)
  })
})
