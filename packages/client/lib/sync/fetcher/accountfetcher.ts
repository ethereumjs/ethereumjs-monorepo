import { isFalsy, Account } from '@ethereumjs/util'
import { Peer } from '../../net/peer'
import { Fetcher, FetcherOptions } from './fetcher'
// import { Chain } from '../../blockchain'
import { Job } from './types'

import { Trie, CheckpointTrie, LevelDB } from '@ethereumjs/trie'


type AccountData = {
	hash: Buffer
	body: any
}

/**
 * Implements an snap1 based account fetcher
 * @memberof module:sync/fetcher
 */
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
	AccountData[],
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
	 * MPT for storing account data with proofs - keys are hashed and data is in slim format (SNAPSHOT)
	 */
	accountTrie: CheckpointTrie

	/**
	 * Create new block fetcher
	 */
	constructor(options: AccountFetcherOptions) {
		super(options)

		// this.accountTrie = new CheckpointTrie({ db: new LevelDB(), root: options.root })
		this.accountTrie = new CheckpointTrie({ db: new LevelDB() })

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
	async request(job: Job<JobTask, AccountData[], Account>): Promise<AccountData[] | undefined> {
		const { task, peer, partialResult } = job
		const { origin, limit } = task

		const rangeResult = await peer!.snap!.getAccountRange({
			root: this.root,
			origin: origin,
			limit: limit,
			bytes: this.bytes,
		})

		const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`

		if (!rangeResult
			|| !rangeResult.accounts
			|| !rangeResult.proof
		) {
			// catch occasional null, empty, or incomplete responses
			this.debug(`Peer ${peerInfo} returned incomplete account range response for origin=${origin} and limit=${limit}`)
			return undefined
		}

		const trie = new Trie()
		const { accounts, proof } = rangeResult
		for (let i = 0; i < accounts.length - 1; i++) {
			// ensure the range is monotonically increasing
			if (accounts[i].hash.compare(accounts[i + 1].hash) === 1) {
				this.debug(`Peer ${peerInfo} returned Account hashes not monotonically increasing: ${i} ${accounts[i].hash} vs ${i + 1} ${accounts[i + 1].hash}`)
			}

			// put account data into trie
			const { hash, body } = accounts[i]
			await trie.put(hash, body as Buffer)
		}

		// Validate data using proofs
		try {
			this.debug('dbg0')

			// verify account data for first account returned using proof and state root
			const checkFirst = await trie.verifyProof(trie.root, accounts[0].hash, proof[0])
			this.debug('Proof for first account found to be valid: ' + checkFirst)
			if (!checkFirst) {
				this.debug(`Proof-based verification failed`)
				return undefined
			}

			// TODO should we check intermediary proofs?

			// verify account data for last account returned using proof and state root
			const checkLast = await trie.verifyProof(trie.root, accounts[accounts.length - 1].hash, proof[proof.length - 1])
			this.debug('Proof for last account found to be valid: ' + checkLast)
			if (!checkLast) {
				this.debug(`Proof-based verification failed`)
				return undefined
			}
		} catch (err) {
			console.log(err)
			this.debug(`Proof-based verification failed`)
			return undefined
		}

		// for data capture
		if (rangeResult) {
			process.exit()
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
	process(job: Job<JobTask, AccountData[], Account>, result: AccountData[]): Account[] | undefined {
		console.log('inside accountfetcher.process')
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

	/**
 * Returns an idle peer that can process a next job.
 */
	peer(): Peer | undefined {
		return this.pool.idle((peer) => 'snap' in peer)
	}
}