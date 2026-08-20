[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / BinaryTreeAccessWitnessInterface

# Interface: BinaryTreeAccessWitnessInterface

Defined in: [interfaces.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L114)

Witness interface tracking binary-tree access gas costs.

## Methods

### accesses()

> **accesses**(): `Generator`\<[`BinaryTreeAccessedStateWithAddress`](../type-aliases/BinaryTreeAccessedStateWithAddress.md)\>

Defined in: [interfaces.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L115)

#### Returns

`Generator`\<[`BinaryTreeAccessedStateWithAddress`](../type-aliases/BinaryTreeAccessedStateWithAddress.md)\>

***

### commit()

> **commit**(): `void`

Defined in: [interfaces.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L129)

#### Returns

`void`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [interfaces.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L117)

#### Returns

`void`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [interfaces.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L128)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`void`

***

### rawAccesses()

> **rawAccesses**(): `Generator`\<[`RawBinaryTreeAccessedState`](../type-aliases/RawBinaryTreeAccessedState.md)\>

Defined in: [interfaces.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L116)

#### Returns

`Generator`\<[`RawBinaryTreeAccessedState`](../type-aliases/RawBinaryTreeAccessedState.md)\>

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L118)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L124)

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

Defined in: [interfaces.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L120)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L122)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountStorage()

> **readAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L126)

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

Defined in: [interfaces.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L130)

#### Returns

`void`

***

### writeAccountBasicData()

> **writeAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L119)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L125)

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

Defined in: [interfaces.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L121)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L123)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountStorage()

> **writeAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L127)

#### Parameters

##### contract

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`
