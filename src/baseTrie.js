const assert = require('assert')
const async = require('async')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')
const semaphore = require('semaphore')
const DB = require('./db')
const TrieNode = require('./trieNode')
const ReadStream = require('./readStream')
const PrioritizedTaskExecutor = require('./prioritizedTaskExecutor')
const { callTogether } = require('./util/async')
const { stringToNibbles, matchingNibbleLength, doKeysMatch } = require('./util/nibbles')

/**
 * Use `require('merkel-patricia-tree')` for the base interface. In Ethereum applications
 * stick with the Secure Trie Overlay `require('merkel-patricia-tree/secure')`.
 * The API for the raw and the secure interface are about the same
 * @class Trie
 * @public
 * @param {Object} [db] An instance of `DB`.
 * If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/Level/memdown)
 * @param {Buffer|String} [root] A hex `String` or `Buffer` for the root of a previously stored trie
 * @prop {Buffer} root The current root of the `trie`
 * @prop {Buffer} EMPTY_TRIE_ROOT the Root for an empty trie
 */
module.exports = class Trie {
  constructor (db, root) {
    const self = this
    this.EMPTY_TRIE_ROOT = ethUtil.SHA3_RLP
    this.sem = semaphore(1)

    this.db = db || new DB()

    Object.defineProperty(this, 'root', {
      set(value) {
        if (value) {
          value = ethUtil.toBuffer(value)
          assert(value.length === 32, 'Invalid root length. Roots are 32 bytes')
        } else {
          value = self.EMPTY_TRIE_ROOT
        }

        this._root = value
      },
      get() {
        return this._root
      }
    })

    this.root = root
  }

  /**
   * Gets a value given a `key`
   * @method get
   * @memberof Trie
   * @param {Buffer|String} key - the key to search for
   * @param {Function} cb A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`
   */
  get (key, cb) {
    key = ethUtil.toBuffer(key)

    this.findPath(key, (err, node, remainder, stack) => {
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
  put (key, value, cb) {
    key = ethUtil.toBuffer(key)
    value = ethUtil.toBuffer(value)

    if (!value || value.toString() === '') {
      this.del(key, cb)
    } else {
      cb = callTogether(cb, this.sem.leave)

      this.sem.take(() => {
        if (this.root.toString('hex') !== ethUtil.SHA3_RLP.toString('hex')) {
          // first try to find the give key or its nearst node
          this.findPath(key, (err, foundValue, keyRemainder, stack) => {
            if (err) {
              return cb(err)
            }
            // then update
            this._updateNode(key, value, keyRemainder, stack, cb)
          })
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
  del (key, cb) {
    key = ethUtil.toBuffer(key)
    cb = callTogether(cb, this.sem.leave)

    this.sem.take(() => {
      this.findPath(key, (err, foundValue, keyRemainder, stack) => {
        if (err) {
          return cb(err)
        }
        if (foundValue) {
          this._deleteNode(key, stack, cb)
        } else {
          cb()
        }
      })
    })
  }

  // retrieves a node from dbs by hash
  _lookupNode (node, cb) {
    if (TrieNode.isRawNode(node)) {
      cb(new TrieNode(node))
    } else {
      this.db.get(node, (err, value) => {
        if (err) {
          throw err
        }

        if (value) {
          value = new TrieNode(rlp.decode(value))
        }

        cb(value)
      })
    }
  }

  // writes a single node to dbs
  _putNode (node, cb) {
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
  findPath (targetKey, cb) {
    const stack = []
    targetKey = stringToNibbles(targetKey)

    this._walkTrie(this.root, processNode, cb)

    function processNode (nodeRef, node, keyProgress, walkController) {
      const nodeKey = node.key || []
      const keyRemainder = targetKey.slice(matchingNibbleLength(keyProgress, targetKey))
      const matchingLen = matchingNibbleLength(keyRemainder, nodeKey)

      stack.push(node)

      if (node.type === 'branch') {
        if (keyRemainder.length === 0) {
          walkController.return(null, node, [], stack)
        // we exhausted the key without finding a node
        } else {
          const branchIndex = keyRemainder[0]
          const branchNode = node.getValue(branchIndex)
          if (!branchNode) {
            // there are no more nodes to find and we didn't find the key
            walkController.return(null, null, keyRemainder, stack)
          } else {
            // node found, continuing search
            walkController.only(branchIndex)
          }
        }
      } else if (node.type === 'leaf') {
        if (doKeysMatch(keyRemainder, nodeKey)) {
          // keys match, return node with empty key
          walkController.return(null, node, [], stack)
        } else {
          // reached leaf but keys dont match
          walkController.return(null, null, keyRemainder, stack)
        }
      } else if (node.type === 'extention') {
        if (matchingLen !== nodeKey.length) {
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
  _findNode (key, root, stack, cb) {
    this.findPath(key, () => {
      cb.apply(null, arguments)
    })
  }

  /*
   * Finds all nodes that store k,v values
   */
  _findValueNodes (onFound, cb) {
    this._walkTrie(this.root, (nodeRef, node, key, walkController) => {
      let fullKey = key

      if (node.key) {
        fullKey = key.concat(node.key)
      }

      if (node.type === 'leaf') {
        // found leaf node!
        onFound(nodeRef, node, fullKey, walkController.next)
      } else if (node.type === 'branch' && node.value) {
        // found branch with value
        onFound(nodeRef, node, fullKey, walkController.next)
      } else {
        // keep looking for value nodes
        walkController.next()
      }
    }, cb)
  }

  /*
   * Finds all nodes that are stored directly in the db
   * (some nodes are stored raw inside other nodes)
   */
  _findDbNodes (onFound, cb) {
    this._walkTrie(this.root, (nodeRef, node, key, walkController) => {
      if (TrieNode.isRawNode(nodeRef)) {
        walkController.next()
      } else {
        onFound(nodeRef, node, key, walkController.next)
      }
    }, cb)
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
  _updateNode (key, value, keyRemainder, stack, cb) {
    const toSave = []
    const lastNode = stack.pop()

    // add the new nodes
    key = stringToNibbles(key)

    // Check if the last node is a leaf and the key matches to this
    let matchLeaf = false

    if (lastNode.type === 'leaf') {
      let l = 0

      for (let i = 0; i < stack.length; i++) {
        const n = stack[i]

        if (n.type === 'branch') {
          l++
        } else {
          l += n.key.length
        }
      }

      if ((matchingNibbleLength(lastNode.key, key.slice(l)) === lastNode.key.length) && (keyRemainder.length === 0)) {
        matchLeaf = true
      }
    }

    if (matchLeaf) {
      // just updating a found value
      lastNode.value = value
      stack.push(lastNode)
    } else if (lastNode.type === 'branch') {
      stack.push(lastNode)
      if (keyRemainder.length !== 0) {
        // add an extention to a branch node
        keyRemainder.shift()
        // create a new leaf
        const newLeaf = new TrieNode('leaf', keyRemainder, value)
        stack.push(newLeaf)
      } else {
        lastNode.value = value
      }
    } else {
      // create a branch node
      const lastKey = lastNode.key
      const matchingLength = matchingNibbleLength(lastKey, keyRemainder)
      const newBranchNode = new TrieNode('branch')

      // create a new extention node
      if (matchingLength !== 0) {
        const newKey = lastNode.key.slice(0, matchingLength)
        const newExtNode = new TrieNode('extention', newKey, value)
        stack.push(newExtNode)
        lastKey.splice(0, matchingLength)
        keyRemainder.splice(0, matchingLength)
      }

      stack.push(newBranchNode)

      if (lastKey.length !== 0) {
        const branchKey = lastKey.shift()

        if (lastKey.length !== 0 || lastNode.type === 'leaf') {
          // shriking extention or leaf
          lastNode.key = lastKey
          const formatedNode = this._formatNode(lastNode, false, toSave)
          newBranchNode.setValue(branchKey, formatedNode)
        } else {
          // remove extention or attaching
          this._formatNode(lastNode, false, true, toSave)
          newBranchNode.setValue(branchKey, lastNode.value)
        }
      } else {
        newBranchNode.value = lastNode.value
      }

      if (keyRemainder.length !== 0) {
        keyRemainder.shift()
        // add a leaf node to the new branch node
        const newLeafNode = new TrieNode('leaf', keyRemainder, value)
        stack.push(newLeafNode)
      } else {
        newBranchNode.value = value
      }
    }

    this._saveStack(key, stack, toSave, cb)
  }

  // walk tree
  _walkTrie (root, onNode, onDone) {
    const self = this
    root = root || this.root
    onDone = onDone || function () {}
    let aborted = false
    let returnValues = []

    if (root.toString('hex') === ethUtil.SHA3_RLP.toString('hex')) {
      return onDone()
    }

    this._lookupNode(root, node => {
      processNode(root, node, null, err => {
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

    function processNode (nodeRef, node, key, cb) {
      if (!node || aborted) {
        return cb()
      }

      let stopped = false
      key = key || []

      const walkController = {
        stop: function () {
          stopped = true
          cb()
        },
        // end all traversal and return values to the onDone cb
        return: function () {
          aborted = true
          returnValues = arguments
          cb()
        },
        next: function () {
          if (aborted || stopped) {
            return cb()
          }

          const children = node.getChildren()
          async.forEachOf(children, (childData, index, cb) => {
            const keyExtension = childData[0]
            const childRef = childData[1]
            const childKey = key.concat(keyExtension)
            const priority = childKey.length
            taskExecutor.execute(priority, taskCallback => {
              self._lookupNode(childRef, childNode => {
                taskCallback()
                processNode(childRef, childNode, childKey, cb)
              })
            })
          }, cb)
        },
        only: function (childIndex) {
          const childRef = node.getValue(childIndex)
          const childKey = key.slice()
          childKey.push(childIndex)
          const priority = childKey.length
          taskExecutor.execute(priority, taskCallback => {
            self._lookupNode(childRef, childNode => {
              taskCallback()
              processNode(childRef, childNode, childKey, cb)
            })
          })
        }
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
  _saveStack (key, stack, opStack, cb) {
    let lastRoot

    // update nodes
    while (stack.length) {
      const node = stack.pop()
      if (node.type === 'leaf') {
        key.splice(key.length - node.key.length)
      } else if (node.type === 'extention') {
        key.splice(key.length - node.key.length)
        if (lastRoot) {
          node.value = lastRoot
        }
      } else if (node.type === 'branch') {
        if (lastRoot) {
          const branchKey = key.pop()
          node.setValue(branchKey, lastRoot)
        }
      }
      lastRoot = this._formatNode(node, stack.length === 0, opStack)
    }

    if (lastRoot) {
      this.root = lastRoot
    }

    this.db.batch(opStack, cb)
  }

  _deleteNode (key, stack, cb) {
    function processBranchNode (key, branchKey, branchNode, parentNode, stack) {
      // branchNode is the node ON the branch node not THE branch node
      const branchNodeKey = branchNode.key
      if (!parentNode || parentNode.type === 'branch') {
        // branch->?
        if (parentNode) {
          stack.push(parentNode)
        }

        if (branchNode.type === 'branch') {
          // create an extention node
          // branch->extention->branch
          const extentionNode = new TrieNode('extention', [branchKey], null)
          stack.push(extentionNode)
          key.push(branchKey)
        } else {
          // branch key is an extention or a leaf
          // branch->(leaf or extention)
          branchNodeKey.unshift(branchKey)
          branchNode.key = branchNodeKey

          // hackery. This is equvilant to array.concat except we need keep the
          // rerfance to the `key` that was passed in.
          branchNodeKey.unshift(0)
          branchNodeKey.unshift(key.length)
          key.splice.apply(key, branchNodeKey)
        }
        stack.push(branchNode)
      } else {
        // parent is a extention
        let parentKey = parentNode.key

        if (branchNode.type === 'branch') {
          // ext->branch
          parentKey.push(branchKey)
          key.push(branchKey)
          parentNode.key = parentKey
          stack.push(parentNode)
        } else {
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

    let lastNode = stack.pop()
    let parentNode = stack.pop()
    const opStack = []

    if (!Array.isArray(key)) {
      // convert key to nibbles
      key = stringToNibbles(key)
    }

    if (!parentNode) {
      // the root here has to be a leaf.
      this.root = this.EMPTY_TRIE_ROOT
      cb()
    } else {
      if (lastNode.type === 'branch') {
        lastNode.value = null
      } else {
        // the lastNode has to be a leaf if its not a branch. And a leaf's parent
        // if it has one must be a branch.
        const lastNodeKey = lastNode.key
        key.splice(key.length - lastNodeKey.length)
        // delete the value
        this._formatNode(lastNode, false, true, opStack)
        parentNode.setValue(key.pop(), null)
        lastNode = parentNode
        parentNode = stack.pop()
      }

      // nodes on the branch
      const branchNodes = []
      // count the number of nodes on the branch
      lastNode.raw.forEach((node, i) => {
        const val = lastNode.getValue(i)

        if (val) {
          branchNodes.push([i, val])
        }
      })

      // if there is only one branch node left, collapse the branch node
      if (branchNodes.length === 1) {
        // add the one remaing branch node to node above it
        const branchNode = branchNodes[0][1]
        const branchNodeKey = branchNodes[0][0]

        // look up node
        this._lookupNode(branchNode, foundNode => {
          key = processBranchNode(key, branchNodeKey, foundNode, parentNode, stack, opStack)
          this._saveStack(key, stack, opStack, cb)
        })
      } else {
        // simple removing a leaf and recaluclation the stack
        if (parentNode) {
          stack.push(parentNode)
        }

        stack.push(lastNode)
        this._saveStack(key, stack, opStack, cb)
      }
    }
  }

  // Creates the initial node from an empty tree
  _createInitialNode (key, value, cb) {
    const newNode = new TrieNode('leaf', key, value)
    this.root = newNode.hash()
    this._putNode(newNode, cb)
  }

  // formats node to be saved by levelup.batch.
  // returns either the hash that will be used key or the rawNode
  _formatNode (node, topLevel, remove, opStack) {
    if (arguments.length === 3) {
      opStack = remove
      remove = false
    }

    const rlpNode = node.serialize()

    if (rlpNode.length >= 32 || topLevel) {
      const hashRoot = node.hash()

      if (remove && this.isCheckpoint) {
        opStack.push({
          type: 'del',
          key: hashRoot
        })
      } else {
        opStack.push({
          type: 'put',
          key: hashRoot,
          value: rlpNode
        })
      }

      return hashRoot
    }

    return node.raw
  }

  /**
   * The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.
   * @method createReadStream
   * @memberof Trie
   * @return {stream.Readable} Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
   */
  createReadStream () {
    return new ReadStream(this)
  }

  // creates a new trie backed by the same db
  // and starting at the same root
  copy () {
    const db = this.db.copy()
    return new Trie(db, this.root)
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
  batch (ops, cb) {
    async.eachSeries(ops, (op, cb2) => {
      if (op.type === 'put') {
        this.put(op.key, op.value, cb2)
      } else if (op.type === 'del') {
        this.del(op.key, cb2)
      } else {
        cb2()
      }
    }, cb)
  }

  /**
   * Checks if a given root exists
   * @method checkRoot
   * @memberof Trie
   * @param {Buffer} root
   * @param {Function} cb
   */
  checkRoot (root, cb) {
    root = ethUtil.toBuffer(root)
    this._lookupNode(root, value => {
      cb(null, !!value)
    })
  }
}
