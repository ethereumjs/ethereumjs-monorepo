[@ethereumjs/devp2p](../README.md) / [rlpx/rlpx](../modules/rlpx_rlpx.md) / RLPx

# Class: RLPx

[rlpx/rlpx](../modules/rlpx_rlpx.md).RLPx

## Hierarchy

- `EventEmitter`

  ↳ **RLPx**

## Table of contents

### Constructors

- [constructor](rlpx_rlpx.rlpx.md#constructor)

### Properties

- [\_capabilities](rlpx_rlpx.rlpx.md#_capabilities)
- [\_clientId](rlpx_rlpx.rlpx.md#_clientid)
- [\_common](rlpx_rlpx.rlpx.md#_common)
- [\_dpt](rlpx_rlpx.rlpx.md#_dpt)
- [\_id](rlpx_rlpx.rlpx.md#_id)
- [\_listenPort](rlpx_rlpx.rlpx.md#_listenport)
- [\_maxPeers](rlpx_rlpx.rlpx.md#_maxpeers)
- [\_peers](rlpx_rlpx.rlpx.md#_peers)
- [\_peersLRU](rlpx_rlpx.rlpx.md#_peerslru)
- [\_peersQueue](rlpx_rlpx.rlpx.md#_peersqueue)
- [\_privateKey](rlpx_rlpx.rlpx.md#_privatekey)
- [\_refillIntervalId](rlpx_rlpx.rlpx.md#_refillintervalid)
- [\_refillIntervalSelectionCounter](rlpx_rlpx.rlpx.md#_refillintervalselectioncounter)
- [\_remoteClientIdFilter](rlpx_rlpx.rlpx.md#_remoteclientidfilter)
- [\_server](rlpx_rlpx.rlpx.md#_server)
- [\_timeout](rlpx_rlpx.rlpx.md#_timeout)
- [defaultMaxListeners](rlpx_rlpx.rlpx.md#defaultmaxlisteners)

### Methods

- [\_connectToPeer](rlpx_rlpx.rlpx.md#_connecttopeer)
- [\_getOpenSlots](rlpx_rlpx.rlpx.md#_getopenslots)
- [\_isAlive](rlpx_rlpx.rlpx.md#_isalive)
- [\_isAliveCheck](rlpx_rlpx.rlpx.md#_isalivecheck)
- [\_onConnect](rlpx_rlpx.rlpx.md#_onconnect)
- [\_refillConnections](rlpx_rlpx.rlpx.md#_refillconnections)
- [addListener](rlpx_rlpx.rlpx.md#addlistener)
- [connect](rlpx_rlpx.rlpx.md#connect)
- [destroy](rlpx_rlpx.rlpx.md#destroy)
- [disconnect](rlpx_rlpx.rlpx.md#disconnect)
- [emit](rlpx_rlpx.rlpx.md#emit)
- [eventNames](rlpx_rlpx.rlpx.md#eventnames)
- [getMaxListeners](rlpx_rlpx.rlpx.md#getmaxlisteners)
- [getPeers](rlpx_rlpx.rlpx.md#getpeers)
- [listen](rlpx_rlpx.rlpx.md#listen)
- [listenerCount](rlpx_rlpx.rlpx.md#listenercount)
- [listeners](rlpx_rlpx.rlpx.md#listeners)
- [off](rlpx_rlpx.rlpx.md#off)
- [on](rlpx_rlpx.rlpx.md#on)
- [once](rlpx_rlpx.rlpx.md#once)
- [prependListener](rlpx_rlpx.rlpx.md#prependlistener)
- [prependOnceListener](rlpx_rlpx.rlpx.md#prependoncelistener)
- [rawListeners](rlpx_rlpx.rlpx.md#rawlisteners)
- [removeAllListeners](rlpx_rlpx.rlpx.md#removealllisteners)
- [removeListener](rlpx_rlpx.rlpx.md#removelistener)
- [setMaxListeners](rlpx_rlpx.rlpx.md#setmaxlisteners)
- [listenerCount](rlpx_rlpx.rlpx.md#listenercount)
- [once](rlpx_rlpx.rlpx.md#once)

## Constructors

### constructor

• **new RLPx**(`privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |
| `options` | [RLPxOptions](../interfaces/rlpx_rlpx.rlpxoptions.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L50)

## Properties

### \_capabilities

• **\_capabilities**: [Capabilities](../interfaces/rlpx_peer.capabilities.md)[]

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L39)

___

### \_clientId

• **\_clientId**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L37)

___

### \_common

• **\_common**: `default`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L40)

___

### \_dpt

• **\_dpt**: ``null`` \| [DPT](dpt_dpt.dpt.md)

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L42)

___

### \_id

• **\_id**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L33)

___

### \_listenPort

• **\_listenPort**: ``null`` \| `number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L41)

___

### \_maxPeers

• **\_maxPeers**: `number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L36)

___

### \_peers

• **\_peers**: `Map`<string, [Peer](rlpx_peer.peer.md) \| Socket\>

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L47)

___

### \_peersLRU

• **\_peersLRU**: `LRUCache`<string, boolean\>

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L44)

___

### \_peersQueue

• **\_peersQueue**: { `peer`: [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) ; `ts`: `number`  }[]

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L45)

___

### \_privateKey

• **\_privateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L32)

___

### \_refillIntervalId

• **\_refillIntervalId**: `Timeout`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L49)

___

### \_refillIntervalSelectionCounter

• **\_refillIntervalSelectionCounter**: `number` = 0

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L50)

___

### \_remoteClientIdFilter

• `Optional` **\_remoteClientIdFilter**: `string`[]

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L38)

___

### \_server

• **\_server**: ``null`` \| `Server`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L46)

___

### \_timeout

• **\_timeout**: `number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L35)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_connectToPeer

▸ **_connectToPeer**(`peer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L178)

___

### \_getOpenSlots

▸ **_getOpenSlots**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L174)

___

### \_isAlive

▸ **_isAlive**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L166)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L170)

___

### \_onConnect

▸ **_onConnect**(`socket`, `peerId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `socket` | `Socket` |
| `peerId` | ``null`` \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L187)

___

### \_refillConnections

▸ **_refillConnections**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L267)

___

### addListener

▸ **addListener**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### connect

▸ **connect**(`peer`): `Promise`<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`Promise`<void\>

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L129)

___

### destroy

▸ **destroy**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L117)

___

### disconnect

▸ **disconnect**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L161)

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:605

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:610

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:602

___

### getPeers

▸ **getPeers**(): ([Peer](rlpx_peer.peer.md) \| `Socket`)[]

#### Returns

([Peer](rlpx_peer.peer.md) \| `Socket`)[]

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L157)

___

### listen

▸ **listen**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/rlpx.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L110)

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:606

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:603

___

### off

▸ **off**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### prependListener

▸ **prependListener**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:609

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:604

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [RLPx](rlpx_rlpx.rlpx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[RLPx](rlpx_rlpx.rlpx.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
