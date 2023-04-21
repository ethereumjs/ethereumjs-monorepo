window.BENCHMARK_DATA = {
  "lastUpdate": 1682101264372,
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
          "id": "26a8dcda9ae74921574d0b8198ce170901f300ab",
          "message": "tx: ensure eip3860 txs can have more than max_initcode_size data if to field is non-empty (#2575)",
          "timestamp": "2023-03-09T14:06:38+01:00",
          "tree_id": "842fa808aa9956a40f6f582c377189f8bc91787c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/26a8dcda9ae74921574d0b8198ce170901f300ab"
        },
        "date": 1678367442231,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8154,
            "range": "±4.19%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8304,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 7727,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8003,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7850,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "572a2e5d3339f0a56fed40c9c3b589c120fc58bf",
          "message": "EVM: Avoid memory.read() Memory Copy (#2573)\n\n* EVM: added avoidCopy parameter to memory.read() function, first test on CREATE opcode\r\n\r\n* EVM: Add direct memory read to all calling opcodes\r\n\r\n* EVM: Copy over memory on IDENTITY precompile\r\n\r\n* EVM: remove length checks and return buffer 0-filling in Memory.read() (memory is uncoditionally being extended properly anyhow)\r\n\r\n* Some optimizations",
          "timestamp": "2023-03-09T14:50:09+01:00",
          "tree_id": "87127feaf245fc5a242a9afcc69fef40b3be7456",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/572a2e5d3339f0a56fed40c9c3b589c120fc58bf"
        },
        "date": 1678370006713,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8763,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8593,
            "range": "±5.02%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8777,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8742,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8146,
            "range": "±6.66%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "80ecec03672efb4126b52c514d817ed809a3a88d",
          "message": "blockchain: fix merge->clique transition (#2571)",
          "timestamp": "2023-03-09T22:54:02+05:30",
          "tree_id": "12f4e5a5b7b80170377147bf4bf3df5c91e3044d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/80ecec03672efb4126b52c514d817ed809a3a88d"
        },
        "date": 1678382810875,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15024,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15328,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14577,
            "range": "±6.13%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15318,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14732,
            "range": "±2.19%",
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
          "id": "16af4f1f1aa8813656840d84c948b4d75375cb2e",
          "message": "Client: ensure safe/finalized blocks are part of the canonical chain on forkchoiceUpdated (#2577)\n\n* client/engine: ensure finalized/safe blocks are in canonical chain\r\n\r\n* client: engine-api: fix finalized block check\r\n\r\n* client/tests: fix forkchoice updated test\r\n\r\n* client: add fcu tests to check if blocks are part of canonical chain",
          "timestamp": "2023-03-10T23:45:14+05:30",
          "tree_id": "917f3103eeb38125a7a358b569ba946b3df1dde8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/16af4f1f1aa8813656840d84c948b4d75375cb2e"
        },
        "date": 1678472286050,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14989,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14415,
            "range": "±4.67%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15123,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14599,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13046,
            "range": "±8.19%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "2e1826e4a14fda708857f7d3243c2b897e4a10fa",
          "message": "client/engine: ensure payload has a valid timestamp forkchoiceUpdated (#2579)",
          "timestamp": "2023-03-10T21:12:51+01:00",
          "tree_id": "26ce1f662c356bb930b532650db8bc14e3b89898",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2e1826e4a14fda708857f7d3243c2b897e4a10fa"
        },
        "date": 1678479345043,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14916,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14607,
            "range": "±4.54%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14782,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13448,
            "range": "±9.12%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14871,
            "range": "±2.08%",
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
          "id": "9c957b78a1607f3430c905182fcf267792aad2ed",
          "message": "client/engine: ensure invalid blockhash response matches spec (#2583)",
          "timestamp": "2023-03-13T19:51:11-04:00",
          "tree_id": "f24e0eeea6a6085bc66b4db59593182687804015",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9c957b78a1607f3430c905182fcf267792aad2ed"
        },
        "date": 1678751646056,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15064,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14447,
            "range": "±5.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15007,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14662,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13116,
            "range": "±9.75%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "f0f0cc5c2d525a4e16389a368f99174218e475a4",
          "message": "client/engine: delete invalid skeleton blocks (#2584)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-14T09:30:30-04:00",
          "tree_id": "3d514f60599754f7ed5d132154ff77d1759d599c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f0f0cc5c2d525a4e16389a368f99174218e475a4"
        },
        "date": 1678800804778,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14840,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14359,
            "range": "±6.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14781,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14489,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13011,
            "range": "±9.76%",
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
          "id": "b6bb0a22460e1bacd4f7b65274ad573babf5a6fc",
          "message": "Setup to dev/test snapsync with sim architecture (#2574)\n\n* Setup to dev/test snapsync with sim architecture\r\n\r\n* modfiy single-run to setup a lodestar<>geth node to snapsync from\r\n\r\n* setup an ethereumjs inline client and get it to peer with geth\r\n\r\n* cleanup setup a bit\r\n\r\n* snapsync run spec\r\n\r\n* get the snap testdev sim working\r\n\r\n* finalize the test infra and update usage doc\r\n\r\n* enhance coverage\r\n\r\n* Use geth RPC to connect to ethJS\r\n\r\n* refac wait for snap sync completion\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-14T23:20:22+05:30",
          "tree_id": "9ea0fa5055c4dcfbb109f6b0eef16fdb105c3c66",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b6bb0a22460e1bacd4f7b65274ad573babf5a6fc"
        },
        "date": 1678816387217,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15189,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14779,
            "range": "±4.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15494,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15073,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13440,
            "range": "±8.18%",
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
          "id": "0fbfe07b125152fb24543bb6d39f25a5944a835f",
          "message": "client: Add safe and finalized blockoptions to the chain (#2585)\n\n* client: Add safe and finalized blockoptions to the chain\r\n\r\n* fix tests\r\n\r\n* fix more tests\r\n\r\n* fix remaining\r\n\r\n* cleanup\r\n\r\n* enhance coverage\r\n\r\n* unset scheduled goerli timestamp based hfs colliding with test",
          "timestamp": "2023-03-16T08:46:54-04:00",
          "tree_id": "48ae67bf8ef85b144c06c6004f3f924cd03784de",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0fbfe07b125152fb24543bb6d39f25a5944a835f"
        },
        "date": 1678970980252,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15800,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15647,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15660,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15133,
            "range": "±5.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15292,
            "range": "±1.86%",
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
          "id": "178d07e1a99fc9f37990726c7e2779aa7f0f4ed9",
          "message": "Client: Small Debug Helpers and CLI Improvements (#2586)\n\n* Client: new constant MAX_TOLERATED_BLOCK_TIME for execution, added warning for slowly executed blocks\r\n\r\n* Client -> Execution: NumBlocksPerIteration (default: 50) as an option\r\n\r\n* Client: only restart RLPx server or log peer stats if max peers is set to be greater than 0\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Apply suggestions from code review\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-17T00:22:41+01:00",
          "tree_id": "bfdde3c3bbc9fc3d76b0c4751b749ed233f0ccf1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/178d07e1a99fc9f37990726c7e2779aa7f0f4ed9"
        },
        "date": 1679009124664,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15883,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15231,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15905,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15411,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14333,
            "range": "±7.21%",
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
          "id": "cbf9a04ac6e8246932d0fbf9bade7a074fbb0dd8",
          "message": "common: Schedule Shanghai on mainnet! (#2591)\n\n* common: Schedule Shanghai on mainnet!\r\n\r\n* clear hf timestamp for test",
          "timestamp": "2023-03-17T11:35:03+01:00",
          "tree_id": "172c05ffe3b01613554fca1c6f1d25cd03e8ab86",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cbf9a04ac6e8246932d0fbf9bade7a074fbb0dd8"
        },
        "date": 1679049467883,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15942,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15769,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14937,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15969,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15265,
            "range": "±1.80%",
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
          "id": "f5ab7fc592ff917fb2048283a61d628b183ffaa6",
          "message": "VM: Diff-based Touched Accounts Checkpointing (#2581)\n\n* VM: Switched to a more efficient diff-based way of touched account checkpointing\r\n\r\n* VM: move accessed storage inefficient checkpointing problem to berlin, haha\r\n\r\n* EVM: avoid memory copy in MLOAD opcode function\r\n\r\n* Remove console.log() in EVM\r\n\r\n* vmState: ensure touched accounts delete stack gets properly updated on commit\r\n\r\n* vm/eei: save touched height\r\n\r\n* vm/vmState: new possible fix for touched accounts\r\n\r\n* vm/vmState: another attempt to fix touched accounts journaling\r\n\r\n* vm: add journaling\r\n\r\n* Check correct journal height on revert\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-17T21:41:34+01:00",
          "tree_id": "18e1db87bfb5c7edac921db6ed896ffa66415dbb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5ab7fc592ff917fb2048283a61d628b183ffaa6"
        },
        "date": 1679085855972,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15626,
            "range": "±4.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16071,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15087,
            "range": "±6.39%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15857,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15358,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "7e6daf2df26e583c9f2f5282166507f8593407ba",
          "message": "evm+tx: add allowUnlimitedInitcodeSize (#2594)",
          "timestamp": "2023-03-21T14:44:13+01:00",
          "tree_id": "f222a2c90d265774db5ca62e38e984a486beab88",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7e6daf2df26e583c9f2f5282166507f8593407ba"
        },
        "date": 1679406459591,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8057,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8116,
            "range": "±6.44%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8672,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8276,
            "range": "±2.63%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7774,
            "range": "±7.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "edacccba39d917b21b18a047635fb18e746b6646",
          "message": "evm/tx: update allowUnlimitedInitCodeSize casing (#2597)",
          "timestamp": "2023-03-22T13:51:47-04:00",
          "tree_id": "17fe161a0a948bc22772c98fba9839b005eedc7b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/edacccba39d917b21b18a047635fb18e746b6646"
        },
        "date": 1679507700606,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12732,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12286,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12799,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12529,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11402,
            "range": "±8.72%",
            "unit": "ops/sec",
            "extra": "75 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "187813+davidmurdoch@users.noreply.github.com",
            "name": "David Murdoch",
            "username": "davidmurdoch"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8f989b48447907529524ee6fe3cb215d6bced145",
          "message": "evm: clamp step event memory to actual size (#2598)\n\n* evm: clamp step event memory to actual size\r\n\r\n* evm: add test for step event\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-03-23T10:43:37-04:00",
          "tree_id": "3c1d7de48db7d3f08f6a7e177f2b6e166f1abebe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8f989b48447907529524ee6fe3cb215d6bced145"
        },
        "date": 1679582803893,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15924,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15883,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15160,
            "range": "±4.61%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15923,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15394,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "85371573+solimander@users.noreply.github.com",
            "name": "Solimander",
            "username": "solimander"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f0166f5eaeae92ade5864c239787c02d3b7be817",
          "message": "Fix Block Hash Calculation When Creating a New Block Object From JSON RPC (Shanghai) (#2600)\n\n* Fix block hash calculation when creating a new block from JSON RPC\r\n\r\n* Test coverage",
          "timestamp": "2023-03-24T11:14:24+01:00",
          "tree_id": "3add456f4c88c6576fe21dbbc751facb168b7ce8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f0166f5eaeae92ade5864c239787c02d3b7be817"
        },
        "date": 1679653032797,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15677,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14892,
            "range": "±5.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15838,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15210,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13628,
            "range": "±9.28%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "e2ec03c8c47964e5547c2373fea450d37da7d8b6",
          "message": "client: Add support for storage and bytecode fetching (#2345)\n\n* Add account fetcher base\r\n\r\nAdd accountfetcher import\r\n\r\nAdd AccountFetcher as possible type for Synchronizer.fetcher\r\n\r\nPlace call to getAccountRange inside of fetcher\r\n\r\nPlace call to getAccountRange() in accountfetcher and comment it out\r\n\r\nAdd account fetcher base\r\n\r\nAdd accountfetcher import\r\n\r\nadd account fetcher getter setter in snapsync\r\n\r\nChange order of importing accountfetcher in index file\r\n\r\nChange bytes parameter to be per task\r\n\r\nRemove root and bytes from task inputs and make them fetcher variables\r\n\r\nCorrect log message\r\n\r\nAdd debug console log statement\r\n\r\nFix linting issues\r\n\r\nAdd account to mpt and check validity with root and proof\r\n\r\nSet root of trie\r\n\r\nAdd checks to fetcher.request()\r\n\r\nclient/snap: fix getAccountRange return type\r\n\r\nclient/snap: pass first proof\r\n\r\nclient/snap: add utility to convert slim account to a normal RLPd account\r\n\r\nclient/snap: implement account range db dump\r\n\r\nUpdate to use verifyRangeProof\r\n\r\nCorrect some messages\r\n\r\nUpdate verifyProofRange input for first account hash to be fetcher origin\r\n\r\nFix linting issues\r\n\r\nStore accounts in store phase\r\n\r\nAdd logic for dividing hash ranges and adding them as tasks\r\n\r\nIncrement count by 1 before next iteration\r\n\r\nclient/snap: remove unnecessary account fetcher logic\r\n\r\nclient/snap: correctly feed the right values to verifyRangeProof\r\n\r\nlint fixes\r\n\r\nsmall cleanup\r\n\r\nfix account fetcher with previous fixes\r\n\r\noverhaul and simplify the fetcher and add partial results handling\r\n\r\ncleanup comments\r\n\r\nfix fetch spec tests\r\n\r\nExperiment with putting accounts into DefaultStateManager and CheckpointTrie\r\n\r\nUse return value of verifyRangeProof for checking if there are more accounts left to fetch in the range\r\n\r\nRemove unused function\r\n\r\nExport storage data\r\n\r\nCreate storage fetcher\r\n\r\nRemove comment\r\n\r\nModify debug message\r\n\r\nUpdate comments to reflect specs\r\n\r\nModify comments and change storage fetcher to fetch only single account\r\n\r\nWIP: Queue storage fetches when accounts are received\r\n\r\nWIP:  Continue work on storage fetcher\r\n\r\nAdd storage fetcher tests\r\n\r\nComment out storage fetcher integration until multi-fetcher sync support is added\r\n\r\nWIP: Initialize and run storage fetcher in account fetcher\r\n\r\nAdd account field to JobTask type for storage fetcher and add enqueueByAccountList\r\n\r\nAdd accounts for storage fetching in account fetcher\r\n\r\nEnable single account fetches in storage fetcher\r\n\r\nSave changes so far\r\n\r\nIndex account body for storageRoot for use with storageFetcher\r\n\r\nUpdate comments and print statements\r\n\r\nAdd custom debuggers to new fetchers\r\n\r\nAdd limit check for continueing a task after partial resluts\r\n\r\nAdd limit check for continueing a task after partial resluts and clean up comments\r\n\r\nOptimize by removing invalidated tasks; Terminate using new conditions\r\n\r\nUpdate comments\r\n\r\nWIP: Implement multi-account storage requests\r\n\r\nWIP: Continue development of multi-account fetches and optimizing storage fetcher\r\n\r\nWIP: Impelemnt multi-account fetching\r\n\r\nWIP: Debug task null error\r\n\r\nAdd some checks for peer storage response\r\n\r\nSwitch structure of post-fetch validation\r\n\r\nDebug storage fetcher: Set starting origin to 0 and troubleshoot request logic\r\n\r\nAggregate partial results in embedded array\r\n\r\nUse larger task ranges for storage fetcher\r\n\r\nSet first and count in each task request\r\n\r\nDebug range logic\r\n\r\nCleanup code and fix task generation loop\r\n\r\nFix one-off error\r\n\r\nClean up comments and logging in accountfetcher\r\n\r\nImprove logging\r\n\r\nRefactor and clean up storagefetcher\r\n\r\nAdd commented code snippet for demo\r\n\r\nUse config value for maxRangeBytes\r\n\r\nReturn results in the case of a single, no-proof slot payload\r\n\r\nOnly enqueue storageRequests if more than 0 exist\r\n\r\nRun account fetcher in syncWithPeer\r\n\r\nFix linting issues\r\n\r\n* Update tests\r\n\r\n* Bufferize storage root if it is not a buffer already\r\n\r\n* Update storage fetcher tests\r\n\r\n* Move storage request processing in account fetcher into store phase\r\n\r\n* Update comments\r\n\r\n* Fix linting issues\r\n\r\n* Update comments\r\n\r\n* Update comments\r\n\r\n* Use config value for maxAccountRange\r\n\r\n* Update comment\r\n\r\n* Add tests for requests and proof verification\r\n\r\n* Initialize chain using helper\r\n\r\n* Setup to dev/test snapsync with sim architecture\r\n\r\n* modfiy single-run to setup a lodestar<>geth node to snapsync from\r\n\r\n* setup an ethereumjs inline client and get it to peer with geth\r\n\r\n* cleanup setup a bit\r\n\r\n* snapsync run spec\r\n\r\n* get the snap testdev sim working\r\n\r\n* finalize the test infra and update usage doc\r\n\r\n* enhance coverage\r\n\r\n* Fix lint error\r\n\r\n* Setup to dev/test snapsync with sim architecture\r\n\r\n* modfiy single-run to setup a lodestar<>geth node to snapsync from\r\n\r\n* setup an ethereumjs inline client and get it to peer with geth\r\n\r\n* cleanup setup a bit\r\n\r\n* snapsync run spec\r\n\r\n* get the snap testdev sim working\r\n\r\n* finalize the test infra and update usage doc\r\n\r\n* enhance coverage\r\n\r\n* Use geth RPC to connect to ethJS\r\n\r\n* refac wait for snap sync completion\r\n\r\n* Emit snap sync completion event in accountfetcher\r\n\r\n* Modify fetcher termination condition\r\n\r\n* Cluster snap config items together\r\n\r\n* Index account range starting from 0\r\n\r\n* Sync fetchers using helper\r\n\r\n* Put storage slots into tries\r\n\r\n* Use destroyWhenDone to terminate storage fetcher\r\n\r\n* End fetcher if finished tasks is greater than or equal to total\r\n\r\n* setup writer just once if fetcher not destroyed\r\n\r\n* cleanup and codeflow simplification\r\n\r\n* cleanup\r\n\r\n* fix accountspec\r\n\r\n* increase coverage\r\n\r\n* add some more coverage\r\n\r\n* lint\r\n\r\n* increase storagefetcher coverage\r\n\r\n* further enhance storagefetcher coverage\r\n\r\n* improve cov\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-26T20:11:35+05:30",
          "tree_id": "ff1e26b7aa3734e9154c75a287bd7d9424ce767c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e2ec03c8c47964e5547c2373fea450d37da7d8b6"
        },
        "date": 1679841860354,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15196,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14452,
            "range": "±5.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15380,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14791,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13180,
            "range": "±9.00%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "ecb62e5d04d54f02b5bd0ff0d7b5ce3755a83df0",
          "message": "Update ethereum/tests to v12 (#2601)\n\n* vm: update tests to shanghai\r\n\r\n* evm: fix EIP3860\r\n\r\n* vm: cleanup touched accounts after withdrawals\r\n\r\n* tx: fix eip3860 check when deserializing RLPs\r\n\r\n* block: throw if 4895 is active and no withdrawal is available / withdrawals are not a list\r\n\r\n* evm: fix create/create2 if allowUnlimitedInitCodeSize = true\r\n\r\n* vm: fix state tests runner\r\n\r\n* vm/tests: update test count\r\n\r\n* vm/tests: ensure state root is updated after test\r\n\r\n* vm/tests: Temporarily disable homestead ShanghaiLove test\r\n\r\n* block: bump test coverage, no withdrawals array provided\r\n\r\n* clean up test imports\r\n\r\n* block: move eip4895 check to fromValues\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-03-27T21:03:08-04:00",
          "tree_id": "2216f27d846f503d82b9442dbb91804a0f08d54b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ecb62e5d04d54f02b5bd0ff0d7b5ce3755a83df0"
        },
        "date": 1679965587908,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8412,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8325,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8918,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8613,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7749,
            "range": "±7.37%",
            "unit": "ops/sec",
            "extra": "78 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rafael@skyle.net",
            "name": "Rafael Matias",
            "username": "skylenet"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8910fe26a484e1049f059d7d49072c8c228b608a",
          "message": "Remove and replace some EF bootnodes (#2576)\n\n* Remove deprecated EF bootnodes\r\n\r\n* Replace deprecated EF AWS nodes with Hetzner nodes",
          "timestamp": "2023-03-28T12:11:09+02:00",
          "tree_id": "1e28c95c0e65a65624b22ae1d663e78e942eaabc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8910fe26a484e1049f059d7d49072c8c228b608a"
        },
        "date": 1679999008805,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15147,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14553,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15174,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14835,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13400,
            "range": "±8.00%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "abe741e3439aa5ae4faf75b9bfabdb21250bde8f",
          "message": "client: tests for getTrieNodes and trieNodes SNAP messages (#2282)\n\n* Add getTrieNodes function signature to SnapProtocolMethods interface\r\n\r\n* Add tests for GetTrieNodes and TrieNodes message encode/decode\r\n\r\n* Clean up comments\r\n\r\n* Add TODOs\r\n\r\n* Update tests\r\n\r\n* Implement compact encoding helpers\r\n\r\n* Add getTrieNodes function signature to SnapProtocolMethods interface\r\n\r\n* Add tests for GetTrieNodes and TrieNodes message encode/decode\r\n\r\n* Clean up comments\r\n\r\n* Add TODOs\r\n\r\n* Update tests\r\n\r\n* Implement compact encoding helpers\r\n\r\n* Update tests to check raw node data is valid\r\n\r\n* Remove unused import\r\n\r\n* Add pathTo function to encoding library\r\n\r\n* Fix bug in compactToHex\r\n\r\n* Add tests for compact encoding helpers\r\n\r\n* Correct test input\r\n\r\n* Update test title\r\n\r\n* Ignore unused-var error\r\n\r\n* Fix linting errors\r\n\r\n* Ignore unused variable\r\n\r\n* Include type for conditional\r\n\r\n* Check explicitly for null\r\n\r\n* Use expected operator\r\n\r\n* Fix karma configuration\r\n\r\n* Add docs for hasTerm method\r\n\r\n* Remove comment\r\n\r\n* Add block and network to example call\r\n\r\n* rename and comment clarify path encoding\r\n\r\n* fix snap spec\r\n\r\n* add reference\r\n\r\n* fix the coverage issue\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-03-28T23:27:29+05:30",
          "tree_id": "36abd26730fbcc653620a394e0eea44302a1053d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/abe741e3439aa5ae4faf75b9bfabdb21250bde8f"
        },
        "date": 1680026412945,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15592,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15755,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15338,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15319,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15138,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "60995fb50aa56e5749d471eb7fa424403c3e6249",
          "message": "Tx: correctly decode rpc txs (#2613)\n\n* tx: correctly decode rpc txs\r\n\r\n* tx/vm: fix test\r\n\r\n* tx: add fromRPC method\r\n\r\n* Reuse `fromRpcTx` in fromEthersProvider\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-04-05T12:54:13-04:00",
          "tree_id": "ce2c9d1cc932e09bf367f23e4385aa3af4a2d3f9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/60995fb50aa56e5749d471eb7fa424403c3e6249"
        },
        "date": 1680713818823,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15831,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15354,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15865,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15406,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14336,
            "range": "±7.78%",
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
          "id": "c83f11b3fc293ad539806dff5c9dc481f96a740f",
          "message": "Add London+ hardfork support for Retesteth, fix EIP150 tests (#2619)\n\n* vm/retesteth: fix london+ test runner\r\n\r\n* vm/retesteth: fix EIP150 tests",
          "timestamp": "2023-04-07T00:29:27+02:00",
          "tree_id": "348695091af365d598c4c235a3e2b595c247d607",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c83f11b3fc293ad539806dff5c9dc481f96a740f"
        },
        "date": 1680820389165,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 7968,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 7816,
            "range": "±3.88%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8028,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7967,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7935,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "frederik.bolding@gmail.com",
            "name": "Frederik Bolding",
            "username": "FrederikBolding"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8cf85bb8207a273d0ecdb0bf132d22b9b5304bc",
          "message": "Bump `@chainsafe/ssz` to `0.11.0` (#2622)\n\n* Bump chainsafe/ssz to 0.11.0\r\n\r\n* Try fixing karma\r\n\r\n* Add karma aliases\r\n\r\n* Add `common` configuration\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-04-08T09:45:34+02:00",
          "tree_id": "6aebdda2c413c1394f11f7b5ba61635087a02ec0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8cf85bb8207a273d0ecdb0bf132d22b9b5304bc"
        },
        "date": 1680940099318,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15077,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14664,
            "range": "±4.63%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15104,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14669,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13259,
            "range": "±8.73%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "da187d4a8143a9fd010ef9bfb49e6ad333e7a0d7",
          "message": "client: Add snap bytecode fetcher (#2602)\n\n* Add account fetcher base\r\n\r\nAdd accountfetcher import\r\n\r\nAdd AccountFetcher as possible type for Synchronizer.fetcher\r\n\r\nPlace call to getAccountRange inside of fetcher\r\n\r\nPlace call to getAccountRange() in accountfetcher and comment it out\r\n\r\nAdd account fetcher base\r\n\r\nAdd accountfetcher import\r\n\r\nadd account fetcher getter setter in snapsync\r\n\r\nChange order of importing accountfetcher in index file\r\n\r\nChange bytes parameter to be per task\r\n\r\nRemove root and bytes from task inputs and make them fetcher variables\r\n\r\nCorrect log message\r\n\r\nAdd debug console log statement\r\n\r\nFix linting issues\r\n\r\nAdd account to mpt and check validity with root and proof\r\n\r\nSet root of trie\r\n\r\nAdd checks to fetcher.request()\r\n\r\nclient/snap: fix getAccountRange return type\r\n\r\nclient/snap: pass first proof\r\n\r\nclient/snap: add utility to convert slim account to a normal RLPd account\r\n\r\nclient/snap: implement account range db dump\r\n\r\nUpdate to use verifyRangeProof\r\n\r\nCorrect some messages\r\n\r\nUpdate verifyProofRange input for first account hash to be fetcher origin\r\n\r\nFix linting issues\r\n\r\nStore accounts in store phase\r\n\r\nAdd logic for dividing hash ranges and adding them as tasks\r\n\r\nIncrement count by 1 before next iteration\r\n\r\nclient/snap: remove unnecessary account fetcher logic\r\n\r\nclient/snap: correctly feed the right values to verifyRangeProof\r\n\r\nlint fixes\r\n\r\nsmall cleanup\r\n\r\nfix account fetcher with previous fixes\r\n\r\noverhaul and simplify the fetcher and add partial results handling\r\n\r\ncleanup comments\r\n\r\nfix fetch spec tests\r\n\r\nExperiment with putting accounts into DefaultStateManager and CheckpointTrie\r\n\r\nUse return value of verifyRangeProof for checking if there are more accounts left to fetch in the range\r\n\r\nRemove unused function\r\n\r\nExport storage data\r\n\r\nCreate storage fetcher\r\n\r\nRemove comment\r\n\r\nModify debug message\r\n\r\nUpdate comments to reflect specs\r\n\r\nModify comments and change storage fetcher to fetch only single account\r\n\r\nWIP: Queue storage fetches when accounts are received\r\n\r\nWIP:  Continue work on storage fetcher\r\n\r\nAdd storage fetcher tests\r\n\r\nComment out storage fetcher integration until multi-fetcher sync support is added\r\n\r\nWIP: Initialize and run storage fetcher in account fetcher\r\n\r\nAdd account field to JobTask type for storage fetcher and add enqueueByAccountList\r\n\r\nAdd accounts for storage fetching in account fetcher\r\n\r\nEnable single account fetches in storage fetcher\r\n\r\nSave changes so far\r\n\r\nIndex account body for storageRoot for use with storageFetcher\r\n\r\nUpdate comments and print statements\r\n\r\nAdd custom debuggers to new fetchers\r\n\r\nAdd limit check for continueing a task after partial resluts\r\n\r\nAdd limit check for continueing a task after partial resluts and clean up comments\r\n\r\nOptimize by removing invalidated tasks; Terminate using new conditions\r\n\r\nUpdate comments\r\n\r\nWIP: Implement multi-account storage requests\r\n\r\nWIP: Continue development of multi-account fetches and optimizing storage fetcher\r\n\r\nWIP: Impelemnt multi-account fetching\r\n\r\nWIP: Debug task null error\r\n\r\nAdd some checks for peer storage response\r\n\r\nSwitch structure of post-fetch validation\r\n\r\nDebug storage fetcher: Set starting origin to 0 and troubleshoot request logic\r\n\r\nAggregate partial results in embedded array\r\n\r\nUse larger task ranges for storage fetcher\r\n\r\nSet first and count in each task request\r\n\r\nDebug range logic\r\n\r\nCleanup code and fix task generation loop\r\n\r\nFix one-off error\r\n\r\nClean up comments and logging in accountfetcher\r\n\r\nImprove logging\r\n\r\nRefactor and clean up storagefetcher\r\n\r\nAdd commented code snippet for demo\r\n\r\nUse config value for maxRangeBytes\r\n\r\nReturn results in the case of a single, no-proof slot payload\r\n\r\nOnly enqueue storageRequests if more than 0 exist\r\n\r\nRun account fetcher in syncWithPeer\r\n\r\nFix linting issues\r\n\r\n* Update tests\r\n\r\n* Bufferize storage root if it is not a buffer already\r\n\r\n* Update storage fetcher tests\r\n\r\n* Move storage request processing in account fetcher into store phase\r\n\r\n* Update comments\r\n\r\n* Fix linting issues\r\n\r\n* Update comments\r\n\r\n* Update comments\r\n\r\n* Use config value for maxAccountRange\r\n\r\n* Update comment\r\n\r\n* Add tests for requests and proof verification\r\n\r\n* Initialize chain using helper\r\n\r\n* Setup to dev/test snapsync with sim architecture\r\n\r\n* modfiy single-run to setup a lodestar<>geth node to snapsync from\r\n\r\n* setup an ethereumjs inline client and get it to peer with geth\r\n\r\n* cleanup setup a bit\r\n\r\n* snapsync run spec\r\n\r\n* get the snap testdev sim working\r\n\r\n* finalize the test infra and update usage doc\r\n\r\n* enhance coverage\r\n\r\n* Fix lint error\r\n\r\n* Setup to dev/test snapsync with sim architecture\r\n\r\n* modfiy single-run to setup a lodestar<>geth node to snapsync from\r\n\r\n* setup an ethereumjs inline client and get it to peer with geth\r\n\r\n* cleanup setup a bit\r\n\r\n* snapsync run spec\r\n\r\n* get the snap testdev sim working\r\n\r\n* finalize the test infra and update usage doc\r\n\r\n* enhance coverage\r\n\r\n* Use geth RPC to connect to ethJS\r\n\r\n* refac wait for snap sync completion\r\n\r\n* Emit snap sync completion event in accountfetcher\r\n\r\n* Modify fetcher termination condition\r\n\r\n* Cluster snap config items together\r\n\r\n* Index account range starting from 0\r\n\r\n* Sync fetchers using helper\r\n\r\n* Put storage slots into tries\r\n\r\n* Use destroyWhenDone to terminate storage fetcher\r\n\r\n* End fetcher if finished tasks is greater than or equal to total\r\n\r\n* Create codefetcher base\r\n\r\n* setup writer just once if fetcher not destroyed\r\n\r\n* cleanup and codeflow simplification\r\n\r\n* cleanup\r\n\r\n* fix accountspec\r\n\r\n* increase coverage\r\n\r\n* Add accounts with nonempty codehash to codefetcher request list\r\n\r\n* fix the flag processing\r\n\r\n* Check if codeHash is empty by comparing it to hash of null\r\n\r\n* Implement request function of bytecode fetcher\r\n\r\n* Fix bug - Setup trie for storing codes\r\n\r\n* Implement store phase of bytecode fetcher\r\n\r\n* Remove unused import and typing changes\r\n\r\n* chunkify hashes request into multiple task\r\n\r\n* fix the response processing\r\n\r\n* resolve the hanging test\r\n\r\n* add bytecodefetcher spec\r\n\r\n* increase coverage\r\n\r\n* further increase coverage\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-04-12T16:02:50+05:30",
          "tree_id": "f7cd6f88393ffa6ae38ccc2540bbe79ea7fb727a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/da187d4a8143a9fd010ef9bfb49e6ad333e7a0d7"
        },
        "date": 1681295761799,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12057,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11853,
            "range": "±3.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12111,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11133,
            "range": "±7.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12178,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "205dc35b70425e6c2c19c5ba798bb5a44abe62cd",
          "message": "client: Fix breaking tests because of scheduled mainnet shanghai hf (#2635)\n\n* Fix breaking tests because of scheduled mainnet shanghai hf\r\n\r\n* fix sendRawTransaction common",
          "timestamp": "2023-04-13T21:14:49+05:30",
          "tree_id": "1ce5ad4c826f7836ff6f97305abf3c19c41f4266",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/205dc35b70425e6c2c19c5ba798bb5a44abe62cd"
        },
        "date": 1681400859147,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15242,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14661,
            "range": "±4.90%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15153,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14625,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13320,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "efc4487dbf7fdf8174c93e11025116e2691dbb67",
          "message": "Kick `ethers` off the `block` (#2633)\n\n* Make `block.fromEthersProvider` provider agnostic\r\n\r\n* Finish block\r\n\r\n* Move provider utils to util\r\n\r\n* Remove ethers from tx\r\n\r\n* skip fetch test in browser context\r\n\r\n* Fix tests\r\n\r\n* Fix td typing\r\n\r\n* more td typing\r\n\r\n* Switch fetch dep to micro-ftch\r\n\r\n* Add error handling",
          "timestamp": "2023-04-14T08:40:01+02:00",
          "tree_id": "43e9a2bdcf63548e7d5092db8622f518caac158b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/efc4487dbf7fdf8174c93e11025116e2691dbb67"
        },
        "date": 1681454561534,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16003,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15496,
            "range": "±5.21%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16152,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15578,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14118,
            "range": "±7.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "paul@paulmillr.com",
            "name": "Paul Miller",
            "username": "paulmillr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b4b1f82a8a34dde2831b2f6c1aadd7af0fc17190",
          "message": "Update ethereum-cryptography from 1.2 to 2.0 (#2641)",
          "timestamp": "2023-04-14T15:45:42+02:00",
          "tree_id": "7d4fd165d35c31761cad4c7fabc4c7ff97f3a925",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b4b1f82a8a34dde2831b2f6c1aadd7af0fc17190"
        },
        "date": 1681481334538,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15827,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15581,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14936,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15326,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15070,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "e84fe7d7a71fc3184abafc0a2284baf7ecc52a58",
          "message": "Monorepo: remove Node 14 from Node version GitHub actions nightly run, remove npm v7 check (#2644)",
          "timestamp": "2023-04-17T08:36:40-04:00",
          "tree_id": "e529506ba46591a18891fb382d6e23152783b6fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e84fe7d7a71fc3184abafc0a2284baf7ecc52a58"
        },
        "date": 1681735168947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15078,
            "range": "±3.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15035,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14583,
            "range": "±5.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14839,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14582,
            "range": "±2.24%",
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
          "id": "1726a8652df3c40a87a3b6c7c25cd6a33bc70f24",
          "message": "Fix karma dependency resolution in `vm` (#2645)\n\n* Fix karma dependency resolution\r\n\r\n* Update karma\r\n\r\n* Update ethash dep version",
          "timestamp": "2023-04-17T18:55:42+02:00",
          "tree_id": "7df172adfe298476c71d44c12f6efd8496d32f36",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1726a8652df3c40a87a3b6c7c25cd6a33bc70f24"
        },
        "date": 1681750727995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 7498,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8024,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8145,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7271,
            "range": "±7.92%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7762,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "frederik.bolding@gmail.com",
            "name": "Frederik Bolding",
            "username": "FrederikBolding"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca32296a65d24a32cb449de538a542506a4eb887",
          "message": "Bump chainsafe/ssz to 0.11.1 (#2656)",
          "timestamp": "2023-04-21T23:48:19+05:30",
          "tree_id": "e1d1b4cfb707b6971ffe2314fd3a30d7764b9dc8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ca32296a65d24a32cb449de538a542506a4eb887"
        },
        "date": 1682101263180,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14919,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14958,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14437,
            "range": "±5.90%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14558,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14416,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      }
    ]
  }
}