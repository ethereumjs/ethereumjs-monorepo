import type { TrieOpts } from '../types'

export async function prepareTrieOpts(key: Uint8Array, opts?: TrieOpts) {
  const result: TrieOpts = { ...opts }

  if (result?.db !== undefined && result?.persistRoot === true) {
    if (result?.root === undefined) {
      result.root = (await result?.db.get(Buffer.from(key))) ?? undefined
    } else {
      await result?.db.put(Buffer.from(key), result.root)
    }
  }

  return result
}
