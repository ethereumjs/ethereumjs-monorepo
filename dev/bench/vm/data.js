window.BENCHMARK_DATA = {
  "lastUpdate": 1693912898389,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "e6dc9dba6bc76e3476da65ace0d503db84190ede",
          "message": "Snap Sync Fetchers: Highest-Known-Hash Optimization (#2941)\n\n* Add assert to check if account trie root matches expected\r\n\r\n* Use hashed tries\r\n\r\n* Skip tasks with limit lower than the highest known account key hash\r\n\r\n* Remove log statements\r\n\r\n* Update test\r\n\r\n* Use a object that is different from null object for termination check\r\n\r\n* Add tests for highestKnownHash optimization for account fetcher\r\n\r\n* Revert \"Use hashed tries\"\r\n\r\nThis reverts commit d026655f192823010cc2effd22d6aa9331e0b7bf.\r\n\r\n---------\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2023-08-15T13:27:57+05:30",
          "tree_id": "fa637f189957117a534e3500b3685e41ac874531",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6dc9dba6bc76e3476da65ace0d503db84190ede"
        },
        "date": 1692086480647,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31631,
            "range": "±5.09%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31196,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31237,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26290,
            "range": "±10.78%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29656,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "8cde93db3224c5b982bf141f6c2bc254f85b87bd",
          "message": "devp2p: optimize eth debug (#2958)",
          "timestamp": "2023-08-15T10:53:36+02:00",
          "tree_id": "1ef00cbbcb624b050e8854be533a37254ff89efe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cde93db3224c5b982bf141f6c2bc254f85b87bd"
        },
        "date": 1692089849461,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27862,
            "range": "±6.64%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28892,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27846,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23864,
            "range": "±10.12%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26932,
            "range": "±4.22%",
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
          "id": "b153bc6bcf2fd243feadbdffdd5b47f72782b081",
          "message": "common: add forkHash tests (#2961)",
          "timestamp": "2023-08-15T15:53:13+05:30",
          "tree_id": "bbc072b32e4953b2b4945532cf27d02c65c4da41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b153bc6bcf2fd243feadbdffdd5b47f72782b081"
        },
        "date": 1692095248754,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21166,
            "range": "±5.99%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21707,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21777,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20857,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20532,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "04412bcae5bf7380061f2b39838057de6e3a6485",
          "message": "Replace testdouble with vitest test helpers (#2953)\n\n* Refactor headerfetcher.spec.ts to use vi instead of td\r\n\r\n* Refactor skeleton.spec.ts to use vi instead of td\r\n\r\n* Refactor newPayloadV2.spec.ts to use vi instead of td\r\n\r\n* Refactor newPayloadV1.spec.ts.spec.ts to use vi instead of td\r\n\r\n* Remove unused variable\r\n\r\n* Use longer timeout for locally failing tests\r\n\r\n* Refactor client.spec.ts to use vi instead of td\r\n\r\n* Remove commented out code\r\n\r\n* Refactor pendingBlock.spec.ts to use vi instead of td\r\n\r\n* Refactor beaconsync.spec.ts to use vi instead of td\r\n\r\n* Refactor peerpool.spec.ts to use vi instead of td\r\n\r\n* Refactor snapsync.spec.ts to use vi instead of td\r\n\r\n* Remove unused variable\r\n\r\n* Refactor fullsync.spec.ts to use vi instead of td\r\n\r\n* Remove commented code\r\n\r\n* Refactor rlpxserver.spec.ts to use vi instead of td\r\n\r\n* Refactor miner.spec.ts to use vi instead of td\r\n\r\n* fix rlpxserver test\r\n\r\n* Increate timeout for ethash PoW test\r\n\r\n* Fix linting issues\r\n\r\n* Remove extraneous td reference\r\n\r\n* Add some any to skip typing errors\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-08-16T13:49:03-07:00",
          "tree_id": "3957afb6f6fbd6464564557a4918ee1560a60afd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/04412bcae5bf7380061f2b39838057de6e3a6485"
        },
        "date": 1692219160434,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31938,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31656,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30961,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25877,
            "range": "±10.89%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28600,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "e1c1e7adc9783eaedb0312b663bc0d709d8ed0b5",
          "message": "client: include parent beacon block root for proposal payload uniquness (#2967)",
          "timestamp": "2023-08-17T13:06:23+02:00",
          "tree_id": "4d3ba428a5f97f455151181704e4b0b0848d7482",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e1c1e7adc9783eaedb0312b663bc0d709d8ed0b5"
        },
        "date": 1692270872218,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26469,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26156,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26387,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25807,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21213,
            "range": "±9.96%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "b7cb22f02881b87c79d7297cb0ed4913cc1dab15",
          "message": "Fix the Trie Package Benchmarks (#2969)\n\n* Refactor esm to cjs and db usage\n\n* Update level implementation to match current api\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-08-17T22:44:24-04:00",
          "tree_id": "8dc381cefeb479cccd194ab04b4dc1be81efa014",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b7cb22f02881b87c79d7297cb0ed4913cc1dab15"
        },
        "date": 1692326870065,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31460,
            "range": "±5.20%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31015,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31034,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26045,
            "range": "±10.58%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29611,
            "range": "±3.25%",
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
          "id": "85b8aa430d8bc97ad01b6f0ac3140e287076ee01",
          "message": "Trie: decouple walk test from demo (#2966)\n\n* trie: remove console logs from test\r\n\r\n* add debug package\r\n\r\n* walk log helper functions\r\n\r\n* add walk demo\r\n\r\n* commit lock\r\n\r\n* Clean up demo and turn on debug logs during run\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-08-18T12:11:23-04:00",
          "tree_id": "e5d1bf94f389254cefd64feb909b5a2e145d19c7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/85b8aa430d8bc97ad01b6f0ac3140e287076ee01"
        },
        "date": 1692375359749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21359,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21390,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21132,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21278,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20472,
            "range": "±3.75%",
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
          "id": "b1129f01fc454fff1bb9387f784fc66c1eae83d8",
          "message": "trie: fix broken import (#2976)",
          "timestamp": "2023-08-20T16:04:48-04:00",
          "tree_id": "823de9b676528fd1ee5fdf4604513d7812b4e8e5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b1129f01fc454fff1bb9387f784fc66c1eae83d8"
        },
        "date": 1692562103380,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31574,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31484,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31172,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26416,
            "range": "±10.39%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30283,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "4567956cc06e9df27b296b4feeefdec6e9501e0b",
          "message": "Snap Sync: Storage Fetcher Highest-Known-Hash Optimization (#2965)\n\n* Don't request tasks with limit lower than the highest known hash\r\n\r\n* Update test message\r\n\r\n* Update highest known hash in process phase\r\n\r\n* Test highest known hash optimization\r\n\r\n* Update test\r\n\r\n* Increase miner ethash PoW test timeout\r\n\r\n* Clean up code\r\n\r\n* small cleanup\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-08-22T19:35:32+05:30",
          "tree_id": "6eea974436898c1fe3fccc918c66a4c7293833a1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4567956cc06e9df27b296b4feeefdec6e9501e0b"
        },
        "date": 1692713378001,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26285,
            "range": "±5.51%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26206,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26044,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25304,
            "range": "±3.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20913,
            "range": "±10.50%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "4d699053dc935313411144112c1e2ea85939fafe",
          "message": "Update ethereum tests to 12.3 (#2971)\n\n* Update ethereum tests to 12.3\r\n\r\n* Add Cancun to `selectedForks` CI\r\n\r\n* Update CI for VM PR job\r\n\r\n* Adjust expected test counts\r\n\r\n* Extend timeout period for miner test\r\n\r\n* vm/ci: add cancun blockchain tests, fix test amount\r\n\r\n* vm/ci: fix cancun blockchain tests\r\n\r\n* skip ethash pow test\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-08-22T17:16:39+02:00",
          "tree_id": "ec8e0926dda9376b38fbde84135e23603a1deb0b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4d699053dc935313411144112c1e2ea85939fafe"
        },
        "date": 1692717627128,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26620,
            "range": "±5.63%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24328,
            "range": "±3.67%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24410,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24482,
            "range": "±3.76%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18680,
            "range": "±11.63%",
            "unit": "ops/sec",
            "extra": "64 samples"
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
          "id": "6f8ad2283d1a8772ffdae83f0782b9bc57c1f03e",
          "message": "Clean up logging in vm/evm (#2970)\n\n* Fix logging output\r\n\r\n* Cleanup more logging 0xs",
          "timestamp": "2023-08-22T17:53:43+02:00",
          "tree_id": "568c889196182969d35ee73bc43a28abf29d58be",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6f8ad2283d1a8772ffdae83f0782b9bc57c1f03e"
        },
        "date": 1692719834019,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31171,
            "range": "±6.12%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30671,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30921,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25816,
            "range": "±10.99%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29264,
            "range": "±3.61%",
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
          "id": "26c51791a1794e39c75f51f5454324ac6a5beef6",
          "message": "client: fixes for new engine api method validations for hive pr-834 (#2973)\n\n* client: fixes for new engine api method validations for hive pr-834\r\n\r\n* fix spec\r\n\r\n* handle null values hive sends\r\n\r\n* fix remaining errors\r\n\r\n* return blobs of already build payload\r\n\r\n* fix client spec\r\n\r\n* small fix\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-08-22T18:29:00+02:00",
          "tree_id": "7ab22d29c9761543727f0f763ad0a4da21cb15a3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/26c51791a1794e39c75f51f5454324ac6a5beef6"
        },
        "date": 1692721941865,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32624,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31919,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31993,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27693,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30349,
            "range": "±2.68%",
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
          "id": "8ed27df2d049e602e4afd211696a6cc86dcb0439",
          "message": "Client: fix client initialization order when blocks are preloaded with the --loadBlocksFromRlp flag (#2979)",
          "timestamp": "2023-08-23T11:10:31-04:00",
          "tree_id": "d91f752abd47fdaab9f83dde8efcb89552b98670",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8ed27df2d049e602e4afd211696a6cc86dcb0439"
        },
        "date": 1692803706183,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20300,
            "range": "±6.71%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20695,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20444,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20466,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19589,
            "range": "±3.39%",
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
          "id": "f5dcf4a13234cbab5fc1bfdca8ec2ab4aeb2cb5a",
          "message": "Update github actions to newer versions (#2972)",
          "timestamp": "2023-08-23T20:28:48+02:00",
          "tree_id": "fc38f0c1d05befc74f6ed1b544c5485482c35f7b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5dcf4a13234cbab5fc1bfdca8ec2ab4aeb2cb5a"
        },
        "date": 1692815563089,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31237,
            "range": "±5.02%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30631,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31121,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25767,
            "range": "±10.26%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29991,
            "range": "±3.14%",
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
          "id": "66e79ccaff01f1ce5afdba6ad6cfecc74c77aec5",
          "message": "Tx: Cache sender (#2985)\n\n* tx: cache sender\r\n\r\n* tx: add legacy tx to sender cache",
          "timestamp": "2023-08-24T13:23:29+02:00",
          "tree_id": "e3452c87291e637b4caf034ea3c08f3db8af7a53",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/66e79ccaff01f1ce5afdba6ad6cfecc74c77aec5"
        },
        "date": 1692876458895,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25717,
            "range": "±6.48%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24935,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25494,
            "range": "±3.88%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23829,
            "range": "±11.43%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22298,
            "range": "±7.11%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "490b7a10293941c6d2d0ae51594a69a7eb513cd5",
          "message": "Add error handling for async errors (#2984)",
          "timestamp": "2023-08-24T13:58:28+02:00",
          "tree_id": "f516a942b555a4f24243fcee6e6fd0f4bff3ba27",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/490b7a10293941c6d2d0ae51594a69a7eb513cd5"
        },
        "date": 1692878510141,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32696,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32224,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31935,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27353,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30146,
            "range": "±2.81%",
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
          "id": "35ec012473efcf4d3134c02bdacfdd19e7ff1e07",
          "message": "common: update the shanghai hf schedule for holesky (#2989)",
          "timestamp": "2023-08-24T20:43:08+02:00",
          "tree_id": "0422a26bbd9d86bebcd428fe2f4f033e59e6ca28",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/35ec012473efcf4d3134c02bdacfdd19e7ff1e07"
        },
        "date": 1692902832596,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24125,
            "range": "±6.35%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25109,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24871,
            "range": "±3.81%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24386,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19991,
            "range": "±11.51%",
            "unit": "ops/sec",
            "extra": "67 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "139627505+kaliubuntu0206@users.noreply.github.com",
            "name": "kaliubuntu0206",
            "username": "kaliubuntu0206"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7853b1f2bf0e47f7d132192ef2b156a4716f5d87",
          "message": "Wallet: Add fromMnemonic function (#2992)\n\n* Wallet: Add fromMnemonic function\n\n* Wallet: Add unit tests for fromMnemonic function\n\n* Wallet: Update hdkey class documentation\n\n* Wallet: Remove buffer type conversion\n\n* Wallet: correct import\n\n* Wallet: Make linter happy",
          "timestamp": "2023-08-26T16:07:41-04:00",
          "tree_id": "18dfd7fd7687eb26b7bcb6ce94617c8fa2e14f9a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7853b1f2bf0e47f7d132192ef2b156a4716f5d87"
        },
        "date": 1693080736301,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20097,
            "range": "±6.27%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20140,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20171,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19792,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20007,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "41ebb15173af913f5c65e4410fcd335d35db536b",
          "message": "VM: Reactivate more slow tests (#2991)\n\n* VM: reactivate static call tests\r\n\r\n* Delete commented-out VMTests lists (not useful anymore, integrated in BlockchainTests)\r\n\r\n* VM: slow test updates with comments on state of the respective tests\r\n\r\n* vm: update test count\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-08-29T13:22:42+02:00",
          "tree_id": "3bd0ffb15e9f5987e087f2077ef2313c4573addd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/41ebb15173af913f5c65e4410fcd335d35db536b"
        },
        "date": 1693308455820,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18870,
            "range": "±6.68%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18531,
            "range": "±3.66%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18910,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18465,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18017,
            "range": "±3.73%",
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
      }
    ]
  }
}