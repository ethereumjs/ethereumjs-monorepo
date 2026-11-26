import { MapDB, randomBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { describe, expect, it } from 'vitest'

import {
  decodeRecordToNode,
  encodeNodeToRlp,
  packRecord,
  recordHash,
} from '../../src/binaryPath/nodeCodec.ts'
import {
  BranchMPTNode,
  ExtensionMPTNode,
  LeafMPTNode,
  MerklePatriciaTrie,
} from '../../src/index.ts'

describe('BinaryPath nodeCodec', () => {
  it('packed record round-trips canonical node RLP hash', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false, db: new MapDB() })
    const key = randomBytes(32)
    await trie.put(key, randomBytes(20))
    const root = await trie.lookupNode(trie.root())
    const nodes: Array<BranchMPTNode | ExtensionMPTNode | LeafMPTNode> = []
    const walk = async (node: BranchMPTNode | ExtensionMPTNode | LeafMPTNode) => {
      nodes.push(node)
      if (node instanceof BranchMPTNode) {
        for (const [, ref] of node.getChildren()) {
          if (ref instanceof Uint8Array && ref.length === 32) {
            const child = await trie.lookupNode(ref)
            await walk(child as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)
          }
        }
      } else if (node instanceof ExtensionMPTNode) {
        const child = await trie.lookupNode(node.value())
        await walk(child as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)
      }
    }
    await walk(root as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)

    for (const node of nodes) {
      const record = packRecord(node, keccak_256)
      const decoded = decodeRecordToNode(record)
      expect(encodeNodeToRlp(decoded)).toEqual(encodeNodeToRlp(node))
      expect(recordHash(record)).toEqual(keccak_256(encodeNodeToRlp(node)))
    }
  })
})
