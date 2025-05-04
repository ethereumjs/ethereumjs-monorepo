[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / VerkleAccessedState

# Type Alias: VerkleAccessedState

> **VerkleAccessedState** = \{ `type`: `Exclude`\<[`VerkleAccessedStateType`](VerkleAccessedStateType.md), *typeof* [`Code`](../variables/VerkleAccessedStateType.md#code) \| *typeof* [`Storage`](../variables/VerkleAccessedStateType.md#storage)\>; \} \| \{ `codeOffset`: `number`; `type`: *typeof* [`Code`](../variables/VerkleAccessedStateType.md#code); \} \| \{ `slot`: `bigint`; `type`: *typeof* [`Storage`](../variables/VerkleAccessedStateType.md#storage); \}

Defined in: [interfaces.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L140)
