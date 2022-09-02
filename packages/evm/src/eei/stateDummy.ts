import { Account, Address } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { StateCache } from './stateCache'

import type { EVMStateAccess } from '../types'

export class StateDummy implements EVMStateAccess {
  stateCache: StateCache

  // TODO, most likely state deletes + account deletes are not handled very well
  // Especially account exists is a problem, cannot put empty account, because it is
  // either empty or deleted
  constructor() {
    this.stateCache = new StateCache()
  }

  touchAccount(_address: Address): void {
    this.stateCache.touchedAccounts.add(_address.toString())
  }
  addWarmedAddress(address: Buffer): void {
    this.stateCache.warmAddresses.add(new Address(address).toString())
  }
  isWarmedAddress(address: Buffer): boolean {
    return this.stateCache.isWarmedAddress(new Address(address))
  }
  addWarmedStorage(address: Buffer, slot: Buffer): void {
    this.stateCache.addWarmedStorage(new Address(address), slot)
  }
  isWarmedStorage(address: Buffer, slot: Buffer): boolean {
    return this.stateCache.isWarmedStorage(new Address(address), slot)
  }
  clearWarmedAccounts(): void {
    if (this.stateCache._warmAddresses.length !== 1) {
      throw new Error('cannot clear warmed accounts if cache is not at top level')
    }
    this.stateCache._warmAddresses = [new Set<string>()]
  }
  async getOriginalContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    return this.stateCache.getOriginalContractStorage(address, key)
  }
  clearOriginalStorageCache(): void {
    if (this.stateCache._storage.length !== 1) {
      throw new Error('cannot clear storage accounts if cache is not at top level')
    }
    this.stateCache._storage = [new Map()]
  }
  async cleanupTouchedAccounts(): Promise<void> {
    if (this.stateCache._touchedAccounts.length !== 1) {
      throw new Error('cannot clear touched accounts if cache is not at top level')
    }
    for (const addressString of this.stateCache.touchedAccounts) {
      const address = Address.fromString(addressString)
      await this.deleteAccount(address)
    }
    this.stateCache._touchedAccounts = [new Set()]
  }
  generateCanonicalGenesis(_initState: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async accountExists(address: Address): Promise<boolean> {
    return this.stateCache.getAccount(address, true) !== undefined
  }
  async getAccount(address: Address): Promise<Account> {
    return this.stateCache.getAccount(address) ?? new Account()
  }
  async putAccount(address: Address, account: Account): Promise<void> {
    this.stateCache.accounts.set(address.toString(), account)
  }
  async accountIsEmpty(address: Address): Promise<boolean> {
    return (await this.getAccount(address)).isEmpty()
  }
  async deleteAccount(_address: Address): Promise<void> {
    /**
     * TODO necessary for selfdestruct cleanups
     */
    throw new Error('Method not implemented.')
  }
  async modifyAccountFields(
    address: Address,
    accountFields: Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>
  ): Promise<void> {
    const account = await this.getAccount(address)
    account.nonce = accountFields.nonce ?? account.nonce
    account.balance = accountFields.balance ?? account.balance
    account.storageRoot = accountFields.storageRoot ?? account.storageRoot
    account.codeHash = accountFields.codeHash ?? account.codeHash
    await this.putAccount(address, account)
  }
  async putContractCode(address: Address, value: Buffer): Promise<void> {
    const codeHash = Buffer.from(keccak256(value))
    await this.modifyAccountFields(address, { codeHash })
    this.stateCache.setCode(value, codeHash)
  }
  async getContractCode(address: Address): Promise<Buffer> {
    const hash = (await this.getAccount(address)).codeHash
    return this.stateCache.getCode(hash) ?? Buffer.from('')
  }
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    return this.stateCache.getStorage(address, key)
  }
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    await this.stateCache.putContractStorage(address, key, value)
  }
  async clearContractStorage(address: Address): Promise<void> {
    await this.stateCache.clearContractStorage(address)
  }
  async checkpoint(): Promise<void> {
    this.stateCache.checkpoint()
  }
  async commit(): Promise<void> {
    this.stateCache.commit()
  }
  async revert(): Promise<void> {
    this.stateCache.revert()
  }
  getStateRoot(): Promise<Buffer> {
    /**
     * TODO
     * This is technically possible. We have a flat map of accounts and storages
     * If we create an internal Trie interface, then first setRoot(empty state root) and
     * then first generate each storage trie (to get storage root). Set this for each account
     * Set the codeHash for each account (can be directly read)
     * Finally, get the nonce and balance from the accounts, merge the balance
     * Now all the accounts for the trie have been generated. Dump those in the empty trie
     * Now you have the root
     * Note: this only works if we start with an empty state
     */
    throw new Error('Method not implemented.')
  }
  setStateRoot(_stateRoot: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  hasStateRoot(_root: Buffer): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
