import BN = require('bn.js')
import { sha256 } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
import { VmError, ERROR } from '../../exceptions'
const assert = require('assert')

// The following blake2 code has been taken from:
// https://github.com/dcposch/blakejs/blob/410c640d0f08d3b26904c6d1ab3d81df3619d282/blake2s.js
// The modifications include:
//  - Avoiding the use of context in F
//  - F accepts number of rounds as parameter
//  - Expect 2 64-byte t values, xor them both


// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA (v: any, a: any, b: any) {
  var o0 = v[a] + v[b]
  var o1 = v[a + 1] + v[b + 1]
  if (o0 >= 0x100000000) {
    o1++
  }
  v[a] = o0
  v[a + 1] = o1
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC (v: any, a: any, b0: any, b1: any) {
  var o0 = v[a] + b0
  if (b0 < 0) {
    o0 += 0x100000000
  }
  var o1 = v[a + 1] + b1
  if (o0 >= 0x100000000) {
    o1++
  }
  v[a] = o0
  v[a + 1] = o1
}

// Little-endian byte access
function B2B_GET32 (arr: any, i: any) {
  return (arr[i] ^
  (arr[i + 1] << 8) ^
  (arr[i + 2] << 16) ^
  (arr[i + 3] << 24))
}

// G Mixing function
// The ROTRs are inlined for speed
function B2B_G (a: any, b: any, c: any, d: any, ix: any, iy: any) {
  var x0 = my[ix]
  var x1 = my[ix + 1]
  var y0 = my[iy]
  var y1 = my[iy + 1]

  ADD64AA(v, a, b) // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
  ADD64AC(v, a, x0, x1) // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
  var xor0 = v[d] ^ v[a]
  var xor1 = v[d + 1] ^ v[a + 1]
  v[d] = xor1
  v[d + 1] = xor0

  ADD64AA(v, c, d)

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
  xor0 = v[b] ^ v[c]
  xor1 = v[b + 1] ^ v[c + 1]
  v[b] = (xor0 >>> 24) ^ (xor1 << 8)
  v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8)

  ADD64AA(v, a, b)
  ADD64AC(v, a, y0, y1)

  // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
  xor0 = v[d] ^ v[a]
  xor1 = v[d + 1] ^ v[a + 1]
  v[d] = (xor0 >>> 16) ^ (xor1 << 16)
  v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16)

  ADD64AA(v, c, d)

  // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
  xor0 = v[b] ^ v[c]
  xor1 = v[b + 1] ^ v[c + 1]
  v[b] = (xor1 >>> 31) ^ (xor0 << 1)
  v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1)
}

// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
  0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
  0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
  0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
  0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
])

const SIGMA8 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
  7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
  9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
  2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
  12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
  13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
  6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
  10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
]

// These are offsets into a uint64 buffer.
// Multiply them all by 2 to make them offsets into a uint32 buffer,
// because this is Javascript and we don't have uint64s
const SIGMA82 = new Uint8Array(SIGMA8.map(function (x) { return x * 2 }))

const v = new Uint32Array(32)
var my = new Uint32Array(32)
export function F(h: Uint32Array, m: Uint32Array, t: Uint32Array, f: boolean, rounds: number) {
  var i = 0

  // init work variables
  for (i = 0; i < 16; i++) {
    v[i] = h[i]
    v[i + 16] = BLAKE2B_IV32[i]
  }

  // low 64 bits of offset
  v[24] = v[24] ^ t[0]
  v[25] = v[25] ^ t[1]
  v[26] = v[26] ^ t[2]
  v[27] = v[27] ^ t[3]

  // last block flag set ?
  if (f) {
    v[28] = ~v[28]
    v[29] = ~v[29]
  }

  // get little-endian words
  for (i = 0; i < 32; i++) {
    my[i] = B2B_GET32(m, 4 * i)
  }

  // twelve rounds of mixing
  // uncomment the DebugPrint calls to log the computation
  // and match the RFC sample documentation
  // util.debugPrint('          m[16]', m, 64)
  for (i = 0; i < rounds; i++) {
    // util.debugPrint('   (i=' + (i < 10 ? ' ' : '') + i + ') v[16]', v, 64)
    B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1])
    B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3])
    B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5])
    B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7])
    B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9])
    B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11])
    B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13])
    B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15])
  }

  for (i = 0; i < 16; i++) {
    h[i] = h[i] ^ v[i] ^ v[i + 16]
  }
}

export default function(opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data
  if (data.length !== 213) {
    return {
      returnValue: Buffer.alloc(0),
      gasUsed: opts.gasLimit,
      exceptionError: new VmError(ERROR.OUT_OF_RANGE)
    }
  }
  const lastByte = data.slice(212, 213)[0]
  if (lastByte !== 1 && lastByte !== 0) {
    return {
      returnValue: Buffer.alloc(0),
      gasUsed: opts.gasLimit,
      exceptionError: new VmError(ERROR.OUT_OF_RANGE)
    }
  }

  const rounds = data.slice(0, 4).readUInt32BE(0)
  const hRaw = data.slice(4, 68)
  const mRaw = data.slice(68, 196)
  const tRaw = data.slice(196, 212)
  // final
  const f = data.slice(212, 213)[0] === 1

  const gasUsed = new BN(opts._common.param('gasPrices', 'blake2bRound'))
  gasUsed.imul(new BN(rounds))
  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  const h = new Uint32Array(16)
  for (let i = 0; i < 16; i++) {
    h[i] = hRaw.readUInt32LE(i * 4)
  }

  const m = new Uint32Array(32)
  for (let i = 0; i < 32; i++) {
    m[i] = mRaw.readUInt32LE(i * 4)
  }

  const t = new Uint32Array(4)
  for (let i = 0; i < 4; i++) {
    t[i] = tRaw.readUInt32LE(i * 4)
  }

  F(h, m, t, f, rounds)

  const output = Buffer.alloc(64)
  for (let i = 0; i < 16; i++) {
    output.writeUInt32LE(h[i], i * 4)
  }

  return {
    gasUsed,
    returnValue: output,
  }
}
