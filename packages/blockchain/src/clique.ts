import { Address, BN } from 'ethereumjs-util'

export type CliqueSignerState = [BN, Address[]] // [blockNumber, signers]
export type CliqueLatestSignerStates = CliqueSignerState[]

export type CliqueVote = [BN, [Address, Address, Buffer]] // [blockNumber, [signer, beneficiary, cliqueNonce]]
export type CliqueLatestVotes = CliqueVote[]

export type CliqueBlockSigner = [BN, Address] // [blockNumber, signer]
export type CliqueLatestBlockSigners = CliqueBlockSigner[]

export const CLIQUE_NONCE_AUTH = Buffer.from('ffffffffffffffff', 'hex')
export const CLIQUE_NONCE_DROP = Buffer.alloc(8)
