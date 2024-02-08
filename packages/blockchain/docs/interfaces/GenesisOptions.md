[@ethereumjs/blockchain](../README.md) / GenesisOptions

# Interface: GenesisOptions

## Hierarchy

- **`GenesisOptions`**

  ↳ [`BlockchainOptions`](BlockchainOptions.md)

## Table of contents

### Properties

- [genesisBlock](GenesisOptions.md#genesisblock)
- [genesisState](GenesisOptions.md#genesisstate)
- [genesisStateRoot](GenesisOptions.md#genesisstateroot)

## Properties

### genesisBlock

• `Optional` **genesisBlock**: `Block`

The blockchain only initializes successfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

#### Defined in

[types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L101)

___

### genesisState

• `Optional` **genesisState**: `GenesisState`

If you are using a custom chain Common, pass the genesis state.

Pattern 1 (with genesis state see GenesisState for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in AccountState there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

#### Defined in

[types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L127)

___

### genesisStateRoot

• `Optional` **genesisStateRoot**: `Uint8Array`

State root of the genesis state

#### Defined in

[types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L132)
