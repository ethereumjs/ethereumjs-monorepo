import { initKZG } from '@ethereumjs/util'

// Make the kzg library available globally
import * as kzg from 'c-kzg'

// Initialize the trusted setup
try {
  initKZG(kzg, __dirname + '/../../client/src/trustedSetups/devnet6.txt')
} catch {
  // No-op if KZG is already loaded
}

console.log(kzg) // should output the KZG API as an object
