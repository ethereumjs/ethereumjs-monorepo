[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / GenesisState

# Interface: GenesisState

Defined in: [gethGenesis.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/gethGenesis.ts#L142)

If you are using a custom chain [Common](../classes/Common.md), pass the genesis state.

Pattern 1 (with genesis state see GenesisState for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in [AccountState](../type-aliases/AccountState.md) there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

## Indexable

\[`key`: `` `0x${string}` ``\]: `` `0x${string}` `` \| [`AccountState`](../type-aliases/AccountState.md)
