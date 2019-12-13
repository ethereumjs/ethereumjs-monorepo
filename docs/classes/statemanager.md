[ethereumjs-vm](../README.md) > [StateManager](../classes/statemanager.md)

# Class: StateManager

Interface for getting and setting data from an underlying state trie.

## Hierarchy

**StateManager**

## Index

### Constructors

* [constructor](statemanager.md#constructor)

### Properties

* [_cache](statemanager.md#_cache)
* [_checkpointCount](statemanager.md#_checkpointcount)
* [_common](statemanager.md#_common)
* [_originalStorageCache](statemanager.md#_originalstoragecache)
* [_storageTries](statemanager.md#_storagetries)
* [_touched](statemanager.md#_touched)
* [_touchedStack](statemanager.md#_touchedstack)
* [_trie](statemanager.md#_trie)

### Methods

* [_getStorageTrie](statemanager.md#_getstoragetrie)
* [_lookupStorageTrie](statemanager.md#_lookupstoragetrie)
* [_modifyContractStorage](statemanager.md#_modifycontractstorage)
* [accountIsEmpty](statemanager.md#accountisempty)
* [checkpoint](statemanager.md#checkpoint)
* [cleanupTouchedAccounts](statemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](statemanager.md#clearcontractstorage)
* [commit](statemanager.md#commit)
* [copy](statemanager.md#copy)
* [dumpStorage](statemanager.md#dumpstorage)
* [generateCanonicalGenesis](statemanager.md#generatecanonicalgenesis)
* [generateGenesis](statemanager.md#generategenesis)
* [getAccount](statemanager.md#getaccount)
* [getContractCode](statemanager.md#getcontractcode)
* [getContractStorage](statemanager.md#getcontractstorage)
* [getOriginalContractStorage](statemanager.md#getoriginalcontractstorage)
* [getStateRoot](statemanager.md#getstateroot)
* [hasGenesisState](statemanager.md#hasgenesisstate)
* [putAccount](statemanager.md#putaccount)
* [putContractCode](statemanager.md#putcontractcode)
* [putContractStorage](statemanager.md#putcontractstorage)
* [revert](statemanager.md#revert)
* [setStateRoot](statemanager.md#setstateroot)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StateManager**(opts?: *[StateManagerOpts](../interfaces/statemanageropts.md)*): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L45)*

Instantiate the StateManager interface.

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` opts | [StateManagerOpts](../interfaces/statemanageropts.md) |  {} |

**Returns:** [StateManager](statemanager.md)

___

## Properties

<a id="_cache"></a>

###  _cache

**● _cache**: *`Cache`*

*Defined in [state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L41)*

___
<a id="_checkpointcount"></a>

###  _checkpointCount

**● _checkpointCount**: *`number`*

*Defined in [state/stateManager.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L44)*

___
<a id="_common"></a>

###  _common

**● _common**: *`Common`*

*Defined in [state/stateManager.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L38)*

___
<a id="_originalstoragecache"></a>

###  _originalStorageCache

**● _originalStorageCache**: *`Map`<`string`, `Map`<`string`, `Buffer`>>*

*Defined in [state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L45)*

___
<a id="_storagetries"></a>

###  _storageTries

**● _storageTries**: *`any`*

*Defined in [state/stateManager.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L40)*

___
<a id="_touched"></a>

###  _touched

**● _touched**: *`Set`<`string`>*

*Defined in [state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L42)*

___
<a id="_touchedstack"></a>

###  _touchedStack

**● _touchedStack**: *`Set`<`string`>[]*

*Defined in [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L43)*

___
<a id="_trie"></a>

###  _trie

**● _trie**: *`any`*

*Defined in [state/stateManager.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L39)*

___

## Methods

<a id="_getstoragetrie"></a>

### `<Private>` _getStorageTrie

▸ **_getStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L177)*

Gets the storage trie for an account from the storage cache or does a lookup.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `Buffer` |
| cb | `any` |

**Returns:** `void`

___
<a id="_lookupstoragetrie"></a>

### `<Private>` _lookupStorageTrie

▸ **_lookupStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:159](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L159)*

Creates a storage trie from the primary storage trie for an account and saves this in the storage cache.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `Buffer` |
| cb | `any` |

**Returns:** `void`

___
<a id="_modifycontractstorage"></a>

### `<Private>` _modifyContractStorage

▸ **_modifyContractStorage**(address: *`Buffer`*, modifyTrie: *`any`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:264](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L264)*

Modifies the storage trie of an account

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account whose storage is to be modified |
| modifyTrie | `any` |  Function to modify the storage trie of the account |
| cb | `any` |

**Returns:** `void`

___
<a id="accountisempty"></a>

###  accountIsEmpty

▸ **accountIsEmpty**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:554](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L554)*

Checks if the `account` corresponding to `address` is empty as defined in [EIP-161](https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address to check |
| cb | `any` |   |

**Returns:** `void`

___
<a id="checkpoint"></a>

###  checkpoint

▸ **checkpoint**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:334](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L334)*

Checkpoints the current state of the StateManager instance. State changes that follow can then be committed by calling `commit` or `reverted` by calling rollback.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="cleanuptouchedaccounts"></a>

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:575](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L575)*

Removes accounts form the state trie that have been touched, as defined in [EIP-161](https://eips.ethereum.org/EIPS/eip-161).

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="clearcontractstorage"></a>

###  clearContractStorage

▸ **clearContractStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:317](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L317)*

Clears all storage entries for the account corresponding to `address`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address to clear the storage of |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="commit"></a>

###  commit

▸ **commit**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:347](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L347)*

Commits the current change-set to the instance since the last call to checkpoint.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="copy"></a>

###  copy

▸ **copy**(): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L71)*

Copies the current instance of the `StateManager` at the last fully committed point, i.e. as if all current checkpoints were reverted.

**Returns:** [StateManager](statemanager.md)

___
<a id="dumpstorage"></a>

###  dumpStorage

▸ **dumpStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:460](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L460)*

Dumps the the storage values for an `account` specified by `address`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  The address of the \`account\` to return storage for |
| cb | `any` |   |

**Returns:** `void`

___
<a id="generatecanonicalgenesis"></a>

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:500](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L500)*

Generates a canonical genesis state on the instance based on the configured chain parameters. Will error if there are uncommitted checkpoints on the instance.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="generategenesis"></a>

###  generateGenesis

▸ **generateGenesis**(initState: *`any`*, cb: *`any`*): `any`

*Defined in [state/stateManager.ts:519](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L519)*

Initializes the provided genesis state into the state trie

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| initState | `any` |  Object (address -> balance) |
| cb | `any` |  Callback function |

**Returns:** `any`

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L89)*

Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) associated with `address`. Returns an empty account if the account does not exist.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the \`account\` to get |
| cb | `any` |   |

**Returns:** `void`

___
<a id="getcontractcode"></a>

###  getContractCode

▸ **getContractCode**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:145](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L145)*

Gets the code corresponding to the provided `address`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address to get the \`code\` for |
| cb | `any` |   |

**Returns:** `void`

___
<a id="getcontractstorage"></a>

###  getContractStorage

▸ **getContractStorage**(address: *`Buffer`*, key: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:203](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L203)*

Gets the storage value associated with the provided `address` and `key`. This method returns the shortest representation of the stored value.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account to get the storage for |
| key | `Buffer` |  Key in the account's storage to get the value for. Must be 32 bytes long. |
| cb | `any` |

**Returns:** `void`

___
<a id="getoriginalcontractstorage"></a>

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(address: *`Buffer`*, key: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:230](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L230)*

Caches the storage value associated with the provided `address` and `key` on first invocation, and returns the cached (original) value from then onwards. This is used to get the original value of a storage slot for computing gas costs according to EIP-1283.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account to get the storage for |
| key | `Buffer` |  Key in the account's storage to get the value for. Must be 32 bytes long. |
| cb | `any` |

**Returns:** `void`

___
<a id="getstateroot"></a>

###  getStateRoot

▸ **getStateRoot**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:396](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L396)*

Gets the state-root of the Merkle-Patricia trie representation of the state of this StateManager. Will error if there are uncommitted checkpoints on the instance.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="hasgenesisstate"></a>

###  hasGenesisState

▸ **hasGenesisState**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:489](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L489)*

Checks whether the current instance has the canonical genesis state for the configured chain parameters.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="putaccount"></a>

###  putAccount

▸ **putAccount**(address: *`Buffer`*, account: *`Account`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L100)*

Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) into state under the provided `address`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address under which to store \`account\` |
| account | `Account` |  The [\`ethereumjs-account\`](https://github.com/ethereumjs/ethereumjs-account) to store |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="putcontractcode"></a>

###  putContractCode

▸ **putContractCode**(address: *`Buffer`*, value: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:117](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L117)*

Adds `value` to the state trie as code, and sets `codeHash` on the account corresponding to `address` to reference this.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the \`account\` to add the \`code\` for |
| value | `Buffer` |  The value of the \`code\` |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="putcontractstorage"></a>

###  putContractStorage

▸ **putContractStorage**(address: *`Buffer`*, key: *`Buffer`*, value: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:291](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L291)*

Adds value to the state trie for the `account` corresponding to `address` at the provided `key`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address to set a storage value for |
| key | `Buffer` |  Key to set the value at. Must be 32 bytes long. |
| value | `Buffer` |  Value to set at \`key\` for account corresponding to \`address\` |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="revert"></a>

###  revert

▸ **revert**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:365](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L365)*

Reverts the current change-set to the instance since the last call to checkpoint.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="setstateroot"></a>

###  setStateRoot

▸ **setStateRoot**(stateRoot: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:418](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/state/stateManager.ts#L418)*

Sets the state of the instance to that represented by the provided `stateRoot`. Will error if there are uncommitted checkpoints on the instance or if the state root does not exist in the state trie.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| stateRoot | `Buffer` |  The state-root to reset the instance to |
| cb | `any` |  Callback function |

**Returns:** `void`

___

