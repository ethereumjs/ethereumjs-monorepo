import { hdkey } from '@ethereumjs/wallet'

const root = hdkey.EthereumHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
const account0 = root.derivePath("m/44'/60'/0'/0/0").getWallet()
const account1 = root.derivePath("m/44'/60'/0'/0/1").getWallet()

console.log(`Account 0: ${account0.getAddressString()}`)
console.log(`Account 1: ${account1.getAddressString()}`)
