import Common from '@ethereumjs/common'
import { Address } from 'ethereumjs-util'
import { EIP2929StateManager } from '../../state/interface'
import { RunState } from './../interpreter'

/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {Address}  address
 * @param {Common}   common
 * @param {Boolean}  chargeGas (default: true)
 * @param {Boolean}  isSelfdestruct (default: false)
 */
export function accessAddressEIP2929(
  runState: RunState,
  address: Address,
  common: Common,
  chargeGas = true,
  isSelfdestruct = false
): bigint {
  if (!common.isActivatedEIP(2929)) return BigInt(0)

  const stateManager = runState.stateManager as EIP2929StateManager
  const addressStr = address.buf

  // Cold
  if (!stateManager.isWarmedAddress(addressStr)) {
    stateManager.addWarmedAddress(addressStr)

    // CREATE, CREATE2 opcodes have the address warmed for free.
    // selfdestruct beneficiary address reads are charged an *additional* cold access
    if (chargeGas) {
      return BigInt(common.param('gasPrices', 'coldaccountaccess'))
    }
    // Warm: (selfdestruct beneficiary address reads are not charged when warm)
  } else if (chargeGas && !isSelfdestruct) {
    return BigInt(common.param('gasPrices', 'warmstorageread'))
  }
  return BigInt(0)
}

/**
 * Adds (address, key) to accessedStorage tuple set if not already included.
 * Adjusts cost incurred for executing opcode based on whether storage read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {Buffer} key (to storage slot)
 * @param {Common} common
 */
export function accessStorageEIP2929(
  runState: RunState,
  key: Buffer,
  isSstore: boolean,
  common: Common
): bigint {
  if (!common.isActivatedEIP(2929)) return BigInt(0)

  const stateManager = runState.stateManager as EIP2929StateManager
  const address = runState.eei.getAddress().buf
  const slotIsCold = !stateManager.isWarmedStorage(address, key)

  // Cold (SLOAD and SSTORE)
  if (slotIsCold) {
    stateManager.addWarmedStorage(address, key)
    return BigInt(common.param('gasPrices', 'coldsload'))
  } else if (!isSstore) {
    return BigInt(common.param('gasPrices', 'warmstorageread'))
  }
  return BigInt(0)
}

/**
 * Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
 * location is already warm
 * @param  {RunState} runState
 * @param  {Buffer}   key          storage slot
 * @param  {BN}       defaultCost  SSTORE_RESET_GAS / SLOAD
 * @param  {string}   costName     parameter name ('noop')
 * @param  {Common}   common
 * @return {BN}                    adjusted cost
 */
export function adjustSstoreGasEIP2929(
  runState: RunState,
  key: Buffer,
  defaultCost: bigint,
  costName: string,
  common: Common
): bigint {
  if (!common.isActivatedEIP(2929)) return defaultCost

  const stateManager = runState.stateManager as EIP2929StateManager
  const address = runState.eei.getAddress().buf
  const warmRead = BigInt(common.param('gasPrices', 'warmstorageread'))
  const coldSload = BigInt(common.param('gasPrices', 'coldsload'))

  if (stateManager.isWarmedStorage(address, key)) {
    switch (costName) {
      case 'noop':
        return warmRead
      case 'initRefund':
        return BigInt(common.param('gasPrices', 'sstoreInitGasEIP2200')) - warmRead
      case 'cleanRefund':
        return BigInt(common.param('gasPrices', 'sstoreReset')) - coldSload - warmRead
    }
  }

  return defaultCost
}
