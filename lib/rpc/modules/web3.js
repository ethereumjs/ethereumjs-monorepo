const { middleware, validators } = require('../validation')
const { addHexPrefix, keccak256 } = require('ethereumjs-util')
const { platform } = require('os')

class Web3 {
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain

    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(this.sha3.bind(this), 1, [[validators.hex]])
  }

  clientVersion (params, cb) {
    const packageVersion = require('../../../package.json').version
    const { version } = process
    const ethJsVersion = `EthereumJS/${packageVersion}/${platform()}/node${version.substring(
      1
    )}`
    cb(null, ethJsVersion)
  }

  sha3 (params, cb) {
    try {
      const rawDigest = keccak256(params[0])
      const hexEncodedDigest = addHexPrefix(rawDigest.toString('hex'))
      cb(null, hexEncodedDigest)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = Web3
