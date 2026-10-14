import type { Common } from '@ethereumjs/common'

import type { OpcodeEntry } from '../codes.ts'
import type { OpHandler } from '../functions.ts'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from '../gas.ts'
import { OPCODE_EIP_MODULES } from './index.ts'

import type { OpcodeEipModule } from './types.ts'

export function activeOpcodeEipModules(common: Common): OpcodeEipModule[] {
  return OPCODE_EIP_MODULES.filter((mod) => common.isActivatedEIP(mod.eip))
}

export function mergeOpcodeEipBuilder(
  opcodeBuilder: Record<number, { name: string; isAsync: boolean; dynamicGas: boolean }>,
  common: Common,
): void {
  for (const mod of activeOpcodeEipModules(common)) {
    Object.assign(opcodeBuilder, mod.opcodes)
  }
}

export function mergeOpcodeEipHandlers(
  handlers: Map<number, OpHandler>,
  dynamicGasHandlers: Map<number, AsyncDynamicGasHandler | SyncDynamicGasHandler>,
  common: Common,
): void {
  for (const mod of activeOpcodeEipModules(common)) {
    for (const [opcode, def] of mod.handlers) {
      handlers.set(opcode, def.logic)
      if (def.gas !== undefined) {
        dynamicGasHandlers.set(opcode, def.gas)
      }
    }
  }
}

export function opcodeImmediateBytesFromModules(opcode: number): number | undefined {
  for (const mod of OPCODE_EIP_MODULES) {
    for (const [op, def] of mod.handlers) {
      if (op === opcode && def.immediates !== undefined) {
        return def.immediates
      }
    }
  }
  return undefined
}
