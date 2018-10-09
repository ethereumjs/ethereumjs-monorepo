'use strict'

const EventEmitter = require('events')
const Heap = require('qheap')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger
}

async function timeout (delay) {
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Base class for fetchers that retrieve various data from peers. Subclasses must
 * override the before(), fetch() and process() methods. Tasks can be arbitrary
 * objects whose structure is defined by subclasses. A priority queue is used to
 * ensure most important tasks are processed first based on the before() function.
 * @memberof module:sync
 */
class Fetcher extends EventEmitter {
  /**
   * Create new fetcher
   * @param {Object}   options constructor parameters
   * @param {PeerPool} options.pool peer pool
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.pool = options.pool
    this.logger = options.logger
    this.maxFetchTime = 5000
    this.active = new Map()
    this.heap = new Heap({
      comparBefore: (a, b) => this.before(a, b)
    })
    this.pool.on('removed', peer => this.failure(peer.id))
    this.running = false
  }

  /**
   * Add new task to fetcher
   * @param {Object} task
   */
  add (task) {
    this.heap.insert(task)
  }

  /**
   * handle successful task completion
   * @private
   * @param  {string} peerId peer id
   */
  success (peerId) {
    const entry = this.active.get(peerId)
    if (entry) {
      const { peer } = entry
      peer.idle = true
      this.active.delete(peer.id)
      this.next()
    }
  }

  /**
   * handle failed task completion
   * @private
   * @param  {string} peerId peer id
   * @param  {Error}  [error] error
   */
  failure (peerId, error) {
    const entry = this.active.get(peerId)
    if (entry) {
      const { task, peer } = entry
      peer.idle = true
      this.active.delete(peerId)
      this.add(task)
      if (error) {
        this.error(error, task, peer)
      }
      this.next()
    }
  }

  /**
   * Process next task
   */
  next () {
    const task = this.heap.peek()
    if (!task) {
      return
    }
    const peer = this.pool.idle(this.fetchable.bind(this))
    if (peer) {
      peer.idle = false
      this.heap.remove()
      this.active.set(peer.id, { time: Date.now(), task: task, peer: peer })
      this.fetch(task, peer)
        .then(reply => this.handle(reply, peer))
        .catch(error => this.failure(peer.id, error))
      return task
    } else {
      this.logger.debug(`No idle peers found. Waiting...`)
    }
  }

  /**
   * Handler for responses from peers. Finds and processes the corresponding
   * task using the process() method, and resets peer to an idle state.
   * @param  {Object} reply
   * @param  {Peer}   peer
   */
  handle (reply, peer) {
    const entry = this.active.get(peer.id)
    if (entry) {
      if (reply) {
        try {
          this.process(entry, reply)
          this.success(peer.id)
        } catch (error) {
          this.failure(peer.id, error)
        }
      } else {
        // if fetch returns a falsy reply, then re-add task
        this.failure(peer.id)
      }
    } else {
      peer.idle = true
      this.logger.warn(`Task missing for peer ${peer}`)
    }
  }

  /**
   * Handle error
   * @param  {Error}  error error object
   * @param  {Object} task  task
   * @param  {Peer}   peer  peer
   */
  error (error, task, peer) {
    this.emit('error', error, task, peer)
  }

  /**
   * Expires all tasks that have timed out. Peers that take too long to respond
   * will be banned for 5 minutes. Timeout out tasks will be re-inserted into the
   * queue.
   */
  expire () {
    const now = Date.now()
    for (let [id, entry] of this.active) {
      if (now - entry.time > this.maxFetchTime) {
        if (this.pool.contains(entry.peer)) {
          this.logger.debug(`Task timed out for peer (banning) ${JSON.stringify(entry.task)} ${entry.peer}`)
          this.pool.ban(entry.peer, 300000)
        } else {
          this.logger.debug(`Peer disconnected while performing task ${JSON.stringify(entry.task)} ${entry.peer}`)
        }
        this.active.delete(id)
        this.add(entry.task)
      }
    }
  }

  /**
   * Run the fetcher. Returns a promise that resolves once all tasks are completed.
   * @return {Promise}
   */
  async start () {
    if (this.running) {
      return false
    }
    this.running = true
    while (this.running) {
      this.expire()
      if (!this.next()) {
        if (this.heap.length === 0 && this.active.size === 0) {
          this.running = false
        } else {
          await timeout(1000)
        }
      }
    }
  }

  /**
   * Stop the fetcher. Returns a promise that resolves once it is stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    while (this.heap.remove()) {}
    this.active.clear()
    while (this.running) {
      await timeout(1000)
    }
  }

  /**
   * True if taskOne has a higher priority than taskTwo
   * @param  {Object}  taskOne
   * @param  {Object}  taskTwo
   * @return {boolean}
   */
  before (taskOne, taskTwo) {
    throw new Error('Unimplemented')
  }

  /**
   * True if peer can process fetch tasks
   * @param  {Peer}    peer candidate peer
   * @return {boolean}
   */
  fetchable (peer) {
    return true
  }

  /**
   * Sends a protocol command to peer for the specified task. Must return a
   * promise that resolves with the decoded response to the commad.
   * @param  {Object} task
   * @param  {Peer} peer
   * @return {Promise}
   */
  fetch (task, peer) {
    throw new Error('Unimplemented')
  }

  /**
   * Process the reply for the given fetch queue entry
   * @param  {Object} entry entry object
   * @param  {Object} entry.task fetch task
   * @param  {Peer}   entry.peer peer that handled task
   * @param  {number} entry.time time task was generated
   * @param  {Object} reply reply data
   */
  process (entry, reply) {
    throw new Error('Unimplemented')
  }
}

module.exports = Fetcher
