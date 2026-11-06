import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { assert, describe, it } from 'vitest'

import {
  ETHY_PROOF_SIDECAR_MAGIC,
  appendProofRecordSync,
  readAllProofRecords,
  readSlabSlice,
} from '../src/persist/proofSidecar.ts'

describe('[Ethy/Persist]: proof sidecar', () => {
  it('round-trips a proof record and slab slice', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-proof-'))
    const journal = path.join(dir, '0.bin')
    fs.writeFileSync(journal, Buffer.from([0x01, 0x02, 0x03, 0x04]))
    const proofFile = path.join(dir, '0.proof.idx')
    const origin = new Uint8Array(32)
    origin[31] = 0x01
    const last = new Uint8Array(origin)
    const root = new Uint8Array(32)
    root[0] = 0xaa
    appendProofRecordSync(proofFile, {
      slabByteOffset: 0,
      slabByteLength: 4,
      originHash: origin,
      lastHash: last,
      hasRight: 1,
      chunkStateRoot: root,
      chunkBlockNumber: 100n,
      proofNodes: [new Uint8Array([0xde, 0xad])],
    })
    const head = fs.readFileSync(proofFile).subarray(0, ETHY_PROOF_SIDECAR_MAGIC.length)
    assert.deepEqual([...head], [...ETHY_PROOF_SIDECAR_MAGIC])
    const records = readAllProofRecords(proofFile)
    assert.equal(records.length, 1)
    assert.equal(records[0]!.slabByteLength, 4)
    const slice = readSlabSlice(journal, 0, 4)
    assert.deepEqual([...slice], [1, 2, 3, 4])
  })
})
