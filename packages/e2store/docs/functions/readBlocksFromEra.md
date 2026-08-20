[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readBlocksFromEra

# Function: readBlocksFromEra()

> **readBlocksFromEra**(`eraFile`): `AsyncGenerator`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}, `void`, `unknown`\>

Defined in: [packages/e2store/src/era/era.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L124)

Async generator over non-empty signed beacon blocks in an era file.

Skips slots whose offset is zero (empty slot placeholders).

## Parameters

### eraFile

`Uint8Array`

## Returns

`AsyncGenerator`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}, `void`, `unknown`\>
