const Buffer = require('safe-buffer').Buffer
const async = require('async')
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN
const exceptions = require('./exceptions.js')
const { StorageReader } = require('./state')

const ERROR = exceptions.ERROR
const net = require('net')
const msg_pb =require('./proto/msg_pb.js')

/**
 * runs a CALL operation
 * @method vm.runCall
 * @private
 * @param opts
 * @param opts.block {Block}
 * @param opts.caller {Buffer}
 * @param opts.code {Buffer} this is for CALLCODE where the code to load is different than the code from the to account.
 * @param opts.data {Buffer}
 * @param opts.gasLimit {Buffer | BN.js }
 * @param opts.gasPrice {Buffer}
 * @param opts.origin {Buffer} []
 * @param opts.to {Buffer}
 * @param opts.value {Buffer}
 * @param {Function} cb the callback
 */
module.exports = function (opts, cb) {
  var self = this
  var stateManager = self.stateManager

  var vmResults = {}
  var toAccount
  var toAddress = opts.to
  var createdAddress
  var txValue = opts.value || Buffer.from([0])
  var caller = opts.caller
  var account
  var block = opts.block
  var code = opts.code
  var txData = opts.data
  var gasLimit = opts.gasLimit || new BN(0xffffff)
  gasLimit = new BN(opts.gasLimit) // make sure is a BN
  var gasPrice = opts.gasPrice
  var gasUsed = new BN(0)
  var origin = opts.origin
  var isCompiled = opts.compiled
  var depth = opts.depth
  // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
  var selfdestruct = opts.selfdestruct || opts.suicides
  var delegatecall = opts.delegatecall || false
  var isStatic = opts.static || false
  var salt = opts.salt || null
  var storageReader = opts.storageReader || new StorageReader(stateManager)

  txValue = new BN(txValue)

  const kevmHost = '127.0.0.1'
  const kevmPort = 8080

  var client = new net.Socket()

  client.connect(kevmPort, kevmHost, function() {

    console.log('CONNECTED TO: ' + kevmHost + ':' + kevmPort)
    hello = createHello()
    console.log(hello)
    client.write(hello)
    callCtx = createCallContext()
    console.log(callCtx)
    client.write(callCtx)
  });

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
  client.on('data', function(data) {

    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();

  });

  // Add a 'close' event handler for the client socket
  client.on('close', function() {
      console.log('Connection closed');
  })

  function createHello(){
    hello = new msg_pb.Hello()
    hello.setVersion("2.0")
    bytes = hello.serializeBinary()
    buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createCallContext(){
    callCtx = new msg_pb.CallContext()
    ethereumConfig = createEthereumConfig()
    callCtx.setEthereumconfig(ethereumConfig)
    // callCtx.setCalleraddr(caller)
    // callCtx.setInputdata(txData)
    // callCtx.setCallvalue(txValue)
    // callCtx.setGasprice(gasPrice)
    // callCtx.setGasprovided()
    bytes = callCtx.serializeBinary()
    buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createEthereumConfig(){
    ethereumConfig = new msg_pb.EthereumConfig()
    maxCodeSize = new Uint8Array([60,00])
    ethereumConfig.setMaxcodesize(maxCodeSize)
    console.log(ethereumConfig.getMaxcodesize_asU8())
    ethereumConfig.setAccountstartnonce(new Uint8Array([00,00]))
    return ethereumConfig
  }

  function createBufferFromBytes(bytes){
    length = bytes.length
    result = new Uint8Array(length + 4)
    for (i = length-1; i>=0; i--){
      result[i+4] = bytes[i]
    }
    i = 3;
    while (length > 255) {
        result[i] = length % 256
        length -= length % 256
        i--
    }
    result[i] = length % 256
    return new Buffer(result)
  }

}
