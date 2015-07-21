//This will demonstrate running code contained within a transaction.
//First import the necessary libraries and initailize some varibles.
var async = require('async')
var VM = require('../index.js')
var Account = require('ethereumjs-account')
var Transaction = require('ethereumjs-tx')
var Trie = require('merkle-patricia-tree')
var rlp = require('rlp')
var utils = require('ethereumjs-util')

//creating a trie that just resides in memory
var stateTrie = new Trie()

//create a new VM instance
var vm = new VM(stateTrie)


//the private/public key pare. used to sign the transactions and generate the addresses
var secretKey = '3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511'
var publicKey = '0406cc661590d48ee972944b35ad13ff03c7876eae3fd191e8a2f77311b0a3c6613407b5005e63d7d8d76b89d5f900cde691497688bb281e07a5052ff61edebdc0'

//This transaction contains the initializtion code for the name register
//NOTE: all strings are interpeted as hex
var rawTx = {
  nonce: '00',
  gasPrice: '09184e72a000',
  gasLimit: '90710',
  data: '7f4e616d65526567000000000000000000000000000000000000000000000000003055307f4e616d6552656700000000000000000000000000000000000000000000000000557f436f6e666967000000000000000000000000000000000000000000000000000073661005d2720d855f1d9976f88bb10c1a3398c77f5573661005d2720d855f1d9976f88bb10c1a3398c77f7f436f6e6669670000000000000000000000000000000000000000000000000000553360455560df806100c56000396000f3007f726567697374657200000000000000000000000000000000000000000000000060003514156053576020355415603257005b335415603e5760003354555b6020353360006000a233602035556020353355005b60007f756e72656769737465720000000000000000000000000000000000000000000060003514156082575033545b1560995733335460006000a2600033545560003355005b60007f6b696c6c00000000000000000000000000000000000000000000000000000000600035141560cb575060455433145b1560d25733ff5b6000355460005260206000f3'
}

//This transaction should register the sending address as "null_radix"
var rawTx2 = {
  nonce: '01',
  gasPrice: '09184e72a000',
  gasLimit: '20710',
  to: '692a70d2e424a56d2c6c27aa97d1a86395877b3a',
  data: '72656769737465720000000000000000000000000000000000000000000000006e756c6c5f726164697800000000000000000000000000000000000000000000'
}

//sets up the initial state and runs the callback when complete
function setup(cb) {
  //the address we are sending from
  var address = utils.pubToAddress(new Buffer(publicKey, 'hex'))

  //create a new account
  var account = new Account()

  //give the account some wei.
  //This needs to be a `Buffer` or a string. all strings need to be in hex.
  account.balance = 'f00000000000000001'

  //store in the trie
  stateTrie.put(address, account.serialize(), cb)
}

//runs a transaction through the vm
function runTx(raw, cb) {
  //create a new transaction out of the json
  var tx = new Transaction(raw)

  tx.sign(new Buffer(secretKey, 'hex'))

  //run the tx
  vm.runTx({tx: tx}, function(err, results) {
    var createdAddress = results.createdAddress
    //log some results
    console.log('gas used: ' + results.gasUsed.toString())
    if (createdAddress)
      console.log('address created: ' + createdAddress.toString('hex'))

    cb(err)
  })
}

//we will use this later
var storageRoot

// Now lets look at what we created.The transaction should have created a new account
// for the contranct in the trie.Lets test to see
// if it did.
function checkResults(cb) {
  var createdAddress = new Buffer('692a70d2e424a56d2c6c27aa97d1a86395877b3a', 'hex')

  //fetch the new account from the trie.
  stateTrie.get(createdAddress, function(err, val) {

    var account = new Account(val)

    //we will use this later! :)
    storageRoot = account.stateRoot

    console.log('------results------')
    console.log('nonce: ' + account.nonce.toString('hex'))
    console.log('blance in wei: ' + account.balance.toString('hex'))
    console.log('stateRoot: ' + storageRoot.toString('hex'))
    console.log('codeHash:' + account.codeHash.toString('hex'))
    console.log('-------------------')
    cb(err)
  })
}

// So if everything went right we should have  "null_radix" stored at
// "0x9bdf9e2cc4dfa83de3c35da792cdf9b9e9fcfabd". To see this we need to print
// out the name register's storage trie.

//reads and prints the storage of a contract
function readStorage(cb) {
  //we need to create a copy of the state root
  var storageTrie = stateTrie.copy()

  //Since we are using a copy we won't change the root of `stateTrie`
  storageTrie.root = storageRoot

  var stream = storageTrie.createReadStream()

  console.log('------Storage------')

  //prints all of the keys and values in the storage trie
  stream.on('data', function(data) {
    console.log('key: ' + data.key.toString('hex'))
    //remove the 'hex' if you want to see the ascii values
    console.log('Value: ' + rlp.decode(data.value).toString())
  })

  stream.on('end', cb)
}

// Lastly lets create a trace of the EMV code. This can be very usefully for
// debugging. The VM provides a simple hook for each step the VM takes while 
// running EVM code. The VM will not contuine execution untill `done` is called
// This can bee used to pause the VM
vm.onStep = function(info, done) {
  //prints the program counter, the current opcode and the amount of gas left
  console.log('[vm] ' + info.pc + ' Opcode: ' + info.opcode + ' Gas: ' + info.gasLeft.toString())

  //prints out the current stack
  info.stack.forEach(function(item) {
    console.log('[vm]    ' + item.toString('hex'))
  })
  //important! call `done` when your done messing around
  done()
}

//and finally
//run everything
async.series([
  setup,
  async.apply(runTx, rawTx),
  async.apply(runTx, rawTx2),
  checkResults,
  readStorage
])

// Now when you run you should see a complete trace. `onStep` provodes an
// object that contians all the information on the current state of the `VM`.
