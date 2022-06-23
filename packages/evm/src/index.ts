import { getActivePrecompiles } from './precompiles'
import { EEIInterface, EVMInterface, VmStateAccess, Log } from './types'
import EVM, { EVMResult } from './evm'
import { EvmError } from './exceptions'

export { getActivePrecompiles, EEIInterface, EVMInterface, EvmError, VmStateAccess, Log, EVMResult }

export default EVM
