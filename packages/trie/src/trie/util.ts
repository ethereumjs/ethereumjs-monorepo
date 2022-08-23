import { keccak256 } from 'ethereum-cryptography/keccak'

import { ROOT_DB_KEY } from '../types'

import type { TrieOpts } from '../types'

export async function prepareTrieOpts(opts?: TrieOpts) {
  const result: TrieOpts = { ...opts }

  const secure = opts?.useHashedKeys ?? false
  let key = ROOT_DB_KEY
  if (secure === true) {
    const hash = opts?.useHashedKeysFunction ?? keccak256
    key = hash(ROOT_DB_KEY) as Buffer
  }

  if (result?.db !== undefined && result?.persistRoot === true) {
    if (result?.root === undefined) {
      result.root = (await result?.db.get(Buffer.from(key))) ?? undefined
    } else {
      await result?.db.put(Buffer.from(key), result.root)
    }
  }

  return result
}
