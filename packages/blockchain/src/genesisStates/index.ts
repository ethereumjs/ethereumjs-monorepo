import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { Account, isHexPrefixed, toBytes, unpadBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { hexToBytes } from 'ethereum-cryptography/utils'

import type { PrefixedHexString } from '@ethereumjs/util'

export type StoragePair = [key: PrefixedHexString, value: PrefixedHexString]

export type AccountState = [
  balance: PrefixedHexString,
  code: PrefixedHexString,
  storage: Array<StoragePair>
]

export interface GenesisState {
  [key: PrefixedHexString]: PrefixedHexString | AccountState
}

/**
 * Derives the stateRoot of the genesis block based on genesis allocations
 */
export async function genesisStateRoot(genesisState: GenesisState) {
  const trie = new Trie({ useKeyHashing: true })
  for (const [key, value] of Object.entries(genesisState)) {
    const address = isHexPrefixed(key) ? toBytes(key) : hexToBytes(key)
    const account = new Account()
    if (typeof value === 'string') {
      account.balance = BigInt(value)
    } else {
      const [balance, code, storage] = value as Partial<AccountState>
      if (balance !== undefined) {
        account.balance = BigInt(balance)
      }
      if (code !== undefined) {
        account.codeHash = keccak256(toBytes(code))
      }
      if (storage !== undefined) {
        const storageTrie = new Trie({ useKeyHashing: true })
        for (const [k, val] of storage) {
          const storageKey = isHexPrefixed(k) ? toBytes(k) : hexToBytes(k)
          const storageVal = RLP.encode(
            unpadBytes(isHexPrefixed(val) ? toBytes(val) : hexToBytes(val))
          )
          await storageTrie.put(storageKey, storageVal)
        }
        account.storageRoot = storageTrie.root()
      }
    }
    await trie.put(address, account.serialize())
  }
  return trie.root()
}
