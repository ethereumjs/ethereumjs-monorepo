const CheckpointTrie = require('./index')
const secureInterface = require('./secure-interface')

/**
 * You can create a secure Trie where the keys are automatically hashed using **SHA3** by using `require('merkle-patricia-tree/secure')`. It has the same methods and constructor as `Trie`.
 * @class SecureTrie
 * @extends Trie
 */
module.exports = class SecureTrie extends CheckpointTrie {
  constructor (...args) {
    super(...args)
    secureInterface(this)
  }
}
