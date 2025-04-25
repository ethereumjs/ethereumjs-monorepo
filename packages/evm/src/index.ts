import { EOFContainer, validateEOF } from './eof/container.ts'
import { EVMError } from './errors.ts'
import { EVM } from './evm.ts'
import { Message } from './message.ts'
import { getOpcodesForHF } from './opcodes/index.ts'
import {
  MCLBLS,
  NobleBLS,
  NobleBN254,
  type PrecompileInput,
  RustBN254,
  getActivePrecompiles,
} from './precompiles/index.ts'
import { EVMMockBlockchain } from './types.ts'

import type { InterpreterStep } from './interpreter.ts'
import type {
  EVMBLSInterface,
  EVMBN254Interface,
  EVMInterface,
  EVMMockBlockchainInterface,
  EVMOpts,
  EVMResult,
  EVMRunCallOpts,
  EVMRunCodeOpts,
  ExecResult,
  Log,
} from './types.ts'
export * from './logger.ts'

export type {
  EVMBLSInterface,
  EVMBN254Interface,
  EVMInterface,
  EVMMockBlockchainInterface,
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
  EVMError,
  EVMMockBlockchain,
  getActivePrecompiles,
  getOpcodesForHF,
  MCLBLS,
  Message,
  NobleBLS,
  NobleBN254,
  RustBN254,
  validateEOF,
}

export * from './binaryTreeAccessWitness.ts'
export * from './constructors.ts'
export * from './params.ts'
export * from './verkleAccessWitness.ts'
