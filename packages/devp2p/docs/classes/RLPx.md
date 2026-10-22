[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / RLPx

# Class: RLPx

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L33)

RLPx transport: encrypted TCP sessions, HELLO/capability negotiation, and sub-protocol multiplexing.

## Constructors

### Constructor

> **new RLPx**(`privateKey`, `options`): `RLPx`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L59)

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

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L40)

***

### events

> **events**: `EventEmitter`\<[`RLPxEvent`](../interfaces/RLPxEvent.md)\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L34)

***

### id

> `readonly` **id**: `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L36)

## Methods

### \_connectToPeer()

> **\_connectToPeer**(`peer`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L213)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`void`

***

### \_getOpenQueueSlots()

> **\_getOpenQueueSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L209)

#### Returns

`number`

***

### \_getOpenSlots()

> **\_getOpenSlots**(): `number`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L205)

#### Returns

`number`

***

### \_isAlive()

> **\_isAlive**(): `boolean`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L197)

#### Returns

`boolean`

***

### \_isAliveCheck()

> **\_isAliveCheck**(): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L201)

#### Returns

`void`

***

### \_onConnect()

> **\_onConnect**(`socket`, `peerId`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L222)

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

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L311)

#### Returns

`void`

***

### connect()

> **connect**(`peer`): `Promise`\<`void`\>

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L149)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L135)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### disconnect()

> **disconnect**(`id`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L189)

#### Parameters

##### id

`Uint8Array`

#### Returns

`void`

***

### getPeers()

> **getPeers**(): [`Peer`](Peer.md)[]

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L185)

#### Returns

[`Peer`](Peer.md)[]

***

### listen()

> **listen**(...`args`): `void`

Defined in: [packages/devp2p/src/rlpx/rlpx.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L126)

#### Parameters

##### args

...`any`[]

#### Returns

`void`
