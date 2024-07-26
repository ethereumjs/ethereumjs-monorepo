import { BIGINT_0 } from '@ethereumjs/util'

import type { RunState } from '../interpreter.js'
import type { Common } from '@ethereumjs/common'

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
  address: Uint8Array,
  common: Common,
  chargeGas = true,
  isSelfdestructOrAuthcall = false,
): bigint {
  if (!common.isActivatedEIP(2929)) return BIGINT_0

  // Cold
  if (!runState.interpreter.journal.isWarmedAddress(address)) {
    runState.interpreter.journal.addWarmedAddress(address)

    // CREATE, CREATE2 opcodes have the address warmed for free.
    // selfdestruct beneficiary address reads are charged an *additional* cold access
    // if verkle not activated
    if (chargeGas && !common.isActivatedEIP(6800)) {
      return common.param('coldaccountaccessGas')
    }
    // Warm: (selfdestruct beneficiary address reads are not charged when warm)
  } else if (chargeGas && !isSelfdestructOrAuthcall) {
    return common.param('warmstoragereadGas')
  }
  return BIGINT_0
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
    if (chargeGas && !common.isActivatedEIP(6800)) {
      return common.param('coldsloadGas')
    }
  } else if (chargeGas && (!isSstore || common.isActivatedEIP(6800))) {
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
