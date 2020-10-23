[@ethereumjs/vm](../README.md) › ["evm/opcodes/util"](_evm_opcodes_util_.md)

# Module: "evm/opcodes/util"

## Index

### Functions

* [addressToBuffer](_evm_opcodes_util_.md#addresstobuffer)
* [describeLocation](_evm_opcodes_util_.md#describelocation)
* [divCeil](_evm_opcodes_util_.md#divceil)
* [getContractStorage](_evm_opcodes_util_.md#getcontractstorage)
* [getDataSlice](_evm_opcodes_util_.md#getdataslice)
* [getFullname](_evm_opcodes_util_.md#getfullname)
* [jumpIsValid](_evm_opcodes_util_.md#jumpisvalid)
* [jumpSubIsValid](_evm_opcodes_util_.md#jumpsubisvalid)
* [maxCallGas](_evm_opcodes_util_.md#maxcallgas)
* [setLengthLeftStorage](_evm_opcodes_util_.md#setlengthleftstorage)
* [subMemUsage](_evm_opcodes_util_.md#submemusage)
* [trap](_evm_opcodes_util_.md#trap)
* [writeCallOutput](_evm_opcodes_util_.md#writecalloutput)

## Functions

###  addressToBuffer

▸ **addressToBuffer**(`address`: BN | Buffer): *Buffer‹›*

*Defined in [evm/opcodes/util.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L38)*

Converts BN address (they're stored like this on the stack) to buffer address

**Parameters:**

Name | Type |
------ | ------ |
`address` | BN &#124; Buffer |

**Returns:** *Buffer‹›*

___

###  describeLocation

▸ **describeLocation**(`runState`: RunState): *string*

*Defined in [evm/opcodes/util.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L49)*

Error message helper - generates location string

**Parameters:**

Name | Type |
------ | ------ |
`runState` | RunState |

**Returns:** *string*

___

###  divCeil

▸ **divCeil**(`a`: BN, `b`: BN): *BN*

*Defined in [evm/opcodes/util.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L63)*

Find Ceil(a / b)

**Parameters:**

Name | Type |
------ | ------ |
`a` | BN |
`b` | BN |

**Returns:** *BN*

___

###  getContractStorage

▸ **getContractStorage**(`runState`: RunState, `address`: Address, `key`: Buffer): *Promise‹any›*

*Defined in [evm/opcodes/util.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L82)*

Calls relevant stateManager.getContractStorage method based on hardfork

**Parameters:**

Name | Type |
------ | ------ |
`runState` | RunState |
`address` | Address |
`key` | Buffer |

**Returns:** *Promise‹any›*

___

###  getDataSlice

▸ **getDataSlice**(`data`: Buffer, `offset`: BN, `length`: BN): *Buffer*

*Defined in [evm/opcodes/util.ts:110](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L110)*

Returns an overflow-safe slice of an array. It right-pads
the data with zeros to `length`.

**Parameters:**

Name | Type |
------ | ------ |
`data` | Buffer |
`offset` | BN |
`length` | BN |

**Returns:** *Buffer*

___

###  getFullname

▸ **getFullname**(`code`: number, `name`: string): *string*

*Defined in [evm/opcodes/util.ts:135](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L135)*

Get full opcode name from its name and code.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`code` | number | Integer code of opcode. |
`name` | string | Short name of the opcode. |

**Returns:** *string*

Full opcode name

___

###  jumpIsValid

▸ **jumpIsValid**(`runState`: RunState, `dest`: number): *boolean*

*Defined in [evm/opcodes/util.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L160)*

Checks if a jump is valid given a destination

**Parameters:**

Name | Type |
------ | ------ |
`runState` | RunState |
`dest` | number |

**Returns:** *boolean*

___

###  jumpSubIsValid

▸ **jumpSubIsValid**(`runState`: RunState, `dest`: number): *boolean*

*Defined in [evm/opcodes/util.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L171)*

Checks if a jumpsub is valid given a destination

**Parameters:**

Name | Type |
------ | ------ |
`runState` | RunState |
`dest` | number |

**Returns:** *boolean*

___

###  maxCallGas

▸ **maxCallGas**(`gasLimit`: BN, `gasLeft`: BN, `runState`: RunState): *BN*

*Defined in [evm/opcodes/util.ts:183](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L183)*

Returns an overflow-safe slice of an array. It right-pads

the data with zeros to `length`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`gasLimit` | BN | requested gas Limit |
`gasLeft` | BN | current gas left |
`runState` | RunState | the current runState  |

**Returns:** *BN*

___

###  setLengthLeftStorage

▸ **setLengthLeftStorage**(`value`: Buffer): *Buffer‹›*

*Defined in [evm/opcodes/util.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L13)*

Proxy function for ethereumjs-util's setLengthLeft, except it returns a zero

length buffer in case the buffer is full of zeros.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | Buffer | Buffer which we want to pad  |

**Returns:** *Buffer‹›*

___

###  subMemUsage

▸ **subMemUsage**(`runState`: RunState, `offset`: BN, `length`: BN): *void*

*Defined in [evm/opcodes/util.ts:201](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L201)*

Subtracts the amount needed for memory usage from `runState.gasLeft`

**`method`** subMemUsage

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`offset` | BN | - |
`length` | BN |   |

**Returns:** *void*

___

###  trap

▸ **trap**(`err`: string): *void*

*Defined in [evm/opcodes/util.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L27)*

Wraps error message as VMError

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`err` | string |   |

**Returns:** *void*

___

###  writeCallOutput

▸ **writeCallOutput**(`runState`: RunState, `outOffset`: BN, `outLength`: BN): *void*

*Defined in [evm/opcodes/util.ts:229](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L229)*

Writes data returned by eei.call* methods to memory

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`outOffset` | BN | - |
`outLength` | BN |   |

**Returns:** *void*
