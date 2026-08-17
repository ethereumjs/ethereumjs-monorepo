import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  createAddressFromPrivateKey,
  createAddressFromString,
  createZeroAddress,
  equalsBytes,
  generateAddress,
  hexToBytes,
  setLengthLeft,
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
  // EIP-8282: deploy stub builder request contracts (checked system calls
  // fail the block when the contracts are missing). STOP with no return
  // data yields empty builder requests.
  const stop = hexToBytes('0x00')
  for (const param of ['builderDepositContractAddress', 'builderExitContractAddress'] as const) {
    const address = createAddressFromString(
      bytesToHex(setLengthLeft(bigIntToBytes(common.param(param)), 20)),
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

  it('CREATE OOG on new-account state gas still records the created address in BAL', async () => {
    const vm = await createVM({ common })
    await fundSender(vm)

    const factory = createAddressFromString(`0x${'11'.repeat(20)}`)
    const created = createAddressFromString(
      bytesToHex(generateAddress(factory.bytes, bigIntToBytes(1n))),
    )
    // PUSH1 0 PUSH1 0 PUSH1 0 CREATE STOP
    await vm.stateManager.putAccount(factory, new Account(1n, 0n))
    await vm.stateManager.putCode(factory, hexToBytes('0x600060006000f000'))

    const intrinsic = common.param('txGas') + common.param('txRecipientAccessGas')
    const na = common.param('stateBytesPerNewAccount') * common.param('costPerStateByte')
    // CREATE regular costs (~11k + pushes) fit; new-account state gas does not.
    const gasLimit = intrinsic + 50_000n
    assert.isTrue(gasLimit < intrinsic + na)

    const parentBlock = createBlock(
      { header: { number: 1n } },
      { common, skipConsensusFormatValidation: true },
    )
    const tx = createLegacyTx({ to: factory, gasLimit, gasPrice: 10n }).sign(senderKey)
    const block = createBlock(
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

    const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    const addresses = result.blockLevelAccessList!.toJSON().map((entry) => entry.address)
    assert.isTrue(addresses.includes(created.toString()))
  })

  it('value CALL OOG before target access does not record the call target in BAL', async () => {
    const vm = await createVM({ common })
    await fundSender(vm)

    const caller = createAddressFromString(`0x${'44'.repeat(20)}`)
    const target = createAddressFromString(`0x${'55'.repeat(20)}`)
    await vm.stateManager.putAccount(caller, new Account(1n, 0n))
    // PUSH1 1 PUSH1 0 PUSH1 0 PUSH20 target GAS CALL STOP — value=1, gas=0 (OOG before target)
    await vm.stateManager.putCode(
      caller,
      concatBytes(
        hexToBytes('0x6001'),
        hexToBytes('0x6000'),
        hexToBytes('0x6000'),
        hexToBytes('0x73'),
        target.bytes,
        hexToBytes('0x5a'),
        hexToBytes('0xf1'),
        hexToBytes('0x00'),
      ),
    )

    const parentBlock = createBlock(
      { header: { number: 1n } },
      { common, skipConsensusFormatValidation: true },
    )
    const tx = createLegacyTx({ to: caller, gasLimit: 100_000n, gasPrice: 10n }).sign(senderKey)
    const block = createBlock(
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

    const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    const addresses = result.blockLevelAccessList!.toJSON().map((entry) => entry.address)
    assert.isTrue(addresses.includes(caller.toString()))
    assert.isFalse(addresses.includes(target.toString()))
  })

  it('7702 top-frame delegation OOG records the recipient and not the delegation target', async () => {
    const vm = await createVM({ common })
    await fundSender(vm)

    const target = createAddressFromString(`0x${'aa'.repeat(20)}`)
    const delegatedTo = createAddressFromString(`0x${'bb'.repeat(20)}`)
    await vm.stateManager.putAccount(target, new Account(1n, 0n))
    await vm.stateManager.putCode(target, concatBytes(hexToBytes('0xef0100'), delegatedTo.bytes))
    await vm.stateManager.putAccount(delegatedTo, new Account(1n, 0n))
    await vm.stateManager.putCode(delegatedTo, hexToBytes('0x00'))

    const intrinsic = common.param('txGas') + common.param('txRecipientAccessGas')
    const cold = common.param('coldaccountaccessGas')
    const parentBlock = createBlock(
      { header: { number: 1n } },
      { common, skipConsensusFormatValidation: true },
    )
    const tx = createLegacyTx({
      to: target,
      gasLimit: intrinsic + cold - 1n,
      gasPrice: 10n,
    }).sign(senderKey)
    const block = createBlock(
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

    const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    const addresses = result.blockLevelAccessList!.toJSON().map((entry) => entry.address)
    assert.isTrue(addresses.includes(target.toString()))
    assert.isFalse(addresses.includes(delegatedTo.toString()))
  })
})
