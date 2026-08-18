import { hexToBytes } from '@ethereumjs/util'
import { Wallet } from '@ethereumjs/wallet'

const wallet = Wallet.fromPrivateKey(
  hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'),
)
console.log(`Address from private key: ${wallet.getAddressString()}`)
