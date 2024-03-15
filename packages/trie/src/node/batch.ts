import { type BatchDBOp } from '@ethereumjs/util'

import { type TrieNode } from '../types.js'
import { bytesToNibbles, nibblesCompare } from '../util/nibbles.js'

import { BranchNode } from './branch.js'

import type { Trie } from '../trie.js'

export function orderBatch(
  ops: BatchDBOp[],
  keyTransform: (msg: Uint8Array) => Uint8Array = (msg: Uint8Array) => {
    return msg
  }
): BatchDBOp[] {
  const keyNibbles: [number, number[]][] = ops.map((o, i) => {
    const appliedKey = keyTransform(o.key)
    const nibbles: number[] = bytesToNibbles(appliedKey)
    return [i, nibbles]
  })
  keyNibbles.sort(([_, a], [__, b]) => {
    return nibblesCompare(a, b)
  })
  return keyNibbles.map(([i, _]) => ops[i])
}

export async function _batch(
  trie: Trie,
  ops: BatchDBOp[],
  skipKeyTransform?: boolean
): Promise<void> {
  const keyTransform =
    skipKeyTransform === true
      ? undefined
      : (msg: Uint8Array) => {
          return trie['appliedKey'](msg)
        }
  const sortedOps = orderBatch(ops, keyTransform)
  let stack: TrieNode[] = []
  const stackPathCache: Map<string, TrieNode> = new Map()
  for (const op of sortedOps) {
    const appliedKey = skipKeyTransform === true ? op.key : trie['appliedKey'](op.key)
    const nibbles = bytesToNibbles(appliedKey)
    stack = []
    let remaining = nibbles
    for (let i = 0; i < nibbles.length; i++) {
      const p: string = JSON.stringify(nibbles.slice(0, i) as number[])
      if (stackPathCache.has(p)) {
        const node = stackPathCache.get(p)!
        stack.push(node)
        remaining = nibbles.slice(i)
      }
    }
    const _path =
      stack.length > 0
        ? {
            stack,
            remaining,
          }
        : undefined
    if (op.type === 'put') {
      stack = await trie.put(op.key, op.value, skipKeyTransform, _path)
      const path: number[] = []
      for (const node of stack) {
        stackPathCache.set(JSON.stringify([...path]), node)
        if (node instanceof BranchNode) {
          path.push(nibbles.shift()!)
        } else {
          path.push(...nibbles.splice(0, node.keyLength()))
        }
      }
    } else if (op.type === 'del') {
      stack = await trie.put(op.key, null, skipKeyTransform, _path)
      const path: number[] = []
      for (const node of stack) {
        stackPathCache.set(JSON.stringify([...path]), node)
        if (node instanceof BranchNode) {
          path.push(nibbles.shift()!)
        } else {
          path.push(...nibbles.splice(0, node.keyLength()))
        }
      }
    }
  }
}
