import { Trie } from '@ethereumjs/trie'
import {
  KECCAK256_RLP,
  accountBodyToRLP,
  bigIntToBuffer,
  bufArrToArr,
  bufferToBigInt,
  bufferToHex,
  setLengthLeft,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'

import { LevelDB } from '../../execution/level'
import { Event } from '../../types'
import { short } from '../../util'

import { Fetcher } from './fetcher'
import { StorageFetcher } from './storagefetcher'

import type { Peer } from '../../net/peer'
import type { AccountData } from '../../net/protocol/snapprotocol'
import type { EventBusType } from '../../types'
import type { FetcherOptions } from './fetcher'
import type { StorageRequest } from './storagefetcher'
import type { Job } from './types'
import type { Debugger } from 'debug'

type ByteCodeDataResponse = Buffer[] & { completed?: boolean }

/**
 * Implements an snap1 based bytecode fetcher
 * @memberof module:sync/fetcher
 */
export interface ByteCodeFetcherOptions extends FetcherOptions {
  hashes: Buffer[]

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

// root comes from block?
export type JobTask = {
  hashes: Buffer[]
}

export class ByteCodeFetcher extends Fetcher<JobTask, Buffer[], Buffer> {
  protected debug: Debugger

  hashes: Buffer[]

  /**
   * Create new block fetcher
   */
  constructor(options: ByteCodeFetcherOptions) {
    super(options)
    this.hashes = options.hashes ?? []
    this.debug = createDebugLogger('client:AccountFetcher')

    // const fullJob = { task: { first: this.first, count: this.count } } as Job<
    //   JobTask,
    //   AccountData[],
    //   AccountData
    // >

    // this.debug(
    //   `Account fetcher instantiated root=${short(this.root)} origin=${short(origin)} limit=${short(
    //     limit
    //   )} destroyWhenDone=${this.destroyWhenDone}`
    // )
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  async request(job: Job<JobTask, Buffer[], Buffer>): Promise<ByteCodeDataResponse | undefined> {
    const { peer } = job

    const rangeResult = await peer!.snap!.getByteCodes({
      hashes: job.task.hashes,
      bytes: BigInt(this.config.maxRangeBytes),
    })

    return undefined

    // if (
    //   rangeResult.accounts.length === 0 ||
    //   limit.compare(bigIntToBuffer(BigInt(2) ** BigInt(256))) === 0
    // ) {
    //   // TODO have to check proof of nonexistence -- as a shortcut for now, we can mark as completed if a proof is present
    //   if (rangeResult.proof.length > 0) {
    //     this.debug(`Data for last range has been received`)
    //     // response contains empty object so that task can be terminated in store phase and not reenqueued
    //     return Object.assign([], [Object.create(null) as any], { completed: true })
    //   }
    // }

    // const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`

    // // eslint-disable-next-line eqeqeq
    // if (rangeResult === undefined) {
    //   return undefined
    // } else {
    //   // validate the proof
    //   try {
    //     // verifyRangeProof will also verify validate there are no missed states between origin and
    //     // response data
    //     const isMissingRightRange = await this.verifyRangeProof(this.root, origin, rangeResult)

    //     // Check if there is any pending data to be synced to the right
    //     let completed: boolean
    //     if (isMissingRightRange && this.isMissingRightRange(limit, rangeResult)) {
    //       this.debug(
    //         `Peer ${peerInfo} returned missing right range account=${rangeResult.accounts[
    //           rangeResult.accounts.length - 1
    //         ].hash.toString('hex')} limit=${limit.toString('hex')}`
    //       )
    //       completed = false
    //     } else {
    //       completed = true
    //     }
    //     return Object.assign([], rangeResult.accounts, { completed })
    //   } catch (err) {
    //     throw Error(`InvalidAccountRange: ${err}`)
    //   }
    // }
  }

  /**
   * Process the reply for the given job.
   * If the reply contains unexpected data, return `undefined`,
   * this re-queues the job.
   * @param job fetch job
   * @param result result data
   */
  process(job: Job<JobTask, Buffer[], Buffer>, result: ByteCodeDataResponse): Buffer[] | undefined {
    return undefined

    // const fullResult = (job.partialResult ?? []).concat(result)
    // job.partialResult = undefined
    // if (result.completed === true) {
    //   return fullResult
    // } else {
    //   // Save partial result to re-request missing items.
    //   job.partialResult = fullResult
    // }
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  async store(result: Buffer[]): Promise<void> {
    // this.debug(`Stored ${result.length} accounts in account trie`)
    // // TODO fails to handle case where there is a proof of non existence and returned accounts for last requested range
    // if (JSON.stringify(result[0]) === JSON.stringify(Object.create(null))) {
    //   this.debug('Final range received with no elements remaining to the right')
    //   // TODO include stateRoot in emission once moved over to using MPT's
    //   await this.accountTrie.persistRoot()
    //   snapFetchersCompleted(AccountFetcher, this.accountTrie.root(), this.config.events)
    //   return
    // }
    // const storageFetchRequests: StorageRequest[] = []
    // for (const account of result) {
    //   await this.accountTrie.put(account.hash, accountBodyToRLP(account.body))
    //   // build record of accounts that need storage slots to be fetched
    //   const storageRoot: Buffer =
    //     account.body[2] instanceof Buffer ? account.body[2] : Buffer.from(account.body[2])
    //   if (storageRoot.compare(KECCAK256_RLP) !== 0) {
    //     storageFetchRequests.push({
    //       accountHash: account.hash,
    //       storageRoot,
    //       first: BigInt(0),
    //       count: BigInt(2) ** BigInt(256) - BigInt(1),
    //     })
    //   }
    // }
    // if (storageFetchRequests.length > 0)
    //   this.storageFetcher.enqueueByStorageRequestList(storageFetchRequests)
  }

  /**
   * Create new tasks based on a provided list of block numbers.
   *
   * If numbers are sequential the request is created as bulk request.
   *
   * If there are no tasks in the fetcher and `min` is behind head,
   * inserts the requests for the missing blocks first.
   *
   * @param numberList List of block numbers
   * @param min Start block number
   */
  enqueueByByteCodeRequestList(byteCodeRequestList: Buffer[]) {
    this.hashes.push(...byteCodeRequestList)
    this.debug(
      `Number of bytecode fetch requests added to fetcher queue: ${byteCodeRequestList.length}`
    )
    this.nextTasks()
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   *
   * Divides the full 256-bit range of hashes into ranges of @maxAccountRange
   * size and turnes each range into a task for the fetcher
   */
  tasks(maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const tasks: JobTask[] = []
    let pushedCount = 0

    if (this.hashes.length > 0) {
      tasks.push({ hashes: this.hashes })
      pushedCount += this.hashes.length
    }

    this.debug(`Created new tasks num=${tasks.length}`)
    return tasks
  }

  nextTasks(): void {
    if (this.in.length === 0 && this.hashes.length > 0) {
      const fullJob = { task: { hashes: this.hashes } } as Job<JobTask, Buffer[], Buffer>

      this.debug(`Fetcher pending with ${this.hashes.length}`)
      const tasks = this.tasks()
      for (const task of tasks) {
        this.enqueueTask(task)
      }
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
    const destroyFetcher =
      !(error.message as string).includes(`InvalidRangeProof`) &&
      !(error.message as string).includes(`InvalidAccountRange`)
    const banPeer = true
    return { destroyFetcher, banPeer, stepBack }
  }

  /**
   * Job log format helper.
   * @param job
   * @param withIndex pass true to additionally output job.index
   */
  jobStr(job: Job<JobTask, Buffer[], Buffer>, withIndex = false) {
    return 'Hello World'
    // let str = ''
    // if (withIndex) {
    //   str += `index=${job.index} `
    // }

    // let partialResult
    // if (job.partialResult) {
    //   partialResult = ` partialResults=${job.partialResult.length}`
    // } else {
    //   partialResult = ''
    // }

    // str += `origin=${short(origin)} limit=${short(limit)}${partialResult}`
    // return str
  }
}
