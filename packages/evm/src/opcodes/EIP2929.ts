import { BIGINT_0, bytesToHex } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'
import type { RunState } from '../interpreter.ts'

/**
 * Returns the gas cost for accessing an address WITHOUT any side effects.
 * Use this to check if you have enough gas before committing to the access.
 *
 * @param {RunState} runState
 * @param {Uint8Array} address
 * @param {Common} common
 * @param {Boolean} chargeGas (default: true)
 * @param {Boolean} isSelfdestruct (default: false)
 * @returns {bigint} The gas cost for this address access
 */
export function getAddressAccessCost(
  runState: RunState,
  address: Uint8Array,
  common: Common,
  chargeGas = true,
  isSelfdestruct = false,
): bigint {
  if (!common.isActivatedEIP(2929)) return BIGINT_0

  const isCold = !runState.interpreter.journal.isWarmedAddress(address)

  if (isCold) {
    // CREATE, CREATE2 opcodes have the address warmed for free.
    // selfdestruct beneficiary address reads are charged an *additional* cold access
    // if binary tree not activated
    if (chargeGas && !common.isActivatedEIP(7864)) {
      return common.param('coldaccountaccessGas')
    } else if (chargeGas && common.isActivatedEIP(7864)) {
      // If binary tree is active, then the warmstoragereadGas should still be charged
      // This is because otherwise opcodes will have cost 0 (this is thus the base fee)
      return common.param('warmstoragereadGas')
    }
  } else if (chargeGas && !isSelfdestruct) {
    // Warm: (selfdestruct beneficiary address reads are not charged when warm)
    return common.param('warmstoragereadGas')
  }
  return BIGINT_0
}

/**
 * Warms an address (adds to EIP-2929 accessed addresses set).
 * Call this AFTER verifying you have enough gas for the access.
 *
 * @param {RunState} runState
 * @param {Uint8Array} address
 */
export function warmAddress(runState: RunState, address: Uint8Array): void {
  if (!runState.interpreter.journal.isWarmedAddress(address)) {
    runState.interpreter.journal.addWarmedAddress(address)
  }
}

/**
 * Adds address to BAL (Block Access List) for EIP-7928.
 * Call this AFTER verifying you have enough gas for the access.
 *
 * @param {RunState} runState
 * @param {Uint8Array} address
 * @param {Common} common
 */
export function addAddressToBAL(runState: RunState, address: Uint8Array, common: Common): void {
  if (common.isActivatedEIP(7928)) {
    const addressHex = bytesToHex(address)
    runState.interpreter._evm.blockLevelAccessList?.addAddress(addressHex)
  }
}

/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 *
 * This is a convenience function that combines getAddressAccessCost + warmAddress.
 * For fine-grained control (e.g., EIP-7928 BAL with OOG checks), use the
 * individual functions instead.
 *
 * @param {RunState} runState
 * @param {Uint8Array}  address
 * @param {Common}   common
 * @param {Boolean}  chargeGas (default: true)
 * @param {Boolean}  isSelfdestruct (default: false)
 */
export function accessAddressEIP2929(
  runState: RunState,
  address: Uint8Array,
  common: Common,
  chargeGas = true,
  isSelfdestruct = false,
): bigint {
  if (!common.isActivatedEIP(2929)) return BIGINT_0

  const cost = getAddressAccessCost(runState, address, common, chargeGas, isSelfdestruct)
  warmAddress(runState, address)
  return cost
}

/**
 * Adds (address, key) to accessedStorage tuple set if not already included.
 * Adjusts cost incurred for executing opcode based on whether storage read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {Uint8Array} key (to storage slot)
 * @param {Common} common
 */
export function accessStorageEIP2929(
  runState: RunState,
  key: Uint8Array,
  isSstore: boolean,
  common: Common,
  chargeGas = true,
): bigint {
  if (!common.isActivatedEIP(2929)) return BIGINT_0

  const address = runState.interpreter.getAddress().bytes
  const slotIsCold = !runState.interpreter.journal.isWarmedStorage(address, key)

  // Cold (SLOAD and SSTORE)
  if (slotIsCold) {
    runState.interpreter.journal.addWarmedStorage(address, key)
    if (chargeGas && !(common.isActivatedEIP(6800) || common.isActivatedEIP(7864))) {
      return common.param('coldsloadGas')
    }
  } else if (
    chargeGas &&
    (!isSstore || common.isActivatedEIP(6800) || common.isActivatedEIP(7864))
  ) {
    return common.param('warmstoragereadGas')
  }
  return BIGINT_0
}

/**
 * Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
 * location is already warm
 * @param  {RunState} runState
 * @param  {Uint8Array}   key          storage slot
 * @param  {BigInt}   defaultCost  SSTORE_RESET_GAS / SLOAD
 * @param  {string}   costName     parameter name ('noop')
 * @param  {Common}   common
 * @return {BigInt}                adjusted cost
 */
export function adjustSstoreGasEIP2929(
  runState: RunState,
  key: Uint8Array,
  defaultCost: bigint,
  costName: string,
  common: Common,
): bigint {
  if (!common.isActivatedEIP(2929)) return defaultCost

  const address = runState.interpreter.getAddress().bytes
  const warmRead = common.param('warmstoragereadGas')
  const coldSload = common.param('coldsloadGas')

  if (runState.interpreter.journal.isWarmedStorage(address, key)) {
    switch (costName) {
      case 'noop':
        return warmRead
      case 'initRefund':
        return common.param('sstoreInitEIP2200Gas') - warmRead
      case 'cleanRefund':
        return common.param('sstoreResetGas') - coldSload - warmRead
    }
  }

  return defaultCost
}
