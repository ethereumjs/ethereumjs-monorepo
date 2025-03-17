[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCStateManager

# Class: RPCStateManager

Defined in: [rpcStateManager.ts:28](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L28)

## Implements

- `StateManagerInterface`

## Constructors

### new RPCStateManager()

> **new RPCStateManager**(`opts`): [`RPCStateManager`](RPCStateManager.md)

Defined in: [rpcStateManager.ts:38](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L38)

#### Parameters

##### opts

[`RPCStateManagerOpts`](../interfaces/RPCStateManagerOpts.md)

#### Returns

[`RPCStateManager`](RPCStateManager.md)

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [rpcStateManager.ts:36](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L36)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [rpcStateManager.ts:32](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L32)

#### Implementation of

`StateManagerInterface.originalStorageCache`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:312](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L312)

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [rpcStateManager.ts:90](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L90)

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:176](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L176)

Clears all storage entries for the account corresponding to `address`.

#### Parameters

##### address

`Address`

Address to clear the storage of

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.clearStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:322](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L322)

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:290](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L290)

Deletes an account from state under the provided `address`.

#### Parameters

##### address

`Address`

Address of the account which should be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.deleteAccount`

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Defined in: [rpcStateManager.ts:187](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L187)

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

##### address

`Address`

The address of the `account` to return storage for

#### Returns

`Promise`\<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:337](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L337)

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: [rpcStateManager.ts:202](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L202)

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

##### address

`Address`

Address of the `account` to get

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getAppliedKey()

> **getAppliedKey**(`address`): `Uint8Array`

Defined in: [rpcStateManager.ts:303](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L303)

Returns the applied key for a given address
Used for saving preimages

#### Parameters

##### address

`Uint8Array`

The address to return the applied key

#### Returns

`Uint8Array`

- The applied key (e.g. hashed address)

#### Implementation of

`StateManagerInterface.getAppliedKey`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\>

Defined in: [rpcStateManager.ts:100](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L100)

Gets the code corresponding to the provided `address`.

#### Parameters

##### address

`Address`

Address to get the `code` for

#### Returns

`Promise`\<`Uint8Array`\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [rpcStateManager.ts:112](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L112)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### ~~getStateRoot()~~

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

Defined in: [rpcStateManager.ts:344](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L344)

#### Returns

`Promise`\<`Uint8Array`\>

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Defined in: [rpcStateManager.ts:137](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L137)

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

##### address

`Address`

Address of the account to get the storage for

##### key

`Uint8Array`

Key in the account's storage to get the value for. Must be 32 bytes long.

#### Returns

`Promise`\<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

`StateManagerInterface.getStorage`

***

### ~~hasStateRoot()~~

> **hasStateRoot**(): `never`

Defined in: [rpcStateManager.ts:356](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L356)

#### Returns

`never`

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:269](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L269)

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

##### address

`Address`

Address of the account to modify

##### accountFields

`Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"` \| `"codeSize"`\>\>

Object containing account fields and values to modify

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:245](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L245)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account

The account to store

`undefined` | `Account`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:123](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L123)

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

##### address

`Address`

Address of the `account` to add the `code` for

##### value

`Uint8Array`

The value of the `code`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:168](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L168)

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

##### address

`Address`

Address to set a storage value for

##### key

`Uint8Array`

Key to set the value at. Must be 32 bytes long.

##### value

`Uint8Array`

Value to set at `key` for account corresponding to `address`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:333](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L333)

Reverts the current change-set to the instance since the
last call to checkpoint.

Partial implementation , called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setBlockTag()

> **setBlockTag**(`blockTag`): `void`

Defined in: [rpcStateManager.ts:80](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L80)

Sets the new block tag used when querying the provider and clears the
internal cache.

#### Parameters

##### blockTag

the new block tag to use when querying the provider

`bigint` | `"earliest"`

#### Returns

`void`

***

### ~~setStateRoot()~~

> **setStateRoot**(`_root`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:351](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L351)

#### Parameters

##### \_root

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(): [`RPCStateManager`](RPCStateManager.md)

Defined in: [rpcStateManager.ts:65](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L65)

Note that the returned statemanager will share the same JSONRPCProvider as the original

#### Returns

[`RPCStateManager`](RPCStateManager.md)

RPCStateManager

#### Implementation of

`StateManagerInterface.shallowCopy`
