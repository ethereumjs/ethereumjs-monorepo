import { Hardfork } from './enums.ts'

import type { EIPsDict } from './types.ts'

/**
 * EIP catalog for `Common`.
 *
 * `minimumHardfork` is the earliest fork where the EIP can be enabled in isolation
 * (prerequisites already present). It is not the fork that schedules the EIP — that
 * is `hardforks.ts` → `eips` — and is therefore at least one hardfork earlier.
 */
export const eipsDict: EIPsDict = {
  /**
   * Frontier/Chainstart
   * (there is no Meta-EIP currently for Frontier, so 1 was chosen)
   */
  1: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Homestead HF Meta EIP
   */
  606: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * TangerineWhistle HF Meta EIP
   */
  608: {
    minimumHardfork: Hardfork.Homestead,
  },
  /**
   * Spurious Dragon HF Meta EIP
   */
  607: {
    minimumHardfork: Hardfork.TangerineWhistle,
  },
  /**
   * Byzantium HF Meta EIP
   */
  609: {
    minimumHardfork: Hardfork.SpuriousDragon,
  },
  /**
   * Constantinople HF Meta EIP
   */
  1013: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * Petersburg HF Meta EIP
   */
  1716: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * Istanbul HF Meta EIP
   */
  1679: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * MuirGlacier HF Meta EIP
   */
  2384: {
    minimumHardfork: Hardfork.Istanbul,
  },
  /**
   * Description : DUPN, SWAPN and EXCHANGE instructions
   * URL         : https://eips.ethereum.org/EIPS/eip-8024
   * Status      : Review
   * Commit      : 34b49095
   * Date        : 2026-06-10
   */
  8024: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Transient storage opcodes
   * URL         : https://eips.ethereum.org/EIPS/eip-1153
   * Status      : Final
   * Commit      : 0904d24b
   * Date        : 2024-03-30
   */
  1153: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Fee market change for ETH 1.0 chain
   * URL         : https://eips.ethereum.org/EIPS/eip-1559
   * Status      : Final
   * Commit      : ba6c342c
   * Date        : 2023-10-04
   */
  1559: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2930],
  },
  /**
   * Description : ModExp gas cost
   * URL         : https://eips.ethereum.org/EIPS/eip-2565
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  2565: {
    minimumHardfork: Hardfork.Byzantium,
  },
  /**
   * Description : BLS12-381 precompiles
   * URL         : https://eips.ethereum.org/EIPS/eip-2537
   * Status      : Final
   * Commit      : 1dd2558f
   * Date        : 2025-05-13
   */
  2537: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Typed Transaction Envelope
   * URL         : https://eips.ethereum.org/EIPS/eip-2718
   * Status      : Final
   * Commit      : 26fa717d
   * Date        : 2022-09-19
   */
  2718: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Reduce intrinsic transaction gas (Amsterdam, experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-2780
   * Status      : Review
   * Commit      : 8331fb3e
   * Date        : 2026-08-04
   */
  2780: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [7708],
  },
  /**
   * Description : Gas cost increases for state access opcodes
   * URL         : https://eips.ethereum.org/EIPS/eip-2929
   * Status      : Final
   * Commit      : 949de374
   * Date        : 2022-05-06
   */
  2929: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Optional access lists
   * URL         : https://eips.ethereum.org/EIPS/eip-2930
   * Status      : Final
   * Commit      : 949de374
   * Date        : 2022-05-06
   */
  2930: {
    minimumHardfork: Hardfork.Istanbul,
    requiredEIPs: [2718, 2929],
  },
  /**
   * Description : Save historical block hashes in state (Verkle related usage, UNSTABLE)
   * URL         : https://eips.ethereum.org/EIPS/eip-2935
   * Status      : Final
   * Commit      : 7631693a
   * Date        : 2025-07-22
   */
  2935: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : BASEFEE opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-3198
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  3198: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Reduction in refunds
   * URL         : https://eips.ethereum.org/EIPS/eip-3529
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  3529: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2929],
  },
  /**
   * Description : EVM Object Format (EOF) v1
   * URL         : https://eips.ethereum.org/EIPS/eip-3540
   * Status      : Stagnant
   * Commit      : b57b7e83
   * Date        : 2026-02-08
   */
  3540: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3541, 3860],
  },
  /**
   * Description : Reject new contracts starting with the 0xEF byte
   * URL         : https://eips.ethereum.org/EIPS/eip-3541
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  3541: {
    minimumHardfork: Hardfork.Berlin,
  },
  /**
   * Description : Difficulty Bomb Delay to December 1st 2021
   * URL         : https://eips.ethereum.org/EIPS/eip-3554
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  3554: {
    minimumHardfork: Hardfork.MuirGlacier,
  },
  /**
   * Description : Reject transactions from senders with deployed code
   * URL         : https://eips.ethereum.org/EIPS/eip-3607
   * Status      : Final
   * Commit      : 3e56771c
   * Date        : 2025-04-16
   */
  3607: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Warm COINBASE
   * URL         : https://eips.ethereum.org/EIPS/eip-3651
   * Status      : Final
   * Commit      : c8b07fcd
   * Date        : 2023-04-19
   */
  3651: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [2929],
  },
  /**
   * Description : EOF - Code Validation
   * URL         : https://eips.ethereum.org/EIPS/eip-3670
   * Status      : Stagnant
   * Commit      : 51882145
   * Date        : 2025-09-21
   */
  3670: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540],
  },
  /**
   * Description : Upgrade consensus to Proof-of-Stake
   * URL         : https://eips.ethereum.org/EIPS/eip-3675
   * Status      : Final
   * Commit      : 49cc275d
   * Date        : 2022-09-20
   */
  3675: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : PUSH0 instruction
   * URL         : https://eips.ethereum.org/EIPS/eip-3855
   * Status      : Final
   * Commit      : aa391ae3
   * Date        : 2025-03-06
   */
  3855: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Limit and meter initcode
   * URL         : https://eips.ethereum.org/EIPS/eip-3860
   * Status      : Final
   * Commit      : 23938a18
   * Date        : 2025-04-16
   */
  3860: {
    minimumHardfork: Hardfork.SpuriousDragon,
  },
  /**
   * Description : EOF - Static relative jumps
   * URL         : https://eips.ethereum.org/EIPS/eip-4200
   * Status      : Stagnant
   * Commit      : 46c3ac7c
   * Date        : 2025-11-23
   */
  4200: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
  },
  /**
   * Description : Difficulty Bomb Delay to June 2022
   * URL         : https://eips.ethereum.org/EIPS/eip-4345
   * Status      : Final
   * Commit      : 9e393a79
   * Date        : 2022-05-06
   */
  4345: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Supplant DIFFICULTY opcode with PREVRANDAO
   * URL         : https://eips.ethereum.org/EIPS/eip-4399
   * Status      : Final
   * Commit      : da5068a1
   * Date        : 2022-09-20
   */
  4399: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : EOF - Functions
   * URL         : https://eips.ethereum.org/EIPS/eip-4750
   * Status      : Stagnant
   * Commit      : b6e04f06
   * Date        : 2025-11-23
   */
  4750: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 5450],
  },
  /**
   * Description : Beacon block root in the EVM
   * URL         : https://eips.ethereum.org/EIPS/eip-4788
   * Status      : Final
   * Commit      : 1b982df3
   * Date        : 2024-07-17
   */
  4788: {
    minimumHardfork: Hardfork.Cancun,
  },
  /**
   * Description : Shard Blob Transactions
   * URL         : https://eips.ethereum.org/EIPS/eip-4844
   * Status      : Final
   * Commit      : 70471d02
   * Date        : 2024-03-29
   */
  4844: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [1559, 2718, 2930, 4895],
  },
  /**
   * Description : Beacon chain push withdrawals as operations
   * URL         : https://eips.ethereum.org/EIPS/eip-4895
   * Status      : Final
   * Commit      : f575390d
   * Date        : 2023-04-19
   */
  4895: {
    minimumHardfork: Hardfork.Paris,
  },
  /**
   * Description : Delaying Difficulty Bomb to mid-September 2022
   * URL         : https://eips.ethereum.org/EIPS/eip-5133
   * Status      : Final
   * Commit      : 7de91c40
   * Date        : 2022-07-01
   */
  5133: {
    minimumHardfork: Hardfork.GrayGlacier,
  },
  /**
   * Description : EOF - Stack Validation
   * URL         : https://eips.ethereum.org/EIPS/eip-5450
   * Status      : Stagnant
   * Commit      : 199fb31b
   * Date        : 2025-11-23
   */
  5450: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 4200, 4750],
  },
  /**
   * Description : MCOPY - Memory copying instruction
   * URL         : https://eips.ethereum.org/EIPS/eip-5656
   * Status      : Final
   * Commit      : 30fec793
   * Date        : 2024-03-28
   */
  5656: {
    minimumHardfork: Hardfork.Shanghai,
  },
  /**
   * Description : Supply validator deposits on chain
   * URL         : https://eips.ethereum.org/EIPS/eip-6110
   * Status      : Final
   * Commit      : 0849adda
   * Date        : 2025-10-15
   */
  6110: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [7685],
  },
  /**
   * Description : EOF - JUMPF and non-returning functions
   * URL         : https://eips.ethereum.org/EIPS/eip-6206
   * Status      : Stagnant
   * Commit      : d9e2c447
   * Date        : 2025-11-23
   */
  6206: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [4750, 5450],
  },
  /**
   * Description : SELFDESTRUCT only in same transaction
   * URL         : https://eips.ethereum.org/EIPS/eip-6780
   * Status      : Final
   * Commit      : 688e939c
   * Date        : 2024-03-30
   */
  6780: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Execution layer triggerable withdrawals (experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-7002
   * Status      : Final
   * Commit      : d8bf2fad
   * Date        : 2025-11-12
   */
  7002: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
  },
  /**
   * Description : Revamped CALL instructions
   * URL         : https://eips.ethereum.org/EIPS/eip-7069
   * Status      : Stagnant
   * Commit      : 9ea86a73
   * Date        : 2025-11-23
   */
  7069: {
    minimumHardfork: Hardfork.Berlin,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 150 - This is the entire Tangerine Whistle hardfork
      EIP 211 - (RETURNDATASIZE / RETURNDATACOPY) - Included in Byzantium
      EIP 214 - (STATICCALL) - Included in Byzantium
    */
    requiredEIPs: [2929],
  },
  /**
   * Description : Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-7251
   * Status      : Final
   * Commit      : dd45f094
   * Date        : 2025-05-15
   */
  7251: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
  },
  /**
   * Description : EOF - Data section access instructions
   * URL         : https://eips.ethereum.org/EIPS/eip-7480
   * Status      : Stagnant
   * Commit      : 83274180
   * Date        : 2025-11-23
   */
  7480: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
  },
  /**
   * Description : BLOBBASEFEE opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-7516
   * Status      : Final
   * Commit      : a4fecf3f
   * Date        : 2026-04-07
   */
  7516: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
  },
  /**
   * Description : Peerdas blob transactions
   * URL         : https://eips.ethereum.org/EIPS/eip-7594
   * Status      : Final
   * Commit      : eda011bd
   * Date        : 2026-02-04
   */
  7594: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
  },
  /**
   * Description : EOF Contract Creation
   * URL         : https://eips.ethereum.org/EIPS/eip-7620
   * Status      : Stagnant
   * Commit      : 88301956
   * Date        : 2025-11-23
   */
  7620: {
    minimumHardfork: Hardfork.London,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 170 - (Max contract size) - Included in Spurious Dragon
    */
    requiredEIPs: [3540, 3541, 3670],
  },
  /**
   * Description : Increase calldata cost to reduce maximum block size
   * URL         : https://eips.ethereum.org/EIPS/eip-7623
   * Status      : Final
   * Commit      : 451cd9e1
   * Date        : 2025-05-16
   */
  7623: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : General purpose execution layer requests
   * URL         : https://eips.ethereum.org/EIPS/eip-7685
   * Status      : Final
   * Commit      : 1cbdd678
   * Date        : 2025-05-16
   */
  7685: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [3675],
  },
  /**
   * Description : Blob throughput increase
   * URL         : https://eips.ethereum.org/EIPS/eip-7691
   * Status      : Final
   * Commit      : 73d4ca3a
   * Date        : 2025-05-16
   */
  7691: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
  },
  /**
   * Description : Blob base fee bounded by execution cost
   * URL         : https://eips.ethereum.org/EIPS/eip-7918
   * Status      : Final
   * Commit      : 684c90ff
   * Date        : 2026-02-04
   */
  7918: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
  },
  /**
   * Description : EVM Object Format (EOFv1) Meta
   * URL         : https://eips.ethereum.org/EIPS/eip-7692
   * Status      : Stagnant
   * Commit      : ac0de245
   * Date        : 2025-11-09
   */
  7692: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7698],
  },
  /**
   * Description : EOF - Creation transaction
   * URL         : https://eips.ethereum.org/EIPS/eip-7698
   * Status      : Stagnant
   * Commit      : c6fb81f6
   * Date        : 2025-09-28
   */
  7698: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 7620],
  },
  /**
   * Description : Set EOA account code for one transaction
   * URL         : https://eips.ethereum.org/EIPS/eip-7702
   * Status      : Final
   * Commit      : bbc3f958
   * Date        : 2025-10-07
   */
  7702: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [2718, 2929, 2930],
  },
  /**
   * Description : Set upper bounds for MODEXP
   * URL         : https://eips.ethereum.org/EIPS/eip-7823
   * Status      : Final
   * Commit      : b55cdb0e
   * Date        : 2026-01-21
   */
  7823: {
    minimumHardfork: Hardfork.Byzantium,
  },
  /**
   * Description : Use historical block hashes saved in state for BLOCKHASH
   * URL         : https://eips.ethereum.org/EIPS/eip-7709
   * Status      : Draft
   * Commit      : 6a3b988b
   * Date        : 2026-08-12
   */
  7709: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [2935],
  },
  /**
   * Description : Transaction Gas Limit Cap
   * URL         : https://eips.ethereum.org/EIPS/eip-7825
   * Status      : Final
   * Commit      : b55cdb0e
   * Date        : 2026-01-21
   */
  7825: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Ethereum state using a unified binary tree (experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-7864
   * Status      : Draft
   * Commit      : 378d36bc
   * Date        : 2026-06-24
   */
  7864: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : EIP-7883: ModExp Gas Cost Increase
   * URL         : https://eips.ethereum.org/EIPS/eip-7883
   * Status      : Final
   * Commit      : b55cdb0e
   * Date        : 2026-01-21
   */
  7883: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Block-level gas accounting without refunds
   * URL         : https://eips.ethereum.org/EIPS/eip-7778
   * Status      : Review
   * Commit      : 295064f7
   * Date        : 2026-07-10
   */
  7778: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Block Level Access Lists (BAL)
   * URL         : https://eips.ethereum.org/EIPS/eip-7928
   * Status      : Review
   * Commit      : 6c666b8d
   * Date        : 2026-07-09
   */
  7928: {
    minimumHardfork: Hardfork.Prague,
    requiredEIPs: [],
  },
  /**
   * Description : Count leading zeros (CLZ) opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-7939
   * Status      : Final
   * Commit      : b55cdb0e
   * Date        : 2026-01-21
   */
  7939: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Precompile for secp256r1 Curve Support
   * URL         : https://eips.ethereum.org/EIPS/eip-7951
   * Status      : Final
   * Commit      : b55cdb0e
   * Date        : 2026-01-21
   */
  7951: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : RLP Execution Block Size Limit
   * URL         : https://eips.ethereum.org/EIPS/eip-7934
   * Status      : Final
   * Commit      : ef39b609
   * Date        : 2026-01-21
   */
  7934: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : ETH transfers emit a log
   * URL         : https://eips.ethereum.org/EIPS/eip-7708
   * Status      : Review
   * Commit      : f7230c46
   * Date        : 2026-07-10
   */
  7708: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [1559, 4788, 6780],
  },
  /**
   * Description : SLOTNUM opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-7843
   * Status      : Review
   * Commit      : 115174e3
   * Date        : 2026-08-05
   */
  7843: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [],
  },
  /**
   * Description : Increase max contract code size (24 → 32 KiB) and initcode size (48 → 64 KiB)
   * URL         : https://eips.ethereum.org/EIPS/eip-7954
   * Status      : Review
   * Commit      : fcef3c3c
   * Date        : 2026-07-08
   */
  7954: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Increase calldata floor cost
   * URL         : https://eips.ethereum.org/EIPS/eip-7976
   * Status      : Review
   * Commit      : c998ef94
   * Date        : 2026-07-08
   */
  7976: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [7623],
  },
  /**
   * Description : Access list data pricing
   * URL         : https://eips.ethereum.org/EIPS/eip-7981
   * Status      : Review
   * Commit      : 747b78c0
   * Date        : 2026-07-07
   */
  7981: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [2930, 7976],
  },
  /**
   * Description : Deterministic CREATE2 factory predeploy (Amsterdam, experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-7997
   * Status      : Review
   * Commit      : e239a2e8
   * Date        : 2026-07-17
   */
  7997: {
    // CREATE2 (EIP-1014) is Constantinople; factory bytecode needs nothing later.
    minimumHardfork: Hardfork.Constantinople,
    requiredEIPs: [],
  },
  /**
   * Description : State Creation Gas Cost Increase
   * URL         : https://eips.ethereum.org/EIPS/eip-8037
   * Status      : Review
   * Commit      : 5a8c8089
   * Date        : 2026-07-31
   */
  8037: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [2780, 6780, 7702, 7825, 7976, 7981],
  },
  /**
   * Description : State Access Gas Cost Increase (Amsterdam, experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-8038
   * Status      : Review
   * Commit      : 8331fb3e
   * Date        : 2026-08-04
   */
  8038: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [2929],
  },
  /**
   * Description : SELFDESTRUCT no burn (Amsterdam, experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-8246
   * Status      : Review
   * Commit      : 45b443dc
   * Date        : 2026-05-22
   */
  8246: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [6780],
  },
  /**
   * Description : Builder execution requests (Amsterdam, experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-8282
   * Status      : Review
   * Commit      : 2d3c5e59
   * Date        : 2026-08-10
   */
  8282: {
    minimumHardfork: Hardfork.Amsterdam,
    requiredEIPs: [7685],
  },
}
