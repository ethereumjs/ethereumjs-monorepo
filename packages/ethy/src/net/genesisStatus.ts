import type { ThreadedEthStatusFields } from '@ethereumjs/devp2p'

/** Genesis block hashes from go-ethereum `params/config.go` (chain configs). */
const GENESIS_HASH: Record<string, string> = {
  mainnet: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  sepolia: '0x25a5cc106302644e9e7c4a325fe1e388bcaad7e5975ba90001235fff8e803825',
  holesky: '0xbbe3132142dae6d4f2b228ad0271809e534a7252fd63b9e133a8540a0a668c4',
  hoodi: '0x8913aac5222b60bb27710b4a36a14e607ee2bc1310d5d14117245f6b5a330a2',
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
