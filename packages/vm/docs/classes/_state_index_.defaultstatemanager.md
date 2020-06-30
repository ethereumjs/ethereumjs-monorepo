[@ethereumjs/vm](../README.md) › ["state/index"](../modules/_state_index_.md) › [DefaultStateManager](_state_index_.defaultstatemanager.md)

# Class: DefaultStateManager

Interface for getting and setting data from an underlying
state trie.

## Hierarchy

* **DefaultStateManager**

## Implements

* [StateManager](../interfaces/_state_index_.statemanager.md)

## Index

### Constructors

* [constructor](_state_index_.defaultstatemanager.md#constructor)

### Properties

* [_cache](_state_index_.defaultstatemanager.md#_cache)
* [_checkpointCount](_state_index_.defaultstatemanager.md#_checkpointcount)
* [_common](_state_index_.defaultstatemanager.md#_common)
* [_originalStorageCache](_state_index_.defaultstatemanager.md#_originalstoragecache)
* [_storageTries](_state_index_.defaultstatemanager.md#_storagetries)
* [_touched](_state_index_.defaultstatemanager.md#_touched)
* [_touchedStack](_state_index_.defaultstatemanager.md#_touchedstack)
* [_trie](_state_index_.defaultstatemanager.md#_trie)

### Methods

* [_clearOriginalStorageCache](_state_index_.defaultstatemanager.md#_clearoriginalstoragecache)
* [_getStorageTrie](_state_index_.defaultstatemanager.md#private-_getstoragetrie)
* [_lookupStorageTrie](_state_index_.defaultstatemanager.md#private-_lookupstoragetrie)
* [_modifyContractStorage](_state_index_.defaultstatemanager.md#private-_modifycontractstorage)
* [accountIsEmpty](_state_index_.defaultstatemanager.md#accountisempty)
* [checkpoint](_state_index_.defaultstatemanager.md#checkpoint)
* [cleanupTouchedAccounts](_state_index_.defaultstatemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_state_index_.defaultstatemanager.md#clearcontractstorage)
* [commit](_state_index_.defaultstatemanager.md#commit)
* [copy](_state_index_.defaultstatemanager.md#copy)
* [dumpStorage](_state_index_.defaultstatemanager.md#dumpstorage)
* [generateCanonicalGenesis](_state_index_.defaultstatemanager.md#generatecanonicalgenesis)
* [generateGenesis](_state_index_.defaultstatemanager.md#generategenesis)
* [getAccount](_state_index_.defaultstatemanager.md#getaccount)
* [getContractCode](_state_index_.defaultstatemanager.md#getcontractcode)
* [getContractStorage](_state_index_.defaultstatemanager.md#getcontractstorage)
* [getOriginalContractStorage](_state_index_.defaultstatemanager.md#getoriginalcontractstorage)
* [getStateRoot](_state_index_.defaultstatemanager.md#getstateroot)
* [hasGenesisState](_state_index_.defaultstatemanager.md#hasgenesisstate)
* [putAccount](_state_index_.defaultstatemanager.md#putaccount)
* [putContractCode](_state_index_.defaultstatemanager.md#putcontractcode)
* [putContractStorage](_state_index_.defaultstatemanager.md#putcontractstorage)
* [revert](_state_index_.defaultstatemanager.md#revert)
* [setStateRoot](_state_index_.defaultstatemanager.md#setstateroot)
* [touchAccount](_state_index_.defaultstatemanager.md#touchaccount)

## Constructors

###  constructor

\+ **new DefaultStateManager**(`opts`: [DefaultStateManagerOpts](../interfaces/_state_statemanager_.defaultstatemanageropts.md)): *[DefaultStateManager](_state_index_.defaultstatemanager.md)*

*Defined in [state/stateManager.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L38)*

Instantiate the StateManager interface.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`opts` | [DefaultStateManagerOpts](../interfaces/_state_statemanager_.defaultstatemanageropts.md) | {} |

**Returns:** *[DefaultStateManager](_state_index_.defaultstatemanager.md)*

## Properties

###  _cache

• **_cache**: *Cache*

*Defined in [state/stateManager.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L34)*

___

###  _checkpointCount

• **_checkpointCount**: *number*

*Defined in [state/stateManager.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L37)*

___

###  _common

• **_common**: *Common*

*Defined in [state/stateManager.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L31)*

___

###  _originalStorageCache

• **_originalStorageCache**: *Map‹string, Map‹string, Buffer››*

*Defined in [state/stateManager.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L38)*

___

###  _storageTries

• **_storageTries**: *any*

*Defined in [state/stateManager.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L33)*

___

###  _touched

• **_touched**: *Set‹string›*

*Defined in [state/stateManager.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L35)*

___

###  _touchedStack

• **_touchedStack**: *Set‹string›[]*

*Defined in [state/stateManager.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L36)*

___

###  _trie

• **_trie**: *Trie*

*Defined in [state/stateManager.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L32)*

## Methods

###  _clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): *void*

*Defined in [state/stateManager.ts:225](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L225)*

Clears the original storage cache. Refer to [getOriginalContractStorage](_state_index_.defaultstatemanager.md#getoriginalcontractstorage)
for more explanation.

**Returns:** *void*

___

### `Private` _getStorageTrie

▸ **_getStorageTrie**(`address`: Buffer): *Promise‹Trie›*

*Defined in [state/stateManager.ts:158](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L158)*

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

*Defined in [state/stateManager.ts:144](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L144)*

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

*Defined in [state/stateManager.ts:235](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L235)*

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

*Defined in [state/stateManager.ts:475](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L475)*

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

*Defined in [state/stateManager.ts:298](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L298)*

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:484](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L484)*

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:286](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L286)*

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

*Defined in [state/stateManager.ts:309](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L309)*

Commits the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](../interfaces/_state_index_.statemanager.md)*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L64)*

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

**Returns:** *[StateManager](../interfaces/_state_index_.statemanager.md)*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Buffer): *Promise‹[StorageDump](../interfaces/_state_interface_.storagedump.md)›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:406](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L406)*

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

*Defined in [state/stateManager.ts:437](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L437)*

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:452](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L452)*

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

*Defined in [state/stateManager.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L73)*

Gets the [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account)
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

*Defined in [state/stateManager.ts:130](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L130)*

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

*Defined in [state/stateManager.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L177)*

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
If this does not exist an empty `Buffer` is returned.

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Buffer, `key`: Buffer): *Promise‹Buffer›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:196](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L196)*

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

*Defined in [state/stateManager.ts:359](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L359)*

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

**Returns:** *Promise‹Buffer›*

- Returns the state-root of the `StateManager`

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:427](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L427)*

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

**Returns:** *Promise‹boolean›*

- Whether the storage trie contains the
canonical genesis state for the configured chain parameters.

___

###  putAccount

▸ **putAccount**(`address`: Buffer, `account`: Account): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L84)*

Saves an [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account)
into state under the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address under which to store `account` |
`account` | Account | The [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account) to store  |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Buffer, `value`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:110](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L110)*

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

*Defined in [state/stateManager.ts:264](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L264)*

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

*Defined in [state/stateManager.ts:327](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L327)*

Reverts the current change-set to the instance since the
last call to checkpoint.

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Implementation of [StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:375](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L375)*

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

*Defined in [state/stateManager.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L100)*

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
