import { debug as createDebugLogger } from 'debug'
import Heap = require('qheap')
import { Readable, Writable } from 'stream'

import { Event } from '../../types'

import type { Config } from '../../config'
import type { Peer } from '../../net/peer'
import type { PeerPool } from '../../net/peerpool'
import type { JobTask as BlockFetcherJobTask } from './blockfetcherbase'
import type { Job } from './types'
import type { Debugger } from 'debug'

export interface FetcherOptions {
  /* Common chain config*/
  config: Config

  /* Peer pool */
  pool: PeerPool

  /* Fetch task timeout in ms (default: 8000) */
  timeout?: number

  /* How long to ban misbehaving peers in ms (default: 60000) */
  banTime?: number

  /* Max write queue size (default: 4) */
  maxQueue?: number

  /* Retry interval in ms (default: 1000) */
  interval?: number

  /* Destroy the fetcher once we are done */
  destroyWhenDone?: boolean
}

/**
 * Base class for fetchers that retrieve various data from peers. Subclasses must
 * request(), process() and store() methods. Tasks can be arbitrary objects whose structure
 * is defined by subclasses. A priority queue is used to ensure tasks are fetched
 * in order. Three types need to be provided: the JobTask, which describes a task the job should perform,
 * a JobResult, which is the direct result when a Peer replies to a Task, and a StorageItem, which
 * represents the to-be-stored items.
 * @memberof module:sync/fetcher
 */
export abstract class Fetcher<JobTask, JobResult, StorageItem> extends Readable {
  public config: Config
  protected debug: Debugger

  protected pool: PeerPool
  protected timeout: number
  protected interval: number
  protected banTime: number
  protected maxQueue: number
  protected in: Heap<Job<JobTask, JobResult, StorageItem>>
  protected out: Heap<Job<JobTask, JobResult, StorageItem>>
  protected total: number
  protected processed: number // number of processed tasks, awaiting the write job
  protected finished: number // number of tasks which are both processed and also finished writing
  protected running: boolean
  protected reading: boolean
  protected destroyWhenDone: boolean // Destroy the fetcher once we are finished processing each task.
  syncErrored?: Error

  private _readableState?: {
    // This property is inherited from Readable. We only need `length`.
    length: number
  }

  private writer: Writable | null = null

  /**
   * Create new fetcher
   */
  constructor(options: FetcherOptions) {
    super({ ...options, objectMode: true })

    this.config = options.config
    this.debug = createDebugLogger('client:fetcher')

    this.pool = options.pool
    this.timeout = options.timeout ?? 8000
    this.interval = options.interval ?? 1000
    this.banTime = options.banTime ?? 60000
    this.maxQueue = options.maxQueue ?? 4

    this.in = new Heap({
      comparBefore: (
        a: Job<JobTask, JobResult, StorageItem>,
        b: Job<JobTask, JobResult, StorageItem>
      ) => a.index < b.index,
    })
    this.out = new Heap({
      comparBefore: (
        a: Job<JobTask, JobResult, StorageItem>,
        b: Job<JobTask, JobResult, StorageItem>
      ) => a.index < b.index,
    })
    this.total = 0
    this.processed = 0
    this.finished = 0
    this.running = false
    this.reading = false
    this.destroyWhenDone = options.destroyWhenDone ?? true
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result.
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  abstract request(
    _job?: Job<JobTask, JobResult, StorageItem>,
    _peer?: Peer
  ): Promise<JobResult | undefined>

  /**
   * Process the reply for the given job.
   * If the reply contains unexpected data, return `undefined`,
   * this re-queues the job.
   * @param job fetch job
   * @param result result data
   */
  abstract process(
    _job?: Job<JobTask, JobResult, StorageItem>,
    _result?: JobResult
  ): StorageItem[] | undefined

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  abstract store(_result: StorageItem[]): Promise<void>

  /**
   * Process the error and evaluate if fetcher is to be destroyed, peer banned and if there
   * is any stepback
   */
  abstract processStoreError(
    _error: Error,
    _task: JobTask | BlockFetcherJobTask
  ): { destroyFetcher: boolean; banPeer: boolean; stepBack: bigint }

  abstract jobStr(job: Job<JobTask, JobResult, StorageItem>, withIndex?: boolean): string

  /**
   * Generate list of tasks to fetch
   */
  tasks(): JobTask[] {
    return []
  }

  nextTasks(): void {}

  /**
   * Enqueue job
   * @param job
   */
  enqueue(job: Job<JobTask, JobResult, StorageItem>, dequeued?: boolean) {
    if (this.running) {
      // If the job was already dequeued, for example coming from writer pipe, processed
      // needs to be decreased
      if (dequeued === true) this.processed--

      this.in.insert({
        ...job,
        time: Date.now(),
        state: 'idle',
      })
    }
  }

  /**
   * Dequeue all done tasks that completed in order
   */
  dequeue() {
    for (let f = this.out.peek(); f && f.index <= this.processed; ) {
      this.processed++
      const job = this.out.remove()
      if (!this.push(job)) {
        return
      }
      f = this.out.peek()
    }
  }

  /**
   * Enqueues a task. If autoRestart is true, and Fetcher is not running, then restart the fetcher.
   * @param task
   * @param autoRestart
   */
  enqueueTask(task: JobTask, autoRestart = false) {
    if (this.syncErrored || (!this.running && !autoRestart)) {
      return
    }
    const job: Job<JobTask, JobResult, StorageItem> = {
      task,
      time: Date.now(),
      index: this.total++,
      state: 'idle',
      peer: null,
    }
    this.debug(`enqueueTask ${this.jobStr(job)}`)
    this.in.insert(job)
    if (!this.running && autoRestart) {
      void this.fetch()
    }
  }

  /**
   * Implements Readable._read() by pushing completed tasks to the read queue
   */
  _read() {
    this.dequeue()
  }

  /**
   * handle successful job completion
   * @param job successful job
   * @param result job result
   */
  private success(job: Job<JobTask, JobResult, StorageItem>, result?: JobResult) {
    if (job.state !== 'active') return
    let jobStr = this.jobStr(job, true)
    let reenqueue = false
    let resultSet = ''
    if (result === undefined) {
      resultSet = 'undefined'
      reenqueue = true
    }
    if (result !== undefined && (result as any).length === 0) {
      resultSet = 'empty'
      reenqueue = true
    }
    if (reenqueue) {
      this.debug(
        `Re-enqueuing job ${jobStr} from peer id=${job.peer?.id?.substr(
          0,
          8
        )} (${resultSet} result set returned).`
      )
      this.enqueue(job)
      void this.wait().then(() => {
        job.peer!.idle = true
      })
    } else {
      job.peer!.idle = true
      job.result = this.process(job, result)
      jobStr = this.jobStr(job, true)
      if (job.result) {
        this.out.insert(job)
        this.dequeue()
      } else {
        this.debug(
          `Re-enqueuing job ${jobStr} from peer id=${job.peer?.id?.substr(
            0,
            8
          )} (reply contains unexpected data).`
        )
        this.enqueue(job)
      }
    }
    this.next()
  }

  /**
   * Handle failed job completion
   * @param job failed job
   * @param error error
   */
  private failure(
    job: Job<JobTask, JobResult, StorageItem> | Job<JobTask, JobResult, StorageItem>[],
    error?: Error,
    irrecoverable?: boolean,
    dequeued?: boolean,
    banPeer?: boolean
  ) {
    const jobItems = job instanceof Array ? job : [job]
    if (irrecoverable === true || banPeer === true) {
      this.pool.ban(jobItems[0].peer!, this.banTime)
    }
    if (!(irrecoverable === true)) {
      void this.wait().then(() => {
        jobItems[0].peer!.idle = true
      })

      for (const jobItem of jobItems) {
        if (jobItem.state !== 'active') continue
        const jobStr = this.jobStr(jobItem, true)
        this.debug(
          `Failure - Re-enqueuing job ${jobStr} from peer id=${jobItem.peer?.id?.substr(
            0,
            8
          )} (error: ${error}).`
        )
        // If the job has been dequeued, then the processed count needs to be decreased
        this.enqueue(jobItem, dequeued)
      }

      this.next()
    }

    if (error) {
      this.error(error, jobItems[0], irrecoverable)
    }
  }

  /**
   * Process next task
   */
  next() {
    this.nextTasks()
    const job = this.in.peek()
    if (!job) {
      if (this.finished !== this.total) {
        // There are still jobs waiting to be processed out in the writer pipe
        this.debug(
          `No job found on next task, skip next job execution processed=${this.processed} finished=${this.finished} total=${this.total}`
        )
      } else {
        // There are no more jobs in the fetcher, so its better to resolve
        // the sync and exit
        this.debug(`Fetcher seems to have processed all jobs, stopping…`)
        this.running = false
      }
      return false
    }
    if (this._readableState!.length > this.maxQueue) {
      this.debug(
        `Readable state length=${this._readableState!.length} exceeds max queue size=${
          this.maxQueue
        }, skip next job execution.`
      )
      return false
    }
    if (job.index > this.processed + this.maxQueue) {
      this.debug(`Job index greater than processed + max queue size, skip next job execution.`)
    }
    if (this.processed === this.total) {
      this.debug(`Total number of tasks reached, skip next job execution.`)
      return false
    }
    const peer = this.peer()
    if (peer) {
      peer.idle = false
      this.in.remove()
      job.peer = peer
      job.state = 'active'
      const timeout = setTimeout(() => {
        this.expire(job)
      }, this.timeout)
      this.request(job, peer)
        .then((result?: JobResult) => this.success(job, result))
        .catch((error: Error) => {
          const { banPeer } = this.processStoreError(error, job.task)
          this.failure(job, error, false, false, banPeer)
        })
        .finally(() => clearTimeout(timeout))
      return job
    } else {
      this.debug(`No idle peer available, skip next job execution.`)
      return false
    }
  }

  /**
   * Clears all outstanding tasks from the fetcher
   * TODO: figure out a way to reject the jobs which are under async processing post
   * `this.request`
   */
  clear() {
    this.total -= this.in.length
    while (this.in.length > 0) {
      this.in.remove()
    }
    this.debug(
      `Cleared out fetcher total=${this.total} processed=${this.processed} finished=${this.finished}`
    )
  }

  /**
   * Handle error
   * @param error error object
   * @param job task
   */
  error(error: Error, job?: Job<JobTask, JobResult, StorageItem>, irrecoverable?: boolean) {
    if (this.running) {
      this.config.events.emit(Event.SYNC_FETCHER_ERROR, error, job?.task, job?.peer)
    }
    if (irrecoverable === true) {
      this.running = false
      this.syncErrored = error
      this.clear()
    }
  }

  /**
   * Setup writer pipe and start writing fetch results. A pipe is used in order
   * to support backpressure from storing results.
   */
  write() {
    // writer is already setup, just return
    if (this.writer !== null) {
      return false
    }
    const _write = async (
      job: Job<JobTask, JobResult, StorageItem> | Job<JobTask, JobResult, StorageItem>[],
      encoding: string | null,
      cb: Function
    ) => {
      const jobItems = job instanceof Array ? job : [job]
      try {
        for (const jobItem of jobItems) {
          await this.store(jobItem.result as StorageItem[])
        }
        this.finished += jobItems.length
        cb()
      } catch (error: any) {
        this.config.logger.warn(`Error storing received block or header result: ${error}`)
        const { destroyFetcher, banPeer, stepBack } = this.processStoreError(
          error,
          jobItems[0].task
        )
        if (!destroyFetcher) {
          // Non-fatal error: ban peer and re-enqueue job.
          // Modify the first job so that it is enqueued from safeReorgDistance as most likely
          // this is because of a reorg.
          if (this.isBlockFetcherJobTask(jobItems[0].task)) {
            this.debug(`Possible reorg, stepping back ${stepBack} blocks and requeuing jobs.`)
            jobItems[0].task.first -= stepBack
            jobItems[0].task.count += Number(stepBack)
            // This will requeue the jobs as we are marking this failure as non-fatal.
          }
          this.failure(jobItems, error, false, true, banPeer)
          cb()
          return
        }
        cb(error)
      }
    }

    const writer = new Writable({
      objectMode: true,
      autoDestroy: false,
      write: _write,
      writev: (
        many: { chunk: Job<JobTask, JobResult, StorageItem>; encoding: string }[],
        cb: Function
      ) => {
        const items = (<Job<JobTask, JobResult, StorageItem>[]>[]).concat(
          ...many.map(
            (x: { chunk: Job<JobTask, JobResult, StorageItem>; encoding: string }) => x.chunk
          )
        )
        return _write(items, null, cb)
      },
    })
    this.on('close', () => {
      this.running = false
      writer.destroy()
    })
      .pipe(writer)
      .on('finish', () => {
        this.running = false
      })
      .on('error', (error: Error) => {
        this.error(error, undefined, true)
        writer.destroy()
      })
    this.writer = writer
    this.debug(`Setup writer pipe.`)
    return true
  }

  /**
   * Run the fetcher. Returns a promise that resolves once all tasks are completed.
   */
  async fetch() {
    if (this.running) {
      return false
    }
    this.write()
    this.running = true
    this.nextTasks()

    while (this.running) {
      if (this.next() === false) {
        if (this.finished === this.total && this.destroyWhenDone) {
          this.push(null)
        }
        await this.wait()
      }
    }
    this.running = false
    if (this.destroyWhenDone) {
      this.destroy()
      this.writer = null
    }
    if (this.syncErrored) throw this.syncErrored
  }

  /**
   * Returns an idle peer that can process a next job.
   */
  peer() {
    return this.pool.idle()
  }

  /**
   * Expire job that has timed out and ban associated peer. Timed out tasks will
   * be re-inserted into the queue.
   */
  expire(job: Job<JobTask, JobResult, StorageItem>) {
    job.state = 'expired'
    const jobStr = this.jobStr(job, true)
    if (this.pool.contains(job.peer!)) {
      this.debug(`Task timed out for peer (banning) ${jobStr} ${job.peer}`)
      this.pool.ban(job.peer!, this.banTime)
    } else {
      this.debug(`Peer disconnected while performing task ${jobStr} ${job.peer}`)
    }
    this.enqueue(job)
  }

  async wait(delay?: number) {
    await new Promise((resolve) => setTimeout(resolve, delay ?? this.interval))
  }

  /**
   * Helper to type guard job.task as {@link BlockFetcherJobTask}.
   * @param task
   */
  private isBlockFetcherJobTask(task: JobTask | BlockFetcherJobTask): task is BlockFetcherJobTask {
    return task !== undefined && 'first' in task && 'count' in task
  }
}
