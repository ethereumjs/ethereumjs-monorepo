import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const pk = hexToBytes('0x076247989df60a82f6e86e58104368676096f84e60972282ee00d4673a2bc9b9')
// xDai chain ID
const common = createCustomCommon({ chainId: 100 }, Mainnet)
const to = createAddressFromString('0x256e8f0ba532ad83a0debde7501669511a41a1f3')

const txData = {
  nonce: 0,
  gasPrice: 1000000000,
  gasLimit: 21000,
  to,
  value: 1,
}

const tx = createLegacyTx(txData, { common })
const signedTx = tx.sign(pk)
console.log(bytesToHex(signedTx.hash())) // 0xbf98f6f8700812ed6f2314275070256e11945fa48afd80fb301265f6a41a2dc2
