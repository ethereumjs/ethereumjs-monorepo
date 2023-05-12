import { CODEHASH_PREFIX } from '@ethereumjs/statemanager'
import { Trie } from '@ethereumjs/trie'
import { bytesToHex, concatBytes, equalsBytes } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { Fetcher } from './fetcher'

import type { Peer } from '../../net/peer'
import type { FetcherOptions } from './fetcher'
import type { Job } from './types'
import type { BatchDBOp } from '@ethereumjs/util'
import type { Debugger } from 'debug'

type ByteCodeDataResponse = Uint8Array[] & { completed?: boolean }

/**
 * Implements an snap1 based bytecode fetcher
 * @memberof module:sync/fetcher
 */
export interface ByteCodeFetcherOptions extends FetcherOptions {
  hashes: Uint8Array[]
  trie: Trie

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

// root comes from block?
export type JobTask = {
  hashes: Uint8Array[]
}

export class ByteCodeFetcher extends Fetcher<JobTask, Uint8Array[], Uint8Array> {
  protected debug: Debugger

  hashes: Uint8Array[]

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
      const fullJob = { task: { hashes: this.hashes } } as Job<JobTask, Uint8Array[], Uint8Array>
      this.debug(
        `Bytecode fetcher instantiated ${fullJob.task.hashes.length} hash requests destroyWhenDone=${this.destroyWhenDone}`
      )
    }
  }

  setDestroyWhenDone() {
    this.destroyWhenDone = true
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  async request(
    job: Job<JobTask, Uint8Array[], Uint8Array>
  ): Promise<ByteCodeDataResponse | undefined> {
    const { task, peer } = job

    this.debug(`requested code hashes: ${Array.from(task.hashes).map((h) => bytesToHex(h))}`)

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
    const receivedCodes: Map<String, Uint8Array> = new Map()
    const missingCodeHashes: Uint8Array[] = []

    // While results are in the same order as requested hashes but there could be gaps/misses in the results
    // if the node doesn't has the bytecode. We need an index to move forward through the hashes which are
    // absent in the receieved responses
    let requestedHashIndex = 0
    for (let i = 0; i < rangeResult.codes.length; i++) {
      const receivedCode = rangeResult.codes[i]
      const receivedHash = keccak256(receivedCode)

      // move forward requestedHashIndex till the match has been found
      while (
        requestedHashIndex < task.hashes.length &&
        !equalsBytes(receivedHash, task.hashes[requestedHashIndex])
      ) {
        // requestedHashIndex 's hash is skipped in response
        missingCodeHashes.push(task.hashes[requestedHashIndex])
        requestedHashIndex++
      }

      if (requestedHashIndex >= task.hashes.length) {
        // no more matches
        break
      } else {
        // match found
        receivedCodes.set(bytesToHex(receivedHash), receivedCode)
      }
    }

    // requeue missed requests for fetching
    if (missingCodeHashes.length > 0) {
      this.debug(`${missingCodeHashes.length} missed requests adding them to request backlog`)
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
  process(
    job: Job<JobTask, Uint8Array[], Uint8Array>,
    result: ByteCodeDataResponse
  ): Uint8Array[] | undefined {
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
  async store(result: Uint8Array[]): Promise<void> {
    const codeHashToByteCode = result[0] as unknown as Map<String, Uint8Array>
    const ops = []
    let storeCount = 0
    for (const [_, value] of codeHashToByteCode) {
      const codeHash = keccak256(value)
      const computedKey = concatBytes(CODEHASH_PREFIX, codeHash)
      ops.push({
        type: 'put',
        key: computedKey,
        value,
      })
      storeCount += 1
    }
    await this.trie.batch(ops as BatchDBOp[])

    this.debug(`Stored ${storeCount} bytecode in code trie`)
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
  enqueueByByteCodeRequestList(byteCodeRequestList: Uint8Array[]) {
    this.hashes.push(...byteCodeRequestList)
    this.debug(
      `Number of bytecode fetch requests added to fetcher queue: ${byteCodeRequestList.length}`
    )
    this.nextTasks()
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   */
  tasks(maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    while (tasks.length < maxTasks && this.hashes.length > 0) {
      tasks.push({ hashes: this.hashes.splice(0, max) })
    }
    this.debug(`Created new tasks num=${tasks.length}`)
    return tasks
  }

  nextTasks(): void {
    this.debug(`Entering nextTasks with hash request queue length of ${this.hashes.length}`)
    this.debug('Bytecode requests in primary queue:')
    for (const h of this.hashes) {
      this.debug(`\tCode hash: ${bytesToHex(h)}`)
      this.debug('\t---')
    }
    try {
      if (this.in.length === 0 && this.hashes.length > 0) {
        const fullJob = { task: { hashes: this.hashes } } as Job<JobTask, Uint8Array[], Uint8Array>
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
  jobStr(job: Job<JobTask, Uint8Array[], Uint8Array>, withIndex = false) {
    let str = ''
    if (withIndex) {
      str += `index=${job.index} `
    }

    str += `${job.task.hashes.length} hash requests`
    return str
  }
}
