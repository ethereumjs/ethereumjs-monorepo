[@ethereumjs/statemanager](../README.md) / DefaultStateManager

# Class: DefaultStateManager

Default StateManager implementation for the VM.

The state manager abstracts from the underlying data store
by providing higher level access to accounts, contract code
and storage slots.

The default state manager implementation uses a
`@ethereumjs/trie` trie as a data backend.

## Hierarchy

- [`BaseStateManager`](BaseStateManager.md)

  ↳ **`DefaultStateManager`**

## Implements

- [`StateManager`](../interfaces/StateManager.md)

## Table of contents

### Constructors

- [constructor](DefaultStateManager.md#constructor)

### Properties

- [\_cache](DefaultStateManager.md#_cache)
- [\_common](DefaultStateManager.md#_common)
- [\_debug](DefaultStateManager.md#_debug)
- [\_storageTries](DefaultStateManager.md#_storagetries)
- [\_trie](DefaultStateManager.md#_trie)

### Methods

- [accountExists](DefaultStateManager.md#accountexists)
- [accountIsEmpty](DefaultStateManager.md#accountisempty)
- [checkpoint](DefaultStateManager.md#checkpoint)
- [clearContractStorage](DefaultStateManager.md#clearcontractstorage)
- [commit](DefaultStateManager.md#commit)
- [copy](DefaultStateManager.md#copy)
- [deleteAccount](DefaultStateManager.md#deleteaccount)
- [dumpStorage](DefaultStateManager.md#dumpstorage)
- [flush](DefaultStateManager.md#flush)
- [getAccount](DefaultStateManager.md#getaccount)
- [getContractCode](DefaultStateManager.md#getcontractcode)
- [getContractStorage](DefaultStateManager.md#getcontractstorage)
- [getProof](DefaultStateManager.md#getproof)
- [getStateRoot](DefaultStateManager.md#getstateroot)
- [hasStateRoot](DefaultStateManager.md#hasstateroot)
- [modifyAccountFields](DefaultStateManager.md#modifyaccountfields)
- [putAccount](DefaultStateManager.md#putaccount)
- [putContractCode](DefaultStateManager.md#putcontractcode)
- [putContractStorage](DefaultStateManager.md#putcontractstorage)
- [revert](DefaultStateManager.md#revert)
- [setStateRoot](DefaultStateManager.md#setstateroot)
- [verifyProof](DefaultStateManager.md#verifyproof)

## Constructors

### constructor

• **new DefaultStateManager**(`opts?`)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `DefaultStateManagerOpts` |

#### Overrides

[BaseStateManager](BaseStateManager.md).[constructor](BaseStateManager.md#constructor)

#### Defined in

[stateManager.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L82)

## Properties

### \_cache

• **\_cache**: `Cache`

#### Inherited from

[BaseStateManager](BaseStateManager.md).[_cache](BaseStateManager.md#_cache)

#### Defined in

[baseStateManager.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L24)

___

### \_common

• **\_common**: `Common`

#### Inherited from

[BaseStateManager](BaseStateManager.md).[_common](BaseStateManager.md#_common)

#### Defined in

[baseStateManager.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L22)

___

### \_debug

• **\_debug**: `Debugger`

#### Inherited from

[BaseStateManager](BaseStateManager.md).[_debug](BaseStateManager.md#_debug)

#### Defined in

[baseStateManager.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L23)

___

### \_storageTries

• **\_storageTries**: `Object`

#### Index signature

▪ [key: `string`]: `Trie`

#### Defined in

[stateManager.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L77)

___

### \_trie

• **\_trie**: `SecureTrie`

#### Defined in

[stateManager.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L76)

## Methods

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

Checks if the `account` corresponding to `address`
exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of the `account` to check |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[accountExists](../interfaces/StateManager.md#accountexists)

#### Defined in

[stateManager.ts:500](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L500)

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

[baseStateManager.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L105)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[checkpoint](../interfaces/StateManager.md#checkpoint)

#### Overrides

[BaseStateManager](BaseStateManager.md).[checkpoint](BaseStateManager.md#checkpoint)

#### Defined in

[stateManager.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L291)

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

[stateManager.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L279)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[commit](../interfaces/StateManager.md#commit)

#### Overrides

[BaseStateManager](BaseStateManager.md).[commit](BaseStateManager.md#commit)

#### Defined in

[stateManager.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L300)

___

### copy

▸ **copy**(): [`StateManager`](../interfaces/StateManager.md)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

#### Returns

[`StateManager`](../interfaces/StateManager.md)

#### Implementation of

[StateManager](../interfaces/StateManager.md).[copy](../interfaces/StateManager.md#copy)

#### Defined in

[stateManager.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L114)

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

[baseStateManager.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L98)

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
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

[StateManager](../interfaces/StateManager.md).[dumpStorage](../interfaces/StateManager.md#dumpstorage)

#### Defined in

[stateManager.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L468)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[flush](../interfaces/StateManager.md#flush)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[flush](BaseStateManager.md#flush)

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

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getAccount](../interfaces/StateManager.md#getaccount)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[getAccount](BaseStateManager.md#getaccount)

#### Defined in

[baseStateManager.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L57)

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

-  Resolves with the code corresponding to the provided address.
Returns an empty `Buffer` if the account has no associated code.

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getContractCode](../interfaces/StateManager.md#getcontractcode)

#### Defined in

[stateManager.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L149)

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

[stateManager.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L198)

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`<[`Proof`](../README.md#proof)\>

Get an EIP-1186 proof

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `Address` | `undefined` | address to get proof of |
| `storageSlots` | `Buffer`[] | `[]` | storage slots to get proof of |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getProof](../interfaces/StateManager.md#getproof)

#### Defined in

[stateManager.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L322)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`<`Buffer`\>

- Returns the state-root of the `StateManager`

#### Implementation of

[StateManager](../interfaces/StateManager.md).[getStateRoot](../interfaces/StateManager.md#getstateroot)

#### Defined in

[stateManager.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L433)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

Checks whether there is a state corresponding to a stateRoot

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[hasStateRoot](../interfaces/StateManager.md#hasstateroot)

#### Defined in

[stateManager.ts:491](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L491)

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

#### Implementation of

[StateManager](../interfaces/StateManager.md).[modifyAccountFields](../interfaces/StateManager.md#modifyaccountfields)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[modifyAccountFields](BaseStateManager.md#modifyaccountfields)

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

#### Implementation of

[StateManager](../interfaces/StateManager.md).[putAccount](../interfaces/StateManager.md#putaccount)

#### Inherited from

[BaseStateManager](BaseStateManager.md).[putAccount](BaseStateManager.md#putaccount)

#### Defined in

[baseStateManager.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/baseStateManager.ts#L67)

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

[stateManager.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L127)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address to set a storage value for |
| `key` | `Buffer` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Buffer` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[putContractStorage](../interfaces/StateManager.md#putcontractstorage)

#### Overrides

[BaseStateManager](BaseStateManager.md).[putContractStorage](BaseStateManager.md#putcontractstorage)

#### Defined in

[stateManager.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L245)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[revert](../interfaces/StateManager.md#revert)

#### Overrides

[BaseStateManager](BaseStateManager.md).[revert](BaseStateManager.md#revert)

#### Defined in

[stateManager.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L310)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`): `Promise`<`void`\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Buffer` | The state-root to reset the instance to |

#### Returns

`Promise`<`void`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[setStateRoot](../interfaces/StateManager.md#setstateroot)

#### Defined in

[stateManager.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L446)

___

### verifyProof

▸ **verifyProof**(`proof`): `Promise`<`boolean`\>

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | the proof to prove |

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[StateManager](../interfaces/StateManager.md).[verifyProof](../interfaces/StateManager.md#verifyproof)

#### Defined in

[stateManager.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L360)
