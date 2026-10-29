import type { Common } from '@ethereumjs/common'

/**
 * Value to compare against EIP-2124 `peerNextFork` when validating fork compatibility.
 * Post-Merge hardforks use unix timestamps; pre-Merge use block numbers.
 */
export function forkValidationHead(
  common: Common,
  latestBlock: bigint,
  nowSec: bigint = BigInt(Math.floor(Date.now() / 1000)),
): bigint {
  const ts = common.hardforkTimestamp()
  if (ts !== null) {
    return nowSec
  }
  return latestBlock
}
