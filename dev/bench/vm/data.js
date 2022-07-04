window.BENCHMARK_DATA = {
  "lastUpdate": 1656968431024,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "52c6d52230c02ecf2bc9c5438c3271bd9a092061",
          "message": "Last round of master v5 Releases (#1927)\n\n* Monorepo: updated package-lock.json\r\n\r\n* Util: bumped version to v7.1.5, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* Util: rebuild documentation\r\n\r\n* Tx: bumped version to v3.5.2, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* VM: bumped version to v5.9.1, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* Client: bumped version to v0.5.0, added CHANGELOG entry, updated README\r\n\r\n* Nits\r\n\r\n* Update packages/client/README.md\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2022-06-02T11:41:51+02:00",
          "tree_id": "970b0d128b7a491190af9de19d8e87a3d973c357",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52c6d52230c02ecf2bc9c5438c3271bd9a092061"
        },
        "date": 1654163381659,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21553,
            "range": "±5.89%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22636,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19123,
            "range": "±12.61%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22091,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22047,
            "range": "±1.47%",
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
          "id": "5e266fffa37ca3c154d9f7efa5ef2033f42f50a9",
          "message": "Monorepo: updated package-lock.json (#1929)",
          "timestamp": "2022-06-02T12:10:55+02:00",
          "tree_id": "98a1c3465c82fb798c224bd1ba212b1abf7762cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5e266fffa37ca3c154d9f7efa5ef2033f42f50a9"
        },
        "date": 1654164952637,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19064,
            "range": "±8.48%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20132,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16079,
            "range": "±18.29%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20123,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19981,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "3e4e7bed681bfa6d1c95abbcc28f6508e828339d",
          "message": "Blockchain: Clique-recently-signed False Positive Fix (#1931)\n\n* Blockchain: fixed a bug in Clique-related recently signed check to only compare on recently signed counts if block numbers are consecutive\r\n* Update packages/blockchain/src/index.ts\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-06-02T13:14:19-07:00",
          "tree_id": "c11f4630dfc52852aae11c1f43b26f898d020742",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3e4e7bed681bfa6d1c95abbcc28f6508e828339d"
        },
        "date": 1654201199483,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10647,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10069,
            "range": "±10.81%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10935,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10880,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10643,
            "range": "±4.14%",
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
            "email": "Holger.Drewes@gmail.com",
            "name": "Holger Drewes",
            "username": "holgerd77"
          },
          "distinct": true,
          "id": "4481cf2d3f69bc35be343e5ae6709434eb2add9d",
          "message": "Monorepo: fixed eslint-plugin-typestrict dependency to v1.0.3 to avoid version conflicts due to eslint-plugin update to v5, rebuild package-lock.json",
          "timestamp": "2022-06-08T12:33:27+02:00",
          "tree_id": "16513b64e2581a33967777befc712bb1ac16c353",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4481cf2d3f69bc35be343e5ae6709434eb2add9d"
        },
        "date": 1654684751601,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27049,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25607,
            "range": "±6.40%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26476,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21338,
            "range": "±16.54%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26048,
            "range": "±2.65%",
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
          "id": "8a65e1928bc555519d22d3a5d5f885a54eaf0eff",
          "message": "develop clean-up items (#1944)",
          "timestamp": "2022-06-08T13:05:28+02:00",
          "tree_id": "fecf01d02014ebf834478d6865498ccede9f81bd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8a65e1928bc555519d22d3a5d5f885a54eaf0eff"
        },
        "date": 1654686685790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18858,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18040,
            "range": "±6.71%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19495,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18916,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16443,
            "range": "±10.60%",
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
          "id": "5c093afe6030d572b31364761ae711f2cec75943",
          "message": "util: move package util to @ethereumjs namespace (#1952)\n\n* move package util to @ethereumjs namespace\r\n\r\n* fix the missed import\r\n\r\n* lint client",
          "timestamp": "2022-06-10T23:52:41+05:30",
          "tree_id": "fa3425d2c2c1652ae5ea41b8d9fa34dba015ed1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5c093afe6030d572b31364761ae711f2cec75943"
        },
        "date": 1654885675828,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29813,
            "range": "±6.83%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30899,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26965,
            "range": "±9.31%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422908",
            "value": 29859,
            "range": "±6.04%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28755,
            "range": "±2.48%",
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
          "id": "ab9a9d6f68a0e8c75aab1e9a8e363a1816160477",
          "message": "move mpt package to @ethereumjs namespace (#1953)",
          "timestamp": "2022-06-10T22:32:47+02:00",
          "tree_id": "5cba0582722f16cf002d0d2be5826806b8a3a01c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ab9a9d6f68a0e8c75aab1e9a8e363a1816160477"
        },
        "date": 1654893456576,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32832,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33625,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28930,
            "range": "±8.47%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32912,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30385,
            "range": "±1.82%",
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
          "distinct": true,
          "id": "b9378efaacbcbbb48ead4b480dd1cf35966f2461",
          "message": "Util: Signature Code Cleanup (new) (#1945)\n\n* Util -> ecsign: remove function signature overloading, limit chainId, v to bigint, adopt tests and library usages\r\n\r\n* Util -> signature: fix misleading fromRpcSig() comment\r\n\r\n* Util -> signature: limit v and chainId input parameters to bigint\r\n\r\n* Util -> signature: fixed test cases\r\n\r\n* VM: EIP-3075 Auth Call test fixes\r\n\r\n* Util -> signature: simplify ecsign logic\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2022-06-13T11:53:44+02:00",
          "tree_id": "19ecabe3c210626a371c73848d4c0dfc96292f1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b9378efaacbcbbb48ead4b480dd1cf35966f2461"
        },
        "date": 1655114310978,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29525,
            "range": "±6.58%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30791,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27115,
            "range": "±8.49%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27886,
            "range": "±11.61%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28441,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "78 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "hello@basecode.sh",
            "name": "Brian Faust",
            "username": "faustbrian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4c379ab7baa96fa30afb3828dcc0d34cc1234ea",
          "message": "refactor: migrate to `8.0.0` of `level` (#1949)\n\n* refactor: migrate to `8.0.0` of `level`\r\n\r\n* refactor: replace `level-mem` with `memory-level`\r\n\r\n* refactor: remove `MemoryDB`\r\n\r\n* refactor: https://github.com/Level/memory-level/blob/main/UPGRADING.md\r\n\r\n* wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-06-13T12:31:48+02:00",
          "tree_id": "fe35fbfb4937d305e64fadbdf28dd211ab4a201e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a4c379ab7baa96fa30afb3828dcc0d34cc1234ea"
        },
        "date": 1655116615989,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30657,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30788,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28361,
            "range": "±7.19%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26803,
            "range": "±11.12%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28443,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "457863cdffb89992259dd9488ff4d0419d56252e",
          "message": "Fix client integration tests (#1956)\n\n* Re-enable integration tests\r\n\r\n* Remove hardcoded difficulty in mockchain blocks\r\n\r\n* Check for subchain before examining bounds\r\n\r\n* Copy common to avoid max listener warnings\r\n\r\n* make destroyServer async\r\n\r\n* Proper fix for setting difficulty in mockchain\r\n\r\n* reqId fix\r\n\r\n* remove the redundant while loop\r\n\r\n* wait for setTineout to clear out\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-14T02:51:40+05:30",
          "tree_id": "f3a03ed9cef74bd6f54c680d0225f9dd7a135b44",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/457863cdffb89992259dd9488ff4d0419d56252e"
        },
        "date": 1655155593930,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30469,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30859,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27800,
            "range": "±8.04%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28047,
            "range": "±9.79%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28356,
            "range": "±2.26%",
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
          "id": "32d3f107f780f3a7d3df4ed375d69ecfd463fd5a",
          "message": "client: Fix blockchain db init (#1958)",
          "timestamp": "2022-06-14T10:39:35-04:00",
          "tree_id": "604e8061e9565db035c0e7f642499888e29d2e2a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/32d3f107f780f3a7d3df4ed375d69ecfd463fd5a"
        },
        "date": 1655217912592,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19391,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18123,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17735,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17840,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15802,
            "range": "±10.04%",
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
          "id": "aff80c48d80f52352eb704e9d981eb1976a5149f",
          "message": "client: Miscellaneous fixes for beacon sync in reverseblockfetcher, skeleton, merge forkhash  (#1951)\n\n* Fix fetcher first,count tracking for reverseblockfetcher\r\n\r\n* some canonical fill logging improvs\r\n\r\n* set forkhash for merge as well\r\n\r\n* reverse block fetcher specs coverage enhancement\r\n\r\n* rename to numBlocksInserted for better clarity",
          "timestamp": "2022-06-15T01:39:54+05:30",
          "tree_id": "0e3cd8251a3be152d16f014784273151d3170b13",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aff80c48d80f52352eb704e9d981eb1976a5149f"
        },
        "date": 1655237707338,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26992,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26151,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25674,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22779,
            "range": "±13.88%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24178,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "2bd7ae6f62f8b063b3d271b38341ec9688554008",
          "message": "VM/Client: fix tests (#1969)\n\n* vm: remove accidentally added file\r\n\r\n* client: lint fixes\r\n\r\n* vm: fix vm.copy\r\n\r\n* vm: fix benchmarks\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-16T20:34:15+02:00",
          "tree_id": "2ec319b88acd6343e9440419d55f721cbce87f4e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2bd7ae6f62f8b063b3d271b38341ec9688554008"
        },
        "date": 1655404754222,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25756,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24430,
            "range": "±6.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24954,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21178,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24646,
            "range": "±2.29%",
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
          "id": "ddee04d6dd53377c879b61c7e4702a29ffb705fb",
          "message": "Devp2p-ethereum-cryptography-dependency (#1947)\n\n* devp2p: import ethereum-cryptography package\r\n\r\n* devp2p: update utils to use ethereum-cryptography\r\n\r\n* devp2p: update src components to use ethereum-cryptography\r\n\r\n* devp2p: update tests to use ethereum-cryptography\r\n\r\n* devp2p: remove secp256k1 dependency\r\n\r\n* Rebase on master\r\n\r\n* devp2p: replace 'hi-base32' dependency with '@scure/base'\r\n\r\n* devp2p: delete unused import\r\n\r\n* devp2p: replace `keccak` use with `@noble/hashes`\r\n\r\n* devp2p: replace base64url dependency with base64url from '@scure/base'\r\n\r\n* devp2p: use publicKeyConvert instead of getPublicKey\r\n\r\n* devp2p: use exported keccak256.create() from ethereum-cryptography\r\ndefine Hash type based on return type\r\n\r\n* devp2p: update ethereum-cryptography dependency to 1.1.0\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-18T03:21:24-06:00",
          "tree_id": "07cc5880d00e0e40e12d1333ce3d60a4d99390a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ddee04d6dd53377c879b61c7e4702a29ffb705fb"
        },
        "date": 1655544417493,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17049,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16655,
            "range": "±5.10%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17422,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17197,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16911,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "hello@basecode.sh",
            "name": "Brian Faust",
            "username": "faustbrian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "71265541e5011d42e75e5bd0344ad1087e6a2d71",
          "message": "Trie (chore): reorganise files by technical domains (#1972)\n\n* chore(trie): reorganise files by technical domains\r\n\r\n* refactor(trie): break down `trie/node` into smaller files and renaming\r\n\r\n* chore(trie): install `@types/readable-stream` types",
          "timestamp": "2022-06-20T14:26:59+02:00",
          "tree_id": "9326c7b7ffb7d117cba3916f098c5b60c2018608",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/71265541e5011d42e75e5bd0344ad1087e6a2d71"
        },
        "date": 1655728396935,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15489,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15120,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14512,
            "range": "±7.71%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15324,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14938,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "252e283182f52caba166abcb767e563ea7458d7f",
          "message": "evm - Extract evm from vm as standalone package (#1974)\n\n* Extract evm from vm as standalone package\r\n\r\n* evm build\r\n\r\n* Build fixes\r\n\r\n* fix client build\r\n\r\n* move run tx spec back to vm\r\n\r\n* evm: update changelog\r\n\r\n* vm: fix state tests runner\r\n\r\n* vm: ensure tests run\r\n\r\n* evm: fix tests\r\n\r\n* client: fix tests\r\n\r\n* Remove extra test scripts\r\n\r\n* lint fix for vm\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-06-21T12:41:03+02:00",
          "tree_id": "6ba6c0d87788bcc8d05febc61f67ded9be18ad4d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/252e283182f52caba166abcb767e563ea7458d7f"
        },
        "date": 1655808787702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15588,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15303,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15214,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15315,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13977,
            "range": "±2.90%",
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
          "id": "c5fb3169c004beca1de1340ebebb8838062dfb03",
          "message": " Monorepo: Remove esModuleInterop and allowSyntheticDefaultImports Options (cherry-picked) (#1975)\n\n* Monorepo: set esModuleInterop TS compiler option to false\r\n\r\n* client: change `import X` to `import * as X`\r\n\r\n* client: replace qheap with js-priority-queue\r\n\r\n* blockchain: change to import *\r\n\r\n* blockchain/tests: change to import *\r\n\r\n* block/test: change to import *\r\n\r\n* common: change to import *\r\n\r\n* common/tests: change to import *\r\n\r\n* devp2p: change imports to import * or require()\r\n\r\n* ethash/tests: change import tape to import * as\r\n\r\n* rlp/tests: change imports to import *\r\n\r\n* statemanager/test: change imports to import * as\r\n\r\n* trie/tests: change imports to import *\r\n\r\n* ts/tests: change imports to import *\r\n\r\n* util/tests: change imports to import *\r\n\r\n* vm: change json import to import *\r\n\r\n* vm/tests: change imports to import *\r\n\r\n* client/test: change imports to import *\r\n\r\n* vm/tests: fix API test imports\r\n\r\n* trie/benchmarks: fix benchmark test import\r\n\r\n* client: fix qheap import problem\r\n\r\n* Devp2p, EVM: fixed tests\r\n\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>",
          "timestamp": "2022-06-21T14:40:00+02:00",
          "tree_id": "05b40da563ff574d001fa8146b2cbbd9ec520835",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5fb3169c004beca1de1340ebebb8838062dfb03"
        },
        "date": 1655815902258,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28652,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26867,
            "range": "±4.56%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27231,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24462,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26537,
            "range": "±1.99%",
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
          "id": "1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040",
          "message": "Block validation methods, take 3 (#1959)\n\n* rename _validateHeaderFields\r\n\r\n* Move static consensus checks\r\n\r\n* block: fix header consensus validation tests\r\n\r\n* Move header.validate to blockhain\r\n\r\n* blockchain: fix tests related to headerValidate\r\n\r\n* move validateDifficulty to blockchain\r\n\r\n* block: fix difficulty tests\r\n\r\n* move blockchain dependendent validateUncle checks\r\n\r\n* block: fix `cliqueSigner` for default blocks\r\n\r\n* block: fix block tests\r\n\r\n* move blockchain dependent tests to blockchain\r\n\r\n* replace block.validate\r\n\r\n* Fix package build issues\r\n\r\n* ethash: fix test on invalidPOW\r\n\r\n* Move format level EIP1559 checks back to block\r\n\r\n* Fix EIP1559 tests, make validateGasLimit throw\r\n\r\n* blockchain: fix build issue\r\n\r\n* finish test fixes\r\n\r\n* various test fixes\r\n\r\n* vm: runTx fix\r\n\r\n* Add fix for kovan in genesis block\r\n\r\n* vm: last test fix\r\n\r\n* client: fix tests\r\n\r\n* client: miner and skeleton fixes\r\n\r\n* client: fix chainID test\r\n\r\n* client: fix skeleton tests\r\n\r\n* client: fix forkChoiceUpdate test\r\n\r\n* client: fix pendingBlock tests\r\n\r\n* new payload client instantiation fix plus lint cleanup\r\n\r\n* fix beaconsync integration spec\r\n\r\n* vm: fix examples\r\n\r\n* address feedback\r\n\r\n* test and parentheses fixes\r\n\r\n* test fixes\r\n\r\n* Remove unused clique check\r\n\r\n* Fix skeleton, again\r\n\r\n* fix skeleton, fix again\r\n\r\n* various client test fixes\r\n\r\n* clean up commented stubs\r\n\r\n* remove lint rule\r\n\r\n* client: fix integration test\r\n\r\n* blockchain: rename validation method\r\n\r\n* Update imports, fix qheap\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-21T18:09:39+02:00",
          "tree_id": "8b3ce968451effad1da644d499f4fe6aa1d26487",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040"
        },
        "date": 1655828168389,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14337,
            "range": "±4.16%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14197,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13824,
            "range": "±5.64%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14193,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13544,
            "range": "±2.73%",
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
          "id": "008c4691a3a0fe598eb82fb98835148296af9a1e",
          "message": "Blockchain file reorganization (#1986)\n\n* Move index to blockchain\r\n\r\n* Reorganize exports\r\n\r\n* blockchain: move types to types.ts\r\n\r\n* block: make _errorMsg protected",
          "timestamp": "2022-06-22T20:01:39+02:00",
          "tree_id": "74f41cbbc043cf10127368cfdc7350d73b106e6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/008c4691a3a0fe598eb82fb98835148296af9a1e"
        },
        "date": 1655921204397,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26098,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25037,
            "range": "±5.19%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25573,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22180,
            "range": "±9.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25125,
            "range": "±2.18%",
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
          "id": "74d5937b115d419a7d3fd697bc9c321355204a33",
          "message": "Remove explicit browser builds as monorepo builds already target es2020 (#1985)\n\n* Remove explicity browser builds as monorepo builds\r\n\r\n* remove browser key from package.json except client",
          "timestamp": "2022-06-22T20:34:22+02:00",
          "tree_id": "4b99bdcca5166da67c9a1e243ad4c53604b6a270",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/74d5937b115d419a7d3fd697bc9c321355204a33"
        },
        "date": 1655923096654,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23428,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22784,
            "range": "±6.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24032,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21954,
            "range": "±7.14%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20842,
            "range": "±9.99%",
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
          "id": "859087d6077f93be87187edb8e8139ccbd098600",
          "message": "Evm refactor updates (#1977)\n\n* evm/vm: move EEI back into VM\r\n\r\n* vm: fix build\r\n\r\n* evm: move evm folder up\r\n\r\n* evm: lint\r\n\r\n* vm: lint\r\n\r\n* vm/evm: move files around\r\n\r\n* evm/vm: fix tests\r\n\r\n* evm: cleanup dependencies\r\n\r\n* evm: remove more dependencies\r\n\r\n* vm: fix build\r\n\r\n* vm: fix CI/tests (?)\r\n\r\n* client: fix tests (?)\r\n\r\n* client; test fixes",
          "timestamp": "2022-06-23T11:12:19+02:00",
          "tree_id": "759002ab4f8cd2d4f01444f85a67e0ecdf542c47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/859087d6077f93be87187edb8e8139ccbd098600"
        },
        "date": 1655975748116,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28688,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27242,
            "range": "±4.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27573,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24776,
            "range": "±7.74%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26139,
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
          "id": "483a8e523fbcf835ea8f04e5a4dbce50983f7509",
          "message": "VM Folder restructure (#1991)\n\n* Rename index to vm.ts\r\n\r\n* vm: Move VMOpts to types, add index.ts\r\n\r\n* move all types to types.ts\r\n\r\n* vm: fix test imports\r\n\r\n* add param types in test\r\n\r\n* vm: fix type imports\r\n\r\n* Fix imports\r\n\r\n* vm: Fix benchmarks imports\r\n\r\n* Remove dist from vm imports\r\n\r\n* Fix bloom export\r\n\r\n* Fix test",
          "timestamp": "2022-06-23T22:00:16+02:00",
          "tree_id": "a926b43a5befbd88a5ab0d6699427fea46108e1d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/483a8e523fbcf835ea8f04e5a4dbce50983f7509"
        },
        "date": 1656014642872,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28364,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27202,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27836,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24851,
            "range": "±9.07%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26561,
            "range": "±2.00%",
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
          "id": "c06d9dbd9da7c1febc278e41775b3b16679ccf13",
          "message": "vm: Fix declaration settings (#1999)",
          "timestamp": "2022-06-27T14:17:15+02:00",
          "tree_id": "fb749740071961041d221edac71f1129f167253f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c06d9dbd9da7c1febc278e41775b3b16679ccf13"
        },
        "date": 1656332455373,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26076,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24546,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25009,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22022,
            "range": "±9.35%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24823,
            "range": "±2.22%",
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
          "id": "5bcd389b8c98e2f8bcb243146ebad2f58ab5c251",
          "message": "EVM Types Cleanup (#2001)\n\n* EVM: reorder types, add some code docs\r\n\r\n* EVM: do not export the the replicated intermediary state interfaces, only the resulting dedicated VmStateAccess interface\r\n\r\n* EVM: rename VmStateAccess -> EVMStateAccess\r\n\r\n* EVM: rename RunCallOpts -> EVMRunCallOpts, RunCodeOpts -> EVMRunCodeOpts interfaces to have these more prominently stand out\r\n\r\n* EVM: removed/internalized TxContext interface\r\n\r\n* EVM: localized NewContractEvent type\r\n\r\n* EVM: simplified test command (removed test:API), moved test files one level up\r\n\r\n* EVM: fixed test import references\r\n\r\n* EVM: moved all result types to file bottom",
          "timestamp": "2022-06-28T12:21:33+02:00",
          "tree_id": "5aed83d9bf593f5f52e47ec02d30cd67180b99af",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5bcd389b8c98e2f8bcb243146ebad2f58ab5c251"
        },
        "date": 1656411941664,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26200,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25478,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25752,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22496,
            "range": "±9.53%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25489,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "932f4f9e24e22981b58961f5405a67768aaedfad",
          "message": "Master branch - Gray Glacier Support (#1988)\n\n* common: add GrayGlacier HF and EIP-5133\r\n\r\n* block/test: add grayGlacier tests\r\n\r\n* VM, EVM: added EIP-5133 and GrayGlacier HF support\r\n\r\n* VM, EVM -> Simplification: limit supported EIP check and EIP docs to inner EVM (will deterministically throw on instantiation)\r\n\r\n* EVM, VM: moved supported HF check to EVM to cover both EVM and VM\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-06-28T13:29:52+02:00",
          "tree_id": "1703b59db51b0dba2f8ae5d6182ad811fe9a1f41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/932f4f9e24e22981b58961f5405a67768aaedfad"
        },
        "date": 1656416018359,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26981,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25238,
            "range": "±5.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26268,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22747,
            "range": "±9.89%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25935,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "872e85ce17dc3a0635762f7957c05279b2e923d8",
          "message": "EVM: Cleanup EEI (#2003)\n\n* evm/vm: cleanup round 1\r\n\r\n* vm: mark some eei methods protected\r\n\r\n* evm: update EEI methods\r\n\r\n* client: fix build\r\n\r\n* evm: lint\r\n\r\n* client/vm/evm: fix tests\r\n\r\n* client: fix tests",
          "timestamp": "2022-06-30T09:39:37+02:00",
          "tree_id": "83f8ebbf3d31c26b247623b95f4f50d94364d469",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/872e85ce17dc3a0635762f7957c05279b2e923d8"
        },
        "date": 1656574994706,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28826,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27535,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27632,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25226,
            "range": "±7.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26999,
            "range": "±2.00%",
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
          "id": "c5260ba9add32f57921380abb32c2c1f9dc21de6",
          "message": "Monorepo: Beta 1 Releases (#1957)\n\n* Common -> Beta 1 Release: added Changelog entry\r\n\r\n* Util -> Beta 1 Release: added Changelog entry\r\n\r\n* Tx -> Beta 1 Release: added Changelog entry\r\n\r\n* Trie -> Beta 1 Release: added Changelog entry\r\n\r\n* Monorepo -> Beta 1 Release: Suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Trie, Common, Tx, Util -> Beta 1 Releases: Trie related review feedback, added esModuleInterop/allowSyntheticDefaultImports sections\r\n\r\n* Block -> Beta 1 Release: added CHANGELOG entry\r\n\r\n* Block -> Beta 1 Releases: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Blockchain -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Monorepo: added beta version numbers\r\n\r\n* Devp2p -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Ethash -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* RLP -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* StateManager -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* EVM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* VM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Block: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Blockchain: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Common: bumped version to 3.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Devp2p: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Ethash: bumped version to 2.0.0-beta.1, updated upstream dependency versions\r\n\r\n* EVM: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* RLP: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* StateManager: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Trie: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Tx: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Util: bumped version to 8.0.0-beta.1, updated upstream dependency versions\r\n\r\n* VM: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Monorepo: updated package-lock.json\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-30T11:21:53+02:00",
          "tree_id": "eb4eafb564f56a27a5c7b78e5bdf8c1476b7262e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5260ba9add32f57921380abb32c2c1f9dc21de6"
        },
        "date": 1656581169515,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25470,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22989,
            "range": "±6.08%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23552,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21367,
            "range": "±10.02%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24024,
            "range": "±2.49%",
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
          "id": "cfd7b7754490b072a035cceaba59c3dfb517effd",
          "message": "client: Fix rpc import broken after tuning off esModuleInterop (#2006)",
          "timestamp": "2022-07-01T15:03:22+05:30",
          "tree_id": "a163819c7e31d59f03a259e0ae75f8db6e3c4f3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfd7b7754490b072a035cceaba59c3dfb517effd"
        },
        "date": 1656668243920,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17721,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16575,
            "range": "±4.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17854,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17458,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17092,
            "range": "±2.77%",
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
          "id": "3ba0078675498af4287155d0a63d206422d3c9b0",
          "message": "evm: Remove vm example links (#2011)",
          "timestamp": "2022-07-04T14:48:20+02:00",
          "tree_id": "6131d4561972bf0baadbd5587024e5b9ed4f774c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ba0078675498af4287155d0a63d206422d3c9b0"
        },
        "date": 1656939180682,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14081,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14173,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13624,
            "range": "±5.63%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14846,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14980,
            "range": "±2.62%",
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
          "id": "6618e5551d3676221620f146357d9ecc485eec83",
          "message": "Blockchain: optional consensus (#2002)\n\n* blockchain: add optional consensus param\r\n\r\n* blockchain: add algorithm property to consensus\r\n\r\n* blockchain: rework consensus setup\r\n\r\n* fix examples\r\n\r\n* fix blockchain test runner\r\n\r\n* add more tests\r\n\r\n* add blockchain checks to clique\r\n\r\n* skip merge check on custom consensus\r\n\r\n* Fix consensus check and add more tests\r\n\r\n* lint fix",
          "timestamp": "2022-07-04T22:55:35+02:00",
          "tree_id": "5c9fa795f320946c0596a844563d17377c68526e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6618e5551d3676221620f146357d9ecc485eec83"
        },
        "date": 1656968428847,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15595,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14924,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14569,
            "range": "±6.43%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15037,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14746,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      }
    ]
  }
}