const tape = require('tape')
const createHookedVm = require('../lib/hooked')

tape('hooked-vm', function (test) {
  var contractAddressHex = '0x1234000000000000000000000000000000001234'
  var contractAddress = Buffer.from(contractAddressHex.slice(2), 'hex')
  var contractBalanceHex = '0xabcd00000000000000000000000000000000000000000000000000000000abcd'

  var contractCode = Buffer.from([
    0x30, // ADDRESS of contract being run
    0x31, // BALANCE of address on stack

    // return the last thing on the stack
    0x60, // PUSH1
    0x60, // (data1) <-- MSTORE offset                          top| [prev]
    0x90, // SWAP1                                              top| [prev, data1]
    0x81, // DUP2                                               top| [data1, prev, data1]
    0x52, // MSTORE (offset:data1, word:prev)                   top| [data1] -> offset:data1, word:prev
    0x60, // PUSH
    0x20, // (data2) <-- RETURN length                          top| [data2, data1]
    0x90, // SWAP1                                              top| [data1, data2]
    0xf3  // RETURN (offset:data1, length:data2)                top| [] -> offset:data1, length:data2
  ])

  var blockchainState = {
    [contractAddressHex]: {
      balance: contractBalanceHex,
      nonce: '0x00',
      code: '0x' + contractCode.toString('hex'),
      storage: {}
    }
  }

  var vm = createHookedVm({}, hooksForBlockchainState(blockchainState))

  // vm.on('step', function(stepData){
  //   console.log(`========================================================`)
  //   console.log(`stack:`,stepData.stack)
  //   console.log(`${stepData.opcode.name} (${stepData.opcode.in})->(${stepData.opcode.out})`)
  // })

  vm.runCode({
    code: contractCode,
    address: contractAddress,
    gasLimit: Buffer.from('ffffffffff')
  }, function (err, results) {
    // console.log(arguments)

    test.ifError(err, 'Should run code without error')
    test.ifError(results.exceptionError, 'Should run code without vm error')

    test.equal('0x' + results.return.toString('hex'), contractBalanceHex, 'Should return correct balance of contract')

    test.end()
  })
})

function hooksForBlockchainState (blockchainState) {
  return {
    fetchAccountBalance: function (addressHex, cb) {
      var value = blockchainState[addressHex].balance
        // console.log('fetchAccountBalance', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountNonce: function (addressHex, cb) {
      var value = blockchainState[addressHex].nonce
        // console.log('fetchAccountNonce', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountCode: function (addressHex, cb) {
      var value = blockchainState[addressHex].code
        // console.log('fetchAccountCode', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountStorage: function (addressHex, keyHex, cb) {
      var value = blockchainState[addressHex].storage[keyHex]
        // console.log('fetchAccountStorage', addressHex, keyHex, '->', value)
      cb(null, value)
    }
  }
}
