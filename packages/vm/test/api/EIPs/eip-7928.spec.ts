import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runBlock } from '../../../src/index.ts'

import type { Block } from '@ethereumjs/block'
import type { AfterBlockEvent } from '../../../src/types.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)
const recipient = createZeroAddress()

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
    to: recipient,
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

describe('EIP-7928 Block Level Access Lists', () => {
  it('runBlock(generate: true) sets blockAccessListHash on the returned block', async () => {
    const vm = await createVM({ common })
    await fundSender(vm)

    let afterBlock: AfterBlockEvent | undefined
    vm.events.once('afterBlock', (event) => {
      afterBlock = event
    })

    const result = await runBlock(vm, {
      block: createTransferBlock(),
      generate: true,
      skipBlockValidation: true,
    })

    assert.isDefined(result.blockLevelAccessList)
    assert.isDefined(afterBlock)
    assert.isDefined(afterBlock!.block.header.blockAccessListHash)
    assert.isTrue(
      equalsBytes(
        afterBlock!.block.header.blockAccessListHash!,
        result.blockLevelAccessList!.hash(),
      ),
    )
    assert.isAbove(result.blockLevelAccessList!.toJSON().length, 0)
  })

  it('runBlock validates a provided blockAccessList against execution', async () => {
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

    assert.isDefined(sealedBlock)
    assert.isDefined(generated.blockLevelAccessList)

    const vm2 = await createVM({ common })
    await fundSender(vm2)

    await runBlock(vm2, {
      block: sealedBlock!,
      blockAccessList: generated.blockLevelAccessList!.toJSON(),
      skipBlockValidation: true,
    })

    assert.isTrue(
      equalsBytes(sealedBlock!.header.blockAccessListHash!, generated.blockLevelAccessList!.hash()),
    )
    assert.equal(
      bytesToHex(sealedBlock!.header.blockAccessListHash!),
      bytesToHex(generated.blockLevelAccessList!.hash()),
    )
  })
})
