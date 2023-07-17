[@ethereumjs/statemanager](../README.md) / EthersStateManager

# Class: EthersStateManager

## Implements

- `EVMStateManagerInterface`

## Table of contents

### Constructors

- [constructor](EthersStateManager.md#constructor)

### Properties

- [originalStorageCache](EthersStateManager.md#originalstoragecache)

### Methods

- [accountExists](EthersStateManager.md#accountexists)
- [checkpoint](EthersStateManager.md#checkpoint)
- [clearCaches](EthersStateManager.md#clearcaches)
- [clearContractStorage](EthersStateManager.md#clearcontractstorage)
- [commit](EthersStateManager.md#commit)
- [deleteAccount](EthersStateManager.md#deleteaccount)
- [dumpStorage](EthersStateManager.md#dumpstorage)
- [flush](EthersStateManager.md#flush)
- [generateCanonicalGenesis](EthersStateManager.md#generatecanonicalgenesis)
- [getAccount](EthersStateManager.md#getaccount)
- [getContractCode](EthersStateManager.md#getcontractcode)
- [getContractStorage](EthersStateManager.md#getcontractstorage)
- [getProof](EthersStateManager.md#getproof)
- [getStateRoot](EthersStateManager.md#getstateroot)
- [hasStateRoot](EthersStateManager.md#hasstateroot)
- [modifyAccountFields](EthersStateManager.md#modifyaccountfields)
- [putAccount](EthersStateManager.md#putaccount)
- [putContractCode](EthersStateManager.md#putcontractcode)
- [putContractStorage](EthersStateManager.md#putcontractstorage)
- [revert](EthersStateManager.md#revert)
- [setBlockTag](EthersStateManager.md#setblocktag)
- [setStateRoot](EthersStateManager.md#setstateroot)
- [shallowCopy](EthersStateManager.md#shallowcopy)

## Constructors

### constructor

• **new EthersStateManager**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EthersStateManagerOpts`](../interfaces/EthersStateManagerOpts.md) |

#### Defined in

[ethersStateManager.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L30)

## Properties

### originalStorageCache

• **originalStorageCache**: `OriginalStorageCache`

#### Implementation of

EVMStateManagerInterface.originalStorageCache

#### Defined in

[ethersStateManager.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L27)

## Methods

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

Checks if an `account` exists at `address`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to check |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[ethersStateManager.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L198)

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

EVMStateManagerInterface.checkpoint

#### Defined in

[ethersStateManager.ts:348](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L348)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Defined in

[ethersStateManager.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L91)

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`<`void`\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to clear the storage of |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.clearContractStorage

#### Defined in

[ethersStateManager.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L172)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.commit

#### Defined in

[ethersStateManager.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L359)

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account which should be deleted |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.deleteAccount

#### Defined in

[ethersStateManager.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L317)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address of the `account` to return storage for |

#### Returns

`Promise`<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

#### Implementation of

EVMStateManagerInterface.dumpStorage

#### Defined in

[ethersStateManager.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L183)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[ethersStateManager.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L376)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`_initState`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_initState` | `any` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.generateCanonicalGenesis

#### Defined in

[ethersStateManager.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L399)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`undefined` \| `Account`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `account` for |

#### Returns

`Promise`<`undefined` \| `Account`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

EVMStateManagerInterface.getAccount

#### Defined in

[ethersStateManager.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L224)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `code` for |

#### Returns

`Promise`<`Uint8Array`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

EVMStateManagerInterface.getContractCode

#### Defined in

[ethersStateManager.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L103)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to get the storage for |
| `key` | `Uint8Array` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

EVMStateManagerInterface.getContractStorage

#### Defined in

[ethersStateManager.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L132)

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`<[`Proof`](../README.md#proof)\>

Get an EIP-1186 proof from the provider

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | address to get proof of |
| `storageSlots` | `Uint8Array`[] | `[]` | storage slots to get proof of |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

an EIP-1186 formatted proof

#### Implementation of

EVMStateManagerInterface.getProof

#### Defined in

[ethersStateManager.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L330)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Returns

`Promise`<`Uint8Array`\>

#### Implementation of

EVMStateManagerInterface.getStateRoot

#### Defined in

[ethersStateManager.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L383)

___

### hasStateRoot

▸ **hasStateRoot**(): `never`

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Returns

`never`

#### Implementation of

EVMStateManagerInterface.hasStateRoot

#### Defined in

[ethersStateManager.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L395)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to modify |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> | Object containing account fields and values to modify |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.modifyAccountFields

#### Defined in

[ethersStateManager.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L288)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address under which to store `account` |
| `account` | `undefined` \| `Account` | The account to store |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putAccount

#### Defined in

[ethersStateManager.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L264)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to add the `code` for |
| `value` | `Uint8Array` | The value of the `code` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putContractCode

#### Defined in

[ethersStateManager.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L118)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to set a storage value for |
| `key` | `Uint8Array` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Uint8Array` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is empty or filled with zeros, deletes the value. |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.putContractStorage

#### Defined in

[ethersStateManager.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L164)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

Partial implementation , called from the subclass.

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.revert

#### Defined in

[ethersStateManager.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L370)

___

### setBlockTag

▸ **setBlockTag**(`blockTag`): `void`

Sets the new block tag used when querying the provider and clears the
internal cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag` | `bigint` \| ``"earliest"`` | the new block tag to use when querying the provider |

#### Returns

`void`

#### Defined in

[ethersStateManager.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L81)

___

### setStateRoot

▸ **setStateRoot**(`_root`): `Promise`<`void`\>

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Parameters

| Name | Type |
| :------ | :------ |
| `_root` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.setStateRoot

#### Defined in

[ethersStateManager.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L390)

___

### shallowCopy

▸ **shallowCopy**(): [`EthersStateManager`](EthersStateManager.md)

Note that the returned statemanager will share the same JsonRpcProvider as the original

#### Returns

[`EthersStateManager`](EthersStateManager.md)

EthersStateManager

#### Implementation of

EVMStateManagerInterface.shallowCopy

#### Defined in

[ethersStateManager.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L59)
