[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMOpts

# Interface: EVMOpts

Defined in: [types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L192)

Options for instantiating a [EVM](../classes/EVM.md).

## Properties

### allowUnlimitedContractSize?

> `optional` **allowUnlimitedContractSize**: `boolean`

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L248)

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

***

### allowUnlimitedInitCodeSize?

> `optional` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L254)

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

***

### blockchain?

> `optional` **blockchain**: [`EVMMockBlockchainInterface`](EVMMockBlockchainInterface.md)

Defined in: [types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L367)

The EVM comes with a basic mock blockchain interface and implementation for
non-block containing use cases.

For block-containing setups use the full blockchain implementation from the
`@ethereumjs/blockchain package.

***

### bls?

> `optional` **bls**: [`EVMBLSInterface`](../type-aliases/EVMBLSInterface.md)

Defined in: [types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L324)

For the EIP-2537 BLS Precompiles, the native JS `ethereum-cryptography` (`@noble/curves`)
https://github.com/ethereum/js-ethereum-cryptography BLS12-381 curve implementation
is used (see `noble.ts` file in the `precompiles/bls12_381/` folder).

To use an alternative implementation this option can be used by passing
in a wrapper implementation integrating the desired library and adhering
to the `EVMBLSInterface` specification.

An interface for the MCL WASM implementation https://github.com/herumi/mcl-wasm
is shipped with this library which can be used as follows (with `mcl-wasm` being
explicitly added to the set of dependencies):

```ts
import * as mcl from 'mcl-wasm'

await mcl.init(mcl.BLS12_381)
const evm = await createEVM({ bls: new MCLBLS(mcl) })
```

***

### bn254?

> `optional` **bn254**: [`EVMBN254Interface`](../type-aliases/EVMBN254Interface.md)

Defined in: [types.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L347)

For the EIP-196/EIP-197 BN254 (alt_BN128) EC precompiles, the native JS `ethereum-cryptography`
(`@noble/curves`) https://github.com/ethereum/js-ethereum-cryptography BN254 curve implementation
is used (see `noble.ts` file in the `precompiles/bn254/` folder).

To use an alternative implementation this option can be used by passing
in a wrapper implementation integrating the desired library and adhering
to the `EVMBN254Interface` specification.

An interface for a WASM wrapper https://github.com/ethereumjs/rustbn.js around the
Parity fork of the Zcash bn pairing cryptography library is shipped with this library
which can be used as follows (with `rustbn.js` being explicitly added to the set of
dependencies):

```ts
import { initRustBN } from 'rustbn-wasm'

const bn254 = await initRustBN()
const evm = await createEVM({ bn254: new RustBN254(bn254) })
```

***

### cliqueSigner()?

> `optional` **cliqueSigner**: (`header`) => `Address`

Defined in: [types.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L379)

When running the EVM with PoA consensus, the `cliqueSigner` function from the `@ethereumjs/block` class
must be provided along with a `BlockHeader` so that the coinbase can be correctly retrieved when the
`Interpreter.getBlockCoinbase` method is called.

#### Parameters

##### header

###### baseFeePerGas?

`bigint`

###### coinbase

`Address`

###### difficulty

`bigint`

###### gasLimit

`bigint`

###### number

`bigint`

###### prevRandao

`Uint8Array`

###### timestamp

`bigint`

###### getBlobGasPrice

#### Returns

`Address`

***

### common?

> `optional` **common**: `Common`

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L240)

Use a Common instance for EVM instantiation.

### Supported EIPs

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes (Cancun)
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change for ETH 1.0 chain
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - Precompile for BLS12-381 curve operations (Prague)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed Transaction Envelope
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Serve historical block hashes from state (Prague)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional access list tx type
- [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) - AUTH and AUTHCALL opcodes
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - Base fee Opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) - Reject transactions from senders with deployed code
- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
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
- [EIP-6110](https://eips.ethereum.org/EIPS/eip-6110) - Supply validator deposits on chain (Prague)
- [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780) - SELFDESTRUCT only in same transaction (Cancun)
- [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) - Execution layer triggerable exits (Prague)
- [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) - Increase the MAX_EFFECTIVE_BALANCE (Prague)
- [EIP-7516](https://eips.ethereum.org/EIPS/eip-7516) - BLOBBASEFEE opcode (Cancun)
- [EIP-7623](https://eips.ethereum.org/EIPS/eip-7623) - Increase calldata cost (Prague)
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) - General purpose execution layer requests (Prague)
- [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) - Blob throughput increase (Prague)
- [EIP-7692](https://eips.ethereum.org/EIPS/eip-7692) - EVM Object Format (EOF) v1 (`experimental`)
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) - Set EOA account code (Prague)
- [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) - Read BLOCKHASH from storage and update cost (Verkle)
- [EIP-7934](https://eips.ethereum.org/EIPS/eip-7934) - RLP Execution Block Size Limit

*Annotations:*

- `experimental`: behaviour can change on patch versions

***

### customOpcodes?

> `optional` **customOpcodes**: `CustomOpcode`[]

Defined in: [types.ts:294](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L294)

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

***

### customPrecompiles?

> `optional` **customPrecompiles**: `CustomPrecompile`[]

Defined in: [types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L302)

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: [types.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L272)

EVM parameters sorted by EIP can be found in the exported `paramsEVM` dictionary,
which is internally passed to the associated `@ethereumjs/common` instance which
manages parameter selection based on the hardfork and EIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsEVM))
params['1679']['bn254AddGas'] = 100 // 150
```

***

### profiler?

> `optional` **profiler**: `EVMProfilerOpts`

Defined in: [types.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L372)

***

### stateManager?

> `optional` **stateManager**: `StateManagerInterface`

Defined in: [types.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L358)
