import BN = require('bn.js')
import { RunState } from './../interpreter'
import { addressToBuffer } from './util'

/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {BN}       address
 */
export function accessAddressEIP2929(runState: RunState, address: BN | Buffer, baseFee?: number) {
  if (!runState._common.eips().includes(2929)) return

  const addressStr = addressToBuffer(address).toString('hex')

  // Cold
  if (!runState.accessedAddresses.has(addressStr)) {
    runState.accessedAddresses.add(addressStr)

    // CREATE, CREATE2 opcodes have the address warmed for free.
    // selfdestruct beneficiary address reads are charged an *additional* cold access
    if (baseFee !== undefined) {
      runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'coldaccountaccess') - baseFee),
      )
    }
    // Warm: (selfdestruct beneficiary address reads are not charged when warm)
  } else if (baseFee !== undefined && baseFee > 0) {
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'warmstorageread') - baseFee))
  }
}

/**
 * Adds (address, key) to accessedStorage tuple set if not already included.
 * Adjusts cost incurred for executing opcode based on whether storage read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {Buffer} key (to storage slot)
 */
export function accessStorageEIP2929(runState: RunState, key: Buffer, isSstore: boolean) {
  if (!runState._common.eips().includes(2929)) return

  const keyStr = key.toString('hex')
  const baseFee = !isSstore ? runState._common.param('gasPrices', 'sload') : 0
  const address = runState.eei.getAddress().toString('hex')
  const keysAtAddress = runState.accessedStorage.get(address)

  // Cold (SLOAD and SSTORE)
  if (!keysAtAddress) {
    runState.accessedStorage.set(address, new Set())
    // @ts-ignore Set Object is possibly 'undefined'
    runState.accessedStorage.get(address).add(keyStr)
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'coldsload') - baseFee))
  } else if (keysAtAddress && !keysAtAddress.has(keyStr)) {
    keysAtAddress.add(keyStr)
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'coldsload') - baseFee))
    // Warm (SLOAD only)
  } else if (!isSstore) {
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'warmstorageread') - baseFee))
  }
}

/**
 * Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
 * location is already warm
 * @param  {RunState} runState
 * @param  {Buffer}   key          storage slot
 * @param  {number}   defaultCost  SSTORE_RESET_GAS / SLOAD
 * @param  {string}   costName     parameter name ('reset' or 'noop')
 * @return {number}                adjusted cost
 */
export function adjustSstoreGasEIP2929(
  runState: RunState,
  key: Buffer,
  defaultCost: number,
  costName: string,
): number {
  if (!runState._common.eips().includes(2929)) return defaultCost

  const keyStr = key.toString('hex')
  const address = runState.eei.getAddress().toString('hex')
  const warmRead = runState._common.param('gasPrices', 'warmstorageread')
  const coldSload = runState._common.param('gasPrices', 'coldsload')

  // @ts-ignore Set Object is possibly 'undefined'
  if (runState.accessedStorage.has(address) && runState.accessedStorage.get(address).has(keyStr)) {
    switch (costName) {
      case 'reset':
        return defaultCost - coldSload
      case 'noop':
        return warmRead
      case 'initRefund':
        return runState._common.param('gasPrices', 'sstoreInitGasEIP2200') - warmRead
      case 'cleanRefund':
        return runState._common.param('gasPrices', 'sstoreReset') - coldSload - warmRead
    }
  }

  return defaultCost
}
