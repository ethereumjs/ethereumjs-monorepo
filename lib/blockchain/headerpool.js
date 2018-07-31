'use strict'

const BlockPool = require('./blockpool')
const BN = require('ethereumjs-util').BN

/**
 * Pool of headerchain segments
 * @memberof module:blockchain
 */
class HeaderPool extends BlockPool {
  /**
   * Add a headerchain segment to the pool. Returns a promise that resolves once
   * the segment has been added to the pool. Segments are automatically inserted
   * into the blockchain once prior gaps are filled.
   * @param {Header[]} headers list of sequential headers
   * @return {Promise}
   */
  async add (headers) {
    if (!this.opened) {
      return false
    }

    if (!Array.isArray(headers)) {
      headers = [ headers ]
    }

    let latest = this.chain.headers.height
    let first = new BN(headers[0].number)

    if (first.gt(latest.addn(1))) {
      // if block segment arrived out of order, save it to the pool
      this.pool.set(first.toString(), headers)
      return
    }
    while (headers) {
      // otherwise save headers and keep saving headers from header pool in order
      let last = new BN(headers[headers.length - 1].number)
      let hash = headers[0].hash().toString('hex').slice(0, 8) + '...'
      await this.chain.addHeaders(headers)
      this.logger.info(`Imported headers count=${headers.length} number=${first.toString(10)} hash=${hash}`)
      latest = last
      headers = this.pool.get(last.addn(1).toString())
      if (headers) {
        this.pool.delete(last.addn(1).toString())
        first = new BN(headers[0].number)
      }
    }
  }
}

module.exports = HeaderPool
