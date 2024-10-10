const { hdkey } = require('@ethereumjs/wallet')

const wallet = hdkey.EthereumHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess'
)
console.log(wallet.getWallet().getAddressString()) // Should print an Ethereum address
