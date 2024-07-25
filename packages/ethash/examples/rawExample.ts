import { MapDB, bytesToHex, hexToBytes } from '@ethereumjs/util'

import { Ethash } from '../dist/cjs/index.js'

import type { DBObject } from '@ethereumjs/util'

const ethash = new Ethash(new MapDB<number, DBObject>())

const verifySubmit = async (
  ethash: Ethash,
  number: number,
  headerHash: Uint8Array,
  nonce: Uint8Array,
): Promise<Uint8Array> => {
  console.log('Verifying number: ', number)
  await ethash.loadEpoc(BigInt(number))
  console.log('EPOC set')
  console.log('Seed: ', bytesToHex(ethash.seed!))
  const a = ethash.run(headerHash, nonce)
  return a.hash
}

const headerHash = hexToBytes('0x0e2887aa1a0668bf8254d1a6ae518927de99e3e5d7f30fd1f16096e2608fe05e')
const nonce = hexToBytes('0xe360b6170c229d15')

void verifySubmit(ethash, 35414, headerHash, nonce).then((result) => {
  console.log('Result: ', bytesToHex(result))
})
