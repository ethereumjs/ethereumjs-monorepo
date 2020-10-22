[@ethereumjs/vm](../README.md) › ["lib/evm/opcodes/util"](_lib_evm_opcodes_util_.md)

# Module: "lib/evm/opcodes/util"

## Index

### Functions

* [addressToBuffer](_lib_evm_opcodes_util_.md#addresstobuffer)
* [describeLocation](_lib_evm_opcodes_util_.md#describelocation)
* [divCeil](_lib_evm_opcodes_util_.md#divceil)
* [getContractStorage](_lib_evm_opcodes_util_.md#getcontractstorage)
* [getDataSlice](_lib_evm_opcodes_util_.md#getdataslice)
* [getFullname](_lib_evm_opcodes_util_.md#getfullname)
* [jumpIsValid](_lib_evm_opcodes_util_.md#jumpisvalid)
* [jumpSubIsValid](_lib_evm_opcodes_util_.md#jumpsubisvalid)
* [maxCallGas](_lib_evm_opcodes_util_.md#maxcallgas)
* [setLengthLeftStorage](_lib_evm_opcodes_util_.md#setlengthleftstorage)
* [subMemUsage](_lib_evm_opcodes_util_.md#submemusage)
* [trap](_lib_evm_opcodes_util_.md#trap)
* [writeCallOutput](_lib_evm_opcodes_util_.md#writecalloutput)

## Functions

###  addressToBuffer

▸ **addressToBuffer**(`address`: BN | Buffer): *Buffer‹›*

*Defined in [lib/evm/opcodes/util.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L39)*

Converts BN address (they're stored like this on the stack) to buffer address

**Parameters:**

Name | Type |
------ | ------ |
`address` | BN &#124; Buffer |

**Returns:** *Buffer‹›*

___

###  describeLocation

▸ **describeLocation**(`runState`: RunState): *string*

*Defined in [lib/evm/opcodes/util.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L50)*

Error message helper - generates location string

**Parameters:**

Name | Type |
------ | ------ |
`runState` | RunState |

**Returns:** *string*

___

###  divCeil

▸ **divCeil**(`a`: BN, `b`: BN): *BN*

*Defined in [lib/evm/opcodes/util.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L64)*

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

*Defined in [lib/evm/opcodes/util.ts:83](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L83)*

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

*Defined in [lib/evm/opcodes/util.ts:111](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L111)*

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

*Defined in [lib/evm/opcodes/util.ts:136](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L136)*

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

*Defined in [lib/evm/opcodes/util.ts:161](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L161)*

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

*Defined in [lib/evm/opcodes/util.ts:172](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L172)*

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

*Defined in [lib/evm/opcodes/util.ts:184](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L184)*

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

*Defined in [lib/evm/opcodes/util.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L14)*

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

*Defined in [lib/evm/opcodes/util.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L202)*

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

*Defined in [lib/evm/opcodes/util.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L28)*

Wraps error message as VMError

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`err` | string |   |

**Returns:** *void*

___

###  writeCallOutput

▸ **writeCallOutput**(`runState`: RunState, `outOffset`: BN, `outLength`: BN): *void*

*Defined in [lib/evm/opcodes/util.ts:230](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/util.ts#L230)*

Writes data returned by eei.call* methods to memory

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`outOffset` | BN | - |
`outLength` | BN |   |

**Returns:** *void*
