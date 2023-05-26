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
        return new NullNode({ hashFunction: this.hashFunction })
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
        extensionNode.updateChild(newChild)
        return extensionNode
      } else {
        return extensionNode
      }
    },
    BranchNode: async () => {
      const branchNode = _node as BranchNode
      const childIndex = _keyNibbles[0]!
      const childNode = branchNode.getChild(childIndex)
      if (childNode) {
        debug(`navigating from BranchNode into childnode at index ${childIndex}`)
        debug(
          `index: (1) [${childIndex}] remaining: (${
            _keyNibbles.slice(1).length
          }) [${_keyNibbles.slice(1)}]`
        )
        if (childNode.getType() === 'LeafNode') {
          if (doKeysMatch(childNode.getPartialKey(), _keyNibbles)) {
            debug(`found leaf node to delete, replacing with null`)
            branchNode.updateChild(new NullNode({ hashFunction: this.hashFunction }), childIndex)
            return branchNode
          }
        }
        const updatedChildNode = await this._deleteAtNode(childNode, _keyNibbles.slice(1), debug)
        branchNode.updateChild(updatedChildNode, childIndex)
        return branchNode
      } else {
        return branchNode
      }
    },
    ProofNode: async () => {
      throw new Error('method not implemented')
    },
  }
  const deleted = await d[_node.getType()]()
  return this._cleanupNode(deleted, debug)
}
