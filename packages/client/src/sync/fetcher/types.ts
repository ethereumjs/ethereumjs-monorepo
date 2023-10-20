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
  fetchingDone: boolean
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
