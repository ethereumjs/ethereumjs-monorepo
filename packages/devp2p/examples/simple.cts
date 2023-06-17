import { Chain, Common } from '@ethereumjs/common'
import chalk from 'chalk'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils.js'

import { DPT } from '../dist/cjs/index.js'

const PRIVATE_KEY = 'd772e3d6a001a38064dd23964dd2836239fa0e6cec8b28972a87460a17210fe9'

const config = new Common({ chain: Chain.Mainnet })
const bootstrapNodes = config.bootstrapNodes()
const BOOTNODES = bootstrapNodes.map((node: any) => {
  return {
    address: node.ip,
    udpPort: node.port,
    tcpPort: node.port,
  }
})

const dpt = new DPT(hexToBytes(PRIVATE_KEY), {
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null,
  },
})

/* eslint-disable no-console */
dpt.on('error', (err) => console.error(chalk.red(err.stack ?? err)))

dpt.on('peer:added', (peer) => {
  const info = `(${bytesToHex(peer.id)},${peer.address},${peer.udpPort},${peer.tcpPort})`
  console.log(chalk.green(`New peer: ${info} (total: ${dpt.getPeers().length})`))
})

dpt.on('peer:removed', (peer) => {
  console.log(chalk.yellow(`Remove peer: ${bytesToHex(peer.id)} (total: ${dpt.getPeers().length})`))
})

// for accept incoming connections uncomment next line
// dpt.bind(30303, '0.0.0.0')

for (const bootnode of BOOTNODES) {
  dpt.bootstrap(bootnode).catch((err) => console.error(chalk.bold.red(err.stack ?? err)))
}
