import { bytesToPrefixedHexString } from '@ethereumjs/util'

import { bytesToNibbles, doKeysMatch } from '../../util/nibbles'
import { NullNode } from '../node'

import type { TNode } from '../node/types'
import type { MerklePatriciaTrie } from '../merklePatricia'
import type { BranchNode, ExtensionNode, LeafNode } from '../node'
import type { Debugger } from 'debug'

export type WalkResult = {
  node: TNode
  path: TNode[]
  remainingNibbles: number[]
}
export async function _getNodePath(
  this: MerklePatriciaTrie,
  key: Uint8Array,
  debug: Debugger
): Promise<WalkResult> {
  debug = debug.extend('_getNodePath')
  let nibbleIndex = 0
  let currentNode: TNode = this.rootNode
  const keyNibbles = bytesToNibbles(key)
  const path = []
  debug(`key: ${bytesToPrefixedHexString(key)}`)
  debug(`(root): ${currentNode.getType()} [${currentNode.getPartialKey()}]`)
  debug(`to_get: [${keyNibbles}]`)
  while (currentNode.type !== 'NullNode') {
    debug = debug.extend(currentNode.getType())
    debug(`Pushing node to path`)
    path.push(currentNode)
    let childIndex: number | undefined
    let childNode: TNode | undefined
    let nodeNibbles: number[]
    let sharedNibbles: number[]
    switch (currentNode.type) {
      case 'BranchNode':
        childIndex = keyNibbles[nibbleIndex]
        debug(`looking in branch index [${keyNibbles[nibbleIndex]}]`)
        if (childIndex === undefined) {
          debug(`Child index is undefined, returning`)
          return { node: currentNode as BranchNode, path, remainingNibbles: [] }
        }
        childNode = (currentNode as BranchNode).getChild(childIndex)
        debug.extend(`${childIndex}`)(`found ${childNode?.getType()}`)
        if (!childNode) {
          debug.extend(`${childIndex}`)(`Child not found, returning`)
          return { node: currentNode, path, remainingNibbles: keyNibbles.slice(nibbleIndex) }
        } else {
          nibbleIndex++
          currentNode = childNode
        }
        break
      case 'ExtensionNode':
        currentNode = currentNode as ExtensionNode
        nodeNibbles = currentNode.getPartialKey()
        sharedNibbles = keyNibbles.slice(nibbleIndex, nibbleIndex + nodeNibbles.length)
        debug(`node nibbles: ${nodeNibbles}`)
        debug(`sharedNibbles: ${sharedNibbles}`)
        if (doKeysMatch(nodeNibbles, sharedNibbles)) {
          debug(`Shared nibbles match entirely.`)
          nibbleIndex += nodeNibbles.length
          if (nibbleIndex === keyNibbles.length) {
            debug(`Reached end of key.`)
            return { node: currentNode.child, path, remainingNibbles: [] }
          }
          currentNode = (currentNode as ExtensionNode).child
        } else {
          debug.extend(currentNode.getType())(`Shared nibbles do not match.`)
          return {
            node: new NullNode({ hashFunction: this.hashFunction }),
            path,
            remainingNibbles: keyNibbles.slice(nibbleIndex),
          }
        }
        break
      case 'LeafNode':
        if (doKeysMatch(keyNibbles.slice(nibbleIndex), (currentNode as LeafNode).getPartialKey())) {
          debug.extend(currentNode.getType())(`Nibbles Match`)
          return { node: currentNode as LeafNode, path, remainingNibbles: [] }
        } else {
          debug(`Nibbles Do Not Match`)
          return {
            node: new NullNode({ hashFunction: this.hashFunction }),
            path,
            remainingNibbles: keyNibbles.slice(nibbleIndex),
          }
        }
      case 'ProofNode':
        currentNode = (await currentNode.load()) ?? currentNode
        if (currentNode.getType() === 'ProofNode') {
          this.debug('Cannot resolve ProofNode')
          return { node: currentNode, path, remainingNibbles: keyNibbles.slice(nibbleIndex) }
        }
    }
    debug(`NextNode: ${currentNode.getType()}: [${currentNode.getPartialKey()}]`)
  }
  debug(`Returning NullNode`)
  return {
    node: new NullNode({ hashFunction: this.hashFunction }),
    path,
    remainingNibbles: keyNibbles.slice(nibbleIndex),
  }
}
