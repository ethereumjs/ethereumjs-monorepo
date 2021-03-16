[ethereumjs-util](../README.md) › ["account"](../modules/_account_.md) › [Account](_account_.account.md)

# Class: Account

## Hierarchy

* **Account**

## Index

### Constructors

* [constructor](_account_.account.md#constructor)

### Properties

* [balance](_account_.account.md#balance)
* [codeHash](_account_.account.md#codehash)
* [nonce](_account_.account.md#nonce)
* [stateRoot](_account_.account.md#stateroot)

### Methods

* [isContract](_account_.account.md#iscontract)
* [isEmpty](_account_.account.md#isempty)
* [raw](_account_.account.md#raw)
* [serialize](_account_.account.md#serialize)
* [fromAccountData](_account_.account.md#static-fromaccountdata)
* [fromRlpSerializedAccount](_account_.account.md#static-fromrlpserializedaccount)
* [fromValuesArray](_account_.account.md#static-fromvaluesarray)

## Constructors

###  constructor

\+ **new Account**(`nonce`: BN‹›, `balance`: BN‹›, `stateRoot`: Buffer‹›, `codeHash`: Buffer‹›): *[Account](_account_.account.md)*

*Defined in [account.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L55)*

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`nonce` | BN‹› | new BN(0) |
`balance` | BN‹› | new BN(0) |
`stateRoot` | Buffer‹› | KECCAK256_RLP |
`codeHash` | Buffer‹› | KECCAK256_NULL |

**Returns:** *[Account](_account_.account.md)*

## Properties

###  balance

• **balance**: *BN*

*Defined in [account.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L26)*

___

###  codeHash

• **codeHash**: *Buffer*

*Defined in [account.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L28)*

___

###  nonce

• **nonce**: *BN*

*Defined in [account.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L25)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [account.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L27)*

## Methods

###  isContract

▸ **isContract**(): *boolean*

*Defined in [account.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L107)*

Returns a `Boolean` determining if the account is a contract.

**Returns:** *boolean*

___

###  isEmpty

▸ **isEmpty**(): *boolean*

*Defined in [account.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L116)*

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *Buffer[]*

*Defined in [account.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L93)*

Returns a Buffer Array of the raw Buffers for the account, in order.

**Returns:** *Buffer[]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [account.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L100)*

Returns the RLP serialization of the account as a `Buffer`.

**Returns:** *Buffer*

___

### `Static` fromAccountData

▸ **fromAccountData**(`accountData`: [AccountData](../interfaces/_account_.accountdata.md)): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`accountData` | [AccountData](../interfaces/_account_.accountdata.md) |

**Returns:** *[Account](_account_.account.md)‹›*

___

### `Static` fromRlpSerializedAccount

▸ **fromRlpSerializedAccount**(`serialized`: Buffer): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`serialized` | Buffer |

**Returns:** *[Account](_account_.account.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: Buffer[]): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`values` | Buffer[] |

**Returns:** *[Account](_account_.account.md)‹›*
