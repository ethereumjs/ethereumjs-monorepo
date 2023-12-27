import { BIGINT_0, bytesToHex, toBytes } from '@ethereumjs/util'
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

const WitnessBranchReadCost = BigInt(1900)
const WitnessChunkReadCost = BigInt(200)
const WitnessBranchWriteCost = BigInt(3000)
const WitnessChunkWriteCost = BigInt(500)
const WitnessChunkFillCost = BigInt(6200)

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

// Since stem is predersen hashed, it is useful to maintain the reverse relationship
type StemMeta = { address: Address; treeIndex: number }
type AccessedState = { address: Address; treeIndex: number; chunkIndex: number }

export class AccessWitness {
  stems: Map<PrefixedHexString, StemAccessEvent & StemMeta>

  chunks: Map<PrefixedHexString, ChunkAccessEvent>

  constructor(
    opts: {
      stems?: Map<PrefixedHexString, StemAccessEvent & StemMeta>
      chunks?: Map<PrefixedHexString, ChunkAccessEvent>
    } = {}
  ) {
    this.stems = opts.stems ?? new Map<PrefixedHexString, StemAccessEvent & StemMeta>()
    this.chunks = opts.chunks ?? new Map<PrefixedHexString, ChunkAccessEvent>()
  }

  touchAndChargeProofOfAbsence(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, NONCE_LEAF_KEY)

    return gas
  }

  touchAndChargeMessageCall(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)

    return gas
  }

  touchAndChargeValueTransfer(caller: Address, target: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(caller, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(target, 0, BALANCE_LEAF_KEY)

    return gas
  }

  touchAndChargeContractCreateInit(
    address: Address,
    { sendsValue }: { sendsValue?: boolean } = {}
  ): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, NONCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    if (sendsValue === true) {
      gas += this.touchAddressOnWriteAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    }

    return gas
  }

  touchAndChargeContractCreateCompleted(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, CODE_KECCAK_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, NONCE_LEAF_KEY)

    return gas
  }

  touchTxOriginAndComputeGas(origin: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(origin, 0, VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, CODE_KECCAK_LEAF_KEY)

    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, NONCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, BALANCE_LEAF_KEY)

    return gas
  }

  touchTxExistingAndComputeGas(target: Address, { sendsValue }: { sendsValue?: boolean } = {}) {
    let gas = BIGINT_0

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

  touchCodeChunksRangeOnReadAndChargeGas(contact: Address, startPc: number, endPc: number) {
    let gas = BIGINT_0
    for (let chunkNum = Math.floor(startPc / 31); chunkNum <= Math.floor(endPc / 31); chunkNum++) {
      const { treeIndex, subIndex } = getTreeIndicesForCodeChunk(chunkNum)
      gas += this.touchAddressOnReadAndComputeGas(contact, treeIndex, subIndex)
    }
    return gas
  }

  touchAddressOnWriteAndComputeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array
  ): bigint {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: true })
  }

  touchAddressOnReadAndComputeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array
  ): bigint {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: false })
  }

  touchAddressAndChargeGas(
    address: Address,
    treeIndex: number,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean }
  ): bigint {
    let gas = BIGINT_0

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
      accessedStem = { address, treeIndex }
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

  merge(accessWitness: AccessWitness): void {
    for (const [chunkKey, chunkValue] of accessWitness.chunks.entries()) {
      const stemKey = chunkKey.slice(0, chunkKey.length - 2)
      const stem = accessWitness.stems.get(stemKey)
      if (stem === undefined) {
        throw Error(`Internal error: missing stem for the chunkKey=${chunkKey}`)
      }

      const thisStem = this.stems.get(stemKey)
      if (thisStem === undefined) {
        this.stems.set(stemKey, stem)
      } else {
        thisStem.write = thisStem.write !== true ? stem.write : true
      }

      const thisChunk = this.chunks.get(chunkKey)
      if (thisChunk === undefined) {
        this.chunks.set(chunkKey, chunkValue)
      } else {
        thisChunk.write = thisChunk.write !== true ? chunkValue.write : true
        thisChunk.fill = thisChunk.fill !== true ? thisChunk.fill : true
      }
    }
  }

  *accesses(): Generator<AccessedState> {
    for (const chunkKey of this.chunks.keys()) {
      // drop the last byte
      const stemKey = chunkKey.slice(0, chunkKey.length - 2)
      const stem = this.stems.get(stemKey)
      if (stem === undefined) {
        throw Error(`Internal error: missing stem for the chunkKey=${chunkKey}`)
      }
      const { address, treeIndex } = stem
      const chunkIndex = Number(`0x${chunkKey.slice(chunkKey.length - 2)}`)
      const accessedState = { address, treeIndex, chunkIndex }
      yield accessedState
    }
  }
}

export function getTreeIndexesForStorageSlot(storageKey: number): {
  treeIndex: number
  subIndex: number
} {
  let position: number
  if (storageKey < CODE_OFFSET - HEADER_STORAGE_OFFSET) {
    position = HEADER_STORAGE_OFFSET + storageKey
  } else {
    position = MAIN_STORAGE_OFFSET + storageKey
  }

  const treeIndex = Math.floor(position / VERKLE_NODE_WIDTH)
  const subIndex = position % VERKLE_NODE_WIDTH

  return { treeIndex, subIndex }
}

export function getTreeIndicesForCodeChunk(chunkId: number) {
  const treeIndex = Math.floor((CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH)
  const subIndex = (CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
  return { treeIndex, subIndex }
}
