/*
index.js - Kademlia DHT K-bucket implementation as a binary tree.

The MIT License (MIT)

Copyright (c) 2013-2021 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// TODO: Also internalize types from Definitely Typed at some point
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/266eae5148c535e6b41fe5d0adb2ad23f302bc8a/types/k-bucket/index.d.ts#L4
// (side note: this was once done by tomonari-t dedicatedly for this library
// (please nevertheless include the original license reference))

import { equalsBytes, randomBytes } from '@ethereumjs/util'
import { EventEmitter } from 'events'

import type { Contact, KBucketOptions, PeerInfo } from '../types.js'

function createNode() {
  return { contacts: [], dontSplit: false, left: null, right: null }
}

type KBucketNode = {
  contacts: Contact[] | null
  dontSplit: boolean
  left: KBucketNode | null
  right: KBucketNode | null
}

/**
 * Implementation of a Kademlia DHT k-bucket used for storing
 * contact (peer node) information.
 *
 * @extends EventEmitter
 */
export class KBucket {
  public events: EventEmitter
  protected _localNodeId: Uint8Array
  protected _numberOfNodesPerKBucket: number
  protected _numberOfNodesToPing: number
  distance: (firstId: Uint8Array, secondId: Uint8Array) => number
  arbiter: (incumbent: Contact, candidate: Contact) => Contact
  protected _metadata: object
  protected _root: KBucketNode
  /**
   *
   * @param {KBucketOptions} options
   */
  constructor(options: KBucketOptions = {}) {
    this.events = new EventEmitter()
    this._localNodeId = options.localNodeId ?? randomBytes(20)
    this._numberOfNodesPerKBucket = options.numberOfNodesPerKBucket ?? 20
    this._numberOfNodesToPing = options.numberOfNodesToPing ?? 3
    this.distance = options.distance ?? KBucket.distance
    // use an arbiter from options or vectorClock arbiter by default
    this.arbiter = options.arbiter ?? KBucket.arbiter
    this._metadata = Object.assign({}, options.metadata)

    this._root = createNode()
  }

  /**
   * Default arbiter function for contacts with the same id. Uses
   * contact.vectorClock to select which contact to update the k-bucket with.
   * Contact with larger vectorClock field will be selected. If vectorClock is
   * the same, candidate will be selected.
   *
   * @param  {Contact} incumbent Contact currently stored in the k-bucket.
   * @param  {Contact} candidate Contact being added to the k-bucket.
   * @return {Contact}           Contact to updated the k-bucket with.
   */
  static arbiter(incumbent: Contact, candidate: Contact): Contact {
    return incumbent.vectorClock > candidate.vectorClock ? incumbent : candidate
  }

  /**
   * Default distance function. Finds the XOR
   * distance between firstId and secondId.
   *
   * @param  {Uint8Array} firstId  Uint8Array containing first id.
   * @param  {Uint8Array} secondId Uint8Array containing second id.
   * @return {number}              Integer The XOR distance between firstId
   *                               and secondId.
   */
  static distance(firstId: Uint8Array, secondId: Uint8Array): number {
    let distance = 0
    let i = 0
    const min = Math.min(firstId.length, secondId.length)
    const max = Math.max(firstId.length, secondId.length)
    for (; i < min; ++i) {
      distance = distance * 256 + (firstId[i] ^ secondId[i])
    }
    for (; i < max; ++i) distance = distance * 256 + 255
    return distance
  }

  /**
   * Adds a contact to the k-bucket.
   *
   * @param {PeerInfo} contact the contact object to add
   */
  add(contact: PeerInfo): KBucket {
    if (!(contact.id instanceof Uint8Array)) {
      throw new Error('Contact must have an id')
    }

    let bitIndex = 0
    let node = this._root

    while (node.contacts === null) {
      // this is not a leaf node but an inner node with 'low' and 'high'
      // branches; we will check the appropriate bit of the identifier and
      // delegate to the appropriate node for further processing
      node = this._determineNode(node, contact.id, bitIndex++)
    }

    // check if the contact already exists
    const index = this._indexOf(node, contact.id)
    if (index >= 0) {
      this._update(node, index, contact as Contact)
      return this
    }

    if (node.contacts.length < this._numberOfNodesPerKBucket) {
      node.contacts.push(contact as Contact)
      this.events.emit('added', contact)
      return this
    }

    // the bucket is full
    if (node.dontSplit) {
      // we are not allowed to split the bucket
      // we need to ping the first this._numberOfNodesToPing
      // in order to determine if they are alive
      // only if one of the pinged nodes does not respond, can the new contact
      // be added (this prevents DoS flodding with new invalid contacts)
      this.events.emit('ping', node.contacts.slice(0, this._numberOfNodesToPing), contact)
      return this
    }

    this._split(node, bitIndex)
    return this.add(contact)
  }

  /**
   * Get the n closest contacts to the provided node id. "Closest" here means:
   * closest according to the XOR metric of the contact node id.
   *
   * @param  {Uint8Array} id  Contact node id
   * @param  {number} n      Integer (Default: Infinity) The maximum number of closest contacts to return
   * @return {Contact[]}          Array Maximum of n closest contacts to the node id
   */
  closest(id: Uint8Array, n: number | undefined = Infinity): Contact[] {
    if (!(id instanceof Uint8Array)) {
      throw new TypeError('id must be a Uint8Array')
    }

    if ((!Number.isInteger(n) && n !== Infinity) || n <= 0) {
      throw new TypeError('n is not positive number')
    }

    let contacts: Contact[] = []

    for (let nodes = [this._root], bitIndex = 0; nodes.length > 0 && contacts.length < n; ) {
      const node = nodes.pop()!
      if (node.contacts === null) {
        const detNode = this._determineNode(node, id, bitIndex++)
        nodes.push(node.left === detNode ? node.right! : node.left!)
        nodes.push(detNode)
      } else {
        contacts = contacts.concat(node.contacts)
      }
    }

    // Sort the contacts by distance from node id and return `n` closest ones
    return contacts.sort((a, b) => this.distance(a.id, id) - this.distance(b.id, id)).slice(0, n)
  }

  /**
   * Counts the total number of contacts in the tree.
   *
   * @return {number} The number of contacts held in the tree
   */
  count(): number {
    let count = 0
    for (const nodes = [this._root]; nodes.length > 0; ) {
      const node = nodes.pop()!
      if (node.contacts === null) nodes.push(node.right!, node.left!)
      else count += node.contacts.length
    }
    return count
  }

  /**
   * Determines whether the id at the bitIndex is 0 or 1.
   * Return left leaf if `id` at `bitIndex` is 0, right leaf otherwise
   *
   * @param  {KBucketNode} node     internal object that has 2 leafs: left and right
   * @param  {Uint8Array} id   Id to compare _localNodeId with.
   * @param  {Number} bitIndex Integer (Default: 0) The bit index to which bit
   *                           to check in the id Uint8Array.
   * @return {KBucketNode}          left leaf if id at bitIndex is 0, right leaf otherwise.
   */
  _determineNode(node: KBucketNode, id: Uint8Array, bitIndex: number): KBucketNode {
    // **NOTE** remember that id is a Uint8Array and has granularity of
    // bytes (8 bits), whereas the bitIndex is the _bit_ index (not byte)

    // id's that are too short are put in low bucket (1 byte = 8 bits)
    // (bitIndex >> 3) finds how many bytes the bitIndex describes
    // bitIndex % 8 checks if we have extra bits beyond byte multiples
    // if number of bytes is <= no. of bytes described by bitIndex and there
    // are extra bits to consider, this means id has less bits than what
    // bitIndex describes, id therefore is too short, and will be put in low
    // bucket
    const bytesDescribedByBitIndex = bitIndex >> 3
    const bitIndexWithinByte = bitIndex % 8
    if (id.length <= bytesDescribedByBitIndex && bitIndexWithinByte !== 0) {
      return node.left!
    }

    const byteUnderConsideration = id[bytesDescribedByBitIndex]

    // byteUnderConsideration is an integer from 0 to 255 represented by 8 bits
    // where 255 is 11111111 and 0 is 00000000
    // in order to find out whether the bit at bitIndexWithinByte is set
    // we construct (1 << (7 - bitIndexWithinByte)) which will consist
    // of all bits being 0, with only one bit set to 1
    // for example, if bitIndexWithinByte is 3, we will construct 00010000 by
    // (1 << (7 - 3)) -> (1 << 4) -> 16
    if (byteUnderConsideration & (1 << (7 - bitIndexWithinByte))) {
      return node.right!
    }

    return node.left!
  }

  /**
   * Get a contact by its exact ID.
   * If this is a leaf, loop through the bucket contents and return the correct
   * contact if we have it or null if not. If this is an inner node, determine
   * which branch of the tree to traverse and repeat.
   *
   * @param  {Uint8Array} id The ID of the contact to fetch.
   * @return {Contact|null}   The contact if available, otherwise null
   */
  get(id: Uint8Array): Contact | null {
    let bitIndex = 0

    let node = this._root
    while (node.contacts === null) {
      node = this._determineNode(node, id, bitIndex++)
    }

    // index of uses contact id for matching
    const index = this._indexOf(node, id)
    return index >= 0 ? node.contacts[index] : null
  }

  /**
   * Returns the index of the contact with provided
   * id if it exists, returns -1 otherwise.
   *
   * @param  {KBucketNode} node    internal object that has 2 leafs: left and right
   * @param  {Uint8Array} id  Contact node id.
   * @return {number}         Integer Index of contact with provided id if it
   *                          exists, -1 otherwise.
   */
  _indexOf(node: KBucketNode, id: Uint8Array): number {
    for (let i = 0; i < node.contacts!.length; ++i) {
      if (equalsBytes(node.contacts![i].id, id)) return i
    }

    return -1
  }

  /**
   * Removes contact with the provided id.
   *
   * @param  {Uint8Array} id The ID of the contact to remove.
   * @return {KBucket}        The k-bucket itself.
   */
  remove(id: Uint8Array): KBucket {
    let bitIndex = 0
    let node = this._root

    while (node.contacts === null) {
      node = this._determineNode(node, id, bitIndex++)
    }

    const index = this._indexOf(node, id)
    if (index >= 0) {
      const contact = node.contacts.splice(index, 1)[0]
      this.events.emit('removed', contact)
    }

    return this
  }

  /**
   * Splits the node, redistributes contacts to the new nodes, and marks the
   * node that was split as an inner node of the binary tree of nodes by
   * setting this._root.contacts = null
   *
   * @param  {object} node     node for splitting
   * @param  {number} bitIndex the bitIndex to which byte to check in the
   *                           Uint8Array for navigating the binary tree
   */
  _split(node: KBucketNode, bitIndex: number) {
    node.left = createNode()
    node.right = createNode()

    // redistribute existing contacts amongst the two newly created nodes
    for (const contact of node.contacts!) {
      this._determineNode(node, contact.id, bitIndex).contacts!.push(contact)
    }

    node.contacts = null // mark as inner tree node

    // don't split the "far away" node
    // we check where the local node would end up and mark the other one as
    // "dontSplit" (i.e. "far away")
    const detNode = this._determineNode(node, this._localNodeId, bitIndex)
    const otherNode = node.left === detNode ? node.right : node.left
    otherNode.dontSplit = true
  }

  /**
   * Returns all the contacts contained in the tree as an array.
   * If this is a leaf, return a copy of the bucket. If this is not a leaf,
   * return the union of the low and high branches (themselves also as arrays).
   *
   * @return {Contact[]} All of the contacts in the tree, as an array
   */
  toArray(): Contact[] {
    let result: Contact[] = []
    for (const nodes = [this._root]; nodes.length > 0; ) {
      const node = nodes.pop()!
      if (node.contacts === null) nodes.push(node.right!, node.left!)
      else result = result.concat(node.contacts)
    }
    return result
  }

  /**
   * Similar to `toArray()` but instead of buffering everything up into an
   * array before returning it, yields contacts as they are encountered while
   * walking the tree.
   *
   * @return {Contact} All of the contacts in the tree, as an iterable
   */
  *toIterable(): Iterable<Contact> {
    for (const nodes = [this._root]; nodes.length > 0; ) {
      const node = nodes.pop()!
      if (node.contacts === null) {
        nodes.push(node.right!, node.left!)
      } else {
        yield* node.contacts
      }
    }
  }

  /**
   * Updates the contact selected by the arbiter.
   * If the selection is our old contact and the candidate is some new contact
   * then the new contact is abandoned (not added).
   * If the selection is our old contact and the candidate is our old contact
   * then we are refreshing the contact and it is marked as most recently
   * contacted (by being moved to the right/end of the bucket array).
   * If the selection is our new contact, the old contact is removed and the new
   * contact is marked as most recently contacted.
   *
   * @param  {KBucketNode} node    internal object that has 2 leafs: left and right
   * @param  {number} index   the index in the bucket where contact exists
   *                          (index has already been computed in a previous
   *                          calculation)
   * @param  {Contact} contact The contact object to update.
   */
  _update(node: KBucketNode, index: number, contact: Contact) {
    // sanity check
    if (!equalsBytes(node.contacts![index].id, contact.id)) {
      throw new Error('wrong index for _update')
    }

    if (node.contacts === null) throw new Error('Missing node.contacts')

    const incumbent = node.contacts[index]
    const selection = this.arbiter(incumbent, contact)
    // if the selection is our old contact and the candidate is some new
    // contact, then there is nothing to do
    if (selection === incumbent && incumbent !== contact) return

    node.contacts.splice(index, 1) // remove old contact
    node.contacts.push(selection) // add more recent contact version
    this.events.emit('updated', incumbent, selection)
  }
}
