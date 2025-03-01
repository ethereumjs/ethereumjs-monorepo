import { EthereumJSErrorWithoutCode, equalsBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { createMPTFromProof } from '../index.js'
import { MerklePatriciaTrie } from '../mpt.js'
import { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from '../node/index.js'
import { bytesToNibbles, nibblesCompare, nibblesTypeToPackedBytes } from '../util/nibbles.js'

import type { HashKeysFunction, MPTNode, Nibbles } from '../types.js'

// reference: https://github.com/ethereum/go-ethereum/blob/20356e57b119b4e70ce47665a71964434e15200d/trie/proof.go

/**
 * unset will remove all nodes to the left or right of the target key(decided by `removeLeft`).
 * @param trie - trie object.
 * @param parent - parent node, it can be `null`.
 * @param child - child node.
 * @param key - target nibbles.
 * @param pos - key position.
 * @param removeLeft - remove all nodes to the left or right of the target key.
 * @param stack - a stack of modified nodes.
 * @returns The end position of key.
 */
async function unset(
  trie: MerklePatriciaTrie,
  parent: MPTNode,
  child: MPTNode | null,
  key: Nibbles,
  pos: number,
  removeLeft: boolean,
  stack: MPTNode[],
): Promise<number> {
  if (child instanceof BranchMPTNode) {
    /**
     * This node is a branch node,
     * remove all branches on the left or right
     */
    if (removeLeft) {
      for (let i = 0; i < key[pos]; i++) {
        child.setBranch(i, null)
      }
    } else {
      for (let i = key[pos] + 1; i < 16; i++) {
        child.setBranch(i, null)
      }
    }

    // record this node on the stack
    stack.push(child)

    // continue to the next node
    const next = child.getBranch(key[pos])
    const _child = next && (await trie.lookupNode(next))
    return unset(trie, child, _child, key, pos + 1, removeLeft, stack)
  } else if (child instanceof ExtensionMPTNode || child instanceof LeafMPTNode) {
    /**
     * This node is an extension node or lead node,
     * if node._nibbles is less or greater than the target key,
     * remove self from parent
     */
    if (
      key.length - pos < child.keyLength() ||
      nibblesCompare(child._nibbles, key.slice(pos, pos + child.keyLength())) !== 0
    ) {
      if (removeLeft) {
        if (nibblesCompare(child._nibbles, key.slice(pos)) < 0) {
          ;(parent as BranchMPTNode).setBranch(key[pos - 1], null)
        }
      } else {
        if (nibblesCompare(child._nibbles, key.slice(pos)) > 0) {
          ;(parent as BranchMPTNode).setBranch(key[pos - 1], null)
        }
      }
      return pos - 1
    }

    if (child instanceof LeafMPTNode) {
      // This node is a leaf node, directly remove it from parent
      ;(parent as BranchMPTNode).setBranch(key[pos - 1], null)
      return pos - 1
    } else {
      const _child = await trie.lookupNode(child.value())
      if (_child instanceof LeafMPTNode) {
        // The child of this node is leaf node, remove it from parent too
        ;(parent as BranchMPTNode).setBranch(key[pos - 1], null)
        return pos - 1
      }

      // record this node on the stack
      stack.push(child)

      // continue to the next node
      return unset(trie, child, _child, key, pos + child.keyLength(), removeLeft, stack)
    }
  } else if (child === null) {
    return pos - 1
  } else {
    throw EthereumJSErrorWithoutCode('invalid node')
  }
}

/**
 * unsetInternal will remove all nodes between `left` and `right` (including `left` and `right`)
 * @param trie - trie object.
 * @param left - left nibbles.
 * @param right - right nibbles.
 * @returns Is it an empty trie.
 */
async function unsetInternal(
  trie: MerklePatriciaTrie,
  left: Nibbles,
  right: Nibbles,
): Promise<boolean> {
  // Key position
  let pos = 0
  // Parent node
  let parent: MPTNode | null = null
  // Current node
  let node: MPTNode | null = await trie.lookupNode(trie.root())
  let shortForkLeft!: number
  let shortForkRight!: number
  // A stack of modified nodes.
  const stack: MPTNode[] = []

  // 1. Find the fork point of `left` and `right`

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (node instanceof ExtensionMPTNode || node instanceof LeafMPTNode) {
      // record this node on the stack
      stack.push(node)

      if (left.length - pos < node.keyLength()) {
        shortForkLeft = nibblesCompare(left.slice(pos), node._nibbles)
      } else {
        shortForkLeft = nibblesCompare(left.slice(pos, pos + node.keyLength()), node._nibbles)
      }

      if (right.length - pos < node.keyLength()) {
        shortForkRight = nibblesCompare(right.slice(pos), node._nibbles)
      } else {
        shortForkRight = nibblesCompare(right.slice(pos, pos + node.keyLength()), node._nibbles)
      }

      // If one of `left` and `right` is not equal to node._nibbles, it means we found the fork point
      if (shortForkLeft !== 0 || shortForkRight !== 0) {
        break
      }

      if (node instanceof LeafMPTNode) {
        // it shouldn't happen
        throw EthereumJSErrorWithoutCode('invalid node')
      }

      // continue to the next node
      parent = node
      pos += node.keyLength()
      node = await trie.lookupNode(node.value())
    } else if (node instanceof BranchMPTNode) {
      // record this node on the stack
      stack.push(node)

      const leftNode = node.getBranch(left[pos])
      const rightNode = node.getBranch(right[pos])

      // One of `left` and `right` is `null`, stop searching
      if (leftNode === null || rightNode === null) {
        break
      }

      // Stop searching if `left` and `right` are not equal
      if (!(leftNode instanceof Uint8Array)) {
        if (rightNode instanceof Uint8Array) {
          break
        }

        if (leftNode.length !== rightNode.length) {
          break
        }

        let abort = false
        for (let i = 0; i < leftNode.length; i++) {
          if (!equalsBytes(leftNode[i], rightNode[i])) {
            abort = true
            break
          }
        }
        if (abort) {
          break
        }
      } else {
        if (!(rightNode instanceof Uint8Array)) {
          break
        }

        if (!equalsBytes(leftNode, rightNode)) {
          break
        }
      }

      // continue to the next node
      parent = node
      node = await trie.lookupNode(leftNode)
      pos += 1
    } else {
      throw EthereumJSErrorWithoutCode('invalid node')
    }
  }

  // 2. Starting from the fork point, delete all nodes between `left` and `right`

  const saveStack = (key: Nibbles, stack: MPTNode[]) => {
    return trie.saveStack(key, stack, [])
  }

  if (node instanceof ExtensionMPTNode || node instanceof LeafMPTNode) {
    /**
     * There can have these five scenarios:
     * - both proofs are less than the trie path => no valid range
     * - both proofs are greater than the trie path => no valid range
     * - left proof is less and right proof is greater => valid range, unset the entire trie
     * - left proof points to the trie node, but right proof is greater => valid range, unset left node
     * - right proof points to the trie node, but left proof is less  => valid range, unset right node
     */
    const removeSelfFromParentAndSaveStack = async (key: Nibbles) => {
      if (parent === null) {
        return true
      }

      stack.pop()
      ;(parent as BranchMPTNode).setBranch(key[pos - 1], null)
      await saveStack(key.slice(0, pos - 1), stack)
      return false
    }

    if (shortForkLeft === -1 && shortForkRight === -1) {
      throw EthereumJSErrorWithoutCode('invalid range')
    }

    if (shortForkLeft === 1 && shortForkRight === 1) {
      throw EthereumJSErrorWithoutCode('invalid range')
    }

    if (shortForkLeft !== 0 && shortForkRight !== 0) {
      // Unset the entire trie
      return removeSelfFromParentAndSaveStack(left)
    }

    // Unset left node
    if (shortForkRight !== 0) {
      if (node instanceof LeafMPTNode) {
        return removeSelfFromParentAndSaveStack(left)
      }

      const child = await trie.lookupNode(node._value)
      if (child instanceof LeafMPTNode) {
        return removeSelfFromParentAndSaveStack(left)
      }

      const endPos = await unset(trie, node, child, left.slice(pos), node.keyLength(), false, stack)
      await saveStack(left.slice(0, pos + endPos), stack)

      return false
    }

    // Unset right node
    if (shortForkLeft !== 0) {
      if (node instanceof LeafMPTNode) {
        return removeSelfFromParentAndSaveStack(right)
      }

      const child = await trie.lookupNode(node._value)
      if (child instanceof LeafMPTNode) {
        return removeSelfFromParentAndSaveStack(right)
      }

      const endPos = await unset(trie, node, child, right.slice(pos), node.keyLength(), true, stack)
      await saveStack(right.slice(0, pos + endPos), stack)

      return false
    }

    return false
  } else if (node instanceof BranchMPTNode) {
    // Unset all internal nodes in the forkPoint
    for (let i = left[pos] + 1; i < right[pos]; i++) {
      node.setBranch(i, null)
    }

    {
      /**
       * `stack` records the path from root to fork point.
       * Since we need to unset both left and right nodes once,
       * we need to make a copy here.
       */
      const _stack = [...stack]
      const next = node.getBranch(left[pos])
      const child = next && (await trie.lookupNode(next))
      const endPos = await unset(trie, node, child, left.slice(pos), 1, false, _stack)
      await saveStack(left.slice(0, pos + endPos), _stack)
    }

    {
      const _stack = [...stack]
      const next = node.getBranch(right[pos])
      const child = next && (await trie.lookupNode(next))
      const endPos = await unset(trie, node, child, right.slice(pos), 1, true, _stack)
      await saveStack(right.slice(0, pos + endPos), _stack)
    }

    return false
  } else {
    throw EthereumJSErrorWithoutCode('invalid node')
  }
}

/**
 * Verifies a proof and return the verified trie.
 * @param rootHash - root hash.
 * @param key - target key.
 * @param proof - proof node list.
 * @throws If proof is found to be invalid.
 * @returns The value from the key, or null if valid proof of non-existence.
 */
async function verifyMPTWithMerkleProof(
  rootHash: Uint8Array,
  key: Uint8Array,
  proof: Uint8Array[],
  useKeyHashingFunction: HashKeysFunction,
): Promise<{ value: Uint8Array | null; trie: MerklePatriciaTrie }> {
  const proofTrie = await createMPTFromProof(proof, {
    root: rootHash,
    useKeyHashingFunction,
  })
  try {
    const value = await proofTrie.get(key, true)
    return {
      trie: proofTrie,
      value,
    }
  } catch (err: any) {
    if (err.message === 'Missing node in DB') {
      throw EthereumJSErrorWithoutCode('Invalid proof provided')
    } else {
      throw err
    }
  }
}

/**
 * hasRightElement returns the indicator whether there exists more elements
 * on the right side of the given path
 * @param trie - trie object.
 * @param key - given path.
 */
async function hasRightElement(trie: MerklePatriciaTrie, key: Nibbles): Promise<boolean> {
  let pos = 0
  let node: MPTNode | null = await trie.lookupNode(trie.root())
  while (node !== null) {
    if (node instanceof BranchMPTNode) {
      for (let i = key[pos] + 1; i < 16; i++) {
        if (node.getBranch(i) !== null) {
          return true
        }
      }

      const next = node.getBranch(key[pos])
      node = next && (await trie.lookupNode(next))
      pos += 1
    } else if (node instanceof ExtensionMPTNode) {
      if (
        key.length - pos < node.keyLength() ||
        nibblesCompare(node._nibbles, key.slice(pos, pos + node.keyLength())) !== 0
      ) {
        return nibblesCompare(node._nibbles, key.slice(pos)) > 0
      }

      pos += node.keyLength()
      node = await trie.lookupNode(node._value)
    } else if (node instanceof LeafMPTNode) {
      return false
    } else {
      throw EthereumJSErrorWithoutCode('invalid node')
    }
  }
  return false
}

/**
 * Checks whether the given leaf nodes and edge proof can prove the given trie leaves range is matched with the specific root.
 *
 * A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
 * allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
 * of state trie data is received and validated for constructing world state, locally.
 *
 * There are four situations:
 *
 * - All elements proof. In this case the proof can be null, but the range should
 *   be all the leaves in the trie.
 *
 * - One element proof. In this case no matter the edge proof is a non-existent
 *   proof or not, we can always verify the correctness of the proof.
 *
 * - Zero element proof. In this case a single non-existent proof is enough to prove.
 *   Besides, if there are still some other leaves available on the right side, then
 *   an error will be returned.
 *
 * - Two edge elements proof. In this case two existent or non-existent proof(first and last) should be provided.
 *
 * NOTE: Currently only supports verification when the length of firstKey and lastKey are the same.
 *
 * @param rootHash - root hash of state trie this proof is being verified against.
 * @param firstKey - first key of range being proven.
 * @param lastKey - last key of range being proven.
 * @param keys - key list of leaf data being proven.
 * @param values - value list of leaf data being proven, one-to-one correspondence with keys.
 * @param proof - proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well
 * @param opts - optional, the opts may include a custom hashing function to use with the trie for proof verification
 * @returns a flag to indicate whether there exists more trie node in the trie
 */
export async function verifyMerkleRangeProof(
  rootHash: Uint8Array,
  firstKeyRaw: Uint8Array | null,
  lastKeyRaw: Uint8Array | null,
  keysRaw: Uint8Array[],
  values: Uint8Array[],
  proof: Uint8Array[] | null,
  useKeyHashingFunction: HashKeysFunction = keccak256,
): Promise<boolean> {
  // Convert Uint8Array keys to nibbles
  const firstKey = firstKeyRaw !== null ? bytesToNibbles(firstKeyRaw) : null
  const lastKey = lastKeyRaw !== null ? bytesToNibbles(lastKeyRaw) : null
  const keys = keysRaw.map(bytesToNibbles)

  if (keys.length !== values.length) {
    throw EthereumJSErrorWithoutCode('invalid keys length or values length')
  }

  // Make sure the keys are in order
  for (let i = 0; i < keys.length - 1; i++) {
    if (nibblesCompare(keys[i], keys[i + 1]) >= 0) {
      throw EthereumJSErrorWithoutCode('invalid keys order')
    }
  }
  // Make sure all values are present
  for (const value of values) {
    if (value.length === 0) {
      throw EthereumJSErrorWithoutCode('invalid values')
    }
  }

  // All elements proof
  if (proof === null && firstKey === null && lastKey === null) {
    const trie = new MerklePatriciaTrie({ useKeyHashingFunction })
    for (let i = 0; i < keys.length; i++) {
      await trie.put(nibblesTypeToPackedBytes(keys[i]), values[i])
    }
    if (!equalsBytes(rootHash, trie.root())) {
      throw EthereumJSErrorWithoutCode('invalid all elements proof: root mismatch')
    }
    return false
  }

  if (proof !== null && firstKey !== null && lastKey === null) {
    // Zero element proof
    if (keys.length === 0) {
      const { trie, value } = await verifyMPTWithMerkleProof(
        rootHash,
        nibblesTypeToPackedBytes(firstKey),
        proof,
        useKeyHashingFunction,
      )

      if (value !== null || (await hasRightElement(trie, firstKey))) {
        throw EthereumJSErrorWithoutCode('invalid zero element proof: value mismatch')
      }

      return false
    }
  }

  if (proof === null || firstKey === null || lastKey === null) {
    throw EthereumJSErrorWithoutCode(
      'invalid all elements proof: proof, firstKey, lastKey must be null at the same time',
    )
  }

  // One element proof
  if (keys.length === 1 && nibblesCompare(firstKey, lastKey) === 0) {
    const { trie, value } = await verifyMPTWithMerkleProof(
      rootHash,
      nibblesTypeToPackedBytes(firstKey),
      proof,
      useKeyHashingFunction,
    )

    if (nibblesCompare(firstKey, keys[0]) !== 0) {
      throw EthereumJSErrorWithoutCode(
        'invalid one element proof: firstKey should be equal to keys[0]',
      )
    }
    if (value === null || !equalsBytes(value, values[0])) {
      throw EthereumJSErrorWithoutCode('invalid one element proof: value mismatch')
    }

    return hasRightElement(trie, firstKey)
  }

  // Two edge elements proof
  if (nibblesCompare(firstKey, lastKey) >= 0) {
    throw EthereumJSErrorWithoutCode(
      'invalid two edge elements proof: firstKey should be less than lastKey',
    )
  }
  if (firstKey.length !== lastKey.length) {
    throw EthereumJSErrorWithoutCode(
      'invalid two edge elements proof: the length of firstKey should be equal to the length of lastKey',
    )
  }

  const trie = await createMPTFromProof(proof, {
    useKeyHashingFunction,
    root: rootHash,
  })

  // Remove all nodes between two edge proofs
  const empty = await unsetInternal(trie, firstKey, lastKey)
  if (empty) {
    trie.root(trie.EMPTY_TRIE_ROOT)
  }

  // Put all elements to the trie
  for (let i = 0; i < keys.length; i++) {
    await trie.put(nibblesTypeToPackedBytes(keys[i]), values[i])
  }

  // Compare rootHash
  if (!equalsBytes(trie.root(), rootHash)) {
    throw EthereumJSErrorWithoutCode('invalid two edge elements proof: root mismatch')
  }

  return hasRightElement(trie, keys[keys.length - 1])
}
