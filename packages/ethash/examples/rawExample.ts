import Ethash, { EthashCacheDB } from '../src'
import { MemoryLevel } from 'memory-level'

const ethash = new Ethash(new MemoryLevel())

const verifySubmit = async (
  ethash: Ethash,
  number: number,
  headerHash: Buffer,
  nonce: Buffer
): Promise<Buffer> => {
  console.log('Verifying number: ', number)
  await ethash.loadEpoc(BigInt(number))
  console.log('EPOC set')
  console.log('Seed: ', ethash.seed!.toString('hex'))
  const a = ethash.run(headerHash, nonce)
  return a.hash
}

const headerHash = Buffer.from(
  '0e2887aa1a0668bf8254d1a6ae518927de99e3e5d7f30fd1f16096e2608fe05e',
  'hex'
)
const nonce = Buffer.from('e360b6170c229d15', 'hex')

verifySubmit(ethash, 35414, headerHash, nonce).then((result) => {
  console.log('Result: ', result.toString('hex'))
})
