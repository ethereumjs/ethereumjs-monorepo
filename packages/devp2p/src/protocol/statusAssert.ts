import {
  EthereumJSErrorWithoutCode,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
} from '@ethereumjs/util'

/** Short prefix so a 32-byte mismatch stays readable on the diagnostic ring. */
export function assertSameGenesis(ours: Uint8Array, theirs: Uint8Array): void {
  if (equalsBytes(ours, theirs)) return
  const we = `${bytesToHex(ours).slice(0, 10)}...`
  const remote = `${bytesToHex(theirs).slice(0, 10)}...`
  throw EthereumJSErrorWithoutCode(`Genesis mismatch: we=${we} remote=${remote}`)
}

/**
 * STATUS network id is an RLP integer. Compare the numeric value so a leading
 * zero byte does not fail an otherwise identical chain (Sepolia is 11155111).
 */
export function assertSameNetworkId(ours: Uint8Array, theirs: Uint8Array): void {
  const we = formatNetworkId(ours)
  const remote = formatNetworkId(theirs)
  if (
    ours instanceof Uint8Array &&
    theirs instanceof Uint8Array &&
    ours.length <= 8 &&
    theirs.length <= 8 &&
    bytesToBigInt(ours) === bytesToBigInt(theirs)
  ) {
    return
  }
  throw EthereumJSErrorWithoutCode(`Network id mismatch: we=${we} remote=${remote}`)
}

function formatNetworkId(bytes: Uint8Array): string {
  if (!(bytes instanceof Uint8Array)) return typeof bytes
  if (bytes.length > 8) return `${bytes.length}-byte ${bytesToHex(bytes).slice(0, 14)}`
  return bytesToBigInt(bytes).toString()
}
