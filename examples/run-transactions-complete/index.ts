import VM from '../..'
import Account from 'ethereumjs-account'
import * as utils from 'ethereumjs-util'
import { promisify } from 'util'
import stateManager from '../../lib/state/stateManager'

const Transaction = require('ethereumjs-tx') // Change when https://github.com/ethereumjs/ethereumjs-vm/pull/541 gets merged

async function main() {
  const vm = new VM()

  // import the key pair
  //   pre-generated (saves time)
  //   used to sign transactions and generate addresses
  const keyPair = require('./key-pair')

  // Transaction to initalize the name register, in this case
  // it will register the sending address as 'null_radix'
  // Notes:
  //   - A transaction has the fiels:
  //     - nonce
  //     - gasPrice
  //     - gasLimit
  //     - data
  const rawTx1 = require('./raw-tx1')

  // 2nd Transaction
  const rawTx2 = require('./raw-tx2')

  // the address we are sending from
  const publicKeyBuf = utils.toBuffer(keyPair.publicKey)
  const address = utils.pubToAddress(publicKeyBuf, true)

  console.log('---------------------')
  console.log('Sender address: ', utils.bufferToHex(address))

  // create a new account
  const account = new Account()

  // give the account some wei.
  account.balance = utils.toBuffer('0xf00000000000000001')

  // Save the account
  await promisify(vm.stateManager.putAccount.bind(vm.stateManager))(address, account)

  // The first transaction deploys a contract
  const createdAddress = (await runTx(vm, rawTx1, keyPair))!

  // The second transaction calls that contract
  await runTx(vm, rawTx2, keyPair)

  // Now lets look at what we created. The transaction
  // should have created a new account for the contract
  // in the state. Lets test to see if it did.

  const createdAccount = (await promisify(vm.stateManager.getAccount.bind(vm.stateManager))(
    createdAddress,
  )) as Account

  console.log('-------results-------')
  console.log('nonce: ' + createdAccount.nonce.toString('hex'))
  console.log('balance in wei: ' + createdAccount.balance.toString('hex'))
  console.log('stateRoot: ' + createdAccount.stateRoot.toString('hex'))
  console.log('codeHash: ' + createdAccount.codeHash.toString('hex'))
  console.log('---------------------')
}

async function runTx(vm: VM, rawTx: any, keyPair: { secretKey: string }) {
  // create a new transaction out of the json
  const tx = new Transaction(rawTx)

  tx.sign(utils.toBuffer(keyPair.secretKey))

  console.log('----running tx-------')
  const results = await vm.runTx({
    tx: tx,
  })
  const createdAddress = results.createdAddress

  // log some results
  console.log('gas used: ' + results.gasUsed.toString())
  console.log('returned: ' + results.vm.return.toString('hex'))

  if (createdAddress) {
    console.log('address created: ' + createdAddress.toString('hex'))
  }

  return createdAddress
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
