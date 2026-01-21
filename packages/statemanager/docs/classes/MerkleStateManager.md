[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / MerkleStateManager

# Class: MerkleStateManager

Defined in: [merkleStateManager.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L61)

Default StateManager implementation for the VM.

The state manager abstracts from the underlying data store
by providing higher level access to accounts, contract code
and storage slots.

The default state manager implementation uses a
`@ethereumjs/mpt` trie as a data backend.

Note that there is a `SimpleStateManager` dependency-free state
manager implementation available shipped with the `@ethereumjs/statemanager`
package which might be an alternative to this implementation
for many basic use cases.

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new MerkleStateManager**(`opts`): `MerkleStateManager`

Defined in: [merkleStateManager.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L92)

Instantiate the StateManager interface.

#### Parameters

##### opts

[`MerkleStateManagerOpts`](../interfaces/MerkleStateManagerOpts.md) = `{}`

#### Returns

`MerkleStateManager`

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [merkleStateManager.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L73)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [merkleStateManager.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L65)

#### Implementation of

`StateManagerInterface.originalStorageCache`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L442)

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

Defined in: [merkleStateManager.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L723)

Clears all underlying caches

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:425](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L425)

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

Defined in: [merkleStateManager.ts:452](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L452)

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L182)

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

Defined in: [merkleStateManager.ts:582](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L582)

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

##### address

`Address`

The address of the `account` to return storage for

#### Returns

`Promise`\<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: [merkleStateManager.ts:604](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L604)

Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
starting from `startKey` or greater.

#### Parameters

##### address

`Address`

The address of the `account` to return storage for.

##### startKey

`bigint`

The bigint representation of the smallest storage key that will be returned.

##### limit

`number`

The maximum number of storage values that will be returned.

#### Returns

`Promise`\<`StorageRange`\>

- A StorageRange object that will contain at most `limit` entries in its `storage` field.
The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.

#### Implementation of

`StateManagerInterface.dumpStorageRange`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L490)

Writes all cache items to the trie

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:640](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L640)

Initializes the provided genesis state into the state trie.
Will error if there are uncommitted checkpoints on the instance.

#### Parameters

##### initState

`any`

address -> balance | [balance, code, storage]

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [merkleStateManager.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L121)

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

Defined in: [merkleStateManager.ts:733](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L733)

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

Defined in: [merkleStateManager.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L226)

Gets the code corresponding to the provided `address`.

#### Parameters

##### address

`Address`

Address to get the `code` for

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [merkleStateManager.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L247)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [merkleStateManager.ts:546](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L546)

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

- Returns the state-root of the `StateManager`

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [merkleStateManager.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L319)

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

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [merkleStateManager.ts:676](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L676)

Checks whether there is a state corresponding to a stateRoot

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L174)

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

Defined in: [merkleStateManager.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L141)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account

The account to store or undefined if to be deleted

`Account` | `undefined`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L200)

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

Defined in: [merkleStateManager.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L402)

Adds value to the state trie for the `account`
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
If it is a empty or filled with zeros, deletes the value.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:472](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L472)

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:558](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L558)

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

##### stateRoot

`Uint8Array`

The state-root to reset the instance to

##### clearCache

`boolean` = `true`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): `MerkleStateManager`

Defined in: [merkleStateManager.ts:702](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L702)

Copies the current instance of the `StateManager`
at the last fully committed point, i.e. as if all current
checkpoints were reverted.

Caches are downleveled (so: adopted for short-term usage)
by default.

This means in particular:
1. For caches instantiated as an LRU cache type
the copy() method will instantiate with an ORDERED_MAP cache
instead, since copied instances are mostly used in
short-term usage contexts and LRU cache instantiation would create
a large overhead here.
2. The underlying trie object is initialized with 0 cache size

Both adoptions can be deactivated by setting `downlevelCaches` to
`false`.

Cache values are generally not copied along regardless of the
`downlevelCaches` setting.

#### Parameters

##### downlevelCaches

`boolean` = `true`

#### Returns

`MerkleStateManager`

#### Implementation of

`StateManagerInterface.shallowCopy`
