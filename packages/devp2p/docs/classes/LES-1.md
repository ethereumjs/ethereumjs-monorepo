[@ethereumjs/devp2p](../README.md) / LES

# Class: LES

## Hierarchy

- `Protocol`

  ↳ **`LES`**

## Table of contents

### Constructors

- [constructor](LES-1.md#constructor)

### Properties

- [les2](LES-1.md#les2)
- [les3](LES-1.md#les3)
- [les4](LES-1.md#les4)

### Methods

- [\_getStatusString](LES-1.md#_getstatusstring)
- [\_handleMessage](LES-1.md#_handlemessage)
- [\_handleStatus](LES-1.md#_handlestatus)
- [getMsgPrefix](LES-1.md#getmsgprefix)
- [getVersion](LES-1.md#getversion)
- [sendMessage](LES-1.md#sendmessage)
- [sendStatus](LES-1.md#sendstatus)

## Constructors

### constructor

• **new LES**(`version`, `peer`, `send`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `number` |
| `peer` | [`Peer`](Peer.md) |
| `send` | [`SendMethod`](../README.md#sendmethod) |

#### Overrides

Protocol.constructor

#### Defined in

[packages/devp2p/src/protocol/les.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L27)

## Properties

### les2

▪ `Static` **les2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`LES`](LES-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/les.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L35)

___

### les3

▪ `Static` **les3**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`LES`](LES-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/les.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L36)

___

### les4

▪ `Static` **les4**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`LES`](LES-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/les.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L37)

## Methods

### \_getStatusString

▸ **_getStatusString**(`status`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [`Status`](../interfaces/LES.Status.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/les.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L149)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/LES.MESSAGE_CODES.md) |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Overrides

Protocol.\_handleMessage

#### Defined in

[packages/devp2p/src/protocol/les.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L39)

___

### \_handleStatus

▸ **_handleStatus**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/les.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L114)

___

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgCode` | [`MESSAGE_CODES`](../enums/LES.MESSAGE_CODES.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/les.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L275)

___

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/protocol/les.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L145)

___

### sendMessage

▸ **sendMessage**(`code`, `payload`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/LES.MESSAGE_CODES.md) | Message code |
| `payload` | `Input` | Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/les.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L217)

___

### sendStatus

▸ **sendStatus**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [`Status`](../interfaces/LES.Status.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/les.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L175)
