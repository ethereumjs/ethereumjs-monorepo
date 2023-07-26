import { Account } from '@ethereumjs/util'
import path from 'path'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

/**
 * Returns a single file from the ethereum-tests git submodule
 * @param file
 */
export function getSingleFile(file: string) {
  return require(path.join(path.resolve('../ethereum-tests'), file))
}
