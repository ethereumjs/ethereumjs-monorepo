import { thirdparty } from '@ethereumjs/wallet'

const wallet = thirdparty.fromQuorumWallet('mySecretQuorumWalletPassphrase', 'myPublicQuorumUserId')
console.log(wallet.getAddressString()) // An Ethereum address
