import { MASK_64, add64, sub64 } from './index.js'

function addMod64(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]): void {
  const MASK_64 = (1n << 64n) - 1n

  const x0 = x[0] & MASK_64
  const y0 = y[0] & MASK_64
  const m0 = modulus[0] & MASK_64

  const fullSum = x0 + y0
  const sumLow64 = fullSum & MASK_64
  const carry = fullSum >> 64n

  let diff = sumLow64 - m0
  let borrow = 0n
  if (diff < 0n) {
    diff &= MASK_64
    borrow = 1n
  }

  if (carry === 0n && borrow !== 0n) {
    z[0] = sumLow64
  } else {
    z[0] = diff
  }
  z[0] &= MASK_64
}

function addMod128(z: bigint[], x: bigint[], y: bigint[], mod: bigint[]): void {
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n

  {
    const [sumLow, carryOut] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carryOut
  }
  {
    const [sumLow, carryOut] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carryOut
  }

  let c1 = 0n
  let out0 = 0n
  let out1 = 0n

  {
    const [diffLow, borrowOut] = sub64(tmp0, mod[0], c1)
    out0 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp1, mod[1], c1)
    out1 = diffLow
    c1 = borrowOut
  }

  if (c === 0n && c1 !== 0n) {
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
  } else {
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
  }
}

function addMod192(
  z: bigint[], // [3] => final output
  x: bigint[], // [3] => first addend
  y: bigint[], // [3] => second addend
  mod: bigint[], // [3] => the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // Step 1: Add x + y (3 limbs), capturing carry in `c`
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n

  // lower limb
  {
    const [sumLow, carryOut] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carryOut
  }
  // middle limb
  {
    const [sumLow, carryOut] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carryOut
  }
  // high limb
  {
    const [sumLow, carryOut] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carryOut
  }

  // Step 2: Subtract mod from tmp (3 limbs), capturing borrow in `c1`
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n

  {
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }

  // Step 3: If no carry from addition but we got a borrow from subtract => revert to tmp
  // Else keep out. Then mask the result to 64 bits per limb.
  if (c === 0n && c1 !== 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
  } else {
    // keep sub result
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
  }
} // Adjust if needed

function addMod256(
  z: bigint[], // [4] => final result
  x: bigint[], // [4] => first addend
  y: bigint[], // [4] => second addend
  mod: bigint[], // [4] => modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // Step 1: Add x + y across 4 limbs, capturing carry in `c`.
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n

  {
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }

  // Step 2: Subtract the 4-limb `mod` from `tmp` (tmp0..3), capturing borrow in c1.
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n

  {
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }

  // Step 3: If addition carry=0 but subtract borrow=1 => revert to raw sum; else keep out.
  // Then mask each limb to 64 bits.
  if (c === 0n && c1 !== 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
  } else {
    // keep sub
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
  }
} // Adjust if needed

function addMod320(
  z: bigint[], // [5] => final result (320-bit)
  x: bigint[], // [5] => first addend
  y: bigint[], // [5] => second addend
  mod: bigint[], // [5] => modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // Step 1: Add x + y across 5 limbs, capturing carry in `c`.
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n

  {
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }

  // Step 2: Subtract the 5-limb `mod` from tmp (tmp0..4), capturing borrow in c1.
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n

  {
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }

  // Step 3: If addition carry=0 but subtract borrow=1 => revert to raw sum; else keep out.
  if (c === 0n && c1 !== 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
  } else {
    // keep sub
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
  }
} // Adjust import as needed

/**
 * addMod384:
 *   z = (x + y) mod modulus
 *
 * Each of z, x, y, modulus is an array of length 6, representing 384 bits
 * in 64-bit limbs: x[0..5], y[0..5], etc.
 * We do a 6-limb addition, then a 6-limb subtract of 'modulus',
 * and decide which result to keep.
 */
function addMod384(
  z: bigint[], // [6], final 384-bit result
  x: bigint[], // [6], input x
  y: bigint[], // [6], input y
  mod: bigint[], // [6], the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // Step 1: Add x + y across 6 limbs, capturing carry in `c`.
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n

  {
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }

  // Step 2: Subtract the 6-limb `mod` from tmp (tmp0..5), capturing borrow in c1.
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n

  {
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }

  // Step 3: If addition carry = 0 but subtract borrow = 1 => revert to raw sum
  // else keep out. Then mask each limb to 64 bits.
  if (c === 0n && c1 !== 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
  } else {
    // keep sub
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
  }
} // Adjust import path as needed

/**
 * addMod448:
 *   z = (x + y) mod mod
 *
 * Both x, y, mod, z are each arrays of length 7 (7 limbs * 64 bits = 448 bits).
 * We:
 *   1) Add the 7 limbs of x and y (unrolled),
 *   2) Subtract the 7 limbs of mod (unrolled),
 *   3) If add-carry==0 && subtract-borrow==1 => revert to raw sum, else keep sub.
 */
function addMod448(
  z: bigint[], // [7], final 448-bit output
  x: bigint[], // [7], first addend
  y: bigint[], // [7], second addend
  mod: bigint[], // [7], the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // Step 1: Add x + y across 7 limbs, capturing carry in `c`.
  let c = 0n
  let tmp0 = 0n
  let tmp1 = 0n
  let tmp2 = 0n
  let tmp3 = 0n
  let tmp4 = 0n
  let tmp5 = 0n
  let tmp6 = 0n

  // Add limb 0
  {
    const [sumLow, carryOut] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carryOut
  }
  // Add limb 1
  {
    const [sumLow, carryOut] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carryOut
  }
  // Add limb 2
  {
    const [sumLow, carryOut] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carryOut
  }
  // Add limb 3
  {
    const [sumLow, carryOut] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carryOut
  }
  // Add limb 4
  {
    const [sumLow, carryOut] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carryOut
  }
  // Add limb 5
  {
    const [sumLow, carryOut] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carryOut
  }
  // Add limb 6
  {
    const [sumLow, carryOut] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carryOut
  }

  // Step 2: Subtract mod from tmp (7 limbs), capturing borrow in c1.
  let c1 = 0n
  let out0 = 0n
  let out1 = 0n
  let out2 = 0n
  let out3 = 0n
  let out4 = 0n
  let out5 = 0n
  let out6 = 0n

  {
    const [diffLow, borrowOut] = sub64(tmp0, mod[0], c1)
    out0 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp1, mod[1], c1)
    out1 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp2, mod[2], c1)
    out2 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp3, mod[3], c1)
    out3 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp4, mod[4], c1)
    out4 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp5, mod[5], c1)
    out5 = diffLow
    c1 = borrowOut
  }
  {
    const [diffLow, borrowOut] = sub64(tmp6, mod[6], c1)
    out6 = diffLow
    c1 = borrowOut
  }

  // Step 3: If c == 0 (no add overflow) and c1 != 0 (subtract borrowed),
  // revert to raw sum tmp. Otherwise, keep out. Then mask each limb to 64 bits.
  if (c === 0n && c1 !== 0n) {
    // revert to tmp
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
  } else {
    // keep sub result
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
  }
} // Adjust if needed

/**
 * addMod512:
 *   z = (x + y) mod mod
 *
 * x, y, mod, z each are arrays of length 8 (8 limbs * 64 bits = 512 bits).
 * This function unrolls the addition and subtraction steps similarly to
 * addMod64, addMod128, etc.
 */
function addMod512(
  z: bigint[], // [8], final 512-bit result
  x: bigint[], // [8], first addend
  y: bigint[], // [8], second addend
  mod: bigint[], // [8], the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // -------------------------------
  // Step 1: Add x + y across 8 limbs
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
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(x[7], y[7], c)
    tmp7 = sumLow
    c = carry
  }

  // -------------------------------
  // Step 2: Subtract mod from tmp, capturing borrow in c1
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
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(tmp6, mod[6], c1)
    out6 = diff
    c1 = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(tmp7, mod[7], c1)
    out7 = diff
    c1 = borrow
  }

  // -------------------------------
  // Step 3: if c=0 (no add overflow) && c1!=0 (subtract borrowed),
  // revert to tmp. Otherwise keep out. Mask each limb to 64 bits.
  if (c === 0n && c1 !== 0n) {
    // revert to raw sum
    z[0] = tmp0 & MASK_64
    z[1] = tmp1 & MASK_64
    z[2] = tmp2 & MASK_64
    z[3] = tmp3 & MASK_64
    z[4] = tmp4 & MASK_64
    z[5] = tmp5 & MASK_64
    z[6] = tmp6 & MASK_64
    z[7] = tmp7 & MASK_64
  } else {
    // keep sub
    z[0] = out0 & MASK_64
    z[1] = out1 & MASK_64
    z[2] = out2 & MASK_64
    z[3] = out3 & MASK_64
    z[4] = out4 & MASK_64
    z[5] = out5 & MASK_64
    z[6] = out6 & MASK_64
    z[7] = out7 & MASK_64
  }
} // Adjust import path as needed

/**
 * addMod576:
 *   z = (x + y) mod mod
 *
 * Each of x, y, mod, and z has 9 limbs of 64 bits => [9] arrays (576 bits).
 * This unrolled version adds x and y across 9 limbs, then subtracts mod,
 * deciding which result to keep.
 */
function addMod576(
  z: bigint[], // [9], final 576-bit result
  x: bigint[], // [9], first addend
  y: bigint[], // [9], second addend
  mod: bigint[], // [9], the 576-bit modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // -------------------------------
  // Step 1: Add x + y across 9 limbs
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
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(x[7], y[7], c)
    tmp7 = sumLow
    c = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(x[8], y[8], c)
    tmp8 = sumLow
    c = carry
  }

  // -------------------------------
  // Step 2: Subtract mod from tmp, capturing borrow in c1
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

  // Limb 0
  {
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(tmp6, mod[6], c1)
    out6 = diff
    c1 = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(tmp7, mod[7], c1)
    out7 = diff
    c1 = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(tmp8, mod[8], c1)
    out8 = diff
    c1 = borrow
  }

  // -------------------------------
  // Step 3: If c == 0 (no add overflow) and c1 != 0 (sub borrowed),
  // revert to raw sum, else keep sub.
  // Then mask each limb to 64 bits.
  if (c === 0n && c1 !== 0n) {
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
  } else {
    // keep sub
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
} // Adjust if needed

/**
 * addMod640:
 *   z = (x + y) mod mod
 *
 * x, y, mod, z are each arrays of length 10 (10 limbs * 64 bits = 640 bits).
 * We unroll the addition and subtraction steps as in other addModXXX functions.
 */
function addMod640(
  z: bigint[], // [10], final 640-bit result
  x: bigint[], // [10], first addend
  y: bigint[], // [10], second addend
  mod: bigint[], // [10], the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // -------------------------------
  // Step 1: Add x + y across 10 limbs
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
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(x[7], y[7], c)
    tmp7 = sumLow
    c = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(x[8], y[8], c)
    tmp8 = sumLow
    c = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(x[9], y[9], c)
    tmp9 = sumLow
    c = carry
  }

  // -------------------------------
  // Step 2: Subtract mod from tmp, capturing borrow in c1
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
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(tmp6, mod[6], c1)
    out6 = diff
    c1 = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(tmp7, mod[7], c1)
    out7 = diff
    c1 = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(tmp8, mod[8], c1)
    out8 = diff
    c1 = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(tmp9, mod[9], c1)
    out9 = diff
    c1 = borrow
  }

  // -------------------------------
  // Step 3: If c=0 (no add overflow) && c1!=0 (borrow),
  // revert to raw sum; else keep sub. Then mask each limb.
  if (c === 0n && c1 !== 0n) {
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
  } else {
    // keep sub
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
} // Adjust if needed

/**
 * addMod704:
 *   z = (x + y) mod mod
 *
 * x, y, mod, z each are arrays of length 11 (11 limbs * 64 bits = 704 bits).
 * We unroll the addition and subtraction steps similarly to addMod64, etc.
 */
function addMod704(
  z: bigint[], // [11], final 704-bit result
  x: bigint[], // [11], first addend
  y: bigint[], // [11], second addend
  mod: bigint[], // [11], the 704-bit modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // -------------------------------
  // Step 1: Add x + y across 11 limbs
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
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(x[7], y[7], c)
    tmp7 = sumLow
    c = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(x[8], y[8], c)
    tmp8 = sumLow
    c = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(x[9], y[9], c)
    tmp9 = sumLow
    c = carry
  }
  // Limb 10
  {
    const [sumLow, carry] = add64(x[10], y[10], c)
    tmp10 = sumLow
    c = carry
  }

  // -------------------------------
  // Step 2: Subtract mod from tmp, capturing borrow in c1
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
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(tmp6, mod[6], c1)
    out6 = diff
    c1 = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(tmp7, mod[7], c1)
    out7 = diff
    c1 = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(tmp8, mod[8], c1)
    out8 = diff
    c1 = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(tmp9, mod[9], c1)
    out9 = diff
    c1 = borrow
  }
  // Limb 10
  {
    const [diff, borrow] = sub64(tmp10, mod[10], c1)
    out10 = diff
    c1 = borrow
  }

  // -------------------------------
  // Step 3: If c == 0 (no add overflow) && c1 != 0 (borrow),
  // revert to raw sum, else keep sub. Then mask each limb.
  if (c === 0n && c1 !== 0n) {
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
    // keep sub
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
} // Adjust if needed

/**
 * addMod768:
 *   z = (x + y) mod mod
 *
 * Each of x, y, mod, z is 12-limb (768-bit):
 *   x[0..11], y[0..11], mod[0..11], z[0..11].
 * We unroll the addition and subtraction steps, capturing carry and borrow.
 */
function addMod768(
  z: bigint[], // [12], final 768-bit result
  x: bigint[], // [12], first addend
  y: bigint[], // [12], second addend
  mod: bigint[], // [12], the modulus
): void {
  const MASK_64 = (1n << 64n) - 1n

  // -------------------------------
  // Step 1: Add x + y across 12 limbs
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
    const [sumLow, carry] = add64(x[0], y[0], c)
    tmp0 = sumLow
    c = carry
  }
  // Limb 1
  {
    const [sumLow, carry] = add64(x[1], y[1], c)
    tmp1 = sumLow
    c = carry
  }
  // Limb 2
  {
    const [sumLow, carry] = add64(x[2], y[2], c)
    tmp2 = sumLow
    c = carry
  }
  // Limb 3
  {
    const [sumLow, carry] = add64(x[3], y[3], c)
    tmp3 = sumLow
    c = carry
  }
  // Limb 4
  {
    const [sumLow, carry] = add64(x[4], y[4], c)
    tmp4 = sumLow
    c = carry
  }
  // Limb 5
  {
    const [sumLow, carry] = add64(x[5], y[5], c)
    tmp5 = sumLow
    c = carry
  }
  // Limb 6
  {
    const [sumLow, carry] = add64(x[6], y[6], c)
    tmp6 = sumLow
    c = carry
  }
  // Limb 7
  {
    const [sumLow, carry] = add64(x[7], y[7], c)
    tmp7 = sumLow
    c = carry
  }
  // Limb 8
  {
    const [sumLow, carry] = add64(x[8], y[8], c)
    tmp8 = sumLow
    c = carry
  }
  // Limb 9
  {
    const [sumLow, carry] = add64(x[9], y[9], c)
    tmp9 = sumLow
    c = carry
  }
  // Limb 10
  {
    const [sumLow, carry] = add64(x[10], y[10], c)
    tmp10 = sumLow
    c = carry
  }
  // Limb 11
  {
    const [sumLow, carry] = add64(x[11], y[11], c)
    tmp11 = sumLow
    c = carry
  }

  // -------------------------------
  // Step 2: Subtract mod from tmp, capturing borrow in c1
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
    const [diff, borrow] = sub64(tmp0, mod[0], c1)
    out0 = diff
    c1 = borrow
  }
  // Limb 1
  {
    const [diff, borrow] = sub64(tmp1, mod[1], c1)
    out1 = diff
    c1 = borrow
  }
  // Limb 2
  {
    const [diff, borrow] = sub64(tmp2, mod[2], c1)
    out2 = diff
    c1 = borrow
  }
  // Limb 3
  {
    const [diff, borrow] = sub64(tmp3, mod[3], c1)
    out3 = diff
    c1 = borrow
  }
  // Limb 4
  {
    const [diff, borrow] = sub64(tmp4, mod[4], c1)
    out4 = diff
    c1 = borrow
  }
  // Limb 5
  {
    const [diff, borrow] = sub64(tmp5, mod[5], c1)
    out5 = diff
    c1 = borrow
  }
  // Limb 6
  {
    const [diff, borrow] = sub64(tmp6, mod[6], c1)
    out6 = diff
    c1 = borrow
  }
  // Limb 7
  {
    const [diff, borrow] = sub64(tmp7, mod[7], c1)
    out7 = diff
    c1 = borrow
  }
  // Limb 8
  {
    const [diff, borrow] = sub64(tmp8, mod[8], c1)
    out8 = diff
    c1 = borrow
  }
  // Limb 9
  {
    const [diff, borrow] = sub64(tmp9, mod[9], c1)
    out9 = diff
    c1 = borrow
  }
  // Limb 10
  {
    const [diff, borrow] = sub64(tmp10, mod[10], c1)
    out10 = diff
    c1 = borrow
  }
  // Limb 11
  {
    const [diff, borrow] = sub64(tmp11, mod[11], c1)
    out11 = diff
    c1 = borrow
  }

  // -------------------------------
  // Step 3: If c==0 (no add overflow) && c1!=0 (sub borrowed),
  // revert to raw sum, else keep sub. Then mask each limb.
  if (c === 0n && c1 !== 0n) {
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
    z[11] = tmp11 & MASK_64
  } else {
    // keep sub
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

export const addModPreset: Function[] = [
  addMod64,
  addMod128,
  addMod192,
  addMod256,
  addMod320,
  addMod384,
  addMod448,
  addMod512,
  addMod576,
  addMod640,
  addMod704,
  addMod768,
]
