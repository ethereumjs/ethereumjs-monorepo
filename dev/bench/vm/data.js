window.BENCHMARK_DATA = {
  "lastUpdate": 1674133471401,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "tim@daubenschuetz.de",
            "name": "Tim Daubenschütz",
            "username": "TimDaub"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0d398cba77d7e5d88566076b58379400c1f0d3b8",
          "message": "In readme, remove references to LevelDB abstraction (#2434)\n\n`LevelDB` abstraction was removed and can now not be imported through @ethereumjs/trie >= 5.0.0 anymore. Hence, for most examples in the readme.md file, we're removing references to a top-level exported `LevelDB` abstraction, and we're replacing it with the generic and in-memory `MapDB` implementation.",
          "timestamp": "2022-12-07T11:00:07+01:00",
          "tree_id": "6c17cd6db670c2bddf4dff98b2e0f637e6c53141",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0d398cba77d7e5d88566076b58379400c1f0d3b8"
        },
        "date": 1670407770382,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19363,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18391,
            "range": "±4.59%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19429,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18880,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17326,
            "range": "±7.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "f34d2376dc0a8bef096b69e890308428a33297a4",
          "message": "Common custom chain bugs (#2448)\n\n* Fix two edge case bugs",
          "timestamp": "2022-12-13T08:52:12-05:00",
          "tree_id": "18f0b73b684b8dab409c99e1471aa8a3a93bdf51",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f34d2376dc0a8bef096b69e890308428a33297a4"
        },
        "date": 1670939743681,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9531,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9421,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9666,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9175,
            "range": "±6.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9872,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "c1bf118ccd9cc48fbbad564a97eda63629f6bd16",
          "message": "Implement `debug_traceTransaction` RPC endpoint (#2444)\n\n* add basic debug_traceTransaction rpc endpoint\r\n\r\n* Add first test\r\n\r\n* WIP tests\r\n\r\n* Add test for simple code execution\r\n\r\n* Add more tests\r\n\r\n* rename test data file\r\n\r\n* add tracer opts validation\r\n\r\n* add structLog interface\r\n\r\n* Add storage to structLogs\r\n\r\n* add error to structLogs\r\n\r\n* Throw on enabling return data opt\r\n\r\n* Update tests\r\n\r\n* Remove invalid test\r\n\r\n* Add tests for other invalid params",
          "timestamp": "2022-12-13T10:27:56-05:00",
          "tree_id": "64eb1b9694f0895a2576edee9600c8bb5f6f60c8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1bf118ccd9cc48fbbad564a97eda63629f6bd16"
        },
        "date": 1670945446695,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18380,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17890,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16639,
            "range": "±9.05%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18618,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17729,
            "range": "±1.97%",
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
          "id": "7e77b0f434661b00c8056b541dcdae636c7f9c42",
          "message": "Exclude sim from client unit tests (#2447)",
          "timestamp": "2022-12-13T21:28:35+05:30",
          "tree_id": "5702d5f60d261e53cf91ebe8961009fb7ce56e1e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7e77b0f434661b00c8056b541dcdae636c7f9c42"
        },
        "date": 1670947272051,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19432,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19443,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18995,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19158,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18880,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "18753754fe905591085caf65f82b812be7146507",
          "message": "common: Implement hardfork by time (#2437)\n\n* common: Implement hardfork by time\r\n\r\n* fix the interface and add pass timestamp param\r\n\r\n* fix eval\r\n\r\n* fixes\r\n\r\n* fix next nextHardforkBlock\r\n\r\n* fix next hf\r\n\r\n* fix shanghai time\r\n\r\n* fix hf cond\r\n\r\n* handle edgecase\r\n\r\n* add some permuation combinations for two timestamp based hardforks\r\n\r\n* fix blockchain checkAndTransition hardfork\r\n\r\n* remove null/undefined hardforks from geth genesis while parsing\r\n\r\n* address feedback\r\n\r\n* incorp feedback\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Rename unofficial hardforks\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-14T10:51:35-05:00",
          "tree_id": "2a9cae3fa394c29795de79cf09e595bbd51c9530",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/18753754fe905591085caf65f82b812be7146507"
        },
        "date": 1671033252815,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18501,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18862,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17711,
            "range": "±7.79%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18623,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18364,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zyx1993@126.com",
            "name": "Jowie",
            "username": "JowieXiang"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d84b87787333c6306862cb2990525d87ce89039",
          "message": "Add eth_getTransactionByBlockHashAndIndex RPC Endpoint (#2443)\n\n* getTransactionByBlockHashAndIndex\n\n* add tests\n\n* fix only\n\n* Remove commented code\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-14T12:15:11-05:00",
          "tree_id": "94f31bbe5f6e3528419ca59f4b528e8e9ddecef1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9d84b87787333c6306862cb2990525d87ce89039"
        },
        "date": 1671038271398,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19232,
            "range": "±4.25%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18200,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19623,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18910,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16965,
            "range": "±8.83%",
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
          "id": "696b36fe9091cd67f3e0a70bc696e41bd16e57a2",
          "message": "New December Releases (#2445)\n\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs, some withdrawal module code docs (Util v8.0.3)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Common v3.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Trie v5.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Tx v4.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Block v4.1.0)\r\n\r\n* Added withdrawal code example to Block README\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (StateManager v1.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Devp2p v5.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Ethash v2.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Blockchain v6.1.0)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (EVM v1.2.3)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (VM v6.3.0)\r\n\r\n* Client -> Release: Bumped version to v0.6.6, added CHANGELOG entry\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Release updates (removed sharding and EOF internal HFs, CHANGELOG updates (in particular Hardfork-By-Time addition))\r\n\r\n* Remove extraneous comment\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-15T16:55:46+01:00",
          "tree_id": "54af64530cb76379ec4c18aee1c3e0b85176a38f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/696b36fe9091cd67f3e0a70bc696e41bd16e57a2"
        },
        "date": 1671119937140,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14862,
            "range": "±3.70%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14861,
            "range": "±4.73%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14035,
            "range": "±8.42%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15440,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14850,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "47403fc028e1098bd625ff32ee3b5441481cdfbf",
          "message": "Fix EVM test scripts (#2451)\n\n* Fix coverage test script\r\n\r\n* Fix tests\r\n\r\n* Update tests",
          "timestamp": "2022-12-16T10:51:10+01:00",
          "tree_id": "5b84d6ec2a001b95514d5ba854033f504c0d43c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/47403fc028e1098bd625ff32ee3b5441481cdfbf"
        },
        "date": 1671184432453,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19545,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18885,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19861,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19128,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17024,
            "range": "±8.37%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "9966408adb104f09747a65f7285585f63e90a8cf",
          "message": "client: Build block fixes (#2452)\n\n* set hardfork by time fixes\r\n\r\n* bump test coverage\r\n\r\n* further cleanup\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-16T16:36:17+01:00",
          "tree_id": "0dee1d57430a308fca99bbb074cd42950e55cd97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9966408adb104f09747a65f7285585f63e90a8cf"
        },
        "date": 1671205210442,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19482,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18857,
            "range": "±3.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19071,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17686,
            "range": "±8.22%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19477,
            "range": "±1.42%",
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
          "id": "07b106fc0bed7d9019c11c0d6db19b854196bd0c",
          "message": "client: Add blockValue to the getPayload response (#2457)\n\n* client: Add blockValue to the getPayload response\r\n\r\n* fix withdrawal response",
          "timestamp": "2022-12-17T17:10:54-05:00",
          "tree_id": "090ad309113b1dd881258d7b58f09cbac049762c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/07b106fc0bed7d9019c11c0d6db19b854196bd0c"
        },
        "date": 1671315215929,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19267,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18884,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18604,
            "range": "±6.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18995,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18659,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "2eada55e427090b14e2c340e83678bc69f53566d",
          "message": "common: Update forkhash calculation for timebased hardforks (#2458)\n\n* common: Update forkhash calculation for timebased hardforks\r\n\r\n* update title of test",
          "timestamp": "2022-12-20T10:39:47+01:00",
          "tree_id": "609321c6c6b190b81653dc5d3e450c221934cb10",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2eada55e427090b14e2c340e83678bc69f53566d"
        },
        "date": 1671529355491,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17967,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18285,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17620,
            "range": "±7.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17964,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17754,
            "range": "±2.00%",
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
          "id": "eee3ab8aa07cf1d5633b496319fbcec76b3c7310",
          "message": "common: Add eips 3651,3855,3860 to shanghai hf for Zhejiang shanghai testnet (#2459)",
          "timestamp": "2022-12-21T12:58:17+01:00",
          "tree_id": "e47f54c9b119ed3ee17028741570abe95e5ea55e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eee3ab8aa07cf1d5633b496319fbcec76b3c7310"
        },
        "date": 1671624053890,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19480,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19195,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19309,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18158,
            "range": "±8.25%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19345,
            "range": "±1.49%",
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
          "id": "bd67a97cf7696d7ceffe6b24ba1c83150f684a2e",
          "message": "common: Update setForkHashes to update timebased hardfork forkhashes (#2461)",
          "timestamp": "2022-12-23T20:09:31+05:30",
          "tree_id": "94bbcbd12534cbca20a7c37859943e21a17373c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bd67a97cf7696d7ceffe6b24ba1c83150f684a2e"
        },
        "date": 1671806630135,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18471,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18767,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17966,
            "range": "±7.04%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18535,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18336,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "7e1bc94e79ca73d189b29ab58d40ec9c82683743",
          "message": "client: Handle withdrawal bodies in the blockfetcher and skeleton sync fixes (#2462)\n\n* client: Handle withdrawal bodies in the blockfetcher\r\n\r\n* fix test\r\n\r\n* enhance coverage\r\n\r\n* improv coverage\r\n\r\n* limit count in reverse fetcher to not sync on/pre genesis\r\n\r\n* enhance coverage",
          "timestamp": "2022-12-24T00:36:29+05:30",
          "tree_id": "c82483106151ffd8a66f3f9a858aa056ccfb4f20",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7e1bc94e79ca73d189b29ab58d40ec9c82683743"
        },
        "date": 1671822581834,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15161,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16046,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14646,
            "range": "±8.36%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16196,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15366,
            "range": "±2.57%",
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
          "id": "572d7822d4bc9209e3d261c6e3bb799f89f66755",
          "message": "block: Handle hardfork defaults consistently (#2467)\n\n* block: handle hardfork defaults consistently\r\n\r\n* add test\r\n\r\n* fix test with the modified behavior",
          "timestamp": "2023-01-02T13:37:07-05:00",
          "tree_id": "8de36e8de02ed6488bea830a5d9995f5374a3c87",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/572d7822d4bc9209e3d261c6e3bb799f89f66755"
        },
        "date": 1672684978079,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9643,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9581,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9796,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9389,
            "range": "±6.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9953,
            "range": "±1.97%",
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
          "id": "e8b87e3c729c0feaeecf5f2c946726a66b9ca619",
          "message": "common: add eip option to GethConfigOpts (#2469)\n\n* common: add eip options to GethConfigOpts\r\n\r\n* vm: simplify common setEIPs in 4895 test",
          "timestamp": "2023-01-03T19:49:34-05:00",
          "tree_id": "8fd4deffc41afb0e18107c39cb4bdf5683c6877a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8b87e3c729c0feaeecf5f2c946726a66b9ca619"
        },
        "date": 1672793549696,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18505,
            "range": "±3.86%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16293,
            "range": "±7.58%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18376,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17801,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15609,
            "range": "±11.57%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "f917530f762d353480ba582323ced6970cc6687e",
          "message": "common: infer latest hardfork from geth genesis file (#2470)\n\n* common: improve geth genesis typings and infer latest hardfork if possible\r\n\r\n* common: adjust current hardfork setting placement\r\n\r\n* common: add test cases to check current hardfork setting",
          "timestamp": "2023-01-05T09:09:06+01:00",
          "tree_id": "2a92465f76de0c4e9a7022c16f0c0e0747048e02",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f917530f762d353480ba582323ced6970cc6687e"
        },
        "date": 1672906311802,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19256,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18273,
            "range": "±5.41%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19456,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18923,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17164,
            "range": "±7.94%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "caymannava@gmail.com",
            "name": "Cayman",
            "username": "wemeetagain"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "70dbdd132f284fa25068c2766e8c761e50f837bf",
          "message": "chore: avoid copy in rlp.encode (#2476)",
          "timestamp": "2023-01-10T14:50:42-05:00",
          "tree_id": "792613e3cab406fd2c15eef7092cee8c4ad16bb9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/70dbdd132f284fa25068c2766e8c761e50f837bf"
        },
        "date": 1673380399238,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19184,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18344,
            "range": "±4.59%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19315,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18850,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16916,
            "range": "±9.04%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "9821adbf62e1a4ac28bcc4918557b871bc8b108b",
          "message": "Fix: typos (#2479)\n\n* Fix: typos\r\n\r\nFix: typos\r\n\r\n* Fix: typo\r\n\r\nFix: typo\r\n\r\n* Fix: typo\r\n\r\nFix: typo\r\n\r\n* Fix: typos\r\n\r\nFix: typos\r\n\r\n* Fix: typo\r\n\r\nFix: typo\r\n\r\n* Put spelling correction in correct place\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-10T20:55:54-05:00",
          "tree_id": "9eb19214b71401008336f4b45a5f0bf0db256ad3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9821adbf62e1a4ac28bcc4918557b871bc8b108b"
        },
        "date": 1673402344362,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18372,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17389,
            "range": "±6.79%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18818,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18169,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16341,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "aa803093e5770e865d76a322d6f9a835d6adf5a9",
          "message": "Fix beaconsync test race condition (#2481)\n\n* Switch tests to check logger messages\r\n\r\n* Remove second race condition\r\n\r\n* Remove unused import",
          "timestamp": "2023-01-11T11:55:11+05:30",
          "tree_id": "c51dd7b829ded3ba08b53f5e6e11ea2d40f4c9e6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aa803093e5770e865d76a322d6f9a835d6adf5a9"
        },
        "date": 1673418561895,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9217,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9602,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9292,
            "range": "±5.87%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9576,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9432,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "cfc37f1d3eeb69fa38d2852f1d9222ad0196eb70",
          "message": "client: reuse jwt-token from default path (#2474)\n\n* client: reuse jwttoken from default path\r\n\r\n* client: cleanup\r\n\r\n* client: throw if provided jwtFilePath does not exist\r\n\r\n* client: ensure that defaultJwtPath exists",
          "timestamp": "2023-01-11T09:40:55+01:00",
          "tree_id": "cf21bdf4f786736efcb3a948d57cd6358a2a2f2f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfc37f1d3eeb69fa38d2852f1d9222ad0196eb70"
        },
        "date": 1673426644042,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15248,
            "range": "±4.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16003,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14795,
            "range": "±7.63%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15963,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15375,
            "range": "±2.53%",
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
          "id": "01bc5fdd4fbbb03c2fdaad1cdf30165e9ecc3fab",
          "message": "client: typed client opts (#2475)\n\n* client: initial ClientOpts interface [wip]\r\n\r\n* Clean up type mismatches\r\n\r\n* add createClientArgs type and add typing\r\n\r\n* fix args.mine evaluation\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-11T11:03:18+01:00",
          "tree_id": "490cd57e88ad2023c35cd22b76c334e845abd538",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/01bc5fdd4fbbb03c2fdaad1cdf30165e9ecc3fab"
        },
        "date": 1673431615442,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10488,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10745,
            "range": "±2.63%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10413,
            "range": "±6.22%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10472,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10133,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "14c451fb97d1a24dd137ddb099cc0d72d1776d9b",
          "message": "Remove text-lcov reporter to clean coverage output (#2478)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-01-11T13:56:54+01:00",
          "tree_id": "2823ca1a4a20d62ab32f190f744f5c0153ca82a6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/14c451fb97d1a24dd137ddb099cc0d72d1776d9b"
        },
        "date": 1673442010466,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15534,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15209,
            "range": "±4.85%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15172,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14449,
            "range": "±9.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15231,
            "range": "±2.47%",
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
          "id": "9224fd0165083c7b14536f3b59821d749c9e17cc",
          "message": "client: Clean stop sync and execution to allow client shutdown (#2477)\n\n* client: Clean stop sync and execution to allow client shutdown\r\n\r\n* add testcase\r\n\r\n* enhance coverage\r\n\r\n* fix typo\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-01-11T14:25:13+01:00",
          "tree_id": "e66b3143a1a7aa47c4c6c1a5649965c5c5868e97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9224fd0165083c7b14536f3b59821d749c9e17cc"
        },
        "date": 1673443669749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19442,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18569,
            "range": "±5.52%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19786,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19045,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16836,
            "range": "±8.41%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "326684ebc6a59b2bf6673e337c96af76e0ddcee2",
          "message": "Remove lcov-text param from coverage script (#2484)",
          "timestamp": "2023-01-13T16:15:49-05:00",
          "tree_id": "14d57e686adde67c74506abafdac01c7c98ebc06",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/326684ebc6a59b2bf6673e337c96af76e0ddcee2"
        },
        "date": 1673644716699,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18139,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17906,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17721,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17163,
            "range": "±8.63%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17906,
            "range": "±2.01%",
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
          "id": "9b146527bb585885b071cd19f023584e8708b96e",
          "message": "client: Apply correct hf to peer fetched txs as well as filter and remove mismatching hf txs while building blocks (#2486)\n\n* client: Apply correct hf to peer fetched txes as well as filter and remove mismatching hf txs while building blocks\r\n\r\n* remove debugging inserts\r\n\r\n* also add check to match block and vm hf\r\n\r\n* add option to skip val\r\n\r\n* fix cond\r\n\r\n* add tests\r\n\r\n* add skip hardfork validation in block as well\r\n\r\n* fix spec tests\r\n\r\n* skip validation in vm examples run\r\n\r\n* handle the hf mismatch error properly\r\n\r\n* add skip hf validation to addtransaction and fix more specs\r\n\r\n* remove  debugging artifact\r\n\r\n* fix miner spec\r\n\r\n* skip hf validation in pending block spec\r\n\r\n* add comment\r\n\r\n* fix test\r\n\r\n* vm fx\r\n\r\n* altetrnatively skip hf validation for estimate gas\r\n\r\n* fix test\r\n\r\n* enhance covergae\r\n\r\n* enhance coverage",
          "timestamp": "2023-01-17T09:34:34+01:00",
          "tree_id": "b9d53cb3ada87d074bdd1d8e5c1b1b44e1f07eab",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9b146527bb585885b071cd19f023584e8708b96e"
        },
        "date": 1673944663056,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15275,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14975,
            "range": "±5.90%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14994,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14549,
            "range": "±8.92%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15157,
            "range": "±2.60%",
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
          "id": "64d8d3c6f050281e121c46ec4978fc30fc632a73",
          "message": "util: Change withdrawal amount representation from Wei to Gwei (#2483)\n\n* util: Change withdrawal amount representation for Wei to Gwei\r\n\r\n* cleanup\r\n\r\n* fix test\r\n\r\n* fix test\r\n\r\n* move unit to separate file\r\n\r\n* add missing file",
          "timestamp": "2023-01-17T14:31:37+05:30",
          "tree_id": "392122d9fc68c8f215d40bf392e43900abdaabec",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/64d8d3c6f050281e121c46ec4978fc30fc632a73"
        },
        "date": 1673946252655,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19254,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18597,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19187,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18859,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17708,
            "range": "±7.12%",
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
          "id": "8bcdb4883b6d6ae656c0929a31ebcb5374205590",
          "message": "Update Dockerfiles to use node 18 (#2487)",
          "timestamp": "2023-01-17T17:24:58+05:30",
          "tree_id": "ac90e2b163056a7cdef792286c9bcae94373ab68",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8bcdb4883b6d6ae656c0929a31ebcb5374205590"
        },
        "date": 1673956658833,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19470,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19053,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18541,
            "range": "±7.44%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19113,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18901,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "6508bf9213d32929e0e2456c9c4fcfabe4e9d3c6",
          "message": "util: Add ssz roots capability for withdrawals hash tree root (#2488)\n\n* util: Add ssz roots capability for withdrawals hash tree root\r\n\r\n* Fix karma setup\r\n\r\n* Update rlp to v4.0.0\r\n\r\n* add cl spec testcase\r\n\r\n* better naming\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-18T11:51:23-05:00",
          "tree_id": "c03aa0931ce219424a64426c8ed6c10cb119bdca",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6508bf9213d32929e0e2456c9c4fcfabe4e9d3c6"
        },
        "date": 1674060878527,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 13675,
            "range": "±3.77%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 13804,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13943,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13459,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12126,
            "range": "±11.84%",
            "unit": "ops/sec",
            "extra": "66 samples"
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
          "id": "3ec8845bdd032dc95f0b5f929caea26cc222d041",
          "message": "client: throw on unknown client cli arg (#2490)",
          "timestamp": "2023-01-19T14:01:40+01:00",
          "tree_id": "2bcd72159d753e27a9bd40f906d0ed309300c95f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ec8845bdd032dc95f0b5f929caea26cc222d041"
        },
        "date": 1674133470007,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19640,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19022,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19159,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17770,
            "range": "±7.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19557,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      }
    ]
  }
}