window.BENCHMARK_DATA = {
  "lastUpdate": 1691006214298,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "jochembrouwer96@gmail.com",
            "name": "Jochem Brouwer",
            "username": "jochem-brouwer"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "47714a6020d283437ee811ebc789037bbe4124d4",
          "message": "VM: docs builder fix, EVM: cleanup types (#2888)\n\n* evm: move EVMResult, ExecResult into evm types\r\n\r\n* evm: fix precompile input type\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-14T13:53:07+02:00",
          "tree_id": "233aaf145ec5aed6d2ba6fb6f96d7e6ff41f3871",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/47714a6020d283437ee811ebc789037bbe4124d4"
        },
        "date": 1689335787761,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32993,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31791,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31981,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27457,
            "range": "±9.82%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30656,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0af73095b19c564791c5da107153edef2c787e4c",
          "message": "Update devp2p API names and access specifiers (#2889)\n\n* Change access specifiers for RLPx _privateKey, _id, _debug, _timeout\r\n\r\n* Renaming accessed id property in client tests\r\n\r\n* Change access specifiers for RLPx _maxPeers, _clientId, _remoteClientIdFilter, and _capabilities\r\n\r\n* Ignore error message from reassigning readonly property in tests\r\n\r\n* Change access specifiers for _common, _listenPort, and _dpt\r\n\r\n* Change access specifiers for _peersLRU, _peersQueue, _server, _peers, _refillIntervalId, and _refillIntervalSelectionCounter\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Ignore access errors for _eciesSession\r\n\r\n* Make common field public for Peer class\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Make id public readonly\r\n\r\n* Update names and access specifiers of Mac class fields\r\n\r\n* Update names and access specifiers of ECIES class fields\r\n\r\n* Update names and access specifiers of Peer class fields\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update example\r\n\r\n* Update names and access specifiers of class fields in protocol subpackage\r\n\r\n* Update names and access specifiers of class fields in ext subpackage\r\n\r\n* Update names and access specifiers of class fields in dpt subpackage\r\n\r\n* Update names and access specifiers of class fields in dns subpackage\r\n\r\n* Fix name of accessed field\r\n\r\n* Update tests",
          "timestamp": "2023-07-17T08:56:20+02:00",
          "tree_id": "799b19d9ccb9182461e44b531b44c278d7f67ad7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0af73095b19c564791c5da107153edef2c787e4c"
        },
        "date": 1689577185295,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32686,
            "range": "±4.65%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31925,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31851,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27626,
            "range": "±8.64%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30215,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "gajinder@g11.in",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54e10a23c8095cc57ff9f0be5fa505fc48ed532b",
          "message": "common: add Cancun CFI EIPs for devnet8 and fix eip-4788 block building issues (#2892)\n\n* common: add Cancun CFI EIPs for devnet8\r\n\r\n* fix the parentBeaconBlockRoot related issues\r\n\r\n* fix issues\r\n\r\n* fix execution payload to block conversion for 4788\r\n\r\n* fix client specs\r\n\r\n* fix spec\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-17T10:28:34+02:00",
          "tree_id": "51e9e4a245596f83b4a99a012ee813e77e4b77b4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/54e10a23c8095cc57ff9f0be5fa505fc48ed532b"
        },
        "date": 1689582739478,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30704,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30641,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30421,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25132,
            "range": "±11.32%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29181,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "gajinder@g11.in",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e33b0f8bb60348000cdaefd4ff72b6bc81de19d0",
          "message": "client: add shouldOverrideBuilder flag for getPayloadV3 (#2891)",
          "timestamp": "2023-07-17T11:08:31+02:00",
          "tree_id": "2b4826136e275eb34a2e0bdce7ddf26ee663fb12",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e33b0f8bb60348000cdaefd4ff72b6bc81de19d0"
        },
        "date": 1689585509352,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33164,
            "range": "±4.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32410,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32067,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28270,
            "range": "±8.15%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30674,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "Holger.Drewes@gmail.com",
            "name": "Holger Drewes",
            "username": "holgerd77"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "66c98f386e4a7807978e3e8f0c19608d10849896",
          "message": "RC1 Releases (#2876)\n\n* Bump version, updated upstream dependency versions, updated README (RLP)\r\n\r\n* Update release date to 2023-07-13\r\n\r\n* Add generic Buffer -> Uint8Array README section\r\n\r\n* Add generic README unreleased note\r\n\r\n* Add generic ESM sections\r\n\r\n* Add a first browser example section to README (EVM)\r\n\r\n* Small updates\r\n\r\n* Renamed blobHelpers.ts -> blobs.ts (Util), moved Util encoding to Trie\r\n\r\n* Version bump, update upstream dependency versions, update README (Util)\r\n\r\n* Move encoding tests from Util to Trie\r\n\r\n* Version bump, update upstream dependency versions, update README (Common)\r\n\r\n* Rebuild docs\r\n\r\n* Version bump, update upstream dependency versions, update README (Trie)\r\n\r\n* Version bump, update upstream dependency versions, update README (devp2p)\r\n\r\n* Rebuild docs (Tx)\r\n\r\n* Version bump, update upstream dependency versions, update README (Tx)\r\n\r\n* Version bump, update upstream dependency versions, update README (Block)\r\n\r\n* Rebuild docs (Block)\r\n\r\n* Version bump, update upstream dependency versions, update README (Blockchain)\r\n\r\n* Rebuild docs (Blockchain)\r\n\r\n* Version bump, update upstream dependency versions, update README, added LICENSE file (Genesis)\r\n\r\n* Version bump, update upstream dependency versions, update README (StateManager)\r\n\r\n* Rebuild docs (StateManager)\r\n\r\n* Version bump, update upstream dependency versions, update README (Ethash)\r\n\r\n* Version bump, update upstream dependency versions, update README (EVM)\r\n\r\n* First part of VM README additions\r\n\r\n* Blockchain: remove level dependency, other changes\r\n\r\n* Dependency clean-up\r\n\r\n* Bump client version to v0.8.0\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Small updates\r\n\r\n* Add CHANGELOG introduction sections\r\n\r\n* Adjust Cancun HF CHANGELOG note (all EIPs included)\r\n\r\n* Bring release notes up to date\r\n\r\n* Rebuild Block, Common docs\r\n\r\n* Rebuild Ethash docs\r\n\r\n* Small updates and corrections\r\n\r\n* More small corrections",
          "timestamp": "2023-07-17T15:51:34+02:00",
          "tree_id": "680b78f0dc42a6f7fc8257ba4e8179857964af42",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/66c98f386e4a7807978e3e8f0c19608d10849896"
        },
        "date": 1689602157424,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24695,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25315,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24673,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24062,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18866,
            "range": "±11.52%",
            "unit": "ops/sec",
            "extra": "64 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "Holger.Drewes@gmail.com",
            "name": "Holger Drewes",
            "username": "holgerd77"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6b2389219322b5279fb73281eccc4a8128bcd5a0",
          "message": "Small RC1 Release Cleanup Round (#2894)\n\n* EVM: add @ethereumjs/statemanager dependency, new RC.2 release\r\n\r\n* Some small clean-ups\r\n\r\n* VM constructor new VM() -> VM.create() doc update\r\n\r\n* Update packages/evm/README.md\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-07-17T20:36:20+02:00",
          "tree_id": "f1804204ff8b739f7a03bb0a616a3413a1fe7057",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6b2389219322b5279fb73281eccc4a8128bcd5a0"
        },
        "date": 1689619850260,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30358,
            "range": "±5.94%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30222,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29346,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25617,
            "range": "±9.03%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29539,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "contact@rockwaterweb.com",
            "name": "Gabriel Rocheleau",
            "username": "gabrocheleau"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "894660973cfd06faae39f74c66a39616f5b2239f",
          "message": "client: migrate tests to vite (#2797)\n\n* client: migrate tests to vite\r\n\r\n* client: update test scripts\r\n\r\n* client: fix rpc engine tests\r\n\r\n* client: fix rpc engine tests\r\n\r\n* client: remove unnecessary stringification\r\n\r\n* client: fix more rpc tests\r\n\r\n* client: misc test fixes\r\n\r\n* client: fix ci script still using tape\r\n\r\n* Rename libp2p tests to avoid vitest running them\r\n\r\n* fix instanceof tests\r\n\r\n* Update vitest.config so that test:CLI runs\r\n\r\n* Update vitest.config so that test:CLI runs\r\n\r\n* Fixes for client.spec.ts\r\n\r\n* Fix error in sender.spec.ts\r\n\r\n* Fix test formatting rlpxserver.spec.ts\r\n\r\n* Update unit test config, randomize rpc port\r\n\r\n* test fixes\r\n\r\n* more test fixes\r\n\r\n* Fix engine tests\r\n\r\n* Partial test fixes\r\n\r\n* Fix merge integration test\r\n\r\n* fix fcu hex handling\r\n\r\n* Add timeouts and fix lightsync\r\n\r\n* Various test and type fixes\r\n\r\n* fix txpool tests\r\n\r\n* correct bytes2hex import\r\n\r\n* Fix lightethereumservice tests\r\n\r\n* client: fix lesprotocol test\r\n\r\n* Fix most full ethereum service tests\r\n\r\n* Fix fullethereumservice test\r\n\r\n* \"Fix\" flow control test\r\n\r\n* Fix rlxppeer test\r\n\r\n* client: fix lightsync integration test timeouts\r\n\r\n* client: update client ci\r\n\r\n* client: increase timeout for some tests\r\n\r\n* client: remove only from flowcontrol test\r\n\r\n* client: more test fixes\r\n\r\n* client: increase timeout for miner\r\n\r\n* client: increase timeout for miner\r\n\r\n* client: increase more timeouts and fix missing it statement\r\n\r\n* fix integration tests\r\n\r\n* fix lint rules\r\n\r\n* fix npm script\r\n\r\n* Fix lint file extension\r\n\r\n* Fix lint config, again\r\n\r\n* File path fix\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-18T10:56:04+02:00",
          "tree_id": "fd0ef2f3a54ea89c2075dd8b8f0734dac570ab03",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/894660973cfd06faae39f74c66a39616f5b2239f"
        },
        "date": 1689670937363,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32725,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32203,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31769,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27923,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30450,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9fec1f405a36e94d176e6cc4b497fc0afbdaea71",
          "message": "Resolve access errors from doc build process (#2898)",
          "timestamp": "2023-07-18T15:15:19-04:00",
          "tree_id": "098a5c4e7228c43b38bfe19d99faf38a5efc12e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9fec1f405a36e94d176e6cc4b497fc0afbdaea71"
        },
        "date": 1689708706126,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30403,
            "range": "±5.81%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30938,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29941,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25142,
            "range": "±10.80%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29211,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "966d7dd7943a2dab20c83c6e6ef29a276756de3f",
          "message": "Devp2p EventEmitter refactor (#2893)\n\n* Change access specifiers for RLPx _privateKey, _id, _debug, _timeout\r\n\r\n* Renaming accessed id property in client tests\r\n\r\n* Change access specifiers for RLPx _maxPeers, _clientId, _remoteClientIdFilter, and _capabilities\r\n\r\n* Ignore error message from reassigning readonly property in tests\r\n\r\n* Change access specifiers for _common, _listenPort, and _dpt\r\n\r\n* Change access specifiers for _peersLRU, _peersQueue, _server, _peers, _refillIntervalId, and _refillIntervalSelectionCounter\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Ignore access errors for _eciesSession\r\n\r\n* Make common field public for Peer class\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Make id public readonly\r\n\r\n* Update names and access specifiers of Mac class fields\r\n\r\n* Update names and access specifiers of ECIES class fields\r\n\r\n* Update names and access specifiers of Peer class fields\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update example\r\n\r\n* Update names and access specifiers of class fields in protocol subpackage\r\n\r\n* Update names and access specifiers of class fields in ext subpackage\r\n\r\n* Update names and access specifiers of class fields in dpt subpackage\r\n\r\n* Update names and access specifiers of class fields in dns subpackage\r\n\r\n* Fix name of accessed field\r\n\r\n* Update tests\r\n\r\n* Don't extend EventEmitter in RLPx class\r\n\r\n* Update tests\r\n\r\n* Update tests\r\n\r\n* Update examples\r\n\r\n* Update tests\r\n\r\n* Don't exten EventEmitter in Protocol class\r\n\r\n* Update tests\r\n\r\n* Update examples\r\n\r\n* Update tests\r\n\r\n* Don't extend EventEmitter in dpt class\r\n\r\n* Don't extend EventEmitter in kbucket class\r\n\r\n* Update tests\r\n\r\n* Update tests\r\n\r\n* Fix rlpxserver test\r\n\r\n* Fix tests\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-19T14:43:48-04:00",
          "tree_id": "5e8d6cc92cd46f6b00c75be2850c9c5e59ed5f0d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/966d7dd7943a2dab20c83c6e6ef29a276756de3f"
        },
        "date": 1689792516556,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18831,
            "range": "±6.57%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19208,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19943,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19449,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18842,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1950acac1518ff15dc128d58253df4de81760b8",
          "message": "Troubleshoot failing node versions tests: Adjust timeouts in devp2p tests to avoid race conditions (#2895)\n\n* Make timeout and wait longer\r\n\r\n* Update comment\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-19T15:41:08-04:00",
          "tree_id": "f573b1cca55fe493289895b168088c04a0836fa1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1950acac1518ff15dc128d58253df4de81760b8"
        },
        "date": 1689795871592,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31963,
            "range": "±4.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31831,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31446,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27279,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29870,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d19ee0e4c9c0e2a7a61ae38c791861a8e9fb0fd5",
          "message": "Adjust client unit test timeouts (#2901)\n\n* Extend timeout window for client unit tests\n\n* Remove specific test timeouts and up global to 3m\n\n* Fix cli tests\n\n* Fix client CI and vitest config\n\n* Fix cli job command\n\n* cleanup timeouts\n\n* fix imports\n\n* revert namespace import to require\n\n* extent client test timeout\n\n* extend integration test timeouts\n\n* skip problematic miner tests\n\n* lint",
          "timestamp": "2023-07-20T16:39:25-04:00",
          "tree_id": "47442b9a679dadf809e9c49706f01f80b18d26aa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d19ee0e4c9c0e2a7a61ae38c791861a8e9fb0fd5"
        },
        "date": 1689885772226,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32769,
            "range": "±4.22%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32157,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31968,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27275,
            "range": "±9.50%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29993,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "gajinder@g11.in",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a616ca081b7aeb32fffc00b8b6b20b9fd18eec52",
          "message": "client: apply engine api changes for devnet 8 (#2896)\n\n* client: apply engine api changes for devnet 8\r\n\r\n* fix client spec\r\n\r\n* add timestamp tests\r\n\r\n* fix v3 comment\r\n\r\n* add fcu3 usage specs",
          "timestamp": "2023-07-21T19:43:31+02:00",
          "tree_id": "4be9de0c4bfd7aca983c1cb4552bad9f6a66f923",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a616ca081b7aeb32fffc00b8b6b20b9fd18eec52"
        },
        "date": 1689961672194,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21947,
            "range": "±4.94%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21512,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22254,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19219,
            "range": "±10.51%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18618,
            "range": "±7.46%",
            "unit": "ops/sec",
            "extra": "75 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "Holger.Drewes@gmail.com",
            "name": "Holger Drewes",
            "username": "holgerd77"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "532eff80e57c4d7780df43de891323ead2962d97",
          "message": "Monorepo: JSON -> JS Transition (#2911)\n\n* Common: move EIP configs to single eips.ts file\r\n\r\n* Common: delete all separate EIP JSON files\r\n\r\n* Common: remove EIP config name and number properties\r\n\r\n* Common: EIPs typing, parameter cleanup, test adjustments\r\n\r\n* Add missing 3651 WARM COINBASE EIP config\r\n\r\n* Minor\r\n\r\n* Fix EIP number typo, other small fixes\r\n\r\n* Common: rename HardforkConfig -> HardforkTransitionConfig\r\n\r\n* Add missing EIP\r\n\r\n* Common: moved hardfork JSON file configurations to single hardforks.ts file\r\n\r\n* Common: delete HF files\r\n\r\n* Common: replace chain JSON file configs with single chains.ts file\r\n\r\n* Common: delete chain JSON files\r\n\r\n* VM: internalize DAO configuration (account list and refund contract)\r\n\r\n* Common type improvements",
          "timestamp": "2023-07-22T21:12:08-04:00",
          "tree_id": "26a170c0cbb898aa67f73dfe19902b6945e7a8f0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/532eff80e57c4d7780df43de891323ead2962d97"
        },
        "date": 1690074983370,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22865,
            "range": "±4.87%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21936,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22628,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21719,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18200,
            "range": "±10.08%",
            "unit": "ops/sec",
            "extra": "74 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84c57cbc6e6e9a570e8be3d83f90cab2640155f3",
          "message": "Add `debug_traceCall` RPC method (#2913)\n\n* add debug_traceCall RPC method\r\n\r\n* create traceCall.spec file\r\n\r\n* Add 'method exists' test\r\n\r\n* Add test for messing/invalid parameter types\r\n\r\n* Add simple method call test\r\n\r\n* Add jsdoc links and clean up body references\r\n\r\n* Update packages/client/test/rpc/debug/traceCall.spec.ts\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/client/test/rpc/debug/traceCall.spec.ts\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Add type conversion for RpcTx\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>",
          "timestamp": "2023-07-24T21:03:10-06:00",
          "tree_id": "fb2a2192042a459d90c0fa0069553f612208c570",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/84c57cbc6e6e9a570e8be3d83f90cab2640155f3"
        },
        "date": 1690254412251,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32964,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32277,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31938,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27887,
            "range": "±8.71%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30755,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66335769+ScottyPoi@users.noreply.github.com",
            "name": "Scotty",
            "username": "ScottyPoi"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d971c39ce0c108e3391d977b2af928fe1442fec9",
          "message": "Address security vulnerabilities (#2912)\n\n* devp2p: remove deprecated: @types/chalk\n\n* devp2p:  update dependency for 'multaddr'\n\n* client: update dependencies for 'multiaddr' and 'peer-id'\n\n* Fix devp2p imports\n\n* client: update peer-id dependency\n\n* trie: update 0x dependency\n\n* commit package-lock\n\n* trie: use recommended 0x version\n\n* trie: remove 0x dependency completely\n\n* clean up package-lock\n\n* client: update import and fix parse.spec.ts\n\n* client: update import / fix rlpxserver.spec.ts\n\n* devp2p: revert back to multiaddr v10.0.1\n\n* Fix import for Convert\n\n* client: revert back to multiaddr v10.0.1\n\n* commit package-lock\n\n* lint fix\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-25T06:29:10-04:00",
          "tree_id": "a84f131da7544c85b1c9d60f7f05317733ac51a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d971c39ce0c108e3391d977b2af928fe1442fec9"
        },
        "date": 1690281180321,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25056,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25173,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23091,
            "range": "±8.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25053,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24158,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "38de29b9402e86f185522d38e29258b765f4b24d",
          "message": "Remove remaining karma detritus (#2915)",
          "timestamp": "2023-07-25T11:45:47-07:00",
          "tree_id": "fde3da9d9250e1d7beed667cd8ec6aa0bcbfbc08",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/38de29b9402e86f185522d38e29258b765f4b24d"
        },
        "date": 1690311597935,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31353,
            "range": "±5.15%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31242,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31010,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26176,
            "range": "±9.60%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29912,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "191faf5201aa24fb2052227f8105b2f20c5b9ee7",
          "message": "Update ESLint Dependency (#2914)\n\n* Use eslint version 8.28.0\n\n* Use eslint version 8.35.0\n\n* Update config file\n\n* Use eslint version 8.45.0\n\n* Update eslint dependencies\n\n* update github plugin\n\n* Update package-lock.json\n\n* Update package-lock.json\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-25T21:00:32-04:00",
          "tree_id": "1944389d527d85e026b794dd565caba367e7fdd8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/191faf5201aa24fb2052227f8105b2f20c5b9ee7"
        },
        "date": 1690333432953,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32668,
            "range": "±4.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32110,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31685,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27430,
            "range": "±9.48%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30070,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66335769+ScottyPoi@users.noreply.github.com",
            "name": "Scotty",
            "username": "ScottyPoi"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e984704190f520f20e06ec3b348b2674b3bff786",
          "message": "Trie - async walk generator (#2904)\n\n* Trie:  async iterator _walkTrie function\r\n\r\n* write test/demo script\r\n\r\n* Trie: internalize walkTrieIterable into Trie class\r\n\r\n* Trie: include helper methods for all nodes / value nodes\r\n\r\n* remove null conditional\r\n\r\n* update test with sparse trie example\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-25T23:05:27-06:00",
          "tree_id": "9e0fa927c4bb0414e23baa2557f787d0b22c0ff7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e984704190f520f20e06ec3b348b2674b3bff786"
        },
        "date": 1690348238558,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25922,
            "range": "±5.85%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26371,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26199,
            "range": "±3.56%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25944,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20488,
            "range": "±10.71%",
            "unit": "ops/sec",
            "extra": "67 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "contact@rockwaterweb.com",
            "name": "Gabriel Rocheleau",
            "username": "gabrocheleau"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5fc7d41d45ead7a8949bd1aa7b9e279b686ee41",
          "message": "evm: fix import path (#2918)",
          "timestamp": "2023-07-27T17:46:31-07:00",
          "tree_id": "24a0db1e941a6962a22fec837cde9d6d74ca6ef3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5fc7d41d45ead7a8949bd1aa7b9e279b686ee41"
        },
        "date": 1690505391974,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32184,
            "range": "±4.54%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31864,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31594,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27478,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30216,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "contact@rockwaterweb.com",
            "name": "Gabriel Rocheleau",
            "username": "gabrocheleau"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6308469f151c80871a30576d9009f8c2a6603ae2",
          "message": "client: fix type issues (#2920)",
          "timestamp": "2023-07-28T10:41:12-04:00",
          "tree_id": "f99d3186e0a88bee8af48a6a7f2ddd9578d04d22",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6308469f151c80871a30576d9009f8c2a6603ae2"
        },
        "date": 1690555592820,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32758,
            "range": "±4.25%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32121,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32050,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27983,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30562,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "174772e68226e27ae7e8931ace56e7932a4a065c",
          "message": "Rename `datagas` to `blobgas` - eip 4844 pr 7354 (#2919)\n\n* rename datagas to blobgas - eip 7354\r\n\r\n* update docs\r\n\r\n* Update packages/block/src/block.ts\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* Update packages/block/src/block.ts\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* rename fixes\r\n\r\n* further cleanups\r\n\r\n* further cleanups\r\n\r\n* missing cleanup\r\n\r\n* Doc changes\r\n\r\n* Fix field name\r\n\r\n---------\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2023-07-28T12:54:09-04:00",
          "tree_id": "968f8b74a8d8a2d1a10a4f0a3203d322cec658b6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/174772e68226e27ae7e8931ace56e7932a4a065c"
        },
        "date": 1690563614484,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33022,
            "range": "±4.10%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32287,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32312,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28087,
            "range": "±9.05%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30778,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "654c67aa411d41b7a7a31bb5b9131f59e7da857f",
          "message": "Handle SIGTERM in client (#2921)\n\n* Add listener for SIGTERM signal\r\n\r\n* Update docs\r\n\r\n* Send SIGINT in tests",
          "timestamp": "2023-07-29T14:36:31-04:00",
          "tree_id": "a6cf88a6bfef275f93c17e94be3ea400c8eb0c7d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/654c67aa411d41b7a7a31bb5b9131f59e7da857f"
        },
        "date": 1690656015721,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25151,
            "range": "±4.90%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25492,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26355,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26402,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21859,
            "range": "±10.17%",
            "unit": "ops/sec",
            "extra": "71 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "Holger.Drewes@gmail.com",
            "name": "Holger Drewes",
            "username": "holgerd77"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5669e6b93378b320007a859395b9d101b380416f",
          "message": "Client: move libp2p folder to archive (#2926)\n\n* Client: rename libp2pBrowserBuild > libp2p\r\n\r\n* Client: move libp2p folder to archive\r\n\r\n* Update .eslintignore\r\n\r\n* Client: remove unused libp2p dependencies\r\n\r\n* Rebuild package-lock.json",
          "timestamp": "2023-07-31T19:13:21+02:00",
          "tree_id": "daeec40a6f2f07bda36993071d5bc4f388ebccad",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5669e6b93378b320007a859395b9d101b380416f"
        },
        "date": 1690823884607,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33129,
            "range": "±4.00%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32227,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29240,
            "range": "±7.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31281,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30436,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0cff6ef06bdb90df9c531fc6e3d10b1afccd6552",
          "message": "Extend fullsync test timeout (#2928)",
          "timestamp": "2023-07-31T14:23:03-04:00",
          "tree_id": "2e69da03e695970dbfc0eccb6c96ddfc309a9695",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0cff6ef06bdb90df9c531fc6e3d10b1afccd6552"
        },
        "date": 1690828217869,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20619,
            "range": "±5.66%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20588,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20591,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20761,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19408,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "40c23957c01c69f72e29a269a06a7b2078ba8697",
          "message": "Add tests for client cli options (#2916)\n\n* Add tests for ws, engine api, and rpc\r\n\r\n* Add logging, documentation, and network tests\r\n\r\n* Add cache tests\r\n\r\n* Increase test timeouts\r\n\r\n* Add tests for experimental features and client execution limits options\r\n\r\n* Add tests for network protocol options\r\n\r\n* Update test client args and success assertions\r\n\r\n* Update engine api tests messages and assertions\r\n\r\n* Update test messages\r\n\r\n* Update test message\r\n\r\n* Add a test for rest of network options remaining\r\n\r\n* Add tests for client pow network\r\n\r\n* Validate custom address and port are being used\r\n\r\n* Add test for client sync options\r\n\r\n* Update test\r\n\r\n* Add test for file and directory options\r\n\r\n* Use different ports for client runs to reduce connect errors\r\n\r\n* Use different ports for client runs to reduce connect errors\r\n\r\n* Use different ports for client runs to reduce connect errors\r\n\r\n* Update timeouts and ports\r\n\r\n* Fix tests\r\n\r\n* Don't repeat yourself\r\n\r\n* Use different port to avoid connection issue\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-31T13:36:03-07:00",
          "tree_id": "0f1f3b80de02b3811c9c705633a3e86d202cf98e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/40c23957c01c69f72e29a269a06a7b2078ba8697"
        },
        "date": 1690836127472,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28093,
            "range": "±6.74%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28240,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27987,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24910,
            "range": "±8.12%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23440,
            "range": "±10.92%",
            "unit": "ops/sec",
            "extra": "77 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e11a93cdce20295294d6226675e29ae04f19575c",
          "message": "client: add trienode fetcher for snap sync (#2623)\n\n* parent 569128b0907a200750abbd7dcd52f08304cb15c9\r\nauthor Amir <indigophi@protonmail.com> 1680919955 -0700\r\ncommitter Amir <indigophi@protonmail.com> 1684182403 -0700\r\n\r\nCreate base for trienode fetcher\r\n\r\nIntegrate trie node fetcher with account fetcher - Implement task phase\r\n\r\nSwitch to fetching all nodes starting from root\r\n\r\nKeep record of node hashes with requested paths for cross reference check\r\n\r\nAdd mappings to track path and node requests\r\n\r\nFix bugs\r\n\r\nProcess node data in store\r\n\r\nQueue unkown children of received nodes for fetching\r\n\r\nFetch rest of subtrie before removing active request\r\n\r\n* Use Uint8Array instead of Buffer\r\n\r\n* Fix bugs and linting issues\r\n\r\n* Request all nodes on key path for fetching\r\n\r\n* Process nodes and request unkown ones\r\n\r\n* WIP: Debug encoding bugs\r\n\r\n* Create helper function for converting from hex to keybyte encoding\r\n\r\n* Update path with new paths for known child nodes\r\n\r\n* Append next nibble as a byte to stay consistent with hex encoding\r\n\r\n* Update debug statements to provide more clear logs\r\n\r\n* remove terminator from hex encoded key before appending to path\r\n\r\n* Debug actual and expected node data discrepancy\r\n\r\n* Put fetched node data by account data parsed from leaves\r\n\r\n* Debug putting accounts from fetched nodes\r\n\r\n* Initialize buffer of correct length\r\n\r\n* Clean up code\r\n\r\n* Rework how the extension node path is calculated\r\n\r\n* Rename functions and clean up\r\n\r\n* Set up checks for storage and code healing\r\n\r\n* Queue storage node for fetching from account leaf node\r\n\r\n* Merge and format paths with new stacked sync path\r\n\r\n* Complete path merge logic\r\n\r\n* Store storage node data with account it originates from\r\n\r\n* Update how syncPath is being calculated\r\n\r\n* Include originating account node hash in storage node requests\r\n\r\n* Clean up trienodefetcher.ts\r\n\r\n* Clean up accountfetcher.ts\r\n\r\n* Clean up snap sync files\r\n\r\n* Add tests for trienodefetcher\r\n\r\n* Add function docstrings and remove duplicated code\r\n\r\n* Clean up spacing\r\n\r\n* Remove getPathTo from encoding helpers\r\n\r\n* Rename functions\r\n\r\n* Test tasks and path request queing functions and helpers\r\n\r\n* Process node data collected from Sepolia\r\n\r\n* Update test\r\n\r\n* Move trie node fetcher helper functions into encoding helpers file\r\n\r\n* Use vitest for trie node fetcher tests\r\n\r\n* Clean up and update comments\r\n\r\n* Keep pathStrings in Job\r\n\r\n* Update tests\r\n\r\n* Add tests for pathToHexKey from encoding helpers\r\n\r\n* Use push instead of unshift\r\n\r\n* Do not start sync in test for finding best peer\r\n\r\n* Update tests\r\n\r\n* Fix linting issues\r\n\r\n* Update packages/client/src/sync/fetcher/trienodefetcher.ts\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* Update packages/client/src/sync/fetcher/trienodefetcher.ts\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* Update packages/client/src/sync/fetcher/trienodefetcher.ts\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* Update packages/client/src/sync/fetcher/trienodefetcher.ts\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* Use original map to check received data\r\n\r\n* Use MapDB for speedup\r\n\r\n* small refac\r\n\r\n* fixes\r\n\r\n* shift trie instances to using useKeyHashing true\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-08-01T19:15:17+05:30",
          "tree_id": "2b0fdb772b5b118a95346ac30f6a327063032c15",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e11a93cdce20295294d6226675e29ae04f19575c"
        },
        "date": 1690898048790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20686,
            "range": "±5.18%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20247,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20144,
            "range": "±3.66%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20141,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19804,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "14e7bbacad603088feafff1d8be2c81cf193d0ab",
          "message": "Fix rpc custom address bug (#2930)\n\n* Add custom address parameters to RPC server startup\r\n\r\n* Adjust port numbers in cli tests\r\n\r\n* custom dir fixes\r\n\r\n* clean up tempdir after test\r\n\r\n* Remove duplicate rpc tests with colliding ports\r\n\r\n* Update rpc custom address test\r\n\r\n* Fix custom address test\r\n\r\n* lint\r\n\r\n* Manual wait before connecting client\r\n\r\n---------\r\n\r\nCo-authored-by: Amir <indigophi@protonmail.com>",
          "timestamp": "2023-08-01T13:42:23-07:00",
          "tree_id": "7b822bb7f5756cc5a2d0aef143e074a7463760b4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/14e7bbacad603088feafff1d8be2c81cf193d0ab"
        },
        "date": 1690922736209,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33031,
            "range": "±4.38%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32402,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31994,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27754,
            "range": "±8.37%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30228,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f9843f911bfc446db93b3b93c5d49fff4e4c623a",
          "message": "Reuse proof trie for statemanager (#2932)",
          "timestamp": "2023-08-01T14:22:06-07:00",
          "tree_id": "ca35f1f07834ed57306d25a2e68b6beaa728760b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f9843f911bfc446db93b3b93c5d49fff4e4c623a"
        },
        "date": 1690925375394,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22101,
            "range": "±4.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 23092,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22581,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21656,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20179,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "73 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "indigophi@protonmail.com",
            "name": "Scorbajio",
            "username": "scorbajio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "05bc2b9da1782e1db89feeb3b88d376867fb04b0",
          "message": "Use version 12.3 of ethereum/test (#2933)\n\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-08-02T09:51:27+02:00",
          "tree_id": "fb764b5b2948b0bb815f0d1c242600771a68c72c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/05bc2b9da1782e1db89feeb3b88d376867fb04b0"
        },
        "date": 1690962887953,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32818,
            "range": "±3.67%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32025,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32032,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27496,
            "range": "±8.78%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30468,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "gajinder@g11.in",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6eb9532ddfe50acfcc1b4e35791d6b91c38b5a67",
          "message": "client: test and update devnet 8 integration sims (#2934)\n\n* client: test and update devnet 8 integration sims\r\n\r\n* Client test import fix\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-08-02T21:49:20+02:00",
          "tree_id": "adaa1286de978a66643f3329f4b3d106c332de8e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6eb9532ddfe50acfcc1b4e35791d6b91c38b5a67"
        },
        "date": 1691006212841,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19797,
            "range": "±6.05%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20473,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20221,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20019,
            "range": "±3.77%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19322,
            "range": "±3.87%",
            "unit": "ops/sec",
            "extra": "76 samples"
          }
        ]
      }
    ]
  }
}