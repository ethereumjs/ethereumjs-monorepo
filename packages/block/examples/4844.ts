import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { createAddressFromPrivateKey } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import { loadKZG } from 'kzg-wasm'

const main = async () => {
  const kzg = await loadKZG()

  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: {
      kzg,
    },
  })
  const blobTx = createBlob4844Tx(
    { blobsData: ['myFirstBlob'], to: createAddressFromPrivateKey(randomBytes(32)) },
    { common },
  )

  const block = createBlock(
    {
      header: {
        excessBlobGas: 0n,
      },
      transactions: [blobTx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
    },
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`,
  )
}

void main()
