# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-account.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-account)
[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-account.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-account)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-account.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-account)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs-lib.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs-lib)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This library eases the handling of Ethereum accounts, where accounts can be either external accounts
or contracts (see
[Account Types](http://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html) docs).

Note that the library is not meant to be used to handle your wallet accounts, use e.g. the
[web3-eth-personal](http://web3js.readthedocs.io/en/1.0/web3-eth-personal.html) package from the
`web3.js` library for that. This is just a semantic wrapper to ease the use of account data and
provide functionality for reading and writing accounts from and to the Ethereum state trie.

Note: The library implements [EIP-161](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md) to determine empty accounts,
and as such doesn't support hardforks before the Spurious Dragon.

# INSTALL

`npm install ethereumjs-account`

# BROWSER

This module work with `browserify`.

# API

[./docs/](./docs/README.md)

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).
