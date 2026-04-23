/**
 * Keccak256 implementation comparison: @noble/hashes vs @awasm/noble variants.
 *
 * Each impl runs in its own child process to avoid V8 polymorphic-call-site
 * deopts that would otherwise skew results when multiple hash functions share
 * the same measuring loop.
 *
 * Run with: npx tsx benchmarks/keccak.ts
 *          npx tsx benchmarks/keccak.ts --worker <impl>   (internal)
 */
import { spawnSync } from 'node:child_process'

const IMPLS = [
  { id: 'noble', label: '@noble/hashes', mod: '@noble/hashes/sha3.js', sym: 'keccak_256' },
  { id: 'awasm-wasm', label: '@awasm/noble (wasm)', mod: '@awasm/noble', sym: 'keccak_256' },
  { id: 'awasm-js', label: '@awasm/noble/js.js', mod: '@awasm/noble/js.js', sym: 'keccak_256' },
  {
    id: 'awasm-threads',
    label: '@awasm/noble/wasm_threads.js',
    mod: '@awasm/noble/wasm_threads.js',
    sym: 'keccak_256',
  },
] as const

const SIZES = [32, 64, 128, 256, 1024, 4096, 16_384, 65_536]
const WARMUP_MS = 500
const MEASURE_MS = 2000

function makeInput(size: number): Uint8Array {
  const buf = new Uint8Array(size)
  for (let i = 0; i < size; i++) buf[i] = (i * 31) & 0xff
  return buf
}

async function workerMain(implId: string) {
  const impl = IMPLS.find((i) => i.id === implId)
  if (!impl) throw new Error(`unknown impl ${implId}`)
  const mod: Record<string, (d: Uint8Array) => Uint8Array> = await import(impl.mod)
  const fn = mod[impl.sym]

  // Verify digest against a known vector
  const check = Buffer.from(fn(new TextEncoder().encode('ethereumjs'))).toString('hex')

  const results: { size: number; opsPerSec: number }[] = []
  for (const size of SIZES) {
    const input = makeInput(size)

    // warmup
    const warmEnd = performance.now() + WARMUP_MS
    while (performance.now() < warmEnd) {
      fn(input)
    }

    // measure
    const end = performance.now() + MEASURE_MS
    const t0 = performance.now()
    let iters = 0
    while (performance.now() < end) {
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
    const elapsed = (performance.now() - t0) / 1000
    results.push({ size, opsPerSec: iters / elapsed })
  }

  process.stdout.write(JSON.stringify({ check, results }))
}

function fmtH(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return n.toFixed(1)
}

function fmtNs(opsPerSec: number): string {
  const ns = 1e9 / opsPerSec
  if (ns >= 1e6) return `${(ns / 1e6).toFixed(2)}ms`
  if (ns >= 1e3) return `${(ns / 1e3).toFixed(2)}µs`
  return `${ns.toFixed(0)}ns`
}

async function driverMain() {
  console.log(`node ${process.version}, ${process.platform}/${process.arch}`)
  console.log(`warmup ${WARMUP_MS}ms, measure ${MEASURE_MS}ms, isolated child per impl\n`)

  const results: Record<string, { check: string; results: { size: number; opsPerSec: number }[] }> =
    {}

  for (const impl of IMPLS) {
    process.stdout.write(`  running ${impl.label.padEnd(32)} ... `)
    const child = spawnSync(
      'npx',
      ['tsx', new URL(import.meta.url).pathname, '--worker', impl.id],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
    )
    if (child.status !== 0) {
      console.log('FAILED')
      process.exit(1)
    }
    const parsed = JSON.parse(child.stdout)
    results[impl.id] = parsed
    console.log(`digest=${parsed.check.slice(0, 12)}…`)
  }

  // Sanity: all digests identical
  const digests = new Set(Object.values(results).map((r) => r.check))
  if (digests.size !== 1) {
    console.error('\nDIGEST MISMATCH:', digests)
    process.exit(1)
  }
  console.log(`\nAll impls produce identical digest for "ethereumjs": ${[...digests][0]}\n`)

  // Table: rows are sizes, columns are impls
  const colWidth = 22
  const header = 'size'.padEnd(8) + IMPLS.map((i) => i.label.padEnd(colWidth)).join('')
  console.log(header)
  console.log('-'.repeat(header.length))

  for (let sIdx = 0; sIdx < SIZES.length; sIdx++) {
    const size = SIZES[sIdx]
    const row = [`${size}B`.padEnd(8)]
    const baseOps = results[IMPLS[0].id].results[sIdx].opsPerSec
    for (let i = 0; i < IMPLS.length; i++) {
      const ops = results[IMPLS[i].id].results[sIdx].opsPerSec
      const rel = i === 0 ? '' : ` ${(ops / baseOps).toFixed(1)}x`
      const cell = `${fmtH(ops)}H/s ${fmtNs(ops)}${rel}`
      row.push(cell.padEnd(colWidth))
    }
    console.log(row.join(''))
  }

  console.log('\nSpeedup vs @noble/hashes (higher = faster):')
  for (const impl of IMPLS.slice(1)) {
    const speedups = SIZES.map(
      (_, i) => results[impl.id].results[i].opsPerSec / results[IMPLS[0].id].results[i].opsPerSec,
    )
    const min = Math.min(...speedups).toFixed(2)
    const max = Math.max(...speedups).toFixed(2)
    const avg = (speedups.reduce((a, b) => a + b, 0) / speedups.length).toFixed(2)
    console.log(`  ${impl.label.padEnd(32)} min ${min}x  avg ${avg}x  max ${max}x`)
  }
}

const workerFlag = process.argv.indexOf('--worker')
if (workerFlag !== -1) {
  workerMain(process.argv[workerFlag + 1]).catch((e) => {
    console.error(e)
    process.exit(1)
  })
} else {
  driverMain().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
