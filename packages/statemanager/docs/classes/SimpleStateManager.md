[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / SimpleStateManager

# Class: SimpleStateManager

Defined in: [simpleStateManager.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L27)

Simple and dependency-free state manager for basic state access use cases
where a merkle-patricia or binary tree backed state manager is too heavy-weight.

This state manager comes with the basic state access logic for
accounts, storage and code (put* and get* methods) as well as a simple
implementation of checkpointing but lacks methods implementations of
state root related logic as well as some other non-core functions.

Functionality provided is sufficient to be used for simple EVM use
cases and the state manager is used as default there.

For a more full fledged and MPT-backed state manager implementation
have a look at the [`@ethereumjs/statemanager` package docs](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/docs/README.md).

## Implements

- `StateManagerInterface`

## Constructors

### Constructor

> **new SimpleStateManager**(`opts?`): `SimpleStateManager`

Defined in: [simpleStateManager.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L39)

#### Parameters

##### opts?

[`SimpleStateManagerOpts`](../interfaces/SimpleStateManagerOpts.md) = `{}`

#### Returns

`SimpleStateManager`

## Properties

### accountStack

> **accountStack**: `Map`\<`` `0x${string}` ``, `Account` \| `undefined`\>[] = `[]`

Defined in: [simpleStateManager.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L28)

***

### codeStack

> **codeStack**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>[] = `[]`

Defined in: [simpleStateManager.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L29)

***

### common?

> `readonly` `optional` **common?**: `Common`

Defined in: [simpleStateManager.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L37)

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: [simpleStateManager.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L32)

#### clear()

> **clear**(): `void`

##### Returns

`void`

#### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### Parameters

###### address

`Address`

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.originalStorageCache`

***

### storageStack

> **storageStack**: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>[] = `[]`

Defined in: [simpleStateManager.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L30)

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L130)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [simpleStateManager.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L146)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L115)

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

Defined in: [simpleStateManager.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L133)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### consumeBAL()

> **consumeBAL**(`bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L164)

Apply an EIP-7928 BAL onto this state. See [consumeBAL](#consumebal).
Do not pass `expectedStateRoot` — this manager does not implement state roots.

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

Defined in: [simpleStateManager.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L78)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.deleteAccount`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L145)

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [simpleStateManager.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L70)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Account` \| `undefined`\>

#### Implementation of

`StateManagerInterface.getAccount`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [simpleStateManager.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L86)

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

Defined in: [simpleStateManager.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L100)

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

Defined in: [simpleStateManager.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L169)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [simpleStateManager.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L105)

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

> **hasStateRoot**(): `Promise`\<`boolean`\>

Defined in: [simpleStateManager.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L175)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L82)

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

Defined in: [simpleStateManager.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L74)

#### Parameters

##### address

`Address`

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L90)

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

Defined in: [simpleStateManager.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L111)

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

Defined in: [simpleStateManager.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L139)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L172)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(): `StateManagerInterface`

Defined in: [simpleStateManager.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L148)

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`
