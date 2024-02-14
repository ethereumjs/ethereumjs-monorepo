[@ethereumjs/statemanager](../README.md) / DefaultStateManager

# Class: DefaultStateManager

Default StateManager implementation for the VM.

The state manager abstracts from the underlying data store
by providing higher level access to accounts, contract code
and storage slots.

The default state manager implementation uses a
`@ethereumjs/trie` trie as a data backend.

## Implements

- `EVMStateManagerInterface`

## Table of contents

### Constructors

- [constructor](DefaultStateManager.md#constructor)

### Properties

- [common](DefaultStateManager.md#common)
- [originalStorageCache](DefaultStateManager.md#originalstoragecache)

### Methods

- [addProofData](DefaultStateManager.md#addproofdata)
- [checkpoint](DefaultStateManager.md#checkpoint)
- [clearCaches](DefaultStateManager.md#clearcaches)
- [clearContractStorage](DefaultStateManager.md#clearcontractstorage)
- [commit](DefaultStateManager.md#commit)
- [deleteAccount](DefaultStateManager.md#deleteaccount)
- [dumpStorage](DefaultStateManager.md#dumpstorage)
- [dumpStorageRange](DefaultStateManager.md#dumpstoragerange)
- [flush](DefaultStateManager.md#flush)
- [generateCanonicalGenesis](DefaultStateManager.md#generatecanonicalgenesis)
- [getAccount](DefaultStateManager.md#getaccount)
- [getContractCode](DefaultStateManager.md#getcontractcode)
- [getContractStorage](DefaultStateManager.md#getcontractstorage)
- [getProof](DefaultStateManager.md#getproof)
- [getStateRoot](DefaultStateManager.md#getstateroot)
- [hasStateRoot](DefaultStateManager.md#hasstateroot)
- [modifyAccountFields](DefaultStateManager.md#modifyaccountfields)
- [putAccount](DefaultStateManager.md#putaccount)
- [putContractCode](DefaultStateManager.md#putcontractcode)
- [putContractStorage](DefaultStateManager.md#putcontractstorage)
- [revert](DefaultStateManager.md#revert)
- [setStateRoot](DefaultStateManager.md#setstateroot)
- [shallowCopy](DefaultStateManager.md#shallowcopy)
- [verifyProof](DefaultStateManager.md#verifyproof)
- [fromProof](DefaultStateManager.md#fromproof)

## Constructors

### constructor

• **new DefaultStateManager**(`opts?`)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`DefaultStateManagerOpts`](../interfaces/DefaultStateManagerOpts.md) |

#### Defined in

[stateManager.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L194)

## Properties

### common

• `Readonly` **common**: `Common`

#### Defined in

[stateManager.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L173)

___

### originalStorageCache

• **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

#### Implementation of

EVMStateManagerInterface.originalStorageCache

#### Defined in

[stateManager.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L162)

## Methods

### addProofData

▸ **addProofData**(`proof`, `safe?`): `Promise`<`void`\>

Add proof(s) into an already existing trie

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) \| [`Proof`](../README.md#proof)[] | `undefined` | The proof(s) retrieved from `getProof` |
| `safe` | `boolean` | `false` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[stateManager.ts:824](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L824)

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

[stateManager.ts:597](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L597)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears all underlying caches

#### Returns

`void`

#### Defined in

[stateManager.ts:1133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1133)

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

[stateManager.ts:580](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L580)

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

[stateManager.ts:609](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L609)

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

[stateManager.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L337)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address of the `account` to return storage for |

#### Returns

`Promise`<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

EVMStateManagerInterface.dumpStorage

#### Defined in

[stateManager.ts:963](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L963)

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`<`StorageRange`\>

Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
starting from `startKey` or greater.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address of the `account` to return storage for. |
| `startKey` | `bigint` | The bigint representation of the smallest storage key that will be returned. |
| `limit` | `number` | The maximum number of storage values that will be returned. |

#### Returns

`Promise`<`StorageRange`\>

- A StorageRange object that will contain at most `limit` entries in its `storage` field.
The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.

#### Implementation of

EVMStateManagerInterface.dumpStorageRange

#### Defined in

[stateManager.ts:989](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L989)

___

### flush

▸ **flush**(): `Promise`<`void`\>

Writes all cache items to the trie

#### Returns

`Promise`<`void`\>

#### Defined in

[stateManager.ts:651](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L651)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`initState`): `Promise`<`void`\>

Initializes the provided genesis state into the state trie.
Will error if there are uncommitted checkpoints on the instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initState` | `any` | address -> balance \| [balance, code, storage] |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.generateCanonicalGenesis

#### Defined in

[stateManager.ts:1036](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1036)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`undefined` \| `Account`\>

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to get |

#### Returns

`Promise`<`undefined` \| `Account`\>

#### Implementation of

EVMStateManagerInterface.getAccount

#### Defined in

[stateManager.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L264)

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

[stateManager.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L383)

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

[stateManager.ts:466](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L466)

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`<[`Proof`](../README.md#proof)\>

Get an EIP-1186 proof

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | address to get proof of |
| `storageSlots` | `Uint8Array`[] | `[]` | storage slots to get proof of |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Implementation of

EVMStateManagerInterface.getProof

#### Defined in

[stateManager.ts:711](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L711)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`<`Uint8Array`\>

- Returns the state-root of the `StateManager`

#### Implementation of

EVMStateManagerInterface.getStateRoot

#### Defined in

[stateManager.ts:921](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L921)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

Checks whether there is a state corresponding to a stateRoot

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EVMStateManagerInterface.hasStateRoot

#### Defined in

[stateManager.ts:1072](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1072)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to modify |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> | Object containing account fields and values to modify |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.modifyAccountFields

#### Defined in

[stateManager.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L321)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address under which to store `account` |
| `account` | `undefined` \| `Account` | The account to store or undefined if to be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putAccount

#### Defined in

[stateManager.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L288)

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

[stateManager.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L360)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the state trie for the `account`
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

[stateManager.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L553)

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

[stateManager.ts:631](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L631)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`<`void`\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `stateRoot` | `Uint8Array` | `undefined` | The state-root to reset the instance to |
| `clearCache` | `boolean` | `true` | - |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.setStateRoot

#### Defined in

[stateManager.ts:933](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L933)

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): [`DefaultStateManager`](DefaultStateManager.md)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

Caches are downleveled (so: adopted for short-term usage)
by default.

This means in particular:
1. For caches instantiated as an LRU cache type
the copy() method will instantiate with an ORDERED_MAP cache
instead, since copied instantances are mostly used in
short-term usage contexts and LRU cache instantation would create
a large overhead here.
2. The underlying trie object is initialized with 0 cache size

Both adoptions can be deactivated by setting `downlevelCaches` to
`false`.

Cache values are generally not copied along regardless of the
`downlevelCaches` setting.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `downlevelCaches` | `boolean` | `true` |

#### Returns

[`DefaultStateManager`](DefaultStateManager.md)

#### Implementation of

EVMStateManagerInterface.shallowCopy

#### Defined in

[stateManager.ts:1098](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1098)

___

### verifyProof

▸ **verifyProof**(`proof`): `Promise`<`boolean`\>

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | the proof to prove |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[stateManager.ts:847](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L847)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `safe?`, `opts?`): `Promise`<[`DefaultStateManager`](DefaultStateManager.md)\>

Create a StateManager and initialize this with proof(s) gotten previously from getProof
This generates a (partial) StateManager where one can retrieve all items from the proof

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) \| [`Proof`](../README.md#proof)[] | `undefined` | Either a proof retrieved from `getProof`, or an array of those proofs |
| `safe` | `boolean` | `false` | Wether or not to verify that the roots of the proof items match the reported roots |
| `opts` | [`DefaultStateManagerOpts`](../interfaces/DefaultStateManagerOpts.md) | `{}` | - |

#### Returns

`Promise`<[`DefaultStateManager`](DefaultStateManager.md)\>

A new DefaultStateManager with elements from the given proof included in its backing state trie

#### Defined in

[stateManager.ts:765](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L765)
