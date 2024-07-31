import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

// In this example we create a transaction for a custom network.

// This custom network has the same params as mainnet,
// except for name, chainId, so we use the `Common.custom` method.
const customCommon = createCustomCommon(
  {
    name: 'my-network',
    chainId: 2134,
  },
  Mainnet,
  {
    hardfork: 'petersburg',
  },
)

// We pass our custom Common object whenever we create a transaction
const opts = { common: customCommon }
const tx = createLegacyTx(
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
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const signedTx = tx.sign(privateKey)
const address = createAddressFromPrivateKey(privateKey)

if (signedTx.isValid() && signedTx.getSenderAddress().equals(address)) {
  console.log('Valid signature')
} else {
  console.log('Invalid signature')
}

console.log("The transaction's chain id is: ", signedTx.common.chainId().toString())
