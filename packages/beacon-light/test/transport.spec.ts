import { Common, Hoodi } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BeaconLightTransport } from '../src/transport.ts'
import {
  parseLightClientBootstrapJson,
  parseLightClientHeaderJson,
  parseLightClientUpdatesJson,
} from '../src/wire.ts'

import { buildBootstrap } from './fixtures/syntheticCommittee.ts'

function bootstrapEnvelope(bootstrap: ReturnType<typeof buildBootstrap>) {
  const h = bootstrap.header
  return {
    data: {
      header: {
        beacon: {
          slot: String(h.beacon.slot),
          proposer_index: '0',
          parent_root: bytesToHex(h.beacon.parentRoot),
          state_root: bytesToHex(h.beacon.stateRoot),
          body_root: bytesToHex(h.beacon.bodyRoot),
        },
        execution: {
          parent_hash: bytesToHex(h.execution!.parentHash),
          fee_recipient: bytesToHex(h.execution!.feeRecipient),
          state_root: bytesToHex(h.execution!.stateRoot),
          receipts_root: bytesToHex(h.execution!.receiptsRoot),
          logs_bloom: bytesToHex(h.execution!.logsBloom),
          prev_randao: bytesToHex(h.execution!.prevRandao),
          block_number: String(h.execution!.blockNumber),
          gas_limit: String(h.execution!.gasLimit),
          gas_used: '0',
          timestamp: String(h.execution!.timestamp),
          extra_data: '0x',
          base_fee_per_gas: '1000000000',
          block_hash: bytesToHex(h.execution!.blockHash),
          transactions_root: bytesToHex(h.execution!.transactionsRoot),
          withdrawals_root: bytesToHex(h.execution!.withdrawalsRoot),
        },
        execution_branch: h.executionBranch!.map(bytesToHex),
      },
      current_sync_committee: {
        pubkeys: bootstrap.currentSyncCommittee.publicKeys.map(bytesToHex),
        aggregate_pubkey: bytesToHex(bootstrap.currentSyncCommittee.aggregatePubkey),
      },
      current_sync_committee_branch: bootstrap.currentSyncCommitteeBranch.map(bytesToHex),
    },
  }
}

describe('[BeaconLight]: transport and wire', () => {
  it('rotates endpoints on HTTP errors', async () => {
    const common = new Common({ chain: Hoodi })
    const bootstrap = buildBootstrap(8192)
    const body = bootstrapEnvelope(bootstrap)
    let calls = 0
    const fetchImpl = async (url: string | URL) => {
      calls++
      const u = String(url)
      if (u.includes('bad.example')) {
        return new Response('fail', { status: 500 })
      }
      return new Response(JSON.stringify(body), { status: 200 })
    }
    const transport = new BeaconLightTransport({
      common,
      overrideEndpoint: 'https://bad.example',
      fetchImpl: fetchImpl as typeof fetch,
    })
    const parsed = await transport.fetchBootstrap('0x' + '11'.repeat(32))
    assert.equal(parsed.header.beacon.slot, bootstrap.header.beacon.slot)
    assert.ok(calls >= 2)
    assert.ok(transport.activeEndpoint?.includes('chainsafe') || calls >= 2)
  })

  it('round-trips bootstrap JSON through wire parser', () => {
    const bootstrap = buildBootstrap(8192)
    const parsed = parseLightClientBootstrapJson(bootstrapEnvelope(bootstrap))
    assert.equal(parsed.currentSyncCommittee.publicKeys.length, 512)
  })

  it('parses Capella and Amsterdam header JSON shapes', () => {
    const bootstrap = buildBootstrap(8192)
    const capellaJson = {
      beacon: {
        slot: String(bootstrap.header.beacon.slot),
        proposer_index: '0',
        parent_root: `0x${Buffer.from(bootstrap.header.beacon.parentRoot).toString('hex')}`,
        state_root: `0x${Buffer.from(bootstrap.header.beacon.stateRoot).toString('hex')}`,
        body_root: `0x${Buffer.from(bootstrap.header.beacon.bodyRoot).toString('hex')}`,
      },
      execution: {
        parent_hash: `0x${Buffer.from(bootstrap.header.execution!.parentHash).toString('hex')}`,
        fee_recipient: `0x${Buffer.from(bootstrap.header.execution!.feeRecipient).toString('hex')}`,
        state_root: `0x${Buffer.from(bootstrap.header.execution!.stateRoot).toString('hex')}`,
        receipts_root: `0x${Buffer.from(bootstrap.header.execution!.receiptsRoot).toString('hex')}`,
        logs_bloom: `0x${Buffer.from(bootstrap.header.execution!.logsBloom).toString('hex')}`,
        prev_randao: `0x${Buffer.from(bootstrap.header.execution!.prevRandao).toString('hex')}`,
        block_number: String(bootstrap.header.execution!.blockNumber),
        gas_limit: String(bootstrap.header.execution!.gasLimit),
        gas_used: '0',
        timestamp: String(bootstrap.header.execution!.timestamp),
        extra_data: '0x',
        base_fee_per_gas: '1000000000',
        block_hash: `0x${Buffer.from(bootstrap.header.execution!.blockHash).toString('hex')}`,
        transactions_root: `0x${Buffer.from(bootstrap.header.execution!.transactionsRoot).toString('hex')}`,
        withdrawals_root: `0x${Buffer.from(bootstrap.header.execution!.withdrawalsRoot).toString('hex')}`,
      },
      execution_branch: bootstrap.header.executionBranch!.map(
        (b) => `0x${Buffer.from(b).toString('hex')}`,
      ),
    }
    const parsed = parseLightClientHeaderJson(capellaJson)
    assert.equal(parsed.beacon.slot, bootstrap.header.beacon.slot)
    assert.ok(parsed.execution !== undefined)

    const amsterdamJson = {
      ...capellaJson,
      execution: undefined,
      execution_block_hash: `0x${Buffer.from(bootstrap.header.execution!.blockHash).toString('hex')}`,
    }
    const amsterdam = parseLightClientHeaderJson(amsterdamJson)
    assert.ok(amsterdam.executionBlockHash !== undefined)

    // Standard Beacon API top-level array of { version, data } envelopes with sync_committee_signature
    const updatesJson = [
      {
        version: 'electra',
        data: {
          attested_header: amsterdamJson,
          finalized_header: amsterdamJson,
          finality_branch: [],
          sync_aggregate: {
            sync_committee_bits: `0x${'ff'.repeat(64)}`,
            sync_committee_signature: `0x${'11'.repeat(96)}`,
          },
          signature_slot: String(bootstrap.header.beacon.slot + 1),
        },
      },
    ]
    const updates = parseLightClientUpdatesJson(updatesJson)
    assert.equal(updates.length, 1)
    assert.equal(updates[0]!.signatureSlot, bootstrap.header.beacon.slot + 1)
  })
})
