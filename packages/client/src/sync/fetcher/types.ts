import type { Peer } from '../../net/peer'

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
  }
  stateRoot?: Uint8Array
}

export function getInitFecherDoneFlags(): SnapFetcherDoneFlags {
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
    },
  }
}
