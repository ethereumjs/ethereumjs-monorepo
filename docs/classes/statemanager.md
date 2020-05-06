[ethereumjs-vm](../README.md) > [StateManager](../classes/statemanager.md)

# Class: StateManager

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
* [touchAccount](statemanager.md#touchaccount)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StateManager**(opts?: *[StateManagerOpts](../interfaces/statemanageropts.md)*): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L46)*

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

*Defined in [state/stateManager.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L42)*

___
<a id="_checkpointcount"></a>

###  _checkpointCount

**● _checkpointCount**: *`number`*

*Defined in [state/stateManager.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L45)*

___
<a id="_common"></a>

###  _common

**● _common**: *`Common`*

*Defined in [state/stateManager.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L39)*

___
<a id="_originalstoragecache"></a>

###  _originalStorageCache

**● _originalStorageCache**: *`Map`<`string`, `Map`<`string`, `Buffer`>>*

*Defined in [state/stateManager.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L46)*

___
<a id="_storagetries"></a>

###  _storageTries

**● _storageTries**: *`any`*

*Defined in [state/stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L41)*

___
<a id="_touched"></a>

###  _touched

**● _touched**: *`Set`<`string`>*

*Defined in [state/stateManager.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L43)*

___
<a id="_touchedstack"></a>

###  _touchedStack

**● _touchedStack**: *`Set`<`string`>[]*

*Defined in [state/stateManager.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L44)*

___
<a id="_trie"></a>

###  _trie

**● _trie**: *`any`*

*Defined in [state/stateManager.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L40)*

___

## Methods

<a id="_getstoragetrie"></a>

### `<Private>` _getStorageTrie

▸ **_getStorageTrie**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:189](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L189)*

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

*Defined in [state/stateManager.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L171)*

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

*Defined in [state/stateManager.ts:276](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L276)*

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

*Defined in [state/stateManager.ts:573](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L573)*

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

*Defined in [state/stateManager.ts:346](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L346)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="cleanuptouchedaccounts"></a>

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:594](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L594)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="clearcontractstorage"></a>

###  clearContractStorage

▸ **clearContractStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:329](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L329)*

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

*Defined in [state/stateManager.ts:359](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L359)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="copy"></a>

###  copy

▸ **copy**(): [StateManager](statemanager.md)

*Defined in [state/stateManager.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L72)*

**Returns:** [StateManager](statemanager.md)

___
<a id="dumpstorage"></a>

###  dumpStorage

▸ **dumpStorage**(address: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:479](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L479)*

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

*Defined in [state/stateManager.ts:519](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L519)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="generategenesis"></a>

###  generateGenesis

▸ **generateGenesis**(initState: *`any`*, cb: *`any`*): `any`

*Defined in [state/stateManager.ts:538](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L538)*

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

*Defined in [state/stateManager.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L90)*

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

*Defined in [state/stateManager.ts:157](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L157)*

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

*Defined in [state/stateManager.ts:215](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L215)*

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

*Defined in [state/stateManager.ts:242](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L242)*

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

*Defined in [state/stateManager.ts:415](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L415)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="hasgenesisstate"></a>

###  hasGenesisState

▸ **hasGenesisState**(cb: *`any`*): `void`

*Defined in [state/stateManager.ts:508](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L508)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |   |

**Returns:** `void`

___
<a id="putaccount"></a>

###  putAccount

▸ **putAccount**(address: *`Buffer`*, account: *`Account`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:101](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L101)*

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

*Defined in [state/stateManager.ts:129](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L129)*

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

*Defined in [state/stateManager.ts:303](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L303)*

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

*Defined in [state/stateManager.ts:377](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L377)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="setstateroot"></a>

###  setStateRoot

▸ **setStateRoot**(stateRoot: *`Buffer`*, cb: *`any`*): `void`

*Defined in [state/stateManager.ts:437](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L437)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| stateRoot | `Buffer` |  The state-root to reset the instance to |
| cb | `any` |  Callback function |

**Returns:** `void`

___
<a id="touchaccount"></a>

###  touchAccount

▸ **touchAccount**(address: *`Buffer`*): `void`

*Defined in [state/stateManager.ts:118](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/state/stateManager.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `Buffer` |

**Returns:** `void`

___

