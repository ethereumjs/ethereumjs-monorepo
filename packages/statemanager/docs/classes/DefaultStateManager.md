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
- [getAppliedKey](DefaultStateManager.md#getappliedkey)
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

[stateManager.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L192)

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

[stateManager.ts:819](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L819)

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

[stateManager.ts:593](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L593)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears all underlying caches

#### Returns

`void`

#### Defined in

[stateManager.ts:1148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1148)

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

[stateManager.ts:576](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L576)

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

[stateManager.ts:605](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L605)

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

[stateManager.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L333)

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

[stateManager.ts:962](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L962)

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

[stateManager.ts:995](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L995)

___

### flush

▸ **flush**(): `Promise`<`void`\>

Writes all cache items to the trie

#### Returns

`Promise`<`void`\>

#### Defined in

[stateManager.ts:647](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L647)

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

[stateManager.ts:1051](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1051)

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

[stateManager.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L260)

___

### getAppliedKey

▸ **getAppliedKey**(`address`): `Uint8Array`

Returns the applied key for a given address
Used for saving preimages

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Uint8Array` | The address to return the applied key |

#### Returns

`Uint8Array`

- The applied key (e.g. hashed address)

#### Implementation of

EVMStateManagerInterface.getAppliedKey

#### Defined in

[stateManager.ts:1160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1160)

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

[stateManager.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L379)

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

[stateManager.ts:462](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L462)

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

[stateManager.ts:707](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L707)

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

[stateManager.ts:920](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L920)

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

[stateManager.ts:1087](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1087)

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

[stateManager.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L317)

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

[stateManager.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L284)

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

[stateManager.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L356)

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

[stateManager.ts:549](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L549)

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

[stateManager.ts:627](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L627)

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

[stateManager.ts:932](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L932)

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

[stateManager.ts:1113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L1113)

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

[stateManager.ts:842](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L842)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `safe?`, `opts?`): `Promise`<[`DefaultStateManager`](DefaultStateManager.md)\>

Create a StateManager and initialize this with proof(s) gotten previously from getProof
This generates a (partial) StateManager where one can retrieve all items from the proof

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) \| [`Proof`](../README.md#proof)[] | `undefined` | Either a proof retrieved from `getProof`, or an array of those proofs |
| `safe` | `boolean` | `false` | Whether or not to verify that the roots of the proof items match the reported roots |
| `opts` | [`DefaultStateManagerOpts`](../interfaces/DefaultStateManagerOpts.md) | `{}` | a dictionary of StateManager opts |

#### Returns

`Promise`<[`DefaultStateManager`](DefaultStateManager.md)\>

A new DefaultStateManager with elements from the given proof included in its backing state trie

#### Defined in

[stateManager.ts:760](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L760)
