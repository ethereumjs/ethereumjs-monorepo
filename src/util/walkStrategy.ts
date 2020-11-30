import { BaseTrie } from '..'
import { FoundNodeFunction } from '../baseTrie'
import { PrioritizedTaskExecutor } from '../prioritizedTaskExecutor'
import { BranchNode, ExtensionNode, LeafNode, Nibbles, TrieNode } from '../trieNode'

export default class WalkStrategy {
  readonly onNode: FoundNodeFunction
  readonly taskExecutor: PrioritizedTaskExecutor
  readonly trie: BaseTrie
  private resolve: Function

  /**
   * Creates a new WalkStrategy
   * @param onNode - The `FoundNodeFunction` to call if a node is found
   * @param trie - The `Trie` to walk on
   */
  private constructor(onNode: FoundNodeFunction, trie: BaseTrie, poolSize: number) {
    this.onNode = onNode
    this.taskExecutor = new PrioritizedTaskExecutor(poolSize)
    this.trie = trie
    this.resolve = () => {}
  }

  /**
   * Async function to create and start a new walk over a trie.
   * @param onNode - The `FoundNodeFunction to call if a node is found
   * @param trie - The trie to walk on
   * @param root - The root key to walk on
   * @param poolSize - Task execution pool size to prevent OOM errors. Defaults to 500.
   */
  static async newWalk(
    onNode: FoundNodeFunction,
    trie: BaseTrie,
    root: Buffer,
    poolSize?: number
  ): Promise<void> {
    const strategy = new WalkStrategy(onNode, trie, poolSize ?? 500)
    await strategy.startWalk(root)
  }

  private async startWalk(root: Buffer): Promise<void> {
    return await new Promise((resolve) => {
      this.resolve = resolve
      this.trie
        ._lookupNode(root)
        .then((node) => {
          if (!node) {
            this.resolve()
          } else {
            this.processNode(root, node as TrieNode, [])
          }
        })
        .catch((e) => {
          throw e
        })
    })
  }

  /**
   * Run all children of a node. Priority of these nodes are the key length of the children
   * @param node - Node to get all children of and call onNode on
   * @param key - The current `key` which would yield the `node` when trying to get this node with a `get` operation.
   */
  allChildren(node: TrieNode, key: Nibbles = []) {
    if (node instanceof LeafNode) {
      return
    }
    let children
    if (node instanceof ExtensionNode) {
      children = [[node.key, node.value]]
    } else if (node instanceof BranchNode) {
      children = node.getChildren().map((b) => [[b[0]], b[1]])
    }
    if (!children) {
      return
    }
    for (const child of children) {
      const keyExtension = child[0] as Nibbles
      const childRef = child[1] as Buffer
      const childKey = key.concat(keyExtension)
      const priority = childKey.length
      this.pushNode(childRef, childKey, priority)
    }
  }

  /**
   *
   * @param nodeRef - Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`.
   * @param key - The current key.
   * @param priority - Optional priority, defaults to key length
   */
  pushNode(nodeRef: Buffer, key: Nibbles = [], priority?: number) {
    this.taskExecutor.execute(priority ?? key.length, async (taskCallback: Function) => {
      const childNode = await this.trie._lookupNode(nodeRef)
      taskCallback()
      this.processNode(nodeRef as Buffer, childNode as TrieNode, key)
    })
  }

  /**
   * Push a branch of a certain BranchNode to the event queue
   * @param node - The node to select a branch on. Should be a BranchNode
   * @param key - The current key which leads to the corresponding node
   * @param childIndex - The child index to add to the event queue
   * @param priority - Optional priority of the event, defaults to the total key length
   */
  async onlyBranchIndex(
    node: BranchNode,
    key: Nibbles = [],
    childIndex: number,
    priority?: number
  ) {
    if (!(node instanceof BranchNode)) {
      throw new Error('Expected branch node')
    }
    const childRef = node.getBranch(childIndex)
    if (!childRef) {
      throw new Error('Could not get branch of childIndex')
    }
    const childKey = key.slice() // This copies the key to a new array.
    childKey.push(childIndex)
    const prio = priority ?? childKey.length
    this.pushNode(childRef as Buffer, childKey, prio)
  }

  private processNode(nodeRef: Buffer, node: TrieNode, key: Nibbles = []) {
    this.onNode(nodeRef, node, key, this)
    if (this.taskExecutor.finished()) {
      // onNode should schedule new tasks. If no tasks was added and the queue is empty, then we have finished our walk.
      this.resolve()
    }
  }
}
