[@ethereumjs/devp2p](../README.md) / [eth](../modules/eth.md) / ETH

# Class: ETH

[eth](../modules/eth.md).ETH

## Hierarchy

- `EventEmitter`

  ↳ **ETH**

## Table of contents

### Constructors

- [constructor](eth.eth-2.md#constructor)

### Properties

- [\_forkHash](eth.eth-2.md#_forkhash)
- [\_hardfork](eth.eth-2.md#_hardfork)
- [\_latestBlock](eth.eth-2.md#_latestblock)
- [\_nextForkBlock](eth.eth-2.md#_nextforkblock)
- [\_peer](eth.eth-2.md#_peer)
- [\_peerStatus](eth.eth-2.md#_peerstatus)
- [\_send](eth.eth-2.md#_send)
- [\_status](eth.eth-2.md#_status)
- [\_statusTimeoutId](eth.eth-2.md#_statustimeoutid)
- [\_version](eth.eth-2.md#_version)
- [defaultMaxListeners](eth.eth-2.md#defaultmaxlisteners)
- [eth62](eth.eth-2.md#eth62)
- [eth63](eth.eth-2.md#eth63)
- [eth64](eth.eth-2.md#eth64)
- [eth65](eth.eth-2.md#eth65)
- [eth66](eth.eth-2.md#eth66)

### Methods

- [\_forkHashFromForkId](eth.eth-2.md#_forkhashfromforkid)
- [\_getStatusString](eth.eth-2.md#_getstatusstring)
- [\_handleMessage](eth.eth-2.md#_handlemessage)
- [\_handleStatus](eth.eth-2.md#_handlestatus)
- [\_nextForkFromForkId](eth.eth-2.md#_nextforkfromforkid)
- [\_validateForkId](eth.eth-2.md#_validateforkid)
- [addListener](eth.eth-2.md#addlistener)
- [emit](eth.eth-2.md#emit)
- [eventNames](eth.eth-2.md#eventnames)
- [getMaxListeners](eth.eth-2.md#getmaxlisteners)
- [getMsgPrefix](eth.eth-2.md#getmsgprefix)
- [getVersion](eth.eth-2.md#getversion)
- [listenerCount](eth.eth-2.md#listenercount)
- [listeners](eth.eth-2.md#listeners)
- [off](eth.eth-2.md#off)
- [on](eth.eth-2.md#on)
- [once](eth.eth-2.md#once)
- [prependListener](eth.eth-2.md#prependlistener)
- [prependOnceListener](eth.eth-2.md#prependoncelistener)
- [rawListeners](eth.eth-2.md#rawlisteners)
- [removeAllListeners](eth.eth-2.md#removealllisteners)
- [removeListener](eth.eth-2.md#removelistener)
- [sendMessage](eth.eth-2.md#sendmessage)
- [sendStatus](eth.eth-2.md#sendstatus)
- [setMaxListeners](eth.eth-2.md#setmaxlisteners)
- [listenerCount](eth.eth-2.md#listenercount)
- [once](eth.eth-2.md#once)

## Constructors

### constructor

• **new ETH**(`version`, `peer`, `send`)

#### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `version` | `number`                  |
| `peer`    | [Peer](rlpx_peer.peer.md) |
| `send`    | `SendMethod`              |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/eth/index.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L27)

## Properties

### \_forkHash

• **\_forkHash**: `string` = ''

#### Defined in

[packages/devp2p/src/eth/index.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L26)

---

### \_hardfork

• **\_hardfork**: `string` = 'chainstart'

#### Defined in

[packages/devp2p/src/eth/index.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L24)

---

### \_latestBlock

• **\_latestBlock**: `BN`

#### Defined in

[packages/devp2p/src/eth/index.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L25)

---

### \_nextForkBlock

• **\_nextForkBlock**: `BN`

#### Defined in

[packages/devp2p/src/eth/index.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L27)

---

### \_peer

• **\_peer**: [Peer](rlpx_peer.peer.md)

#### Defined in

[packages/devp2p/src/eth/index.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L17)

---

### \_peerStatus

• **\_peerStatus**: `null` \| [StatusMsg](../interfaces/eth.eth-1.statusmsg.md)

#### Defined in

[packages/devp2p/src/eth/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L19)

---

### \_send

• **\_send**: `SendMethod`

#### Defined in

[packages/devp2p/src/eth/index.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L21)

---

### \_status

• **\_status**: `null` \| [StatusMsg](../interfaces/eth.eth-1.statusmsg.md)

#### Defined in

[packages/devp2p/src/eth/index.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L18)

---

### \_statusTimeoutId

• **\_statusTimeoutId**: `Timeout`

#### Defined in

[packages/devp2p/src/eth/index.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L20)

---

### \_version

• **\_version**: `number`

#### Defined in

[packages/devp2p/src/eth/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L16)

---

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

---

### eth62

▪ `Static` **eth62**: `Object`

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `constructor` | typeof [ETH](eth.eth-2.md) |
| `length`      | `number`                   |
| `name`        | `string`                   |
| `version`     | `number`                   |

#### Defined in

[packages/devp2p/src/eth/index.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L55)

---

### eth63

▪ `Static` **eth63**: `Object`

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `constructor` | typeof [ETH](eth.eth-2.md) |
| `length`      | `number`                   |
| `name`        | `string`                   |
| `version`     | `number`                   |

#### Defined in

[packages/devp2p/src/eth/index.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L56)

---

### eth64

▪ `Static` **eth64**: `Object`

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `constructor` | typeof [ETH](eth.eth-2.md) |
| `length`      | `number`                   |
| `name`        | `string`                   |
| `version`     | `number`                   |

#### Defined in

[packages/devp2p/src/eth/index.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L57)

---

### eth65

▪ `Static` **eth65**: `Object`

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `constructor` | typeof [ETH](eth.eth-2.md) |
| `length`      | `number`                   |
| `name`        | `string`                   |
| `version`     | `number`                   |

#### Defined in

[packages/devp2p/src/eth/index.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L58)

---

### eth66

▪ `Static` **eth66**: `Object`

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `constructor` | typeof [ETH](eth.eth-2.md) |
| `length`      | `number`                   |
| `name`        | `string`                   |
| `version`     | `number`                   |

#### Defined in

[packages/devp2p/src/eth/index.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L59)

## Methods

### \_forkHashFromForkId

▸ **\_forkHashFromForkId**(`forkId`): `string`

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `forkId` | `Buffer` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/eth/index.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L177)

---

### \_getStatusString

▸ **\_getStatusString**(`status`): `string`

#### Parameters

| Name     | Type                                              |
| :------- | :------------------------------------------------ |
| `status` | [StatusMsg](../interfaces/eth.eth-1.statusmsg.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/eth/index.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L185)

---

### \_handleMessage

▸ **\_handleMessage**(`code`, `data`): `void`

#### Parameters

| Name   | Type                                                 |
| :----- | :--------------------------------------------------- |
| `code` | [MESSAGE_CODES](../enums/eth.eth-1.message_codes.md) |
| `data` | `any`                                                |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/eth/index.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L61)

---

### \_handleStatus

▸ **\_handleStatus**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/eth/index.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L149)

---

### \_nextForkFromForkId

▸ **\_nextForkFromForkId**(`forkId`): `number`

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `forkId` | `Buffer` |

#### Returns

`number`

#### Defined in

[packages/devp2p/src/eth/index.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L181)

---

### \_validateForkId

▸ **\_validateForkId**(`forkId`): `void`

Eth 64 Fork ID validation (EIP-2124)

#### Parameters

| Name     | Type       | Description    |
| :------- | :--------- | :------------- |
| `forkId` | `Buffer`[] | Remote fork ID |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/eth/index.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L116)

---

### addListener

▸ **addListener**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

---

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `event`   | `string` \| `symbol` |
| `...args` | `any`[]              |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:605

---

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:610

---

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:602

---

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`): `string`

#### Parameters

| Name      | Type                                                 |
| :-------- | :--------------------------------------------------- |
| `msgCode` | [MESSAGE_CODES](../enums/eth.eth-1.message_codes.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/eth/index.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L278)

---

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/eth/index.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L173)

---

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:606

---

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:603

---

### off

▸ **off**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

---

### on

▸ **on**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

---

### once

▸ **once**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

---

### prependListener

▸ **prependListener**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

---

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:609

---

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:604

---

### removeAllListeners

▸ **removeAllListeners**(`event?`): [ETH](eth.eth-2.md)

#### Parameters

| Name     | Type                 |
| :------- | :------------------- |
| `event?` | `string` \| `symbol` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

---

### removeListener

▸ **removeListener**(`event`, `listener`): [ETH](eth.eth-2.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

---

### sendMessage

▸ **sendMessage**(`code`, `payload`): `void`

#### Parameters

| Name      | Type                                                 |
| :-------- | :--------------------------------------------------- |
| `code`    | [MESSAGE_CODES](../enums/eth.eth-1.message_codes.md) |
| `payload` | `any`                                                |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/eth/index.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L237)

---

### sendStatus

▸ **sendStatus**(`status`): `void`

#### Parameters

| Name     | Type                                             |
| :------- | :----------------------------------------------- |
| `status` | [StatusOpts](../modules/eth.eth-1.md#statusopts) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/eth/index.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L201)

---

### setMaxListeners

▸ **setMaxListeners**(`n`): [ETH](eth.eth-2.md)

#### Parameters

| Name | Type     |
| :--- | :------- |
| `n`  | `number` |

#### Returns

[ETH](eth.eth-2.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

---

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `emitter` | `EventEmitter`       |
| `event`   | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17

---

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `emitter` | `NodeEventTarget`    |
| `event`   | `string` \| `symbol` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name      | Type             |
| :-------- | :--------------- |
| `emitter` | `DOMEventTarget` |
| `event`   | `string`         |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
