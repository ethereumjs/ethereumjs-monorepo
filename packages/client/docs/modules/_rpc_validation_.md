[ethereumjs-client](../README.md) › ["rpc/validation"](_rpc_validation_.md)

# Module: "rpc/validation"

## Index

### Functions

- [middleware](_rpc_validation_.md#middleware)

### Object literals

- [validators](_rpc_validation_.md#const-validators)

## Functions

### middleware

▸ **middleware**(`method`: any, `requiredParamsCount`: number, `validators`: any[]): _any_

_Defined in [lib/rpc/validation.ts:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L10)_

middleware for parameters validation

**`memberof`** module:rpc

**Parameters:**

| Name                  | Type   | Default | Description                |
| --------------------- | ------ | ------- | -------------------------- |
| `method`              | any    | -       | function to add middleware |
| `requiredParamsCount` | number | -       | required parameters count  |
| `validators`          | any[]  | []      | array of validator         |

**Returns:** _any_

## Object literals

### `Const` validators

### ▪ **validators**: _object_

_Defined in [lib/rpc/validation.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L38)_

**`memberof`** module:rpc

### blockHash

▸ **blockHash**(`params`: any[], `index`: number): _any_

_Defined in [lib/rpc/validation.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L68)_

hex validator to validate block hash

**Parameters:**

| Name     | Type   | Description          |
| -------- | ------ | -------------------- |
| `params` | any[]  | parameters of method |
| `index`  | number | index of parameter   |

**Returns:** _any_

### bool

▸ **bool**(`params`: any[], `index`: number): _any_

_Defined in [lib/rpc/validation.ts:95](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L95)_

bool validator to check if type is boolean

**Parameters:**

| Name     | Type   | Description          |
| -------- | ------ | -------------------- |
| `params` | any[]  | parameters of method |
| `index`  | number | index of parameter   |

**Returns:** _any_

### hex

▸ **hex**(`params`: any[], `index`: number): _any_

_Defined in [lib/rpc/validation.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/validation.ts#L44)_

hex validator to ensure has "0x" prefix

**Parameters:**

| Name     | Type   | Description          |
| -------- | ------ | -------------------- |
| `params` | any[]  | parameters of method |
| `index`  | number | index of parameter   |

**Returns:** _any_
