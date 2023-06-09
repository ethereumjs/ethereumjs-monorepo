import { RLP } from '@ethereumjs/rlp'
import { bytesToPrefixedHexString, equalsBytes } from '@ethereumjs/util'
import debug from 'debug'

import { removeHexPrefix } from '../../util/hex'
import { bytesToNibbles } from '../../util/nibbles'
import { BranchNode, ExtensionNode, LeafNode, NullNode, ProofNode, decodeToNode } from '../node'

import type { MerklePatriciaTrie } from '../merklePatricia'
import type { TNode } from '../node/types'
import type { Debugger } from 'debug'

const isValidRLPInput = (input: Uint8Array): boolean => {
  try {
    RLP.decode(input)
    return true
  } catch (e) {
    return false
  }
}

export async function decodeNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  d_bug?: Debugger
): Promise<TNode> {
  const dbug = d_bug ? d_bug.extend('decodeNode') : this.debug.extend('decodeNode')
  dbug(`nodeHash: ${bytesToPrefixedHexString(this.hashFunction(encoded))}`)
  const encodedLength = encoded.length
  dbug(`encoded length: (${encodedLength})`)
  const decoded = RLP.decode(encoded) as Uint8Array[]
  const decodedLength = decoded.length
  dbug(`decoded length: (${decodedLength})`)
  let node: TNode
  let subNode: TNode
  switch (encodedLength) {
    // case 0: {
    //   dbug(`encoding as NullNode`)
    //   return new NullNode({})
    // }
    // case 2: {
    //   switch (decodedLength) {
    //     case 2: {
    //       dbug(`decoded[1] length: (${decoded[1].length})`)
    //       switch (decoded[1].length) {
    //         case 32: {
    //           dbug(`subNode is a HashedNode -- decoding...`)
    //           const subNode = await this._decodeHashedChild(decoded[1], dbug)
    //           return new ExtensionNode({
    //             keyNibbles: bytesToNibbles(decoded[0]),
    //             subNode,
    //           })
    //         }
    //         case 17: {
    //           dbug(`subNode is a BranchNode -- decoding...`)
    //           const subNode = await decodeBranchNode.bind(this)(encoded, dbug)
    //           return new ExtensionNode({
    //             keyNibbles: bytesToNibbles(decoded[0]),
    //             subNode,
    //           })
    //         }
    //         default:
    //           dbug(`subNode is a LeafNode -- decoding...`)
    //           const subNode = await this._decodeLeafNode(encoded, dbug)
    //           return new ExtensionNode({
    //             keyNibbles: bytesToNibbles(decoded[0]),
    //             subNode,
    //           })
    //       }
    //     }
    //     case 0: {
    //       dbug(`encoding as NullNode`)
    //       return new NullNode({})
    //     }
    //     case 17: {
    //       const node = await decodeBranchNode.bind(this)(encoded, dbug)
    //       dbug(`encoding as BranchNode`)
    //       return node
    //     }
    //     case 32: {
    //       const node = await decodeHashedChild.bind(this)(encoded, dbug)
    //       dbug(`encoding as ${node.getType()}`)
    //       return node
    //     }
    //     default:
    //       break
    //   }
    // }
    // case 17: {
    //   const node = await decodeBranchNode.bind(this)(encoded, dbug)
    //   dbug(`encoding as BranchNode`)
    //   return node
    // }
    // case 32: {
    //   const node = await decodeHashedChild.bind(this)(encoded, dbug)
    //   dbug(`encoding as ${node.getType()}`)
    //   return node
    // }
    default:
      debug(`decoded: ${decoded}`)
      switch (decodedLength) {
        case 0: {
          dbug(`encoding as NullNode`)
          return new NullNode({})
        }
        case 2:
          {
            dbug(`decoded[0] length: (${decoded[0].length})`)
            dbug(`decoded[1] length: (${decoded[1].length})`)
            switch (decoded[1].length) {
              case 32: {
                const subNode = await this._decodeHashedChild(decoded[1], dbug)
                dbug(`encoding as ExtensionNode`)
                return new ExtensionNode({
                  keyNibbles: removeHexPrefix(bytesToNibbles(decoded[0])),
                  subNode,
                })
              }
              case 17: {
                dbug(`subNode is a BranchNode -- decoding...`)
                subNode = await this._decodeBranchNode(RLP.encode(decoded[1]), dbug)
                return new ExtensionNode({
                  keyNibbles: removeHexPrefix(bytesToNibbles(decoded[0])),
                  subNode,
                })
              }
              default:
                dbug(`building new LeafNode`)
                node = new LeafNode({
                  key: removeHexPrefix(bytesToNibbles(decoded[0])),
                  value: decoded[1],
                  hashFunction: this.hashFunction,
                  source: dbug,
                })
                dbug(`equal? ${equalsBytes(node.hash(), this.hashFunction(encoded))}`)
                if (equalsBytes(node.hash(), this.hashFunction(encoded))) {
                  dbug(`hash: ${bytesToPrefixedHexString(node.hash())}`)
                  dbug(`value: ${node.value}`)
                  return node
                }
            }
          }
          break
        case 17: {
          node = await this._decodeBranchNode(encoded, dbug)
          dbug(`encoding as BranchNode`)
          return node
        }
        case 32: {
          const node = await this._decodeHashedChild(encoded, dbug)
          dbug(`encoding as ${node.getType()}`)
          return node
        }
        default:
          break
      }
  }
  // if (decodedLength === 17) {
  //   const node = await decodeBranchNode.bind(this)(encoded, dbug)
  //   dbug(`encoding as ${node.getType()}`)
  //   return node
  // } else if (encoded.length === 32) {
  //   const node = await decodeHashedChild.bind(this)(encoded, dbug)
  //   dbug(`encoding as ${node.getType()}`)
  //   return node
  // } else if (decodedLength === 2) {
  //   dbug(`decoded: length=${decoded.length}`)
  //   dbug(`decoded[0] length= ${decoded[0].length}`)
  //   dbug(`decoded[1] length= ${decoded[1].length}`)
  //   if (decoded[1].length === 32) {
  //     const node = await decodeExtensionNode.bind(this)(encoded, dbug)
  //     dbug(`encoding as ${node.getType()}`)
  //     return node
  //   } else if (decoded[1].length === 17) {
  //     const subNodeRaw = decoded[1] as any as Uint8Array[]
  //     for await (const [idx, r] of subNodeRaw.entries()) {
  //       dbug(`subNodeRaw[${idx}]: ${r}`)
  //       const subNodeBranch = await this._decodeToNode(r, dbug)
  //       dbug(`subNodeBranch[${idx}]: ${subNodeBranch.getType()}`)
  //     }
  //     const subNode = new BranchNode({
  //       hashFunction: this.hashFunction,
  //       branches: subNodeRaw.slice(0, 16),
  //       source: dbug,
  //       value: subNodeRaw[17],
  //     })
  //     // for await (const [idx, d] of decoded[1].slice(0, 16).entries()) {
  //     //   dbug(`decoded[1][${idx}]: ( ${(d as any).length} bytes ) ${d}`)
  //     //   subNode.setChild(idx, await decodeToNode.bind(this)((d as any), dbug))
  //     // }
  //     const node = new ExtensionNode({
  //       keyNibbles: removeHexPrefix(bytesToNibbles(decoded[0])),
  //       subNode,
  //     })
  //     // const node = await decodeExtensionNode.bind(this)(encoded, dbug)
  //     dbug(`encoding as ${node.getType()}`)
  //     return node

  //   } else {
  //     return new LeafNode({
  //       key: removeHexPrefix(bytesToNibbles(decoded[0])),
  //       value: decoded[1],
  //       hashFunction: this.hashFunction,
  //       source: dbug
  //     })
  //   }
  // }
  throw new Error(`encoded length (${encodedLength}) -- decoded length (${decodedLength})`)
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
    source: dbug,
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
    source: d_bug,
  })

  return node
}

export async function decodeBranchNode(
  this: MerklePatriciaTrie,
  encoded: Uint8Array,
  dbug?: Debugger
): Promise<BranchNode> {
  dbug = dbug ? dbug.extend('decodeBranchNode') : debug('decodeBranchNode')
  dbug(`encoded: ${encoded}`)
  const _decoded = RLP.decode(encoded) as Uint8Array[]
  for (const [i, e] of _decoded.entries()) {
    if (e.length === 32) {
      dbug(`encoded${i}: ${bytesToPrefixedHexString(e as Uint8Array)}`)
    } else {
      dbug(`encoded${i}: length=${e.length} [${e}]`)
    }
  }
  // const raw = RLP.decode(encoded as Uint8Array) as EncodedChild[]
  const value = _decoded[16] as Uint8Array
  // const branches: EncodedChild[] = Array.from({ length: 16 }, (_, i) => raw[i])
  let decoded = new BranchNode({
    value,
    hashFunction: this.hashFunction,
    source: dbug,
  })
  for await (const [i, branch] of _decoded.slice(0, 16).entries()) {
    dbug.extend(`child[${i}]`)(`(${branch.length})`)
    let child: TNode
    if (branch.length === 0) {
      child = new NullNode({
        source: dbug,
      })
    } else if (branch.length === 2) {
      child = new LeafNode({
        key: removeHexPrefix(bytesToNibbles(branch[0] as any)),
        value: branch[1] as any,
        hashFunction: this.hashFunction,
        source: dbug,
      })
    } else if (branch.length === 32) {
      child = await decodeHashedChild.bind(this)(branch as Uint8Array, dbug)
    } else {
      dbug.extend(`child[${i}]`)(`(${branch.length})`)
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
        hashFunction: this.hashFunction,
        source: dbug,
      })
  } else {
    child = await decodeNode.bind(this)(subNode, dbug)
  }
  const decoded = new ExtensionNode({
    keyNibbles: removeHexPrefix(bytesToNibbles(key)),
    subNode: child,
    hashFunction: this.hashFunction,
    source: dbug,
  })
  return decoded
}
