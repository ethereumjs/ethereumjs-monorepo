window.BENCHMARK_DATA = {
  "lastUpdate": 1701880842702,
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
          "id": "ce9ff228a280f352424b8593270ae0711d18ecec",
          "message": "handle an edge case in newpayload block execution (#3131)\n\n* handle an edge case in newpayload block execution\r\n\r\n* comment cleanup\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-11-01T10:27:50+01:00",
          "tree_id": "4cd48a091e408459e5ccfeb6e9b97f9b4e3676d4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ce9ff228a280f352424b8593270ae0711d18ecec"
        },
        "date": 1698831080254,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30756,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29797,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29809,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 29156,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24844,
            "range": "±10.03%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "ab4ba34e81fcc1e01b733fe37d2b657a67da5099",
          "message": "Minimal `rlpx` test suite (#3126)\n\n* Add rlpx tests and remove ts-ignore\r\n\r\n* Remove excess robot comments\r\n\r\n* Upload code coverage for devp2p\r\n\r\n* bump coverage\r\n\r\n* Update RLP coverage\r\n\r\n* update ci\r\n\r\n* use default coverage script\r\n\r\n* Update rlp test script\r\n\r\n* Revert non devp2p changes\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-11-01T11:45:32+01:00",
          "tree_id": "b50989b3e6d8817fec12d94f63ceba3aca87e868",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ab4ba34e81fcc1e01b733fe37d2b657a67da5099"
        },
        "date": 1698835722776,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40074,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38433,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38618,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35942,
            "range": "±4.26%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36867,
            "range": "±2.26%",
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
          "id": "c6d8b3998522612ea0f1a6c1c256fe5226c0fddf",
          "message": "New Minor Releases (Holesky, Dencun devnet-10, Client UX, Performance) (#3113)\n\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/rlp v5.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/util v9.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/common v4.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/genesis v0.2.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/trie v6.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/devp2p v6.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/tx v5.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/block v5.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/blockchain v7.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/statemanager v2.1.0)\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/ethash v3.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/wallet v2.0.1)\r\n\r\n* Add dedicated EVM profiling section to README\r\n\r\n* Add EVM profiler image\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/evm v2.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/vm v7.1.0)\r\n\r\n* Bump @ethereumjs/client version to v0.9.0, update CHANGELOG\r\n\r\n* Rebuild docs\r\n\r\n* README updates\r\n\r\n* Rebuild package-lock.json\r\n\r\n* evm: fix typo\r\n\r\n* blockchain: update changelog\r\n\r\n* Update packages/tx/CHANGELOG.md\r\n\r\n* Update packages/tx/CHANGELOG.md\r\n\r\n* Minor adjustements\r\n\r\n* Update packages/vm/CHANGELOG.md\r\n\r\n* VM: fix block profiler\r\n\r\n* Update CHANGELOG files with recent changes\r\n\r\n* Rebuild package-lock.json\r\n\r\n* verkle: update rlp and util to x.0.1\r\n\r\n* Update devnet-10 -> devnet-11 in CHANGELOG files\r\n\r\n---------\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-11-02T09:31:20+01:00",
          "tree_id": "d43f2135bb2fdf549977fb45c3d97798423eafbc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c6d8b3998522612ea0f1a6c1c256fe5226c0fddf"
        },
        "date": 1698914093784,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29888,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29444,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29117,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28905,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24795,
            "range": "±9.16%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "fbcffb83cffed3d7c46fe9f1934b50ba5f31dfe0",
          "message": "vm: add missing gasPrice param to readme example tx (#3135)",
          "timestamp": "2023-11-02T10:14:03-04:00",
          "tree_id": "77ff192997f9d2e557bcdc6fd2526ad59affe074",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fbcffb83cffed3d7c46fe9f1934b50ba5f31dfe0"
        },
        "date": 1698934699866,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30150,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29532,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29440,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 29009,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24578,
            "range": "±9.25%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "3a00a3241c00ed0e82ad27a6f014b78b38822fdd",
          "message": "common: fix readme eip links (#3136)\n\n* common: fix readme eip links\r\n\r\n* evm: fix eip links\r\n\r\n* evm: undo bad replacing\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-11-02T10:42:43-04:00",
          "tree_id": "327b9d9d291a4b3a103c1d7dcbcf2aa27911d7d3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3a00a3241c00ed0e82ad27a6f014b78b38822fdd"
        },
        "date": 1698936346576,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39970,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38773,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38294,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35862,
            "range": "±5.02%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36881,
            "range": "±2.14%",
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
          "id": "6d64162c847c7cd145202ad7c0af276a286138cc",
          "message": "client: Patch fcu skeleton blockfill process to avoid chain reset (#3137)",
          "timestamp": "2023-11-03T08:51:24-04:00",
          "tree_id": "83ae6c1e2b581bb8b6841b2ef5184f1278c010b3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6d64162c847c7cd145202ad7c0af276a286138cc"
        },
        "date": 1699016143699,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25592,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22559,
            "range": "±6.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23461,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23661,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22539,
            "range": "±3.50%",
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
          "id": "17234068dd115c60343510a176dd6f32e56d71c9",
          "message": "verkle: use rust-verkle-wasm from npm (#3141)\n\n* verkle: remove rust-verkle-wasm from local dir\r\n\r\n* verkle: add rust-verkle-wasm from npm and refactor\r\n\r\n* verkle: add some missing exports",
          "timestamp": "2023-11-05T12:01:17-07:00",
          "tree_id": "79e5e12d418e36d8dcefa9c4a1c0ab134c13e6cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/17234068dd115c60343510a176dd6f32e56d71c9"
        },
        "date": 1699211275913,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28684,
            "range": "±4.88%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28786,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28101,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27567,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22954,
            "range": "±10.84%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "49f3ccaeb11442f93e5e20ae0ee8e834397c5cd5",
          "message": "Client: fix rpc debug (#3125)\n\n* client: fix rpc debug\r\n\r\n* client/rpc: add verbosity filter\r\n\r\n* client: fix rpc test",
          "timestamp": "2023-11-05T15:40:24-07:00",
          "tree_id": "ad09314841b8c7c4a085d458e18aeea11f4d0973",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/49f3ccaeb11442f93e5e20ae0ee8e834397c5cd5"
        },
        "date": 1699224250010,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29399,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27099,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28030,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27565,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27289,
            "range": "±3.32%",
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
          "id": "76ed351cba0b1a70c5551ea2c30a712e637c1a0b",
          "message": "tsconfig: fix references (#3147)",
          "timestamp": "2023-11-07T10:54:33+01:00",
          "tree_id": "0c4bfe9eb62cf3dc9ab462d9a263da6845070bc3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/76ed351cba0b1a70c5551ea2c30a712e637c1a0b"
        },
        "date": 1699351046849,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40205,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39697,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38676,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36048,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37067,
            "range": "±2.15%",
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
          "id": "c545ba0f95bea2aa33cc08b2fce957b37dee95c7",
          "message": "client: add hive instructions (#3148)",
          "timestamp": "2023-11-07T10:56:05-05:00",
          "tree_id": "10acfc098cb4a9856016e5ea760910014a6cd393",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c545ba0f95bea2aa33cc08b2fce957b37dee95c7"
        },
        "date": 1699372797947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29379,
            "range": "±4.24%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28453,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25840,
            "range": "±7.31%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27783,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27006,
            "range": "±3.44%",
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
          "id": "a582c7e7f6ba3b3e2b99d5c99b8a9da1a03f43f5",
          "message": "vm/tests: cleanup access to private variables + types (#3149)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-11-07T10:23:19-07:00",
          "tree_id": "e6f3de7a40450a50452dc459135e41be544071fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a582c7e7f6ba3b3e2b99d5c99b8a9da1a03f43f5"
        },
        "date": 1699377998257,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39757,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39147,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38885,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36255,
            "range": "±3.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37099,
            "range": "±2.17%",
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
          "id": "82521c7219e6ad0dde088cea7eec3c1d1f394365",
          "message": "Finishes typing client opts (#3150)",
          "timestamp": "2023-11-07T22:18:39+01:00",
          "tree_id": "35ed4b4a192250a6b571f7f948269ca34ac7c1e5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/82521c7219e6ad0dde088cea7eec3c1d1f394365"
        },
        "date": 1699392094460,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40415,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39655,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38584,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36285,
            "range": "±4.84%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36935,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "0e0e2fbf9f323675555df93aca0f94af1b84ef97",
          "message": "vm: fix nested tests (#3151)",
          "timestamp": "2023-11-09T10:26:10+01:00",
          "tree_id": "e46fd6013aa84fb88ac220ae766d1ca0e6c80cac",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0e0e2fbf9f323675555df93aca0f94af1b84ef97"
        },
        "date": 1699522239041,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24674,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22400,
            "range": "±6.18%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23470,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22644,
            "range": "±3.89%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22585,
            "range": "±3.42%",
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
          "id": "0b03c8a858f7d77f3ccc1cf6ea95cb63489de5d7",
          "message": "util/wallet: fix more nested tests (#3152)",
          "timestamp": "2023-11-09T11:09:18+01:00",
          "tree_id": "5525e9dc00043f5966058008a21c4303a2c78181",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b03c8a858f7d77f3ccc1cf6ea95cb63489de5d7"
        },
        "date": 1699524735172,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40283,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39581,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38817,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36249,
            "range": "±4.00%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37436,
            "range": "±1.99%",
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
          "id": "5f0239583d05bb98655548ff1ee8c74ed360ad3a",
          "message": "Some Verkle Clean-Ups (#3154)\n\n* Renamed VerkleTrie -> VerkleTree\r\n\r\n* Rename verkleTrie.ts -> verkleTree.ts (+ references)\r\n\r\n* Change license from MPL -> MIT\r\n\r\n* Rename EMPTY_TRIE_ROOT -> EMPTY_TREE_ROOT\r\n\r\n* Small README example fix\r\n\r\n* Update packages/verkle/test/verkle.spec.ts\r\n\r\n* verkle: rename trie to tree\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-11-13T11:25:59+03:00",
          "tree_id": "7c2a6d3c0ca66440d78528edd950036cd4dcdb3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5f0239583d05bb98655548ff1ee8c74ed360ad3a"
        },
        "date": 1699864133301,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40028,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39571,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39090,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36286,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36774,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "3b257e9ad7b35ed729dbb07dff0c5ab3a90125c5",
          "message": "Return if txHashes is undefined (#3156)",
          "timestamp": "2023-11-13T04:44:55-07:00",
          "tree_id": "a5e151435102d45f7fb69e0e2255dc721ec78a7f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3b257e9ad7b35ed729dbb07dff0c5ab3a90125c5"
        },
        "date": 1699876121246,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28583,
            "range": "±5.23%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28373,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28215,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27727,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22680,
            "range": "±10.78%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "3fdd95e7a27d8b10331bc8e039c18a6acc94c071",
          "message": "Client/Blockchain: receipt reorg logic (#3146)",
          "timestamp": "2023-11-13T10:24:11-05:00",
          "tree_id": "18c37ab049a79a8f3d7464370a9f3467fdfccec4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3fdd95e7a27d8b10331bc8e039c18a6acc94c071"
        },
        "date": 1699889227882,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40177,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37988,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38404,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37781,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36883,
            "range": "±2.20%",
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
          "id": "c446d93cc54644ed7a6acca5b5b412fa5ab40429",
          "message": "verke: update verkle crypto helpers (#3155)",
          "timestamp": "2023-11-14T15:25:33+03:00",
          "tree_id": "6220651f8abe8c48c5890d6526df25f2bbca00f5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c446d93cc54644ed7a6acca5b5b412fa5ab40429"
        },
        "date": 1699964907971,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40413,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39629,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39560,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35902,
            "range": "±4.22%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37261,
            "range": "±2.04%",
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
          "id": "5a39e94b45b5dc2dda601ffd770ec119e59040ed",
          "message": "util: adjust byte bigint utils (#3159)",
          "timestamp": "2023-11-16T20:12:29+05:30",
          "tree_id": "d2a5244265be11ae3dfed118ba55c3c72f05a7fd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5a39e94b45b5dc2dda601ffd770ec119e59040ed"
        },
        "date": 1700146148947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40013,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38951,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38821,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35985,
            "range": "±5.01%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37168,
            "range": "±2.07%",
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
          "id": "8209e396a23be23ef06f2531609f12bfa8935502",
          "message": "Export originalStorageCache (#3161)",
          "timestamp": "2023-11-16T18:03:33-05:00",
          "tree_id": "2ea3a4cb1aff538c0001611a28d1b7bf6473578e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8209e396a23be23ef06f2531609f12bfa8935502"
        },
        "date": 1700175984690,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40769,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39516,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39447,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36821,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37603,
            "range": "±2.17%",
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
          "id": "e2803ab1ed90f7fbcfada059829011fc20da27e1",
          "message": "vm: update tests to v13 (cancun tests) (#3162)\n\n* vm: update tests to v13 (cancun tests)\r\n\r\n* fix ci file\r\n\r\n* vm/tx: update test runner + 4844 spec\r\n\r\n* block/tx: fix tests\r\n\r\n* client: fix tests\r\n\r\n* client: fix final test\r\n\r\n* vm: better error msg",
          "timestamp": "2023-11-17T22:39:31+03:00",
          "tree_id": "401b91ea8e0f0ed11308a043438bb5aa7043dd26",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e2803ab1ed90f7fbcfada059829011fc20da27e1"
        },
        "date": 1700250277726,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40240,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38887,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38777,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35689,
            "range": "±4.59%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36766,
            "range": "±2.18%",
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
          "id": "37425390a619c423bcd6f5621f733e7ec4cb4df5",
          "message": "fix: Check that code is not a precompile when checking code (#3158)\n\n* fix: Check that code is not a precompile when checking code\r\n\r\nI noticed a footgun that if your precompile takes no arguments the entire function will fail to recognize the code exists. This is because it checks code.length and code.length returns the number of arguments in the case of a function. Fix by checking if the code is a function\r\n\r\n* evm: lint\r\n\r\n* evm: add test\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-11-20T13:19:21+01:00",
          "tree_id": "7c8d3a7efa39f663892d8654f1fd5519497abdc0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/37425390a619c423bcd6f5621f733e7ec4cb4df5"
        },
        "date": 1700482953663,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40182,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39318,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39062,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36457,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36973,
            "range": "±2.32%",
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
          "id": "0170906f2880e01951bc56cc2c86fc263da21cc3",
          "message": "Mitigate boundprotocol insanities (#3164)\n\n* client/peer: remove bound property\r\n\r\n* client: better typesafety for peers\r\n\r\n* client: add TODO\r\n\r\n* client: move boundprotocol interface\r\n\r\n* client: remove addMethods boundProtocol\r\n\r\n* client: fix net tests\r\n\r\n* Update typing\r\n\r\n* Fix many tests\r\n\r\n* Revert typing changes\r\n\r\n* client: fix more integration tests\r\n\r\n* Remove unused params\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-11-23T22:46:47-05:00",
          "tree_id": "467813d4d35e1cfd2f5f8d77f9e3ecfe544749cc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0170906f2880e01951bc56cc2c86fc263da21cc3"
        },
        "date": 1700797786618,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39879,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38817,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38496,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36288,
            "range": "±4.68%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37074,
            "range": "±2.22%",
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
          "id": "c1852414b11bd87d48b1fa87794b6dab45e1ce2f",
          "message": "devp2p: add DEBUG everywhere, except util.ts (#3165)",
          "timestamp": "2023-11-27T11:49:18+01:00",
          "tree_id": "89f7e60f597c0ba95a851e035e9a49e4223fe6d5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1852414b11bd87d48b1fa87794b6dab45e1ce2f"
        },
        "date": 1701082332097,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40156,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39062,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38837,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36289,
            "range": "±4.33%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37180,
            "range": "±2.14%",
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
          "id": "9d756c2c842df2ff08b6cf84539ea3c40df3d6fa",
          "message": "Update `genesis` docs (#3166)",
          "timestamp": "2023-11-27T10:43:51-05:00",
          "tree_id": "34147c6367c9a17ef771cb5d1869620ccd7d366b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9d756c2c842df2ff08b6cf84539ea3c40df3d6fa"
        },
        "date": 1701100008414,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39999,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38705,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39102,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35552,
            "range": "±5.53%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36265,
            "range": "±2.33%",
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
          "id": "5d12ee640b1dd1d384a468792f131a9b5b760986",
          "message": "Add runCallOpts and runCodeOpts to exports (#3172)",
          "timestamp": "2023-11-30T11:03:09-05:00",
          "tree_id": "4602c448b8f0f90fc73dc36ee7f917c1277851e3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5d12ee640b1dd1d384a468792f131a9b5b760986"
        },
        "date": 1701360383317,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41091,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39618,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39150,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36763,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37493,
            "range": "±2.29%",
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
          "id": "019084dda72a729258f1e4b6e005dd05aa0430ab",
          "message": "Update `EthersStateManager` to be RpcStateManager under the hood (#3167)\n\n* Add ESMBlockchain\n\n* Add comment on test\n\n* Fix bytecode\n\n* Make RpcBlockChain class much better\n\n* Remove ethers from ESM\n\n* Fix mock provider and tests\n\n* update readme\n\n* stateManager: make rpcblockchain only have one param in constructor\n\n* Address feedback\n\n* stateManager: rename ethers -> rpc\n\n* Add test plugins for wasm\n\n* Cleanup rpcStateManager test and skip in browser\n\n* Remove obsolete function\n\n* Address feedback\n\n* address feedback\n\n* statemanager: update readme\n\n---------\n\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-11-30T14:14:30-05:00",
          "tree_id": "409ddb4863afd8f26b3404b29341e0bd687cb629",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/019084dda72a729258f1e4b6e005dd05aa0430ab"
        },
        "date": 1701371976390,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40124,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38964,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38824,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36080,
            "range": "±5.27%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37197,
            "range": "±2.14%",
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
          "id": "f9525af55b4c2068a003e8035184913c0adcd980",
          "message": "chore: Improve error handling of fetchFromProvider (#3171)\n\n* chore: Improve error handling of fetchFromProvider\r\n\r\n* test: Update mocks\r\n\r\n* fix: linter\r\n\r\n* test: Add test for fetchFromProvider\r\n\r\n* fix bug with not awaiting res.text()\r\n\r\n* test: Add a hapy path test\r\n\r\n---------\r\n\r\nCo-authored-by: Will Cory <willcory@Wills-MacBook-Pro.local>",
          "timestamp": "2023-12-02T20:48:28-05:00",
          "tree_id": "4bb203f94438a67b1538412199205284d6e76aff",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f9525af55b4c2068a003e8035184913c0adcd980"
        },
        "date": 1701568425690,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39356,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38730,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38540,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36037,
            "range": "±5.10%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36932,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "1bb7bc2db3c2177995ec48e788661510ebb2d819",
          "message": "monorepo: address dependabot vuln 66 (#3177)",
          "timestamp": "2023-12-05T21:37:03-05:00",
          "tree_id": "ada964254d121cba6b7e2d49f8d993e3dd3eacff",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bb7bc2db3c2177995ec48e788661510ebb2d819"
        },
        "date": 1701830896883,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41101,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38270,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39362,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38593,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37396,
            "range": "±2.25%",
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
          "id": "aac2bef7c6a9300bbfa4264b0cfdfd9603847a11",
          "message": "StateManager: stateless verkle state manager (#3139)\n\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-12-06T11:37:44-05:00",
          "tree_id": "133bad45e81442316ee1eb8c4eea59e31af55e5c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aac2bef7c6a9300bbfa4264b0cfdfd9603847a11"
        },
        "date": 1701880842015,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40301,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38298,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39163,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38090,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37028,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      }
    ]
  }
}