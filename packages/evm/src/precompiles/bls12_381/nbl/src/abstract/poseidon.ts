/**
 * Implements [Poseidon](https://www.poseidon-hash.info) ZK-friendly hash.
 *
 * There are many poseidon variants with different constants.
 * We don't provide them: you should construct them manually.
 * Check out [micro-starknet](https://github.com/paulmillr/micro-starknet) package for a proper example.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { FpPow, type IField, validateField } from './modular.ts'
import { bitGet } from './utils.ts'

// Grain LFSR (Linear-Feedback Shift Register): https://eprint.iacr.org/2009/109.pdf
function grainLFSR(state: number[]): () => boolean {
  let pos = 0
  if (state.length !== 80) throw new Error('grainLFRS: wrong state length, should be 80 bits')
  const getBit = (): boolean => {
    const r = (offset: number) => state[(pos + offset) % 80]
    const bit = r(62) ^ r(51) ^ r(38) ^ r(23) ^ r(13) ^ r(0)
    state[pos] = bit
    pos = ++pos % 80
    return !!bit
  }
  for (let i = 0; i < 160; i++) getBit()
  return () => {
    // https://en.wikipedia.org/wiki/Shrinking_generator
    while (true) {
      const b1 = getBit()
      const b2 = getBit()
      if (!b1) continue
      return b2
    }
  }
}

export type PoseidonBasicOpts = {
  Fp: IField<bigint>
  t: number // t = rate + capacity
  roundsFull: number
  roundsPartial: number
  isSboxInverse?: boolean
}

function validateBasicOpts(opts: PoseidonBasicOpts) {
  const { Fp, roundsFull } = opts
  validateField(Fp)
  for (const i of ['t', 'roundsFull', 'roundsPartial'] as const) {
    if (typeof opts[i] !== 'number' || !Number.isSafeInteger(opts[i]))
      throw new Error('invalid number ' + i)
  }
  if (opts.isSboxInverse !== undefined && typeof opts.isSboxInverse !== 'boolean')
    throw new Error(`Poseidon: invalid param isSboxInverse=${opts.isSboxInverse}`)
  if (roundsFull & 1) throw new Error('roundsFull is not even' + roundsFull)
}

function poseidonGrain(opts: PoseidonBasicOpts) {
  validateBasicOpts(opts)
  const { Fp } = opts
  const state = Array(80).fill(1)
  let pos = 0
  const writeBits = (value: bigint, bitCount: number) => {
    for (let i = bitCount - 1; i >= 0; i--) state[pos++] = Number(bitGet(value, i))
  }
  writeBits(1n, 2) // prime field
  writeBits(opts.isSboxInverse ? 1n : 0n, 4) // b2..b5
  writeBits(BigInt(Fp.BITS), 12) // b6..b17
  writeBits(BigInt(opts.t), 12) // b18..b29
  writeBits(BigInt(opts.roundsFull), 10) // b30..b39
  writeBits(BigInt(opts.roundsPartial), 10) // b40..b49

  const getBit = grainLFSR(state)
  return (count: number, reject: boolean): bigint[] => {
    const res: bigint[] = []
    for (let i = 0; i < count; i++) {
      while (true) {
        let num = 0n
        for (let i = 0; i < Fp.BITS; i++) {
          num <<= 1n
          if (getBit()) num |= 1n
        }
        if (reject && num >= Fp.ORDER) continue // rejection sampling
        res.push(Fp.create(num))
        break
      }
    }
    return res
  }
}

export type PoseidonGrainOpts = PoseidonBasicOpts & {
  sboxPower?: number
}

type PoseidonConstants = { mds: bigint[][]; roundConstants: bigint[][] }

// NOTE: this is not standard but used often for constant generation for poseidon
// (grain LFRS-like structure)
export function grainGenConstants(opts: PoseidonGrainOpts, skipMDS: number = 0): PoseidonConstants {
  const { Fp, t, roundsFull, roundsPartial } = opts
  const rounds = roundsFull + roundsPartial
  const sample = poseidonGrain(opts)
  const roundConstants: bigint[][] = []
  for (let r = 0; r < rounds; r++) roundConstants.push(sample(t, true))
  if (skipMDS > 0) for (let i = 0; i < skipMDS; i++) sample(2 * t, false)
  const xs = sample(t, false)
  const ys = sample(t, false)
  // Construct MDS Matrix M[i][j] = 1 / (xs[i] + ys[j])
  const mds: bigint[][] = []
  for (let i = 0; i < t; i++) {
    const row: bigint[] = []
    for (let j = 0; j < t; j++) {
      const xy = Fp.add(xs[i], ys[j])
      if (Fp.is0(xy))
        throw new Error(`Error generating MDS matrix: xs[${i}] + ys[${j}] resulted in zero.`)
      row.push(xy)
    }
    mds.push(Fp.invertBatch(row))
  }

  return { roundConstants, mds }
}

export type PoseidonOpts = PoseidonBasicOpts &
  PoseidonConstants & {
    sboxPower?: number
    reversePartialPowIdx?: boolean // Hack for stark
  }

export function validateOpts(opts: PoseidonOpts): Readonly<{
  rounds: number
  sboxFn: (n: bigint) => bigint
  roundConstants: bigint[][]
  mds: bigint[][]
  Fp: IField<bigint>
  t: number
  roundsFull: number
  roundsPartial: number
  sboxPower?: number
  reversePartialPowIdx?: boolean // Hack for stark
}> {
  validateBasicOpts(opts)
  const { Fp, mds, reversePartialPowIdx: rev, roundConstants: rc } = opts
  const { roundsFull, roundsPartial, sboxPower, t } = opts

  // MDS is TxT matrix
  if (!Array.isArray(mds) || mds.length !== t) throw new Error('Poseidon: invalid MDS matrix')
  const _mds = mds.map((mdsRow) => {
    if (!Array.isArray(mdsRow) || mdsRow.length !== t)
      throw new Error('invalid MDS matrix row: ' + mdsRow)
    return mdsRow.map((i) => {
      if (typeof i !== 'bigint') throw new Error('invalid MDS matrix bigint: ' + i)
      return Fp.create(i)
    })
  })

  if (rev !== undefined && typeof rev !== 'boolean')
    throw new Error('invalid param reversePartialPowIdx=' + rev)

  if (roundsFull & 1) throw new Error('roundsFull is not even' + roundsFull)
  const rounds = roundsFull + roundsPartial

  if (!Array.isArray(rc) || rc.length !== rounds)
    throw new Error('Poseidon: invalid round constants')
  const roundConstants = rc.map((rc) => {
    if (!Array.isArray(rc) || rc.length !== t) throw new Error('invalid round constants')
    return rc.map((i) => {
      if (typeof i !== 'bigint' || !Fp.isValid(i)) throw new Error('invalid round constant')
      return Fp.create(i)
    })
  })

  if (!sboxPower || ![3, 5, 7, 17].includes(sboxPower)) throw new Error('invalid sboxPower')
  const _sboxPower = BigInt(sboxPower)
  let sboxFn = (n: bigint) => FpPow(Fp, n, _sboxPower)
  // Unwrapped sbox power for common cases (195->142μs)
  if (sboxPower === 3) sboxFn = (n: bigint) => Fp.mul(Fp.sqrN(n), n)
  else if (sboxPower === 5) sboxFn = (n: bigint) => Fp.mul(Fp.sqrN(Fp.sqrN(n)), n)

  return Object.freeze({ ...opts, rounds, sboxFn, roundConstants, mds: _mds })
}

export function splitConstants(rc: bigint[], t: number): bigint[][] {
  if (typeof t !== 'number') throw new Error('poseidonSplitConstants: invalid t')
  if (!Array.isArray(rc) || rc.length % t) throw new Error('poseidonSplitConstants: invalid rc')
  const res = []
  let tmp = []
  for (let i = 0; i < rc.length; i++) {
    tmp.push(rc[i])
    if (tmp.length === t) {
      res.push(tmp)
      tmp = []
    }
  }
  return res
}

/** Poseidon NTT-friendly hash. */
export function poseidon(opts: PoseidonOpts): {
  (values: bigint[]): bigint[]
  // For verification in tests
  roundConstants: bigint[][]
} {
  const _opts = validateOpts(opts)
  const { Fp, mds, roundConstants, rounds: totalRounds, roundsPartial, sboxFn, t } = _opts
  const halfRoundsFull = _opts.roundsFull / 2
  const partialIdx = _opts.reversePartialPowIdx ? t - 1 : 0
  const poseidonRound = (values: bigint[], isFull: boolean, idx: number) => {
    values = values.map((i, j) => Fp.add(i, roundConstants[idx][j]))

    if (isFull) values = values.map((i) => sboxFn(i))
    else values[partialIdx] = sboxFn(values[partialIdx])
    // Matrix multiplication
    values = mds.map((i) => i.reduce((acc, i, j) => Fp.add(acc, Fp.mulN(i, values[j])), Fp.ZERO))
    return values
  }
  const poseidonHash = function poseidonHash(values: bigint[]) {
    if (!Array.isArray(values) || values.length !== t)
      throw new Error('invalid values, expected array of bigints with length ' + t)
    values = values.map((i) => {
      if (typeof i !== 'bigint') throw new Error('invalid bigint=' + i)
      return Fp.create(i)
    })
    let lastRound = 0
    // Apply r_f/2 full rounds.
    for (let i = 0; i < halfRoundsFull; i++) values = poseidonRound(values, true, lastRound++)
    // Apply r_p partial rounds.
    for (let i = 0; i < roundsPartial; i++) values = poseidonRound(values, false, lastRound++)
    // Apply r_f/2 full rounds.
    for (let i = 0; i < halfRoundsFull; i++) values = poseidonRound(values, true, lastRound++)

    if (lastRound !== totalRounds) throw new Error('invalid number of rounds')
    return values
  }
  // For verification in tests
  poseidonHash.roundConstants = roundConstants
  return poseidonHash
}

export class PoseidonSponge {
  private Fp: IField<bigint>
  readonly rate: number
  readonly capacity: number
  readonly hash: ReturnType<typeof poseidon>
  private state: bigint[] // [...capacity, ...rate]
  private pos = 0
  private isAbsorbing = true

  constructor(
    Fp: IField<bigint>,
    rate: number,
    capacity: number,
    hash: ReturnType<typeof poseidon>,
  ) {
    this.Fp = Fp
    this.hash = hash
    this.rate = rate
    this.capacity = capacity
    this.state = new Array(rate + capacity)
    this.clean()
  }
  private process(): void {
    this.state = this.hash(this.state)
  }
  absorb(input: bigint[]): void {
    for (const i of input)
      if (typeof i !== 'bigint' || !this.Fp.isValid(i)) throw new Error('invalid input: ' + i)
    for (let i = 0; i < input.length; ) {
      if (!this.isAbsorbing || this.pos === this.rate) {
        this.process()
        this.pos = 0
        this.isAbsorbing = true
      }
      const chunk = Math.min(this.rate - this.pos, input.length - i)
      for (let j = 0; j < chunk; j++) {
        const idx = this.capacity + this.pos++
        this.state[idx] = this.Fp.add(this.state[idx], input[i++])
      }
    }
  }
  squeeze(count: number): bigint[] {
    const res: bigint[] = []
    while (res.length < count) {
      if (this.isAbsorbing || this.pos === this.rate) {
        this.process()
        this.pos = 0
        this.isAbsorbing = false
      }
      const chunk = Math.min(this.rate - this.pos, count - res.length)
      for (let i = 0; i < chunk; i++) res.push(this.state[this.capacity + this.pos++])
    }
    return res
  }
  clean(): void {
    this.state.fill(this.Fp.ZERO)
    this.isAbsorbing = true
    this.pos = 0
  }
  clone(): PoseidonSponge {
    const c = new PoseidonSponge(this.Fp, this.rate, this.capacity, this.hash)
    c.pos = this.pos
    c.state = [...this.state]
    return c
  }
}

export type PoseidonSpongeOpts = Omit<PoseidonOpts, 't'> & {
  rate: number
  capacity: number
}

/**
 * The method is not defined in spec, but nevertheless used often.
 * Check carefully for compatibility: there are many edge cases, like absorbing an empty array.
 * We cross-test against:
 * - https://github.com/ProvableHQ/snarkVM/tree/staging/algorithms
 * - https://github.com/arkworks-rs/crypto-primitives/tree/main
 */
export function poseidonSponge(opts: PoseidonSpongeOpts): () => PoseidonSponge {
  for (const i of ['rate', 'capacity'] as const) {
    if (typeof opts[i] !== 'number' || !Number.isSafeInteger(opts[i]))
      throw new Error('invalid number ' + i)
  }
  const { rate, capacity } = opts
  const t = opts.rate + opts.capacity
  // Re-use hash instance between multiple instances
  const hash = poseidon({ ...opts, t })
  const { Fp } = opts
  return () => new PoseidonSponge(Fp, rate, capacity, hash)
}
