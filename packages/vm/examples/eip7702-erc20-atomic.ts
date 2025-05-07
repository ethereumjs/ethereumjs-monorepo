import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { Capability, EOACode7702Tx, TransactionType } from '@ethereumjs/tx'
import { Address, bytesToHex, hexToBytes, toBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { Interface } from '@ethersproject/abi'

/**
 * This example demonstrates how to use EIP-7702 to perform atomic ERC20 operations
 * (approve + transferFrom) in a single transaction using RPCStateManager to
 * simulate against a real network.
 *
 * WARNING: DO NOT USE REAL PRIVATE KEYS WITH VALUE. This is for demonstration only.
 */

// Helper function to safely convert hex strings for hexToBytes
function safeHexToBytes(hexString: string): Uint8Array {
  return hexToBytes(hexString as `0x${string}`)
}

// ERC20 Interface
const erc20Abi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
]

// Bundle contract that handles atomic approve + transferFrom
// This is what an EOA will delegate to with EIP-7702
const bundleContractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ERC20Bundler {
    /**
     * @dev Atomically approves and transfers ERC20 tokens in a single call.
     * @param token The ERC20 token address
     * @param to The recipient address
     * @param amount The amount to approve and transfer
     * @return success True if the operation was successful
     */
    function approveAndTransfer(address token, address to, uint256 amount) external returns (bool) {
        // Approve the bundler contract to spend tokens
        bool approved = IERC20(token).approve(address(this), amount);
        require(approved, "Approval failed");
        
        // Transfer the tokens from the caller to the recipient
        bool transferred = IERC20(token).transferFrom(msg.sender, to, amount);
        require(transferred, "Transfer failed");
        
        return true;
    }
}
`

// Simulates a deployed bundle contract
const BUNDLE_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890' as `0x${string}`

// DAI token on mainnet
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`

const main = async () => {
  // For demonstration purposes, we're using a fake private key
  // WARNING: Never use real private keys in code or examples
  const privateKey = safeHexToBytes(
    '0x1122334455667788112233445566778811223344556677881122334455667788',
  )
  const userAddress = new Address(safeHexToBytes('0x0000000000000000000000000000000000001234'))

  console.log('User address:', userAddress.toString())

  // Initialize Common with EIP-7702 enabled
  const common = new Common({
    chain: 1 as any, // Mainnet
    hardfork: Hardfork.Cancun,
    eips: [7702],
  })

  // We'll use RPCStateManager to interact with the real network state
  // For this example we're using a local node, but you could use any provider
  // This allows us to simulate transactions against real network state
  const provider = 'http://localhost:8545' // Replace with an actual provider URL

  // Create a state manager with the required parameters
  const rpcStateManager = new RPCStateManager({
    provider,
    blockTag: 'earliest', // Using a valid value
  })

  // Create VM instance with the RPCStateManager
  // Use the static create method of VM
  const vm = await (VM as any).create({
    common,
    stateManager: rpcStateManager,
  })

  // Check if user has a DAI balance
  const erc20Interface = new Interface(erc20Abi)
  const balanceOfCalldata = erc20Interface.encodeFunctionData('balanceOf', [userAddress.toString()])

  const balanceOfResult = await vm.evm.runCall({
    to: new Address(safeHexToBytes(DAI_ADDRESS)),
    caller: userAddress,
    data: safeHexToBytes(balanceOfCalldata),
  })

  // Decode the balance result
  const daiBalance =
    balanceOfResult.execResult.returnValue.length > 0
      ? erc20Interface.decodeFunctionResult(
          'balanceOf',
          bytesToHex(balanceOfResult.execResult.returnValue),
        )[0]
      : 0n

  console.log('DAI balance:', daiBalance.toString())

  if (daiBalance <= 0n) {
    console.log('No DAI balance to demonstrate with')
    return
  }

  // Create an EIP-7702 transaction that will delegate the user's EOA
  // to the bundle contract for this transaction

  // Recipient of the DAI transfer
  const recipientAddress = new Address(safeHexToBytes('0x0000000000000000000000000000000000005678'))
  console.log('Recipient address:', recipientAddress.toString())

  // Amount to transfer (use a small amount for the demo)
  const transferAmount = 1000000000000000000n // 1 DAI

  // Create the calldata for the bundle contract's approveAndTransfer function
  const bundleInterface = new Interface([
    'function approveAndTransfer(address token, address to, uint256 amount) external returns (bool)',
  ])

  const approveAndTransferCalldata = bundleInterface.encodeFunctionData('approveAndTransfer', [
    DAI_ADDRESS,
    recipientAddress.toString(),
    transferAmount,
  ])

  // Create the EIP-7702 transaction with authorization to use the bundle contract
  const txData = {
    nonce: 0n,
    gasLimit: 300000n,
    maxFeePerGas: 20000000000n,
    maxPriorityFeePerGas: 2000000000n,
    to: new Address(safeHexToBytes(BUNDLE_CONTRACT_ADDRESS)),
    value: 0n,
    data: safeHexToBytes(approveAndTransferCalldata),
    accessList: [],
    authorizationList: [
      {
        chainId: common.chainId(),
        address: new Address(safeHexToBytes(BUNDLE_CONTRACT_ADDRESS)),
        nonce: 0n,
        yParity: 0n,
        r: safeHexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234'),
        s: safeHexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234'),
      },
    ],
  } as any // Type assertion to bypass type checking

  // Pass common as a separate option
  const tx = new EOACode7702Tx(txData, { common })
  const signedTx = tx.sign(privateKey)

  console.log('Transaction created successfully')
  console.log('Transaction type:', TransactionType[signedTx.type])
  console.log('Supports EIP-7702:', signedTx.supports(Capability.EIP7702EOACode))

  // Run the transaction to simulate what would happen
  console.log('\nSimulating transaction...')

  try {
    const result = await vm.runTx({ tx: signedTx })

    console.log(
      'Transaction simulation:',
      result.execResult.exceptionError !== null && result.execResult.exceptionError !== undefined
        ? 'Failed'
        : 'Success',
    )

    if (
      result.execResult.exceptionError === null ||
      result.execResult.exceptionError === undefined
    ) {
      console.log('Gas used:', result.gasUsed.toString())

      // Check DAI allowance after the transaction
      const allowanceCalldata = erc20Interface.encodeFunctionData('allowance', [
        userAddress.toString(),
        BUNDLE_CONTRACT_ADDRESS,
      ])

      const allowanceResult = await vm.evm.runCall({
        to: new Address(safeHexToBytes(DAI_ADDRESS)),
        caller: userAddress,
        data: safeHexToBytes(allowanceCalldata),
      })

      const allowance =
        allowanceResult.execResult.returnValue.length > 0
          ? erc20Interface.decodeFunctionResult(
              'allowance',
              bytesToHex(allowanceResult.execResult.returnValue),
            )[0]
          : 0n

      console.log('DAI allowance after transaction:', allowance.toString())

      // Check recipient's DAI balance after the transaction
      const recipientBalanceCalldata = erc20Interface.encodeFunctionData('balanceOf', [
        recipientAddress.toString(),
      ])

      const recipientBalanceResult = await vm.evm.runCall({
        to: new Address(safeHexToBytes(DAI_ADDRESS)),
        caller: userAddress,
        data: safeHexToBytes(recipientBalanceCalldata),
      })

      const recipientBalance =
        recipientBalanceResult.execResult.returnValue.length > 0
          ? erc20Interface.decodeFunctionResult(
              'balanceOf',
              bytesToHex(recipientBalanceResult.execResult.returnValue),
            )[0]
          : 0n

      console.log('Recipient DAI balance after transaction:', recipientBalance.toString())

      // Explain what happened
      console.log('\nTransaction Summary:')
      console.log('- User authorized their EOA to use the bundle contract implementation')
      console.log('- The EOA executed the approveAndTransfer function which:')
      console.log('  1. Approved the bundle contract to spend DAI tokens')
      console.log('  2. Transferred DAI tokens to the recipient in a single atomic transaction')
      console.log('\nThis demonstrates the power of EIP-7702 to enable advanced features for EOAs')
      console.log(
        'without needing to deploy an account contract or switch to a smart contract wallet.',
      )
    } else {
      console.log('Error:', result.execResult.exceptionError.error)
    }
  } catch (error) {
    console.error('Simulation error:', error)
  }

  // This would be sent to the actual network using:
  // const serializedTx = bytesToHex(signedTx.serialize())
  // console.log('Serialized transaction for broadcasting:', serializedTx)
}

main().catch((error) => {
  if (error !== null && error !== undefined) {
    console.error('Error:', error)
  }
})
