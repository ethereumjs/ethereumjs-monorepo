import type { HardforksDict } from './types.ts'

export const hardforksDict: HardforksDict = {
  /**
   * Description: Start of the Ethereum main chain
   * URL        : -
   * Status     : Final
   */
  chainstart: {
    eips: [1],
  },
  /**
   * Description: Homestead hardfork with protocol and network changes
   * URL        : https://eips.ethereum.org/EIPS/eip-606
   * Status     : Final
   */
  homestead: {
    eips: [606],
  },
  /**
   * Description: DAO rescue hardfork
   * URL        : https://eips.ethereum.org/EIPS/eip-779
   * Status     : Final
   */
  dao: {
    eips: [],
  },
  /**
   * Description: Hardfork with gas cost changes for IO-heavy operations
   * URL        : https://eips.ethereum.org/EIPS/eip-608
   * Status     : Final
   */
  tangerineWhistle: {
    eips: [608],
  },
  /**
   * Description: HF with EIPs for simple replay attack protection, EXP cost increase, state trie clearing, contract code size limit
   * URL        : https://eips.ethereum.org/EIPS/eip-607
   * Status     : Final
   */
  spuriousDragon: {
    eips: [607],
  },
  /**
   * Description: Hardfork with new precompiles, instructions and other protocol changes
   * URL        : https://eips.ethereum.org/EIPS/eip-609
   * Status     : Final
   */
  byzantium: {
    eips: [609],
  },
  /**
   * Description: Postponed hardfork including EIP-1283 (SSTORE gas metering changes)
   * URL        : https://eips.ethereum.org/EIPS/eip-1013
   * Status     : Final
   */
  constantinople: {
    eips: [1013],
  },
  /**
   * Description: Aka constantinopleFix, removes EIP-1283, activate together with or after constantinople
   * URL        : https://eips.ethereum.org/EIPS/eip-1716
   * Status     : Final
   */
  petersburg: {
    eips: [1716],
  },
  /**
   * Description: HF targeted for December 2019 following the Constantinople/Petersburg HF
   * URL        : https://eips.ethereum.org/EIPS/eip-1679
   * Status     : Final
   */
  istanbul: {
    eips: [1679],
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://eips.ethereum.org/EIPS/eip-2384
   * Status     : Final
   */
  muirGlacier: {
    eips: [2384],
  },
  /**
   * Description: HF targeted for July 2020 following the Muir Glacier HF
   * URL        : https://eips.ethereum.org/EIPS/eip-2070
   * Status     : Final
   */
  berlin: {
    eips: [2565, 2929, 2718, 2930],
  },
  /**
   * Description: HF targeted for July 2021 following the Berlin fork
   * URL        : https://github.com/ethereum/eth1.0-specs/blob/master/network-upgrades/mainnet-upgrades/london.md
   * Status     : Final
   */
  london: {
    eips: [1559, 3198, 3529, 3541],
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md
   * Status     : Final
   */
  arrowGlacier: {
    eips: [4345],
  },
  /**
   * Description: Delaying the difficulty bomb to Mid September 2022
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/gray-glacier.md
   * Status     : Final
   */
  grayGlacier: {
    eips: [5133],
  },
  /**
   * Description: Hardfork to upgrade the consensus mechanism to Proof-of-Stake
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md
   * Status     : Final
   */
  paris: {
    consensus: {
      type: 'pos',
      algorithm: 'casper',
      casper: {},
    },
    eips: [3675, 4399],
  },
  /**
   * Description: Pre-merge hardfork to fork off non-upgraded clients
   * URL        : https://eips.ethereum.org/EIPS/eip-3675
   * Status     : Final
   */
  mergeNetsplitBlock: {
    eips: [],
  },
  /**
   * Description: Next feature hardfork after the merge hardfork having withdrawals, warm coinbase, push0, limit/meter initcode
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md
   * Status     : Final
   */
  shanghai: {
    eips: [3651, 3855, 3860, 4895],
  },
  /**
   * Description: Next feature hardfork after shanghai, includes proto-danksharding EIP 4844 blobs,
   * transient storage opcodes, parent beacon block root availability in EVM, selfdestruct only in
   * same transaction, and blob base fee opcode
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/cancun.md
   * Status     : Final
   */
  cancun: {
    eips: [1153, 4844, 4788, 5656, 6780, 7516],
  },
  /**
   * Description: Next feature hardfork after cancun including EIP-7702 account abstraction + other EIPs
   * URL        : https://eips.ethereum.org/EIPS/eip-7600
   * Status     : Final
   */
  prague: {
    eips: [2537, 2935, 6110, 7002, 7251, 7623, 7685, 7691, 7702],
  },
  /**
   * Description: Next feature hardfork after prague (headliner: PeerDAS)
   * URL        : https://eips.ethereum.org/EIPS/eip-7607
   * Status     : Final
   */
  osaka: {
    eips: [7594, 7823, 7825, 7883, 7939, 7951, 7918],
  },
  /**
   * Description: HF to update the blob target, max and updateFraction (see also EIP-7892)
   * URL        : TBD
   * Status     : Final
   */
  bpo1: {
    eips: [],
    params: {
      target: 10,
      max: 15,
      blobGasPriceUpdateFraction: 8346193,
    },
  },
  /**
   * Description: HF to update the blob target, max and updateFraction (see also EIP-7892)
   * URL        : TBD
   * Status     : Final
   */
  bpo2: {
    eips: [],
    params: {
      target: 14,
      max: 21,
      blobGasPriceUpdateFraction: 11684671,
    },
  },
}
