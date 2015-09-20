const BaseTrie = require('./baseTrie')
const checkpointInterface = require('./checkpoint-interface')
const inherits = require('util').inherits

module.exports = CheckpointTrie

inherits(CheckpointTrie, BaseTrie)

function CheckpointTrie () {
  BaseTrie.apply(this, arguments)
  checkpointInterface(this)
}
