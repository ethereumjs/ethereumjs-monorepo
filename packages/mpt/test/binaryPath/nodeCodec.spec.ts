import { MapDB, bytesToHex, intToBytes, randomBytes, setLengthLeft } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { describe, expect, it } from 'vitest'

import {
  TAG_EXTERNAL_LEAF,
  decodeRecordToNode,
  encodeBinaryNodeToRlp,
  encodeNodeToRlp,
  packBinaryRecord,
  packRecord,
  recordHash,
  unpackBinaryRecord,
} from '../../src/binaryPath/nodeCodec.ts'
import {
  BranchMPTNode,
  ExtensionMPTNode,
  LeafMPTNode,
  MerklePatriciaTrie,
} from '../../src/index.ts'

describe('BinaryPath nodeCodec', () => {
  it('round-trips Branch, Extension, Leaf, and < 32B inline children without double-hashing', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false, db: new MapDB() })
    // Keys with shared prefix (forces Extension -> Branch) + 32-byte hashed children
    for (let i = 0; i < 32; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      key[0] = 0xab
      key[1] = 0xcd
      await trie.put(key, randomBytes(32))
    }
    // Short keys + 1-byte values (forces inline < 32B leaf children inside Branch)
    await trie.put(new Uint8Array([0x01, 0x01]), new Uint8Array([0x41]))
    await trie.put(new Uint8Array([0x01, 0x02]), new Uint8Array([0x42]))
    await trie.put(new Uint8Array([0x01, 0x03]), new Uint8Array([0x43]))

    const visited = new Set<string>()
    const nodes: Array<BranchMPTNode | ExtensionMPTNode | LeafMPTNode> = []
    let seenBranch = 0
    let seenExtension = 0
    let seenLeaf = 0
    let seenInlineChild = 0
    let seenHashedChild = 0

    const walk = async (node: BranchMPTNode | ExtensionMPTNode | LeafMPTNode) => {
      const rlp = encodeNodeToRlp(node)
      const h = bytesToHex(keccak_256(rlp))
      if (visited.has(h)) return
      visited.add(h)
      nodes.push(node)

      if (node instanceof BranchMPTNode) {
        seenBranch++
        for (const [, ref] of node.getChildren()) {
          if (ref instanceof Uint8Array && ref.length === 32) {
            seenHashedChild++
            const child = await trie.lookupNode(ref)
            await walk(child as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)
          } else {
            seenInlineChild++
          }
        }
      } else if (node instanceof ExtensionMPTNode) {
        seenExtension++
        const ref = node.value()
        if (ref.length === 32) {
          seenHashedChild++
          const child = await trie.lookupNode(ref)
          await walk(child as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)
        } else {
          seenInlineChild++
        }
      } else {
        seenLeaf++
      }
    }

    const root = await trie.lookupNode(trie.root())
    await walk(root as BranchMPTNode | ExtensionMPTNode | LeafMPTNode)

    expect(seenBranch).toBeGreaterThan(0)
    expect(seenExtension).toBeGreaterThan(0)
    expect(seenLeaf).toBeGreaterThan(0)
    expect(seenInlineChild).toBeGreaterThan(0)
    expect(seenHashedChild).toBeGreaterThan(0)

    for (const node of nodes) {
      const expectedRlp = encodeNodeToRlp(node)
      const expectedHash = keccak_256(expectedRlp)
      const record = packRecord(node, keccak_256)
      const decoded = decodeRecordToNode(record)
      expect(encodeNodeToRlp(decoded)).toEqual(expectedRlp)
      expect(recordHash(record)).toEqual(expectedHash)

      const unpacked = unpackBinaryRecord(record)
      expect(unpacked.hash).toEqual(expectedHash)
      expect(unpacked.node.kind).not.toBe('external-leaf')
      if (unpacked.node.kind !== 'external-leaf') {
        expect(encodeBinaryNodeToRlp(unpacked.node)).toEqual(expectedRlp)
      }
    }
  })

  it('round-trips external leaf pointer record (TAG_EXTERNAL_LEAF = 0x04)', () => {
    const suffix = new Uint8Array([0x0a, 0x0b, 0x0c, 0x0d, 0x0e])
    const leafHash = keccak_256(new Uint8Array([1, 2, 3]))
    const record = packBinaryRecord({ kind: 'external-leaf', path: suffix }, leafHash)
    expect(record[0]).toBe(TAG_EXTERNAL_LEAF)
    expect(recordHash(record)).toEqual(leafHash)

    const unpacked = unpackBinaryRecord(record)
    expect(unpacked.hash).toEqual(leafHash)
    expect(unpacked.node).toEqual({ kind: 'external-leaf', path: suffix })
  })
})
