[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulBinaryTreeStateManager

# Class: StatefulBinaryTreeStateManager

Defined in: [statefulBinaryTreeStateManager.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L59)

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new StatefulBinaryTreeStateManager**(`opts`): `StatefulBinaryTreeStateManager`

Defined in: [statefulBinaryTreeStateManager.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L87)

#### Parameters

##### opts

[`StatefulBinaryTreeStateManagerOpts`](../interfaces/StatefulBinaryTreeStateManagerOpts.md)

#### Returns

`StatefulBinaryTreeStateManager`

## Properties

### hashFunction()

> **hashFunction**: (`input`) => `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L65)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statefulBinaryTreeStateManager.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L64)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### preStateRoot

> **preStateRoot**: `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L63)

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`_address`, `_codeOffset`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:737](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L737)

#### Parameters

##### \_address

`Address`

##### \_codeOffset

`number`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.checkChunkWitnessPresent`

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L449)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statefulBinaryTreeStateManager.ts:731](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L731)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L445)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.clearStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L454)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L244)

Deletes an account from state under the provided `address`.

#### Parameters

##### address

`Address`

Address of the account which should be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.deleteAccount`

***

### dumpStorage()?

> `optional` **dumpStorage**(`_address`): `Promise`\<`StorageDump`\>

Defined in: [statefulBinaryTreeStateManager.ts:725](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L725)

#### Parameters

##### \_address

`Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`_address`, `_startKey`, `_limit`): `Promise`\<`StorageRange`\>

Defined in: [statefulBinaryTreeStateManager.ts:728](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L728)

#### Parameters

##### \_address

`Address`

##### \_startKey

`bigint`

##### \_limit

`number`

#### Returns

`Promise`\<`StorageRange`\>

#### Implementation of

`StateManagerInterface.dumpStorageRange`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L480)

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`genesisState`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L740)

#### Parameters

##### genesisState

`GenesisState`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [statefulBinaryTreeStateManager.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L117)

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

##### address

`Address`

Address of the `account` to get

#### Returns

`Promise`\<`Account` \| `undefined`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L323)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [statefulBinaryTreeStateManager.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L398)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### getComputedValue()

> **getComputedValue**(`accessedState`): `Promise`\<`` `0x${string}` `` \| `null`\>

Defined in: [statefulBinaryTreeStateManager.ts:520](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L520)

#### Parameters

##### accessedState

`BinaryTreeAccessedStateWithAddress`

#### Returns

`Promise`\<`` `0x${string}` `` \| `null`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:713](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L713)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L407)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:722](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L722)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### initBinaryTreeExecutionWitness()

> **initBinaryTreeExecutionWitness**(`_blockNum`, `executionWitness?`): `void`

Defined in: [statefulBinaryTreeStateManager.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L164)

#### Parameters

##### \_blockNum

`bigint`

##### executionWitness?

`BinaryTreeExecutionWitness` | `null`

#### Returns

`void`

#### Implementation of

`StateManagerInterface.initBinaryTreeExecutionWitness`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L262)

#### Parameters

##### address

`Address`

##### accountFields

`AccountFields`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L208)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account?

`Account`

The account to store or undefined if to be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L265)

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L433)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L468)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:717](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L717)

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`_downlevelCaches?`): `StateManagerInterface`

Defined in: [statefulBinaryTreeStateManager.ts:734](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L734)

#### Parameters

##### \_downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`

***

### verifyBinaryTreePostState()

> **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:614](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L614)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyBinaryTreePostState`
