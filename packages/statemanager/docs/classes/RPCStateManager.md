[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCStateManager

# Class: RPCStateManager

Defined in: [rpcStateManager.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L29)

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new RPCStateManager**(`opts`): `RPCStateManager`

Defined in: [rpcStateManager.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L39)

#### Parameters

##### opts

[`RPCStateManagerOpts`](../interfaces/RPCStateManagerOpts.md)

#### Returns

`RPCStateManager`

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [rpcStateManager.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L37)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [rpcStateManager.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L33)

#### Implementation of

`StateManagerInterface.originalStorageCache`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L313)

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

Defined in: [rpcStateManager.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L91)

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L177)

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

Defined in: [rpcStateManager.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L323)

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

Defined in: [rpcStateManager.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L291)

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

Defined in: [rpcStateManager.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L188)

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

Defined in: [rpcStateManager.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L338)

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [rpcStateManager.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L203)

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

##### address

`Address`

Address of the `account` to get

#### Returns

`Promise`\<`Account` \| `undefined`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getAppliedKey()

> **getAppliedKey**(`address`): `Uint8Array`

Defined in: [rpcStateManager.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L304)

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

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [rpcStateManager.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L101)

Gets the code corresponding to the provided `address`.

#### Parameters

##### address

`Address`

Address to get the `code` for

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

- Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [rpcStateManager.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L113)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### ~~getStateRoot()~~

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [rpcStateManager.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L345)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [rpcStateManager.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L138)

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

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

`StateManagerInterface.getStorage`

***

### ~~hasStateRoot()~~

> **hasStateRoot**(): `never`

Defined in: [rpcStateManager.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L357)

#### Returns

`never`

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L270)

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

##### address

`Address`

Address of the account to modify

##### accountFields

`AccountFields`

Object containing account fields and values to modify

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L246)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account

The account to store

`Account` | `undefined`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L124)

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

Defined in: [rpcStateManager.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L169)

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

Defined in: [rpcStateManager.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L334)

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

Defined in: [rpcStateManager.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L81)

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

Defined in: [rpcStateManager.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L352)

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

> **shallowCopy**(): `RPCStateManager`

Defined in: [rpcStateManager.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L66)

Note that the returned statemanager will share the same JSONRPCProvider as the original

#### Returns

`RPCStateManager`

RPCStateManager

#### Implementation of

`StateManagerInterface.shallowCopy`
