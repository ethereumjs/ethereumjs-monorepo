import { Address, BN, keccak256, setLengthRight, setLengthLeft } from 'ethereumjs-util'
import { ERROR, VmError } from './../../exceptions'
import { RunState } from './../interpreter'

const MASK_160 = new BN(1).shln(160).subn(1)

/**
 * Proxy function for ethereumjs-util's setLengthLeft, except it returns a zero
 *
 * length buffer in case the buffer is full of zeros.
 * @param {Buffer} value Buffer which we want to pad
 */
export function setLengthLeftStorage(value: Buffer) {
  if (value.equals(Buffer.alloc(value.length, 0))) {
    // return the empty buffer (the value is zero)
    return Buffer.alloc(0)
  } else {
    return setLengthLeft(value, 32)
  }
}

/**
 * Wraps error message as VMError
 *
 * @param {string} err
 */
export function trap(err: string) {
  // TODO: facilitate extra data along with errors
  throw new VmError(err as ERROR)
}

/**
 * Converts BN address (they're stored like this on the stack) to buffer address
 *
 * @param  {BN}     address
 * @return {Buffer}
 */
function addressToBuffer(address: BN | Buffer) {
  if (Buffer.isBuffer(address)) return address
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}

/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {BN}       address
 */
function accessAddressEIP2929(runState: RunState, address: BN | Buffer, baseFee?: number) {
  if (!runState._common.eips().includes(2929)) return

  const addressStr = addressToBuffer(address).toString('hex')

  // Cold
  if (!runState.accessedAddresses.has(addressStr)) {
    runState.accessedAddresses.add(addressStr)

    // CREATE, CREATE2 opcodes have the address warmed for free.
    if (baseFee) {
      runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'coldaccountaccess') - baseFee),
      )
    }
    // Warm
  } else if (baseFee) {
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
function accessStorageEIP2929(runState: RunState, key: Buffer, isSstore: boolean) {
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
function adjustSstoreGasEIP2929(
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

/**
 * Error message helper - generates location string
 *
 * @param  {RunState} runState
 * @return {string}
 */
export function describeLocation(runState: RunState): string {
  const hash = keccak256(runState.eei.getCode()).toString('hex')
  const address = runState.eei.getAddress().buf.toString('hex')
  const pc = runState.programCounter - 1
  return `${hash}/${address}:${pc}`
}

/**
 * Find Ceil(a / b)
 *
 * @param {BN} a
 * @param {BN} b
 * @return {BN}
 */
export function divCeil(a: BN, b: BN): BN {
  const div = a.div(b)
  const mod = a.mod(b)

  // Fast case - exact division
  if (mod.isZero()) return div

  // Round up
  return div.isNeg() ? div.isubn(1) : div.iaddn(1)
}

/**
 * Calls relevant stateManager.getContractStorage method based on hardfork
 *
 * @param {RunState} runState [description]
 * @param {Buffer}   address  [description]
 * @param {Buffer}   key      [description]
 * @return {Promise<Buffer>}
 */
export async function getContractStorage(
  runState: RunState,
  address: Address,
  key: Buffer
): Promise<any> {
  const current = setLengthLeftStorage(await runState.stateManager.getContractStorage(address, key))
  if (
    runState._common.hardfork() === 'constantinople' ||
    runState._common.gteHardfork('istanbul')
  ) {
    const original = setLengthLeftStorage(
      await runState.stateManager.getOriginalContractStorage(address, key)
    )
    return { current, original }
  } else {
    return current
  }
}

/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 *
 * @param {BN} offset
 * @param {BN} length
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function getDataSlice(data: Buffer, offset: BN, length: BN): Buffer {
  const len = new BN(data.length)
  if (offset.gt(len)) {
    offset = len
  }

  let end = offset.add(length)
  if (end.gt(len)) {
    end = len
  }

  data = data.slice(offset.toNumber(), end.toNumber())
  // Right-pad with zeros to fill dataLength bytes
  data = setLengthRight(data, length.toNumber())

  return data
}

/**
 * Get full opcode name from its name and code.
 *
 * @param code {number} Integer code of opcode.
 * @param name {string} Short name of the opcode.
 * @returns {string} Full opcode name
 */
export function getFullname(code: number, name: string): string {
  switch (name) {
    case 'LOG':
      name += code - 0xa0
      break
    case 'PUSH':
      name += code - 0x5f
      break
    case 'DUP':
      name += code - 0x7f
      break
    case 'SWAP':
      name += code - 0x8f
      break
  }
  return name
}

/**
 * Checks if a jump is valid given a destination
 *
 * @param  {RunState} runState
 * @param  {number}   dest
 * @return {boolean}
 */
export function jumpIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps.indexOf(dest) !== -1
}

/**
 * Checks if a jumpsub is valid given a destination
 *
 * @param  {RunState} runState
 * @param  {number}   dest
 * @return {boolean}
 */
export function jumpSubIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumpSubs.indexOf(dest) !== -1
}

/**
 * Returns an overflow-safe slice of an array. It right-pads
 *
 * the data with zeros to `length`.
 * @param {BN} gasLimit - requested gas Limit
 * @param {BN} gasLeft - current gas left
 * @param {RunState} runState - the current runState
 */
export function maxCallGas(gasLimit: BN, gasLeft: BN, runState: RunState): BN {
  const isTangerineWhistleOrLater = runState._common.gteHardfork('tangerineWhistle')
  if (isTangerineWhistleOrLater) {
    const gasAllowed = gasLeft.sub(gasLeft.divn(64))
    return gasLimit.gt(gasAllowed) ? gasAllowed : gasLimit
  } else {
    return gasLimit
  }
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 *
 * @method subMemUsage
 * @param {Object} runState
 * @param {BN} offset
 * @param {BN} length
 */
export function subMemUsage(runState: RunState, offset: BN, length: BN) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return

  const newMemoryWordCount = divCeil(offset.add(length), new BN(32))
  if (newMemoryWordCount.lte(runState.memoryWordCount)) return

  const words = newMemoryWordCount
  const fee = new BN(runState._common.param('gasPrices', 'memory'))
  const quadCoeff = new BN(runState._common.param('gasPrices', 'quadCoeffDiv'))
  // words * 3 + words ^2 / 512
  const cost = words.mul(fee).add(words.mul(words).div(quadCoeff))

  if (cost.gt(runState.highestMemCost)) {
    runState.eei.useGas(cost.sub(runState.highestMemCost))
    runState.highestMemCost = cost
  }

  runState.memoryWordCount = newMemoryWordCount
}

/**
 * Adjusts gas usage and refunds of SStore ops per EIP-2200
 *
 * @param {RunState} runState
 * @param {any}      found
 * @param {Buffer}   value
 */
function updateSstoreGas(runState: RunState, found: any, value: Buffer, key: Buffer) {
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
    // EIP-2200
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
        new BN(adjustSstoreGasEIP2929(runState, key, sstoreNoopCost, 'noop')),
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
          new BN(adjustSstoreGasEIP2929(runState, key, sstoreInitRefund, 'initRefund')),
        )
      } else {
        // Reset to original existing slot
        const sstoreCleanRefund = runState._common.param('gasPrices', 'sstoreCleanRefundEIP2200')
        runState.eei.refundGas(
          new BN(adjustSstoreGasEIP2929(runState, key, sstoreCleanRefund, 'cleanRefund')),
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
      /* eslint-disable-next-line sonarjs/no-duplicated-branches */
    } else if (value.length !== 0 && found.length) {
      runState.eei.useGas(new BN(adjustSstoreGasEIP2929(runState, key, sstoreResetCost, 'reset')))
    }
  }
}

/**
 * Writes data returned by eei.call* methods to memory
 *
 * @param {RunState} runState
 * @param {BN}       outOffset
 * @param {BN}       outLength
 */
export function writeCallOutput(runState: RunState, outOffset: BN, outLength: BN) {
  const returnData = runState.eei.getReturnData()
  if (returnData.length > 0) {
    const memOffset = outOffset.toNumber()
    let dataLength = outLength.toNumber()
    if (returnData.length < dataLength) {
      dataLength = returnData.length
    }
    const data = getDataSlice(returnData, new BN(0), new BN(dataLength))
    runState.memory.extend(memOffset, dataLength)
    runState.memory.write(memOffset, dataLength, data)
  }
}
