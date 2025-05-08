[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / SNAP

# Class: SNAP

Defined in: [packages/devp2p/src/protocol/snap.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L38)

## Extends

- `Protocol`

## Constructors

### Constructor

> **new SNAP**(`version`, `peer`, `send`): `SNAP`

Defined in: [packages/devp2p/src/protocol/snap.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L41)

#### Parameters

##### version

`number`

##### peer

[`Peer`](Peer.md)

##### send

[`SendMethod`](../type-aliases/SendMethod.md)

#### Returns

`SNAP`

#### Overrides

`Protocol.constructor`

## Properties

### snap

> `static` **snap**: `object`

Defined in: [packages/devp2p/src/protocol/snap.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L47)

#### constructor

> **constructor**: *typeof* `SNAP` = `SNAP`

#### length

> **length**: `number` = `8`

#### name

> **name**: `string` = `'snap'`

#### version

> **version**: `number` = `1`

## Methods

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L49)

Abstract method to handle incoming messages

#### Parameters

##### code

[`SnapMessageCodes`](../type-aliases/SnapMessageCodes.md)

##### data

`Uint8Array`

#### Returns

`void`

#### Overrides

`Protocol._handleMessage`

***

### getMsgPrefix()

> **getMsgPrefix**(`msgCode`): `string`

Defined in: [packages/devp2p/src/protocol/snap.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L123)

#### Parameters

##### msgCode

[`SnapMessageCodes`](../type-aliases/SnapMessageCodes.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/snap.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L127)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L88)

#### Parameters

##### code

[`SnapMessageCodes`](../type-aliases/SnapMessageCodes.md)

Message code

##### payload

`any`

Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L79)

#### Returns

`void`
