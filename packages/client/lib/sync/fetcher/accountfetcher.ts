import { Account } from '@ethereumjs/util'
import { Peer } from '../../net/peer'
import { Fetcher, FetcherOptions } from './fetcher'
// import { Chain } from '../../blockchain'
import { Job } from './types'

export interface AccountFetcherOptions extends FetcherOptions {
	/** Root hash of the account trie to serve */
	root: Buffer

	/** Account hash of the first to retrieve */
	origin: Buffer

	/** Account hash after which to stop serving data */
	limit: Buffer

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

export class AccountFetcher extends Fetcher<
	JobTask,
	Account[],
	Account
> {
	/**
	 * Where the fetcher starts apart from the tasks already in the `in` queue.
	 */
	root: Buffer
	/**
	 * Account hash of the first to retrieve
	 */
	origin: Buffer
	/**
	 * Account hash after which to stop serving data
	 */
	limit: Buffer
	/**
	 * Soft limit at which to stop returning data
	 */
	bytes: bigint

	/**
	 * Create new block fetcher
	 */
	constructor(options: AccountFetcherOptions) {
		super(options)

		this.root = options.root
		this.origin = options.origin
		this.limit = options.limit
		this.bytes = options.bytes

		this.debug(
			`Account fetcher instantiated root=${this.root} origin=${this.origin} limit=${this.limit} bytes=${this.bytes} destroyWhenDone=${this.destroyWhenDone}`
		)
	}

	/**
	 * Request results from peer for the given job.
	 * Resolves with the raw result
	 * If `undefined` is returned, re-queue the job.
	 * @param job
	 * @param peer
	 */
	async request(job: Job<JobTask, Account[], Account>): Promise<Account[] | undefined> {
		console.log('inside accountfetcher.request')
		const { task, peer, partialResult } = job
		let { origin, limit } = task

		const rangeResult = await peer!.snap!.getAccountRange({
			root: this.root,
			origin: origin,
			limit: limit,
			bytes: this.bytes,
		})

		let accounts: Account[] = []
		for (let i = 0; i < rangeResult?.accounts.length; i++) {
			accounts.push(Account.fromAccountData({
				stateRoot: this.root,
				codeHash: rangeResult?.accounts[i].hash,
			}))
		}

		console.log(accounts)

		// for data capture
		// if (rangeResult) {
		// 	process.exit()
		// }

		return accounts
	}

	/**
	 * Process the reply for the given job.
	 * If the reply contains unexpected data, return `undefined`,
	 * this re-queues the job.
	 * @param job fetch job
	 * @param result result data
	 */
	process(job: Job<JobTask, Account[], Account>, result: Account[]): Account[] | undefined {
		return
	}

	/**
	* Store fetch result. Resolves once store operation is complete.
	* @param result fetch result
	*/
	async store(result: Account[]): Promise<void> {
		console.log('inside accountfetcher.store')
		return
	}

	/**
	 * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
	 * remaining items apart from the tasks it pushes in the queue
	 */
	tasks(origin = this.origin, limit = this.limit, maxTasks = this.config.maxFetcherJobs): JobTask[] {
		const max = this.config.maxPerRequest
		const tasks: JobTask[] = []
		tasks.push({ origin: origin, limit: limit })

		console.log(`Created new tasks num=${tasks.length} tasks=${tasks}`)
		return tasks
	}

	nextTasks(): void {
		const tasks = this.tasks(this.origin, this.limit)
		for (const task of tasks) {
			this.enqueueTask(task)
		}
	}

	/**
	 * Clears all outstanding tasks from the fetcher
	 */
	clear() {
		return
	}
}