import { bytesToNibbles, bytesToPrefixedHexString } from '@ethereumjs/util'
import debug from 'debug'
import { equalsBytes } from 'ethereum-cryptography/utils'

import { BranchNode, ExtensionNode, LeafNode, NullNode, ProofNode, Trie } from '../index.js'
import { nibblesCompare, nibblesEqual, nibblestoBytes } from '../util/nibbles.js'

import type { TNode } from '../trie/node/types.js'
import type { HashKeysFunction } from '../types.js'
import type { Debugger } from 'debug'

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
export async function unset(
  trie: Trie,
  parent: TNode,
  child: TNode | null,
  key: number[],
  pos: number,
  removeLeft: boolean,
  stack: TNode[]
): Promise<number> {
  if (child instanceof BranchNode) {
    /**
     * This node is a branch node,
     * remove all branches on the left or right
     */
    if (removeLeft) {
      for (let i = 0; i < key[pos]; i++) {
        child.updateChild(new NullNode({ hashFunction: trie.hashFunction }), i)
      }
    } else {
      for (let i = key[pos] + 1; i < 16; i++) {
        child.updateChild(new NullNode({ hashFunction: trie.hashFunction }), i)
      }
    }

    // record this node on the stack
    stack.push(child)

    // continue to the next node
    const next = (await child.getChild(key[pos])) ?? null
    return unset(trie, child, next, key, pos + 1, removeLeft, stack)
  } else if (child instanceof ExtensionNode || child instanceof LeafNode) {
    /**
     * This node is an extension node or leaf node,
     * if node.getPartialKey() is less or greater than the target key,
     * remove self from parent
     */
    if (
      key.length - pos < child.getPartialKey().length ||
      nibblesCompare(child.getPartialKey(), key.slice(pos, pos + child.getPartialKey().length)) !==
        0
    ) {
      if (removeLeft) {
        if (nibblesCompare(child.getPartialKey(), key.slice(pos)) < 0) {
          ;(parent as BranchNode).updateChild(
            new NullNode({ hashFunction: trie.hashFunction }),
            key[pos - 1]
          )
        }
      } else {
        if (nibblesCompare(child.getPartialKey(), key.slice(pos)) > 0) {
          ;(parent as BranchNode).updateChild(
            new NullNode({ hashFunction: trie.hashFunction }),
            key[pos - 1]
          )
        }
      }
      return pos - 1
    }

    if (child instanceof LeafNode) {
      // This node is a leaf node, directly remove it from parent
      ;(parent as BranchNode).updateChild(
        new NullNode({ hashFunction: trie.hashFunction }),
        key[pos - 1]
      )
      return pos - 1
    } else {
      const _child = child.child
      if (_child instanceof LeafNode) {
        // The child of this node is leaf node, remove it from parent too
        ;(parent as BranchNode).updateChild(
          new NullNode({ hashFunction: trie.hashFunction }),
          key[pos - 1]
        )
        return pos - 1
      }

      // record this node on the stack
      stack.push(child)

      // continue to the next node
      return unset(trie, child, _child, key, pos + child.getPartialKey().length, removeLeft, stack)
    }
  } else if (child === null || child instanceof NullNode) {
    return pos - 1
  } else {
    throw new Error('invalid node')
  }
}

/**
 * unsetInternal will remove all nodes between `left` and `right` (including `left` and `right`)
 * @param trie - trie object.
 * @param left - left nibbles.
 * @param right - right nibbles.
 * @returns Is it an empty trie.
 */
export async function unsetInternal(trie: Trie, left: number[], right: number[]): Promise<boolean> {
  // Key position
  let pos = 0
  // Parent node
  let parent: TNode | null = null
  // Current node
  let node: TNode | null = (await trie.lookupNodeByHash(trie.root())) ?? null
  let shortForkLeft!: number
  let shortForkRight!: number
  // A stack of modified nodes.
  const stack: TNode[] = []
  // 1. Find the fork point of `left` and `right`
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (node instanceof ExtensionNode || node instanceof LeafNode) {
      // record this node on the stack
      stack.push(node)

      if (left.length - pos < node.getPartialKey().length) {
        shortForkLeft = nibblesCompare(left.slice(pos), node.getPartialKey())
      } else {
        shortForkLeft = nibblesCompare(
          left.slice(pos, pos + node.getPartialKey().length),
          node.getPartialKey()
        )
      }

      if (right.length - pos < node.getPartialKey().length) {
        shortForkRight = nibblesCompare(right.slice(pos), node.getPartialKey())
      } else {
        shortForkRight = nibblesCompare(
          right.slice(pos, pos + node.getPartialKey().length),
          node.getPartialKey()
        )
      }
      // If one of `left` and `right` is not equal to node.getPartialKey(), it means we found the fork point
      if (shortForkLeft !== 0 || shortForkRight !== 0) {
        break
      }
      if (node instanceof LeafNode) {
        // it shouldn't happen
        return false
        // throw new Error('invalid node')
      }
      // continue to the next node
      parent = node
      pos += node.getPartialKey().length
      node = node.child
    } else if (node instanceof BranchNode) {
      // record this node on the stack
      stack.push(node)

      const leftNode = (await node.getChild(left[pos])) ?? null
      const rightNode = (await node.getChild(right[pos])) ?? null

      // One of `left` and `right` is `null`, stop searching
      if (leftNode === null || rightNode === null) {
        break
      }

      // Stop searching if `left` and `right` are not equal
      if (!(leftNode instanceof Uint8Array)) {
        if (rightNode instanceof Uint8Array) {
          break
        }
      } else {
        if (!(rightNode instanceof Uint8Array)) {
          break
        }

        if (!equalsBytes(leftNode.rlpEncode(), rightNode.rlpEncode())) {
          break
        }
      }

      // continue to the next node
      parent = node
      node = leftNode
      pos += 1
    } else {
      if (node instanceof ProofNode) {
        node = (await node.load()) ?? null
        if (node instanceof ProofNode) {
          return false
        }
      } else {
        return false
      }
    }
  }

  // 2. Starting from the fork point, delete all nodes between `left` and `right`

  const saveStack = async (_key: number[], stack: TNode[]) => {
    for (const node of stack) {
      await trie.storeNode(node)
    }
  }

  if (node instanceof ExtensionNode || node instanceof LeafNode) {
    /**
     * There can have these five scenarios:
     * - both proofs are less than the trie path => no valid range
     * - both proofs are greater than the trie path => no valid range
     * - left proof is less and right proof is greater => valid range, unset the entire trie
     * - left proof points to the trie node, but right proof is greater => valid range, unset left node
     * - right proof points to the trie node, but left proof is less  => valid range, unset right node
     */
    const removeSelfFromParentAndSaveStack = async (key: number[]) => {
      if (parent === null) {
        return true
      }

      stack.pop()
      ;(parent as BranchNode).updateChild(
        new NullNode({ hashFunction: trie.hashFunction }),
        key[pos - 1]
      )
      await saveStack(key.slice(0, pos - 1), stack)
      return false
    }

    if (shortForkLeft === -1 && shortForkRight === -1) {
      throw new Error('invalid range')
    }

    if (shortForkLeft === 1 && shortForkRight === 1) {
      throw new Error('invalid range')
    }

    if (shortForkLeft !== 0 && shortForkRight !== 0) {
      // Unset the entire trie
      return removeSelfFromParentAndSaveStack(left)
    }

    // Unset left node
    if (shortForkRight !== 0) {
      if (node instanceof LeafNode) {
        return removeSelfFromParentAndSaveStack(left)
      }

      const child = node.child
      if (child instanceof LeafNode) {
        return removeSelfFromParentAndSaveStack(left)
      }

      const endPos = await unset(
        trie,
        node,
        child,
        left.slice(pos),
        node.getPartialKey().length,
        false,
        stack
      )
      await saveStack(left.slice(0, pos + endPos), stack)

      return false
    }

    // Unset right node
    if (shortForkLeft !== 0) {
      if (node instanceof LeafNode) {
        return removeSelfFromParentAndSaveStack(right)
      }

      const child = node.child
      if (child instanceof LeafNode) {
        return removeSelfFromParentAndSaveStack(right)
      }

      const endPos = await unset(
        trie,
        node,
        child,
        right.slice(pos),
        node.getPartialKey().length,
        true,
        stack
      )
      await saveStack(right.slice(0, pos + endPos), stack)

      return false
    }

    return false
  } else if (node instanceof BranchNode) {
    // Unset all internal nodes in the forkpoint
    for (let i = left[pos] + 1; i < right[pos]; i++) {
      node.updateChild(new NullNode({ hashFunction: trie.hashFunction }), i)
    }

    try {
      /**
       * `stack` records the path from root to fork point.
       * Since we need to unset both left and right nodes once,
       * we need to make a copy here.
       */
      const _stack = [...stack]
      const next = await node.getChild(left[pos])
      const child = next ?? null
      const endPos = await unset(trie, node, child, left.slice(pos), 1, false, _stack)
      await saveStack(left.slice(0, pos + endPos), _stack)
    } catch (err: any) {
      debug(err)
      return false
    }

    try {
      const _stack = [...stack]
      const next = await node.getChild(right[pos])
      const child = next ?? null
      const endPos = await unset(trie, node, child, right.slice(pos), 1, true, _stack)
      await saveStack(right.slice(0, pos + endPos), _stack)
    } catch (err: any) {
      debug(err)
      return false
    }

    return false
  } else {
    throw new Error('invalid node')
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
async function verifyProof(
  rootHash: Uint8Array,
  key: Uint8Array,
  proof: Uint8Array[],
  _useKeyHashingFunction: HashKeysFunction,
  dbug: Debugger = debug('__verifyProof__')
): Promise<{ trie: Trie; value: Uint8Array | null }> {
  dbug = dbug.extend('verifyProof')
  try {
    const trie = await Trie.fromProof(proof)
    if (!equalsBytes(trie.root(), rootHash)) {
      dbug.extend('ERROR:')('Proof Invalid: root mismatch')
      throw new Error('Proof Invalid: root mismatch')
    }
    debug(`Resolving RootNode: ${bytesToPrefixedHexString(trie.root())}`)
    const reachable = await trie.markReachableNodes(await trie.rootNode())
    dbug.extend(`ProofTrie`)(`Reachable nodes: ${reachable.size}`)
    for (const [idx, p] of [...reachable.values()].entries()) {
      dbug.extend(`ProofTrie`)(`Reachable node [${idx}]: ${p}`)
    }
    for (const [idx, p] of proof.reverse().entries()) {
      dbug.extend(`ProofTrie`)(
        `Proof node [${idx}]: ${bytesToPrefixedHexString(trie.hashFunction(p))}`
      )
    }
    dbug.extend(`ProofTrie`)(`Reachable nodes: ${reachable.size}`)

    for (const [idx, p] of proof.entries()) {
      dbug.extend(`ProofNode [${idx}]`)(`${bytesToPrefixedHexString(trie.hashFunction(p))}`)
      if (!reachable.has(bytesToPrefixedHexString(trie.hashFunction(p)))) {
        dbug.extend('ERROR:')(
          `Proof Invalid: [${idx}]: ${bytesToPrefixedHexString(
            trie.hashFunction(p)
          )} is unreachable`
        )
        throw new Error('Proof Invalid: unreachable node')
      } else {
        dbug.extend(`Proof [${idx}]`)(
          `: ${bytesToPrefixedHexString(trie.hashFunction(p))} is reachable`
        )
        // const proofNode = await trie._getNodePath(key, dbug)
        // if (equalsBytes(proofNode.node.rlpEncode(), p)) {
        //   const value = proofNode.node.getValue()
        //   dbug(`Found in ProofTrie for key [${bytesToNibbles(key)}]: ${value ? bytesToPrefixedHexString(value) : null}`)
        //   return value
        // } else {
        //   dbug(`node: ${proofNode.node.getType()}`)
        //   dbug(`path: ${proofNode.path.length} nodes`)
        //   dbug(`ProofNode Nibbles: [${bytesToNibbles(key)}]`)
        //   dbug(`remaining Nibbles: [${proofNode.remainingNibbles}]`)
        // }
      }
    }
    dbug.extend(`ProofTrie`)(`All Proof nodes reachable`)
    const value = await trie.get(key)
    dbug(
      `Found in ProofTrie for key [${bytesToNibbles(key)}]: ${
        value ? bytesToPrefixedHexString(value) : null
      }`
    )
    return { trie, value }
  } catch (err: any) {
    debug(`Failed to verify proof: ${err.message}`)
    throw new Error('failed')
  }
}

/**
 * hasRightElement returns the indicator whether there exists more elements
 * on the right side of the given path
 * @param trie - trie object.
 * @param key - given path.
 */
export async function hasRightElement(trie: Trie, key: number[]): Promise<boolean> {
  let pos = 0
  let node: TNode | undefined = await trie.rootNode()
  while (node !== undefined) {
    if (node.type === 'ProofNode') {
      node = (await trie.lookupNodeByHash(node.hash())) ?? node
    }
    if (node instanceof BranchNode) {
      for (let i = key[pos] + 1; i < 16; i++) {
        if ((await node.getChild(i)).getType() !== 'NullNode') {
          return true
        }
      }

      const next: TNode = await node.getChild(key[pos])
      node = next
      pos += 1
    } else if (node instanceof ExtensionNode) {
      if (
        key.length - pos < node.getPartialKey().length ||
        nibblesCompare(node.getPartialKey(), key.slice(pos, pos + node.getPartialKey().length)) !==
          0
      ) {
        return nibblesCompare(node.getPartialKey(), key.slice(pos)) > 0
      }

      pos += node.getPartialKey().length
      node = node.child
    } else if (node instanceof LeafNode) {
      return false
    } else {
      throw new Error(`${node.getType()} invalid...`)
    }
  }
  return false
}

function allNull(args: {
  firstKey: number[] | null
  lastKey: number[] | null
  proof: Uint8Array[] | null
}) {
  return args.firstKey === null && args.lastKey === null && args.proof === null
}

function anyNull(args: {
  firstKey: number[] | null
  lastKey: number[] | null
  proof: Uint8Array[] | null
}) {
  return args.firstKey === null || args.lastKey === null || args.proof === null
}

/**
 * verifyRangeProof checks whether the given leaf nodes and edge proof
 * can prove the given trie leaves range is matched with the specific root.
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
 * @param rootHash - root hash.
 * @param firstKey - first key.
 * @param lastKey - last key.
 * @param keys - key list.
 * @param values - value list, one-to-one correspondence with keys.
 * @param proof - proof node list, if proof is null, both `firstKey` and `lastKey` must be null
 * @returns a flag to indicate whether there exists more trie node in the trie
 */
export async function verifyRangeProof(
  rootHash: Uint8Array,
  firstKey: number[] | null,
  lastKey: number[] | null,
  keys: number[][],
  values: Uint8Array[],
  proof: Uint8Array[] | null,
  useKeyHashingFunction: HashKeysFunction,
  d_bug?: Debugger
): Promise<boolean> {
  d_bug = d_bug ? d_bug.extend('verifyRangeProof') : debug('verifyRangeProof')
  if (keys.length !== values.length) {
    return false
  }
  // Make sure the keys are in order
  for (let i = 0; i < keys.length - 1; i++) {
    if (nibblesCompare(keys[i], keys[i + 1]) >= 0) {
      throw new Error('invalid keys order')
    }
  }
  // Make sure all values are present
  for (const value of values) {
    if (value.length === 0) {
      throw new Error('invalid values')
    }
  }
  if (anyNull({ firstKey, lastKey, proof })) {
    if (allNull({ firstKey, lastKey, proof })) {
      const trie = await Trie.create({ hashFunction: useKeyHashingFunction })
      for (let i = 0; i < keys.length; i++) {
        await trie.put(nibblestoBytes(keys[i]), values[i])
      }
      if (!equalsBytes(rootHash, trie.root())) {
        return false
      }
    }
  }
  firstKey = firstKey as number[]
  lastKey = lastKey as number[]
  proof = proof as Uint8Array[]
  // Zero element proof
  if (keys.length === 0) {
    const { trie, value } = await verifyProof(
      rootHash,
      nibblestoBytes(firstKey),
      proof,
      useKeyHashingFunction,
      d_bug
    )

    if (value !== null || (await hasRightElement(trie, firstKey))) {
      return false
    }
    // return true
  }

  // One element proof
  if (keys.length === 1 && nibblesCompare(firstKey, lastKey) === 0) {
    try {
      const { trie, value } = await verifyProof(
        rootHash,
        nibblestoBytes(firstKey),
        proof,
        useKeyHashingFunction
      )

      if (!nibblesEqual(firstKey, keys[0])) {
        d_bug(`invalid one element proof: firstKey should be equal to keys[0]`)
        return false
        // throw new Error('invalid one element proof: firstKey should be equal to keys[0]')
      }
      if (value === null || !equalsBytes(value, values[0])) {
        d_bug('invalid one element proof: value mismatch')
        return false
        // throw new Error('invalid one element proof: value mismatch')
      }
      d_bug('point unknown -- unreachable? hasRightElement??')
      return await hasRightElement(trie, firstKey)
    } catch {
      return false
    }
  }

  // Two edge elements proof
  if (nibblesCompare(firstKey, lastKey) >= 0) {
    d_bug('invalid two edge elements proof: firstKey should be less than lastKey')
    return false
    // throw new Error('invalid two edge elements proof: firstKey should be less than lastKey')
  }
  if (firstKey.length !== lastKey.length) {
    d_bug(
      'invalid two edge elements proof: the length of firstKey should be equal to the length of lastKey'
    )
    return false
    // throw new Error(
    //   'invalid two edge elements proof: the length of firstKey should be equal to the length of lastKey'
    // )
  }

  // const trie = new Trie({ root: rootHash, useKeyHashingFunction })
  const verified = await Trie.verifyProof(rootHash, nibblestoBytes(firstKey), proof)
  if (verified === null) {
    d_bug('invalid two edge elements proof: proof verification failed')
    return false
  }
  const trie = await Trie.fromProof(proof)
  // await trie.setRootByHash(rootHash)

  d_bug(`trie.root(): ${bytesToPrefixedHexString(trie.root())}`)
  // Remove all nodes between two edge proofs
  const empty = await unsetInternal(trie, firstKey, lastKey)
  d_bug(`unsetInternal: ${empty}`)
  if (empty) {
    trie.root(trie.EMPTY_TRIE_ROOT)
  }

  // Put all elements to the trie
  for (let i = 0; i < keys.length; i++) {
    await trie.put(nibblestoBytes(keys[i]), values[i])
  }
  // await trie.setRootByHash(rootHash)

  // Compare rootHash
  if (!equalsBytes(trie.root(), rootHash)) {
    d_bug(
      `invalid two edge elements proof: ${bytesToPrefixedHexString(
        trie.root()
      )} !== ${bytesToPrefixedHexString(rootHash)}`
    )
    return false
    // throw new Error('invalid two edge elements proof: root mismatch')
  }
  d_bug(
    `roots match: ${bytesToPrefixedHexString(trie.root())} === ${bytesToPrefixedHexString(
      rootHash
    )}`
  )

  return hasRightElement(trie, keys[keys.length - 1])
}
