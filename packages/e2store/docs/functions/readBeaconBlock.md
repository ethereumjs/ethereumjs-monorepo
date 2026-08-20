[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readBeaconBlock

# Function: readBeaconBlock()

> **readBeaconBlock**(`eraData`, `offset`): `Promise`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}\>

Defined in: [packages/e2store/src/era/era.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L92)

Reads and SSZ-decodes one signed beacon block from an era file by slot offset index.

## Parameters

### eraData

`Uint8Array`

### offset

`number`

Index into the block slot index (not the consensus slot number).

## Returns

`Promise`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}\>

## Throws

If the block entry is missing or not CompressedSignedBeaconBlockType.
