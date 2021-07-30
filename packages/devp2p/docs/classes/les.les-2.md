[@ethereumjs/devp2p](../README.md) / [les](../modules/les.md) / LES

# Class: LES

[les](../modules/les.md).LES

## Hierarchy

- `EventEmitter`

  ↳ **LES**

## Table of contents

### Constructors

- [constructor](les.les-2.md#constructor)

### Properties

- [\_peer](les.les-2.md#_peer)
- [\_peerStatus](les.les-2.md#_peerstatus)
- [\_send](les.les-2.md#_send)
- [\_status](les.les-2.md#_status)
- [\_statusTimeoutId](les.les-2.md#_statustimeoutid)
- [\_version](les.les-2.md#_version)
- [defaultMaxListeners](les.les-2.md#defaultmaxlisteners)
- [les2](les.les-2.md#les2)
- [les3](les.les-2.md#les3)
- [les4](les.les-2.md#les4)

### Methods

- [\_getStatusString](les.les-2.md#_getstatusstring)
- [\_handleMessage](les.les-2.md#_handlemessage)
- [\_handleStatus](les.les-2.md#_handlestatus)
- [addListener](les.les-2.md#addlistener)
- [emit](les.les-2.md#emit)
- [eventNames](les.les-2.md#eventnames)
- [getMaxListeners](les.les-2.md#getmaxlisteners)
- [getMsgPrefix](les.les-2.md#getmsgprefix)
- [getVersion](les.les-2.md#getversion)
- [listenerCount](les.les-2.md#listenercount)
- [listeners](les.les-2.md#listeners)
- [off](les.les-2.md#off)
- [on](les.les-2.md#on)
- [once](les.les-2.md#once)
- [prependListener](les.les-2.md#prependlistener)
- [prependOnceListener](les.les-2.md#prependoncelistener)
- [rawListeners](les.les-2.md#rawlisteners)
- [removeAllListeners](les.les-2.md#removealllisteners)
- [removeListener](les.les-2.md#removelistener)
- [sendMessage](les.les-2.md#sendmessage)
- [sendStatus](les.les-2.md#sendstatus)
- [setMaxListeners](les.les-2.md#setmaxlisteners)
- [listenerCount](les.les-2.md#listenercount)
- [once](les.les-2.md#once)

## Constructors

### constructor

• **new LES**(`version`, `peer`, `send`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `number` |
| `peer` | [Peer](rlpx_peer.peer.md) |
| `send` | `any` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/les/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L19)

## Properties

### \_peer

• **\_peer**: [Peer](rlpx_peer.peer.md)

#### Defined in

[packages/devp2p/src/les/index.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L15)

___

### \_peerStatus

• **\_peerStatus**: ``null`` \| [Status](../interfaces/les.les-1.status.md)

#### Defined in

[packages/devp2p/src/les/index.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L18)

___

### \_send

• **\_send**: `any`

#### Defined in

[packages/devp2p/src/les/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L16)

___

### \_status

• **\_status**: ``null`` \| [Status](../interfaces/les.les-1.status.md)

#### Defined in

[packages/devp2p/src/les/index.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L17)

___

### \_statusTimeoutId

• **\_statusTimeoutId**: `Timeout`

#### Defined in

[packages/devp2p/src/les/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L19)

___

### \_version

• **\_version**: `any`

#### Defined in

[packages/devp2p/src/les/index.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L14)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

___

### les2

▪ `Static` **les2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [LES](les.les-2.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/les/index.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L34)

___

### les3

▪ `Static` **les3**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [LES](les.les-2.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/les/index.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L35)

___

### les4

▪ `Static` **les4**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [LES](les.les-2.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/les/index.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L36)

## Methods

### \_getStatusString

▸ **_getStatusString**(`status`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [Status](../interfaces/les.les-1.status.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/les/index.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L124)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [MESSAGE\_CODES](../enums/les.les-1.message_codes.md) |
| `data` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/les/index.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L38)

___

### \_handleStatus

▸ **_handleStatus**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/les/index.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L100)

___

### addListener

▸ **addListener**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

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

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgCode` | [MESSAGE\_CODES](../enums/les.les-1.message_codes.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/les/index.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L225)

___

### getVersion

▸ **getVersion**(): `any`

#### Returns

`any`

#### Defined in

[packages/devp2p/src/les/index.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L120)

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

▸ **off**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### prependListener

▸ **prependListener**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

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

▸ **removeAllListeners**(`event?`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[LES](les.les-2.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### sendMessage

▸ **sendMessage**(`code`, `payload`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | [MESSAGE\_CODES](../enums/les.les-1.message_codes.md) | Message code |
| `payload` | `any` | Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/les/index.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L178)

___

### sendStatus

▸ **sendStatus**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [Status](../interfaces/les.les-1.status.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/les/index.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L148)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [LES](les.les-2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[LES](les.les-2.md)

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
