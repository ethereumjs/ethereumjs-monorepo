const levelup = require('levelup'),
  memdown = require('memdown'),
  async = require('async'),
  inherits = require('util').inherits,
  Readable = require('stream').Readable,
  callTogether = require('./util').callTogether,
  TrieNode = require('./trieNode'),
  TrieReadStream = require('./readStream');

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
  trie.createScratchReadStream = createScratchReadStream
  
  // overwrites
  trie.copy = copy.bind(trie, trie.copy.bind(trie))

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
        self._exitCpMode(true, cb)
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
        self._exitCpMode(false, cb)
        return
      }
    }

    cb();
  });
};

// enter into checkpoint mode
function _enterCpMode() {
  console.log('ENTER CP MODE --------->')
  this._scratch = levelup('', { db: memdown });
  this._getDBs.unshift(this._scratch);
  this.__putDBs = this._putDBs;
  console.log('SET PUT TO SCRATCH')
  this._putDBs = [this._scratch];
}

// exit from checkpoint mode
function _exitCpMode(commitState, cb) {
  console.log('EXIT CP MODE <---------')
  var self = this;
  var scratch = this._scratch;
  this._scratch = null;
  this._getDBs.shift();
  console.log('SET PUT TO DB')
  this._putDBs = this.__putDBs;

  function flushScratch(db, cb) {
    console.log('FLUSH START')
    self.createScratchReadStream(scratch)
    .on('data', function(data){
      console.log('FLUSH:',data.key.toString('hex'))
    })
    .pipe(db.createWriteStream())
    // .on('close', cb)
    .on('close', function(){
      console.log('FLUSH COMPLETE')
      cb()
    })
  }

  if (commitState) {
    console.log('TODO - walk scratch tree into db from root, skipping missing nodes')
    async.map(this._putDBs, flushScratch, cb)
  } else {
    cb()
  }
}

// adds the interface when copying the trie
function copy(_super) {
  var trie = _super();
  checkpointInterface(trie);
  trie._scratch = this._scratch;
  trie._checkpoints = this._checkpoints.slice();

  console.log('TODO - sync the putDbs and getDbs')

  return trie;
}

function createScratchReadStream(scratch) {
  var trie = this.copy();
  // only read from the scratch
  trie._getDBs = [scratch];
  trie._scratch = scratch;
  console.log('SCRATCH TRIE ROOT:',trie.root.toString('hex'))
  return new ScratchReadStream(trie);
  // return new TrieReadStream(trie);
}

// ScratchReadStream

inherits(ScratchReadStream, Readable);

function ScratchReadStream(trie) {
  this.trie = trie;
  this.next = null;
  Readable.call(this, { objectMode: true });
};

// root is not in scratch -- why?

ScratchReadStream.prototype._read = function () {
  var self = this;
  if (!self._started) {
    self._started = true;
    self.trie._findDbNodes(function (root, node, key, next) {
      
      self.push({
        key: root,
        value: node.serialize(),
      })
      next();

    }, function () {
      // close stream
      self.push(null);
    });
  }
};
