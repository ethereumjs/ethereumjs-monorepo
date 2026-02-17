import { createBlockFromJSONRPCProvider } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const providerUrl = process.argv[2]
  const blockNumber = process.argv[3] !== undefined ? BigInt(process.argv[3]) : undefined

  if (providerUrl === undefined || blockNumber === undefined) {
    console.log('Example skipped (real-world RPC scenario)')
    console.log('Usage: npx tsx runBlockWithRPC.ts <providerUrl> <blockNumber>')
    return
  }

  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: Mainnet, customCrypto: { kzg } })

  console.log(`Fetching block ${blockNumber} from ${providerUrl}...`)
  const block = await createBlockFromJSONRPCProvider(providerUrl, blockNumber, {
    common,
    setHardfork: true,
  })

  console.log(`Block ${block.header.number} fetched from RPC`)
  console.log(`  Hash:         ${bytesToHex(block.hash())}`)
  console.log(`  Parent hash:  ${bytesToHex(block.header.parentHash)}`)
  console.log(`  State root:   ${bytesToHex(block.header.stateRoot)}`)
  console.log(`  Transactions: ${block.transactions.length}`)
  console.log(`  Hardfork:     ${block.common.hardfork()}`)
}

void main()
