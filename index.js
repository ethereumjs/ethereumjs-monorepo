const ethUtil = require('ethereumjs-util')
const ethHashUtil = require('./util.js')
const xor = require('buffer-xor')
const BN = ethUtil.BN
const async = require('async')

var Ethash = module.exports = function (cacheDB) {
  this.dbOpts = {
    valueEncoding: 'json'
  }
  this.cacheDB = cacheDB
  this.cache = false
}

Ethash.prototype.mkcache = function (cacheSize, seed) {
  // console.log('generating cache')
  // console.log('size: ' + cacheSize)
  // console.log('seed: ' + seed.toString('hex'))
  const n = Math.floor(cacheSize / ethHashUtil.params.HASH_BYTES)
  var o = [ethUtil.sha3(seed, 512)]

  for (var i = 1; i < n; i++)
    o.push(ethUtil.sha3(o[o.length - 1], 512))

  for (var _ = 0; _ < ethHashUtil.params.CACHE_ROUNDS; _++) {
    for (var i = 0; i < n; i++) {
      var v = o[i].readUInt32LE(0) % n
      o[i] = ethUtil.sha3(xor(o[(i - 1 + n) % n], o[v]), 512)
    }
  }

  return this.cache = o
}

Ethash.prototype.calcDatasetItem = function (i) {
  const n = this.cache.length
  const r = Math.floor(ethHashUtil.params.HASH_BYTES / ethHashUtil.params.WORD_BYTES)
  var mix = new Buffer(this.cache[i % n])
  mix.writeInt32LE(mix.readUInt32LE(0) ^ i, 0)
  mix = ethUtil.sha3(mix, 512)
  for (var j = 0; j < ethHashUtil.params.DATASET_PARENTS; j++) {
    var cacheIndex = ethHashUtil.fnv(i ^ j, mix.readUInt32LE(j % r * 4))
    mix = ethHashUtil.fnvBuffer(mix, this.cache[cacheIndex % n])
  }
  return ethUtil.sha3(mix, 512)
}

Ethash.prototype.run = function (val, nonce, fullSize) {
  fullSize = fullSize || this.fullSize
  const n = Math.floor(fullSize / ethHashUtil.params.HASH_BYTES)
  const w = Math.floor(ethHashUtil.params.MIX_BYTES / ethHashUtil.params.WORD_BYTES)
  const s = ethUtil.sha3(Buffer.concat([val, ethHashUtil.bufReverse(nonce)]), 512)
  const mixhashes = Math.floor(ethHashUtil.params.MIX_BYTES / ethHashUtil.params.HASH_BYTES)
  var mix = Buffer.concat(Array(mixhashes).fill(s))

  for (var i = 0; i < ethHashUtil.params.ACCESSES; i++) {
    var p = ethHashUtil.fnv(i ^ s.readUInt32LE(0), mix.readUInt32LE(i % w * 4)) % Math.floor(n / mixhashes) * mixhashes
    var newdata = []
    for (var j = 0; j < mixhashes; j++)
      newdata.push(this.calcDatasetItem(p + j))

    newdata = Buffer.concat(newdata)
    mix = ethHashUtil.fnvBuffer(mix, newdata)
  }

  var cmix = new Buffer(mix.length / 4)
  for (var i = 0; i < mix.length / 4; i = i + 4) {
    var a = ethHashUtil.fnv(mix.readUInt32LE(i * 4), mix.readUInt32LE((i + 1) * 4))
    var b = ethHashUtil.fnv(a, mix.readUInt32LE((i + 2) * 4))
    var c = ethHashUtil.fnv(b, mix.readUInt32LE((i + 3) * 4))
    cmix.writeUInt32LE(c, i)
  }

  return {
    mix: cmix,
    hash: ethUtil.sha3(Buffer.concat([s, cmix]))
  }
}

Ethash.prototype.cacheHash = function () {
  return ethUtil.sha3(Buffer.concat(this.cache))
}

Ethash.prototype.headerHash = function (header) {
  return ethUtil.rlphash(header.slice(0, -2))
}

/**
 * Loads the seed and the cache given a block nnumber
 * @method loadEpoc
 * @param number Number
 * @param cm function
 */
Ethash.prototype.loadEpoc = function (number, cb) {
  var self = this
  const epoc = ethHashUtil.getEpoc(number)

  if (this.epoc === epoc)
    return cb()

  this.epoc = epoc

  // gives the seed the first epoc found
  function findLastSeed(epoc, cb2) {
    if (epoc === 0)
      return cb2(ethUtil.zeros(32), 0)

    self.cacheDB.get(epoc, self.dbOpts, function (err, data) {
      if (!err)
        cb2(data.seed, epoc)
      else
        findLastSeed(epoc - 1, cb2)
    })
  }

  self.cacheDB.get(epoc, self.dbOpts, function (err, data) {
    if (!data) {
      self.cacheSize = ethHashUtil.getCacheSize(epoc)
      self.fullSize = ethHashUtil.getFullSize(epoc)

      findLastSeed(epoc, function (seed, foundEpoc) {
        self.seed = ethHashUtil.getSeed(seed, foundEpoc, epoc)
        var cache = self.mkcache(self.cacheSize, self.seed)
          //store the generated cache
        self.cacheDB.put(epoc, {
          cacheSize: self.cacheSize,
          fullSize: self.fullSize,
          seed: self.seed,
          cache: cache
        }, self.dbOpts, cb)
      })
    } else {
      // Object.assign(self, data)
      self.cache = data.cache.map(function (a) {
        return new Buffer(a)
      })
      self.cacheSize = data.cacheSize
      self.fullSize = data.fullSize
      self.seed = new Buffer(data.seed)
      cb()
    }
  })
}

Ethash.prototype._verifyPOW = function (header, cb) {
  var self = this
  var headerHash = this.headerHash(header.raw)
  var number = ethUtil.bufferToInt(header.number)

  this.loadEpoc(number, function () {
    var a = self.run(headerHash, new Buffer(header.nonce, 'hex'))
    var result = new BN(a.hash)
    cb(a.mix.toString('hex') === header.mixHash.toString('hex') && (ethUtil.TWO_POW256.div(new BN(header.difficulty)).cmp(result) === 1))
  })
}

Ethash.prototype.verifyPOW = function (block, cb) {
  var self = this
  var valid = true

  // don't validate genesis blocks
  if (block.header.isGenesis()) {
    cb(true)
    return
  }

  this._verifyPOW(block.header, function (valid2) {
    valid &= valid2

    if (!valid)
      return cb(valid)

    async.eachSeries(block.uncleHeaders, function (uheader, cb2) {
      self._verifyPOW(uheader, function (valid3) {
        valid &= valid3
        if (!valid)
          cb2(Boolean(valid))
        else
          cb2()
      })
    }, function () {
      cb(Boolean(valid))
    })
  })
}
