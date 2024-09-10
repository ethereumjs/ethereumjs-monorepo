import { type VerkleCrypto, concatBytes } from '@ethereumjs/util'

export const createProof = (
  verkleCrypto: VerkleCrypto,
  nodeCommitment: Uint8Array, // 64 byte node commitment
  values: Uint8Array[], // Array of 256 32-byte values in node
  commitmentIndex: number, // Commitment index for the value being proved
) => {
  const proofInput = concatBytes(
    verkleCrypto.serializeCommitment(nodeCommitment),
    ...values,
    new Uint8Array(1).fill(commitmentIndex),
    values[commitmentIndex],
  )
  return verkleCrypto.createProof(proofInput)
}

export const verifyProof = (
  verkleCrypto: VerkleCrypto, // Verkle Crypto object
  proof: Uint8Array, // Verkle proof -- 576 bytes
  nodeCommitment: Uint8Array, // 64 byte node commitment
  commitmentIndex: number, // The index in the values array we are verifying
  value: Uint8Array, // The 32 byte value stored at `commitmentIndex`
) => {
  const verificationInput = concatBytes(
    proof,
    verkleCrypto.serializeCommitment(nodeCommitment),
    new Uint8Array(1).fill(commitmentIndex),
    value,
  )
  return verkleCrypto.verifyProof(verificationInput)
}
