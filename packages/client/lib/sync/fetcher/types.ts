import { Peer } from '../../net/peer'

export type Job<JobTask, JobResult, StorageItem> = {
  task: JobTask
  time: number
  index: number
  result?: JobResult | StorageItem[]
  state: 'idle' | 'expired' | 'active'
  peer: Peer | null
}
