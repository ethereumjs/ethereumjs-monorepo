// Example 4a - Retrieving a Transaction from the Ethereum Blockchain

const INFURA_ENDPOINT = require('./infura_endpoint')
const request = require('request')

// Looking up an individual transaction
function lookupTransaction(transactionHash) {
  request(
    INFURA_ENDPOINT,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: `{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params": ["${transactionHash}"],"id":1}`,
    },
    (error, response) => console.log('Transaction: ', JSON.parse(response.body))
  )
}

lookupTransaction('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
