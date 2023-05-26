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
    await this._cleanupBranchNode(node, debug)
  } else if (node instanceof ExtensionNode) {
    await this._cleanupExtensionNode(node, debug)
  }

  // If the node is not a branch node, or it's a branch node with more than
  // one child, there's nothing to clean up and we return the node as is.
  return node
}

export async function _cleanupBranchNode(
  this: MerklePatriciaTrie,
  node: BranchNode,
  debug: Debugger
): Promise<TNode> {
  debug = debug.extend('BranchNode')
  const childCount = node.childNodes().size
  if (childCount > 1) {
    debug(`BranchNode has more than 1 child.  No cleanup needed.`)
    return node
  }
  debug(`child count: ${childCount}`)
  debug(node.value ? `value: ${node.value} bytes` : `value: null`)
  if (childCount === 0 && node.value !== null) {
    debug(`BranchNode with value was 0 children`)
    debug(`Converting BranchNode to LeafNode`)
    const newNode = new LeafNode({
      key: node.keyNibbles,
      value: node.value,
      hashFunction: this.hashFunction,
    })
    await this.storeNode(newNode)
    return newNode
  } else {
    if (childCount === 1 && node.value === null) {
      const [nibble, child] = node.childNodes().entries().next().value as [number, TNode]
      const childType = child.getType()
      debug(`BranchNode with null value has 1 child: [${nibble}]: ${childType}`)
      debug(`Replacing BranchNode with: [${nibble}]: ${childType}`)
      debug(`updating key of child [${nibble}] + [${child.getPartialKey()}]`)
      const updated = await child.updateKey([nibble, ...child.getPartialKey()])
      const newNode = await this._cleanupNode(updated)
      await this.storeNode(newNode)
      return newNode
    }
  }
  return node
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
  debug = debug.extend('ExtensionNode')
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
      return node
    case 'NullNode':
      return new NullNode({})
    case 'ProofNode':
      const resolved = await this.resolveProofNode(node.child as ProofNode)
      newNode = node.updateChild(resolved)
      debug(`ProofNode resolved.  Resuming cleanup`)
      newNode = await this._cleanupNode(newNode)
      await this.storeNode(newNode)
  }
  return node
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
      child: `BranchNode. no cleanup needed`,
    }
  },
  NullNode: () => {
    return {
      child: `NullNode. no cleanup needed`,
    }
  },
}
