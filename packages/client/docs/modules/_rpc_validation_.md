[ethereumjs-client](../README.md) › ["rpc/validation"](_rpc_validation_.md)

# Module: "rpc/validation"

## Index

### Functions

* [middleware](_rpc_validation_.md#middleware)

### Object literals

* [validators](_rpc_validation_.md#const-validators)

## Functions

###  middleware

▸ **middleware**(`method`: any, `requiredParamsCount`: number, `validators`: any[]): *any*

*Defined in [lib/rpc/validation.ts:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L10)*

middleware for parameters validation

**`memberof`** module:rpc

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`method` | any | - | function to add middleware |
`requiredParamsCount` | number | - | required parameters count |
`validators` | any[] | [] | array of validator  |

**Returns:** *any*

## Object literals

### `Const` validators

### ▪ **validators**: *object*

*Defined in [lib/rpc/validation.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L38)*

**`memberof`** module:rpc

###  blockHash

▸ **blockHash**(`params`: any[], `index`: number): *any*

*Defined in [lib/rpc/validation.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L68)*

hex validator to validate block hash

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | any[] | parameters of method |
`index` | number | index of parameter  |

**Returns:** *any*

###  bool

▸ **bool**(`params`: any[], `index`: number): *any*

*Defined in [lib/rpc/validation.ts:95](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L95)*

bool validator to check if type is boolean

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | any[] | parameters of method |
`index` | number | index of parameter  |

**Returns:** *any*

###  hex

▸ **hex**(`params`: any[], `index`: number): *any*

*Defined in [lib/rpc/validation.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L44)*

hex validator to ensure has "0x" prefix

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | any[] | parameters of method |
`index` | number | index of parameter  |

**Returns:** *any*
