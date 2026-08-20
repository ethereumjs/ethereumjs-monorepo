import { BIGINT_0 } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'

/**
 * EIP-8037 cost-per-state-byte. Under the v7 fixtures the value is a flat
 * constant (sourced from the `costPerStateByte` common parameter) rather than
 * the earlier draft's block-gas-limit-derived value. The helper is kept so
 * callers do not need to know whether the value is constant or derived; a
 * future spec revision could re-introduce a derivation here.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function activeCostPerStateByte(common: Common, _blockGasLimit?: bigint): bigint {
  return common.param('costPerStateByte')
}

/**
 * Minimal shape of a tx needed to split intrinsic gas into the EIP-8037
 * regular/state dimensions. Avoids a `@ethereumjs/tx` import cycle here.
 */
interface IntrinsicDimensionsTx {
  type: number
  common: Common
  value: bigint
  to?: { bytes: Uint8Array }
  getIntrinsicGas(): bigint
  toCreationAddress(): boolean
  // EIP-7702 (type 4) txs expose an authorization list.
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
 * regular, `tx.gas` vs remaining state). Reservoir sizing in `runTx()` still
 * uses `intrinsicRegular`:
 *
 *   execution_gas = tx.gas - intrinsic
 *   gas_left      = min(TX_MAX - intrinsicRegular, execution_gas)
 *   reservoir     = execution_gas - gas_left
 *
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
