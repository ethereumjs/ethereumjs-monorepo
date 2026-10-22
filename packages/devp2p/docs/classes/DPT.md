[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPT

# Class: DPT

Defined in: [packages/devp2p/src/dpt/dpt.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L24)

Distributed peer table (DPT) for Ethereum node discovery (discv4) and DNS ENR refresh.

## Constructors

### Constructor

> **new DPT**(`privateKey`, `options`): `DPT`

Defined in: [packages/devp2p/src/dpt/dpt.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L49)

#### Parameters

##### privateKey

`Uint8Array`

##### options

[`DPTOptions`](../interfaces/DPTOptions.md)

#### Returns

`DPT`

## Properties

### events

> **events**: `EventEmitter`\<[`DPTEvent`](../interfaces/DPTEvent.md)\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L25)

***

### id

> `readonly` **id**: `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/dpt/dpt.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L31)

## Methods

### \_addPeerBatch()

> **\_addPeerBatch**(`peers`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L128)

#### Parameters

##### peers

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Returns

`void`

***

### \_onKBucketPing()

> **\_onKBucketPing**(`oldPeers`, `newPeer`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L106)

#### Parameters

##### oldPeers

[`PeerInfo`](../interfaces/PeerInfo.md)[]

##### newPeer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### addPeer()

> **addPeer**(`obj`): `Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L158)

#### Parameters

##### obj

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)\>

***

### banPeer()

> **banPeer**(`obj`, `maxAge?`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L226)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

##### maxAge?

`number`

#### Returns

`void`

***

### bind()

> **bind**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L97)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### bootstrap()

> **bootstrap**(`peer`): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L141)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`void`\>

***

### confirmPeer()

> **confirmPeer**(`id`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L188)

Add peer to a confirmed list of peers (peers meeting some
level of quality, e.g. being on the same network) to allow
for a more selective findNeighbours request and sending
(with activated `onlyConfirmed` setting)

#### Parameters

##### id

`string`

Unprefixed hex id

#### Returns

`void`

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L101)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### getClosestPeers()

> **getClosestPeers**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/dpt.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L206)

#### Parameters

##### id

`Uint8Array`

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### getDnsPeers()

> **getDnsPeers**(): `Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L231)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

***

### getPeer()

> **getPeer**(`obj`): [`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

Defined in: [packages/devp2p/src/dpt/dpt.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L194)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

***

### getPeers()

> **getPeers**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/dpt.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L198)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### numPeers()

> **numPeers**(): `number`

Defined in: [packages/devp2p/src/dpt/dpt.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L202)

#### Returns

`number`

***

### refresh()

> **refresh**(): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L235)

#### Returns

`Promise`\<`void`\>

***

### removePeer()

> **removePeer**(`obj`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L217)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`
