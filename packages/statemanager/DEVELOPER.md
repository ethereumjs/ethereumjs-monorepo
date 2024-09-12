# Developer Documentation

## TESTING

### Running Tests

Tests can be found in the `tests` directory. The StateManager can be tested as:
`npm run test`

### CI Test Integration

Tests and checks are run in CI using [Github Actions](https://github.com/ethereumjs/ethereumjs-monorepo/actions). The configuration can be found in `.github/workflows`.

## Debugging

For the debugging output to show up, set the `DEBUG` environment variable, e.g. in Linux/Mac OS:
`export DEBUG=ethjs,*`

The following initial logger is currently available:

| Logger                                     | Description                                              |
| ------------------------------------------ | -------------------------------------------------------- |
| `statemanager:MerkleStateManager`          | Operations happening on the `MerkleStateManager`         |
| `statemanager:RPCStateManager`             | Operations happening on the `RPCStateManager`            |
| `statemanager:StatefulVerkleStateManager`  | Operations happening on the `StatefulVerkleStateManager` |
| `statemanager:StatelessVerkleStateManager` | Operations accessing verkle witnesses                    |
| `statemanager:verkle:aw`                   | Operations accessing verkle witnesses                    |
| `statemanager:cache`                       | Operations accessing statemanager caches                 |
| `statemanager:cache:code`                  | Operations accessing statemanager code cache             |
| `statemanager:cache:account`               | Operations accessing statemanager account cache          |
| `statemanager:cache:storage`               | Operations accessing statemanager storage cache          |

The following is an example for a logger run:

Run with the clique logger:

```shell
DEBUG=ethjs,statemanager:MerkleStateManager,statemanager:cache:* tsx test.ts
```
