[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / SimpleStateManager

# Class: SimpleStateManager

Defined in: [simpleStateManager.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L26)

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

> **new SimpleStateManager**(`opts`): `SimpleStateManager`

Defined in: [simpleStateManager.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L38)

#### Parameters

##### opts

[`SimpleStateManagerOpts`](../interfaces/SimpleStateManagerOpts.md) = `{}`

#### Returns

`SimpleStateManager`

## Properties

### accountStack

> **accountStack**: `Map`\<`` `0x${string}` ``, `Account` \| `undefined`\>[] = `[]`

Defined in: [simpleStateManager.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L27)

***

### codeStack

> **codeStack**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>[] = `[]`

Defined in: [simpleStateManager.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L28)

***

### common?

> `readonly` `optional` **common**: `Common`

Defined in: [simpleStateManager.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L36)

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: [simpleStateManager.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L31)

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

Defined in: [simpleStateManager.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L29)

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L116)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [simpleStateManager.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L132)

#### Returns

`void`

#### Implementation of

`StateManagerInterface.clearCaches`

***

### clearStorage()

> **clearStorage**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L114)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.clearStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L119)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L77)

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

Defined in: [simpleStateManager.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L131)

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [simpleStateManager.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L69)

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

Defined in: [simpleStateManager.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L85)

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

Defined in: [simpleStateManager.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L99)

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

Defined in: [simpleStateManager.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L145)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Implementation of

`StateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [simpleStateManager.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L104)

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

Defined in: [simpleStateManager.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L151)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L81)

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

Defined in: [simpleStateManager.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L73)

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

Defined in: [simpleStateManager.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L89)

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

Defined in: [simpleStateManager.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L110)

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

Defined in: [simpleStateManager.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L125)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(): `Promise`\<`void`\>

Defined in: [simpleStateManager.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L148)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(): `StateManagerInterface`

Defined in: [simpleStateManager.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/simpleStateManager.ts#L134)

#### Returns

`StateManagerInterface`

#### Implementation of

`StateManagerInterface.shallowCopy`
