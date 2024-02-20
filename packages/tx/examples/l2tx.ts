import { Common, CustomChain } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address, bytesToHex, hexToBytes } from '@ethereumjs/util'

const pk = hexToBytes('0x076247989df60a82f6e86e58104368676096f84e60972282ee00d4673a2bc9b9')
const to = Address.fromString('0x256e8f0ba532ad83a0debde7501669511a41a1f3')
const common = Common.custom(CustomChain.xDaiChain)

const txData = {
  nonce: 0,
  gasPrice: 1000000000,
  gasLimit: 21000,
  to,
  value: 1,
}

const tx = LegacyTransaction.fromTxData(txData, { common })
const signedTx = tx.sign(pk)
console.log(bytesToHex(signedTx.hash())) // 0xbf98f6f8700812ed6f2314275070256e11945fa48afd80fb301265f6a41a2dc2
