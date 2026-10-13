[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / RLPx

# Class: RLPx

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L32)

## Constructors

### Constructor

> **new RLPx**(`privateKey`, `options`): `RLPx`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L58)

#### Parameters

##### privateKey

`Uint8Array`

##### options

[`RLPxOptions`](../interfaces/RLPxOptions.md)

#### Returns

`RLPx`

## Properties

### clientId

> `readonly` **clientId**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L39)

***

### events

> **events**: `EventEmitter`\<[`RLPxEvent`](../interfaces/RLPxEvent.md)\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L33)

***

### id

> `readonly` **id**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L35)

## Methods

### \_connectToPeer()

> **\_connectToPeer**(`peer`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L212)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### \_getOpenQueueSlots()

> **\_getOpenQueueSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L208)

#### Returns

`number`

***

### \_getOpenSlots()

> **\_getOpenSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L204)

#### Returns

`number`

***

### \_isAlive()

> **\_isAlive**(): `boolean`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L196)

#### Returns

`boolean`

***

### \_isAliveCheck()

> **\_isAliveCheck**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L200)

#### Returns

`void`

***

### \_onConnect()

> **\_onConnect**(`socket`, `peerId`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L221)

#### Parameters

##### socket

`Socket`

##### peerId

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`void`

***

### \_refillConnections()

> **\_refillConnections**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L310)

#### Returns

`void`

***

### connect()

> **connect**(`peer`): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L148)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L134)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### disconnect()

> **disconnect**(`id`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L188)

#### Parameters

##### id

`Uint8Array`

#### Returns

`void`

***

### getPeers()

> **getPeers**(): [`Peer`](Peer.md)[]

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L184)

#### Returns

[`Peer`](Peer.md)[]

***

### listen()

> **listen**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L125)

#### Parameters

##### args

...`any`[]

#### Returns

`void`
