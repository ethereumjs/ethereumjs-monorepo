[@ethereumjs/common](../README.md) / genesisStates

# Module: genesisStates

## Table of contents

### Functions

- [genesisStateById](genesisstates.md#genesisstatebyid)
- [genesisStateByName](genesisstates.md#genesisstatebyname)

## Functions

### genesisStateById

▸ **genesisStateById**(`id`: *number*): *any*

Returns the genesis state by network ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | *number* | ID of the network (e.g. 1) |

**Returns:** *any*

Dictionary with genesis accounts

Defined in: [packages/common/src/genesisStates/index.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/genesisStates/index.ts#L29)

___

### genesisStateByName

▸ **genesisStateByName**(`name`: *string*): *any*

Returns the genesis state by network name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | *string* | Name of the network (e.g. 'mainnet') |

**Returns:** *any*

Dictionary with genesis accounts

Defined in: [packages/common/src/genesisStates/index.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/genesisStates/index.ts#L38)
