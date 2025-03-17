[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPT

# Class: DPT

Defined in: [packages/devp2p/src/dpt/dpt.ts:18](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L18)

## Constructors

### new DPT()

> **new DPT**(`privateKey`, `options`): [`DPT`](DPT.md)

Defined in: [packages/devp2p/src/dpt/dpt.ts:43](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L43)

#### Parameters

##### privateKey

`Uint8Array`

##### options

[`DPTOptions`](../interfaces/DPTOptions.md)

#### Returns

[`DPT`](DPT.md)

## Properties

### events

> **events**: `EventEmitter`\<[`DPTEvent`](../interfaces/DPTEvent.md)\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:19](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L19)

***

### id

> `readonly` **id**: `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/dpt/dpt.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L25)

## Methods

### \_addPeerBatch()

> **\_addPeerBatch**(`peers`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:123](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L123)

#### Parameters

##### peers

[`PeerInfo`](../interfaces/PeerInfo.md)[]

#### Returns

`void`

***

### \_onKBucketPing()

> **\_onKBucketPing**(`oldPeers`, `newPeer`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:101](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L101)

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:152](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L152)

#### Parameters

##### obj

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)\>

***

### banPeer()

> **banPeer**(`obj`, `maxAge`?): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:218](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L218)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`

##### maxAge?

`number`

#### Returns

`void`

***

### bind()

> **bind**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:92](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L92)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### bootstrap()

> **bootstrap**(`peer`): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:136](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L136)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`void`\>

***

### confirmPeer()

> **confirmPeer**(`id`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:182](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L182)

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

Defined in: [packages/devp2p/src/dpt/dpt.ts:96](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L96)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### getClosestPeers()

> **getClosestPeers**(`id`): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/dpt.ts:200](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L200)

#### Parameters

##### id

`Uint8Array`

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### getDnsPeers()

> **getDnsPeers**(): `Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:223](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L223)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

***

### getPeer()

> **getPeer**(`obj`): `null` \| [`PeerInfo`](../interfaces/PeerInfo.md)

Defined in: [packages/devp2p/src/dpt/dpt.ts:188](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L188)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`

#### Returns

`null` \| [`PeerInfo`](../interfaces/PeerInfo.md)

***

### getPeers()

> **getPeers**(): [`PeerInfo`](../interfaces/PeerInfo.md)[]

Defined in: [packages/devp2p/src/dpt/dpt.ts:192](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L192)

#### Returns

[`PeerInfo`](../interfaces/PeerInfo.md)[]

***

### numPeers()

> **numPeers**(): `number`

Defined in: [packages/devp2p/src/dpt/dpt.ts:196](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L196)

#### Returns

`number`

***

### refresh()

> **refresh**(): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/dpt/dpt.ts:227](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L227)

#### Returns

`Promise`\<`void`\>

***

### removePeer()

> **removePeer**(`obj`): `void`

Defined in: [packages/devp2p/src/dpt/dpt.ts:210](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L210)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`

#### Returns

`void`
