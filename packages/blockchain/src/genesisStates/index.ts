import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { Account, isHexPrefixed, toBytes, unpadBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { hexToBytes } from 'ethereum-cryptography/utils'

import type { AccountState, GenesisState } from '../types'

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
      const [balance, code, storage, nonce] = value as Partial<AccountState>
      if (balance !== undefined) {
        account.balance = BigInt(balance)
      }
      if (code !== undefined) {
        const codeBytes = isHexPrefixed(code) ? toBytes(code) : hexToBytes(code)
        account.codeHash = keccak256(codeBytes)
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
      if (nonce !== undefined) {
        account.nonce = BigInt(nonce)
      }
    }
    await trie.put(address, account.serialize())
  }
  return trie.root()
}
