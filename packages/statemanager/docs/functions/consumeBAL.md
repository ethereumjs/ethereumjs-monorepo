[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / consumeBAL

# Function: consumeBAL()

> **consumeBAL**(`stateManager`, `bal`, `expectedStateRoot?`): `Promise`\<`void`\>

Defined in: [consumeBAL.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/consumeBAL.ts#L26)

Apply an EIP-7928 block-level access list onto `stateManager` without
executing transactions. Last post-balance / nonce / code / storage win;
EIP-161 empty accounts are deleted. Optionally checks `expectedStateRoot`.

Shared by every state manager in this package (`sm.consumeBAL(...)`).
Custom `StateManagerInterface` implementations can call this helper or
leave `consumeBAL` unimplemented (it is optional on the interface).

## Parameters

### stateManager

[`StateManagerInterface`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/StateManagerInterface.md)

### bal

`BALJSONBlockAccessList`

### expectedStateRoot?

`Uint8Array`\<`ArrayBufferLike`\>

## Returns

`Promise`\<`void`\>

## Remarks

Experimental (Amsterdam): may change on patch releases.
