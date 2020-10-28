**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / "util"

# Module: "util"

## Index

### Classes

* [Deferred](../classes/_util_.deferred.md)

### Functions

* [assertEq](_util_.md#asserteq)
* [buffer2int](_util_.md#buffer2int)
* [createDeferred](_util_.md#createdeferred)
* [formatLogData](_util_.md#formatlogdata)
* [formatLogId](_util_.md#formatlogid)
* [genPrivateKey](_util_.md#genprivatekey)
* [id2pk](_util_.md#id2pk)
* [int2buffer](_util_.md#int2buffer)
* [keccak256](_util_.md#keccak256)
* [pk2id](_util_.md#pk2id)
* [xor](_util_.md#xor)
* [zfill](_util_.md#zfill)

## Functions

### assertEq

▸ **assertEq**(`expected`: any, `actual`: any, `msg`: string, `debug`: any): void

*Defined in [src/util.ts:57](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L57)*

#### Parameters:

Name | Type |
------ | ------ |
`expected` | any |
`actual` | any |
`msg` | string |
`debug` | any |

**Returns:** void

___

### buffer2int

▸ **buffer2int**(`buffer`: Buffer): number

*Defined in [src/util.ts:35](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L35)*

#### Parameters:

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** number

___

### createDeferred

▸ **createDeferred**\<T>(): [Deferred](../classes/_index_.deferred.md)\<T>

*Defined in [src/util.ts:106](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L106)*

#### Type parameters:

Name |
------ |
`T` |

**Returns:** [Deferred](../classes/_index_.deferred.md)\<T>

___

### formatLogData

▸ **formatLogData**(`data`: string, `verbose`: boolean): string

*Defined in [src/util.ts:85](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L85)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | string |
`verbose` | boolean |

**Returns:** string

___

### formatLogId

▸ **formatLogId**(`id`: string, `verbose`: boolean): string

*Defined in [src/util.ts:76](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L76)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`verbose` | boolean |

**Returns:** string

___

### genPrivateKey

▸ **genPrivateKey**(): Buffer

*Defined in [src/util.ts:13](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L13)*

**Returns:** Buffer

___

### id2pk

▸ **id2pk**(`id`: Buffer): Buffer

*Defined in [src/util.ts:25](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L25)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | Buffer |

**Returns:** Buffer

___

### int2buffer

▸ **int2buffer**(`v`: number): Buffer

*Defined in [src/util.ts:29](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L29)*

#### Parameters:

Name | Type |
------ | ------ |
`v` | number |

**Returns:** Buffer

___

### keccak256

▸ **keccak256**(...`buffers`: Buffer[]): Buffer

*Defined in [src/util.ts:6](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L6)*

#### Parameters:

Name | Type |
------ | ------ |
`...buffers` | Buffer[] |

**Returns:** Buffer

___

### pk2id

▸ **pk2id**(`pk`: Buffer): Buffer

*Defined in [src/util.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L18)*

#### Parameters:

Name | Type |
------ | ------ |
`pk` | Buffer |

**Returns:** Buffer

___

### xor

▸ **xor**(`a`: Buffer, `b`: any): Buffer

*Defined in [src/util.ts:50](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L50)*

#### Parameters:

Name | Type |
------ | ------ |
`a` | Buffer |
`b` | any |

**Returns:** Buffer

___

### zfill

▸ **zfill**(`buffer`: Buffer, `size`: number, `leftpad?`: boolean): Buffer

*Defined in [src/util.ts:43](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L43)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`buffer` | Buffer | - |
`size` | number | - |
`leftpad` | boolean | true |

**Returns:** Buffer
