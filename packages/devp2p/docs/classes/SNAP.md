[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / SNAP

# Class: SNAP

Defined in: [packages/devp2p/src/protocol/snap.ts:13](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L13)

## Extends

- `Protocol`

## Constructors

### new SNAP()

> **new SNAP**(`version`, `peer`, `send`): [`SNAP`](SNAP.md)

Defined in: [packages/devp2p/src/protocol/snap.ts:16](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L16)

#### Parameters

##### version

`number`

##### peer

[`Peer`](Peer.md)

##### send

[`SendMethod`](../type-aliases/SendMethod.md)

#### Returns

[`SNAP`](SNAP.md)

#### Overrides

`Protocol.constructor`

## Properties

### snap

> `static` **snap**: `object`

Defined in: [packages/devp2p/src/protocol/snap.ts:22](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L22)

#### constructor

> **constructor**: *typeof* [`SNAP`](../namespaces/SNAP/README.md) = `SNAP`

#### length

> **length**: `number` = `8`

#### name

> **name**: `string` = `'snap'`

#### version

> **version**: `number` = `1`

## Methods

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:24](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L24)

Abstract method to handle incoming messages

#### Parameters

##### code

[`MESSAGE_CODES`](../namespaces/SNAP/enumerations/MESSAGE_CODES.md)

##### data

`Uint8Array`

#### Returns

`void`

#### Overrides

`Protocol._handleMessage`

***

### getMsgPrefix()

> **getMsgPrefix**(`msgCode`): `string`

Defined in: [packages/devp2p/src/protocol/snap.ts:98](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L98)

#### Parameters

##### msgCode

[`MESSAGE_CODES`](../namespaces/SNAP/enumerations/MESSAGE_CODES.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/snap.ts:102](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L102)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:63](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L63)

#### Parameters

##### code

[`MESSAGE_CODES`](../namespaces/SNAP/enumerations/MESSAGE_CODES.md)

Message code

##### payload

`any`

Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L54)

#### Returns

`void`
