[@ethereumjs/evm](../README.md) / Message

# Class: Message

## Table of contents

### Constructors

- [constructor](Message.md#constructor)

### Properties

- [\_codeAddress](Message.md#_codeaddress)
- [authcallOrigin](Message.md#authcallorigin)
- [caller](Message.md#caller)
- [code](Message.md#code)
- [containerCode](Message.md#containercode)
- [data](Message.md#data)
- [delegatecall](Message.md#delegatecall)
- [depth](Message.md#depth)
- [gasLimit](Message.md#gaslimit)
- [gasRefund](Message.md#gasrefund)
- [isCompiled](Message.md#iscompiled)
- [isStatic](Message.md#isstatic)
- [salt](Message.md#salt)
- [selfdestruct](Message.md#selfdestruct)
- [to](Message.md#to)
- [value](Message.md#value)
- [versionedHashes](Message.md#versionedhashes)

### Accessors

- [codeAddress](Message.md#codeaddress)

## Constructors

### constructor

• **new Message**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `MessageOpts` |

#### Defined in

[message.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L68)

## Properties

### \_codeAddress

• `Optional` **\_codeAddress**: `Address`

#### Defined in

[message.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L46)

___

### authcallOrigin

• `Optional` **authcallOrigin**: `Address`

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Defined in

[message.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L61)

___

### caller

• **caller**: `Address`

#### Defined in

[message.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L41)

___

### code

• `Optional` **code**: `Buffer` \| `PrecompileFunc`

#### Defined in

[message.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L45)

___

### containerCode

• `Optional` **containerCode**: `Buffer`

#### Defined in

[message.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L50)

___

### data

• **data**: `Buffer`

#### Defined in

[message.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L43)

___

### delegatecall

• **delegatecall**: `boolean`

#### Defined in

[message.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L56)

___

### depth

• **depth**: `number`

#### Defined in

[message.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L44)

___

### gasLimit

• **gasLimit**: `bigint`

#### Defined in

[message.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L42)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[message.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L62)

___

### isCompiled

• **isCompiled**: `boolean`

#### Defined in

[message.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L48)

___

### isStatic

• **isStatic**: `boolean`

#### Defined in

[message.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L47)

___

### salt

• `Optional` **salt**: `Buffer`

#### Defined in

[message.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L49)

___

### selfdestruct

• `Optional` **selfdestruct**: { `[key: string]`: `boolean`;  } \| { `[key: string]`: `Buffer`;  }

Map of addresses to selfdestruct. Key is the unprefixed address.
Value is a boolean when marked for destruction and replaced with a Buffer containing the address where the remaining funds are sent.

#### Defined in

[message.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L55)

___

### to

• `Optional` **to**: `Address`

#### Defined in

[message.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L39)

___

### value

• **value**: `bigint`

#### Defined in

[message.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L40)

___

### versionedHashes

• `Optional` **versionedHashes**: `Buffer`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Defined in

[message.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L66)

## Accessors

### codeAddress

• `get` **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Returns

`Address`

#### Defined in

[message.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L93)
