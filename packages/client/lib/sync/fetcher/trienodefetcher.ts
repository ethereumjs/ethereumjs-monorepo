import { BranchNode, Trie, decodeNode } from '@ethereumjs/trie'
import { bytesToNibbles, getPathTo, nibblesToCompactBytes } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import { OrderedMap } from 'js-sdsl'

import { Fetcher } from './fetcher'

import type { Peer } from '../../net/peer'
import type { FetcherOptions } from './fetcher'
import type { Job } from './types'
import type { Debugger } from 'debug'

type TrieNodesResponse = Uint8Array[] & { completed?: boolean }

/**
 * Implements an snap1 based bytecode fetcher
 * @memberof module:sync/fetcher
 */
export interface TrieNodeFetcherOptions extends FetcherOptions {
  root: Uint8Array
  accountTrie?: Trie
  codeTrie?: Trie
  accountToStorageTrie?: Map<String, Trie>

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

export type JobTask = {
  pathStrings: string[]
  paths: Uint8Array[][] // paths to nodes for requesting from SNAP API
}

export class TrieNodeFetcher extends Fetcher<JobTask, Uint8Array[], Uint8Array> {
  protected debug: Debugger
  root: Uint8Array

  // Holds all paths and nodes that need to be requested
  pathToNodeHash: OrderedMap<string, string>

  // Holds active requests to remove after storing
  requestedNodeToPath: Map<string, string>

  accountTrie: Trie
  codeTrie: Trie
  accountToStorageTrie: Map<String, Trie>

  /**
   * Create new block fetcher
   */
  constructor(options: TrieNodeFetcherOptions) {
    super(options)
    this.root = options.root
    this.pathToNodeHash = new OrderedMap<string, string>()
    this.requestedNodeToPath = new Map<string, string>()
    this.accountTrie = options.accountTrie ?? new Trie({ useKeyHashing: false })
    this.codeTrie = options.codeTrie ?? new Trie({ useKeyHashing: false })
    this.accountToStorageTrie = options.accountToStorageTrie ?? new Map<String, Trie>()

    this.debug = createDebugLogger('client:TrieNodeFetcher')

    // will always start with root node as first request
    this.pathToNodeHash.setElement(getPathTo(0, this.root).join('/'), bytesToHex(this.root))

    this.debug(
      `Trie node fetcher instantiated with ${this.pathToNodeHash.size()} node requests destroyWhenDone=${
        this.destroyWhenDone
      }`
    )
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
  ): Promise<TrieNodesResponse | undefined> {
    const { task, peer } = job
    const { pathStrings, paths } = task

    this.debug(`requested paths: ${JSON.stringify(paths)}`)

    const rangeResult = await peer!.snap!.getTrieNodes({
      root: this.root,
      paths,
      bytes: BigInt(this.config.maxRangeBytes),
    })

    // Response is valid, but check if peer is signalling that it does not have
    // the requested data. For bytecode range queries that means the peer is not
    // yet synced.
    if (rangeResult === undefined || paths.length < rangeResult.nodes.length) {
      this.debug(`Peer rejected trienode request`)
      return undefined
    }

    try {
      this.debug(rangeResult.nodes.length)
      this.debug(rangeResult.nodes)
      for (let i = 0; i < rangeResult.nodes.length; i++) {
        this.debug(`rangeResult: ${bytesToHex(rangeResult.nodes[i])}`)
        this.debug(`decoded node: ${JSON.stringify(decodeNode(rangeResult.nodes[i]))}`)
      }

      // While results are in the same order as requested hashes but there could be gaps/misses in the results
      // if the node doesn't has the bytecode. We need an index to move forward through the hashes which are
      // absent in the receieved responses
      const receievedNodes: Uint8Array[] = []
      const requestedNodes = new Set(Array.from(this.requestedNodeToPath.keys()))
      for (let i = 0; i < rangeResult.nodes.length; i++) {
        const receivedNode = rangeResult.nodes[i]
        const receivedHash = bytesToHex(keccak256(receivedNode))
        if (requestedNodes.has(receivedHash)) {
          // TODO need to remove filled nodes from both pathToNodeHash and nodeHashToPath
          receievedNodes.push(rangeResult.nodes[i])
        }
      }
      return Object.assign([], [receievedNodes], { completed: true })
    } catch (e) {
      this.debug(e)
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
    job: Job<JobTask, Uint8Array[], Uint8Array>,
    result: TrieNodesResponse
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
    console.log('dbg2')
    console.log(JSON.stringify(result))

    try {
      // put node data into trie and request unkown nodes
      for (const nodeData of result[0]) {
        const node = decodeNode(nodeData as unknown as Uint8Array)
        const nodeHash = bytesToHex(keccak256(nodeData as unknown as Uint8Array))
        const pathString = this.requestedNodeToPath.get(nodeHash)
        const [accountPath, storagePath] = pathString!.split('/')

        // process account node
        if (storagePath === undefined) {
          // request unkown child nodes
          if (node instanceof BranchNode) {
            for (const [_, embeddedNode] of (node as BranchNode).getChildren()) {
              try {
                await this.accountTrie.lookupNode(embeddedNode)
              } catch (e) {
                // if node doesn't exist, error is thrown and node request is created for fetching
                this.pathToNodeHash.setElement(
                  nibblesToCompactBytes(bytesToNibbles(embeddedNode[0] as Uint8Array)).toString(),
                  bytesToHex(embeddedNode[0] as Uint8Array) // TODO confused on how to get key from a embedded node
                )
              }
            }
          }

          // process storage node
        } else {
          // request unkown child nodes
          if (node instanceof BranchNode) {
            for (const [_, embeddedNode] of (node as BranchNode).getChildren()) {
              try {
                const storageTrie = this.accountToStorageTrie.get(accountPath)
                await storageTrie!.lookupNode(embeddedNode)
              } catch (e) {
                // if node doesn't exist, error is thrown and node request is created for fetching
                this.pathToNodeHash.setElement(
                  nibblesToCompactBytes(bytesToNibbles(embeddedNode[0] as Uint8Array)).toString(),
                  bytesToHex(embeddedNode[0] as Uint8Array)
                )
              }
            }
          }
        }

        // remove filled requests
        this.requestedNodeToPath.delete(nodeHash)
        // this.pathToNodeHash.eraseElementByKey(pathString as string)
      }
    } catch (e) {
      this.debug(e)
    }

    // this.debug(`Stored ${storeCount} bytecode in code trie`)
  }

  // TODO do merging here too and rename as getSortedAndMergedPaths
  getSortedPathStrings() {
    const pathStrings = []
    for (const [pathString, _] of this.pathToNodeHash) {
      pathStrings.push(pathString) // keep this as a string in task
    }
    return { pathStrings }
  }

  mergeAndFormatPaths(pathStrings: string[]) {
    return pathStrings.map((s) => [hexToBytes(s)])
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   */
  tasks(maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    if (this.pathToNodeHash.size() > 0) {
      let { pathStrings } = this.getSortedPathStrings() // TODO pass in number of paths to return
      while (tasks.length < maxTasks && pathStrings.length > 0) {
        const requestedPathStrings = pathStrings.slice(0, max)
        pathStrings = pathStrings.slice(max + 1)
        for (const pathString of requestedPathStrings) {
          const nodeHash = this.pathToNodeHash.getElementByKey(pathString) // TODO return node set too from sorted function and avoid lookups here
          if (nodeHash === undefined) throw Error('Path should exist')
          this.requestedNodeToPath.set(nodeHash as string, pathString)
        }
        tasks.push({
          pathStrings: requestedPathStrings,
          paths: this.mergeAndFormatPaths(requestedPathStrings),
        })
        this.debug(`Created new tasks num=${tasks.length}`)
      }
    }
    this.debug(`Created new tasks num=${tasks.length}`)
    return tasks
  }

  nextTasks(): void {
    try {
      if (this.in.length === 0) {
        if (this.pathToNodeHash.size() > 0) {
          const tasks = this.tasks()
          let count = 0
          for (const task of tasks) {
            count += task.pathStrings.length
            this.enqueueTask(task, true)
          }
          this.debug(`Fetcher pending with ${count} path requested`)
        }
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

    str += `${job.task.paths.length} node requests`
    return str
  }
}
