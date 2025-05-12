[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / VerkleAccessWitness

# Class: VerkleAccessWitness

Defined in: [verkleAccessWitness.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L96)

## Implements

- `VerkleAccessWitnessInterface`

## Constructors

### Constructor

> **new VerkleAccessWitness**(`opts`): `VerkleAccessWitness`

Defined in: [verkleAccessWitness.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L102)

#### Parameters

##### opts

###### chunks?

`Map`\<`` `0x${string}` ``, [`ChunkAccessEvent`](../type-aliases/ChunkAccessEvent.md)\>

###### stems?

`Map`\<`` `0x${string}` ``, [`StemAccessEvent`](../type-aliases/StemAccessEvent.md) & [`StemMeta`](../type-aliases/StemMeta.md)\>

###### verkleCrypto

`VerkleCrypto`

#### Returns

`VerkleAccessWitness`

## Properties

### chunkCache

> **chunkCache**: `ChunkCache`

Defined in: [verkleAccessWitness.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L100)

***

### chunks

> **chunks**: `Map`\<`` `0x${string}` ``, [`ChunkAccessEvent`](../type-aliases/ChunkAccessEvent.md)\>

Defined in: [verkleAccessWitness.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L98)

***

### stemCache

> **stemCache**: `StemCache`

Defined in: [verkleAccessWitness.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L99)

***

### stems

> **stems**: `Map`\<`` `0x${string}` ``, [`StemAccessEvent`](../type-aliases/StemAccessEvent.md) & [`StemMeta`](../type-aliases/StemMeta.md)\>

Defined in: [verkleAccessWitness.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L97)

***

### verkleCrypto

> **verkleCrypto**: `VerkleCrypto`

Defined in: [verkleAccessWitness.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L101)

## Methods

### accesses()

> **accesses**(): `Generator`\<`VerkleAccessedStateWithAddress`\>

Defined in: [verkleAccessWitness.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L382)

#### Returns

`Generator`\<`VerkleAccessedStateWithAddress`\>

#### Implementation of

`VerkleAccessWitnessInterface.accesses`

***

### commit()

> **commit**(): `void`

Defined in: [verkleAccessWitness.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L317)

#### Returns

`void`

#### Implementation of

`VerkleAccessWitnessInterface.commit`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [verkleAccessWitness.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L334)

#### Returns

`void`

#### Implementation of

`VerkleAccessWitnessInterface.debugWitnessCost`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [verkleAccessWitness.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L292)

#### Parameters

##### accessWitness

`VerkleAccessWitness`

#### Returns

`void`

#### Implementation of

`VerkleAccessWitnessInterface.merge`

***

### rawAccesses()

> **rawAccesses**(): `Generator`\<`RawVerkleAccessedState`\>

Defined in: [verkleAccessWitness.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L367)

#### Returns

`Generator`\<`RawVerkleAccessedState`\>

#### Implementation of

`VerkleAccessWitnessInterface.rawAccesses`

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [verkleAccessWitness.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L115)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.readAccountBasicData`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [verkleAccessWitness.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L149)

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

`VerkleAccessWitnessInterface.readAccountCodeChunks`

***

### readAccountCodeHash()

> **readAccountCodeHash**(`address`): `bigint`

Defined in: [verkleAccessWitness.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L123)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.readAccountCodeHash`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [verkleAccessWitness.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L131)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.readAccountHeader`

***

### readAccountStorage()

> **readAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [verkleAccessWitness.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L167)

#### Parameters

##### address

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.readAccountStorage`

***

### revert()

> **revert**(): `void`

Defined in: [verkleAccessWitness.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L329)

#### Returns

`void`

#### Implementation of

`VerkleAccessWitnessInterface.revert`

***

### touchAddress()

> **touchAddress**(`address`, `treeIndex`, `subIndex`, `__namedParameters`): `AccessEventFlags`

Defined in: [verkleAccessWitness.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L236)

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

Defined in: [verkleAccessWitness.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L197)

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

Defined in: [verkleAccessWitness.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L187)

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

Defined in: [verkleAccessWitness.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L177)

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

Defined in: [verkleAccessWitness.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L119)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.writeAccountBasicData`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [verkleAccessWitness.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L158)

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

`VerkleAccessWitnessInterface.writeAccountCodeChunks`

***

### writeAccountCodeHash()

> **writeAccountCodeHash**(`address`): `bigint`

Defined in: [verkleAccessWitness.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L127)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.writeAccountCodeHash`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [verkleAccessWitness.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L140)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.writeAccountHeader`

***

### writeAccountStorage()

> **writeAccountStorage**(`address`, `storageSlot`): `bigint`

Defined in: [verkleAccessWitness.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L172)

#### Parameters

##### address

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`

#### Implementation of

`VerkleAccessWitnessInterface.writeAccountStorage`
