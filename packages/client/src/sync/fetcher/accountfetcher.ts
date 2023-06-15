import { Trie } from '@ethereumjs/trie'
import {
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountBodyToRLP,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'

import { LevelDB } from '../../execution/level'
import { Event } from '../../types'
import { short } from '../../util'

import { ByteCodeFetcher } from './bytecodefetcher'
import { Fetcher } from './fetcher'
import { StorageFetcher } from './storagefetcher'

import type { Peer } from '../../net/peer'
import type { AccountData } from '../../net/protocol/snapprotocol'
import type { EventBusType } from '../../types'
import type { FetcherOptions } from './fetcher'
import type { StorageRequest } from './storagefetcher'
import type { Job } from './types'
import type { Debugger } from 'debug'

type AccountDataResponse = AccountData[] & { completed?: boolean }

/**
 * Implements an snap1 based account fetcher
 * @memberof module:sync/fetcher
 */
export interface AccountFetcherOptions extends FetcherOptions {
  /** Root hash of the account trie to serve */
  root: Uint8Array

  /** The origin to start account fetcher from */
  first: bigint

  /** Range to eventually fetch */
  count?: bigint

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

// root comes from block?
export type JobTask = {
  /** The origin to start account fetcher from */
  first: bigint
  /** Range to eventually fetch */
  count: bigint
}

export type FetcherDoneFlags = {
  storageFetcherDone: boolean
  accountFetcherDone: boolean
  byteCodeFetcherDone: boolean
  eventBus?: EventBusType | undefined
  stateRoot?: Uint8Array | undefined
}

export function snapFetchersCompleted(
  fetcherDoneFlags: FetcherDoneFlags,
  fetcherType: Object,
  root?: Uint8Array,
  eventBus?: EventBusType
) {
  switch (fetcherType) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    case AccountFetcher:
      fetcherDoneFlags.accountFetcherDone = true
      fetcherDoneFlags.stateRoot = root
      fetcherDoneFlags.eventBus = eventBus
      break
    case StorageFetcher:
      fetcherDoneFlags.storageFetcherDone = true
      break
    case ByteCodeFetcher:
      fetcherDoneFlags.byteCodeFetcherDone = true
      break
  }
  if (
    fetcherDoneFlags.accountFetcherDone &&
    fetcherDoneFlags.storageFetcherDone &&
    fetcherDoneFlags.byteCodeFetcherDone
  ) {
    fetcherDoneFlags.eventBus!.emit(Event.SYNC_SNAPSYNC_COMPLETE, fetcherDoneFlags.stateRoot!)
  }
}

export class AccountFetcher extends Fetcher<JobTask, AccountData[], AccountData> {
  protected debug: Debugger

  /**
   * The stateRoot for the fetcher which sorts of pin it to a snapshot.
   * This might eventually be removed as the snapshots are moving and not static
   */
  root: Uint8Array

  /** The origin to start account fetcher from (including), by default starts from 0 (0x0000...) */
  first: bigint

  /** The range to eventually, by default should be set at BigInt(2) ** BigInt(256) + BigInt(1) - first */
  count: bigint

  /** Contains known bytecodes */
  trie: Trie

  storageFetcher: StorageFetcher

  byteCodeFetcher: ByteCodeFetcher

  accountTrie: Trie

  accountToStorageTrie: Map<String, Trie>

  fetcherDoneFlags: FetcherDoneFlags = {
    storageFetcherDone: false,
    accountFetcherDone: false,
    byteCodeFetcherDone: false,
  }

  /**
   * Create new block fetcher
   */
  constructor(options: AccountFetcherOptions) {
    super(options)
    this.root = options.root
    this.first = options.first
    this.count = options.count ?? BigInt(2) ** BigInt(256) - this.first
    this.trie = new Trie({ useKeyHashing: false })
    this.accountTrie = new Trie({ useKeyHashing: false })
    this.accountToStorageTrie = new Map()
    this.debug = createDebugLogger('client:AccountFetcher')
    this.storageFetcher = new StorageFetcher({
      config: this.config,
      pool: this.pool,
      root: this.root,
      storageRequests: [],
      first: BigInt(1),
      destroyWhenDone: false,
      accountToStorageTrie: this.accountToStorageTrie,
    })
    this.storageFetcher.fetch().then(
      () => snapFetchersCompleted(this.fetcherDoneFlags, StorageFetcher),
      () => {
        throw Error('Snap fetcher failed to exit')
      }
    )
    this.byteCodeFetcher = new ByteCodeFetcher({
      config: this.config,
      pool: this.pool,
      hashes: [],
      destroyWhenDone: false,
      trie: this.trie,
    })
    this.byteCodeFetcher.fetch().then(
      () => snapFetchersCompleted(this.fetcherDoneFlags, ByteCodeFetcher),
      () => {
        throw Error('Snap fetcher failed to exit')
      }
    )

    const syncRange = { task: { first: this.first, count: this.count } } as Job<
      JobTask,
      AccountData[],
      AccountData
    >
    const origin = this.getOrigin(syncRange)
    const limit = this.getLimit(syncRange)

    this.debug(
      `Account fetcher instantiated root=${short(this.root)} origin=${short(origin)} limit=${short(
        limit
      )} destroyWhenDone=${this.destroyWhenDone}`
    )
  }

  private async verifyRangeProof(
    stateRoot: Uint8Array,
    origin: Uint8Array,
    { accounts, proof }: { accounts: AccountData[]; proof: Uint8Array[] }
  ): Promise<boolean> {
    this.debug(
      `verifyRangeProof accounts:${accounts.length} first=${bytesToHex(
        accounts[0].hash
      )} last=${short(accounts[accounts.length - 1].hash)}`
    )

    for (let i = 0; i < accounts.length - 1; i++) {
      // ensure the range is monotonically increasing
      if (bytesToBigInt(accounts[i].hash) > bytesToBigInt(accounts[i + 1].hash)) {
        throw Error(
          `Account hashes not monotonically increasing: ${i} ${accounts[i].hash} vs ${i + 1} ${
            accounts[i + 1].hash
          }`
        )
      }
    }

    const trie = new Trie({ db: new LevelDB() })
    const keys = accounts.map((acc: any) => acc.hash)
    const values = accounts.map((acc: any) => accountBodyToRLP(acc.body))
    // convert the request to the right values
    return trie.verifyRangeProof(stateRoot, origin, keys[keys.length - 1], keys, values, <any>proof)
  }

  private getOrigin(job: Job<JobTask, AccountData[], AccountData>): Uint8Array {
    const { task, partialResult } = job
    const { first } = task
    // Snap protocol will automatically pad it with 32 bytes left, so we don't need to worry
    const origin = partialResult
      ? bigIntToBytes(bytesToBigInt(partialResult[partialResult.length - 1].hash) + BigInt(1))
      : bigIntToBytes(first)
    return setLengthLeft(origin, 32)
  }

  private getLimit(job: Job<JobTask, AccountData[], AccountData>): Uint8Array {
    const { task } = job
    const { first, count } = task
    const limit = bigIntToBytes(first + BigInt(count) - BigInt(1))
    return setLengthLeft(limit, 32)
  }

  private isMissingRightRange(
    limit: Uint8Array,
    { accounts, proof: _proof }: { accounts: AccountData[]; proof: Uint8Array[] }
  ): boolean {
    if (
      accounts.length > 0 &&
      accounts[accounts.length - 1] !== undefined &&
      bytesToBigInt(accounts[accounts.length - 1].hash) >= bytesToBigInt(limit)
    ) {
      return false
    } else {
      // TODO: Check if there is a proof of missing limit in state
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
    job: Job<JobTask, AccountData[], AccountData>
  ): Promise<AccountDataResponse | undefined> {
    const { peer } = job
    const origin = this.getOrigin(job)
    const limit = this.getLimit(job)

    const rangeResult = await peer!.snap!.getAccountRange({
      root: this.root,
      origin,
      limit,
      bytes: BigInt(this.config.maxRangeBytes),
    })
    if (rangeResult === undefined) {
      return undefined
    }

    if (
      rangeResult.accounts.length === 0 ||
      equalsBytes(limit, bigIntToBytes(BigInt(2) ** BigInt(256))) === true
    ) {
      // TODO have to check proof of nonexistence -- as a shortcut for now, we can mark as completed if a proof is present
      if (rangeResult.proof.length > 0) {
        this.debug(`Data for last range has been received`)
        // response contains empty object so that task can be terminated in store phase and not reenqueued
        return Object.assign([], [Object.create(null)], { completed: true })
      }
    }

    const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`
    // validate the proof
    try {
      // verifyRangeProof will also verify validate there are no missed states between origin and
      // response data
      const isMissingRightRange = await this.verifyRangeProof(this.root, origin, rangeResult)

      // Check if there is any pending data to be synced to the right
      let completed: boolean
      if (isMissingRightRange && this.isMissingRightRange(limit, rangeResult)) {
        this.debug(
          `Peer ${peerInfo} returned missing right range account=${bytesToHex(
            rangeResult.accounts[rangeResult.accounts.length - 1].hash
          )} limit=${bytesToHex(limit)}`
        )
        completed = false
      } else {
        completed = true
      }
      return Object.assign([], rangeResult.accounts, { completed })
    } catch (err) {
      throw Error(`InvalidAccountRange: ${err}`)
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
    job: Job<JobTask, AccountData[], AccountData>,
    result: AccountDataResponse
  ): AccountData[] | undefined {
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
  async store(result: AccountData[]): Promise<void> {
    this.debug(`Stored ${result.length} accounts in account trie`)

    // TODO fails to handle case where there is a proof of non existence and returned accounts for last requested range
    if (JSON.stringify(result[0]) === JSON.stringify(Object.create(null))) {
      this.debug('Final range received with no elements remaining to the right')

      // TODO include stateRoot in emission once moved over to using MPT's
      await this.accountTrie.persistRoot()
      snapFetchersCompleted(
        this.fetcherDoneFlags,
        AccountFetcher,
        this.accountTrie.root(),
        this.config.events
      )

      this.byteCodeFetcher.setDestroyWhenDone()

      return
    }
    const storageFetchRequests = new Set()
    const byteCodeFetchRequests = new Set<Uint8Array>()
    for (const account of result) {
      await this.accountTrie.put(account.hash, accountBodyToRLP(account.body))

      // build record of accounts that need storage slots to be fetched
      const storageRoot: Uint8Array = account.body[2]
      if (equalsBytes(storageRoot, KECCAK256_RLP) === false) {
        storageFetchRequests.add({
          accountHash: account.hash,
          storageRoot,
          first: BigInt(0),
          count: BigInt(2) ** BigInt(256) - BigInt(1),
        })
      }
      // build record of accounts that need bytecode to be fetched
      const codeHash: Uint8Array = account.body[3]
      if (!(equalsBytes(codeHash, KECCAK256_NULL) === true)) {
        byteCodeFetchRequests.add(codeHash)
      }
    }
    if (storageFetchRequests.size > 0)
      this.storageFetcher.enqueueByStorageRequestList(
        Array.from(storageFetchRequests) as StorageRequest[]
      )
    if (byteCodeFetchRequests.size > 0)
      this.byteCodeFetcher.enqueueByByteCodeRequestList(
        Array.from(byteCodeFetchRequests) as Uint8Array[]
      )
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   *
   * Divides the full 256-bit range of hashes into ranges of @maxAccountRange
   * size and turnes each range into a task for the fetcher
   */

  tasks(first = this.first, count = this.count, maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxAccountRange
    const tasks: JobTask[] = []
    let debugStr = `origin=${short(setLengthLeft(bigIntToBytes(first), 32))}`
    let pushedCount = BigInt(0)
    const startedWith = first

    while (count >= BigInt(max) && tasks.length < maxTasks) {
      tasks.push({ first, count: max })
      first += BigInt(max)
      count -= BigInt(max)
      pushedCount += BigInt(max)
    }
    if (count > BigInt(0) && tasks.length < maxTasks) {
      tasks.push({ first, count })
      first += BigInt(count)
      pushedCount += count
      count = BigInt(0)
    }

    // If we started with where this.first was, i.e. there are no gaps and hence
    // we can move this.first to where its now, and reduce count by pushedCount
    if (startedWith === this.first) {
      this.first = first
      this.count = this.count - pushedCount
    }

    debugStr += ` limit=${short(
      setLengthLeft(bigIntToBytes(startedWith + pushedCount - BigInt(1)), 32)
    )}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  nextTasks(): void {
    if (
      this.in.length === 0 &&
      this.count > BigInt(0) &&
      this.processed - this.finished < this.config.maxFetcherRequests
    ) {
      // pendingRange is for which new tasks need to be generated
      const pendingRange = { task: { first: this.first, count: this.count } } as Job<
        JobTask,
        AccountData[],
        AccountData
      >
      const origin = this.getOrigin(pendingRange)
      const limit = this.getLimit(pendingRange)

      this.debug(`Fetcher pending with origin=${short(origin)} limit=${short(limit)}`)
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
  jobStr(job: Job<JobTask, AccountData[], AccountData>, withIndex = false) {
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
