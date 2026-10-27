/**
 * Append-only TCP receive buffer: avoids reallocating the full stream on every chunk.
 */
export class SocketByteQueue {
  private readonly _chunks: Uint8Array[] = []
  private _headIndex = 0
  private _headOffset = 0

  push(data: Uint8Array): void {
    if (data.length === 0) return
    this._chunks.push(data)
  }

  get byteLength(): number {
    let len = 0
    for (let i = this._headIndex; i < this._chunks.length; i++) {
      const chunk = this._chunks[i]!
      len += i === this._headIndex ? chunk.length - this._headOffset : chunk.length
    }
    return len
  }

  /**
   * View the next {@link n} bytes without removing them.
   * Returns a subarray when {@link n} lies entirely in one chunk; otherwise copies once.
   */
  peek(n: number): Uint8Array {
    if (n === 0) return new Uint8Array()
    if (this.byteLength < n) {
      throw new RangeError(`SocketByteQueue.peek: need ${n} bytes, have ${this.byteLength}`)
    }
    const first = this._chunks[this._headIndex]!
    const availableInFirst = first.length - this._headOffset
    if (availableInFirst >= n) {
      return first.subarray(this._headOffset, this._headOffset + n)
    }
    const out = new Uint8Array(n)
    this._readInto(out, 0, n)
    return out
  }

  /** Drop the first {@link n} bytes from the queue. */
  consume(n: number): void {
    if (n === 0) return
    if (this.byteLength < n) {
      throw new RangeError(`SocketByteQueue.consume: need ${n} bytes, have ${this.byteLength}`)
    }
    let remaining = n
    while (remaining > 0) {
      const chunk = this._chunks[this._headIndex]!
      const available = chunk.length - this._headOffset
      if (remaining < available) {
        this._headOffset += remaining
        remaining = 0
      } else {
        remaining -= available
        this._headIndex++
        this._headOffset = 0
      }
    }
    if (this._headIndex > 0 && this._headIndex === this._chunks.length) {
      this._chunks.length = 0
      this._headIndex = 0
    } else if (this._headIndex > 8) {
      this._chunks.splice(0, this._headIndex)
      this._headIndex = 0
    }
  }

  private _readInto(out: Uint8Array, outOffset: number, n: number): void {
    let written = 0
    let chunkIndex = this._headIndex
    let offset = this._headOffset
    while (written < n) {
      const chunk = this._chunks[chunkIndex]!
      const take = Math.min(chunk.length - offset, n - written)
      out.set(chunk.subarray(offset, offset + take), outOffset + written)
      written += take
      offset += take
      if (offset >= chunk.length) {
        chunkIndex++
        offset = 0
      }
    }
  }
}
