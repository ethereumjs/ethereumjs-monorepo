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

- [checkpoint](DefaultStateManager.md#checkpoint)
- [clearCaches](DefaultStateManager.md#clearcaches)
- [clearContractStorage](DefaultStateManager.md#clearcontractstorage)
- [commit](DefaultStateManager.md#commit)
- [deleteAccount](DefaultStateManager.md#deleteaccount)
- [dumpStorage](DefaultStateManager.md#dumpstorage)
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

## Constructors

### constructor

• **new DefaultStateManager**(`opts?`)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`DefaultStateManagerOpts`](../interfaces/DefaultStateManagerOpts.md) |

#### Defined in

[stateManager.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L174)

## Properties

### common

• `Readonly` **common**: `Common`

#### Defined in

[stateManager.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L155)

___

### originalStorageCache

• **originalStorageCache**: `OriginalStorageCache`

#### Implementation of

EVMStateManagerInterface.originalStorageCache

#### Defined in

[stateManager.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L145)

## Methods

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

[stateManager.ts:528](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L528)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears all underlying caches

#### Returns

`void`

#### Defined in

[stateManager.ts:885](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L885)

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

[stateManager.ts:511](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L511)

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

[stateManager.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L539)

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

[stateManager.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L299)

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

[stateManager.ts:778](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L778)

___

### flush

▸ **flush**(): `Promise`<`void`\>

Writes all cache items to the trie

#### Returns

`Promise`<`void`\>

#### Defined in

[stateManager.ts:579](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L579)

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

[stateManager.ts:809](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L809)

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

[stateManager.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L226)

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

[stateManager.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L347)

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

[stateManager.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L397)

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

[stateManager.ts:617](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L617)

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

[stateManager.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L738)

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

[stateManager.ts:845](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L845)

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

[stateManager.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L283)

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

[stateManager.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L250)

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

[stateManager.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L319)

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

[stateManager.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L484)

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

[stateManager.ts:560](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L560)

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

[stateManager.ts:750](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L750)

___

### shallowCopy

▸ **shallowCopy**(): [`DefaultStateManager`](DefaultStateManager.md)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

Note on caches:
1. For caches instantiated as an LRU cache type
the copy() method will instantiate with an ORDERED_MAP cache
instead, since copied instantances are mostly used in
short-term usage contexts and LRU cache instantation would create
a large overhead here.
2. Cache values are generally not copied along

#### Returns

[`DefaultStateManager`](DefaultStateManager.md)

#### Implementation of

EVMStateManagerInterface.shallowCopy

#### Defined in

[stateManager.ts:862](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L862)

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

[stateManager.ts:665](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L665)
