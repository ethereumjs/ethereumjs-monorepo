[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ProtocolEvent

# Interface: ProtocolEvent

Defined in: [packages/devp2p/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L25)

## Properties

### message

> **message**: \[`0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `13` \| `14` \| `15` \| `16`, `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`\]

Defined in: [packages/devp2p/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L26)

***

### status

> **status**: `object`

Defined in: [packages/devp2p/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L27)

#### bestHash

> **bestHash**: `Uint8Array`

#### chainId

> **chainId**: `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

#### forkId?

> `optional` **forkId**: `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

#### genesisHash

> **genesisHash**: `Uint8Array`

#### td

> **td**: `Uint8Array`
