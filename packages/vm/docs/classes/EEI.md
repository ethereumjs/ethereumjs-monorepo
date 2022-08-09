[@ethereumjs/vm](../README.md) / EEI

# Class: EEI

External interface made available to EVM bytecode. Modeled after
the ewasm EEI [spec](https://github.com/ewasm/design/blob/master/eth_interface.md).
It includes methods for accessing/modifying state, calling or creating contracts, access
to environment data among other things.
The EEI instance also keeps artifacts produced by the bytecode such as logs
and to-be-selfdestructed addresses.

## Hierarchy

- `VmState`

  ↳ **`EEI`**

## Implements

- `EEIInterface`

## Table of contents

### Constructors

- [constructor](EEI.md#constructor)

### Methods

- [\_clearOriginalStorageCache](EEI.md#_clearoriginalstoragecache)
- [accountExists](EEI.md#accountexists)
- [accountIsEmpty](EEI.md#accountisempty)
- [addWarmedAddress](EEI.md#addwarmedaddress)
- [addWarmedStorage](EEI.md#addwarmedstorage)
- [checkpoint](EEI.md#checkpoint)
- [cleanupTouchedAccounts](EEI.md#cleanuptouchedaccounts)
- [clearContractStorage](EEI.md#clearcontractstorage)
- [clearOriginalStorageCache](EEI.md#clearoriginalstoragecache)
- [clearWarmedAccounts](EEI.md#clearwarmedaccounts)
- [commit](EEI.md#commit)
- [copy](EEI.md#copy)
- [deleteAccount](EEI.md#deleteaccount)
- [generateAccessList](EEI.md#generateaccesslist)
- [generateCanonicalGenesis](EEI.md#generatecanonicalgenesis)
- [getAccount](EEI.md#getaccount)
- [getBlockHash](EEI.md#getblockhash)
- [getContractCode](EEI.md#getcontractcode)
- [getContractStorage](EEI.md#getcontractstorage)
- [getExternalBalance](EEI.md#getexternalbalance)
- [getExternalCode](EEI.md#getexternalcode)
- [getExternalCodeSize](EEI.md#getexternalcodesize)
- [getStateRoot](EEI.md#getstateroot)
- [hasStateRoot](EEI.md#hasstateroot)
- [isWarmedAddress](EEI.md#iswarmedaddress)
- [isWarmedStorage](EEI.md#iswarmedstorage)
- [modifyAccountFields](EEI.md#modifyaccountfields)
- [putAccount](EEI.md#putaccount)
- [putContractCode](EEI.md#putcontractcode)
- [putContractStorage](EEI.md#putcontractstorage)
- [revert](EEI.md#revert)
- [setStateRoot](EEI.md#setstateroot)
- [storageLoad](EEI.md#storageload)
- [storageStore](EEI.md#storagestore)

## Constructors

### constructor

• **new EEI**(`stateManager`, `common`, `blockchain`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `StateManager` |
| `common` | `Common` |
| `blockchain` | `Blockchain` |

#### Overrides

VmState.constructor

#### Defined in

[packages/vm/src/eei/eei.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L29)

## Methods

### \_clearOriginalStorageCache

▸ **_clearOriginalStorageCache**(): `void`

Clears the original storage cache. Refer to StateManager.getOriginalContractStorage
for more explanation.

#### Returns

`void`

#### Inherited from

VmState.\_clearOriginalStorageCache

#### Defined in

[packages/vm/src/eei/vmState.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L328)

___

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EEIInterface.accountExists

#### Inherited from

VmState.accountExists

#### Defined in

[packages/vm/src/eei/vmState.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L178)

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

EEIInterface.accountIsEmpty

#### Inherited from

VmState.accountIsEmpty

#### Defined in

[packages/vm/src/eei/vmState.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L475)

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

#### Implementation of

EEIInterface.addWarmedAddress

#### Inherited from

VmState.addWarmedAddress

#### Defined in

[packages/vm/src/eei/vmState.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L362)

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

#### Implementation of

EEIInterface.addWarmedStorage

#### Inherited from

VmState.addWarmedStorage

#### Defined in

[packages/vm/src/eei/vmState.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L395)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

Partial implementation, called from the subclass.

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.checkpoint

#### Inherited from

VmState.checkpoint

#### Defined in

[packages/vm/src/eei/vmState.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L63)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

Removes accounts form the state trie that have been touched,
as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.cleanupTouchedAccounts

#### Inherited from

VmState.cleanupTouchedAccounts

#### Defined in

[packages/vm/src/eei/vmState.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L274)

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.clearContractStorage

#### Inherited from

VmState.clearContractStorage

#### Defined in

[packages/vm/src/eei/vmState.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L173)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

Clears the original storage cache. Refer to StateManager.getOriginalContractStorage
for more explanation. Alias of the internal StateManager._clearOriginalStorageCache

#### Returns

`void`

#### Implementation of

EEIInterface.clearOriginalStorageCache

#### Inherited from

VmState.clearOriginalStorageCache

#### Defined in

[packages/vm/src/eei/vmState.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L336)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): `void`

Clear the warm accounts and storage. To be called after a transaction finished.

#### Returns

`void`

#### Implementation of

EEIInterface.clearWarmedAccounts

#### Inherited from

VmState.clearWarmedAccounts

#### Defined in

[packages/vm/src/eei/vmState.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L408)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.commit

#### Inherited from

VmState.commit

#### Defined in

[packages/vm/src/eei/vmState.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L75)

___

### copy

▸ **copy**(): [`EEI`](EEI.md)

#### Returns

[`EEI`](EEI.md)

#### Implementation of

EEIInterface.copy

#### Defined in

[packages/vm/src/eei/eei.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L94)

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

EEIInterface.deleteAccount

#### Inherited from

VmState.deleteAccount

#### Defined in

[packages/vm/src/eei/vmState.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L151)

___

### generateAccessList

▸ **generateAccessList**(`addressesRemoved?`, `addressesOnlyStorage?`): `AccessList`

Generates an EIP-2930 access list

Note: this method is not yet part of the StateManager interface.
If not implemented, [runTx](VM.md#runtx) is not allowed to be used with the
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

#### Implementation of

EEIInterface.generateAccessList

#### Inherited from

VmState.generateAccessList

#### Defined in

[packages/vm/src/eei/vmState.ts:430](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L430)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`initState`): `Promise`<`void`\>

Initializes the provided genesis state into the state trie.
Will error if there are uncommitted checkpoints on the instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initState` | `any` | address -> balance \| [balance, code, storage] |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.generateCanonicalGenesis

#### Inherited from

VmState.generateCanonicalGenesis

#### Defined in

[packages/vm/src/eei/vmState.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L237)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Account`\>

#### Implementation of

EEIInterface.getAccount

#### Inherited from

VmState.getAccount

#### Defined in

[packages/vm/src/eei/vmState.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L134)

___

### getBlockHash

▸ **getBlockHash**(`num`): `Promise`<`bigint`\>

Returns Gets the hash of one of the 256 most recent complete blocks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | `bigint` | Number of block |

#### Returns

`Promise`<`bigint`\>

#### Implementation of

EEIInterface.getBlockHash

#### Defined in

[packages/vm/src/eei/eei.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L65)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

EEIInterface.getContractCode

#### Inherited from

VmState.getContractCode

#### Defined in

[packages/vm/src/eei/vmState.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L156)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

EEIInterface.getContractStorage

#### Inherited from

VmState.getContractStorage

#### Defined in

[packages/vm/src/eei/vmState.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L164)

___

### getExternalBalance

▸ **getExternalBalance**(`address`): `Promise`<`bigint`\>

Returns balance of the given account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[packages/vm/src/eei/eei.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L39)

___

### getExternalCode

▸ **getExternalCode**(`address`): `Promise`<`Buffer`\>

Returns code of an account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[packages/vm/src/eei/eei.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L57)

___

### getExternalCodeSize

▸ **getExternalCodeSize**(`address`): `Promise`<`bigint`\>

Get size of an account’s code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[packages/vm/src/eei/eei.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L48)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

EEIInterface.getStateRoot

#### Inherited from

VmState.getStateRoot

#### Defined in

[packages/vm/src/eei/vmState.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L189)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EEIInterface.hasStateRoot

#### Inherited from

VmState.hasStateRoot

#### Defined in

[packages/vm/src/eei/vmState.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L193)

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

#### Implementation of

EEIInterface.isWarmedAddress

#### Inherited from

VmState.isWarmedAddress

#### Defined in

[packages/vm/src/eei/vmState.ts:348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L348)

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

#### Implementation of

EEIInterface.isWarmedStorage

#### Inherited from

VmState.isWarmedStorage

#### Defined in

[packages/vm/src/eei/vmState.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L376)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"stateRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.modifyAccountFields

#### Inherited from

VmState.modifyAccountFields

#### Defined in

[packages/vm/src/eei/vmState.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L143)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `account` | `Account` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.putAccount

#### Inherited from

VmState.putAccount

#### Defined in

[packages/vm/src/eei/vmState.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L138)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.putContractCode

#### Inherited from

VmState.putContractCode

#### Defined in

[packages/vm/src/eei/vmState.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L160)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.putContractStorage

#### Inherited from

VmState.putContractStorage

#### Defined in

[packages/vm/src/eei/vmState.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L168)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

Partial implementation , called from the subclass.

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.revert

#### Inherited from

VmState.revert

#### Defined in

[packages/vm/src/eei/vmState.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L102)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.setStateRoot

#### Inherited from

VmState.setStateRoot

#### Defined in

[packages/vm/src/eei/vmState.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/vmState.ts#L182)

___

### storageLoad

▸ **storageLoad**(`address`, `key`, `original?`): `Promise`<`Buffer`\>

Loads a 256-bit value to memory from persistent storage.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | Address to get storage key value from |
| `key` | `Buffer` | `undefined` | Storage key |
| `original` | `boolean` | `false` | If true, return the original storage value (default: false) |

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

EEIInterface.storageLoad

#### Defined in

[packages/vm/src/eei/eei.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L86)

___

### storageStore

▸ **storageStore**(`address`, `key`, `value`): `Promise`<`void`\>

Storage 256-bit value into storage of an address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to store into |
| `key` | `Buffer` | Storage key |
| `value` | `Buffer` | Storage value |

#### Returns

`Promise`<`void`\>

#### Implementation of

EEIInterface.storageStore

#### Defined in

[packages/vm/src/eei/eei.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/eei/eei.ts#L76)
