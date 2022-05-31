import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { Account, isHexPrefixed, toBuffer, unpadBuffer, PrefixedHexString } from 'ethereumjs-util'
import RLP from 'rlp'

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
  const trie = new Trie()
  for (const [key, value] of Object.entries(genesisState)) {
    const address = isHexPrefixed(key) ? toBuffer(key) : Buffer.from(key, 'hex')
    const account = new Account()
    if (typeof value === 'string') {
      account.balance = BigInt(value)
    } else {
      const [balance, code, storage] = value as AccountState
      if (balance) {
        account.balance = BigInt(balance)
      }
      if (code) {
        account.codeHash = Buffer.from(keccak256(toBuffer(code)))
      }
      if (storage) {
        const storageTrie = new Trie()
        for (const [k, val] of storage) {
          const storageKey = isHexPrefixed(k) ? toBuffer(k) : Buffer.from(k, 'hex')
          const storageVal = Buffer.from(
            RLP.encode(
              Uint8Array.from(
                unpadBuffer(isHexPrefixed(val) ? toBuffer(val) : Buffer.from(val, 'hex'))
              )
            )
          )
          await storageTrie.put(storageKey, storageVal)
        }
        account.stateRoot = storageTrie.root
      }
    }
    await trie.put(address, account.serialize())
  }
  return trie.root
}
