import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  concatBytes,
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  createContractAddress2,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

/** EIP-7997 deterministic CREATE2 factory (Nick's deployer). */
const FACTORY_ADDRESS = createAddressFromString('0x4e59b44847b379578588920ca78fbf26c0b4956c')

/** Runtime code from [EIP-7997](https://eips.ethereum.org/EIPS/eip-7997). */
const FACTORY_RUNTIME = hexToBytes(
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',
)

/** Initcode that returns two `PUSH0` bytes (`0x5f5f`) as deployed runtime code. */
const INITCODE = hexToBytes('0x615f5f60005260026000f3')

const SALT = new Uint8Array(32)

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  // Catalog-only EIP: EthereumJS does not inject the factory at the fork boundary.
  await vm.stateManager.putAccount(FACTORY_ADDRESS, createAccount({ nonce: 1n, balance: 0n }))
  await vm.stateManager.putCode(FACTORY_ADDRESS, FACTORY_RUNTIME)

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const expected = createContractAddress2(FACTORY_ADDRESS, SALT, INITCODE)
  const calldata = concatBytes(SALT, INITCODE)

  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      to: FACTORY_ADDRESS,
      gasLimit: 500_000n,
      gasPrice: 10n,
      data: calldata,
    },
    { common },
  ).sign(senderKey)

  const result = await runTx(vm, { block, tx })
  if (result.execResult.exceptionError !== undefined) {
    throw new Error(`factory call failed: ${result.execResult.exceptionError.error}`)
  }

  const deployedCode = await vm.stateManager.getCode(expected)
  console.log(`Expected CREATE2 address: ${expected}`)
  console.log(`Deployed runtime code (${deployedCode.length} bytes): ${bytesToHex(deployedCode)}`)
}

void main()
