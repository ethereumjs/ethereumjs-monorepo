import { Address } from '@ethereumjs/util'
import Common from '@ethereumjs/common'
import { Transaction } from '../src'

// In this example we create a transaction for a custom network.

// This custom network has the same params as mainnet,
// except for name, chainId, and networkId,
// so we use the `Common.custom` method.
const customCommon = Common.custom(
  
  {
    name: 'my-network',
    networkId: 123,
    chainId: 2134,
  },
  {
    baseChain: 'mainnet',
    hardfork: 'petersburg',}
)

// We pass our custom Common object whenever we create a transaction
const opts = { common: customCommon }
const tx = Transaction.fromTxData(
  {
    nonce: 0,
    gasPrice: 100,
    gasLimit: 1000000000,
    value: 100000,
  },
  opts,
)

// Once we created the transaction using the custom Common object, we can use it as a normal tx.

// Here we sign it and validate its signature
const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex',
)

const signedTx = tx.sign(privateKey)
const address = Address.fromPrivateKey(privateKey)

if (signedTx.validate() && signedTx.getSenderAddress().equals(address)) {
  console.log('Valid signature')
} else {
  console.log('Invalid signature')
}

console.log("The transaction's chain id is: ", signedTx.common.chainId().toString())
