/**
 * Re-exports commonly used modules:
 * * Adds [`ethjs-util`](https://github.com/ethjs/ethjs-util) methods.
 * * Exports [`BN`](https://github.com/indutny/bn.js), [`rlp`](https://github.com/ethereumjs/rlp), [`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/).
 * @packageDocumentation
 */

const ethjsUtil = require('ethjs-util')
import * as secp256k1 from 'secp256k1'
import * as BN from 'bn.js'
import * as rlp from 'rlp'

/**
 * [`ethjsUtil`](https://github.com/ethjs/ethjs-util)
 */
Object.assign(exports, ethjsUtil)

/**
 * [`BN`](https://github.com/indutny/bn.js)
 */
export { BN }

/**
 * [`rlp`](https://github.com/ethereumjs/rlp)
 */
export { rlp }

/**
 * [`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)
 */
export { secp256k1 }
