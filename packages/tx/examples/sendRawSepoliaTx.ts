import { Common, Hardfork, Sepolia } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'
import { Units, bytesToHex, getBlobs, hexToBytes, randomBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

/**
 * This example is optimized to send a raw EthereumJS tx to the Sepolia network.
 * Fee numbers should be working out on a general level, but might need to be adjusted.
 *
 * It is build to be used via CLI with plain curl to allow for sending txs also still
 * in experimental format without the need to wait for third-party compatibility
 * (Ethers or viem e.g.).
 *
 * Usage   : node examples/sendRawSepoliaTx.ts <PRIVATE_KEY>
 * Example : node examples/sendRawSepoliaTx.ts 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
 *
 * Full curl command to send the tx:
 * node examples/sendRawSepoliaTx.ts <PRIVATE_KEY> | curl -X POST -H "Content-Type: application/json" -d @- https://ethereum-sepolia-rpc.publicnode.com
 */

// The '--' is a CI internal fix
const PRIV_KEY: Uint8Array =
  process.argv[2] !== undefined && process.argv[2] !== '--'
    ? hexToBytes(process.argv[2] as PrefixedHexString)
    : randomBytes(32)
const to: PrefixedHexString = '0x0000000000000000000000000000000000000000'

const kzg = new microEthKZG(trustedSetup)
const common = new Common({ chain: Sepolia, hardfork: Hardfork.Osaka, customCrypto: { kzg } })

const txData = {
  nonce: 2,
  maxFeePerGas: Units.gwei(50),
  maxPriorityFeePerGas: Units.gwei(2),
  gasLimit: 100_000,
  maxFeePerBlobGas: Units.gwei(10),
  value: 0,
  to,
  blobs: getBlobs('This is a beautiful EthereumJS blob ❤️'),
}

const run = () => {
  const tx = createBlob4844Tx(txData, { common })
  const signedTx = tx.sign(PRIV_KEY)
  const signedTxSerialized = `${bytesToHex(signedTx.serializeNetworkWrapper())}`

  const req = `{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["${signedTxSerialized}"],"id":1}'`
  console.log(req)
}

run()
