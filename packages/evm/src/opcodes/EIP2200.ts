import { equalsBytes } from '@ethereumjs/util'

import { EVMError } from '../errors.ts'

import { adjustSstoreGasEIP2929 } from './EIP2929.ts'
import { trap } from './util.ts'

import type { Common } from '@ethereumjs/common'
import type { RunState } from '../interpreter.ts'

/**
 * SSTORE gas per the Amsterdam gas schedule (EIP-8038, experimental):
 * - access cost (cold or warm) is always charged
 * - a flat `storageWriteGas` is charged on the first change to the slot in
 *   the transaction, refunded if the slot is restored to its original value
 * - clearing an originally non-zero slot refunds `refundStorageClearGas`
 *   (reversed if the slot is later recreated)
 * The EIP-8037 state-gas portion for newly set slots is metered separately
 * in the SSTORE opcode handler.
 *
 * Returns the regular gas cost (including the access cost) and warms the
 * storage slot.
 */
export function updateSstoreGasEIP8038(
  runState: RunState,
  currentStorage: Uint8Array,
  originalStorage: Uint8Array,
  value: Uint8Array,
  key: Uint8Array,
  common: Common,
): bigint {
  // EIP-2200 sentry: fail if not enough gas is left to guarantee the stipend
  if (runState.interpreter.getGasLeft() <= common.param('sstoreSentryEIP2200Gas')) {
    trap(EVMError.errorMessages.OUT_OF_GAS)
  }

  const address = runState.interpreter.getAddress().bytes
  const slotIsCold = !runState.interpreter.journal.isWarmedStorage(address, key)

  // Access cost: cold or warm, always charged.
  let gas: bigint
  if (slotIsCold) {
    runState.interpreter.journal.addWarmedStorage(address, key)
    gas = common.param('coldsloadGas')
  } else {
    gas = common.param('warmstoragereadGas')
  }

  const currentEqualsNew = equalsBytes(currentStorage, value)
  const originalEqualsCurrent = equalsBytes(originalStorage, currentStorage)
  const originalEqualsNew = equalsBytes(originalStorage, value)

  // Write cost: charged on the first change to the slot this transaction.
  if (originalEqualsCurrent && !currentEqualsNew) {
    gas += common.param('storageWriteGas')
  }

  if (!currentEqualsNew) {
    if (originalStorage.length > 0 && currentStorage.length > 0 && value.length === 0) {
      // Storage is cleared for the first time in the transaction
      runState.interpreter.refundGas(
        common.param('refundStorageClearGas'),
        'EIP-8038 -> refundStorageClear',
      )
    }
    if (originalStorage.length > 0 && currentStorage.length === 0) {
      // Gas refund issued earlier to be reversed
      runState.interpreter.subRefund(
        common.param('refundStorageClearGas'),
        'EIP-8038 -> refundStorageClear (reversed)',
      )
    }
    if (originalEqualsNew) {
      // Slot restored to its original value: refund the storageWriteGas
      // charged on the first-time change earlier this transaction.
      runState.interpreter.refundGas(
        common.param('storageWriteGas'),
        'EIP-8038 -> storageWrite restore refund',
      )
    }
  }

  return gas
}

/**
 * Adjusts gas usage and refunds of SStore ops per EIP-2200 (Istanbul)
 *
 * @param {RunState} runState
 * @param {Uint8Array}   currentStorage
 * @param {Uint8Array}   originalStorage
 * @param {Uint8Array}   value
 * @param {Common}   common
 */
export function updateSstoreGasEIP2200(
  runState: RunState,
  currentStorage: Uint8Array,
  originalStorage: Uint8Array,
  value: Uint8Array,
  key: Uint8Array,
  common: Common,
) {
  // Fail if not enough gas is left
  if (runState.interpreter.getGasLeft() <= common.param('sstoreSentryEIP2200Gas')) {
    trap(EVMError.errorMessages.OUT_OF_GAS)
  }

  // Noop
  if (equalsBytes(currentStorage, value)) {
    const sstoreNoopCost = common.param('sstoreNoopEIP2200Gas')
    return adjustSstoreGasEIP2929(runState, key, sstoreNoopCost, 'noop', common)
  }
  if (equalsBytes(originalStorage, currentStorage)) {
    // Create slot
    if (originalStorage.length === 0) {
      return common.param('sstoreInitEIP2200Gas')
    }
    // Delete slot
    if (value.length === 0) {
      runState.interpreter.refundGas(
        common.param('sstoreClearRefundEIP2200Gas'),
        'EIP-2200 -> sstoreClearRefundEIP2200',
      )
    }
    // Write existing slot
    return common.param('sstoreCleanEIP2200Gas')
  }
  if (originalStorage.length > 0) {
    if (currentStorage.length === 0) {
      // Recreate slot
      runState.interpreter.subRefund(
        common.param('sstoreClearRefundEIP2200Gas'),
        'EIP-2200 -> sstoreClearRefundEIP2200',
      )
    } else if (value.length === 0) {
      // Delete slot
      runState.interpreter.refundGas(
        common.param('sstoreClearRefundEIP2200Gas'),
        'EIP-2200 -> sstoreClearRefundEIP2200',
      )
    }
  }
  if (equalsBytes(originalStorage, value)) {
    if (originalStorage.length === 0) {
      // Reset to original non-existent slot
      const sstoreInitRefund = common.param('sstoreInitRefundEIP2200Gas')
      runState.interpreter.refundGas(
        adjustSstoreGasEIP2929(runState, key, sstoreInitRefund, 'initRefund', common),
        'EIP-2200 -> initRefund',
      )
    } else {
      // Reset to original existing slot
      const sstoreCleanRefund = common.param('sstoreCleanRefundEIP2200Gas')
      runState.interpreter.refundGas(
        BigInt(adjustSstoreGasEIP2929(runState, key, sstoreCleanRefund, 'cleanRefund', common)),
        'EIP-2200 -> cleanRefund',
      )
    }
  }
  // Dirty update
  return common.param('sstoreDirtyEIP2200Gas')
}
