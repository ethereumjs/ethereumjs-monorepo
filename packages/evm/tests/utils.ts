import Blockchain from '../../blockchain/src'
import Common, { Chain } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account } from '@ethereumjs/util'
import path from 'path'
import EEI from '../../vm/src/eei/eei'

export async function getEEI() {
  return new EEI(
    new DefaultStateManager(),
    new Common({ chain: Chain.Mainnet }),
    await Blockchain.create()
  )
}

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

/**
 * Checks if in a karma test runner.
 * @returns boolean whether running in karma
 */
export function isRunningInKarma(): Boolean {
  // eslint-disable-next-line no-undef
  return typeof (<any>globalThis).window !== 'undefined' && (<any>globalThis).window.__karma__
}

/**
 * Returns a single file from the ethereum-tests git submodule
 * @param file
 */
export function getSingleFile(file: string) {
  return require(path.join(path.resolve('../ethereum-tests'), file))
}
