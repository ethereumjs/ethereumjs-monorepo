window.BENCHMARK_DATA = {
  "lastUpdate": 1665493134546,
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
          "id": "385f8aebaa55cc0c9f71a924532fd0895d654ead",
          "message": "Update upgrade guide to match recipe (#2274)\n\n* Update upgrade guide to match recipe\r\n\r\n* Update example\r\n\r\n* update util docs",
          "timestamp": "2022-09-07T18:22:58-04:00",
          "tree_id": "af1dea0bc29dd3d84910c2e1442d0bd383cf46f1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/385f8aebaa55cc0c9f71a924532fd0895d654ead"
        },
        "date": 1662589576793,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10170,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10191,
            "range": "±3.89%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10163,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9661,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9088,
            "range": "±6.75%",
            "unit": "ops/sec",
            "extra": "72 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "80117772+rodrigoherrerai@users.noreply.github.com",
            "name": "Rodrigo Herrera Itie",
            "username": "rodrigoherrerai"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "295deaa07ee8a45d7813e9f07971073652fafcb0",
          "message": "Remove extra computation (#2276)\n\n* Remove extra computation\r\n\r\nWe extend the Memory inside of the write function, so it is unnecessary to do it here.\r\n\r\n* Update functions.ts",
          "timestamp": "2022-09-11T16:05:32-04:00",
          "tree_id": "f79c116ceacb862d4cd20db88772d257f5dd9798",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/295deaa07ee8a45d7813e9f07971073652fafcb0"
        },
        "date": 1662926889977,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18681,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18115,
            "range": "±5.11%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18269,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16293,
            "range": "±9.42%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18932,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "59038614+ZLY201@users.noreply.github.com",
            "name": "Zilong Yao",
            "username": "ZLY201"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cfa99af6ad7d78920aa9e3433466e9592fdea4e4",
          "message": "perf: migrate rbtree to js-sdsl (#2285)\n\n* perf: migrate rbtree to js-sdsl\r\n\r\n* chore: remove functional red black tree\r\n\r\nCo-authored-by: yaozilong.msy <yaozilong.msy@bytedance.com>",
          "timestamp": "2022-09-15T10:57:44+02:00",
          "tree_id": "13cb622999af1fc2b2ad070e7ebd126ddab5552f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfa99af6ad7d78920aa9e3433466e9592fdea4e4"
        },
        "date": 1663232446114,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14595,
            "range": "±3.81%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14133,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13152,
            "range": "±8.32%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15840,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15090,
            "range": "±2.63%",
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
          "id": "6744d6b30d59b73d2b12e3a153bb5f7dde77bc2c",
          "message": "client: Fix Dockerfile build (#2288)",
          "timestamp": "2022-09-15T15:09:01+02:00",
          "tree_id": "af3e202da6a56e622aff7d1ad7093d4bff971cb0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6744d6b30d59b73d2b12e3a153bb5f7dde77bc2c"
        },
        "date": 1663247497194,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19301,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18663,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17793,
            "range": "±6.13%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19201,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18696,
            "range": "±1.57%",
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
          "id": "3f7594acfa907cbaa491917c223ca70b4c251bf6",
          "message": "block: remove unnecessary fields and adjust types (#2281)",
          "timestamp": "2022-09-15T14:43:03-04:00",
          "tree_id": "67930db1d6a04e452962b56e2df75d64d53d6bfe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3f7594acfa907cbaa491917c223ca70b4c251bf6"
        },
        "date": 1663267563066,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17942,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17720,
            "range": "±4.32%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16407,
            "range": "±7.03%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18533,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17578,
            "range": "±1.93%",
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
          "id": "0f57ec0f0e7e5e2371a80f9fc6972a018822c129",
          "message": "statemanager: remove eslint-disable from imports (#2289)",
          "timestamp": "2022-09-16T14:07:44+02:00",
          "tree_id": "4316ac110f67991fe261791a08f7c2b30ae6884b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0f57ec0f0e7e5e2371a80f9fc6972a018822c129"
        },
        "date": 1663330225889,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17938,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17880,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16558,
            "range": "±7.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18504,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17724,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "dacosta.pereirafabio@gmail.com",
            "name": "strykerin",
            "username": "strykerin"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "43dfe1ea604cbae74341ae931f80165b5506d955",
          "message": "fix link to old code example on evm package (#2291)",
          "timestamp": "2022-09-19T12:45:18+02:00",
          "tree_id": "33cdbfe3a212b81a9749639a6dbd0071e88bddc5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/43dfe1ea604cbae74341ae931f80165b5506d955"
        },
        "date": 1663584513951,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10581,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10350,
            "range": "±5.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10672,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10369,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9484,
            "range": "±8.96%",
            "unit": "ops/sec",
            "extra": "73 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "dacosta.pereirafabio@gmail.com",
            "name": "strykerin",
            "username": "strykerin"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "554aaefa71b35ad5dc55d39a36e3edeac6ee2af4",
          "message": "specify language on code blocks on README.md for devp2p (#2292)",
          "timestamp": "2022-09-19T10:27:38-04:00",
          "tree_id": "8b3ca29ee228ec2736774cabf332d550038ad20e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/554aaefa71b35ad5dc55d39a36e3edeac6ee2af4"
        },
        "date": 1663597819120,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19264,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18730,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17828,
            "range": "±6.71%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19233,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18557,
            "range": "±1.56%",
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
          "id": "3d7472c22038a12530bd04f38c242488dfdfe78d",
          "message": "client: Abstract out cl manager from the engine methods impl (#2293)\n\n* client: Abstract out cl manager from the engine methods impl\r\n\r\n* add comment about optional headBlock in fcU method",
          "timestamp": "2022-09-19T20:42:55+05:30",
          "tree_id": "36c9cac907da07f48b591569f94dde0914cb2051",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3d7472c22038a12530bd04f38c242488dfdfe78d"
        },
        "date": 1663600535175,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18085,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17390,
            "range": "±5.29%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16478,
            "range": "±7.07%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16989,
            "range": "±8.83%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17577,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "5ca079fa468fb55ec1227e7bcb33b3ae51da0fee",
          "message": "fix(trie): handle root key and value during pruned integrity verification (#2296)\n\n* fix(trie): handle root key and value during pruned integrity verification\r\n\r\n* Update packages/trie/test/trie/prune.spec.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Update packages/trie/src/trie/trie.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-09-20T15:42:27+02:00",
          "tree_id": "413428274a96bbb66519e17c07be9ea3b4fe46ae",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5ca079fa468fb55ec1227e7bcb33b3ae51da0fee"
        },
        "date": 1663681549376,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10424,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10067,
            "range": "±6.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10572,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10044,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9414,
            "range": "±8.58%",
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
          "id": "3712a1b4c0338a28c77df0f83d923fdb3cc311ba",
          "message": "common: Relocate geth genesis, state parsers to common, blockchain respectively (#2300)\n\n* common: Relocate geth genesis, state parsers to common, blockchain respectively\r\n\r\n* lint utils\r\n\r\n* relocate setForkHashes\r\n\r\n* update readme\r\n\r\n* use Common.fromGethGenesis wherever possible\r\n\r\n* relocate parseGethGenesis tests\r\n\r\n* remove unnecessary await\r\n\r\n* fix tests access across common and client\r\n\r\n* provide abs path\r\n\r\n* add test for parseGethGenesisState\r\n\r\n* add test cases for setcommon hashes and correct kiln genesis root\r\n\r\n* add stateroot match test\r\n\r\n* fix the storage trie to also use key hashing",
          "timestamp": "2022-09-22T13:05:13+02:00",
          "tree_id": "ca701d939d3d16990573e95791afba54401e6925",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3712a1b4c0338a28c77df0f83d923fdb3cc311ba"
        },
        "date": 1663844892832,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14861,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14277,
            "range": "±5.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14832,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13404,
            "range": "±8.82%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15151,
            "range": "±2.29%",
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
          "id": "34f3dcdf37d2fbeffeb41dc3de693f59b91c46bc",
          "message": "block: Fix from rpc methods (#2302)\n\n* block: Fix fromRpc type handling\r\n\r\n* Add tests with provider block data\r\n\r\n* Fix import\r\n\r\n* Update packages/block/src/from-rpc.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2022-09-22T20:06:23+05:30",
          "tree_id": "b2436c75267cb2254c2d3e45ed5c20b8aa512847",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/34f3dcdf37d2fbeffeb41dc3de693f59b91c46bc"
        },
        "date": 1663857825041,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9444,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9766,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9844,
            "range": "±3.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9658,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9315,
            "range": "±2.99%",
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
          "id": "be6449aa26fac92e3f8e620029105ffe3ad2c2cc",
          "message": "Various doc updates (#2305)",
          "timestamp": "2022-09-26T13:53:57+02:00",
          "tree_id": "97eb93cf0ae83aa649ad48677b180d5c3c07b7cc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/be6449aa26fac92e3f8e620029105ffe3ad2c2cc"
        },
        "date": 1664193400555,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18225,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17564,
            "range": "±5.26%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16641,
            "range": "±8.54%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18395,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17417,
            "range": "±1.90%",
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
          "id": "f6127f2e1e33b679aabf5dee3ea98cf650c91c3c",
          "message": "blockchain: Fix and enhance the blockchain iterator (#2308)",
          "timestamp": "2022-09-26T18:01:12+05:30",
          "tree_id": "f5890ed1c6560031804561b5e8694f41ddf570f9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f6127f2e1e33b679aabf5dee3ea98cf650c91c3c"
        },
        "date": 1664195630053,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19423,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18880,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17891,
            "range": "±6.42%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19249,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18564,
            "range": "±1.74%",
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
          "id": "8608602f3dadf4344a5a8dfa914d264d8268f05d",
          "message": "client: Reorg client build and usage docs (#2310)\n\n* client: Reorg client build and usage docs\r\n\r\n* add docker build test\r\n\r\n* fix heading\r\n\r\n* use main dockerfile\r\n\r\n* remove image history as it seems to connecting with dockerhub\r\n\r\n* remove push\r\n\r\n* remove layer log as it requires ethereumjs to be pushed to a registry",
          "timestamp": "2022-09-26T18:27:46+05:30",
          "tree_id": "461f0a111d78c38ce5cb5ba039c15318a12ae3cc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8608602f3dadf4344a5a8dfa914d264d8268f05d"
        },
        "date": 1664197665218,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10082,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9945,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9937,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9737,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9834,
            "range": "±3.34%",
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
          "id": "a44518df8d368e1ed3a02c594a605db083bc15b2",
          "message": "blockchain: remove duplicate _getBlock method (#2314)",
          "timestamp": "2022-09-26T22:24:54+05:30",
          "tree_id": "edfd83316cc3850b68e90d23d57cce8fff2080d0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a44518df8d368e1ed3a02c594a605db083bc15b2"
        },
        "date": 1664211496578,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9806,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9794,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9153,
            "range": "±4.97%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9300,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9811,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "9d885c9ba19fdf0a4db7b732dcb7446c1289bca1",
          "message": "chore(trie): make `@types/readable-stream` a prod dependency (#2318)",
          "timestamp": "2022-09-28T14:45:27+02:00",
          "tree_id": "51dd474992d979c129cd54b787e11e20c7b83fe8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9d885c9ba19fdf0a4db7b732dcb7446c1289bca1"
        },
        "date": 1664369291685,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18395,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17688,
            "range": "±5.44%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17074,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15658,
            "range": "±11.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18065,
            "range": "±1.96%",
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
          "id": "88bd15d8c1937226f1c0d3f737aff91aa6a4584c",
          "message": "common: use a default chain name  in fromGethGenesis if no chain name specified (#2319)\n\n* common: make chain name mandatory in fromGethGenesis\r\n\r\n* improve comment\r\n\r\n* change startegy to just pass name custom\r\n\r\n* undo comment",
          "timestamp": "2022-09-29T10:24:52+02:00",
          "tree_id": "87a8dc10fa3f320f6e503fc7280005969aad7e1e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/88bd15d8c1937226f1c0d3f737aff91aa6a4584c"
        },
        "date": 1664440053746,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18114,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17884,
            "range": "±4.49%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16561,
            "range": "±7.70%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18473,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17738,
            "range": "±2.03%",
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
          "id": "7fb9ad8f81f2c631510bc79c52d62396e98e7788",
          "message": "common: Refactor and update common.getHardforkByBlockNumber to address post merge hfs (#2313)\n\n* common: Refactor and update the hardfork cal to address post merge hfs\r\n\r\n* make strick check optional for post merge hardforks\r\n\r\n* add tests for post merge hardforks using sepolia\r\n\r\n* simplify getHardforkByBlockNumber\r\n\r\n* remove duplicate hf\r\n\r\n* clarify comment\r\n\r\n* add post merge hf\r\n\r\n* further simplify the fn and add test to enhance coverage\r\n\r\n* update comments\r\n\r\n* remove hash to add it as a separate pr to not pollute this one\r\n\r\n* fix typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* comment improvement\r\n\r\n* undo mainnet json changes\r\n\r\n* simplify dup ttd check\r\n\r\n* fix spec\r\n\r\n* fix typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve clarity\r\n\r\n* simpilfy futher based on acolytec3s logic\r\n\r\n* fix some more validations\r\n\r\n* remove extra if\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* move spec, add test for merge hf with block num\r\n\r\n* relocate test\r\n\r\n* relocate test\r\n\r\n* lint\r\n\r\n* add merge block numbers\r\n\r\n* add merge forkhash\r\n\r\n* handle no hardfork found case\r\n\r\n* Fix nits\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-09-29T20:31:12+05:30",
          "tree_id": "fe4097ca32972e2ab1e4f6d3fcd2bef2d60725d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7fb9ad8f81f2c631510bc79c52d62396e98e7788"
        },
        "date": 1664463830949,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18854,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18639,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17630,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19080,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18392,
            "range": "±1.61%",
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
          "id": "eb7332e03fadaa2ca5cf5e1a8da3544d598c301b",
          "message": "common: Add merge block numbers for merged networks and fix forkhash calc (#2324)",
          "timestamp": "2022-09-29T21:00:47+05:30",
          "tree_id": "0a7bc28aff3d7468d3b69095d49c43474315bc0f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eb7332e03fadaa2ca5cf5e1a8da3544d598c301b"
        },
        "date": 1664465711134,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9933,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9552,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9468,
            "range": "±5.04%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9150,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9418,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "samlior@foxmail.com",
            "name": "Samlior",
            "username": "samlior"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "32dcd8fd7170907013252743d39d56ef8c637847",
          "message": "vm: fix vm test (#2323)",
          "timestamp": "2022-09-30T13:17:16+02:00",
          "tree_id": "ed645c55d7ea0c9d39c0969e70617da6b718096a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/32dcd8fd7170907013252743d39d56ef8c637847"
        },
        "date": 1664536795799,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18375,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17887,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16829,
            "range": "±7.83%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18561,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17973,
            "range": "±1.88%",
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
          "id": "70c50776b0a5266d3ebac60dccf31e53bcce7f56",
          "message": "client: Add dockerfile for build from source (#2329)\n\n* client: Add dockerfile for build from source",
          "timestamp": "2022-10-05T10:29:33-04:00",
          "tree_id": "2b51885c8ddabb3def35583f188ba4c52ae3ffe3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/70c50776b0a5266d3ebac60dccf31e53bcce7f56"
        },
        "date": 1664980398616,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8933,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9132,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8811,
            "range": "±6.42%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8868,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9150,
            "range": "±2.69%",
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
          "id": "a7bb5ba8284894044bbb19f91f3804e901e6d2a0",
          "message": "common: Fix hardfork changes (#2331)\n\n* common: Fix hardfork changes\r\n\r\n* fix the spec hfs",
          "timestamp": "2022-10-06T11:27:56+02:00",
          "tree_id": "abee90fee7d51f42c93b816821300be728e81cc0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a7bb5ba8284894044bbb19f91f3804e901e6d2a0"
        },
        "date": 1665048984152,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19285,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18711,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17876,
            "range": "±6.08%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19344,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18478,
            "range": "±1.57%",
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
          "id": "1fbc0772a277a8a892d792f568e65f9e1ca9c4bd",
          "message": "TX: fix TX decoding when some values are actually arrays (#2284)\n\n* tx: fix decoding\r\n\r\n* Add tests for array inputs\r\n\r\n* Validate keys are valid tx data keys\r\n\r\n* tx: add more input value checks and fix the checker\r\n\r\n* Address feedback\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-06T11:11:59-04:00",
          "tree_id": "4d5bf07cbcc253d165e45f359d5063debe939774",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1fbc0772a277a8a892d792f568e65f9e1ca9c4bd"
        },
        "date": 1665069308045,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14243,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14665,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12901,
            "range": "±9.43%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14667,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13994,
            "range": "±3.68%",
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
          "id": "284d4c1f90aea655661722a0905c68b921c0d55b",
          "message": "client: Provide txPool.txsByPriceAndNonce with correct vm for fetching txs to build block (#2333)",
          "timestamp": "2022-10-07T00:07:47+05:30",
          "tree_id": "bf352672577095cccca22828f6fa0b5e57280f14",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/284d4c1f90aea655661722a0905c68b921c0d55b"
        },
        "date": 1665081660859,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9544,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9905,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9206,
            "range": "±4.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9886,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9473,
            "range": "±2.85%",
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
          "id": "52b71f378e1328bcd7f2d5754ebd7fbc839f2d61",
          "message": "tx: cleanup npm test scripts (#2335)\n\n* tx: cleanup npm test scripts",
          "timestamp": "2022-10-07T12:43:01-04:00",
          "tree_id": "c4efb29286472b4d037d0faffa6d2b2e838da885",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52b71f378e1328bcd7f2d5754ebd7fbc839f2d61"
        },
        "date": 1665161160655,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15715,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15405,
            "range": "±5.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15789,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14901,
            "range": "±9.17%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15932,
            "range": "±2.07%",
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
          "id": "5738e2762b260df279a26d924d12348ce8a9d3ce",
          "message": "Unifies test directory naming (#2339)\n\n* common: move tests to test\r\n\r\n* evm: move tests to test\r\n\r\n* statemanager: move tests to test\r\n\r\n* vm: move tests to test\r\n\r\n* Fix paths in package.json\r\n\r\n* Fix tsconfig references\r\n\r\n* Fix karma config\r\n\r\n* Update doc references",
          "timestamp": "2022-10-08T13:35:07+05:30",
          "tree_id": "7c522c3e50a0bb2feaf4bbf4594a2f0671676b62",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5738e2762b260df279a26d924d12348ce8a9d3ce"
        },
        "date": 1665216459125,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19391,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18831,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18196,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19432,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18747,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "113477227+ryptdec@users.noreply.github.com",
            "name": "Rypt Dec",
            "username": "ryptdec"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "eeca0cb1f534031cfd4a3c71866cd6d4c2475165",
          "message": "Fixing a typo in example3b.js and Readme.md for merkle_patricia_trees (#2340)\n\n* fix(trie): changing trie.root v4 => trie.root() >= v5\r\n\r\n* fix(trie): changing trie.root v4 => trie.root() >= v5\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2022-10-08T14:32:55-04:00",
          "tree_id": "88a21db0d4afb7e48181899e7f9ecb208ae999ca",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eeca0cb1f534031cfd4a3c71866cd6d4c2475165"
        },
        "date": 1665254389029,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18558,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17892,
            "range": "±5.22%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17223,
            "range": "±6.85%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17927,
            "range": "±6.99%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17776,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "12867336+HelloRickey@users.noreply.github.com",
            "name": "rickey",
            "username": "HelloRickey"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5821adda073be023c336a41954fe41e864732b2",
          "message": "Update README.md (#2342)\n\nUpdated link for Recursive Length Prefix",
          "timestamp": "2022-10-09T12:41:27-04:00",
          "tree_id": "eeda33b34fcf362a4d7d88dd526708713525c375",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5821adda073be023c336a41954fe41e864732b2"
        },
        "date": 1665333838400,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19301,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18802,
            "range": "±4.73%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17438,
            "range": "±7.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19395,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18745,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ndrozd@users.noreply.github.com",
            "name": "Nikita Drozd",
            "username": "ndrozd"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03587eb98ada83b51a402f06227e31b97450b23a",
          "message": "Added env check for debug mode + optimised the variable usage #1882 (#2311)\n\n* Added env check for debug mode + optimised the variable usage\r\n\r\nSolves DevP2P debug strings optimization #1882\r\n\r\n* Debug strings update (fixes for #2311)\r\n\r\n* fix examples\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-11T08:55:34-04:00",
          "tree_id": "8fd2db4bae39bf96fe1be59468484c6076255b00",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/03587eb98ada83b51a402f06227e31b97450b23a"
        },
        "date": 1665493133812,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18537,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17979,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16667,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18561,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17974,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      }
    ]
  }
}