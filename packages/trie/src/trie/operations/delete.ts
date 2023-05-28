import { doKeysMatch, getSharedNibbles } from '../../util/nibbles'
import { NullNode } from '../node'

import { _cleanupNode } from './cleanup'

import type { NodeType, TNode } from '../node/types'
import type { MerklePatriciaTrie } from '../merklePatricia'
import type { BranchNode, ExtensionNode, LeafNode } from '../node'
import type { Debugger } from 'debug'

export async function _deleteAtNode(
  this: MerklePatriciaTrie,
  _node: TNode,
  _keyNibbles: number[],
  debug: Debugger
) {
  debug = debug.extend('_deleteAtNode')
  debug.extend(_node.getType())(`Seeking Node to DELETE: (${_keyNibbles.length}) [${_keyNibbles}]`)
  const d: {
    [type in NodeType]: () => Promise<TNode>
  } = {
    NullNode: async () => {
      return _node
    },
    LeafNode: async () => {
      const leafNode = _node as LeafNode
      if (doKeysMatch(leafNode.getPartialKey(), _keyNibbles)) {
        debug(`found leaf node to delete, replacing with null`)
        return new NullNode({ hashFunction: this.hashFunction })
      } else {
        return _node
      }
    },
    ExtensionNode: async () => {
      const extensionNode = _node as ExtensionNode
      const sharedNibbles = getSharedNibbles(_keyNibbles, extensionNode.getPartialKey())
      debug(
        `node_key: (${extensionNode.getPartialKey().length}) [${extensionNode.getPartialKey()}]`
      )
      debug(`keyNibbles: (${_keyNibbles.length}) [${_keyNibbles}]`)
      debug(`sharedNibbles: (${sharedNibbles.length}) [${sharedNibbles}]`)

      if (sharedNibbles.length === extensionNode.getPartialKey().length) {
        debug(`shared nibbles match entirely.  nativagating from extension node into child node`)
        debug(
          `shared (${sharedNibbles.length}): [${sharedNibbles}] remaining: (${
            _keyNibbles.slice(sharedNibbles.length).length
          })[${_keyNibbles.slice(sharedNibbles.length)}]`
        )
        const newChild = await this._deleteAtNode(
          extensionNode.child,
          _keyNibbles.slice(sharedNibbles.length),
          debug
        )
        return extensionNode.updateChild(newChild)
      } else {
        return extensionNode
      }
    },
    BranchNode: async () => {
      let branchNode = _node as BranchNode
      // if (_keyNibbles.length === 0) {
      //   debug(`keyNibbles is empty, setting deleting branch`)
      //   return new NullNode({ hashFunction: this.hashFunction })
      // }
      const childIndex = _keyNibbles[0]
      // if (_keyNibbles.length === 1) {
      //   return branchNode.updateChild(new NullNode({ hashFunction: this.hashFunction }), childIndex)
      // }
      const childNode = branchNode.getChild(childIndex)
      if (childNode) {
        const childType = childNode.getType()
        const childNibbles = childNode.getPartialKey()
        debug(`compare nibbles with child: ${childType} at index ${childIndex}`)
        debug.extend(`[${childIndex}]`)(`[${childNode.getPartialKey()}]`)
        debug(`[${_keyNibbles[0]}] [${_keyNibbles.slice(1)}]`)
        if (childNode.getType() === 'LeafNode' && doKeysMatch(childNibbles, _keyNibbles.slice(1))) {
          debug(`found LeafNode to delete, replacing with NullNode`)
          _node = await branchNode.deleteChild(childIndex)
          return _node
        }
        if (childNode.getType() === 'LeafNode') {
          debug('WHAAAAAAT???')
          debug.extend(`[${childIndex}]`)(`[${childNode.getPartialKey()}]`)
          debug(`[${_keyNibbles[0]}] [${_keyNibbles.slice(1)}]`)
        }
        const updatedChildNode = await this._deleteAtNode(childNode, _keyNibbles.slice(1), debug)
        debug(`update child at index ${childIndex}`)
        debug(`before: ${childType}: [${childNibbles}]`)
        debug(`update: ${updatedChildNode.getType()}: [${updatedChildNode.getPartialKey()}]`)
        return branchNode.updateChild(updatedChildNode, childIndex)
      } else {
        return branchNode
      }
    },
    ProofNode: async () => {
      throw new Error('method not implemented')
    },
  }
  const deleted = await d[_node.getType()]()
  debug(`old root: ${_node.getType()}`)
  const newRoot = await this._cleanupNode(deleted, debug)
  debug(`new root: ${newRoot.getType()}`)
  return newRoot
}
