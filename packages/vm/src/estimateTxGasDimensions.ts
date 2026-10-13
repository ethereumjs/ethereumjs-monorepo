import { activeCostPerStateByte } from '@ethereumjs/evm'
import { getCalldataFloorGas, getMinimumGasLimit } from '@ethereumjs/tx'
import { Address, BIGINT_0, bigIntToUnpaddedBytes, generateAddress } from '@ethereumjs/util'

import type { TypedTransaction } from '@ethereumjs/tx'
import type { VM } from './vm.ts'

/**
 * Pre-state first-touch gas estimate for wallets / estimators.
 *
 * Regular gas is `max(intrinsic, calldata floor)` (same as tx validation).
 * State gas is the EIP-8037 new-account charge for a value-bearing call to an
 * empty recipient, or for a create whose target is not already alive. It does
 * **not** simulate execution (SSTORE, inner CREATE, 7702 auth state, …).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export interface TxGasDimensionsEstimate {
  /** Tx-level minimum (`max(intrinsic, floor)`); no state dimension. */
  minimumGasLimit: bigint
  intrinsicRegular: bigint
  floor: bigint
  /**
   * New-account state gas from current pre-state (0 when EIP-8037 is inactive
   * or the touched account is already alive).
   */
  estimatedStateGas: bigint
  /** `minimumGasLimit + estimatedStateGas` — a sendable `gasLimit` for simple transfers/creates. */
  recommendedGasLimit: bigint
}

async function isEmptyOrMissing(vm: VM, address: Address): Promise<boolean> {
  const account = await vm.stateManager.getAccount(address)
  return account === undefined || account.isEmpty()
}

function resolveSender(tx: TypedTransaction, sender?: Address): Address | undefined {
  if (sender !== undefined) {
    return sender
  }
  if (tx.isSigned()) {
    try {
      return tx.getSenderAddress()
    } catch {
      return undefined
    }
  }
  return undefined
}

function isCreateTx(tx: TypedTransaction): boolean {
  try {
    return tx.toCreationAddress()
  } catch {
    return false
  }
}

/**
 * Estimate regular / floor / first-touch state gas for `tx` against `vm` state.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export async function estimateTxGasDimensions(
  vm: VM,
  tx: TypedTransaction,
  opts?: { sender?: Address },
): Promise<TxGasDimensionsEstimate> {
  const sender = resolveSender(tx, opts?.sender)
  const intrinsicRegular = tx.getIntrinsicGas()
  const floor = getCalldataFloorGas(tx, sender)
  const minimumGasLimit = getMinimumGasLimit(tx, sender)

  let estimatedStateGas = BIGINT_0
  if (vm.common.isActivatedEIP(8037)) {
    const newAccountState =
      vm.common.param('stateBytesPerNewAccount') * activeCostPerStateByte(vm.common)

    if (isCreateTx(tx)) {
      if (sender === undefined) {
        estimatedStateGas = newAccountState
      } else {
        const created = new Address(generateAddress(sender.bytes, bigIntToUnpaddedBytes(tx.nonce)))
        if (await isEmptyOrMissing(vm, created)) {
          estimatedStateGas = newAccountState
        }
      }
    } else if (tx.to !== undefined && tx.value > BIGINT_0) {
      if (await isEmptyOrMissing(vm, tx.to)) {
        estimatedStateGas = newAccountState
      }
    }
  }

  return {
    minimumGasLimit,
    intrinsicRegular,
    floor,
    estimatedStateGas,
    recommendedGasLimit: minimumGasLimit + estimatedStateGas,
  }
}
