import { BIGINT_0, bytesToHex } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'
import type { RunState } from '../interpreter.ts'

/**
 * Returns the gas cost for accessing an address without warming it.
 *
 * Use this to verify sufficient gas remains before committing to the access.
 *
 * @param chargeGas - When false, returns zero (e.g. CREATE/CREATE2 warm the target for free)
 * @param isSelfdestruct - When true, warm selfdestruct beneficiary reads skip the warm fee
 * @returns Gas cost for this address access (zero when EIP-2929 is inactive)
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
 *
 * Call after verifying sufficient gas for the access.
 */
export function warmAddress(runState: RunState, address: Uint8Array): void {
  if (!runState.interpreter.journal.isWarmedAddress(address)) {
    runState.interpreter.journal.addWarmedAddress(address)
  }
}

/**
 * Adds an address to the EIP-7928 block access list.
 *
 * Call after verifying sufficient gas for the access.
 */
export function addAddressToBAL(runState: RunState, address: Uint8Array, common: Common): void {
  if (common.isActivatedEIP(7928)) {
    const addressHex = bytesToHex(address)
    runState.interpreter._evm.blockLevelAccessList?.addAddress(addressHex)
  }
}

/**
 * Warms an address and returns its EIP-2929 access cost.
 *
 * Convenience wrapper around {@link getAddressAccessCost} and {@link warmAddress}.
 * For fine-grained control (e.g. EIP-7928 BAL with OOG checks), use those functions directly.
 *
 * @param chargeGas - When false, skips charging but still warms the address
 * @param isSelfdestruct - When true, applies selfdestruct beneficiary read pricing
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
 * Warms a storage slot and returns its EIP-2929 access cost.
 *
 * @param isSstore - When true, warm-only reads during SSTORE may be free under Verkle/binary tree EIPs
 * @param chargeGas - When false, warms without charging
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
 * Lowers SSTORE_RESET_GAS or SLOAD (noop) cost when the storage slot is already warm.
 *
 * @param costName - `'noop'`, `'initRefund'`, or `'cleanRefund'` — selects the EIP-2200 parameter
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
