import { Transaction } from '../src'
import Common from 'ethereumjs-common'
import { bufferToHex, privateToAddress } from 'ethereumjs-util'

// In this example we create a transaction for a custom network.
//
// All of these network's params are the same than mainnets', except for name, chainId, and
// networkId, so we use the Common.forCustomChain method.
const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'my-network',
    networkId: 123,
    chainId: 2134,
  },
  'petersburg',
)

// We pass our custom Common object whenever we create a transaction

const tx = new Transaction(
  {
    nonce: 0,
    gasPrice: 100,
    gasLimit: 1000000000,
    value: 100000,
  },
  { common: customCommon },
)

// Once we created the transaction using the custom Common object, we can use it as a normal tx.

// Here we sign it and validate its signature
const privateKey = new Buffer(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex',
)

tx.sign(privateKey)

if (
  tx.validate() &&
  bufferToHex(tx.getSenderAddress()) === bufferToHex(privateToAddress(privateKey))
) {
  console.log('Valid signature')
} else {
  console.log('Invalid signature')
}

console.log("The transaction's chain id is", tx.getChainId())
