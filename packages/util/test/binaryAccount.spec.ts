import { RLP } from '@ethereumjs/rlp'
import { describe, expect, it } from 'vitest'

import {
  type AccountBodyBytes,
  BINARY_ACCOUNT_SIZE,
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountBodyFromSlim,
  accountBodyToBinary,
  accountBodyToRLP,
  accountBodyToSlim,
  accountToBinaryAccount,
  binaryAccountToAccount,
  binaryAccountToBody,
  binaryAccountToRLP,
  createAccount,
  createBinaryAccount,
  isBinaryAccountContract,
  isBinaryAccountEmpty,
  isBinaryAccountEmptyStorage,
  setBinaryAccountNonce,
} from '../src/index.ts'

describe('BinaryAccount', () => {
  it('round-trips createAccount / serialize / RLP', () => {
    const account = createAccount({
      nonce: 7n,
      balance: 1000000000000000000n,
      storageRoot: KECCAK256_RLP,
      codeHash: KECCAK256_NULL,
    })
    const bin = accountToBinaryAccount(account)
    expect(bin.length).toBe(BINARY_ACCOUNT_SIZE)
    const back = binaryAccountToAccount(bin)
    expect(back.nonce).toBe(account.nonce)
    expect(back.balance).toBe(account.balance)
    expect(back.serialize()).toEqual(account.serialize())
    expect(binaryAccountToRLP(bin)).toEqual(RLP.encode(account.raw()))
  })

  it('round-trips slim account body', () => {
    const full = createAccount({ nonce: 1n, balance: 2n }).raw() as AccountBodyBytes
    const slim = accountBodyToSlim(full) as AccountBodyBytes
    const bin = accountBodyToBinary(slim, true)
    const expanded = accountBodyFromSlim(binaryAccountToBody(bin, 0, true)) as AccountBodyBytes
    expect(accountBodyToRLP(expanded, false)).toEqual(accountBodyToRLP(full, false))
  })

  it('slab offsets 0, 104, 208', () => {
    const slab = new Uint8Array(BINARY_ACCOUNT_SIZE * 3)
    createBinaryAccount({ nonce: 1n }, slab, 0)
    createBinaryAccount({ nonce: 2n }, slab, 104)
    createBinaryAccount({ nonce: 3n }, slab, 208)
    expect(binaryAccountToAccount(slab, 0).nonce).toBe(1n)
    expect(binaryAccountToAccount(slab, 104).nonce).toBe(2n)
    expect(binaryAccountToAccount(slab, 208).nonce).toBe(3n)
  })

  it('predicates match Account', () => {
    const empty = createBinaryAccount()
    expect(isBinaryAccountEmpty(empty)).toBe(true)
    expect(isBinaryAccountContract(empty)).toBe(false)
    expect(isBinaryAccountEmptyStorage(empty)).toBe(true)

    const contract = createBinaryAccount({
      codeHash: new Uint8Array(32).fill(0xab),
    })
    expect(isBinaryAccountContract(contract)).toBe(true)
    expect(isBinaryAccountEmpty(contract)).toBe(false)
  })

  it('throws when nonce does not fit in 8 bytes', () => {
    const buf = new Uint8Array(BINARY_ACCOUNT_SIZE)
    expect(() =>
      createBinaryAccount({
        nonce: (1n << 64n) + 1n,
      }),
    ).toThrow()
    expect(() => setBinaryAccountNonce(buf, (1n << 64n) + 1n)).toThrow()
  })
})
