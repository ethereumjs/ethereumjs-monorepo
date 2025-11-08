[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPT

# Class: DPT

Defined in: [packages/devp2p/src/dpt/dpt.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L23)

## Constructors

### Constructor

> **new DPT**(`privateKey`, `options`): `DPT`

Defined in: [packages/devp2p/src/dpt/dpt.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L48)

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L24)

***

### id

> `readonly` **id**: `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/dpt/dpt.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L30)

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L157)

#### Parameters

##### obj

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)\>

***

### banPeer()

> **banPeer**(`obj`, `maxAge?`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L223)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L187)

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L205)

#### Parameters

##### id

`Uint8Array`

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### getDnsPeers()

> **getDnsPeers**(): `Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L228)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

***

### getPeer()

> **getPeer**(`obj`): [`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

Defined in: [packages/devp2p/src/dpt/dpt.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L193)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md) \| `null`

***

### getPeers()

> **getPeers**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/dpt.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L197)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### numPeers()

> **numPeers**(): `number`

Defined in: [packages/devp2p/src/dpt/dpt.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L201)

#### Returns

`number`

***

### refresh()

> **refresh**(): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L232)

#### Returns

`Promise`\<`void`\>

***

### removePeer()

> **removePeer**(`obj`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L215)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`
