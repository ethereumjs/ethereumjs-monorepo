# EIP-7702 Examples for EthereumJS

This directory contains examples demonstrating how to use [EIP-7702](https://eip7702.io/) with the EthereumJS libraries. EIP-7702 allows EOAs (Externally Owned Accounts) to set their code based on existing smart contracts, giving them capabilities similar to smart contract accounts without the need to deploy a separate contract.

## What is EIP-7702?

EIP-7702 gives EOAs superpowers by allowing them to set their code based on any existing smart contract. An EOA owner signs an authorization that can then be submitted by anyone as part of a new transaction type. This enables EOAs to mimic smart contract accounts, enabling features like:

- Transaction bundling (execute multiple actions in one transaction)
- Gas sponsorships
- Custom permissioning schemes

The EOA's code will be valid until replaced by another authorization, and the authorization can be given for a single chain or all chains at once.

## Benefits of EIP-7702

- **Better User Experience**: Users can execute multiple operations atomically in one transaction
- **Gas Efficiency**: Reduce gas costs by combining multiple transactions
- **No Contract Deployment**: Use existing smart contract implementations without deploying your own
- **Flexibility**: Users can provide both single-chain and cross-chain authorizations
- **Compatible with EIP-4337**: Works with account abstraction infrastructure like paymasters and bundlers
- **Compatible with Existing Smart Accounts**: Use existing smart account implementations with little to no effort

## Examples

### 1. Enabling EIP-7702 in the VM (`eip7702-enable.ts`)

This example demonstrates:
- How to enable EIP-7702 in the EthereumJS VM
- Creating and processing an EIP-7702 transaction
- Verifying the EOA's code has been set correctly

### 2. Atomic ERC20 Operations (`eip7702-erc20-atomic.ts`)

This example demonstrates:
- Using EIP-7702 for atomic ERC20 token operations (approve + transferFrom)
- Using RPCStateManager to simulate against a real network
- How an EOA can delegate to a bundler contract to perform multiple operations in one transaction

### 3. Uniswap Swap with EIP-7702 (`eip7702-uniswap.ts`)

This example demonstrates:
- Using EIP-7702 to perform a Uniswap swap
- Atomically approving tokens and executing a swap in one transaction
- Simulating the transaction using a mainnet fork

## Running the Examples

To run these examples, you'll need to:

1. Make sure you have EthereumJS libraries installed
2. Run a local Ethereum node or use a fork of mainnet for the examples with RPCStateManager
3. Execute the example scripts (e.g., `ts-node eip7702-enable.ts`)

## Important Notes

- These examples are for demonstration purposes only
- **NEVER** use real private keys with value in examples or test code
- For RPCStateManager examples, use a local development node or test network

## Implementation Status

EIP-7702 is still in the proposal stage. The EthereumJS implementation is intended to help developers understand how to use EIP-7702 and prepare for its potential adoption.

## Resources

- [EIP-7702 Website](https://eip7702.io/)
- [EIP-7702 Examples](https://eip7702.io/examples)
- [EthereumJS Documentation](https://github.com/ethereumjs/ethereumjs-monorepo) 