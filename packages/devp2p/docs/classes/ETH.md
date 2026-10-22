[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ETH

# Class: ETH

Defined in: [packages/devp2p/src/protocol/eth.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L71)

Ethereum wire protocol (ETH) sub-protocol for block and transaction exchange over RLPx.

## Extends

- `Protocol`

## Constructors

### Constructor

> **new ETH**(`version`, `peer`, `send`): `ETH`

Defined in: [packages/devp2p/src/protocol/eth.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L82)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L101)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L102)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L103)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L104)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L105)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L106)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L107)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L289)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`string`

***

### \_getStatusString()

> **\_getStatusString**(`status`): `string`

Defined in: [packages/devp2p/src/protocol/eth.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L298)

#### Parameters

##### status

[`EthStatusMsg`](../interfaces/EthStatusMsg.md)

#### Returns

`string`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L109)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L227)

#### Returns

`void`

***

### \_nextForkFromForkId()

> **\_nextForkFromForkId**(`forkId`): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:294](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L294)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`number`

***

### \_validateForkId()

> **\_validateForkId**(`forkId`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L183)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:421](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L421)

#### Parameters

##### msgCode

[`EthMessageCodes`](../type-aliases/EthMessageCodes.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/eth.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L285)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/eth.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L368)

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

Defined in: [packages/devp2p/src/protocol/eth.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/eth.ts#L318)

#### Parameters

##### status

[`EthStatusOpts`](../type-aliases/EthStatusOpts.md)

#### Returns

`void`
