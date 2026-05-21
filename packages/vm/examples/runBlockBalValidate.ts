import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

import type { Block } from '@ethereumjs/block'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

async function fundSender(vm: Awaited<ReturnType<typeof createVM>>) {
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
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
  await fundSender(vm)

  let sealedBlock: Block | undefined
  vm.events.once('afterBlock', (event) => {
    sealedBlock = event.block
  })

  const generated = await runBlock(vm, {
    block: createTransferBlock(),
    generate: true,
    skipBlockValidation: true,
  })

  const balJson = generated.blockLevelAccessList!.toJSON()
  console.log(`Generated BAL with ${balJson.length} account(s)`)
  console.log(`blockAccessListHash: ${bytesToHex(sealedBlock!.header.blockAccessListHash!)}`)

  const vm2 = await createVM({ common })
  await fundSender(vm2)

  await runBlock(vm2, {
    block: sealedBlock!,
    blockAccessList: balJson,
    skipBlockValidation: true,
  })

  console.log('Provided blockAccessList validated successfully against execution')
}

void main()
