import Common from '@ethereumjs/common'
import { Address, BN } from 'ethereumjs-util'
import { EIP2929StateManager } from '../../state/interface'
import { RunState } from './../interpreter'

/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {BN}       address
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
) {
  if (!common.isActivatedEIP(2929)) return

  const addressStr = address.buf

  // Cold
  if (!(<EIP2929StateManager>runState.stateManager).isWarmedAddress(addressStr)) {
    // eslint-disable-next-line prettier/prettier
    (<EIP2929StateManager>runState.stateManager).addWarmedAddress(addressStr)

    // CREATE, CREATE2 opcodes have the address warmed for free.
    // selfdestruct beneficiary address reads are charged an *additional* cold access
    if (chargeGas) {
      runState.eei.useGas(
        new BN(common.param('gasPrices', 'coldaccountaccess')),
        'EIP-2929 -> coldaccountaccess'
      )
    }
    // Warm: (selfdestruct beneficiary address reads are not charged when warm)
  } else if (chargeGas && !isSelfdestruct) {
    runState.eei.useGas(
      new BN(common.param('gasPrices', 'warmstorageread')),
      'EIP-2929 -> warmstorageread'
    )
  }
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
) {
  if (!common.isActivatedEIP(2929)) return

  const address = runState.eei.getAddress().buf

  const slotIsCold = !(<EIP2929StateManager>runState.stateManager).isWarmedStorage(address, key)

  // Cold (SLOAD and SSTORE)
  if (slotIsCold) {
    // eslint-disable-next-line prettier/prettier
    (<EIP2929StateManager>runState.stateManager).addWarmedStorage(address, key)
    runState.eei.useGas(new BN(common.param('gasPrices', 'coldsload')), 'EIP-2929 -> coldsload')
  } else if (!isSstore) {
    runState.eei.useGas(
      new BN(common.param('gasPrices', 'warmstorageread')),
      'EIP-2929 -> warmstorageread'
    )
  }
}

/**
 * Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
 * location is already warm
 * @param  {RunState} runState
 * @param  {Buffer}   key          storage slot
 * @param  {number}   defaultCost  SSTORE_RESET_GAS / SLOAD
 * @param  {string}   costName     parameter name ('reset' or 'noop')
 * @param  {Common}   common
 * @return {number}                adjusted cost
 */
export function adjustSstoreGasEIP2929(
  runState: RunState,
  key: Buffer,
  defaultCost: number,
  costName: string,
  common: Common
): number {
  if (!common.isActivatedEIP(2929)) return defaultCost

  const address = runState.eei.getAddress().buf
  const warmRead = common.param('gasPrices', 'warmstorageread')
  const coldSload = common.param('gasPrices', 'coldsload')

  if ((<EIP2929StateManager>runState.stateManager).isWarmedStorage(address, key)) {
    switch (costName) {
      case 'reset':
        return defaultCost - coldSload
      case 'noop':
        return warmRead
      case 'initRefund':
        return common.param('gasPrices', 'sstoreInitGasEIP2200') - warmRead
      case 'cleanRefund':
        return common.param('gasPrices', 'sstoreReset') - coldSload - warmRead
    }
  }

  return defaultCost
}
