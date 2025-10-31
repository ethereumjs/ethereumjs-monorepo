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

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L210)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### \_getOpenQueueSlots()

> **\_getOpenQueueSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L206)

#### Returns

`number`

***

### \_getOpenSlots()

> **\_getOpenSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L202)

#### Returns

`number`

***

### \_isAlive()

> **\_isAlive**(): `boolean`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L194)

#### Returns

`boolean`

***

### \_isAliveCheck()

> **\_isAliveCheck**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L198)

#### Returns

`void`

***

### \_onConnect()

> **\_onConnect**(`socket`, `peerId`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L219)

#### Parameters

##### socket

`Socket`

##### peerId

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`void`

***

### \_refillConnections()

> **\_refillConnections**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L306)

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

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L187)

#### Parameters

##### id

`Uint8Array`

#### Returns

`void`

***

### getPeers()

> **getPeers**(): [`Peer`](Peer.md)[]

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L183)

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
