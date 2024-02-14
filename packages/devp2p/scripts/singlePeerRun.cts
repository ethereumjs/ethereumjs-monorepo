import { randomBytes } from '@ethereumjs/util'
import { Chain, Common } from '@ethereumjs/common'
import * as devp2p from '../dist/cjs/index.js'

const PEER_ADDRESS = '[ADD_REMOTE_PEER_IP]'
const PEER_PORT = 30303
const ETH_PROTOCOL = devp2p.ETH.eth66

const PRIVATE_KEY = randomBytes(32)

const common = new Common({ chain: Chain.Sepolia })

const dpt = new devp2p.DPT(PRIVATE_KEY, {
  refreshInterval: 30000,
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null,
  },
  shouldFindNeighbours: false,
  shouldGetDnsPeers: false,
})

const rlpx = new devp2p.RLPx(PRIVATE_KEY, {
  dpt,
  maxPeers: 1,
  capabilities: [ETH_PROTOCOL],
  common,
})

const run = async () => {
  // Emits 'peer:new' on success, rlpx listens and
  // calls into `rlpx.connect
  await dpt.addPeer({
    address: PEER_ADDRESS,
    udpPort: PEER_PORT,
    tcpPort: PEER_PORT,
  })
}

run()
