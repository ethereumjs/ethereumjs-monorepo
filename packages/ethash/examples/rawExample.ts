import { Ethash } from '../src/index.js'
import { MemoryLevel } from 'memory-level'
import { bytesToHex } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils.js'

const ethash = new Ethash(new MemoryLevel())

const verifySubmit = async (
  ethash: Ethash,
  number: number,
  headerHash: Uint8Array,
  nonce: Uint8Array
): Promise<Uint8Array> => {
  console.log('Verifying number: ', number)
  await ethash.loadEpoc(BigInt(number))
  console.log('EPOC set')
  console.log('Seed: ', bytesToHex(ethash.seed!))
  const a = ethash.run(headerHash, nonce)
  return a.hash
}

const headerHash = hexToBytes('0e2887aa1a0668bf8254d1a6ae518927de99e3e5d7f30fd1f16096e2608fe05e')
const nonce = hexToBytes('e360b6170c229d15')

verifySubmit(ethash, 35414, headerHash, nonce).then((result) => {
  console.log('Result: ', bytesToHex(result))
})
