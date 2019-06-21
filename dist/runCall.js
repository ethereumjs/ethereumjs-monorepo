'use strict';

var Buffer = require('safe-buffer').Buffer;
var async = require('async');
var ethUtil = require('ethereumjs-util');
var BN = ethUtil.BN;
var exceptions = require('./exceptions.js');

var _require = require('./state'),
    StorageReader = _require.StorageReader;

var ERROR = exceptions.ERROR;
var net = require('net');
var msg_pb = require('./proto/msg_pb.js');

var QUERY_NOT_SET = 0;
var GETACCOUNT = 1;
var GETSTORAGEDATA = 2;
var GETCODE = 3;
var GETBLOCKHASH = 4;
var CALLRESULT = 5;

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
  var self = this;
  var stateManager = self.stateManager;

  var vmResults = {};
  var toAccount;
  var toAddress = opts.to;
  var createdAddress;
  var txValue = opts.value || Buffer.from([0]);
  var caller = opts.caller;
  var account;
  var block = opts.block;
  var code = opts.code;
  var txData = opts.data;
  var gasLimit = opts.gasLimit || new BN(0xffffff);
  gasLimit = new BN(opts.gasLimit); // make sure is a BN
  var gasPrice = opts.gasPrice;
  var gasUsed = new BN(0);
  var origin = opts.origin;
  var isCompiled = opts.compiled;
  var depth = opts.depth;
  // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
  var selfdestruct = opts.selfdestruct || opts.suicides;
  var delegatecall = opts.delegatecall || false;
  var isStatic = opts.static || false;
  var salt = opts.salt || null;
  var storageReader = opts.storageReader || new StorageReader(stateManager);

  txValue = new BN(txValue);

  var kevmHost = '127.0.0.1';
  var kevmPort = 8080;

  var client = new net.Socket();

  client.connect(kevmPort, kevmHost, function () {
    console.log('CONNECTED TO: ' + kevmHost + ':' + kevmPort);
    var hello = createHello();
    client.write(hello);
    var callCtx = createCallContext();
    client.write(callCtx);
  });

  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  client.on('data', function (data) {
    try {
      var query = msg_pb.VMQuery.deserializeBinary(data);
      switch (query.getQueryCase()) {
        case GETACCOUNT:
          {
            console.log('GETACCOUNT', data);
            computeGetAccount(query);
            break;
          }
        case GETSTORAGEDATA:
          {
            console.log('GETSTORAGEDATA', data);
            computeGetStorageData(query);
            break;
          }
        case GETCODE:
          {
            console.log('GETCODE', data);
            // TODO
            break;
          }
        case GETBLOCKHASH:
          {
            console.log('GETBLOCKHASH', data);
            // TODO
            break;
          }
      }
    } catch (err) {
      var mdata = new Uint8Array(data.length - 4);
      for (var i = 4; i < data.length; i++) {
        mdata[i - 4] = data[i];
      }
      try {
        query = msg_pb.VMQuery.deserializeBinary(mdata);
        if (CALLRESULT === query.getQueryCase()) {
          console.log('CALLRESULT', query);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  // Add a 'close' event handler for the client socket
  client.on('close', function () {
    console.log('Connection closed');
  });

  function computeGetStorageData(query) {
    var getStorageDataObject = query.getGetstoragedata();
    var address = getStorageDataObject.getAddress();
    var offset = getStorageDataObject.getOffset();
    console.log('addressHex', Buffer(address).toString('hex'));
    console.log('address', address);
    console.log('offset', offset);

    storageReader.getContractStorage(Buffer(address), Buffer(offset), function (err, value) {
      if (err) {
        console.log(err);
      }
      var storageData = createStorageData(value);
      client.write(storageData);
    });
  }

  function computeGetAccount(query) {
    var getAccountObject = query.getGetaccount();
    var address = getAccountObject.getAddress();
    console.log('addressHex', Buffer(address).toString('hex'));
    stateManager.getAccount(new Buffer(address), function (err, fromAccount) {
      account = createAccount(fromAccount);
      client.write(account);
      if (err) {
        console.log(err);
      }
    });
  }

  function createStorageData(data) {
    var storageData = new msg_pb.StorageData();
    storageData.setData(new Uint8Array(data));
    console.log(storageData);
    var bytes = storageData.serializeBinary();
    var buffer = createBufferFromBytes(bytes);
    return buffer;
  }

  function createAccount(fromAccount) {
    account = new msg_pb.Account();
    if (!fromAccount.isEmpty()) {
      account.setNonce(fromAccount.nonce);
      account.setBalance(fromAccount.balance);
    } else {
      console.log('Account is empty!');
      account.setNonce(new Uint8Array(1));
      account.setBalance(new Uint8Array(1));
    }
    var isCodeEmpty = fromAccount.codeHash.compare(ethUtil.KECCAK256_NULL) === 0;
    account.setCodeempty(isCodeEmpty);
    var bytes = account.serializeBinary();
    var buffer = createBufferFromBytes(bytes);
    return buffer;
  }

  function createHello() {
    var hello = new msg_pb.Hello();
    hello.setVersion('2.0');
    var bytes = hello.serializeBinary();
    var buffer = createBufferFromBytes(bytes);
    return buffer;
  }

  function createCallContext() {
    var callCtx = new msg_pb.CallContext();
    var blockHeader = createBlockHeader();
    var ethereumConfig = createEthereumConfig();
    callCtx.setCalleraddr(caller);
    if (typeof toAddress !== 'undefined') {
      callCtx.setRecipientaddr(toAddress);
    }
    callCtx.setInputdata(txData);
    callCtx.setCallvalue(new Uint8Array(txValue.words));
    callCtx.setGasprice(gasPrice);
    callCtx.setGasprovided(block.transactions[0].gas);
    callCtx.setBlockheader(blockHeader);
    callCtx.setEthereumconfig(ethereumConfig);
    var bytes = callCtx.serializeBinary();
    var buffer = createBufferFromBytes(bytes);
    return buffer;
  }

  function createBlockHeader() {
    var hexTimestamp = block.header.timestamp.toString('hex');
    var timestamp = parseInt(hexTimestamp, 16);

    var blockHeader = new msg_pb.BlockHeader();
    blockHeader.setBeneficiary(block.header.coinbase);
    blockHeader.setDifficulty(block.header.difficulty);
    blockHeader.setNumber(block.header.number);
    blockHeader.setGaslimit(block.header.gasLimit);
    blockHeader.setUnixtimestamp(timestamp);
    return blockHeader;
  }

  function createEthereumConfig() {
    var ethereumConfig = new msg_pb.EthereumConfig();
    ethereumConfig.setMaxcodesize(new Uint8Array([96, 0]));
    ethereumConfig.setAccountstartnonce(new Uint8Array([0]));
    ethereumConfig.setFrontierblocknumber(new Uint8Array([0]));
    ethereumConfig.setHomesteadblocknumber(new Uint8Array([0]));
    ethereumConfig.setEip150blocknumber(new Uint8Array([0]));
    ethereumConfig.setEip160blocknumber(new Uint8Array([0]));
    ethereumConfig.setEip161blocknumber(new Uint8Array([0]));
    ethereumConfig.setByzantiumblocknumber(new Uint8Array([0]));
    var hardfork = stateManager._common._hardfork;
    switch (hardfork) {
      case 'byzantium':
        {
          ethereumConfig.setConstantinopleblocknumber(new Uint8Array([127, 255, 255, 255]));
          ethereumConfig.setPetersburgblocknumber(new Uint8Array([127, 255, 255, 255]));
          break;
        }
      case 'constantinople':
        {
          ethereumConfig.setConstantinopleblocknumber(new Uint8Array([0]));
          ethereumConfig.setPetersburgblocknumber(new Uint8Array([127, 255, 255, 255]));
          break;
        }
      default:
        {
          ethereumConfig.setConstantinopleblocknumber(new Uint8Array([0]));
          ethereumConfig.setPetersburgblocknumber(new Uint8Array([0]));
        }
    }
    return ethereumConfig;
  }

  function createBufferFromBytes(bytes) {
    var messageLength = new BN(bytes.length);
    var bufferLength = bytes.length + 4;
    var result = new Uint8Array(bufferLength);
    var lengthInBytes = messageLength.toArrayLike(Uint8Array, 'be', 4);
    for (var i = 0; i < 4; i++) {
      result[i] = lengthInBytes[i];
    }
    for (i = 0; i < bytes.length; i++) {
      result[i + 4] = bytes[i];
    }
    return new Buffer(result);
  }
};