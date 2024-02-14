[@ethereumjs/util](../README.md) / Account

# Class: Account

## Table of contents

### Constructors

- [constructor](Account.md#constructor)

### Properties

- [balance](Account.md#balance)
- [codeHash](Account.md#codehash)
- [nonce](Account.md#nonce)
- [storageRoot](Account.md#storageroot)

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

• **new Account**(`nonce?`, `balance?`, `storageRoot?`, `codeHash?`)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `nonce` | `bigint` | `BIGINT_0` |
| `balance` | `bigint` | `BIGINT_0` |
| `storageRoot` | `Uint8Array` | `KECCAK256_RLP` |
| `codeHash` | `Uint8Array` | `KECCAK256_NULL` |

#### Defined in

[packages/util/src/account.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L68)

## Properties

### balance

• **balance**: `bigint`

#### Defined in

[packages/util/src/account.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L33)

___

### codeHash

• **codeHash**: `Uint8Array`

#### Defined in

[packages/util/src/account.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L35)

___

### nonce

• **nonce**: `bigint`

#### Defined in

[packages/util/src/account.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L32)

___

### storageRoot

• **storageRoot**: `Uint8Array`

#### Defined in

[packages/util/src/account.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L34)

## Methods

### isContract

▸ **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L119)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L128)

___

### raw

▸ **raw**(): `Uint8Array`[]

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`[]

#### Defined in

[packages/util/src/account.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L100)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

#### Defined in

[packages/util/src/account.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L112)

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

[packages/util/src/account.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L37)

___

### fromRlpSerializedAccount

▸ `Static` **fromRlpSerializedAccount**(`serialized`): [`Account`](Account.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |

#### Returns

[`Account`](Account.md)

#### Defined in

[packages/util/src/account.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L48)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`): [`Account`](Account.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Uint8Array`[] |

#### Returns

[`Account`](Account.md)

#### Defined in

[packages/util/src/account.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L58)
