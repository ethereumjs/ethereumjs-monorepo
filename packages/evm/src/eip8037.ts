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
 * `intrinsicRegular + intrinsicState` equals the tx's total intrinsic
 * charge under EIP-8037. Callers may then use the split for the per-tx
 * block-gas pre-execution checks:
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
  sender?: { bytes: Uint8Array },
): { intrinsicRegular: bigint; intrinsicState: bigint } {
  const intrinsicRegular0 = tx.getIntrinsicGas()
  if (!common.isActivatedEIP(8037)) {
    return { intrinsicRegular: intrinsicRegular0, intrinsicState: BIGINT_0 }
  }

  const costPerStateByte = activeCostPerStateByte(common, blockGasLimit)
  const stateBytesPerNewAccount = common.param('stateBytesPerNewAccount')
  const stateBytesPerAuthBase = common.param('stateBytesPerAuthBase')

  // 7702 regular correction. getIntrinsicGas() (via getDataGas in
  // tx/capabilities/eip7702.ts) adds `authCount * perEmptyAccountCost` to
  // the regular intrinsic. Under EIP-8037 perEmptyAccountCost = 0 and the
  // regular per-auth charge is accountWriteGas + perAuthBaseGas; add the
  // missing amount here.
  let authCount = 0
  let intrinsicRegular = intrinsicRegular0
  if (tx.type === 4 && Array.isArray(tx.authorizationList)) {
    authCount = tx.authorizationList.length
    intrinsicRegular +=
      BigInt(authCount) * (common.param('accountWriteGas') + common.param('perAuthBaseGas'))
  }

  let isCreate = false
  try {
    isCreate = tx.toCreationAddress()
  } catch {
    isCreate = false
  }

  // EIP-2780 recipient/value components. Self-transfers (sender == to) skip
  // the recipient and value charges entirely.
  if (common.isActivatedEIP(2780)) {
    const hasValue = tx.value > BIGINT_0
    if (isCreate) {
      // Creation recipient cost (CREATE_ACCESS, via txCreationGas) is already
      // part of getIntrinsicGas(); a value-bearing create adds the EIP-7708
      // transfer-log cost.
      if (hasValue) {
        intrinsicRegular += common.param('transferLogCost')
      }
    } else {
      const isSelfTransfer =
        sender !== undefined && tx.to !== undefined && equalsBytes8037(sender.bytes, tx.to.bytes)
      if (!isSelfTransfer) {
        intrinsicRegular += common.param('txRecipientAccessGas')
        if (hasValue) {
          intrinsicRegular += common.param('transferLogCost') + common.param('txValueCost')
        }
      }
    }
  }

  // State-dimension intrinsic: state portion of creation-tx new-account
  // charge plus per-auth state base (new-account + auth-base bytes).
  let intrinsicState = BIGINT_0
  if (isCreate) {
    intrinsicState += stateBytesPerNewAccount * costPerStateByte
  }
  if (authCount > 0) {
    intrinsicState +=
      BigInt(authCount) * (stateBytesPerNewAccount + stateBytesPerAuthBase) * costPerStateByte
  }

  return { intrinsicRegular, intrinsicState }
}

function equalsBytes8037(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
