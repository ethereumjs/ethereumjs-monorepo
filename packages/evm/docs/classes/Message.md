[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / Message

# Class: Message

Defined in: [message.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L46)

Call or create message passed into [EVM.runCall](EVM.md#runcall).

## Constructors

### Constructor

> **new Message**(`opts`): `Message`

Defined in: [message.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L84)

#### Parameters

##### opts

`MessageOpts`

#### Returns

`Message`

## Properties

### \_codeAddress?

> `optional` **\_codeAddress?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [message.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L55)

***

### accessWitness?

> `optional` **accessWitness?**: `BinaryTreeAccessWitnessInterface`

Defined in: [message.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L74)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Defined in: [message.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L73)

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [message.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L49)

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses?**: `boolean`

Defined in: [message.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L59)

***

### code?

> `optional` **code?**: `Uint8Array`\<`ArrayBufferLike`\> \| [`PrecompileFunc`](../interfaces/PrecompileFunc.md)

Defined in: [message.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L54)

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: [message.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L67)

Map of addresses which were created (used in EIP 6780)

***

### createdTargetAlive?

> `optional` **createdTargetAlive?**: `boolean`

Defined in: [message.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L82)

EIP-8037: set by the EVM during creation-message execution when the
create target account was already alive (EIP-161 non-empty). The caller
refunds the new-account state gas in that case.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### data

> **data**: `Uint8Array`

Defined in: [message.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L51)

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: [message.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L68)

***

### depth

> **depth**: `number`

Defined in: [message.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L53)

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [message.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L50)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [message.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L69)

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: [message.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L57)

***

### isCreate?

> `optional` **isCreate?**: `boolean`

Defined in: [message.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L52)

***

### isStatic

> **isStatic**: `boolean`

Defined in: [message.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L56)

***

### salt?

> `optional` **salt?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [message.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L58)

***

### selfdestruct?

> `optional` **selfdestruct?**: [`SelfdestructMap`](../type-aliases/SelfdestructMap.md)

Defined in: [message.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L63)

Selfdestructed addresses mapped to their beneficiary.

***

### to?

> `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [message.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L47)

***

### value

> **value**: `bigint`

Defined in: [message.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L48)

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [message.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L110)

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)
