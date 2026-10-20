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

Defined in: [packages/devp2p/src/protocol/snap.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L46)

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

Defined in: [packages/devp2p/src/protocol/snap.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L48)

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

Defined in: [packages/devp2p/src/protocol/snap.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L122)

#### Parameters

##### msgCode

[`SnapMessageCodes`](../type-aliases/SnapMessageCodes.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/snap.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L126)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/snap.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L87)

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

Defined in: [packages/devp2p/src/protocol/snap.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/snap.ts#L78)

#### Returns

`void`
