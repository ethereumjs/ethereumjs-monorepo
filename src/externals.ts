/**
 * Re-exports commonly used modules:
 * * Exports [`BN`](https://github.com/indutny/bn.js), [`rlp`](https://github.com/ethereumjs/rlp).
 * @packageDocumentation
 */

// TODO: This can be replaced with a normal ESM import once
// the new major version of the typescript config package
// is released and adopted here.
import BN = require('bn.js');
import rlp = require('rlp');

/**
 * [`BN`](https://github.com/indutny/bn.js)
 */
export { BN }

/**
 * [`rlp`](https://github.com/ethereumjs/rlp)
 */
export { rlp }
