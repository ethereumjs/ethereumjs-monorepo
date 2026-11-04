import { concatBytes, hexToBytes } from '@ethereumjs/util'

import type { Sha256Fn } from './ssz.ts'

export const DOMAIN_SYNC_COMMITTEE = hexToBytes('0x07000000')

/**
 * Build domain bytes for sync committee verification (`compute_domain`).
 */
export function computeSyncCommitteeDomain(
  forkVersionHex: string,
  genesisValidatorsRoot: Uint8Array,
  sha256: Sha256Fn,
): Uint8Array {
  const forkVersion = hexToBytes(forkVersionHex as `0x${string}`)
  const forkData = new Uint8Array(64)
  forkData.set(forkVersion.subarray(0, 4), 0)
  forkData.set(genesisValidatorsRoot, 4)
  const forkDataRoot = sha256(forkData)
  const domain = new Uint8Array(32)
  domain.set(DOMAIN_SYNC_COMMITTEE.subarray(0, 4), 0)
  domain.set(forkDataRoot.subarray(0, 28), 4)
  return domain
}

/**
 * `compute_signing_root` for a beacon block header root and domain.
 */
export function computeSigningRoot(
  headerRoot: Uint8Array,
  domain: Uint8Array,
  sha256: Sha256Fn,
): Uint8Array {
  return sha256(concatBytes(headerRoot, domain))
}
