[ethereumjs-vm](../README.md) > [RunBlockCb](../interfaces/runblockcb.md)

# Interface: RunBlockCb

Callback function for [runBlock](../classes/vm.md#runblock)

## Hierarchy

**RunBlockCb**

## Callable
▸ **__call**(err: *`Error` \| `null`*, result: *[RunBlockResult](runblockresult.md) \| `null`*): `void`

*Defined in [runBlock.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/runBlock.ts#L37)*

Callback function for [runBlock](../classes/vm.md#runblock)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| err | `Error` \| `null` |  Any error that happened during execution, or \`null\` |
| result | [RunBlockResult](runblockresult.md) \| `null` |  Result of execution, \`null\` in case of error |

**Returns:** `void`

## Index

---

