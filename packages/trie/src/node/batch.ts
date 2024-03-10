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

export async function _put(
  trie: Trie,
  key: Uint8Array,
  value: Uint8Array,
  skipKeyTransform: boolean = false,
  path?: { stack: TrieNode[]; remaining: number[] }
) {
  const appliedKey = skipKeyTransform ? key : trie['appliedKey'](key)
  const { remaining, stack } = path ?? (await trie.findPath(appliedKey))
  let ops: BatchDBOp[] = []
  if (trie['_opts'].useNodePruning) {
    const val = await trie.get(appliedKey)
    if (val === null || equalsBytes(val, value) === false) {
      const deleteHashes = stack.map((e) => trie['hash'](e.serialize()))
      ops = deleteHashes.map((e) => {
        const key = trie['_opts'].keyPrefix ? concatBytes(trie['_opts'].keyPrefix, e) : e
        return {
          type: 'del',
          key,
          opts: {
            keyEncoding: KeyEncoding.Bytes,
          },
        }
      })
    }
  }
  const returnStack = await trie['_updateNode'](appliedKey, value, remaining, stack)
  if (trie['_opts'].useNodePruning) {
    await trie['_db'].batch(ops)
  }
  return returnStack
}

export async function _del(
  trie: Trie,
  key: Uint8Array,
  skipKeyTransform: boolean = false
): Promise<TrieNode[]> {
  await trie['_lock'].acquire()
  const appliedKey = skipKeyTransform ? key : trie['appliedKey'](key)
  const { node, stack } = await trie.findPath(appliedKey)
  let ops: BatchDBOp[] = []
  if (trie['_opts'].useNodePruning && node !== null) {
    const deleteHashes = stack.map((e) => trie['hash'](e.serialize()))
    ops = deleteHashes.map((e) => {
      const key = trie['_opts'].keyPrefix ? concatBytes(trie['_opts'].keyPrefix, e) : e
      return {
        type: 'del',
        key,
        opts: {
          keyEncoding: KeyEncoding.Bytes,
        },
      }
    })
  }
  if (node) {
    await trie['_deleteNode'](appliedKey, stack)
  }
  if (trie['_opts'].useNodePruning) {
    await trie['_db'].batch(ops)
  }
  await trie.persistRoot()
  trie['_lock'].release()
  return stack
}
export async function batchPut(
  trie: Trie,
  key: Uint8Array,
  value: Uint8Array | null,
  skipKeyTransform: boolean = false,
  stack: TrieNode[] = [],
  remaining: number[] = []
): Promise<TrieNode[]> {
  if (trie['_opts'].useRootPersistence && equalsBytes(key, ROOT_DB_KEY) === true) {
    throw new Error(`Attempted to set '${bytesToUtf8(ROOT_DB_KEY)}' key but it is not allowed.`)
  }
  let _stack: TrieNode[]
  const path =
    stack.length > 0
      ? {
          stack,
          remaining,
        }
      : undefined
  if (value === null || value.length === 0) {
    return _del(trie, key, skipKeyTransform)
  }
  await trie['_lock'].acquire()
  const appliedKey = skipKeyTransform ? key : trie['appliedKey'](key)
  if (equalsBytes(trie.root(), trie.EMPTY_TRIE_ROOT) === true) {
    _stack = [await trie['_createInitialNode'](appliedKey, value)]
  } else {
    _stack = await _put(trie, appliedKey, value, skipKeyTransform, path)
  }
  await trie.persistRoot()
  trie['_lock'].release()
  return _stack
}

export async function _batch(
  trie: Trie,
  ops: BatchDBOp[],
  skipKeyTransform?: boolean
): Promise<void> {
  const sortedOps = orderBatch(ops)
  let stack: TrieNode[] = []
  const stackPathCache: Map<string, TrieNode> = new Map()
  for (const op of sortedOps) {
    const nibbles = bytesToNibbles(op.key)
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
    if (op.type === 'put') {
      if (op.value === null || op.value === undefined) {
        throw new Error('Invalid batch db operation')
      }
      stack = await batchPut(trie, op.key, op.value, skipKeyTransform, stack, remaining)
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
      await trie.del(op.key, skipKeyTransform)
    }
  }
  await trie.persistRoot()
}
