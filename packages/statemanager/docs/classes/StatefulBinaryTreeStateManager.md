[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulBinaryTreeStateManager

# Class: StatefulBinaryTreeStateManager

Defined in: [statefulBinaryTreeStateManager.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L58)

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new StatefulBinaryTreeStateManager**(`opts`): `StatefulBinaryTreeStateManager`

Defined in: [statefulBinaryTreeStateManager.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L86)

#### Parameters

##### opts

[`StatefulBinaryTreeStateManagerOpts`](../interfaces/StatefulBinaryTreeStateManagerOpts.md)

#### Returns

`StatefulBinaryTreeStateManager`

## Properties

### hashFunction()

> **hashFunction**: (`input`) => `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L64)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statefulBinaryTreeStateManager.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L63)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### preStateRoot

> **preStateRoot**: `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L62)

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`_address`, `_codeOffset`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L738)

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

Defined in: [statefulBinaryTreeStateManager.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L450)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statefulBinaryTreeStateManager.ts:732](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L732)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L446)

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

Defined in: [statefulBinaryTreeStateManager.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L455)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L245)

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

Defined in: [statefulBinaryTreeStateManager.ts:726](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L726)

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

Defined in: [statefulBinaryTreeStateManager.ts:729](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L729)

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

Defined in: [statefulBinaryTreeStateManager.ts:481](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L481)

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`genesisState`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:741](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L741)

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

Defined in: [statefulBinaryTreeStateManager.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L118)

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

Defined in: [statefulBinaryTreeStateManager.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L324)

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

Defined in: [statefulBinaryTreeStateManager.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L399)

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

Defined in: [statefulBinaryTreeStateManager.ts:521](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L521)

#### Parameters

##### accessedState

`BinaryTreeAccessedStateWithAddress`

#### Returns

`Promise`\<`` `0x${string}` `` \| `null`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:714](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L714)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L408)

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

Defined in: [statefulBinaryTreeStateManager.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L723)

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

Defined in: [statefulBinaryTreeStateManager.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L165)

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

Defined in: [statefulBinaryTreeStateManager.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L263)

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

Defined in: [statefulBinaryTreeStateManager.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L209)

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

Defined in: [statefulBinaryTreeStateManager.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L266)

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

Defined in: [statefulBinaryTreeStateManager.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L434)

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

Defined in: [statefulBinaryTreeStateManager.ts:469](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L469)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:718](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L718)

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

Defined in: [statefulBinaryTreeStateManager.ts:735](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L735)

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

Defined in: [statefulBinaryTreeStateManager.ts:615](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L615)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyBinaryTreePostState`
