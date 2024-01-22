import { Wallet } from '@ethereumjs/wallet'
import { thirdparty } from '@ethereumjs/wallet'
import { hdkey } from '@ethereumjs/wallet'

const wallet = Wallet.generate()
console.log(wallet.getAddressString()) // should output an Ethereum address
