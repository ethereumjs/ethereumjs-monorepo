/**
 * Re-exports commonly used modules:
 * * Adds [`ethjs-util`](https://github.com/ethjs/ethjs-util) methods.
 * * Exports [`BN`](https://github.com/indutny/bn.js), [`rlp`](https://github.com/ethereumjs/rlp).
 * @packageDocumentation
 */

const ethjsUtil = require('ethjs-util')
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
