[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / StateManagerInterface

# Interface: StateManagerInterface

Defined in: [interfaces.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L177)

Core state access surface implemented by EthereumJS state managers.

Matches the `@ethereumjs/statemanager` package API.

## Properties

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: [interfaces.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L231)

#### clear()

> **clear**(): `void`

##### Returns

`void`

#### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### Parameters

###### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L241)

#### Parameters

##### contract

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L200)

#### Returns

`Promise`\<`void`\>

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [interfaces.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L247)

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [interfaces.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L195)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<`void`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L201)

#### Returns

`Promise`\<`void`\>

***

### consumeBAL()?

> `optional` **consumeBAL**(`bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [interfaces.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L226)

Apply an EIP-7928 block-level access list onto this state (no EVM execution).
Implementations in `@ethereumjs/statemanager` forward to the shared `consumeBAL()` helper.

#### Parameters

##### bal

`BALJSONBlockAccessList`

##### expectedStateRoot?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`void`\>

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [interfaces.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L184)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<`void`\>

***

### dumpStorage()?

> `optional` **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: [interfaces.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L218)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: [interfaces.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L219)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

***

### generateCanonicalGenesis()?

> `optional` **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: [interfaces.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L235)

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [interfaces.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L182)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<`Account` \| `undefined`\>

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: [interfaces.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L242)

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [interfaces.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L189)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [interfaces.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L190)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

`Promise`\<`number`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [interfaces.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L207)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [interfaces.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L193)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L209)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### initBinaryTreeExecutionWitness()?

> `optional` **initBinaryTreeExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: [interfaces.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L236)

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

[`BinaryTreeExecutionWitness`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/interfaces/BinaryTreeExecutionWitness.md) \| `null`

#### Returns

`void`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [interfaces.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L185)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### accountFields

[`AccountFields`](../type-aliases/AccountFields.md)

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [interfaces.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L183)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [interfaces.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L188)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [interfaces.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L194)

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [interfaces.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L202)

#### Returns

`Promise`\<`void`\>

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [interfaces.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L208)

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches?`): `StateManagerInterface`

Defined in: [interfaces.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L248)

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

***

### verifyBinaryTreePostState()?

> `optional` **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [interfaces.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L240)

#### Parameters

##### accessWitness

[`BinaryTreeAccessWitnessInterface`](BinaryTreeAccessWitnessInterface.md)

#### Returns

`Promise`\<`boolean`\>
