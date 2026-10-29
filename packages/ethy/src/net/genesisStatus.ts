import type { ThreadedEthStatusFields } from '@ethereumjs/devp2p'

/**
 * Genesis block hashes checked in ETH STATUS.
 * Sepolia and Hoodi match go-ethereum `params/config.go`. Holesky matches the
 * hash pinned in `@ethereumjs/common` hardfork tests.
 */
const GENESIS_HASH: Record<string, string> = {
  mainnet: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  sepolia: '0x25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9',
  holesky: '0xb5f7f912443c940f21fd611f12828d75b534364ed9e95ca4e307729a4661bde4',
  hoodi: '0xbbe312868b376a3001692a646dd2d7d1e4406380dfd86b98aa8a34d1557c971b',
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
    bestHash: '0x07bc64d80dba60077b5d563e91676c159dcfbe504b2ea99a7fd4895651972601',
    genesisHash: GENESIS_HASH.sepolia,
    latestBlock: '0xb7663f',
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
