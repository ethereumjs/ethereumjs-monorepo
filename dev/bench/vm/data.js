window.BENCHMARK_DATA = {
  "lastUpdate": 1715101546302,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "e8f6ac5465cd74b409488f6c5c4036fd76123b25",
          "message": "common: configure kaustinen6 network (#3355)\n\n* fix the history length and charge blockhash gas\r\n\r\n* fix the historial window typo\r\n\r\n* fix the code offset outof bounds error and failing post state verification because of missing cache persist\r\n\r\n* allow the kautistine spec to handle missed slots\r\n\r\n* overhaul and fix/remove the 2929 charges when cold access charges have been charged",
          "timestamp": "2024-04-16T10:28:12-04:00",
          "tree_id": "7e5399fe6502c9fc181c44d60ef4cf4c04c79097",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8f6ac5465cd74b409488f6c5c4036fd76123b25"
        },
        "date": 1713277991823,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41744,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39315,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40242,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39038,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34076,
            "range": "±8.45%",
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
          "id": "78cebd57ca0a187c4fcdc73b312657c69ac54488",
          "message": "Add prometheus to client and begin implementing custom metrics (#3287)\n\n* Add prometheus and txGuage for tx pool transaction count\r\n\r\n* Use import instead of require\r\n\r\n* Add cli option for enabling prometheus server\r\n\r\n* Fix test\r\n\r\n* Include typings for prometheus parameters\r\n\r\n* Update test timeouts\r\n\r\n* Update package files\r\n\r\n* Remove unneeded dep\r\n\r\n* Update packages/client/src/service/txpool.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Update packages/client/src/service/txpool.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Update packages/client/src/service/txpool.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Track transaction in pool count by transaction type\r\n\r\n* Add test to verify tx count is incremented with prometheus gauge after transaction is added to pool\r\n\r\n* nits\r\n\r\n* Add prometheus port\r\n\r\n* Overhaul placement and management of metrics server\r\n\r\n* Fix typing\r\n\r\n* Generalize port number in comment\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-17T13:45:02-07:00",
          "tree_id": "598b69d4674fa59c8e91b2ff04fc28557a2ab6ec",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/78cebd57ca0a187c4fcdc73b312657c69ac54488"
        },
        "date": 1713386991136,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42191,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41623,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41518,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40422,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36338,
            "range": "±5.56%",
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
          "id": "c93d51043166990352370dd07c7bf70916748979",
          "message": "Update kzg-wasm to latest (#3358)",
          "timestamp": "2024-04-18T11:28:02-04:00",
          "tree_id": "ffc385ce8072b313e59107bfe949fe1edad222b3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c93d51043166990352370dd07c7bf70916748979"
        },
        "date": 1713454460331,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42329,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41723,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41095,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40346,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36368,
            "range": "±5.77%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "9631d9842226fc4236a8809c17579d8551820b03",
          "message": "monorepo: cleanup ts ignores (#3361)",
          "timestamp": "2024-04-22T09:50:32+02:00",
          "tree_id": "48cdeb27ce5181206b7f4672d36ef943f5fd4758",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9631d9842226fc4236a8809c17579d8551820b03"
        },
        "date": 1713772391960,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42804,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40465,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41218,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39995,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35363,
            "range": "±5.88%",
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
          "id": "f3cbb2e015da98e9548010a0ac3049674578e8bd",
          "message": "monorepo: PrefixedHexString related type fixes (#3357)\n\n* vm: fix eip3540 tests\r\n\r\n* util: improve bytes util typing and natspec\r\n\r\n* vm: fix some tests\r\n\r\n* monorepo: improve and fix some msc types\r\n\r\n* client: fix type issues in eth rpc module\r\n\r\n* block: remove unnecessary comment\r\n\r\n* client: fixes related to PrefixedHexString type\r\n\r\n* evm: PrefixedHexString adjustments\r\n\r\n* vm: preimages type\r\n\r\n* util: isNestedUint8Array typeguard\r\n\r\n* client: fix type\r\n\r\n* util: fix type issues in bytes\r\n\r\n* monorepo: more type improvements\r\n\r\n* monorepo: more type fixes\r\n\r\n* monorepo: address outstanding type issues\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-04-22T10:36:32+02:00",
          "tree_id": "6134fb4be0e63745335f5cef446190256ae2fdcf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f3cbb2e015da98e9548010a0ac3049674578e8bd"
        },
        "date": 1713775149328,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41778,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41159,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40814,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36935,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38955,
            "range": "±1.73%",
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
          "id": "02e8054ed57cbf4d3378d27d3e32c512f5375d5f",
          "message": "Client: Increase timeout for beaconsync integration tests (#3362)",
          "timestamp": "2024-04-22T14:24:53+02:00",
          "tree_id": "98a1e44d1ad38a34de398e8ef9850326a221c8ef",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02e8054ed57cbf4d3378d27d3e32c512f5375d5f"
        },
        "date": 1713788844060,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41944,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41030,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40818,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37324,
            "range": "±5.89%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38708,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "46d09ca7677e51e948ec3a80c123bfff8a541202",
          "message": "Client: New Mechanism to Keep Peer Latest Block Updated (#3354)\n\n* Client -> Peer: add lastEthStatusUpdate property to Peer, set initially on protocol binding, small local refactor\r\n\r\n* Redo handshake in client peer pool periodically, add force option to sendStatus for devp2p protocols\r\n\r\n* Some basic refinement of peer pool periodic request logic (refactor preparation)\r\n\r\n* Client: consolidate latest() method in base Synchronizer class\r\n\r\n* Client: add preparatory updatedBestHeader to Peer, refactor latest() to move from Sync -> Peer\r\n\r\n* Client: add potential best header num differentiated logic to Peer, latest() call on peers in peer pool\r\n\r\n* Client: add Fetcher hack to call peer.latest()\r\n\r\n* Various cleanups\r\n\r\n* Client: Fix lightsync.spec.ts tests\r\n\r\n* Some clean-ups\r\n\r\n* Client: Fix beaconsync.spec.ts tests\r\n\r\n* Client: Fix fullsync.spec.tst tests\r\n\r\n* Client: Fix snapsync.spec.ts tests\r\n\r\n* Client: Fix fetcher tests\r\n\r\n* Client: Fix eth syncing.spec.ts tests\r\n\r\n* Client: Fix integration tests\r\n\r\n* Client: Backup lightsync integration tests (lightsync not supported anymore)\r\n\r\n* Lightsync tests deprecation note\r\n\r\n* Make lightsync tests run (but fail)\r\n\r\n* Client: Removed doubled lightsync integration test file\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>",
          "timestamp": "2024-04-22T14:46:01+02:00",
          "tree_id": "5834b8dd2130f800fe6dc62764a5f498ea3abda4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/46d09ca7677e51e948ec3a80c123bfff8a541202"
        },
        "date": 1713790111646,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42830,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40450,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41152,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40123,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36208,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "2ec9c86fcbf1dbc663f9d4753664c478fa920481",
          "message": "Client: better execution flag guard (#3363)",
          "timestamp": "2024-04-22T21:17:33-04:00",
          "tree_id": "d84558ba63fb4ca2796f1fe2c179dc24e859776d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2ec9c86fcbf1dbc663f9d4753664c478fa920481"
        },
        "date": 1713835543108,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41725,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40749,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40839,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37521,
            "range": "±6.12%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39042,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "effraga@amazon.com",
            "name": "Ev",
            "username": "evertonfraga"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "61acbd3596b876a95e8aaf737c5bf2b214960256",
          "message": "[devp2p] typo fix (#3364)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-23T11:09:49+02:00",
          "tree_id": "a77b6c861bbe036b617e457aeba2eef55dccbb71",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/61acbd3596b876a95e8aaf737c5bf2b214960256"
        },
        "date": 1713863557946,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41396,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40303,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40270,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39598,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35894,
            "range": "±5.43%",
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
          "id": "3125eacb852a7b4775e34df5e62bbf438642fb1d",
          "message": "Extend EIP 4844 transaction toJson data to include additional fields (#3365)\n\n* Add networkWrapperToJson with extended eip 4844 data included\r\n\r\n* Test networkWrapperToJson function\r\n\r\n* Fix linting issue\r\n\r\n* Add docstring\r\n\r\n* Update packages/tx/test/eip4844.spec.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Update packages/tx/src/eip4844Transaction.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Update packages/tx/src/eip4844Transaction.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Rename ExtendedJsonTx to JsonBlobTxNetworkWrapper\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-24T10:53:28-04:00",
          "tree_id": "18fb811827beade033fb44b862f0be9f615ba07d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3125eacb852a7b4775e34df5e62bbf438642fb1d"
        },
        "date": 1713970570175,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42696,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40194,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41085,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40222,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38941,
            "range": "±1.67%",
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
          "id": "b997dc8f5922bff0833d22842c7a662bf34f6887",
          "message": "evm: ignore precompile addresses for some target access events (#3366)\n\n* evm: ignore precompile addresses for some target access events\r\n\r\n* fix the precompile check\r\n\r\n* remove comment",
          "timestamp": "2024-04-24T17:27:30-04:00",
          "tree_id": "2ea9fc6311da7a16b4389b028a8784da27c16296",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b997dc8f5922bff0833d22842c7a662bf34f6887"
        },
        "date": 1713994582851,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41887,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41437,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40965,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37531,
            "range": "±5.34%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39109,
            "range": "±1.58%",
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
          "id": "7a4602c5d6947c23d3190b2885350e73da88e3e6",
          "message": "common: add osaka hardfork and shift verkle to osaka (#3371)\n\n* common: add osaka hardfork and shift verkle to osaka\r\n\r\n* fix the kaustinene 6 startup and transition to the verkle vm",
          "timestamp": "2024-04-25T21:46:50+05:30",
          "tree_id": "71f43414e05ee58005482204b93294df60269dbe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7a4602c5d6947c23d3190b2885350e73da88e3e6"
        },
        "date": 1714061972210,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41934,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40087,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40225,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39604,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35867,
            "range": "±6.28%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "barnabas.busa@ethereum.org",
            "name": "Barnabas Busa",
            "username": "barnabasbusa"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2a1124c657e268e42ce6427aacb4f5d2cb418116",
          "message": "fix: Dockerfile entrypoint typo (#3374)",
          "timestamp": "2024-04-26T13:29:35-04:00",
          "tree_id": "631bb01a99b224c421bbf9ff3d46d638a46ace1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2a1124c657e268e42ce6427aacb4f5d2cb418116"
        },
        "date": 1714152938383,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41874,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41217,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40981,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40171,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36210,
            "range": "±6.77%",
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
          "id": "ae08197f19c5e979c4c0b9bf3cb926190c08a759",
          "message": "Remove unnecessary boolean comparisons when using isActivatedEIP (#3377)\n\n* Remove unnecessary boolean comparisons when using isActivatedEIP\n\n* Fix lint issues\n\n* Fix errors",
          "timestamp": "2024-04-27T07:33:25-04:00",
          "tree_id": "25427563e86b3aa344da8421f1a1260bc153e405",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ae08197f19c5e979c4c0b9bf3cb926190c08a759"
        },
        "date": 1714217765706,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41692,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41199,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41042,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37323,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39039,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "e418c176a91f35fbe36cb06528a6b96aed152c4f",
          "message": "monorepo: revert and adjust some prefixedHexTypes (#3382)",
          "timestamp": "2024-04-27T22:25:04-04:00",
          "tree_id": "778fed5fd24d1968aafe0e094763a2aab3b298d0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e418c176a91f35fbe36cb06528a6b96aed152c4f"
        },
        "date": 1714271258787,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43831,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40979,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41372,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37921,
            "range": "±5.86%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39632,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "c4a9f006770c4f4d3fd015ce90f403fbb5e41a42",
          "message": "trie: fix del stack operation key formatting (#3378)",
          "timestamp": "2024-04-28T13:59:17-07:00",
          "tree_id": "18892d3df0cb2b475c4d09fdc569572481654a6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c4a9f006770c4f4d3fd015ce90f403fbb5e41a42"
        },
        "date": 1714338117259,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41689,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41124,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41066,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37348,
            "range": "±6.53%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38539,
            "range": "±1.97%",
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
          "id": "510331854223150b93e721766c10b117abda303b",
          "message": "client: update multiaddr dep (#3384)\n\n* client: update multiaddr dep\r\n\r\n* client: update multiaddr usage\r\n\r\n* devp2p: update multiaddr usage\r\n\r\n* devp2p: test ci\r\n\r\n* devp2p: fix convert to string\r\n\r\n* devp2p: try to fix convert iport\r\n\r\n* devp2p: remove multiaddr dep\r\n\r\n* devp2p: remove util method that was already in the repo\r\n\r\n* remove todo\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-29T13:04:13-04:00",
          "tree_id": "786c05bddc4e9c92950fe94c31f7feb7742ab260",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/510331854223150b93e721766c10b117abda303b"
        },
        "date": 1714410575667,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42675,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40438,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41101,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40563,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39174,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "2dd8a4252437e62b3f4a9493b214a126be9436d5",
          "message": "fix: Bug in error message (#3386)\n\nError message had a typo",
          "timestamp": "2024-05-01T14:49:27-04:00",
          "tree_id": "2b1061f2ad7a197b8b7804a0ee128d1736f965aa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2dd8a4252437e62b3f4a9493b214a126be9436d5"
        },
        "date": 1714589527469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40166,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39667,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39814,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38785,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35076,
            "range": "±7.02%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "63a530f1014b633d61006a16ec3411f16ece9b17",
          "message": "block: fix the block body parsing as well as save/load from blockchain (#3392)\n\n* block: fix the block body parsing as well as save/load from blockchain\r\n\r\n* debug and fix block references on header save/get\r\n\r\n* fix build\r\n\r\n* debug and fix the missing requests in body raw/serialization\r\n\r\n* lint",
          "timestamp": "2024-05-03T13:06:08+02:00",
          "tree_id": "58d26053e0349de5dae824f110cd6db5eec0b6c7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/63a530f1014b633d61006a16ec3411f16ece9b17"
        },
        "date": 1714734660849,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41987,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41026,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40296,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39987,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36389,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "8735f48cd645576176dd004fbb8530c27128323d",
          "message": "Revise EIP 6610  (#3390)\n\n* 6110 changes, part 1\r\n\r\n* Properly decode deposit log\r\n\r\n* Add test for deposit requests with buildBlock\r\n\r\n* Update test\r\n\r\n* Fix lint issues\r\n\r\n---------\r\n\r\nCo-authored-by: Amir <indigophi@protonmail.com>",
          "timestamp": "2024-05-03T10:30:56-04:00",
          "tree_id": "35a2bd6f35ef27ae2c02799c85715f70732ee26b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8735f48cd645576176dd004fbb8530c27128323d"
        },
        "date": 1714746949124,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42257,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40895,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41093,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39794,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35608,
            "range": "±6.93%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "d667cc81a776e47e4ffe029d591000ff53da89e4",
          "message": "blockchain: handle nil blockbodies for backward compatibility (#3394)",
          "timestamp": "2024-05-03T17:30:26+02:00",
          "tree_id": "5ef2bee87d00d80d5b8ab971ddb2af22807509cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d667cc81a776e47e4ffe029d591000ff53da89e4"
        },
        "date": 1714750527136,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42782,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40682,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41140,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40321,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36148,
            "range": "±5.85%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "eef06a5443d6033fdb0096e3b930773aa51b01f3",
          "message": "client: simplify --ignoreStatelessInvalidExecs to just a boolean flag (#3395)\n\n* client: simplify --ignoreStatelessInvalidExecs to just a boolean flag\r\n\r\n* fixes",
          "timestamp": "2024-05-03T19:10:24+02:00",
          "tree_id": "0d00c596969e88c181898f37b1cb6ee5846fdd09",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eef06a5443d6033fdb0096e3b930773aa51b01f3"
        },
        "date": 1714756569155,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43034,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40597,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41447,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40598,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35973,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "d94dc5fbfedac86362011a80d528464e64b62f11",
          "message": "common: add spec test for 2935 contract code and update history storage address (#3373)\n\n* vm: add spec test for 2935 contract code\r\n\r\n* update the history address\r\n\r\n* reset the hitory address for kaustinen6\r\n\r\n* make sure kaustinen6 still uses old history save address\r\n\r\n* apply dry feedback",
          "timestamp": "2024-05-03T14:23:54-04:00",
          "tree_id": "2fc24dcb48667ee2b839f24c3e45faf690e20bf6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d94dc5fbfedac86362011a80d528464e64b62f11"
        },
        "date": 1714760946354,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42364,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41689,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41573,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37944,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39652,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "674ed0bb24de20ba21d9c81e8a11c891e199fa8d",
          "message": "EIP 6110 fixes (#3397)\n\n* block/common/vm: update 6110 to validate reported requests\r\n\r\n* vm: fix some of the encoding logic of 6110\r\n\r\n* vm: fix eip6110 encoding\r\n\r\n* vm: ensure amount bytes / index bytes are treated the same way\r\n\r\n* common: revert eip changes\r\n\r\n* Adjust error message test checks for\r\n\r\n* Remove comment\r\n\r\n---------\r\n\r\nCo-authored-by: Amir <indigophi@protonmail.com>",
          "timestamp": "2024-05-03T18:41:36-07:00",
          "tree_id": "7ed7cd8b818c3193de25cd5b8e2de0110080a654",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/674ed0bb24de20ba21d9c81e8a11c891e199fa8d"
        },
        "date": 1714787191804,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41596,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41063,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41140,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37747,
            "range": "±4.63%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38913,
            "range": "±1.72%",
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
          "id": "9818351f131e94dbf965da0b3ce4ec502b7855ca",
          "message": "Common refactoring (#3391)\n\n* Remove unnecessary boolean checks when using isActivatedEip\n\n* Remove unnecessary boolean checks when using hardforkIsActiveOnBlock\n\n* Remove unnecessary boolean checks when using hardforkGteHardfork\n\n* Remove unnecessary boolean checks when using gteHardfork\n\n* Fix lint issues\n\n* Fix lint issues\n\n* Merge branch 'master' into common-refactoring\n\n* Merge branch 'master' into common-refactoring",
          "timestamp": "2024-05-03T22:04:56-04:00",
          "tree_id": "7b5deef31b7de738c9534b732e5362ef7bc01290",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9818351f131e94dbf965da0b3ce4ec502b7855ca"
        },
        "date": 1714788579724,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42293,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41314,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41735,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40961,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36870,
            "range": "±5.12%",
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
          "id": "02e5e7802e8efa9fbede8d656eae4dcd597e1253",
          "message": "enhance typing of cl requests and do beacon/execution payload handling (#3398)\n\n* enhance typing of cl requests and do beacon/execution payload handling\r\n\r\n* implement deserialization and fix enhance request spec test\r\n\r\n* debug and fix eip7685 block spec\r\n\r\n* debug and fix vm 7685 spec test\r\n\r\n* debug and fix vm api 6110, 7002 request spec test\r\n\r\n* make request code more concise\r\n\r\n* Fix test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-05-04T15:35:14-04:00",
          "tree_id": "15470fe22038878943d07bdacfc37234426210af",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02e5e7802e8efa9fbede8d656eae4dcd597e1253"
        },
        "date": 1714851477206,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42189,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41409,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40632,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40145,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36095,
            "range": "±5.55%",
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
          "id": "c9bbd23a6f61b6cc0da12e77003b657737f6fb13",
          "message": "update ethereum-tests to v13.3 (#3404)",
          "timestamp": "2024-05-06T16:02:24+05:30",
          "tree_id": "897885b3df1a6a00cd766695461653b79561796b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c9bbd23a6f61b6cc0da12e77003b657737f6fb13"
        },
        "date": 1714991704173,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42859,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40599,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41081,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40084,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38337,
            "range": "±2.46%",
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
          "id": "018245b0dd2dc2e3ee49e8b72b893788ca539811",
          "message": "client: add execution api v4 handling to engine (#3399)\n\n* client: add execution api v4 handling to engine\n\n* fix error message typo\n\n* apply feedback and rename deposit requests to deposit receipts\n\n* typo\n\n* add a basic v4 spec test and get it working",
          "timestamp": "2024-05-06T13:28:12-04:00",
          "tree_id": "35cb4ba3145edadda40d714bd5108622ba1eef9f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/018245b0dd2dc2e3ee49e8b72b893788ca539811"
        },
        "date": 1715016647949,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42412,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40144,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40842,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39920,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39168,
            "range": "±1.63%",
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
          "id": "0ed0a0766adc047774f7a722635ad8978c2531c2",
          "message": "util,evm: cleanup and fix some verkle related issues (#3405)",
          "timestamp": "2024-05-06T12:05:24-07:00",
          "tree_id": "57b8704a5687ca0b07f679344d9b15ea109c4573",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0ed0a0766adc047774f7a722635ad8978c2531c2"
        },
        "date": 1715022482626,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41766,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41031,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40741,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37484,
            "range": "±4.70%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38484,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "9ec6bd205b3870258f525b2edc07d764e19a4ca3",
          "message": "Add verkle execution support to executeBlocks (#3406)\n\n* Add verkle execution support to executeBlocks\n\n* use block witness instead of parent block\n\n* Shut down client after execution completes\n\n* Fix test timing",
          "timestamp": "2024-05-07T13:03:01-04:00",
          "tree_id": "1612bf8c483452a0cd84e694d980a41a7b1ed0e5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9ec6bd205b3870258f525b2edc07d764e19a4ca3"
        },
        "date": 1715101545060,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42312,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41513,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41223,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38190,
            "range": "±4.84%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39647,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      }
    ]
  }
}