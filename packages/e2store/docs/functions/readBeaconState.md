[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readBeaconState

# Function: readBeaconState()

> **readBeaconState**(`eraData`): `Promise`\<\{ `balances`: (`number` \| `bigint`)[]; `block_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `current_epoch_participation`: (`number` \| `bigint`)[]; `current_justified_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `eth1_data_votes`: `object`[]; `eth1_deposit_index`: `number` \| `bigint`; `finalized_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `fork`: \{ `current_version`: `Uint8Array`; `epoch`: `number` \| `bigint`; `previous_version`: `Uint8Array`; \}; `genesis_time`: `number` \| `bigint`; `genesis_validators_root`: `Uint8Array`; `historical_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `justification_bits`: `boolean`[]; `latest_block_header`: \{ `body_root`: `Uint8Array`; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `previous_epoch_participation`: (`number` \| `bigint`)[]; `previous_justified_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `randao_mixes`: `Uint8Array`\<`ArrayBufferLike`\>[]; `slashings`: (`number` \| `bigint`)[]; `slot`: `number` \| `bigint`; `state_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `validators`: `object`[]; \}\>

Defined in: [packages/e2store/src/era/era.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L63)

## Parameters

### eraData

`Uint8Array`

a bytestring representing an era file

## Returns

`Promise`\<\{ `balances`: (`number` \| `bigint`)[]; `block_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `current_epoch_participation`: (`number` \| `bigint`)[]; `current_justified_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `eth1_data_votes`: `object`[]; `eth1_deposit_index`: `number` \| `bigint`; `finalized_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `fork`: \{ `current_version`: `Uint8Array`; `epoch`: `number` \| `bigint`; `previous_version`: `Uint8Array`; \}; `genesis_time`: `number` \| `bigint`; `genesis_validators_root`: `Uint8Array`; `historical_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `justification_bits`: `boolean`[]; `latest_block_header`: \{ `body_root`: `Uint8Array`; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `previous_epoch_participation`: (`number` \| `bigint`)[]; `previous_justified_checkpoint`: \{ `epoch`: `number` \| `bigint`; `root`: `Uint8Array`; \}; `randao_mixes`: `Uint8Array`\<`ArrayBufferLike`\>[]; `slashings`: (`number` \| `bigint`)[]; `slot`: `number` \| `bigint`; `state_roots`: `Uint8Array`\<`ArrayBufferLike`\>[]; `validators`: `object`[]; \}\>

a BeaconState object of the type corresponding to the fork the state snapshot occurred at

## Throws

if BeaconState cannot be found
