import type { TrieOpts } from '../types'

export async function prepareTrieOpts(key: Uint8Array, opts?: TrieOpts) {
  const result: TrieOpts = { ...opts }

  if (opts?.db !== undefined && opts?.persistRoot === true) {
    if (opts?.root === undefined) {
      opts.root = (await opts?.db.get(Buffer.from(key))) ?? undefined
    } else {
      await opts?.db.put(Buffer.from(key), opts.root)
    }
  }

  return result
}
