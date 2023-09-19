[@ethereumjs/devp2p](../README.md) / SNAP

# Class: SNAP

## Hierarchy

- `Protocol`

  ↳ **`SNAP`**

## Table of contents

### Constructors

- [constructor](SNAP-1.md#constructor)

### Properties

- [snap](SNAP-1.md#snap)

### Methods

- [\_handleMessage](SNAP-1.md#_handlemessage)
- [getMsgPrefix](SNAP-1.md#getmsgprefix)
- [getVersion](SNAP-1.md#getversion)
- [sendMessage](SNAP-1.md#sendmessage)
- [sendStatus](SNAP-1.md#sendstatus)

## Constructors

### constructor

• **new SNAP**(`version`, `peer`, `send`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `number` |
| `peer` | [`Peer`](Peer.md) |
| `send` | [`SendMethod`](../README.md#sendmethod) |

#### Overrides

Protocol.constructor

#### Defined in

[packages/devp2p/src/protocol/snap.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L14)

## Properties

### snap

▪ `Static` **snap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`SNAP`](SNAP-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/snap.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L18)

## Methods

### \_handleMessage

▸ **_handleMessage**(`code`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/SNAP.MESSAGE_CODES.md) |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Overrides

Protocol.\_handleMessage

#### Defined in

[packages/devp2p/src/protocol/snap.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L20)

___

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgCode` | [`MESSAGE_CODES`](../enums/SNAP.MESSAGE_CODES.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/snap.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L95)

___

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/protocol/snap.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L99)

___

### sendMessage

▸ **sendMessage**(`code`, `payload`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/SNAP.MESSAGE_CODES.md) | Message code |
| `payload` | `any` | Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/snap.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L59)

___

### sendStatus

▸ **sendStatus**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/snap.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L50)
