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
- [createdAddresses](Message.md#createdaddresses)
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

[message.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L75)

## Properties

### \_codeAddress

• `Optional` **\_codeAddress**: `Address`

#### Defined in

[message.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L50)

___

### authcallOrigin

• `Optional` **authcallOrigin**: `Address`

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Defined in

[message.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L68)

___

### caller

• **caller**: `Address`

#### Defined in

[message.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L45)

___

### code

• `Optional` **code**: `Uint8Array` \| `PrecompileFunc`

#### Defined in

[message.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L49)

___

### containerCode

• `Optional` **containerCode**: `Uint8Array`

#### Defined in

[message.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L54)

___

### createdAddresses

• `Optional` **createdAddresses**: `Set`<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

[message.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L62)

___

### data

• **data**: `Uint8Array`

#### Defined in

[message.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L47)

___

### delegatecall

• **delegatecall**: `boolean`

#### Defined in

[message.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L63)

___

### depth

• **depth**: `number`

#### Defined in

[message.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L48)

___

### gasLimit

• **gasLimit**: `bigint`

#### Defined in

[message.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L46)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[message.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L69)

___

### isCompiled

• **isCompiled**: `boolean`

#### Defined in

[message.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L52)

___

### isStatic

• **isStatic**: `boolean`

#### Defined in

[message.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L51)

___

### salt

• `Optional` **salt**: `Uint8Array`

#### Defined in

[message.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L53)

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`<`string`\>

Set of addresses to selfdestruct. Key is the unprefixed address.

#### Defined in

[message.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L58)

___

### to

• `Optional` **to**: `Address`

#### Defined in

[message.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L43)

___

### value

• **value**: `bigint`

#### Defined in

[message.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L44)

___

### versionedHashes

• `Optional` **versionedHashes**: `Uint8Array`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Defined in

[message.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L73)

## Accessors

### codeAddress

• `get` **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Returns

`Address`

#### Defined in

[message.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/message.ts#L101)
