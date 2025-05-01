[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / BinaryTreeAccessWitness

# Class: BinaryTreeAccessWitness

Defined in: [binaryTreeAccessWitness.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L92)

## Implements

- `BinaryTreeAccessWitnessInterface`

## Constructors

### Constructor

> **new BinaryTreeAccessWitness**(`opts`): `BinaryTreeAccessWitness`

Defined in: [binaryTreeAccessWitness.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L98)

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

Defined in: [binaryTreeAccessWitness.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L96)

***

### chunks

> **chunks**: `Map`\<`` `0x${string}` ``, [`BinaryChunkAccessEvent`](../type-aliases/BinaryChunkAccessEvent.md)\>

Defined in: [binaryTreeAccessWitness.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L94)

***

### hashFunction()

> **hashFunction**: (`msg`) => `Uint8Array`

Defined in: [binaryTreeAccessWitness.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L97)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### stemCache

> **stemCache**: `StemCache`

Defined in: [binaryTreeAccessWitness.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L95)

***

### stems

> **stems**: `Map`\<`` `0x${string}` ``, [`BinaryStemAccessEvent`](../type-aliases/BinaryStemAccessEvent.md) & [`BinaryStemMeta`](../type-aliases/BinaryStemMeta.md)\>

Defined in: [binaryTreeAccessWitness.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L93)

## Methods

### accesses()

> **accesses**(): `Generator`\<`BinaryTreeAccessedStateWithAddress`\>

Defined in: [binaryTreeAccessWitness.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L375)

#### Returns

`Generator`\<`BinaryTreeAccessedStateWithAddress`\>

#### Implementation of

`BinaryTreeAccessWitnessInterface.accesses`

***

### commit()

> **commit**(): `void`

Defined in: [binaryTreeAccessWitness.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L310)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.commit`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [binaryTreeAccessWitness.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L327)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.debugWitnessCost`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [binaryTreeAccessWitness.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L285)

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

Defined in: [binaryTreeAccessWitness.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L360)

#### Returns

`Generator`\<`RawBinaryTreeAccessedState`\>

#### Implementation of

`BinaryTreeAccessWitnessInterface.rawAccesses`

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L108)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountBasicData`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L142)

#### Parameters

##### contract

`Address`

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

Defined in: [binaryTreeAccessWitness.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L116)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountCodeHash`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L124)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountHeader`

***

### readAccountStorage()

> **readAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L160)

#### Parameters

##### address

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.readAccountStorage`

***

### revert()

> **revert**(): `void`

Defined in: [binaryTreeAccessWitness.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L322)

#### Returns

`void`

#### Implementation of

`BinaryTreeAccessWitnessInterface.revert`

***

### touchAddress()

> **touchAddress**(`address`, `treeIndex`, `subIndex`, `__namedParameters`): `AccessEventFlags`

Defined in: [binaryTreeAccessWitness.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L229)

#### Parameters

##### address

`Address`

##### treeIndex

`number` | `bigint`

##### subIndex

`number` | `Uint8Array`\<`ArrayBufferLike`\>

##### \_\_namedParameters

###### isWrite?

`boolean`

#### Returns

`AccessEventFlags`

***

### touchAddressAndComputeGas()

> **touchAddressAndComputeGas**(`address`, `treeIndex`, `subIndex`, `__namedParameters`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L190)

#### Parameters

##### address

`Address`

##### treeIndex

`number` | `bigint`

##### subIndex

`number` | `Uint8Array`\<`ArrayBufferLike`\>

##### \_\_namedParameters

###### isWrite?

`boolean`

#### Returns

`bigint`

***

### touchAddressOnReadAndComputeGas()

> **touchAddressOnReadAndComputeGas**(`address`, `treeIndex`, `subIndex`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L180)

#### Parameters

##### address

`Address`

##### treeIndex

`number` | `bigint`

##### subIndex

`number` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`bigint`

***

### touchAddressOnWriteAndComputeGas()

> **touchAddressOnWriteAndComputeGas**(`address`, `treeIndex`, `subIndex`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L170)

#### Parameters

##### address

`Address`

##### treeIndex

`number` | `bigint`

##### subIndex

`number` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`bigint`

***

### writeAccountBasicData()

> **writeAccountBasicData**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L112)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountBasicData`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L151)

#### Parameters

##### contract

`Address`

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

Defined in: [binaryTreeAccessWitness.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L120)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountCodeHash`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L133)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountHeader`

***

### writeAccountStorage()

> **writeAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [binaryTreeAccessWitness.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L165)

#### Parameters

##### address

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`BinaryTreeAccessWitnessInterface.writeAccountStorage`
