**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["rlpx/mac"](../modules/_rlpx_mac_.md) / MAC

# Class: MAC

## Hierarchy

* **MAC**

## Index

### Constructors

* [constructor](_rlpx_mac_.mac.md#constructor)

### Properties

* [\_hash](_rlpx_mac_.mac.md#_hash)
* [\_secret](_rlpx_mac_.mac.md#_secret)

### Methods

* [digest](_rlpx_mac_.mac.md#digest)
* [update](_rlpx_mac_.mac.md#update)
* [updateBody](_rlpx_mac_.mac.md#updatebody)
* [updateHeader](_rlpx_mac_.mac.md#updateheader)

## Constructors

### constructor

\+ **new MAC**(`secret`: Buffer): [MAC](_rlpx_mac_.mac.md)

*Defined in [src/rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L7)*

#### Parameters:

Name | Type |
------ | ------ |
`secret` | Buffer |

**Returns:** [MAC](_rlpx_mac_.mac.md)

## Properties

### \_hash

•  **\_hash**: any

*Defined in [src/rlpx/mac.ts:6](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L6)*

___

### \_secret

•  **\_secret**: Buffer

*Defined in [src/rlpx/mac.ts:7](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L7)*

## Methods

### digest

▸ **digest**(): any

*Defined in [src/rlpx/mac.ts:31](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L31)*

**Returns:** any

___

### update

▸ **update**(`data`: Buffer \| string): void

*Defined in [src/rlpx/mac.ts:13](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L13)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer \| string |

**Returns:** void

___

### updateBody

▸ **updateBody**(`data`: Buffer \| string): void

*Defined in [src/rlpx/mac.ts:23](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L23)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer \| string |

**Returns:** void

___

### updateHeader

▸ **updateHeader**(`data`: Buffer \| string): void

*Defined in [src/rlpx/mac.ts:17](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/mac.ts#L17)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer \| string |

**Returns:** void
