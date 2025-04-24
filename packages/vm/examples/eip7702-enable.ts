import { Chain, Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Capability, TransactionType, createEOACode7702Tx } from '@ethereumjs/tx'
import {
  Address,
  bytesToHex,
  createAddressFromString,
  hexToBytes,
  privateToAddress,
} from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

/**
 * This example demonstrates how to enable EIP-7702 in the EthereumJS VM
 * and how to create and process an EIP-7702 transaction.
 */
const main = async () => {
  // Create a Common instance with EIP-7702 enabled
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    eips: [7702],
  })

  console.log('Is EIP-7702 activated?', common.isActivatedEIP(7702))

  // Create accounts for demonstration
  const privateKey = hexToBytes(
    '0x1122334455667788112233445566778811223344556677881122334455667788',
  )
  const senderAddress = new Address(privateToAddress(privateKey))
  console.log('Sender address:', senderAddress.toString())

  // Create VM instance with EIP-7702 enabled
  const vm = await (VM as any).create({ common })

  // Set up account state
  const accountBalance = 10n ** 18n // 1 ETH
  await vm.stateManager.putAccount(senderAddress, { balance: accountBalance, nonce: 0n })

  // Smart contract implementation address that we want to delegate to
  // This could be any deployed smart contract (e.g. ERC-4337 account implementation)
  const implementationAddress = new Address(
    hexToBytes('0x0000000000000000000000000000000000000123'),
  )
  console.log('Implementation address:', implementationAddress.toString())

  // Create EIP-7702 transaction
  // The authorization enables the EOA to use the code from the implementation address
  const chainId = common.chainId()

  // Create an authorization for EIP-7702
  // This is normally signed by the EOA owner
  const txData = {
    nonce: 0n,
    gasLimit: 100000n,
    maxFeePerGas: 10000000000n, // 10 gwei
    maxPriorityFeePerGas: 1000000000n, // 1 gwei
    to: senderAddress, // target is the same as sender (self-call for initialization)
    value: 0n,
    data: hexToBytes('0x'), // Could be initialization data
    accessList: [],
    // Using just [] as a basic authorizationList that will be accepted
    authorizationList: [],
  }

  // Create and sign the EIP-7702 transaction
  const tx = createEOACode7702Tx(txData, { common })
  const signedTx = tx.sign(privateKey)

  console.log('Transaction type:', TransactionType[signedTx.type])
  console.log('Supports EIP-7702:', signedTx.supports(Capability.EIP7702EOACode))
  console.log('Transaction hash:', bytesToHex(signedTx.hash()))

  // Run the transaction to set the code of the EOA
  const result = await vm.runTx({ tx: signedTx })

  console.log(
    'Transaction processed:',
    result.execResult.exceptionError !== null && result.execResult.exceptionError !== undefined
      ? 'Failed'
      : 'Success',
  )

  // Check that the EOA now has code
  const account = await vm.stateManager.getAccount(senderAddress)
  const code = await vm.stateManager.getContractCode(senderAddress)

  console.log('Account nonce after transaction:', account?.nonce)
  console.log('Account has code:', code.length > 0)
  console.log('Code (hex):', bytesToHex(code))

  // The code should start with the EIP-7702 delegation flag (0xef0100)
  // followed by the implementation address
  const hasDelegationFlag = code[0] === 0xef && code[1] === 0x01 && code[2] === 0x00
  console.log('Has delegation flag:', hasDelegationFlag)

  // Extract the delegated address from the code
  if (hasDelegationFlag && code.length === 23) {
    const delegatedAddressBytes = code.slice(3)
    const delegatedAddress = createAddressFromString(bytesToHex(delegatedAddressBytes))
    console.log('Delegated to address:', delegatedAddress.toString())

    // Verify it matches our implementation address
    console.log('Matches implementation address:', delegatedAddress.equals(implementationAddress))
  }
}

// Helper function for bigint to unpadded bytes conversion
function bigIntToUnpadded(value: bigint): Uint8Array {
  // Convert bigint to bytes without padding
  const hex = value.toString(16)
  return hexToBytes(hex.length % 2 === 0 ? `0x${hex}` : `0x0${hex}`)
}

main().catch(console.error)
