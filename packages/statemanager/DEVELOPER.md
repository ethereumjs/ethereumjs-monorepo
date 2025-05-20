# Developer Documentation

## TESTING

### Running Tests

Tests can be found in the `tests` directory. The StateManager can be tested as:
`npm run test`

### CI Test Integration

Tests and checks are run in CI using [Github Actions](https://github.com/ethereumjs/ethereumjs-monorepo/actions). The configuration can be found in `.github/workflows`.

## Debugging

This library uses the [debug](https://github.com/visionmedia/debug) debugging utility package.

The following initial logger is currently available:

| Logger                          | Description                                              |
| ------------------------------- | -------------------------------------------------------- |
| `statemanager:merkle`           | Operations happening on the `MerkleStateManager`         |
| `statemanager:rpc`              | Operations happening on the `RPCStateManager`            |
| `statemanager:verkle:stateful`  | Operations happening on the `StatefulVerkleStateManager` |
| `statemanager:verkle:stateless` | Operations accessing verkle witnesses                    |
| `statemanager:verkle:aw`        | Operations accessing verkle witnesses                    |
| `statemanager:cache`            | Operations accessing statemanager caches                 |
| `statemanager:cache:code`       | Operations accessing statemanager code cache             |
| `statemanager:cache:account`    | Operations accessing statemanager account cache          |
| `statemanager:cache:storage`    | Operations accessing statemanager storage cache          |

The following is an example for a logger run:

Run with the clique logger:

```shell
DEBUG=ethjs,statemanager:merkle,statemanager:cache:* tsx test.ts
```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.
Additional log selections can be added with a comma separated list (no spaces). Logs with extensions can be enabled with a colon `:`, and `*` can be used to include all extensions.

`DEBUG=ethjs,statemanager:cache:*,trie,statemanager:merkle npx vitest test/statemanager.spec.ts`
