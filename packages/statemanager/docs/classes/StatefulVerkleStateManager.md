[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulVerkleStateManager

# Class: StatefulVerkleStateManager

Defined in: [statefulVerkleStateManager.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L63)

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new StatefulVerkleStateManager**(`opts`): `StatefulVerkleStateManager`

Defined in: [statefulVerkleStateManager.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L93)

#### Parameters

##### opts

[`StatefulVerkleStateManagerOpts`](../interfaces/StatefulVerkleStateManagerOpts.md)

#### Returns

`StatefulVerkleStateManager`

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [statefulVerkleStateManager.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L73)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statefulVerkleStateManager.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L68)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### preStateRoot

> **preStateRoot**: `Uint8Array`

Defined in: [statefulVerkleStateManager.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L67)

***

### verkleCrypto

> **verkleCrypto**: `VerkleCrypto`

Defined in: [statefulVerkleStateManager.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L69)

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`_address`, `_codeOffset`): `Promise`\<`boolean`\>

Defined in: [statefulVerkleStateManager.ts:743](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L743)

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

Defined in: [statefulVerkleStateManager.ts:460](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L460)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statefulVerkleStateManager.ts:737](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L737)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L450)

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

Defined in: [statefulVerkleStateManager.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L465)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L255)

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

Defined in: [statefulVerkleStateManager.ts:731](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L731)

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

Defined in: [statefulVerkleStateManager.ts:734](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L734)

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

Defined in: [statefulVerkleStateManager.ts:491](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L491)

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`genesisState`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L746)

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

Defined in: [statefulVerkleStateManager.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L130)

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

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulVerkleStateManager.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L335)

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

Defined in: [statefulVerkleStateManager.ts:405](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L405)

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

Defined in: [statefulVerkleStateManager.ts:531](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L531)

#### Parameters

##### accessedState

`VerkleAccessedStateWithAddress`

#### Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulVerkleStateManager.ts:719](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L719)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulVerkleStateManager.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L412)

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

Defined in: [statefulVerkleStateManager.ts:728](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L728)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### initVerkleExecutionWitness()

> **initVerkleExecutionWitness**(`_blockNum`, `executionWitness?`): `void`

Defined in: [statefulVerkleStateManager.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L175)

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

Defined in: [statefulVerkleStateManager.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L276)

#### Parameters

##### address

`Address`

##### accountFields

`Partial`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L219)

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

Defined in: [statefulVerkleStateManager.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L279)

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

Defined in: [statefulVerkleStateManager.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L438)

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

Defined in: [statefulVerkleStateManager.ts:479](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L479)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [statefulVerkleStateManager.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L723)

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

Defined in: [statefulVerkleStateManager.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L740)

#### Parameters

##### \_downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`

***

### verifyVerklePostState()

> **verifyVerklePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [statefulVerkleStateManager.ts:626](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulVerkleStateManager.ts#L626)

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyVerklePostState`
