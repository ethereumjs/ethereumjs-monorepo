[ethereumjs-client](../README.md) › ["util/parse"](_util_parse_.md)

# Module: "util/parse"

## Index

### Functions

- [parseBootnodes](_util_parse_.md#parsebootnodes)
- [parseKey](_util_parse_.md#parsekey)
- [parseMultiaddrs](_util_parse_.md#parsemultiaddrs)
- [parseParams](_util_parse_.md#parseparams)
- [parseTransports](_util_parse_.md#parsetransports)

## Functions

### parseBootnodes

▸ **parseBootnodes**(`input`: [BootnodeLike](_types_.md#bootnodelike)): _[Bootnode](../interfaces/_types_.bootnode.md)[]_

_Defined in [lib/util/parse.ts:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L7)_

**Parameters:**

| Name    | Type                                    |
| ------- | --------------------------------------- |
| `input` | [BootnodeLike](_types_.md#bootnodelike) |

**Returns:** _[Bootnode](../interfaces/_types_.bootnode.md)[]_

---

### parseKey

▸ **parseKey**(`input`: string | Buffer): _Buffer‹›_

_Defined in [lib/util/parse.ts:180](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L180)_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `input` | string &#124; Buffer |

**Returns:** _Buffer‹›_

---

### parseMultiaddrs

▸ **parseMultiaddrs**(`input`: [MultiaddrsLike](_types_.md#multiaddrslike)): _[Multiaddrs](_types_.md#multiaddrs)_

_Defined in [lib/util/parse.ts:173](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L173)_

**Parameters:**

| Name    | Type                                        |
| ------- | ------------------------------------------- |
| `input` | [MultiaddrsLike](_types_.md#multiaddrslike) |

**Returns:** _[Multiaddrs](_types_.md#multiaddrs)_

---

### parseParams

▸ **parseParams**(`json`: any, `name?`: undefined | string): _Promise‹any›_

_Defined in [lib/util/parse.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L157)_

**Parameters:**

| Name    | Type                    |
| ------- | ----------------------- |
| `json`  | any                     |
| `name?` | undefined &#124; string |

**Returns:** _Promise‹any›_

---

### parseTransports

▸ **parseTransports**(`transports`: string[]): _object[]_

_Defined in [lib/util/parse.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L34)_

**Parameters:**

| Name         | Type     |
| ------------ | -------- |
| `transports` | string[] |

**Returns:** _object[]_
