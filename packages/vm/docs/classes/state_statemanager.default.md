[@ethereumjs/vm](../README.md) / [state/stateManager](../modules/state_statemanager.md) / default

# Class: default

[state/stateManager](../modules/state_statemanager.md).default

Interface for getting and setting data from an underlying
state trie.

## Implements

- [*StateManager*](../interfaces/state_interface.statemanager.md)

## Table of contents

### Constructors

- [constructor](state_statemanager.default.md#constructor)

### Properties

- [\_accessedStorage](state_statemanager.default.md#_accessedstorage)
- [\_accessedStorageReverted](state_statemanager.default.md#_accessedstoragereverted)
- [\_cache](state_statemanager.default.md#_cache)
- [\_checkpointCount](state_statemanager.default.md#_checkpointcount)
- [\_common](state_statemanager.default.md#_common)
- [\_originalStorageCache](state_statemanager.default.md#_originalstoragecache)
- [\_storageTries](state_statemanager.default.md#_storagetries)
- [\_touched](state_statemanager.default.md#_touched)
- [\_touchedStack](state_statemanager.default.md#_touchedstack)
- [\_trie](state_statemanager.default.md#_trie)

### Methods

- [\_clearOriginalStorageCache](state_statemanager.default.md#_clearoriginalstoragecache)
- [accountExists](state_statemanager.default.md#accountexists)
- [accountIsEmpty](state_statemanager.default.md#accountisempty)
- [addWarmedAddress](state_statemanager.default.md#addwarmedaddress)
- [addWarmedStorage](state_statemanager.default.md#addwarmedstorage)
- [checkpoint](state_statemanager.default.md#checkpoint)
- [cleanupTouchedAccounts](state_statemanager.default.md#cleanuptouchedaccounts)
- [clearContractStorage](state_statemanager.default.md#clearcontractstorage)
- [clearOriginalStorageCache](state_statemanager.default.md#clearoriginalstoragecache)
- [clearWarmedAccounts](state_statemanager.default.md#clearwarmedaccounts)
- [commit](state_statemanager.default.md#commit)
- [copy](state_statemanager.default.md#copy)
- [deleteAccount](state_statemanager.default.md#deleteaccount)
- [dumpStorage](state_statemanager.default.md#dumpstorage)
- [generateAccessList](state_statemanager.default.md#generateaccesslist)
- [generateCanonicalGenesis](state_statemanager.default.md#generatecanonicalgenesis)
- [generateGenesis](state_statemanager.default.md#generategenesis)
- [getAccount](state_statemanager.default.md#getaccount)
- [getContractCode](state_statemanager.default.md#getcontractcode)
- [getContractStorage](state_statemanager.default.md#getcontractstorage)
- [getOriginalContractStorage](state_statemanager.default.md#getoriginalcontractstorage)
- [getStateRoot](state_statemanager.default.md#getstateroot)
- [hasGenesisState](state_statemanager.default.md#hasgenesisstate)
- [isWarmedAddress](state_statemanager.default.md#iswarmedaddress)
- [isWarmedStorage](state_statemanager.default.md#iswarmedstorage)
- [putAccount](state_statemanager.default.md#putaccount)
- [putContractCode](state_statemanager.default.md#putcontractcode)
- [putContractStorage](state_statemanager.default.md#putcontractstorage)
- [revert](state_statemanager.default.md#revert)
- [setStateRoot](state_statemanager.default.md#setstateroot)
- [touchAccount](state_statemanager.default.md#touchaccount)

## Constructors

### constructor

\+ **new default**(`opts?`: [*DefaultStateManagerOpts*](../interfaces/state_statemanager.defaultstatemanageropts.md)): [*default*](state_statemanager.default.md)

Instantiate the StateManager interface.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opts` | [*DefaultStateManagerOpts*](../interfaces/state_statemanager.defaultstatemanageropts.md) | {} |

**Returns:** [*default*](state_statemanager.default.md)

Defined in: [state/stateManager.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L62)

## Properties

### \_accessedStorage

• **\_accessedStorage**: *Map*<string, Set<string\>\>[]

Defined in: [state/stateManager.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L58)

___

### \_accessedStorageReverted

• **\_accessedStorageReverted**: *Map*<string, Set<string\>\>[]

Defined in: [state/stateManager.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L62)

___

### \_cache

• **\_cache**: *default*

Defined in: [state/stateManager.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L44)

___

### \_checkpointCount

• **\_checkpointCount**: *number*

Defined in: [state/stateManager.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L47)

___

### \_common

• **\_common**: *default*

Defined in: [state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L41)

___

### \_originalStorageCache

• **\_originalStorageCache**: *Map*<string, Map<string, Buffer\>\>

Defined in: [state/stateManager.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L48)

___

### \_storageTries

• **\_storageTries**: *object*

#### Type declaration

Defined in: [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L43)

___

### \_touched

• **\_touched**: *Set*<string\>

Defined in: [state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L45)

___

### \_touchedStack

• **\_touchedStack**: *Set*<string\>[]

Defined in: [state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L46)

___

### \_trie

• **\_trie**: *SecureTrie*

Defined in: [state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L42)

## Methods

### \_clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): *void*

Clears the original storage cache. Refer to [getOriginalContractStorage](state_statemanager.default.md#getoriginalcontractstorage)
for more explanation.

**Returns:** *void*

Defined in: [state/stateManager.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L258)

___

### accountExists

▸ **accountExists**(`address`: *Address*): *Promise*<boolean\>

Checks if the `account` corresponding to `address`
exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the `account` to check |

**Returns:** *Promise*<boolean\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:563](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L563)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`: *Address*): *Promise*<boolean\>

Checks if the `account` corresponding to `address`
is empty or non-existent as defined in
EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address to check |

**Returns:** *Promise*<boolean\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L553)

___

### addWarmedAddress

▸ **addWarmedAddress**(`address`: *Buffer*): *void*

Add a warm address in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Buffer* | The address (as a Buffer) to check |

**Returns:** *void*

Defined in: [state/stateManager.ts:596](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L596)

___

### addWarmedStorage

▸ **addWarmedStorage**(`address`: *Buffer*, `slot`: *Buffer*): *void*

Mark the storage slot in the address as warm in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Buffer* | The address (as a Buffer) to check |
| `slot` | *Buffer* | The slot (as a Buffer) to check |

**Returns:** *void*

Defined in: [state/stateManager.ts:629](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L629)

___

### checkpoint

▸ **checkpoint**(): *Promise*<void\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L347)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise*<void\>

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:709](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L709)

___

### clearContractStorage

▸ **clearContractStorage**(`address`: *Address*): *Promise*<void\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address to clear the storage of |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:335](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L335)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

Clears the original storage cache. Refer to [getOriginalContractStorage](state_statemanager.default.md#getoriginalcontractstorage)
for more explanation. Alias of the internal _clearOriginalStorageCache

**Returns:** *void*

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L266)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): *void*

Clear the warm accounts and storage. To be called after a transaction finished.

**Returns:** *void*

Defined in: [state/stateManager.ts:643](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L643)

___

### commit

▸ **commit**(): *Promise*<void\>

Commits the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L383)

___

### copy

▸ **copy**(): [*StateManager*](../interfaces/state_interface.statemanager.md)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

**Returns:** [*StateManager*](../interfaces/state_interface.statemanager.md)

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L90)

___

### deleteAccount

▸ **deleteAccount**(`address`: *Address*): *Promise*<void\>

Deletes an account from state under the provided `address`. The account will also be removed from the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the account which should be deleted |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L120)

___

### dumpStorage

▸ **dumpStorage**(`address`: *Address*): *Promise*<[*StorageDump*](../interfaces/state_interface.storagedump.md)\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | The address of the `account` to return storage for |

**Returns:** *Promise*<[*StorageDump*](../interfaces/state_interface.storagedump.md)\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:482](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L482)

___

### generateAccessList

▸ **generateAccessList**(`addressesRemoved?`: *Address*[], `addressesOnlyStorage?`: *Address*[]): AccessList

Generates an EIP-2930 access list

Note: this method is not yet part of the `StateManager` interface.
If not implemented, `runTx()` is not allowed to be used with the
`reportAccessList` option and will instead throw.

Note: there is an edge case on accessList generation where an
internal call might revert without an accessList but pass if the
accessList is used for a tx run (so the subsequent behavior might change).
This edge case is not covered by this implementation.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressesRemoved` | *Address*[] | [] | List of addresses to be removed from the final list |
| `addressesOnlyStorage` | *Address*[] | [] | List of addresses only to be added in case of present storage slots |

**Returns:** AccessList

- an [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/packages/tx) `AccessList`

Defined in: [state/stateManager.ts:665](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L665)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise*<void\>

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:518](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L518)

___

### generateGenesis

▸ **generateGenesis**(`initState`: *any*): *Promise*<void\>

Initializes the provided genesis state into the state trie

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initState` | *any* | Object (address -> balance) |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L533)

___

### getAccount

▸ **getAccount**(`address`: *Address*): *Promise*<Account\>

Gets the account associated with `address`. Returns an empty account if the account does not exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the `account` to get |

**Returns:** *Promise*<Account\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L101)

___

### getContractCode

▸ **getContractCode**(`address`: *Address*): *Promise*<Buffer\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address to get the `code` for |

**Returns:** *Promise*<Buffer\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L162)

___

### getContractStorage

▸ **getContractStorage**(`address`: *Address*, `key`: *Buffer*): *Promise*<Buffer\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the account to get the storage for |
| `key` | *Buffer* | Key in the account's storage to get the value for. Must be 32 bytes long. |

**Returns:** *Promise*<Buffer\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Buffer` is returned.

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L210)

___

### getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: *Address*, `key`: *Buffer*): *Promise*<Buffer\>

Caches the storage value associated with the provided `address` and `key`
on first invocation, and returns the cached (original) value from then
onwards. This is used to get the original value of a storage slot for
computing gas costs according to EIP-1283.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the account to get the storage for |
| `key` | *Buffer* | Key in the account's storage to get the value for. Must be 32 bytes long. |

**Returns:** *Promise*<Buffer\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L229)

___

### getStateRoot

▸ **getStateRoot**(): *Promise*<Buffer\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise*<Buffer\>

- Returns the state-root of the `StateManager`

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L443)

___

### hasGenesisState

▸ **hasGenesisState**(): *Promise*<boolean\>

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

**Returns:** *Promise*<boolean\>

- Whether the storage trie contains the
canonical genesis state for the configured chain parameters.

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:508](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L508)

___

### isWarmedAddress

▸ **isWarmedAddress**(`address`: *Buffer*): *boolean*

Returns true if the address is warm in the current context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Buffer* | The address (as a Buffer) to check |

**Returns:** *boolean*

Defined in: [state/stateManager.ts:582](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L582)

___

### isWarmedStorage

▸ **isWarmedStorage**(`address`: *Buffer*, `slot`: *Buffer*): *boolean*

Returns true if the slot of the address is warm

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Buffer* | The address (as a Buffer) to check |
| `slot` | *Buffer* | The slot (as a Buffer) to check |

**Returns:** *boolean*

Defined in: [state/stateManager.ts:610](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L610)

___

### putAccount

▸ **putAccount**(`address`: *Address*, `account`: *Account*): *Promise*<void\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address under which to store `account` |
| `account` | *Account* | The account to store |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L111)

___

### putContractCode

▸ **putContractCode**(`address`: *Address*, `value`: *Buffer*): *Promise*<void\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address of the `account` to add the `code` for |
| `value` | *Buffer* | The value of the `code` |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L142)

___

### putContractStorage

▸ **putContractStorage**(`address`: *Address*, `key`: *Buffer*, `value`: *Buffer*): *Promise*<void\>

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | *Address* | Address to set a storage value for |
| `key` | *Buffer* | Key to set the value at. Must be 32 bytes long. |
| `value` | *Buffer* | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value. |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L307)

___

### revert

▸ **revert**(): *Promise*<void\>

Reverts the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L407)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`: *Buffer*): *Promise*<void\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | *Buffer* | The state-root to reset the instance to |

**Returns:** *Promise*<void\>

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L456)

___

### touchAccount

▸ **touchAccount**(`address`: *Address*): *void*

Marks an account as touched, according to the definition
in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
This happens when the account is triggered for a state-changing
event. Touched accounts that are empty will be cleared
at the end of the tx.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *void*

Implementation of: [StateManager](../interfaces/state_interface.statemanager.md)

Defined in: [state/stateManager.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/stateManager.ts#L132)
