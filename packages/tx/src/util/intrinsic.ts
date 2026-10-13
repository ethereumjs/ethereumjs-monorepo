import { BIGINT_0, bigIntMax, equalsBytes } from '@ethereumjs/util'

import { Capability } from '../types.ts'

import type { Address } from '@ethereumjs/util'
import type { EIP2930CompatibleTx, EIP7702CompatibleTx, LegacyTxInterface } from '../types.ts'

/**
 * Resolve the tx sender when the caller is not passed in (signed txs only).
 * Unsigned txs return `undefined`; callers then treat the tx as a non-self-transfer.
 */
function resolveSender(tx: LegacyTxInterface, sender?: Address): Address | undefined {
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

function isCreateTx(tx: LegacyTxInterface): boolean {
  try {
    return tx.toCreationAddress()
  } catch {
    // EIP-7702 txs cannot create contracts (`toCreationAddress` throws).
    return false
  }
}

/**
 * EIP-2780 execution-gas extras that sit in intrinsic (and the calldata floor
 * base): recipient cold access and `TX_VALUE_COST` for value-bearing txs.
 * Create txs already pay `txCreationGas` (CREATE_ACCESS) via
 * `tx.getIntrinsicGas()`; this helper adds `TX_VALUE_COST` when `value > 0`.
 *
 * Since glamsterdam-devnet v8, `TX_VALUE_COST` includes the EIP-7708 transfer
 * log — do not add `transferLogCost` separately at the tx level.
 *
 * Self-transfers (`sender === tx.to`) skip the extras. When `sender` cannot
 * be resolved, a call is treated as a non-self-transfer (conservative).
 */
export function getEip2780RecipientRegularGas(tx: LegacyTxInterface, sender?: Address): bigint {
  if (!tx.common.isActivatedEIP(2780)) {
    return BIGINT_0
  }

  if (isCreateTx(tx)) {
    // Contract-creation txs pay CREATE_ACCESS via txCreationGas in getIntrinsicGas /
    // getEip2780FloorBaseGas. TX_VALUE_COST does not apply at the intrinsic phase
    // even when value > 0 (matches execution-specs / go-ethereum intrinsicBaseGasEIP2780).
    return BIGINT_0
  }

  const from = resolveSender(tx, sender)
  if (from !== undefined && tx.to !== undefined && equalsBytes(tx.to.bytes, from.bytes)) {
    return BIGINT_0
  }

  let extra = tx.common.param('txRecipientAccessGas')
  if (tx.value > BIGINT_0) {
    extra += tx.common.param('txValueCost')
  }
  return extra
}

/**
 * Floor / intrinsic base for EIP-7623: `TX_BASE`, plus the decomposed EIP-2780
 * recipient regular gas (`COLD_ACCOUNT_ACCESS` or `CREATE_ACCESS`, and value
 * extras). Does not include calldata, access-list, or auth costs.
 *
 * See execution-specs#3120: the floor is anchored on this base rather than
 * `TX_BASE` alone.
 */
export function getEip2780FloorBaseGas(tx: LegacyTxInterface, sender?: Address): bigint {
  let base = tx.common.param('txGas')
  if (!tx.common.isActivatedEIP(2780)) {
    return base
  }
  if (isCreateTx(tx)) {
    base += tx.common.param('txCreationGas')
  }
  return base + getEip2780RecipientRegularGas(tx, sender)
}

/**
 * EIP-7623 / EIP-7976 / EIP-7981 floor token count.
 *
 * - Pre-7976: 1 token per zero calldata byte, 4 per non-zero.
 * - EIP-7976: 4 tokens per calldata byte (zero and non-zero).
 * - EIP-7981: plus 4 tokens per access-list byte (20 per address + 32 per slot).
 */
export function countCalldataFloorTokens(tx: LegacyTxInterface): bigint {
  let tokens = 0n
  if (tx.common.isActivatedEIP(7976)) {
    tokens = BigInt(tx.data.length) * 4n
  } else {
    for (let i = 0; i < tx.data.length; i++) {
      tokens += tx.data[i] === 0 ? 1n : 4n
    }
  }
  if (tx.common.isActivatedEIP(7981) && tx.supports(Capability.EIP2930AccessLists)) {
    const accessList = (tx as unknown as EIP2930CompatibleTx).accessList
    const totalSlots = accessList.reduce((sum, item) => sum + item[1].length, 0)
    tokens += BigInt((accessList.length * 20 + totalSlots * 32) * 4)
  }
  return tokens
}

/**
 * EIP-7623 calldata floor: `floor_base + totalCostFloorPerToken * tokens`.
 *
 * Under EIP-2780 the floor base is the decomposed regular intrinsic
 * (`TX_BASE` + recipient/value), not `txGas` alone. Pass `sender` when it is
 * already known (e.g. `runTx`) so self-transfers are priced correctly even
 * if the tx is unsigned.
 *
 * Returns `0` when EIP-7623 is not active.
 */
export function getCalldataFloorGas(tx: LegacyTxInterface, sender?: Address): bigint {
  if (!tx.common.isActivatedEIP(7623)) {
    return BIGINT_0
  }
  return (
    getEip2780FloorBaseGas(tx, sender) +
    tx.common.param('totalCostFloorPerToken') * countCalldataFloorTokens(tx)
  )
}

/**
 * Minimum `gasLimit` for the tx to pass {@link TransactionInterface.isValid}:
 * `max(getIntrinsicGas(), getCalldataFloorGas())` when EIP-7623 is active,
 * otherwise intrinsic gas alone.
 *
 * Does not include EIP-8037 first-touch state gas (that depends on pre-state;
 * see `estimateTxGasDimensions()` on `@ethereumjs/vm`).
 */
export function getMinimumGasLimit(tx: LegacyTxInterface, sender?: Address): bigint {
  const intrinsic = tx.getIntrinsicGas()
  if (!tx.common.isActivatedEIP(7623)) {
    return intrinsic
  }
  return bigIntMax(intrinsic, getCalldataFloorGas(tx, sender))
}

/**
 * EIP-8037 / EIP-7702: state-independent per-authorization regular gas.
 * Pre-8037 this is already folded into `getDataGas()` via `perEmptyAccountCost`.
 */
export function getEip7702IntrinsicAuthGas(tx: LegacyTxInterface): bigint {
  if (!tx.common.isActivatedEIP(8037) || !tx.supports(Capability.EIP7702EOACode)) {
    return BIGINT_0
  }
  const authorizationList = (tx as EIP7702CompatibleTx).authorizationList
  return BigInt(authorizationList.length) * tx.common.param('perAuthBaseGas')
}
