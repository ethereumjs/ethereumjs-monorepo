# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-tx.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-tx)
[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-tx.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-tx)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-tx.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-tx)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs-lib.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs-lib) or #ethereumjs on freenode

# INSTALL

`npm install ethereumjs-tx`

# USAGE

- [example](https://github.com/ethereumjs/ethereumjs-tx/blob/master/examples/transactions.ts)

```javascript
const EthereumTx = require('ethereumjs-tx').Transaction
const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex',
)

const txParams = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
}

const tx = new EthereumTx(txParams)
tx.sign(privateKey)
const serializedTx = tx.serialize()
```

# Chain and Hardfork Support

This library uses the [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common)
package to support different chain and hardfork options, see API documentation
for details.

Currently all hardforks up to `petersburg` are supported, `EIP-155` replay protection
is activated since the `spuriousDragon` hardfork.

# API

[./docs/](./docs/README.md)

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)
