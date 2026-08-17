import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, createBlockLevelAccessListFromJSON } from '@ethereumjs/util'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

  const balJson = [
    {
      address: '0x0000000000000000000000000000000000000001',
      storageChanges: [],
      storageReads: [],
      balanceChanges: [{ blockAccessIndex: '0x01', postBalance: '0x03e8' }],
      nonceChanges: [],
      codeChanges: [],
    },
  ]

  const bal = createBlockLevelAccessListFromJSON(balJson)
  const block = createBlock(
    {
      header: {
        blockAccessListHash: bal.hash(),
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  console.log(`blockAccessListHash: ${bytesToHex(block.header.blockAccessListHash!)}`)
  console.log(`matches BAL hash: ${bytesToHex(bal.hash())}`)
  console.log(`hash length: ${block.header.blockAccessListHash!.length} bytes`)
}

void main()
