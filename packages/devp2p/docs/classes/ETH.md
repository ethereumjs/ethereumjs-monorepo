[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ETH

# Class: ETH

Defined in: [packages/devp2p/src/protocol/eth.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L70)

## Extends

- `Protocol`

## Constructors

### Constructor

> **new ETH**(`version`, `peer`, `send`): `ETH`

Defined in: [packages/devp2p/src/protocol/eth.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L81)

#### Parameters

##### version

`number`

##### peer

[`Peer`](Peer.md)

##### send

[`SendMethod`](../type-aliases/SendMethod.md)

#### Returns

`ETH`

#### Overrides

`Protocol.constructor`

## Properties

### eth62

> `static` **eth62**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L100)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `8`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `62`

***

### eth63

> `static` **eth63**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L101)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `63`

***

### eth64

> `static` **eth64**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L102)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `64`

***

### eth65

> `static` **eth65**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L103)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `65`

***

### eth66

> `static` **eth66**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L104)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `66`

***

### eth67

> `static` **eth67**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L105)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `67`

***

### eth68

> `static` **eth68**: `object`

Defined in: [packages/devp2p/src/protocol/eth.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L106)

#### constructor

> **constructor**: *typeof* `ETH` = `ETH`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'eth'`

#### version

> **version**: `number` = `68`

## Methods

### \_forkHashFromForkId()

> **\_forkHashFromForkId**(`forkId`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L288)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`string`

***

### \_getStatusString()

> **\_getStatusString**(`status`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L296)

#### Parameters

##### status

[`EthStatusMsg`](../interfaces/EthStatusMsg.md)

#### Returns

`string`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L108)

Abstract method to handle incoming messages

#### Parameters

##### code

[`EthMessageCodes`](../type-aliases/EthMessageCodes.md)

##### data

`Uint8Array`

#### Returns

`void`

#### Overrides

`Protocol._handleMessage`

***

### \_handleStatus()

> **\_handleStatus**(): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L226)

#### Returns

`void`

***

### \_nextForkFromForkId()

> **\_nextForkFromForkId**(`forkId`): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L292)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`number`

***

### \_validateForkId()

> **\_validateForkId**(`forkId`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L182)

Eth 64 Fork ID validation (EIP-2124)

#### Parameters

##### forkId

`Uint8Array`\<`ArrayBufferLike`\>[]

Remote fork ID

#### Returns

`void`

***

### getMsgPrefix()

> **getMsgPrefix**(`msgCode`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L419)

#### Parameters

##### msgCode

[`EthMessageCodes`](../type-aliases/EthMessageCodes.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L284)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L366)

#### Parameters

##### code

[`EthMessageCodes`](../type-aliases/EthMessageCodes.md)

##### payload

`Input`

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(`status`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L316)

#### Parameters

##### status

[`EthStatusOpts`](../type-aliases/EthStatusOpts.md)

#### Returns

`void`
