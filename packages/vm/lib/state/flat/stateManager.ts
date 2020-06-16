const Set = require('core-js-pure/es/set')
const Trie = require('merkle-patricia-tree/secure.js')
const promisify = require('util.promisify')
import { toBuffer, KECCAK256_NULL_S, keccak256 } from 'ethereumjs-util'
import BN = require('bn.js')
import { encode, decode } from 'rlp'
import Common from 'ethereumjs-common'
import { genesisStateByName } from 'ethereumjs-common/dist/genesisStates'
import Account from 'ethereumjs-account'
import { StateManager, StorageDump } from '../interface'
import Cache from '../cache'
import { ripemdPrecompileAddress } from '../../evm/precompiles'
import { Snapshot } from './snapshot'

/**
 * Options for constructing a [[StateManager]].
 */
export interface FlatStateManagerOpts {
  /**
   * Parameters of the chain ([`Common`](https://github.com/ethereumjs/ethereumjs-common))
   */
  common?: Common
  /**
   * A [`merkle-patricia-tree`](https://github.com/ethereumjs/merkle-patricia-tree) instance
   */
  snapshot?: Snapshot
}

/**
 * Interface for getting and setting data from an underlying
 * state trie.
 */
export class FlatStateManager implements StateManager {
  _common: Common
  _snapshot: Snapshot
  _touched: Set<string>
  _touchedStack: Set<string>[]
  _originalStorageCache: Map<string, Map<string, Buffer>>
  _checkpointCount: number

  /*_storageTries: any
  _cache: Cache*/

  constructor(opts: FlatStateManagerOpts = {}) {
    let common = opts.common
    if (!common) {
      common = new Common('mainnet', 'petersburg')
    }
    this._common = common
    this._snapshot = opts.snapshot || new Snapshot()
    this._touched = new Set()
    this._touchedStack = []
    this._originalStorageCache = new Map()
    this._checkpointCount = 0

    /*this._storageTries = {} // the storage trie cache
    this._cache = new Cache(this._trie)*/
  }

  copy(): StateManager {
    throw new Error('Unimplemented')
  }

  async getAccount(address: Buffer): Promise<Account> {
    const res = await this._snapshot.getAccount(address)
    const account = res ? new Account(res) : new Account()
    return account
  }

  async putAccount(address: Buffer, account: Account): Promise<void> {
    await this._snapshot.putAccount(address, account.serialize())
    this.touchAccount(address)
  }

  touchAccount(address: Buffer): void {
    this._touched.add(address.toString('hex'))
  }

  async putContractCode(address: Buffer, value: Buffer): Promise<void> {
    await this._snapshot.putCode(address, value)
    this.touchAccount(address)
  }

  async getContractCode(address: Buffer): Promise<Buffer> {
    const res = await this._snapshot.getCode(address)
    return res ? res : Buffer.alloc(0)
  }

  async getContractStorage(address: Buffer, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const value = await this._snapshot.getStorageSlot(address, key)
    if (!value) return Buffer.alloc(0)

    const decoded = decode(value)
    return decoded
  }

  async getOriginalContractStorage(address: Buffer, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const addressHex = address.toString('hex')
    const keyHex = key.toString('hex')

    let map: Map<string, Buffer>
    if (!this._originalStorageCache.has(addressHex)) {
      map = new Map()
      this._originalStorageCache.set(addressHex, map)
    } else {
      map = this._originalStorageCache.get(addressHex) as Map<string, Buffer>
    }

    if (map.has(keyHex)) {
      return map.get(keyHex)!
    } else {
      const current = await this.getContractStorage(address, key)
      map.set(keyHex, current)
      return current
    }
  }

  _clearOriginalStorageCache(): void {
    this._originalStorageCache = new Map()
  }

  async putContractStorage(address: Buffer, key: Buffer, value: Buffer): Promise<void> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    if (value && value.length) {
      const encodedValue = encode(value)
      await this._snapshot.putStorageSlot(address, key, encodedValue)
    } else {
      await this._snapshot.delStorageSlot(address, key)
    }
    this._touched.add(address.toString('hex'))
  }

  async clearContractStorage(address: Buffer): Promise<void> {
    return this._snapshot.clearAccountStorage(address)
  }

  async checkpoint(): Promise<void> {
    this._snapshot.checkpoint()
    this._touchedStack.push(new Set(Array.from(this._touched)))
    this._checkpointCount++
  }

  async commit(): Promise<void> {
    await this._snapshot.commit()
    this._touchedStack.pop()
    this._checkpointCount--

    if (this._checkpointCount === 0) {
      this._clearOriginalStorageCache()
    }
  }

  async revert(): Promise<void> {
    await this._snapshot.revert()
    const touched = this._touchedStack.pop()
    if (!touched) {
      throw new Error('Reverting to invalid state checkpoint failed')
    }
    // Exceptional case due to consensus issue in Geth and Parity.
    // See [EIP issue #716](https://github.com/ethereum/EIPs/issues/716) for context.
    // The RIPEMD precompile has to remain *touched* even when the call reverts,
    // and be considered for deletion.
    if (this._touched.has(ripemdPrecompileAddress)) {
      touched.add(ripemdPrecompileAddress)
    }
    this._touched = touched
    this._checkpointCount--

    if (this._checkpointCount === 0) {
      this._clearOriginalStorageCache()
    }
  }

  async getStateRoot(): Promise<Buffer> {
    if (this._checkpointCount !== 0) {
      throw new Error('Cannot get state root with uncommitted checkpoints')
    }
    // Expensive operation
    return this._snapshot.merkleize()
  }

  async setStateRoot(stateRoot: Buffer): Promise<void> {
    throw new Error('Unimplmented')
  }

  async dumpStorage(address: Buffer): Promise<StorageDump> {
    throw new Error('Unimplemented')
  }

  async hasGenesisState(): Promise<boolean> {
    throw new Error('Unimplemented')
  }

  async generateCanonicalGenesis(): Promise<void> {
    throw new Error('Unimplemented')
  }

  async generateGenesis(initState: any): Promise<void> {
    throw new Error('Unimplemented')
  }

  /**
   * Checks if the `account` corresponding to `address` is empty as defined in
   * EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   * @param address - Address to check
   */
  async accountIsEmpty(address: Buffer): Promise<boolean> {
    const account = await this.getAccount(address)

    // should be replaced by account.isEmpty() once updated
    return (
      account.nonce.toString('hex') === '' &&
      account.balance.toString('hex') === '' &&
      account.codeHash.toString('hex') === KECCAK256_NULL_S
    )
  }

  /**
   * Removes accounts form the state trie that have been touched,
   * as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   */
  async cleanupTouchedAccounts(): Promise<void> {
    const touchedArray = Array.from(this._touched)
    for (const addressHex of touchedArray) {
      const address = Buffer.from(addressHex, 'hex')
      const empty = await this.accountIsEmpty(address)
      if (empty) {
        await this._snapshot.clearAccount(address)
      }
    }
    this._touched.clear()
  }
}
