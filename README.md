# SYNOPSIS

[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-common.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-common)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg?style=flat-square)]()
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) 

# ETHEREUMJS-COMMON
Resources common to all Ethereum implementations

Succeeds the old [ethereum/common](https://github.com/ethereumjs/common/) library.

# INSTALL
`npm install ethereumjs-common`

# USAGE

Include all parameters for usage in a project:

```
const common = require('ethereumjs-common')
```

## Network Params

Network specific genesis data and params can be found in the ``networks`` directory,
which contains separate files for the different supported networks, e.g. ``mainnet.json``
or ``ropsten.json``.

These contain:

- The ``networkID``
- ``genesis`` block header values
- Block numbers of ``hardforks``
- A list of current ``bootstrapNodes``

It is possible to just use the params for all the networks:

```
const networkParams = require('ethereumjs-common/networks')
```

Or just a specific network:

```
const mainnetParams = require('ethereumjs-common/networks/mainnet')
```

## Hardfork Params

Hardfork-specific config files can be found in the ``hardforks`` directory and contain
data on the following ``topics``:

- ``gasConfig``
- ``gasPrices``
- ``vm``
- ``pow``
- ``casper``
- ``sharding``

For consistency, the chain start (``chainstart``) is considered an own hardfork.

The hardfork-specific json files only contain the deltas from ``chainstart`` and
shouldn't be accessed directly until you have a specific reason for it.

Instead params can be accessed through the corresponding topic-named utility 
function. Two utility functions for every topic mentioned above are provided, e.g.
for the ``gasPrices`` topic:

#### `common.hardforks.gasPrices(name, hardfork)`
Get the gas prize for the specific fork.
- `name` - The name of the gas prize, e.g. ``expByte``
- `hardfork` - The hardfork you want to have the gas prize for

#### `common.hardforks.latestGasPrices(name)`
Get the gas prize for the latest fork.
- `name` - The name of the gas prize, e.g. ``expByte``

The latest hard fork can be accessed with:

#### `common.hardforks.latestHardfork`
Name of the latest hardfork, e.g. ``byzantium``.

Note: The list of ``gasPrices`` is consistent but not complete, so there are currently
gas price values missing (PRs welcome!).

## Bootstrap Nodes

There is no separate config files for bootstrap files like in the old ``ethereum-common`` library.
Instead network-specific bootstrap nodes can now be found under the ``bootstrapNodes`` key 
within the network parameter json files, e.g. ``mainnet`` bootstrap nodes in ``./networks/mainnet.json``.

## Genesis States

Network-specific genesis files are located in the ``genesisStates`` folder.

Due to the large file sizes genesis states are not directly included in the ``index.js`` file
but have to be accessed directly, e.g.:

```
const mainnetGenesisState = require('ethereumjs-common/genesisStates/mainnet')
```

# LICENSE
[MIT](https://opensource.org/licenses/MIT)
