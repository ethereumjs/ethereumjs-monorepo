import { bytesToHex, toBytes } from '@ethereumjs/util'
import { getKey, getStem } from '@ethereumjs/verkle'

import type { Address, PrefixedHexString } from '@ethereumjs/util'

/**
 * Tree key constants.
 */
export const VERSION_LEAF_KEY = toBytes(0)
export const BALANCE_LEAF_KEY = toBytes(1)
export const NONCE_LEAF_KEY = toBytes(2)
export const CODE_KECCAK_LEAF_KEY = toBytes(3)
export const CODE_SIZE_LEAF_KEY = toBytes(4)

export const HEADER_STORAGE_OFFSET = 64
export const CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const MAIN_STORAGE_OFFSET = 256 ** 31

const WitnessBranchReadCost = 1900
const WitnessChunkReadCost = 200
const WitnessBranchWriteCost = 3000
const WitnessChunkWriteCost = 500
const WitnessChunkFillCost = 6200

// read is a default access event if stem or chunk is present
type StemAccessEvent = { write?: boolean }
// chunk fill access event is not being charged right now in kaustinen2 but will be rectified
// in upcoming iterations
type ChunkAccessEvent = StemAccessEvent & { fill?: boolean }

type AccessEventFlags = {
  stemRead: boolean
  stemWrite: boolean
  chunkRead: boolean
  chunkWrite: boolean
  chunkFill: boolean
}

export class AccessWitness {
  stems: Map<PrefixedHexString, StemAccessEvent>

  chunks: Map<PrefixedHexString, ChunkAccessEvent>

  constructor(
    opts: {
      stems?: Map<PrefixedHexString, StemAccessEvent>
      chunks?: Map<PrefixedHexString, ChunkAccessEvent>
    } = {}
  ) {
    this.stems = opts.stems ?? new Map<PrefixedHexString, StemAccessEvent>()
    this.chunks = opts.chunks ?? new Map<PrefixedHexString, ChunkAccessEvent>()
  }

  touchAndChargeProofOfAbsence(address: Address): number {
    let gas = 0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, NONCE_LEAF_KEY)

    return gas
  }

  touchAndChargeMessageCall(address: Address): number {
    let gas = 0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)

    return gas
  }

  touchAndChargeValueTransfer(caller: Address, target: Address): number {
    let gas = 0

    gas += this.touchAddressOnWriteAndComputeGas(caller, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(target, 0, BALANCE_LEAF_KEY)

    return gas
  }

  touchAndChargeContractCreateInit(
    address: Address,
    { createSendsValue }: { createSendsValue?: boolean } = {}
  ): number {
    let gas = 0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, NONCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    if (createSendsValue === true) {
      gas += this.touchAddressOnWriteAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    }

    return gas
  }

  touchAndChargeContractCreateCompleted(address: Address): number {
    let gas = 0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, NONCE_LEAF_KEY)

    return gas
  }

  touchTxOriginAndComputeGas(origin: Address): number {
    let gas = 0

    gas += this.touchAddressOnReadAndComputeGas(origin, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, CODE_KECCAK_LEAF_KEY)

    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, NONCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, BALANCE_LEAF_KEY)

    return gas
  }

  touchTxExistingAndComputeGas(target: Address, { sendsValue }: { sendsValue?: boolean } = {}) {
    let gas = 0

    gas += this.touchAddressOnReadAndComputeGas(target, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, CODE_KECCAK_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, NONCE_LEAF_KEY)

    if (sendsValue === true) {
      gas += this.touchAddressOnWriteAndComputeGas(target, 0, BALANCE_LEAF_KEY)
    } else {
      gas += this.touchAddressOnReadAndComputeGas(target, 0, BALANCE_LEAF_KEY)
    }

    return gas
  }

  touchAddressOnWriteAndComputeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array
  ): number {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: true })
  }

  touchAddressOnReadAndComputeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array
  ): number {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: false })
  }

  touchAddressAndChargeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean }
  ): number {
    let gas = 0
    const { stemRead, stemWrite, chunkRead, chunkWrite, chunkFill } = this.touchAddress(
      address,
      treeIndex,
      subIndex,
      { isWrite }
    )

    if (stemRead) {
      gas += WitnessBranchReadCost
    }
    if (stemWrite) {
      gas += WitnessBranchWriteCost
    }

    if (chunkRead) {
      gas += WitnessChunkReadCost
    }
    if (chunkWrite) {
      gas += WitnessChunkWriteCost
    }
    if (chunkFill) {
      gas += WitnessChunkFillCost
    }

    return gas
  }

  touchAddress(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean } = {}
  ): AccessEventFlags {
    let stemRead = false,
      stemWrite = false,
      chunkRead = false,
      chunkWrite = false
    // currently there are no gas charges for setting the chunk for the first time
    // i.e. no fill cost is charged right now
    const chunkFill = false

    const accessedStemKey = getStem(address, treeIndex)
    const accessedStemHex = bytesToHex(accessedStemKey)
    let accessedStem = this.stems.get(accessedStemHex)
    if (accessedStem === undefined) {
      stemRead = true
      accessedStem = {}
      this.stems.set(accessedStemHex, accessedStem)
    }

    const accessedChunkKey = getKey(accessedStemKey, toBytes(subIndex))
    const accessedChunkKeyHex = bytesToHex(accessedChunkKey)
    let accessedChunk = this.chunks.get(accessedChunkKeyHex)
    if (accessedChunk === undefined) {
      chunkRead = true
      accessedChunk = {}
      this.chunks.set(accessedChunkKeyHex, accessedChunk)
    }

    if (isWrite === true) {
      if (accessedStem.write !== true) {
        stemWrite = true
        // this would also directly modify in the map
        accessedStem.write = true
      }

      if (accessedChunk.write !== true) {
        chunkWrite = true
        // this would also directly modify in the map
        accessedChunk.write = true
      }
    }

    return { stemRead, stemWrite, chunkRead, chunkWrite, chunkFill }
  }

  /**Create a shallow copy, could clone some caches in future for optimizations */
  shallowCopy(): AccessWitness {
    return new AccessWitness()
  }

  merge(_accessWitness: AccessWitness): void {
    // TODO - add merging accessWitnesses into the current one
    return
  }
}
