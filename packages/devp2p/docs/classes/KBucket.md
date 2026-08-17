[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / KBucket

# Class: KBucket

Defined in: [packages/devp2p/src/dpt/kbucket.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L11)

## Constructors

### Constructor

> **new KBucket**(`localNodeId`): `KBucket`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

#### Parameters

##### localNodeId

`Uint8Array`

#### Returns

`KBucket`

## Properties

### events

> **events**: `EventEmitter`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L12)

## Methods

### add()

> **add**(`peer`): `void` \| `KBucket`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L53)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void` \| `KBucket`

***

### closest()

> **closest**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L71)

#### Parameters

##### id

`Uint8Array`

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### get()

> **get**(`obj`): [`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L58)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

***

### getAll()

> **getAll**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L67)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### remove()

> **remove**(`obj`): `void`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L75)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`

***

### getKeys()

> `static` **getKeys**(`obj`): `string`[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L42)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`string`[]
