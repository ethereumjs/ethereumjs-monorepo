/** EIP-4844 and shared transaction size limits (see respective EIPs). */

/** Maximum calldata size in bytes (2 ** 24). */
export const MAX_CALLDATA_SIZE = 16777216 // 2 ** 24
/** Maximum access list entries (2 ** 24). */
export const MAX_ACCESS_LIST_SIZE = 16777216 // 2 ** 24
/** Maximum blob versioned hashes per transaction (2 ** 24). */
export const MAX_VERSIONED_HASHES_LIST_SIZE = 16777216 // 2 ** 24
/** Maximum KZG commitments in a transaction wrapper (2 ** 24). */
export const MAX_TX_WRAP_KZG_COMMITMENTS = 16777216 // 2 ** 24
/** Field elements per blob (EIP-4844). Also mirrored in `@ethereumjs/common` params. */
export const FIELD_ELEMENTS_PER_BLOB = 4096 // This is also in the Common 4844 parameters but needed here since types can't access Common params
/** Bytes per BLS12-381 field element. */
export const BYTES_PER_FIELD_ELEMENT = 32
