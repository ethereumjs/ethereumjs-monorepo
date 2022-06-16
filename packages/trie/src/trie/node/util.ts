import { arrToBufArr } from '@ethereumjs/util'
import RLP from 'rlp'
import { bufferToNibbles } from '../../util/nibbles'
import { isTerminator } from '../../util/hex'
import { BranchNode } from './branch'
import { LeafNode } from './leaf'
import { ExtensionNode } from './extension'

export function decodeRawNode(raw: Buffer[]) {
  if (raw.length === 17) {
    return BranchNode.fromArray(raw)
  } else if (raw.length === 2) {
    const nibbles = bufferToNibbles(raw[0])
    if (isTerminator(nibbles)) {
      return new LeafNode(LeafNode.decodeKey(nibbles), raw[1])
    }
    return new ExtensionNode(ExtensionNode.decodeKey(nibbles), raw[1])
  } else {
    throw new Error('Invalid node')
  }
}

export function decodeNode(raw: Buffer) {
  const des = arrToBufArr(RLP.decode(Uint8Array.from(raw))) as Buffer[]
  if (!Array.isArray(des)) {
    throw new Error('Invalid node')
  }
  return decodeRawNode(des)
}

export function isRawNode(n: any) {
  return Array.isArray(n) && !Buffer.isBuffer(n)
}
