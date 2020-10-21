[@ethereumjs/vm](../README.md) › ["lib/state/stateManager"](../modules/_lib_state_statemanager_.md) › [DefaultStateManager](_lib_state_statemanager_.defaultstatemanager.md)

# Class: DefaultStateManager

Interface for getting and setting data from an underlying
state trie.

## Hierarchy

* **DefaultStateManager**

## Implements

* [StateManager](../interfaces/_lib_state_index_.statemanager.md)

## Index

### Constructors

* [constructor](_lib_state_statemanager_.defaultstatemanager.md#constructor)

### Properties

* [_cache](_lib_state_statemanager_.defaultstatemanager.md#_cache)
* [_checkpointCount](_lib_state_statemanager_.defaultstatemanager.md#_checkpointcount)
* [_common](_lib_state_statemanager_.defaultstatemanager.md#_common)
* [_originalStorageCache](_lib_state_statemanager_.defaultstatemanager.md#_originalstoragecache)
* [_storageTries](_lib_state_statemanager_.defaultstatemanager.md#_storagetries)
* [_touched](_lib_state_statemanager_.defaultstatemanager.md#_touched)
* [_touchedStack](_lib_state_statemanager_.defaultstatemanager.md#_touchedstack)
* [_trie](_lib_state_statemanager_.defaultstatemanager.md#_trie)

### Methods

* [_clearOriginalStorageCache](_lib_state_statemanager_.defaultstatemanager.md#_clearoriginalstoragecache)
* [_getStorageTrie](_lib_state_statemanager_.defaultstatemanager.md#private-_getstoragetrie)
* [_lookupStorageTrie](_lib_state_statemanager_.defaultstatemanager.md#private-_lookupstoragetrie)
* [_modifyContractStorage](_lib_state_statemanager_.defaultstatemanager.md#private-_modifycontractstorage)
* [accountExists](_lib_state_statemanager_.defaultstatemanager.md#accountexists)
* [accountIsEmpty](_lib_state_statemanager_.defaultstatemanager.md#accountisempty)
* [checkpoint](_lib_state_statemanager_.defaultstatemanager.md#checkpoint)
* [cleanupTouchedAccounts](_lib_state_statemanager_.defaultstatemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_lib_state_statemanager_.defaultstatemanager.md#clearcontractstorage)
* [clearOriginalStorageCache](_lib_state_statemanager_.defaultstatemanager.md#clearoriginalstoragecache)
* [commit](_lib_state_statemanager_.defaultstatemanager.md#commit)
* [copy](_lib_state_statemanager_.defaultstatemanager.md#copy)
* [deleteAccount](_lib_state_statemanager_.defaultstatemanager.md#deleteaccount)
* [dumpStorage](_lib_state_statemanager_.defaultstatemanager.md#dumpstorage)
* [generateCanonicalGenesis](_lib_state_statemanager_.defaultstatemanager.md#generatecanonicalgenesis)
* [generateGenesis](_lib_state_statemanager_.defaultstatemanager.md#generategenesis)
* [getAccount](_lib_state_statemanager_.defaultstatemanager.md#getaccount)
* [getContractCode](_lib_state_statemanager_.defaultstatemanager.md#getcontractcode)
* [getContractStorage](_lib_state_statemanager_.defaultstatemanager.md#getcontractstorage)
* [getOriginalContractStorage](_lib_state_statemanager_.defaultstatemanager.md#getoriginalcontractstorage)
* [getStateRoot](_lib_state_statemanager_.defaultstatemanager.md#getstateroot)
* [hasGenesisState](_lib_state_statemanager_.defaultstatemanager.md#hasgenesisstate)
* [putAccount](_lib_state_statemanager_.defaultstatemanager.md#putaccount)
* [putContractCode](_lib_state_statemanager_.defaultstatemanager.md#putcontractcode)
* [putContractStorage](_lib_state_statemanager_.defaultstatemanager.md#putcontractstorage)
* [revert](_lib_state_statemanager_.defaultstatemanager.md#revert)
* [setStateRoot](_lib_state_statemanager_.defaultstatemanager.md#setstateroot)
* [touchAccount](_lib_state_statemanager_.defaultstatemanager.md#touchaccount)

## Constructors

###  constructor

\+ **new DefaultStateManager**(`opts`: [DefaultStateManagerOpts](../interfaces/_lib_state_statemanager_.defaultstatemanageropts.md)): *[DefaultStateManager](_lib_state_statemanager_.defaultstatemanager.md)*

*Defined in [lib/state/stateManager.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L47)*

Instantiate the StateManager interface.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`opts` | [DefaultStateManagerOpts](../interfaces/_lib_state_statemanager_.defaultstatemanageropts.md) | {} |

**Returns:** *[DefaultStateManager](_lib_state_statemanager_.defaultstatemanager.md)*

## Properties

###  _cache

• **_cache**: *Cache*

*Defined in [lib/state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L43)*

___

###  _checkpointCount

• **_checkpointCount**: *number*

*Defined in [lib/state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L46)*

___

###  _common

• **_common**: *Common*

*Defined in [lib/state/stateManager.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L40)*

___

###  _originalStorageCache

• **_originalStorageCache**: *Map‹AddressHex, Map‹AddressHex, Buffer››*

*Defined in [lib/state/stateManager.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L47)*

___

###  _storageTries

• **_storageTries**: *object*

*Defined in [lib/state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L42)*

#### Type declaration:

* \[ **key**: *string*\]: Trie

___

###  _touched

• **_touched**: *Set‹AddressHex›*

*Defined in [lib/state/stateManager.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L44)*

___

###  _touchedStack

• **_touchedStack**: *Set‹AddressHex›[]*

*Defined in [lib/state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L45)*

___

###  _trie

• **_trie**: *Trie*

*Defined in [lib/state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L41)*

## Methods

###  _clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): *void*

*Defined in [lib/state/stateManager.ts:241](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L241)*

Clears the original storage cache. Refer to [getOriginalContractStorage](_lib_state_statemanager_.defaultstatemanager.md#getoriginalcontractstorage)
for more explanation.

**Returns:** *void*

___

### `Private` _getStorageTrie

▸ **_getStorageTrie**(`address`: Address): *Promise‹Trie›*

*Defined in [lib/state/stateManager.ts:173](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L173)*

Gets the storage trie for an account from the storage
cache or does a lookup.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Trie›*

___

### `Private` _lookupStorageTrie

▸ **_lookupStorageTrie**(`address`: Address): *Promise‹Trie›*

*Defined in [lib/state/stateManager.ts:159](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L159)*

Creates a storage trie from the primary storage trie
for an account and saves this in the storage cache.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Trie›*

___

### `Private` _modifyContractStorage

▸ **_modifyContractStorage**(`address`: Address, `modifyTrie`: function): *Promise‹void›*

*Defined in [lib/state/stateManager.ts:259](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L259)*

Modifies the storage trie of an account.

**Parameters:**

▪ **address**: *Address*

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

###  accountExists

▸ **accountExists**(`address`: Address): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:514](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L514)*

Checks if the `account` corresponding to `address`
exists

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the `account` to check  |

**Returns:** *Promise‹boolean›*

___

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Address): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:504](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L504)*

Checks if the `account` corresponding to `address`
is empty or non-existent as defined in
EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address to check  |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:329](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L329)*

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:529](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L529)*

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Address): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:317](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L317)*

Clears all storage entries for the account corresponding to `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address to clear the storage of  |

**Returns:** *Promise‹void›*

___

###  clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:249](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L249)*

Clears the original storage cache. Refer to [getOriginalContractStorage](_lib_state_statemanager_.defaultstatemanager.md#getoriginalcontractstorage)
for more explanation. Alias of the internal _clearOriginalStorageCache

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:340](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L340)*

Commits the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L73)*

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

**Returns:** *[StateManager](../interfaces/_lib_state_index_.statemanager.md)*

___

###  deleteAccount

▸ **deleteAccount**(`address`: Address): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:103](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L103)*

Deletes an account from state under the provided `address`. The account will also be removed from the state trie.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the account which should be deleted  |

**Returns:** *Promise‹void›*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Address): *Promise‹[StorageDump](../interfaces/_lib_state_interface_.storagedump.md)›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:438](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L438)*

Dumps the RLP-encoded storage values for an `account` specified by `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | The address of the `account` to return storage for |

**Returns:** *Promise‹[StorageDump](../interfaces/_lib_state_interface_.storagedump.md)›*

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:469](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L469)*

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:484](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L484)*

Initializes the provided genesis state into the state trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initState` | any | Object (address -> balance)  |

**Returns:** *Promise‹void›*

___

###  getAccount

▸ **getAccount**(`address`: Address): *Promise‹Account›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L84)*

Gets the account associated with `address`. Returns an empty account if the account does not exist.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the `account` to get  |

**Returns:** *Promise‹Account›*

___

###  getContractCode

▸ **getContractCode**(`address`: Address): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:145](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L145)*

Gets the code corresponding to the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address to get the `code` for |

**Returns:** *Promise‹Buffer›*

-  Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

___

###  getContractStorage

▸ **getContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:193](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L193)*

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long. |

**Returns:** *Promise‹Buffer›*

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Buffer` is returned.

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:212](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L212)*

Caches the storage value associated with the provided `address` and `key`
on first invocation, and returns the cached (original) value from then
onwards. This is used to get the original value of a storage slot for
computing gas costs according to EIP-1283.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long.  |

**Returns:** *Promise‹Buffer›*

___

###  getStateRoot

▸ **getStateRoot**(`force`: boolean): *Promise‹Buffer›*

*Defined in [lib/state/stateManager.ts:391](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L391)*

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`force` | boolean | false | If set to `true`, force a cache flush even if there are uncommited checkpoints (this is set to `true` pre-Byzantium in order to get intermediate state roots for the receipts) |

**Returns:** *Promise‹Buffer›*

- Returns the state-root of the `StateManager`

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:459](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L459)*

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

**Returns:** *Promise‹boolean›*

- Whether the storage trie contains the
canonical genesis state for the configured chain parameters.

___

###  putAccount

▸ **putAccount**(`address`: Address, `account`: Account): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:94](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L94)*

Saves an account into state under the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address under which to store `account` |
`account` | Account | The account to store  |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Address, `value`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:125](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L125)*

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address of the `account` to add the `code` for |
`value` | Buffer | The value of the `code`  |

**Returns:** *Promise‹void›*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Address, `key`: Buffer, `value`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:289](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L289)*

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Address | Address to set a storage value for |
`key` | Buffer | Key to set the value at. Must be 32 bytes long. |
`value` | Buffer | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.  |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:358](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L358)*

Reverts the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:407](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L407)*

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

▸ **touchAccount**(`address`: Address): *void*

*Implementation of [StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/state/stateManager.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L115)*

Marks an account as touched, according to the definition
in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
This happens when the account is triggered for a state-changing
event. Touched accounts that are empty will be cleared
at the end of the tx.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *void*
