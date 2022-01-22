/* eslint @typescript-eslint/no-unused-vars: 0 */

import Common from '@ethereumjs/common'
import { Account, Address } from 'ethereumjs-util'
import { BaseStateManager, StateManager } from '.'
import Cache, { getCb, putCb } from './cache'
import { StorageDump } from './interface'

type HexPrefixedAddress = string

export interface State {
  accounts: {
    [key: HexPrefixedAddress]: string
  }
}

/**
 * Options dictionary.
 */
export interface StatelessVerkleStateManagerOpts {
  /**
   * Parameters of the chain {@link Common}
   */
  common?: Common
}

/**
 * Default StateManager implementation for the VM.
 *
 * The state manager abstracts from the underlying data store
 * by providing higher level access to accounts, contract code
 * and storage slots.
 *
 * The default state manager implementation uses a
 * `merkle-patricia-tree` trie as a data backend.
 */
export default class StatelessVerkleStateManager extends BaseStateManager implements StateManager {
  // Pre-state (should not change)
  private _preState: State = {
    accounts: {},
  }

  // State along execution (should update)
  private _state: State = {
    accounts: {},
  }

  // Checkpointing
  private _checkpoints: State[] = []

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: StatelessVerkleStateManagerOpts = {}) {
    super(opts)

    /*
     * For a custom StateManager implementation adopt these
     * callbacks passed to the `Cache` instantiated to perform
     * the `get`, `put` and `delete` operations with the
     * desired backend.
     */
    const getCb: getCb = async (address) => {
      const addressStr = address.toString()
      if (addressStr in this._state.accounts) {
        const accountRLP = Buffer.from(this._state.accounts[addressStr], 'hex')
        return Account.fromRlpSerializedAccount(accountRLP)
      }
      return undefined
    }
    const putCb: putCb = async (keyBuf, accountRlp) => {
      const addressStr: HexPrefixedAddress = `0x${keyBuf.toString('hex')}`
      const accountStr = accountRlp.toString('hex')
      this._state.accounts[addressStr] = accountStr
    }
    const deleteCb = async (keyBuf: Buffer) => {
      const addressStr: HexPrefixedAddress = `0x${keyBuf.toString('hex')}`
      if (addressStr in this._state.accounts) {
        delete this._state.accounts[addressStr]
      }
    }
    this._cache = new Cache({ getCb, putCb, deleteCb })
  }

  public async initPreState(preState: State) {
    for (const addressStr in preState.accounts) {
      const address = Address.fromString(addressStr)
      const accountRLP = preState.accounts[addressStr]
      const account = Account.fromRlpSerializedAccount(Buffer.from(accountRLP, 'hex'))
      await this.putAccount(address, account)
    }
    // Set new pre-state
    this._preState = preState
    // Initialize the state with the pre-state
    this._state = preState
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  copy(): StateManager {
    return new StatelessVerkleStateManager({
      common: this._common,
    })
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Buffer): Promise<void> {}

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Buffer> {
    return Buffer.alloc(0)
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Promise<Buffer>} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Buffer` is returned.
   */
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    return Buffer.alloc(0)
  }

  /**
   * Adds value to the state for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {}

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {}

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._checkpoints.push(this._state)
    await super.checkpoint()
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    this._checkpoints.pop()
    await super.commit()
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    if (this._checkpoints.length === 0) {
      throw new Error('StatelessVerkleStateManager state cannot be reverted, no checkpoints set')
    }
    this._state = this._checkpoints.pop()!
    await super.revert()
  }

  /**
   * Gets the verkle root.
   * NOTE: this needs some examination in the code where this is needed
   * and if we have the verkle root present
   * @returns {Promise<Buffer>} - Returns the verkle root of the `StateManager`
   */
  async getStateRoot(): Promise<Buffer> {
    return Buffer.alloc(0)
  }

  /**
   * TODO: needed?
   * Maybe in this contex: reset to original pre state suffice
   * @param stateRoot - The verkle root to reset the instance to
   */
  async setStateRoot(stateRoot: Buffer): Promise<void> {}

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Address): Promise<StorageDump> {
    return { test: 'test' }
  }

  /**
   * Checks whether the current instance has the canonical genesis state
   * for the configured chain parameters.
   * @returns {Promise<boolean>} - Whether the storage trie contains the
   * canonical genesis state for the configured chain parameters.
   */
  async hasGenesisState(): Promise<boolean> {
    return false
  }

  /**
   * Checks if the `account` corresponding to `address`
   * exists
   * @param address - Address of the `account` to check
   */
  async accountExists(address: Address): Promise<boolean> {
    return false
  }
}
