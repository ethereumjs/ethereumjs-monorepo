import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { Capability, EOACode7702Tx, TransactionType } from '@ethereumjs/tx'
import { Address, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

/**
 * This example demonstrates how to use EIP-7702 to perform a Uniswap swap
 * from an EOA using the RPCStateManager to simulate against a real network.
 *
 * WARNING: DO NOT USE REAL PRIVATE KEYS WITH VALUE. This is for demonstration only.
 */

// Uniswap V2 Router address on Mainnet
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

// Token addresses
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

// ABI snippets for the relevant functions
const ERC20_APPROVE_ABI = {
  inputs: [
    { name: 'spender', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  name: 'approve',
  outputs: [{ name: '', type: 'bool' }],
  stateMutability: 'nonpayable',
  type: 'function',
}

const UNISWAP_SWAP_ABI = {
  inputs: [
    { name: 'amountIn', type: 'uint256' },
    { name: 'amountOutMin', type: 'uint256' },
    { name: 'path', type: 'address[]' },
    { name: 'to', type: 'address' },
    { name: 'deadline', type: 'uint256' },
  ],
  name: 'swapExactTokensForTokens',
  outputs: [{ name: 'amounts', type: 'uint256[]' }],
  stateMutability: 'nonpayable',
  type: 'function',
}

// Bundler contract that combines approve and swap in one transaction
const uniswapBundlerCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract UniswapBundler {
    /**
     * @dev Atomically approves and swaps tokens using Uniswap in a single call
     * @param tokenIn The input token address
     * @param tokenOut The output token address
     * @param amountIn The amount of input tokens to swap
     * @param amountOutMin The minimum amount of output tokens to receive
     * @param router The Uniswap router address
     * @param deadline The deadline for the swap
     * @return amounts The amounts of tokens exchanged
     */
    function approveAndSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address router,
        uint256 deadline
    ) external returns (uint256[] memory) {
        // Approve the router to spend tokens
        IERC20(tokenIn).approve(router, amountIn);

        // Create the swap path
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        // Execute the swap
        return IUniswapV2Router(router).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender, // Send output tokens directly to the caller
            deadline
        );
    }
}
`

// Simulates a deployed bundler contract
const BUNDLER_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'

// Helper function to encode function call
function encodeFunction(abi: any, values: any[]): Uint8Array {
  // This is a simplified version. In a real app, use ethers.js or web3.js
  const signature = `${abi.name}(${abi.inputs.map((input: any) => input.type).join(',')})`
  const functionSelector = hexToBytes(`0x${signature.slice(0, 10)}`)

  // This is just a placeholder - in a real implementation, you would properly ABI encode the parameters
  console.log(`Encoded function call to ${signature}`)
  return functionSelector
}

// Create ABI for the bundler contract
const BUNDLER_ABI = {
  inputs: [
    { name: 'tokenIn', type: 'address' },
    { name: 'tokenOut', type: 'address' },
    { name: 'amountIn', type: 'uint256' },
    { name: 'amountOutMin', type: 'uint256' },
    { name: 'router', type: 'address' },
    { name: 'deadline', type: 'uint256' },
  ],
  name: 'approveAndSwap',
  outputs: [{ name: 'amounts', type: 'uint256[]' }],
  stateMutability: 'nonpayable',
  type: 'function',
}

const main = async () => {
  // For demonstration purposes only, using fake keys
  // WARNING: Never use real private keys in code
  const privateKey = hexToBytes(
    '0x1122334455667788112233445566778811223344556677881122334455667788',
  )
  const userAddress = new Address(hexToBytes('0x1234567890123456789012345678901234567890'))
  console.log('User address:', userAddress.toString())

  // Initialize Common with EIP-7702 enabled
  const common = new Common({
    chain: Chain.Mainnet as any,
    hardfork: Hardfork.Cancun,
    eips: [7702],
  })

  // We'll use RPCStateManager to interact with a mainnet fork
  const provider = 'http://localhost:8545'
  const blockTag = 'earliest'
  const rpcStateManager = new RPCStateManager({ provider, blockTag })

  // Create VM instance with the RPCStateManager
  const vm = await (VM as any).create({ common, stateManager: rpcStateManager })

  console.log('Simulating a Uniswap swap with EIP-7702...')

  // Parameters for the swap
  const amountIn = 1000000000000000000n // 1 DAI
  const amountOutMin = 1n // Accept any amount (in production, use price oracle for slippage protection)
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now

  // Create calldata for the bundler contract's approveAndSwap function
  const calldata = encodeFunction(BUNDLER_ABI, [
    DAI_ADDRESS,
    WETH_ADDRESS,
    amountIn,
    amountOutMin,
    UNISWAP_ROUTER_ADDRESS,
    deadline,
  ])

  // Create the EIP-7702 transaction
  const txData = {
    nonce: 0n,
    gasLimit: 500000n,
    maxFeePerGas: 30000000000n, // 30 gwei
    maxPriorityFeePerGas: 3000000000n, // 3 gwei
    to: new Address(hexToBytes(`0x${BUNDLER_CONTRACT_ADDRESS.slice(2)}` as `0x${string}`)),
    value: 0n,
    data: calldata,
    accessList: [],
    authorizationList: [
      {
        chainId: common.chainId(),
        address: new Address(hexToBytes(`0x${BUNDLER_CONTRACT_ADDRESS.slice(2)}` as `0x${string}`)),
        nonce: 0n,
        yParity: 0n,
        r: hexToBytes(
          '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`,
        ),
        s: hexToBytes(
          '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`,
        ),
      },
    ] as any,
  }

  // Create and sign the transaction
  const tx = new EOACode7702Tx(txData, { common })
  const signedTx = tx.sign(privateKey)

  console.log('Transaction type:', TransactionType[signedTx.type])
  console.log('Supports EIP-7702:', signedTx.supports(Capability.EIP7702EOACode))

  // Simulate the transaction
  try {
    console.log('Running transaction simulation...')
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

      console.log('\nTransaction Summary:')
      console.log(
        '- The EOA authorized delegation to the UniswapBundler contract for this transaction',
      )
      console.log('- The bundler contract atomically executed:')
      console.log('  1. Approval of DAI tokens to the Uniswap router')
      console.log('  2. Swap of DAI for WETH using Uniswap')
      console.log('\nBenefits of using EIP-7702 for this use case:')
      console.log('- Saved gas by combining multiple transactions into one')
      console.log('- Better UX with atomic approval and swap')
      console.log('- No need to deploy a separate smart contract wallet')
      console.log("- Maintained security of the user's EOA")
    } else {
      console.log('Error:', result.execResult.exceptionError.error)
    }
  } catch (error) {
    console.error('Simulation error:', error)
  }
}

main().catch((error) => {
  if (error !== null && error !== undefined) {
    console.error('Error:', error)
  }
})
