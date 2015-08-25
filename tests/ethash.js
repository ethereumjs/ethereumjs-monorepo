const Ethash = require('../index.js')
const ethHashUtil = require('../util.js')
const ethUtil = require('ethereumjs-util')
const Header = require('ethereumjs-block/header.js')
const tape = require('tape')
const powTests = require('ethereumjs-testing').tests.powTests.ethash_tests
const async = require('async')

var ethash = new Ethash()
var tests = Object.keys(powTests)

tape('POW tests', function(t) {
  tests.forEach(function(key) {
    var test = powTests[key]
    var header = new Header(new Buffer(test.header, 'hex'))

    var headerHash = ethash.headerHash(header.raw)
    t.equal(headerHash.toString('hex'), test.header_hash, 'generate header hash')

    var epoc = ethHashUtil.getEpoc(ethUtil.bufferToInt(header.number))
    t.equal(ethHashUtil.getCacheSize(epoc), test.cache_size, 'generate cache size')
    t.equal(ethHashUtil.getFullSize(epoc), test.full_size, 'generate full cache size')

    ethash.mkcache(test.cache_size, new Buffer(test.seed, 'hex'))
    t.equal(ethash.cacheHash().toString('hex'), test.cache_hash, 'generate cache')

    var r = ethash.run(headerHash, new Buffer(test.nonce, 'hex'), test.full_size)
    t.equal(r.hash.toString('hex'), test.result, 'generate result')
    t.equal(r.mix.toString('hex'), test.mixhash, 'generate mix hash')
  })
  t.end()
})
