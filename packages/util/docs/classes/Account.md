[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Account

# Class: Account

Defined in: [packages/util/src/account.ts:51](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L51)

Account class to load and maintain the  basic account objects.
Supports partial loading and access required for verkle with null
as the placeholder.

Note: passing undefined in constructor is different from null
While undefined leads to default assignment, null is retained
to track the information not available/loaded because of partial
witness access

## Constructors

### new Account()

> **new Account**(`nonce`, `balance`, `storageRoot`, `codeHash`, `codeSize`, `version`): [`Account`](Account.md)

Defined in: [packages/util/src/account.ts:131](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L131)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.
undefined get assigned with the defaults present, but null args are retained as is

#### Parameters

##### nonce

`null` | `bigint`

##### balance

`null` | `bigint`

##### storageRoot

`null` | `Uint8Array`

##### codeHash

`null` | `Uint8Array`

##### codeSize

`null` | `number`

##### version

`null` | `number`

#### Returns

[`Account`](Account.md)

## Properties

### \_balance

> **\_balance**: `null` \| `bigint` = `null`

Defined in: [packages/util/src/account.ts:53](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L53)

***

### \_codeHash

> **\_codeHash**: `null` \| `Uint8Array` = `null`

Defined in: [packages/util/src/account.ts:55](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L55)

***

### \_codeSize

> **\_codeSize**: `null` \| `number` = `null`

Defined in: [packages/util/src/account.ts:57](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L57)

***

### \_nonce

> **\_nonce**: `null` \| `bigint` = `null`

Defined in: [packages/util/src/account.ts:52](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L52)

***

### \_storageRoot

> **\_storageRoot**: `null` \| `Uint8Array` = `null`

Defined in: [packages/util/src/account.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L54)

***

### \_version

> **\_version**: `null` \| `number` = `null`

Defined in: [packages/util/src/account.ts:58](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L58)

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

Defined in: [packages/util/src/account.ts:82](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L82)

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`_balance`): `void`

Defined in: [packages/util/src/account.ts:89](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L89)

##### Parameters

###### \_balance

`bigint`

##### Returns

`void`

***

### codeHash

#### Get Signature

> **get** **codeHash**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:104](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L104)

##### Returns

`Uint8Array`

#### Set Signature

> **set** **codeHash**(`_codeHash`): `void`

Defined in: [packages/util/src/account.ts:111](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L111)

##### Parameters

###### \_codeHash

`Uint8Array`

##### Returns

`void`

***

### codeSize

#### Get Signature

> **get** **codeSize**(): `number`

Defined in: [packages/util/src/account.ts:115](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L115)

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`_codeSize`): `void`

Defined in: [packages/util/src/account.ts:122](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L122)

##### Parameters

###### \_codeSize

`number`

##### Returns

`void`

***

### nonce

#### Get Signature

> **get** **nonce**(): `bigint`

Defined in: [packages/util/src/account.ts:71](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L71)

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`_nonce`): `void`

Defined in: [packages/util/src/account.ts:78](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L78)

##### Parameters

###### \_nonce

`bigint`

##### Returns

`void`

***

### storageRoot

#### Get Signature

> **get** **storageRoot**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:93](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L93)

##### Returns

`Uint8Array`

#### Set Signature

> **set** **storageRoot**(`_storageRoot`): `void`

Defined in: [packages/util/src/account.ts:100](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L100)

##### Parameters

###### \_storageRoot

`Uint8Array`

##### Returns

`void`

***

### version

#### Get Signature

> **get** **version**(): `number`

Defined in: [packages/util/src/account.ts:60](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L60)

##### Returns

`number`

#### Set Signature

> **set** **version**(`_version`): `void`

Defined in: [packages/util/src/account.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L67)

##### Parameters

###### \_version

`number`

##### Returns

`void`

## Methods

### isContract()

> **isContract**(): `boolean`

Defined in: [packages/util/src/account.ts:237](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L237)

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: [packages/util/src/account.ts:252](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L252)

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`[]

Defined in: [packages/util/src/account.ts:174](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L174)

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:186](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L186)

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

Defined in: [packages/util/src/account.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L190)

#### Returns

`Uint8Array`
