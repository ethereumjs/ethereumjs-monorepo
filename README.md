<p align="center">
  <img src="https://avatars1.githubusercontent.com/u/16297473?s=200&v=4">
</p>

# EthereumJS Monorepo

[![codecov](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg?style=flat)](https://gitter.im/ethereum/ethereumjs)
![Freenode](https://img.shields.io/badge/%23ethereumjs-freenode-brightgreen)
[![StackExchange](https://img.shields.io/badge/ethereumjs-stackexchange-brightgreen)](https://ethereum.stackexchange.com/questions/tagged/ethereumjs)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This was originally the EthereumJS VM repository. On Q1 2020 we brought some of its building blocks together to simplify development. Below you can find the packages included in this repository.


| package | npm | issues | tests | coverage |
|---------|-----|--------| ----- | -------- |
| [@ethereumjs/account](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/account)       | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-account.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-account)       | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20account?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+account")       | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/account-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions)          | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=account)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)    | 
| [@ethereumjs/block](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/block)           | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-block.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-block)           | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20block?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+block")           | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/block-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions)                | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=block)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)      | 
| [@ethereumjs/blockchain](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/blockchain) | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-blockchain.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-blockchain) | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20blockchain?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain") | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/blockchain-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions) | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=blockchain)](https://codecov.io/gh/evertonfraga/ethereumjs-vm) | 
| [@ethereumjs/common](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/common)         | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-common.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-common)         | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20common?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common")         | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/common-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions)             | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=common)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)     | 
| [@ethereumjs/tx](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/tx)                 | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-tx.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-tx)                 | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20tx?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+tx")                 | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/tx-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions)                         | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=tx)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)         | 
| [@ethereumjs/vm](https://github.com/evertonfraga/ethereumjs-vm/tree/master/packages/vm)                 | [![NPM Package](https://img.shields.io/npm/v/ethereumjs-vm.svg?style=flat)](https://www.npmjs.org/package/ethereumjs-vm)                 | [![GitHub issues by-label](https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20vm?label=issues)](https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm")                 | [![Actions Status](https://github.com/evertonfraga/ethereumjs-vm/workflows/vm-test/badge.svg)](https://github.com/evertonfraga/ethereumjs-vm/actions)                         | [![Coverage](https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graph/badge.svg?flag=vm)](https://codecov.io/gh/evertonfraga/ethereumjs-vm)         | 


# Coverage report

Detailed version can be seen in [Codecov.io](https://codecov.io/gh/evertonfraga/ethereumjs-vm).

<p align="left">
  <a href="https://codecov.io/gh/evertonfraga/ethereumjs-vm/">
    <img src="https://codecov.io/gh/evertonfraga/ethereumjs-vm/branch/master/graphs/icicle.svg" width=750>
  </a>
</p>

# Developing in a monorepo

`lerna bootstrap` links the packages contained in this repository, but only if they comply with the requested version range. 



# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MIT](https://opensource.org/licenses/MIT)
