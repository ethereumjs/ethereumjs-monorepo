const Block = require('./')
const Transaction = require('ethereumjs-tx')
const ethUtil = require('ethereumjs-util')

module.exports = rpcToBlock


function rpcToBlock(blockParams, uncles){
  // console.log(blockParams)
  var block = new Block({
    transactions: [],
    uncleHeaders: [],
  })
  var blockHeader = block.header
  blockHeader.parentHash = blockParams.parentHash
  blockHeader.uncleHash = blockParams.sha3Uncles
  blockHeader.coinbase = blockParams.miner
  blockHeader.stateRoot = blockParams.stateRoot
  blockHeader.transactionsTrie = blockParams.transactionsRoot
  blockHeader.receiptTrie = blockParams.receiptRoot || blockParams.receiptsRoot || ethUtil.SHA3_NULL
  blockHeader.bloom = blockParams.logsBloom
  blockHeader.difficulty = blockParams.difficulty
  blockHeader.number = blockParams.number
  blockHeader.gasLimit = blockParams.gasLimit
  blockHeader.gasUsed = blockParams.gasUsed
  blockHeader.timestamp = blockParams.timestamp
  blockHeader.extraData = blockParams.extraData
  blockHeader.mixHash = blockParams.mixHash
  blockHeader.nonce = blockParams.nonce

  // override hash incase something was missing
  blockHeader.hash = function () {
    return ethUtil.toBuffer(blockParams.hash)
  }

  block.transactions = (blockParams.transactions || []).map(function(_txParams){
    var txParams = Object.assign({}, _txParams)
    normalizeTxParams(txParams)
    // override from address
    var fromAddress = ethUtil.toBuffer(txParams.from)
    delete txParams.from
    // issue is that v is provided as a number,
    // complains about byte length
    delete txParams.r
    delete txParams.s
    delete txParams.v
    var tx = new Transaction(txParams)
    tx.getSenderAddress = function(){ return fromAddress }
    // override hash
    tx.hash = function(){ return ethUtil.toBuffer(txParams.hash) }
    return tx
  })
  block.uncleHeaders = (uncles || []).map(function(uncleParams){
    return rpcToBlock(uncleParams).header
  })

  return block
}

function normalizeTxParams(txParams){
  // hot fix for https://github.com/ethereumjs/ethereumjs-util/issues/40
  txParams.gasLimit = (txParams.gasLimit === undefined) ? txParams.gas : txParams.gasLimit
  txParams.data = (txParams.data === undefined)? txParams.input : txParams.data
  // strict byte length checking
  txParams.to = txParams.to ? ethUtil.setLengthLeft(ethUtil.toBuffer(txParams.to), 20) : null
}