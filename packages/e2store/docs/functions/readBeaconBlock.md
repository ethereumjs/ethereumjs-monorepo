[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readBeaconBlock

# Function: readBeaconBlock()

> **readBeaconBlock**(`eraData`, `offset`): `Promise`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}\>

Defined in: [packages/e2store/src/era/era.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L91)

## Parameters

### eraData

`Uint8Array`

a bytestring representing an era file

### offset

`number`

## Returns

`Promise`\<\{ `message`: \{ `body`: \{ `attestations`: `object`[]; `attester_slashings`: `object`[]; `deposits`: `object`[]; `eth1_data`: \{ `block_hash`: `Uint8Array`; `deposit_count`: `number` \| `bigint`; `deposit_root`: `Uint8Array`; \}; `graffiti`: `Uint8Array`; `proposer_slashings`: `object`[]; `randao_reveal`: `Uint8Array`; `voluntary_exits`: `object`[]; \}; `parent_root`: `Uint8Array`; `proposer_index`: `number` \| `bigint`; `slot`: `number` \| `bigint`; `state_root`: `Uint8Array`; \}; `signature`: `Uint8Array`; \}\>

a decompressed SignedBeaconBlock object of the same time as returned by ssz.ETH2\_TYPES.SignedBeaconBlock

## Throws

if SignedBeaconBlock is not found when reading an entry
