[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Account

# Class: Account

Defined in: [packages/util/src/account.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L88)

Account class to load and maintain the  basic account objects.
Supports partial loading and access required for stateless with null
as the placeholder.

Note: passing undefined in constructor is different from null
While undefined leads to default assignment, null is retained
to track the information not available/loaded because of partial
witness access

## Constructors

### Constructor

> **new Account**(`nonce?`, `balance?`, `storageRoot?`, `codeHash?`, `codeSize?`, `version?`): `Account`

Defined in: [packages/util/src/account.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L170)

This constructor assigns and validates the values.
It is not recommended to use this constructor directly. Instead use the static
factory methods to assist in creating an Account from varying data types.
undefined get assigned with the defaults, but null args are retained as is

#### Parameters

##### nonce?

`bigint` \| `null`

##### balance?

`bigint` \| `null`

##### storageRoot?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

##### codeHash?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

##### codeSize?

`number` \| `null`

##### version?

`number` \| `null`

#### Returns

`Account`

#### Deprecated

## Properties

### \_balance

> **\_balance**: `bigint` \| `null` = `null`

Defined in: [packages/util/src/account.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L90)

***

### \_codeHash

> **\_codeHash**: `Uint8Array`\<`ArrayBufferLike`\> \| `null` = `null`

Defined in: [packages/util/src/account.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L92)

***

### \_codeSize

> **\_codeSize**: `number` \| `null` = `null`

Defined in: [packages/util/src/account.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L94)

***

### \_nonce

> **\_nonce**: `bigint` \| `null` = `null`

Defined in: [packages/util/src/account.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L89)

***

### \_storageRoot

> **\_storageRoot**: `Uint8Array`\<`ArrayBufferLike`\> \| `null` = `null`

Defined in: [packages/util/src/account.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L91)

***

### \_version

> **\_version**: `number` \| `null` = `null`

Defined in: [packages/util/src/account.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L95)

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

Defined in: [packages/util/src/account.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L119)

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`_balance`): `void`

Defined in: [packages/util/src/account.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L126)

##### Parameters

###### \_balance

`bigint`

##### Returns

`void`

***

### codeHash

#### Get Signature

> **get** **codeHash**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/account.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L141)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Set Signature

> **set** **codeHash**(`_codeHash`): `void`

Defined in: [packages/util/src/account.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L148)

##### Parameters

###### \_codeHash

`Uint8Array`

##### Returns

`void`

***

### codeSize

#### Get Signature

> **get** **codeSize**(): `number`

Defined in: [packages/util/src/account.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L152)

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`_codeSize`): `void`

Defined in: [packages/util/src/account.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L159)

##### Parameters

###### \_codeSize

`number`

##### Returns

`void`

***

### nonce

#### Get Signature

> **get** **nonce**(): `bigint`

Defined in: [packages/util/src/account.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L108)

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`_nonce`): `void`

Defined in: [packages/util/src/account.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L115)

##### Parameters

###### \_nonce

`bigint`

##### Returns

`void`

***

### storageRoot

#### Get Signature

> **get** **storageRoot**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/account.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L130)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Set Signature

> **set** **storageRoot**(`_storageRoot`): `void`

Defined in: [packages/util/src/account.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L137)

##### Parameters

###### \_storageRoot

`Uint8Array`

##### Returns

`void`

***

### version

#### Get Signature

> **get** **version**(): `number`

Defined in: [packages/util/src/account.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L97)

##### Returns

`number`

#### Set Signature

> **set** **version**(`_version`): `void`

Defined in: [packages/util/src/account.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L104)

##### Parameters

###### \_version

`number`

##### Returns

`void`

## Methods

### isContract()

> **isContract**(): `boolean`

Defined in: [packages/util/src/account.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L276)

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: [packages/util/src/account.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L291)

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [packages/util/src/account.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L213)

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L225)

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L229)

#### Returns

`Uint8Array`
