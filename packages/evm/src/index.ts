import { EOF } from './eof.js'
import { EVM } from './evm.js'
import { ERROR as EVMErrorMessage, EvmError } from './exceptions.js'
import { Message } from './message.js'
import { getOpcodesForHF } from './opcodes/index.js'
import {
  MCLBLS,
  NobleBLS,
  type PrecompileInput,
  getActivePrecompiles,
} from './precompiles/index.js'

import type { InterpreterStep } from './interpreter.js'
import type {
  EVMInterface,
  EVMOpts,
  EVMResult,
  EVMRunCallOpts,
  EVMRunCodeOpts,
  ExecResult,
  Log,
  bn128,
} from './types.js'
export * from './logger.js'

export type {
  bn128,
  EVMInterface,
  EVMOpts,
  EVMResult,
  EVMRunCallOpts,
  EVMRunCodeOpts,
  ExecResult,
  InterpreterStep,
  Log,
  PrecompileInput,
}

export {
  EOF,
  EVM,
  EvmError,
  EVMErrorMessage,
  getActivePrecompiles,
  getOpcodesForHF,
  MCLBLS,
  Message,
  NobleBLS,
}
