/**
 * Methods for elliptic curve multiplication by scalars.
 * Contains wNAF, pippenger
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { nLength, validateField } from './modular.js'
import { bitLen, validateObject } from './utils.js'
const _0n = BigInt(0)
const _1n = BigInt(1)
function constTimeNegate(condition, item) {
  const neg = item.negate()
  return condition ? neg : item
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error('invalid window size, expected [1..' + bits + '], got W=' + W)
}
function calcWOpts(W, bits) {
  validateW(W, bits)
  const windows = Math.ceil(bits / W) + 1 // +1, because
  const windowSize = 2 ** (W - 1) // -1 because we skip zero
  return { windows, windowSize }
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points)) throw new Error('array expected')
  points.forEach((p, i) => {
    if (!(p instanceof c)) throw new Error('invalid point at index ' + i)
  })
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars)) throw new Error('array of scalars expected')
  scalars.forEach((s, i) => {
    if (!field.isValid(s)) throw new Error('invalid scalar at index ' + i)
  })
}
// Since points in different groups cannot be equal (different object constructor),
// we can have single place to store precomputes
const pointPrecomputes = new WeakMap()
const pointWindowSizes = new WeakMap() // This allows use make points immutable (nothing changes inside)
function getW(P) {
  return pointWindowSizes.get(P) || 1
}
/**
 * Elliptic curve multiplication of Point by scalar. Fragile.
 * Scalars should always be less than curve order: this should be checked inside of a curve itself.
 * Creates precomputation tables for fast multiplication:
 * - private scalar is split by fixed size windows of W bits
 * - every window point is collected from window's table & added to accumulator
 * - since windows are different, same point inside tables won't be accessed more than once per calc
 * - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
 * - +1 window is neccessary for wNAF
 * - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
 *
 * @todo Research returning 2d JS array of windows, instead of a single window.
 * This would allow windows to be in different memory locations
 */
export function wNAF(c, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p = c.ZERO) {
      let d = elm
      while (n > _0n) {
        if (n & _1n) p = p.add(d)
        d = d.double()
        n >>= _1n
      }
      return p
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits)
      const points = []
      let p = elm
      let base = p
      for (let window = 0; window < windows; window++) {
        base = p
        points.push(base)
        // =1, because we skip zero
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p)
          points.push(base)
        }
        p = base.double()
      }
      return points
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
      // But need to carefully remove other checks before wNAF. ORDER == bits here
      const { windows, windowSize } = calcWOpts(W, bits)
      let p = c.ZERO
      let f = c.BASE
      const mask = BigInt(2 ** W - 1) // Create mask with W ones: 0b1111 for W=4 etc.
      const maxNumber = 2 ** W
      const shiftBy = BigInt(W)
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize
        // Extract W bits.
        let wbits = Number(n & mask)
        // Shift number by W bits.
        n >>= shiftBy
        // If the bits are bigger than max size, we'll split those.
        // +224 => 256 - 32
        if (wbits > windowSize) {
          wbits -= maxNumber
          n += _1n
        }
        // This code was first written with assumption that 'f' and 'p' will never be infinity point:
        // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
        // there is negate now: it is possible that negated element from low value
        // would be the same as high element, which will create carry into next window.
        // It's not obvious how this can fail, but still worth investigating later.
        // Check if we're onto Zero point.
        // Add random point inside current window to f.
        const offset1 = offset
        const offset2 = offset + Math.abs(wbits) - 1 // -1 because we skip zero
        const cond1 = window % 2 !== 0
        const cond2 = wbits < 0
        if (wbits === 0) {
          // The most important part for const-time getPublicKey
          f = f.add(constTimeNegate(cond1, precomputes[offset1]))
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]))
        }
      }
      // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
      // Even if the variable is still unused, there are some checks which will
      // throw an exception, so compiler needs to prove they won't happen, which is hard.
      // At this point there is a way to F be infinity-point even if p is not,
      // which makes it less const-time: around 1 bigint multiply.
      return { p, f }
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
      const { windows, windowSize } = calcWOpts(W, bits)
      const mask = BigInt(2 ** W - 1) // Create mask with W ones: 0b1111 for W=4 etc.
      const maxNumber = 2 ** W
      const shiftBy = BigInt(W)
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize
        if (n === _0n) break // No need to go over empty scalar
        // Extract W bits.
        let wbits = Number(n & mask)
        // Shift number by W bits.
        n >>= shiftBy
        // If the bits are bigger than max size, we'll split those.
        // +224 => 256 - 32
        if (wbits > windowSize) {
          wbits -= maxNumber
          n += _1n
        }
        if (wbits === 0) continue
        let curr = precomputes[offset + Math.abs(wbits) - 1] // -1 because we skip zero
        if (wbits < 0) curr = curr.negate()
        // NOTE: by re-using acc, we can save a lot of additions in case of MSM
        acc = acc.add(curr)
      }
      return acc
    },
    getPrecomputes(W, P, transform) {
      // Calculate precomputes on a first run, reuse them after
      let comp = pointPrecomputes.get(P)
      if (!comp) {
        comp = this.precomputeWindow(P, W)
        if (W !== 1) pointPrecomputes.set(P, transform(comp))
      }
      return comp
    },
    wNAFCached(P, n, transform) {
      const W = getW(P)
      return this.wNAF(W, this.getPrecomputes(W, P, transform), n)
    },
    wNAFCachedUnsafe(P, n, transform, prev) {
      const W = getW(P)
      if (W === 1) return this.unsafeLadder(P, n, prev) // For W=1 ladder is ~x2 faster
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev)
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W, bits)
      pointWindowSizes.set(P, W)
      pointPrecomputes.delete(P)
    },
  }
}
/**
 * Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
 * 30x faster vs naive addition on L=4096, 10x faster with precomputes.
 * For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
 * Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
 * @param c Curve Point constructor
 * @param fieldN field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @param scalars array of L scalars (aka private keys / bigints)
 */
export function pippenger(c, fieldN, points, scalars) {
  // If we split scalars by some window (let's say 8 bits), every chunk will only
  // take 256 buckets even if there are 4096 scalars, also re-uses double.
  // TODO:
  // - https://eprint.iacr.org/2024/750.pdf
  // - https://tches.iacr.org/index.php/TCHES/article/view/10287
  // 0 is accepted in scalars
  validateMSMPoints(points, c)
  validateMSMScalars(scalars, fieldN)
  if (points.length !== scalars.length)
    throw new Error('arrays of points and scalars must have equal length')
  const zero = c.ZERO
  const wbits = bitLen(BigInt(points.length))
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1 // in bits
  const MASK = (1 << windowSize) - 1
  const buckets = new Array(MASK + 1).fill(zero) // +1 for zero array
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize
  let sum = zero
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero)
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j]
      const wbits = Number((scalar >> BigInt(i)) & BigInt(MASK))
      buckets[wbits] = buckets[wbits].add(points[j])
    }
    let resI = zero // not using this will do small speed-up, but will lose ct
    // Skip first bucket, because it is zero
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j])
      resI = resI.add(sumI)
    }
    sum = sum.add(resI)
    if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double()
  }
  return sum
}
/**
 * Precomputed multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
 * @param c Curve Point constructor
 * @param fieldN field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @returns function which multiplies points with scaars
 */
export function precomputeMSMUnsafe(c, fieldN, points, windowSize) {
  /**
   * Performance Analysis of Window-based Precomputation
   *
   * Base Case (256-bit scalar, 8-bit window):
   * - Standard precomputation requires:
   *   - 31 additions per scalar × 256 scalars = 7,936 ops
   *   - Plus 255 summary additions = 8,191 total ops
   *   Note: Summary additions can be optimized via accumulator
   *
   * Chunked Precomputation Analysis:
   * - Using 32 chunks requires:
   *   - 255 additions per chunk
   *   - 256 doublings
   *   - Total: (255 × 32) + 256 = 8,416 ops
   *
   * Memory Usage Comparison:
   * Window Size | Standard Points | Chunked Points
   * ------------|-----------------|---------------
   *     4-bit   |     520         |      15
   *     8-bit   |    4,224        |     255
   *    10-bit   |   13,824        |   1,023
   *    16-bit   |  557,056        |  65,535
   *
   * Key Advantages:
   * 1. Enables larger window sizes due to reduced memory overhead
   * 2. More efficient for smaller scalar counts:
   *    - 16 chunks: (16 × 255) + 256 = 4,336 ops
   *    - ~2x faster than standard 8,191 ops
   *
   * Limitations:
   * - Not suitable for plain precomputes (requires 256 constant doublings)
   * - Performance degrades with larger scalar counts:
   *   - Optimal for ~256 scalars
   *   - Less efficient for 4096+ scalars (Pippenger preferred)
   */
  validateW(windowSize, fieldN.BITS)
  validateMSMPoints(points, c)
  const zero = c.ZERO
  const tableSize = 2 ** windowSize - 1 // table size (without zero)
  const chunks = Math.ceil(fieldN.BITS / windowSize) // chunks of item
  const MASK = BigInt((1 << windowSize) - 1)
  const tables = points.map((p) => {
    const res = []
    for (let i = 0, acc = p; i < tableSize; i++) {
      res.push(acc)
      acc = acc.add(p)
    }
    return res
  })
  return (scalars) => {
    validateMSMScalars(scalars, fieldN)
    if (scalars.length > points.length)
      throw new Error('array of scalars must be smaller than array of points')
    let res = zero
    for (let i = 0; i < chunks; i++) {
      // No need to double if accumulator is still zero.
      if (res !== zero) for (let j = 0; j < windowSize; j++) res = res.double()
      const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize)
      for (let j = 0; j < scalars.length; j++) {
        const n = scalars[j]
        const curr = Number((n >> shiftBy) & MASK)
        if (!curr) continue // skip zero scalars chunks
        res = res.add(tables[j][curr - 1])
      }
    }
    return res
  }
}
export function validateBasic(curve) {
  validateField(curve.Fp)
  validateObject(
    curve,
    {
      n: 'bigint',
      h: 'bigint',
      Gx: 'field',
      Gy: 'field',
    },
    {
      nBitLength: 'isSafeInteger',
      nByteLength: 'isSafeInteger',
    },
  )
  // Set defaults
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER },
  })
}
//# sourceMappingURL=curve.js.map
