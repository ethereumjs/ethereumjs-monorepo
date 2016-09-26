/*
 * Example - Run code contain within transactions
 *
 *
 * Execute it with `node index.js`
 */

var async = require('async')
var VM = require('./../../index.js')
var Account = require('ethereumjs-account')
var Transaction = require('ethereumjs-tx')
var Trie = require('merkle-patricia-tree')
var rlp = require('rlp')
var utils = require('ethereumjs-util')

// creating a trie that just resides in memory
var stateTrie = new Trie()

// create a new VM instance
var vm = new VM({state: stateTrie})

// import the key pair
//   pre-generated (saves time)
//   used to sign transactions and generate addresses
var keyPair = require('./key-pair')

var createdAddress

// Transaction to initalize the name register, in this case
// it will register the sending address as 'null_radix'
// Notes:
//   - In a transaction, all strings as interpeted as hex
//   - A transaction has the fiels:
//     - nonce
//     - gasPrice
//     - gasLimit
//     - data
var rawTx1 = require('./raw-tx1')

// 2nd Transaction
var rawTx2 = require('./raw-tx2')

// sets up the initial state and runs the callback when complete
function setup (cb) {
  // the address we are sending from
  var publicKeyBuf = new Buffer(keyPair.publicKey, 'hex')
  var address = utils.pubToAddress(publicKeyBuf, true)

  // create a new account
  var account = new Account()

  // give the account some wei.
  //    Note: this needs to be a `Buffer` or a string. All
  //      strings need to be in hex.
  account.balance = '0xf00000000000000001'

  // store in the trie
  stateTrie.put(address, account.serialize(), cb)
}

// runs a transaction through the vm
function runTx (raw, cb) {
  // create a new transaction out of the json
  var tx = new Transaction(raw)

  // tx.from
  tx.sign(new Buffer(keyPair.secretKey, 'hex'))

  console.log('----running tx-------')
  // run the tx \o/
  vm.runTx({
    tx: tx
  }, function (err, results) {
    createdAddress = results.createdAddress
    // log some results
    console.log('gas used: ' + results.gasUsed.toString())
    console.log('returned: ' + results.vm.return.toString('hex'))
    if (createdAddress) {
      console.log('address created: ' +
          createdAddress.toString('hex'))
    }

    cb(err)
  })
}

var storageRoot // used later

// Now lets look at what we created. The transaction
// should have created a new account for the contranct
// in the trie.Lets test to see if it did.
function checkResults (cb) {
  // fetch the new account from the trie.
  stateTrie.get(createdAddress, function (err, val) {
    var account = new Account(val)

    storageRoot = account.stateRoot // used later! :)
    console.log('------results------')
    console.log('nonce: ' + account.nonce.toString('hex'))
    console.log('balance in wei: ' + account.balance.toString('hex'))
    console.log('stateRoot: ' + storageRoot.toString('hex'))
    console.log('codeHash:' + account.codeHash.toString('hex'))
    console.log('-------------------')
    cb(err)
  })
}

// So if everything went right we should have "null_radix"
// stored at "0x9bdf9e2cc4dfa83de3c35da792cdf9b9e9fcfabd". To
// see this we need to print out the name register's
// storage trie.

// reads and prints the storage of a contract
function readStorage (cb) {
  // we need to create a copy of the state root
  var storageTrie = stateTrie.copy()

  // Since we are using a copy we won't change the
  // root of `stateTrie`
  storageTrie.root = storageRoot

  var stream = storageTrie.createReadStream()

  console.log('------Storage------')

  // prints all of the keys and values in the storage trie
  stream.on('data', function (data) {
    // remove the 'hex' if you want to see the ascii values
    console.log('key: ' + data.key.toString('hex'))
    console.log('Value: ' + rlp.decode(data.value).toString())
  })

  stream.on('end', cb)
}

// run everything
async.series([
  setup,
  async.apply(runTx, rawTx1),
  async.apply(runTx, rawTx2),
  checkResults,
  readStorage
])

// Now when you run you should see a complete trace.
// `onStep` provides an object that contains all the
// information on the current state of the `VM`.
