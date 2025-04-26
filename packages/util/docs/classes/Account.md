[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Account

# Class: Account

Defined in: [packages/util/src/account.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L81)

Account class to load and maintain the  basic account objects.
Supports partial loading and access required for verkle with null
as the placeholder.

Note: passing undefined in constructor is different from null
While undefined leads to default assignment, null is retained
to track the information not available/loaded because of partial
witness access

## Constructors

### Constructor

> **new Account**(`nonce`, `balance`, `storageRoot`, `codeHash`, `codeSize`, `version`): `Account`

Defined in: [packages/util/src/account.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L163)

This constructor assigns and validates the values.
It is not recommended to use this constructor directly. Instead use the static
factory methods to assist in creating an Account from varying data types.
undefined get assigned with the defaults, but null args are retained as is

#### Parameters

##### nonce

`null` | `bigint`

##### balance

`null` | `bigint`

##### storageRoot

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### codeHash

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### codeSize

`null` | `number`

##### version

`null` | `number`

#### Returns

`Account`

#### Deprecated

## Properties

### \_balance

> **\_balance**: `null` \| `bigint` = `null`

Defined in: [packages/util/src/account.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L83)

***

### \_codeHash

> **\_codeHash**: `null` \| `Uint8Array`\<`ArrayBufferLike`\> = `null`

Defined in: [packages/util/src/account.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L85)

***

### \_codeSize

> **\_codeSize**: `null` \| `number` = `null`

Defined in: [packages/util/src/account.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L87)

***

### \_nonce

> **\_nonce**: `null` \| `bigint` = `null`

Defined in: [packages/util/src/account.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L82)

***

### \_storageRoot

> **\_storageRoot**: `null` \| `Uint8Array`\<`ArrayBufferLike`\> = `null`

Defined in: [packages/util/src/account.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L84)

***

### \_version

> **\_version**: `null` \| `number` = `null`

Defined in: [packages/util/src/account.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L88)

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

Defined in: [packages/util/src/account.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L112)

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`_balance`): `void`

Defined in: [packages/util/src/account.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L119)

##### Parameters

###### \_balance

`bigint`

##### Returns

`void`

***

### codeHash

#### Get Signature

> **get** **codeHash**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/account.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L134)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Set Signature

> **set** **codeHash**(`_codeHash`): `void`

Defined in: [packages/util/src/account.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L141)

##### Parameters

###### \_codeHash

`Uint8Array`

##### Returns

`void`

***

### codeSize

#### Get Signature

> **get** **codeSize**(): `number`

Defined in: [packages/util/src/account.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L145)

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`_codeSize`): `void`

Defined in: [packages/util/src/account.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L152)

##### Parameters

###### \_codeSize

`number`

##### Returns

`void`

***

### nonce

#### Get Signature

> **get** **nonce**(): `bigint`

Defined in: [packages/util/src/account.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L101)

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`_nonce`): `void`

Defined in: [packages/util/src/account.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L108)

##### Parameters

###### \_nonce

`bigint`

##### Returns

`void`

***

### storageRoot

#### Get Signature

> **get** **storageRoot**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/account.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L123)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Set Signature

> **set** **storageRoot**(`_storageRoot`): `void`

Defined in: [packages/util/src/account.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L130)

##### Parameters

###### \_storageRoot

`Uint8Array`

##### Returns

`void`

***

### version

#### Get Signature

> **get** **version**(): `number`

Defined in: [packages/util/src/account.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L90)

##### Returns

`number`

#### Set Signature

> **set** **version**(`_version`): `void`

Defined in: [packages/util/src/account.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L97)

##### Parameters

###### \_version

`number`

##### Returns

`void`

## Methods

### isContract()

> **isContract**(): `boolean`

Defined in: [packages/util/src/account.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L269)

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: [packages/util/src/account.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L284)

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [packages/util/src/account.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L206)

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L218)

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L222)

#### Returns

`Uint8Array`
