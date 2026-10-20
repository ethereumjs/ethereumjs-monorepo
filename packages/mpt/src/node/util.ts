import { RLP } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, type NestedUint8Array } from '@ethereumjs/util'

import { isTerminator } from '../util/hex.ts'
import { bytesToNibbles } from '../util/nibbles.ts'

import { BranchMPTNode } from './branch.ts'
import { ExtensionMPTNode } from './extension.ts'
import { LeafMPTNode } from './leaf.ts'

/** Decode a raw RLP node array into a typed MPT node. */
export function decodeRawMPTNode(raw: Uint8Array[]) {
  if (raw.length === 17) {
    return BranchMPTNode.fromArray(raw)
  } else if (raw.length === 2) {
    const nibbles = bytesToNibbles(raw[0])
    if (isTerminator(nibbles)) {
      return new LeafMPTNode(LeafMPTNode.decodeKey(nibbles), raw[1])
    }
    return new ExtensionMPTNode(ExtensionMPTNode.decodeKey(nibbles), raw[1])
  } else {
    throw EthereumJSErrorWithoutCode('Invalid node')
  }
}

/** Type guard: value is a raw (non-RLP-wrapped) node array. */
export function isRawMPTNode(n: Uint8Array | NestedUint8Array): n is Uint8Array[] {
  return Array.isArray(n) && !(n instanceof Uint8Array)
}

/** Decode an RLP-serialized MPT node from bytes. */
export function decodeMPTNode(node: Uint8Array) {
  const decodedNode = RLP.decode(Uint8Array.from(node))
  if (!isRawMPTNode(decodedNode)) {
    throw EthereumJSErrorWithoutCode('Invalid node')
  }
  return decodeRawMPTNode(decodedNode)
}
