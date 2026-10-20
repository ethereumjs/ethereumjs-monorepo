import { bytesToBigInt, hexToBytes } from '@ethereumjs/util'

import type { ExecResult } from '@ethereumjs/evm'
import type { VMOpts } from '../../src/types.ts'
import type { VM } from '../../src/vm.ts'
import { setupVM } from './utils.ts'

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
  opts?: VMOpts & {
    runCode?: Record<string, unknown>
    beforeRun?: (vm: VM) => void | Promise<void>
  },
): Promise<ExecResult> {
  const { runCode: runCodeOpts, beforeRun, ...vmOpts } = opts ?? {}
  const vm = await setupVM(vmOpts)
  if (beforeRun !== undefined) {
    await beforeRun(vm)
  }
  return vm.evm.runCode!({
    code: hexToBytes(`0x${bytecode.replace(/^0x/, '')}`),
    gasLimit: BigInt(1_000_000),
    ...runCodeOpts,
  })
}

export async function runBytecodeExpectReturn(
  bytecode: string,
  expected: bigint,
  opts?: VMOpts & {
    runCode?: Record<string, unknown>
    beforeRun?: (vm: VM) => void | Promise<void>
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
