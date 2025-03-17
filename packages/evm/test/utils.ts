import path from 'path'
import { Account } from '@ethereumjs/util'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

/**
 * Returns a single file from the ethereum-tests git submodule
 * @param file
 */
export function getSingleFile(file: string) {
  // TODO: Evaluate if we can get rid of the require, either by switching to async imports or to the createRequire module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(path.resolve('../ethereum-tests'), file))
}
