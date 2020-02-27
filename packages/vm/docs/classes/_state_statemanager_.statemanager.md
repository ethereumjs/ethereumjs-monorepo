[ethereumjs-vm](../README.md) › ["state/stateManager"](../modules/_state_statemanager_.md) › [StateManager](_state_statemanager_.statemanager.md)

# Class: StateManager

Interface for getting and setting data from an underlying
state trie.

## Hierarchy

* **StateManager**

## Index

### Constructors

* [constructor](_state_statemanager_.statemanager.md#constructor)

### Properties

* [_cache](_state_statemanager_.statemanager.md#_cache)
* [_checkpointCount](_state_statemanager_.statemanager.md#_checkpointcount)
* [_common](_state_statemanager_.statemanager.md#_common)
* [_originalStorageCache](_state_statemanager_.statemanager.md#_originalstoragecache)
* [_storageTries](_state_statemanager_.statemanager.md#_storagetries)
* [_touched](_state_statemanager_.statemanager.md#_touched)
* [_touchedStack](_state_statemanager_.statemanager.md#_touchedstack)
* [_trie](_state_statemanager_.statemanager.md#_trie)

### Methods

* [_getStorageTrie](_state_statemanager_.statemanager.md#private-_getstoragetrie)
* [_lookupStorageTrie](_state_statemanager_.statemanager.md#private-_lookupstoragetrie)
* [_modifyContractStorage](_state_statemanager_.statemanager.md#private-_modifycontractstorage)
* [accountIsEmpty](_state_statemanager_.statemanager.md#accountisempty)
* [checkpoint](_state_statemanager_.statemanager.md#checkpoint)
* [cleanupTouchedAccounts](_state_statemanager_.statemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_state_statemanager_.statemanager.md#clearcontractstorage)
* [commit](_state_statemanager_.statemanager.md#commit)
* [copy](_state_statemanager_.statemanager.md#copy)
* [dumpStorage](_state_statemanager_.statemanager.md#dumpstorage)
* [generateCanonicalGenesis](_state_statemanager_.statemanager.md#generatecanonicalgenesis)
* [generateGenesis](_state_statemanager_.statemanager.md#generategenesis)
* [getAccount](_state_statemanager_.statemanager.md#getaccount)
* [getContractCode](_state_statemanager_.statemanager.md#getcontractcode)
* [getContractStorage](_state_statemanager_.statemanager.md#getcontractstorage)
* [getOriginalContractStorage](_state_statemanager_.statemanager.md#getoriginalcontractstorage)
* [getStateRoot](_state_statemanager_.statemanager.md#getstateroot)
* [hasGenesisState](_state_statemanager_.statemanager.md#hasgenesisstate)
* [putAccount](_state_statemanager_.statemanager.md#putaccount)
* [putContractCode](_state_statemanager_.statemanager.md#putcontractcode)
* [putContractStorage](_state_statemanager_.statemanager.md#putcontractstorage)
* [revert](_state_statemanager_.statemanager.md#revert)
* [setStateRoot](_state_statemanager_.statemanager.md#setstateroot)
* [touchAccount](_state_statemanager_.statemanager.md#touchaccount)

## Constructors

###  constructor

\+ **new StateManager**(`opts`: [StateManagerOpts](../interfaces/_state_statemanager_.statemanageropts.md)): *[StateManager](_state_statemanager_.statemanager.md)*

*Defined in [state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L46)*

Instantiate the StateManager interface.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`opts` | [StateManagerOpts](../interfaces/_state_statemanager_.statemanageropts.md) | {} |

**Returns:** *[StateManager](_state_statemanager_.statemanager.md)*

## Properties

###  _cache

• **_cache**: *Cache*

*Defined in [state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L42)*

___

###  _checkpointCount

• **_checkpointCount**: *number*

*Defined in [state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L45)*

___

###  _common

• **_common**: *Common*

*Defined in [state/stateManager.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L39)*

___

###  _originalStorageCache

• **_originalStorageCache**: *Map‹string, Map‹string, Buffer››*

*Defined in [state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L46)*

___

###  _storageTries

• **_storageTries**: *any*

*Defined in [state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L41)*

___

###  _touched

• **_touched**: *Set‹string›*

*Defined in [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L43)*

___

###  _touchedStack

• **_touchedStack**: *Set‹string›[]*

*Defined in [state/stateManager.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L44)*

___

###  _trie

• **_trie**: *any*

*Defined in [state/stateManager.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L40)*

## Methods

### `Private` _getStorageTrie

▸ **_getStorageTrie**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:189](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L189)*

Gets the storage trie for an account from the storage
cache or does a lookup.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`cb` | any |

**Returns:** *void*

___

### `Private` _lookupStorageTrie

▸ **_lookupStorageTrie**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L171)*

Creates a storage trie from the primary storage trie
for an account and saves this in the storage cache.

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`cb` | any |

**Returns:** *void*

___

### `Private` _modifyContractStorage

▸ **_modifyContractStorage**(`address`: Buffer, `modifyTrie`: any, `cb`: any): *void*

*Defined in [state/stateManager.ts:276](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L276)*

Modifies the storage trie of an account

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the account whose storage is to be modified |
`modifyTrie` | any | Function to modify the storage trie of the account  |
`cb` | any | - |

**Returns:** *void*

___

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:573](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L573)*

Checks if the `account` corresponding to `address` is empty as defined in
EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to check |
`cb` | any |   |

**Returns:** *void*

___

###  checkpoint

▸ **checkpoint**(`cb`: any): *void*

*Defined in [state/stateManager.ts:346](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L346)*

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(`cb`: any): *void*

*Defined in [state/stateManager.ts:594](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L594)*

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:329](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L329)*

Clears all storage entries for the account corresponding to `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to clear the storage of |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  commit

▸ **commit**(`cb`: any): *void*

*Defined in [state/stateManager.ts:359](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L359)*

Commits the current change-set to the instance since the
last call to checkpoint.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  copy

▸ **copy**(): *[StateManager](_state_index_.statemanager.md)*

*Defined in [state/stateManager.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L72)*

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

**Returns:** *[StateManager](_state_index_.statemanager.md)*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:479](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L479)*

Dumps the the storage values for an `account` specified by `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | The address of the `account` to return storage for |
`cb` | any |   |

**Returns:** *void*

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`cb`: any): *void*

*Defined in [state/stateManager.ts:519](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L519)*

Generates a canonical genesis state on the instance based on the
configured chain parameters. Will error if there are uncommitted
checkpoints on the instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any, `cb`: any): *any*

*Defined in [state/stateManager.ts:538](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L538)*

Initializes the provided genesis state into the state trie

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initState` | any | Object (address -> balance) |
`cb` | any | Callback function  |

**Returns:** *any*

___

###  getAccount

▸ **getAccount**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L90)*

Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
associated with `address`. Returns an empty account if the account does not exist.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the `account` to get |
`cb` | any |   |

**Returns:** *void*

___

###  getContractCode

▸ **getContractCode**(`address`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:157](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L157)*

Gets the code corresponding to the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to get the `code` for |
`cb` | any |   |

**Returns:** *void*

___

###  getContractStorage

▸ **getContractStorage**(`address`: Buffer, `key`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:215](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L215)*

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long. |
`cb` | any | - |

**Returns:** *void*

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Buffer, `key`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L242)*

Caches the storage value associated with the provided `address` and `key`
on first invocation, and returns the cached (original) value from then
onwards. This is used to get the original value of a storage slot for
computing gas costs according to EIP-1283.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the account to get the storage for |
`key` | Buffer | Key in the account's storage to get the value for. Must be 32 bytes long.  |
`cb` | any | - |

**Returns:** *void*

___

###  getStateRoot

▸ **getStateRoot**(`cb`: any): *void*

*Defined in [state/stateManager.ts:415](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L415)*

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any |   |

**Returns:** *void*

___

###  hasGenesisState

▸ **hasGenesisState**(`cb`: any): *void*

*Defined in [state/stateManager.ts:508](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L508)*

Checks whether the current instance has the canonical genesis state
for the configured chain parameters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any |   |

**Returns:** *void*

___

###  putAccount

▸ **putAccount**(`address`: Buffer, `account`: Account, `cb`: any): *void*

*Defined in [state/stateManager.ts:101](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L101)*

Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
into state under the provided `address`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address under which to store `account` |
`account` | Account | The [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) to store |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  putContractCode

▸ **putContractCode**(`address`: Buffer, `value`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:129](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L129)*

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address of the `account` to add the `code` for |
`value` | Buffer | The value of the `code` |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Buffer, `key`: Buffer, `value`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:303](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L303)*

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | Buffer | Address to set a storage value for |
`key` | Buffer | Key to set the value at. Must be 32 bytes long. |
`value` | Buffer | Value to set at `key` for account corresponding to `address` |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  revert

▸ **revert**(`cb`: any): *void*

*Defined in [state/stateManager.ts:377](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L377)*

Reverts the current change-set to the instance since the
last call to checkpoint.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer, `cb`: any): *void*

*Defined in [state/stateManager.ts:437](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L437)*

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stateRoot` | Buffer | The state-root to reset the instance to |
`cb` | any | Callback function  |

**Returns:** *void*

___

###  touchAccount

▸ **touchAccount**(`address`: Buffer): *void*

*Defined in [state/stateManager.ts:118](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/stateManager.ts#L118)*

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
