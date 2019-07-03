const Buffer = require('safe-buffer').Buffer
const async = require('async')
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN
const exceptions = require('./exceptions.js')
const { StorageReader } = require('./state')
const Memory = require('./evm/memory')
const Stack = require('./evm/stack')

const ERROR = exceptions.ERROR
const net = require('net')
const msg_pb = require('./proto/msg_pb.js')

const QUERY_NOT_SET  = 0
const GETACCOUNT     = 1
const GETSTORAGEDATA = 2
const GETCODE        = 3
const GETBLOCKHASH   = 4
const CALLRESULT     = 5

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
  var results = {}
  txValue = new BN(txValue)
  var client = new net.Socket()
  const kevmHost = '127.0.0.1'
  const kevmPort = 8080
  var logList = []

  async.series([checkpointState, runClient], commitState)

  function checkpointState (_callback) {
    stateManager.checkpoint(_callback)
  }

  function runClient (_callback) {
    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function (data) {
      var query = msg_pb.VMQuery.deserializeBinary(data.slice(4))

      switch (query.getQueryCase()) {
        case GETACCOUNT: {
          console.log('GETACCOUNT')
          computeGetAccount(query)
          break
        }
        case GETSTORAGEDATA: {
          console.log('GETSTORAGEDATA')
          computeGetStorageData(query)
          break
        }
        case GETCODE: {
          console.log('GETCODE')
          computeGetCode(query)
          break
        }
        case GETBLOCKHASH: {
          // TODO
          console.log('GETBLOCKHASH')
          break
        }
        case CALLRESULT: {
          console.log('CALLRESULT')
          client.destroy()
          computeCallResult(query, _callback)
          break
        }
        case QUERY_NOT_SET: {
          console.log('QUERYNOTSET')
          break
        }
      }
    })

    // Add a 'close' event handler for the client socket
    client.on('close', function () {
      console.log('Connection closed')
    })

    client.connect(kevmPort, kevmHost, function () {
      console.log('CONNECTED TO: ' + kevmHost + ':' + kevmPort)
      var hello = createHello()
      client.write(hello)
      var callCtx = createCallContext()
      client.write(callCtx)
    })
  }

  function computeCallResult (query, _callback) {
    var gasProvided = new BN(block.transactions[0].gas)

    var callResultObject = query.getCallresult()
    var returnData = callResultObject.getReturndata()
    returnData = returnData.length ? ethUtil.bufferToHex(Buffer.from(returnData)) : returnData
    var returnCode = callResultObject.getReturncode()
    var gasRemaining = new BN(callResultObject.getGasremaining())
    var gasRefund = new BN(callResultObject.getGasrefund())
    var error = callResultObject.getError()
    var modifiedAccounts = callResultObject.getModifiedaccountsList()
    var logEntries = callResultObject.getLogsList()
    var logs = fromLogEntries(logEntries)
    if (returnCode.length === 20) {
      createdAddress = ethUtil.bufferToHex(Buffer.from(returnCode))
    } else if (returnCode.length === 21) {
      createdAddress = ethUtil.bufferToHex(Buffer.from(returnCode).slice(1))
    }
    updateAccounts(modifiedAccounts, () => {
      var runState = {
        blockchain: self.blockchain,
        stateManager: stateManager,
        storageReader: storageReader,
        returnValue: returnData,
        stopped: false,
        vmError: false,
        programCounter: opts.pc | 0,
        opCode: undefined,
        opName: undefined,
        gasLeft: gasRemaining,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        memory: new Memory(),
        memoryWordCount: new BN(0),
        stack: new Stack(),
        lastReturned: [],
        logs: logs,
        validJumps: [],
        gasRefund: gasRefund,
        highestMemCost: new BN(0),
        depth: depth,
        selfdestruct: selfdestruct,
        block: block,
        callValue: opts.value || new BN(0),
        address: opts.address || ethUtil.zeros(32),
        caller: caller,
        origin: opts.origin || opts.caller || ethUtil.zeros(32),
        callData: opts.data || Buffer.from([0]),
        code: code,
        static: opts.static || false
      }

      vmResults = {
        runState: runState,
        selfdestruct: runState.selfdestruct,
        gasRefund: runState.gasRefund,
        exception: error ? 0 : 1,
        exceptionError: error,
        logs: runState.logs,
        gas: runState.gasLeft,
        'return': runState.returnValue ? runState.returnValue : Buffer.alloc(0)
      }

      results = {
        gasUsed: gasProvided.sub(gasRemaining),
        createdAddress: createdAddress,
        vm: vmResults
      }
      _callback()
    })
  }

  function updateAccounts (accountList, _callback) {
    async.series(
      accountList.map(account => function (_itemCallback) {
        updateAccount(account, _itemCallback)
      })
      , _callback
    )
  }

  function commitState () {
    stateManager.commit(function () {
      console.log('commit done')
      cb(null, results)
    })
  }

  function updateAccount (pbAccount, _done) {
    var address = Buffer.from(pbAccount.getAddress())
    var nonce = Buffer.from(pbAccount.getNonce())
    var newBalance = Buffer.from(pbAccount.getBalance())
    var code = Buffer.from(pbAccount.getCode())
    var storageUpdateList = pbAccount.getStorageupdatesList()

    async.series(
      [function (_callback) {
        stateManager.getAccount(address, function (err, stateAccount) {
          if (err) {
            console.log(err)
          }
          stateAccount.nonce = Buffer.from(nonce)
          stateAccount.balance = Buffer.from(newBalance)
          stateManager.putAccount(address, stateAccount, _callback)
        })
      },
        function (_callback) {
          if (code.length !== 0) {
            stateManager.putContractCode(address, code, _callback)
          } else {
            _callback()
          }
        },
        function (_callback) {
          async.series(
            storageUpdateList.map(item => putContractHelper(address, item)),
            _callback
          )
        }], _done)
  }

  function putContractHelper (address, item) {
    return function (_callback) {
      var key = Buffer.from(item.getOffset())
      var value = Buffer.from(item.getData())
      console.log('Setting contract (' + address.toString('hex') + '): ' + JSON.stringify(key) + ' (' + parseInt(value.toString('hex'), 16) + ')')
      stateManager.putContractStorage(address, key, value, _callback)
    }
  }

  function fromLogEntries (logEntries) {
    logList = []
    for (var i = 0; i < logEntries.length; i++) {
      var logEntry = logEntries[i]
      var log = []
      log.length = 3
      log[0] = Buffer.from(logEntry.getAddress())
      log[1] = []
      logEntry.getTopicsList().forEach(element => log[1].push(Buffer.from(element)))
      log[2] = Buffer.from(logEntry.getData())
      logList.push(log)
    }
    return logList
  }

  function computeGetCode (query) {
    var getCodeObject = query.getGetcode()
    var address = getCodeObject.getAddress()
    stateManager.getContractCode(Buffer.from(address), function (err, contractCode, compiled) {
      if (err) {
        console.log(err)
      }
      isCompiled = compiled
      code = contractCode
      var message = createCode(code)
      client.write(message)
    })
  }

  function computeGetStorageData (query) {
    var getStorageDataObject = query.getGetstoragedata()
    var address = getStorageDataObject.getAddress()
    var offset = getStorageDataObject.getOffset()

    storageReader.getContractStorage(Buffer.from(address), Buffer.from(offset), function (err, value) {
      if (err) {
        console.log(err)
      }
      var storageData = createStorageData(value.current)
      client.write(storageData)
    })
  }

  function computeGetAccount (query) {
    var getAccountObject = query.getGetaccount()
    var address = getAccountObject.getAddress()
    stateManager.getAccount(Buffer.from(address), function (err, fromAccount) {
      var account = createAccount(fromAccount)
      client.write(account)
      if (err) {
        console.log(err)
      }
    })
  }

  function createCode (code) {
    var codeObject = new msg_pb.Code()
    codeObject.setCode(code)
    var bytes = codeObject.serializeBinary()
    var buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createStorageData (data) {
    var storageData = new msg_pb.StorageData()
    storageData.setData(new Uint8Array(data))
    var bytes = storageData.serializeBinary()
    var buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createAccount (fromAccount) {
    var account = new msg_pb.Account()
    if (!fromAccount.isEmpty()) {
      account.setNonce(fromAccount.nonce)
      account.setBalance(fromAccount.balance)
    } else {
      console.log('Account is empty!')
      account.setNonce(new Uint8Array(1))
      account.setBalance(new Uint8Array(1))
    }
    var isCodeEmpty = fromAccount.codeHash.compare(ethUtil.KECCAK256_NULL) === 0
    account.setCodeempty(isCodeEmpty)
    var bytes = account.serializeBinary()
    var buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createHello () {
    var hello = new msg_pb.Hello()
    hello.setVersion('2.0')
    var bytes = hello.serializeBinary()
    var buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createCallContext () {
    var callCtx = new msg_pb.CallContext()
    var blockHeader = createBlockHeader()
    var ethereumConfig = createEthereumConfig()
    callCtx.setCalleraddr(caller)
    if (typeof toAddress !== 'undefined') {
      callCtx.setRecipientaddr(toAddress)
    }
    callCtx.setInputdata(txData)
    callCtx.setCallvalue(new Uint8Array(txValue.words))
    callCtx.setGasprice(gasPrice)
    callCtx.setGasprovided(block.transactions[0].gas)
    callCtx.setBlockheader(blockHeader)
    callCtx.setEthereumconfig(ethereumConfig)
    var bytes = callCtx.serializeBinary()
    var buffer = createBufferFromBytes(bytes)
    return buffer
  }

  function createBlockHeader () {
    var hexTimestamp = block.header.timestamp.toString('hex')
    var timestamp = parseInt(hexTimestamp, 16)

    var blockHeader = new msg_pb.BlockHeader()
    blockHeader.setBeneficiary(block.header.coinbase)
    blockHeader.setDifficulty(block.header.difficulty)
    blockHeader.setNumber(block.header.number)
    blockHeader.setGaslimit(block.header.gasLimit)
    blockHeader.setUnixtimestamp(timestamp)
    return blockHeader
  }

  function createEthereumConfig () {
    var ethereumConfig = new msg_pb.EthereumConfig()
    ethereumConfig.setMaxcodesize(new Uint8Array([96, 0]))
    ethereumConfig.setAccountstartnonce(new Uint8Array([0]))
    ethereumConfig.setFrontierblocknumber(new Uint8Array([0]))
    ethereumConfig.setHomesteadblocknumber(new Uint8Array([0]))
    ethereumConfig.setEip150blocknumber(new Uint8Array([0]))
    ethereumConfig.setEip160blocknumber(new Uint8Array([0]))
    ethereumConfig.setEip161blocknumber(new Uint8Array([0]))
    ethereumConfig.setByzantiumblocknumber(new Uint8Array([0]))
    var hardfork = stateManager._common._hardfork
    switch (hardfork) {
      case 'byzantium': {
        ethereumConfig.setConstantinopleblocknumber(new Uint8Array([127, 255, 255, 255]))
        ethereumConfig.setPetersburgblocknumber(new Uint8Array([127, 255, 255, 255]))
        break
      }
      case 'constantinople': {
        ethereumConfig.setConstantinopleblocknumber(new Uint8Array([0]))
        ethereumConfig.setPetersburgblocknumber(new Uint8Array([127, 255, 255, 255]))
        break
      }
      default : {
        ethereumConfig.setConstantinopleblocknumber(new Uint8Array([0]))
        ethereumConfig.setPetersburgblocknumber(new Uint8Array([0]))
      }
    }
    return ethereumConfig
  }

  function createBufferFromBytes (bytes) {
    var messageLength = new BN(bytes.length)
    var bufferLength = bytes.length + 4
    var result = new Uint8Array(bufferLength)
    var lengthInBytes = messageLength.toArrayLike(Uint8Array, 'be', 4)
    for (var i = 0; i < 4; i++) {
      result[i] = lengthInBytes[i]
    }
    for (i = 0; i < bytes.length; i++) {
      result[i + 4] = bytes[i]
    }
    return Buffer.from(result)
  }
}
