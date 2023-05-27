import { debug as _debug } from 'debug'

import { BranchNode, ExtensionNode, LeafNode, NullNode, ProofNode } from '../node'

import type { NodeType, TNode } from '../node/types'
import type { MerklePatriciaTrie } from '../merklePatricia'
import type { Debugger } from 'debug'

export async function _cleanupNode(
  this: MerklePatriciaTrie,
  node: TNode,
  debug: Debugger = this.debug
): Promise<TNode> {
  debug = debug.extend('_cleanupNode')
  if (node instanceof BranchNode) {
    node = await this._cleanupBranchNode(node, debug)
  } else if (node instanceof ExtensionNode) {
    node = await this._cleanupExtensionNode(node, debug)
  }
  // If the node is not a branch node, or it's a branch node with more than
  // one child, there's nothing to clean up and we return the node as is.
  return node
}

export async function _cleanupBranchNode(
  this: MerklePatriciaTrie,
  node: TNode,
  debug: Debugger
): Promise<TNode> {
  if (!(node instanceof BranchNode)) {
    throw new Error(`_cleanupBranchNode expects a BranchNode`)
  }
  debug = debug.extend('_cleanupBranchNode')
  const childCount = node.childCount()
  debug(`child count: ${childCount} children`)
  debug(`value: ${node.value ? `${node.value.length} bytes` : `null`}`)
  switch (childCount) {
    case 0:
      if (!node.value) {
        debug(`Converting BranchNode to NullNode`)
        return new NullNode({})
      } else {
        debug(`Converting BranchNode to LeafNode with same value.`)
        const newNode = new LeafNode({
          key: [],
          value: node.value,
          hashFunction: this.hashFunction,
        })
        await this.storeNode(newNode)
        return newNode
      }
    case 1:
      if (node.value) {
        return node
      } else {
        const [nibble, child] = node.childNodes().entries().next().value as [number, TNode]
        const childType = child.getType()
        debug(`BranchNode with null value has 1 child: [${nibble}]: ${childType}`)
        debug(`Replacing BranchNode with ExtensionNode: [${nibble}]: child: ${childType}`)
        node = new ExtensionNode({
          keyNibbles: [nibble],
          subNode: child,
          hashFunction: this.hashFunction,
          source: debug,
        })
        node = await this._cleanupNode(node)
        await this.storeNode(node, debug)
        return node
      }
    default:
      debug(
        `BranchNode has more than 1 child. ${[...node.childNodes().keys()]}  No cleanup needed.`
      )
      return node
  }
}

export async function _cleanupExtensionNode(
  this: MerklePatriciaTrie,
  node: ExtensionNode,
  debug: Debugger
): Promise<TNode> {
  const child = node.child
  const childType = child.getType()
  let combinedNibbles: number[]
  let newNode: TNode
  debug = debug.extend('_cleanupExtensionNode')
  debug(`keyNibbles: [${node.getPartialKey()}]`)
  debug(childCleanupMessage[childType](node.getPartialKey(), child.getPartialKey()))
  switch (childType) {
    case 'LeafNode':
      combinedNibbles = [...node.getPartialKey(), ...child.getPartialKey()]
      newNode = new LeafNode({
        key: combinedNibbles,
        value: child.getValue(),
        hashFunction: this.hashFunction,
      })
      await this.storeNode(newNode)
      return newNode
    case 'ExtensionNode':
      combinedNibbles = [...node.getPartialKey(), ...child.getPartialKey()]
      newNode = new ExtensionNode({
        keyNibbles: combinedNibbles,
        subNode: (child as ExtensionNode).child,
        hashFunction: this.hashFunction,
      })
      newNode = await this._cleanupNode(newNode)
      await this.storeNode(newNode)
      return newNode
    case 'BranchNode':
      debug(
        `ExtensionNode has BranchNode child with ${
          (child as BranchNode).childNodes().size
        } children`
      )
      if ((child as BranchNode).childNodes().size > 1) {
        debug(`ExtensionNode child: BranchNode has more than 1 child.  No cleanup needed`)
        await this.storeNode(node)
        return node
      }
      const newChild = await this._cleanupNode(child)
      newNode = node.updateChild(newChild)
      await this.storeNode(newNode)
      return newNode
    case 'ProofNode':
      const resolved = await this.resolveProofNode(node.child as ProofNode)
      newNode = node.updateChild(resolved)
      debug(`ProofNode resolved.  Resuming cleanup`)
      newNode = await this._cleanupNode(newNode)
      await this.storeNode(newNode)
    case 'NullNode':
      return new NullNode({})
  }
}

export const childCleanupMessage: Record<NodeType, (...args: any) => Record<string, string>> = {
  LeafNode: (parent: number[], child: number[]) => {
    return {
      child: 'LeafNode',
      _: 'compressing ExtensionNode + LeafNode into new LeafNode with combined nibbles',
      combinedNibbles: `[${parent}] + [${child}]`,
    }
  },
  ExtensionNode: (parent: number[], child: number[]) => {
    return {
      child: `ExtensionNode.`,
      _: `compressing ExtensionNode + ExtensionNode into new ExtensionNode with combined nibbles`,
      combinedNibbles: `[${parent}] + [${child}]`,
    }
  },
  ProofNode: () => {
    return {
      child: `ProofNode`,
      _: `attempting to resolve ProofNode before cleanup`,
    }
  },
  BranchNode: () => {
    return {
      child: `BranchNode. Checking child count`,
    }
  },
  NullNode: () => {
    return {
      child: `NullNode. no cleanup needed`,
    }
  },
}
