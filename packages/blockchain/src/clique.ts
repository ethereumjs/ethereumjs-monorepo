import { Address } from 'ethereumjs-util'

// Clique Signer State: [blockNumber, signers]
export type CliqueSignerState = [bigint, Address[]]
export type CliqueLatestSignerStates = CliqueSignerState[]

// Clique Vote: [blockNumber, [signer, beneficiary, cliqueNonce]]
export type CliqueVote = [bigint, [Address, Address, Buffer]]
export type CliqueLatestVotes = CliqueVote[]

// Clique Block Signer: [blockNumber, signer]
export type CliqueBlockSigner = [bigint, Address]
export type CliqueLatestBlockSigners = CliqueBlockSigner[]

// Magic nonce number to vote on adding a new signer
export const CLIQUE_NONCE_AUTH = Buffer.from('ffffffffffffffff', 'hex')
// Magic nonce number to vote on removing a signer.
export const CLIQUE_NONCE_DROP = Buffer.alloc(8)
