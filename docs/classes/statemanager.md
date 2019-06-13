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
* [getAccount](statemanager.md#getaccount)
* [getContractCode](statemanager.md#getcontractcode)
* [getContractStorage](statemanager.md#getcontractstorage)
* [getOriginalContractStorage](statemanager.md#getoriginalcontractstorage)
* [getStateRoot](statemanager.md#getstateroot)
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

*Defined in [state/stateManager.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L29)*

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

*Defined in [state/stateManager.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L25)*

___
<a id="_checkpointcount"></a>

###  _checkpointCount

**● _checkpointCount**: *`number`*

*Defined in [state/stateManager.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L28)*

___
<a id="_originalstoragecache"></a>

###  _originalStorageCache

**● _originalStorageCache**: *`Map`<`string`, `Map`<`string`, `Buffer`>>*

*Defined in [state/stateManager.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L29)*

___
<a id="_storagetries"></a>

###  _storageTries

**● _storageTries**: *`any`*

*Defined in [state/stateManager.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L24)*

___
<a id="_touched"></a>

###  _touched

**● _touched**: *`Set`<`string`>*

*Defined in [state/stateManager.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L26)*

___
<a id="_touchedstack"></a>

###  _touchedStack

**● _touchedStack**: *`Set`<`string`>[]*

*Defined in [state/stateManager.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L27)*

___
<a id="_trie"></a>

###  _trie

**● _trie**: *`any`*

*Defined in [state/stateManager.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L23)*

___

## Methods

<a id="_getstoragetrie"></a>

### `<Private>` _getStorageTrie

▸ **_getStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:175](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L175)*

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

*Defined in [state/stateManager.ts:153](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L153)*

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

*Defined in [state/stateManager.ts:257](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L257)*

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

*Defined in [state/stateManager.ts:496](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L496)*

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

*Defined in [state/stateManager.ts:329](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L329)*

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

*Defined in [state/stateManager.ts:519](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L519)*

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

*Defined in [state/stateManager.ts:310](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L310)*

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

*Defined in [state/stateManager.ts:344](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L344)*

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

*Defined in [state/stateManager.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L53)*

Copies the current instance of the `DefaultStateManager` at the last fully committed point, i.e. as if all current checkpoints were reverted

*__memberof__*: DefaultStateManager

*__method__*: copy

**Returns:** [StateManager](statemanager.md)

___
<a id="dumpstorage"></a>

###  dumpStorage

▸ **dumpStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:465](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L465)*

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
<a id="getaccount"></a>

###  getAccount

▸ **getAccount**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L73)*

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

*Defined in [state/stateManager.ts:135](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L135)*

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

*Defined in [state/stateManager.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L202)*

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

*Defined in [state/stateManager.ts:225](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L225)*

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

*Defined in [state/stateManager.ts:397](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L397)*

Gets the state-root of the Merkle-Patricia trie representation of the state of this StateManager. Will error if there are uncommitted checkpoints on the instance.

*__memberof__*: StateManager

*__method__*: getStateRoot

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="putaccount"></a>

###  putAccount

▸ **putAccount**(address: *`Buffer`*, account: *`Account`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:86](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L86)*

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

*Defined in [state/stateManager.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L105)*

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

*Defined in [state/stateManager.ts:286](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L286)*

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

*Defined in [state/stateManager.ts:364](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L364)*

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

*Defined in [state/stateManager.ts:421](https://github.com/ethereumjs/ethereumjs-vm/blob/eab4a99/lib/state/stateManager.ts#L421)*

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

