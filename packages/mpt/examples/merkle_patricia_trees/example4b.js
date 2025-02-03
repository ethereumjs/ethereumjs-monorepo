// Example 4b - Generating a Transaction Hash from Transaction Data

const rlp = require('@ethereumjs/rlp')
const { bytesToHex } = require('@ethereumjs/util')
const { keccak256 } = require('ethereum-cryptography/keccak')
const https = require('https')

const INFURA_ENDPOINT = require('./infura_endpoint.js')

function recomputeTransactionHash(transactionHash) {
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
      const transaction = JSON.parse(responseData).result
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
      console.log('Transaction hash: ', bytesToHex(keccak256(rlp.encode(transactionData))))
    })
  })

  req.write(data)
  req.end()
}

recomputeTransactionHash('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
