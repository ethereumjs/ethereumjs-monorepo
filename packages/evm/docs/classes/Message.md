[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / Message

# Class: Message

Defined in: [message.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L49)

## Constructors

### Constructor

> **new Message**(`opts`): `Message`

Defined in: [message.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L81)

#### Parameters

##### opts

`MessageOpts`

#### Returns

`Message`

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: `Address`

Defined in: [message.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L59)

***

### accessWitness?

> `optional` **accessWitness**: `VerkleAccessWitnessInterface` \| `BinaryTreeAccessWitnessInterface`

Defined in: [message.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L79)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: [message.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L78)

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: `Address`

Defined in: [message.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L52)

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

Defined in: [message.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L64)

***

### code?

> `optional` **code**: `Uint8Array`\<`ArrayBufferLike`\> \| `PrecompileFunc`

Defined in: [message.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L58)

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: [message.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L72)

Map of addresses which were created (used in EIP 6780)

***

### data

> **data**: `Uint8Array`

Defined in: [message.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L54)

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: [message.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L73)

***

### depth

> **depth**: `number`

Defined in: [message.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L57)

***

### eof?

> `optional` **eof**: `EOFEnv`

Defined in: [message.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L63)

***

### eofCallData?

> `optional` **eofCallData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [message.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L55)

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [message.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L53)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [message.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L74)

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: [message.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L61)

***

### isCreate?

> `optional` **isCreate**: `boolean`

Defined in: [message.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L56)

***

### isStatic

> **isStatic**: `boolean`

Defined in: [message.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L60)

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [message.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L62)

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: [message.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L68)

Set of addresses to selfdestruct. Key is the unprefixed address.

***

### to?

> `optional` **to**: `Address`

Defined in: [message.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L50)

***

### value

> **value**: `bigint`

Defined in: [message.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L51)

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): `Address`

Defined in: [message.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L108)

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

`Address`
