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
 * Returns `{ intrinsicRegular, intrinsicState }` such that
 * `intrinsicRegular + intrinsicState` equals the tx's total **state-independent**
 * intrinsic charge under EIP-8037 (glamsterdam-devnet v7+). EIP-2780
 * recipient/value/log costs and new-account state gas are charged at
 * top-frame access, not here.
 *
 * Callers may then use the split for the per-tx block-gas pre-execution
 * checks:
 *
 *   regular check: min(TX_MAX, tx.gas - intrinsicState) > regular_available  → reject
 *   state check:   (tx.gas - intrinsicRegular)         > state_available     → reject
 *
 * and for sizing the EIP-8037 state-gas reservoir.
 *
 * When EIP-8037 is not active, returns `{ intrinsicRegular: tx.getIntrinsicGas(),
 * intrinsicState: 0n }` so callers can use a single code path.
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

  // 7702: getIntrinsicGas() adds `authCount * perEmptyAccountCost` (0 under
  // 8037). The state-independent remainder is perAuthBaseGas per list entry.
  // ACCOUNT_WRITE and per-auth state gas are charged at access (runTx
  // processAuthorizationList), keyed on pre-state — not here.
  let intrinsicRegular = intrinsicRegular0
  if (tx.type === 4 && Array.isArray(tx.authorizationList)) {
    intrinsicRegular += BigInt(tx.authorizationList.length) * common.param('perAuthBaseGas')
  }

  return { intrinsicRegular, intrinsicState: BIGINT_0 }
}
