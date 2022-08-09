// Example 4b - Generating a Transaction Hash from Transaction Data

const rlp = require('@ethereumjs/rlp')
const { keccak256 } = require('ethereum-cryptography/keccak')

const INFURIA_ENDPOINT = require('./infura_endpoint')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(INFURIA_ENDPOINT))

async function createTransactionHash(transactionHash) {
  let transaction = await web3.eth.getTransaction(transactionHash)
  transactionData = [
    web3.utils.toHex(transaction.nonce),
    web3.utils.toHex(transaction.gasPrice),
    web3.utils.toHex(transaction.gas),
    transaction.to,
    web3.utils.toHex(transaction.value),
    transaction.input,
    transaction.v,
    transaction.r,
    transaction.s,
  ]
  console.log('Transaction data: ', transactionData)
  console.log('Transaction hash: ', keccak256(rlp.encode(transactionData)))
}
createTransactionHash('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
