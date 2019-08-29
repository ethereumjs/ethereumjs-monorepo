import { LevelUp } from 'levelup'
import * as ethUtil from 'ethereumjs-util'
import { DB, BatchDBOp, PutBatch } from './db'
import { TrieReadStream as ReadStream } from './readStream'
import { PrioritizedTaskExecutor } from './prioritizedTaskExecutor'
import { callTogether } from './util/async'
import { stringToNibbles, matchingNibbleLength, doKeysMatch } from './util/nibbles'
import { ErrorCallback } from './types'
import {
  TrieNode,
  decodeNode,
  decodeRawNode,
  isRawNode,
  BranchNode,
  ExtensionNode,
  LeafNode,
  EmbeddedNode,
} from './trieNode'
const assert = require('assert')
const async = require('async')
const semaphore = require('semaphore')

/**
 * Use `require('merkel-patricia-tree').BaseTrie` for the base interface. In Ethereum applications
 * stick with the Secure Trie Overlay `require('merkel-patricia-tree').SecureTrie`.
 * The API for the raw and the secure interface are about the same.
 * @param {Object} [db] A [levelup](https://github.com/Level/levelup) instance. By default creates an in-memory [memdown](https://github.com/Level/memdown) instance.
 * If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/Level/memdown)
 * @param {Buffer|String} [root] A hex `String` or `Buffer` for the root of a previously stored trie
 * @prop {Buffer} root The current root of the `trie`
 * @prop {Buffer} EMPTY_TRIE_ROOT the Root for an empty trie
 */
export class Trie {
  EMPTY_TRIE_ROOT: Buffer
  db: DB
  protected sem: any
  private _root: Buffer

  constructor(db?: LevelUp | null, root?: Buffer) {
    this.EMPTY_TRIE_ROOT = ethUtil.KECCAK256_RLP
    this.sem = semaphore(1)
    this.db = db ? new DB(db) : new DB()
    this._root = this.EMPTY_TRIE_ROOT
    if (root) {
      this.setRoot(root)
    }
  }

  static fromProof(proofNodes: Buffer[], cb: Function, proofTrie?: Trie) {
    let opStack = proofNodes.map(nodeValue => {
      return {
        type: 'put',
        key: ethUtil.keccak(nodeValue),
        value: ethUtil.toBuffer(nodeValue),
      } as PutBatch
    })

    if (!proofTrie) {
      proofTrie = new Trie()
      if (opStack[0]) {
        proofTrie.root = opStack[0].key
      }
    }

    proofTrie.db.batch(opStack, (e?: Error) => {
      cb(e, proofTrie)
    })
  }

  static prove(trie: Trie, key: Buffer, cb: Function) {
    trie.findPath(key, function(
      err: Error,
      node: TrieNode,
      remaining: number[],
      stack: TrieNode[],
    ) {
      if (err) return cb(err)
      let p = stack.map(stackElem => {
        return stackElem.serialize()
      })
      cb(null, p)
    })
  }

  static verifyProof(rootHash: Buffer, key: Buffer, proofNodes: Buffer[], cb: Function) {
    let proofTrie = new Trie(null, rootHash)
    Trie.fromProof(
      proofNodes,
      (error: Error, proofTrie: Trie) => {
        if (error) cb(new Error('Invalid proof nodes given'), null)
        proofTrie.get(key, (e: Error, r: Buffer | null) => {
          return cb(e, r)
        })
      },
      proofTrie,
    )
  }

  set root(value: Buffer) {
    this.setRoot(value)
  }

  get root(): Buffer {
    return this._root
  }

  setRoot(value?: Buffer) {
    if (value) {
      value = ethUtil.toBuffer(value)
      assert(value.length === 32, 'Invalid root length. Roots are 32 bytes')
    } else {
      value = this.EMPTY_TRIE_ROOT
    }

    this._root = value
  }

  /**
   * Gets a value given a `key`
   * @method get
   * @memberof Trie
   * @param {Buffer|String} key - the key to search for
   * @param {Function} cb A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`
   */
  get(key: Buffer, cb: Function) {
    key = ethUtil.toBuffer(key)

    this.findPath(key, (err: Error, node: TrieNode, remainder: number[], stack: TrieNode[]) => {
      let value = null

      if (node && remainder.length === 0) {
        value = node.value
      }

      cb(err, value)
    })
  }

  /**
   * Stores a given `value` at the given `key`
   * @method put
   * @memberof Trie
   * @param {Buffer|String} key
   * @param {Buffer|String} Value
   * @param {Function} cb A callback `Function` which is given the argument `err` - for errors that may have occured
   */
  put(key: Buffer, value: Buffer, cb: ErrorCallback) {
    key = ethUtil.toBuffer(key)
    value = ethUtil.toBuffer(value)

    if (!value || value.toString() === '') {
      this.del(key, cb)
    } else {
      cb = callTogether(cb, this.sem.leave)

      this.sem.take(() => {
        if (this.root.toString('hex') !== ethUtil.KECCAK256_RLP.toString('hex')) {
          // first try to find the give key or its nearst node
          this.findPath(
            key,
            (err: Error, foundValue: TrieNode, keyRemainder: number[], stack: TrieNode[]) => {
              if (err) {
                return cb(err)
              }
              // then update
              this._updateNode(key, value, keyRemainder, stack, cb)
            },
          )
        } else {
          this._createInitialNode(key, value, cb) // if no root initialize this trie
        }
      })
    }
  }

  /**
   * deletes a value given a `key`
   * @method del
   * @memberof Trie
   * @param {Buffer|String} key
   * @param {Function} callback the callback `Function`
   */
  del(key: Buffer, cb: Function) {
    key = ethUtil.toBuffer(key)
    cb = callTogether(cb, this.sem.leave)

    this.sem.take(() => {
      this.findPath(
        key,
        (err: Error, foundValue: TrieNode, keyRemainder: number[], stack: TrieNode[]) => {
          if (err) {
            return cb(err)
          }
          if (foundValue) {
            this._deleteNode(key, stack, cb)
          } else {
            cb()
          }
        },
      )
    })
  }

  /**
   * Retrieves a value directly from key/value db.
   * @deprecated
   */
  getRaw(key: Buffer, cb: Function) {
    this.db.get(key, cb)
  }

  /**
   * Writes a value under given key directly to the
   * key/value db.
   * @deprecated
   */
  putRaw(key: Buffer, value: Buffer, cb: ErrorCallback) {
    this.db.put(key, value, cb)
  }

  /**
   * Deletes key directly from underlying key/value db.
   * @deprecated
   */
  delRaw(key: Buffer, cb: ErrorCallback) {
    this.db.del(key, cb)
  }

  // retrieves a node from dbs by hash
  _lookupNode(node: Buffer | Buffer[], cb: Function) {
    if (isRawNode(node)) {
      cb(null, decodeRawNode(node as Buffer[]))
    } else {
      this.db.get(node as Buffer, (err: Error, value: Buffer | null) => {
        let node = null
        if (value) {
          node = decodeNode(value)
        } else {
          err = new Error('Missing node in DB')
        }
        cb(err, node)
      })
    }
  }

  // writes a single node to dbs
  _putNode(node: TrieNode, cb: ErrorCallback) {
    const hash = node.hash()
    const serialized = node.serialize()
    this.db.put(hash, serialized, cb)
  }

  /**
   * Tries to find a path to the node for the given key
   * It returns a `stack` of nodes to the closet node
   * @method findPath
   * @memberof Trie
   * @param {String|Buffer} - key - the search key
   * @param {Function} - cb - the callback function. Its is given the following
   * arguments
   *  - err - any errors encontered
   *  - node - the last node found
   *  - keyRemainder - the remaining key nibbles not accounted for
   *  - stack - an array of nodes that forms the path to node we are searching for
   */
  findPath(key: Buffer, cb: Function) {
    const stack: TrieNode[] = []
    let targetKey = stringToNibbles(key)

    this._walkTrie(this.root, processNode, cb)

    function processNode(
      nodeRef: Buffer,
      node: TrieNode,
      keyProgress: number[],
      walkController: any,
    ) {
      const keyRemainder = targetKey.slice(matchingNibbleLength(keyProgress, targetKey))
      stack.push(node)

      if (node instanceof BranchNode) {
        if (keyRemainder.length === 0) {
          walkController.return(null, node, [], stack)
          // we exhausted the key without finding a node
        } else {
          const branchIndex = keyRemainder[0]
          const branchNode = node.getBranch(branchIndex)
          if (!branchNode) {
            // there are no more nodes to find and we didn't find the key
            walkController.return(null, null, keyRemainder, stack)
          } else {
            // node found, continuing search
            walkController.only(branchIndex)
          }
        }
      } else if (node instanceof LeafNode) {
        if (doKeysMatch(keyRemainder, node.key)) {
          // keys match, return node with empty key
          walkController.return(null, node, [], stack)
        } else {
          // reached leaf but keys dont match
          walkController.return(null, null, keyRemainder, stack)
        }
      } else if (node instanceof ExtensionNode) {
        const matchingLen = matchingNibbleLength(keyRemainder, node.key)
        if (matchingLen !== node.key.length) {
          // keys dont match, fail
          walkController.return(null, null, keyRemainder, stack)
        } else {
          // keys match, continue search
          walkController.next()
        }
      }
    }
  }

  /*
   * Finds all nodes that store k,v values
   */
  _findValueNodes(onFound: Function, cb: Function) {
    this._walkTrie(
      this.root,
      (nodeRef: Buffer, node: TrieNode, key: number[], walkController: any) => {
        let fullKey = key

        if (node instanceof LeafNode) {
          fullKey = key.concat(node.key)
          // found leaf node!
          onFound(nodeRef, node, fullKey, walkController.next)
        } else if (node instanceof BranchNode && node.value) {
          // found branch with value
          onFound(nodeRef, node, fullKey, walkController.next)
        } else {
          // keep looking for value nodes
          walkController.next()
        }
      },
      cb,
    )
  }

  /*
   * Finds all nodes that are stored directly in the db
   * (some nodes are stored raw inside other nodes)
   */
  _findDbNodes(onFound: Function, cb: Function) {
    this._walkTrie(
      this.root,
      (nodeRef: Buffer, node: TrieNode, key: number[], walkController: any) => {
        if (isRawNode(nodeRef)) {
          walkController.next()
        } else {
          onFound(nodeRef, node, key, walkController.next)
        }
      },
      cb,
    )
  }

  /**
   * Updates a node
   * @method _updateNode
   * @private
   * @param {Buffer} key
   * @param {Buffer| String} value
   * @param {Array} keyRemainder
   * @param {Array} stack -
   * @param {Function} cb - the callback
   */
  _updateNode(
    k: Buffer,
    value: Buffer,
    keyRemainder: number[],
    stack: TrieNode[],
    cb: ErrorCallback,
  ) {
    const toSave: BatchDBOp[] = []
    const lastNode = stack.pop()
    if (!lastNode) {
      throw new Error('Stack underflow')
    }

    // add the new nodes
    let key = stringToNibbles(k)

    // Check if the last node is a leaf and the key matches to this
    let matchLeaf = false

    if (lastNode instanceof LeafNode) {
      let l = 0

      for (let i = 0; i < stack.length; i++) {
        const n = stack[i]

        if (n instanceof BranchNode) {
          l++
        } else {
          l += n.key.length
        }
      }

      if (
        matchingNibbleLength(lastNode.key, key.slice(l)) === lastNode.key.length &&
        keyRemainder.length === 0
      ) {
        matchLeaf = true
      }
    }

    if (matchLeaf) {
      // just updating a found value
      lastNode.value = value
      stack.push(lastNode)
    } else if (lastNode instanceof BranchNode) {
      stack.push(lastNode)
      if (keyRemainder.length !== 0) {
        // add an extention to a branch node
        keyRemainder.shift()
        // create a new leaf
        const newLeaf = new LeafNode(keyRemainder, value)
        stack.push(newLeaf)
      } else {
        lastNode.value = value
      }
    } else {
      // create a branch node
      const lastKey = lastNode.key
      const matchingLength = matchingNibbleLength(lastKey, keyRemainder)
      const newBranchNode = new BranchNode()

      // create a new extention node
      if (matchingLength !== 0) {
        const newKey = lastNode.key.slice(0, matchingLength)
        const newExtNode = new ExtensionNode(newKey, value)
        stack.push(newExtNode)
        lastKey.splice(0, matchingLength)
        keyRemainder.splice(0, matchingLength)
      }

      stack.push(newBranchNode)

      if (lastKey.length !== 0) {
        const branchKey = lastKey.shift() as number

        if (lastKey.length !== 0 || lastNode instanceof LeafNode) {
          // shriking extention or leaf
          lastNode.key = lastKey
          const formatedNode = this._formatNode(lastNode, false, toSave)
          newBranchNode.setBranch(branchKey, formatedNode as EmbeddedNode)
        } else {
          // remove extention or attaching
          this._formatNode(lastNode, false, toSave, true)
          newBranchNode.setBranch(branchKey, lastNode.value)
        }
      } else {
        newBranchNode.value = lastNode.value
      }

      if (keyRemainder.length !== 0) {
        keyRemainder.shift()
        // add a leaf node to the new branch node
        const newLeafNode = new LeafNode(keyRemainder, value)
        stack.push(newLeafNode)
      } else {
        newBranchNode.value = value
      }
    }

    this._saveStack(key, stack, toSave, cb)
  }

  // walk tree
  _walkTrie(root: Buffer, onNode: Function, onDone: Function) {
    const self = this
    root = root || this.root
    onDone = onDone || function() {}
    let aborted = false
    let returnValues: any = []

    if (root.toString('hex') === ethUtil.KECCAK256_RLP.toString('hex')) {
      return onDone()
    }

    this._lookupNode(root, (e: Error, node: TrieNode) => {
      if (e) {
        return onDone(e, node)
      }
      processNode(root, node, [], (err: Error) => {
        if (err) {
          return onDone(err)
        }

        onDone.apply(null, returnValues)
      })
    })

    // the maximum pool size should be high enough to utilise the parallelizability of reading nodes from disk and
    // low enough to utilize the prioritisation of node lookup.
    const maxPoolSize = 500
    const taskExecutor = new PrioritizedTaskExecutor(maxPoolSize)

    function processNode(nodeRef: Buffer, node: TrieNode, key: number[] = [], cb: Function) {
      if (!node || aborted) {
        return cb()
      }

      let stopped = false

      const walkController = {
        stop: function() {
          stopped = true
          cb()
        },
        // end all traversal and return values to the onDone cb
        return: function(...args: any) {
          aborted = true
          returnValues = args
          cb()
        },
        next: function() {
          if (aborted || stopped) {
            return cb()
          }

          if (node instanceof LeafNode) {
            return cb()
          }

          let children
          if (node instanceof ExtensionNode) {
            children = [[node.key, node.value]]
          } else if (node instanceof BranchNode) {
            children = node.getChildren().map(b => [[b[0]], b[1]])
          }
          async.forEachOf(
            children,
            (childData: (Buffer | number[])[], index: number, cb: Function) => {
              const keyExtension = childData[0] as number[]
              const childRef = childData[1] as Buffer
              const childKey = key.concat(keyExtension)
              const priority = childKey.length
              taskExecutor.execute(priority, (taskCallback: Function) => {
                self._lookupNode(childRef, (e: Error, childNode: TrieNode) => {
                  if (e) {
                    return cb(e, node)
                  }
                  taskCallback()
                  processNode(childRef, childNode, childKey, cb)
                })
              })
            },
            cb,
          )
        },
        only: function(childIndex: number) {
          if (!(node instanceof BranchNode)) {
            return cb(new Error('Expected branch node'))
          }
          const childRef = node.getBranch(childIndex)
          const childKey = key.slice()
          childKey.push(childIndex)
          const priority = childKey.length
          taskExecutor.execute(priority, (taskCallback: Function) => {
            self._lookupNode(childRef as Buffer, (e: Error, childNode: TrieNode) => {
              if (e) {
                return cb(e, node)
              }
              taskCallback()
              processNode(childRef as Buffer, childNode, childKey, cb)
            })
          })
        },
      }

      onNode(nodeRef, node, key, walkController)
    }
  }

  /**
   * saves a stack
   * @method _saveStack
   * @private
   * @param {Array} key - the key. Should follow the stack
   * @param {Array} stack - a stack of nodes to the value given by the key
   * @param {Array} opStack - a stack of levelup operations to commit at the end of this funciton
   * @param {Function} cb
   */
  _saveStack(key: number[], stack: TrieNode[], opStack: BatchDBOp[], cb: ErrorCallback) {
    let lastRoot

    // update nodes
    while (stack.length) {
      const node = stack.pop() as TrieNode
      if (node instanceof LeafNode) {
        key.splice(key.length - node.key.length)
      } else if (node instanceof ExtensionNode) {
        key.splice(key.length - node.key.length)
        if (lastRoot) {
          node.value = lastRoot
        }
      } else if (node instanceof BranchNode) {
        if (lastRoot) {
          const branchKey = key.pop()
          node.setBranch(branchKey!, lastRoot)
        }
      }
      lastRoot = this._formatNode(node, stack.length === 0, opStack) as Buffer
    }

    if (lastRoot) {
      this.root = lastRoot
    }

    this.db.batch(opStack, cb)
  }

  _deleteNode(k: Buffer, stack: TrieNode[], cb: Function) {
    function processBranchNode(
      key: number[],
      branchKey: number,
      branchNode: TrieNode,
      parentNode: TrieNode,
      stack: TrieNode[],
    ) {
      // branchNode is the node ON the branch node not THE branch node
      if (!parentNode || parentNode instanceof BranchNode) {
        // branch->?
        if (parentNode) {
          stack.push(parentNode)
        }

        if (branchNode instanceof BranchNode) {
          // create an extention node
          // branch->extention->branch
          // @ts-ignore
          const extentionNode = new ExtensionNode([branchKey], null)
          stack.push(extentionNode)
          key.push(branchKey)
        } else {
          const branchNodeKey = branchNode.key
          // branch key is an extention or a leaf
          // branch->(leaf or extention)
          branchNodeKey.unshift(branchKey)
          branchNode.key = branchNodeKey.slice(0)
          key = key.concat(branchNodeKey)
        }
        stack.push(branchNode)
      } else {
        // parent is a extention
        let parentKey = parentNode.key

        if (branchNode instanceof BranchNode) {
          // ext->branch
          parentKey.push(branchKey)
          key.push(branchKey)
          parentNode.key = parentKey
          stack.push(parentNode)
        } else {
          const branchNodeKey = branchNode.key
          // branch node is an leaf or extention and parent node is an exstention
          // add two keys together
          // dont push the parent node
          branchNodeKey.unshift(branchKey)
          key = key.concat(branchNodeKey)
          parentKey = parentKey.concat(branchNodeKey)
          branchNode.key = parentKey
        }

        stack.push(branchNode)
      }

      return key
    }

    let lastNode = stack.pop() as TrieNode
    assert(lastNode)
    let parentNode = stack.pop()
    const opStack: BatchDBOp[] = []

    let key = stringToNibbles(k)

    if (!parentNode) {
      // the root here has to be a leaf.
      this.root = this.EMPTY_TRIE_ROOT
      cb()
    } else {
      if (lastNode instanceof BranchNode) {
        lastNode.value = null
      } else {
        // the lastNode has to be a leaf if its not a branch. And a leaf's parent
        // if it has one must be a branch.
        if (!(parentNode instanceof BranchNode)) {
          return cb(new Error('Expected branch node'))
        }
        const lastNodeKey = lastNode.key
        key.splice(key.length - lastNodeKey.length)
        // delete the value
        this._formatNode(lastNode, false, opStack, true)
        parentNode.setBranch(key.pop() as number, null)
        lastNode = parentNode
        parentNode = stack.pop()
      }

      // nodes on the branch
      // count the number of nodes on the branch
      const branchNodes: [number, EmbeddedNode][] = lastNode.getChildren()

      // if there is only one branch node left, collapse the branch node
      if (branchNodes.length === 1) {
        // add the one remaing branch node to node above it
        const branchNode = branchNodes[0][1]
        const branchNodeKey = branchNodes[0][0]

        // look up node
        this._lookupNode(branchNode, (e: Error, foundNode: TrieNode) => {
          if (e) {
            return cb(e, foundNode)
          }
          key = processBranchNode(key, branchNodeKey, foundNode, parentNode as TrieNode, stack)
          this._saveStack(key, stack, opStack, cb as ErrorCallback)
        })
      } else {
        // simple removing a leaf and recaluclation the stack
        if (parentNode) {
          stack.push(parentNode)
        }

        stack.push(lastNode)
        this._saveStack(key, stack, opStack, cb as ErrorCallback)
      }
    }
  }

  // Creates the initial node from an empty tree
  _createInitialNode(key: Buffer, value: Buffer, cb: ErrorCallback) {
    const newNode = new LeafNode(stringToNibbles(key), value)
    this.root = newNode.hash()
    this._putNode(newNode, cb)
  }

  // formats node to be saved by levelup.batch.
  // returns either the hash that will be used key or the rawNode
  _formatNode(
    node: TrieNode,
    topLevel: boolean,
    opStack: BatchDBOp[],
    remove: boolean = false,
  ): Buffer | (EmbeddedNode | null)[] {
    const rlpNode = node.serialize()

    if (rlpNode.length >= 32 || topLevel) {
      const hashRoot = node.hash()

      opStack.push({
        type: 'put',
        key: hashRoot,
        value: rlpNode,
      })

      return hashRoot
    }

    return node.raw()
  }

  /**
   * The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.
   * @method createReadStream
   * @memberof Trie
   * @return {stream.Readable} Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
   */
  createReadStream(): ReadStream {
    return new ReadStream(this)
  }

  // creates a new trie backed by the same db
  // and starting at the same root
  copy(): Trie {
    const db = this.db.copy()
    return new Trie(db._leveldb, this.root)
  }

  /**
   * The given hash of operations (key additions or deletions) are executed on the DB
   * @method batch
   * @memberof Trie
   * @example
   * var ops = [
   *    { type: 'del', key: 'father' }
   *  , { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' }
   *  , { type: 'put', key: 'dob', value: '16 February 1941' }
   *  , { type: 'put', key: 'spouse', value: 'Kim Young-sook' }
   *  , { type: 'put', key: 'occupation', value: 'Clown' }
   * ]
   * trie.batch(ops)
   * @param {Array} ops
   * @param {Function} cb
   */
  batch(ops: BatchDBOp[], cb: ErrorCallback) {
    async.eachSeries(
      ops,
      (op: BatchDBOp, cb2: ErrorCallback) => {
        if (op.type === 'put') {
          if (!op.value) throw new Error('Invalid batch db operation')
          this.put(op.key, op.value, cb2)
        } else if (op.type === 'del') {
          this.del(op.key, cb2)
        } else {
          cb2()
        }
      },
      cb,
    )
  }

  /**
   * Checks if a given root exists
   */
  checkRoot(root: Buffer, cb: Function) {
    root = ethUtil.toBuffer(root)
    this._lookupNode(root, (e: Error, value: TrieNode) => {
      cb(null, !!value)
    })
  }
}
