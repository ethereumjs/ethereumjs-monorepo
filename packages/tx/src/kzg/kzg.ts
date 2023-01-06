import type { Ikzg } from '../depInterfaces'

function kzgNotLoaded(): never {
  throw Error('kzg library not loaded')
}

// eslint-disable-next-line import/no-mutable-exports
export let kzg: Ikzg = {
  freeTrustedSetup: kzgNotLoaded,
  loadTrustedSetup: kzgNotLoaded,
  blobToKzgCommitment: kzgNotLoaded,
  computeAggregateKzgProof: kzgNotLoaded,
  verifyKzgProof: kzgNotLoaded,
  verifyAggregateKzgProof: kzgNotLoaded,
}

export function initKZG(kzgLib: Ikzg, trustedSetupPath = __dirname + '/trusted_setup.txt') {
  kzg = kzgLib
  kzg.loadTrustedSetup(trustedSetupPath)
}
