window.BENCHMARK_DATA = {
  "lastUpdate": 1687271841881,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "5b410c037ca78242655138f34a1533862f463cd3",
          "message": "Upgrade `ethers` to v6 in `wallet` (#2747)\n\n* migrate to uint8arrays\r\n\r\n* add 0x prefix\r\n\r\n* Remaining fixes and cleanup\r\n\r\n* Remove duplicate helpers\r\n\r\n* slice to subarray\r\n\r\n* wallet: fix browser tests\r\n\r\n* Address feedback\r\n\r\n* Address feedback\r\n\r\n* partial migration to tape\r\n\r\n* WIP changes\r\n\r\n* Finish migrating tests\r\n\r\n* revert error message checking in test\r\n\r\n* update tests again\r\n\r\n* fix test\r\n\r\n* test fixes\r\n\r\n* upgrade ethers to v6\r\n\r\n* Fix tests\r\n\r\n* Remove obsolete test\r\n\r\n* lint\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-06-05T21:48:31+05:30",
          "tree_id": "bc28ecb49fea5ed5ab26a95061e297f2f60a90b5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b410c037ca78242655138f34a1533862f463cd3"
        },
        "date": 1685982164720,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25021,
            "range": "±6.76%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26463,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25209,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26229,
            "range": "±3.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24350,
            "range": "±3.69%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "d1ba362f034f8ca1d76a18f7a872f80648e60f4b",
          "message": "Client: Fix PeerPool Memory Leak (#2752)\n\n* Client: set memory shutdown threshold from 95 to 92 (did not trigger in all occasions)\r\n\r\n* Client: tsconfig path fix\r\n\r\n* Client: send disconnect to peer banned from peer pool (fixes unbounded messageQueue growths), fix reconnect after ban\r\n\r\n* Client: add additional messageQueue safe guard for BoundProtocol\r\n\r\n* Fix tests",
          "timestamp": "2023-06-05T22:59:08+05:30",
          "tree_id": "03ec34b5493281f53b6273c7bd61642634641328",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d1ba362f034f8ca1d76a18f7a872f80648e60f4b"
        },
        "date": 1685986346196,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30991,
            "range": "±5.57%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31055,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30879,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30262,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23948,
            "range": "±11.29%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "752b2707f88c3fae50aee8f6ed42fabcbbbb4ec9",
          "message": "Add low overhead blob tx constructor option (#2755)\n\n* Add no boilerplate option for blob tx constructor\r\n\r\n* remaining items",
          "timestamp": "2023-06-06T18:02:32+05:30",
          "tree_id": "ece25f77e5ad1cf531ad93c9a8b3882dc010a8b7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/752b2707f88c3fae50aee8f6ed42fabcbbbb4ec9"
        },
        "date": 1686054962850,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30102,
            "range": "±7.19%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31163,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30963,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30452,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23533,
            "range": "±12.11%",
            "unit": "ops/sec",
            "extra": "66 samples"
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
          "id": "399247b2ad03759dcf7558df3f010b34cb4396d8",
          "message": "Client: Fix eth_getStorage RPC method (#2646)\n\n* Client: fix eth_getStorage RPC method, replace and expand tests (WIP)\r\n\r\n* eth: define EMPTY_SLOT variable\r\n\r\n* ETH: use this._vm instead of copy for getStorageAt\r\n\r\n* ETH: throw error for 'pending' block request\r\n\r\n* getStorageAt:  expect 32 byte value as return\r\n\r\n* VM: create copy.spec.ts to teset vm.copy()\r\n\r\n* revert back to using vm.copy()\r\n\r\n* add checkpointing calls to test\r\n\r\n* vm: update copy.spec.ts\r\n\r\n* Add tests for testing getStorageAt on blocks other than \"latest\" and \"pending\"\r\n\r\n* Check for empty slot response instead of using notEqual\r\n\r\n* Remove references to functions accountExists and flush that no longer exist on StateManager\r\n\r\n* Use blockOpt parameter to lookup block for storage lookup and update tests\r\n\r\n---------\r\n\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Amir <indigophi@protonmail.com>",
          "timestamp": "2023-06-06T11:37:34-07:00",
          "tree_id": "7416008556eca581666ffd961ad2bcd441ce9b92",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/399247b2ad03759dcf7558df3f010b34cb4396d8"
        },
        "date": 1686076851877,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32247,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32499,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32459,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31093,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24054,
            "range": "±12.20%",
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
          "id": "3b1976bbb9de204d3de659ce4643bf9eec49e3a5",
          "message": "client: Increase client test coverage (#2757)\n\n* Write test to test vmexecution's executeBlocks function\r\n\r\n* Write test to test fullsync's processBlocks function\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-06T15:36:01-07:00",
          "tree_id": "0c36f7c7eef028e7e338e1847af3c2f810fbb68f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3b1976bbb9de204d3de659ce4643bf9eec49e3a5"
        },
        "date": 1686091218361,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18421,
            "range": "±5.77%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18731,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18663,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18475,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17996,
            "range": "±3.44%",
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
          "id": "5c513d153bfaf916bdc962856f5fd1cbe85f5775",
          "message": "tx: Update the kzg validation and replace trusted setup with latest (#2756)\n\n* tx: Update the kzg valiation and replace trusted setup with latest\n\n* fix specs",
          "timestamp": "2023-06-07T08:26:09-04:00",
          "tree_id": "fedd0e7fe35f8ab020c11002e9a8cfd376b58993",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5c513d153bfaf916bdc962856f5fd1cbe85f5775"
        },
        "date": 1686141026266,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27622,
            "range": "±6.58%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27484,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27168,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25943,
            "range": "±8.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20600,
            "range": "±12.15%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "06fb9a6eadc02775524d7b6b8ec2aed9a3053b0c",
          "message": "client: fix the newPayloadV3 validations (#2762)\n\n* client: fix the newPayloadV3 validations\r\n\r\n* fix spec",
          "timestamp": "2023-06-08T08:41:59+02:00",
          "tree_id": "8395c3ed23ffd8fb98f2e20cdf7742bb745b0f6a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/06fb9a6eadc02775524d7b6b8ec2aed9a3053b0c"
        },
        "date": 1686206719782,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31691,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31964,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31390,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26873,
            "range": "±9.39%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30502,
            "range": "±3.04%",
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
          "id": "50fe02156ccc485eed2edaea61ca9d8160731d99",
          "message": "client: Fixes for block and blob building uncovered in devnet6 (#2763)",
          "timestamp": "2023-06-08T13:01:17+02:00",
          "tree_id": "fed9db77f4559e42032bd59a1020d09715193a27",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/50fe02156ccc485eed2edaea61ca9d8160731d99"
        },
        "date": 1686222683121,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31448,
            "range": "±5.49%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31751,
            "range": "±2.63%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31826,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30903,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24832,
            "range": "±11.03%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "4fe13f420b62a3c0b66cf1c181c517bec98bafd5",
          "message": "block: add missing tx type (#2769)",
          "timestamp": "2023-06-10T09:28:37-04:00",
          "tree_id": "4da8312671ac357f24c1ca118b719ba5914e4760",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4fe13f420b62a3c0b66cf1c181c517bec98bafd5"
        },
        "date": 1686403908436,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31870,
            "range": "±4.90%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32168,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31794,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30948,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25545,
            "range": "±9.83%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "cac66945736f3f1c3a66895e5de9df47aea96bb9",
          "message": "vm: Discard blob txs with missing blobs for block building (#2765)\n\n* vm: Discard blob txs with missing blobs for block building\r\n\r\n* refactor to reduce surface\r\n\r\n* remove non existent case and enhance coverage\r\n\r\n* fix the txtype on ethprotocol handling",
          "timestamp": "2023-06-10T21:58:31+05:30",
          "tree_id": "3c380167e9f057e56ab3fea1007a9c9d8d3d0b29",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cac66945736f3f1c3a66895e5de9df47aea96bb9"
        },
        "date": 1686414707805,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31805,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30903,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31761,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25961,
            "range": "±10.68%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30215,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "373e573e6b294ff93d53a84632aead9b107d4012",
          "message": "monorepo: remove instances of `any` typecasting (#2772)",
          "timestamp": "2023-06-11T09:20:18-04:00",
          "tree_id": "ad2fac4337f1da9d3b4ee05af9d6b7d9db375d28",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/373e573e6b294ff93d53a84632aead9b107d4012"
        },
        "date": 1686489823251,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31466,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31864,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31465,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30691,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24416,
            "range": "±11.52%",
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
          "id": "960fd0a4c58af3d234f568ec56e221bf1c0ccaee",
          "message": "tx: Generic Transaction Interface (#2767)\n\n* tx/transaction-interface\r\n\r\n* tx: implemement transaction interface in basetransaction\r\n\r\n* tx: update transaction types to use new generic types\r\n\r\n* tx: refactor with updated tx interfaces\r\n\r\n* block: refactor with updated tx interfaces\r\n\r\n* client: refactor with updated tx interfaces\r\n\r\n* vm: refactor with updated tx interfaces\r\n\r\n* devp2p: refactor with updated tx interfaces\r\n\r\n* monorepo: adjust test with updated tx types\r\n\r\n* docs: update READMEs Transaction->LegacyTransaction\r\n\r\n* tx: replace as any typecast with more precise typecast\r\n\r\n* client: simplify TxData typecastings\r\n\r\n* tx: more simplifications\r\n\r\n* tx: new tx typeguards and use enums instead of direct number comparison\r\n\r\n* tx: TTransactionType -> T generic renaming\r\n\r\n* tx: address review by renaming UnknownTransaction to TypedTransaction and using the TransactionType enum instead of numbers\r\n\r\n* linting fix\r\n\r\n* tx: update naming UnknownTxData -> TypedTxData\r\n\r\n* tx: declare TxData and TxValuesArray types in transaction class files\r\n\r\n* client: Transaction -> LegacyTransaction\r\n\r\n* vm: simplify test and use enums when possible\r\n\r\n* tx: update example import\r\n\r\n* tx: update more examples\r\n\r\n* add improvements\r\n\r\n* fix error message\r\n\r\n* improv\r\n\r\n* type improv\r\n\r\n* tx: fix rebase issue\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-06-12T11:47:22+02:00",
          "tree_id": "ef48186c3d10072231e52fdad6bc276b8845f6b4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/960fd0a4c58af3d234f568ec56e221bf1c0ccaee"
        },
        "date": 1686563445665,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31101,
            "range": "±5.45%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31378,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27259,
            "range": "±9.68%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30825,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29935,
            "range": "±3.10%",
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
          "id": "6f17183248a3cc95b5f93116dfbd1f76ec42ee93",
          "message": "tx: remove default hardfork from tx classes (#2776)\n\n* tx: remove default hardfork\r\n\r\n* tx: update txtype of 4844 tx\r\n\r\n* tx: remove default hardfork from baseTransaction class",
          "timestamp": "2023-06-12T16:45:31-04:00",
          "tree_id": "58dc5a32619faa052b216b68d3e050e4d25c5bc0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6f17183248a3cc95b5f93116dfbd1f76ec42ee93"
        },
        "date": 1686603348829,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25480,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26905,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24551,
            "range": "±5.88%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21722,
            "range": "±12.16%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25447,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "a86fe252742108441258402b914fed4ef4f66916",
          "message": "common: update the blob target and limit to 3/6 respectively (#2775)\n\n* common: update the blob target and limit to 3/6 respectively\r\n\r\n* fix block spec\r\n\r\n* spec\r\n\r\n* fix spec\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-13T12:55:40+05:30",
          "tree_id": "d43e2181982f5fbb36e1344f9c0bf0d40ce86041",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a86fe252742108441258402b914fed4ef4f66916"
        },
        "date": 1686641345790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30810,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31689,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31531,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30837,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24785,
            "range": "±11.39%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "bc9a613a8be56915196eea99f8e846a2dead9351",
          "message": "vm: fix the dataGasPrice calculation in running the tx (#2779)",
          "timestamp": "2023-06-13T12:04:14-04:00",
          "tree_id": "16ad939486e5940f3caf7c63edfe58b2b698f23f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bc9a613a8be56915196eea99f8e846a2dead9351"
        },
        "date": 1686673208044,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31111,
            "range": "±5.65%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31657,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30577,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30065,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22834,
            "range": "±12.27%",
            "unit": "ops/sec",
            "extra": "61 samples"
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
          "id": "c06214afeff69de15df8150fd5da2f79b6ba939b",
          "message": "Remove `libp2p` transport layer (#2758)\n\n* Make libp2p deps optional\n\n* experiments\n\n* run npm install when building browser\n\n* Remove convenience types\n\n* Remove more libp2p stuff\n\n* Move libp2p stuff to legacy folder\n\n* Update browser config stuff to exclude ethers\n\n* Turn off sync and add v8Engine stub\n\n* skip transports on browser build\n\n* eslint ignore libp2p archive\n\n* clean up comments",
          "timestamp": "2023-06-13T13:25:34-04:00",
          "tree_id": "f8b7fbe0512671c25732aaa3df86d74f36fbf47c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c06214afeff69de15df8150fd5da2f79b6ba939b"
        },
        "date": 1686677337421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31959,
            "range": "±3.97%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32055,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31911,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27569,
            "range": "±8.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29907,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "4d7b4d9d043ecd44ac1eb9bb14ba8eb8bbdbe2d9",
          "message": "vm: fix tests (#2780)\n\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-14T11:32:20+02:00",
          "tree_id": "477a31da93a3ab576f25b0a1dd4079a193bdc181",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4d7b4d9d043ecd44ac1eb9bb14ba8eb8bbdbe2d9"
        },
        "date": 1686735376217,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19006,
            "range": "±6.06%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19348,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19185,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18045,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14958,
            "range": "±12.26%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "6b8d9f4e3032d9bd04e8fafe020887f4aef29ccb",
          "message": "client: fix new payload 4844 validations (#2784)\n\n* client: fix new payload 4844 validations\r\n\r\n* fix spec",
          "timestamp": "2023-06-14T16:28:59+02:00",
          "tree_id": "aa77096fa13938f4e44b9ac6c533457f99892606",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6b8d9f4e3032d9bd04e8fafe020887f4aef29ccb"
        },
        "date": 1686753144124,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31824,
            "range": "±4.88%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31445,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31488,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25859,
            "range": "±10.66%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29825,
            "range": "±3.07%",
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
          "id": "b21e8d2db5b7338009e4a4c8ed85a39f9eba8beb",
          "message": "Utils tests (#2781)\n\n* Add tests for lock.ts\r\n\r\n* Add tests for mapDB.ts\r\n\r\n* When copying, create a new coppied backing map\r\n\r\n* Fix linting issues\r\n\r\n* Revert \"When copying, create a new coppied backing map\"\r\n\r\nThis reverts commit a7cd158b2844c049e7892167976b37eca1f6e5d9.\r\n\r\n* Remove test for copy function\r\n\r\n* Update packages/util/test/mapDB.spec.ts\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-15T22:11:57-04:00",
          "tree_id": "3e33055e7fdc79f080301ee8e486a08b2f64ef40",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b21e8d2db5b7338009e4a4c8ed85a39f9eba8beb"
        },
        "date": 1686882930364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30703,
            "range": "±6.19%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31580,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31287,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30508,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24263,
            "range": "±11.62%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "972c6823551cebd5ca3a3c27eed26091208e9040",
          "message": "Monorepo: Vitest Test Transition / ESM Part 2 (#2764)\n\n* RLP: Switch Tape -> Vitest, add dependencies, remove Karma config\n\n* Rebuild package-lock.json\n\n* (Hopefully) fix coverage\n\n* RLP: update import file path references\n\n* RLP: switch to type module in package.json, fix linter (explcitly switch to cjs)\n\n* Util: tape -> vitest\n\n* Util: add internal .js file references\n\n* Monorepo: renamed other .eslintrc.js files to .eslintrc.cjs\n\n* Util: adjust external import path references\n\n* ESLint config path fix\n\n* Common: tape -> vitest transition\n\n* Common: fix browser tests\n\n* Common: add missing path references\n\n* Common fixes\n\n* Block: Tape -> Vitest test transition (Node tests)\n\n* Migrate blockchain tests to vitest\n\n* Remove karma from blockchain\n\n* Small syntax updates\n\n* Block: require -> import JSON updates\n\n* Block: JSON import related test fixes\n\n* Block: update .js path references\n\n* Blockchain: .js additions\n\n* Blockchain: add more .js path references\n\n* Run browser tests in headless mode\n\n* StateManager: vitest transition part 1\n\n* StateManager: tape -> vitest test transitions (EthersStateManager test not yet working, need EVM transition first)\n\n* Remove require() from ESM test\n\n* StateManager: update lru-cache dependency from v7 -> v9\n\n* StateManager: more .js file additions\n\n* Add browser config for vitest in block\n\n* Tx: tape -> vitest test transition\n\n* Tx: adopt tx test runner\n\n* Tx: JSON require -> import\n\n* Tx: fixes\n\n* Tx: add .js path references\n\n* Rebuild package-lock.json\n\n* migrate wallet to esm/vitest\n\n* move devp2p to esm/vitest\n\n* Fix port in use errors in tests\n\n* ESM/Vitest Transition: add Trie and EVM (#2783)\n\n* Trie: tape -> vitest test transition\r\n\r\n* Trie: .js file path additions\r\n\r\n* EVM: tape -> vitest transition\r\n\r\n* EVM: .js path reference additions\r\n\r\n* Fix ethers state manager tests\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\n\n* Fix typo\n\n* Wrap async tests in promises so vitest waits for them to finish\n\n* Various lint fixes\n\n* VM: tape -> vitest transition (API tests)\n\n* VM: keep Blockchain/State tests on Tape for now\n\n* VM: run Blockchain/State tests on CJS dist folder\n\n* make most devp2p tests async\n\n* Vitest/ESM: VM File Path Additions and Ethash Transition (#2786)\n\n* VM: fix linting\r\n\r\n* VM: add .js path references\r\n\r\n* Ethash: tape -> vitest transition\r\n\r\n* Ethash: ad .js file path references\n\n* Wrap runBlock/runTx in describe\n\n* turn off vm browser tests in ci\n\n* Fix examples CI\n\n* Fix wallet/ethash CI work\n\n* Adjust dpt setup\n\n* Catch addpeer errors silently\n\n* Make trie/vm type module\n\n* fix vm examples\n\n* set higher timeout\n\n* revert vm module type\n\n* Fix Util tests\n\n* Etash: take timeout from script command (60000)\n\n* Etash test timeout adjustments\n\n* Etash timeout adjustment\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-16T06:56:05-04:00",
          "tree_id": "60941f7968baa31b6ef1bd5f8af53b4a932af3a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/972c6823551cebd5ca3a3c27eed26091208e9040"
        },
        "date": 1686913232408,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25695,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26130,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26582,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26101,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24808,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "d645cd2a86f64416f443e62a59892554f0b546d3",
          "message": "devp2p: file extensions (#2789)",
          "timestamp": "2023-06-16T22:42:39-04:00",
          "tree_id": "e100fe716cce476a0f9b68b1dc79fe69e1858b7f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d645cd2a86f64416f443e62a59892554f0b546d3"
        },
        "date": 1686970000278,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30688,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30863,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30602,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30481,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25248,
            "range": "±10.21%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "6100ca07a61d06b55173adc9b861a6fbaf336b6f",
          "message": "util: improve bytes jsdocs and rename intToHex to intToPrefixedHexString (#2791)\n\n* util: improve jsdocs and rename intToHex to intToPrefixedHexString\n\n* monorepo: intToHex -> intoToPrefixedHexString\n\n* tx: remove file accidentally committed",
          "timestamp": "2023-06-17T06:51:39-04:00",
          "tree_id": "73bb4ebce597bab15174a9e9cd58857c97737389",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6100ca07a61d06b55173adc9b861a6fbaf336b6f"
        },
        "date": 1686999395645,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25847,
            "range": "±6.38%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26272,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26044,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25556,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25202,
            "range": "±3.45%",
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
          "id": "b71b3d4ae81dadf32160cd67e621e6260e1d2985",
          "message": "wallet: remove type/node devdependency (#2793)\n\n* wallet: remove type/node devdependency\n\n* wallet: remove tape script",
          "timestamp": "2023-06-17T22:22:31-04:00",
          "tree_id": "9d3245616d7ba95f450b7c63521c26e9e11821fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b71b3d4ae81dadf32160cd67e621e6260e1d2985"
        },
        "date": 1687055274018,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16796,
            "range": "±7.00%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17836,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16048,
            "range": "±7.62%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17926,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16663,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "9b044028a4e50b976ed3da3446ffda34c2ded35a",
          "message": "monorepo: remove tape scripts (#2794)",
          "timestamp": "2023-06-18T11:59:31-04:00",
          "tree_id": "3da7b02cf21eefb5a74e14a77cad9f454c3326bc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9b044028a4e50b976ed3da3446ffda34c2ded35a"
        },
        "date": 1687104204543,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30937,
            "range": "±6.55%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31371,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30706,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30457,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24784,
            "range": "±10.40%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "distinct": false,
          "id": "4146f58af854fc31f528fd3252e0a5baacd19b94",
          "message": "util: Rename mapdb copy function (#2795)\n\n* Rename copy function to shallowCopy\n\n* Add test for shallowCopy",
          "timestamp": "2023-06-18T17:06:33-04:00",
          "tree_id": "bcef1d36cef9dcb474c4b237a14208f14f950309",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4146f58af854fc31f528fd3252e0a5baacd19b94"
        },
        "date": 1687123554073,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32834,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32782,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29881,
            "range": "±7.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31882,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31043,
            "range": "±2.32%",
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
          "id": "51323d73a7871b86e3b1a93811499dd5ac5c97a4",
          "message": "util: Add tests for blob helpers (#2796)",
          "timestamp": "2023-06-18T18:56:31-04:00",
          "tree_id": "464968b2732554af3c553d2371f8d144ffa10596",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/51323d73a7871b86e3b1a93811499dd5ac5c97a4"
        },
        "date": 1687129284601,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26419,
            "range": "±5.50%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26986,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26813,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26353,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24587,
            "range": "±7.22%",
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
          "id": "2fd4087ad2aec85580750e4748ce4b3a6a2b32af",
          "message": "genesis: Extract network genesis states into a separate genesis package (#2768)\n\n* genesis: Extract network genesis states into a separate genesis package\r\n\r\nmove the stats json\r\n\r\ngenesis working build\r\n\r\nbuild and working\r\n\r\nlint\r\n\r\ncleanup\r\n\r\nrefactor\r\n\r\nfix build\r\n\r\nadd spec coverage\r\n\r\nfix tests\r\n\r\nenhance coverage\r\n\r\nfix\r\n\r\nadd spec\r\n\r\n* rebase fixes\r\n\r\n* bring test uptodate with new framework\r\n\r\n* fix spec",
          "timestamp": "2023-06-19T10:19:22+02:00",
          "tree_id": "aa04bb43073deaa3ce0728ed335d00d40d56d2db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2fd4087ad2aec85580750e4748ce4b3a6a2b32af"
        },
        "date": 1687163004346,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32399,
            "range": "±5.36%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32433,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28927,
            "range": "±8.33%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31891,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30723,
            "range": "±2.52%",
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
          "id": "3bf46928a9a52133732a0fdd9fb22e65dcf21e4d",
          "message": "Common, Block, VM: Unify and Refactor getHardforkBy Options (#2798)\n\n* Common: getHardforkByBlockNumber() -> getHardforkBy(), adopt tests\n\n* Common: setHardforkByBlockNumber() -> setHardforkBy(), reintroduce BigIntLike\n\n* Fixes\n\n* Fix client test",
          "timestamp": "2023-06-19T10:49:48-04:00",
          "tree_id": "484d02ccacc45c5083cc5ee795de7ed82313395b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3bf46928a9a52133732a0fdd9fb22e65dcf21e4d"
        },
        "date": 1687186435080,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30103,
            "range": "±6.38%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30911,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30058,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25176,
            "range": "±10.46%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29105,
            "range": "±3.37%",
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
          "id": "df8d8d7077eaff7408a6cde510463a4cf3b367e5",
          "message": "Block, VM: Unify hardforkBy Options (#2800)\n\n* Block: hardforkByBlockNumber, hardforkByTTD -> setHardfork option\r\n\r\n* VM: hardforkByBlockNumber, hardforkByTTD -> setHardfork option (constructor and runBlock())\r\n\r\n* Block, VM: adopt hardforkByBlockNumber, hardforkByTTD usages in other libraries\r\n\r\n* blockchain: fix test\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* vm/block: lint\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-20T11:23:14+02:00",
          "tree_id": "f3cb43d5bf8679284f8676f53b8f5bb3ffcf0833",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/df8d8d7077eaff7408a6cde510463a4cf3b367e5"
        },
        "date": 1687253431244,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 34027,
            "range": "±4.53%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31030,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33641,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32768,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 32005,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "d89b9762249c3ba2ea86ff050b83614cedd435b2",
          "message": "Fix npm run test:API script (#2802)",
          "timestamp": "2023-06-20T10:26:30-04:00",
          "tree_id": "6eb04f7268d7d94357aaa1484d14f66ddfa8df14",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d89b9762249c3ba2ea86ff050b83614cedd435b2"
        },
        "date": 1687271841128,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31833,
            "range": "±6.40%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32318,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31953,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31158,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25418,
            "range": "±10.96%",
            "unit": "ops/sec",
            "extra": "74 samples"
          }
        ]
      }
    ]
  }
}