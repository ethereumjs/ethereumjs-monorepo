import { Address, Account } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { VmStateAccess } from '../types'
import { StateCache } from './stateCache'

export class StateDummy implements VmStateAccess {
  stateCache: StateCache

  constructor() {
    this.stateCache = new StateCache()
  }

  touchAccount(address: Address): void {
    if (!this.stateCache.accounts.has(address.toString())) {
      this.stateCache.accounts.set(address.toString(), new Account())
    }
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
    throw new Error('Method not implemented.')
  }
  async getOriginalContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    return this.stateCache.getOriginalContractStorage(address, key)
  }
  clearOriginalStorageCache(): void {}
  cleanupTouchedAccounts(): Promise<void> {
    throw new Error('Method not implemented.')
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
  async deleteAccount(address: Address): Promise<void> {
    this.stateCache.accounts.set(address.toString(), new Account())
  }
  async modifyAccountFields(
    address: Address,
    accountFields: Partial<Pick<Account, 'nonce' | 'balance' | 'stateRoot' | 'codeHash'>>
  ): Promise<void> {
    const account = await this.getAccount(address)
    account.nonce = accountFields.nonce ?? account.nonce
    account.balance = accountFields.balance ?? account.balance
    account.stateRoot = accountFields.stateRoot ?? account.stateRoot
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
    throw new Error('Method not implemented.')
  }
  setStateRoot(_stateRoot: Buffer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  hasStateRoot(_root: Buffer): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
