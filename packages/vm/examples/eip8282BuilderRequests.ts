import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  CLRequestType,
  bigIntToBytes,
  bytesToHex,
  createAddressFromPrivateKey,
  createAddressFromString,
  createZeroAddress,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

async function seedBuilderRequestContracts(vm: Awaited<ReturnType<typeof createVM>>) {
  // Checked system calls: validating a block fails when these contracts are missing.
  // STOP with no return data yields empty builder deposit/exit requests.
  const stop = hexToBytes('0x00')
  for (const param of ['builderDepositContractAddress', 'builderExitContractAddress'] as const) {
    const address = createAddressFromString(
      bytesToHex(setLengthLeft(bigIntToBytes(vm.common.param(param)), 20)),
    )
    await vm.stateManager.putAccount(address, new Account(1n, 0n))
    await vm.stateManager.putCode(address, stop)
  }
}

function createTransferBlock() {
  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  return createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )
}

const main = async () => {
  const vm = await createVM({ common })
  console.log(
    `Builder deposit contract: ${bytesToHex(setLengthLeft(bigIntToBytes(vm.common.param('builderDepositContractAddress')), 20))}`,
  )
  console.log(
    `Builder exit contract:    ${bytesToHex(setLengthLeft(bigIntToBytes(vm.common.param('builderExitContractAddress')), 20))}`,
  )

  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
  await seedBuilderRequestContracts(vm)

  const result = await runBlock(vm, {
    block: createTransferBlock(),
    generate: true,
    skipBlockValidation: true,
  })

  const builderRequests = (result.requests ?? []).filter(
    (req) => req.type === CLRequestType.BuilderDeposit || req.type === CLRequestType.BuilderExit,
  )

  for (const req of builderRequests) {
    const label = req.type === CLRequestType.BuilderDeposit ? 'BuilderDeposit' : 'BuilderExit'
    console.log(`${label} (type ${req.type}): ${req.data.length} byte(s)`)
  }

  console.log(`requestsHash: ${bytesToHex(result.requestsHash!)}`)
}

void main()
