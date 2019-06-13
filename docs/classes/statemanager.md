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

⊕ **new StateManager**(opts?: *`any`*): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L31)*

Instantiate the StateManager interface.

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` opts | `any` |  {} |

**Returns:** [StateManager](statemanager.md)

___

## Properties

<a id="_cache"></a>

###  _cache

**● _cache**: *`Cache`*

*Defined in [state/stateManager.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L27)*

___
<a id="_checkpointcount"></a>

###  _checkpointCount

**● _checkpointCount**: *`number`*

*Defined in [state/stateManager.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L30)*

___
<a id="_common"></a>

###  _common

**● _common**: *`Common`*

*Defined in [state/stateManager.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L24)*

___
<a id="_originalstoragecache"></a>

###  _originalStorageCache

**● _originalStorageCache**: *`Map`<`string`, `Map`<`string`, `Buffer`>>*

*Defined in [state/stateManager.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L31)*

___
<a id="_storagetries"></a>

###  _storageTries

**● _storageTries**: *`any`*

*Defined in [state/stateManager.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L26)*

___
<a id="_touched"></a>

###  _touched

**● _touched**: *`Set`<`string`>*

*Defined in [state/stateManager.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L28)*

___
<a id="_touchedstack"></a>

###  _touchedStack

**● _touchedStack**: *`Set`<`string`>[]*

*Defined in [state/stateManager.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L29)*

___
<a id="_trie"></a>

###  _trie

**● _trie**: *`any`*

*Defined in [state/stateManager.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L25)*

___

## Methods

<a id="_getstoragetrie"></a>

### `<Private>` _getStorageTrie

▸ **_getStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:184](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L184)*

Gets the storage trie for an account from the storage cache or does a lookup

*__memberof__*: DefaultStateManager

*__method__*: \_getStorageTrie

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  \- |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="_lookupstoragetrie"></a>

### `<Private>` _lookupStorageTrie

▸ **_lookupStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:162](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L162)*

Creates a storage trie from the primary storage trie for an account and saves this in the storage cache.

*__memberof__*: DefaultStateManager

*__method__*: \_lookupStorageTrie

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  \- |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="_modifycontractstorage"></a>

### `<Private>` _modifyContractStorage

▸ **_modifyContractStorage**(address: *`Buffer`*, modifyTrie: *`any`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:266](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L266)*

Modifies the storage trie of an account

*__memberof__*: DefaultStateManager

*__method__*: \_modifyContractStorage

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account whose storage is to be modified |
| modifyTrie | `any` |  function to modify the storage trie of the account |
| cb | `any` |

**Returns:** `void`

___
<a id="accountisempty"></a>

###  accountIsEmpty

▸ **accountIsEmpty**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:572](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L572)*

Checks if the `account` corresponding to `address` is empty as defined in EIP-161 ([https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md))

*__memberof__*: StateManager

*__method__*: accountIsEmpty

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

*Defined in [state/stateManager.ts:338](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L338)*

Checkpoints the current state of the StateManager instance. State changes that follow can then be committed by calling `commit` or `reverted` by calling rollback.

*__memberof__*: StateManager

*__method__*: checkpoint

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="cleanuptouchedaccounts"></a>

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:595](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L595)*

Removes accounts form the state trie that have been touched, as defined in EIP-161 ([https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)).

*__memberof__*: StateManager

*__method__*: cleanupTouchedAccounts

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="clearcontractstorage"></a>

###  clearContractStorage

▸ **clearContractStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:319](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L319)*

Clears all storage entries for the account corresponding to `address`

*__memberof__*: StateManager

*__method__*: clearContractStorage

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

*Defined in [state/stateManager.ts:353](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L353)*

Commits the current change-set to the instance since the last call to checkpoint.

*__memberof__*: StateManager

*__method__*: commit

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="copy"></a>

###  copy

▸ **copy**(): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L62)*

Copies the current instance of the `DefaultStateManager` at the last fully committed point, i.e. as if all current checkpoints were reverted

*__memberof__*: DefaultStateManager

*__method__*: copy

**Returns:** [StateManager](statemanager.md)

___
<a id="dumpstorage"></a>

###  dumpStorage

▸ **dumpStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:474](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L474)*

Dumps the the storage values for an `account` specified by `address`

*__memberof__*: DefaultStateManager

*__method__*: dumpStorage

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

*Defined in [state/stateManager.ts:518](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L518)*

Generates a canonical genesis state on the instance based on the configured chain parameters. Will error if there are uncommitted checkpoints on the instance.

*__memberof__*: StateManager

*__method__*: generateCanonicalGenesis

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="generategenesis"></a>

###  generateGenesis

▸ **generateGenesis**(initState: *`any`*, cb: *`any`*): `any`

*Defined in [state/stateManager.ts:539](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L539)*

Initializes the provided genesis state into the state trie

*__memberof__*: DefaultStateManager

*__method__*: generateGenesis

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| initState | `any` |  \- |
| cb | `any` |  Callback function |

**Returns:** `any`

___
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L82)*

Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) associated with `address`. Returns an empty account if the account does not exist.

*__memberof__*: StateManager

*__method__*: getAccount

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

*Defined in [state/stateManager.ts:144](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L144)*

Gets the code corresponding to the provided `address`

*__memberof__*: StateManager

*__method__*: getContractCode

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

*Defined in [state/stateManager.ts:211](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L211)*

Gets the storage value associated with the provided `address` and `key`

*__memberof__*: StateManager

*__method__*: getContractStorage

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account to get the storage for |
| key | `Buffer` |  Key in the account's storage to get the value for |
| cb | `any` |   |

**Returns:** `void`

___
<a id="getoriginalcontractstorage"></a>

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(address: *`Buffer`*, key: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:234](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L234)*

Caches the storage value associated with the provided `address` and `key` on first invocation, and returns the cached (original) value from then onwards. This is used to get the original value of a storage slot for computing gas costs according to EIP-1283.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address of the account to get the storage for |
| key | `Buffer` |  Key in the account's storage to get the value for |
| cb | `any` |

**Returns:** `void`

___
<a id="getstateroot"></a>

###  getStateRoot

▸ **getStateRoot**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:406](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L406)*

Gets the state-root of the Merkle-Patricia trie representation of the state of this StateManager. Will error if there are uncommitted checkpoints on the instance.

*__memberof__*: StateManager

*__method__*: getStateRoot

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="hasgenesisstate"></a>

###  hasGenesisState

▸ **hasGenesisState**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:505](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L505)*

Checks whether the current instance has the canonical genesis state for the configured chain parameters.

*__memberof__*: DefaultStateManager

*__method__*: hasGenesisState

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="putaccount"></a>

###  putAccount

▸ **putAccount**(address: *`Buffer`*, account: *`Account`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:95](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L95)*

Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) into state under the provided `address`

*__memberof__*: StateManager

*__method__*: putAccount

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

*Defined in [state/stateManager.ts:114](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L114)*

Adds `value` to the state trie as code, and sets `codeHash` on the account corresponding to `address` to reference this.

*__memberof__*: StateManager

*__method__*: putContractCode

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

*Defined in [state/stateManager.ts:295](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L295)*

Adds value to the state trie for the `account` corresponding to `address` at the provided `key`

*__memberof__*: StateManager

*__method__*: putContractStorage

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| address | `Buffer` |  Address to set a storage value for |
| key | `Buffer` |  Key to set the value at |
| value | `Buffer` |  Value to set at \`key\` for account corresponding to \`address\` |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="revert"></a>

###  revert

▸ **revert**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:373](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L373)*

Reverts the current change-set to the instance since the last call to checkpoint.

*__memberof__*: StateManager

*__method__*: revert

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="setstateroot"></a>

###  setStateRoot

▸ **setStateRoot**(stateRoot: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:430](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/state/stateManager.ts#L430)*

Sets the state of the instance to that represented by the provided `stateRoot`. Will error if there are uncommitted checkpoints on the instance or if the state root does not exist in the state trie.

*__memberof__*: StateManager

*__method__*: setStateRoot

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| stateRoot | `Buffer` |  The state-root to reset the instance to |
| cb | `any` |  Callback function |

**Returns:** `void`

___

