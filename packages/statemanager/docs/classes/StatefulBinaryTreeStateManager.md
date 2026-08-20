[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulBinaryTreeStateManager

# Class: StatefulBinaryTreeStateManager

Defined in: [statefulBinaryTreeStateManager.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L72)

StateManagerInterface backed by an EIP-7864 BinaryTree.

Supports execution witnesses, binary-tree access lists, and checkpointing for VM use.

## Implements

- `StateManagerInterface`
- `BinaryTreeStateManagerInterface`

## Constructors

### Constructor

> **new StatefulBinaryTreeStateManager**(`opts`): `StatefulBinaryTreeStateManager`

Defined in: [statefulBinaryTreeStateManager.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L102)

#### Parameters

##### opts

[`StatefulBinaryTreeStateManagerOpts`](../interfaces/StatefulBinaryTreeStateManagerOpts.md)

#### Returns

`StatefulBinaryTreeStateManager`

## Properties

### hashFunction

> **hashFunction**: (`input`) => `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L80)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

***

### originalStorageCache

> **originalStorageCache**: [`OriginalStorageCache`](OriginalStorageCache.md)

Defined in: [statefulBinaryTreeStateManager.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L79)

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### preStateRoot

> **preStateRoot**: `Uint8Array`

Defined in: [statefulBinaryTreeStateManager.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L78)

## Accessors

### tree

#### Get Signature

> **get** **tree**(): `BinaryTree`

Defined in: [statefulBinaryTreeStateManager.ts:733](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L733)

The underlying binary tree holding the state, as exposed through
BinaryTreeStateManagerInterface for interface-based consumers
(e.g. execution witness generation in `@ethereumjs/evm`).

##### Returns

`BinaryTree`

#### Implementation of

`BinaryTreeStateManagerInterface.tree`

## Methods

### checkChunkWitnessPresent()

> **checkChunkWitnessPresent**(`_address`, `_codeOffset`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:770](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L770)

#### Parameters

##### \_address

`Address`

##### \_codeOffset

`number`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.checkChunkWitnessPresent`

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:464](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L464)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [statefulBinaryTreeStateManager.ts:764](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L764)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:460](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L460)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.clearStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:469](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L469)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### consumeBAL()

> **consumeBAL**(`bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L746)

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

Defined in: [statefulBinaryTreeStateManager.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L259)

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

### dumpStorage()?

> `optional` **dumpStorage**(`_address`): `Promise`\<`StorageDump`\>

Defined in: [statefulBinaryTreeStateManager.ts:758](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L758)

#### Parameters

##### \_address

`Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Implementation of

`StateManagerInterface.dumpStorage`

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`_address`, `_startKey`, `_limit`): `Promise`\<`StorageRange`\>

Defined in: [statefulBinaryTreeStateManager.ts:761](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L761)

#### Parameters

##### \_address

`Address`

##### \_startKey

`bigint`

##### \_limit

`number`

#### Returns

`Promise`\<`StorageRange`\>

#### Implementation of

`StateManagerInterface.dumpStorageRange`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L495)

#### Returns

`Promise`\<`void`\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`genesisState`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:773](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L773)

#### Parameters

##### genesisState

`GenesisState`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [statefulBinaryTreeStateManager.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L132)

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

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L338)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: [statefulBinaryTreeStateManager.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L413)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`StateManagerInterface.getCodeSize`

***

### getComputedValue()

> **getComputedValue**(`accessedState`): `Promise`\<`` `0x${string}` `` \| `null`\>

Defined in: [statefulBinaryTreeStateManager.ts:535](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L535)

#### Parameters

##### accessedState

`BinaryTreeAccessedStateWithAddress`

#### Returns

`Promise`\<`` `0x${string}` `` \| `null`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:737](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L737)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [statefulBinaryTreeStateManager.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L422)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:755](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L755)

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### initBinaryTreeExecutionWitness()

> **initBinaryTreeExecutionWitness**(`_blockNum`, `executionWitness?`): `void`

Defined in: [statefulBinaryTreeStateManager.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L179)

#### Parameters

##### \_blockNum

`bigint`

##### executionWitness?

`BinaryTreeExecutionWitness` \| `null`

#### Returns

`void`

#### Implementation of

`StateManagerInterface.initBinaryTreeExecutionWitness`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L277)

#### Parameters

##### address

`Address`

##### accountFields

`AccountFields`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L223)

Saves an account into state under the provided `address`.

#### Parameters

##### address

`Address`

Address under which to store `account`

##### account?

`Account`

The account to store or undefined if to be deleted

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L280)

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L448)

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:483](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L483)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: [statefulBinaryTreeStateManager.ts:750](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L750)

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`_downlevelCaches?`): `StateManagerInterface`

Defined in: [statefulBinaryTreeStateManager.ts:767](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L767)

#### Parameters

##### \_downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`

***

### verifyBinaryTreePostState()

> **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: [statefulBinaryTreeStateManager.ts:629](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/statefulBinaryTreeStateManager.ts#L629)

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.verifyBinaryTreePostState`
