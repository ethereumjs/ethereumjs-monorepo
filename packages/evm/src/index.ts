import { getActivePrecompiles } from './precompiles'
import { EEIInterface, EVMInterface, EVMStateAccess, Log } from './types'
import EVM, { EVMResult } from './evm'
import { EvmError } from './exceptions'

export {
  getActivePrecompiles,
  EEIInterface,
  EVMInterface,
  EvmError,
  EVMStateAccess,
  Log,
  EVMResult,
}

export default EVM
