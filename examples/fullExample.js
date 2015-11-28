// This will demonstrate running code contained within a transaction.
// First import the necessary libraries and initailize some varibles.
var async = require('async')
var VM = require('../index.js')
var Account = require('ethereumjs-account')
var Transaction = require('ethereumjs-tx')
var Trie = require('merkle-patricia-tree')
var rlp = require('rlp')
var utils = require('ethereumjs-util')

// creating a trie that just resides in memory
var stateTrie = new Trie()

// create a new VM instance
var vm = new VM(stateTrie)

// the private/public key pair. used to sign the transactions and generate the addresses
var secretKey = '3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511'
var publicKey = '0406cc661590d48ee972944b35ad13ff03c7876eae3fd191e8a2f77311b0a3c6613407b5005e63d7d8d76b89d5f900cde691497688bb281e07a5052ff61edebdc0'
var createdAddress

// This transaction contains the initializtion code for the name register
// NOTE: all strings are interpeted as hex
var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x90710',
  data: '0x60606040526103dd806100126000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063454a2ab31461004f578063b9a2de3a14610091578063edd481bb146100d35761004d565b005b6100656004808035906020019091905050610189565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100a760048080359060200190919050506102d2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100e960048080359060200190919050506100ff565b6040518082815260200191505060405180910390f35b600060016000818150548092919060010191905055905080508143016000600050600083815260200190815260200160002060005060000160005081905550336000600050600083815260200190815260200160002060005060030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b919050565b60006000600060005060008481526020019081526020016000206000509050346012600a8360010160005054011811806101c95750438160000160005054115b1561022d573373ffffffffffffffffffffffffffffffffffffffff16600034604051809050600060405180830381858888f19350505050508060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691506102cc565b8060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660008260010160005054604051809050600060405180830381858888f1935050505050338160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055503481600101600050819055503391506102cc565b50919050565b600060006000600050600084815260200190815260200160002060005090508060000160005054431015156103d6578060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660008260010160005054604051809050600060405180830381858888f19350505050506000816001016000508190555060008160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000816000016000508190555060008160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5091905056'
}

// This transaction should register the sending address as "null_radix"

var bidSig = '0x454a2ab3'
var time = '0000000000000000000000000000000000000000000000000000000000000045'

var rawTx2 = {
  nonce: '0x01',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x20710',
  value: '0x10',
  to: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
  data: bidSig + time
}

// sets up the initial state and runs the callback when complete
function setup (cb) {
  // the address we are sending from
  var address = utils.pubToAddress(new Buffer(publicKey, 'hex'))

  // create a new account
  var account = new Account()

  // give the account some wei.
  // This needs to be a `Buffer` or a string. all strings need to be in hex.
  account.balance = '0xf00000000000000001'

  // store in the trie
  stateTrie.put(address, account.serialize(), cb)
}

// runs a transaction through the vm
function runTx (raw, cb) {
  // create a new transaction out of the json
  var tx = new Transaction(raw)

  // tx.from
  tx.sign(new Buffer(secretKey, 'hex'))

  console.log('----running tx-------')
  // run the tx
  vm.runTx({
    tx: tx
  }, function (err, results) {
    createdAddress = results.createdAddress
    // log some results
    console.log('gas used: ' + results.gasUsed.toString())
    console.log('returen: ' + results.vm.return.toString('hex'))
    if (createdAddress) {
      console.log('address created: ' + createdAddress.toString('hex'))
    }

    cb(err)
  })
}

// we will use this later
var storageRoot

// Now lets look at what we created.The transaction should have created a new account
// for the contranct in the trie.Lets test to see
// if it did.
function checkResults (cb) {
  // fetch the new account from the trie.
  stateTrie.get(createdAddress, function (err, val) {
    var account = new Account(val)

    // we will use this later! :)
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

// reads and prints the storage of a contract
function readStorage (cb) {
  // we need to create a copy of the state root
  var storageTrie = stateTrie.copy()

  // Since we are using a copy we won't change the root of `stateTrie`
  storageTrie.root = storageRoot

  var stream = storageTrie.createReadStream()

  console.log('------Storage------')

  // prints all of the keys and values in the storage trie
  stream.on('data', function (data) {
    console.log('key: ' + data.key.toString('hex'))
    // remove the 'hex' if you want to see the ascii values
    console.log('Value: ' + rlp.decode(data.value).toString())
  })

  stream.on('end', cb)
}

// run everything
async.series([
  setup,
  async.apply(runTx, rawTx),
  async.apply(runTx, rawTx2),
  checkResults,
  readStorage
])
// Now when you run you should see a complete trace. `onStep` provodes an
// object that contians all the information on the current state of the `VM`.
