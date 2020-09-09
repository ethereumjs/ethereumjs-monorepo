# ethereumjs-account

[![NPM Package][account-npm-badge]][account-npm-link]
[![GitHub Issues][account-issues-badge]][account-issues-link]
[![Actions Status][account-actions-badge]][account-actions-link]
[![Code Coverage][account-coverage-badge]][account-coverage-link]
[![Discord][discord-badge]][discord-link]

[![js-standard-style][js-standard-style-badge]][js-standard-style-link]

This library eases the handling of Ethereum accounts, where accounts can be either external accounts
or contracts (see
[Account Types](http://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html) docs).

Note that the library is not meant to be used to handle your wallet accounts, use e.g. the
[web3-eth-personal](http://web3js.readthedocs.io/en/1.0/web3-eth-personal.html) package from the
`web3.js` library for that. This is just a semantic wrapper to ease the use of account data and
provide functionality for reading and writing accounts from and to the Ethereum state trie.

Note: The library implements [EIP-161](https://eips.ethereum.org/EIPS/eip-161) to determine empty accounts,
and as such doesn't support hardforks before the Spurious Dragon.

# INSTALL

`npm install ethereumjs-account`

# BROWSER

This module work with `browserify`.

# API

[Documentation](./docs/README.md)

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[js-standard-style-badge]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[js-standard-style-link]: https://github.com/feross/standard
[account-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/account.svg
[account-npm-link]: https://www.npmjs.com/package/@ethereumjs/account
[account-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20account?label=issues
[account-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+account"
[account-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Account%20Test/badge.svg
[account-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Account+Test%22
[account-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=account
[account-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/account
