[@ethereumjs/common](../README.md) › ["genesisStates/index"](_genesisstates_index_.md)

# Module: "genesisStates/index"

## Index

### Functions

* [genesisStateById](_genesisstates_index_.md#genesisstatebyid)
* [genesisStateByName](_genesisstates_index_.md#genesisstatebyname)

## Functions

###  genesisStateById

▸ **genesisStateById**(`id`: number): *any*

*Defined in [packages/common/src/genesisStates/index.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/genesisStates/index.ts#L25)*

Returns the genesis state by network ID

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | number | ID of the network (e.g. 1) |

**Returns:** *any*

Dictionary with genesis accounts

___

###  genesisStateByName

▸ **genesisStateByName**(`name`: string): *any*

*Defined in [packages/common/src/genesisStates/index.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/genesisStates/index.ts#L34)*

Returns the genesis state by network name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of the network (e.g. 'mainnet') |

**Returns:** *any*

Dictionary with genesis accounts
