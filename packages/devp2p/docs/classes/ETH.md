[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ETH

# Class: ETH

Defined in: [packages/devp2p/src/protocol/eth.ts:24](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L24)

## Extends

- `Protocol`

## Constructors

### new ETH()

> **new ETH**(`version`, `peer`, `send`): [`ETH`](ETH.md)

Defined in: [packages/devp2p/src/protocol/eth.ts:35](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L35)

#### Parameters

##### version

`number`

##### peer

[`Peer`](Peer.md)

##### send

[`SendMethod`](../type-aliases/SendMethod.md)

#### Returns

[`ETH`](ETH.md)

#### Overrides

`Protocol.constructor`

## Properties

### eth62

> `static` **eth62**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L54)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `8`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `62`

***

### eth63

> `static` **eth63**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:55](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L55)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `63`

***

### eth64

> `static` **eth64**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:56](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L56)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `64`

***

### eth65

> `static` **eth65**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:57](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L57)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `65`

***

### eth66

> `static` **eth66**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:58](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L58)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `66`

***

### eth67

> `static` **eth67**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:59](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L59)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `67`

***

### eth68

> `static` **eth68**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:60](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L60)

#### constructor

> **constructor**: *typeof* [`ETH`](../namespaces/ETH/README.md) = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `68`

## Methods

### \_forkHashFromForkId()

> **\_forkHashFromForkId**(`forkId`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:242](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L242)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`string`

***

### \_getStatusString()

> **\_getStatusString**(`status`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:250](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L250)

#### Parameters

##### status

[`StatusMsg`](../namespaces/ETH/interfaces/StatusMsg.md)

#### Returns

`string`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:62](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L62)

Abstract method to handle incoming messages

#### Parameters

##### code

[`MESSAGE_CODES`](../namespaces/ETH/enumerations/MESSAGE_CODES.md)

##### data

`Uint8Array`

#### Returns

`void`

#### Overrides

`Protocol._handleMessage`

***

### \_handleStatus()

> **\_handleStatus**(): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:180](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L180)

#### Returns

`void`

***

### \_nextForkFromForkId()

> **\_nextForkFromForkId**(`forkId`): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:246](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L246)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`number`

***

### \_validateForkId()

> **\_validateForkId**(`forkId`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:136](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L136)

Eth 64 Fork ID validation (EIP-2124)

#### Parameters

##### forkId

`Uint8Array`[]

Remote fork ID

#### Returns

`void`

***

### getMsgPrefix()

> **getMsgPrefix**(`msgCode`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:373](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L373)

#### Parameters

##### msgCode

[`MESSAGE_CODES`](../namespaces/ETH/enumerations/MESSAGE_CODES.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:238](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L238)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:320](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L320)

#### Parameters

##### code

[`MESSAGE_CODES`](../namespaces/ETH/enumerations/MESSAGE_CODES.md)

##### payload

`Input`

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(`status`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:270](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L270)

#### Parameters

##### status

[`StatusOpts`](../namespaces/ETH/type-aliases/StatusOpts.md)

#### Returns

`void`
