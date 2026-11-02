import { RLP } from '@ethereumjs/rlp'

import {
  Account,
  type AccountBodyBytes,
  type AccountData,
  accountBodyFromSlim,
  accountBodyToRLP,
  accountBodyToSlim,
  createAccount,
} from './account.ts'
import { bigIntToUnpaddedBytes, bytesToBigInt, equalsBytes } from './bytes.ts'
import { BIGINT_0, KECCAK256_NULL, KECCAK256_RLP } from './constants.ts'
import { EthereumJSErrorWithoutCode } from './errors.ts'

/** Fixed byte length of a {@link BinaryAccount} record. */
export const BINARY_ACCOUNT_SIZE = 104

/** Fixed 104-byte account layout for snap sync and flat state stores. */
export type BinaryAccount = Uint8Array

const NONCE_OFF = 0
const NONCE_LEN = 8
const BALANCE_OFF = 8
const BALANCE_LEN = 32
const STORAGE_OFF = 40
const HASH_LEN = 32
const CODE_OFF = 72

function assertWritableTarget(target: Uint8Array | undefined, offset: number): void {
  if (target === undefined) return
  if (offset + BINARY_ACCOUNT_SIZE > target.length) {
    throw EthereumJSErrorWithoutCode('BinaryAccount target buffer too small for offset')
  }
}

function allocTarget(target: Uint8Array | undefined, offset: number): Uint8Array {
  if (target === undefined) {
    return new Uint8Array(BINARY_ACCOUNT_SIZE)
  }
  assertWritableTarget(target, offset)
  return target
}

function writeNonce(buf: Uint8Array, offset: number, nonce: bigint): void {
  if (nonce < BIGINT_0) {
    throw EthereumJSErrorWithoutCode('nonce must be greater than zero')
  }
  const unpadded = bigIntToUnpaddedBytes(nonce)
  if (unpadded.length > NONCE_LEN) {
    throw EthereumJSErrorWithoutCode('nonce does not fit in 8 bytes')
  }
  buf.fill(0, offset + NONCE_OFF, offset + NONCE_OFF + NONCE_LEN)
  buf.set(unpadded, offset + NONCE_OFF + NONCE_LEN - unpadded.length)
}

function writeBalance(buf: Uint8Array, offset: number, balance: bigint): void {
  if (balance < BIGINT_0) {
    throw EthereumJSErrorWithoutCode('balance must be greater than zero')
  }
  const unpadded = bigIntToUnpaddedBytes(balance)
  if (unpadded.length > BALANCE_LEN) {
    throw EthereumJSErrorWithoutCode('balance does not fit in 32 bytes')
  }
  buf.fill(0, offset + BALANCE_OFF, offset + BALANCE_OFF + BALANCE_LEN)
  buf.set(unpadded, offset + BALANCE_OFF + BALANCE_LEN - unpadded.length)
}

function writeHash32(buf: Uint8Array, offset: number, slotOffset: number, hash: Uint8Array): void {
  if (hash.length !== HASH_LEN) {
    throw EthereumJSErrorWithoutCode('account hash field must have a length of 32')
  }
  buf.set(hash, offset + slotOffset)
}

/**
 * Write account fields into a 104-byte binary record at `offset`.
 *
 * @param fields Optional account data; omitted fields use empty-account defaults
 */
function writeBinaryAccountFromAccount(
  account: Account,
  target: Uint8Array | undefined,
  offset: number,
): BinaryAccount {
  const buf = allocTarget(target, offset)
  writeNonce(buf, offset, account.nonce)
  writeBalance(buf, offset, account.balance)
  writeHash32(buf, offset, STORAGE_OFF, account.storageRoot)
  writeHash32(buf, offset, CODE_OFF, account.codeHash)
  return buf.subarray(offset, offset + BINARY_ACCOUNT_SIZE)
}

/** Write account fields into a 104-byte binary record at `offset`. */
export function createBinaryAccount(
  fields: AccountData = {},
  target?: Uint8Array,
  offset = 0,
): BinaryAccount {
  const account = createAccount({
    nonce: fields.nonce ?? 0,
    balance: fields.balance ?? 0,
    storageRoot: fields.storageRoot ?? KECCAK256_RLP,
    codeHash: fields.codeHash ?? KECCAK256_NULL,
  })
  return writeBinaryAccountFromAccount(account, target, offset)
}

/** Encode an {@link Account} as a 104-byte binary record. */
export function accountToBinaryAccount(
  account: Account,
  target?: Uint8Array,
  offset = 0,
): BinaryAccount {
  return writeBinaryAccountFromAccount(account, target, offset)
}

/** Encode an RLP account body (slim or full) into a binary record. */
export function accountBodyToBinary(
  body: AccountBodyBytes,
  couldBeSlim = true,
  target?: Uint8Array,
  offset = 0,
): BinaryAccount {
  const full = couldBeSlim ? (accountBodyFromSlim(body) as AccountBodyBytes) : body
  const [nonce, balance, storageRoot, codeHash] = full
  return createBinaryAccount(
    {
      nonce: bytesToBigInt(nonce),
      balance: bytesToBigInt(balance),
      storageRoot,
      codeHash,
    },
    target,
    offset,
  )
}

/** Read the account nonce from a binary record. */
export function getBinaryAccountNonce(buf: Uint8Array, offset = 0): bigint {
  return bytesToBigInt(buf.subarray(offset + NONCE_OFF, offset + NONCE_OFF + NONCE_LEN))
}

/** Write the account nonce into a binary record. */
export function setBinaryAccountNonce(buf: Uint8Array, nonce: bigint, offset = 0): void {
  writeNonce(buf, offset, nonce)
}

/** Read the account balance from a binary record. */
export function getBinaryAccountBalance(buf: Uint8Array, offset = 0): bigint {
  return bytesToBigInt(buf.subarray(offset + BALANCE_OFF, offset + BALANCE_OFF + BALANCE_LEN))
}

/** Write the account balance into a binary record. */
export function setBinaryAccountBalance(buf: Uint8Array, balance: bigint, offset = 0): void {
  writeBalance(buf, offset, balance)
}

/**
 * Read the storage root from a binary record.
 *
 * The returned view aliases `buf`; do not mutate it in place.
 */
export function getBinaryAccountStorageRoot(buf: Uint8Array, offset = 0): Uint8Array {
  return buf.subarray(offset + STORAGE_OFF, offset + STORAGE_OFF + HASH_LEN)
}

/** Write the storage root into a binary record. */
export function setBinaryAccountStorageRoot(buf: Uint8Array, root: Uint8Array, offset = 0): void {
  writeHash32(buf, offset, STORAGE_OFF, root)
}

/**
 * Read the code hash from a binary record.
 *
 * The returned view aliases `buf`; do not mutate it in place.
 */
export function getBinaryAccountCodeHash(buf: Uint8Array, offset = 0): Uint8Array {
  return buf.subarray(offset + CODE_OFF, offset + CODE_OFF + HASH_LEN)
}

/** Write the code hash into a binary record. */
export function setBinaryAccountCodeHash(buf: Uint8Array, codeHash: Uint8Array, offset = 0): void {
  writeHash32(buf, offset, CODE_OFF, codeHash)
}

/** Whether the binary record represents a contract (non-empty code hash). */
export function isBinaryAccountContract(buf: Uint8Array, offset = 0): boolean {
  return !equalsBytes(getBinaryAccountCodeHash(buf, offset), KECCAK256_NULL)
}

/** Whether the binary record uses the empty storage trie root. */
export function isBinaryAccountEmptyStorage(buf: Uint8Array, offset = 0): boolean {
  return equalsBytes(getBinaryAccountStorageRoot(buf, offset), KECCAK256_RLP)
}

/** EIP-161 emptiness check on a binary record. */
export function isBinaryAccountEmpty(buf: Uint8Array, offset = 0): boolean {
  return (
    getBinaryAccountNonce(buf, offset) === BIGINT_0 &&
    getBinaryAccountBalance(buf, offset) === BIGINT_0 &&
    equalsBytes(getBinaryAccountCodeHash(buf, offset), KECCAK256_NULL)
  )
}

/** Decode a binary record to a four-tuple RLP body (slim when possible). */
export function binaryAccountToBody(buf: Uint8Array, offset = 0, slim = false): AccountBodyBytes {
  const body: AccountBodyBytes = [
    bigIntToUnpaddedBytes(getBinaryAccountNonce(buf, offset)),
    bigIntToUnpaddedBytes(getBinaryAccountBalance(buf, offset)),
    getBinaryAccountStorageRoot(buf, offset),
    getBinaryAccountCodeHash(buf, offset),
  ]
  return slim ? (accountBodyToSlim(body) as AccountBodyBytes) : body
}

/** RLP-encode the account represented by a binary record (full body). */
export function binaryAccountToRLP(buf: Uint8Array, offset = 0): Uint8Array {
  return accountBodyToRLP(binaryAccountToBody(buf, offset, false), false)
}

/** Materialize a high-level {@link Account} from a binary record. */
export function binaryAccountToAccount(buf: Uint8Array, offset = 0): Account {
  return new Account(
    getBinaryAccountNonce(buf, offset),
    getBinaryAccountBalance(buf, offset),
    getBinaryAccountStorageRoot(buf, offset),
    getBinaryAccountCodeHash(buf, offset),
  )
}
