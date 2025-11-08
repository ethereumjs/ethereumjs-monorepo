[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / Message

# Class: Message

Defined in: [message.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L46)

## Constructors

### Constructor

> **new Message**(`opts`): `Message`

Defined in: [message.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L78)

#### Parameters

##### opts

`MessageOpts`

#### Returns

`Message`

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: `Address`

Defined in: [message.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L56)

***

### accessWitness?

> `optional` **accessWitness**: `BinaryTreeAccessWitnessInterface`

Defined in: [message.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L76)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [message.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L75)

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: `Address`

Defined in: [message.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L49)

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

Defined in: [message.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L61)

***

### code?

> `optional` **code**: `Uint8Array`\<`ArrayBufferLike`\> \| `PrecompileFunc`

Defined in: [message.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L55)

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [message.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L69)

Map of addresses which were created (used in EIP 6780)

***

### data

> **data**: `Uint8Array`

Defined in: [message.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L51)

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: [message.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L70)

***

### depth

> **depth**: `number`

Defined in: [message.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L54)

***

### eof?

> `optional` **eof**: `EOFEnv`

Defined in: [message.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L60)

***

### eofCallData?

> `optional` **eofCallData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [message.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L52)

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [message.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L50)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [message.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L71)

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: [message.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L58)

***

### isCreate?

> `optional` **isCreate**: `boolean`

Defined in: [message.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L53)

***

### isStatic

> **isStatic**: `boolean`

Defined in: [message.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L57)

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [message.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L59)

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [message.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L65)

Set of addresses to selfdestruct. Key is the unprefixed address.

***

### to?

> `optional` **to**: `Address`

Defined in: [message.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L47)

***

### value

> **value**: `bigint`

Defined in: [message.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L48)

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): `Address`

Defined in: [message.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L105)

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

`Address`
