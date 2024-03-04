import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Trie } from '@ethereumjs/trie'
import {
  BIGINT_0,
  BIGINT_1,
  BIGINT_100,
  BIGINT_2EXP256,
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountBodyToRLP,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  compareBytes,
  equalsBytes,
  formatBigDecimal,
  setLengthLeft,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { Event } from '../../types'
import { short } from '../../util'

import { ByteCodeFetcher } from './bytecodefetcher'
import { Fetcher } from './fetcher'
import { StorageFetcher } from './storagefetcher'
import { TrieNodeFetcher } from './trienodefetcher'
import { getInitFecherDoneFlags } from './types'

import type { Peer } from '../../net/peer'
import type { AccountData } from '../../net/protocol/snapprotocol'
import type { FetcherOptions } from './fetcher'
import type { StorageRequest } from './storagefetcher'
import type { Job, SnapFetcherDoneFlags } from './types'
import type { Debugger } from 'debug'
const { debug: createDebugLogger } = debugDefault

type AccountDataResponse = AccountData[] & { completed?: boolean }

/**
 * Implements an snap1 based account fetcher
 * @memberof module:sync/fetcher
 */
export interface AccountFetcherOptions extends FetcherOptions {
  /** Root hash of the account trie to serve */
  root: Uint8Array

  /** The origin to start account fetcher from (including), by default starts from 0 (0x0000...) */
  first: bigint
  /** The range to eventually, by default should be set at BIGINT_2 ** BigInt(256) + BIGINT_1 - first */
  count?: bigint

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean

  stateManager?: DefaultStateManager

  fetcherDoneFlags?: SnapFetcherDoneFlags
}

// root comes from block?
export type JobTask = {
  /** The origin to start account fetcher from */
  first: bigint
  /** Range to eventually fetch */
  count: bigint
}

export class AccountFetcher extends Fetcher<JobTask, AccountData[], AccountData> {
  protected debug: Debugger
  stateManager: DefaultStateManager
  accountTrie: Trie

  root: Uint8Array
  highestKnownHash: Uint8Array | undefined

  /** The origin to start account fetcher from (including), by default starts from 0 (0x0000...) */
  first: bigint
  /** The range to eventually, by default should be set at BIGINT_2 ** BigInt(256) + BIGINT_1 - first */
  count: bigint

  storageFetcher: StorageFetcher
  byteCodeFetcher: ByteCodeFetcher
  trieNodeFetcher: TrieNodeFetcher
  private readonly fetcherDoneFlags: SnapFetcherDoneFlags

  /**
   * Create new block fetcher
   */
  constructor(options: AccountFetcherOptions) {
    super(options)
    this.fetcherDoneFlags = options.fetcherDoneFlags ?? getInitFecherDoneFlags()

    this.root = options.root
    this.first = options.first
    this.count = options.count ?? BIGINT_2EXP256 - this.first

    this.stateManager = options.stateManager ?? new DefaultStateManager()
    this.accountTrie = this.stateManager['_getAccountTrie']()

    this.debug = createDebugLogger('client:AccountFetcher')

    this.storageFetcher = new StorageFetcher({
      config: this.config,
      pool: this.pool,
      root: this.root,
      storageRequests: [],
      first: BIGINT_1,
      destroyWhenDone: false,
      stateManager: this.stateManager,
      fetcherDoneFlags: this.fetcherDoneFlags,
    })
    this.byteCodeFetcher = new ByteCodeFetcher({
      config: this.config,
      pool: this.pool,
      hashes: [],
      destroyWhenDone: false,
      stateManager: this.stateManager,
      fetcherDoneFlags: this.fetcherDoneFlags,
    })
    this.trieNodeFetcher = new TrieNodeFetcher({
      config: this.config,
      pool: this.pool,
      root: this.root,
      stateManager: this.stateManager,
      destroyWhenDone: false,
      fetcherDoneFlags: this.fetcherDoneFlags,
    })

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

  async blockingFetch(): Promise<boolean> {
    this.fetcherDoneFlags.syncing = true

    try {
      // in next iterations we might make this dynamic depending on how far off we are from the
      // vmhead
      const accountFetch = !this.fetcherDoneFlags.accountFetcher.done ? super.blockingFetch() : null
      // wait for all accounts to fetch else storage and code fetcher's doesn't get us full data
      this.config.superMsg(`Snapsync: running accountFetch=${accountFetch !== null}`)

      // if account fetcher is working, storage fetchers might need to work
      if (accountFetch !== null) {
        this.fetcherDoneFlags.storageFetcher.done = false
        this.fetcherDoneFlags.byteCodeFetcher.done = false
      }
      // trienodes need to be tried on each fetch call
      this.fetcherDoneFlags.trieNodeFetcher.done = false

      await accountFetch
      if (this.fetcherDoneFlags.accountFetcher.done !== true) {
        throw Error('accountFetcher finished without completing the sync')
      }

      const storageFetch = !this.fetcherDoneFlags.storageFetcher.done
        ? this.storageFetcher.blockingFetch().then(
            () => this.snapFetchersCompleted(StorageFetcher),
            () => {
              throw Error('Snap fetcher failed to exit')
            }
          )
        : null
      const codeFetch = !this.fetcherDoneFlags.byteCodeFetcher.done
        ? this.byteCodeFetcher.blockingFetch().then(
            () => this.snapFetchersCompleted(ByteCodeFetcher),
            () => {
              throw Error('Snap fetcher failed to exit')
            }
          )
        : null

      this.config.superMsg(
        `Snapsync: running storageFetch=${storageFetch !== null} codeFetch=${codeFetch !== null}`
      )

      this.storageFetcher.setDestroyWhenDone()
      this.byteCodeFetcher.setDestroyWhenDone()
      await Promise.all([storageFetch, codeFetch])

      if (
        this.fetcherDoneFlags.storageFetcher.done !== true ||
        this.fetcherDoneFlags.byteCodeFetcher.done !== true
      ) {
        throw Error(
          `storageFetch or codeFetch didn't complete storageFetcherDone=${this.fetcherDoneFlags.storageFetcher.done} byteCodeFetcherDone=${this.fetcherDoneFlags.byteCodeFetcher.done}`
        )
      }

      // always do trienode fetch as this should only sync diffs else return
      // but currently it doesn't seem to be returning, so for static state
      // ignore this if previously build
      const trieNodeFetch = this.trieNodeFetcher.fetch().then(
        () => {
          this.snapFetchersCompleted(TrieNodeFetcher)
        },
        () => {
          throw Error('Snap fetcher failed to exit')
        }
      )
      this.config.superMsg(`Snapsync: running trieNodeFetch=${trieNodeFetch !== null}`)
      this.trieNodeFetcher.setDestroyWhenDone()
      await trieNodeFetch

      return true
    } catch (error) {
      this.config.logger.error(`Error while fetching snapsync: ${error}`)
      return false
    } finally {
      this.fetcherDoneFlags.syncing = false
      this.fetcherDoneFlags.accountFetcher.started = false
    }
  }

  snapFetchersCompleted(fetcherType: Object, root?: Uint8Array): void {
    const fetcherDoneFlags = this.fetcherDoneFlags

    switch (fetcherType) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      case AccountFetcher:
        fetcherDoneFlags.accountFetcher.done = true
        fetcherDoneFlags.accountFetcher.first = BIGINT_2EXP256
        fetcherDoneFlags.stateRoot = root

        if (fetcherDoneFlags.accountFetcher.first !== BIGINT_2EXP256) {
          const fetcherProgress = formatBigDecimal(
            fetcherDoneFlags.accountFetcher.first * BIGINT_100,
            BIGINT_2EXP256,
            BIGINT_100
          )
          this.config.logger.warn(
            `accountFetcher completed with pending range done=${fetcherProgress}%`
          )
        }
        break
      case StorageFetcher:
        fetcherDoneFlags.storageFetcher.done = true

        if (fetcherDoneFlags.storageFetcher.first !== fetcherDoneFlags.storageFetcher.count) {
          const reqsDone = formatBigDecimal(
            fetcherDoneFlags.storageFetcher.first * BIGINT_100,
            fetcherDoneFlags.storageFetcher.count,
            BIGINT_100
          )
          this.config.logger.warn(
            `storageFetcher completed with pending tasks done=${reqsDone}% of ${fetcherDoneFlags.storageFetcher.count} queued=${this.storageFetcher.storageRequests.length}`
          )
        }

        break
      case ByteCodeFetcher:
        fetcherDoneFlags.byteCodeFetcher.done = true

        if (fetcherDoneFlags.byteCodeFetcher.first !== fetcherDoneFlags.byteCodeFetcher.count) {
          const reqsDone = formatBigDecimal(
            fetcherDoneFlags.byteCodeFetcher.first * BIGINT_100,
            fetcherDoneFlags.byteCodeFetcher.count,
            BIGINT_100
          )
          this.config.logger.warn(
            `byteCodeFetcher completed with pending tasks done=${reqsDone}% of ${fetcherDoneFlags.byteCodeFetcher.count}`
          )
        }
        break
      case TrieNodeFetcher:
        fetcherDoneFlags.trieNodeFetcher.done = true
        break
    }

    const { accountFetcher, storageFetcher, byteCodeFetcher, trieNodeFetcher } = fetcherDoneFlags
    this.fetcherDoneFlags.done =
      accountFetcher.done && storageFetcher.done && byteCodeFetcher.done && trieNodeFetcher.done

    this.config.superMsg(
      `snapFetchersCompletion root=${short(this.root)} accountsRoot=${short(
        fetcherDoneFlags.stateRoot ?? 'na'
      )} done=${this.fetcherDoneFlags.done} accountsDone=${accountFetcher.done} storageDone=${
        storageFetcher.done
      } byteCodesDone=${byteCodeFetcher.done} trieNodesDone=${trieNodeFetcher.done}`
    )

    if (this.fetcherDoneFlags.done) {
      this.config.events.emit(Event.SYNC_SNAPSYNC_COMPLETE, this.root, this.stateManager)
    }
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

    const keys = accounts.map((acc: any) => acc.hash)
    const values = accounts.map((acc: any) => accountBodyToRLP(acc.body))
    // convert the request to the right values
    return Trie.verifyRangeProof(stateRoot, origin, keys[keys.length - 1], keys, values, proof, {
      common: this.config.chainCommon,
      useKeyHashingFunction: this.config.chainCommon?.customCrypto?.keccak256 ?? keccak256,
    })
  }

  private getOrigin(job: Job<JobTask, AccountData[], AccountData>): Uint8Array {
    const { task, partialResult } = job
    const { first } = task
    // Snap protocol will automatically pad it with 32 bytes left, so we don't need to worry
    const origin = partialResult
      ? bigIntToBytes(bytesToBigInt(partialResult[partialResult.length - 1].hash) + BIGINT_1)
      : bigIntToBytes(first)
    return setLengthLeft(origin, 32)
  }

  private getLimit(job: Job<JobTask, AccountData[], AccountData>): Uint8Array {
    const { task } = job
    const { first, count } = task
    const limit = bigIntToBytes(first + BigInt(count) - BIGINT_1)
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

    if (this.highestKnownHash && compareBytes(limit, this.highestKnownHash) < 0) {
      // skip this job and don't rerequest it if it's limit is lower than the highest known key hash
      this.debug(`skipping request with limit lower than highest known hash`)
      return Object.assign([], [{ skipped: true }], { completed: true })
    }

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
      equalsBytes(limit, bigIntToBytes(BIGINT_2EXP256)) === true
    ) {
      // check zero-element proof
      if (rangeResult.proof.length > 0) {
        try {
          const isMissingRightRange = await Trie.verifyRangeProof(
            this.root,
            origin,
            null,
            [],
            [],
            <any>rangeResult.proof,
            { useKeyHashingFunction: keccak256 }
          )
          // if proof is false, reject corrupt peer
          if (isMissingRightRange !== false) return undefined
        } catch (e) {
          this.debug(e)
          // if proof is false, reject corrupt peer
          return undefined
        }

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

    // update highest known hash
    const highestReceivedhash = result.at(-1)?.hash as Uint8Array
    if (this.highestKnownHash) {
      if (compareBytes(highestReceivedhash, this.highestKnownHash) > 0) {
        this.highestKnownHash = highestReceivedhash
      }
    } else {
      this.highestKnownHash = highestReceivedhash
    }

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

    if (JSON.stringify(result[0]) === JSON.stringify({ skipped: true })) {
      // return without storing to skip this task
      return
    }
    if (JSON.stringify(result[0]) === JSON.stringify(Object.create(null))) {
      // TODO fails to handle case where there is a proof of non existence and returned accounts for last requested range
      this.debug('Final range received with no elements remaining to the right')

      await this.accountTrie.persistRoot()
      this.snapFetchersCompleted(AccountFetcher, this.accountTrie.root())
      return
    }

    const storageFetchRequests = new Set()
    const byteCodeFetchRequests = new Set<Uint8Array>()
    for (const account of result) {
      // what we have is hashed account and not its pre-image, so we skipKeyTransform
      await this.accountTrie.put(account.hash, accountBodyToRLP(account.body), true)

      // build record of accounts that need storage slots to be fetched
      const storageRoot: Uint8Array = account.body[2]
      if (equalsBytes(storageRoot, KECCAK256_RLP) === false) {
        storageFetchRequests.add({
          accountHash: account.hash,
          storageRoot,
          first: BIGINT_0,
          count: BIGINT_2EXP256 - BIGINT_1,
        })
      }
      // build record of accounts that need bytecode to be fetched
      const codeHash: Uint8Array = account.body[3]
      if (!(equalsBytes(codeHash, KECCAK256_NULL) === true)) {
        byteCodeFetchRequests.add(codeHash)
      }
    }

    // update what has been synced for accountfetcher
    const lastFetched = result[result.length - 1]
    if (lastFetched !== undefined && lastFetched !== null) {
      this.fetcherDoneFlags.accountFetcher.first = bytesToBigInt(lastFetched.hash)
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
    let pushedCount = BIGINT_0
    const startedWith = first

    while (count >= BigInt(max) && tasks.length < maxTasks) {
      tasks.push({ first, count: max })
      first += BigInt(max)
      count -= BigInt(max)
      pushedCount += BigInt(max)
    }
    if (count > BIGINT_0 && tasks.length < maxTasks) {
      tasks.push({ first, count })
      first += BigInt(count)
      pushedCount += count
      count = BIGINT_0
    }

    // If we started with where this.first was, i.e. there are no gaps and hence
    // we can move this.first to where its now, and reduce count by pushedCount
    if (startedWith === this.first) {
      this.first = first
      this.count = this.count - pushedCount
    }

    debugStr += ` limit=${short(
      setLengthLeft(bigIntToBytes(startedWith + pushedCount - BIGINT_1), 32)
    )}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  updateStateRoot(stateRoot: Uint8Array) {
    this.root = stateRoot
  }

  nextTasks(): void {
    if (
      this.in.length === 0 &&
      this.count > BIGINT_0 &&
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
    const stepBack = BIGINT_0
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
