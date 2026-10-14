import type { OpcodeEntry } from '../codes.ts'
import type { OpHandler } from '../functions.ts'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from '../gas.ts'

export type OpcodeEipDefinition = {
  /** Immediate bytes after the opcode byte (for jump analysis and step traces). */
  immediates?: number
  logic: OpHandler
  gas?: AsyncDynamicGasHandler | SyncDynamicGasHandler
}

export type OpcodeEipModule = {
  eip: number
  opcodes: OpcodeEntry
  handlers: Map<number, OpcodeEipDefinition>
}
