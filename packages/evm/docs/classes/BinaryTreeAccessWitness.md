[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / BinaryTreeAccessWitness

# Class: BinaryTreeAccessWitness

Defined in: [binaryTreeAccessWitness.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L93)

Tracks binary-tree stem and chunk accesses for EIP-7864 witness costing.

## Implements

- `BinaryTreeAccessWitnessInterface`

## Constructors

### Constructor

> **new BinaryTreeAccessWitness**(`opts`): `BinaryTreeAccessWitness`

Defined in: [binaryTreeAccessWitness.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L99)

#### Parameters

##### opts

###### chunks?

`Map`\<`` `0x${string}` ``, [`BinaryChunkAccessEvent`](../type-aliases/BinaryChunkAccessEvent.md)\>

###### hashFunction

(`msg`) => `Uint8Array`

###### stems?

`Map`\<`` `0x${string}` ``, [`BinaryStemAccessEvent`](../type-aliases/BinaryStemAccessEvent.md) & [`BinaryStemMeta`](../type-aliases/BinaryStemMeta.md)\>

#### Returns

`BinaryTreeAccessWitness`

## Properties

### chunkCache

> **chunkCache**: `ChunkCache`

Defined in: [binaryTreeAccessWitness.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L97)

***

### chunks

> **chunks**: `Map`\<`` `0x${string}` ``, [`BinaryChunkAccessEvent`](../type-aliases/BinaryChunkAccessEvent.md)\>

Defined in: [binaryTreeAccessWitness.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L95)

***

### hashFunction

> **hashFunction**: (`msg`) => `Uint8Array`

Defined in: [binaryTreeAccessWitness.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L98)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### stemCache

> **stemCache**: `StemCache`

Defined in: [binaryTreeAccessWitness.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L96)

***

### stems

> **stems**: `Map`\<`` `0x${string}` ``, [`BinaryStemAccessEvent`](../type-aliases/BinaryStemAccessEvent.md) & [`BinaryStemMeta`](../type-aliases/BinaryStemMeta.md)\>

Defined in: [binaryTreeAccessWitness.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L94)

## Methods

### accesses()

> **accesses**(): `Generator`\<`BinaryTreeAccessedStateWithAddress`\>

Defined in: [binaryTreeAccessWitness.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L376)

#### Returns

`Generator`\<`BinaryTreeAccessedStateWithAddress`\>

#### Implementation of

`BinaryTreeAccessWitnessInterface.accesses`

***

### commit()

> **commit**(): `void`

Defined in: [binaryTreeAccessWitness.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L311)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.commit`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [binaryTreeAccessWitness.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L328)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.debugWitnessCost`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [binaryTreeAccessWitness.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L286)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitness`

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.merge`

***

### rawAccesses()

> **rawAccesses**(): `Generator`\<`RawBinaryTreeAccessedState`\>

Defined in: [binaryTreeAccessWitness.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L361)

#### Returns

`Generator`\<`RawBinaryTreeAccessedState`\>

#### Implementation of

`BinaryTreeAccessWitnessInterface.rawAccesses`

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L109)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountBasicData`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L143)

#### Parameters

##### contract

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### startPc

`number`

##### endPc

`number`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountCodeChunks`

***

### readAccountCodeHash()

> **readAccountCodeHash**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L117)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountCodeHash`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L125)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountHeader`

***

### readAccountStorage()

> **readAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L161)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountStorage`

***

### revert()

> **revert**(): `void`

Defined in: [binaryTreeAccessWitness.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L323)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.revert`

***

### touchAddress()

> **touchAddress**(`address`, `treeIndex`, `subIndex`, `__namedParameters?`): `AccessEventFlags`

Defined in: [binaryTreeAccessWitness.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L230)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### treeIndex

`number` \| `bigint`

##### subIndex

`number` \| `Uint8Array`\<`ArrayBufferLike`\>

##### \_\_namedParameters?

###### isWrite?

`boolean`

#### Returns

`AccessEventFlags`

***

### touchAddressAndComputeGas()

> **touchAddressAndComputeGas**(`address`, `treeIndex`, `subIndex`, `__namedParameters`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L191)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### treeIndex

`number` \| `bigint`

##### subIndex

`number` \| `Uint8Array`\<`ArrayBufferLike`\>

##### \_\_namedParameters

###### isWrite?

`boolean`

#### Returns

`bigint`

***

### touchAddressOnReadAndComputeGas()

> **touchAddressOnReadAndComputeGas**(`address`, `treeIndex`, `subIndex`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L181)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### treeIndex

`number` \| `bigint`

##### subIndex

`number` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`bigint`

***

### touchAddressOnWriteAndComputeGas()

> **touchAddressOnWriteAndComputeGas**(`address`, `treeIndex`, `subIndex`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L171)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### treeIndex

`number` \| `bigint`

##### subIndex

`number` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`bigint`

***

### writeAccountBasicData()

> **writeAccountBasicData**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L113)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountBasicData`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L152)

#### Parameters

##### contract

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### startPc

`number`

##### endPc

`number`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountCodeChunks`

***

### writeAccountCodeHash()

> **writeAccountCodeHash**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L121)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountCodeHash`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L134)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountHeader`

***

### writeAccountStorage()

> **writeAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L166)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountStorage`
