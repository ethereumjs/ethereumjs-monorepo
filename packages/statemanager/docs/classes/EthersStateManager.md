[@ethereumjs/statemanager](../README.md) / EthersStateManager

# Class: EthersStateManager

Abstract BaseStateManager class for the non-storage-backend
related functionality parts of a StateManager like keeping
track of accessed storage (`EIP-2929`) or touched accounts
(`EIP-158`).

This is not a full StateManager implementation in itself but
can be used to ease implementing an own StateManager.

Note that the implementation is pretty new (October 2021)
and we cannot guarantee a stable interface yet.

## Hierarchy

- [`BaseStateManager`](BaseStateManager.md)

  ↳ **`EthersStateManager`**

## Implements

- [`StateManager`](../interfaces/StateManager.md)

## Table of contents

### Constructors

- [constructor](EthersStateManager.md#constructor)

### Properties

- [\_cache](EthersStateManager.md#_cache)
- [\_debug](EthersStateManager.md#_debug)

### Methods

- [accountExists](EthersStateManager.md#accountexists)
- [accountIsEmpty](EthersStateManager.md#accountisempty)
- [checkpoint](EthersStateManager.md#checkpoint)
- [clearCache](EthersStateManager.md#clearcache)
- [clearContractStorage](EthersStateManager.md#clearcontractstorage)
- [commit](EthersStateManager.md#commit)
- [copy](EthersStateManager.md#copy)
- [deleteAccount](EthersStateManager.md#deleteaccount)
- [dumpStorage](EthersStateManager.md#dumpstorage)
- [flush](EthersStateManager.md#flush)
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

## Constructors

### constructor

• **new EthersStateManager**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EthersStateManagerOpts`](../interfaces/EthersStateManagerOpts.md) |

#### Overrides

[BaseStateManager](BaseStateManager.md).[constructor](BaseStateManager.md#constructor)

#### Defined in

[ethersStateManager.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L37)

## Properties

### \_cache

• **\_cache**: `Cache`

#### Overrides

[BaseStateManager](BaseStateManager.md).[_cache](BaseStateManager.md#_cache)

#### Defined in

[ethersStateManager.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L35)

___

### \_debug

• **\_debug**: `Debugger`

#### Inherited from

[BaseStateManager](BaseStateManager.md).[_debug](BaseStateManager.md#_debug)

#### Defined in

[baseStateManager.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L22)

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

#### Implementation of

[StateManager](../interfaces/StateManager.md).[accountExists](../interfaces/StateManager.md#accountexists)

#### Defined in

[ethersStateManager.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L203)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[accountIsEmpty](../interfaces/StateManager.md#accountisempty)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[accountIsEmpty](BaseStateManager.md#accountisempty)

#### Defined in

[baseStateManager.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L97)

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

[StateManager](../interfaces/StateManager.md).[checkpoint](../interfaces/StateManager.md#checkpoint)

#### Overrides

[BaseStateManager](BaseStateManager.md).[checkpoint](BaseStateManager.md#checkpoint)

#### Defined in

[ethersStateManager.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L287)

___

### clearCache

▸ **clearCache**(): `void`

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Defined in

[ethersStateManager.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L89)

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

[StateManager](../interfaces/StateManager.md).[clearContractStorage](../interfaces/StateManager.md#clearcontractstorage)

#### Defined in

[ethersStateManager.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L177)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[commit](../interfaces/StateManager.md#commit)

#### Overrides

[BaseStateManager](BaseStateManager.md).[commit](BaseStateManager.md#commit)

#### Defined in

[ethersStateManager.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L297)

___

### copy

▸ **copy**(): [`EthersStateManager`](EthersStateManager.md)

#### Returns

[`EthersStateManager`](EthersStateManager.md)

#### Implementation of

[StateManager](../interfaces/StateManager.md).[copy](../interfaces/StateManager.md#copy)

#### Defined in

[ethersStateManager.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L64)

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

[StateManager](../interfaces/StateManager.md).[deleteAccount](../interfaces/StateManager.md#deleteaccount)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[deleteAccount](BaseStateManager.md#deleteaccount)

#### Defined in

[baseStateManager.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L90)

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

[StateManager](../interfaces/StateManager.md).[dumpStorage](../interfaces/StateManager.md#dumpstorage)

#### Defined in

[ethersStateManager.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L188)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[flush](../interfaces/StateManager.md#flush)

#### Overrides

[BaseStateManager](BaseStateManager.md).[flush](BaseStateManager.md#flush)

#### Defined in

[ethersStateManager.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L313)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`Account`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `code` for |

#### Returns

`Promise`<`Account`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getAccount](../interfaces/StateManager.md#getaccount)

#### Overrides

[BaseStateManager](BaseStateManager.md).[getAccount](BaseStateManager.md#getaccount)

#### Defined in

[ethersStateManager.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L229)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Buffer`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to get the `code` for |

#### Returns

`Promise`<`Buffer`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getContractCode](../interfaces/StateManager.md#getcontractcode)

#### Defined in

[ethersStateManager.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L101)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to get the storage for |
| `key` | `Buffer` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`<`Buffer`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Buffer` is returned.

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getContractStorage](../interfaces/StateManager.md#getcontractstorage)

#### Overrides

[BaseStateManager](BaseStateManager.md).[getContractStorage](BaseStateManager.md#getcontractstorage)

#### Defined in

[ethersStateManager.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L130)

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`<[`Proof`](../README.md#proof)\>

Get an EIP-1186 proof from the provider

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | address to get proof of |
| `storageSlots` | `Buffer`[] | `[]` | storage slots to get proof of |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

an EIP-1186 formatted proof

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getProof](../interfaces/StateManager.md#getproof)

#### Defined in

[ethersStateManager.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L270)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Returns

`Promise`<`Buffer`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getStateRoot](../interfaces/StateManager.md#getstateroot)

#### Defined in

[ethersStateManager.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L320)

___

### hasStateRoot

▸ **hasStateRoot**(): `never`

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Returns

`never`

#### Implementation of

[StateManager](../interfaces/StateManager.md).[hasStateRoot](../interfaces/StateManager.md#hasstateroot)

#### Defined in

[ethersStateManager.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L332)

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

[StateManager](../interfaces/StateManager.md).[modifyAccountFields](../interfaces/StateManager.md#modifyaccountfields)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[modifyAccountFields](BaseStateManager.md#modifyaccountfields)

#### Defined in

[baseStateManager.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L77)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address under which to store `account` |
| `account` | `Account` | The account to store |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[putAccount](../interfaces/StateManager.md#putaccount)

#### Overrides

[BaseStateManager](BaseStateManager.md).[putAccount](BaseStateManager.md#putaccount)

#### Defined in

[ethersStateManager.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L260)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to add the `code` for |
| `value` | `Buffer` | The value of the `code` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[putContractCode](../interfaces/StateManager.md#putcontractcode)

#### Overrides

[BaseStateManager](BaseStateManager.md).[putContractCode](BaseStateManager.md#putcontractcode)

#### Defined in

[ethersStateManager.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L116)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to set a storage value for |
| `key` | `Buffer` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Buffer` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is empty or filled with zeros, deletes the value. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[putContractStorage](../interfaces/StateManager.md#putcontractstorage)

#### Overrides

[BaseStateManager](BaseStateManager.md).[putContractStorage](BaseStateManager.md#putcontractstorage)

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

[StateManager](../interfaces/StateManager.md).[revert](../interfaces/StateManager.md#revert)

#### Overrides

[BaseStateManager](BaseStateManager.md).[revert](BaseStateManager.md#revert)

#### Defined in

[ethersStateManager.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L308)

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

[ethersStateManager.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L80)

___

### setStateRoot

▸ **setStateRoot**(`_root`): `Promise`<`void`\>

**`Deprecated`**

This method is not used by the Ethers State Manager and is a stub required by the State Manager interface

#### Parameters

| Name | Type |
| :------ | :------ |
| `_root` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[setStateRoot](../interfaces/StateManager.md#setstateroot)

#### Defined in

[ethersStateManager.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/ethersStateManager.ts#L327)
