[@ethereumjs/evm](../README.md) / EVMOpts

# Interface: EVMOpts

Options for instantiating a EVM.

## Table of contents

### Properties

- [allowUnlimitedContractSize](EVMOpts.md#allowunlimitedcontractsize)
- [allowUnlimitedInitCodeSize](EVMOpts.md#allowunlimitedinitcodesize)
- [blockchain](EVMOpts.md#blockchain)
- [common](EVMOpts.md#common)
- [customOpcodes](EVMOpts.md#customopcodes)
- [customPrecompiles](EVMOpts.md#customprecompiles)
- [profiler](EVMOpts.md#profiler)
- [stateManager](EVMOpts.md#statemanager)

## Properties

### allowUnlimitedContractSize

• `Optional` **allowUnlimitedContractSize**: `boolean`

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

#### Defined in

[types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L223)

___

### allowUnlimitedInitCodeSize

• `Optional` **allowUnlimitedInitCodeSize**: `boolean`

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

#### Defined in

[types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L229)

___

### blockchain

• `Optional` **blockchain**: `Blockchain`

#### Defined in

[types.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L269)

___

### common

• `Optional` **common**: `Common`

Use a Common instance for EVM instantiation.

### Supported EIPs

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes (Cancun)
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change for ETH 1.0 chain
- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - Simple subroutines for the EVM (`outdated`)
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS precompiles (removed in v4.0.0, see latest v3 release)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2565) - Transaction Types
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Save historical block hashes in state (`experimental`)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional access list tx type
- [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) - AUTH and AUTHCALL opcodes
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - Base fee Opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3540](https://eips.ethereum.org/EIPS/eip-3541) - EVM Object Format (EOF) v1 (`outdated`)
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) - Reject transactions from senders with deployed code
- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
- [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) - EOF - Code Validation (`outdated`)
- [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) - Upgrade consensus to Proof-of-Stake
- [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - Push0 opcode (Shanghai)
- [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (Shanghai)
- [EIP-4345](https://eips.ethereum.org/EIPS/eip-4345) - Difficulty Bomb Delay to June 2022
- [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
- [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) - Beacon block root in the EVM (Cancun)
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) - Shard Blob Transactions (Cancun)
- [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) - Beacon chain push withdrawals as operations (Shanghai)
- [EIP-5133](https://eips.ethereum.org/EIPS/eip-5133) - Delaying Difficulty Bomb to mid-September 2022 (Gray Glacier)
- [EIP-5656](https://eips.ethereum.org/EIPS/eip-5656) - MCOPY - Memory copying instruction (Cancun)
- [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780) - SELFDESTRUCT only in same transaction (Cancun)
- [EIP-7516](https://eips.ethereum.org/EIPS/eip-7516) - BLOBBASEFEE opcode (Cancun)

*Annotations:*

- `experimental`: behaviour can change on patch versions

#### Defined in

[types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L215)

___

### customOpcodes

• `Optional` **customOpcodes**: `CustomOpcode`[]

Override or add custom opcodes to the EVM instruction set
These custom opcodes are EIP-agnostic and are always statically added
To delete an opcode, add an entry of format `{opcode: number}`. This will delete that opcode from the EVM.
If this opcode is then used in the EVM, the `INVALID` opcode would instead be used.
To add an opcode, add an entry of the following format:
{
   // The opcode number which will invoke the custom opcode logic
   opcode: number
   // The name of the opcode (as seen in the `step` event)
   opcodeName: string
   // The base fee of the opcode
   baseFee: number
   // If the opcode charges dynamic gas, add this here. To charge the gas, use the `i` methods of the BN, to update the charged gas
   gasFunction?: function(runState: RunState, gas: BN, common: Common)
   // The logic of the opcode which holds the logic of changing the current state
   logicFunction: function(runState: RunState)
}
Note: gasFunction and logicFunction can both be async or synchronous functions

#### Defined in

[types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L251)

___

### customPrecompiles

• `Optional` **customPrecompiles**: `CustomPrecompile`[]

#### Defined in

[types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L259)

___

### profiler

• `Optional` **profiler**: `EVMProfilerOpts`

#### Defined in

[types.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L274)

___

### stateManager

• `Optional` **stateManager**: `EVMStateManagerInterface`

#### Defined in

[types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L264)
