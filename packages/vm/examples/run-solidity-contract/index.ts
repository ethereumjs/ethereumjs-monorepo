import VM from '../../dist'

import * as assert from 'assert'
import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import * as util from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import { Transaction } from 'ethereumjs-tx'
const abi = require('ethereumjs-abi')
const solc = require('solc')

const INITIAL_GREETING = 'Hello, World!'
const SECOND_GREETING = 'Hola, Mundo!'

/**
 * This function creates the input for the Solidity compiler.
 *
 * For more info about it, go to https://solidity.readthedocs.io/en/v0.5.10/using-the-compiler.html#compiler-input-and-output-json-description
 */
function getSolcInput() {
  return {
    language: 'Solidity',
    sources: {
      'contracts/Greeter.sol': {
        content: fs.readFileSync(path.join(__dirname, 'contracts', 'Greeter.sol'), 'utf8'),
      },
      // If more contracts were to be compiled, they should have their own entries here
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'petersburg',
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  }
}

/**
 * This function compiles all the contracts in `contracts/` and returns the Solidity Standard JSON
 * output. If the compilation fails, it returns `undefined`.
 *
 * To learn about the output format, go to https://solidity.readthedocs.io/en/v0.5.10/using-the-compiler.html#compiler-input-and-output-json-description
 */
function compileContracts() {
  const input = getSolcInput()
  const output = JSON.parse(solc.compile(JSON.stringify(input)))

  let compilationFailed = false

  if (output.errors) {
    for (const error of output.errors) {
      if (error.severity === 'error') {
        console.error(error.formattedMessage)
        compilationFailed = true
      } else {
        console.warn(error.formattedMessage)
      }
    }
  }

  if (compilationFailed) {
    return undefined
  }

  return output
}

function getGreeterDeploymentBytecode(solcOutput: any): any {
  return solcOutput.contracts['contracts/Greeter.sol'].Greeter.evm.bytecode.object
}

async function getAccountNonce(vm: VM, accountPrivateKey: Buffer) {
  const account = (await promisify(vm.stateManager.getAccount.bind(vm.stateManager))(
    util.privateToAddress(accountPrivateKey),
  )) as Account

  return account.nonce
}

async function deployContract(
  vm: VM,
  senderPrivateKey: Buffer,
  deploymentBytecode: Buffer,
  greeting: string,
): Promise<Buffer> {
  // Contracts are deployed by sending their deployment bytecode to the address 0
  // The contract params should be abi-encoded and appended to the deployment bytecode.
  const params = abi.rawEncode(['string'], [greeting])

  const tx = new Transaction({
    value: 0,
    gasLimit: 2000000, // We assume that 2M is enough,
    gasPrice: 1,
    data: '0x' + deploymentBytecode + params.toString('hex'),
    nonce: await getAccountNonce(vm, senderPrivateKey),
  })

  tx.sign(senderPrivateKey)

  const deploymentResult = await vm.runTx({ tx })

  if (deploymentResult.execResult.exceptionError) {
    throw deploymentResult.execResult.exceptionError
  }

  return deploymentResult.createdAddress!
}

async function setGreeting(
  vm: VM,
  senderPrivateKey: Buffer,
  contractAddress: Buffer,
  greeting: string,
) {
  const params = abi.rawEncode(['string'], [greeting])

  const tx = new Transaction({
    to: contractAddress,
    value: 0,
    gasLimit: 2000000, // We assume that 2M is enough,
    gasPrice: 1,
    data: '0x' + abi.methodID('setGreeting', ['string']).toString('hex') + params.toString('hex'),
    nonce: await getAccountNonce(vm, senderPrivateKey),
  })

  tx.sign(senderPrivateKey)

  const setGreetingResult = await vm.runTx({ tx })

  if (setGreetingResult.execResult.exceptionError) {
    throw setGreetingResult.execResult.exceptionError
  }
}

async function getGreeting(vm: VM, contractAddress: Buffer, caller: Buffer) {
  const greetResult = await vm.runCall({
    to: contractAddress,
    caller: caller,
    origin: caller, // The tx.origin is also the caller here
    data: abi.methodID('greet', []),
  })

  if (greetResult.execResult.exceptionError) {
    throw greetResult.execResult.exceptionError
  }

  const results = abi.rawDecode(['string'], greetResult.execResult.returnValue)

  return results[0]
}

async function main() {
  const accountPk = new Buffer(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex',
  )

  const accountAddress = util.privateToAddress(accountPk)

  console.log('Account:', util.bufferToHex(accountAddress))

  const account = new Account({ balance: 1e18 })

  const vm = new VM()
  await promisify(vm.stateManager.putAccount.bind(vm.stateManager))(accountAddress, account)

  console.log('Set account a balance of 1 ETH')

  console.log('Compiling...')

  const solcOutput = compileContracts()
  if (solcOutput === undefined) {
    throw new Error('Compilation failed')
  } else {
    console.log('Compiled the contract')
  }

  const bytecode = getGreeterDeploymentBytecode(solcOutput)

  console.log('Deploying the contract...')

  const contractAddress = await deployContract(vm, accountPk, bytecode, INITIAL_GREETING)

  console.log('Contract address:', util.bufferToHex(contractAddress))

  const greeting = await getGreeting(vm, contractAddress, accountAddress)

  console.log('Greeting:', greeting)

  assert.equal(greeting, INITIAL_GREETING)

  console.log('Changing greeting...')

  await setGreeting(vm, accountPk, contractAddress, SECOND_GREETING)

  const greeting2 = await getGreeting(vm, contractAddress, accountAddress)

  console.log('Greeting:', greeting2)

  assert.equal(greeting2, SECOND_GREETING)

  console.log('Everything run correctly!')
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
