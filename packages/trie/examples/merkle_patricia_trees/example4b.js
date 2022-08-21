// Example 4b - Generating a Transaction Hash from Transaction Data

const rlp = require('@ethereumjs/rlp')
const { keccak256 } = require('ethereum-cryptography/keccak')
const INFURA_ENDPOINT = require('./infura_endpoint')
const request = require('request')

// Helper to lookup an individual transaction
function recomputeTransactionHash(transactionHash) {
  request(
    INFURA_ENDPOINT,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: `{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params": ["${transactionHash}"],"id":1}`,
    },
    (_, response) => {
      const transaction = JSON.parse(response.body).result
      const transactionData = [
        transaction.nonce,
        transaction.gasPrice,
        transaction.gas,
        transaction.to,
        transaction.value,
        transaction.input,
        transaction.v,
        transaction.r,
        transaction.s,
      ]
      console.log('Transaction data: ', transactionData)
      console.log('Transaction hash: ', Buffer.from(keccak256(rlp.encode(transactionData))))
    }
  )
}

recomputeTransactionHash('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
