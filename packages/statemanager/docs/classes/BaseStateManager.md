[@ethereumjs/statemanager](../README.md) / BaseStateManager

# Class: BaseStateManager

Abstract BaseStateManager class for the non-storage-backend
related functionality parts of a StateManager like keeping
track of accessed storage (`EIP-2929`) or touched accounts
(`EIP-158`).

This is not a full StateManager implementation in itself but
can be used to ease implementing an own StateManager.

Note that the implementation is pretty new (October 2021)
and we cannot guarantee a stable interface yet.

## Hierarchy

- **`BaseStateManager`**

  ↳ [`DefaultStateManager`](DefaultStateManager.md)

## Table of contents

### Constructors

- [constructor](BaseStateManager.md#constructor)

### Properties

- [\_cache](BaseStateManager.md#_cache)
- [\_common](BaseStateManager.md#_common)
- [\_debug](BaseStateManager.md#_debug)

### Methods

- [accountIsEmpty](BaseStateManager.md#accountisempty)
- [checkpoint](BaseStateManager.md#checkpoint)
- [commit](BaseStateManager.md#commit)
- [deleteAccount](BaseStateManager.md#deleteaccount)
- [flush](BaseStateManager.md#flush)
- [getAccount](BaseStateManager.md#getaccount)
- [getContractStorage](BaseStateManager.md#getcontractstorage)
- [modifyAccountFields](BaseStateManager.md#modifyaccountfields)
- [putAccount](BaseStateManager.md#putaccount)
- [putContractCode](BaseStateManager.md#putcontractcode)
- [putContractStorage](BaseStateManager.md#putcontractstorage)
- [revert](BaseStateManager.md#revert)

## Constructors

### constructor

• **new BaseStateManager**(`opts`)

Needs to be called from the subclass constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `DefaultStateManagerOpts` |

#### Defined in

[baseStateManager.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L39)

## Properties

### \_cache

• **\_cache**: `Cache`

#### Defined in

[baseStateManager.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L24)

___

### \_common

• **\_common**: `Common`

#### Defined in

[baseStateManager.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L22)

___

### \_debug

• **\_debug**: `Debugger`

#### Defined in

[baseStateManager.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L23)

## Methods

### accountIsEmpty

▸ **accountIsEmpty**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[baseStateManager.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L105)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

Partial implementation, called from the subclass.

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L121)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L131)

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

#### Defined in

[baseStateManager.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L98)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L147)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`Account`\>

Gets the account associated with `address`. Returns an empty account if the account does not exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to get |

#### Returns

`Promise`<`Account`\>

#### Defined in

[baseStateManager.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L57)

___

### getContractStorage

▸ `Abstract` **getContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[baseStateManager.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L111)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `stateRoot`, and `codeHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the account to modify |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"stateRoot"`` \| ``"codeHash"``\>\> | Object containing account fields and values to modify |

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L85)

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

#### Defined in

[baseStateManager.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L67)

___

### putContractCode

▸ `Abstract` **putContractCode**(`address`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L110)

___

### putContractStorage

▸ `Abstract` **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L112)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

Partial implementation , called from the subclass.

#### Returns

`Promise`<`void`\>

#### Defined in

[baseStateManager.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L142)
