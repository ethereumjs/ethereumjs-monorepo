// Example 4a - Retrieving a Transaction from the Ethereum Blockchain

const https = require('https')

const INFURA_ENDPOINT = require('./infura_endpoint.js')

// Looking up an individual transaction
function lookupTransaction(transactionHash) {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [transactionHash],
    id: 1,
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  const req = https.request(INFURA_ENDPOINT, options, (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', () => {
      console.log('Transaction:', JSON.parse(responseData))
    })
  })

  req.write(data)
  req.end()
}

lookupTransaction('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
