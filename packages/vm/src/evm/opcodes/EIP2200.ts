import Common from '@ethereumjs/common'
import { RunState } from './../interpreter'
import { ERROR } from '../../exceptions'
import { adjustSstoreGasEIP2929 } from './EIP2929'
import { trap } from './util'

/**
 * Adjusts gas usage and refunds of SStore ops per EIP-2200 (Istanbul)
 *
 * @param {RunState} runState
 * @param {Buffer}   currentStorage
 * @param {Buffer}   originalStorage
 * @param {Buffer}   value
 * @param {Common}   common
 */
export function updateSstoreGasEIP2200(
  runState: RunState,
  currentStorage: Buffer,
  originalStorage: Buffer,
  value: Buffer,
  key: Buffer,
  common: Common
) {
  // Fail if not enough gas is left
  if (
    runState.eei.getGasLeft() <= (common.param('gasPrices', 'sstoreSentryGasEIP2200') ?? BigInt(0))
  ) {
    trap(ERROR.OUT_OF_GAS)
  }

  // Noop
  if (currentStorage.equals(value)) {
    const sstoreNoopCost = common.param('gasPrices', 'sstoreNoopGasEIP2200') ?? BigInt(0)
    return adjustSstoreGasEIP2929(runState, key, sstoreNoopCost, 'noop', common)
  }
  if (originalStorage.equals(currentStorage)) {
    // Create slot
    if (originalStorage.length === 0) {
      return common.param('gasPrices', 'sstoreInitGasEIP2200') ?? BigInt(0)
    }
    // Delete slot
    if (value.length === 0) {
      runState.eei.refundGas(
        common.param('gasPrices', 'sstoreClearRefundEIP2200') ?? BigInt(0),
        'EIP-2200 -> sstoreClearRefundEIP2200'
      )
    }
    // Write existing slot
    return common.param('gasPrices', 'sstoreCleanGasEIP2200') ?? BigInt(0)
  }
  if (originalStorage.length > 0) {
    if (currentStorage.length === 0) {
      // Recreate slot
      runState.eei.subRefund(
        common.param('gasPrices', 'sstoreClearRefundEIP2200') ?? BigInt(0),
        'EIP-2200 -> sstoreClearRefundEIP2200'
      )
    } else if (value.length === 0) {
      // Delete slot
      runState.eei.refundGas(
        common.param('gasPrices', 'sstoreClearRefundEIP2200') ?? BigInt(0),
        'EIP-2200 -> sstoreClearRefundEIP2200'
      )
    }
  }
  if (originalStorage.equals(value)) {
    if (originalStorage.length === 0) {
      // Reset to original non-existent slot
      const sstoreInitRefund = common.param('gasPrices', 'sstoreInitRefundEIP2200') ?? BigInt(0)
      runState.eei.refundGas(
        adjustSstoreGasEIP2929(runState, key, sstoreInitRefund, 'initRefund', common),
        'EIP-2200 -> initRefund'
      )
    } else {
      // Reset to original existing slot
      const sstoreCleanRefund = common.param('gasPrices', 'sstoreCleanRefundEIP2200') ?? BigInt(0)
      runState.eei.refundGas(
        BigInt(adjustSstoreGasEIP2929(runState, key, sstoreCleanRefund, 'cleanRefund', common)),
        'EIP-2200 -> cleanRefund'
      )
    }
  }
  // Dirty update
  return common.param('gasPrices', 'sstoreDirtyGasEIP2200') ?? BigInt(0)
}
