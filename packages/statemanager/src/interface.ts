import type { Proof } from './stateManager'
import type { Account, Address } from '@ethereumjs/util'

/**
 * Storage values of an account
 */
export interface StorageDump {
  [key: string]: string
}

export type AccountFields = Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>
export type AccountId = Address | Buffer

export interface StateAccess {
  accountExists(address: AccountId): Promise<boolean>
  getAccount(address: AccountId): Promise<Account>
  putAccount(address: AccountId, account: Account): Promise<void>
  accountIsEmpty(address: AccountId): Promise<boolean>
  deleteAccount(address: AccountId): Promise<void>
  modifyAccountFields(address: AccountId, accountFields: AccountFields): Promise<void>
  putContractCode(address: AccountId, value: Buffer): Promise<void>
  getContractCode(address: AccountId): Promise<Buffer>
  getContractStorage(address: AccountId, key: Buffer): Promise<Buffer>
  putContractStorage(address: AccountId, key: Buffer, value: Buffer): Promise<void>
  clearContractStorage(address: AccountId): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  getStateRoot(): Promise<Buffer>
  setStateRoot(stateRoot: Buffer): Promise<void>
  getProof?(address: AccountId, storageSlots: Buffer[]): Promise<Proof>
  verifyProof?(proof: Proof): Promise<boolean>
  hasStateRoot(root: Buffer): Promise<boolean>
}

export interface StateManager extends StateAccess {
  copy(): StateManager
  flush(): Promise<void>
  dumpStorage(address: AccountId): Promise<StorageDump>
}
