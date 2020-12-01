[ethereumjs-client](../README.md) › ["util/parse"](_util_parse_.md)

# Module: "util/parse"

## Index

### Functions

* [parseBootnodes](_util_parse_.md#parsebootnodes)
* [parseKey](_util_parse_.md#parsekey)
* [parseMultiaddrs](_util_parse_.md#parsemultiaddrs)
* [parseParams](_util_parse_.md#parseparams)
* [parseTransports](_util_parse_.md#parsetransports)

## Functions

###  parseBootnodes

▸ **parseBootnodes**(`input`: [BootnodeLike](_types_.md#bootnodelike)): *[Bootnode](../interfaces/_types_.bootnode.md)[]*

*Defined in [lib/util/parse.ts:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | [BootnodeLike](_types_.md#bootnodelike) |

**Returns:** *[Bootnode](../interfaces/_types_.bootnode.md)[]*

___

###  parseKey

▸ **parseKey**(`input`: string | Buffer): *Buffer‹›*

*Defined in [lib/util/parse.ts:180](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L180)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | string &#124; Buffer |

**Returns:** *Buffer‹›*

___

###  parseMultiaddrs

▸ **parseMultiaddrs**(`input`: [MultiaddrsLike](_types_.md#multiaddrslike)): *[Multiaddrs](_types_.md#multiaddrs)*

*Defined in [lib/util/parse.ts:173](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | [MultiaddrsLike](_types_.md#multiaddrslike) |

**Returns:** *[Multiaddrs](_types_.md#multiaddrs)*

___

###  parseParams

▸ **parseParams**(`json`: any, `name?`: undefined | string): *Promise‹any›*

*Defined in [lib/util/parse.ts:157](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |
`name?` | undefined &#124; string |

**Returns:** *Promise‹any›*

___

###  parseTransports

▸ **parseTransports**(`transports`: string[]): *object[]*

*Defined in [lib/util/parse.ts:34](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/util/parse.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`transports` | string[] |

**Returns:** *object[]*
