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
   * Process next task
   */
  next () {
    const task = this.heap.peek()
    if (!task) {
      return
    }
    const peer = this.pool.idle()
    if (peer) {
      peer.idle = false
      this.heap.remove()
      this.active.set(peer.id, { time: Date.now(), task: task, peer: peer })
      this.fetch(task, peer)
      return task
    } else {
      this.logger.debug(`No idle peers found. Waiting...`)
    }
  }

  /**
   * Handler for messages sent from peers. Finds and processes the corresponding
   * task using the process() method, and resets peer to an idle state.
   * @param  {Object} message
   * @param  {Peer}   peer
   */
  handle (message, peer) {
    peer.idle = true
    const { task } = this.active.get(peer.id)
    if (task) {
      this.active.delete(peer.id)
      try {
        this.process(task, message.payload)
      } catch (error) {
        this.logger.error(`Error processing task ${JSON.stringify(task)} with peer ${peer}: ${error}`)
      }
      this.next()
    } else {
      this.logger.warn(`Task missing for peer ${JSON.stringify(task)} ${peer}`)
    }
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
  async run () {
    if (this.running) {
      return
    }
    this.running = true
    while (this.running) {
      this.expire()
      if (!this.next()) {
        if (this.heap.length === 0 && this.active.size === 0) {
          this.running = false
        } else {
          await timeout(this.maxFetchTime)
        }
      }
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
   * Fetches data from peer for the specified task
   * @param  {Object} task
   * @param  {Peer} peer
   */
  fetch (task, peer) {
    throw new Error('Unimplemented')
  }

  /**
   * Process the message payload for the given task
   * @param  {Object} task
   * @param  {Array} payload rlp encoded payload
   */
  process (task, payload) {
    throw new Error('Unimplemented')
  }
}

module.exports = Fetcher
