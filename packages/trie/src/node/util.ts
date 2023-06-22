import { RLP } from '@ethereumjs/rlp'

import { isTerminator } from '../../util/hex.js'
import { bytesToNibbles } from '../../util/nibbles.js'

import { BranchNode } from './branch.js'
import { ExtensionNode } from './extension.js'
import { LeafNode } from './leaf.js'

export function decodeRawNode(raw: Uint8Array[]) {
  if (raw.length === 17) {
    return BranchNode.fromArray(raw)
  } else if (raw.length === 2) {
    const nibbles = bytesToNibbles(raw[0])
    if (isTerminator(nibbles)) {
      return new LeafNode(LeafNode.decodeKey(nibbles), raw[1])
    }
    return new ExtensionNode(ExtensionNode.decodeKey(nibbles), raw[1])
  } else {
    throw new Error('Invalid node')
  }
}

export function decodeNode(raw: Uint8Array) {
  const des = RLP.decode(Uint8Array.from(raw)) as Uint8Array[]
  if (!Array.isArray(des)) {
    throw new Error('Invalid node')
  }
  return decodeRawNode(des)
}

export function isRawNode(n: any) {
  return Array.isArray(n) && !(n instanceof Uint8Array)
}
