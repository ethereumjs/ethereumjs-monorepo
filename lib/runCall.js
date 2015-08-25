const async = require('async')
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN
const fees = require('ethereum-common')
const Account = require('ethereumjs-account')

/**
 * runs a CALL operation
 * @method runCall
 * @param opts
 * @param opts.account {Account}
 * @param opts.block {Block}
 * @param opts.caller {Buffer}
 * @param opts.code {Buffer} this is for CALLCODE where the code to load is different than the code from the to account.
 * @param opts.data {Buffer}
 * @param opts.gasLimit {Bignum}
 * @param opts.gasPrice {Bignum}
 * @param opts.origin {Buffer} []
 * @param opts.to {Buffer}
 * @param opts.value {Bignum}
 */
module.exports = function(opts, cb) {
  var self = this
  var compiled = false //is the code compiled or not?
  var vmResults = {}
  var toAccount
  var data
  var createdAddress
  var gasUsed = new BN(0)

  //set default values
  if (!opts.value)
    opts.value = new BN(0)

  opts.account.balance = new Buffer((new BN(opts.account.balance).sub(opts.value)).toArray())
 
  //save caller, then checkpoint since the value transfered is irrivisible
  self.cache.put(opts.caller, opts.account)

  //get receiver's account
  if (!opts.to) {
    //generate a new contract if no `to`
    opts.code = opts.data
    createdAddress = opts.to = ethUtil.generateAddress(opts.caller, opts.account.nonce)
    toAccount = new Account()
  } else {
    //else load the to account
    data = opts.data
    toAccount = self.cache.get(opts.to)
  }

  //add the amount sent to the `to` account
  toAccount.balance = new Buffer(new BN(toAccount.balance)
    .add(opts.value)
    .toArray())

  function loadCode(cb2) {
    //loads the contract's code if the account is a contract
    if (!opts.code && toAccount.isContract(opts.to)) {
      if(toAccount.isPrecompiled(opts.to)){
        opts.compiled = true
        opts.code = self._precomiled[opts.to.toString('hex')]
        return cb2()
      }

      toAccount.getCode(self.trie, function(err, c, comp) {
        opts.compiled = comp
        opts.code = c
        cb2(err)
      })
    } else {
      cb2()
    }
  }

  function runCode(cb2) {
    self.cache.checkpoint()
    self.trie.checkpoint()

    if (opts.code) {
      var runCodeOpts = {
        code: opts.code,
        data: data,
        gasLimit: opts.gasLimit,
        gasPrice: opts.gasPrice,
        account: toAccount,
        address: opts.to,
        origin: opts.origin,
        caller: opts.caller,
        value: opts.value,
        block: opts.block,
        depth: opts.depth,
        suicides: opts.suicides
      }

      var codeRunner = opts.compiled ? self.runJIT : self.runCode

      //run Code through vm
      codeRunner.call(self, runCodeOpts, function(err, results) {
        toAccount = results.account
        vmResults = results

        if (createdAddress) {
          //dont save newly created accounts that have no balance
          if(results.exceptionError && toAccount.balance.toString('hex') === '00')
            self.cache.del(createdAddress)

          var returnFee = results.gasUsed.add(new BN(results.return.length * fees.createDataGas.v))
          if (returnFee.cmp(opts.gasLimit) <= 0)
            results.gasUsed = returnFee
          else 
            results.return = new Buffer([])
        }

        gasUsed = results.gasUsed

        if (results.exceptionError) {
          opts.account.balance = new Buffer((new BN(opts.account.balance).add(opts.value)).toArray())
          self.cache.revert()
          self.cache.put(opts.caller, opts.account)
          self.trie.revert(cb2)
        } else {
          self.cache.commit()
          self.trie.commit(cb2)
        }
      })
    } else {
      self.cache.commit()
      cb2()
    }
  }

  function saveCode(cb2) {
    //store code for a new contract
    if (!vmResults.exceptionError && createdAddress && vmResults.return.toString() !== ''){
      toAccount.setCode(self.trie, vmResults.return, cb2)
    } else
      cb2()
  }

  async.series([
      loadCode,
      runCode,
      saveCode
    ],
    function(err) {
      //save the to account
      if(!vmResults.exceptionError)
        self.cache.put(opts.to, toAccount)

      var results = {
        gasUsed: gasUsed,
        fromAccount: opts.account,
        toAccount: toAccount,
        createdAddress: createdAddress,
        vm: vmResults
      }

      if (results.vm.exception === undefined)
         results.vm.exception = 1

      if(!results.vm.storageTries)
         results.vm.storageTries = []

      cb(err, results)
    })
}
