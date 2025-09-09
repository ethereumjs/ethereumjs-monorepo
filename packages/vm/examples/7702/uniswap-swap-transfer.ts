import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { EOACode7702Tx, type EOACode7702TxData } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'
import {
  createAddressFromPrivateKey,
  eoaCode7702SignAuthorization,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'
import { Interface, parseEther, parseUnits } from 'ethers'

async function run() {
  // ─── your EOA key & address ───────────────────────────────────────────
  const privateKeyHex = '0x1122334455667788112233445566778811223344556677881122334455667788'
  const privateKey = hexToBytes(privateKeyHex)
  const userAddress = createAddressFromPrivateKey(privateKey)
  console.log('EOA:', userAddress.toString())

  // ─── set up EthereumJS VM with EIP-7702 enabled ───────────────────────
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })
  const stateManager = new RPCStateManager({
    provider: 'YourProviderURLHere',
    blockTag: 22_000_000n,
  })
  const vm = await createVM({ common, stateManager })

  // ─── constants & ABIs ────────────────────────────────────────────────
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const WETH = '0xC02aaa39b223FE8D0A0e5c4F27EaD9083C756Cc2'
  const COLD_WALLET = `0x${'42'.repeat(20)}`

  const erc20Abi = [
    'function approve(address _spender, uint256 _amount) external returns (bool success)',
    'function transfer(address _to, uint256 _value) public returns (bool success)',
  ]
  const routerAbi = ['function exactInput(bytes)']

  // This Batch contract is a placeholder. Replace with your actual batch contract address.
  // This contract is responsible for executing multiple calls in a single TX.
  const BATCH_CONTRACT = '0xYourBatchContractAddressHere'
  const batchAbi = ['function executeBatch(bytes[] calldata, address[] targets) external']

  const erc20 = new Interface(erc20Abi)
  const router = new Interface(routerAbi)
  const batch = new Interface(batchAbi)

  // ─── trade parameters ────────────────────────────────────────────────
  const amountIn = parseUnits('10000', 18) // 10000 DAI
  const amountOut = parseEther('4') // expect at least 4 WETH

  // ─── encode your underlying swap data ───────────────────────────────────
  const uniswapV3SwapPayload = `0xYourSwapCallDataHere`

  // ─── encode your three sub-calls ───────────────────────────────────────
  // 1) DAI approve
  const callApprove = erc20.encodeFunctionData('approve', [
    UNISWAP_V3_ROUTER,
    amountIn,
  ]) as PrefixedHexString

  // 2) Uniswap V3 swapExactInput
  const callSwap = router.encodeFunctionData('exactInput', [
    uniswapV3SwapPayload,
  ]) as PrefixedHexString

  // 3) sweep WETH to cold wallet
  const callTransfer = erc20.encodeFunctionData('transfer', [
    COLD_WALLET,
    amountOut,
  ]) as PrefixedHexString

  const targets: PrefixedHexString[] = [DAI, UNISWAP_V3_ROUTER, WETH]
  const calls = [callApprove, callSwap, callTransfer].map(hexToBytes)

  // ─── build & send your single 7702 tx ───────────────────────────────
  const batchData = batch.encodeFunctionData('executeBatch', [calls, targets]) as `0x${string}`

  // ─── sign authorization for Batch Contract ──────
  const authorizationListItem = eoaCode7702SignAuthorization(
    { chainId: '0x1', address: BATCH_CONTRACT, nonce: `0x1` },
    privateKey,
  )

  const txData: EOACode7702TxData = {
    nonce: 0n,
    gasLimit: 1_000_000n,
    maxFeePerGas: parseUnits('10', 9), // 10 gwei
    maxPriorityFeePerGas: parseUnits('5', 9), // 5 gwei
    to: userAddress, // Using our own wallet, which will be acting as the BATCH_CONTRACT smart contract
    value: 0n,
    data: hexToBytes(batchData),
    accessList: [],
    authorizationList: [authorizationListItem],
  }

  const tx = new EOACode7702Tx(txData, { common }).sign(privateKey)
  const { execResult } = await runTx(vm, { tx })

  console.log(
    '🔀 Batch swap DAI→WETH → your wallet:',
    execResult.exceptionError ? '❌ Failed' : '✅ Success',
  )
}

run().catch(console.error)
