import { bytesToPrefixedHexString } from '@ethereumjs/util'

import { findCommonPrefix, getSharedNibbles } from '../../util/nibbles'
import { BranchNode, ExtensionNode, LeafNode } from '../node'

import { _cleanupNode } from './cleanup'

import type { NodeType, TNode } from '../node/types'
import type { MerklePatriciaTrie } from '../merklePatricia'
import type { Debugger } from 'debug'

export async function _insertAtNode(
  this: MerklePatriciaTrie,
  node: TNode,
  keyNibbles: number[],
  value: Uint8Array | null,
  debug: Debugger
): Promise<TNode> {
  const type = node.type ?? 'NullNode'
  debug.extend('_insertAtNode')(`inserting node:${keyNibbles}`)
  debug.extend('_insertAtNode')(`at ${node.getType()}: ${node.getPartialKey()}`)
  debug = debug.extend('_insertAtNode').extend(type)
  const _insert: {
    [type in NodeType]: () => Promise<TNode>
  } = {
    NullNode: async (): Promise<LeafNode> => {
      debug(`inserting into NullNode`)
      return new LeafNode({ key: keyNibbles, value, hashFunction: this.hashFunction })
    },
    LeafNode: async (): Promise<TNode> => {
      const toReplace = node as LeafNode
      const toReplaceNibbles = toReplace.getPartialKey()
      const { commonPrefix, remainingNibbles1, remainingNibbles2 } = findCommonPrefix(
        keyNibbles,
        toReplaceNibbles
      )
      const remainingNibblesNew = remainingNibbles1
      const remainingNibblesOld = remainingNibbles2
      if (remainingNibblesNew.length === 0 && remainingNibblesOld.length === 0) {
        debug(`inserting into LeafNode with same key`)
        return new LeafNode({ key: keyNibbles, value, hashFunction: this.hashFunction })
      } else {
        debug(`inserting into LeafNode with different key`)
        debug(`remainingNibblesOld: [${remainingNibblesOld}]`)
        debug(`remainingNibblesNew: [${remainingNibblesNew}]`)
        const branchNode = new BranchNode({ hashFunction: this.hashFunction, value: null })
        if (remainingNibblesOld.length === 0) {
          debug(`splitting LeafNode into BranchNode with child on branch ${remainingNibblesNew[0]}`)
          await branchNode.updateValue(toReplace.getValue())
          branchNode.setChild(
            remainingNibblesNew[0],
            new LeafNode({
              key: remainingNibblesNew.slice(1),
              value,
              hashFunction: this.hashFunction,
            })
          )
        } else if (remainingNibblesNew.length === 0) {
          debug(`splitting LeafNode into BranchNode with child on branch ${remainingNibblesOld[0]}`)
          await branchNode.updateValue(value)
          branchNode.setChild(
            remainingNibblesOld[0],
            new LeafNode({
              key: remainingNibblesOld.slice(1),
              value: toReplace.getValue(),
              hashFunction: this.hashFunction,
            })
          )
        } else {
          debug(
            `splitting LeafNode into BranchNode with children on branches ${remainingNibblesNew[0]} and ${remainingNibblesOld[0]}`
          )
          debug.extend('BranchNode')(
            `[${remainingNibblesOld[0]}] [${remainingNibblesOld.slice(1)}]`
          )
          debug.extend('BranchNode')(
            `[${remainingNibblesNew[0]}] [${remainingNibblesNew.slice(1)}]`
          )
          branchNode.setChild(
            remainingNibblesOld[0],
            await toReplace.updateKey(remainingNibblesOld.slice(1))
          )
          branchNode.setChild(
            remainingNibblesNew[0],
            new LeafNode({
              key: remainingNibblesNew.slice(1),
              value,
              hashFunction: this.hashFunction,
            })
          )
        }
        // If there's a common prefix, create an extension node.
        if (commonPrefix.length > 0) {
          debug.extend(`ExtensionNode`)(`inserting with keyNibbles: [${commonPrefix}]`)
          const extension = new ExtensionNode({
            keyNibbles: commonPrefix,
            subNode: branchNode,
            hashFunction: this.hashFunction,
          })
          return this._cleanupNode(extension, debug)
        } else {
          debug(`inserting as new branchNode`)
          return branchNode
        }
      }
    },
    BranchNode: async () => {
      const branchNode = node as BranchNode
      const childIndex = keyNibbles.shift()!
      debug(`inserting into BranchNode at index ${childIndex}`)
      let childNode = branchNode.getChild(childIndex)
      if (childNode) {
        debug(
          `${childNode.getType()}: [${childNode.getPartialKey()}] found at index ${childIndex}.  Updating child.`
        )
        const newChild = await this._insertAtNode(childNode, keyNibbles, value, debug)
        branchNode.updateChild(newChild, childIndex)
      } else {
        debug(`NullNode found at index ${childIndex}.  Creating new LeafNode and updating child.`)
        childNode = new LeafNode({ key: keyNibbles, value, hashFunction: this.hashFunction })
        branchNode.setChild(childIndex, childNode)
      }
      debug(`inserting as updated BranchNode`)
      return branchNode
    },
    ExtensionNode: async () => {
      const extensionNode = node as ExtensionNode
      const sharedNibbles = getSharedNibbles(keyNibbles, extensionNode.getPartialKey())
      if (sharedNibbles.length === extensionNode.getPartialKey().length) {
        if (sharedNibbles.length === keyNibbles.length) {
          debug(
            `shared nibbles: ${sharedNibbles} match entirely and are same length.  update child value.`
          )
          const newChild = await extensionNode.child.updateValue(value)
          return extensionNode.updateChild(newChild)
        }
        debug(`shared nibbles: ${sharedNibbles} match entirely.  update child.`)
        const newChild = await this._insertAtNode(
          extensionNode.child,
          keyNibbles.slice(sharedNibbles.length),
          value,
          debug.extend('ExtensionNode')
        )
        extensionNode.updateChild(newChild)
        return extensionNode
      } else {
        debug(`shared nibbles: ${sharedNibbles} do not match entirely.`)
        const remainingOldNibbles = node.getPartialKey().slice(sharedNibbles.length)
        const remainingNewNibbles = keyNibbles.slice(sharedNibbles.length)
        debug(`remainingOldNibbles: [${remainingOldNibbles}]`)
        debug(`remainingNewNibbles: [${remainingNewNibbles}]`)
        const oldBranchNodeIndex = remainingOldNibbles.shift()!
        const newLeafNodeIndex = remainingNewNibbles.shift()!
        const newLeafNode = new LeafNode({
          key: remainingNewNibbles,
          value,
          hashFunction: this.hashFunction,
        })
        const newBranchNode = new BranchNode({ hashFunction: this.hashFunction, value: null })
        debug(
          `splitting ExtensionNode into BranchNode with children on branches ${newLeafNodeIndex} and ${oldBranchNodeIndex}`
        )
        if (remainingOldNibbles.length > 0) {
          const newExtensionNode = new ExtensionNode({
            keyNibbles: remainingOldNibbles,
            subNode: extensionNode.child,
            hashFunction: this.hashFunction,
          })
          debug(
            `inserting as ExtensionNode: ${remainingOldNibbles} with new extensionNode as child`
          )
          newBranchNode.setChild(oldBranchNodeIndex, newExtensionNode)
        } else {
          newBranchNode.setChild(oldBranchNodeIndex, extensionNode.child)
        }
        newBranchNode.setChild(newLeafNodeIndex, newLeafNode)
        if (sharedNibbles.length > 0) {
          debug(`inserting as ExtensionNode: ${sharedNibbles} with new branchNode as child`)
          return new ExtensionNode({
            keyNibbles: sharedNibbles,
            subNode: newBranchNode,
            hashFunction: this.hashFunction,
          })
        } else {
          newBranchNode.value = (extensionNode.child as any).value
          debug(`inserting as new branchNode`)
          return newBranchNode
        }
      }
    },
    ProofNode: async () => {
      return new LeafNode({ key: keyNibbles, value, hashFunction: this.hashFunction })
    },
  }
  const preCleanup = await _insert[type]()
  const newRoot = await this._cleanupNode(preCleanup, debug)
  debug.extend('NEW_ROOT')(bytesToPrefixedHexString(newRoot.hash()))
  await this.storeNode(newRoot)
  return newRoot
}
