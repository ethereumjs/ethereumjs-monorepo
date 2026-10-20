[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / GenesisOptions

# Interface: GenesisOptions

Defined in: [types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L96)

## Extended by

- [`BlockchainOptions`](BlockchainOptions.md)

## Properties

### genesisBlock?

> `optional` **genesisBlock?**: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

Defined in: [types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L104)

The blockchain only initializes successfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

***

### genesisState?

> `optional` **genesisState?**: [`GenesisState`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md)

Defined in: [types.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L130)

If you are using a custom chain [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md), pass the genesis state.

Pattern 1 (with genesis state see [GenesisState](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md) for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in [@ethereumjs/common!AccountState](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/type-aliases/AccountState.md) there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

***

### genesisStateRoot?

> `optional` **genesisStateRoot?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L135)

State root of the genesis state
