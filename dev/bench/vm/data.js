window.BENCHMARK_DATA = {
  "lastUpdate": 1695232854387,
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
          "id": "fcc910e3ac06525d67ed7425bf3638b290430bee",
          "message": "common: unschedule Cancun for holesky (#2997)",
          "timestamp": "2023-08-30T17:29:42+05:30",
          "tree_id": "50aa1a845ff2919065a71d5c970b4894a9f9c1d3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fcc910e3ac06525d67ed7425bf3638b290430bee"
        },
        "date": 1693397053196,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20654,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20924,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20325,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20156,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19941,
            "range": "±3.49%",
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
          "id": "d6d9391f1fdfc259baf3150523ecd7f27d2a9373",
          "message": "Common: Cache Parameter Values + activated EIPs for current Hardfork / SM copy() fix (#2994)\n\n* VM: add total test time tracking to blockchain test runner\r\n\r\n* Simplify on paramByHardfork(), paramByEIP() reads, replace with param() usage\r\n\r\n* Common: make private members protected for some greater flexibility for users on sub-classing\r\n\r\n* Common: new _buildParamsCache() methods + entrypoint calls, new _paramsCache member\r\n\r\n* Common: add _buildParamsCache() implementation, replace param() code with direct _paramsCache() access\r\n\r\n* Small fix\r\n\r\n* VM: fix precompile activation API test\r\n\r\n* StateManager: fix Common not properly copied within shallowCopy() method\r\n\r\n* Common: add additional param() test for copied/original Common\r\n\r\n* Common: fix cache initialization in params cache build method\r\n\r\n* Common: add activated EIPs cache\r\n\r\n* Apply review suggestions",
          "timestamp": "2023-08-30T16:22:33+02:00",
          "tree_id": "fe65b0e4b474013fdf9a23776d5ea475ef21ad43",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d6d9391f1fdfc259baf3150523ecd7f27d2a9373"
        },
        "date": 1693405572764,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30972,
            "range": "±5.88%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30418,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30779,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25663,
            "range": "±10.51%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29152,
            "range": "±3.56%",
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
          "id": "f5c6769fa95239a104119b0d43ab39cae19f2917",
          "message": "tx: consolidate generic tx capabilities (#2993)\n\n* tx: consolidate generic tx capabilities\r\n\r\n* tx: refactor highS and YParity validation into generic\r\n\r\n* tx: refactor getDataFee\r\n\r\n* tx: refactor getUpfrontCost capability\r\n\r\n* tx: refactor getHashedMessageToSign and serialize methods\r\n\r\n* tx: refactor usage of this",
          "timestamp": "2023-08-30T15:56:00-04:00",
          "tree_id": "947f6ff0ca4a63bdb8be4100c50d0d8a8948373e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5c6769fa95239a104119b0d43ab39cae19f2917"
        },
        "date": 1693425866590,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25299,
            "range": "±5.58%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25713,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25705,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25696,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20213,
            "range": "±11.60%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "3c9291063326d7502400dcd0e4e177c523432d60",
          "message": "Add EVM profiler (#2988)\n\n* evm/vm: add optional evm profiler\r\n\r\n* fix submodule delete\r\n\r\n* fix syntax\r\n\r\n* vm: update logger option names\r\n\r\n* client: fix performance opts\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-08-30T22:34:33+02:00",
          "tree_id": "7c65ff73bd449a432bf8ddb4d2ff0889f5280f33",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3c9291063326d7502400dcd0e4e177c523432d60"
        },
        "date": 1693427875510,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32184,
            "range": "±4.17%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31262,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31143,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27053,
            "range": "±9.19%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29709,
            "range": "±2.50%",
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
          "id": "8bb8329efcd54096d93f389bbe8c70911e86e91a",
          "message": "EVM: optimize stack (#3000)\n\n* evm: optimize stack\r\n\r\n* evm: fix stack.dup\r\n\r\n* evm/stack: add comments\r\n\r\n* evm: make _stack / _maxHeight private & fix step event\r\n\r\n* evm: add stack inspect test\r\n\r\n* vm: fix test",
          "timestamp": "2023-08-31T17:45:25+02:00",
          "tree_id": "f74b73c416ccc54c0e34a11a30ddcff51ee3cad8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8bb8329efcd54096d93f389bbe8c70911e86e91a"
        },
        "date": 1693497037284,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18241,
            "range": "±6.97%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18974,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17442,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17741,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17355,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "f94accbd4b368e8818fe06e6db4beaeec84585cc",
          "message": "trie: change `===` to `equalsBytes` for (#3001)\n\ngetProof empty root check",
          "timestamp": "2023-09-01T14:05:57+05:30",
          "tree_id": "547dce94d31b4bd69cb0c9cab3ed4fd0775bf8bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f94accbd4b368e8818fe06e6db4beaeec84585cc"
        },
        "date": 1693558215711,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32291,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31504,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31373,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27385,
            "range": "±8.54%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30152,
            "range": "±2.48%",
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
          "id": "6319b87eb2558c942b5747e600305ddb45ae727d",
          "message": "vm: update the beacon block root contract address (#3003)\n\n* vm: update the beacon block root contract address\r\n\r\n* fix spec",
          "timestamp": "2023-09-01T14:18:55+02:00",
          "tree_id": "63f233c78c14d774c9e24d9a4d83ff1447bfe613",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6319b87eb2558c942b5747e600305ddb45ae727d"
        },
        "date": 1693570943555,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30999,
            "range": "±4.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30572,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30410,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25957,
            "range": "±9.10%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29419,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "bae37404c1d468ad005c5c9b5523fb0614da5e88",
          "message": "trie: add test for checkRoot (#3004)",
          "timestamp": "2023-09-04T10:45:12+02:00",
          "tree_id": "5a80f54889ac48f5c984b1db5ff3c3d8afc7f55a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bae37404c1d468ad005c5c9b5523fb0614da5e88"
        },
        "date": 1693817326672,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32230,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31386,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31418,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27387,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29803,
            "range": "±2.63%",
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
          "id": "5df04ff1948327a3ac2924eef811d21e85a54bad",
          "message": "VM: Small Profiler UX improvements / Fix client reportAfterTx option propagation to EVM (#3011)\n\n* VM: add general profiler title for block profiling independently from the txs in the block, add informative msg if no txs applicable for profiling\r\n\r\n* VM: add permanent tx profiler run title, message for txs without precompile or opcode execution\r\n\r\n* Client: fix --vmProfileTxs option not being propagated correctly",
          "timestamp": "2023-09-05T11:35:24+02:00",
          "tree_id": "2872f54e1db66a02b70ea03d520014affa863569",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5df04ff1948327a3ac2924eef811d21e85a54bad"
        },
        "date": 1693906728267,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32029,
            "range": "±5.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31067,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31036,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27132,
            "range": "±8.33%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29643,
            "range": "±2.63%",
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
          "id": "59db99dfb265c55dbd053146504a6b1b481f38d0",
          "message": "StateManager: deactivate storage/account caches if cache size of 0 is provided, added respective test scenarios (#3012)",
          "timestamp": "2023-09-05T12:48:49+02:00",
          "tree_id": "0641eec3cfea41994048c1c287453e760e0c4a2b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/59db99dfb265c55dbd053146504a6b1b481f38d0"
        },
        "date": 1693911206405,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25433,
            "range": "±6.15%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25278,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25460,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25336,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20014,
            "range": "±11.16%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "9c2080256c92824adb7c93074d69859a82be0191",
          "message": "evm/vm: profiler: add static/dynamic gas columns (#3013)",
          "timestamp": "2023-09-05T13:17:26+02:00",
          "tree_id": "19c6bab4316412a80f478348279380cba5952aaf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9c2080256c92824adb7c93074d69859a82be0191"
        },
        "date": 1693912896982,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24826,
            "range": "±6.44%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25111,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24185,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24692,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19538,
            "range": "±11.62%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "fdafe004b25fe67e9e54b0eebbdd65e6b31060a3",
          "message": "Fixes the RLP CLI (#3007)\n\n* Fix file extension on rlp cli\r\n\r\n* Add simple CLI test\r\n\r\n* Skip cli test in browser\r\n\r\n* fix config",
          "timestamp": "2023-09-05T14:03:09-07:00",
          "tree_id": "4a71689c6c086785984f8fee4a884f9953c7d5c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fdafe004b25fe67e9e54b0eebbdd65e6b31060a3"
        },
        "date": 1693948002762,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30854,
            "range": "±5.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30328,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30253,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25967,
            "range": "±10.19%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29220,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "6d0052c24911a74f39760ad8bb9c4e054b23b14b",
          "message": "trie:  Rewrite findPath without outer promise (#3015)",
          "timestamp": "2023-09-05T20:53:38-04:00",
          "tree_id": "524d85217d114575c39ca1372fb447efe0dcbf1b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6d0052c24911a74f39760ad8bb9c4e054b23b14b"
        },
        "date": 1693961883487,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21310,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 23013,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22644,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20364,
            "range": "±8.68%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22104,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "8ca49a1c346eb7aa61acf550f8fe213445ef71ab",
          "message": "ethersStateManager: dumpStorage fix / test (#3009)\n\n* statemanager: add test for uncovered dumpStorage method\r\n\r\n* statemanager: add internal account dump method\r\nto storage cache class.\r\n\r\n* statemanager:  ethersStateManager:\r\ncall `_storageCache.dump` in `dumpStorage`",
          "timestamp": "2023-09-08T17:08:08+02:00",
          "tree_id": "3c58ea7da19f92134b2d111a99aeb3e08a616bdf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8ca49a1c346eb7aa61acf550f8fe213445ef71ab"
        },
        "date": 1694185903936,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30283,
            "range": "±5.58%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29928,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29554,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24998,
            "range": "±10.88%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28875,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "c1e2f955ad768784868b9e508e2f3f1182086a1a",
          "message": "trie: include null as possilbe value type in PUT (#3020)",
          "timestamp": "2023-09-12T16:53:58-07:00",
          "tree_id": "7e9966ea75e57def161b54758132723360fcc973",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1e2f955ad768784868b9e508e2f3f1182086a1a"
        },
        "date": 1694563039975,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31501,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31288,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31444,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26881,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29526,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "d2261ea5aaa1161deab2b0d53bbe452ef8f67a94",
          "message": "add DEBUG=ethjs to \"coverage\" test scripts (#3027)",
          "timestamp": "2023-09-14T14:34:26+02:00",
          "tree_id": "75f70107e0c3ad10056229038be9208433742bb2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2261ea5aaa1161deab2b0d53bbe452ef8f67a94"
        },
        "date": 1694695091553,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27651,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27542,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28117,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26960,
            "range": "±3.62%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21165,
            "range": "±11.25%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "04aa4dad54b9e258db8c4e51de5801c9b0680d02",
          "message": "client: some skeleton improvements from observations on devnet syncs (#3014)\n\n* client: some skeleton improvements from observations on devnet syncs\r\n\r\n* skip filling chain on duplicate sethead\r\n\r\n* apply nits\r\n\r\n* add beacon sync sim for incline client\r\n\r\n* get the beacon sync to resolve\r\n\r\n* fix breaking skeleton spec\r\n\r\n* fix reverse block fetcher\r\n\r\n* apply feeback",
          "timestamp": "2023-09-14T22:05:28+05:30",
          "tree_id": "1fe291a8fa53de82a53ce23b8b16e119598d81bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/04aa4dad54b9e258db8c4e51de5801c9b0680d02"
        },
        "date": 1694709694469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30563,
            "range": "±5.57%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30281,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30327,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25730,
            "range": "±10.20%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29412,
            "range": "±3.10%",
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
          "id": "67a20de06d965a21ac045c543b533962f4ace859",
          "message": "tx: improve tx capability handling (#3010)\n\n* tx: TxCapability interfaces and rename generic capability to legacy\r\n\r\n* tx: txTypeBytes helper\r\n\r\n* tx: add missing methods and props to tx interfaces\r\n\r\n* tx: refactor and improve serialize helper\r\n\r\n* tx: implement update serialize helper and txTypeBytes helper\r\n\r\n* tx: refactor getDataFee for use in legacyTransaction\r\n\r\n* tx: remove redundant prop from EIP4844CompatibleTxInterface\r\n\r\n* tx: shorten compatibletxInterface name\r\n\r\n* tx: typedTransaction -> EIP2718CompatibleTx\r\n\r\n* tx: remove implements interface\r\n\r\n* tx: add legacytxinterface and move accesslists props to eip2930 interface",
          "timestamp": "2023-09-14T21:45:38+02:00",
          "tree_id": "415609fe0bd3aa0cc67f33d4d7dee384a261c77b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/67a20de06d965a21ac045c543b533962f4ace859"
        },
        "date": 1694720950485,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30362,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30208,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30177,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25232,
            "range": "±10.24%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28995,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jinsoo.han.mail@gmail.com",
            "name": "Jinsoo Han",
            "username": "Hann"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d2f4394f5657bb27d4447a31bc4f0848f8c6b1b5",
          "message": "StateManager: some devDependencies move to dependencies (#3026)\n\n* make clear ambiguous dependencies\r\n\r\n* add types for the debug package\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-09-15T09:56:13-04:00",
          "tree_id": "866fad186810ffcaefe6bcc03899ffb5bc826805",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2f4394f5657bb27d4447a31bc4f0848f8c6b1b5"
        },
        "date": 1694786383313,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30665,
            "range": "±5.09%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30376,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30537,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25740,
            "range": "±9.70%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29456,
            "range": "±3.23%",
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
          "id": "91968d7b1e88a3fd19e7491f68337ba3843bd346",
          "message": "Use trie verifyRangeProof for no-proof range verification (#2977)\n\n* Use trie verifyRangeProof for no-proof range verification\r\n\r\n* Update all-element proof verification\r\n\r\n* Update test\r\n\r\n* Clean up and fix linting issue\r\n\r\n* Keep a single instance of proof trie\r\n\r\n* Reuse proof trie for verifyRangeProof\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2023-09-15T14:39:05-07:00",
          "tree_id": "55e590842c427bf7e36563f024252db60863d77e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/91968d7b1e88a3fd19e7491f68337ba3843bd346"
        },
        "date": 1694815070312,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20428,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20309,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19180,
            "range": "±7.84%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19266,
            "range": "±7.65%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19537,
            "range": "±3.30%",
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
          "id": "c13f6b411554b3abe5b4e420abb2d5c5a5f27745",
          "message": "EVM: Initialize memory with CONTAINER_SIZE bytes (#3032)",
          "timestamp": "2023-09-18T17:02:06+02:00",
          "tree_id": "9448d905caa77b2882cbf65f0551933fdc6d75d7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c13f6b411554b3abe5b4e420abb2d5c5a5f27745"
        },
        "date": 1695049599212,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19483,
            "range": "±6.69%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20331,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20977,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19460,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18540,
            "range": "±4.22%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "73707a55d40f76e83da9f824de811099895aa010",
          "message": "Trie: Debug logging (#3019)\n\n* trie: add debugger to Trie class\r\n\r\n* trie: setup optional debug skipping\r\n\r\n* trie: log Trie creation\r\n\r\n* trie: log details of trie creation\r\n\r\n* trie: debug log root change\r\n\r\n* trie: reverse parameter order in debug function\r\n\r\n* trie: add debug logging for get\r\n\r\n* trie: add debug logging to findPath\r\n\r\n* trie: add debug logging for lookupNode\r\n\r\n* trie: add debug logs to proof methods\r\n\r\n* trie: debug logging for checkpoint methods\r\n\r\n* trie: improve logging display\r\n\r\n* trie: add test that touches DEBUG lines\r\n\r\n* trie: include persistRoot in test coverage\r\n\r\n* trie: cover DEBUG code with test\r\n\r\n* trie: remove ethjs from trie debugger namespace\r\n\r\n* trie: add README instructions for debug control\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-09-18T22:45:34+02:00",
          "tree_id": "c666b5e5e134147696418c4ac9cad11a7b97185a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/73707a55d40f76e83da9f824de811099895aa010"
        },
        "date": 1695070210395,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19839,
            "range": "±6.34%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19823,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19120,
            "range": "±3.61%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18340,
            "range": "±4.06%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18331,
            "range": "±4.03%",
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
          "id": "bd705441699d433db1540208ce8ba1c796262605",
          "message": "Snap storage fetcher tests (#3018)\n\n* Increase test coverage for storage fetcher\r\n\r\n* Refactor storagefetcher requests over to using vi instead of td for mocking\r\n\r\n* Fix linting errors\r\n\r\n* Update root",
          "timestamp": "2023-09-19T11:22:44+05:30",
          "tree_id": "3c2f6ab1a28c630829022150adbd54c378341e48",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bd705441699d433db1540208ce8ba1c796262605"
        },
        "date": 1695103011700,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24968,
            "range": "±5.99%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25012,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24970,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24531,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19498,
            "range": "±11.67%",
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
          "id": "b6eb3294b0f05e62da043ea6f517c10f11b6c988",
          "message": "evm: add blobgasfee eip 7516 (#3035)\n\n* evm: add blobgasfee eip 7516\r\n\r\n* Update packages/evm/src/interpreter.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Update packages/common/src/hardforks.ts\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* update min hardfork\r\n\r\n* add to supported eips\r\n\r\n* update minimum hf to cancun\r\n\r\n* update min hf to paris same as 4844\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>",
          "timestamp": "2023-09-19T14:22:51+02:00",
          "tree_id": "99dd9bbe7e582297c33f0fa4a981565156b04007",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b6eb3294b0f05e62da043ea6f517c10f11b6c988"
        },
        "date": 1695126438925,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30463,
            "range": "±5.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30232,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29903,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24883,
            "range": "±11.16%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28610,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "distinct": false,
          "id": "0606d3cf8c316ebc5d5433c90a34632e3acefb3d",
          "message": "Trie/StateManager: Prefix Storage Trie Node Keys with Account Hash Substring (#3023)\n\n* Trie: add option to set prefix to node keys (default: undefined)\r\n\r\n* Trie: add keyPrefix parameter to shallowCopy()\r\n\r\n* StateManager: add key prefix for storage trie, fix trie bug\r\n\r\n* StateManager: update prefix to 7 bytes length\r\n\r\n* StateManager: add prefixStorageTrieKeys option, add test runs\r\n\r\n* StateManager: fix small test naming inconsistency\r\n\r\n* Client: use storage trie keys prefix option, fix copy bug in StateManager",
          "timestamp": "2023-09-19T15:06:33+02:00",
          "tree_id": "b7462ba086d2502e815da7ef783728656c5d7d70",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0606d3cf8c316ebc5d5433c90a34632e3acefb3d"
        },
        "date": 1695130638864,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22098,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22040,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21522,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22021,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22179,
            "range": "±5.72%",
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
          "id": "acd1bbbcb436f8e3f137e06b7f85271424e5cd09",
          "message": "Return '0x' values as '0x0' (#3038)\n\n* Return '0x' values as '0x0' since this is a JSON RPC response\r\n\r\n* Add test for checking quantity-encoded RPC representation\r\n\r\n* statemanager: add extra test for edge-case accounts for proofs\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-09-19T19:12:59+02:00",
          "tree_id": "74a45e121912d9dfe76c7b94454ba55764ca126f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/acd1bbbcb436f8e3f137e06b7f85271424e5cd09"
        },
        "date": 1695144601309,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31966,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31153,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31056,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26931,
            "range": "±9.31%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29487,
            "range": "±2.78%",
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
          "id": "1f711d02e73ff66145e232599598bd39a37a6665",
          "message": "VM/EVM profiler: add summary, add Blocks per Slot normalized field (#3041)\n\n* vm/evm: profiler: add general performance overview\r\n\r\n* vm: add logger comments",
          "timestamp": "2023-09-20T02:28:07+02:00",
          "tree_id": "23b201e5bc1d360593ec892654a9f79931b3ed96",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1f711d02e73ff66145e232599598bd39a37a6665"
        },
        "date": 1695170250892,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30084,
            "range": "±5.61%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29967,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30163,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25019,
            "range": "±10.41%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28470,
            "range": "±3.54%",
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
          "id": "fb4a05a62d2f97460dce8ecc121bcd9bfc3ee84b",
          "message": "statemanager: small refactor to get storage objects for snapsync (#3033)",
          "timestamp": "2023-09-20T09:19:46+02:00",
          "tree_id": "b578331b5ea2479bc0995f330769d45277f63dbc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fb4a05a62d2f97460dce8ecc121bcd9bfc3ee84b"
        },
        "date": 1695194589331,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32193,
            "range": "±4.28%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31500,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31267,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27090,
            "range": "±9.52%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29426,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "73983677+omahs@users.noreply.github.com",
            "name": "omahs",
            "username": "omahs"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80262b6a7a0c053a1b2d0b03d4912e1942dc4951",
          "message": "Fix typos (#3048)\n\n* fix typos\r\n\r\n* fix typos",
          "timestamp": "2023-09-20T10:16:25-04:00",
          "tree_id": "4f27e0ddbe17c3a683f88b4648a749d16d956e00",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/80262b6a7a0c053a1b2d0b03d4912e1942dc4951"
        },
        "date": 1695219784178,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30768,
            "range": "±4.82%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30355,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29637,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25215,
            "range": "±11.12%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28777,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "d034e14b0d28efa752fd621eb474183999beed46",
          "message": "monorepo: rename versionedHashes -> blobVersionedHashes (#3043)\n\n* monorepo: rename versionedHashes -> blobVersionedHashes\r\n\r\n* evm: fix browser test\r\n\r\n* add getBlockByNumber test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-09-20T13:55:42-04:00",
          "tree_id": "099438d2cbb1d53f4e41e0fa7c32f4481d9d037c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d034e14b0d28efa752fd621eb474183999beed46"
        },
        "date": 1695232852675,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19742,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19874,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19281,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19707,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18722,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "78 samples"
          }
        ]
      }
    ]
  }
}