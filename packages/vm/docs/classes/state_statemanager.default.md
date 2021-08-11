[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [state/stateManager](../modules/state_stateManager.md) / default

# Class: default

[state/stateManager](../modules/state_stateManager.md).default

Interface for getting and setting data from an underlying
state trie.

## Implements

- [`StateManager`](../interfaces/state_interface.StateManager.md)

## Table of contents

### Constructors

- [constructor](state_stateManager.default.md#constructor)

### Properties

- [\_accessedStorage](state_stateManager.default.md#_accessedstorage)
- [\_accessedStorageReverted](state_stateManager.default.md#_accessedstoragereverted)
- [\_cache](state_stateManager.default.md#_cache)
- [\_checkpointCount](state_stateManager.default.md#_checkpointcount)
- [\_common](state_stateManager.default.md#_common)
- [\_originalStorageCache](state_stateManager.default.md#_originalstoragecache)
- [\_storageTries](state_stateManager.default.md#_storagetries)
- [\_touched](state_stateManager.default.md#_touched)
- [\_touchedStack](state_stateManager.default.md#_touchedstack)
- [\_trie](state_stateManager.default.md#_trie)

### Methods

- [\_clearOriginalStorageCache](state_stateManager.default.md#_clearoriginalstoragecache)
- [accountExists](state_stateManager.default.md#accountexists)
- [accountIsEmpty](state_stateManager.default.md#accountisempty)
- [addWarmedAddress](state_stateManager.default.md#addwarmedaddress)
- [addWarmedStorage](state_stateManager.default.md#addwarmedstorage)
- [checkpoint](state_stateManager.default.md#checkpoint)
- [cleanupTouchedAccounts](state_stateManager.default.md#cleanuptouchedaccounts)
- [clearContractStorage](state_stateManager.default.md#clearcontractstorage)
- [clearOriginalStorageCache](state_stateManager.default.md#clearoriginalstoragecache)
- [clearWarmedAccounts](state_stateManager.default.md#clearwarmedaccounts)
- [commit](state_stateManager.default.md#commit)
- [copy](state_stateManager.default.md#copy)
- [deleteAccount](state_stateManager.default.md#deleteaccount)
- [dumpStorage](state_stateManager.default.md#dumpstorage)
- [generateAccessList](state_stateManager.default.md#generateaccesslist)
- [generateCanonicalGenesis](state_stateManager.default.md#generatecanonicalgenesis)
- [generateGenesis](state_stateManager.default.md#generategenesis)
- [getAccount](state_stateManager.default.md#getaccount)
- [getContractCode](state_stateManager.default.md#getcontractcode)
- [getContractStorage](state_stateManager.default.md#getcontractstorage)
- [getOriginalContractStorage](state_stateManager.default.md#getoriginalcontractstorage)
- [getStateRoot](state_stateManager.default.md#getstateroot)
- [hasGenesisState](state_stateManager.default.md#hasgenesisstate)
- [isWarmedAddress](state_stateManager.default.md#iswarmedaddress)
- [isWarmedStorage](state_stateManager.default.md#iswarmedstorage)
- [putAccount](state_stateManager.default.md#putaccount)
- [putContractCode](state_stateManager.default.md#putcontractcode)
- [putContractStorage](state_stateManager.default.md#putcontractstorage)
- [revert](state_stateManager.default.md#revert)
- [setStateRoot](state_stateManager.default.md#setstateroot)
- [touchAccount](state_stateManager.default.md#touchaccount)

## Constructors

### constructor

• **new default**(`opts?`)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`DefaultStateManagerOpts`](../interfaces/state_stateManager.DefaultStateManagerOpts.md) |

#### Defined in

[state/stateManager.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L81)

## Properties

### \_accessedStorage

• **\_accessedStorage**: `Map`<`string`, `Set`<`string`\>\>[]

#### Defined in

[state/stateManager.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L62)

___

### \_accessedStorageReverted

• **\_accessedStorageReverted**: `Map`<`string`, `Set`<`string`\>\>[]

#### Defined in

[state/stateManager.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L66)

___

### \_cache

• **\_cache**: `default`

#### Defined in

[state/stateManager.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L48)

___

### \_checkpointCount

• **\_checkpointCount**: `number`

#### Defined in

[state/stateManager.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L51)

___

### \_common

• **\_common**: `default`

#### Defined in

[state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L45)

___

### \_originalStorageCache

• **\_originalStorageCache**: `Map`<`string`, `Map`<`string`, `Buffer`\>\>

#### Defined in

[state/stateManager.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L52)

___

### \_storageTries

• **\_storageTries**: `Object`

#### Index signature

▪ [key: `string`]: `Trie`

#### Defined in

[state/stateManager.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L47)

___

### \_touched

• **\_touched**: `Set`<`string`\>

#### Defined in

[state/stateManager.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L49)

___

### \_touchedStack

• **\_touchedStack**: `Set`<`string`\>[]

#### Defined in

[state/stateManager.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L50)

___

### \_trie

• **\_trie**: `SecureTrie`

#### Defined in

[state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L46)

## Methods

### \_clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): `void`

Clears the original storage cache. Refer to [StateManager.getOriginalContractStorage](../interfaces/state_interface.StateManager.md#getoriginalcontractstorage)
for more explanation.

#### Returns

`void`

#### Defined in

[state/stateManager.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L290)

___

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

Checks if the `account` corresponding to `address`
exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to check |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[accountExists](../interfaces/state_interface.StateManager.md#accountexists)

#### Defined in

[state/stateManager.ts:604](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L604)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`): `Promise`<`boolean`\>

Checks if the `account` corresponding to `address`
is empty or non-existent as defined in
EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to check |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[accountIsEmpty](../interfaces/state_interface.StateManager.md#accountisempty)

#### Defined in

[state/stateManager.ts:594](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L594)

___

### addWarmedAddress

▸ **addWarmedAddress**(`address`): `void`

Add a warm address in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Buffer` | The address (as a Buffer) to check |

#### Returns

`void`

#### Defined in

[state/stateManager.ts:637](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L637)

___

### addWarmedStorage

▸ **addWarmedStorage**(`address`, `slot`): `void`

Mark the storage slot in the address as warm in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Buffer` | The address (as a Buffer) to check |
| `slot` | `Buffer` | The slot (as a Buffer) to check |

#### Returns

`void`

#### Defined in

[state/stateManager.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L670)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[checkpoint](../interfaces/state_interface.StateManager.md#checkpoint)

#### Defined in

[state/stateManager.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L385)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[cleanupTouchedAccounts](../interfaces/state_interface.StateManager.md#cleanuptouchedaccounts)

#### Defined in

[state/stateManager.ts:750](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L750)

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

[StateManager](../interfaces/state_interface.StateManager.md).[clearContractStorage](../interfaces/state_interface.StateManager.md#clearcontractstorage)

#### Defined in

[state/stateManager.ts:373](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L373)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

Clears the original storage cache. Refer to [StateManager.getOriginalContractStorage](../interfaces/state_interface.StateManager.md#getoriginalcontractstorage)
for more explanation. Alias of the internal {@link StateManager._clearOriginalStorageCache}

#### Returns

`void`

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[clearOriginalStorageCache](../interfaces/state_interface.StateManager.md#clearoriginalstoragecache)

#### Defined in

[state/stateManager.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L298)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): `void`

Clear the warm accounts and storage. To be called after a transaction finished.

#### Returns

`void`

#### Defined in

[state/stateManager.ts:684](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L684)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[commit](../interfaces/state_interface.StateManager.md#commit)

#### Defined in

[state/stateManager.ts:421](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L421)

___

### copy

▸ **copy**(): [`StateManager`](../interfaces/state_interface.StateManager.md)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

#### Returns

[`StateManager`](../interfaces/state_interface.StateManager.md)

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[copy](../interfaces/state_interface.StateManager.md#copy)

#### Defined in

[state/stateManager.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L109)

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`<`void`\>

Deletes an account from state under the provided `address`. The account will also be removed from the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account which should be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[deleteAccount](../interfaces/state_interface.StateManager.md#deleteaccount)

#### Defined in

[state/stateManager.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L146)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<[`StorageDump`](../interfaces/state_interface.StorageDump.md)\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address of the `account` to return storage for |

#### Returns

`Promise`<[`StorageDump`](../interfaces/state_interface.StorageDump.md)\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[dumpStorage](../interfaces/state_interface.StateManager.md#dumpstorage)

#### Defined in

[state/stateManager.ts:520](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L520)

___

### generateAccessList

▸ **generateAccessList**(`addressesRemoved?`, `addressesOnlyStorage?`): `AccessList`

Generates an EIP-2930 access list

Note: this method is not yet part of the [StateManager](../interfaces/state_interface.StateManager.md) interface.
If not implemented, {@link VM.runTx} is not allowed to be used with the
`reportAccessList` option and will instead throw.

Note: there is an edge case on accessList generation where an
internal call might revert without an accessList but pass if the
accessList is used for a tx run (so the subsequent behavior might change).
This edge case is not covered by this implementation.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressesRemoved` | `Address`[] | `[]` | List of addresses to be removed from the final list |
| `addressesOnlyStorage` | `Address`[] | `[]` | List of addresses only to be added in case of present storage slots |

#### Returns

`AccessList`

- an [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/packages/tx) `AccessList`

#### Defined in

[state/stateManager.ts:706](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L706)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): `Promise`<`void`\>

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[generateCanonicalGenesis](../interfaces/state_interface.StateManager.md#generatecanonicalgenesis)

#### Defined in

[state/stateManager.ts:556](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L556)

___

### generateGenesis

▸ **generateGenesis**(`initState`): `Promise`<`void`\>

Initializes the provided genesis state into the state trie

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initState` | `any` | Object (address -> balance) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[generateGenesis](../interfaces/state_interface.StateManager.md#generategenesis)

#### Defined in

[state/stateManager.ts:571](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L571)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`Account`\>

Gets the account associated with `address`. Returns an empty account if the account does not exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to get |

#### Returns

`Promise`<`Account`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[getAccount](../interfaces/state_interface.StateManager.md#getaccount)

#### Defined in

[state/stateManager.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L120)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Buffer`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `code` for |

#### Returns

`Promise`<`Buffer`\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[getContractCode](../interfaces/state_interface.StateManager.md#getcontractcode)

#### Defined in

[state/stateManager.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L194)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to get the storage for |
| `key` | `Buffer` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`<`Buffer`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Buffer` is returned.

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[getContractStorage](../interfaces/state_interface.StateManager.md#getcontractstorage)

#### Defined in

[state/stateManager.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L242)

___

### getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

Caches the storage value associated with the provided `address` and `key`
on first invocation, and returns the cached (original) value from then
onwards. This is used to get the original value of a storage slot for
computing gas costs according to EIP-1283.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to get the storage for |
| `key` | `Buffer` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[getOriginalContractStorage](../interfaces/state_interface.StateManager.md#getoriginalcontractstorage)

#### Defined in

[state/stateManager.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L261)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`<`Buffer`\>

- Returns the state-root of the `StateManager`

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[getStateRoot](../interfaces/state_interface.StateManager.md#getstateroot)

#### Defined in

[state/stateManager.ts:481](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L481)

___

### hasGenesisState

▸ **hasGenesisState**(): `Promise`<`boolean`\>

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

#### Returns

`Promise`<`boolean`\>

- Whether the storage trie contains the
canonical genesis state for the configured chain parameters.

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[hasGenesisState](../interfaces/state_interface.StateManager.md#hasgenesisstate)

#### Defined in

[state/stateManager.ts:546](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L546)

___

### isWarmedAddress

▸ **isWarmedAddress**(`address`): `boolean`

Returns true if the address is warm in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Buffer` | The address (as a Buffer) to check |

#### Returns

`boolean`

#### Defined in

[state/stateManager.ts:623](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L623)

___

### isWarmedStorage

▸ **isWarmedStorage**(`address`, `slot`): `boolean`

Returns true if the slot of the address is warm

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Buffer` | The address (as a Buffer) to check |
| `slot` | `Buffer` | The slot (as a Buffer) to check |

#### Returns

`boolean`

#### Defined in

[state/stateManager.ts:651](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L651)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address under which to store `account` |
| `account` | `Account` | The account to store |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[putAccount](../interfaces/state_interface.StateManager.md#putaccount)

#### Defined in

[state/stateManager.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L130)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to add the `code` for |
| `value` | `Buffer` | The value of the `code` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[putContractCode](../interfaces/state_interface.StateManager.md#putcontractcode)

#### Defined in

[state/stateManager.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L171)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to set a storage value for |
| `key` | `Buffer` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Buffer` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[putContractStorage](../interfaces/state_interface.StateManager.md#putcontractstorage)

#### Defined in

[state/stateManager.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L339)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[revert](../interfaces/state_interface.StateManager.md#revert)

#### Defined in

[state/stateManager.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L445)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`): `Promise`<`void`\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Buffer` | The state-root to reset the instance to |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[setStateRoot](../interfaces/state_interface.StateManager.md#setstateroot)

#### Defined in

[state/stateManager.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L494)

___

### touchAccount

▸ **touchAccount**(`address`): `void`

Marks an account as touched, according to the definition
in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
This happens when the account is triggered for a state-changing
event. Touched accounts that are empty will be cleared
at the end of the tx.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`void`

#### Implementation of

[StateManager](../interfaces/state_interface.StateManager.md).[touchAccount](../interfaces/state_interface.StateManager.md#touchaccount)

#### Defined in

[state/stateManager.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/stateManager.ts#L161)
