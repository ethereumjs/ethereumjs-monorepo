import Account from '@ethereumjs/account'

/**
 * Storage values of an account
 */
export interface StorageDump {
  [key: string]: string
}

export interface StateManager {
  copy(): StateManager
  getAccount(address: Buffer): Promise<Account>
  putAccount(address: Buffer, account: Account | null): Promise<void>
  deleteAccount(address: Buffer): Promise<void>
  touchAccount(address: Buffer): void
  putContractCode(address: Buffer, value: Buffer): Promise<void>
  getContractCode(address: Buffer): Promise<Buffer>
  getContractStorage(address: Buffer, key: Buffer): Promise<Buffer>
  getOriginalContractStorage(address: Buffer, key: Buffer): Promise<Buffer>
  putContractStorage(address: Buffer, key: Buffer, value: Buffer): Promise<void>
  clearContractStorage(address: Buffer): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  getStateRoot(): Promise<Buffer>
  setStateRoot(stateRoot: Buffer): Promise<void>
  dumpStorage(address: Buffer): Promise<StorageDump>
  hasGenesisState(): Promise<boolean>
  generateCanonicalGenesis(): Promise<void>
  generateGenesis(initState: any): Promise<void>
  accountIsEmpty(address: Buffer): Promise<boolean>
  accountExists(address: Buffer): Promise<boolean>
  cleanupTouchedAccounts(): Promise<void>
}
