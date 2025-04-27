import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { EOACode7702Tx } from '@ethereumjs/tx'
import {
  Address,
  EOACode7702AuthorizationListItemUnsigned,
  PrefixedHexString,
  createAddressFromPrivateKey,
  eoaCode7702SignAuthorization,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'
import { Interface, parseEther, parseUnits } from 'ethers'
import { TxData } from '../../../tx/dist/esm/7702/tx'

async function runBatched7702() {
  // ─── setup ──────────────────────────────────────────────────────────────
  const privateKey = hexToBytes(
    '0x1122334455667788112233445566778811223344556677881122334455667788',
  )
  const userAddress = createAddressFromPrivateKey(privateKey)
  console.log('EOA:', userAddress.toString())

  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    eips: [7702],
  })
  const stateManager = new RPCStateManager({
    provider: 'YOUR_PROVIDER_URL',
    blockTag: 22_000_000n, // Example block number
  })
  const vm = await createVM({ common, stateManager })

  // ─── constants & ABIs ───────────────────────────────────────────────────
  const TOKEN = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ROUTER = '0x66a9893cc07d91d95644aedd05d03f95e1dba8af'
  const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  const COLD_WALLET = `0x${'42'.repeat(20)}`

  const erc20Abi = ['function approve(address,uint256)']
  const routerAbi = ['function swapExactTokensForETH(uint256,uint256,address[],address,uint256)']
  const wethAbi = ['function deposit()', 'function transfer(address,uint256)']
  const batchAbi = ['function executeBatch(bytes[] calldata calls) external']

  const erc20 = new Interface(erc20Abi)
  const router = new Interface(routerAbi)
  const weth = new Interface(wethAbi)
  const batch = new Interface(batchAbi)
  const BATCH_CONTRACT = '0xYourBatchContractAddressHere'

  // ─── parameters ─────────────────────────────────────────────────────────
  const amountIn = parseUnits('1', 18) // 1 DAI
  const amountOutMin = 0n
  const deadline = BigInt(Math.floor(Date.now() / 1e3) + 20 * 60)

  // ─── build individual call-bytes ────────────────────────────────────────
  const callApprove = erc20.encodeFunctionData('approve', [ROUTER, amountIn]) as PrefixedHexString

  const callSwap = router.encodeFunctionData('swapExactTokensForETH', [
    amountIn,
    amountOutMin,
    [TOKEN, WETH],
    userAddress.toString(),
    deadline,
  ]) as PrefixedHexString

  const callDeposit = weth.encodeFunctionData('deposit', []) as PrefixedHexString
  const callTransfer = weth.encodeFunctionData('transfer', [
    COLD_WALLET,
    parseEther('1'),
  ]) as PrefixedHexString

  const calls = [callApprove, callSwap, callDeposit, callTransfer].map(hexToBytes) // bytes[]

  // ─── sign four 7702 authorizations ──────────────────────────────────────
  const auths = [
    { address: TOKEN, nonce: '0x0' },
    { address: ROUTER, nonce: '0x1' },
    { address: WETH, nonce: '0x2' },
    { address: WETH, nonce: '0x3' },
  ].map(({ address, nonce }) => {
    const unsigned: EOACode7702AuthorizationListItemUnsigned = {
      chainId: '0x1',
      address: address as PrefixedHexString,
      nonce: nonce as PrefixedHexString,
    }
    return eoaCode7702SignAuthorization(unsigned, privateKey)
  })

  // ─── one single 7702 tx ─────────────────────────────────────────────────
  const batchData = batch.encodeFunctionData('executeBatch', [calls]) as PrefixedHexString

  const txData: TxData = {
    nonce: 0n,
    gasLimit: 800_000n,
    maxFeePerGas: 50_000_000_000n,
    maxPriorityFeePerGas: 5_000_000_000n,
    to: new Address(hexToBytes(BATCH_CONTRACT)),
    value: 0n,
    data: hexToBytes(batchData),
    authorizationList: auths,
  }

  const tx = new EOACode7702Tx(txData, { common }).sign(privateKey)
  const result = await runTx(vm, { tx })

  console.log('🔀 Batch 7702:', result.execResult.exceptionError ? '❌' : '✅')
}

runBatched7702().catch(console.error)
