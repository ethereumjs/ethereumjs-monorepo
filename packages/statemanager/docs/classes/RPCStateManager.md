[@ethereumjs/statemanager](../README.md) / RPCStateManager

# Class: RPCStateManager

## Implements

- `EVMStateManagerInterface`

## Table of contents

### Constructors

- [constructor](RPCStateManager.md#constructor)

### Properties

- [common](RPCStateManager.md#common)
- [originalStorageCache](RPCStateManager.md#originalstoragecache)

### Methods

- [accountExists](RPCStateManager.md#accountexists)
- [checkpoint](RPCStateManager.md#checkpoint)
- [clearCaches](RPCStateManager.md#clearcaches)
- [clearContractStorage](RPCStateManager.md#clearcontractstorage)
- [commit](RPCStateManager.md#commit)
- [deleteAccount](RPCStateManager.md#deleteaccount)
- [dumpStorage](RPCStateManager.md#dumpstorage)
- [dumpStorageRange](RPCStateManager.md#dumpstoragerange)
- [flush](RPCStateManager.md#flush)
- [generateCanonicalGenesis](RPCStateManager.md#generatecanonicalgenesis)
- [getAccount](RPCStateManager.md#getaccount)
- [getAppliedKey](RPCStateManager.md#getappliedkey)
- [getContractCode](RPCStateManager.md#getcontractcode)
- [getContractStorage](RPCStateManager.md#getcontractstorage)
- [getProof](RPCStateManager.md#getproof)
- [getStateRoot](RPCStateManager.md#getstateroot)
- [hasStateRoot](RPCStateManager.md#hasstateroot)
- [modifyAccountFields](RPCStateManager.md#modifyaccountfields)
- [putAccount](RPCStateManager.md#putaccount)
- [putContractCode](RPCStateManager.md#putcontractcode)
- [putContractStorage](RPCStateManager.md#putcontractstorage)
- [revert](RPCStateManager.md#revert)
- [setBlockTag](RPCStateManager.md#setblocktag)
- [setStateRoot](RPCStateManager.md#setstateroot)
- [shallowCopy](RPCStateManager.md#shallowcopy)

## Constructors

### constructor

• **new RPCStateManager**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RPCStateManagerOpts`](../interfaces/RPCStateManagerOpts.md) |

#### Defined in

[rpcStateManager.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L50)

## Properties

### common

• `Readonly` **common**: `Common`

#### Defined in

[rpcStateManager.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L48)

___

### originalStorageCache

• **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

#### Implementation of

EVMStateManagerInterface.originalStorageCache

#### Defined in

[rpcStateManager.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L44)

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

[rpcStateManager.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L225)

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

[rpcStateManager.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L387)

___

### clearCaches

▸ **clearCaches**(): `void`

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Defined in

[rpcStateManager.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L111)

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

[rpcStateManager.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L194)

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

[rpcStateManager.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L398)

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

[rpcStateManager.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L343)

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

[rpcStateManager.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L205)

___

### dumpStorageRange

▸ **dumpStorageRange**(`_address`, `_startKey`, `_limit`): `Promise`<`StorageRange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `Address` |
| `_startKey` | `bigint` |
| `_limit` | `number` |

#### Returns

`Promise`<`StorageRange`\>

#### Implementation of

EVMStateManagerInterface.dumpStorageRange

#### Defined in

[rpcStateManager.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L216)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[rpcStateManager.ts:415](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L415)

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

[rpcStateManager.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L438)

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

[rpcStateManager.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L251)

___

### getAppliedKey

▸ **getAppliedKey**(`address`): `Uint8Array`

Returns the applied key for a given address
Used for saving preimages

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Uint8Array` | The address to return the applied key |

#### Returns

`Uint8Array`

- The applied key (e.g. hashed address)

#### Implementation of

EVMStateManagerInterface.getAppliedKey

#### Defined in

[rpcStateManager.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L376)

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

[rpcStateManager.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L123)

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

[rpcStateManager.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L155)

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

[rpcStateManager.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L356)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

**`Deprecated`**

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Returns

`Promise`<`Uint8Array`\>

#### Implementation of

EVMStateManagerInterface.getStateRoot

#### Defined in

[rpcStateManager.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L422)

___

### hasStateRoot

▸ **hasStateRoot**(): `never`

**`Deprecated`**

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Returns

`never`

#### Implementation of

EVMStateManagerInterface.hasStateRoot

#### Defined in

[rpcStateManager.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L434)

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

[rpcStateManager.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L314)

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

[rpcStateManager.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L290)

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

[rpcStateManager.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L141)

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

[rpcStateManager.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L186)

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

[rpcStateManager.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L409)

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

[rpcStateManager.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L101)

___

### setStateRoot

▸ **setStateRoot**(`_root`): `Promise`<`void`\>

**`Deprecated`**

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Parameters

| Name | Type |
| :------ | :------ |
| `_root` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EVMStateManagerInterface.setStateRoot

#### Defined in

[rpcStateManager.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L429)

___

### shallowCopy

▸ **shallowCopy**(): [`RPCStateManager`](RPCStateManager.md)

Note that the returned statemanager will share the same JsonRpcProvider as the original

#### Returns

[`RPCStateManager`](RPCStateManager.md)

RPCStateManager

#### Implementation of

EVMStateManagerInterface.shallowCopy

#### Defined in

[rpcStateManager.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L79)
