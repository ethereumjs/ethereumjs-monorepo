[@ethereumjs/devp2p](../README.md) / MAC

# Class: MAC

## Table of contents

### Constructors

- [constructor](mac.md#constructor)

### Properties

- [\_hash](mac.md#_hash)
- [\_secret](mac.md#_secret)

### Methods

- [digest](mac.md#digest)
- [update](mac.md#update)
- [updateBody](mac.md#updatebody)
- [updateHeader](mac.md#updateheader)

## Constructors

### constructor

\+ **new MAC**(`secret`: *Buffer*): [*MAC*](mac.md)

#### Parameters:

Name | Type |
:------ | :------ |
`secret` | *Buffer* |

**Returns:** [*MAC*](mac.md)

Defined in: [rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L7)

## Properties

### \_hash

• **\_hash**: *any*

Defined in: [rlpx/mac.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L6)

___

### \_secret

• **\_secret**: *Buffer*

Defined in: [rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L7)

## Methods

### digest

▸ **digest**(): *any*

**Returns:** *any*

Defined in: [rlpx/mac.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L31)

___

### update

▸ **update**(`data`: *string* \| *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *string* \| *Buffer* |

**Returns:** *void*

Defined in: [rlpx/mac.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L13)

___

### updateBody

▸ **updateBody**(`data`: *string* \| *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *string* \| *Buffer* |

**Returns:** *void*

Defined in: [rlpx/mac.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L23)

___

### updateHeader

▸ **updateHeader**(`data`: *string* \| *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *string* \| *Buffer* |

**Returns:** *void*

Defined in: [rlpx/mac.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L17)
