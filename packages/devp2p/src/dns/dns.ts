import dns from 'dns'
import assert from 'assert'
import { PeerInfo } from '../dpt'
import { ENR } from './enr'

type SearchContext = {
  domain: string
  publicKey: string
  visits: { [key: string]: boolean }
}

export type DNSOptions = {
  /**
   * Number of unsuccessful record retrieval attempts to allow while
   * searching the DNS tree. Default = 5
   * @type {number}
   */
  errorTolerance?: number

  /**
   * Log warnings for any errors encounters while fetching & parsing DNS records
   * Default = false
   * @type {boolean}
   */
  verbose?: boolean
}

export class DNS {
  _DNSTreeCache: { [key: string]: string }
  _tolerance: number
  _verbose: boolean

  constructor(options?: DNSOptions) {
    this._DNSTreeCache = {}
    this._tolerance = options?.errorTolerance || 5
    this._verbose = options?.verbose || false
  }

  /**
   * Returns a list of verified peers listed in an EIP-1459 DNS tree. Method may
   * return fewer peers than requested if `maxQuantity` is larger than the number
   * of ENR records or the number of errors/duplicate peers encountered by randomized
   * search exceeds `maxQuantity` plus the `errorTolerance` factor.
   *
   * @param {number}        maxQuantity  max number to get
   * @param {string}        treeEntry enrtree string (See EIP-1459 for format)
   * @param {PeerInfo[] = []} banList peers to ignore
   * @return {PeerInfo}
   */
  async getPeers(
    maxQuantity: number,
    treeEntry: string,
    banList: PeerInfo[] = []
  ): Promise<PeerInfo[]> {
    let totalSearches: number = 0
    const peers: PeerInfo[] = []

    const { publicKey, domain } = ENR.parseTree(treeEntry)

    while (peers.length < maxQuantity && totalSearches < maxQuantity + this._tolerance) {
      const context: SearchContext = {
        domain,
        publicKey,
        visits: {},
      }

      const peer = await this._search(domain, context)

      if (this._isNewPeer(peer, peers, banList)) {
        peers.push(peer as PeerInfo)
      }

      totalSearches++
    }
    return peers
  }

  /**
   * Runs a recursive, randomized descent of the DNS tree to retrieve a single
   * ENR record as a PeerInfo object. Returns null if parsing or DNS resolution fails.
   *
   * @param  {string}        subdomain
   * @param  {SearchContext} context
   * @return {PeerInfo | null}
   */
  private async _search(subdomain: string, context: SearchContext): Promise<PeerInfo | null> {
    const entry = await this._getTXTRecord(subdomain, context)
    context.visits[subdomain] = true

    let next: string
    let branches: string[]

    try {
      switch (this._getEntryType(entry)) {
        case ENR.ROOT_PREFIX:
          next = ENR.parseAndVerifyRoot(entry, context.publicKey)
          return await this._search(next, context)
        case ENR.BRANCH_PREFIX:
          branches = ENR.parseBranch(entry)
          next = this._selectRandomPath(branches, context)
          return await this._search(next, context)
        case ENR.RECORD_PREFIX:
          return ENR.parseAndVerifyRecord(entry)
        default:
          return null
      }
    } catch (error) {
      if (this._verbose) {
        // eslint-disable-next-line
        console.warn(`Errored searching DNS tree at subdomain ${subdomain}: ${error}`)
      }
      return null
    }
  }

  private _getEntryType(entry: string): string {
    if (entry.startsWith(ENR.ROOT_PREFIX)) return ENR.ROOT_PREFIX
    if (entry.startsWith(ENR.BRANCH_PREFIX)) return ENR.BRANCH_PREFIX
    if (entry.startsWith(ENR.RECORD_PREFIX)) return ENR.RECORD_PREFIX

    return ''
  }

  /**
   * Returns a randomly selected subdomain string from the list provided by a branch
   * entry record.
   *
   * The client must track subdomains which are already resolved to avoid
   * going into an infinite loop b/c branch entries can contain
   * circular references. It’s in the client’s best interest to traverse the
   * tree in random order.
   *
   * @param {string[]}      branches
   * @param {SearchContext} context
   * @return {String}       subdomian
   */
  private _selectRandomPath(branches: string[], context: SearchContext): string {
    // Identify domains already visited in this traversal of the DNS tree.
    // Then filter against them to prevent cycles.
    const circularRefs: { [key: number]: boolean } = {}
    for (const [idx, subdomain] of branches.entries()) {
      if (context.visits[subdomain]) {
        circularRefs[idx] = true
      }
    }
    // If all possible paths are circular...
    if (Object.keys(circularRefs).length === branches.length) {
      throw new Error('Unresolvable circular path detected')
    }

    // Randomly select a viable path
    let index
    do {
      index = Math.floor(Math.random() * branches.length)
    } while (circularRefs[index])

    return branches[index]
  }

  /**
   * Retrieves the TXT record stored at a location from either
   * this DNS tree cache or via Node's DNS api
   *
   * @param  {string}             subdomain
   * @param  {SearchContext = {}} context
   * @return {string}
   */
  private async _getTXTRecord(subdomain: string, context: SearchContext): Promise<string> {
    if (this._DNSTreeCache[subdomain]) {
      return this._DNSTreeCache[subdomain]
    }

    // Location is either the top level tree entry host or a subdomain of it.
    const location =
      subdomain !== context.domain ? `${subdomain}.${context.domain}` : context.domain

    const response = await dns.promises.resolve(location, 'TXT')

    assert(response.length, 'Received empty result array while fetching TXT record')
    assert(response[0].length, 'Received empty TXT record')

    this._DNSTreeCache[subdomain] = response[0][0]
    return response[0][0]
  }

  /**
   * Returns false if candidate peer already exists in the
   * current collection of peers or a list of banned peers.
   * Returns true otherwise.
   *
   * @param  {PeerInfo}   peer
   * @param  {PeerInfo[]} peers
   * @return {boolean}
   */
  private _isNewPeer(peer: PeerInfo | null, peers: PeerInfo[], banList: PeerInfo[]): boolean {
    if (!peer || !peer!.address) return false

    for (const existingPeer of peers) {
      if (peer.address === existingPeer.address) {
        return false
      }
    }

    for (const banned of banList) {
      if (peer.address === banned.address) {
        return false
      }
    }

    return true
  }
}
