[ethereumjs-vm](../README.md) › ["state/stateManager"](../modules/_state_statemanager_.md) › [DefaultStateManager](_state_statemanager_.defaultstatemanager.md)

# Class: DefaultStateManager

Interface for getting and setting data from an underlying
state trie.

## Hierarchy

* **DefaultStateManager**

## Implements

* [StateManager](../interfaces/_state_index_.statemanager.md)

## Index

### Constructors

* [constructor](_state_statemanager_.defaultstatemanager.md#constructor)

### Properties

* [_cache](_state_statemanager_.defaultstatemanager.md#_cache)
* [_checkpointCount](_state_statemanager_.defaultstatemanager.md#_checkpointcount)
* [_common](_state_statemanager_.defaultstatemanager.md#_common)
* [_originalStorageCache](_state_statemanager_.defaultstatemanager.md#_originalstoragecache)
* [_storageTries](_state_statemanager_.defaultstatemanager.md#_storagetries)
* [_touched](_state_statemanager_.defaultstatemanager.md#_touched)
* [_touchedStack](_state_statemanager_.defaultstatemanager.md#_touchedstack)
* [_trie](_state_statemanager_.defaultstatemanager.md#_trie)

### Methods

* [_clearOriginalStorageCache](_state_statemanager_.defaultstatemanager.md#_clearoriginalstoragecache)
* [_getStorageTrie](_state_statemanager_.defaultstatemanager.md#private-_getstoragetrie)
* [_lookupStorageTrie](_state_statemanager_.defaultstatemanager.md#private-_lookupstoragetrie)
* [_modifyContractStorage](_state_statemanager_.defaultstatemanager.md#private-_modifycontractstorage)
* [accountIsEmpty](_state_statemanager_.defaultstatemanager.md#accountisempty)
* [checkpoint](_state_statemanager_.defaultstatemanager.md#checkpoint)
* [cleanupTouchedAccounts](_state_statemanager_.defaultstatemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_state_statemanager_.defaultstatemanager.md#clearcontractstorage)
* [commit](_state_statemanager_.defaultstatemanager.md#commit)
* [copy](_state_statemanager_.defaultstatemanager.md#copy)
* [dumpStorage](_state_statemanager_.defaultstatemanager.md#dumpstorage)
* [generateCanonicalGenesis](_state_statemanager_.defaultstatemanager.md#generatecanonicalgenesis)
* [generateGenesis](_state_statemanager_.defaultstatemanager.md#generategenesis)
* [getAccount](_state_statemanager_.defaultstatemanager.md#getaccount)
* [getContractCode](_state_statemanager_.defaultstatemanager.md#getcontractcode)
* [getContractStorage](_state_statemanager_.defaultstatemanager.md#getcontractstorage)
* [getOriginalContractStorage](_state_statemanager_.defaultstatemanager.md#getoriginalcontractstorage)
* [getStateRoot](_state_statemanager_.defaultstatemanager.md#getstateroot)
* [hasGenesisState](_state_statemanager_.defaultstatemanager.md#hasgenesisstate)
* [putAccount](_state_statemanager_.defaultstatemanager.md#putaccount)
* [putContractCode](_state_statemanager_.defaultstatemanager.md#putcontractcode)
* [putContractStorage](_state_statemanager_.defaultstatemanager.md#putcontractstorage)
* [revert](_state_statemanager_.defaultstatemanager.md#revert)
* [setStateRoot](_state_statemanager_.defaultstatemanager.md#setstateroot)
* [touchAccount](_state_statemanager_.defaultstatemanager.md#touchaccount)

## Constructors

###  constructor

\+ **new DefaultStateManager**(`opts`: [DefaultStateManagerOpts](../interfaces/_state_statemanager_.defaultstatemanageropts.md)): *[DefaultStateManager](_state_statemanager_.defaultstatemanager.md)*

*Defined in [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L43)*

Instantiate the StateManager interface.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`opts` | [DefaultStateManagerOpts](../interfaces/_state_statemanager_.defaultstatemanageropts.md) | {} |

**Returns:** *[DefaultStateManager](_state_statemanager_.defaultstatemanager.md)*

## Properties

###  _cache

• **_cache**: *Cache*

*Defined in [state/stateManager.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L39)*

___

###  _checkpointCount

• **_checkpointCount**: *number*

*Defined in [state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L42)*

___

###  _common

• **_common**: *Common*

*Defined in [state/stateManager.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L36)*

___

###  _originalStorageCache

• **_originalStorageCache**: *Map‹string, Map‹string, Buffer››*

*Defined in [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L43)*

___

###  _storageTries

• **_storageTries**: *any*

*Defined in [state/stateManager.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L38)*

___

###  _touched

• **_touched**: *Set‹string›*

*Defined in [state/stateManager.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L40)*

___

###  _touchedStack

• **_touchedStack**: *Set‹string›[]*

*Defined in [state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L41)*

___

###  _trie

• **_trie**: *Trie*

*Defined in [state/stateManager.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L37)*

## Methods

###  _clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): *void*

*Defined in [state/stateManager.ts:223](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L223)*

Clears the original storage cache. Refer to [getOriginalContractStorage](_state_statemanager_.defaultstatemanager.md#getoriginalcontractstorage)
for more explanation.

**Returns:** *void*

___

### `Private` _getStorageTrie

▸ **_getStorageTrie**(`address`: Buffer): *Promise‹Trie›*

*Defined in [state/stateManager.ts:155](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L155)*

Gets the storage trie for an account from the storage
cache or does a lookup.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹Trie›*

___

### `Private` _lookupStorageTrie

▸ **_lookupStorageTrie**(`address`: Buffer): *Promise‹Trie›*

*Defined in [state/stateManager.ts:141](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L141)*

Creates a storage trie from the primary storage trie
for an account and saves this in the storage cache.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹Trie›*

___

### `Private` _modifyContractStorage

▸ **_modifyContractStorage**(`address`: Buffer, `modifyTrie`: function): *Promise‹void›*

*Defined in [state/stateManager.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L233)*

Modifies the storage trie of an account.

**Parameters:**

▪ **address**: *Buffer*

Address of the account whose storage is to be modified

▪ **modifyTrie**: *function*

Function to modify the storage trie of the account

▸ (`storageTrie`: Trie, `done`: Function): *void*

**Parameters:**

Name | Type |
------ | ------ |
`storageTrie` | Trie |
`done` | Function |

**Returns:** *Promise‹void›*

___

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Buffer): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:483](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L483)*

Checks if the `account` corresponding to `address` is empty as defined in
EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to check  |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:301](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L301)*

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:498](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L498)*

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:289](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L289)*

Clears all storage entries for the account corresponding to `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to clear the storage of  |

**Returns:** *Promise‹void›*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:312](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L312)*

Commits the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](../interfaces/_state_index_.statemanager.md)*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L69)*

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

**Returns:** *[StateManager](../interfaces/_state_index_.statemanager.md)*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Buffer): *Promise‹[StorageDump](../interfaces/_state_interface_.storagedump.md)›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:411](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L411)*

Dumps the the storage values for an `account` specified by `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | The address of the `account` to return storage for |

**Returns:** *Promise‹[StorageDump](../interfaces/_state_interface_.storagedump.md)›*

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:443](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L443)*

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:458](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L458)*

Initializes the provided genesis state into the state trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initState` | any | Object (address -> balance)  |

**Returns:** *Promise‹void›*

___

###  getAccount

▸ **getAccount**(`address`: Buffer): *Promise‹Account›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L78)*

Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
associated with `address`. Returns an empty account if the account does not exist.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the `account` to get  |

**Returns:** *Promise‹Account›*

___

###  getContractCode

▸ **getContractCode**(`address`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:129](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L129)*

Gets the code corresponding to the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to get the `code` for |

**Returns:** *Promise‹Buffer›*

-  Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

___

###  getContractStorage

▸ **getContractStorage**(`address`: Buffer, `key`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:174](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L174)*

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long. |

**Returns:** *Promise‹Buffer›*

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exists an empty `Buffer` is returned

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Buffer, `key`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:194](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L194)*

Caches the storage value associated with the provided `address` and `key`
on first invocation, and returns the cached (original) value from then
onwards. This is used to get the original value of a storage slot for
computing gas costs according to EIP-1283.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long.  |

**Returns:** *Promise‹Buffer›*

___

###  getStateRoot

▸ **getStateRoot**(): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:363](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L363)*

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise‹Buffer›*

- Returns the state-root of the `StateManager`

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:432](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L432)*

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

**Returns:** *Promise‹boolean›*

- Whether the storage trie contains the
canonical genesis state for the configured chain parameters.

___

###  putAccount

▸ **putAccount**(`address`: Buffer, `account`: Account): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L89)*

Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
into state under the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address under which to store `account` |
`account` | Account | The [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) to store  |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Buffer, `value`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L115)*

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the `account` to add the `code` for |
`value` | Buffer | The value of the `code`  |

**Returns:** *Promise‹void›*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Buffer, `key`: Buffer, `value`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:262](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L262)*

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to set a storage value for |
`key` | Buffer | Key to set the value at. Must be 32 bytes long. |
`value` | Buffer | Value to set at `key` for account corresponding to `address`  |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:331](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L331)*

Reverts the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:379](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L379)*

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stateRoot` | Buffer | The state-root to reset the instance to  |

**Returns:** *Promise‹void›*

___

###  touchAccount

▸ **touchAccount**(`address`: Buffer): *void*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L105)*

Marks an account as touched, according to the definition
in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
This happens when the account is triggered for a state-changing
event. Touched accounts that are empty will be cleared
at the end of the tx.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *void*
