import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { assert, describe, it } from 'vitest'

import { contiguousBalTailWindow, readBalTailBundle } from '../../src/serve/balTailDisk.ts'
import { EthyChunkStore } from '../../src/serve/ethyChunkStore.ts'

const MANIFEST_MAGIC = Buffer.from('BALT')
const SEGMENT_MAGIC = Buffer.from([0x42, 0x54, 0x53, 0x47])
const BAL_SEGMENT_BLOCKS = 256n

function writeManifest(pivotRoot: string, earliest: bigint, latest: bigint): void {
  const dir = path.join(pivotRoot, 'bal-tail')
  fs.mkdirSync(dir, { recursive: true })
  const buf = Buffer.alloc(28)
  MANIFEST_MAGIC.copy(buf, 0)
  buf.writeUInt16BE(1, 4)
  buf.writeUInt16BE(0, 6)
  buf.writeUInt32BE(256, 8)
  buf.writeBigUInt64BE(earliest, 12)
  buf.writeBigUInt64BE(latest, 20)
  fs.writeFileSync(path.join(dir, 'manifest.bin'), buf)
}

function appendSegmentBundle(
  pivotRoot: string,
  blockNumber: bigint,
  headerRlp: Uint8Array,
  balRlp: Uint8Array,
): void {
  const dir = path.join(pivotRoot, 'bal-tail')
  fs.mkdirSync(dir, { recursive: true })
  const segStart = blockNumber - (blockNumber % BAL_SEGMENT_BLOCKS)
  const segPath = path.join(dir, `seg-${segStart.toString()}.bin`)
  const headerBytes = 4 + 256 * 12
  if (!fs.existsSync(segPath)) {
    const hdr = Buffer.alloc(headerBytes)
    SEGMENT_MAGIC.copy(hdr, 0)
    fs.writeFileSync(segPath, hdr)
  }
  const fd = fs.openSync(segPath, 'r+')
  try {
    const payloadOff = fs.fstatSync(fd).size
    const payload = Buffer.concat([Buffer.from(headerRlp), Buffer.from(balRlp)])
    fs.writeSync(fd, payload, 0, payload.length, payloadOff)
    const idx = Number(blockNumber - segStart)
    const slot = Buffer.alloc(12)
    slot.writeUInt32BE(payloadOff, 0)
    slot.writeUInt32BE(headerRlp.length, 4)
    slot.writeUInt32BE(balRlp.length, 8)
    fs.writeSync(fd, slot, 0, 12, 4 + idx * 12)
  } finally {
    fs.closeSync(fd)
  }
}

describe('[Devp2p/ETHY]: balTailDisk contiguous window & EthyChunkStore cache', () => {
  it('stops at a mid-range hole instead of advertising a gapped manifest earliest', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'devp2p-bal-tail-hole-'))
    try {
      const hdr = new Uint8Array([0x01, 0x02])
      const bal = new Uint8Array([0xaa, 0xbb])
      // Write blocks 100..102 and 104..106 (hole at 103)
      for (const b of [100n, 101n, 102n, 104n, 105n, 106n]) {
        appendSegmentBundle(tmp, b, hdr, bal)
      }
      writeManifest(tmp, 100n, 106n)
      const win = contiguousBalTailWindow(tmp)
      assert.deepEqual(win, { earliest: 104n, latest: 106n })
      const read = readBalTailBundle(tmp, 105n)
      assert.isDefined(read)
      assert.deepEqual(read!.headerRlp, hdr)
      assert.deepEqual(read!.balRlp, bal)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('returns undefined when manifest latest block is missing on disk', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'devp2p-bal-tail-missing-'))
    try {
      writeManifest(tmp, 200n, 205n)
      assert.isUndefined(contiguousBalTailWindow(tmp))
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('invalidates EthyChunkStore.getDiskHealWindow when manifest advances in place', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'devp2p-bal-tail-cache-'))
    try {
      const accountsDir = path.join(tmp, 'accounts')
      fs.mkdirSync(accountsDir, { recursive: true })
      const store = new EthyChunkStore()
      store.setPivotAccountsDir(accountsDir)

      const hdr = new Uint8Array([0x11])
      const bal = new Uint8Array([0x22])
      appendSegmentBundle(tmp, 300n, hdr, bal)
      writeManifest(tmp, 300n, 300n)
      assert.deepEqual(store.getDiskHealWindow(), { earliest: 300n, latest: 300n })

      // Append block 301 inside the same segment and overwrite manifest.bin in place
      appendSegmentBundle(tmp, 301n, hdr, bal)
      writeManifest(tmp, 300n, 301n)
      assert.deepEqual(store.getDiskHealWindow(), { earliest: 300n, latest: 301n })
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })
})
