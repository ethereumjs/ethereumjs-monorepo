const BaseTrie = require('./baseTrie')
const checkpointInterface = require('./checkpoint-interface')
const proof = require('./proof.js')

module.exports = class CheckpointTrie extends BaseTrie {
  constructor (...args) {
    super(...args)
    checkpointInterface.call(this, this)
  }

  static prove (...args) {
    return proof.prove(...args)
  }

  static verifyProof (...args) {
    return proof.verifyProof(...args)
  }
}
