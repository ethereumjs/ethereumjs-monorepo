const Ethash = require('../index.js')

var ethash = new Ethash()
//make the 1000 cache items with a seed of 0 * 32
ethash.mkcache(1000, new Buffer(32).fill(0))

var result = ethash.run(new Buffer('test'), new Buffer([0]), 1000)
console.log(result.hash.toString('hex'));
