import { keccak_256 as awasmKeccak } from '@awasm/noble'
import { keccak_256 as awasmKeccakJs } from '@awasm/noble/js.js'
import { keccak_256 as awasmKeccakThreads } from '@awasm/noble/wasm_threads.js'
/**
 * Keccak256 implementation comparison: @noble/hashes vs @awasm/noble variants.
 *
 * Run with: npx tsx benchmarks/keccak.ts
 */
import { keccak_256 as nobleKeccak } from '@noble/hashes/sha3.js'

type HashFn = (data: Uint8Array) => Uint8Array

interface Impl {
  name: string
  fn: HashFn
}

const impls: Impl[] = [
  { name: '@noble/hashes (baseline)', fn: nobleKeccak },
  { name: '@awasm/noble (wasm)', fn: awasmKeccak as HashFn },
  { name: '@awasm/noble/js.js (faster JS)', fn: awasmKeccakJs as HashFn },
  { name: '@awasm/noble/wasm_threads.js', fn: awasmKeccakThreads as HashFn },
]

const SIZES = [32, 64, 128, 256, 1024, 4096, 16_384, 65_536]
const WARMUP_MS = 300
const MEASURE_MS = 1500

function makeInput(size: number): Uint8Array {
  const buf = new Uint8Array(size)
  for (let i = 0; i < size; i++) buf[i] = (i * 31) & 0xff
  return buf
}

function timeFor(fn: HashFn, input: Uint8Array, durationMs: number): number {
  const end = performance.now() + durationMs
  let iters = 0
  while (performance.now() < end) {
    // small unroll to amortize loop overhead
    fn(input)
    fn(input)
    fn(input)
    fn(input)
    fn(input)
    fn(input)
    fn(input)
    fn(input)
    iters += 8
  }
  return iters
}

function fmt(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}G`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}k`
  return n.toFixed(2)
}

function sanityCheck(): void {
  const input = new TextEncoder().encode('ethereumjs')
  const baseline = Buffer.from(nobleKeccak(input)).toString('hex')
  for (const { name, fn } of impls) {
    const out = Buffer.from(fn(input)).toString('hex')
    const ok = out === baseline
    console.log(`  ${ok ? 'OK' : 'MISMATCH'}  ${name}: ${out}`)
    if (!ok) throw new Error(`Output mismatch for ${name}`)
  }
}

async function main() {
  console.log('Sanity check — keccak256("ethereumjs"):')
  sanityCheck()
  console.log()

  console.log('Throughput (higher is better). Time per hash in ns; H/s = hashes/sec.\n')

  const header = ['size'.padEnd(8), ...impls.map((i) => i.name.padEnd(34))].join('')
  console.log(header)

  for (const size of SIZES) {
    const input = makeInput(size)
    const row = [`${size}B`.padEnd(8)]
    const baselineOpsPerSec: { ops: number } = { ops: 0 }

    for (const [idx, { fn }] of impls.entries()) {
      // warmup
      timeFor(fn, input, WARMUP_MS)
      // measure
      const t0 = performance.now()
      const iters = timeFor(fn, input, MEASURE_MS)
      const elapsed = (performance.now() - t0) / 1000
      const ops = iters / elapsed
      const ns = 1e9 / ops
      if (idx === 0) baselineOpsPerSec.ops = ops
      const rel = idx === 0 ? '' : `  (${(ops / baselineOpsPerSec.ops).toFixed(2)}x)`
      row.push(`${fmt(ops)}H/s ${ns.toFixed(0)}ns${rel}`.padEnd(34))
    }
    console.log(row.join(''))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
