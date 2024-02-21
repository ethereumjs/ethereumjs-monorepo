import { Wallet } from '@ethereumjs/wallet'

const wallet = Wallet.generate()
console.log(wallet.getAddressString()) // should output an Ethereum address
