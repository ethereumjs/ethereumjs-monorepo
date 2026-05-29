import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { type EVM, createEVM } from '@ethereumjs/evm'

// EIP-8024 stack opcodes (0xe6 DUPN, 0xe7 SWAPN, 0xe8 EXCHANGE)
// https://eips.ethereum.org/EIPS/eip-8024
//
// Active on Hardfork.Amsterdam. These extend DUP/SWAP to deep stack depths
// (n = 17..235) using a single-byte immediate per opcode.
//
// Run from packages/evm:
//   npx tsx examples/opcodes/0xe6-e8-eip8024-stack-opcodes.ts

const DUPN = 0xe6
const SWAPN = 0xe7
const EXCHANGE = 0xe8
const STOP = 0x00
const PUSH1 = 0x60

/** Encode DUPN / SWAPN immediate for one-based depth n (17..235). Spec: n = (x + 145) mod 256 */
const encodeSingleImmediate = (n: number): number => {
  if (n < 17 || n > 235) {
    throw new Error(`DUPN/SWAPN depth must be 17..235, got ${n}`)
  }
  return (n - 145) & 0xff
}

/** Push consecutive values 1..count (bottom = 1, top = count) */
const buildPushSequence = (count: number): Uint8Array => {
  const bytes = new Uint8Array(count * 2)
  for (let i = 0; i < count; i++) {
    bytes[i * 2] = PUSH1
    bytes[i * 2 + 1] = i + 1
  }
  return bytes
}

const concatBytes = (...parts: Uint8Array[]): Uint8Array => {
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

const stackTop = (evmResult: Awaited<ReturnType<EVM['runCode']>>, n: number): number[] => {
  const stack = evmResult.runState?.stack
  if (!stack) {
    throw new Error('Missing runState stack in result')
  }
  return stack
    .peek(n)
    .map((word) => Number(word))
    .reverse()
}

const runCase = async (evm: EVM, label: string, code: Uint8Array) => {
  const res = await evm.runCode({ code, gasLimit: 1_000_000n })
  console.log('--------------------------------')
  console.log(label)
  console.log(
    `stack (top ${Math.min(5, stackTop(res, 5).length)} shown, top last):`,
    stackTop(res, 5),
  )
  console.log(`gas used: ${res.executionGasUsed}`)
}

const main = async () => {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Amsterdam,
  })
  const evm = await createEVM({ common })

  // Stack [1..18], top = 18. DUPN depth 17 duplicates the item at 17 (value 2) onto the top.
  await runCase(
    evm,
    'DUPN (0xe6): duplicate stack item at depth 17',
    concatBytes(buildPushSequence(18), Uint8Array.from([DUPN, encodeSingleImmediate(17), STOP])),
  )

  // Stack [1..18], top = 18. SWAPN depth 17 swaps top with the item at depth 17 (value 2).
  await runCase(
    evm,
    'SWAPN (0xe7): swap top with item at depth 17',
    concatBytes(buildPushSequence(18), Uint8Array.from([SWAPN, encodeSingleImmediate(17), STOP])),
  )

  // Stack [1..20], top = 20. EXCHANGE immediate 0x8e swaps the 1st and 2nd slots below the top (18 <-> 19).
  await runCase(
    evm,
    'EXCHANGE (0xe8): swap 1st and 2nd slots below top (immediate 0x8e)',
    concatBytes(buildPushSequence(20), Uint8Array.from([EXCHANGE, 0x8e, STOP])),
  )
  console.log('--------------------------------')
}

void main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
