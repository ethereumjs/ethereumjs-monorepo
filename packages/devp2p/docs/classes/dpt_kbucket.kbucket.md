[@ethereumjs/devp2p](../README.md) / [dpt/kbucket](../modules/dpt_kbucket.md) / KBucket

# Class: KBucket

[dpt/kbucket](../modules/dpt_kbucket.md).KBucket

## Hierarchy

- `EventEmitter`

  ↳ **KBucket**

## Table of contents

### Constructors

- [constructor](dpt_kbucket.kbucket.md#constructor)

### Properties

- [\_kbucket](dpt_kbucket.kbucket.md#_kbucket)
- [\_peers](dpt_kbucket.kbucket.md#_peers)
- [defaultMaxListeners](dpt_kbucket.kbucket.md#defaultmaxlisteners)

### Methods

- [add](dpt_kbucket.kbucket.md#add)
- [addListener](dpt_kbucket.kbucket.md#addlistener)
- [closest](dpt_kbucket.kbucket.md#closest)
- [emit](dpt_kbucket.kbucket.md#emit)
- [eventNames](dpt_kbucket.kbucket.md#eventnames)
- [get](dpt_kbucket.kbucket.md#get)
- [getAll](dpt_kbucket.kbucket.md#getall)
- [getMaxListeners](dpt_kbucket.kbucket.md#getmaxlisteners)
- [listenerCount](dpt_kbucket.kbucket.md#listenercount)
- [listeners](dpt_kbucket.kbucket.md#listeners)
- [off](dpt_kbucket.kbucket.md#off)
- [on](dpt_kbucket.kbucket.md#on)
- [once](dpt_kbucket.kbucket.md#once)
- [prependListener](dpt_kbucket.kbucket.md#prependlistener)
- [prependOnceListener](dpt_kbucket.kbucket.md#prependoncelistener)
- [rawListeners](dpt_kbucket.kbucket.md#rawlisteners)
- [remove](dpt_kbucket.kbucket.md#remove)
- [removeAllListeners](dpt_kbucket.kbucket.md#removealllisteners)
- [removeListener](dpt_kbucket.kbucket.md#removelistener)
- [setMaxListeners](dpt_kbucket.kbucket.md#setmaxlisteners)
- [getKeys](dpt_kbucket.kbucket.md#getkeys)
- [listenerCount](dpt_kbucket.kbucket.md#listenercount)
- [once](dpt_kbucket.kbucket.md#once)

## Constructors

### constructor

• **new KBucket**(`localNodeId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `localNodeId` | `Buffer` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

## Properties

### \_kbucket

• **\_kbucket**: `KBucket`<Contact\>

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

___

### \_peers

• **\_peers**: `Map`<string, [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)\>

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L14)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### add

▸ **add**(`peer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L50)

___

### addListener

▸ **addListener**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### closest

▸ **closest**(`id`): [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L68)

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

### get

▸ **get**(`obj`): ``null`` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |

#### Returns

``null`` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L55)

___

### getAll

▸ **getAll**(): [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Returns

[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L64)

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

▸ **off**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### prependListener

▸ **prependListener**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

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

### remove

▸ **remove**(`obj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L72)

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [KBucket](dpt_kbucket.kbucket.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[KBucket](dpt_kbucket.kbucket.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### getKeys

▸ `Static` **getKeys**(`obj`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |

#### Returns

`string`[]

#### Defined in

[packages/devp2p/src/dpt/kbucket.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L40)

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
