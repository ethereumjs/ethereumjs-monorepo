import Ethash from '../src'
const levelup = require('levelup')
const memdown = require('memdown')

const cacheDB = levelup('', {
  db: memdown
})

const ethash = new Ethash(cacheDB)
// make the 1000 cache items with a seed of 0 * 32
ethash.mkcache(1000, Buffer.alloc(32).fill(0))

const result = ethash.run(Buffer.from('test'), Buffer.from([0]), 1000)
console.log(result.hash.toString('hex'))
