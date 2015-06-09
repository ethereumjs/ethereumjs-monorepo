const BaseTrie = require('./baseTrie');
const checkpointInterface = require('./checkpointInterface');
const inherits = require('util').inherits;

module.exports = FancyTrie;


inherits(FancyTrie, BaseTrie);

function FancyTrie() {
  BaseTrie.apply(this, arguments);
  checkpointInterface(this);
}