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
