import { getActivePrecompiles } from './evm/precompiles'
import EEI from './eei/eei'
import { EEIInterface, EVMInterface, VmStateAccess, Log } from './evm/types'
import EVM, { EVMResult } from './evm/evm'
import { EvmError } from './exceptions'

export {
  getActivePrecompiles,
  EEI,
  EEIInterface,
  EVMInterface,
  EvmError,
  VmStateAccess,
  Log,
  EVMResult,
}

export default EVM
