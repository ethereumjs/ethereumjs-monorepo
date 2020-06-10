import Ethash from '../src'
const levelup = require('levelup')
const memdown = require('memdown')

const cacheDB = levelup('', {
  db: memdown
})

const ethash = new Ethash(cacheDB)

const verifySubmit = (
  ethash: Ethash,
  number: number,
  headerHash: Buffer,
  nonce: Buffer,
  cb: (hash: Buffer) => void
) => {
  console.log(number)
  ethash.loadEpoc(number, () => {
    console.log('EPOC set')
    console.log(ethash.seed!.toString('hex'))
    const a = ethash.run(headerHash, nonce)
    cb(a.hash)
  })
}

const header = Buffer.from(
  '0e2887aa1a0668bf8254d1a6ae518927de99e3e5d7f30fd1f16096e2608fe05e',
  'hex'
)

verifySubmit(
  ethash,
  35414,
  header,
  Buffer.from('e360b6170c229d15', 'hex'),
  (result) => {
    console.log(result.toString('hex'))
  }
)
