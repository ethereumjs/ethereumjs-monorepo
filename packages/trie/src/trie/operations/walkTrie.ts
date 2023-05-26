import { bytesToPrefixedHexString } from '@ethereumjs/util'
import { FoundNodeFunction, WalkFilterFunction } from '../../types'
import { TNode } from '../node/types'
import { BranchNode } from '../node'
import { TrieWrap } from '../trieWrapper'
import { MerklePatriciaTrie } from '../merklePatricia'

// Experimental Walk Iterators

export async function* _walk(
  this: MerklePatriciaTrie,
  node: TNode | null,
  currentKey: number[] = [],
  onFound: FoundNodeFunction = async (_trieNode: TNode, _key: number[]) => {},
  filter: WalkFilterFunction = async (_trieNode: TNode, _key: number[]) => true
): AsyncIterable<{ node: TNode; currentKey: number[] }> {
  if (node === null) {
    return
  }
  if (await filter(node, currentKey)) {
    await onFound(node, currentKey)
    yield { node, currentKey }
  }
  switch (node.type) {
    case 'BranchNode': {
      for (const [nibble, childNode] of (node as BranchNode).childNodes().entries()) {
        const nextKey = [...currentKey, nibble]
        yield* this._walk(childNode, nextKey, onFound, filter)
      }
      break
    }
    case 'ExtensionNode': {
      const childNode = await this.getNode(node.child.hash(), this.debug.extend('_walk'))
      const nextKey = [...currentKey, ...node.keyNibbles]
      yield* this._walk(childNode, nextKey, onFound, filter)
      break
    }
    default:
      break
  }
}

export async function* walkTrie(
  this: TrieWrap,
  startNode: TNode | null = this.rootNode,
  _currentKey: number[] = [],
  onFound: FoundNodeFunction = async (_trieNode: TNode, _key: number[]) => {},
  filter: WalkFilterFunction = async (_trieNode: TNode, _key: number[]) => true
): AsyncIterable<TNode> {
  if (startNode === null) {
    return
  }
  type Task = {
    node: TNode
    fullKey: number[]
  }
  const tasks: Task[] = [
    {
      node: startNode,
      fullKey: _currentKey,
    },
  ]
  // Set to store hashes of visited nodes
  const visited = new Set<string>()
  while (tasks.length > 0) {
    const { node, fullKey } = tasks.pop()! // we know tasks.length > 0
    if (visited.has(node.hash().toString())) {
      // Skip this node as we have already visited it
      continue
    }
    visited.add(node.hash().toString())
    if (await filter(node, fullKey)) {
      await onFound(node, fullKey)
      yield node
    }
    switch (node.type) {
      case 'BranchNode': {
        for (const [nibble, childNode] of (node as BranchNode).childNodes().entries()) {
          const nextKey = [...fullKey, nibble]
          tasks.push({ node: childNode, fullKey: nextKey })
        }
        break
      }
      case 'ExtensionNode': {
        const childNode = await this.getNode(node.child.hash())
        const nextKey = [...fullKey, ...node.keyNibbles]
        tasks.push({ node: childNode, fullKey: nextKey })
        break
      }
      default:
        break
    }
  }
}

export async function* _walkTrieRecursively(
  this: TrieWrap,
  node: TNode | null,
  currentKey: number[] = [],
  onFound: FoundNodeFunction = async (_trieNode: TNode, _key: number[]) => {},
  filter: WalkFilterFunction = async (_trieNode: TNode, _key: number[]) => true,
  visited: Set<string> = new Set<string>() // Added visited set
): AsyncIterable<{ node: TNode; currentKey: number[] }> {
  if (node === null || visited.has(bytesToPrefixedHexString(node.hash()))) {
    return
  }
  visited.add(bytesToPrefixedHexString(node.hash()))
  if (await filter(node, currentKey)) {
    await onFound(node, currentKey)
    yield { node, currentKey }
  }
  switch (node.type) {
    case 'BranchNode': {
      for (const [nibble, childNode] of (node as BranchNode).childNodes().entries()) {
        const nextKey = [...currentKey, nibble]
        yield* this._walkTrieRecursively(childNode, nextKey, onFound, filter, visited)
      }
      break
    }
    case 'ExtensionNode': {
      const childNode = node.child
      const nextKey = [...currentKey, ...node.getPartialKey()]
      yield* this._walkTrieRecursively(childNode, nextKey, onFound, filter, visited)
      break
    }
    default:
      break
  }
}
