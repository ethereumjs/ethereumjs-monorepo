[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCStateManager

# Class: RPCStateManager

Defined in: [rpcStateManager.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L37)

State manager backed by an Ethereum JSON-RPC provider.

Reads account and storage data via `eth_getProof` / related RPC methods at a
fixed block tag. Suitable for simulations against live or archive nodes.

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new RPCStateManager**(`opts`): `RPCStateManager`

Defined in: [rpcStateManager.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L47)

#### Parameters

##### opts

[`RPCStateManagerOpts`](../interfaces/RPCStateManagerOpts.md)

#### Returns

`RPCStateManager`

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [rpcStateManager.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L45)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [rpcStateManager.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L41)

#### Implementation of

`StateManagerInterface.originalStorageCache`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L315)

Checkpoints the current state of this StateManagerInterface instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [rpcStateManager.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L97)

Clears the internal cache so all accounts, contract code, and storage slots will
initially be retrieved from the provider

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L181)

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

Defined in: [rpcStateManager.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L325)

Commits the current change-set to the instance since the
last call to checkpoint.

Partial implementation, called from the subclass.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### consumeBAL()

> **consumeBAL**(`bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L356)

Apply an EIP-7928 BAL onto this state. See [consumeBAL](#consumebal).

#### Parameters

##### bal

`BALJSONBlockAccessList`

##### expectedStateRoot?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`void`\>

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

`StateManagerInterface.consumeBAL`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L293)

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

Defined in: [rpcStateManager.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L190)

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

##### address

`Address`

Account whose storage should be dumped

#### Returns

`Promise`\<`StorageDump`\>

Hex-keyed map of storage slots (values as `0x`-prefixed strings)

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L340)

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [rpcStateManager.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L205)

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

Defined in: [rpcStateManager.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L306)

Returns the applied key for a given address
Used for saving preimages

#### Parameters

##### address

`Uint8Array`

Address bytes (typically 20-byte account address)

#### Returns

`Uint8Array`

Key after trie key hashing (e.g. keccak of the address)

#### Implementation of

`StateManagerInterface.getAppliedKey`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [rpcStateManager.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L107)

Gets the code corresponding to the provided `address`.

#### Parameters

##### address

`Address`

Address to get the code for

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Contract bytecode, or an empty array when no code is stored

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [rpcStateManager.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L119)

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

Defined in: [rpcStateManager.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L347)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [rpcStateManager.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L142)

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

##### address

`Address`

Address of the account to get the storage for

##### key

`Uint8Array`

Storage slot (32 bytes)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

RLP-decoded storage value, or empty bytes when unset

#### Implementation of

`StateManagerInterface.getStorage`

***

### ~~hasStateRoot()~~

> **hasStateRoot**(): `never`

Defined in: [rpcStateManager.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L368)

#### Returns

`never`

#### Deprecated

This method is not used by the RPC State Manager and is a stub required by the State Manager interface

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L272)

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

Defined in: [rpcStateManager.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L248)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account

`Account` \| `undefined`

The account to store

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L130)

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

Defined in: [rpcStateManager.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L173)

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

Defined in: [rpcStateManager.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L336)

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

Defined in: [rpcStateManager.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L87)

Sets the new block tag used when querying the provider and clears the
internal cache.

#### Parameters

##### blockTag

`bigint` \| `"earliest"`

the new block tag to use when querying the provider

#### Returns

`void`

***

### ~~setStateRoot()~~

> **setStateRoot**(`_root`): `Promise`\<`void`\>

Defined in: [rpcStateManager.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L363)

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

Defined in: [rpcStateManager.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L72)

Note that the returned statemanager will share the same JSONRPCProvider as the original

#### Returns

`RPCStateManager`

RPCStateManager

#### Implementation of

`StateManagerInterface.shallowCopy`
