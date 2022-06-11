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
| `nonce` | [`BN`](BN.md) | `undefined` |
| `balance` | [`BN`](BN.md) | `undefined` |
| `stateRoot` | `Buffer` | `KECCAK256_RLP` |
| `codeHash` | `Buffer` | `KECCAK256_NULL` |

#### Defined in

[packages/util/src/account.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L60)

## Properties

### balance

• **balance**: [`BN`](BN.md)

#### Defined in

[packages/util/src/account.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L25)

___

### codeHash

• **codeHash**: `Buffer`

#### Defined in

[packages/util/src/account.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L27)

___

### nonce

• **nonce**: [`BN`](BN.md)

#### Defined in

[packages/util/src/account.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L24)

___

### stateRoot

• **stateRoot**: `Buffer`

#### Defined in

[packages/util/src/account.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L26)

## Methods

### isContract

▸ **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L111)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L120)

___

### raw

▸ **raw**(): `Buffer`[]

Returns a Buffer Array of the raw Buffers for the account, in order.

#### Returns

`Buffer`[]

#### Defined in

[packages/util/src/account.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L92)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the RLP serialization of the account as a `Buffer`.

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L104)

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

[packages/util/src/account.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L29)

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

[packages/util/src/account.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L40)

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

[packages/util/src/account.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L50)
