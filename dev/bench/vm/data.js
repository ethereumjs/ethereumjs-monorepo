window.BENCHMARK_DATA = {
  "lastUpdate": 1715703954338,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "a03ce4b53c33a8a07e7071fcc03bc367fb3dec4d",
          "message": "chore: Small cleanup to vm._emit (#3396)\n\n- Move it to an instance method. There shouldn't be any issues with it being an instance method since the underlying event emitter is still per object.\r\n- Make it more typesafe by taking keyof Events rather than string\r\n\r\nSyntax error\r\n\r\nfix broken build\r\n\r\nrun linter\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-05-07T13:30:22-04:00",
          "tree_id": "295a9b646fb4e1b4f6aa2704ef25520d5399a512",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a03ce4b53c33a8a07e7071fcc03bc367fb3dec4d"
        },
        "date": 1715103318640,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42382,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41517,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41709,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37830,
            "range": "±5.92%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39792,
            "range": "±1.64%",
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
          "id": "d24ca112502df9621e4084b1fce9ed54934e1ef0",
          "message": "util,block: rename deposit receipt to deposit request (#3408)",
          "timestamp": "2024-05-08T15:56:02+05:30",
          "tree_id": "22a87e80cb32db52418a420ef24b1dde27779d37",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d24ca112502df9621e4084b1fce9ed54934e1ef0"
        },
        "date": 1715164120524,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41913,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41225,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40623,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39971,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35899,
            "range": "±5.43%",
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
          "id": "c9aa40102529dd24ffcadad5036a85d40826fc66",
          "message": "client: fix the block to payload serialization and enhance v4 spec test with getpayload (#3409)",
          "timestamp": "2024-05-08T15:44:50+02:00",
          "tree_id": "98f28cd8b14b82088c6c34095ad32a9ff64f5b5f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c9aa40102529dd24ffcadad5036a85d40826fc66"
        },
        "date": 1715176054485,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41912,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41459,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40763,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39751,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35722,
            "range": "±6.61%",
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
          "id": "fe28071b8b69672d6318797062c536b23882d62e",
          "message": "client: fix the getpayloadv4 with a deposit tx and expected deposit requests (#3410)\n\n* client: fix the getpayloadv4 with a deposit tx and expected deposit requests\n\n* expected response\n\n* set the deposit contract to default mainnet address\n\n* debug and fix the request root generation and get the spec working",
          "timestamp": "2024-05-08T13:47:37-04:00",
          "tree_id": "5e67a082f16b370bba868af8f064b4fbdc741e6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fe28071b8b69672d6318797062c536b23882d62e"
        },
        "date": 1715190616548,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41505,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41544,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40833,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37604,
            "range": "±4.92%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38735,
            "range": "±1.79%",
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
          "id": "0e06ddf085be343853dfd3f42630fafb88f48ca1",
          "message": "Clean up access to deposit address in `common` (#3411)\n\n* add test for custom deposit address\n\n* Clean up deposit contract address access\n\n* Merge remote-tracking branch 'origin/master' into add-depositContractAddress-test\n\n* Merge remote-tracking branch 'origin/master' into add-depositContractAddress-test",
          "timestamp": "2024-05-08T14:13:19-04:00",
          "tree_id": "4a1b562c9686acc2f4bd4078574acb4d3bf57383",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0e06ddf085be343853dfd3f42630fafb88f48ca1"
        },
        "date": 1715192294838,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42194,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39737,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40624,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39908,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38806,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "3dd3bec3562b34c3dda08842f2c33f9635a71690",
          "message": "vm: fix the gathering of stateroot only after requests have been accumulated (#3413)",
          "timestamp": "2024-05-09T22:35:09+05:30",
          "tree_id": "11552511433451e218ce11593f12644f48b12a03",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3dd3bec3562b34c3dda08842f2c33f9635a71690"
        },
        "date": 1715274469567,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42124,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41598,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41494,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40412,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36038,
            "range": "±5.47%",
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
          "id": "ded3c6bc1cb589c04246c787cde7cf130f913441",
          "message": "Verkle checkpoint db tests (#3407)\n\n* Update db write stats on commits\r\n\r\n* Add unit tests for verkle checkpoint db implemenation\r\n\r\n* Fix linting issues\r\n\r\n* Update write stats in batch function of CheckpointDB implementations\r\n\r\n* Update trie and verkle CheckpointDB tests\r\n\r\n* Remove redundant stats update\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-05-09T15:47:53-04:00",
          "tree_id": "f5d0dc5a2492b36cbc265d97d51c8671bc20d39e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ded3c6bc1cb589c04246c787cde7cf130f913441"
        },
        "date": 1715284237515,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41902,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41260,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41107,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38094,
            "range": "±4.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38275,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
      }
    ]
  }
}