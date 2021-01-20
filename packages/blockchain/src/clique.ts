import { Address, BN, rlp } from 'ethereumjs-util'

export type CliqueSignerState = [BN, Address[]]
export type CliqueLatestSignerStates = CliqueSignerState[]
export type CliqueVote = [BN, [Address, Address, Buffer]]
export type CliqueLatestVotes = CliqueVote[]

export const CLIQUE_NONCE_AUTH: Buffer = Buffer.from('ffffffffffffffff', 'hex')
export const CLIQUE_NONCE_DROP = Buffer.alloc(8)