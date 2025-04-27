import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { EOACode7702Tx } from '@ethereumjs/tx'
import {
  Address,
  PrefixedHexString,
  createAddressFromPrivateKey,
  eoaCode7702SignAuthorization,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'
import { AbiCoder, Interface, parseEther, parseUnits } from 'ethers'
import { TxData } from '../../../tx/dist/esm/7702/tx'

async function run() {
  // ─── your EOA key & address ───────────────────────────────────────────
  const privateKeyHex = '0x1122334455667788112233445566778811223344556677881122334455667788'
  const privateKey = hexToBytes(privateKeyHex)
  const userAddress = createAddressFromPrivateKey(privateKey)
  console.log('EOA:', userAddress.toString())

  // ─── set up EthereumJS VM with EIP-7702 enabled ───────────────────────
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    eips: [7702],
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
  const BATCH_CONTRACT = '0xYourBatchContractAddressHere'

  const erc20Abi = [
    'function approve(address _spender, uint256 _amount) external returns (bool success)',
    'function transfer(address _to, uint256 _value) public returns (bool success)',
  ]
  const routerAbi = ['function exactInput(bytes)']
  const batchAbi = ['function executeBatch(bytes[] calldata) external']

  const erc20 = new Interface(erc20Abi)
  const router = new Interface(routerAbi)
  const batchContract = new Interface(batchAbi)

  // ─── trade parameters ────────────────────────────────────────────────
  const amountIn = parseUnits('10000', 18) // 10000 DAI
  const amountOutMin = parseEther('4') // expect at least 4 WETH

  // ─── encode your two sub-calls ───────────────────────────────────────
  const callApprove = erc20.encodeFunctionData('approve', [
    UNISWAP_V3_ROUTER,
    amountIn,
  ]) as PrefixedHexString

  // ─── encode your swap call data ───────────────────────────────────
  const uniswapV3SwapCallData = `0xYourSwapCallDataHere`

  const callSwap = router.encodeFunctionData('exactInput', [
    uniswapV3SwapCallData,
  ]) as PrefixedHexString

  const callTransfer = router.encodeFunctionData('transfer', [
    COLD_WALLET,
    amountOutMin,
  ]) as PrefixedHexString

  const calls = [callApprove, callSwap, callTransfer].map(hexToBytes)

  // ─── sign one authorization each for DAI approve & router swap ──────
  const targets: PrefixedHexString[] = [DAI, UNISWAP_V3_ROUTER, WETH]
  const auths = targets.map((address, i) =>
    eoaCode7702SignAuthorization({ chainId: '0x1', address, nonce: `0x${i}` }, privateKey),
  )

  // ─── build & send your single 7702 tx ───────────────────────────────
  const batchData = batchContract.encodeFunctionData('executeBatch', [calls]) as `0x${string}`

  const txData: TxData = {
    nonce: 0n,
    gasLimit: 300_000n,
    maxFeePerGas: 50_000_000_000n,
    maxPriorityFeePerGas: 5_000_000_000n,
    to: BATCH_CONTRACT,
    value: 0n,
    data: hexToBytes(batchData),
    accessList: [],
    authorizationList: auths,
  }

  const tx = new EOACode7702Tx(txData, { common }).sign(privateKey)
  const { execResult } = await runTx(vm, { tx })

  console.log(
    '🔀 Batch swap DAI→WETH → your wallet:',
    execResult.exceptionError ? '❌ Failed' : '✅ Success',
  )
}

run().catch(console.error)
