window.BENCHMARK_DATA = {
  "lastUpdate": 1720726727955,
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
          "id": "2a774e5d8475f8617a466be4675bd36d78386de7",
          "message": "vm: remove backfill of block hashes on 2935 activation (#3478)",
          "timestamp": "2024-06-30T17:05:56+05:30",
          "tree_id": "a05e992021f397d4b290fae71d4bdf8d288859b6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2a774e5d8475f8617a466be4675bd36d78386de7"
        },
        "date": 1719747505366,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41429,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40541,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40440,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37016,
            "range": "±5.26%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38850,
            "range": "±1.83%",
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
          "id": "38f22effb5698214c910a95e84ebfc66cd2d746c",
          "message": "update tests to v14 (#3480)\n\n* update tests to v14\r\n\r\n* vm: setup test runner to look into legacytests for older forks\r\n\r\n* evm: implement eip 7610\r\n\r\n* vm: add skip test to skipped files",
          "timestamp": "2024-07-02T09:29:58+02:00",
          "tree_id": "2be14e0f83312f26aa6cc2032b7d6503e845637b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/38f22effb5698214c910a95e84ebfc66cd2d746c"
        },
        "date": 1719905558955,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42552,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39962,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41047,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39660,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38702,
            "range": "±1.83%",
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
          "id": "436bcc956d58c147da1b1afadb0d1efc11e824a5",
          "message": "VM: EVM Opts Chaining for better DevEx (#3481)\n\n* Basic integration in create() and shallowCopy()\r\n\r\n* Adopt VM shallowCopy(), add additional shallowCopy() related tests\r\n\r\n* option assignment optimization",
          "timestamp": "2024-07-02T13:51:53+02:00",
          "tree_id": "a959f7e6e9632477f3dbc8c9f626e310f4197c9b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/436bcc956d58c147da1b1afadb0d1efc11e824a5"
        },
        "date": 1719921401762,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38187,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37414,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37432,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 34443,
            "range": "±4.66%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36010,
            "range": "±1.73%",
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
          "id": "8d5bca0e2c4ab89124fac324aedbf48297d6d8d5",
          "message": "Implement EIP 7702 (#3470)\n\n* common/tx: implement EIP7702\n\n* tx: add 7702 cap and update authority checks\n\n* vm: add 7702 support\n\n* tx: add 7702 tests\n\n* client: fix build\n\n* evm: support 7702\n\n* vm: add basic 7702 test and fix decoding auth list\n\n* vm: add specific eip-161 test\n\n* Merge branch 'master' into eip7702\n\n* vm: bump 7702 test coverage with one passing test\n\n* vm: add more 7702 tests\n\n* vm: add extra 7702 tests\n\n* tx: address feedback\n\n* vm: address review\n\n* vm: add 7702 test to check for empty code (fails)\n\n* vm: fix 7702 empty code clearing\n\n* Merge branch 'master' into eip7702\n\n* Merge remote-tracking branch 'origin/master' into eip7702\n\n* Merge branch 'master' into eip7702\n\n* add 7702 type to tx factory constructors\n\n* add 7702 test to runBlock test\n\n* vm: comment 7702 test\n\n* vm: remove runBlock .only\n\n* tx: address reviews\n\n* tx: 7702 do not unpad address in authority list\n\n* vm: update eip7702 test",
          "timestamp": "2024-07-04T15:25:18-04:00",
          "tree_id": "e6e82f23b7d464bc3ff6c883252cb03f3f5f1e3b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8d5bca0e2c4ab89124fac324aedbf48297d6d8d5"
        },
        "date": 1720121477210,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37257,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36940,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36578,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 33826,
            "range": "±5.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35144,
            "range": "±1.75%",
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
          "id": "3171920e59f89263b5ad57906103d1e6a103ce9a",
          "message": "Fix statemanager empty code bug (#3483)\n\n* common/tx: implement EIP7702\r\n\r\n* tx: add 7702 cap and update authority checks\r\n\r\n* vm: add 7702 support\r\n\r\n* tx: add 7702 tests\r\n\r\n* client: fix build\r\n\r\n* evm: support 7702\r\n\r\n* vm: add basic 7702 test and fix decoding auth list\r\n\r\n* vm: add specific eip-161 test\r\n\r\n* vm: bump 7702 test coverage with one passing test\r\n\r\n* vm: add more 7702 tests\r\n\r\n* vm: add extra 7702 tests\r\n\r\n* tx: address feedback\r\n\r\n* vm: address review\r\n\r\n* vm: add 7702 test to check for empty code (fails)\r\n\r\n* vm: fix 7702 empty code clearing\r\n\r\n* add 7702 type to tx factory constructors\r\n\r\n* add 7702 test to runBlock test\r\n\r\n* vm: comment 7702 test\r\n\r\n* stateManager: fix bug by putting empty code on an existing account\r\n\r\n* vm: 7702: remove modifyAccountFields\r\n\r\n* vm: remove .only from runBlock test\r\n\r\n* vm: remove runBlock .only\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>",
          "timestamp": "2024-07-04T21:57:01+02:00",
          "tree_id": "584ae462b5c4524f702850c5a17c78a6d1e2b14c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3171920e59f89263b5ad57906103d1e6a103ce9a"
        },
        "date": 1720123292476,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37930,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37402,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37390,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 34869,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35835,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "e08c2298a1a33aa64ba6581ba3df6e5391febf00",
          "message": "EVM: Generic BLS Interface / Use JS Implementation (@noble/curves) as Default (#3471)\n\n* Add @noble/curves dependency to EVM\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Rename mcl specific util code file, prepare for more generic BLS util folder structure\r\n\r\n* Add mcl util file copy as noble to new bls12_381 util folder to serve as a work basis\r\n\r\n* Simplify folder structure\r\n\r\n* Adopt file imports\r\n\r\n* Start moving to a generically applicable bls interface with some shifted set of abstractions\r\n\r\n* Some modest Noble library switch\r\n\r\n* Move generic constants to own file\r\n\r\n* First @noble/curves integration test (not yet working)\r\n\r\n* Add generalized zero byte check util method\r\n\r\n* Add generalized gas check utility method\r\n\r\n* Add utility methods for equality and modulo length checks\r\n\r\n* Add msmGasUsed() utility functions for msm precompiles\r\n\r\n* Minor\r\n\r\n* Activate Noble usage for g1add precompile\r\n\r\n* Integrate G1 multiplication\r\n\r\n* Add addG2, first attempt on mapFPtoG1 (still failing)\r\n\r\n* Add more wrappings to the interface implementations, basic msmG1 and msmG2 implementations (0 values handling still failing)\r\n\r\n* Temporarily use fork from @noble/curves\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add mapping precompile implementations for Noble (G1 working)\r\n\r\n* Temporary typing fix for G2 mapping (not working yet)\r\n\r\n* Minor\r\n\r\n* Update @noble/curves to 5fcd71a\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add Noble mapFP2toG2() implementation\r\n\r\n* Move over MCL pairing code to interface implementation\r\n\r\n* Integrate Noble pairing implementation (some 0/infinity edge cases not yet working)\r\n\r\n* Add testing single-test-run instructions comment\r\n\r\n* Fix pairing 0/infinity cases\r\n\r\n* Some generalization refactor\r\n\r\n* More refactorings\r\n\r\n* Remove temporarily added mcl code form Noble implementation\r\n\r\n* Fix last local tests\r\n\r\n* Remove MCL instantiation from EVM, add bls EVM option, add MCL/Noble to EIP-2537 test runs\r\n\r\n* Move mcl-wasm depedency from production to dev dependencies in EVM package.json\r\n\r\n* Bump ethereum-cryptography from 2.1.3 -> 2.2.1, @noble/curves to 1.4.2\r\n\r\n* Remove explicit Noble instantiation in precompile files\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add optional init() method to the BLS interface, add init() for MCL setting some parameters\r\n\r\n* Add some util function code docs\r\n\r\n* Add mcl-wasm to client dependencies\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Integrate explicit MCL usage for BLS precompiles in the client via new VM evmOpts option\r\n\r\n* Some clean-up\r\n\r\n* Simplify, align and optimize infinity point checks in toG1/toG2 helper methods\r\n\r\n* Simplify Noble fromG1/fromG2 point methods\r\n\r\n* Simplify MCL fromG1/fromG2 methods\r\n\r\n* Move mcl-wasm depedency in VM from production to dev dependencies\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add simple --bls CLI option to VM state test runner\r\n\r\n* Modulo your way down on Fr field order check (instead of a simple substraction) -> Fixes VM state tests\r\n\r\n* Some clean-ups and docs\r\n\r\n* Rename BLS util zeroByteCheck -> leading16ZeroBytesCheck\r\n\r\n* Expand VM test runner --bls option to blockchain tests, use MCL as default\r\n\r\n* Some naming clean-up\r\n\r\n* evm: lint\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-07-05T15:46:31+02:00",
          "tree_id": "47b287460ea51f46b77bfadbafe3e3073ec792fb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e08c2298a1a33aa64ba6581ba3df6e5391febf00"
        },
        "date": 1720187484563,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38666,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36631,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37191,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36247,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422910",
            "value": 32481,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "c6ff99a31a872a0855d28c36f88fa6737dc60a82",
          "message": "Add `trie.del` (#3486)\n\n* add trie.del function and tests\r\n\r\n* lint\r\n\r\n* Add last put to test\r\n\r\n* test: adjust test case description\r\n\r\n* Allow zeroes to be written for non-existent leafnode\r\n\r\n* clean up utility methods\r\n\r\n* address feedback, lint\r\n\r\n* fixes\r\n\r\n* Update packages/verkle/test/verkle.spec.ts\r\n\r\n* return zeroes when leaf value is \"deleted\"\r\n\r\n* fix test\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-07-09T15:19:35-04:00",
          "tree_id": "bb9b7233a13c5739b9496b45a8af7525a14e1527",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c6ff99a31a872a0855d28c36f88fa6737dc60a82"
        },
        "date": 1720553049242,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38355,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36621,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37288,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36155,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35322,
            "range": "±1.76%",
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
          "id": "7ec47a30312252aea85b412b348740e8a9d2d824",
          "message": "Monorepo: Set \"type\": \"module\" in package.json files (default ESM internally) (#3494)\n\n* Do a simple test and see what happens (Util) (npm i works, test:node works, lint works, docs do not work (maybe unrelated), examples work)\r\n\r\n* Switch all other libraries over\r\n\r\n* Move view specialized debug functionality out of trie src since debug module causes too much problem in this intense usage setup (not ESM ready)\r\n\r\n* Trie import fixes\r\n\r\n* VM example file extension renaming\r\n\r\n* Fix VM examples\r\n\r\n* Import fix\r\n\r\n* Make the switch-over in tsconfig files\r\n\r\n* Fix some new lint failures\r\n\r\n* Bugfix (wrong import extension)\r\n\r\n* Import file extension fixes\r\n\r\n* Fix benchmarks\r\n\r\n* Fix various import issues\r\n\r\n* Remove duplicative node types and clean up references\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-07-11T21:12:36+02:00",
          "tree_id": "7d12ba04c5ffb86cc2fd590e3b80ef05cef451a8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7ec47a30312252aea85b412b348740e8a9d2d824"
        },
        "date": 1720725448145,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37577,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35617,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 35125,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35872,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34887,
            "range": "±1.86%",
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
          "id": "a075860c3c741ac7a3301e2e6bbad8d8fed8f041",
          "message": "Update main README Release Table after Breaking Release Work Start (#3492)\n\n* Update main README branch table and associated text\n\n* Add stats.html, bundle.js (from Vite) to .gitignore\n\n* Adopt EVM npm bundle:visualize command to not kill of the main dist directory, rename vite.config.ts -> vite.config.bundler.ts to not have this confused as our main toolchain setup configuration\n\n* Remove FUNDING.json\n\n* Fix linting\n\n* Merge branch 'master' into update-main-readme-branch-table",
          "timestamp": "2024-07-11T15:34:04-04:00",
          "tree_id": "3567fe3649f83099cf33a1f823a141870f145ddf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a075860c3c741ac7a3301e2e6bbad8d8fed8f041"
        },
        "date": 1720726727307,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38926,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36503,
            "range": "±4.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37504,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36811,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36138,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "90 samples"
          }
        ]
      }
    ]
  }
}