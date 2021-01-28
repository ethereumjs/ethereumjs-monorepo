import { BN } from 'ethereumjs-util'

// Fixed number of extra-data prefix bytes reserved for signer vanity
export const CLIQUE_EXTRA_VANITY = 32
// Fixed number of extra-data suffix bytes reserved for signer seal
export const CLIQUE_EXTRA_SEAL = 65

// Block difficulty for in-turn signatures
export const CLIQUE_DIFF_INTURN = new BN(2)
// Block difficulty for in-turn signatures
export const CLIQUE_DIFF_NOTURN = new BN(1)
