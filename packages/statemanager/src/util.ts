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
import { bytesToHex } from 'ethereum-cryptography/utils'

import type { DefaultStateManager } from './stateManager'
import type { BulkNodeInput } from '@ethereumjs/trie'

/**
 * Initializes the provided genesis state into the state trie.
 * Will error if there are uncommitted checkpoints on the instance.
 * @param initState address -> balance | [balance, code, storage]
export async function generateCanonicalGenesis(
  this: DefaultStateManager,
  initState: any
): Promise<void> {
  if (this._checkpointCount !== 0) {
    throw new Error('Cannot create genesis state with uncommitted checkpoints')
  }
  if (this.DEBUG) {
    this._debug(`Save genesis state into the state trie`)
  }
  const addresses = Object.keys(initState)
  const accounts: [number[], string][] = []
  const byteCode: { hash: Uint8Array; code: Uint8Array }[] = []
  const storageTries: { address: Address; hash: Uint8Array; trie: Trie }[] = []
  for (const [_idx, address] of addresses.entries()) {
    const addr = Address.fromString(address)
    const state = initState[address]
    if (this.DEBUG) {
      this._debug(`Genesis state for account ${_idx + 1}/${addresses.length}: ${address}`)
    }
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
      // if (balance === undefined) {
      //   continue
      // } else {
      if (code !== undefined) {
        byteCode.push({
          hash: keccak256(hexStringToBytes(code)),
          code: hexStringToBytes(code),
        })
      }
      const storageTrie = new Trie({ secure: true, useKeyHashing: true })
      if (storage !== undefined) {
        for (const [idx, [key, value]] of storage.entries()) {
          this._debug.extend(`${idx + 1} / ${storage.length}`)(
            `Storing Contract Storage for key: ${bytesToPrefixedHexString(key)} `
          )
          await storageTrie.put(toBytes(key), RLP.encode(toBytes(value)))
        }
        storageTries.push({
          address: addr,
          hash: storageTrie.root(),
          trie: storageTrie,
        })
        const account = Account.fromAccountData({
          balance,
          nonce,
          codeHash: code !== undefined ? keccak256(hexStringToBytes(code)) : undefined,
          storageRoot: storageTrie.root(),
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
      // }
    }
  }
  let newTrie = await Trie.create({ secure: true, useKeyHashing: true })
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
  this._trie = newTrie
  for (const { address, trie } of storageTries) {
    this._storageTries[bytesToHex(address.bytes)] = trie
  }
  // await this._stateManager.flush()
  // If any empty accounts are put, these should not be marked as touched
  // (when first tx is ran, this account is deleted when it cleans up the accounts)
  // this.touchedJournal.clear()
}
 */

/**
 * Initializes the provided genesis state into the state trie.
 * Will error if there are uncommitted checkpoints on the instance.
 * @param initState address -> balance | [balance, code, storage]
 */
export async function generateCanonicalGenesis(
  this: DefaultStateManager,
  initState: any
): Promise<void> {
  if (this._checkpointCount !== 0) {
    throw new Error('Cannot create genesis state with uncommitted checkpoints')
  }
  if (this.DEBUG) {
    this._debug(`Save genesis state into the state trie`)
  }
  const addresses = Object.keys(initState)
  for (const address of addresses) {
    const addr = Address.fromString(address)
    const state = initState[address]
    if (!Array.isArray(state)) {
      // Prior format: address -> balance
      const account = Account.fromAccountData({ balance: state })
      await this.putAccount(addr, account)
    } else {
      // New format: address -> [balance, code, storage]
      const [balance, code, storage, nonce] = state
      const account = Account.fromAccountData({ balance, nonce })
      await this.putAccount(addr, account)
      if (code !== undefined) {
        await this.putContractCode(addr, toBytes(code))
      }
      if (storage !== undefined) {
        for (const [key, value] of storage) {
          await this.putContractStorage(addr, toBytes(key), toBytes(value))
        }
      }
    }
  }
  await this.flush()
}
