import { Hardfork } from '@ethereumjs/common'
import { BIGINT_0, BIGINT_31, BIGINT_32 } from '@ethereumjs/util'

import { activeCostPerStateByte } from '../eip8037.ts'
import { EVMError } from '../errors.ts'

import {
  accessAddressEIP2929,
  addAddressToBAL,
  getAddressAccessCost,
  warmAddress,
} from './EIP2929.ts'
import { maxCallGas, subMemUsage, trap, writeCallOutput } from './util.ts'

import type { Common } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import type { RunState } from '../interpreter.ts'

/** Set by the gas handler; consumed in {@link Interpreter.runStep} after gas is charged. */
export type Eip7928PostTargetCallOog = {
  outOffset: bigint
  outLength: bigint
}

/** True when `regularGas + stateGas` fits in `gas_left + state_gas_reservoir` (EIP-8037). */
export function canAfford(runState: RunState, regularGas: bigint, stateGas = BIGINT_0): boolean {
  const gasLeft = runState.interpreter.getGasLeft()
  const reservoir = runState.interpreter._evm.stateGasReservoir
  return regularGas + stateGas <= gasLeft + reservoir
}

export function newAccountStateGasCost(common: Common, runState: RunState): bigint {
  if (!common.isActivatedEIP(8037)) {
    return BIGINT_0
  }
  const stateBytesPerNewAccount = common.param('stateBytesPerNewAccount')
  const blockGasLimit = runState.env.block.header.gasLimit
  const costPerStateByte = activeCostPerStateByte(common, blockGasLimit)
  return stateBytesPerNewAccount * costPerStateByte
}

/** Pre-target OOG: trap before any target access / BAL entry. */
export function eip7928TrapPreTarget(runState: RunState, common: Common, gas: bigint): void {
  if (common.isActivatedEIP(7928) && gas > runState.interpreter.getGasLeft()) {
    trap(EVMError.errorMessages.OUT_OF_GAS)
  }
}

/** Post-target CALL OOG: burn remaining frame gas and exceptional-halt in runStep. */
export function eip7928SchedulePostTargetCallOog(
  runState: RunState,
  outOffset: bigint,
  outLength: bigint,
): bigint {
  runState.eip7928PostTargetCallOog = { outOffset, outLength }
  runState.interpreter._evm.eip7928CallPostTargetOog = true
  return runState.interpreter.getGasLeft()
}

/** Post-target CREATE OOG: charge accrued gas only; opcode pushes 0. */
export function eip7928PostTargetCreateOog(
  runState: RunState,
  common: Common,
  gas: bigint,
): bigint {
  if (!common.isActivatedEIP(7928)) {
    trap(EVMError.errorMessages.OUT_OF_GAS)
  }
  runState.messageGasLimit = BIGINT_0
  runState.eip7928PostTargetCreateOog = true
  return gas
}

/** Post-target CALL OOG when 7928 is off (legacy: trap in gas handler). */
function postTargetCallOogOrTrap(
  runState: RunState,
  common: Common,
  outOffset: bigint,
  outLength: bigint,
): bigint {
  if (!common.isActivatedEIP(7928)) {
    trap(EVMError.errorMessages.OUT_OF_GAS)
  }
  return eip7928SchedulePostTargetCallOog(runState, outOffset, outLength)
}

export function consumeEip7928PostTargetCallOog(runState: RunState): void {
  const pending = runState.eip7928PostTargetCallOog
  if (pending === undefined) {
    return
  }
  runState.eip7928PostTargetCallOog = undefined
  writeCallOutput(runState, pending.outOffset, pending.outLength)
  trap(EVMError.errorMessages.OUT_OF_GAS)
}

export async function getCallNewAccountPostCosts(
  runState: RunState,
  common: Common,
  toAddress: Address,
): Promise<{ regular: bigint; state: bigint; createsNewAccount: boolean }> {
  let createsNewAccount = false
  if (common.gteHardfork(Hardfork.SpuriousDragon)) {
    const account = await runState.stateManager.getAccount(toAddress)
    if (account === undefined || account.isEmpty()) {
      createsNewAccount = true
    }
  } else if ((await runState.stateManager.getAccount(toAddress)) === undefined) {
    createsNewAccount = true
  }
  if (!createsNewAccount) {
    return { regular: BIGINT_0, state: BIGINT_0, createsNewAccount: false }
  }
  return {
    regular: common.param('callNewAccountGas'),
    state: newAccountStateGasCost(common, runState),
    createsNewAccount: true,
  }
}

function commitTargetAccess(runState: RunState, toAddress: Address, common: Common): void {
  if (common.isActivatedEIP(2929)) {
    warmAddress(runState, toAddress.bytes)
  }
  addAddressToBAL(runState, toAddress.bytes, common)
}

function finalizeCallMessageGas(
  runState: RunState,
  common: Common,
  gas: bigint,
  currentGasLimit: bigint,
  newAccountStateGas: bigint,
  outOffset: bigint,
  outLength: bigint,
): bigint {
  const gasLimit = maxCallGas(
    currentGasLimit,
    runState.interpreter.getGasLeft() - gas,
    runState,
    common,
  )

  if (common.isActivatedEIP(7928)) {
    if (!canAfford(runState, gas, newAccountStateGas)) {
      return eip7928SchedulePostTargetCallOog(runState, outOffset, outLength)
    }
  }

  if (gasLimit > runState.interpreter.getGasLeft() - gas) {
    return postTargetCallOogOrTrap(runState, common, outOffset, outLength)
  }

  if (gas > runState.interpreter.getGasLeft()) {
    return postTargetCallOogOrTrap(runState, common, outOffset, outLength)
  }

  // EIP-8037: pre-charge the new-account state-gas BEFORE the inner call
  // runs. This matches the EELS amsterdam (tests-bal) reference, where
  // `charge_state_gas(STATE_BYTES_PER_NEW_ACCOUNT * COST_PER_STATE_BYTE)`
  // happens in the CALL opcode body before the sub-frame is processed and
  // before the insufficient-balance check. The charge is unconditional
  // (per spec it sticks even when the sub-call later fails for insufficient
  // balance or reverts), so we charge here rather than after frame exit.
  // The post-frame charge in evm.ts is skipped under EIP-8037 to avoid
  // double-counting (see `_executeCall` post-execution block).
  if (common.isActivatedEIP(8037) && newAccountStateGas > BIGINT_0) {
    runState.interpreter.chargeStateGas(newAccountStateGas, 'CALL pre-charge new_account')
  }

  runState.messageGasLimit = gasLimit
  return gas
}

export type CallFamilyGasOpts = {
  currentGasLimit: bigint
  toAddress: Address
  value: bigint
  inOffset: bigint
  inLength: bigint
  outOffset: bigint
  outLength: bigint
  includeValueTransfer: boolean
  includeNewAccountPostCheck: boolean
  eip7702GetAccessCost: (
    runState: RunState,
    common: Common,
    address: Address,
    charge2929Gas: boolean,
  ) => Promise<{ gas: bigint; delegationAddress: Uint8Array | null }>
  eip7702WarmAddress: (runState: RunState, delegationAddress: Uint8Array) => void
}

/**
 * Shared EIP-2929 / EIP-7928 / EIP-8037 gas path for CALL, CALLCODE, DELEGATECALL, STATICCALL.
 */
export async function callFamilyGas(
  runState: RunState,
  gas: bigint,
  common: Common,
  opts: CallFamilyGasOpts,
): Promise<bigint> {
  const {
    currentGasLimit,
    toAddress,
    value,
    inOffset,
    inLength,
    outOffset,
    outLength,
    includeValueTransfer,
    includeNewAccountPostCheck,
    eip7702GetAccessCost,
    eip7702WarmAddress,
  } = opts

  gas += subMemUsage(runState, inOffset, inLength, common)
  gas += subMemUsage(runState, outOffset, outLength, common)
  eip7928TrapPreTarget(runState, common, gas)

  let charge2929Gas = true
  if (
    (common.isActivatedEIP(6800) || common.isActivatedEIP(7864)) &&
    runState.interpreter._evm.getPrecompile(toAddress) === undefined
  ) {
    const coldAccessGas = runState.env.accessWitness!.readAccountBasicData(toAddress)
    if (includeValueTransfer && value !== BIGINT_0) {
      const contractAddress = runState.interpreter.getAddress()
      gas += runState.env.accessWitness!.writeAccountBasicData(contractAddress)
      gas += runState.env.accessWitness!.writeAccountBasicData(toAddress)
    }
    gas += coldAccessGas
    charge2929Gas = coldAccessGas === BIGINT_0
  }

  if (common.isActivatedEIP(2929)) {
    gas += getAddressAccessCost(runState, toAddress.bytes, common, charge2929Gas)
  }

  let valueTransferGas = BIGINT_0
  if (
    includeValueTransfer &&
    value !== BIGINT_0 &&
    !common.isActivatedEIP(6800) &&
    !common.isActivatedEIP(7864)
  ) {
    valueTransferGas = common.param('callValueTransferGas')
  }

  eip7928TrapPreTarget(runState, common, gas + valueTransferGas)
  commitTargetAccess(runState, toAddress, common)
  gas += valueTransferGas

  let newAccountStateGas = BIGINT_0
  // SpuriousDragon+ charges the new-account fee only on value transfers, but
  // pre-SpuriousDragon charges it for any call to a non-existent account.
  if (
    includeNewAccountPostCheck &&
    (value !== BIGINT_0 || !common.gteHardfork(Hardfork.SpuriousDragon))
  ) {
    const { regular, state } = await getCallNewAccountPostCosts(runState, common, toAddress)
    gas += regular
    newAccountStateGas = state
  }

  if (common.isActivatedEIP(7702)) {
    const { gas: delegationGas, delegationAddress } = await eip7702GetAccessCost(
      runState,
      common,
      toAddress,
      charge2929Gas,
    )
    gas += delegationGas
    if (delegationAddress !== null) {
      if (common.isActivatedEIP(7928)) {
        if (gas > runState.interpreter.getGasLeft()) {
          return postTargetCallOogOrTrap(runState, common, outOffset, outLength)
        }
        eip7702WarmAddress(runState, delegationAddress)
        addAddressToBAL(runState, delegationAddress, common)
      } else {
        eip7702WarmAddress(runState, delegationAddress)
      }
    }
  }

  return finalizeCallMessageGas(
    runState,
    common,
    gas,
    currentGasLimit,
    newAccountStateGas,
    outOffset,
    outLength,
  )
}

export type Create7928GasOpts = {
  offset: bigint
  length: bigint
  salt?: Uint8Array
  /** Extra pre-initcode gas (CREATE2 keccak). */
  extraPreTargetGas?: bigint
  preChargeLabel: string
}

/**
 * Shared EIP-7928 / EIP-8037 gas path for CREATE and CREATE2.
 */
export async function create7928Gas(
  runState: RunState,
  gas: bigint,
  common: Common,
  opts: Create7928GasOpts,
  getCreateTargetAddressBytes: (
    runState: RunState,
    initCode: Uint8Array,
    salt?: Uint8Array,
  ) => Promise<Uint8Array>,
): Promise<bigint> {
  const { offset, length, salt, extraPreTargetGas = BIGINT_0, preChargeLabel } = opts

  // EIP-3860: reject oversized initcode BEFORE any state-gas pre-charge so
  // that EIP-8037's reservoir is preserved when the size check fails. This
  // matches the EELS amsterdam (tests-bal) reference, which raises
  // OutOfGasError from `generic_create` ahead of `charge_state_gas`. Without
  // this, the new-account state-gas pre-charge runs first and is hard to
  // unwind cleanly at the tx-root frame (depth=0): the frame-revert handler
  // refunds the spilled slice to a parent reservoir that doesn't exist, and
  // the user is overcharged by `STATE_BYTES_PER_NEW_ACCOUNT * costPerStateByte`.
  if (
    common.isActivatedEIP(3860) &&
    length > Number(common.param('maxInitCodeSize')) &&
    !runState.interpreter._evm.allowUnlimitedInitCodeSize
  ) {
    trap(EVMError.errorMessages.INITCODE_SIZE_VIOLATION)
  }

  gas += subMemUsage(runState, offset, length, common)
  if (common.isActivatedEIP(3860)) {
    gas += ((length + BIGINT_31) / BIGINT_32) * common.param('initCodeWordGas')
  }
  gas += extraPreTargetGas
  eip7928TrapPreTarget(runState, common, gas)

  let initCode = new Uint8Array(0)
  if (length !== BIGINT_0) {
    initCode = runState.memory.read(Number(offset), Number(length), true)
  }
  const targetAddress = await getCreateTargetAddressBytes(runState, initCode, salt)

  const newAccountStateGas = newAccountStateGasCost(common, runState)
  if (common.isActivatedEIP(8037)) {
    if (!canAfford(runState, gas, newAccountStateGas)) {
      trap(EVMError.errorMessages.OUT_OF_GAS)
    }
  }

  if (common.isActivatedEIP(2929)) {
    warmAddress(runState, targetAddress)
  }

  if (common.isActivatedEIP(2929)) {
    gas += accessAddressEIP2929(runState, runState.interpreter.getAddress().bytes, common, false)
  }

  if (common.isActivatedEIP(8037)) {
    if (!canAfford(runState, gas, newAccountStateGas)) {
      addAddressToBAL(runState, targetAddress, common)
      return eip7928PostTargetCreateOog(runState, common, gas)
    }
    if (gas > runState.interpreter.getGasLeft()) {
      addAddressToBAL(runState, targetAddress, common)
      return eip7928PostTargetCreateOog(runState, common, gas)
    }
    if (gas > BIGINT_0) {
      runState.interpreter.useGas(gas, preChargeLabel)
      gas = BIGINT_0
    }
    runState.interpreter.chargeStateGas(newAccountStateGas, `${preChargeLabel} new_account`)
  } else if (gas > runState.interpreter.getGasLeft()) {
    addAddressToBAL(runState, targetAddress, common)
    return eip7928PostTargetCreateOog(runState, common, gas)
  }

  // EIP-8037 / EIP-7928: the static-context check is performed AFTER the
  // new-account state-gas pre-charge above. This mirrors the EELS amsterdam
  // (tests-bal) reference, where `generic_create` charges the state gas before
  // the WriteInStaticContext check. When the CREATE/CREATE2 occurs in a static
  // frame, the frame halts exceptionally; the per-frame state-gas snapshot
  // restore (evm.ts) then refills the pre-charged `STATE_BYTES_PER_NEW_ACCOUNT *
  // CPSB` to the parent's `state_gas_reservoir`, reducing the transaction's
  // `tx_gas_used` (cumulative receipt gas) by that amount.
  if (runState.interpreter.isStatic()) {
    trap(EVMError.errorMessages.STATIC_STATE_CHANGE)
  }

  let gasLimit = BigInt(runState.interpreter.getGasLeft()) - gas
  gasLimit = maxCallGas(gasLimit, gasLimit, runState, common)

  if (gas > runState.interpreter.getGasLeft()) {
    addAddressToBAL(runState, targetAddress, common)
    return eip7928PostTargetCreateOog(runState, common, gas)
  }

  runState.messageGasLimit = gasLimit
  return gas
}
