[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / BinaryTreeAccessWitnessInterface

# Interface: BinaryTreeAccessWitnessInterface

Defined in: [interfaces.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L103)

## Methods

### accesses()

> **accesses**(): `Generator`\<[`BinaryTreeAccessedStateWithAddress`](../type-aliases/BinaryTreeAccessedStateWithAddress.md)\>

Defined in: [interfaces.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L104)

#### Returns

`Generator`\<[`BinaryTreeAccessedStateWithAddress`](../type-aliases/BinaryTreeAccessedStateWithAddress.md)\>

***

### commit()

> **commit**(): `void`

Defined in: [interfaces.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L118)

#### Returns

`void`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [interfaces.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L106)

#### Returns

`void`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [interfaces.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L117)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`void`

***

### rawAccesses()

> **rawAccesses**(): `Generator`\<[`RawBinaryTreeAccessedState`](../type-aliases/RawBinaryTreeAccessedState.md)\>

Defined in: [interfaces.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L105)

#### Returns

`Generator`\<[`RawBinaryTreeAccessedState`](../type-aliases/RawBinaryTreeAccessedState.md)\>

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L107)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L113)

#### Parameters

##### contract

`Address`

##### startPc

`number`

##### endPc

`number`

#### Returns

`bigint`

***

### readAccountCodeHash()

> **readAccountCodeHash**(`address`): `bigint`

Defined in: [interfaces.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L109)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L111)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountStorage()

> **readAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L115)

#### Parameters

##### contract

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`

***

### revert()

> **revert**(): `void`

Defined in: [interfaces.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L119)

#### Returns

`void`

***

### writeAccountBasicData()

> **writeAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L108)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L114)

#### Parameters

##### contract

`Address`

##### startPc

`number`

##### endPc

`number`

#### Returns

`bigint`

***

### writeAccountCodeHash()

> **writeAccountCodeHash**(`address`): `bigint`

Defined in: [interfaces.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L110)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L112)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountStorage()

> **writeAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L116)

#### Parameters

##### contract

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`
