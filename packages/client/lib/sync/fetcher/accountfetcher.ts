import { isFalsy, Account, arrToBufArr, KECCAK256_NULL, KECCAK256_RLP } from '@ethereumjs/util'
import { Peer } from '../../net/peer'
import { Fetcher, FetcherOptions } from './fetcher'
// import { Chain } from '../../blockchain'
import { Job } from './types'

import { Trie, CheckpointTrie, LevelDB } from '@ethereumjs/trie'
import { keccak256 } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'

/**
 * Converts a slim account (per snap protocol spec) to the RLP encoded version of the account
 * @param body Array of 4 Buffer-like items to represent the account
 * @returns RLP encoded version of the account
 */
function convertSlimAccount(body: any) {
	const cpy = [body[0], body[1], body[2], body[3]]
	if (arrToBufArr(body[2]).length === 0) {
		// StorageRoot
		cpy[2] = KECCAK256_RLP
	}
	if (arrToBufArr(body[3]).length === 0) {
		// CodeHash
		cpy[3] = KECCAK256_NULL
	}
	return arrToBufArr(RLP.encode(cpy))
}


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

		// Step 1: validate the proof
		try {
			this.debug('dbg0')

			// verify account data for last account returned using proof and state root
			const checkLast = await trie.verifyProof(this.root, accounts[accounts.length-1].hash, proof)
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

		// Step 2: put all accounts into the Trie

		for (let i = 0; i < accounts.length; i++) {
			// ensure the range is monotonically increasing
			if (i != accounts.length - 1) {
				if (accounts[i].hash.compare(accounts[i + 1].hash) === 1) {
					this.debug(`Peer ${peerInfo} returned Account hashes not monotonically increasing: ${i} ${accounts[i].hash} vs ${i + 1} ${accounts[i + 1].hash}`)
				}
			}

			// put account data into trie
			const { hash, body } = accounts[i]
			const value = convertSlimAccount(body)
			await trie.put(hash, value)
		}

		// At this point, the trie is filled, but the trie only has the items "left" of the proof
		// The items "right" of the proof are thought to be empty by the trie (which is usually not the case)
		// Therefore, the trie root does not match the expected root

		// However, since we now have all the items "left" of the root, we can get these items
		// if the proof items are now dumped in raw into the DB

		// Step 3: put raw proof items in DB
		for (let item of proof) {
			await trie.db.put(keccak256(item), item)
		}

		// If the trie root is now set to the expected root, it should be possible to get the expected account items

		// Step 4: set trie root to expected root
		trie.root = this.root 

		// Step 5: verify that it is possible to get the accounts, and that the values are correct
		for (let i = 0; i <= accounts.length - 1; i++) {
			const account = accounts[i]
			const key = account.hash
			const expect = convertSlimAccount(account.body)
			const value = await trie.get(key)
			if (value === undefined || !value?.equals(expect)) {
				this.debug('Key/value pair does match expected value')
				return undefined
			}
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