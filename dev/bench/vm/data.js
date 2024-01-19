window.BENCHMARK_DATA = {
  "lastUpdate": 1705660024654,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "aac2bef7c6a9300bbfa4264b0cfdfd9603847a11",
          "message": "StateManager: stateless verkle state manager (#3139)\n\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-12-06T11:37:44-05:00",
          "tree_id": "133bad45e81442316ee1eb8c4eea59e31af55e5c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aac2bef7c6a9300bbfa4264b0cfdfd9603847a11"
        },
        "date": 1701880842015,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40301,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38298,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39163,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38090,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37028,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4e356e6b284430a192321199814ccec640b3dfb2",
          "message": "Replace `superagent` with direct RPC calls in RPC tests (#3173)\n\n* Add jayson rpc client to baseSetup function\r\n\r\n* Update sha3 test\r\n\r\n* more changes\r\n\r\n* migrate rpc and validation spec tests\r\n\r\n* Have update websocket tests\r\n\r\n* Update txpool and net tests\r\n\r\n* More fixes\r\n\r\n* More eth test migrations\r\n\r\n* rest of eth tests\r\n\r\n* partial engine test fixes\r\n\r\n* Fix all the tests\r\n\r\n* more test fixes\r\n\r\n* More fixes\r\n\r\n* Lint\r\n\r\n* Fix ws tests\r\n\r\n* fix kaustinen tests\r\n\r\n* fix kaustinen tests\r\n\r\n* Update packages/client/test/rpc/debug/traceTransaction.spec.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/client/test/rpc/engine/getPayloadBodiesByRangeV1.spec.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/client/test/rpc/eth/chainId.spec.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/client/test/rpc/eth/chainId.spec.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/client/test/rpc/validation.spec.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Remove duplicate msg assignment\r\n\r\n* Update packages/client/test/rpc/eth/estimateGas.spec.ts\r\n\r\n* Update packages/client/test/rpc/engine/getPayloadBodiesByRangeV1.spec.ts\r\n\r\n* Update packages/client/test/rpc/eth/estimateGas.spec.ts\r\n\r\n* Update packages/client/test/rpc/eth/estimateGas.spec.ts\r\n\r\n* client: fix tests\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-08T14:01:06+01:00",
          "tree_id": "6730edb8cd61583e06ba0bcb1905bff2e3d04d99",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4e356e6b284430a192321199814ccec640b3dfb2"
        },
        "date": 1702040638523,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41232,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39044,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39628,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39223,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38084,
            "range": "±2.21%",
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
          "id": "253e0a4cf60ea24ab802f3eb713b20f3b49ac955",
          "message": "testdouble to vi refactoring (#3182)\n\n* Refactor blockfetcher tests to use vi instead of td\r\n\r\n* Refactor bytecodefetcher tests to use vi instead of td\r\n\r\n* Refactor trienodefetcher tests to use vi instead of td\r\n\r\n* Refactor reverseBlockFetcher tests to use vi instead of td\r\n\r\n* Refactor accountfetcher tests to use vi instead of td\r\n\r\n* Remove td usage\r\n\r\n* Fix lint error\r\n\r\n* simplify tests\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-12-09T09:42:04-07:00",
          "tree_id": "8a5f893aaeea359d62fdce1980cc788a29187d2c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/253e0a4cf60ea24ab802f3eb713b20f3b49ac955"
        },
        "date": 1702140289421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41343,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39076,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39462,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38520,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37685,
            "range": "±2.28%",
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
          "id": "de706125473e2188de382d95861fa1daac67713d",
          "message": "Add test for ecrecover precompile (#3184)\n\n* Add test for ecrecover precompile\r\n\r\n* Update test messages\r\n\r\n* evm: fix ecrecover test\r\n\r\n* evm: add test comment ecrecover test\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-09T10:06:06-07:00",
          "tree_id": "5daaaaae1c0707a135102e76a1539a1c8a8efed3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/de706125473e2188de382d95861fa1daac67713d"
        },
        "date": 1702141736874,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41061,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38798,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39038,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38448,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34673,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "96985844ed30859667afc76f37ba1c2c658b1529",
          "message": "util: check that hex to byte conversion is valid in hexToBytes (#3185)\n\n* util: check that hex to byte conversion is valid in hexToBytes\r\n\r\n* util: add test case for invalid hex\r\n\r\n* util: add test case for invalid bytes (fails)\r\n\r\n* util: add regex\r\n\r\n* util: clarify error\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-12T10:37:38-05:00",
          "tree_id": "2d91d622cc545121932b0fa1823da941a0e126ee",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/96985844ed30859667afc76f37ba1c2c658b1529"
        },
        "date": 1702395709630,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41077,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38678,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39292,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38912,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34994,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "98fc3abbc87aaa347cf6447716f03966485c12eb",
          "message": "Client: Async VM Initialization (#3187)\n\n* Avoid VM double initialization, prepare for async setup for VM & friends\r\n\r\n* Move to async VM setup, fix tests\r\n\r\n* Remove unnecessary vm property in tx pool\r\n\r\n* Test fixes\r\n\r\n* Fix getPayloadV3.spec.ts test\r\n\r\n* Fix client.spec.ts test\r\n\r\n* Small miner test optimization\r\n\r\n* Fix RPC net_version test\r\n\r\n* Small lint fix\r\n\r\n* client: fix getProof test\r\n\r\n* client: lint\r\n\r\n* Fix miner test\r\n\r\n* adjust test timeouts\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Amir <indigophi@protonmail.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-12T20:34:28+01:00",
          "tree_id": "1afebee4250d85c83f472f8b434d003e4f2724c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/98fc3abbc87aaa347cf6447716f03966485c12eb"
        },
        "date": 1702410444850,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40837,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39670,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39442,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38678,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35260,
            "range": "±5.21%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "2b5f86ab8fda734b4b7af6ceaf49b73cb62bce40",
          "message": "evm: Precompile Tests (#3189)\n\n* Add tests for blake2f precompile\r\n\r\n* Add tests for ripemd160 precompile\r\n\r\n* Test out of gas error for ecrecover precompile\r\n\r\n* evm: Fix blake2f test\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-13T14:17:52-05:00",
          "tree_id": "28e971d4e702514a729d2b78a54aad0a3772e211",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2b5f86ab8fda734b4b7af6ceaf49b73cb62bce40"
        },
        "date": 1702495271114,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40530,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37894,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38977,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38620,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37052,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      },
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
          "id": "d79a2e315900a30af3e468d192a9935c654a87b2",
          "message": "evm: fix CALL(CODE) gas (#3195)",
          "timestamp": "2023-12-14T16:55:22+01:00",
          "tree_id": "78e356c51c01c799d2ebdd9a5fb14e9a23123f97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d79a2e315900a30af3e468d192a9935c654a87b2"
        },
        "date": 1702569492038,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40311,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38148,
            "range": "±3.85%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39215,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38199,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34157,
            "range": "±6.00%",
            "unit": "ops/sec",
            "extra": "78 samples"
          }
        ]
      },
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
          "id": "44e069e41b13eddd8cd09ab62e75f4641eb234d0",
          "message": "Trie/StateManager: create partial state tries / state managers from proofs (#3186)\n\n* trie: add methods to create and update tries from proofs\r\n\r\n* stateManager: add fromProof support\r\n\r\n* Add readme updates for new fromProof constructors\r\n\r\n* Apply suggested changes\r\n\r\n* Add missing line\r\n\r\n* statemanager/trie: further update readme examples\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-12-14T16:46:52-05:00",
          "tree_id": "dc2121dec8fcda93f019c44d58b8f52784013a9b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/44e069e41b13eddd8cd09ab62e75f4641eb234d0"
        },
        "date": 1702590584214,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40505,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39832,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39477,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38409,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34265,
            "range": "±6.83%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "karolchojnowski95@gmail.com",
            "name": "Karol Chojnowski",
            "username": "kchojn"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a58c6cb1c5f034dfbb2bffd0bb369803b69c5109",
          "message": "Fix Blake2F gas + output calculation on non-zero aligned inputs (#3201)\n\n* refactor(precompiles/09-blake2f.ts): improve readability and performance by using DataView with byteOffset instead of subarray\r\n\r\nThe changes in this commit refactor the code in the `precompile09` function in the `09-blake2f.ts` file. The changes improve the readability and performance of the code by using the `DataView` constructor with `byteOffset` instead of using `subarray` to create new `DataView` instances.\r\n\r\nBefore the changes:\r\n- The `rounds`, `hRaw`, `mRaw`, and `tRaw` variables were created using `subarray` to extract specific parts of the `data` array buffer.\r\n- The `subarray` method was used with specific indices to create new `DataView` instances.\r\n\r\nAfter the changes:\r\n- The `rounds`, `hRaw`, `mRaw`, and `tRaw` variables are created using the `DataView` constructor with `byteOffset` to directly access the desired parts of the `data` array buffer.\r\n- The `DataView` constructor is used with the appropriate `byteOffset` values to create new `DataView` instances.\r\n\r\nThese changes improve the readability of the code by making it clearer which parts of the `data` array buffer are being accessed. Additionally, using `DataView` with `byteOffset` instead of `subarray` can improve performance by avoiding unnecessary memory allocations.\r\n\r\n* evm: add blake2f test\r\n\r\n* evm: blake2f test: add extra comment\r\n\r\n* evm: fix blake2f \"it.only\"\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-12-15T21:25:10-05:00",
          "tree_id": "0de4800ed6093cbb01d9b0c75e5a8480ccb4637a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a58c6cb1c5f034dfbb2bffd0bb369803b69c5109"
        },
        "date": 1702693814468,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40060,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39669,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39223,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37705,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34709,
            "range": "±5.41%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4f908ca7fb91efc0bc8ec0f6e410f0627aaa0e5a",
          "message": "Add missed `.js file endings (#3205)\n\n* Add missing .js file endings\n\n* More missing endings",
          "timestamp": "2023-12-18T18:44:27-05:00",
          "tree_id": "6f79c42dc4cbbd255a3878fa46156fe32912e7b1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4f908ca7fb91efc0bc8ec0f6e410f0627aaa0e5a"
        },
        "date": 1702944135128,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40977,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40005,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40050,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39196,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35182,
            "range": "±6.36%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
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
          "id": "c5054ebbb478d3a92545b98d67b125f25636c7f1",
          "message": "util: optimize hexToBytes (#3203)\n\n* util: optimize hexToBytes\r\n\r\n* util: also ensure unprefixedHexToBytes (so also toBytes for bigint) uses the optimizer\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-12-19T10:01:54+01:00",
          "tree_id": "9c59c24939235eb4323874ad3567223f4467b8ee",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5054ebbb478d3a92545b98d67b125f25636c7f1"
        },
        "date": 1702976682163,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42089,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39520,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40341,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39330,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38419,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      },
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
          "id": "a0ef459e26f6a843d67bb2142977b67359109839",
          "message": "evm: ensure modexp right-pads input data\n\n* evm: ensure modexp right-pads input data\n\n* evm: ensure modexp right-pads input data\n\n* evm: fix modexp gas\n\n* Merge branch 'fix-precompiles-inputs' of github.com:ethereumjs/ethereumjs-monorepo into fix-precompiles-inputs\n\n* evm: remove .only test modifier",
          "timestamp": "2023-12-19T09:47:34-05:00",
          "tree_id": "f7a81d36cbfbe22d6fd1aa93cbf73fad93b5d2f0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a0ef459e26f6a843d67bb2142977b67359109839"
        },
        "date": 1702997423251,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41470,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38782,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39595,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37771,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37478,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "9a7d6ac4a5e217de892aa4fc2629201148b44b7f",
          "message": "statemanager: Fix statemanager Browser Example (#3197)\n\n* Use hexToBytes instead of hexStringToBytes\r\n\r\n* Make debug check safe for browsers\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-12-20T10:09:55+01:00",
          "tree_id": "2f7b5b9b83a48d3cd3d9adc56a46492ba3e959a3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9a7d6ac4a5e217de892aa4fc2629201148b44b7f"
        },
        "date": 1703063567320,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39951,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39399,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39000,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38194,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34702,
            "range": "±5.92%",
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
          "id": "1b035d020733f6fdc8c0bf6204408838386748c8",
          "message": "Codecov tuning (#3207)\n\n* Add coverage checking and reporting for wallet CI runs\r\n\r\n* Add coverage checking and reporting for genesis CI runs\r\n\r\n* Add coverage run to rlp package workflow\r\n\r\n* Use coverage script for CI coverage report generation\r\n\r\n* Just run node tests for RLP\r\n\r\n* Increase wallet test timeouts\r\n\r\n* Increase wallet test timeout\r\n\r\n* Only run node tests for coverage\r\n\r\n* Comment out tests to see how codecov handles report generation and processing\r\n\r\n* Add arguments for codecov upload action\r\n\r\n* Add arguments for codecov upload action\r\n\r\n* Revert \"Comment out tests to see how codecov handles report generation and processing\"\r\n\r\nThis reverts commit 783dae067e6d6ea43e0295e1dfddd61fb33652a8.\r\n\r\n* Revert \"Add arguments for codecov upload action\"\r\n\r\nThis reverts commit 553bcd5ed89c4c101bc53d4ff0deaa4407f2ae7a.\r\n\r\n* Revert \"Add arguments for codecov upload action\"\r\n\r\nThis reverts commit dff18e5ec968206bf64f5882f1b9be9686da1ea4.\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-12-20T11:28:14+01:00",
          "tree_id": "34c9f04542ff382fae366db3cc24e41de0346627",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1b035d020733f6fdc8c0bf6204408838386748c8"
        },
        "date": 1703068264568,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41397,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38896,
            "range": "±3.57%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39088,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39055,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37530,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "timqian@t9t.io",
            "name": "Tim Qian",
            "username": "timqian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "76b74d0343f5c595f0107032d1daec61fbc0c72d",
          "message": "Fix broken code path in client readme (#3209)\n\n* Fix broken code path in client readme\r\n\r\n* Fix npm command\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-12-20T15:10:02+01:00",
          "tree_id": "1e4dc2479909192dbb4c58c5350c8afef2a39b0b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/76b74d0343f5c595f0107032d1daec61fbc0c72d"
        },
        "date": 1703081578080,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41471,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39060,
            "range": "±3.89%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39663,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38903,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38119,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "3bd15736d1b470da687cedf78d2de8cccddecf0c",
          "message": "common: schedule cancun for testnets (#3211)",
          "timestamp": "2023-12-29T11:48:10+01:00",
          "tree_id": "0c31c891ba7da24ee233599489e7c06082d3dbf9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3bd15736d1b470da687cedf78d2de8cccddecf0c"
        },
        "date": 1703847188852,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39570,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37748,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37745,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37646,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36061,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "b5390216d9bc2cea1910db36eee125d509a4aa27",
          "message": "Client: Fetcher Small Bugfixes and Log Improvements (#3024)\n\n* Client -> Execution: less frequent cache stats\r\n\r\n* Client -> Fetcher: log improvements\r\n\r\n* Client -> Fetcher: fix unwanted job execution on skip case, added some no-result guards\r\n\r\n* Client -> Fetcher: more explicit push to Readable stream\r\n\r\n* Client -> Fetcher: add initialization debug msg\r\n\r\n* Client -> Fetcher: tie job skipping to finished jobs instead of processed to avoid to large bulk import chunks\r\n\r\n* Client: a bit less frequent memory stats\r\n\r\n* Client -> Fetcher: fix occasional re-enqueue bug when length of an object is not defined, minor log improvements\r\n\r\n* Lighsync hot fix for fetcher reenqueue logic switches\r\n\r\n* add explicit boolean checks\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-12-30T10:36:25+01:00",
          "tree_id": "92e622ffb32bfdd45f18c899b9937effd3ef99e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b5390216d9bc2cea1910db36eee125d509a4aa27"
        },
        "date": 1703929148854,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41753,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39405,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39767,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38826,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34928,
            "range": "±6.36%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "willcory10@gmail.com",
            "name": "Will Cory",
            "username": "roninjin10"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbe755c816baf1108f72fbec521a100e54444ddd",
          "message": "fix: Fix fetchJsonRpc example (#3213)\n\nExample was previously passing in the full verbose json-rpc request which wasn't necessary",
          "timestamp": "2024-01-03T11:45:13-05:00",
          "tree_id": "e171715b82fa7f28bd9d883298685c94eaf93429",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fbe755c816baf1108f72fbec521a100e54444ddd"
        },
        "date": 1704300481826,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41396,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38441,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39375,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38550,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37274,
            "range": "±2.35%",
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
          "id": "9046347fe9a53632e99ab8dddd4e6edb619c70ce",
          "message": "Dependency Updates (#3212)\n\n* client: Update fs-extra dependencies\r\n\r\n* Remove various obsolete browser devDeps\r\n\r\n* Remove pino\r\n\r\n* Update package-lock again\r\n\r\n* Remove duplicate files\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-01-03T19:47:34-07:00",
          "tree_id": "843a945c4a14cee1da2579f3df46ca2272eced9f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9046347fe9a53632e99ab8dddd4e6edb619c70ce"
        },
        "date": 1704336622213,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40670,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38854,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39080,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38282,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34681,
            "range": "±5.56%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4ec344b78c1f81cc0becbef3d2de287db6d38fcf",
          "message": "Update callcode test  (#3214)\n\n* Update callcode test with clearer results\r\n\r\n* lint\r\n\r\n* Address feedback\r\n\r\n* evm: squash call(code) test\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-01-05T17:31:56-05:00",
          "tree_id": "b1be38cf06746b16d84edc89a0d596ad8fbce45e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4ec344b78c1f81cc0becbef3d2de287db6d38fcf"
        },
        "date": 1704494081959,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40775,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38342,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39330,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39018,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37371,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3981bcafa5a93720e19768f7cec7791f1c7d201e",
          "message": "Switch from `ts-node` to `tsx` (#3188)\n\n* Switch all ts-node usage to tsx and associated fixes\r\n\r\n* remove `cts` suffix\r\n\r\n* Fix namespace imports\r\n\r\n* Update devp2p lrucache to v10\r\n\r\n* update some non-tsx files to tsx\r\n\r\n* Remove console log\r\n\r\n* log all messages\r\n\r\n* update cli tests to use tsx\r\n\r\n* Address feedback\r\n\r\n* Stick with cts\r\n\r\n* vm: fix retesteth\r\n\r\n* update package-lock\r\n\r\n* update package lock again\r\n\r\n* Add browser deps install script\r\n\r\n* fix browser script\r\n\r\n* Pin browser testing deps\r\n\r\n* Remove browser deps from package-lock\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-01-08T13:23:56-05:00",
          "tree_id": "65b2081932c589930752330e4fda6602d775ebcb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3981bcafa5a93720e19768f7cec7791f1c7d201e"
        },
        "date": 1704738409876,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41652,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38561,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39346,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38955,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37793,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "60685302d842cd01a07e31c3f1dc21f41045d34d",
          "message": "Monorepo: Embed Code Examples in README Files\n\n* Add embedme dev dependency to root package.json\n\n* Rebuild package-lock.json\n\n* Add examples:build script to package.json (Block)\n\n* Integrate first exemplary Block example\n\n* Replace typescript marker for markdown code embeds with ts (working alternative + embedme compatible)\n\n* Add missing examples for block\n\n* Add Util package examples, expand README with dedicated module sections and examples\n\n* Flesh out 4844 example",
          "timestamp": "2024-01-10T11:33:22-05:00",
          "tree_id": "5a2b5f052183ce24f003c686021ac9b7c964c751",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/60685302d842cd01a07e31c3f1dc21f41045d34d"
        },
        "date": 1704904566364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40921,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38571,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39184,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38298,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34555,
            "range": "±6.04%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7bcb197f2a4388b7c48ab6776b31733308ac0933",
          "message": "Internalize `crc` (#3224)\n\n* Internalize crc\r\n\r\n* Add tests\r\n\r\n* Add attribution link",
          "timestamp": "2024-01-10T11:24:29-07:00",
          "tree_id": "ec1b435a9cdb7eb8ddf61ed72826d593aa368e06",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7bcb197f2a4388b7c48ab6776b31733308ac0933"
        },
        "date": 1704911233553,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40527,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38944,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39449,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38323,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34425,
            "range": "±6.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "417b46659ce452469a2b9688b3fda9b584012ff3",
          "message": "More example rewrites (#3228)\n\n* Add common examples\r\n\r\n* Partial blockchain examples\r\n\r\n* Add simple blockchain example\r\n\r\n* Add remaining blockchain example\r\n\r\n* revert test changes",
          "timestamp": "2024-01-11T23:01:22+01:00",
          "tree_id": "f1baac35ed26a8287164a7dfa3a3b96e47abce1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/417b46659ce452469a2b9688b3fda9b584012ff3"
        },
        "date": 1705011065458,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40419,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39343,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39261,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36519,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37776,
            "range": "±2.33%",
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
          "id": "fc0433eccc8a7d6cf327b01a77463ad92743c2af",
          "message": "Use permalink to avoid future breakage of link (#3230)",
          "timestamp": "2024-01-12T11:16:14+01:00",
          "tree_id": "54d05fe86ba5ccc3253f4cfecd2eff9a56a981a7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fc0433eccc8a7d6cf327b01a77463ad92743c2af"
        },
        "date": 1705054738329,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41676,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39476,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39488,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39140,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38194,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "willcory10@gmail.com",
            "name": "Will Cory",
            "username": "roninjin10"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51fc6dae08b6cec678323c09ed56907d39194e00",
          "message": "chore: Add missing jsdoc to client (#3233)\n\nNoticed this was missing while reading client code",
          "timestamp": "2024-01-15T20:32:23+01:00",
          "tree_id": "5fbb12dc4aefe2382f4a05b2f2936b8afdd0beea",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/51fc6dae08b6cec678323c09ed56907d39194e00"
        },
        "date": 1705347301249,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39663,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38876,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38968,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35868,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36971,
            "range": "±2.33%",
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
          "id": "a8f326aa6023afa9eb968959c8007e5caf10406e",
          "message": "Readable stream analysis refactor (#3231)\n\n* Experiment with importing webstreams\r\n\r\n* Suppress implicit-import eslint error\r\n\r\n* Replace readable-stream with web stream api\r\n\r\n* Remove unnecessary null check\r\n\r\n* Update package-lock and dependencies\r\n\r\n* Fix test\r\n\r\n* Make nonbreaking\r\n\r\n* Use async stream in statemanager\r\n\r\n* Update package-lock file and dependencies\r\n\r\n* Include comment to detail deviation from import policy\r\n\r\n* Revert \"Update package-lock file and dependencies\"\r\n\r\nThis reverts commit baf67f4ada44f7bfd23d1896d7cbb88d033ad657.\r\n\r\n* Revert \"Update package-lock and dependencies\"\r\n\r\nThis reverts commit 02b8845a0e35b8a97efa7b69a6fc26f03e210c38.\r\n\r\n* Update package-lock",
          "timestamp": "2024-01-17T13:22:37+01:00",
          "tree_id": "234296a83446816eee46dd81a936a973be43eac2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a8f326aa6023afa9eb968959c8007e5caf10406e"
        },
        "date": 1705494323877,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41073,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38809,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39502,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38577,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37496,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "54446b1baa71f1fba57b69d421daefebb096c6ce",
          "message": "Client/Monorepo: Use WASM Crypto (keccak256) for Hashing / Consistent Hash Function Overwrite (#3192)\n\n* Add @polkadot/wasm crypto dependency\r\n\r\n* Use @polkadot/wasm keccak256 for trie key hashing in execution state manager for VM\r\n\r\n* Tighten calling for useKeyHashingFunction\r\n\r\n* Add customCrypto options dict to Common, first keccak256 usage and test\r\n\r\n* Add custom keccak256 usage to EVM keccak256 opcode\r\n\r\n* Add wasm based ecrecover option\r\n\r\n* export calcSigRecovery\r\n\r\n* use customcrypto if available\r\n\r\n* add test for custom ecrecover\r\n\r\n* Add optional common to trie interface\r\n\r\n* Add cli option\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add @polkadot/util as a dev dependency to the tx package for testing\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Pass common into trie instantiations in snap sync fetchers\r\n\r\n* Use wasm keccak function if available in bytecodeFetcher\r\n\r\n* Use wasm keccak function if available in trienodeFetcher\r\n\r\n* Refactor default statemanager trie and keccak256 usage to allow option of WASM version\r\n\r\n* Refactor rpc statemanager trie and keccak256 usage to allow option of WASM version\r\n\r\n* Refactor verkle statemanager trie and keccak256 usage to allow option of WASM version\r\n\r\n* Fix reference to statemanager opts\r\n\r\n* Pass common to verifyProof trie instantiation\r\n\r\n* Test if trie shallowCopy is using the correct hashing function\r\n\r\n* Update packages/tx/src/capabilities/legacy.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Update packages/tx/src/capabilities/legacy.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Update packages/tx/src/capabilities/legacy.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Update packages/tx/src/capabilities/legacy.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* tx: fix double declaration\r\n\r\n* Use wasm keccak function if available in block\r\n\r\n* Use consistent naming for opts parameter\r\n\r\n* Update package-lock\r\n\r\n* Use wasm keccak function if available in header\r\n\r\n* Use consistent naming for opts parameter\r\n\r\n* Explicitly declare return type\r\n\r\n* Pass common to tries instantiated in genTrieRoot functions\r\n\r\n* Fix tests\r\n\r\n* Fix test\r\n\r\n* Block: add suggestions from code review\r\n\r\n* Add test for Block hash() method with custom crypto\r\n\r\n* Some clean-up\r\n\r\n* Pass common in vm and testrunner tries\r\n\r\n* Update evm usage for customCrypto\r\n\r\n* Move wasm crypto tests to client\r\n\r\n* add optional wasm keccak in misc uses\r\n\r\n* Add polkadot/util\r\n\r\n* import util directly\r\n\r\n* resolve polkadot/util to fake dep\r\n\r\n* Devp2p: Use WASM Crypto\r\n\r\n* Devp2p: add keccak function and Common passing structure to RLPx, DPT, DNS\r\n\r\n* Client: pass in common along devp2p DPT instantiation\r\n\r\n* Devp2p: expand to ECIES, first replacement test\r\n\r\n* Devp2p: First full-round replacement (including concatBytes occurrences) for ECIES\r\n\r\n* Devp2p: integrate into DPT server and message\r\n\r\n* Devp2p: Add to DNS ENR\r\n\r\n* Devp2p: remove util keccak256 helper function\r\n\r\n* Mock polkadot util module\r\n\r\n* try installing peers\r\n\r\n* Add custom sha256 support and tests\r\n\r\n* Add wasm ecSign\r\n\r\n* Passing common in various places\r\n\r\n* Fix import\r\n\r\n* block/client: minor changes\r\n\r\n* Add ecrecover function\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Amir <indigophi@protonmail.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-01-18T04:08:59+01:00",
          "tree_id": "c400f2632457e98c32f689a663a053fda9896742",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/54446b1baa71f1fba57b69d421daefebb096c6ce"
        },
        "date": 1705547660482,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40670,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38385,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38785,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37944,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34099,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "17355484+acolytec3@users.noreply.github.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25d97273f7229ad3098edd5dddf6b142120a7c01",
          "message": "Add ecdsaSign/ecdsaRecover (#3245)",
          "timestamp": "2024-01-19T11:24:19+01:00",
          "tree_id": "c632921bf44416db055162754e52fe636bab34de",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/25d97273f7229ad3098edd5dddf6b142120a7c01"
        },
        "date": 1705660023984,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40834,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39949,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39446,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36472,
            "range": "±5.42%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37962,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      }
    ]
  }
}