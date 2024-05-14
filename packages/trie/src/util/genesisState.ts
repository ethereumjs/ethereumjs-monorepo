import { RLP } from '@ethereumjs/rlp'
import {
  Account,
  hexToBytes,
  isHexString,
  unpadBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { Trie } from '../trie.js'

import type { AccountState, GenesisState } from '@ethereumjs/util'

/**
 * Derives the stateRoot of the genesis block based on genesis allocations
 */
export async function genesisStateRoot(genesisState: GenesisState) {
  const trie = new Trie({ useKeyHashing: true })
  for (const [key, value] of Object.entries(genesisState)) {
    const address = isHexString(key) ? hexToBytes(key) : unprefixedHexToBytes(key)
    const account = new Account()
    if (typeof value === 'string') {
      account.balance = BigInt(value)
    } else {
      const [balance, code, storage, nonce] = value as Partial<AccountState>
      if (balance !== undefined) {
        account.balance = BigInt(balance)
      }
      if (code !== undefined) {
        const codeBytes = isHexString(code) ? hexToBytes(code) : unprefixedHexToBytes(code)
        account.codeHash = keccak256(codeBytes)
      }
      if (storage !== undefined) {
        const storageTrie = new Trie({ useKeyHashing: true })
        for (const [k, val] of storage) {
          const storageKey = isHexString(k) ? hexToBytes(k) : unprefixedHexToBytes(k)
          const storageVal = RLP.encode(
            unpadBytes(isHexString(val) ? hexToBytes(val) : unprefixedHexToBytes(val))
          )
          await storageTrie.put(storageKey, storageVal)
        }
        account.storageRoot = storageTrie.root()
      }
      if (nonce !== undefined) {
        account.nonce = BigInt(nonce)
      }
    }
    await trie.put(address, account.serialize())
  }
  return trie.root()
}
