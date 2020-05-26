import VM from '../..'
import Account from 'ethereumjs-account'
import { toBuffer, pubToAddress, bufferToHex } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'

async function main() {
  const vm = new VM()

  // import the key pair
  //   used to sign transactions and generate addresses
  const keyPair = require('./key-pair')
  const privateKey = toBuffer(keyPair.secretKey)

  const publicKeyBuf = toBuffer(keyPair.publicKey)
  const address = pubToAddress(publicKeyBuf, true)

  console.log('---------------------')
  console.log('Sender address: ', bufferToHex(address))

  // create a new account
  const account = new Account({
    balance: 100e18,
  })

  // Save the account
  await vm.stateManager.putAccount(address, account)

  const rawTx1 = require('./raw-tx1')
  const rawTx2 = require('./raw-tx2')

  // The first transaction deploys a contract
  const createdAddress = (await runTx(vm, rawTx1, privateKey))!

  // The second transaction calls that contract
  await runTx(vm, rawTx2, privateKey)

  // Now lets look at what we created. The transaction
  // should have created a new account for the contract
  // in the state. Lets test to see if it did.

  const createdAccount = await vm.stateManager.getAccount(createdAddress)

  console.log('-------results-------')
  console.log('nonce: ' + createdAccount.nonce.toString('hex'))
  console.log('balance in wei: ', createdAccount.balance.toString('hex') || 0)
  console.log('stateRoot: ' + createdAccount.stateRoot.toString('hex'))
  console.log('codeHash: ' + createdAccount.codeHash.toString('hex'))
  console.log('---------------------')
}

async function runTx(vm: VM, rawTx: any, privateKey: Buffer) {
  const tx = new Transaction(rawTx)

  tx.sign(privateKey)

  console.log('----running tx-------')
  const results = await vm.runTx({
    tx: tx,
  })

  console.log('gas used: ' + results.gasUsed.toString())
  console.log('returned: ' + results.execResult.returnValue.toString('hex'))

  const createdAddress = results.createdAddress

  if (createdAddress) {
    console.log('address created: ' + createdAddress.toString('hex'))
    return createdAddress
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
