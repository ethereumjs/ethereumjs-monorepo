import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'
import { AbiCoder, Interface } from 'ethers'
import { readFileSync } from 'fs'
import path from 'path'
import solc from 'solc'
import { fileURLToPath } from 'url'

import { getAccountNonce, insertAccount } from './helpers/account-utils.ts'
import { buildTransaction, encodeDeployment, encodeFunction } from './helpers/tx-builder.ts'

import type { Address } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

const INITIAL_GREETING = 'Hello, World!'
const SECOND_GREETING = 'Hola, Mundo!' // cspell:disable-line

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
const block = createBlock({ header: { extraData: new Uint8Array(97) } }, { common })

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

/**
 * This function creates the input for the Solidity compiler.
 *
 * For more info about it, go to https://solidity.readthedocs.io/en/v0.5.10/using-the-compiler.html#compiler-input-and-output-json-description
 *
 * Note: this example additionally needs the Solidity compiler `solc` package (out of EthereumJS
 * scope) being installed. You can do this (in this case it might make sense to install globally)
 * with `npm i -g solc`.
 */
function getSolcInput() {
  return {
    language: 'Solidity',
    sources: {
      'helpers/Greeter.sol': {
        content: readFileSync(path.join(__dirname, 'helpers', 'Greeter.sol'), 'utf8'),
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

  if (output.errors !== undefined) {
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
  return solcOutput.contracts['helpers/Greeter.sol'].Greeter.evm.bytecode.object
}

async function deployContract(
  vm: VM,
  senderPrivateKey: Uint8Array,
  deploymentBytecode: string,
  greeting: string,
): Promise<Address> {
  // Contracts are deployed by sending their deployment bytecode to the address 0
  // The contract params should be abi-encoded and appended to the deployment bytecode.

  const data = encodeDeployment(deploymentBytecode, {
    types: ['string'],
    values: [greeting],
  })
  const txData = {
    data,
    nonce: await getAccountNonce(vm, senderPrivateKey),
  }

  const tx = createLegacyTx(buildTransaction(txData as any), { common }).sign(senderPrivateKey)

  const deploymentResult = await runTx(vm, { tx, block })

  if (deploymentResult.execResult.exceptionError) {
    throw deploymentResult.execResult.exceptionError
  }

  return deploymentResult.createdAddress!
}

async function setGreeting(
  vm: VM,
  senderPrivateKey: Uint8Array,
  contractAddress: Address,
  greeting: string,
) {
  const data = encodeFunction('setGreeting', {
    types: ['string'],
    values: [greeting],
  })

  const txData = {
    to: contractAddress,
    data,
    nonce: await getAccountNonce(vm as any, senderPrivateKey),
  }

  const tx = createLegacyTx(buildTransaction(txData as any), { common }).sign(senderPrivateKey)

  const setGreetingResult = await runTx(vm, { tx, block })

  if (setGreetingResult.execResult.exceptionError) {
    throw setGreetingResult.execResult.exceptionError
  }
}

async function getGreeting(vm: VM, contractAddress: Address, caller: Address) {
  const sigHash = new Interface(['function greet()']).getFunction('greet')!.selector

  const greetResult = await vm.evm.runCall({
    to: contractAddress,
    caller,
    origin: caller, // The tx.origin is also the caller here
    data: hexToBytes(sigHash),
    block,
  })

  if (greetResult.execResult.exceptionError) {
    throw greetResult.execResult.exceptionError
  }

  const results = new AbiCoder().decode(['string'], greetResult.execResult.returnValue)

  return results[0]
}

async function main() {
  const accountPk = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

  const vm = await createVM({ common })
  const accountAddress = createAddressFromPrivateKey(accountPk)

  console.log('Account: ', accountAddress.toString())
  await insertAccount(vm, accountAddress)

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

  console.log('Contract address:', contractAddress.toString())

  const greeting = await getGreeting(vm, contractAddress, accountAddress)

  console.log('Greeting:', greeting)

  if (greeting !== INITIAL_GREETING)
    throw new Error(
      `initial greeting not equal, received ${greeting}, expected ${INITIAL_GREETING}`,
    )

  console.log('Changing greeting...')

  await setGreeting(vm, accountPk, contractAddress, SECOND_GREETING)

  const greeting2 = await getGreeting(vm, contractAddress, accountAddress)

  console.log('Greeting:', greeting2)

  if (greeting2 !== SECOND_GREETING)
    throw new Error(`second greeting not equal, received ${greeting2}, expected ${SECOND_GREETING}`)

  // Now let's look at what we created. The transaction
  // should have created a new account for the contract
  // in the state. Let's test to see if it did.

  const createdAccount = await vm.stateManager.getAccount(contractAddress)

  console.log('-------results-------')
  console.log('nonce: ' + createdAccount!.nonce.toString())
  console.log('balance in wei: ', createdAccount!.balance.toString())
  console.log('storageRoot: ' + bytesToHex(createdAccount!.storageRoot))
  console.log('codeHash: ' + bytesToHex(createdAccount!.codeHash))
  console.log('---------------------')

  console.log('Everything ran correctly!')
}

void main()
