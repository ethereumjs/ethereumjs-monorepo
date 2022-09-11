import { Trie } from '@ethereumjs/trie'
import { accountBodyToRLP, bufferToBigInt, bufferToHex, setLengthLeft } from '@ethereumjs/util'

import { LevelDB } from '../../execution/level'

import { Fetcher } from './fetcher'

import type { Peer } from '../../net/peer'
import type { AccountData } from '../../net/protocol/snapprotocol'
import type { FetcherOptions } from './fetcher'
import type { Job } from './types'

/**
 * Implements an snap1 based account fetcher
 * @memberof module:sync/fetcher
 */
export interface AccountFetcherOptions extends FetcherOptions {
  /** Root hash of the account trie to serve */
  root: Buffer

  /** Per task limit of bytes to request from peer */
  bytes: bigint

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

// root comes from block?
export type JobTask = {
  origin: Buffer
  limit: Buffer
}

export class AccountFetcher extends Fetcher<JobTask, AccountData[], AccountData> {
  /**
   * Where the fetcher starts apart from the tasks already in the `in` queue.
   */
  root: Buffer
  /**
   * Soft limit at which to stop returning data
   */
  bytes: bigint
  /**
   * Max concurrency for requesting ranges of data from peers
   */
  maxRangeConcurrency: bigint

  /**
   * MPT for storing account data with proofs - keys are hashed and data is in slim format (SNAPSHOT)
   */
  accountTrie: Trie

  /**
   * Create new block fetcher
   */
  constructor(options: AccountFetcherOptions) {
    super(options)

    this.debug('inside accountfetcher.constructor')

    this.accountTrie = new Trie({ db: new LevelDB() })
    this.maxRangeConcurrency = BigInt(1)

    this.root = options.root

    this.bytes = options.bytes

    this.debug(
      `Account fetcher instantiated root=${bufferToHex(this.root)} bytes=${
        this.bytes
      } destroyWhenDone=${this.destroyWhenDone}`
    )
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  async request(job: Job<JobTask, AccountData[], AccountData>): Promise<AccountData[] | undefined> {
    this.debug('inside accountfetcher.request')

    const { task, peer, partialResult } = job
    const limit = task.limit
    let origin = task.origin

    this.debug(`number of accounts in partial result is ${partialResult?.length}`)
    if (partialResult) {
      const lastAccountHash: Buffer = Buffer.from(
        (bufferToBigInt(partialResult[partialResult.length - 1].hash) + BigInt(1)).toString(16),
        'hex'
      )
      origin = lastAccountHash
      this.debug(
        `Partial result left off on account hash ${bufferToHex(
          lastAccountHash
        )} - Origin for request has been updated`
      )
    }

    const rangeResult = await peer!.snap!.getAccountRange({
      root: this.root,
      origin,
      limit,
      bytes: this.bytes,
    })

    const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`
    // eslint-disable-next-line eqeqeq
    if (rangeResult == null || rangeResult.accounts == null || rangeResult.proof == null) {
      // catch occasional null, empty, or incomplete responses
      this.debug(
        `Peer ${peerInfo} returned incomplete account range response for origin=${origin} and limit=${limit}`
      )
      return undefined
    }

    const trie = new Trie()
    const { accounts, proof } = rangeResult
    const hashes: Buffer[] = []
    const values: Buffer[] = []

    // convert the request to the right values
    for (let i = 0; i < accounts.length; i++) {
      // ensure the range is monotonically increasing
      if (i !== accounts.length - 1) {
        if (accounts[i].hash.compare(accounts[i + 1].hash) === 1) {
          this.debug(
            `Peer ${peerInfo} returned Account hashes not monotonically increasing: ${i} ${
              accounts[i].hash
            } vs ${i + 1} ${accounts[i + 1].hash}`
          )
        }
      }
      // put account data into trie
      const { hash, body } = accounts[i]
      hashes.push(hash)
      const value = accountBodyToRLP(body)
      values.push(value)
    }

    // validate the proof
    try {
      // verify account data for account range received from peer using proof and state root
      const checkRangeProof = await trie.verifyRangeProof(
        setLengthLeft(this.root, 32),
        setLengthLeft(origin, 32),
        setLengthLeft(hashes[hashes.length - 1], 32),
        hashes,
        values,
        proof
      )
      this.debug('Proof for account range found to be valid: ' + checkRangeProof)
      if (!checkRangeProof) {
        this.debug(`Proof-based verification failed`)
        return undefined
      }
    } catch (err) {
      this.debug(`Proof-based verification failed: ${err}`)
      return undefined
    }

    return accounts
  }

  /**
   * Process the reply for the given job.
   * If the reply contains unexpected data, return `undefined`,
   * this re-queues the job.
   * @param job fetch job
   * @param result result data
   */
  process(
    job: Job<JobTask, AccountData[], AccountData>,
    result: AccountData[]
  ): AccountData[] | undefined {
    this.debug('inside accountfetcher.process')
    this.debug(`result is ${result}`)

    if (result.length === 0) {
      // if no accounts have been returned, we have fetched all necessary accounts
      // and can terminate task
      return job.partialResult
    }
    job.partialResult = (job.partialResult ?? []).concat(result)
    this.debug(
      `hash is ${bufferToHex(result[result.length - 1].hash)} - body is ${bufferToHex(
        result[result.length - 1].body as unknown as Buffer
      )}`
    )

    return undefined
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  async store(result: AccountData[]): Promise<void> {
    this.debug('inside accountfetcher.store')
    try {
      for (let i = 0; i < result.length; i++) {
        const { hash, body } = result[i]

        // TODO can be optimized by converting from slim to full in request phase inside first loop
        await this.accountTrie.put(hash, accountBodyToRLP(body))
      }
      // TODO add event emission if necessary

      this.debug(`Stored ${result.length} accounts in account trie`)
    } catch (err) {
      this.debug(`Failed to store account data: ${err}`)
    }

    // for data capture
    process.exit()
  }

  /**
   * Divides the full 256-bit range of hashes into @maxRangeConcurrency ranges
   * and turnes each range into a task for the fetcher
   */
  tasks(
    origin = BigInt(0),
    limit = BigInt(2) ** BigInt(256) - BigInt(1),
    _maxTasks = this.config.maxFetcherJobs
  ): JobTask[] {
    this.debug('inside accountfetcher.tasks')

    // const max = this.config.maxPerRequest
    this.debug(`origin is ${origin.toString(16)}`)
    this.debug(`limit is ${limit.toString(16)}`)
    const tasks: JobTask[] = []

    const countPerInterval = (limit - origin) / this.maxRangeConcurrency - BigInt(1)
    let start = BigInt(0)
    for (let i = 0; i < this.maxRangeConcurrency; i++) {
      const end = start + countPerInterval
      if (BigInt(i) === this.maxRangeConcurrency - BigInt(1)) {
        // last interval should include hashes up to and including @limit
        tasks.push({
          origin: Buffer.from(start.toString(16), 'hex'),
          limit: Buffer.from(limit.toString(16), 'hex'),
        })
        this.debug(
          `Created new tasks num=${tasks.length} with origin=${start.toString(
            16
          )} and limit=${limit.toString(16)}`
        )
        break
      }
      tasks.push({
        origin: Buffer.from(start.toString(16), 'hex'),
        limit: Buffer.from(end.toString(16), 'hex'),
      })
      this.debug(
        `Created new tasks num=${tasks.length} with origin=${start.toString(
          16
        )} and limit=${end.toString(16)}`
      )
      start = end + BigInt(1)
    }
    return tasks
  }

  nextTasks(): void {
    this.debug('inside accountfetcher.nextTasks')

    if (this.in.length === 0) {
      // const tasks = this.tasks()
      // for (const task of tasks) {
      //   this.enqueueTask(task)
      // }

      const task: JobTask = {
        origin: Buffer.from(
          '0000000000000000000000000000000000000000000000000000000000000000',
          'hex'
        ),
        limit: Buffer.from(
          '000000000000000000000000000000000000000000000000000000000000ffff',
          'hex'
        ),
      }
      this.enqueueTask(task)
    }
  }

  /**
   * Clears all outstanding tasks from the fetcher
   */
  clear() {
    return
  }

  /**
   * Returns an idle peer that can process a next job.
   */
  peer(): Peer | undefined {
    return this.pool.idle((peer) => 'snap' in peer)
  }

  processStoreError(
    error: Error,
    _task: JobTask
  ): { destroyFetcher: boolean; banPeer: boolean; stepBack: bigint } {
    const stepBack = BigInt(0)
    const destroyFetcher = !(error.message as string).includes(`InvalidRangeProof`)
    const banPeer = true
    return { destroyFetcher, banPeer, stepBack }
  }
}
