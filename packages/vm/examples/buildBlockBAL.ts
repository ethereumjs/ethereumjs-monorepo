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
import { buildBlock, createVM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  const parentBlock = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n } },
    { common, skipConsensusFormatValidation: true },
  )
  const blockBuilder = await buildBlock(vm, {
    parentBlock,
    headerData: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      freeze: false,
      skipConsensusFormatValidation: true,
      putBlockIntoBlockchain: false,
    },
  })

  const pk = hexToBytes('0x26f81cbcffd3d23eace0bb4eac5274bb2f576d310ee85318b5428bf9a71fc89a')
  const address = createAddressFromPrivateKey(pk)
  await vm.stateManager.putAccount(address, new Account(0n, 0xfffffffffn))
  const tx = createLegacyTx(
    { gasLimit: 300_000n, gasPrice: 75n, value: 1n, to: createZeroAddress() },
    { common },
  ).sign(pk)
  await blockBuilder.addTransaction(tx)

  const { block, blockLevelAccessList } = await blockBuilder.build()
  const bal = blockLevelAccessList!
  console.log(`Built a block with hash ${bytesToHex(block.hash())}`)
  console.log(`slotNumber: ${block.header.slotNumber}`)
  console.log(`blockAccessListHash: ${bytesToHex(block.header.blockAccessListHash!)}`)
  console.log(`BAL accounts: ${bal.toJSON().length}`)
  const senderEntry = bal.get(address)
  console.log(`Sender nonce changes: ${senderEntry?.nonceChanges.size ?? 0}`)
}

void main()
