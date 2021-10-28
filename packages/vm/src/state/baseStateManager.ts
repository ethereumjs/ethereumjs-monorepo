import Common, { Chain, Hardfork } from '@ethereumjs/common'
import  { debug as createDebugLogger, Debugger } from 'debug'
import { Account, Address } from 'ethereumjs-util'
import Cache from './cache'
import { DefaultStateManagerOpts } from './stateManager'

type AddressHex = string

/**
 * BaseStateManager implementation for the non-storage-backend
 * related functionality parts of a StateManager like keeping
 * track of accessed storage (`EIP-2929`) or touched accounts
 * (`EIP-158`).
 *
 * This is not a full StateManager implementation in itself but
 * can be used to ease implementing an own StateManager.
 *
 * Note that the implementation is pretty new (October 2021)
 * and we cannot guarantee a stable interface yet.
 */
export class BaseStateManager {
  _common: Common
  _debug: Debugger
  _cache!: Cache

  _touched: Set<AddressHex>
  _touchedStack: Set<AddressHex>[]

  /**
   * StateManager is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  constructor(opts: DefaultStateManagerOpts) {
    let common = opts.common
    if (!common) {
      common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    }
    this._common = common

    this._touched = new Set()
    this._touchedStack = []

    // Safeguard if "process" is not available (browser)
    if (process !== undefined && process.env.DEBUG) {
      this.DEBUG = true
    }
    this._debug = createDebugLogger('vm:state')
  }

  /**
   * Gets the account associated with `address`. Returns an empty account if the account does not exist.
   * @param address - Address of the `account` to get
   */
   async getAccount(address: Address): Promise<Account> {
    const account = await this._cache.getOrLoad(address)
    return account
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store
   */
   async putAccount(address: Address, account: Account): Promise<void> {
    if (this.DEBUG) {
      this._debug(
        `Save account address=${address} nonce=${account.nonce} balance=${
          account.balance
        } contract=${account.isContract() ? 'yes' : 'no'} empty=${account.isEmpty() ? 'yes' : 'no'}`
      )
    }
    this._cache.put(address, account)
    this.touchAccount(address)
  }

  /**
   * Marks an account as touched, according to the definition
   * in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
   * This happens when the account is triggered for a state-changing
   * event. Touched accounts that are empty will be cleared
   * at the end of the tx.
   */
   touchAccount(address: Address): void {
    this._touched.add(address.buf.toString('hex'))
  }
}
