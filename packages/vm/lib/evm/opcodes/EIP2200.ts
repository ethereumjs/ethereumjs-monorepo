import BN = require('bn.js')
import { RunState } from './../interpreter'
import { ERROR } from '../../exceptions'
import { adjustSstoreGasEIP2929 } from './EIP2929'
import { trap } from './util'

/**
 * Adjusts gas usage and refunds of SStore ops per EIP-2200 (Istanbul)
 *
 * @param {RunState} runState
 * @param {any}      found
 * @param {Buffer}   value
 */
export function updateSstoreGasEIP2200(runState: RunState, found: any, value: Buffer, key: Buffer) {
  if (runState._common.hardfork() === 'constantinople') {
    const original = found.original
    const current = found.current
    if (current.equals(value)) {
      // If current value equals new value (this is a no-op), 200 gas is deducted.
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreNoopGas')))
      return
    }
    // If current value does not equal new value
    if (original.equals(current)) {
      // If original value equals current value (this storage slot has not been changed by the current execution context)
      if (original.length === 0) {
        // If original value is 0, 20000 gas is deducted.
        return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreInitGas')))
      }
      if (value.length === 0) {
        // If new value is 0, add 15000 gas to refund counter.
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      }
      // Otherwise, 5000 gas is deducted.
      return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')))
    }
    // If original value does not equal current value (this storage slot is dirty), 200 gas is deducted. Apply both of the following clauses.
    if (original.length !== 0) {
      // If original value is not 0
      if (current.length === 0) {
        // If current value is 0 (also means that new value is not 0), remove 15000 gas from refund counter. We can prove that refund counter will never go below 0.
        runState.eei.subRefund(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      } else if (value.length === 0) {
        // If new value is 0 (also means that current value is not 0), add 15000 gas to refund counter.
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      }
    }
    if (original.equals(value)) {
      // If original value equals new value (this storage slot is reset)
      if (original.length === 0) {
        // If original value is 0, add 19800 gas to refund counter.
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'netSstoreResetClearRefund'))
        )
      } else {
        // Otherwise, add 4800 gas to refund counter.
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreResetRefund')))
      }
    }
    return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')))
  } else if (runState._common.gteHardfork('istanbul')) {
    const original = found.original
    const current = found.current
    // Fail if not enough gas is left
    if (
      runState.eei.getGasLeft().lten(runState._common.param('gasPrices', 'sstoreSentryGasEIP2200'))
    ) {
      trap(ERROR.OUT_OF_GAS)
    }

    // Noop
    if (current.equals(value)) {
      const sstoreNoopCost = runState._common.param('gasPrices', 'sstoreNoopGasEIP2200')
      return runState.eei.useGas(
        new BN(adjustSstoreGasEIP2929(runState, key, sstoreNoopCost, 'noop'))
      )
    }
    if (original.equals(current)) {
      // Create slot
      if (original.length === 0) {
        return runState.eei.useGas(
          new BN(runState._common.param('gasPrices', 'sstoreInitGasEIP2200'))
        )
      }
      // Delete slot
      if (value.length === 0) {
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200'))
        )
      }
      // Write existing slot
      return runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'sstoreCleanGasEIP2200'))
      )
    }
    if (original.length > 0) {
      if (current.length === 0) {
        // Recreate slot
        runState.eei.subRefund(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200'))
        )
      } else if (value.length === 0) {
        // Delete slot
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200'))
        )
      }
    }
    if (original.equals(value)) {
      if (original.length === 0) {
        // Reset to original non-existent slot
        const sstoreInitRefund = runState._common.param('gasPrices', 'sstoreInitRefundEIP2200')
        runState.eei.refundGas(
          new BN(adjustSstoreGasEIP2929(runState, key, sstoreInitRefund, 'initRefund'))
        )
      } else {
        // Reset to original existing slot
        const sstoreCleanRefund = runState._common.param('gasPrices', 'sstoreCleanRefundEIP2200')
        runState.eei.refundGas(
          new BN(adjustSstoreGasEIP2929(runState, key, sstoreCleanRefund, 'cleanRefund'))
        )
      }
    }
    // Dirty update
    return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreDirtyGasEIP2200')))
  } else {
    const sstoreResetCost = runState._common.param('gasPrices', 'sstoreReset')
    if (value.length === 0 && !found.length) {
      runState.eei.useGas(new BN(adjustSstoreGasEIP2929(runState, key, sstoreResetCost, 'reset')))
    } else if (value.length === 0 && found.length) {
      runState.eei.useGas(new BN(adjustSstoreGasEIP2929(runState, key, sstoreResetCost, 'reset')))
      runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'sstoreRefund')))
    } else if (value.length !== 0 && !found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreSet')))
    } else if (value.length !== 0 && found.length) {
      runState.eei.useGas(new BN(adjustSstoreGasEIP2929(runState, key, sstoreResetCost, 'reset')))
    }
  }
}
