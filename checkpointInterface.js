const levelup = require('levelup'),
  memdown = require('memdown'),
  callTogether = require('./util').callTogether;

module.exports = checkpointInterface


function checkpointInterface (trie) {

  this._scratch = null;
  trie._checkpoints = []
  
  Object.defineProperty(trie, 'isCheckpoint', {
    get: function(){
      return !!trie._checkpoints.length
    }
  })

  // new methods
  trie.checkpoint = checkpoint
  trie.commit = commit
  trie.revert = revert
  trie._enterCpMode = _enterCpMode
  trie._exitCpMode = _exitCpMode
  
  // overwrites
  trie.copy = copy.bind(trie, trie.copy)

}

// creates a checkpoint
function checkpoint() {
  var self = this;
  var wasCheckpoint = self.isCheckpoint;
  self._checkpoints.push(self.root);
  if (!wasCheckpoint && self.isCheckpoint) {
    self._enterCpMode();
  }
};

// commits a checkpoint.
function commit(cb) {
  var self = this;
  cb = callTogether(cb, self.sem.leave);

  self.sem.take(function() {
    if (self.isCheckpoint) {
      self._checkpoints.pop();
      if (!self.isCheckpoint) {
        self._exitCpMode(cb)
      } else {
        cb()
      }
    } else {
      cb();
    }
  });
};

// reverts a checkpoint
function revert(cb) {
  var self = this;
  cb = callTogether(cb, self.sem.leave);

  self.sem.take(function() {
    if (self.isCheckpoint) {
      self.root = self._checkpoints.pop();
      if (!self.isCheckpoint) {
        self._exitCpMode(cb)
        return
      }
    }

    cb();
  });
};

// enter into checkpoint mode
function _enterCpMode() {
  this._scratch = levelup('', { db: memdown });
  this._getDBs.unshift(this._scratch);
  this.__putDBs = this._putDBs;
  this._putDBs = [this._scratch];
}

// exit from checkpoint mode
function _exitCpMode(cb) {
  var scratch = this._scratch;
  this._scratch = null;
  this._getDBs.shift();
  this._putDBs = this.__putDBs;

  console.log('TODO - walk scratch tree into db from root, skipping missing nodes')
  console.log('TODO - also stream to cache')
  scratch.createReadStream()
  .pipe(this._db.createWriteStream())
  .on('close', cb);
}

// adds the interface when copying the trie
function copy(_super) {
  var trie = _super();
  checkpointInterface(trie);
  trie._checkpoints = this._checkpoints;
  return trie;
}
