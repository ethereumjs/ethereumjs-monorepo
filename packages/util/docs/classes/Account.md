[@ethereumjs/util](../README.md) / Account

# Class: Account

## Table of contents

### Constructors

- [constructor](Account.md#constructor)

### Properties

- [balance](Account.md#balance)
- [codeHash](Account.md#codehash)
- [nonce](Account.md#nonce)
- [stateRoot](Account.md#stateroot)

### Methods

- [isContract](Account.md#iscontract)
- [isEmpty](Account.md#isempty)
- [raw](Account.md#raw)
- [serialize](Account.md#serialize)
- [fromAccountData](Account.md#fromaccountdata)
- [fromRlpSerializedAccount](Account.md#fromrlpserializedaccount)
- [fromValuesArray](Account.md#fromvaluesarray)

## Constructors

### constructor

• **new Account**(`nonce?`, `balance?`, `stateRoot?`, `codeHash?`)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `nonce` | `bigint` | `_0n` |
| `balance` | `bigint` | `_0n` |
| `stateRoot` | `Buffer` | `KECCAK256_RLP` |
| `codeHash` | `Buffer` | `KECCAK256_NULL` |

#### Defined in

[account.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L66)

## Properties

### balance

• **balance**: `bigint`

#### Defined in

[account.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L31)

___

### codeHash

• **codeHash**: `Buffer`

#### Defined in

[account.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L33)

___

### nonce

• **nonce**: `bigint`

#### Defined in

[account.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L30)

___

### stateRoot

• **stateRoot**: `Buffer`

#### Defined in

[account.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L32)

## Methods

### isContract

▸ **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

[account.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L112)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

[account.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L121)

___

### raw

▸ **raw**(): `Buffer`[]

Returns a Buffer Array of the raw Buffers for the account, in order.

#### Returns

`Buffer`[]

#### Defined in

[account.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L93)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the RLP serialization of the account as a `Buffer`.

#### Returns

`Buffer`

#### Defined in

[account.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L105)

___

### fromAccountData

▸ `Static` **fromAccountData**(`accountData`): [`Account`](Account.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountData` | [`AccountData`](../interfaces/AccountData.md) |

#### Returns

[`Account`](Account.md)

#### Defined in

[account.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L35)

___

### fromRlpSerializedAccount

▸ `Static` **fromRlpSerializedAccount**(`serialized`): [`Account`](Account.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |

#### Returns

[`Account`](Account.md)

#### Defined in

[account.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L46)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`): [`Account`](Account.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Buffer`[] |

#### Returns

[`Account`](Account.md)

#### Defined in

[account.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L56)
