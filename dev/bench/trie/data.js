window.BENCHMARK_DATA = {
  "lastUpdate": 1654684794165,
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
          "id": "07a6d2e8a672d6bebad57a1e9df80c3e735fbf2e",
          "message": "set caller to zero address if not provided (#1840)",
          "timestamp": "2022-04-06T13:35:45-07:00",
          "tree_id": "4bc9ccccadb2c8b44254d9851d7ee71145ce5cbd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/07a6d2e8a672d6bebad57a1e9df80c3e735fbf2e"
        },
        "date": 1649277674404,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 11650,
            "range": "±11.94%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 12679,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 8090,
            "range": "±25.73%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 11934,
            "range": "±3.63%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 13931,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 782,
            "range": "±7.17%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 151,
            "range": "±13.26%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 26.47,
            "range": "±138.27%",
            "unit": "ops/sec",
            "extra": "23 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.27,
            "range": "±9.43%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1bd84986578095565600f668ec86453675ec4294",
          "message": "client: move TxPool to FullEthereumService (#1853)\n\n* move txpool from FullSync to FullEthereumService\r\nremove execution from client class\r\n* move execution init to service\r\n* use pool peer count directly now\r\n* nit (dedupe `any` cast)",
          "timestamp": "2022-04-09T10:41:43-07:00",
          "tree_id": "3f5834e55ed34f683845856e138227947c588469",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bd84986578095565600f668ec86453675ec4294"
        },
        "date": 1649526368516,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 17829,
            "range": "±11.30%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14090,
            "range": "±19.62%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 18127,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 16679,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 19508,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 891,
            "range": "±8.77%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 77.91,
            "range": "±37.53%",
            "unit": "ops/sec",
            "extra": "45 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 103,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 7.65,
            "range": "±120.87%",
            "unit": "ops/sec",
            "extra": "22 samples"
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
          "id": "1f4463730eaf081c19102816829926a9b699d1f9",
          "message": "Common: fixed non-option passing on custom() method (#1851)\n\n* Common: fixed non-option passing on custom() method\r\n* Common: custom options test sanity check (review suggestion)\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n* lint, fix test\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-04-09T10:53:02-07:00",
          "tree_id": "da80442adf461a715b48e66e0219bb3d69de4546",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1f4463730eaf081c19102816829926a9b699d1f9"
        },
        "date": 1649527103151,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 10749,
            "range": "±18.05%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 12881,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 8161,
            "range": "±23.50%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 11893,
            "range": "±3.94%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 13891,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 735,
            "range": "±7.02%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 153,
            "range": "±10.55%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 26.3,
            "range": "±139.54%",
            "unit": "ops/sec",
            "extra": "22 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.84,
            "range": "±4.98%",
            "unit": "ops/sec",
            "extra": "32 samples"
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
          "id": "1d7d4193c60da23793660967a31f4c6d3c2055d7",
          "message": "VM: Custom precompiles (#1813)\n\n* vm/precompiles: do not export precompiles list\r\n\r\n* vm: change precompile logic, use maps\r\n\r\n* vm/tests: ensure these run\r\n\r\n* vm: fixed custom precompile bugs\r\n\r\n* vm: add custom precompile tests\r\n\r\n* review, clean up, nits\r\n\r\n* add _customPrecompiles to stateManager\r\n\r\n* vm: fixes custom opcodes\r\n\r\n* vm: re-export precompiles\r\n\r\n* vm: attempt to fix ci\r\n\r\n* vm: experiment 2 to fix CI\r\n\r\n* vm: add public precompile method, remove experiment\r\n\r\n* vm: fix CI\r\n\r\n* vm: change function sig\r\n\r\n* vm: remove TODO\r\n\r\n* vm: remove precompile logic from statemanager\r\n\r\n* vm: remove customprecompiles from statemanager\r\n\r\n* vm: use `precompiles` getter\r\n\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-04-13T18:53:03+02:00",
          "tree_id": "81edd7896101775c22e29e832c7ce94593446b2a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1d7d4193c60da23793660967a31f4c6d3c2055d7"
        },
        "date": 1649869613361,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 11525,
            "range": "±11.96%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13214,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 8252,
            "range": "±27.07%",
            "unit": "ops/sec",
            "extra": "52 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 12428,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 14421,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 773,
            "range": "±7.14%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 161,
            "range": "±12.11%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 36.64,
            "range": "±113.24%",
            "unit": "ops/sec",
            "extra": "23 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.59,
            "range": "±5.37%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "moodysalem@users.noreply.github.com",
            "name": "Moody Salem",
            "username": "moodysalem"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2707449df4521bfc5c3edc728d70e582b2320f3a",
          "message": "VM: revert TSTORE opcode if in static context (#1821)\n\n* revert TSTORE opcode if in static context\r\n\r\n* merge transient storage on commit",
          "timestamp": "2022-04-13T19:23:21+02:00",
          "tree_id": "8e7c41f48ee92dcbde34df1e4bd10f516114c9fd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2707449df4521bfc5c3edc728d70e582b2320f3a"
        },
        "date": 1649870853247,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 16225,
            "range": "±13.83%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13783,
            "range": "±17.87%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 16572,
            "range": "±13.71%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 16427,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 19228,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 911,
            "range": "±6.14%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 92.29,
            "range": "±87.60%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.96,
            "range": "±9.65%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.01,
            "range": "±26.16%",
            "unit": "ops/sec",
            "extra": "33 samples"
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
          "id": "6b0fb9d889a65edf3964f1e90e922fae7dd6327c",
          "message": "New Minor VM v5.9 Release, Client and Common Bugfix Releases (#1856)\n\n* Common: Bumped version to v2.6.4, Updated CHANGELOG (VM, Client CHANGELOG as well), updated upstream dependency versions\r\n\r\n* Common: rebuild documentation\r\n\r\n* VM: bumped version to v5.9.0, updated upstream dependency versions\r\n\r\n* CLient: bumped version to v0.4.1\r\n\r\n* rename MergeForkBlock to MergeForkIdTransition for increased clarity\r\n\r\n* changelog updates/typos/fixes\r\n\r\n* common: rebuild docs for renaming to MergeForkIdTransition\r\n\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-04-14T11:58:22+02:00",
          "tree_id": "b7cdb0e60d5ddf081439c0f46e410f811101cc55",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6b0fb9d889a65edf3964f1e90e922fae7dd6327c"
        },
        "date": 1649930584719,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15691,
            "range": "±12.26%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13917,
            "range": "±15.98%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12999,
            "range": "±19.51%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14835,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 16963,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 802,
            "range": "±8.24%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 91.88,
            "range": "±86.60%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 83.3,
            "range": "±7.97%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.6,
            "range": "±28.04%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "76567250+g11tech@users.noreply.github.com",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "02f6988eabb2e9970c77064c940db227cd91eca3",
          "message": "client: make some `eth_` methods available on engine endpoint as per kiln spec v2.1 (#1855)\n\n* Make available some eth_ methods on engine endpoint as per kiln spec v2.1\r\n* other methods as mandated by kiln v2.1\r\n* sample test check for eth_ method availability on engine rpc\r\n* update tests will remaining eth method check on engine\r\n* log nits\r\n* test nits\r\n* nit: replace reduce with for of loop\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-04-15T12:23:27-07:00",
          "tree_id": "cc6fd6e124ef421c7a9fb95b5396d1e1982e6b8c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02f6988eabb2e9970c77064c940db227cd91eca3"
        },
        "date": 1650050893115,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 14868,
            "range": "±13.65%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13856,
            "range": "±12.97%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 9418,
            "range": "±34.20%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14333,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 16995,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 810,
            "range": "±7.75%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 95.03,
            "range": "±87.95%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 80.87,
            "range": "±7.71%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.22,
            "range": "±7.22%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "moodysalem@users.noreply.github.com",
            "name": "Moody Salem",
            "username": "moodysalem"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d5bb01e4054e10417ac85133f1bc7ef0b33b9cfd",
          "message": "fix: improve the time complexity of commit by using a journal instead of stack of maps (#1860)\n\nthis is necessary because created a large call stack, then writing a bunch of keys and having all the calls return could potentially DOS the client",
          "timestamp": "2022-04-20T16:29:42+02:00",
          "tree_id": "92ac5d0ce596e9396e99c2a771305133e172d0b7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d5bb01e4054e10417ac85133f1bc7ef0b33b9cfd"
        },
        "date": 1650465256697,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18882,
            "range": "±10.71%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 15550,
            "range": "±20.32%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 19085,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 18110,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 19295,
            "range": "±8.81%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 386,
            "range": "±37.22%",
            "unit": "ops/sec",
            "extra": "40 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 203,
            "range": "±8.77%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 69.67,
            "range": "±64.00%",
            "unit": "ops/sec",
            "extra": "47 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.7,
            "range": "±18.93%",
            "unit": "ops/sec",
            "extra": "36 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "76567250+g11tech@users.noreply.github.com",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da4bf645e9066d7b88c991bb6a5a823ba19d4ce6",
          "message": "client: refac services, syncronizers and fetchers for beacon sync (#1858)\n\n* refac client services, syncronizers and fetcher for beacon sync\r\n\r\n* derive height in the constructor itself\r\n\r\n* fix tests\r\n\r\n* fix tests\r\n\r\n* enqueueByNumberList changes\r\n\r\n* enqueueByNumberList test fixes\r\n\r\n* move processBlocks to full sync it will be a syncronizer based behavior\r\n\r\n* move processBlock to previous location to potentially reduce diff\r\n\r\n* fix event listeners\r\n\r\n* reorder for test coverage\r\n\r\n* typo fix",
          "timestamp": "2022-04-21T09:41:18+02:00",
          "tree_id": "8e67dc51f356dee084332914e96dfc1af0db36cd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/da4bf645e9066d7b88c991bb6a5a823ba19d4ce6"
        },
        "date": 1650527166955,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15822,
            "range": "±12.09%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14139,
            "range": "±14.54%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12506,
            "range": "±32.76%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14826,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 16591,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 778,
            "range": "±8.43%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 92.75,
            "range": "±87.59%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 82.13,
            "range": "±11.45%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.36,
            "range": "±5.44%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "76567250+g11tech@users.noreply.github.com",
            "name": "g11tech",
            "username": "g11tech"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c429125d034e4fdf9aacd9cd4ebb2049dd55d666",
          "message": "pass the maxFetcherJobs arg to the config (#1861)",
          "timestamp": "2022-04-21T06:00:45-07:00",
          "tree_id": "f1bc3284e29c0f065babb8563127d3f9a93204a5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c429125d034e4fdf9aacd9cd4ebb2049dd55d666"
        },
        "date": 1650546330791,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15399,
            "range": "±12.54%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14170,
            "range": "±15.75%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 13899,
            "range": "±14.58%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15174,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17472,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 846,
            "range": "±6.71%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 89.13,
            "range": "±92.94%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.99,
            "range": "±7.73%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.71,
            "range": "±29.77%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e6d828b31bc557d294250fa4cd09c7cca2b32a81",
          "message": "nits, improvements, cleanup after #1858 (#1863)",
          "timestamp": "2022-04-22T07:12:04-07:00",
          "tree_id": "9d67a7743c4216e8c398bbcb7855e23df6f1998d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6d828b31bc557d294250fa4cd09c7cca2b32a81"
        },
        "date": 1650637009711,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15831,
            "range": "±14.19%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 17884,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12048,
            "range": "±18.06%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 12639,
            "range": "±35.48%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 18688,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 893,
            "range": "±6.72%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 99.25,
            "range": "±87.16%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 86.87,
            "range": "±8.50%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.17,
            "range": "±28.48%",
            "unit": "ops/sec",
            "extra": "32 samples"
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
          "id": "083e2b2c2e57dc7da62b2e8deed69fd8e777ecbf",
          "message": "Fix example links (#1864)\n\n* Update README.md\n\n* Update README.md\n\n* Update README.md\n\n* Update README.md",
          "timestamp": "2022-04-23T21:43:14-04:00",
          "tree_id": "4b9dada4d52b8ad5bf0a0138ecda399c857bb6f9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/083e2b2c2e57dc7da62b2e8deed69fd8e777ecbf"
        },
        "date": 1650764866523,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 16727,
            "range": "±9.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13059,
            "range": "±19.41%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 15761,
            "range": "±13.01%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15306,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 18238,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 869,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 90.04,
            "range": "±101.87%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.67,
            "range": "±12.70%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.25,
            "range": "±28.34%",
            "unit": "ops/sec",
            "extra": "32 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "andrev.terron@gmail.com",
            "name": "André Vitor Terron",
            "username": "andreterron"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b180d8f259bc355130f89b0efcc69bd9fd1a855",
          "message": "Fix broken Readme link to run the VM in a browser (#1865)\n\nClicking on the \"Running the VM in a browser\" link was resulting in a 404 error.\r\nThis change adds the `.js` extension to the URL, fixing the issue.",
          "timestamp": "2022-04-25T02:29:53-07:00",
          "tree_id": "e855c2a6f23499a94c73df4bfe2cf26df9ad0dcb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7b180d8f259bc355130f89b0efcc69bd9fd1a855"
        },
        "date": 1650879271435,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 16263,
            "range": "±16.27%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 12919,
            "range": "±22.62%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17515,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "53 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 16242,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 18700,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 889,
            "range": "±6.38%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 86.43,
            "range": "±99.74%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.59,
            "range": "±13.07%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.98,
            "range": "±5.76%",
            "unit": "ops/sec",
            "extra": "33 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "22412996+zemse@users.noreply.github.com",
            "name": "soham",
            "username": "zemse"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8cef5878daedd7a8f589e33dd119376889330f4b",
          "message": "vm/docs: mention that stack in step event can change (#1868)",
          "timestamp": "2022-04-28T16:03:37-07:00",
          "tree_id": "70a728aa7a94f9fe929c2c232a647016e22d1cc0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cef5878daedd7a8f589e33dd119376889330f4b"
        },
        "date": 1651187293659,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18878,
            "range": "±9.02%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 15526,
            "range": "±16.03%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 18311,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 16706,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 20192,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 528,
            "range": "±27.16%",
            "unit": "ops/sec",
            "extra": "43 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 171,
            "range": "±25.20%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 60.74,
            "range": "±84.03%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.93,
            "range": "±7.99%",
            "unit": "ops/sec",
            "extra": "37 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5851e721061b95a358d5bb07f5574a1b37fb3b2c",
          "message": "bump devp2p to v4.2.2, add changelog entries (#1872)",
          "timestamp": "2022-05-02T14:50:53+02:00",
          "tree_id": "e46a352d7ec33aaf3a3d14d8f56fc78d04d1ca3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5851e721061b95a358d5bb07f5574a1b37fb3b2c"
        },
        "date": 1651496144696,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 14900,
            "range": "±18.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 12842,
            "range": "±23.84%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 15662,
            "range": "±10.10%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15179,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17486,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 846,
            "range": "±6.70%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 89.11,
            "range": "±93.42%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.55,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.41,
            "range": "±5.40%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8e1c3cf9c47bfc037182c275f46eef405ef70dca",
          "message": "devp2p: remove async dep from integration tests (#1875)",
          "timestamp": "2022-05-03T13:21:17+02:00",
          "tree_id": "5db995c0ce2f15d580849cc9f9b9c570678a0782",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8e1c3cf9c47bfc037182c275f46eef405ef70dca"
        },
        "date": 1651577162102,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15686,
            "range": "±12.97%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14089,
            "range": "±15.47%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 13610,
            "range": "±27.94%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15610,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17974,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 872,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 116,
            "range": "±54.71%",
            "unit": "ops/sec",
            "extra": "51 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.33,
            "range": "±11.41%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.35,
            "range": "±27.65%",
            "unit": "ops/sec",
            "extra": "32 samples"
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
          "id": "4217ed683c362626e3dd07c5ceb73bb75ca66242",
          "message": "client: add missing tx fields to getBlockByHash (#1881)\n\n* client: add missing tx fields to getBlockByHash\r\n\r\n* Add test for \"includeTransactions\"\r\n\r\n* Fix test\r\n\r\n* numbers to hex\r\n\r\n* DRY\r\n\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>",
          "timestamp": "2022-05-16T10:57:12+02:00",
          "tree_id": "0d18b1f277631066e33bbc197f9e425ce17a26fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4217ed683c362626e3dd07c5ceb73bb75ca66242"
        },
        "date": 1652691752652,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 13087,
            "range": "±14.01%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14967,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 10002,
            "range": "±21.19%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 13602,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 15823,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 769,
            "range": "±6.77%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 159,
            "range": "±12.24%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 13.01,
            "range": "±179.75%",
            "unit": "ops/sec",
            "extra": "11 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.71,
            "range": "±5.20%",
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
          "id": "c2f20d0a1745072422a0ffd3528640c4af9d6fcd",
          "message": "Tx: Ensure TxOptions propagate from unsigned to signed (#1884)\n\n* tx: ensure TxOptions propagate from unsigned to signed\r\n\r\n* tx: ensure TxOptions propagate from unsigned to signed\r\n\r\n* tx: take common from tx.common when signing\r\n\r\n* tx: fix typo\r\n\r\n* tx: address review",
          "timestamp": "2022-05-16T22:02:22+02:00",
          "tree_id": "8c36512584f73a0792f4f34c2562d0c4bccfe8a4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c2f20d0a1745072422a0ffd3528640c4af9d6fcd"
        },
        "date": 1652731632654,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15816,
            "range": "±12.17%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 17285,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 10145,
            "range": "±30.11%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15917,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17960,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 835,
            "range": "±6.99%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 168,
            "range": "±11.73%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 50.03,
            "range": "±85.16%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.98,
            "range": "±26.22%",
            "unit": "ops/sec",
            "extra": "31 samples"
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
          "id": "64a8b13bbb2f9d7f29af13fad033307222c5edb8",
          "message": "Update tests to 10.4 (#1896)\n\n* Update tests to 10.4\r\n* tx: fix test runner",
          "timestamp": "2022-05-18T21:17:43-07:00",
          "tree_id": "8e05b38a378db233ec9eb1a07a8fb6d927eada2a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/64a8b13bbb2f9d7f29af13fad033307222c5edb8"
        },
        "date": 1652934168265,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 13849,
            "range": "±14.77%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14523,
            "range": "±6.60%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 8199,
            "range": "±36.36%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 13480,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 15960,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 792,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 158,
            "range": "±12.57%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 16.89,
            "range": "±166.13%",
            "unit": "ops/sec",
            "extra": "14 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.8,
            "range": "±5.33%",
            "unit": "ops/sec",
            "extra": "32 samples"
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
          "id": "e8fd471f2ba89c0464f2411d599fad0e468b9613",
          "message": "Client/TxPool: add tx validation (#1852)\n\n* client/txpool: add gas price bump check\r\n\r\n* txpool: add more validation logic\r\n\r\n* client: update txpool checks\r\n\r\n* client: fix some tests\r\n\r\n* client: fix txpool tests\r\n\r\n* client: add txpool tests\r\n\r\n* txpool: add signed check\r\n\r\n* client: add more txpool tests\r\n\r\n* client: lint\r\n\r\n* client/txpool: balance test\r\n\r\n* client: fix miner tests\r\n\r\n* client: fix txpool hash messages to show hex values\r\n\r\n* client: fix dangling promises in txpool tests\r\n\r\n* client: fix sendRawTransaction tests\r\n\r\n* client/txpool: track tx count\r\n\r\n* client/txpool: increase coverage\r\ntests: improve error messages\r\n\r\n* client/txpool: update tests\r\n\r\n* client: add local txpool test for eth_sendRawTransaction\r\n\r\n* txpool: add FeeMarket gas logic\r\ntxpool: add basefee checks\r\n\r\n* client: address review\r\n\r\n* client/txpool: fix tests\r\n\r\n* client/txpool: increase coverage\r\n\r\n* client/txpool: fix broadcast\r\n\r\n* client/test/miner: address review",
          "timestamp": "2022-05-19T21:48:16+02:00",
          "tree_id": "5564653391906921ef5d681de97dfccb107cb265",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8fd471f2ba89c0464f2411d599fad0e468b9613"
        },
        "date": 1652990014629,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 11284,
            "range": "±27.65%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14024,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 9059,
            "range": "±25.74%",
            "unit": "ops/sec",
            "extra": "47 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 13206,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 15444,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 711,
            "range": "±8.21%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 140,
            "range": "±13.28%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 24.73,
            "range": "±140.69%",
            "unit": "ops/sec",
            "extra": "22 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.67,
            "range": "±8.13%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bdfbe37c8b29f29a6ca86881b7c136a6fded7443",
          "message": "client: optimistic (beacon) sync (#1878)\n\n* beacon sync (optimistic sync) implementation\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-05-20T09:31:38-07:00",
          "tree_id": "63488b0531166e410dc880d88b8f01307d905c89",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bdfbe37c8b29f29a6ca86881b7c136a6fded7443"
        },
        "date": 1653064645121,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 9127,
            "range": "±34.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 12566,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 9292,
            "range": "±17.36%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 8871,
            "range": "±44.64%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 13413,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 693,
            "range": "±8.25%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 145,
            "range": "±12.07%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 34.35,
            "range": "±114.45%",
            "unit": "ops/sec",
            "extra": "31 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.7,
            "range": "±10.34%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "42338831+theNvN@users.noreply.github.com",
            "name": "Naveen Sahu",
            "username": "theNvN"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0b7cc1b15d1fd9d58e4ae7db794674c3af4da5ae",
          "message": "fix: expand memory on reading prev. untouched location (#1887)\n\n* fix: expand memory on reading prev. untouched location\r\n\r\nMemory is expanded by word when accessing previously untouched memory word ([relevant docs](https://docs.soliditylang.org/en/v0.8.13/introduction-to-smart-contracts.html#storage-memory-and-the-stack)). That applies to read operation on memory too.\r\n\r\n* fix: properly auto-expand memory on read/write\r\n\r\n* test: add tests for memory expansion on access\r\n\r\nRemoved a couple of tests for write beyond capacity.\r\nThis is because memory is now auto expanded during write.",
          "timestamp": "2022-05-23T17:47:19+02:00",
          "tree_id": "9209821f596fe17181d15f87bae21db67e085ce6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b7cc1b15d1fd9d58e4ae7db794674c3af4da5ae"
        },
        "date": 1653321163907,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 13109,
            "range": "±18.39%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 15120,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 7978,
            "range": "±22.00%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14049,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 16913,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 817,
            "range": "±7.38%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 161,
            "range": "±11.71%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 43.56,
            "range": "±92.83%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.08,
            "range": "±26.62%",
            "unit": "ops/sec",
            "extra": "30 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ryan@ryanio.com",
            "name": "Ryan Ghods",
            "username": "ryanio"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a133e27f98f3dd919594ddd2cce8db53edcbbef2",
          "message": "client: small engine updates (#1902)\n\n* simplify txpool, fix runExecution, allow safe block to also be zeros during transition\r\n* fix beacon sync skeleton fill with new vmexecution.run loop param",
          "timestamp": "2022-05-25T16:53:19-07:00",
          "tree_id": "e02703f878196d5bcdb1e9f7e1e1449018246213",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a133e27f98f3dd919594ddd2cce8db53edcbbef2"
        },
        "date": 1653523095538,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 14766,
            "range": "±11.09%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14044,
            "range": "±15.38%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12428,
            "range": "±23.16%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14674,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17218,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 978,
            "range": "±4.84%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 127,
            "range": "±48.87%",
            "unit": "ops/sec",
            "extra": "45 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.68,
            "range": "±7.01%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.2,
            "range": "±28.10%",
            "unit": "ops/sec",
            "extra": "33 samples"
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
          "id": "2b993aa8a8b47ffe4266fac8932322f516d6b8e4",
          "message": "VM/tests: ensure verifyPostConditions works (#1900)\n\n* vm/tests: ensure verifyPostConditions works\r\n\r\n* vm/tests/util: update output\r\n\r\n* vm/tests/util: make storage comments more clear",
          "timestamp": "2022-05-26T20:07:53+02:00",
          "tree_id": "ded1aee0cee912ceea1bb1248e5fe35b35153e93",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2b993aa8a8b47ffe4266fac8932322f516d6b8e4"
        },
        "date": 1653588805603,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18291,
            "range": "±16.66%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 20518,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 19396,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 9823,
            "range": "±32.31%",
            "unit": "ops/sec",
            "extra": "46 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 22066,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 999,
            "range": "±5.01%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 116,
            "range": "±85.61%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 91.31,
            "range": "±15.46%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 20.36,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "36 samples"
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
          "id": "2f42dcfedd18852fc95cc4a51da606dfcbf87387",
          "message": "client: Subsume engine's INVALID_TERMINAL_BLOCK into INVALID response (#1919)",
          "timestamp": "2022-05-28T12:55:20-07:00",
          "tree_id": "3055fd31eb58947f3472867f023e0d99e5db45d8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2f42dcfedd18852fc95cc4a51da606dfcbf87387"
        },
        "date": 1653768002563,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15364,
            "range": "±16.15%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13692,
            "range": "±15.59%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 13116,
            "range": "±26.66%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 15120,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 17208,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 837,
            "range": "±7.48%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 86.26,
            "range": "±94.17%",
            "unit": "ops/sec",
            "extra": "54 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.69,
            "range": "±7.60%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.62,
            "range": "±27.94%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ernestognw@gmail.com",
            "name": "Ernesto García",
            "username": "ernestognw"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30ca12e6e38d107aa80e0b626078a345ff0f06f2",
          "message": "Util: Allow `v` to be `0` or `1` for EIP1559 transactions (#1905)\n\n* Util: Allow v to be `0` or `1` for EIP1559 transactions\r\n\r\n* vm: fix ecrecover precompile for v=0 and v=1\r\n\r\n* tx/legacyTransaction: add `v` guard for non-EIP155 txs\r\n\r\n* tx: switch to earlier v validation and throwing before v common/EIP-155 determination logic\r\n\r\n* tx: remove v==0 check which always defaults to the default common\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-05-31T19:54:41+02:00",
          "tree_id": "925f79a30206c16ad2a48f8ed17e6f5a001fc0c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/30ca12e6e38d107aa80e0b626078a345ff0f06f2"
        },
        "date": 1654019967788,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 15102,
            "range": "±12.16%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14554,
            "range": "±12.40%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 9372,
            "range": "±32.08%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 14583,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 16957,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 821,
            "range": "±7.44%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 170,
            "range": "±6.98%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 45.83,
            "range": "±88.34%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.09,
            "range": "±30.54%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "52c6d52230c02ecf2bc9c5438c3271bd9a092061",
          "message": "Last round of master v5 Releases (#1927)\n\n* Monorepo: updated package-lock.json\r\n\r\n* Util: bumped version to v7.1.5, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* Util: rebuild documentation\r\n\r\n* Tx: bumped version to v3.5.2, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* VM: bumped version to v5.9.1, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* Client: bumped version to v0.5.0, added CHANGELOG entry, updated README\r\n\r\n* Nits\r\n\r\n* Update packages/client/README.md\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Ryan Ghods <ryan@ryanio.com>\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2022-06-02T11:41:51+02:00",
          "tree_id": "970b0d128b7a491190af9de19d8e87a3d973c357",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52c6d52230c02ecf2bc9c5438c3271bd9a092061"
        },
        "date": 1654163599551,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 10791,
            "range": "±13.83%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 14120,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12373,
            "range": "±13.09%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 7993,
            "range": "±41.13%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 15526,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 795,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 170,
            "range": "±10.74%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 57.51,
            "range": "±62.95%",
            "unit": "ops/sec",
            "extra": "21 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.3,
            "range": "±5.40%",
            "unit": "ops/sec",
            "extra": "31 samples"
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
        "date": 1654164956470,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18359,
            "range": "±12.40%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 18830,
            "range": "±7.10%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 11897,
            "range": "±31.28%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 17631,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 20844,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 996,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 86.8,
            "range": "±110.14%",
            "unit": "ops/sec",
            "extra": "38 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 104,
            "range": "±6.49%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 9.89,
            "range": "±95.96%",
            "unit": "ops/sec",
            "extra": "33 samples"
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
        "date": 1654201195759,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 10612,
            "range": "±12.96%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 13019,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 12463,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 6772,
            "range": "±30.01%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 14192,
            "range": "±3.65%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 722,
            "range": "±8.03%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 149,
            "range": "±11.01%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 36.58,
            "range": "±107.90%",
            "unit": "ops/sec",
            "extra": "33 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.44,
            "range": "±9.67%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
        "date": 1654684793596,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "[MemoryDB] 1k-3-32-ran",
            "value": 27141,
            "range": "±4.09%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "[MemoryDB] 1k-5-32-ran",
            "value": 24531,
            "range": "±9.96%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "[MemoryDB] 1k-9-32-ran",
            "value": 26399,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-ran",
            "value": 26359,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-mir",
            "value": 44633,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 100 iterations",
            "value": 844,
            "range": "±6.28%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 500 iterations",
            "value": 104,
            "range": "±68.61%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 1000 iterations",
            "value": 88.74,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 5000 iterations",
            "value": 14.9,
            "range": "±23.37%",
            "unit": "ops/sec",
            "extra": "30 samples"
          },
          {
            "name": "[LevelDB] 1k-3-32-ran",
            "value": 12198,
            "range": "±81.04%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "[LevelDB] 1k-5-32-ran",
            "value": 24695,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "[LevelDB] 1k-9-32-ran",
            "value": 24328,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-ran",
            "value": 24232,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-mir",
            "value": 40170,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 100 iterations",
            "value": 834,
            "range": "±6.15%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 500 iterations",
            "value": 53.63,
            "range": "±114.82%",
            "unit": "ops/sec",
            "extra": "21 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 1000 iterations",
            "value": 82.48,
            "range": "±6.81%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 5000 iterations",
            "value": 10.97,
            "range": "±60.72%",
            "unit": "ops/sec",
            "extra": "24 samples"
          }
        ]
      }
    ]
  }
}