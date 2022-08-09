// Example 4a - Retrieving a Transaction from the Ethereum Blockchain

const rlp = require('@ethereumjs/rlp')
const { keccak256 } = require('ethereum-cryptography/keccak')

const INFURIA_ENDPOINT = require('./infura_endpoint')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(INFURIA_ENDPOINT))

// Looking up an individual transaction
async function checkTransaction(transactionHash) {
  let transaction = await web3.eth.getTransaction(transactionHash)
  console.log(transaction)
}

checkTransaction('0x2f81c59fb4f0c3146483e72c1315833af79b6ea9323b647101645dc7ebe04074')
