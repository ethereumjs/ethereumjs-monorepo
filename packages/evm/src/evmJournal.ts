import { Hardfork } from '@ethereumjs/common'
import { Address, RIPEMD160_ADDRESS_STRING } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { hexToBytes } from 'ethereum-cryptography/utils'

import { Journaling } from './journaling'

import type { Common, EVMStateManagerInterface } from '@ethereumjs/common'
import type { Account } from '@ethereumjs/util'
import type { Debugger } from 'debug'

export class EvmJournal {
  private touchedJournal: Journaling<string>
  private stateManager: EVMStateManagerInterface
  private common: Common
  private DEBUG: boolean
  private _debug: Debugger

  constructor(stateManager: EVMStateManagerInterface, common: Common) {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    this.DEBUG = process?.env?.DEBUG?.includes('ethjs') ?? false
    this._debug = createDebugLogger('statemanager:statemanager')

    this.touchedJournal = new Journaling<string>()
    this.stateManager = stateManager
    this.common = common
  }

  async putAccount(address: Address, account: Account | undefined) {
    this.touchAccount(address)
    return this.stateManager.putAccount(address, account)
  }

  async deleteAccount(address: Address) {
    this.touchAccount(address)
    await this.stateManager.deleteAccount(address)
  }

  private touchAccount(address: Address): void {
    this.touchedJournal.addJournalItem(address.toString().slice(2))
  }

  async commit() {
    this.touchedJournal.commit()
    await this.stateManager.commit()
  }

  async checkpoint() {
    this.touchedJournal.checkpoint()
    await this.stateManager.checkpoint()
  }

  async revert() {
    this.touchedJournal.revert(RIPEMD160_ADDRESS_STRING)
    await this.stateManager.revert()
  }

  /**
   * Removes accounts form the state trie that have been touched,
   * as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   */
  async cleanupTouchedAccounts(): Promise<void> {
    if (this.common.gteHardfork(Hardfork.SpuriousDragon) === true) {
      const touchedArray = Array.from(this.touchedJournal.journal)
      for (const addressHex of touchedArray) {
        const address = new Address(hexToBytes(addressHex))
        const empty = await this.stateManager.accountIsEmptyOrNonExistent(address)
        if (empty) {
          await this.deleteAccount(address)
          if (this.DEBUG) {
            this._debug(`Cleanup touched account address=${address} (>= SpuriousDragon)`)
          }
        }
      }
    }
    this.touchedJournal.clear()
  }
}
