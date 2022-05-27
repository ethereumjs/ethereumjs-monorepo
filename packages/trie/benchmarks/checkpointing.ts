import { pseudoRandomBytes } from 'crypto'
import { CheckpointTrie, DB } from '../dist'

export const iterTest = async (db: DB, numOfIter: number) => {
  const keys: Buffer[] = []
  const vals: Buffer[] = []

  for (let i = 0; i <= numOfIter; i++) {
    keys.push(pseudoRandomBytes(32))
    vals.push(pseudoRandomBytes(32))
  }

  const trie = new CheckpointTrie({ db })

  for (let i = 0; i < numOfIter; i++) {
    trie.checkpoint()
    await trie.put(keys[i], vals[i])
    await trie.commit()
  }
}
