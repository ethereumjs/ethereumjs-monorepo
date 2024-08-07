import { EOFContainer, validateEOF } from './eof/container.js'
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
  EVMBN254Interface,
  EVMInterface,
  EVMOpts,
  EVMResult,
  EVMRunCallOpts,
  EVMRunCodeOpts,
  ExecResult,
  Log,
} from './types.js'
export * from './logger.js'

export type {
  EVMBN254Interface,
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
  EOFContainer,
  EVM,
  EvmError,
  EVMErrorMessage,
  getActivePrecompiles,
  getOpcodesForHF,
  MCLBLS,
  Message,
  NobleBLS,
  validateEOF,
}

export * from './constructors.js'
export * from './params.js'
