import { NodeType, TNode } from '../node/types'
import {
  BranchNode,
  ExtensionNode,
  LeafNode,
  NullNode,
  ProofNode,
  decodeToNode,
  getNodeType,
} from '../node'
import { RLP } from '@ethereumjs/rlp'
import { bytesToNibbles } from '../../util/nibbles'
import debug, { Debugger } from 'debug'
import { bytesToPrefixedHexString } from '@ethereumjs/util'
import { removeHexPrefix } from '../../util/hex'
import { MerklePatriciaTrie } from '../merklePatricia'

export async function decodeNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  d_bug?: Debugger
): Promise<TNode> {
  const dbug = d_bug ? d_bug.extend('decodeNode') : this.debug.extend('decodeNode')
  dbug(`encoded (${encoded.length})`)
  if (encoded.length === 32) {
    const node = await decodeHashedChild.bind(this)(encoded, dbug)
    dbug(`encoding as ${node.getType()}`)
    return node
  }
  if (encoded.length === 17) {
    const node = await decodeBranchNode.bind(this)(encoded, dbug)
    dbug(`encoding as ${node.getType()}`)
    return node
  } else {
    const raw = RLP.decode(encoded) as Uint8Array[]
    dbug(`raw (${raw.length}): ${raw.map((r) => r)}`)
    dbug(`raw (${raw.length}): ${raw.map((r) => r.length).join(', ')}`)
  }
  const decode: Record<NodeType, () => Promise<TNode>> = {
    NullNode: async () => {
      return new NullNode({})
    },
    LeafNode: async () => this._decodeLeafNode(encoded, d_bug),
    ProofNode: async () => this._decodeHashedChild(encoded as Uint8Array, dbug),
    ExtensionNode: async () => this._decodeExtensionNode(encoded as Uint8Array, dbug),
    BranchNode: async () => this._decodeBranchNode(encoded as Uint8Array, dbug),
  }
  const type = getNodeType(encoded)
  const node = await decode[type]()
  return node
}
export async function decodeHashedChild(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  d_bug?: Debugger
): Promise<TNode> {
  const dbug = d_bug ? d_bug.extend('decodeHashedChild') : debug('decodeHashedChild')
  dbug(`branch is a hash`)
  let node = await this.lookupNodeByHash(encoded as Uint8Array, dbug)
  if (node) {
    dbug(`${node.getType()} found node in db`)
    return node
  }
  node = new ProofNode({
    nibbles: [],
    hash: encoded as Uint8Array,
    load: async () => (await this.lookupNodeByHash(encoded as Uint8Array)) ?? node!.copy(),
    hashFunction: this.hashFunction,
  })
  dbug(`decoded branch into ProofNode`)
  return node
}

export async function decodeLeafNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  d_bug?: Debugger
) {
  d_bug = d_bug ? d_bug.extend('decodeLeaf') : debug('decodeLeaf')
  d_bug(`encoded: ${bytesToPrefixedHexString(encoded)}`)
  const [key, value] = RLP.decode(encoded) as Uint8Array[]
  d_bug(`key: ${bytesToPrefixedHexString(key)}`)
  d_bug(`nibbles... ${bytesToNibbles(key)}`)
  d_bug(`value: ${Uint8Array.from(value)}`)
  const node = new LeafNode({
    key: bytesToNibbles(key),
    value,
    hashFunction: this.hashFunction,
  })

  return node
}

export async function decodeBranchNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  dbug?: Debugger
): Promise<BranchNode> {
  dbug = dbug ? dbug.extend('decodeBranchNode') : debug('decodeBranchNode')
  const _encoded: (Uint8Array | Uint8Array[])[] = (encoded as any).map((e: any) => {
    return e !== undefined
      ? e.length > 1
        ? Uint8Array.from([...e])
        : Uint8Array.from([e])
      : Uint8Array.from([])
  })
  for (const [i, e] of _encoded.entries()) {
    dbug(`encoded${i}: ${e}`)
  }
  // const raw = RLP.decode(encoded as Uint8Array) as EncodedChild[]
  const value = _encoded[16] as Uint8Array
  // const branches: EncodedChild[] = Array.from({ length: 16 }, (_, i) => raw[i])
  let decoded = new BranchNode({
    value,
    hashFunction: this.hashFunction,
  })
  for await (const [i, branch] of _encoded.slice(0, 16).entries()) {
    dbug.extend(`child[${i}]`)(`(${branch.length})`)
    let child: TNode
    if (branch.length === 0) {
      child = new NullNode({})
    } else if (branch.length === 2) {
      child = new LeafNode({
        key: removeHexPrefix(bytesToNibbles(branch[0] as Uint8Array)),
        value: branch[1] as Uint8Array,
        hashFunction: this.hashFunction,
      })
    } else {
      child = await decodeNode.bind(this)(branch as Uint8Array, dbug.extend(i.toString()))
    }
    decoded = decoded.setChild(i, child)
  }
  return decoded
}

export async function decodeExtensionNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  dbug?: Debugger
): Promise<TNode> {
  dbug = dbug ? dbug.extend('decodeExtension') : debug('decodeExtension')
  dbug(`encoded: ${encoded}`)
  const [key, subNode] = RLP.decode(encoded) as Uint8Array[]
  let child: TNode
  if (subNode.length < 32) {
    child = await decodeToNode(RLP.encode(subNode))
    dbug(`child: ${child.getType()}`)
  }
  if (subNode.length === 32) {
    child =
      (await this.lookupNodeByHash(subNode, dbug)) ??
      new ProofNode({
        hash: subNode as Uint8Array,
        nibbles: [],
        load: async () => (await this.lookupNodeByHash(subNode)) ?? child.copy(),
      })
  } else {
    child = await decodeNode.bind(this)(subNode, dbug)
  }
  const decoded = new ExtensionNode({
    keyNibbles: removeHexPrefix(bytesToNibbles(key)),
    subNode: child,
  })
  return decoded
}
