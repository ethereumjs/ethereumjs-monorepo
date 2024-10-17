import type { Peer } from '../../net/peer/index.js'

export type Job<JobTask, JobResult, StorageItem> = {
  task: JobTask
  time: number
  index: number
  result?: JobResult | StorageItem[]
  partialResult?: StorageItem[]
  state: 'idle' | 'expired' | 'active'
  peer: Peer | null
}

export type SnapFetcherDoneFlags = {
  snapTargetHeight?: bigint
  snapTargetRoot?: Uint8Array
  snapTargetHash?: Uint8Array

  done: boolean
  syncing: boolean
  accountFetcher: {
    started: boolean
    first: bigint
    done: boolean
  }
  storageFetcher: {
    started: boolean
    first: bigint
    count: bigint
    done: boolean
  }
  byteCodeFetcher: {
    started: boolean
    first: bigint
    count: bigint
    done: boolean
  }
  trieNodeFetcher: {
    started: boolean
    first: bigint
    count: bigint
    done: boolean
    healCycleRepeatCount: number // used in AccountFetcher to determine how many times to repeat heal cycles
    currentHeight: bigint
  }
  stateRoot?: Uint8Array
}

export function getInitFetcherDoneFlags(): SnapFetcherDoneFlags {
  return {
    done: false,
    syncing: false,
    accountFetcher: {
      started: false,
      // entire account range
      first: BigInt(0),
      done: false,
    },
    storageFetcher: {
      started: false,
      first: BigInt(0),
      count: BigInt(0),
      done: false,
    },
    byteCodeFetcher: {
      started: false,
      first: BigInt(0),
      count: BigInt(0),
      done: false,
    },
    trieNodeFetcher: {
      started: false,
      first: BigInt(0),
      count: BigInt(0),
      done: false,
      healCycleRepeatCount: Number(process.env.HEAL_CYCLE_REPEATS ?? '0'),
      currentHeight: BigInt(0),
    },
  }
}
