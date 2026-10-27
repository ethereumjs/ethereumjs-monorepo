import { assert, describe, it } from 'vitest'

import { SocketByteQueue } from '../../src/rlpx/socketByteQueue.ts'

describe('[Devp2p/RLPx]: SocketByteQueue', () => {
  it('SocketByteQueue.peek() returns a subarray for a single-chunk frame', () => {
    const q = new SocketByteQueue()
    const chunk = new Uint8Array([1, 2, 3, 4, 5])
    q.push(chunk)
    const view = q.peek(3)
    assert.strictEqual(view.byteOffset, chunk.byteOffset)
    assert.strictEqual(view.buffer, chunk.buffer)
    assert.deepStrictEqual(Array.from(view), [1, 2, 3])
    assert.strictEqual(q.byteLength, 5)
  })

  it('SocketByteQueue.peek() does not consume on a short length peek', () => {
    const q = new SocketByteQueue()
    q.push(new Uint8Array([0xaa, 0xbb, 0xcc]))
    q.peek(2)
    assert.strictEqual(q.byteLength, 3)
  })

  it('SocketByteQueue round-trips 512 KB split across 32 chunks', () => {
    const total = 512 * 1024
    const piece = total / 32
    const expected = new Uint8Array(total)
    for (let i = 0; i < total; i++) {
      expected[i] = i % 251
    }
    const q = new SocketByteQueue()
    for (let i = 0; i < 32; i++) {
      q.push(expected.subarray(i * piece, (i + 1) * piece))
    }
    const out = q.peek(total)
    assert.strictEqual(out.length, total)
    assert.deepStrictEqual(out, expected)
    q.consume(total)
    assert.strictEqual(q.byteLength, 0)
  })

  it('SocketByteQueue copies once when a frame straddles two chunks', () => {
    const q = new SocketByteQueue()
    q.push(new Uint8Array([1, 2, 3]))
    q.push(new Uint8Array([4, 5, 6]))
    const first = q.peek(4)
    assert.notStrictEqual(first.buffer, q.peek(1).buffer)
    assert.deepStrictEqual(Array.from(first), [1, 2, 3, 4])
    q.consume(4)
    assert.deepStrictEqual(Array.from(q.peek(2)), [5, 6])
  })
})
