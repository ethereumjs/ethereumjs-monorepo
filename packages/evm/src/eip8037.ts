import { BIGINT_0 } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'

/**
 * Returns the active EIP-8037 cost per state byte from {@link @ethereumjs/common!Common}.
 *
 * Under v7 fixtures this is the flat `costPerStateByte` parameter; the
 * optional block gas limit is reserved for a future derived formula.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function activeCostPerStateByte(common: Common, _blockGasLimit?: bigint): bigint {
  return common.param('costPerStateByte')
}

/**
 * Minimal transaction surface for EIP-8037 intrinsic-gas splitting (avoids a `@ethereumjs/tx` cycle).
 */
interface IntrinsicDimensionsTx {
  type: number
  common: Common
  value: bigint
  /** Present for calls; omitted for contract creation. */
  to?: { bytes: Uint8Array }
  getIntrinsicGas(): bigint
  toCreationAddress(): boolean
  /** Set on EIP-7702 (type 4) transactions with an authorization list. */
  authorizationList?: unknown[]
}

/**
 * EIP-8037 intrinsic-gas decomposition.
 *
 * Under glamsterdam-devnet v7+, intrinsic gas is entirely **regular**
 * (EIP-2780 state-independent). New-account and 7702 auth/write state gas
 * are charged at top-frame access, so this returns
 * `{ intrinsicRegular: tx.getIntrinsicGas(), intrinsicState: 0n }` whether
 * EIP-8037 is active or not.
 *
 * Block inclusion does **not** subtract this split from `tx.gas`. Use
 * {@link txExceedsAvailableBlockGas8037} (`min(TX_MAX, tx.gas)` vs remaining
 * regular, `tx.gas` vs remaining state). Reservoir sizing in `runTx()` uses
 * `intrinsicRegular`:
 *
 *   execution_gas = tx.gas - intrinsic
 *   gas_left      = min(TX_MAX - intrinsicRegular, execution_gas)
 *   reservoir     = execution_gas - gas_left
 *
 * @param blockGasLimit Reserved for a future derived `costPerStateByte`; unused under v7.
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function computeIntrinsicGasDimensions8037(
  common: Common,
  tx: IntrinsicDimensionsTx,
  blockGasLimit?: bigint,
  _sender?: { bytes: Uint8Array },
): { intrinsicRegular: bigint; intrinsicState: bigint } {
  const intrinsicRegular0 = tx.getIntrinsicGas()
  if (!common.isActivatedEIP(8037)) {
    return { intrinsicRegular: intrinsicRegular0, intrinsicState: BIGINT_0 }
  }

  // 7702 perAuthBaseGas is already in getIntrinsicGas() under 8037.
  // ACCOUNT_WRITE and per-auth state gas are charged at access (runTx
  // processAuthorizationList), keyed on pre-state — not here.
  return { intrinsicRegular: intrinsicRegular0, intrinsicState: BIGINT_0 }
}

/**
 * EIP-8037 per-tx block inclusion check (v7+).
 *
 * Rejects when `min(TX_MAX, tx.gas) > regular_available` or
 * `tx.gas > state_available`, where
 * `*_available = block.gas_limit - block_*_gas_used`.
 *
 * `TX_MAX` caps only the regular bound; the state check uses uncapped `tx.gas`.
 *
 * @returns `true` when either dimension would exceed the block's remaining gas.
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function txExceedsAvailableBlockGas8037(
  txGasLimit: bigint,
  txMaxGasLimit: bigint,
  blockGasLimit: bigint,
  blockRegularGasUsed: bigint,
  blockStateGasUsed: bigint,
): boolean {
  const regularAvailable =
    blockGasLimit > blockRegularGasUsed ? blockGasLimit - blockRegularGasUsed : BIGINT_0
  const stateAvailable =
    blockGasLimit > blockStateGasUsed ? blockGasLimit - blockStateGasUsed : BIGINT_0
  const txRegularBound = txGasLimit < txMaxGasLimit ? txGasLimit : txMaxGasLimit
  return txRegularBound > regularAvailable || txGasLimit > stateAvailable
}
