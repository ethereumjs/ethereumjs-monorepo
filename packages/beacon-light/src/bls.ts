import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381.js'

const blsLong = bls12_381.longSignatures

const SYNC_COMMITTEE_SIZE = 512
const DEFAULT_SUPERMAJORITY = Math.ceil((SYNC_COMMITTEE_SIZE * 2) / 3)
/** Ethereum consensus BLS12-381 Proof-of-Possession domain separation tag (RFC 9380). */
export const ETH_BLS_DST = ['BLS_SIG_BLS12381G2_XMD:SHA-256', 'SS' + 'WU', 'RO_POP_'].join('_')

export type VerifySyncCommitteeSignatureOpts = {
  publicKeys: Uint8Array[]
  syncCommitteeBits: Uint8Array | boolean[]
  signature: Uint8Array
  signingRoot: Uint8Array
  minParticipants?: number
  /** Optional override (tests or custom crypto backends). */
  verifyAggregate?: (
    signature: Uint8Array,
    message: Uint8Array,
    publicKeys: Uint8Array[],
  ) => boolean
}

export type VerifySyncCommitteeSignatureResult = {
  valid: boolean
  participantCount: number
}

function bitAt(bits: Uint8Array | boolean[], index: number): boolean {
  if (Array.isArray(bits)) return bits[index] === true
  if (bits.length === SYNC_COMMITTEE_SIZE / 8) {
    return ((bits[index >> 3]! >> (index & 7)) & 1) === 1
  }
  throw EthereumJSErrorWithoutCode('sync committee bits must be 512 booleans or 64 bytes')
}

function defaultVerifyAggregate(
  signature: Uint8Array,
  message: Uint8Array,
  participantPublicKeys: Uint8Array[],
): boolean {
  if (participantPublicKeys.length === 0) return false
  try {
    const aggPk =
      participantPublicKeys.length === 1
        ? participantPublicKeys[0]!
        : blsLong.aggregatePublicKeys(participantPublicKeys).toBytes()
    const signingMessage = blsLong.hash(message, ETH_BLS_DST)
    return blsLong.verify(signature, signingMessage, aggPk)
  } catch {
    return false
  }
}

/**
 * Verify a sync committee aggregate BLS12-381 signature (Altair supermajority rule by default).
 */
export function verifySyncCommitteeSignature(
  opts: VerifySyncCommitteeSignatureOpts,
): VerifySyncCommitteeSignatureResult {
  const minParticipants = opts.minParticipants ?? DEFAULT_SUPERMAJORITY
  const participantPublicKeys: Uint8Array[] = []
  for (let i = 0; i < SYNC_COMMITTEE_SIZE; i++) {
    if (bitAt(opts.syncCommitteeBits, i)) {
      participantPublicKeys.push(opts.publicKeys[i]!)
    }
  }
  const participantCount = participantPublicKeys.length
  if (participantCount < 1 || participantCount < minParticipants) {
    return { valid: false, participantCount }
  }
  if (opts.signature.length !== 96) {
    return { valid: false, participantCount }
  }
  for (const pk of participantPublicKeys) {
    if (pk.length !== 48) {
      return { valid: false, participantCount }
    }
  }
  const verify = opts.verifyAggregate ?? defaultVerifyAggregate
  const valid = verify(opts.signature, opts.signingRoot, participantPublicKeys)
  return { valid, participantCount }
}
