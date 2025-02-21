[@ethereumjs/statemanager](../README.md) / StatelessVerkleStateManager

# Class: StatelessVerkleStateManager

Stateless Verkle StateManager implementation for the VM.

Experimental.

This State Manager enables stateless block execution by building a
temporary (1-block) state from the verkle block witness.
The Stateless Verkle State Manager then uses that populated state
to fetch data requested by the the VM.

## Implements

- `EVMStateManagerInterface`

## Table of contents

### Constructors

- [constructor](StatelessVerkleStateManager.md#constructor)

### Properties

- [\_accountCache](StatelessVerkleStateManager.md#_accountcache)
- [\_codeCache](StatelessVerkleStateManager.md#_codecache)
- [\_storageCache](StatelessVerkleStateManager.md#_storagecache)
- [accessWitness](StatelessVerkleStateManager.md#accesswitness)
- [originalStorageCache](StatelessVerkleStateManager.md#originalstoragecache)

### Methods

- [checkChunkWitnessPresent](StatelessVerkleStateManager.md#checkchunkwitnesspresent)
- [checkpoint](StatelessVerkleStateManager.md#checkpoint)
- [chunkifyCode](StatelessVerkleStateManager.md#chunkifycode)
- [clearCaches](StatelessVerkleStateManager.md#clearcaches)
- [clearContractStorage](StatelessVerkleStateManager.md#clearcontractstorage)
- [commit](StatelessVerkleStateManager.md#commit)
- [deleteAccount](StatelessVerkleStateManager.md#deleteaccount)
- [dumpStorage](StatelessVerkleStateManager.md#dumpstorage)
- [dumpStorageRange](StatelessVerkleStateManager.md#dumpstoragerange)
- [flush](StatelessVerkleStateManager.md#flush)
- [generateCanonicalGenesis](StatelessVerkleStateManager.md#generatecanonicalgenesis)
- [getAccount](StatelessVerkleStateManager.md#getaccount)
- [getAppliedKey](StatelessVerkleStateManager.md#getappliedkey)
- [getComputedValue](StatelessVerkleStateManager.md#getcomputedvalue)
- [getContractCode](StatelessVerkleStateManager.md#getcontractcode)
- [getContractStorage](StatelessVerkleStateManager.md#getcontractstorage)
- [getProof](StatelessVerkleStateManager.md#getproof)
- [getStateRoot](StatelessVerkleStateManager.md#getstateroot)
- [getTransitionStateRoot](StatelessVerkleStateManager.md#gettransitionstateroot)
- [getTreeKeyForBalance](StatelessVerkleStateManager.md#gettreekeyforbalance)
- [getTreeKeyForCodeChunk](StatelessVerkleStateManager.md#gettreekeyforcodechunk)
- [getTreeKeyForCodeHash](StatelessVerkleStateManager.md#gettreekeyforcodehash)
- [getTreeKeyForCodeSize](StatelessVerkleStateManager.md#gettreekeyforcodesize)
- [getTreeKeyForNonce](StatelessVerkleStateManager.md#gettreekeyfornonce)
- [getTreeKeyForStorageSlot](StatelessVerkleStateManager.md#gettreekeyforstorageslot)
- [getTreeKeyForVersion](StatelessVerkleStateManager.md#gettreekeyforversion)
- [hasStateRoot](StatelessVerkleStateManager.md#hasstateroot)
- [initVerkleExecutionWitness](StatelessVerkleStateManager.md#initverkleexecutionwitness)
- [modifyAccountFields](StatelessVerkleStateManager.md#modifyaccountfields)
- [putAccount](StatelessVerkleStateManager.md#putaccount)
- [putContractCode](StatelessVerkleStateManager.md#putcontractcode)
- [putContractStorage](StatelessVerkleStateManager.md#putcontractstorage)
- [revert](StatelessVerkleStateManager.md#revert)
- [setStateRoot](StatelessVerkleStateManager.md#setstateroot)
- [shallowCopy](StatelessVerkleStateManager.md#shallowcopy)
- [verifyPostState](StatelessVerkleStateManager.md#verifypoststate)
- [verifyProof](StatelessVerkleStateManager.md#verifyproof)

## Constructors

### constructor

• **new StatelessVerkleStateManager**(`opts?`)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`StatelessVerkleStateManagerOpts`](../interfaces/StatelessVerkleStateManagerOpts.md) |

#### Defined in

[statelessVerkleStateManager.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L178)

## Properties

### \_accountCache

• `Optional` **\_accountCache**: [`AccountCache`](AccountCache.md)

#### Defined in

[statelessVerkleStateManager.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L138)

___

### \_codeCache

• `Optional` **\_codeCache**: [`CodeCache`](CodeCache.md)

#### Defined in

[statelessVerkleStateManager.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L140)

___

### \_storageCache

• `Optional` **\_storageCache**: [`StorageCache`](StorageCache.md)

#### Defined in

[statelessVerkleStateManager.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L139)

___

### accessWitness

• `Optional` **accessWitness**: [`AccessWitness`](AccessWitness.md)

#### Defined in

[statelessVerkleStateManager.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L171)

___

### originalStorageCache

• **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

#### Implementation of

EVMStateManagerInterface.originalStorageCache

#### Defined in

[statelessVerkleStateManager.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L142)

## Methods

### checkChunkWitnessPresent

▸ **checkChunkWitnessPresent**(`address`, `codeOffset`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `codeOffset` | `number` |

#### Returns

`boolean`

#### Defined in

[statelessVerkleStateManager.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L344)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.checkpoint

#### Defined in

[statelessVerkleStateManager.ts:806](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L806)

___

### chunkifyCode

▸ **chunkifyCode**(`code`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[statelessVerkleStateManager.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L328)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears all underlying caches

#### Returns

`void`

#### Defined in

[statelessVerkleStateManager.ts:881](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L881)

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`<`void`\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to clear the storage of |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.clearContractStorage

#### Defined in

[statelessVerkleStateManager.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L495)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.commit

#### Defined in

[statelessVerkleStateManager.ts:817](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L817)

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account which should be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.deleteAccount

#### Defined in

[statelessVerkleStateManager.ts:595](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L595)

___

### dumpStorage

▸ **dumpStorage**(`_`): `Promise`<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `Address` |

#### Returns

`Promise`<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

EVMStateManagerInterface.dumpStorage

#### Defined in

[statelessVerkleStateManager.ts:870](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L870)

___

### dumpStorageRange

▸ **dumpStorageRange**(`_`, `__`, `___`): `Promise`<`StorageRange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `Address` |
| `__` | `bigint` |
| `___` | `number` |

#### Returns

`Promise`<`StorageRange`\>

#### Implementation of

EVMStateManagerInterface.dumpStorageRange

#### Defined in

[statelessVerkleStateManager.ts:874](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L874)

___

### flush

▸ **flush**(): `Promise`<`void`\>

Writes all cache items to the trie

#### Returns

`Promise`<`void`\>

#### Defined in

[statelessVerkleStateManager.ts:844](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L844)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`_initState`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_initState` | `any` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.generateCanonicalGenesis

#### Defined in

[statelessVerkleStateManager.ts:887](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L887)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`undefined` \| `Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`undefined` \| `Account`\>

#### Implementation of

EVMStateManagerInterface.getAccount

#### Defined in

[statelessVerkleStateManager.ts:505](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L505)

___

### getAppliedKey

▸ **getAppliedKey**(`_`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Implementation of

EVMStateManagerInterface.getAppliedKey

#### Defined in

[statelessVerkleStateManager.ts:891](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L891)

___

### getComputedValue

▸ **getComputedValue**(`accessedState`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `accessedState` | [`AccessedStateWithAddress`](../README.md#accessedstatewithaddress) |

#### Returns

``null`` \| `string`

#### Defined in

[statelessVerkleStateManager.ts:717](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L717)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `code` for |

#### Returns

`Promise`<`Uint8Array`\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

EVMStateManagerInterface.getContractCode

#### Defined in

[statelessVerkleStateManager.ts:391](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L391)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to get the storage for |
| `key` | `Uint8Array` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

EVMStateManagerInterface.getContractStorage

#### Defined in

[statelessVerkleStateManager.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L455)

___

### getProof

▸ **getProof**(`_`, `__?`): `Promise`<`Proof`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_` | `Address` | `undefined` |
| `__` | `Uint8Array`[] | `[]` |

#### Returns

`Promise`<`Proof`\>

#### Implementation of

EVMStateManagerInterface.getProof

#### Defined in

[statelessVerkleStateManager.ts:621](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L621)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

Gets the verkle root.
NOTE: this needs some examination in the code where this is needed
and if we have the verkle root present

#### Returns

`Promise`<`Uint8Array`\>

- Returns the verkle root of the `StateManager`

#### Implementation of

EVMStateManagerInterface.getStateRoot

#### Defined in

[statelessVerkleStateManager.ts:852](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L852)

___

### getTransitionStateRoot

▸ **getTransitionStateRoot**(`_`, `__`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`DefaultStateManager`](DefaultStateManager.md) |
| `__` | `Uint8Array` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[statelessVerkleStateManager.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L242)

___

### getTreeKeyForBalance

▸ **getTreeKeyForBalance**(`stem`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L307)

___

### getTreeKeyForCodeChunk

▸ **getTreeKeyForCodeChunk**(`address`, `chunkId`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `chunkId` | `number` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L323)

___

### getTreeKeyForCodeHash

▸ **getTreeKeyForCodeHash**(`stem`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L315)

___

### getTreeKeyForCodeSize

▸ **getTreeKeyForCodeSize**(`stem`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L319)

___

### getTreeKeyForNonce

▸ **getTreeKeyForNonce**(`stem`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L311)

___

### getTreeKeyForStorageSlot

▸ **getTreeKeyForStorageSlot**(`address`, `storageKey`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageKey` | `bigint` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L338)

___

### getTreeKeyForVersion

▸ **getTreeKeyForVersion**(`stem`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[statelessVerkleStateManager.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L303)

___

### hasStateRoot

▸ **hasStateRoot**(`_`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EVMStateManagerInterface.hasStateRoot

#### Defined in

[statelessVerkleStateManager.ts:825](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L825)

___

### initVerkleExecutionWitness

▸ **initVerkleExecutionWitness**(`executionWitness?`, `accessWitness?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionWitness?` | ``null`` \| `VerkleExecutionWitness` |
| `accessWitness?` | [`AccessWitness`](AccessWitness.md) |

#### Returns

`void`

#### Defined in

[statelessVerkleStateManager.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L246)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.modifyAccountFields

#### Defined in

[statelessVerkleStateManager.ts:608](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L608)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `account` | `Account` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putAccount

#### Defined in

[statelessVerkleStateManager.ts:561](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L561)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to add the `code` for |
| `value` | `Uint8Array` | The value of the `code` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putContractCode

#### Defined in

[statelessVerkleStateManager.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L367)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the state for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to set a storage value for |
| `key` | `Uint8Array` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Uint8Array` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value. |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putContractStorage

#### Defined in

[statelessVerkleStateManager.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L480)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.revert

#### Defined in

[statelessVerkleStateManager.ts:833](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L833)

___

### setStateRoot

▸ **setStateRoot**(`_`): `Promise`<`void`\>

TODO: needed?
Maybe in this context: reset to original pre state suffice

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.setStateRoot

#### Defined in

[statelessVerkleStateManager.ts:861](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L861)

___

### shallowCopy

▸ **shallowCopy**(): `EVMStateManagerInterface`

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

#### Returns

`EVMStateManagerInterface`

#### Implementation of

EVMStateManagerInterface.shallowCopy

#### Defined in

[statelessVerkleStateManager.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L355)

___

### verifyPostState

▸ **verifyPostState**(): `boolean`

#### Returns

`boolean`

#### Defined in

[statelessVerkleStateManager.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L648)

___

### verifyProof

▸ **verifyProof**(`parentVerkleRoot`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentVerkleRoot` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[statelessVerkleStateManager.ts:625](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statelessVerkleStateManager.ts#L625)
