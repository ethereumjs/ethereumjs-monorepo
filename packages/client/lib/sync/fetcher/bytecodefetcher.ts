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
import { keccak256 } from 'ethereum-cryptography/keccak'

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
  trie: Trie

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

  trie: Trie

  /**
   * Create new block fetcher
   */
  constructor(options: ByteCodeFetcherOptions) {
    super(options)
    this.hashes = options.hashes ?? []
    this.trie = options.trie ?? new Trie({ useKeyHashing: false })
    this.debug = createDebugLogger('client:ByteCodeFetcher')
    if (this.hashes.length > 0) {
      const fullJob = { task: { hashes: this.hashes } } as Job<JobTask, AccountData[], AccountData>
      this.debug(
        `Bytecode fetcher instantiated ${fullJob.task.hashes.length} hash requests destroyWhenDone=${this.destroyWhenDone}`
      )
    }
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  async request(job: Job<JobTask, Buffer[], Buffer>): Promise<ByteCodeDataResponse | undefined> {
    const { task, peer } = job

    this.debug(`requested code hashes: ${Array.from(task.hashes).map((h) => bufferToHex(h))}`)

    const rangeResult = await peer!.snap!.getByteCodes({
      hashes: Array.from(task.hashes),
      bytes: BigInt(this.config.maxRangeBytes),
    })

    // Response is valid, but check if peer is signalling that it does not have
    // the requested data. For bytecode range queries that means the peer is not
    // yet synced.
    if (rangeResult === undefined || task.hashes.length < rangeResult.codes.length) {
      this.debug(`Peer rejected bytecode request`)
      return undefined
    }

    // Cross reference the requested bytecodes with the response to find gaps
    // that the serving node is missing
    const receivedCodes: Map<String, Buffer> = new Map()
    const missingCodeHashes: Buffer[] = []
    for (let i = 0; i < task.hashes.length; i++) {
      const requestedHash = task.hashes[i]
      const receivedCode = rangeResult.codes[i]
      const receivedHash = Buffer.from(keccak256(receivedCode))
      if (requestedHash.compare(receivedHash) !== 0) {
        missingCodeHashes.push(requestedHash)
      } else {
        receivedCodes.set(bufferToHex(requestedHash), receivedHash)
      }
    }

    // requeue missed requests for fetching
    if (missingCodeHashes.length > 0) {
      this.debug(`${missingCodeHashes.length} missed requests`)
      this.hashes.push(...missingCodeHashes)
    }
    return Object.assign([], [receivedCodes], { completed: true })
  }

  /**
   * Process the reply for the given job.
   * If the reply contains unexpected data, return `undefined`,
   * this re-queues the job.
   * @param job fetch job
   * @param result result data
   */
  process(job: Job<JobTask, Buffer[], Buffer>, result: ByteCodeDataResponse): Buffer[] | undefined {
    this.debug('dbg0: in process phase')
    const fullResult = (job.partialResult ?? []).concat(result)
    job.partialResult = undefined
    if (result.completed === true) {
      return fullResult
    } else {
      // Save partial result to re-request missing items.
      job.partialResult = fullResult
    }
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  async store(result: Buffer[]): Promise<void> {
    this.debug('dbg1: in store phase phase')

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
    if (this.hashes.length > 0) {
      // Current strategy is to requests all known code hash requests
      tasks.push({ hashes: this.hashes })
      this.hashes = [] // TODO limit number of requests
      this.debug(`Created new tasks num=${tasks.length}`)
    }
    return tasks
  }

  nextTasks(): void {
    this.debug(`Entering nextTasks with hash request queue length of ${this.hashes.length}`)
    this.debug('Bytecode requests in primary queue:')
    for (const h of this.hashes) {
      this.debug(`\tCode hash: ${bufferToHex(h)}`)
      this.debug('\t---')
    }
    try {
      if (this.in.length === 0 && this.hashes.length > 0) {
        const fullJob = { task: { hashes: this.hashes } } as Job<JobTask, Buffer[], Buffer>
        const tasks = this.tasks()
        for (const task of tasks) {
          this.enqueueTask(task, true)
        }
        this.debug(
          `Fetcher pending with ${(fullJob as any)!.task.hashes.length} code hashes requested`
        )
      }
    } catch (err) {
      this.debug(err)
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
    let str = ''
    if (withIndex) {
      str += `index=${job.index} `
    }

    str += `${job.task.hashes.length} hash requests`
    return str
  }
}
