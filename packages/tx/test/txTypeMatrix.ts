import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { type KZG, type PrefixedHexString, hexToBytes } from '@ethereumjs/util'

/**
 * Stub KZG for canonical (no-blob) 4844 txs in the shared type matrix.
 * Do not load a trusted setup here — that belongs in eip4844.spec.ts / eip7594.spec.ts.
 */
export const stubKzg = {} as KZG

/** Versioned hash: KZG commitment version `0x01` + 31 zero bytes. */
export const BLOB_VERSIONED_HASH: PrefixedHexString = `0x01${'00'.repeat(31)}`
export const BLOB_VERSIONED_HASH_BYTES = hexToBytes(BLOB_VERSIONED_HASH)

export const TEST_RECIPIENT = `0x${'11'.repeat(20)}` as PrefixedHexString
export const TEST_RECIPIENT_BYTES = hexToBytes(TEST_RECIPIENT)

export const MATRIX_PRIVATE_KEY = hexToBytes(`0x${'46'.repeat(32)}`)

export const londonCommon = new Common({ chain: Mainnet, hardfork: Hardfork.London })
export const cancunCommon = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Cancun,
  customCrypto: { kzg: stubKzg },
})
export const pragueCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

export const blobTxDefaults = {
  to: TEST_RECIPIENT,
  blobVersionedHashes: [BLOB_VERSIONED_HASH],
}

export const TEST_AUTHORIZATION_LIST_ITEM = {
  chainId: '0x' as const,
  address: `0x${'20'.repeat(20)}` as PrefixedHexString,
  nonce: '0x1' as const,
  yParity: '0x1' as const,
  r: `0x${'01'.repeat(32)}` as PrefixedHexString,
  s: `0x${'01'.repeat(32)}` as PrefixedHexString,
}

export const TEST_AUTHORIZATION_LIST_BYTES = [
  [
    new Uint8Array(0),
    hexToBytes(`0x${'20'.repeat(20)}`),
    new Uint8Array([1]),
    new Uint8Array([1]),
    hexToBytes(`0x${'01'.repeat(32)}`),
    hexToBytes(`0x${'01'.repeat(32)}`),
  ],
]

export const eoaCodeTxDefaults = {
  to: TEST_RECIPIENT,
  authorizationList: [TEST_AUTHORIZATION_LIST_ITEM],
}

/**
 * Inputs that must not be accepted on fee/value/nonce fields.
 * A negative number wrapping to a huge unsigned fee is a funds-loss class bug.
 */
export const INVALID_NUMERIC_INPUTS: unknown[] = [
  10.1,
  '10.1',
  '0xaa.1',
  -10.1,
  -1,
  BigInt(-10),
  '-100',
  '-10.1',
  '-0xaa',
  Infinity,
  -Infinity,
  NaN,
  {},
  true,
  false,
  () => {},
  Number.MAX_SAFE_INTEGER + 1,
]

export const NEGATIVE_FEE_INPUTS: unknown[] = [-1, BigInt(-1), '-1']
