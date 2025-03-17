[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulVerkleStateManager

# Class: StatefulVerkleStateManager

Defined in: [statefulVerkleStateManager.ts:62](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L62)

## Implements

- `StateManagerInterface`

## Constructors

### new StatefulVerkleStateManager()

> **new StatefulVerkleStateManager**(`opts`): [`StatefulVerkleStateManager`](StatefulVerkleStateManager.md)

Defined in: [statefulVerkleStateManager.ts:92](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L92)

#### Parameters

##### opts

[`StatefulVerkleStateManagerOpts`](../interfaces/StatefulVerkleStateManagerOpts.md)

#### Returns

[`StatefulVerkleStateManager`](StatefulVerkleStateManager.md)

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [statefulVerkleStateManager.ts:72](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L72)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statefulVerkleStateManager.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L67)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### preStateRoot

> **preStateRoot**: `Uint8Array`

Defined in: [statefulVerkleStateManager.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L66)

***

### verkleCrypto

> **verkleCrypto**: `VerkleCrypto`

Defined in: [statefulVerkleStateManager.ts:68](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L68)

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`_address`, `_codeOffset`): `Promise`\<`boolean`\>

Defined in: [statefulVerkleStateManager.ts:741](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L741)

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

Defined in: [statefulVerkleStateManager.ts:459](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L459)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statefulVerkleStateManager.ts:735](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L735)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:449](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L449)

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

Defined in: [statefulVerkleStateManager.ts:464](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L464)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:254](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L254)

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

Defined in: [statefulVerkleStateManager.ts:729](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L729)

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

Defined in: [statefulVerkleStateManager.ts:732](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L732)

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

Defined in: [statefulVerkleStateManager.ts:490](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L490)

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`genesisState`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:744](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L744)

#### Parameters

##### genesisState

`GenesisState`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: [statefulVerkleStateManager.ts:129](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L129)

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

##### address

`Address`

Address of the `account` to get

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\>

Defined in: [statefulVerkleStateManager.ts:335](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L335)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\>

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [statefulVerkleStateManager.ts:404](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L404)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### getComputedValue()

> **getComputedValue**(`accessedState`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [statefulVerkleStateManager.ts:530](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L530)

#### Parameters

##### accessedState

`VerkleAccessedStateWithAddress`

#### Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

Defined in: [statefulVerkleStateManager.ts:717](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L717)

#### Returns

`Promise`\<`Uint8Array`\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Defined in: [statefulVerkleStateManager.ts:411](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L411)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Implementation of

`StateManagerInterface.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [statefulVerkleStateManager.ts:726](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L726)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### initVerkleExecutionWitness()

> **initVerkleExecutionWitness**(`_blockNum`, `executionWitness`?): `void`

Defined in: [statefulVerkleStateManager.ts:174](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L174)

#### Parameters

##### \_blockNum

`bigint`

##### executionWitness?

`null` | `VerkleExecutionWitness`

#### Returns

`void`

#### Implementation of

`StateManagerInterface.initVerkleExecutionWitness`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:275](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L275)

#### Parameters

##### address

`Address`

##### accountFields

`Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"` \| `"codeSize"`\>\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:218](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L218)

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

Defined in: [statefulVerkleStateManager.ts:279](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L279)

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

Defined in: [statefulVerkleStateManager.ts:437](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L437)

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

Defined in: [statefulVerkleStateManager.ts:478](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L478)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:721](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L721)

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

> **shallowCopy**(`_downlevelCaches`?): `StateManagerInterface`

Defined in: [statefulVerkleStateManager.ts:738](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L738)

#### Parameters

##### \_downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`

***

### verifyPostState()

> **verifyPostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [statefulVerkleStateManager.ts:624](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L624)

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyPostState`
