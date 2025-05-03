[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / VerkleAccessWitnessInterface

# Interface: VerkleAccessWitnessInterface

Defined in: [interfaces.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L154)

## Methods

### accesses()

> **accesses**(): `Generator`\<[`VerkleAccessedStateWithAddress`](../type-aliases/VerkleAccessedStateWithAddress.md)\>

Defined in: [interfaces.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L155)

#### Returns

`Generator`\<[`VerkleAccessedStateWithAddress`](../type-aliases/VerkleAccessedStateWithAddress.md)\>

***

### commit()

> **commit**(): `void`

Defined in: [interfaces.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L169)

#### Returns

`void`

***

### debugWitnessCost()

> **debugWitnessCost**(): `void`

Defined in: [interfaces.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L157)

#### Returns

`void`

***

### merge()

> **merge**(`accessWitness`): `void`

Defined in: [interfaces.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L168)

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`void`

***

### rawAccesses()

> **rawAccesses**(): `Generator`\<[`RawVerkleAccessedState`](../type-aliases/RawVerkleAccessedState.md)\>

Defined in: [interfaces.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L156)

#### Returns

`Generator`\<[`RawVerkleAccessedState`](../type-aliases/RawVerkleAccessedState.md)\>

***

### readAccountBasicData()

> **readAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L158)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountCodeChunks()

> **readAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L164)

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

Defined in: [interfaces.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L160)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountHeader()

> **readAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L162)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### readAccountStorage()

> **readAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L166)

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

Defined in: [interfaces.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L170)

#### Returns

`void`

***

### writeAccountBasicData()

> **writeAccountBasicData**(`address`): `bigint`

Defined in: [interfaces.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L159)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountCodeChunks()

> **writeAccountCodeChunks**(`contract`, `startPc`, `endPc`): `bigint`

Defined in: [interfaces.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L165)

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

Defined in: [interfaces.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L161)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountHeader()

> **writeAccountHeader**(`address`): `bigint`

Defined in: [interfaces.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L163)

#### Parameters

##### address

`Address`

#### Returns

`bigint`

***

### writeAccountStorage()

> **writeAccountStorage**(`contract`, `storageSlot`): `bigint`

Defined in: [interfaces.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L167)

#### Parameters

##### contract

`Address`

##### storageSlot

`bigint`

#### Returns

`bigint`
