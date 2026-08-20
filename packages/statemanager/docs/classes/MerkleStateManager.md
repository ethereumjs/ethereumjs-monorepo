[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / MerkleStateManager

# Class: MerkleStateManager

Defined in: [merkleStateManager.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L64)

Default StateManagerInterface implementation for the VM.

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

> **new MerkleStateManager**(`opts?`): `MerkleStateManager`

Defined in: [merkleStateManager.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L95)

Instantiate a Merkle-backed state manager.

#### Parameters

##### opts?

[`MerkleStateManagerOpts`](../interfaces/MerkleStateManagerOpts.md) = `{}`

#### Returns

`MerkleStateManager`

## Properties

### common

> `readonly` **common**: `Common`

Defined in: [merkleStateManager.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L76)

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [merkleStateManager.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L68)

#### Implementation of

`StateManagerInterface.originalStorageCache`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L444)

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

Defined in: [merkleStateManager.ts:722](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L722)

Clears all underlying caches

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L427)

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

Defined in: [merkleStateManager.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L454)

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### consumeBAL()

> **consumeBAL**(`bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:741](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L741)

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

Defined in: [merkleStateManager.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L183)

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

Account whose storage should be dumped

#### Returns

`Promise`\<`StorageDump`\>

Hex-keyed map of storage slots (values as unprefixed hex strings)

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: [merkleStateManager.ts:603](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L603)

Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
starting from `startKey` or greater.

#### Parameters

##### address

`Address`

The address of the `account` to return storage for.

##### startKey

`bigint`

The bigint representation of the smallest storage key that will be returned.
*

##### limit

`number`

Maximum number of storage entries to return
*

#### Returns

`Promise`\<`StorageRange`\>

StorageRange with at most `limit` entries and optional `nextKey`

#### Implementation of

`StateManagerInterface.dumpStorageRange`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:492](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L492)

Writes all cache items to the trie

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:639](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L639)

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

Defined in: [merkleStateManager.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L122)

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

Defined in: [merkleStateManager.ts:732](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L732)

Returns the applied key for a given address
Used for saving preimages

#### Parameters

##### address

`Uint8Array`

Address bytes used for preimage recording

#### Returns

`Uint8Array`

Key after trie key hashing (e.g. keccak of the address)

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

Address to get the code for

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Contract bytecode, or an empty array when no code is stored

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

Defined in: [merkleStateManager.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L548)

Gets the state-root of the Merkle-Patricia trie representation
of the state of this manager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Account trie root hash

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [merkleStateManager.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L320)

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

Defined in: [merkleStateManager.ts:675](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L675)

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

Defined in: [merkleStateManager.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L175)

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

Defined in: [merkleStateManager.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L142)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account

`Account` \| `undefined`

The account to store or undefined if to be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L201)

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

Defined in: [merkleStateManager.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L404)

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

Defined in: [merkleStateManager.ts:474](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L474)

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [merkleStateManager.ts:560](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L560)

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

##### stateRoot

`Uint8Array`

The state-root to reset the instance to

##### clearCache?

`boolean` = `true`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches?`): `MerkleStateManager`

Defined in: [merkleStateManager.ts:701](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L701)

Copies the current MerkleStateManager at the last fully committed point.
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

##### downlevelCaches?

`boolean` = `true`

#### Returns

`MerkleStateManager`

#### Implementation of

`StateManagerInterface.shallowCopy`
