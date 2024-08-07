import { ConsensusAlgorithm } from '@ethereumjs/common'
import { BlockHeader } from '../index.js'
import { RLP } from '@ethereumjs/rlp'

// Fixed number of extra-data prefix bytes reserved for signer vanity
export const CLIQUE_EXTRA_VANITY = 32
// Fixed number of extra-data suffix bytes reserved for signer seal
export const CLIQUE_EXTRA_SEAL = 65

export function _requireClique(header: BlockHeader, name: string) {
  if (header.common.consensusAlgorithm() !== ConsensusAlgorithm.Clique) {
    const msg = header['_errorMsg'](
      `BlockHeader.${name}() call only supported for clique PoA networks`,
    )
    throw new Error(msg)
  }
}

/**
 * PoA clique signature hash without the seal.
 */
export function cliqueSigHash(header: BlockHeader) {
  _requireClique(header, 'cliqueSigHash')
  const raw = header.raw()
  raw[12] = header.extraData.subarray(0, header.extraData.length - CLIQUE_EXTRA_SEAL)
  return header['keccakFunction'](RLP.encode(raw))
}
