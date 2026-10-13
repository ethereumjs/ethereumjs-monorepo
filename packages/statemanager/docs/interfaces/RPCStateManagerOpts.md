[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCStateManagerOpts

# Interface: RPCStateManagerOpts

Defined in: [types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L25)

Options for constructing a [RPCStateManager](../classes/RPCStateManager.md).

## Extends

- `BaseStateManagerOpts`

## Properties

### blockTag

> **blockTag**: `bigint` \| `"earliest"`

Defined in: [types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L29)

Block number (hex) or `'earliest'` to pin state reads

***

### common?

> `optional` **common?**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L14)

The common to use

#### Inherited from

`BaseStateManagerOpts.common`

***

### provider

> **provider**: `string`

Defined in: [types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L27)

HTTP(S) JSON-RPC endpoint URL
