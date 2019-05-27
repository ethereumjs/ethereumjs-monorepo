const promisify = require('util.promisify')
import Account from 'ethereumjs-account'
import { default as StateManager, StorageDump } from './stateManager'

export default class PStateManager {
  _wrapped: StateManager

  constructor(wrapped: StateManager) {
    this._wrapped = wrapped
  }

  copy(): PStateManager {
    return new PStateManager(this._wrapped.copy())
  }

  getAccount(addr: Buffer): Promise<Account> {
    return promisify(this._wrapped.getAccount.bind(this._wrapped))(addr)
  }

  putAccount(addr: Buffer, account: Account): Promise<void> {
    return promisify(this._wrapped.putAccount.bind(this._wrapped))(addr, account)
  }

  putContractCode(addr: Buffer, code: Buffer): Promise<void> {
    return promisify(this._wrapped.putContractCode.bind(this._wrapped))(addr, code)
  }

  getContractCode(addr: Buffer): Promise<Buffer> {
    return promisify(this._wrapped.getContractCode.bind(this._wrapped))(addr)
  }

  getContractStorage(addr: Buffer, key: Buffer): Promise<any> {
    return promisify(this._wrapped.getContractStorage.bind(this._wrapped))(addr, key)
  }

  putContractStorage(addr: Buffer, key: Buffer, value: Buffer): Promise<void> {
    return promisify(this._wrapped.putContractStorage.bind(this._wrapped))(addr, key, value)
  }

  clearContractStorage(addr: Buffer): Promise<void> {
    return promisify(this._wrapped.clearContractStorage.bind(this._wrapped))(addr)
  }

  checkpoint(): Promise<void> {
    return promisify(this._wrapped.checkpoint.bind(this._wrapped))()
  }

  commit(): Promise<void> {
    return promisify(this._wrapped.commit.bind(this._wrapped))()
  }

  revert(): Promise<void> {
    return promisify(this._wrapped.revert.bind(this._wrapped))()
  }

  getStateRoot(): Promise<Buffer> {
    return promisify(this._wrapped.getStateRoot.bind(this._wrapped))()
  }

  setStateRoot(root: Buffer): Promise<void> {
    return promisify(this._wrapped.setStateRoot.bind(this._wrapped))(root)
  }

  dumpStorage(address: Buffer): Promise<StorageDump> {
    return promisify(this._wrapped.dumpStorage.bind(this._wrapped))(address)
  }

  hasGenesisState(): Promise<boolean> {
    return promisify(this._wrapped.hasGenesisState.bind(this._wrapped))()
  }

  generateCanonicalGenesis(): Promise<void> {
    return promisify(this._wrapped.generateCanonicalGenesis.bind(this._wrapped))()
  }

  generateGenesis(initState: any): Promise<void> {
    return promisify(this._wrapped.generateGenesis.bind(this._wrapped))(initState)
  }

  accountIsEmpty(address: Buffer): Promise<boolean> {
    return promisify(this._wrapped.accountIsEmpty.bind(this._wrapped))(address)
  }

  cleanupTouchedAccounts(): Promise<void> {
    return promisify(this._wrapped.cleanupTouchedAccounts.bind(this._wrapped))()
  }
}
