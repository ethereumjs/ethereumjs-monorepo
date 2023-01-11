import type { Kzg } from '../depInterfaces'

function kzgNotLoaded(): never {
  throw Error('kzg library not loaded')
}

// eslint-disable-next-line import/no-mutable-exports
export let kzg: Kzg = {
  freeTrustedSetup: kzgNotLoaded,
  loadTrustedSetup: kzgNotLoaded,
  blobToKzgCommitment: kzgNotLoaded,
  computeAggregateKzgProof: kzgNotLoaded,
  verifyKzgProof: kzgNotLoaded,
  verifyAggregateKzgProof: kzgNotLoaded,
}

/**
 * @param kzgLib a KZG implementation (defaults to c-kzg)
 * @param trustedSetupPath the full path (e.g. "/home/linux/trusted_setup.txt") to a kzg trusted setup text file
 */
export function initKZG(kzgLib: Kzg, trustedSetupPath = __dirname + '/trusted_setup.txt') {
  kzg = kzgLib
  kzg.loadTrustedSetup(trustedSetupPath)
}
