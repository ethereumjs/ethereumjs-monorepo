<p align="center">
  <img src="https://user-images.githubusercontent.com/47108/78779352-d0839500-796a-11ea-9468-fd2a0b3fe1ef.png" width=280>
</p>

# EthereumJS Monorepo

[![Code Coverage][coverage-badge]][coverage-link]
[![Gitter][gitter-badge]][gitter-link]
[![StackExchange][stackexchange-badge]][stackexchange-link]

[![JS Standard Style][js-standard-style-badge]][js-standard-style-link]

This was originally the EthereumJS VM repository. On Q1 2020 we brought some of its building blocks together to simplify development. Below you can find the packages included in this repository.

| package                                     | npm                                                         | issues                                                                  | tests                                                                  | coverage                                                                |
| ------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [ethereumjs-account][account-package]       | [![NPM Package][account-npm-badge]][account-npm-link]       | [![Account Issues][account-issues-badge]][account-issues-link]          | [![Actions Status][account-actions-badge]][account-actions-link]       | [![Code Coverage][account-coverage-badge]][account-coverage-link]       |
| [ethereumjs-block][block-package]           | [![NPM Package][block-npm-badge]][block-npm-link]           | [![Block Issues][block-issues-badge]][block-issues-link]                | [![Actions Status][block-actions-badge]][block-actions-link]           | [![Code Coverage][block-coverage-badge]][block-coverage-link]           |
| [ethereumjs-blockchain][blockchain-package] | [![NPM Package][blockchain-npm-badge]][blockchain-npm-link] | [![Blockchain Issues][blockchain-issues-badge]][blockchain-issues-link] | [![Actions Status][blockchain-actions-badge]][blockchain-actions-link] | [![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link] |
| [ethereumjs-common][common-package]         | [![NPM Package][common-npm-badge]][common-npm-link]         | [![Common Issues][common-issues-badge]][common-issues-link]             | [![Actions Status][common-actions-badge]][common-actions-link]         | [![Code Coverage][common-coverage-badge]][common-coverage-link]         |
| [ethereumjs-tx][tx-package]                 | [![NPM Package][tx-npm-badge]][tx-npm-link]                 | [![Tx Issues][tx-issues-badge]][tx-issues-link]                         | [![Actions Status][tx-actions-badge]][tx-actions-link]                 | [![Code Coverage][tx-coverage-badge]][tx-coverage-link]                 |
| [ethereumjs-vm][vm-package]                 | [![NPM Package][vm-npm-badge]][vm-npm-link]                 | [![VM Issues][vm-issues-badge]][vm-issues-link]                         | [![Actions Status][vm-actions-badge]][vm-actions-link]                 | [![Code Coverage][vm-coverage-badge]][vm-coverage-link]                 |

## Coverage report

Detailed version can be seen on [Codecov.io][coverage-link]

[![Code Coverage](https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graphs/icicle.svg)][coverage-link]

## Package dependency relationship

<p align="center">
 <img width="409" alt="diagram" src="https://user-images.githubusercontent.com/47108/78778883-007e6880-796a-11ea-8353-772d6923d336.png">
</p>

<!-- CREATED WITH MERMAID
https://mermaid-js.github.io/mermaid-live-editor/#/view/eyJjb2RlIjoiZ3JhcGggVERcbiAgdm17Vk19XG5cbiAgY29tbW9uIC0tPiBibG9ja2NoYWluXG4gIGNvbW1vbiAtLT4gYmxvY2tcbiAgY29tbW9uIC0tPiB2bVxuICBjb21tb24gLS0-IHR4XG5cbiAgYmxvY2sgLS0-IGJsb2NrY2hhaW5cbiAgYmxvY2tjaGFpbiAtLT4gdm1cbiAgYmxvY2sgLS0-IHZtXG5cbiAgdHggLS0-IHZtXG4gIHR4IC0tPiBibG9ja1xuXG4gIGFjY291bnQgLS0-IHZtXG5cblxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0
graph TD
  vm{VM}
  common -> blockchain
  common -> block
  common -> vm
  common -> tx
  block -> blockchain
  blockchain -> vm
  block -> vm
  tx -> vm
  tx -> block
  account -> vm
-->

## Developing in a monorepo

`lerna bootstrap` links the packages contained in this repository, but only if they comply with the specified version range.

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MIT](https://opensource.org/licenses/MIT)

[coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg
[coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm
[gitter-badge]: https://img.shields.io/gitter/room/ethereum/ethereumjs.svg
[gitter-link]: https://gitter.im/ethereum/ethereumjs
[stackexchange-badge]: https://img.shields.io/badge/ethereumjs-stackexchange-brightgreen
[stackexchange-link]: https://ethereum.stackexchange.com/questions/tagged/ethereumjs
[js-standard-style-badge]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[js-standard-style-link]: https://github.com/feross/standard
[account-package]: ./packages/account
[account-npm-badge]: https://img.shields.io/npm/v/ethereumjs-account.svg
[account-npm-link]: https://www.npmjs.org/package/ethereumjs-account
[account-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20account?label=issues
[account-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+account"
[account-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Account%20Test/badge.svg
[account-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Account+Test%22
[account-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=account
[account-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/account
[block-package]: ./packages/block
[block-npm-badge]: https://img.shields.io/npm/v/ethereumjs-block.svg
[block-npm-link]: https://www.npmjs.org/package/ethereumjs-block
[block-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20block?label=issues
[block-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+block"
[block-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Block%20Test/badge.svg
[block-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Block+Test%22
[block-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=block
[block-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/block
[blockchain-package]: ./packages/blockchain
[blockchain-npm-badge]: https://img.shields.io/npm/v/ethereumjs-blockchain.svg
[blockchain-npm-link]: https://www.npmjs.org/package/ethereumjs-blockchain
[blockchain-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20blockchain?label=issues
[blockchain-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain"
[blockchain-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Blockchain%20Test/badge.svg
[blockchain-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Blockchain+Test%22
[blockchain-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=blockchain
[blockchain-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain
[common-package]: ./packages/common
[common-npm-badge]: https://img.shields.io/npm/v/ethereumjs-common.svg
[common-npm-link]: https://www.npmjs.org/package/ethereumjs-common
[common-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20common?label=issues
[common-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
[common-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Common%20Test/badge.svg
[common-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Common+Test%22
[common-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=common
[common-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/common
[tx-package]: ./packages/tx
[tx-npm-badge]: https://img.shields.io/npm/v/ethereumjs-tx.svg
[tx-npm-link]: https://www.npmjs.org/package/ethereumjs-tx
[tx-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20tx?label=issues
[tx-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+tx"
[tx-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Tx%20Test/badge.svg
[tx-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Tx+Test%22
[tx-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=tx
[tx-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/tx
[vm-package]: ./packages/vm
[vm-npm-badge]: https://img.shields.io/npm/v/ethereumjs-vm.svg
[vm-npm-link]: https://www.npmjs.org/package/ethereumjs-vm
[vm-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20vm?label=issues
[vm-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm"
[vm-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/VM%20Test/badge.svg
[vm-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22VM+Test%22
[vm-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=vm
[vm-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/vm
