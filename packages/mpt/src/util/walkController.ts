import { EthereumJSErrorWithoutCode, PrioritizedTaskExecutor } from '@ethereumjs/util'

import { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from '../node/index.ts'

import type { MerklePatriciaTrie } from '../mpt.ts'
import type { FoundNodeFunction, MPTNode, Nibbles, NodeReferenceOrRawMPTNode } from '../types.ts'

/**
 * Interface to control how the trie is being traversed. Schedules node visits via a
 * prioritized task queue and invokes the provided callback for each node.
 *
 * Used by {@link MerklePatriciaTrie.findPath}, {@link MerklePatriciaTrie.walkTrie}, etc.
 */
export class WalkController {
  /** The {@link FoundNodeFunction} to call when a node is found. */
  readonly onNode: FoundNodeFunction

  /** Task executor that prioritizes node visits (shorter paths first). */
  readonly taskExecutor: PrioritizedTaskExecutor

  /** The trie being walked. */
  readonly trie: MerklePatriciaTrie

  private _resolvePromise: () => void
  private _rejectPromise: (error: unknown) => void

  /**
   * @param onNode - The {@link FoundNodeFunction} to call when a node is found.
   * @param trie - The trie to walk on.
   * @param poolSize - The size of the task queue.
   */
  private constructor(onNode: FoundNodeFunction, trie: MerklePatriciaTrie, poolSize: number) {
    this.onNode = onNode
    this.taskExecutor = new PrioritizedTaskExecutor(poolSize)
    this.trie = trie
    this._resolvePromise = () => {}
    this._rejectPromise = () => {}
  }

  /**
   * Creates and starts an async walk over a trie from the given root.
   * Resolves when all reachable nodes have been visited and no new tasks were scheduled.
   *
   * @param onNode - The {@link FoundNodeFunction} to call when a node is found.
   * @param trie - The trie to walk on.
   * @param rootHash - The root hash (32-byte keccak) to start walking from.
   * @param poolSize - Task execution pool size to prevent OOM errors. Defaults to 500.
   * @returns A Promise that resolves when the walk is finished.
   */
  static async newWalk(
    onNode: FoundNodeFunction,
    trie: MerklePatriciaTrie,
    rootHash: Uint8Array,
    poolSize?: number,
  ): Promise<void> {
    const controller = new WalkController(onNode, trie, poolSize ?? 500)
    await controller._startWalk(rootHash)
  }

  private async _startWalk(rootHash: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      this._resolvePromise = resolve
      this._rejectPromise = reject
      this.trie
        .lookupNode(rootHash)
        .then((rootNode) => {
          this._processNode(rootHash, rootNode, [])
        })
        .catch((error: unknown) => {
          this._rejectPromise(error)
        })
    })
  }

  /**
   * Runs all children of a node. Priority of these nodes is the key length of the children.
   * Used when walking an Extension or when exploring all branches of a Branch node.
   *
   * @param node - Node to get all children of and call onNode on.
   * @param currentKeyNibbles - The current key (nibbles) which would yield the `node` when
   *        trying to get this node with a `get` operation. Defaults to `[]`.
   * @returns `void`
   */
  allChildren(node: MPTNode, currentKeyNibbles: Nibbles = []): void {
    if (node instanceof LeafMPTNode) {
      return
    }
    let childEntries: [Nibbles, NodeReferenceOrRawMPTNode][]
    if (node instanceof ExtensionMPTNode) {
      childEntries = [[node.key(), node.value()]]
    } else if (node instanceof BranchMPTNode) {
      childEntries = node
        .getChildren()
        .map(([branchIndex, branchRef]) => [[branchIndex], branchRef])
    } else {
      return
    }
    for (const [keyExtension, childRef] of childEntries) {
      const childKeyNibbles = currentKeyNibbles.concat(keyExtension)
      const taskPriority = childKeyNibbles.length
      this.pushNodeToQueue(childRef, childKeyNibbles, taskPriority)
    }
  }

  /**
   * Pushes a node to the queue. If the queue has capacity, the node is executed immediately,
   * otherwise it is queued for later execution.
   *
   * @param nodeRef - A node reference (32-byte keccak hash or raw encoding) to enqueue.
   * @param currentKeyNibbles - The current key (nibbles) corresponding to this node. Defaults to `[]`.
   * @param priority - Optional priority. Defaults to key length.
   * @returns `void`
   */
  pushNodeToQueue(
    nodeRef: NodeReferenceOrRawMPTNode,
    currentKeyNibbles: Nibbles = [],
    priority?: number,
  ): void {
    const taskPriority = priority ?? currentKeyNibbles.length
    this.taskExecutor.executeOrQueue(taskPriority, (taskFinishedCallback: () => void) => {
      this.trie
        .lookupNode(nodeRef)
        .then((decodedNode) => {
          taskFinishedCallback()
          this._processNode(nodeRef, decodedNode, currentKeyNibbles)
        })
        .catch((error: unknown) => {
          this._rejectPromise(error)
        })
    })
  }

  /**
   * Pushes a branch of a certain BranchMPTNode to the event queue.
   * Used by findPath when following a specific key (only one child index is traversed).
   *
   * @param node - The BranchMPTNode to select a branch on.
   * @param currentKeyNibbles - The current key which leads to the corresponding node. Defaults to `[]`.
   * @param childIndex - The child index (0–15) to add to the event queue.
   * @param priority - Optional priority of the event. Defaults to the total key length.
   * @returns `void`
   * @throws If `node` is not a BranchMPTNode or if the branch at `childIndex` is empty.
   */
  onlyBranchIndex(
    node: BranchMPTNode,
    currentKeyNibbles: Nibbles = [],
    childIndex: number,
    priority?: number,
  ): void {
    if (!(node instanceof BranchMPTNode)) {
      throw EthereumJSErrorWithoutCode('Expected branch node')
    }
    const childRef = node.getBranch(childIndex)
    if (!childRef) {
      throw EthereumJSErrorWithoutCode('Could not get branch of childIndex')
    }
    const childKeyNibbles = currentKeyNibbles.concat(childIndex)
    const taskPriority = priority ?? childKeyNibbles.length
    this.pushNodeToQueue(childRef, childKeyNibbles, taskPriority)
  }

  private _processNode(
    nodeRef: NodeReferenceOrRawMPTNode,
    node: MPTNode | null,
    currentKeyNibbles: Nibbles,
  ): void {
    this.onNode(nodeRef, node, currentKeyNibbles, this)
    if (this.taskExecutor.finished()) {
      this._resolvePromise()
    }
  }
}
