import Wallet from './index'

const HookedWalletEthTxSubprovider = require('web3-provider-engine/subproviders/hooked-wallet-ethtx')

export default class WalletSubprovider extends HookedWalletEthTxSubprovider {
  constructor(wallet: Wallet, opts?: any) {
    if (!opts) {
      opts = {}
    }

    opts.getAccounts = (cb: any) => cb(null, [wallet.getAddressString()])

    opts.getPrivateKey = (address: string, cb: any) => {
      if (address !== wallet.getAddressString()) {
        cb(new Error('Account not found'))
      } else {
        cb(null, wallet.getPrivateKey())
      }
    }
    super(opts)
  }
}
