[@ethereumjs/devp2p](../README.md) / [dpt/server](../modules/dpt_server.md) / Server

# Class: Server

[dpt/server](../modules/dpt_server.md).Server

## Hierarchy

- `EventEmitter`

  ↳ **Server**

## Table of contents

### Constructors

- [constructor](dpt_server.server.md#constructor)

### Properties

- [\_dpt](dpt_server.server.md#_dpt)
- [\_endpoint](dpt_server.server.md#_endpoint)
- [\_parityRequestMap](dpt_server.server.md#_parityrequestmap)
- [\_privateKey](dpt_server.server.md#_privatekey)
- [\_requests](dpt_server.server.md#_requests)
- [\_requestsCache](dpt_server.server.md#_requestscache)
- [\_socket](dpt_server.server.md#_socket)
- [\_timeout](dpt_server.server.md#_timeout)
- [defaultMaxListeners](dpt_server.server.md#defaultmaxlisteners)

### Methods

- [\_handler](dpt_server.server.md#_handler)
- [\_isAliveCheck](dpt_server.server.md#_isalivecheck)
- [\_send](dpt_server.server.md#_send)
- [addListener](dpt_server.server.md#addlistener)
- [bind](dpt_server.server.md#bind)
- [destroy](dpt_server.server.md#destroy)
- [emit](dpt_server.server.md#emit)
- [eventNames](dpt_server.server.md#eventnames)
- [findneighbours](dpt_server.server.md#findneighbours)
- [getMaxListeners](dpt_server.server.md#getmaxlisteners)
- [listenerCount](dpt_server.server.md#listenercount)
- [listeners](dpt_server.server.md#listeners)
- [off](dpt_server.server.md#off)
- [on](dpt_server.server.md#on)
- [once](dpt_server.server.md#once)
- [ping](dpt_server.server.md#ping)
- [prependListener](dpt_server.server.md#prependlistener)
- [prependOnceListener](dpt_server.server.md#prependoncelistener)
- [rawListeners](dpt_server.server.md#rawlisteners)
- [removeAllListeners](dpt_server.server.md#removealllisteners)
- [removeListener](dpt_server.server.md#removelistener)
- [setMaxListeners](dpt_server.server.md#setmaxlisteners)
- [listenerCount](dpt_server.server.md#listenercount)
- [once](dpt_server.server.md#once)

## Constructors

### constructor

• **new Server**(`dpt`, `privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dpt` | [DPT](dpt_dpt.dpt.md) |
| `privateKey` | `Buffer` |
| `options` | [DPTServerOptions](../interfaces/dpt_server.dptserveroptions.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/dpt/server.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L47)

## Properties

### \_dpt

• **\_dpt**: [DPT](dpt_dpt.dpt.md)

#### Defined in

[packages/devp2p/src/dpt/server.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L40)

___

### \_endpoint

• **\_endpoint**: [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)

#### Defined in

[packages/devp2p/src/dpt/server.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L43)

___

### \_parityRequestMap

• **\_parityRequestMap**: `Map`<string, string\>

#### Defined in

[packages/devp2p/src/dpt/server.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L45)

___

### \_privateKey

• **\_privateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/dpt/server.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L41)

___

### \_requests

• **\_requests**: `Map`<string, any\>

#### Defined in

[packages/devp2p/src/dpt/server.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L44)

___

### \_requestsCache

• **\_requestsCache**: `LRUCache`<string, Promise<any\>\>

#### Defined in

[packages/devp2p/src/dpt/server.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L46)

___

### \_socket

• **\_socket**: ``null`` \| `Socket`

#### Defined in

[packages/devp2p/src/dpt/server.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L47)

___

### \_timeout

• **\_timeout**: `number`

#### Defined in

[packages/devp2p/src/dpt/server.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L42)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_handler

▸ **_handler**(`msg`, `rinfo`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Buffer` |
| `rinfo` | `RemoteInfo` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L166)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L135)

___

### \_send

▸ **_send**(`peer`, `typename`, `data`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |
| `typename` | `string` |
| `data` | `any` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/dpt/server.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L139)

___

### addListener

▸ **addListener**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### bind

▸ **bind**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L77)

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

[packages/devp2p/src/dpt/server.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L84)

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

### findneighbours

▸ **findneighbours**(`peer`, `id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |
| `id` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L130)

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

▸ **off**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### ping

▸ **ping**(`peer`): `Promise`<any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`Promise`<any\>

#### Defined in

[packages/devp2p/src/dpt/server.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L94)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

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

▸ **removeAllListeners**(`event?`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[Server](dpt_server.server.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [Server](dpt_server.server.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[Server](dpt_server.server.md)

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
