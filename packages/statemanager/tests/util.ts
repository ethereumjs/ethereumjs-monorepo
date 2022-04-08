import { Account } from 'ethereumjs-util'

export function createAccount(nonce: bigint = BigInt(0), balance: bigint = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}
