import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import type { EthyPeerStatus } from '../protocol/ethy/codec.ts'

export type EthyKnownPeerRow = {
  peerId: Uint8Array
  address: string
  tcpPort: number
  udpPort: number
  basePivotBlock: bigint
  bucketsBitmask: number
  /** Unix seconds when last seen. */
  lastSeenSec: number
}

const MAX_KNOWN = 64

export class EthyKnownPeerBook {
  private readonly _rows: EthyKnownPeerRow[] = []

  upsertFromStatus(
    peerId: Uint8Array,
    address: string,
    tcpPort: number,
    udpPort: number,
    status: EthyPeerStatus,
  ): void {
    const now = Math.floor(Date.now() / 1000)
    const idHex = bytesToUnprefixedHex(peerId)
    const existing = this._rows.findIndex((r) => bytesToUnprefixedHex(r.peerId) === idHex)
    const row: EthyKnownPeerRow = {
      peerId,
      address,
      tcpPort,
      udpPort,
      basePivotBlock: status.basePivotBlock,
      bucketsBitmask: status.bucketsBitmask,
      lastSeenSec: now,
    }
    if (existing >= 0) {
      this._rows[existing] = row
      return
    }
    this._rows.push(row)
    while (this._rows.length > MAX_KNOWN) {
      this._rows.shift()
    }
  }

  list(): EthyKnownPeerRow[] {
    return [...this._rows]
  }

  noteDialFromPex(peerId: Uint8Array, address: string, tcpPort: number, udpPort: number): void {
    const idHex = bytesToUnprefixedHex(peerId)
    if (this._rows.some((r) => bytesToUnprefixedHex(r.peerId) === idHex)) return
    this._rows.push({
      peerId,
      address,
      tcpPort,
      udpPort,
      basePivotBlock: 0n,
      bucketsBitmask: 0,
      lastSeenSec: Math.floor(Date.now() / 1000),
    })
    while (this._rows.length > MAX_KNOWN) {
      this._rows.shift()
    }
  }

  equalsId(a: Uint8Array, b: Uint8Array): boolean {
    return equalsBytes(a, b)
  }
}
