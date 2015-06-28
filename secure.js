const CheckpointTrie = require('./index')
const secureInterface = require('./secure-interface')
const inherits = require('util').inherits

module.exports = SecureTrie
inherits(SecureTrie, CheckpointTrie)

function SecureTrie() {
  CheckpointTrie.apply(this, arguments)
  secureInterface(this)
}
