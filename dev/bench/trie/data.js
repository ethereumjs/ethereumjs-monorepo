window.BENCHMARK_DATA = {
  "lastUpdate": 1659959289333,
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
          "id": "f805771c7cb5b57854f38885be2727918a45b183",
          "message": "Monorepo: only lint changed files (#2049)\n\n* only lint changed files on git push",
          "timestamp": "2022-07-20T11:30:27-04:00",
          "tree_id": "bc9d27e982d4ba7829ad203a5e45f945fbaf8996",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f805771c7cb5b57854f38885be2727918a45b183"
        },
        "date": 1658331958816,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22798,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 20285,
            "range": "±8.99%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 22640,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22171,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 29815,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 700,
            "range": "±8.40%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 99.63,
            "range": "±60.79%",
            "unit": "ops/sec",
            "extra": "45 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 77.91,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.13,
            "range": "±6.86%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "0bb7e21e8bc899d4424eadf4360aabcb6739d1ef",
          "message": "ci: add `workflow_dispatch` event trigger (#2060)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-20T12:24:03-04:00",
          "tree_id": "70e52c4570a25868f5c8b73e85ab417a3243f6e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0bb7e21e8bc899d4424eadf4360aabcb6739d1ef"
        },
        "date": 1658335440597,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 21923,
            "range": "±7.20%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22257,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21244,
            "range": "±7.15%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22757,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31710,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 671,
            "range": "±11.86%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 167,
            "range": "±7.46%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 61.29,
            "range": "±53.17%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.6,
            "range": "±18.69%",
            "unit": "ops/sec",
            "extra": "31 samples"
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
          "id": "d276fcc103533fdf7eec12b55f202efc74ceeea4",
          "message": "CI: ensure all hardforks and transitions run when there is a \"test all hardforks\" label on PR (#1901)\n\n* vm/tests: update CI\r\n* block: semi-address Berlin->London transition bug\r\n* vm: add test for transitionTests\r\n* ci: update runnerrs\r\n* common: fix test\r\n* vm: update test count\r\n* ci: add london",
          "timestamp": "2022-07-21T09:11:19-04:00",
          "tree_id": "2d1ddab2073a7f74b45aa72d2a55d43f4ca1e4c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d276fcc103533fdf7eec12b55f202efc74ceeea4"
        },
        "date": 1658409310008,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23124,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21522,
            "range": "±6.87%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23023,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22425,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31679,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 808,
            "range": "±4.89%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 120,
            "range": "±43.49%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 82.53,
            "range": "±5.12%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.41,
            "range": "±64.78%",
            "unit": "ops/sec",
            "extra": "24 samples"
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
          "id": "3ccd1b4ddcb1e7ab7d6846a2c0d86d063577115f",
          "message": "fix(trie): pass down `hash` function for hashing on trie copies (#2068)",
          "timestamp": "2022-07-22T22:21:45-04:00",
          "tree_id": "d30b204f3cf9d52727b907f4e4232a1df1baf3a1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ccd1b4ddcb1e7ab7d6846a2c0d86d063577115f"
        },
        "date": 1658543367259,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22211,
            "range": "±7.01%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21981,
            "range": "±6.53%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23364,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 21754,
            "range": "±7.93%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26218,
            "range": "±12.00%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 816,
            "range": "±6.28%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 163,
            "range": "±10.38%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 83.32,
            "range": "±9.28%",
            "unit": "ops/sec",
            "extra": "45 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.05,
            "range": "±25.25%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "f5c313c74a7be329dc38b1e22bfe6bb0c0f98769",
          "message": "Update ethereum tests v11 (#2052)\n\n* ethereum-tests: update to v11\r\n\r\n* block: point gray glacier tests to ethereum-tests and delete local reference\r\n\r\n* Update .gitmodules\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-23T18:53:47-04:00",
          "tree_id": "4af97ef5a51155972db2e9b8cae479f0654e924c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5c313c74a7be329dc38b1e22bfe6bb0c0f98769"
        },
        "date": 1658617041545,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22917,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21488,
            "range": "±7.67%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21544,
            "range": "±11.54%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22321,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 29765,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 773,
            "range": "±6.73%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 121,
            "range": "±44.71%",
            "unit": "ops/sec",
            "extra": "52 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 82.05,
            "range": "±5.37%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.21,
            "range": "±61.23%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "c55b3919a3963603ddac30b8aa79fbb19870467b",
          "message": "blockchain: add documentation for custom consensus (#2057)",
          "timestamp": "2022-07-24T17:30:54+02:00",
          "tree_id": "a25133797594e33ec9acc073b22b967d3ca67841",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c55b3919a3963603ddac30b8aa79fbb19870467b"
        },
        "date": 1658677412606,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22996,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21868,
            "range": "±4.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23512,
            "range": "±5.42%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23661,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 30374,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 742,
            "range": "±7.79%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 111,
            "range": "±53.36%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 79.04,
            "range": "±5.89%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.14,
            "range": "±29.15%",
            "unit": "ops/sec",
            "extra": "28 samples"
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
          "id": "c1a319fe92035ddf950278e89bf224005192682f",
          "message": "client: Make beacon sync more robust (#1968)\n\n* Make beacon sync more robust\r\n\r\n* fix skeleton spec with the backstep usage\r\n\r\n* skeleton spec add for backstep\r\n\r\n* fix the validations\r\n\r\n* fix multiple skeleton and execution issues\r\n\r\n* beacon spec fixes\r\n\r\n* some logging improvs\r\n\r\n* fix fetcher spec\r\n\r\n* fix reverse fetcher\r\n\r\n* fix response when nothing to fetch\r\n\r\n* fix beaconsync spec\r\n\r\n* Update packages/client/lib/sync/skeleton.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix randon curly brace in log\r\n\r\n* do not start fetcher when no skeleton to sync\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-25T11:28:32-04:00",
          "tree_id": "af7cf18ea70381f17191d39023661010a83418f7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1a319fe92035ddf950278e89bf224005192682f"
        },
        "date": 1658763128022,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22891,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21867,
            "range": "±6.47%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 22786,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22731,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31087,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 834,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 125,
            "range": "±42.21%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.13,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.42,
            "range": "±64.44%",
            "unit": "ops/sec",
            "extra": "23 samples"
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
          "id": "b7436b27d7d65993bb671121cdcd6936ca44f80d",
          "message": "Move @types/async-eventemitter from devDependencis to dependencies (#2077)\n\n* evm: move packages to dependencies\r\n\r\n* vm: move package from devDependencies to dependencies",
          "timestamp": "2022-07-26T21:24:46+02:00",
          "tree_id": "1f963df497d46647746ea1ac0eb9283ddf87f852",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b7436b27d7d65993bb671121cdcd6936ca44f80d"
        },
        "date": 1658863872255,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23207,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23063,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21770,
            "range": "±7.71%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23471,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32937,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 1031,
            "range": "±4.87%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 158,
            "range": "±41.50%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 108,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 20.03,
            "range": "±12.39%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "98c44a8eaba3b89c5b479cc542358398057f2ef2",
          "message": "common: Change td(total difficulty) config to be of bigint (#2075)\n\n* common: Change td(total difficulty) config to be of bigint\r\n\r\n* simplify hardfork ts type\r\n\r\n* fix test data\r\n\r\n* fix vm tests\r\n\r\n* fix merge spec\r\n\r\n* rename td to ttd wherever appropriate\r\n\r\n* missing td to ttd conversions\r\n\r\n* fix merge spec",
          "timestamp": "2022-07-27T19:08:10+05:30",
          "tree_id": "4466ffd5ff3c421454810fc09a736efdbbab4191",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/98c44a8eaba3b89c5b479cc542358398057f2ef2"
        },
        "date": 1658929286077,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23367,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21998,
            "range": "±5.86%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 22971,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22948,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31959,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 826,
            "range": "±35.19%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 197,
            "range": "±8.70%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 105,
            "range": "±4.15%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.02,
            "range": "±74.47%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "03ada864eae71882f344e28c7a000bdef27065d4",
          "message": "common: Set goerli merge ttd to 10790000 (#2079)",
          "timestamp": "2022-07-27T19:33:23+05:30",
          "tree_id": "04d823d44929234e23c16369829e13da9a21554b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/03ada864eae71882f344e28c7a000bdef27065d4"
        },
        "date": 1658930801422,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23652,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22096,
            "range": "±7.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23319,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22885,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31665,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 917,
            "range": "±5.31%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 148,
            "range": "±39.95%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 94.65,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.61,
            "range": "±62.36%",
            "unit": "ops/sec",
            "extra": "28 samples"
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
          "id": "a5273af40974ab66066c69c3fabbb7d9bd954c16",
          "message": "feat(trie): implement root hash persistence (#2071)\n\n* feat(trie): implement root hash persistence\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-28T10:13:39-04:00",
          "tree_id": "ccf2c5c94f694337cbc7875e31643811af117d16",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a5273af40974ab66066c69c3fabbb7d9bd954c16"
        },
        "date": 1659017833122,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23536,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22092,
            "range": "±5.64%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23227,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22914,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32185,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 834,
            "range": "±34.92%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 201,
            "range": "±8.95%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 104,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.46,
            "range": "±18.26%",
            "unit": "ops/sec",
            "extra": "39 samples"
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
          "id": "dbc3ba8b7025e13de0a03415ff992d22b16e6875",
          "message": "block: Set hardforkbyblocknumber true on rlp block constructor (#2081)\n\n* Set hardforkbyblocknumber true on rlp block constructor\n\n* check for hardforkByTTD\n\n* Add coverage test",
          "timestamp": "2022-07-29T06:41:44-04:00",
          "tree_id": "4a756ac702cd4a22c3ecce5fd7778646ee4726c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dbc3ba8b7025e13de0a03415ff992d22b16e6875"
        },
        "date": 1659091492743,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23158,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21551,
            "range": "±6.94%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23081,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22788,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31721,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 806,
            "range": "±36.25%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 199,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.24,
            "range": "±15.50%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.58,
            "range": "±7.28%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "e6e9d2f4162bce1a3af1b0c9f4b22107a8fa7d90",
          "message": "Merge tests (#2064)\n\n* vm: add merge tests\r\n\r\n* vm/ci: fix test runner for Merge\r\n\r\n* vm: fix merge state tests\r\n\r\n* stash changes\r\n\r\n* vm/blockchain: fix PoS transition\r\n\r\n* vm: unstash changes\r\n\r\n* vm: fix state tests\r\n\r\n* blockchain: fix tests\r\n\r\n* ci: revert changes\r\n\r\n* vm: fix state tests\r\n\r\n* ci: update to required\r\n\r\n* ci: fix\r\n\r\n* blockchain: remove set common hf in block on update\r\n\r\n* blockchain: revert changes\r\n\r\n* vm: revert changes, update test runner\r\n\r\n* fix merge block ttd\r\n\r\n* fix the hardforkByTTD arg in runner\r\n\r\n* remove console.log\r\n\r\n* reverting checkAndTransitionHardForkByNumber args in customConsensus\r\n\r\n* lint\r\n\r\n* Remove console.log\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-29T18:42:15+05:30",
          "tree_id": "faadd3d006a94385122fb51739bdd68d5d370f0f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6e9d2f4162bce1a3af1b0c9f4b22107a8fa7d90"
        },
        "date": 1659100548760,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18691,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19031,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17187,
            "range": "±8.00%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 18678,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 25711,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 752,
            "range": "±7.72%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 129,
            "range": "±39.96%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 75.5,
            "range": "±10.68%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.47,
            "range": "±31.90%",
            "unit": "ops/sec",
            "extra": "27 samples"
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
          "id": "dd6302a6a40a5aff3b689a16c9ec25a5ff916fd0",
          "message": "EVM/VM fixes (#2078)\n\n* reuse eei from evm when evm opt provided\r\n\r\n* Make vm evm property interface or class\r\n\r\n* fix EEI export\r\n\r\n* Add tests for eei sameness",
          "timestamp": "2022-07-29T09:31:32-04:00",
          "tree_id": "5ad722db12a413b9f5c36fade7b0abb42c0c6f41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dd6302a6a40a5aff3b689a16c9ec25a5ff916fd0"
        },
        "date": 1659101745278,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 19423,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19395,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17722,
            "range": "±8.86%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 19107,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26493,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 800,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 114,
            "range": "±49.46%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.35,
            "range": "±5.48%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.99,
            "range": "±26.27%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "049c2a5159c44019910c932222d37e2435e1da9e",
          "message": "evm: add new exports requested by hardhat (#2063)\n\n* evm: add new exports requested by hardhat\r\n\r\n* vm: update typedoc\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-29T10:00:02-04:00",
          "tree_id": "f651de6c18c8ab29127ec647ad221b4327d77df5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/049c2a5159c44019910c932222d37e2435e1da9e"
        },
        "date": 1659103397102,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23449,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21696,
            "range": "±7.93%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23168,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23078,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31633,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 954,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 148,
            "range": "±42.03%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.08,
            "range": "±19.15%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.77,
            "range": "±35.97%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "0b166bef0ff863d918e9f1e2a32e996edeb61d09",
          "message": "Optimize the github workflow checkouts (#2082)\n\n* Optimize the github workflow checkouts\r\n\r\n* revert recursive checkout as block and tx use eth tests\r\n\r\n* revert recursive checkout for vm state tests as they use eth tests\r\n\r\n* revert recursive vm blockchain tests as they use eth tests\r\n\r\n* revert recursive for vm covergae tests it has state tests which uses eth tests\r\n\r\n* move recurive from vm build to vm pr\r\n\r\n* enable recursive for vm build workflow for coverage state and blockchain tests\r\n\r\n* add recusive checkout in vm nightly slow tests",
          "timestamp": "2022-07-30T17:44:02+05:30",
          "tree_id": "a93a2273b961a4fdcc151e15cbff24185eda4b98",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b166bef0ff863d918e9f1e2a32e996edeb61d09"
        },
        "date": 1659183384868,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24116,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23499,
            "range": "±7.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23905,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23592,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32760,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 721,
            "range": "±43.04%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±9.81%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.93,
            "range": "±19.43%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.9,
            "range": "±57.94%",
            "unit": "ops/sec",
            "extra": "37 samples"
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
          "id": "2f9f3ea5e00fe05620e282a7fcef99593eeea027",
          "message": "client: allow eth_call without to for testing contract creation (#2084)",
          "timestamp": "2022-07-31T21:44:04+05:30",
          "tree_id": "f5940296e3c2b081784893c7123d34ac0690aa97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2f9f3ea5e00fe05620e282a7fcef99593eeea027"
        },
        "date": 1659284190967,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24014,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22248,
            "range": "±7.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 24106,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23801,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32859,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 757,
            "range": "±46.66%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 201,
            "range": "±8.85%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.04,
            "range": "±18.04%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.83,
            "range": "±11.86%",
            "unit": "ops/sec",
            "extra": "39 samples"
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
          "id": "6967774f40777d0438e8308caa5b9e3e7393f277",
          "message": "common: set the default hard fork to merge (#2087)\n\n* common: set the default hard fork to merge\r\n\r\n* Set hardfork to london in merge test\r\n\r\n* fix hardfork in miner integration test\r\n\r\n* update default in docs\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-01T23:50:25+05:30",
          "tree_id": "6109a591b9484fbe2344573e9640605b83b19374",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6967774f40777d0438e8308caa5b9e3e7393f277"
        },
        "date": 1659378169472,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23495,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21960,
            "range": "±7.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23533,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23141,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31815,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 766,
            "range": "±40.72%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 195,
            "range": "±10.44%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 93.08,
            "range": "±17.05%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.79,
            "range": "±58.28%",
            "unit": "ops/sec",
            "extra": "37 samples"
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
          "id": "afead41142ceb458a7f1377ff2a0228860cb274b",
          "message": "chore: set up `eslint-plugin-simple-import-sort` and `eslint-plugin-import` (#2086)",
          "timestamp": "2022-08-03T11:37:44+02:00",
          "tree_id": "3d2f0651bcfb434259bcad0e215dbd0c605f0139",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/afead41142ceb458a7f1377ff2a0228860cb274b"
        },
        "date": 1659519633242,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23337,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21967,
            "range": "±7.05%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23050,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23022,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31722,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 814,
            "range": "±35.97%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 203,
            "range": "±8.63%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 97.27,
            "range": "±14.91%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 20.11,
            "range": "±8.18%",
            "unit": "ops/sec",
            "extra": "39 samples"
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
          "id": "674b6e032444dfb724aff461a888335994ad1f62",
          "message": "chore: wip (#2093)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-03T13:28:07+02:00",
          "tree_id": "6de10e713fb7eb08b037273b5ca1e55bf1c942cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/674b6e032444dfb724aff461a888335994ad1f62"
        },
        "date": 1659526723894,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22265,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21946,
            "range": "±6.98%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23114,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 20091,
            "range": "±8.74%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 30907,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 911,
            "range": "±6.46%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 149,
            "range": "±28.12%",
            "unit": "ops/sec",
            "extra": "47 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 94.9,
            "range": "±5.39%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.59,
            "range": "±28.27%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "5dc46fec979d46ff497d7f2db32135c78f62f451",
          "message": "client: Run execution in batches when not near head (#2096)\n\n* client: Run execution in batches when not near head\r\n\r\n* relax batching condition a bit\r\n\r\n* match the sync target height update text\r\n\r\n* relax batch condition for full sync",
          "timestamp": "2022-08-03T22:41:43+05:30",
          "tree_id": "1ccadb3dfd8e4d2376ad0ac5b5f73043f9ac3677",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5dc46fec979d46ff497d7f2db32135c78f62f451"
        },
        "date": 1659546853013,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23654,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21876,
            "range": "±7.07%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23195,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23200,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31817,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 858,
            "range": "±17.85%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 182,
            "range": "±11.00%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.51,
            "range": "±20.10%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.41,
            "range": "±77.99%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "1d1c4e97dfdfc7a6a7fd629cbfb6a3ed85c6774e",
          "message": "common: Update the mergeForkIdTransition hardfork schedule (#2098)",
          "timestamp": "2022-08-03T18:34:18-04:00",
          "tree_id": "d07b4e789dffb5be7f0ce04e7b092a128c2a3752",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1d1c4e97dfdfc7a6a7fd629cbfb6a3ed85c6774e"
        },
        "date": 1659566229264,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18734,
            "range": "±3.66%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19771,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17602,
            "range": "±9.22%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 19381,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26107,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 818,
            "range": "±7.04%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 146,
            "range": "±14.53%",
            "unit": "ops/sec",
            "extra": "45 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.35,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.23,
            "range": "±28.37%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "c7a8bec13d9a4d6dbb09bbf00775e679aca7a2b7",
          "message": "test(trie): run persistence suite for all types of tries (#2094)\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-03T21:23:56-04:00",
          "tree_id": "a35cff49bb3cf89587f1ddeaf146cd4f52b48579",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c7a8bec13d9a4d6dbb09bbf00775e679aca7a2b7"
        },
        "date": 1659576379504,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23535,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22324,
            "range": "±5.21%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23454,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23221,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32431,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 860,
            "range": "±29.30%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 205,
            "range": "±8.22%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 77.89,
            "range": "±43.56%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.48,
            "range": "±15.02%",
            "unit": "ops/sec",
            "extra": "40 samples"
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
          "id": "79163c0244dc87d3d207de89f0f3f04d07471ac3",
          "message": "chore: rename `rlp` package to `@ethereumjs/rlp` (#2092)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-04T10:30:25+02:00",
          "tree_id": "116d487cccdf42a67d991d850afbaaa55c355f88",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79163c0244dc87d3d207de89f0f3f04d07471ac3"
        },
        "date": 1659601996008,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23438,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21515,
            "range": "±8.16%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23454,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23153,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31793,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 752,
            "range": "±42.41%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 186,
            "range": "±9.71%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.35,
            "range": "±17.46%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.55,
            "range": "±60.35%",
            "unit": "ops/sec",
            "extra": "36 samples"
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
          "id": "623d8a0e4be6e5968314cb64cf305f96cf6ba873",
          "message": "chore: upgrade `eslint` to `^8.0.0` (#2095)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update .eslintrc.js\r\n\r\n* Update README.md\r\n\r\n* Update README.md",
          "timestamp": "2022-08-04T11:55:54+02:00",
          "tree_id": "557db3e86e97c71bab427634379e54853104dea5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/623d8a0e4be6e5968314cb64cf305f96cf6ba873"
        },
        "date": 1659607128314,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 21979,
            "range": "±4.16%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21821,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21336,
            "range": "±8.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 21190,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 30229,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 933,
            "range": "±6.05%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 181,
            "range": "±13.73%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 103,
            "range": "±5.01%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.78,
            "range": "±29.48%",
            "unit": "ops/sec",
            "extra": "28 samples"
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
          "id": "80b08796399e39409d3e1901af8e7d58ffb95c2f",
          "message": "client: Add client protocol and synchronizer for snap sync (#1897)\n\n* a small add for client\r\n\r\n* don't offer snap yet, try only consuming from other peers\r\n\r\n* Add snap protocol/methods availability in the peer\r\n\r\n* Snap sync syncronizer stub\r\n\r\n* client: send empty list in case of non-existing headers\r\n\r\n* setup snap sender to make request\r\n\r\n* devp2p: fix ETH66 length\r\n\r\n* devp2p: update eth65/eth64 protocol length\r\n\r\n* client/snapsync: fix GetAccountRange encoding\r\n\r\n* decode account range response\r\n\r\n* Add other methods of snapsync\r\n\r\n* rebase fixes for new master\r\n\r\n* enable running snapsync with a forceSnapSync flag\r\n\r\n* fix fullethereumservice spec\r\n\r\n* fix rlpxpeer spec\r\n\r\n* compare directly to undefined\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* incorporate some review suggestions\r\n\r\n* compare directly to undefined\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix snap availability conditional\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-05T01:35:17+05:30",
          "tree_id": "b6fccdea54716bde8fed3f3fdb5577876a88d27d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/80b08796399e39409d3e1901af8e7d58ffb95c2f"
        },
        "date": 1659643661793,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23049,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21217,
            "range": "±8.86%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23152,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22809,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 30965,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 911,
            "range": "±7.15%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 151,
            "range": "±24.66%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.9,
            "range": "±5.35%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 9.55,
            "range": "±78.11%",
            "unit": "ops/sec",
            "extra": "21 samples"
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
          "id": "291d698abed15ce7a2bfade97e768d00a70ed0fc",
          "message": "ci: retry `test-client` and `test-client-cli` jobs up to 3 times (#2104)\n\n* ci: retry `test-client-cli` job up to 3 times\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-05T05:46:29-04:00",
          "tree_id": "4937b0a268d394d7386aa23791590c2cedee1bd6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/291d698abed15ce7a2bfade97e768d00a70ed0fc"
        },
        "date": 1659692947061,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22793,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21905,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21168,
            "range": "±8.33%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22475,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 30276,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 827,
            "range": "±8.28%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 112,
            "range": "±53.19%",
            "unit": "ops/sec",
            "extra": "46 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.99,
            "range": "±6.51%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.58,
            "range": "±34.19%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "29493bced079f1cd57eac2562566aebebfb6cc9c",
          "message": "vm/blockchain: change and use BlockchainInterface (#2069)\n\n* vm/blockchain: change and use BlockchainInterface\r\n\r\n* vm: throw if header cannot be validated\r\n\r\n* blockchain: Add interface bits for client build\r\n\r\n* Add jsdocs to interface for new methods\r\n\r\n* Add last missing function and update docs\r\n\r\n* vm: add test for error case\r\n\r\n* Make most properties optional\r\n\r\n* fix example\r\n\r\n* typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-05T12:32:50+02:00",
          "tree_id": "2d1b2efcbb0dedec97b4df4ea2de1e45ff77be3c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/29493bced079f1cd57eac2562566aebebfb6cc9c"
        },
        "date": 1659695832499,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23630,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21761,
            "range": "±6.96%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23472,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22939,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31710,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 759,
            "range": "±40.73%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 186,
            "range": "±10.94%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 86.75,
            "range": "±20.34%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.3,
            "range": "±79.49%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "f6c12b97f10ec420a2f094a0c9eade8d7082d987",
          "message": "trie: remove unnecessary temp variables and buffer creation (#2103)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-05T07:26:44-04:00",
          "tree_id": "3107318484197d860674a6168e6e9567f8181871",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f6c12b97f10ec420a2f094a0c9eade8d7082d987"
        },
        "date": 1659698952949,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23039,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21596,
            "range": "±7.08%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23207,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22743,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31191,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 957,
            "range": "±5.02%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 164,
            "range": "±36.34%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 102,
            "range": "±4.04%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.27,
            "range": "±50.39%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "0add7930a831c22e5f0397e3a2a07446d94d371e",
          "message": "chore(trie): add database example scripts (#2109)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update lmdb.js\r\n\r\n* Update lmdb.js",
          "timestamp": "2022-08-08T13:45:18+02:00",
          "tree_id": "42355fbc63982eda529eea77bf595fd13126249c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0add7930a831c22e5f0397e3a2a07446d94d371e"
        },
        "date": 1659959288336,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23056,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21222,
            "range": "±8.09%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23037,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22855,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31358,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 748,
            "range": "±40.07%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 186,
            "range": "±10.56%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.94,
            "range": "±21.04%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.13,
            "range": "±82.23%",
            "unit": "ops/sec",
            "extra": "24 samples"
          }
        ]
      }
    ]
  }
}