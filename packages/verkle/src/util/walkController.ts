import { InternalNode, LeafNode } from '../node/index.js'

import { PrioritizedTaskExecutor } from './tasks.js'

import type { VerkleNode } from '../node/types.js'
import type { FoundNodeFunction } from '../types.js'
import type { VerkleTree } from '../verkleTree.js'

/**
 * WalkController is an interface to control how the tree is being traversed.
 */
export class WalkController {
  readonly onNode: FoundNodeFunction
  readonly taskExecutor: PrioritizedTaskExecutor
  readonly tree: VerkleTree
  private resolve: Function
  private reject: Function

  /**
   * Creates a new WalkController
   * @param onNode - The `FoundNodeFunction` to call if a node is found.
   * @param tree - The `VerkleTree` to walk on.
   * @param poolSize - The size of the task queue.
   */
  private constructor(onNode: FoundNodeFunction, tree: VerkleTree, poolSize: number) {
    this.onNode = onNode
    this.taskExecutor = new PrioritizedTaskExecutor(poolSize)
    this.tree = tree
    this.resolve = () => {}
    this.reject = () => {}
  }

  /**
   * Async function to create and start a new walk over a tree.
   * @param onNode - The `FoundNodeFunction to call if a node is found.
   * @param tree - The tree to walk on.
   * @param root - The root key to walk on.
   * @param poolSize - Task execution pool size to prevent OOM errors. Defaults to 500.
   */
  static async newWalk(
    onNode: FoundNodeFunction,
    tree: VerkleTree,
    root: Uint8Array,
    poolSize?: number
  ): Promise<void> {
    const strategy = new WalkController(onNode, tree, poolSize ?? 500)
    await strategy.startWalk(root)
  }

  private async startWalk(root: Uint8Array): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      let node
      try {
        node = await this.tree.lookupNode(root)
      } catch (error) {
        return this.reject(error)
      }
      this.processNode(root, node, new Uint8Array(0))
    })
  }

  /**
   * Run all children of a node. Priority of these nodes are the key length of the children.
   * @param node - Node to retrieve all children from of and call onNode on.
   * @param key - The current `key` which would yield the `node` when trying to get this node with a `get` operation.
   */
  allChildren(node: VerkleNode, key: Uint8Array = new Uint8Array()) {
    if (node instanceof LeafNode) {
      return
    }

    const children = node.children.map((nodeRef, index) => ({
      keyExtension: index,
      nodeRef,
    }))

    for (const child of children) {
      if (child.nodeRef !== null) {
        const childKey = new Uint8Array([...key, child.keyExtension])
        this.pushNodeToQueue(child.nodeRef.hash(), childKey)
      }
    }
  }

  /**
   * Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.
   * @param nodeRef - Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`.
   * @param key - The current key.
   * @param priority - Optional priority, defaults to key length
   */
  pushNodeToQueue(nodeRef: Uint8Array, key: Uint8Array = new Uint8Array(0), priority?: number) {
    this.taskExecutor.executeOrQueue(
      priority ?? key.length,
      async (taskFinishedCallback: Function) => {
        let childNode
        try {
          childNode = await this.tree.lookupNode(nodeRef)
        } catch (error: any) {
          return this.reject(error)
        }
        taskFinishedCallback() // this marks the current task as finished. If there are any tasks left in the queue, this will immediately execute the first task.
        this.processNode(nodeRef, childNode as VerkleNode, key)
      }
    )
  }

  /**
   * Push the child of an internal node to the event queue.
   * @param node - The node to select a children from. Should be an InternalNode.
   * @param key - The current key which leads to the corresponding node.
   * @param childIndex - The child index to add to the event queue.
   * @param priority - Optional priority of the event, defaults to the total key length.
   */
  pushChildrenAtIndex(
    node: InternalNode,
    key: Uint8Array = new Uint8Array(0),
    childIndex: number,
    priority?: number
  ) {
    if (!(node instanceof InternalNode)) {
      throw new Error('Expected internal node')
    }
    const childRef = node.getChildren(childIndex)
    if (!childRef) {
      throw new Error('Could not get node at childIndex')
    }
    const childKey = new Uint8Array([...key, childIndex])
    this.pushNodeToQueue(childRef.hash(), childKey, priority ?? childKey.length)
  }

  private processNode(
    nodeRef: Uint8Array,
    node: VerkleNode | null,
    key: Uint8Array = new Uint8Array(0)
  ) {
    this.onNode(nodeRef, node, key, this)
    if (this.taskExecutor.finished()) {
      // onNode should schedule new tasks. If no tasks was added and the queue is empty, then we have finished our walk.
      this.resolve()
    }
  }
}
