import { Trie } from '@ethereumjs/trie'
import {
  bigIntToBytes,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'

import { LevelDB } from '../../execution/level'
import { short } from '../../util'

import { Fetcher } from './fetcher'

import type { Peer } from '../../net/peer'
import type { StorageData } from '../../net/protocol/snapprotocol'
import type { FetcherOptions } from './fetcher'
import type { Job } from './types'
import type { Debugger } from 'debug'

const TOTAL_RANGE_END = BigInt(2) ** BigInt(256) - BigInt(1)

type StorageDataResponse = StorageData[][] & { completed?: boolean }

export type StorageRequest = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  first: bigint
  count: bigint
}

/**
 * Implements a snap1 based storage fetcher
 * @memberof module:sync/fetcher
 */
export interface StorageFetcherOptions extends FetcherOptions {
  /** Root hash of the account trie to serve */
  root: Uint8Array

  /** Storage requests to fetch */
  storageRequests?: StorageRequest[]

  /** Storage slot hash of the first to retrieve - Ignored if multiple or no accounts are requested */
  first?: bigint

  /** Range to eventually fetch - Ignored if multiple accounts are requested */
  count?: bigint

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean

  accountToStorageTrie?: Map<String, Trie>
}

export type JobTask = {
  storageRequests: StorageRequest[]
}

export class StorageFetcher extends Fetcher<JobTask, StorageData[][], StorageData[]> {
  protected debug: Debugger

  /**
   * The stateRoot for the fetcher which sorts of pin it to a snapshot.
   * This might eventually be removed as the snapshots are moving and not static
   */
  root: Uint8Array

  /** The accounts to fetch storage data for */
  storageRequests: StorageRequest[]

  /** Fragmented requests to fetch remaining slot data for */
  fragmentedRequests: StorageRequest[]

  accountToStorageTrie: Map<String, Trie>

  /**
   * Create new storage fetcher
   */
  constructor(options: StorageFetcherOptions) {
    super(options)
    this.fragmentedRequests = []
    this.root = options.root
    this.storageRequests = options.storageRequests ?? []
    this.accountToStorageTrie = options.accountToStorageTrie ?? new Map()
    this.debug = createDebugLogger('client:StorageFetcher')
    if (this.storageRequests.length > 0) {
      const fullJob = {
        task: { storageRequests: this.storageRequests },
      } as Job<JobTask, StorageData[][], StorageData[]>
      const origin = this.getOrigin(fullJob)
      const limit = this.getLimit(fullJob)
      this.debug(
        `Storage fetcher instantiated with ${
          fullJob.task.storageRequests.length
        } accounts requested and root=${short(this.root)} origin=${short(origin)} limit=${short(
          limit
        )} destroyWhenDone=${this.destroyWhenDone}`
      )
    } else if (this.storageRequests.length === 0) {
      this.debug('Idle storage fetcher has been instantiated')
    }
  }

  private async verifyRangeProof(
    stateRoot: Uint8Array,
    origin: Uint8Array,
    { slots, proof }: { slots: StorageData[]; proof: Uint8Array[] | undefined }
  ): Promise<boolean> {
    try {
      this.debug(
        `verifyRangeProof slots:${slots.length} first=${short(slots[0].hash)} last=${short(
          slots[slots.length - 1].hash
        )}`
      )
      for (let i = 0; i < slots.length - 1; i++) {
        // ensure the range is monotonically increasing
        if (bytesToBigInt(slots[i].hash) > bytesToBigInt(slots[i + 1].hash)) {
          throw Error(
            `Account hashes not monotonically increasing: ${i} ${slots[i].hash} vs ${i + 1} ${
              slots[i + 1].hash
            }`
          )
        }
      }
      const trie = new Trie({ db: new LevelDB() })
      const keys = slots.map((slot: any) => slot.hash)
      const values = slots.map((slot: any) => slot.body)
      return await trie.verifyRangeProof(
        stateRoot,
        origin,
        keys[keys.length - 1],
        keys,
        values,
        <any>proof
      )
    } catch (err) {
      this.debug(`verifyRangeProof failure: ${(err as Error).stack}`)
      throw Error((err as Error).message)
    }
  }

  // TODO currently have to use verifySlots instead of verify range proof because no-proof verification is not working for verifyRangeProof
  private async verifySlots(slots: StorageData[], root: Uint8Array): Promise<boolean> {
    try {
      this.debug(`verify ${slots.length} slots`)
      for (let i = 0; i < slots.length - 1; i++) {
        // ensure the range is monotonically increasing
        if (bytesToBigInt(slots[i].hash) > bytesToBigInt(slots[i + 1].hash)) {
          throw Error(
            `Account hashes not monotonically increasing: ${i} ${slots[i].hash} vs ${i + 1} ${
              slots[i + 1].hash
            }`
          )
        }
      }
      const trie = new Trie({ db: new LevelDB() })
      await trie.batch(
        slots.map((s) => {
          return {
            type: 'put',
            key: s.hash,
            value: s.body,
          }
        })
      )
      return equalsBytes(trie.root(), root)
    } catch (err) {
      this.debug(`verifyRangeProof failure: ${(err as Error).stack}`)
      throw Error((err as Error).message)
    }
  }

  /**
   *
   * @param job
   * @returns origin of job is set using either @first property of fetcher or latest hash of partial job
   */
  private getOrigin(job: Job<JobTask, StorageData[][], StorageData[]>): Uint8Array {
    const { task, partialResult } = job
    if (task.storageRequests.length > 1 || task.storageRequests[0].first === BigInt(0)) {
      // peer does not respect origin or limit for multi-account storage fetch
      return setLengthLeft(bigIntToBytes(BigInt(0)), 32)
    }
    const { first } = task.storageRequests[0]!
    let origin = undefined
    if (partialResult) {
      const lastSlotArray = partialResult[partialResult.length - 1]
      const lastSlot = lastSlotArray[lastSlotArray.length - 1]
      origin = bigIntToBytes(bytesToBigInt(lastSlot.hash) + BigInt(1))
    } else {
      origin = bigIntToBytes(first + BigInt(1))
    }
    return setLengthLeft(origin, 32)
  }

  private getLimit(job: Job<JobTask, StorageData[][], StorageData[]>): Uint8Array {
    const { task } = job
    if (task.storageRequests.length > 1) {
      // peer does not respect origin or limit for multi-account storage fetch
      return setLengthLeft(bigIntToBytes(TOTAL_RANGE_END), 32)
    }
    const { first, count } = task.storageRequests[0]
    const limit = bigIntToBytes(first + BigInt(count))
    return setLengthLeft(limit, 32)
  }

  private isMissingRightRange(
    limit: Uint8Array,
    { slots, proof: _proof }: { slots: StorageData[][]; proof: Uint8Array[] }
  ): boolean {
    if (
      slots.length > 0 &&
      slots[0][slots[0].length - 1] !== undefined &&
      bytesToBigInt(slots[0][slots[0].length - 1].hash) >= bytesToBigInt(limit)
    ) {
      return false
    } else {
      return true
    }
  }

  /**
   * Request results from peer for the given job.
   * Resolves with the raw result
   * If `undefined` is returned, re-queue the job.
   * @param job
   * @param peer
   */
  async request(
    job: Job<JobTask, StorageData[][], StorageData[]>
  ): Promise<StorageDataResponse | undefined> {
    const { task, peer } = job
    const origin = this.getOrigin(job)
    const limit = this.getLimit(job)

    this.debug(`requested root: ${bytesToHex(this.root)}`)
    this.debug(`requested origin: ${bytesToHex(origin)}`)
    this.debug(`requested limit: ${bytesToHex(limit)}`)
    this.debug(
      `requested account hashes: ${task.storageRequests.map((req) => bytesToHex(req.accountHash))}`
    )

    const rangeResult = await peer!.snap!.getStorageRanges({
      root: this.root,
      accounts: task.storageRequests.map((req) => req.accountHash),
      origin,
      limit,
      bytes: BigInt(this.config.maxRangeBytes),
    })

    // Reject the response if the hash sets and slot sets don't match
    if (rangeResult === undefined || task.storageRequests.length < rangeResult.slots.length) {
      this.debug(
        `Slot set is larger than hash set: slotset ${rangeResult?.slots.length} hashset ${task.storageRequests.length} `
      )
      return undefined
    }

    // Response is valid, but check if peer is signalling that it does not have
    // the requested data. For storage range queries that means the state being
    // retrieved was either already pruned remotely, or the peer is not yet
    // synced to our head.
    if (rangeResult.slots.length === 0) {
      // TODO have to check proof of nonexistence since we are statically partitioning ranges --
      // as a shortcut for now, we can mark as completed if a proof is present
      if (rangeResult.proof.length > 0) {
        this.debug(`Empty range was requested - Terminating task`)
        // response contains empty object so that task can be terminated in store phase and not reenqueued
        return Object.assign([], [Object.create(null) as any], { completed: true })
      }
      this.debug(`Peer rejected storage request`)
      return undefined
    }

    this.debug(`number of slot arrays returned: ${rangeResult.slots.length}`)
    for (let i = 0; i < rangeResult.slots.length; i++) {
      this.debug(`number of slots in slot array ${i}: ${rangeResult.slots[i].length}`)
    }
    this.debug(`length of proof array: ${rangeResult.proof.length}`)

    const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`

    // verify data
    try {
      let completed: boolean
      for (let i = 0; i < rangeResult.slots.length; i++) {
        const accountSlots = rangeResult.slots[i]
        const root = task.storageRequests[i].storageRoot

        // all but the last returned slot array must include all slots for the requested account
        const proof = i === rangeResult.slots.length - 1 ? rangeResult.proof : undefined
        if (proof === undefined || proof.length === 0) {
          const valid = await this.verifySlots(accountSlots, root)
          if (!valid) return undefined
          if (proof?.length === 0)
            return Object.assign([], [rangeResult.slots], { completed: true })
        } else {
          // last returned slot array is for fragmented account that must be
          // verified and requeued to be fetched as single account request
          const hasRightElement = await this.verifyRangeProof(root, origin, {
            slots: accountSlots,
            proof,
          })

          // single account requests should check if task range is satisfied since origin and limit
          // are being respected
          if (task.storageRequests.length === 1 && !(task.storageRequests[0].first === BigInt(0))) {
            if (!hasRightElement) {
              // all data has been fetched for account storage trie
              completed = true
            } else {
              if (this.isMissingRightRange(limit, rangeResult)) {
                this.debug(
                  `Peer ${peerInfo} returned missing right range Slot=${bytesToHex(
                    rangeResult.slots[0][rangeResult.slots.length - 1].hash
                  )} limit=${bytesToHex(limit)}`
                )
                completed = false
              } else {
                completed = true
              }
            }
            return Object.assign([], [rangeResult.slots], { completed })
          }
          if (hasRightElement) {
            const startingHash = accountSlots[accountSlots.length - 1].hash
            this.debug(
              `Account fragmented at ${bytesToHex(startingHash)} as part of multiaccount fetch`
            )
            this.fragmentedRequests.unshift({
              ...task.storageRequests[i],
              // start fetching from next hash after last slot hash of last account received
              first: bytesToBigInt(startingHash),
              count: TOTAL_RANGE_END - bytesToBigInt(startingHash),
            } as StorageRequest)
          }
          // finally, we have to requeue account requests after fragmented account that were ignored
          // due to response limit
          const ignoredRequests = task.storageRequests.slice(i + 1)
          if (ignoredRequests.length > 0) {
            this.debug(
              `Number of ignored account requests due to fragmentation: ${ignoredRequests.length}`
            )
            this.storageRequests.push(...ignoredRequests)
          }
        }
      }
      return Object.assign([], [rangeResult.slots], { completed: true })
    } catch (err) {
      throw Error(`InvalidStorageRange: ${err}`)
    }
  }

  /**
   * Process the reply for the given job.
   * If the reply contains unexpected data, return `undefined`,
   * this re-queues the job.
   * @param job fetch job
   * @param result result data
   */
  process(
    job: Job<JobTask, StorageData[][], StorageData[]>,
    result: StorageDataResponse
  ): StorageData[][] | undefined {
    let fullResult: StorageData[][] | undefined = undefined
    if (job.partialResult) {
      fullResult = [job.partialResult[0].concat(result[0])]
    } else {
      fullResult = [result[0]]
    }
    job.partialResult = undefined
    if (result.completed === true) {
      return Object.assign([], fullResult, { requests: job.task.storageRequests })
    } else {
      // Save partial result to re-request missing items.
      job.partialResult = fullResult
    }
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  async store(result: StorageData[][] & { requests: StorageRequest[] }): Promise<void> {
    try {
      if (JSON.stringify(result[0]) === JSON.stringify(Object.create(null))) {
        this.debug(
          'Empty result detected - Associated range requested was empty with no elements remaining to the right'
        )
        this.destroyWhenDone = true
        return
      }
      let slotCount = 0
      result[0].map((slotArray, i) => {
        const accountHash = result.requests[i].accountHash
        const storageTrie =
          this.accountToStorageTrie.get(bytesToHex(accountHash)) ??
          new Trie({ useKeyHashing: false })
        for (const slot of slotArray as any) {
          slotCount++
          void storageTrie.put(slot.hash, slot.body)
        }
        this.accountToStorageTrie.set(bytesToHex(accountHash), storageTrie)
      })
      this.debug(`Stored ${slotCount} slot(s)`)
    } catch (err) {
      this.debug(err)
    }
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
  enqueueByStorageRequestList(storageRequestList: StorageRequest[]) {
    this.storageRequests.push(...storageRequestList)
    this.debug(
      `Number of storage fetch requests added to fetcher queue: ${storageRequestList.length}`
    )
    this.nextTasks()
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   *
   * Divides the full 256-bit range of hashes into @maxStorageRange ranges
   * and turns each range into a task for the fetcher
   */
  tasks(
    first = BigInt(0),
    count = TOTAL_RANGE_END,
    maxTasks = this.config.maxFetcherJobs
  ): JobTask[] {
    const tasks: JobTask[] = []
    let storageRequest = undefined
    let whereFirstwas = first
    let startedWith = first
    let myFirst = first
    let myCount = count
    if (this.storageRequests.length > 0) {
      this.debug(
        `Number of accounts requested as a part of a multi-account request: ${this.storageRequests.length}`
      )
      tasks.unshift({
        storageRequests: this.storageRequests, // TODO limit max number of accounts per single fetch request
      })
      this.storageRequests = [] // greedilly request as many account slots by requesting all known ones
      return tasks
    } else if (this.fragmentedRequests.length > 0) {
      this.debug('Single account request is being initiated')
      storageRequest = this.fragmentedRequests.shift()
      whereFirstwas = storageRequest!.first
      startedWith = storageRequest!.first
      myFirst = storageRequest!.first
      myCount = storageRequest!.count
    }

    // single account fetch with moving origin and limit
    const max = this.config.maxStorageRange
    let debugStr = `origin=${short(setLengthLeft(bigIntToBytes(myFirst), 32))}`
    let pushedCount = BigInt(0)
    while (myCount >= BigInt(max) && tasks.length < maxTasks) {
      const task = {
        storageRequests: [
          {
            accountHash: storageRequest!.accountHash,
            storageRoot: storageRequest!.storageRoot,
            first: myFirst,
            count: max,
          },
        ],
        first: myFirst,
        count: max,
      }
      tasks.push(task)
      myFirst += BigInt(max)
      myCount -= BigInt(max)
      pushedCount += BigInt(max)
    }
    if (myCount > BigInt(0) && tasks.length < maxTasks) {
      const task = {
        storageRequests: [
          {
            accountHash: storageRequest!.accountHash,
            storageRoot: storageRequest!.storageRoot,
            first: myFirst,
            count: myCount,
          },
        ],
        first: myFirst,
        count: myCount,
      }
      tasks.push(task)
      myFirst += BigInt(myCount)
      pushedCount += myCount
      myCount = BigInt(0)
    }

    // If we started with where this.first was, i.e. there are no gaps and hence
    // we can move this.first to where its now, and reduce count by pushedCount
    if (myCount !== BigInt(0) && startedWith === whereFirstwas) {
      // create new fragmented request to keep track of where to start building the next set of tasks for fetching the same account
      this.fragmentedRequests.unshift({
        accountHash: storageRequest!.accountHash,
        storageRoot: storageRequest!.storageRoot,
        first: myFirst,
        count: storageRequest!.count - pushedCount,
      })
    }
    debugStr += ` limit=${short(setLengthLeft(bigIntToBytes(startedWith + pushedCount), 32))}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  nextTasks(): void {
    this.debug(
      `Entering nextTasks with primary queue length of ${this.storageRequests.length} and secondary queue length of ${this.fragmentedRequests.length}`
    )
    this.debug('Storage requests in primary queue:')
    for (const r of this.storageRequests) {
      this.debug(`\tAccount hash: ${bytesToHex(r.accountHash)}`)
      this.debug(`\tFirst: ${bigIntToHex(r.first)}`)
      this.debug(`\tCount: ${bigIntToHex(r.count)}`)
      this.debug('\t---')
    }
    this.debug('Storage requests in secondary queue:')
    for (const r of this.fragmentedRequests) {
      this.debug(`\tAccount hash: ${bytesToHex(r.accountHash)}`)
      this.debug(`\tFirst: ${bigIntToHex(r.first)}`)
      this.debug(`\tCount: ${bigIntToHex(r.count)}`)
      this.debug('\t---')
    }
    // this strategy is open to change, but currently, multi-account requests are greedily prioritized over fragmented requests
    try {
      if (this.in.length === 0) {
        let fullJob = undefined
        if (this.storageRequests.length > 0) {
          fullJob = {
            task: { storageRequests: this.storageRequests },
          } as Job<JobTask, StorageData[][], StorageData[]>
        } else if (this.fragmentedRequests.length > 0) {
          fullJob = {
            task: {
              storageRequests: [this.fragmentedRequests[0]],
            },
          } as Job<JobTask, StorageData[][], StorageData[]>
        } else {
          this.debug('No requests left to queue')
          return
        }
        const origin = this.getOrigin(fullJob)
        const limit = this.getLimit(fullJob)

        const tasks = this.tasks()
        for (const task of tasks) {
          this.enqueueTask(task, true)
        }
        this.debug(
          `Fetcher pending with ${
            fullJob!.task.storageRequests.length
          } accounts requested and origin=${short(origin)} limit=${short(limit)}`
        )
      }
    } catch (err) {
      this.debug(err)
    }
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
      !error.message.includes(`InvalidRangeProof`) && !error.message.includes(`InvalidStorageRange`)
    const banPeer = true
    return { destroyFetcher, banPeer, stepBack }
  }

  /**
   * Job log format helper.
   * @param job
   * @param withIndex pass true to additionally output job.index
   */
  jobStr(job: Job<JobTask, StorageData[][], StorageData[]>, withIndex = false) {
    let str = ''
    if (withIndex) {
      str += `index=${job.index} `
    }

    const origin = this.getOrigin(job)
    const limit = this.getLimit(job)

    let partialResult
    if (job.partialResult) {
      partialResult = ` partialResults=${job.partialResult.length}`
    } else {
      partialResult = ''
    }

    str += `origin=${short(origin)} limit=${short(limit)}${partialResult}`
    return str
  }
}
