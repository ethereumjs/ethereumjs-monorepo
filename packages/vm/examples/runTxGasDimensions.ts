import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, estimateTxGasDimensions, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      gasLimit: 300_000n,
      gasPrice: 10n,
      value: 1n,
      to: recipient,
    },
    { common },
  ).sign(senderKey)

  const estimate = await estimateTxGasDimensions(vm, tx)
  console.log(`Estimate regular/floor: ${estimate.minimumGasLimit}`)
  console.log(`Estimate first-touch state: ${estimate.estimatedStateGas}`)
  console.log(`Recommended gasLimit: ${estimate.recommendedGasLimit}`)

  const res = await runTx(vm, { tx, block })

  console.log(`Sender paid (totalGasSpent):     ${res.totalGasSpent}`)
  console.log(`Block counts (blockGasSpent):    ${res.blockGasSpent}`)
  console.log(`Regular dimension (txRegularGas): ${res.txRegularGas}`)
  console.log(`State dimension (txStateGas):     ${res.txStateGas}`)
}

void main()
