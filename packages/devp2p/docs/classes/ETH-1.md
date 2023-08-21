[@ethereumjs/devp2p](../README.md) / ETH

# Class: ETH

## Hierarchy

- `Protocol`

  ↳ **`ETH`**

## Table of contents

### Constructors

- [constructor](ETH-1.md#constructor)

### Properties

- [eth62](ETH-1.md#eth62)
- [eth63](ETH-1.md#eth63)
- [eth64](ETH-1.md#eth64)
- [eth65](ETH-1.md#eth65)
- [eth66](ETH-1.md#eth66)
- [eth67](ETH-1.md#eth67)
- [eth68](ETH-1.md#eth68)

### Methods

- [\_forkHashFromForkId](ETH-1.md#_forkhashfromforkid)
- [\_getStatusString](ETH-1.md#_getstatusstring)
- [\_handleMessage](ETH-1.md#_handlemessage)
- [\_handleStatus](ETH-1.md#_handlestatus)
- [\_nextForkFromForkId](ETH-1.md#_nextforkfromforkid)
- [\_validateForkId](ETH-1.md#_validateforkid)
- [getMsgPrefix](ETH-1.md#getmsgprefix)
- [getVersion](ETH-1.md#getversion)
- [sendMessage](ETH-1.md#sendmessage)
- [sendStatus](ETH-1.md#sendstatus)

## Constructors

### constructor

• **new ETH**(`version`, `peer`, `send`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `number` |
| `peer` | [`Peer`](Peer.md) |
| `send` | [`SendMethod`](../README.md#sendmethod) |

#### Overrides

Protocol.constructor

#### Defined in

[packages/devp2p/src/protocol/eth.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L33)

## Properties

### eth62

▪ `Static` **eth62**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L52)

___

### eth63

▪ `Static` **eth63**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L53)

___

### eth64

▪ `Static` **eth64**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L54)

___

### eth65

▪ `Static` **eth65**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L55)

___

### eth66

▪ `Static` **eth66**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L56)

___

### eth67

▪ `Static` **eth67**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L57)

___

### eth68

▪ `Static` **eth68**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constructor` | typeof [`ETH`](ETH-1.md) |
| `length` | `number` |
| `name` | `string` |
| `version` | `number` |

#### Defined in

[packages/devp2p/src/protocol/eth.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L58)

## Methods

### \_forkHashFromForkId

▸ **_forkHashFromForkId**(`forkId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `forkId` | `Uint8Array` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L236)

___

### \_getStatusString

▸ **_getStatusString**(`status`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [`StatusMsg`](../interfaces/ETH.StatusMsg.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L244)

___

### \_handleMessage

▸ **_handleMessage**(`code`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/ETH.MESSAGE_CODES.md) |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Overrides

Protocol.\_handleMessage

#### Defined in

[packages/devp2p/src/protocol/eth.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L60)

___

### \_handleStatus

▸ **_handleStatus**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L174)

___

### \_nextForkFromForkId

▸ **_nextForkFromForkId**(`forkId`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `forkId` | `Uint8Array` |

#### Returns

`number`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L240)

___

### \_validateForkId

▸ **_validateForkId**(`forkId`): `void`

Eth 64 Fork ID validation (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkId` | `Uint8Array`[] | Remote fork ID |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L131)

___

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgCode` | [`MESSAGE_CODES`](../enums/ETH.MESSAGE_CODES.md) |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L370)

___

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L232)

___

### sendMessage

▸ **sendMessage**(`code`, `payload`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`MESSAGE_CODES`](../enums/ETH.MESSAGE_CODES.md) |
| `payload` | `Input` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L315)

___

### sendStatus

▸ **sendStatus**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | [`StatusOpts`](../modules/ETH.md#statusopts) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/protocol/eth.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L264)
