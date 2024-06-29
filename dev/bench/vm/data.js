window.BENCHMARK_DATA = {
  "lastUpdate": 1719663593273,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "344c1731046dcc2e7fe2cfa6c092f645ac77b775",
          "message": "Client post ESM migration cleanup (#3414)\n\n* Find package.json the right way\r\n\r\n* remove client cjs build\r\n\r\n* Remove cjs build entirely\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-05-10T08:07:23-04:00",
          "tree_id": "f5ed822d31d83f006568383602bb041714066733",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/344c1731046dcc2e7fe2cfa6c092f645ac77b775"
        },
        "date": 1715342998790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42947,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40822,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41428,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41068,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36168,
            "range": "±6.30%",
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
          "id": "c6aae92177f0d22ddb415b928a17a2684953eb4a",
          "message": "Add support for `pending` in `getTransactionCount` (#3415)\n\n* add support for pending in getTxCount\r\n\r\n* Add test for pending block arg\r\n\r\n* lint",
          "timestamp": "2024-05-10T21:31:31+02:00",
          "tree_id": "e01cdff562a4649e71262d9fca9c3171b5c96919",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c6aae92177f0d22ddb415b928a17a2684953eb4a"
        },
        "date": 1715369645539,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42199,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41506,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41669,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39460,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36869,
            "range": "±6.32%",
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
          "id": "79a33166ef55a4e174a434ad3e91944278d80aaf",
          "message": "fix estimateGas (#3416)\n\n* fix estimateGas\r\n\r\n* client: cleanup estimateGas\r\n\r\n* client: fix eth_estimateGas test and improve reliability of eth_estimateGas\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-05-10T18:06:51-04:00",
          "tree_id": "08dfa6c3fe1b042e7763e07fe622c0b098a67567",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79a33166ef55a4e174a434ad3e91944278d80aaf"
        },
        "date": 1715378965431,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40920,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40172,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40118,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38675,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35589,
            "range": "±5.98%",
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
          "id": "0786896bc16a5e0f805fc653887d85ce7c2c9152",
          "message": "vm: missing beaconroot account verkle fix (#3421)",
          "timestamp": "2024-05-14T10:44:17-04:00",
          "tree_id": "5fd5e6db62c7ebd98736f88bddac73bfb0575300",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0786896bc16a5e0f805fc653887d85ce7c2c9152"
        },
        "date": 1715698017528,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41957,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40190,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40674,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40063,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38739,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "f79a6f2e73cdcaf3ace1325514ab307ab22588f5",
          "message": "common: parse depositContractAddress from genesis (#3422)",
          "timestamp": "2024-05-14T12:20:00-04:00",
          "tree_id": "fdd3e569ac624ba5145280676b943ec135a147ff",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f79a6f2e73cdcaf3ace1325514ab307ab22588f5"
        },
        "date": 1715703953455,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42930,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40624,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40873,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40501,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35974,
            "range": "±5.96%",
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
          "id": "f82af3b92f01e5093b34b4d861dd6186093db47b",
          "message": "Move tree key computation to verkle and simplify (#3420)\n\n* move tree keys to verkle and simplify\r\n\r\n* fix references\r\n\r\n* more fixes\r\n\r\n* verkle: minor updates\r\n\r\n* verkle: fix test\r\n\r\n* verkle: one more update\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-05-14T12:54:58-04:00",
          "tree_id": "07c450307aadfbbb904bcccdc597852a11913412",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f82af3b92f01e5093b34b4d861dd6186093db47b"
        },
        "date": 1715705983839,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41834,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41106,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40693,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39476,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35471,
            "range": "±5.78%",
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
          "id": "36ca22023bbbf46d6947b4c0c2e633a0cd21d46c",
          "message": "Update verkle crypto dep (#3424)",
          "timestamp": "2024-05-14T13:12:00-04:00",
          "tree_id": "b0bbe15b8fe4b1eccc5c2b91cdc6734b881be8b3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/36ca22023bbbf46d6947b4c0c2e633a0cd21d46c"
        },
        "date": 1715706875494,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42506,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41418,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41354,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39705,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35861,
            "range": "±6.44%",
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
          "id": "8cae3bb3f8749f025f4d1f8a3353676295c8550e",
          "message": "verkle: rename code keccak (#3426)\n\n* verkle: rename code keccak\r\n\r\n* verkle: rename code keccak\r\n\r\n* verkle: rename code keccak",
          "timestamp": "2024-05-14T14:39:38-04:00",
          "tree_id": "6f5e0c2efc013ea788672e9f3ef5c52725f3cfd2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cae3bb3f8749f025f4d1f8a3353676295c8550e"
        },
        "date": 1715712260035,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41222,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40764,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40325,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36948,
            "range": "±4.83%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38644,
            "range": "±1.79%",
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
          "id": "bc648e746b670be56e23c8bd247a9b74860fc256",
          "message": "util: revert some PrefixedHexString breaking changes (#3427)\n\n* util: remove redundant isHexPrefixed since we have isHexString\r\n\r\n* util: re-add string type support\r\n\r\n* util: misc fixes\r\n\r\n* docs: undo readme docs change\r\n\r\n* Update packages/util/README.md\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/util/src/internal.ts\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n---------\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>",
          "timestamp": "2024-05-14T12:51:23-07:00",
          "tree_id": "1ce41ee7d6b8e643b6420839d905ba15eea3f4c7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bc648e746b670be56e23c8bd247a9b74860fc256"
        },
        "date": 1715716558558,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42789,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40736,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41410,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40185,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35625,
            "range": "±6.22%",
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
          "id": "cfe942e2d98bfbe0ebbedb61e965b4e56c2338ca",
          "message": "evm: fix eip3074 AUTH check (#3432)",
          "timestamp": "2024-05-16T10:12:19-04:00",
          "tree_id": "d2e86524d31023de1474afb2fa4bdbb7c561a903",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfe942e2d98bfbe0ebbedb61e965b4e56c2338ca"
        },
        "date": 1715868895247,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41614,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39510,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40373,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39509,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38273,
            "range": "±2.04%",
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
          "id": "c95499c5b9bbdb4b36cc05f6785dd62e8a4d91a3",
          "message": "verkle: implement verkle proof verification  (#3423)\n\n* statemanager: proper type for verkleproof\n\n* verkle: add verifyProof wrapper in verkle crypto\n\n* verkle: remove unused import\n\n* chore: update package lock\n\n* statemanageR: add verifyProof implementation to stateless verkle statemanager\n\n* verkle: add jsdoc for verkle verifyProof method\n\n* verkle: verkle proof test\n\n* verkle: add failing test case\n\n* client: add the ability to provide and use the parentStateRoot\n\n* Update verkle crypto dep\n\n* Activate invalid proof test\n\n* src: cleanup\n\n* Update packages/client/src/config.ts\n\n* vm: move up error check\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-05-17T06:13:09-04:00",
          "tree_id": "2622159a0e91aa4a6494af43d4841b2906227d73",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c95499c5b9bbdb4b36cc05f6785dd62e8a4d91a3"
        },
        "date": 1715940955501,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42541,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40127,
            "range": "±4.71%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40933,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39923,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38660,
            "range": "±2.09%",
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
          "id": "38c4a733e687cf1355b1081614f0dda1c6e4f8df",
          "message": "evm,vm: remove the hacks to prevent account cleanups of system contracts (#3418)\n\n* evm,vm: remove the hacks to prevent account cleanups of system contracts\r\n\r\n* lint\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-05-19T17:08:06+02:00",
          "tree_id": "0970ef93fc82a8908d1b16cda14f94fdc0d712c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/38c4a733e687cf1355b1081614f0dda1c6e4f8df"
        },
        "date": 1716131577468,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43108,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40258,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40907,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39912,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38856,
            "range": "±1.77%",
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
          "id": "1dceddf26d9c610a6a7ad787b1c654f42da9887d",
          "message": "fix tx status in TxResult (#3435)",
          "timestamp": "2024-05-21T22:59:36+03:00",
          "tree_id": "a3eeb38403c47bfd020da44250e7564757d64e3f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1dceddf26d9c610a6a7ad787b1c654f42da9887d"
        },
        "date": 1716321739120,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41183,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40564,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40006,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38214,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36533,
            "range": "±5.17%",
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
          "id": "ee8e02f7be14f4311c2a967d9b8d9dd3ffc72166",
          "message": "Add `eth_blobBaseFee` RPC endpoint (#3436)\n\n* Add blob base fee\r\n\r\n* client: remove unused variables in blobBaseFee test\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-05-22T11:30:54+02:00",
          "tree_id": "80b7823d87e8b1c0684a7c3e1c95941efc4f2ed5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ee8e02f7be14f4311c2a967d9b8d9dd3ffc72166"
        },
        "date": 1716370412273,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42640,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40427,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40567,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40072,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37888,
            "range": "±3.73%",
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
          "id": "f1d10d5ffebbc23a98ead531c2a0e24433dd0231",
          "message": "vm: updated 2935 tests with the new proposed bytecode and corresponding config (#3438)",
          "timestamp": "2024-05-27T09:10:53+02:00",
          "tree_id": "338509eb44dc5567e4a882f85357b672b4f47648",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f1d10d5ffebbc23a98ead531c2a0e24433dd0231"
        },
        "date": 1716794006868,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42109,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39425,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39796,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39288,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34998,
            "range": "±5.48%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "40609000+Dappsters@users.noreply.github.com",
            "name": "Dappsters",
            "username": "Dappsters"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1566a3030e634f1912e1ffb2cf25e8364fd01304",
          "message": "StateManager - `_getStorageTrie`: Fix Input Checking Logic (#3434)\n\n* StateManager - `_getStorageTrie`: Fixed input logic and added docs\r\n\r\n* Fix type narrowing by removing flag declaration\r\n\r\n* lint\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-05-28T07:36:19+02:00",
          "tree_id": "f5fe989fee77ad82ab8b59465fe7c49036330086",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1566a3030e634f1912e1ffb2cf25e8364fd01304"
        },
        "date": 1716874863646,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42132,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41842,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41414,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40346,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36888,
            "range": "±5.31%",
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
          "id": "e8297a5068b19b2adecec85143e1a529519af1fe",
          "message": "Add support for multiple sources of rlp blocks (#3442)",
          "timestamp": "2024-05-31T12:17:03-04:00",
          "tree_id": "838977011067d9aa23fbb89bcdf8c3a2aaed1c78",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8297a5068b19b2adecec85143e1a529519af1fe"
        },
        "date": 1717172375538,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42236,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39702,
            "range": "±3.63%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40549,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39283,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34973,
            "range": "±6.52%",
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
          "id": "3f9be25aada4be24591dfc71b43b7275c1c18cd1",
          "message": "verkle: Add tests for verkle bytes helper (#3441)\n\n* Add tests for verkle bytes helper\r\n\r\n* Optimize matchingBytesLength\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-10T08:59:47-04:00",
          "tree_id": "edcd841f139fa7ef7b4a677e556bdafd1722b42c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3f9be25aada4be24591dfc71b43b7275c1c18cd1"
        },
        "date": 1718024535469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42339,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40051,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41310,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40056,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38753,
            "range": "±1.99%",
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
          "id": "fe765522af97dcc72e9790f3c43e93a790d591ba",
          "message": "util,vm,evm: update the 2935 latest bytecode in test and fix address conversion issues  (#3447)\n\n* util,vm,evm: update the 2935 latest bytecode in test and fix address conversion issues\r\n\r\n* incorpodate feedback\r\n\r\n* add testvector and apply fix",
          "timestamp": "2024-06-12T14:54:40+02:00",
          "tree_id": "62bb5baf0e7545ae380ac92b4c2adce030a77a4d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fe765522af97dcc72e9790f3c43e93a790d591ba"
        },
        "date": 1718197032528,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42118,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40884,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40814,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40007,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36034,
            "range": "±5.82%",
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
          "id": "7debfafb9a3e576098a94fb876257aab58a5b92a",
          "message": "Experiment with internalizing QHeap dependency (#3451)\n\n* Internalize QHeap implementation\r\n\r\n* Move over to using lightly modified src of qheap dependency\r\n\r\n* Fix typings\r\n\r\n* Fix linting issues\r\n\r\n* Move qheap to ext folder\r\n\r\n* Add index file\r\n\r\n* Fix linting issues\r\n\r\n* Remove qheap dependency",
          "timestamp": "2024-06-14T09:04:31+02:00",
          "tree_id": "359da712dd8f5670bc89ac7d864e4d8096384354",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7debfafb9a3e576098a94fb876257aab58a5b92a"
        },
        "date": 1718348831224,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42113,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39186,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40124,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39330,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38096,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rafa.abadie@gmail.com",
            "name": "foufrix",
            "username": "foufrix"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "562867755be8dc02eff4adaaf95d36f8f772dfb8",
          "message": "Update MONOREPO.md with instruction fpr single file test watch (#3464)\n\n* Update MONOREPO.md with single file test watch\r\n\r\nAdd information on how to launch test & watch a single file during dev.\r\n\r\n* Add additional explanatory text\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-18T14:50:45-04:00",
          "tree_id": "23053874389f7fd43a4788849f0cecdcee87afeb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/562867755be8dc02eff4adaaf95d36f8f772dfb8"
        },
        "date": 1718736855797,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42153,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39993,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40340,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39443,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35141,
            "range": "±5.81%",
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
          "id": "0b19fc3ed9e3b1dc9fd7725974456980320c0dbe",
          "message": "EVM/VM: Update mcl-wasm Dependency (Esbuild Issue) (#3461)\n\n* EVM/VM: Bump mcl-wasm dependency from 1.4.0 to 1.5.0\r\n\r\n* Update package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-18T15:24:08-04:00",
          "tree_id": "997cd41b673021aa589526022466e4b59dd9c1ba",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b19fc3ed9e3b1dc9fd7725974456980320c0dbe"
        },
        "date": 1718738803052,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42462,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40126,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40851,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39775,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37948,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "c225537a488e6df308982260505ca5169a5b8a02",
          "message": "feat: Add bundle visualizer (#3463)\n\n* feat: Add bundle visualizer\r\n\r\n* Apply suggestion\r\n\r\n---------\r\n\r\nCo-authored-by: William Cory <williamcory@Williams-MacBook-Pro.local>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-18T22:25:11+02:00",
          "tree_id": "3f6a045608560aba6c819a8de445e69e37a67edd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c225537a488e6df308982260505ca5169a5b8a02"
        },
        "date": 1718742473875,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42018,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39844,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40613,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39879,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38476,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rafa.abadie@gmail.com",
            "name": "foufrix",
            "username": "foufrix"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b570ca19ed84cfb9e95be7a46f115bc4ec809915",
          "message": "internalization of jwt-simple (#3458)\n\n* migration of jwt-simple to /ext\r\n\r\n* add test jwt-simple test currently passing\r\n\r\n* solve linting for in\r\n\r\n* encode ok - decode nok\r\n\r\n* fix building issue\r\n\r\n* update licence ref\r\n\r\n* remove version property\r\n\r\n* update export to fit ES6 and add base case for encode/decode argument resulting to TS errors\r\n\r\n* Simplify API and use base64url from scure\r\n\r\n* update scure/base to latest version\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-19T11:41:17-04:00",
          "tree_id": "1d73f2dd8af98db61b207e2477fba38a011cc246",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b570ca19ed84cfb9e95be7a46f115bc4ec809915"
        },
        "date": 1718811837446,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41316,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40326,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40324,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39392,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35199,
            "range": "±6.61%",
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
          "id": "1acacb8183ceccd1601786e8c27b00e4b7dfb0a9",
          "message": "EVM/Monorepo: Verkle Decoupling (#3462)\n\n* EVM: Replace direct StatelessVerkleStateManager (SVSM) cast with verkle-extended interface usage\n\n* Add experimental AccessWitnessInterface to Common, use interface for AccessWitness implementation in StateManager\n\n* Use AccessWitnessInterface in EVM\n\n* Add verkle module to Util, replace EVM function calls, remove @ethereumjs/verkle dependency\n\n* Rebuild package-lock.json\n\n* Move VerkleCrypto type from verkle-cryptography-wasm to Util\n\n* Make verkleCrypto passing in mandatory in StatelessVerkleStateManager, remove async create constructor, move verkle-cryptography-wasm to dev dependenciew\n\n* Replace additional StatelessVerkleStateManager create() constructor instantiations, add verkle-cryptography-wasm to Client package.json\n\n* Rebuild package-lock.json\n\n* Move verkle helper functionality to Util verkle module, fully remove @ethereumjs/verkle usages\n\n* Update VerkleExecutionWitness, VerkleProof type imports moved to Util\n\n* Remove @ethereumjs/verkle dependency from VM\n\n* Rebuild package-lock.json\n\n* Additional import fix\n\n* Yet another fix\n\n* Merge remote-tracking branch 'origin/master' into verkle-statemanager-interface-and-evm-dependency-removal",
          "timestamp": "2024-06-19T13:19:24-04:00",
          "tree_id": "b3b486f34b2052b8b8cfa45bc686dca94af08d73",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1acacb8183ceccd1601786e8c27b00e4b7dfb0a9"
        },
        "date": 1718817726436,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41682,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40980,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40700,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37259,
            "range": "±5.76%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38839,
            "range": "±1.79%",
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
          "id": "cf2b21130aba1c0e20732c302f53b93351f775bc",
          "message": "monorepo: npm audit fix (#3466)",
          "timestamp": "2024-06-20T14:57:36-04:00",
          "tree_id": "0397875cad096e3221f0b75933c5ea7255f1fcfa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cf2b21130aba1c0e20732c302f53b93351f775bc"
        },
        "date": 1718910011803,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42104,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41517,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41151,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40060,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36070,
            "range": "±5.74%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "22612f292c69182064f554f04ff02e94035724f7",
          "message": "verkle: rename verkle utils and refactor (#3468)\n\n* verkle: rename verkle utils\n\n* verkle: rename helper functions and remove duplicate helper files\n\n* statemanager: rename import\n\n* util: remove todo\n\n* verkle: port over some tests to util",
          "timestamp": "2024-06-21T22:17:50-04:00",
          "tree_id": "83c21cf0a424a97eb1c4eef406a82849c506f488",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/22612f292c69182064f554f04ff02e94035724f7"
        },
        "date": 1719022823548,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42697,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41123,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41119,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39973,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36034,
            "range": "±5.74%",
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
          "id": "b49ff15281350494a1a66587e71e34f02eeca9ba",
          "message": "util: rename withdrawal request's  validatorPublicKey to validatorPubkey (#3474)",
          "timestamp": "2024-06-27T17:53:25+05:30",
          "tree_id": "ddf5ad1f6bf4acbf262f9190f0434ddb408449b3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b49ff15281350494a1a66587e71e34f02eeca9ba"
        },
        "date": 1719491166769,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41061,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40399,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40516,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39052,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34430,
            "range": "±6.94%",
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
          "id": "669925f3cd4a21f92cca5551996fe938b9e71f89",
          "message": "common: update eip 2935 as per latest devnet1 spec and add related eip 7709 (#3475)\n\n* common: update eip 2935 as per latest devnet1 spec and add related eip 7709\r\n\r\n* typo\r\n\r\n* fix 2935 test\r\n\r\n* fix casing typo\r\n\r\n* lint\r\n\r\n* apply feedback\r\n\r\n* empty\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-06-29T13:39:19+05:30",
          "tree_id": "af1327736a0efcfd26925bfa491d2445ebb3f253",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/669925f3cd4a21f92cca5551996fe938b9e71f89"
        },
        "date": 1719648708014,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41839,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41111,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40952,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38851,
            "range": "±4.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36255,
            "range": "±6.56%",
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
          "id": "e31a65bf458e21e06d6672debbe20d872ba91e04",
          "message": "util,block,client,evm,vm: add EIP 7251 el triggered consolidations request type (#3477)\n\n* util,block,client,vm: add EIP 7251 el triggered consolidations request type\r\n\r\n* add eip 7251 el triggered consolidations plumbing\r\n\r\n* accumulate the consolidations into requests from the 7251 system contract\r\n\r\n* add and debug the  newpayloadv4 spec with consolidation related fixes\r\n\r\n* apply feedback",
          "timestamp": "2024-06-29T17:47:06+05:30",
          "tree_id": "10a14d1fa86f4158179a0bce55509ed6f1c8faac",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e31a65bf458e21e06d6672debbe20d872ba91e04"
        },
        "date": 1719663592110,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42160,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40088,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40765,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39697,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35752,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      }
    ]
  }
}