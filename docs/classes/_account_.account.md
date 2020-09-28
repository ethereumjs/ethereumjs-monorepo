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
* [serialize](_account_.account.md#serialize)
* [fromAccountData](_account_.account.md#static-fromaccountdata)
* [fromRlpSerializedAccount](_account_.account.md#static-fromrlpserializedaccount)
* [fromValuesArray](_account_.account.md#static-fromvaluesarray)

## Constructors

###  constructor

\+ **new Account**(`nonce`: BN‹›, `balance`: BN‹›, `stateRoot`: Buffer‹›, `codeHash`: Buffer‹›): *[Account](_account_.account.md)*

*Defined in [account.ts:61](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L61)*

This constructor takes the values, validates and assigns them.
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

*Defined in [account.ts:27](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L27)*

___

###  codeHash

• **codeHash**: *Buffer*

*Defined in [account.ts:29](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L29)*

___

###  nonce

• **nonce**: *BN*

*Defined in [account.ts:26](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L26)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [account.ts:28](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L28)*

## Methods

###  isContract

▸ **isContract**(): *boolean*

*Defined in [account.ts:96](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L96)*

Returns a `Boolean` deteremining if the account is a contract.

**Returns:** *boolean*

___

###  isEmpty

▸ **isEmpty**(): *boolean*

*Defined in [account.ts:103](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L103)*

Returns a `Boolean` determining if the account is empty.

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [account.ts:89](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L89)*

Returns the RLP serialization of the account as a `Buffer`.

**Returns:** *Buffer*

___

### `Static` fromAccountData

▸ **fromAccountData**(`accountData`: [AccountData](../interfaces/_account_.accountdata.md)): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:31](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`accountData` | [AccountData](../interfaces/_account_.accountdata.md) |

**Returns:** *[Account](_account_.account.md)‹›*

___

### `Static` fromRlpSerializedAccount

▸ **fromRlpSerializedAccount**(`serialized`: Buffer): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:42](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`serialized` | Buffer |

**Returns:** *[Account](_account_.account.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: Buffer[]): *[Account](_account_.account.md)‹›*

*Defined in [account.ts:52](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`values` | Buffer[] |

**Returns:** *[Account](_account_.account.md)‹›*
