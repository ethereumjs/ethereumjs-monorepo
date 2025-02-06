import { MASK_64, add64, madd0, madd1, madd2, mul64, sub64 } from './index.js'

function montMulMod64(
  z: bigint[],
  x: bigint[],
  y: bigint[],
  modulus: bigint[],
  modInv: bigint,
): void {
  const x0 = x[0] & MASK_64
  const y0 = y[0] & MASK_64
  const m0 = modulus[0] & MASK_64
  const inv = modInv & MASK_64

  let t0 = 0n
  let t1 = 0n

  let D = 0n
  let C = 0n
  let m = 0n

  let res = 0n

  {
    const [carryMul, lowMul] = mul64(x0, y0)
    C = carryMul
    t0 = lowMul
  }

  {
    const [sumLow, carryOut] = add64(t1, C, 0n)
    t1 = sumLow
    D = carryOut
  }

  m = (t0 * inv) & MASK_64
  {
    const C = madd0(m, m0, t0)
    {
      const [sumLow, carryOut] = add64(t1, C, 0n)
      t0 = sumLow
      var newC = carryOut
    }

    {
      const [sumLow2, carryOut2] = add64(0n, D, newC)
      t1 = sumLow2
    }
  }

  {
    const [diff, borrow] = sub64(t0, m0, 0n)
    res = diff
    D = borrow
  }

  let src: bigint
  if (D !== 0n && t1 === 0n) {
    src = t0
  } else {
    src = res
  }

  z[0] = src & MASK_64
}

function montMulMod128(
  out: bigint[],
  x: bigint[],
  y: bigint[],
  mod: bigint[],
  modInv: bigint,
): void {
  const t = [0n, 0n, 0n]
  let D = 0n
  let m = 0n
  let C = 0n

  const res = [0n, 0n]

  {
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0

      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1

      const [temp2, tempD] = add64(t[2], C, 0n)
      t[2] = temp2
      D = tempD
    }

    m = (t[0] * modInv) & MASK_64

    {
      C = madd0(m, mod[0], t[0])

      const [c2, t0_] = madd2(m, mod[1], t[1], C)
      C = c2
      t[0] = t0_

      const [t1_, c3] = add64(t[2], C, 0n)
      t[1] = t1_
      C = c3

      const [t2_, _dummy] = add64(0n, D, C)
      t[2] = t2_
    }
  }

  {
    {
      const [c4, t0_] = madd1(x[1], y[0], t[0])
      C = c4
      t[0] = t0_

      const [c5, t1_] = madd2(x[1], y[1], t[1], C)
      C = c5
      t[1] = t1_

      const [t2_, d_] = add64(t[2], C, 0n)
      t[2] = t2_
      D = d_
    }

    m = (t[0] * modInv) & MASK_64

    {
      C = madd0(m, mod[0], t[0])

      const [c6, t0_] = madd2(m, mod[1], t[1], C)
      C = c6
      t[0] = t0_

      const [t1_, c7] = add64(t[2], C, 0n)
      t[1] = t1_
      C = c7

      const [t2_, _dummy2] = add64(0n, D, C)
      t[2] = t2_
    }
  }

  {
    const [r0, d0] = sub64(t[0], mod[0], 0n)
    res[0] = r0
    let D_ = d0

    const [r1, d1] = sub64(t[1], mod[1], D_)
    res[1] = r1
    D_ = d1

    if (D_ !== 0n && t[2] === 0n) {
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
    }
  }
}

function montMulMod192(
  out: bigint[], // [3], final result
  x: bigint[], // [3], input x
  y: bigint[], // [3], input y
  mod: bigint[], // [3], the modulus
  modInv: bigint, // single-limb "magic factor"
): void {
  // We'll keep partial results in t[0..3].
  // t has 4 limbs to handle overflow from 3-limb multiplication.
  const t = [0n, 0n, 0n, 0n]
  let D = 0n
  let m = 0n
  let C = 0n
  const res = [0n, 0n, 0n]

  console.log('dbg100')
  console.log(`t ${t}`)
  console.log(`C ${C}`)
  console.log(`D ${D}`)
  console.log(`m ${m}`)

  // --------------------------------------------
  // First outer block (j = 0)
  {
    // 1) t <- x[0] * y[..]
    {
      // C, t[0] = bits.Mul64(x[0], y[0])
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0

      // C, t[1] = madd1(x[0], y[1], C)
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1

      // C, t[2] = madd1(x[0], y[2], C)
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      {
        const [t2_, d_] = add64(t[2], lo2, 0n)
        t[2] = t2_
        D = d_
      }

      // t[3], D = bits.Add64(t[3], C, 0)
      {
        const [t3_, d2] = add64(t[3], C, 0n)
        t[3] = t3_
        D += d2
      }
    }

    // 2) m = t[0]*modInv mod 2^64
    m = (t[0] * modInv) & MASK_64

    console.log('dbg101')
    console.log(`t ${t}`)
    console.log(`C ${C}`)
    console.log(`D ${D}`)
    console.log(`m ${m}`)

    // 3) reduce 1 limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // C, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c2, t0_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t0_
      }

      // C, t[1] = madd2(m, mod[2], t[2], C)
      {
        const [c3, t1_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t1_
      }

      // t[2], C = bits.Add64(t[3], C, 0)
      {
        const [t2_, c4] = add64(t[3], C, 0n)
        t[2] = t2_
        C = c4
      }
      // t[3], _ = bits.Add64(0, D, C)
      {
        const [t3_, d_] = add64(0n, D, C)
        t[3] = t3_
      }
    }
  }

  console.log('dbg102')
  console.log(`t ${t}`)
  console.log(`C ${C}`)
  console.log(`D ${D}`)
  console.log(`m ${m}`)

  // --------------------------------------------
  // Next outer blocks for j=1..2
  for (let j = 1; j < 3; j++) {
    // 1) partial multiply x[j] * y => accumulate in t
    {
      // C, t[0] = madd1(x[j], y[0], t[0])
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_

      // C, t[1] = madd2(x[j], y[1], t[1], C)
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_

      // C, t[2] = madd2(x[j], y[2], t[2], C)
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_

      // t[3], D = bits.Add64(t[3], C, 0)
      {
        const [t3_, d_] = add64(t[3], C, 0n)
        t[3] = t3_
        D = d_
      }
    }

    // 2) m = t[0]*modInv (mod 2^64)
    m = (t[0] * modInv) & MASK_64

    // 3) reduce one limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // C, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c7, t0_] = madd2(m, mod[1], t[1], C)
        C = c7
        t[0] = t0_
      }

      // C, t[1] = madd2(m, mod[2], t[2], C)
      {
        const [c7, t1_] = madd2(m, mod[2], t[2], C)
        C = c7
        t[1] = t1_
      }

      // t[2], C = bits.Add64(t[2], C, 0)
      {
        const [t2_, c9] = add64(t[3], C, 0n)
        t[2] = t2_
        C = c9
      }

      // t[3], _ = bits.Add64(0, D, C)
      {
        const [t3_, d_] = add64(0n, D, C)
        t[3] = t3_
      }
    }
  }

  console.log('dbg103')
  console.log(`t ${t}`)
  console.log(`C ${C}`)
  console.log(`D ${D}`)
  console.log(`m ${m}`)

  // --------------------------------------------
  // Final subtract => res = t[0..2] - mod[0..2].
  // If that borrow != 0 and t[3] == 0 => revert to t, else keep res
  {
    let d_ = 0n
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }

    if (d_ !== 0n && t[3] === 0n) {
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
    }
  }

  console.log('dbg104')
  console.log(`out ${out}`)
}

function montMulMod256(
  out: bigint[], // [4] => final 256-bit result
  x: bigint[], // [4] => input x
  y: bigint[], // [4] => input y
  mod: bigint[], // [4] => the modulus
  modInv: bigint, // single-limb "magic factor" => -mod^-1 mod 2^64
): void {
  // t has 5 limbs => partial sums from 4-limb multiply can overflow into a 5th limb.
  const t = [0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let m = 0n
  let C = 0n
  // store the final 4-limb subtract result in res
  const res = [0n, 0n, 0n, 0n]

  // -------------------------------
  // 1) First outer loop (unrolled) => j=0
  {
    // partial multiply x[0]*y[0..3], store in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // C, t[1] = madd1(x[0], y[1], C)
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    // C, t[2] = madd1(x[0], y[2], C)
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    // C, t[3] = madd1(x[0], y[3], C)
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }

    // t[4], D = bits.Add64(t[4], C, 0)
    {
      const [t4_, d_] = add64(t[4], C, 0n)
      t[4] = t4_
      D = d_
    }

    // m = t[0]*modInv mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // C, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c2, t0_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t0_
      }

      // C, t[1] = madd2(m, mod[2], t[2], C)
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }

      // C, t[2] = madd2(m, mod[3], t[3], C)
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }

      // t[3], C = bits.Add64(t[4], C, 0)
      {
        const [t4_, c5] = add64(t[4], C, 0n)
        t[3] = t4_
        C = c5
      }

      // t[4], _ = bits.Add64(0, D, C)
      {
        const [t4_, carryOut] = add64(0n, D, C)
        t[4] = t4_
        // carryOut is not stored => single-limb leftover
      }
    }
  }

  // -------------------------------
  // 2) For j=1..3
  for (let j = 1; j < 4; j++) {
    // partial multiply x[j] * y[0..3], plus t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    // C, t[1] = madd2(x[j], y[1], t[1], C)
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    // C, t[2] = madd2(x[j], y[2], t[2], C)
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    // C, t[3] = madd2(x[j], y[3], t[3], C)
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }

    // t[4], D = bits.Add64(t[4], C, 0)
    {
      const [t4_, d_] = add64(t[4], C, 0n)
      t[4] = t4_
      D = d_
    }

    // m = t[0]*modInv mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // C, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c8, t0_] = madd2(m, mod[1], t[1], C)
        C = c8
        t[0] = t0_
      }

      // C, t[1] = madd2(m, mod[2], t[2], C)
      {
        const [c9, t2_] = madd2(m, mod[2], t[2], C)
        C = c9
        t[1] = t2_
      }

      // C, t[2] = madd2(m, mod[3], t[3], C)
      {
        const [c10, t3_] = madd2(m, mod[3], t[3], C)
        C = c10
        t[2] = t3_
      }

      // t[3], C = bits.Add64(t[4], C, 0)
      {
        const [t4_, c11] = add64(t[4], C, 0n)
        t[3] = t4_
        C = c11
      }

      // t[4], _ = bits.Add64(0, D, C)
      {
        const [t4_, carryOut] = add64(0n, D, C)
        t[4] = t4_
        // carryOut not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res = t[0..3] - mod[0..3].
  // If borrow != 0 && t[4] == 0 => revert to t, else keep res
  {
    let d_ = 0n

    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }

    if (d_ !== 0n && t[4] === 0n) {
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
      out[3] = t[3] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
      out[3] = res[3] & MASK_64
    }
  }
}

function montMulMod320(
  out: bigint[], // [5], final 320-bit result
  x: bigint[], // [5], input x
  y: bigint[], // [5], input y
  mod: bigint[], // [5], the modulus
  modInv: bigint, // single-limb "magic factor" => -mod^-1 mod 2^64
): void {
  // t => partial sums, 6 limbs to handle overflow
  const t = [0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let C = 0n
  let m = 0n

  // final subtract result
  const res = [0n, 0n, 0n, 0n, 0n]

  //-------------------------------
  // 1) "First outer loop" => j=0
  {
    // multiply x[0] * y[0..4], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // C, t[1] = madd1(x[0], y[1], C)
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    // C, t[2] = madd1(x[0], y[2], C)
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    // C, t[3] = madd1(x[0], y[3], C)
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    // C, t[4] = madd1(x[0], y[4], C)
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }

    // t[5], D = bits.Add64(t[5], C, 0)
    {
      const [t5_, d2] = add64(t[5], C, 0n)
      D = d2
      t[5] = t5_
    }

    // m = t[0] * modInv mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // next: c, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }

      // t[4], C = bits.Add64(t[5], C, 0)
      {
        const [t5_, c6] = add64(t[5], C, 0n)
        t[4] = t5_
        C = c6
      }
      // t[5], _ = bits.Add64(0, D, C)
      {
        const [t5_, leftover] = add64(0n, D, C)
        t[5] = t5_
        // leftover is single-limb carry, not stored
      }
    }
  }

  //-------------------------------
  // 2) For j=1..4
  for (let j = 1; j < 5; j++) {
    // partial multiply x[j] * y[0..4], incorporate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }

    // t[5], D = bits.Add64(t[5], C, 0)
    {
      const [t5_, d_] = add64(t[5], C, 0n)
      t[5] = t5_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])
      {
        const [c9, t1_] = madd2(m, mod[1], t[1], C)
        C = c9
        t[0] = t1_
      }
      {
        const [c10, t2_] = madd2(m, mod[2], t[2], C)
        C = c10
        t[1] = t2_
      }
      {
        const [c11, t3_] = madd2(m, mod[3], t[3], C)
        C = c11
        t[2] = t3_
      }
      {
        const [c12, t4_] = madd2(m, mod[4], t[4], C)
        C = c12
        t[3] = t4_
      }

      {
        const [t5_, c13] = add64(t[5], C, 0n)
        t[4] = t5_
        C = c13
      }
      {
        const [t5_, leftover] = add64(0n, D, C)
        t[5] = t5_
        // leftover not stored
      }
    }
  }

  //-------------------------------
  // Final subtract => res = t[0..4] - mod[0..4]
  // if borrow != 0 && t[5]==0 => revert, else keep
  {
    let d_ = 0n

    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }

    if (d_ !== 0n && t[5] === 0n) {
      // revert => t
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
      out[3] = t[3] & MASK_64
      out[4] = t[4] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
      out[3] = res[3] & MASK_64
      out[4] = res[4] & MASK_64
    }
  }
}

function montMulMod384(
  out: bigint[], // [6], final 384-bit result
  x: bigint[], // [6], input x
  y: bigint[], // [6], input y
  mod: bigint[], // [6], the modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 7 limbs to handle overflow from 6-limb multiplication
  const t = [0n, 0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let m = 0n
  let C = 0n

  // final subtract result
  const res = [0n, 0n, 0n, 0n, 0n, 0n]

  // -------------------------------
  // 1) “first outer loop”, for j=0
  {
    // Multiply x[0] * y[0..5], accumulate into t

    // step-by-step:
    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // C, t[1] = madd1(x[0], y[1], C)
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    // C, t[2] = madd1(x[0], y[2], C)
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    // C, t[3] = madd1(x[0], y[3], C)
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    // C, t[4] = madd1(x[0], y[4], C)
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    // C, t[5] = madd1(x[0], y[5], C)
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }

    // t[6], D = bits.Add64(t[6], C, 0)
    {
      const [t6_, d2] = add64(t[6], C, 0n)
      t[6] = t6_
      D = d2
    }

    // m = (t[0] * modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => “1 limb at a time”
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      // C, t[0] = madd2(m, mod[1], t[1], C)
      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }

      // t[5], C = bits.Add64(t[6], C, 0)
      {
        const [t6_, c7] = add64(t[6], C, 0n)
        t[5] = t6_
        C = c7
      }

      // t[6], _ = bits.Add64(0, D, C)
      {
        const [t6_, leftover] = add64(0n, D, C)
        t[6] = t6_
        // leftover ignored for single-limb
      }
    }
  }

  // -------------------------------
  // 2) for j=1..5
  for (let j = 1; j < 6; j++) {
    // multiply x[j]*y[0..5], incorporate into t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }

    // t[6], D = bits.Add64(t[6], C, 0)
    {
      const [t6_, d_] = add64(t[6], C, 0n)
      t[6] = t6_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])
      {
        const [c10, t1_] = madd2(m, mod[1], t[1], C)
        C = c10
        t[0] = t1_
      }
      {
        const [c11, t2_] = madd2(m, mod[2], t[2], C)
        C = c11
        t[1] = t2_
      }
      {
        const [c12, t3_] = madd2(m, mod[3], t[3], C)
        C = c12
        t[2] = t3_
      }
      {
        const [c13, t4_] = madd2(m, mod[4], t[4], C)
        C = c13
        t[3] = t4_
      }
      {
        const [c14, t5_] = madd2(m, mod[5], t[5], C)
        C = c14
        t[4] = t5_
      }

      {
        const [t6_, c15] = add64(t[6], C, 0n)
        t[5] = t6_
        C = c15
      }

      {
        const [t6_, leftover2] = add64(0n, D, C)
        t[6] = t6_
        // leftover2 not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res[i] = t[i] - mod[i], for i=0..5
  // if borrow != 0 && t[6]==0 => revert t, else keep res
  {
    let d_ = 0n
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }
    {
      const [r5, b5] = sub64(t[5], mod[5], d_)
      res[5] = r5
      d_ = b5
    }

    if (d_ !== 0n && t[6] === 0n) {
      // revert => keep t[0..5]
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
      out[3] = t[3] & MASK_64
      out[4] = t[4] & MASK_64
      out[5] = t[5] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
      out[3] = res[3] & MASK_64
      out[4] = res[4] & MASK_64
      out[5] = res[5] & MASK_64
    }
  }
}

function montMulMod448(
  out: bigint[], // [7] => final 448-bit result
  x: bigint[], // [7] => input x
  y: bigint[], // [7] => input y
  mod: bigint[], // [7] => the modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 8 limbs for overflow from 7-limb multiplication
  const t = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let C = 0n
  let m = 0n

  // final subtract array
  const res = [0n, 0n, 0n, 0n, 0n, 0n, 0n]

  // ---------------------------------
  // 1) First outer block => j=0
  {
    // Multiply x[0] * y[0..6], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }

    // Repeatedly call madd1(x[0], y[i], C) for i=1..6
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }

    // t[7], D = bits.Add64(t[7], C, 0)
    {
      const [t7_, d2] = add64(t[7], C, 0n)
      t[7] = t7_
      D = d2
    }

    // m = (t[0] * modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => one limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        // C, t[0] = madd2(m, mod[1], t[1], C)
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }

      // t[6], C = bits.Add64(t[7], C, 0)
      {
        const [t7_, c8] = add64(t[7], C, 0n)
        t[6] = t7_
        C = c8
      }
      // t[7], _ = bits.Add64(0, D, C)
      {
        const [t7_, leftover] = add64(0n, D, C)
        t[7] = t7_
        // leftover ignored
      }
    }
  }

  // ---------------------------------
  // 2) for j=1..6
  for (let j = 1; j < 7; j++) {
    // multiply x[j] * y[0..6], accumulate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }

    // t[7], D = bits.Add64(t[7], C, 0)
    {
      const [t7_, d_] = add64(t[7], C, 0n)
      t[7] = t7_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => one limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c11, t1_] = madd2(m, mod[1], t[1], C)
        C = c11
        t[0] = t1_
      }
      {
        const [c12, t2_] = madd2(m, mod[2], t[2], C)
        C = c12
        t[1] = t2_
      }
      {
        const [c13, t3_] = madd2(m, mod[3], t[3], C)
        C = c13
        t[2] = t3_
      }
      {
        const [c14, t4_] = madd2(m, mod[4], t[4], C)
        C = c14
        t[3] = t4_
      }
      {
        const [c15, t5_] = madd2(m, mod[5], t[5], C)
        C = c15
        t[4] = t5_
      }
      {
        const [c16, t6_] = madd2(m, mod[6], t[6], C)
        C = c16
        t[5] = t6_
      }

      {
        const [t7_, c17] = add64(t[7], C, 0n)
        t[6] = t7_
        C = c17
      }

      {
        const [t7_, leftover2] = add64(0n, D, C)
        t[7] = t7_
        // leftover2 not stored
      }
    }
  }

  // ---------------------------------
  // Final subtract => res[i] = t[i] - mod[i], for i=0..6
  // if borrow != 0 && t[7] == 0 => revert => keep t
  {
    let d_ = 0n
    // subtract limbs
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }
    {
      const [r5, b5] = sub64(t[5], mod[5], d_)
      res[5] = r5
      d_ = b5
    }
    {
      const [r6, b6] = sub64(t[6], mod[6], d_)
      res[6] = r6
      d_ = b6
    }

    // if d_ != 0 && t[7] == 0 => revert to t, else keep res
    if (d_ !== 0n && t[7] === 0n) {
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
      out[3] = t[3] & MASK_64
      out[4] = t[4] & MASK_64
      out[5] = t[5] & MASK_64
      out[6] = t[6] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
      out[3] = res[3] & MASK_64
      out[4] = res[4] & MASK_64
      out[5] = res[5] & MASK_64
      out[6] = res[6] & MASK_64
    }
  }
}

function montMulMod512(
  out: bigint[], // [8], final 512-bit result
  x: bigint[], // [8], input x
  y: bigint[], // [8], input y
  mod: bigint[], // [8], the modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 9 limbs for overflow from 8-limb multiplication
  const t = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let C = 0n
  let m = 0n

  // final subtract buffer
  const res = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]

  //-------------------------------
  // 1) “first outer loop” => j=0
  {
    // multiply x[0] * y[0..7], accumulate in t

    // Step by step:
    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // C, t[1] = madd1(x[0], y[1], C)
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    // Repeat for y[2]..y[7]
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }
    {
      const [hi7, lo7] = madd1(x[0], y[7], C)
      C = hi7
      t[7] = lo7
    }

    // t[8], D = bits.Add64(t[8], C, 0)
    {
      const [t8_, d2] = add64(t[8], C, 0n)
      t[8] = t8_
      D = d2
    }

    // m = (t[0] * modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => one limb at a time
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }
      {
        const [c8, t7_] = madd2(m, mod[7], t[7], C)
        C = c8
        t[6] = t7_
      }

      // t[7], C = bits.Add64(t[8], C, 0)
      {
        const [t8_, c9] = add64(t[8], C, 0n)
        t[7] = t8_
        C = c9
      }
      // t[8], _ = bits.Add64(0, D, C)
      {
        const [t8_, leftover] = add64(0n, D, C)
        t[8] = t8_
        // leftover not stored for single-limb
      }
    }
  }

  // -------------------------------
  // 2) For j=1..7
  for (let j = 1; j < 8; j++) {
    // multiply x[j]*y[0..7], incorporate into t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }
    {
      const [c11, t7_] = madd2(x[j], y[7], t[7], C)
      C = c11
      t[7] = t7_
    }

    {
      const [t8_, d_] = add64(t[8], C, 0n)
      t[8] = t8_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])

      {
        const [c12, t1_] = madd2(m, mod[1], t[1], C)
        C = c12
        t[0] = t1_
      }
      {
        const [c13, t2_] = madd2(m, mod[2], t[2], C)
        C = c13
        t[1] = t2_
      }
      {
        const [c14, t3_] = madd2(m, mod[3], t[3], C)
        C = c14
        t[2] = t3_
      }
      {
        const [c15, t4_] = madd2(m, mod[4], t[4], C)
        C = c15
        t[3] = t4_
      }
      {
        const [c16, t5_] = madd2(m, mod[5], t[5], C)
        C = c16
        t[4] = t5_
      }
      {
        const [c17, t6_] = madd2(m, mod[6], t[6], C)
        C = c17
        t[5] = t6_
      }
      {
        const [c18, t7_] = madd2(m, mod[7], t[7], C)
        C = c18
        t[6] = t7_
      }

      {
        const [t8_, c19] = add64(t[8], C, 0n)
        t[7] = t8_
        C = c19
      }

      {
        const [t8_, leftover2] = add64(0n, D, C)
        t[8] = t8_
        // leftover2 not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res = t[0..7] - mod[0..7]
  // if borrow != 0 && t[8] == 0 => revert, else keep
  {
    let d_ = 0n
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }
    {
      const [r5, b5] = sub64(t[5], mod[5], d_)
      res[5] = r5
      d_ = b5
    }
    {
      const [r6, b6] = sub64(t[6], mod[6], d_)
      res[6] = r6
      d_ = b6
    }
    {
      const [r7, b7] = sub64(t[7], mod[7], d_)
      res[7] = r7
      d_ = b7
    }

    if (d_ !== 0n && t[8] === 0n) {
      // revert => keep t
      out[0] = t[0] & MASK_64
      out[1] = t[1] & MASK_64
      out[2] = t[2] & MASK_64
      out[3] = t[3] & MASK_64
      out[4] = t[4] & MASK_64
      out[5] = t[5] & MASK_64
      out[6] = t[6] & MASK_64
      out[7] = t[7] & MASK_64
    } else {
      out[0] = res[0] & MASK_64
      out[1] = res[1] & MASK_64
      out[2] = res[2] & MASK_64
      out[3] = res[3] & MASK_64
      out[4] = res[4] & MASK_64
      out[5] = res[5] & MASK_64
      out[6] = res[6] & MASK_64
      out[7] = res[7] & MASK_64
    }
  }
}

function montMulMod576(
  out: bigint[], // [9], final 576-bit result
  x: bigint[], // [9], input x
  y: bigint[], // [9], input y
  mod: bigint[], // [9], modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 10 limbs for overflow from 9-limb multiplication
  const t = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let C = 0n
  let m = 0n

  // store the final subtract results
  const res = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]

  // -------------------------------
  // 1) First outer loop => j=0
  {
    // multiply x[0] * y[0..8], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // C, t[1] = madd1(x[0], y[1], C)
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }
    {
      const [hi7, lo7] = madd1(x[0], y[7], C)
      C = hi7
      t[7] = lo7
    }
    {
      const [hi8, lo8] = madd1(x[0], y[8], C)
      C = hi8
      t[8] = lo8
    }

    // t[9], D = bits.Add64(t[9], C, 0)
    {
      const [t9_, d2] = add64(t[9], C, 0n)
      t[9] = t9_
      D = d2
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => 1 limb
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }
      {
        const [c8, t7_] = madd2(m, mod[7], t[7], C)
        C = c8
        t[6] = t7_
      }
      {
        const [c9, t8_] = madd2(m, mod[8], t[8], C)
        C = c9
        t[7] = t8_
      }

      // t[8], C = bits.Add64(t[9], C, 0)
      {
        const [t9_, c10] = add64(t[9], C, 0n)
        t[8] = t9_
        C = c10
      }
      // t[9], _ = bits.Add64(0, D, C)
      {
        const [t9_, leftover] = add64(0n, D, C)
        t[9] = t9_
        // leftover ignored
      }
    }
  }

  // -------------------------------
  // 2) for j=1..8
  for (let j = 1; j < 9; j++) {
    // multiply x[j]*y[0..8], accumulate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }
    {
      const [c11, t7_] = madd2(x[j], y[7], t[7], C)
      C = c11
      t[7] = t7_
    }
    {
      const [c12, t8_] = madd2(x[j], y[8], t[8], C)
      C = c12
      t[8] = t8_
    }

    {
      const [t9_, d_] = add64(t[9], C, 0n)
      t[9] = t9_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // reduce => 1 limb
    {
      C = madd0(m, mod[0], t[0])

      {
        const [c13, t1_] = madd2(m, mod[1], t[1], C)
        C = c13
        t[0] = t1_
      }
      {
        const [c14, t2_] = madd2(m, mod[2], t[2], C)
        C = c14
        t[1] = t2_
      }
      {
        const [c15, t3_] = madd2(m, mod[3], t[3], C)
        C = c15
        t[2] = t3_
      }
      {
        const [c16, t4_] = madd2(m, mod[4], t[4], C)
        C = c16
        t[3] = t4_
      }
      {
        const [c17, t5_] = madd2(m, mod[5], t[5], C)
        C = c17
        t[4] = t5_
      }
      {
        const [c18, t6_] = madd2(m, mod[6], t[6], C)
        C = c18
        t[5] = t6_
      }
      {
        const [c19, t7_] = madd2(m, mod[7], t[7], C)
        C = c19
        t[6] = t7_
      }
      {
        const [c20, t8_] = madd2(m, mod[8], t[8], C)
        C = c20
        t[7] = t8_
      }

      {
        const [t9_, c21] = add64(t[9], C, 0n)
        t[8] = t9_
        C = c21
      }

      {
        const [t9_, leftover2] = add64(0n, D, C)
        t[9] = t9_
        // leftover2 not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res = t[0..8] - mod[0..8]
  // if borrow != 0 && t[9] == 0 => revert => keep t
  {
    let d_ = 0n
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }
    {
      const [r5, b5] = sub64(t[5], mod[5], d_)
      res[5] = r5
      d_ = b5
    }
    {
      const [r6, b6] = sub64(t[6], mod[6], d_)
      res[6] = r6
      d_ = b6
    }
    {
      const [r7, b7] = sub64(t[7], mod[7], d_)
      res[7] = r7
      d_ = b7
    }
    {
      const [r8, b8] = sub64(t[8], mod[8], d_)
      res[8] = r8
      d_ = b8
    }

    if (d_ !== 0n && t[9] === 0n) {
      // revert => keep t
      for (let i = 0; i < 9; i++) {
        out[i] = t[i] & MASK_64
      }
    } else {
      for (let i = 0; i < 9; i++) {
        out[i] = res[i] & MASK_64
      }
    }
  }
}

function montMulMod640(
  out: bigint[], // [10], final 640-bit result
  x: bigint[], // [10], input x
  y: bigint[], // [10], input y
  mod: bigint[], // [10], the modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // Temporary accumulation array t, length 11 for overflow
  const t = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
  let D = 0n
  let C = 0n
  let m = 0n

  // We'll store the final subtract result in `res`.
  const res = new Array<bigint>(10).fill(0n)

  // 1) "First outer loop" => j=0
  {
    // multiply x[0]*y[0..9], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // Then do madd1 for y[1..9]
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }
    {
      const [hi7, lo7] = madd1(x[0], y[7], C)
      C = hi7
      t[7] = lo7
    }
    {
      const [hi8, lo8] = madd1(x[0], y[8], C)
      C = hi8
      t[8] = lo8
    }
    {
      const [hi9, lo9] = madd1(x[0], y[9], C)
      C = hi9
      t[9] = lo9
    }

    // t[10], D = bits.Add64(t[10], C, 0)
    {
      const [t10_, d2] = add64(t[10], C, 0n)
      t[10] = t10_
      D = d2
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => "one limb at a time"
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }
      {
        const [c8, t7_] = madd2(m, mod[7], t[7], C)
        C = c8
        t[6] = t7_
      }
      {
        const [c9, t8_] = madd2(m, mod[8], t[8], C)
        C = c9
        t[7] = t8_
      }
      {
        const [c10, t9_] = madd2(m, mod[9], t[9], C)
        C = c10
        t[8] = t9_
      }

      // t[9], C = bits.Add64(t[10], C, 0)
      {
        const [t10_, c11] = add64(t[10], C, 0n)
        t[9] = t10_
        C = c11
      }
      // t[10], _ = bits.Add64(0, D, C)
      {
        const [t10_, leftover] = add64(0n, D, C)
        t[10] = t10_
        // leftover not stored
      }
    }
  }

  // -------------------------------
  // 2) for j=1..9
  for (let j = 1; j < 10; j++) {
    // multiply x[j]*y[0..9], accumulate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }
    {
      const [c11, t7_] = madd2(x[j], y[7], t[7], C)
      C = c11
      t[7] = t7_
    }
    {
      const [c12, t8_] = madd2(x[j], y[8], t[8], C)
      C = c12
      t[8] = t8_
    }
    {
      const [c13, t9_] = madd2(x[j], y[9], t[9], C)
      C = c13
      t[9] = t9_
    }

    {
      const [t10_, d_] = add64(t[10], C, 0n)
      t[10] = t10_
      D = d_
    }

    // m = (t[0] * modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])

      {
        const [c14, t1_] = madd2(m, mod[1], t[1], C)
        C = c14
        t[0] = t1_
      }
      {
        const [c15, t2_] = madd2(m, mod[2], t[2], C)
        C = c15
        t[1] = t2_
      }
      {
        const [c16, t3_] = madd2(m, mod[3], t[3], C)
        C = c16
        t[2] = t3_
      }
      {
        const [c17, t4_] = madd2(m, mod[4], t[4], C)
        C = c17
        t[3] = t4_
      }
      {
        const [c18, t5_] = madd2(m, mod[5], t[5], C)
        C = c18
        t[4] = t5_
      }
      {
        const [c19, t6_] = madd2(m, mod[6], t[6], C)
        C = c19
        t[5] = t6_
      }
      {
        const [c20, t7_] = madd2(m, mod[7], t[7], C)
        C = c20
        t[6] = t7_
      }
      {
        const [c21, t8_] = madd2(m, mod[8], t[8], C)
        C = c21
        t[7] = t8_
      }
      {
        const [c22, t9_] = madd2(m, mod[9], t[9], C)
        C = c22
        t[8] = t9_
      }

      {
        const [t10_, c23] = add64(t[10], C, 0n)
        t[9] = t10_
        C = c23
      }

      {
        const [t10_, leftover2] = add64(0n, D, C)
        t[10] = t10_
        // leftover2 not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res[i] = t[i] - mod[i], for i=0..9
  // if borrow != 0 && t[10] == 0 => revert => keep t
  {
    let d_ = 0n
    {
      const [r0, b0] = sub64(t[0], mod[0], 0n)
      res[0] = r0
      d_ = b0
    }
    {
      const [r1, b1] = sub64(t[1], mod[1], d_)
      res[1] = r1
      d_ = b1
    }
    {
      const [r2, b2] = sub64(t[2], mod[2], d_)
      res[2] = r2
      d_ = b2
    }
    {
      const [r3, b3] = sub64(t[3], mod[3], d_)
      res[3] = r3
      d_ = b3
    }
    {
      const [r4, b4] = sub64(t[4], mod[4], d_)
      res[4] = r4
      d_ = b4
    }
    {
      const [r5, b5] = sub64(t[5], mod[5], d_)
      res[5] = r5
      d_ = b5
    }
    {
      const [r6, b6] = sub64(t[6], mod[6], d_)
      res[6] = r6
      d_ = b6
    }
    {
      const [r7, b7] = sub64(t[7], mod[7], d_)
      res[7] = r7
      d_ = b7
    }
    {
      const [r8, b8] = sub64(t[8], mod[8], d_)
      res[8] = r8
      d_ = b8
    }
    {
      const [r9, b9] = sub64(t[9], mod[9], d_)
      res[9] = r9
      d_ = b9
    }

    // If we borrowed but t[10] is 0 => revert => keep t
    if (d_ !== 0n && t[10] === 0n) {
      for (let i = 0; i < 10; i++) {
        out[i] = t[i] & MASK_64
      }
    } else {
      for (let i = 0; i < 10; i++) {
        out[i] = res[i] & MASK_64
      }
    }
  }
}

function montMulMod704(
  out: bigint[], // [11], final 704-bit result
  x: bigint[], // [11], input x
  y: bigint[], // [11], input y
  mod: bigint[], // [11], modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 12 limbs for overflow from 11-limb multiplication
  const t = new Array<bigint>(12).fill(0n)
  let D = 0n
  let C = 0n
  let m = 0n

  // store final subtract in res
  const res = new Array<bigint>(11).fill(0n)

  // -------------------------------
  // 1) "First outer loop" => j=0
  {
    // multiply x[0] * y[0..10], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // then do madd1 for y[1..10]
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }
    {
      const [hi7, lo7] = madd1(x[0], y[7], C)
      C = hi7
      t[7] = lo7
    }
    {
      const [hi8, lo8] = madd1(x[0], y[8], C)
      C = hi8
      t[8] = lo8
    }
    {
      const [hi9, lo9] = madd1(x[0], y[9], C)
      C = hi9
      t[9] = lo9
    }
    {
      const [hi10, lo10] = madd1(x[0], y[10], C)
      C = hi10
      t[10] = lo10
    }

    // t[11], D = bits.Add64(t[11], C, 0)
    {
      const [t11_, d2] = add64(t[11], C, 0n)
      t[11] = t11_
      D = d2
    }

    // m = (t[0] * modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => "one limb at a time"
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }
      {
        const [c8, t7_] = madd2(m, mod[7], t[7], C)
        C = c8
        t[6] = t7_
      }
      {
        const [c9, t8_] = madd2(m, mod[8], t[8], C)
        C = c9
        t[7] = t8_
      }
      {
        const [c10, t9_] = madd2(m, mod[9], t[9], C)
        C = c10
        t[8] = t9_
      }
      {
        const [c11, t10_] = madd2(m, mod[10], t[10], C)
        C = c11
        t[9] = t10_
      }

      {
        const [t11_, c12] = add64(t[11], C, 0n)
        t[10] = t11_
        C = c12
      }
      {
        const [t11_, leftover] = add64(0n, D, C)
        t[11] = t11_
        // leftover not used
      }
    }
  }

  // -------------------------------
  // 2) For j=1..10
  for (let j = 1; j < 11; j++) {
    // multiply x[j]*y[0..10], accumulate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }
    {
      const [c11, t7_] = madd2(x[j], y[7], t[7], C)
      C = c11
      t[7] = t7_
    }
    {
      const [c12, t8_] = madd2(x[j], y[8], t[8], C)
      C = c12
      t[8] = t8_
    }
    {
      const [c13, t9_] = madd2(x[j], y[9], t[9], C)
      C = c13
      t[9] = t9_
    }
    {
      const [c14, t10_] = madd2(x[j], y[10], t[10], C)
      C = c14
      t[10] = t10_
    }

    {
      const [t11_, d_] = add64(t[11], C, 0n)
      t[11] = t11_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])

      {
        const [c15, t1_] = madd2(m, mod[1], t[1], C)
        C = c15
        t[0] = t1_
      }
      {
        const [c16, t2_] = madd2(m, mod[2], t[2], C)
        C = c16
        t[1] = t2_
      }
      {
        const [c17, t3_] = madd2(m, mod[3], t[3], C)
        C = c17
        t[2] = t3_
      }
      {
        const [c18, t4_] = madd2(m, mod[4], t[4], C)
        C = c18
        t[3] = t4_
      }
      {
        const [c19, t5_] = madd2(m, mod[5], t[5], C)
        C = c19
        t[4] = t5_
      }
      {
        const [c20, t6_] = madd2(m, mod[6], t[6], C)
        C = c20
        t[5] = t6_
      }
      {
        const [c21, t7_] = madd2(m, mod[7], t[7], C)
        C = c21
        t[6] = t7_
      }
      {
        const [c22, t8_] = madd2(m, mod[8], t[8], C)
        C = c22
        t[7] = t8_
      }
      {
        const [c23, t9_] = madd2(m, mod[9], t[9], C)
        C = c23
        t[8] = t9_
      }
      {
        const [c24, t10_] = madd2(m, mod[10], t[10], C)
        C = c24
        t[9] = t10_
      }

      {
        const [t11_, c25] = add64(t[11], C, 0n)
        t[10] = t11_
        C = c25
      }

      {
        const [t11_, leftover2] = add64(0n, D, C)
        t[11] = t11_
        // leftover2 not stored
      }
    }
  }

  // -------------------------------
  // Final subtract => res[i] = t[i] - mod[i], for i=0..10
  // if borrow != 0 && t[11] == 0 => revert => keep t
  {
    let d_ = 0n
    for (let i = 0; i < 11; i++) {
      const [ri, bi] = sub64(t[i], mod[i], d_)
      res[i] = ri
      d_ = bi
    }

    if (d_ !== 0n && t[11] === 0n) {
      for (let i = 0; i < 11; i++) {
        out[i] = t[i] & MASK_64
      }
    } else {
      for (let i = 0; i < 11; i++) {
        out[i] = res[i] & MASK_64
      }
    }
  }
}

function montMulMod768(
  out: bigint[], // [12], final 768-bit result
  x: bigint[], // [12], input x
  y: bigint[], // [12], input y
  mod: bigint[], // [12], the modulus
  modInv: bigint, // single-limb “magic factor” => -mod^-1 mod 2^64
): void {
  // t => partial sums, 13 limbs for overflow from 12-limb multiply
  const t = new Array<bigint>(13).fill(0n)
  let D = 0n
  let C = 0n
  let m = 0n

  // final subtract result buffer
  const res = new Array<bigint>(12).fill(0n)

  // --------------------------------
  // 1) “first outer loop” => j=0
  {
    // multiply x[0]*y[0..11], accumulate in t

    // C, t[0] = bits.Mul64(x[0], y[0])
    {
      const [hi0, lo0] = mul64(x[0], y[0])
      C = hi0
      t[0] = lo0
    }
    // repeat madd1 for y[1..11]
    {
      const [hi1, lo1] = madd1(x[0], y[1], C)
      C = hi1
      t[1] = lo1
    }
    {
      const [hi2, lo2] = madd1(x[0], y[2], C)
      C = hi2
      t[2] = lo2
    }
    {
      const [hi3, lo3] = madd1(x[0], y[3], C)
      C = hi3
      t[3] = lo3
    }
    {
      const [hi4, lo4] = madd1(x[0], y[4], C)
      C = hi4
      t[4] = lo4
    }
    {
      const [hi5, lo5] = madd1(x[0], y[5], C)
      C = hi5
      t[5] = lo5
    }
    {
      const [hi6, lo6] = madd1(x[0], y[6], C)
      C = hi6
      t[6] = lo6
    }
    {
      const [hi7, lo7] = madd1(x[0], y[7], C)
      C = hi7
      t[7] = lo7
    }
    {
      const [hi8, lo8] = madd1(x[0], y[8], C)
      C = hi8
      t[8] = lo8
    }
    {
      const [hi9, lo9] = madd1(x[0], y[9], C)
      C = hi9
      t[9] = lo9
    }
    {
      const [hi10, lo10] = madd1(x[0], y[10], C)
      C = hi10
      t[10] = lo10
    }
    {
      const [hi11, lo11] = madd1(x[0], y[11], C)
      C = hi11
      t[11] = lo11
    }

    // t[12], D = bits.Add64(t[12], C, 0)
    {
      const [t12_, d2] = add64(t[12], C, 0n)
      t[12] = t12_
      D = d2
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => "one limb at a time"
    {
      // C = madd0(m, mod[0], t[0])
      C = madd0(m, mod[0], t[0])

      {
        const [c2, t1_] = madd2(m, mod[1], t[1], C)
        C = c2
        t[0] = t1_
      }
      {
        const [c3, t2_] = madd2(m, mod[2], t[2], C)
        C = c3
        t[1] = t2_
      }
      {
        const [c4, t3_] = madd2(m, mod[3], t[3], C)
        C = c4
        t[2] = t3_
      }
      {
        const [c5, t4_] = madd2(m, mod[4], t[4], C)
        C = c5
        t[3] = t4_
      }
      {
        const [c6, t5_] = madd2(m, mod[5], t[5], C)
        C = c6
        t[4] = t5_
      }
      {
        const [c7, t6_] = madd2(m, mod[6], t[6], C)
        C = c7
        t[5] = t6_
      }
      {
        const [c8, t7_] = madd2(m, mod[7], t[7], C)
        C = c8
        t[6] = t7_
      }
      {
        const [c9, t8_] = madd2(m, mod[8], t[8], C)
        C = c9
        t[7] = t8_
      }
      {
        const [c10, t9_] = madd2(m, mod[9], t[9], C)
        C = c10
        t[8] = t9_
      }
      {
        const [c11, t10_] = madd2(m, mod[10], t[10], C)
        C = c11
        t[9] = t10_
      }
      {
        const [c12, t11_] = madd2(m, mod[11], t[11], C)
        C = c12
        t[10] = t11_
      }

      {
        const [t12_, c13] = add64(t[12], C, 0n)
        t[11] = t12_
        C = c13
      }

      {
        const [t12_, leftover] = add64(0n, D, C)
        t[12] = t12_
        // leftover not stored
      }
    }
  }

  // --------------------------------
  // 2) For j=1..11
  for (let j = 1; j < 12; j++) {
    // multiply x[j]*y[0..11], accumulate in t

    // C, t[0] = madd1(x[j], y[0], t[0])
    {
      const [c4, t0_] = madd1(x[j], y[0], t[0])
      C = c4
      t[0] = t0_
    }
    {
      const [c5, t1_] = madd2(x[j], y[1], t[1], C)
      C = c5
      t[1] = t1_
    }
    {
      const [c6, t2_] = madd2(x[j], y[2], t[2], C)
      C = c6
      t[2] = t2_
    }
    {
      const [c7, t3_] = madd2(x[j], y[3], t[3], C)
      C = c7
      t[3] = t3_
    }
    {
      const [c8, t4_] = madd2(x[j], y[4], t[4], C)
      C = c8
      t[4] = t4_
    }
    {
      const [c9, t5_] = madd2(x[j], y[5], t[5], C)
      C = c9
      t[5] = t5_
    }
    {
      const [c10, t6_] = madd2(x[j], y[6], t[6], C)
      C = c10
      t[6] = t6_
    }
    {
      const [c11, t7_] = madd2(x[j], y[7], t[7], C)
      C = c11
      t[7] = t7_
    }
    {
      const [c12, t8_] = madd2(x[j], y[8], t[8], C)
      C = c12
      t[8] = t8_
    }
    {
      const [c13, t9_] = madd2(x[j], y[9], t[9], C)
      C = c13
      t[9] = t9_
    }
    {
      const [c14, t10_] = madd2(x[j], y[10], t[10], C)
      C = c14
      t[10] = t10_
    }
    {
      const [c15, t11_] = madd2(x[j], y[11], t[11], C)
      C = c15
      t[11] = t11_
    }

    {
      const [t12_, d_] = add64(t[12], C, 0n)
      t[12] = t12_
      D = d_
    }

    // m = (t[0]*modInv) mod 2^64
    m = (t[0] * modInv) & MASK_64

    // partial reduce => 1 limb at a time
    {
      C = madd0(m, mod[0], t[0])

      {
        const [c16, t1_] = madd2(m, mod[1], t[1], C)
        C = c16
        t[0] = t1_
      }
      {
        const [c17, t2_] = madd2(m, mod[2], t[2], C)
        C = c17
        t[1] = t2_
      }
      {
        const [c18, t3_] = madd2(m, mod[3], t[3], C)
        C = c18
        t[2] = t3_
      }
      {
        const [c19, t4_] = madd2(m, mod[4], t[4], C)
        C = c19
        t[3] = t4_
      }
      {
        const [c20, t5_] = madd2(m, mod[5], t[5], C)
        C = c20
        t[4] = t5_
      }
      {
        const [c21, t6_] = madd2(m, mod[6], t[6], C)
        C = c21
        t[5] = t6_
      }
      {
        const [c22, t7_] = madd2(m, mod[7], t[7], C)
        C = c22
        t[6] = t7_
      }
      {
        const [c23, t8_] = madd2(m, mod[8], t[8], C)
        C = c23
        t[7] = t8_
      }
      {
        const [c24, t9_] = madd2(m, mod[9], t[9], C)
        C = c24
        t[8] = t9_
      }
      {
        const [c25, t10_] = madd2(m, mod[10], t[10], C)
        C = c25
        t[9] = t10_
      }
      {
        const [c26, t11_] = madd2(m, mod[11], t[11], C)
        C = c26
        t[10] = t11_
      }

      {
        const [t12_, c27] = add64(t[12], C, 0n)
        t[11] = t12_
        C = c27
      }

      {
        const [t12_, leftover2] = add64(0n, D, C)
        t[12] = t12_
        // leftover2 not stored
      }
    }
  }

  // --------------------------------
  // Final subtract => res = t[0..11] - mod[0..11]
  // if borrow != 0 && t[12] == 0 => revert => keep t
  {
    let d_ = 0n
    for (let i = 0; i < 12; i++) {
      const [ri, bi] = sub64(t[i], mod[i], d_)
      res[i] = ri
      d_ = bi
    }

    if (d_ !== 0n && t[12] === 0n) {
      // revert => keep t
      for (let i = 0; i < 12; i++) {
        out[i] = t[i] & MASK_64
      }
    } else {
      for (let i = 0; i < 12; i++) {
        out[i] = res[i] & MASK_64
      }
    }
  }
}

export const mulModPreset: Function[] = [
  montMulMod64,
  montMulMod128,
  montMulMod192,
  montMulMod256,
  montMulMod320,
  montMulMod384,
  montMulMod448,
  montMulMod512,
  montMulMod576,
  montMulMod640,
  montMulMod704,
  montMulMod768,
]
