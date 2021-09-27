[ethereumjs-util](../README.md) / Account

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

| Name | Type |
| :------ | :------ |
| `nonce` | [`BN`](BN.md) |
| `balance` | [`BN`](BN.md) |
| `stateRoot` | `Buffer` |
| `codeHash` | `Buffer` |

#### Defined in

[packages/util/src/account.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L61)

## Properties

### balance

• **balance**: [`BN`](BN.md)

#### Defined in

[packages/util/src/account.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L26)

___

### codeHash

• **codeHash**: `Buffer`

#### Defined in

[packages/util/src/account.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L28)

___

### nonce

• **nonce**: [`BN`](BN.md)

#### Defined in

[packages/util/src/account.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L25)

___

### stateRoot

• **stateRoot**: `Buffer`

#### Defined in

[packages/util/src/account.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L27)

## Methods

### isContract

▸ **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L112)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L121)

___

### raw

▸ **raw**(): `Buffer`[]

Returns a Buffer Array of the raw Buffers for the account, in order.

#### Returns

`Buffer`[]

#### Defined in

[packages/util/src/account.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L93)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the RLP serialization of the account as a `Buffer`.

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L105)

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

[packages/util/src/account.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L30)

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

[packages/util/src/account.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L41)

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

[packages/util/src/account.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L51)
