import type { ThreadedEthStatusFields } from '@ethereumjs/devp2p'

/** Genesis block hashes from go-ethereum `params/config.go` (chain configs). */
const GENESIS_HASH: Record<string, string> = {
  mainnet: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  sepolia: '0x25a5cc106302644e9e7c4a325fe1e388bcaad7e5975ba90001235fff8e803825',
  holesky: '0xbbe3132142dae6d4f2b228ad0271809e534a7252fd63b9e133a8540a0a668c4',
  hoodi: '0x8913aac5222b60bb27710b4a36a14e607ee2bc1310d5d14117245f6b5a330a2',
}

/**
 * Recent chain heads for outbound ETH STATUS (eth/69+ block range and Geth head checks).
 * Refresh when bumping EthereumJS / EST or before long-lived testnet soaks.
 */
const HANDSHAKE_HEAD_PIN: Record<string, ThreadedEthStatusFields> = {
  mainnet: {
    td: '0x01',
    bestHash: '0x7c0bee0740f85374dfabf3317f80a398b8e2cb0eccc2b4b257a30ccb5ce03165',
    genesisHash: GENESIS_HASH.mainnet,
    latestBlock: '0x1912a62',
  },
  sepolia: {
    td: '0x01',
    bestHash: '0x3a820db395c5c5b7b02a9c4933dfcbe9c4f7e8e50d31da3f6a61e28f995ffdaa',
    genesisHash: GENESIS_HASH.sepolia,
    latestBlock: '0xb74961',
  },
}

/** Minimal STATUS fields for threaded devp2p worker init at genesis. */
export function genesisStatusFields(network: string): ThreadedEthStatusFields {
  const key = network.toLowerCase()
  const genesisHash = GENESIS_HASH[key]
  if (genesisHash === undefined) {
    throw new Error(`No genesis STATUS for network ${network}`)
  }
  return {
    td: '0x00',
    bestHash: genesisHash,
    genesisHash,
    latestBlock: '0x00',
  }
}

/** STATUS fields for live P2P handshake (pinned head when available). */
export function p2pHandshakeStatusFields(network: string): ThreadedEthStatusFields {
  const key = network.toLowerCase()
  const pin = HANDSHAKE_HEAD_PIN[key]
  if (pin !== undefined) return { ...pin }
  return genesisStatusFields(network)
}
