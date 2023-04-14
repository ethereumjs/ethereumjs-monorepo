import type {
  BatchDBOp,
  DB,
  EmbeddedNode,
  FoundNodeFunction,
  Nibbles,
  TrieNode,
  TrieOpts,
} from '../types'

export type TrieVersion = 0 | 1

type BatchDBOpV1 = {}
export type BatchDBOpV<TVersion extends TrieVersion> = TVersion extends 0
  ? BatchDBOp
  : TVersion extends 1
  ? BatchDBOpV1
  : never

type TrieNodeV1 = {}
export type TrieNodeV<TVersion extends TrieVersion> = TVersion extends 0
  ? TrieNode
  : TVersion extends 1
  ? TrieNodeV1
  : never

type NibblesV1 = {}
export type NibblesV<TVersion extends TrieVersion> = TVersion extends 0
  ? Nibbles
  : TVersion extends 1
  ? NibblesV1
  : never

type EmbeddedNodeV1 = {}
export type EmbeddedNodeV<TVersion extends TrieVersion> = TVersion extends 0
  ? EmbeddedNode
  : TVersion extends 1
  ? EmbeddedNodeV1
  : never

type PathV1 = {
  node: Uint8Array
  remaining: Uint8Array
  stack: Uint8Array[]
}
export type PathV<TVersion extends TrieVersion> = TVersion extends 0
  ? {
      node: TrieNode | null
      remaining: Nibbles
      stack: TrieNode[]
    }
  : TVersion extends 1
  ? PathV1
  : never

type FoundNodeFunctionV1 = (...args: any) => Promise<any>
export type FoundNodeFunctionV<TVersion extends TrieVersion> = TVersion extends 0
  ? FoundNodeFunction
  : TVersion extends 1
  ? FoundNodeFunctionV1
  : never

type CreateTrieOptsV1 = {}
export type CreateTrieOptsV<TVersion extends TrieVersion> = TVersion extends 0
  ? TrieOpts
  : TVersion extends 1
  ? CreateTrieOptsV1
  : never

type DBv1 = {}
export type DBv<TVersion extends TrieVersion> = TVersion extends 0
  ? DB
  : TVersion extends 1
  ? DBv1
  : never
