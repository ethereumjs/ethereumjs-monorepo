import { bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import { equalsBytes } from 'ethereum-cryptography/utils'
import { ROOT_DB_KEY } from '../../types'
import { TNode } from '../node/types'
import { TrieWithDB } from '../trieDB'

export async function _garbageCollect(this: TrieWithDB): Promise<void> {
  this.debug.extend('garbageCollect')(`Collecting`)
  const collected = [0, 0, 0]
  await this._withLock(async () => {
    const reachableHashes = await this.markReachableNodes(this.rootNode)
    for (const hash of this.cache.keys()) {
      if (!reachableHashes.has(bytesToPrefixedHexString(hash))) {
        collected[0]++
        this.cache.delete(hash)
      }
    }
    for await (const hash of this.database().keyIterator()) {
      if (equalsBytes(hexStringToBytes(hash), this.keySecure(ROOT_DB_KEY))) {
        continue
      }
      if (!reachableHashes.has(hash)) {
        collected[1]++
        await this.database().del(hexStringToBytes(hash))
      }
    }
  })
  this.debug.extend('garbageCollect')(
    `Collected: { map: ${collected[0]} cache: ${collected[1]} db: ${collected[2]} }`
  )
}

export async function _verifyPrunedIntegrity(this: TrieWithDB): Promise<boolean> {
  const reachableHashes = await this.markReachableNodes(this.rootNode)
  for await (const key of this.database().keyIterator()) {
    if (equalsBytes(hexStringToBytes(key), this.keySecure(ROOT_DB_KEY))) {
      continue
    }
    if (!reachableHashes.has(key)) {
      return false
    }
  }
  return true
}

export async function _markReachableNodes(
  this: TrieWithDB,
  node: TNode | null,
  reachableHashes: Set<string> = new Set()
): Promise<Set<string>> {
  if (node === null || node.getType() === 'NullNode') {
    return reachableHashes
  }
  reachableHashes.add(bytesToPrefixedHexString(node.hash()))
  if (node.type === 'BranchNode') {
    for await (const [, childNode] of node.getChildren()) {
      await this.markReachableNodes(childNode, reachableHashes)
    }
  } else if (node.type === 'ExtensionNode') {
    await this.markReachableNodes(node.child, reachableHashes)
  } else if (node.type === 'ProofNode') {
    node = await this.resolveProofNode(node)
    if (node.type === 'BranchNode') {
      for await (const [, childNode] of node.getChildren()) {
        await this.markReachableNodes(childNode, reachableHashes)
      }
    } else if (node.type === 'ExtensionNode') {
      await this.markReachableNodes(node.child, reachableHashes)
    }
  }
  return reachableHashes
}
