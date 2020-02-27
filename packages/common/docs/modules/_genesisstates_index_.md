[ethereumjs-common](../README.md) › ["genesisStates/index"](_genesisstates_index_.md)

# Module: "genesisStates/index"

## Index

### Functions

- [genesisStateById](_genesisstates_index_.md#genesisstatebyid)
- [genesisStateByName](_genesisstates_index_.md#genesisstatebyname)

## Functions

### genesisStateById

▸ **genesisStateById**(`id`: number): _any_

_Defined in [genesisStates/index.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/genesisStates/index.ts#L23)_

Returns the genesis state by network ID

**Parameters:**

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| `id` | number | ID of the network (e.g. 1) |

**Returns:** _any_

Dictionary with genesis accounts

---

### genesisStateByName

▸ **genesisStateByName**(`name`: string): _any_

_Defined in [genesisStates/index.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/genesisStates/index.ts#L32)_

Returns the genesis state by network name

**Parameters:**

| Name   | Type   | Description                          |
| ------ | ------ | ------------------------------------ |
| `name` | string | Name of the network (e.g. 'mainnet') |

**Returns:** _any_

Dictionary with genesis accounts
