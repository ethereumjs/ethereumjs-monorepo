[@ethereumjs/trie](../README.md) › ["baseTrie"](_basetrie_.md)

# Module: "baseTrie"

## Index

### Classes

* [Trie](../classes/_basetrie_.trie.md)

### Type aliases

* [FoundNodeFunction](_basetrie_.md#foundnodefunction)
* [Proof](_basetrie_.md#proof)

## Type aliases

###  FoundNodeFunction

Ƭ **FoundNodeFunction**: *function*

*Defined in [baseTrie.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/trie/src/baseTrie.ts#L29)*

#### Type declaration:

▸ (`nodeRef`: Buffer, `node`: TrieNode | null, `key`: Nibbles, `walkController`: [WalkController](../classes/_util_walkcontroller_.walkcontroller.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`nodeRef` | Buffer |
`node` | TrieNode &#124; null |
`key` | Nibbles |
`walkController` | [WalkController](../classes/_util_walkcontroller_.walkcontroller.md) |

___

###  Proof

Ƭ **Proof**: *Buffer[]*

*Defined in [baseTrie.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/trie/src/baseTrie.ts#L21)*
