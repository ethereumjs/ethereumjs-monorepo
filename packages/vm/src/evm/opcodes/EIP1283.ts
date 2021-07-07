import { BN } from 'ethereumjs-util'
import { RunState } from './../interpreter'

/**
 * Adjusts gas usage and refunds of SStore ops per EIP-1283 (Constantinople)
 *
 * @param {RunState} runState
 * @param {any}      found
 * @param {Buffer}   value
 */
export function updateSstoreGasEIP1283(runState: RunState, found: any, value: Buffer) {
  const { original, current } = found
  if (current.equals(value)) {
    // If current value equals new value (this is a no-op), 200 gas is deducted.
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'netSstoreNoopGas')),
      'EIP-1283 -> netSstoreNoopGas'
    )
    return
  }
  // If current value does not equal new value
  if (original.equals(current)) {
    // If original value equals current value (this storage slot has not been changed by the current execution context)
    if (original.length === 0) {
      // If original value is 0, 20000 gas is deducted.
      return runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'netSstoreInitGas')),
        'EIP-1283 -> netSstoreInitGas'
      )
    }
    if (value.length === 0) {
      // If new value is 0, add 15000 gas to refund counter.
      runState.eei.refundGas(
        new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')),
        'EIP-1283 -> netSstoreClearRefund'
      )
    }
    // Otherwise, 5000 gas is deducted.
    return runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')),
      'EIP-1283 -> netSstoreCleanGas'
    )
  }
  // If original value does not equal current value (this storage slot is dirty), 200 gas is deducted. Apply both of the following clauses.
  if (original.length !== 0) {
    // If original value is not 0
    if (current.length === 0) {
      // If current value is 0 (also means that new value is not 0), remove 15000 gas from refund counter. We can prove that refund counter will never go below 0.
      runState.eei.subRefund(
        new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')),
        'EIP-1283 -> netSstoreClearRefund'
      )
    } else if (value.length === 0) {
      // If new value is 0 (also means that current value is not 0), add 15000 gas to refund counter.
      runState.eei.refundGas(
        new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')),
        'EIP-1283 -> netSstoreClearRefund'
      )
    }
  }
  if (original.equals(value)) {
    // If original value equals new value (this storage slot is reset)
    if (original.length === 0) {
      // If original value is 0, add 19800 gas to refund counter.
      runState.eei.refundGas(
        new BN(runState._common.param('gasPrices', 'netSstoreResetClearRefund')),
        'EIP-1283 -> netSstoreResetClearRefund'
      )
    } else {
      // Otherwise, add 4800 gas to refund counter.
      runState.eei.refundGas(
        new BN(runState._common.param('gasPrices', 'netSstoreResetRefund')),
        'EIP-1283 -> netSstoreResetRefund'
      )
    }
  }
  return runState.eei.useGas(
    new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')),
    'EIP-1283 -> netSstoreDirtyGas'
  )
}
