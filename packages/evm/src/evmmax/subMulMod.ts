import { MASK_64, add64, sub64 } from './index.js'

export function subMod64(z: bigint[], x: bigint[], y: bigint[], mod: bigint[]): void {
  let c = 0n
  let tmpVal = 0n

  {
    const [subLow, subBorrow] = sub64(x[0] & MASK_64, y[0] & MASK_64, c)
    tmpVal = subLow
    c = subBorrow
  }

  let outVal = 0n
  let c1 = 0n
  {
    const [addLow, addCarry] = add64(tmpVal, mod[0] & MASK_64, 0n)
    outVal = addLow
    c1 = addCarry
  }

  let src: bigint
  if (c === 0n) {
    src = tmpVal
  } else {
    src = outVal
  }

  z[0] = src & MASK_64
}

export function subMod128(z: bigint[], x: bigint[], y: bigint[], mod: bigint[]): void {
  function add64(a: bigint, b: bigint, carryIn: bigint): [bigint, bigint] {
    const sum = a + b + carryIn
    const low = sum & MASK_64
    const carryOut = sum >> 64n
    return [low, carryOut]
  }

  function sub64(a: bigint, b: bigint, borrowIn: bigint): [bigint, bigint] {
    let diff = a - b - borrowIn
    let borrowOut = 0n
    if (diff < 0n) {
      diff &= MASK_64
      borrowOut = 1n
    }
    return [diff & MASK_64, borrowOut]
  }

  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n

  {
    const [diffLow, borrowOut] = sub64(x[0], y[0], c)
    tmp0 = diffLow
    c = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(x[1], y[1], c)
    tmp1 = diffLow
    c = borrowOut
  }

  let c1 = 0n
  let out0 = 0n
  let out1 = 0n

  {
    const [sumLow, carryOut] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carryOut
  }
  {
    const [sumLow, carryOut] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carryOut
  }

  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
  }
}

/**
 * subMod192:
 *   z = (x - y) mod modulus
 *
 * x, y, modulus, and z are each 3-limb arrays => [3]
 * (192 bits total). We:
 *   1) subtract y from x => tmp0..2
 *   2) add modulus => out0..2
 *   3) if no borrow in step 1 => z=tmp, else => z=out
 */
export function subMod192(
  z: bigint[], // [3], final result
  x: bigint[], // [3], minuend
  y: bigint[], // [3], subtrahend
  mod: bigint[], // [3], modulus
): void {
  // Step 1: Subtract y from x across 3 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n

  {
    const [diffLow, borrowOut] = sub64(x[0] & MASK_64, y[0] & MASK_64, c)
    tmp0 = diffLow
    c = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(x[1] & MASK_64, y[1] & MASK_64, c)
    tmp1 = diffLow
    c = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(x[2] & MASK_64, y[2] & MASK_64, c)
    tmp2 = diffLow
    c = borrowOut
  }

  // Step 2: Add modulus => out0..2
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n

  {
    const [sumLow, carryOut] = add64(tmp0, mod[0] & MASK_64, c1)
    out0 = sumLow
    c1 = carryOut
  }
  {
    const [sumLow, carryOut] = add64(tmp1, mod[1] & MASK_64, c1)
    out1 = sumLow
    c1 = carryOut
  }
  {
    const [sumLow, carryOut] = add64(tmp2, mod[2] & MASK_64, c1)
    out2 = sumLow
    c1 = carryOut
  }

  // Step 3: If no borrow from subtract => x>=y => z=tmp, else z=out
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
  }
}

/**
 * subMod256:
 *   z = (x - y) mod modulus
 *
 * Each of x, y, mod, z are 4 limbs (256 bits). We unroll the limb-by-limb
 * subtract and the subsequent add of the modulus.
 */
export function subMod256(
  z: bigint[], // [4] => final 256-bit result
  x: bigint[], // [4] => minuend
  y: bigint[], // [4] => subtrahend
  mod: bigint[], // [4] => 256-bit modulus
): void {
  // Step 1: Subtract y from x across 4 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0] & MASK_64, y[0] & MASK_64, c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1] & MASK_64, y[1] & MASK_64, c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2] & MASK_64, y[2] & MASK_64, c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3] & MASK_64, y[3] & MASK_64, c)
    tmp3 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..3
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0] & MASK_64, c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1] & MASK_64, c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2] & MASK_64, c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3] & MASK_64, c1)
    out3 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow from initial subtract => x>=y => z=tmp, else => z=out
  // Then mask each limb to 64 bits
  if (c === 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
  } else {
    // keep out
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
  }
}

/**
 * subMod320:
 *   z = (x - y) mod modulus
 *
 * Each of x, y, mod, z is 5 limbs => 320 bits. We:
 *   - subtract y from x (unrolled),
 *   - add modulus,
 *   - if no borrow => keep subtract result, else keep the sum with modulus.
 */
export function subMod320(
  z: bigint[], // [5], final result
  x: bigint[], // [5], minuend
  y: bigint[], // [5], subtrahend
  mod: bigint[], // [5], 320-bit modulus
): void {
  // Step 1: Subtract y from x across 5 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0] & MASK_64, y[0] & MASK_64, c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1] & MASK_64, y[1] & MASK_64, c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2] & MASK_64, y[2] & MASK_64, c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3] & MASK_64, y[3] & MASK_64, c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4] & MASK_64, y[4] & MASK_64, c)
    tmp4 = diff
    c = borrow
  }

  // Step 2: Add modulus => out0..4
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0] & MASK_64, c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1] & MASK_64, c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2] & MASK_64, c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3] & MASK_64, c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4] & MASK_64, c1)
    out4 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x>=y => z=tmp, else => z=out. Then mask each limb.
  if (c === 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
  } else {
    // keep out
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
  }
}

/**
 * subMod384:
 *   z = (x - y) mod mod
 *
 * x, y, mod, z each have 6 limbs => 384 bits total.
 * Unrolled approach:
 *   1) subtract y from x => store in tmp
 *   2) add mod => store in out
 *   3) if no borrow => keep tmp, else keep out
 */
export function subMod384(
  z: bigint[], // [6] => final 384-bit result
  x: bigint[], // [6], minuend
  y: bigint[], // [6], subtrahend
  mod: bigint[], // [6], the 384-bit modulus
): void {
  // Step 1: Subtract y from x across 6 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0] & MASK_64, y[0] & MASK_64, c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1] & MASK_64, y[1] & MASK_64, c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2] & MASK_64, y[2] & MASK_64, c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3] & MASK_64, y[3] & MASK_64, c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4] & MASK_64, y[4] & MASK_64, c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5] & MASK_64, y[5] & MASK_64, c)
    tmp5 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..5
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0] & MASK_64, c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1] & MASK_64, c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2] & MASK_64, c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3] & MASK_64, c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4] & MASK_64, c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5] & MASK_64, c1)
    out5 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x>=y => z=tmp, else => z=out. Then mask each limb
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
  }
}

/**
 * subMod448:
 *   z = (x - y) mod modulus
 *
 * x, y, mod, z each are 7 limbs => 448 bits total.
 * We:
 *   1) subtract y from x (unrolled),
 *   2) add modulus,
 *   3) if no borrow => keep tmp, else keep out
 *   4) mask each limb to 64 bits.
 */
export function subMod448(
  z: bigint[], // [7] => final 448-bit result
  x: bigint[], // [7], minuend
  y: bigint[], // [7], subtrahend
  mod: bigint[], // [7], the 448-bit modulus
): void {
  // Step 1: Subtract y from x across 7 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..6
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x >= y => revert to tmp, else => out
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
  }
}

/**
 * subMod512:
 *   z = (x - y) mod modulus
 *
 * x, y, mod, z each are arrays of length 8 => 512 bits total.
 * We unroll the subtract of y from x, then add the modulus,
 * deciding which result to keep based on whether we borrowed.
 */
export function subMod512(
  z: bigint[], // [8], final 512-bit result
  x: bigint[], // [8], minuend
  y: bigint[], // [8], subtrahend
  mod: bigint[], // [8], the 512-bit modulus
): void {
  // Step 1: Subtract y from x across 8 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n
  let tmp7 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(x[7], y[7], c)
    tmp7 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..7
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n
  let out7 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(tmp7, mod[7], c1)
    out7 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x >= y => revert to tmp, else => out
  // Then mask each limb to 64 bits
  if (c === 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
  } else {
    // keep out
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
  }
}

/**
 * subMod576:
 *   z = (x - y) mod mod
 *
 * Each of x, y, mod, z is 9 limbs => 576 bits total.
 * We:
 *   1) subtract y from x (unrolled),
 *   2) add modulus,
 *   3) if no borrow => keep tmp, else keep out
 *   4) mask each limb to 64 bits.
 */
export function subMod576(
  z: bigint[], // [9] => final 576-bit result
  x: bigint[], // [9], minuend
  y: bigint[], // [9], subtrahend
  mod: bigint[], // [9], the 576-bit modulus
): void {
  // Step 1: Subtract y from x across 9 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n
  let tmp7 = 0n
  let tmp8 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(x[7], y[7], c)
    tmp7 = diff
    c = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(x[8], y[8], c)
    tmp8 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..8
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n
  let out7 = 0n
  let out8 = 0n

  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp7, mod[7], c1)
    out7 = sumLow
    c1 = carry
  }
  {
    const [sumLow, carry] = add64(tmp8, mod[8], c1)
    out8 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x >= y => revert to tmp, else => out
  // Then mask each limb to 64 bits
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
    z[8] = tmp8 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
    z[8] = out8 & MASK_64
  }
}

/**
 * subMod640:
 *   z = (x - y) mod mod
 *
 * x, y, mod, z each have 10 limbs => 640 bits total.
 * Unrolled approach:
 *   1) subtract y from x across 10 limbs => tmp
 *   2) add modulus => out
 *   3) if no borrow => keep tmp, else keep out
 *   4) mask each limb to 64 bits
 */
export function subMod640(
  z: bigint[], // [10] => final 640-bit result
  x: bigint[], // [10], minuend
  y: bigint[], // [10], subtrahend
  mod: bigint[], // [10], the 640-bit modulus
): void {
  // Step 1: Subtract y from x (10 limbs)
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n
  let tmp7 = 0n
  let tmp8 = 0n
  let tmp9 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(x[7], y[7], c)
    tmp7 = diff
    c = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(x[8], y[8], c)
    tmp8 = diff
    c = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(x[9], y[9], c)
    tmp9 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..9
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n
  let out7 = 0n
  let out8 = 0n
  let out9 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(tmp7, mod[7], c1)
    out7 = sumLow
    c1 = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(tmp8, mod[8], c1)
    out8 = sumLow
    c1 = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(tmp9, mod[9], c1)
    out9 = sumLow
    c1 = carry
  }

  // Step 3: If c=0 => x>=y => revert to tmp, else => out
  // Then mask each limb to 64 bits
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
    z[8] = tmp8 & MASK_64
    z[9] = tmp9 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
    z[8] = out8 & MASK_64
    z[9] = out9 & MASK_64
  }
}

/**
 * subMod704:
 *   z = (x - y) mod mod
 *
 * x, y, mod, z each have 11 limbs => 704 bits total.
 * We:
 *   1) subtract y from x (unrolled),
 *   2) add modulus,
 *   3) if no borrow => keep tmp, else keep out
 *   4) mask each limb to 64 bits
 */
export function subMod704(
  z: bigint[], // [11] => final 704-bit result
  x: bigint[], // [11], minuend
  y: bigint[], // [11], subtrahend
  mod: bigint[], // [11], the 704-bit modulus
): void {
  // Step 1: Subtract y from x across 11 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n
  let tmp7 = 0n
  let tmp8 = 0n
  let tmp9 = 0n
  let tmp10 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(x[7], y[7], c)
    tmp7 = diff
    c = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(x[8], y[8], c)
    tmp8 = diff
    c = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(x[9], y[9], c)
    tmp9 = diff
    c = borrow
  }
  // Limb 10
  {
    const [diff, borrow] = sub64(x[10], y[10], c)
    tmp10 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..10
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n
  let out7 = 0n
  let out8 = 0n
  let out9 = 0n
  let out10 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(tmp7, mod[7], c1)
    out7 = sumLow
    c1 = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(tmp8, mod[8], c1)
    out8 = sumLow
    c1 = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(tmp9, mod[9], c1)
    out9 = sumLow
    c1 = carry
  }
  // Limb 10
  {
    const [sumLow, carry] = add64(tmp10, mod[10], c1)
    out10 = sumLow
    c1 = carry
  }

  // Step 3: If no borrow => x>=y => revert to tmp, else => out
  if (c === 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
    z[8] = tmp8 & MASK_64
    z[9] = tmp9 & MASK_64
    z[10] = tmp10 & MASK_64
  } else {
    // keep out
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
    z[8] = out8 & MASK_64
    z[9] = out9 & MASK_64
    z[10] = out10 & MASK_64
  }
}

/**
 * subMod768:
 *   z = (x - y) mod mod
 *
 * x, y, mod, z each have 12 limbs => 768 bits total.
 * Unrolled approach:
 *   1) subtract y from x (12 limbs) => tmp
 *   2) add modulus => out
 *   3) if no borrow => x>=y => revert to tmp, else => out
 *   4) mask each limb to 64 bits
 */
export function subMod768(
  z: bigint[], // [12] => final 768-bit result
  x: bigint[], // [12], minuend
  y: bigint[], // [12], subtrahend
  mod: bigint[], // [12], the 768-bit modulus
): void {
  // Step 1: Subtract y from x across 12 limbs
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n
  let tmp7 = 0n
  let tmp8 = 0n
  let tmp9 = 0n
  let tmp10 = 0n
  let tmp11 = 0n

  // Limb 0
  {
    const [diff, borrow] = sub64(x[0], y[0], c)
    tmp0 = diff
    c = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(x[1], y[1], c)
    tmp1 = diff
    c = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(x[2], y[2], c)
    tmp2 = diff
    c = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(x[3], y[3], c)
    tmp3 = diff
    c = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(x[4], y[4], c)
    tmp4 = diff
    c = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(x[5], y[5], c)
    tmp5 = diff
    c = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(x[6], y[6], c)
    tmp6 = diff
    c = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(x[7], y[7], c)
    tmp7 = diff
    c = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(x[8], y[8], c)
    tmp8 = diff
    c = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(x[9], y[9], c)
    tmp9 = diff
    c = borrow
  }
  // Limb 10
  {
    const [diff, borrow] = sub64(x[10], y[10], c)
    tmp10 = diff
    c = borrow
  }
  // Limb 11
  {
    const [diff, borrow] = sub64(x[11], y[11], c)
    tmp11 = diff
    c = borrow
  }

  // Step 2: Add the modulus => out0..11
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n
  let out7 = 0n
  let out8 = 0n
  let out9 = 0n
  let out10 = 0n
  let out11 = 0n

  // Limb 0
  {
    const [sumLow, carry] = add64(tmp0, mod[0], c1)
    out0 = sumLow
    c1 = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(tmp1, mod[1], c1)
    out1 = sumLow
    c1 = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(tmp2, mod[2], c1)
    out2 = sumLow
    c1 = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(tmp3, mod[3], c1)
    out3 = sumLow
    c1 = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(tmp4, mod[4], c1)
    out4 = sumLow
    c1 = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(tmp5, mod[5], c1)
    out5 = sumLow
    c1 = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(tmp6, mod[6], c1)
    out6 = sumLow
    c1 = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(tmp7, mod[7], c1)
    out7 = sumLow
    c1 = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(tmp8, mod[8], c1)
    out8 = sumLow
    c1 = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(tmp9, mod[9], c1)
    out9 = sumLow
    c1 = carry
  }
  // Limb 10
  {
    const [sumLow, carry] = add64(tmp10, mod[10], c1)
    out10 = sumLow
    c1 = carry
  }
  // Limb 11
  {
    const [sumLow, carry] = add64(tmp11, mod[11], c1)
    out11 = sumLow
    c1 = carry
  }

  // Step 3: If c=0 => x>=y => revert to tmp, else => out
  // Then mask each limb to 64 bits
  if (c === 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
    z[8] = tmp8 & MASK_64
    z[9] = tmp9 & MASK_64
    z[10] = tmp10 & MASK_64
    z[11] = tmp11 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
    z[8] = out8 & MASK_64
    z[9] = out9 & MASK_64
    z[10] = out10 & MASK_64
    z[11] = out11 & MASK_64
  }
}

export const subModPreset: Function[] = [
  subMod64,
  subMod128,
  subMod192,
  subMod256,
  subMod320,
  subMod384,
  subMod448,
  subMod512,
  subMod576,
  subMod640,
  subMod704,
  subMod768,
]
