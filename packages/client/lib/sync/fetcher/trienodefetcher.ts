import { BranchNode, ExtensionNode, Trie, decodeNode } from '@ethereumjs/trie'
import {
  BatchDBOp,
  bytesToNibbles,
  compactBytesToNibbles,
  getPathTo,
  hexToKeybytes,
  nibblesToBytes,
  nibblesToCompactBytes,
  padToEven,
  hasTerminator,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import { OrderedMap } from 'js-sdsl'
import path from 'path'

import { Fetcher } from './fetcher'

import type { Peer } from '../../net/peer'
import type { FetcherOptions } from './fetcher'
import type { Job } from './types'
import type { Nibbles, TrieNode } from '@ethereumjs/trie'
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
  pathStrings: string[] // paths kept in keybyte encoding until they are ready to send out
  paths: Uint8Array[][] // paths to nodes for requesting from SNAP API kept in compact encoding
}

type FetchedNodeData = {
  parentHash: string
  deps: number
  nodeData: Uint8Array
  path: string
}

type NodeRequestData = {
  nodeHash: string
  nodeParentHash: string
}

export class TrieNodeFetcher extends Fetcher<JobTask, Uint8Array[], Uint8Array> {
  protected debug: Debugger
  root: Uint8Array

  // Holds all paths and nodes that need to be requested
  pathToNodeRequestData: OrderedMap<string, NodeRequestData>

  // Holds active requests to remove after storing
  requestedNodeToPath: Map<string, string>

  fetchedAccountNodes: Map<string, FetchedNodeData> // key is node hash

  accountTrie: Trie
  codeTrie: Trie
  accountToStorageTrie: Map<String, Trie>

  /**
   * Create new block fetcher
   */
  constructor(options: TrieNodeFetcherOptions) {
    super(options)
    this.root = options.root
    this.pathToNodeRequestData = new OrderedMap<string, NodeRequestData>()
    this.requestedNodeToPath = new Map<string, string>()
    this.fetchedAccountNodes = new Map<string, FetchedNodeData>()
    this.accountTrie = options.accountTrie ?? new Trie({ useKeyHashing: false })
    this.codeTrie = options.codeTrie ?? new Trie({ useKeyHashing: false })
    this.accountToStorageTrie = options.accountToStorageTrie ?? new Map<String, Trie>()

    this.debug = createDebugLogger('client:TrieNodeFetcher')

    // will always start with root node as first set of node requests
    this.pathToNodeRequestData.setElement('', {
      nodeHash: bytesToHex(this.root),
      nodeParentHash: '', // root node does not have a parent
    } as NodeRequestData)

    this.debug(
      `Trie node fetcher instantiated with ${this.pathToNodeRequestData.size()} node requests destroyWhenDone=${
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

    this.debug(`requested paths:`)
    // this.debug(paths)

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
      // While results are in the same order as requested hashes but there could be gaps/misses in the results
      // if the node doesn't has the bytecode. We need an index to move forward through the hashes which are
      // absent in the receieved responses
      const receivedNodes: Uint8Array[] = []
      const requestedNodes = new Set(Array.from(this.requestedNodeToPath.keys()))
      for (let i = 0; i < rangeResult.nodes.length; i++) {
        const receivedNode = rangeResult.nodes[i]
        const receivedHash = bytesToHex(keccak256(receivedNode) as Uint8Array)
        if (requestedNodes.has(receivedHash)) {
          receivedNodes.push(rangeResult.nodes[i])
        }
      }
      return Object.assign([], [receivedNodes], { completed: true })
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

  getNodeKey(node: TrieNode) {
    try {
      const encoded = node.serialize()
      if (encoded.length >= 32) {
        return keccak256(encoded)
      }
      return node.raw()
    } catch (e) {
      this.debug(e)
    }
  }

  /**
   * Converts a nibble array into bytes.
   * @private
   * @param arr - Nibble array
   */
  nibblesToBytes(arr: Nibbles): Uint8Array {
    const buf = new Uint8Array(arr.length / 2)
    for (let i = 0; i < buf.length; i++) {
      let q = i * 2
      buf[i] = (arr[q] << 4) + arr[++q]
    }
    return buf
  }

  // ResolvePath resolves the provided composite node path by separating the
  // path in account trie if it's existent.
  // func ResolvePath(path []byte) (common.Hash, []byte) {
  //   var owner common.Hash
  //   if len(path) >= 2*common.HashLength {
  //     owner = common.BytesToHash(hexToKeybytes(path[:2*common.HashLength]))
  //     path = path[2*common.HashLength:]
  //   }
  //   return owner, path
  // }

  // resolvePath(path: string) {
  //   const [accountPath, storagePath] = path!.split('/')
  //   if (accountPath.length === 2 * 32) {
  //     accountPath = hexToKeybytes(accountPath)
  //   }

  //   return [accountPath, storagePath]
  // }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param result fetch result
   */
  async store(result: Uint8Array[]): Promise<void> {
    this.debug('At start of store phase')

    try {
      // process received node data and request unknown child nodes
      for (const nodeData of result[0]) {
        const node = decodeNode(nodeData as unknown as Uint8Array)
        const nodeHash = bytesToHex(keccak256(nodeData as unknown as Uint8Array))
        const pathString = this.requestedNodeToPath.get(nodeHash)
        const [accountPath, storagePath] = pathString!.split('/')
        const nodePath = storagePath ?? accountPath
        const childNodes = []
        let unknownChildNodeCount = 0

        // get all children of received node
        if (node instanceof BranchNode) {
          const children = (node as BranchNode).getChildren()
          for (const [i, embeddedNode] of children) {
            if (embeddedNode !== null) {
              // let embeddedNodeHash = null
              // const encoded = node.serialize()
              // if (encoded.length >= 32) {
              //   embeddedNodeHash = keccak256(encoded)
              // } else {
              //   embeddedNodeHash = node.raw()
              // }
              // if (embeddedNode.length < 32) {
              //   console.log('dbg4')
              //   console.log(embeddedNode.length)
              // } else {
              //   console.log('dbg5')
              // }
              childNodes.unshift({
                nodeHash: embeddedNode, // TODO not sure if I'm calculating the node hash of an embedded node correctly since <32 bytes is embedded and not hashed
                path: nodePath.concat(bytesToHex(Uint8Array.from([i]))),
              })
            }
          }
        } else if (node instanceof ExtensionNode) {
          this.debug('extension node found')

          const key = node.key()
          let hexEncodedKey
          if (key.length < 2) {
            console.log('key is of length less than 2')

            hexEncodedKey = Uint8Array.from(key)
          } else {
            console.log('key is of length 2 or greater')

            // I don't think you need both nibblesToBytes and bytesToNibbles, they seem to both be doing the same thing
            // TODO this is still unverified for extensions of key length greater than 2
            hexEncodedKey = this.nibblesToBytes(key)
            hexEncodedKey = bytesToNibbles(hexEncodedKey)
            hexEncodedKey = hexEncodedKey.subarray(0, hexEncodedKey.length - 1)
          }
          console.log(key)
          console.log(bytesToHex(node.value()))
          const val = {
            nodeHash: node.value(),
            path: nodePath.concat(bytesToHex(hexEncodedKey)),
          }
          childNodes.unshift(val)
        } else {
          this.debug('leaf node found')

          // TODO implement leaf callback for batching and putting all nodes when dependencies have been fetched
          // TODO perform leaf callback on all paths that are full and complete, with partial paths handled bellow
          // TODO should probably do leaf callback after putting nodes in completed set, that is happening right bellow
        }

        // request unknown child nodes that have been freshly discovered
        for (const childNode of childNodes) {
          try {
            if (storagePath !== undefined) {
              // look up node in storage trie
              const storageTrie = this.accountToStorageTrie.get(accountPath)
              await storageTrie!.lookupNode(childNode.nodeHash as Uint8Array)
            } else {
              // look up node in account trie
              await this.accountTrie.lookupNode(childNode.nodeHash as Uint8Array)
            }
          } catch (e) {
            // if error is thrown, than the node is unknown and should be queued for fetching
            unknownChildNodeCount++
            this.pathToNodeRequestData.setElement(childNode.path, {
              // TODO don't keep paths compact encoded until request is sent in request phase
              nodeHash: bytesToHex(childNode.nodeHash as Uint8Array),
              nodeParentHash: nodeHash, // root node does not have a parent, so handle that in the leaf callback when checking if dependencies are met recursively
            } as NodeRequestData)
          }
        }

        // record new node for batched storing after all subtrie nodes have been received
        const { nodeParentHash } = this.pathToNodeRequestData.getElementByKey(
          nodePath
        ) as NodeRequestData
        this.fetchedAccountNodes.set(nodeHash, {
          parentHash: nodeParentHash,
          deps: unknownChildNodeCount,
          nodeData,
          path: nodePath,
        } as unknown as FetchedNodeData)

        // remove filled requests
        this.requestedNodeToPath.delete(nodeHash)
        this.pathToNodeRequestData.eraseElementByKey(nodePath)

        // this.debug('At end of store phase')
        // this.debug(`unkownChildCount: ${unknownChildNodeCount}`)
        // this.debug(`childeNodes:`)
        // this.debug(childNodes)
      }
      // this.debug(`fetchedAccountNodes:`)
      // this.debug(this.fetchedAccountNodes)
      // this.debug(`pathToNodeRequestData.length: ${this.pathToNodeRequestData.length}`)

      // for an initial implementation, just put nodes into trie and see if root maches stateRoot
      if (this.pathToNodeRequestData.length === 0) {
        // should be checking if 0, but since extension node request hangs currently, check for 1
        const ops: BatchDBOp[] = []
        for (const [nodeHash, data] of this.fetchedAccountNodes) {
          const { parentHash, deps, nodeData, path } = data
          ops.unshift({
            type: 'put',
            key: hexToBytes(nodeHash),
            value: nodeData,
          })
        }
        await this.accountTrie.batch(ops)
        await this.accountTrie.persistRoot()
        console.log('dbg0')
        console.log(bytesToHex(this.accountTrie.root()))
        console.log(bytesToHex(this.root))
        // console.log(this.fetchedAccountNodes)

        for (const [k, v] of (
          this.fetchedAccountNodes as unknown as Map<string, FetchedNodeData>
        ).entries()) {
          console.log(k)
          console.log(decodeNode(v.nodeData))
          console.log('\n')
        }
      }
    } catch (e) {
      this.debug(e)
    }

    // this.debug(`Stored ${storeCount} bytecode in code trie`)
  }

  // TODO do merging here too and rename as getSortedAndMergedPaths
  // TODO take a parameter to indicate how many paths to return and refactor tasks function to use it
  getSortedPathStrings() {
    const pathStrings = []
    // TODO have to keep track of which requests are in progress, efficiently, or remove them from pathToNodeRequestData
    // so that getSortedPathStrings doesn't return duplicates
    for (const [pathString, _] of this.pathToNodeRequestData) {
      pathStrings.push(pathString) // keep this as a string in task
    }
    return { pathStrings }
  }

  mergeAndFormatPaths(pathStrings: string[]) {
    this.debug('At start of mergeAndFormatPaths')

    // TODO this is where the conversion from hex to keybytes should happen, with anything that
    //      isn't hex, being kept the same since it should be compact encoded
    // TODO resolve should happen here, with keys being either keybyte or compact encoded
    // return pathStrings.map((s) => [nibblesToCompactBytes(hexToBytes(padToEven(s)))])
    return pathStrings.map((s) => [nibblesToCompactBytes(hexToBytes(s))])
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   */
  tasks(maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    try {
      if (this.pathToNodeRequestData.size() > 0) {
        let { pathStrings } = this.getSortedPathStrings() // TODO pass in number of paths to return
        while (tasks.length < maxTasks && pathStrings.length > 0) {
          const requestedPathStrings = pathStrings.slice(0, max)
          pathStrings = pathStrings.slice(max + 1)
          for (const pathString of requestedPathStrings) {
            const nodeHash = this.pathToNodeRequestData.getElementByKey(pathString)?.nodeHash // TODO return node set too from sorted function and avoid lookups here
            if (nodeHash === undefined) throw Error('Path should exist')
            this.requestedNodeToPath.set(nodeHash as unknown as string, pathString)
          }
          tasks.push({
            pathStrings: requestedPathStrings,
            paths: this.mergeAndFormatPaths(requestedPathStrings),
          })
          this.debug(`Created new tasks num=${tasks.length}`)
        }
      }
      this.debug(`Created new tasks num=${tasks.length}`)
    } catch (e) {
      this.debug(e)
    }
    return tasks
  }

  nextTasks(): void {
    try {
      if (this.in.length === 0) {
        if (this.pathToNodeRequestData.size() > 0) {
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
