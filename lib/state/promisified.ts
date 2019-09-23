const promisify = require('util.promisify')
import Account from 'ethereumjs-account'
import { default as StateManager, StorageDump } from './stateManager'

/**
 * Promisified wrapper around [[StateManager]]
 * @ignore
 */
export default class PStateManager {
  _wrapped: StateManager

  public readonly getAccount: (addr: Buffer) => Promise<Account>
  public readonly putAccount: (addr: Buffer, account: Account) => Promise<void>
  public readonly putContractCode: (addr: Buffer, code: Buffer) => Promise<void>
  public readonly getContractCode: (addr: Buffer) => Promise<Buffer>
  public readonly getContractStorage: (addr: Buffer, key: Buffer) => Promise<any>
  public readonly getOriginalContractStorage: (addr: Buffer, key: Buffer) => Promise<any>
  public readonly putContractStorage: (addr: Buffer, key: Buffer, value: Buffer) => Promise<void>
  public readonly clearContractStorage: (addr: Buffer) => Promise<void>
  public readonly checkpoint: () => Promise<void>
  public readonly commit: () => Promise<void>
  public readonly revert: () => Promise<void>
  public readonly getStateRoot: () => Promise<Buffer>
  public readonly setStateRoot: (root: Buffer) => Promise<void>
  public readonly dumpStorage: (address: Buffer) => Promise<StorageDump>
  public readonly hasGenesisState: () => Promise<boolean>
  public readonly generateCanonicalGenesis: () => Promise<void>
  public readonly generateGenesis: (initState: any) => Promise<void>
  public readonly accountIsEmpty: (address: Buffer) => Promise<boolean>
  public readonly cleanupTouchedAccounts: () => Promise<void>

  constructor(wrapped: StateManager) {
    this._wrapped = wrapped

    // We cache these promisified function as they are called lots of times during the VM execution,
    // and promisifying them each time has degrades its performance.
    this.getAccount = promisify(this._wrapped.getAccount.bind(this._wrapped))

    this.putAccount = promisify(this._wrapped.putAccount.bind(this._wrapped))

    this.putContractCode = promisify(this._wrapped.putContractCode.bind(this._wrapped))

    this.getContractCode = promisify(this._wrapped.getContractCode.bind(this._wrapped))

    this.getContractStorage = promisify(this._wrapped.getContractStorage.bind(this._wrapped))

    this.getOriginalContractStorage = promisify(
      this._wrapped.getOriginalContractStorage.bind(this._wrapped),
    )

    this.putContractStorage = promisify(this._wrapped.putContractStorage.bind(this._wrapped))

    this.clearContractStorage = promisify(this._wrapped.clearContractStorage.bind(this._wrapped))

    this.checkpoint = promisify(this._wrapped.checkpoint.bind(this._wrapped))

    this.commit = promisify(this._wrapped.commit.bind(this._wrapped))

    this.revert = promisify(this._wrapped.revert.bind(this._wrapped))

    this.getStateRoot = promisify(this._wrapped.getStateRoot.bind(this._wrapped))

    this.setStateRoot = promisify(this._wrapped.setStateRoot.bind(this._wrapped))

    this.dumpStorage = promisify(this._wrapped.dumpStorage.bind(this._wrapped))

    this.hasGenesisState = promisify(this._wrapped.hasGenesisState.bind(this._wrapped))

    this.generateCanonicalGenesis = promisify(
      this._wrapped.generateCanonicalGenesis.bind(this._wrapped),
    )

    this.generateGenesis = promisify(this._wrapped.generateGenesis.bind(this._wrapped))

    this.accountIsEmpty = promisify(this._wrapped.accountIsEmpty.bind(this._wrapped))

    this.cleanupTouchedAccounts = promisify(
      this._wrapped.cleanupTouchedAccounts.bind(this._wrapped),
    )
  }

  copy(): PStateManager {
    return new PStateManager(this._wrapped.copy())
  }
}
