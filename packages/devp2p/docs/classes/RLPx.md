[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / RLPx

# Class: RLPx

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:31](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L31)

## Constructors

### new RLPx()

> **new RLPx**(`privateKey`, `options`): [`RLPx`](RLPx.md)

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:57](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L57)

#### Parameters

##### privateKey

`Uint8Array`

##### options

[`RLPxOptions`](../interfaces/RLPxOptions.md)

#### Returns

[`RLPx`](RLPx.md)

## Properties

### clientId

> `readonly` **clientId**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:38](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L38)

***

### events

> **events**: `EventEmitter`\<[`RLPxEvent`](../interfaces/RLPxEvent.md)\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:32](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L32)

***

### id

> `readonly` **id**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:34](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L34)

## Methods

### \_connectToPeer()

> **\_connectToPeer**(`peer`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:207](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L207)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### \_getOpenQueueSlots()

> **\_getOpenQueueSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:203](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L203)

#### Returns

`number`

***

### \_getOpenSlots()

> **\_getOpenSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:199](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L199)

#### Returns

`number`

***

### \_isAlive()

> **\_isAlive**(): `boolean`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:191](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L191)

#### Returns

`boolean`

***

### \_isAliveCheck()

> **\_isAliveCheck**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:195](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L195)

#### Returns

`void`

***

### \_onConnect()

> **\_onConnect**(`socket`, `peerId`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:216](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L216)

#### Parameters

##### socket

`Socket`

##### peerId

`null` | `Uint8Array`

#### Returns

`void`

***

### \_refillConnections()

> **\_refillConnections**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:303](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L303)

#### Returns

`void`

***

### connect()

> **connect**(`peer`): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:148](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L148)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:134](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L134)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### disconnect()

> **disconnect**(`id`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:184](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L184)

#### Parameters

##### id

`Uint8Array`

#### Returns

`void`

***

### getPeers()

> **getPeers**(): ([`Peer`](Peer.md) \| `Socket`)[]

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:180](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L180)

#### Returns

([`Peer`](Peer.md) \| `Socket`)[]

***

### listen()

> **listen**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:125](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L125)

#### Parameters

##### args

...`any`[]

#### Returns

`void`
