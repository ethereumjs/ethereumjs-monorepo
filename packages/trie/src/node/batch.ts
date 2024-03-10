import {
  type BatchDBOp,
  KeyEncoding,
  bytesToUtf8,
  concatBytes,
  equalsBytes,
} from '@ethereumjs/util'

import { ROOT_DB_KEY, type TrieNode } from '../types.js'
import { bytesToNibbles, nibblesCompare } from '../util/nibbles.js'

import { BranchNode } from './branch.js'

import type { Trie } from '../trie.js'

export function orderBatch(ops: BatchDBOp[]): BatchDBOp[] {
  const keyNibbles: [number, number[]][] = ops.map((o, i) => {
    const nibbles: number[] = bytesToNibbles(o.key)
    return [i, nibbles]
  })
  keyNibbles.sort(([_, a], [__, b]) => {
    return nibblesCompare(a, b)
  })
  return keyNibbles.map(([i, _]) => ops[i])
}
