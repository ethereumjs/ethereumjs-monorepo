[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / StateManagerInterface

# Interface: StateManagerInterface

Defined in: [interfaces.ts:124](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L124)

## Properties

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: [interfaces.ts:171](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L171)

#### clear()

##### Returns

`void`

#### get()

##### Parameters

###### address

`Address`

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:181](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L181)

#### Parameters

##### contract

`Address`

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:147](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L147)

#### Returns

`Promise`\<`void`\>

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [interfaces.ts:187](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L187)

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [interfaces.ts:142](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L142)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:148](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L148)

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [interfaces.ts:131](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L131)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### dumpStorage()?

> `optional` **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: [interfaces.ts:165](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L165)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: [interfaces.ts:166](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L166)

#### Parameters

##### address

`Address`

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

***

### generateCanonicalGenesis()?

> `optional` **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: [interfaces.ts:175](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L175)

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: [interfaces.ts:129](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L129)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: [interfaces.ts:182](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L182)

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\>

Defined in: [interfaces.ts:136](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L136)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\>

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [interfaces.ts:137](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L137)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

Defined in: [interfaces.ts:154](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L154)

#### Returns

`Promise`\<`Uint8Array`\>

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Defined in: [interfaces.ts:140](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L140)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:156](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L156)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### initVerkleExecutionWitness()?

> `optional` **initVerkleExecutionWitness**(`blockNum`, `executionWitness`?): `void`

Defined in: [interfaces.ts:176](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L176)

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `VerkleExecutionWitness`

#### Returns

`void`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [interfaces.ts:132](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L132)

#### Parameters

##### address

`Address`

##### accountFields

`Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"` \| `"codeSize"`\>\>

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: [interfaces.ts:130](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L130)

#### Parameters

##### address

`Address`

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [interfaces.ts:135](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L135)

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [interfaces.ts:141](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L141)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:149](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L149)

#### Returns

`Promise`\<`void`\>

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: [interfaces.ts:155](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L155)

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`StateManagerInterface`](StateManagerInterface.md)

Defined in: [interfaces.ts:188](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L188)

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

[`StateManagerInterface`](StateManagerInterface.md)

***

### verifyPostState()?

> `optional` **verifyPostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:180](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L180)

#### Parameters

##### accessWitness

[`VerkleAccessWitnessInterface`](VerkleAccessWitnessInterface.md)

#### Returns

`Promise`\<`boolean`\>
