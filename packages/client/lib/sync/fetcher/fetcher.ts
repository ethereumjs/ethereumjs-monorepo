import { Readable, Writable } from 'stream'
const Heap = require('qheap')
import { BN } from 'ethereumjs-util'
import { Chain } from '../../blockchain'
import { PeerPool } from '../../net/peerpool'
import { Config } from '../../config'

export interface FetcherOptions {
  /* Common chain config*/
  config: Config

  /* Blockchain */
  chain: Chain

  /* Peer pool */
  pool: PeerPool

  /* Block number to start fetching from */
  first: BN

  /* How many blocks to fetch */
  count: BN

  /* Fetch task timeout in ms (default: 8000) */
  timeout?: number

  /* How long to ban misbehaving peers in ms (default: 60000) */
  banTime?: number

  /* Max write queue size (default: 16) */
  maxQueue?: number

  /* Max items per request (default: 128) */
  maxPerRequest?: number

  /* Retry interval in ms (default: 1000) */
  interval?: number
}

/**
 * Base class for fetchers that retrieve various data from peers. Subclasses must
 * request() and process() methods. Tasks can be arbitrary objects whose structure
 * is defined by subclasses. A priority queue is used to ensure tasks are fetched
 * inorder.
 * @memberof module:sync/fetcher
 */
export class Fetcher extends Readable {
  public config: Config

  protected chain: Chain
  protected pool: PeerPool

  protected first: BN
  protected count: BN

  protected timeout: number
  protected interval: number
  protected banTime: number
  protected maxQueue: number
  protected maxPerRequest: number
  protected in: any
  protected out: any
  protected total: number
  protected processed: number
  protected running: boolean
  protected reading: boolean
  private _readableState: any

  /**
   * Create new fetcher
   * @param {FetcherOptions}
   */
  constructor(options: FetcherOptions) {
    super({ ...options, objectMode: true })

    this.config = options.config
    this.chain = options.chain
    this.pool = options.pool

    this.first = options.first
    this.count = options.count

    this.timeout = options.timeout ?? 8000
    this.interval = options.interval ?? 1000
    this.banTime = options.banTime ?? 60000
    this.maxQueue = options.maxQueue ?? 16
    this.maxPerRequest = options.maxPerRequest ?? 128

    this.in = new Heap({ comparBefore: (a: any, b: any) => a.index < b.index })
    this.out = new Heap({ comparBefore: (a: any, b: any) => a.index < b.index })
    this.total = 0
    this.processed = 0
    this.running = false
    this.reading = false
  }

  /**
   * Generate list of tasks to fetch
   * @return {Object[]} tasks
   */
  tasks(): object[] {
    const { first, count } = this
    const max = this.maxPerRequest
    const tasks = []
    while (count.gten(max)) {
      tasks.push({ first: first.clone(), count: max })
      first.iaddn(max)
      count.isubn(max)
    }
    if (count.gtn(0)) {
      tasks.push({ first: first.clone(), count: count.toNumber() })
    }
    return tasks
  }

  /**
   * Enqueue job
   * @param job
   */
  enqueue(job: any) {
    if (this.running) {
      this.in.insert({
        ...job,
        time: Date.now(),
        state: 'idle',
        result: null,
      })
    }
  }

  /**
   * Dequeue all done tasks that completed in order
   */
  dequeue() {
    for (let f = this.out.peek(); f && f.index === this.processed; ) {
      this.processed++
      const { result } = this.out.remove()
      if (!this.push(result)) {
        return
      }
      f = this.out.peek()
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
   * @private
   * @param  job successful job
   * @param  result job result
   */
  success(job: any, result: any) {
    if (job.state !== 'active') return
    if (result === undefined) {
      this.enqueue(job)
      // TODO: should this promise actually float?
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.wait().then(() => {
        job.peer.idle = true
      })
    } else {
      job.peer.idle = true
      job.result = this.process(job, result)
      if (job.result) {
        this.out.insert(job)
        this.dequeue()
      } else {
        this.enqueue(job)
      }
    }
    this.next()
  }

  /**
   * handle failed job completion
   * @private
   * @param  job failed job
   * @param  [error] error
   */
  failure(job: any, error?: Error) {
    if (job.state !== 'active') return
    job.peer.idle = true
    this.pool.ban(job.peer, this.banTime)
    this.enqueue(job)
    if (error) {
      this.error(error, job)
    }
    this.next()
  }

  /**
   * Process next task
   */
  next() {
    const job = this.in.peek()
    if (
      !job ||
      this._readableState.length > this.maxQueue ||
      job.index > this.processed + this.maxQueue ||
      this.processed === this.total
    ) {
      return false
    }
    const peer = this.peer()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (peer) {
      peer.idle = false
      this.in.remove()
      job.peer = peer
      job.state = 'active'
      const timeout = setTimeout(() => {
        this.expire(job)
      }, this.timeout)
      this.request(job, peer)
        .then((result: any) => this.success(job, result))
        .catch((error: Error) => this.failure(job, error))
        .finally(() => clearTimeout(timeout))
      return job
    }
  }

  /**
   * Handle error
   * @param  {Error}  error error object
   * @param  {Object} job  task
   */
  error(error: Error, job?: any) {
    if (this.running) {
      this.emit('error', error, job && job.task, job && job.peer)
    }
  }

  /**
   * Setup writer pipe and start writing fetch results. A pipe is used in order
   * to support backpressure from storing results.
   */
  write() {
    const _write = async (result: any, encoding: any, cb: Function) => {
      try {
        await this.store(result)
        this.emit('fetched', result)
        cb()
      } catch (error) {
        cb(error)
      }
    }
    const writer = new Writable({
      objectMode: true,
      write: _write,
      writev: (many: any, cb: Function) =>
        _write([].concat(...many.map((x: any) => x.chunk)), null, cb),
    })
    this.on('close', () => {
      this.running = false
      writer.destroy()
    })
      .pipe(writer)
      .on('finish', () => {
        this.running = false
      })
      .on('error', (error: any) => {
        this.error(error)
        this.running = false
        writer.destroy()
      })
  }

  /**
   * Run the fetcher. Returns a promise that resolves once all tasks are completed.
   * @return {Promise}
   */
  async fetch() {
    if (this.running) {
      return false
    }
    this.write()
    this.tasks().forEach((task) => {
      const job = {
        task,
        time: Date.now(),
        index: this.total++,
        result: null,
        state: 'idle',
        peer: null,
      }
      this.in.insert(job)
    })
    this.running = true
    while (this.running) {
      if (!this.next()) {
        if (this.processed === this.total) {
          this.push(null)
        }
        await this.wait()
      }
    }
    this.destroy()
  }

  /**
   * Returns a peer that can process the given job
   * @param  job job
   * @return {Peer}
   */
  // TODO: what is job supposed to be?
  peer(_job?: any) {
    return this.pool.idle()
  }

  /**
   * Request results from peer for the given job. Resolves with the raw result.
   * @param  job
   * @param  peer
   * @return {Promise}
   */
  request(_job?: any, _peer?: any): Promise<any> {
    throw new Error('Unimplemented')
  }

  /**
   * Process the reply for the given job
   * @param  job fetch job
   * @param  {Peer}   peer peer that handled task
   * @param  result result data
   */
  process(_job?: any, _peer?: any, _result?: any) {
    throw new Error('Unimplemented')
  }

  /**
   * Expire job that has timed out and ban associated peer. Timed out tasks will
   * be re-inserted into the queue.
   */
  expire(job: any) {
    job.state = 'expired'
    if (this.pool.contains(job.peer)) {
      this.config.logger.debug(
        `Task timed out for peer (banning) ${JSON.stringify(job.task)} ${job.peer}`
      )
      this.pool.ban(job.peer, 300000)
    } else {
      this.config.logger.debug(
        `Peer disconnected while performing task ${JSON.stringify(job.task)} ${job.peer}`
      )
    }
    this.enqueue(job)
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   * @return {Promise}
   */
  async store(_result?: any) {
    throw new Error('Unimplemented')
  }

  async wait(delay?: number) {
    await new Promise((resolve) => setTimeout(resolve, delay || this.interval))
  }
}
