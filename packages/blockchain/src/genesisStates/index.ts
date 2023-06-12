import { RLP } from '@ethereumjs/rlp'
import { LeafNode, Trie, bytesToNibbles, insertBatch, parseBulk } from '@ethereumjs/trie'
import {
  Account,
  Address,
  bytesToPrefixedHexString,
  hexStringToBytes,
  toBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import type { BulkNodeInput } from '@ethereumjs/trie'
import type { PrefixedHexString } from '@ethereumjs/util'

export type StoragePair = [key: PrefixedHexString, value: PrefixedHexString]

export type AccountState = [
  balance: PrefixedHexString,
  code: PrefixedHexString,
  storage: Array<StoragePair>,
  nonce: PrefixedHexString
]

export interface GenesisState {
  [key: PrefixedHexString]: PrefixedHexString | AccountState
}

/**
 * Derives the stateRoot of the genesis block based on genesis allocations
 */
export async function genesisStateRoot(initState: GenesisState): Promise<Uint8Array> {
  const addresses = Object.keys(initState)
  const accounts: [number[], string][] = []
  const byteCode: { hash: Uint8Array; code: Uint8Array }[] = []
  const storageTries: { address: Address; hash: Uint8Array; trie: Trie }[] = []
  for (const [_idx, address] of addresses.entries()) {
    const addr = Address.fromString(address)
    const state = initState[address]
    if (!Array.isArray(state)) {
      // Prior format: address -> balance
      const account = Account.fromAccountData({ balance: state })
      accounts.push([
        bytesToNibbles(keccak256(addr.bytes)),
        bytesToPrefixedHexString(account.serialize()),
      ])
    } else {
      // New format: address -> [balance, code, storage]
      const [balance, code, storage, nonce] = state
      if (balance === undefined) {
        continue
      } else {
        const storageTrie = new Trie({ secure: true, useKeyHashing: true })
        if (storage !== undefined) {
          for (const [key, value] of storage) {
            await storageTrie.put(toBytes(key), RLP.encode(toBytes(value)))
          }
          storageTries.push({
            address: addr,
            hash: storageTrie.root(),
            trie: storageTrie,
          })
          if (code !== undefined) {
            byteCode.push({
              hash: keccak256(hexStringToBytes(code)),
              code: hexStringToBytes(code),
            })
          }
          const account = Account.fromAccountData({
            balance,
            nonce,
            codeHash: code !== undefined ? keccak256(hexStringToBytes(code)) : undefined,
            storageRoot: storage !== undefined ? storageTrie.root() : undefined,
          })
          accounts.push([
            bytesToNibbles(keccak256(addr.bytes)),
            bytesToPrefixedHexString(account.serialize()),
          ])
        } else {
          const account = Account.fromAccountData({
            balance,
            nonce,
            codeHash: code !== undefined ? keccak256(hexStringToBytes(code)) : undefined,
          })
          accounts.push([
            bytesToNibbles(keccak256(addr.bytes)),
            bytesToPrefixedHexString(account.serialize()),
          ])
        }
      }
    }
  }
  let newTrie = new Trie({ secure: true, useKeyHashing: true })
  if (accounts.length > 0) {
    const batchInsert: [[number[], number[]], string][] = parseBulk(accounts)
    const batchLeaves: BulkNodeInput = batchInsert.map(([nibbleArrays, value]) => {
      const key = nibbleArrays.pop()!
      const newNode = new LeafNode({ key, value: hexStringToBytes(value) })
      const pathNibbles = nibbleArrays.flat()
      return {
        newNode,
        pathNibbles,
      }
    })
    newTrie = await insertBatch(batchLeaves, true)
  }
  for (const { hash, code } of byteCode) {
    await newTrie.database().put(hash, code)
  }
  return newTrie.root()
}
