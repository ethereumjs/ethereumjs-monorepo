[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatelessVerkleStateManager

# Class: StatelessVerkleStateManager

Defined in: [statelessVerkleStateManager.ts:69](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L69)

Stateless Verkle StateManager implementation for the VM.

Experimental.

This State Manager enables stateless block execution by building a
temporary (1-block) state from the verkle block witness.
The Stateless Verkle State Manager then uses that populated state
to fetch data requested by the the VM.

## Implements

- `StateManagerInterface`

## Constructors

### new StatelessVerkleStateManager()

> **new StatelessVerkleStateManager**(`opts`): [`StatelessVerkleStateManager`](StatelessVerkleStateManager.md)

Defined in: [statelessVerkleStateManager.ts:113](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L113)

Instantiate the StateManager interface.

#### Parameters

##### opts

[`StatelessVerkleStateManagerOpts`](../interfaces/StatelessVerkleStateManagerOpts.md)

#### Returns

[`StatelessVerkleStateManager`](StatelessVerkleStateManager.md)

## Properties

### \_cachedStateRoot?

> `optional` **\_cachedStateRoot**: `Uint8Array`

Defined in: [statelessVerkleStateManager.ts:70](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L70)

***

### common

> `readonly` **common**: `Common`

Defined in: [statelessVerkleStateManager.ts:80](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L80)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statelessVerkleStateManager.ts:72](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L72)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### verkleCrypto

> **verkleCrypto**: `VerkleCrypto`

Defined in: [statelessVerkleStateManager.ts:74](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L74)

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`address`, `codeOffset`): `Promise`\<`boolean`\>

Defined in: [statelessVerkleStateManager.ts:206](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L206)

#### Parameters

##### address

`Address`

##### codeOffset

`number`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.checkChunkWitnessPresent`

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:637](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L637)

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statelessVerkleStateManager.ts:696](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L696)

Clears all underlying caches

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:387](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L387)

Clears all storage entries for the account corresponding to `address`.

#### Parameters

##### address

`Address`

Address to clear the storage of

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.clearStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:646](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L646)

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:488](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L488)

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

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:669](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L669)

Writes all cache items to the trie

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`_initState`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:704](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L704)

#### Parameters

##### \_initState

`any`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: [statelessVerkleStateManager.ts:395](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L395)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\>

Defined in: [statelessVerkleStateManager.ts:257](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L257)

Gets the code corresponding to the provided `address`.

#### Parameters

##### address

`Address`

Address to get the `code` for

#### Returns

`Promise`\<`Uint8Array`\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [statelessVerkleStateManager.ts:312](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L312)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### getComputedValue()

> **getComputedValue**(`accessedState`): `null` \| `` `0x${string}` ``

Defined in: [statelessVerkleStateManager.ts:579](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L579)

#### Parameters

##### accessedState

`VerkleAccessedStateWithAddress`

#### Returns

`null` \| `` `0x${string}` ``

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

Defined in: [statelessVerkleStateManager.ts:677](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L677)

Gets the cache state root.
This is used to persist the stateRoot between blocks, so that blocks can retrieve the stateRoot of the parent block.
This is required to verify and prove verkle execution witnesses.

#### Returns

`Promise`\<`Uint8Array`\>

- Returns the cached state root

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Defined in: [statelessVerkleStateManager.ts:342](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L342)

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

##### address

`Address`

Address of the account to get the storage for

##### key

`Uint8Array`

Key in the account's storage to get the value for. Must be 32 bytes long.

#### Returns

`Promise`\<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

`StateManagerInterface.getStorage`

***

### getTransitionStateRoot()

> **getTransitionStateRoot**(`_`, `__`): `Promise`\<`Uint8Array`\>

Defined in: [statelessVerkleStateManager.ts:138](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L138)

#### Parameters

##### \_

[`MerkleStateManager`](MerkleStateManager.md)

##### \_\_

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

***

### hasStateRoot()

> **hasStateRoot**(`_`): `Promise`\<`boolean`\>

Defined in: [statelessVerkleStateManager.ts:652](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L652)

#### Parameters

##### \_

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### initVerkleExecutionWitness()

> **initVerkleExecutionWitness**(`blockNum`, `executionWitness`?): `void`

Defined in: [statelessVerkleStateManager.ts:142](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L142)

#### Parameters

##### blockNum

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

Defined in: [statelessVerkleStateManager.ts:496](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L496)

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

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:464](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L464)

#### Parameters

##### address

`Address`

##### account

`Account`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:233](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L233)

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

##### address

`Address`

Address of the `account` to add the `code` for

##### value

`Uint8Array`

The value of the `code`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:367](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L367)

Adds value to the state for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

##### address

`Address`

Address to set a storage value for

##### key

`Uint8Array`

Key to set the value at. Must be 32 bytes long.

##### value

`Uint8Array`

Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:660](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L660)

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`): `Promise`\<`void`\>

Defined in: [statelessVerkleStateManager.ts:689](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L689)

Sets the cache state root.
This is used to persist the stateRoot between blocks, so that blocks can retrieve the stateRoot of the parent block.

#### Parameters

##### stateRoot

`Uint8Array`

The stateRoot to set

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): [`StatelessVerkleStateManager`](StatelessVerkleStateManager.md)

Defined in: [statelessVerkleStateManager.ts:219](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L219)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

#### Parameters

##### downlevelCaches

`boolean` = `true`

#### Returns

[`StatelessVerkleStateManager`](StatelessVerkleStateManager.md)

#### Implementation of

`StateManagerInterface.shallowCopy`

***

### verifyPostState()

> **verifyPostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [statelessVerkleStateManager.ts:501](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L501)

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyPostState`
