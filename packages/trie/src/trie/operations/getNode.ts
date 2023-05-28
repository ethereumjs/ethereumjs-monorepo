import { bytesToPrefixedHexString, bytesToUtf8 } from '@ethereumjs/util'

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
  debug(`key: ${bytesToUtf8(key)}`)
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
        currentNode = currentNode as BranchNode
        debug(
          `children: ${[...currentNode.childNodes().entries()].map(
            ([k, node]) => `[${k}] => ${node.getType()}`
          )}`
        )
        childIndex = keyNibbles[nibbleIndex]
        if (childIndex === undefined) {
          debug(`Child at index ${nibbleIndex} is undefined, returning`)
          return {
            node: currentNode as BranchNode,
            path,
            remainingNibbles: keyNibbles.slice(nibbleIndex),
          }
        }
        debug(
          `navigating to ${currentNode.getChild(nibbleIndex)?.getType()} at index [${
            keyNibbles[nibbleIndex]
          }]`
        )
        childNode = (currentNode as BranchNode).getChild(childIndex)
        debug = debug.extend(`[${childIndex}]`)
        debug(`found ${childNode?.getType()}`)
        if (!childNode) {
          debug.extend(`${childIndex}`)(`Child not found, returning`)
          return { node: currentNode, path, remainingNibbles: keyNibbles.slice(nibbleIndex) }
        } else {
          nibbleIndex++
          currentNode = childNode
        }
        break
      case 'ExtensionNode':
        debug = debug.extend(`[${currentNode.getPartialKey()}]`)
        currentNode = currentNode as ExtensionNode
        nodeNibbles = currentNode.getPartialKey()
        sharedNibbles = keyNibbles.slice(nibbleIndex, nibbleIndex + nodeNibbles.length)
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
        currentNode = currentNode as LeafNode
        if (doKeysMatch(keyNibbles.slice(nibbleIndex), currentNode.getPartialKey())) {
          debug.extend(currentNode.getType())(`Nibbles Match`)
          return { node: currentNode, path, remainingNibbles: [] }
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
          this.debug(`Can't resolve ProofNode with nibbles${currentNode.getPartialKey()}`)
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
