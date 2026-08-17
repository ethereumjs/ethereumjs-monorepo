import { bytesToBigInt, hexToBytes } from '@ethereumjs/util'

import { createEVM } from '../src/index.ts'

import type { EVM } from '../src/evm.ts'
import type { EVMOpts } from '../src/index.ts'
import type { ExecResult } from '../src/types.ts'

/** PUSH1 0 MSTORE, PUSH1 32, PUSH1 0, RETURN — materializes one stack word as return data. */
export const RETURN_TOP = '60005260206000f3'

export function push1(value: number | bigint): string {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 0 || n > 255) {
    throw new Error(`push1(): value out of range: ${value}`)
  }
  return `60${n.toString(16).padStart(2, '0')}`
}

export function pushBigInt(value: bigint): string {
  if (value < 0n) {
    throw new Error('pushBigInt(): negative values are not supported')
  }
  if (value <= 255n) {
    return push1(value)
  }
  let hex = value.toString(16)
  if (hex.length % 2 === 1) hex = `0${hex}`
  const byteLength = hex.length / 2
  const opcode = (0x5f + byteLength).toString(16)
  return `${opcode}${hex}`
}

export async function runBytecode(
  bytecode: string,
  opts?: EVMOpts & {
    runCode?: Record<string, unknown>
    beforeRun?: (evm: EVM) => void | Promise<void>
  },
): Promise<ExecResult> {
  const { runCode: runCodeOpts, beforeRun, ...evmOpts } = opts ?? {}
  const evm = await createEVM(evmOpts)
  if (beforeRun !== undefined) {
    await beforeRun(evm)
  }
  return evm.runCode!({
    code: hexToBytes(`0x${bytecode.replace(/^0x/, '')}`),
    gasLimit: BigInt(1_000_000),
    ...runCodeOpts,
  })
}

export async function runBytecodeExpectReturn(
  bytecode: string,
  expected: bigint,
  opts?: EVMOpts & {
    runCode?: Record<string, unknown>
    beforeRun?: (evm: EVM) => void | Promise<void>
  },
): Promise<ExecResult> {
  const res = await runBytecode(`${bytecode}${RETURN_TOP}`, opts)
  if (res.exceptionError !== undefined) {
    throw new Error(res.exceptionError.error)
  }
  const actual = bytesToBigInt(res.returnValue)
  if (actual !== expected) {
    throw new Error(`expected return ${expected}, got ${actual}`)
  }
  return res
}
