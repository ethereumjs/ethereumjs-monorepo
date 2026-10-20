[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / FoundNodeFunction

# Type Alias: FoundNodeFunction

> **FoundNodeFunction** = (`nodeRef`, `node`, `key`, `walkController`) => `void`

Defined in: [types.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L43)

Callback invoked for each node during a trie walk.

## Parameters

### nodeRef

[`NodeReferenceOrRawMPTNode`](NodeReferenceOrRawMPTNode.md)

### node

[`MPTNode`](MPTNode.md) \| `null`

### key

[`Nibbles`](Nibbles.md)

### walkController

[`WalkController`](../classes/WalkController.md)

## Returns

`void`
