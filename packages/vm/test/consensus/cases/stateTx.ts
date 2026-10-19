import { createTxFromRLP } from '@ethereumjs/tx'
import { hexToBytes, toBytes } from '@ethereumjs/util'

import { makeTx } from '../../util.ts'

import type { TxOptions } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

function fieldHasBytes(value: unknown): boolean {
  if (value === undefined || value === null) return false
  try {
    return toBytes(value as `0x${string}`).length > 0
  } catch {
    return false
  }
}

/** True when the fixture already carries a signature and must not be re-signed with secretKey. */
export function fixtureHasSignature(txData: Record<string, unknown>): boolean {
  return fieldHasBytes(txData.v) && fieldHasBytes(txData.r) && fieldHasBytes(txData.s)
}

/**
 * Build a tx for EST state tests. When the post entry expects an exception and the
 * fixture includes v/r/s, keep the fixture signature instead of re-signing via secretKey.
 */
export function makeStateTestTx(
  txData: Record<string, unknown>,
  opts: TxOptions,
  expectException?: string,
  txbytes?: PrefixedHexString,
) {
  if (expectException !== undefined && txbytes !== undefined) {
    return createTxFromRLP(hexToBytes(txbytes), opts)
  }
  const data = { ...txData }
  if (expectException !== undefined && fixtureHasSignature(data)) {
    delete data.secretKey
  }
  return makeTx(data, opts)
}
