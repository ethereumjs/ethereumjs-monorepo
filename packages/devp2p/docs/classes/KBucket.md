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

Defined in: [packages/devp2p/src/dpt/kbucket.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L54)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void` \| `KBucket`

***

### closest()

> **closest**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L72)

#### Parameters

##### id

`Uint8Array`

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### get()

> **get**(`obj`): [`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L59)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

***

### getAll()

> **getAll**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L68)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### remove()

> **remove**(`obj`): `void`

Defined in: [packages/devp2p/src/dpt/kbucket.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L76)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### getKeys()

> `static` **getKeys**(`obj`): `string`[]

Defined in: [packages/devp2p/src/dpt/kbucket.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L42)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`string`[]
