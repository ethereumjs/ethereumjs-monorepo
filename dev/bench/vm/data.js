window.BENCHMARK_DATA = {
  "lastUpdate": 1694786384013,
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
          "id": "fdafe004b25fe67e9e54b0eebbdd65e6b31060a3",
          "message": "Fixes the RLP CLI (#3007)\n\n* Fix file extension on rlp cli\r\n\r\n* Add simple CLI test\r\n\r\n* Skip cli test in browser\r\n\r\n* fix config",
          "timestamp": "2023-09-05T14:03:09-07:00",
          "tree_id": "4a71689c6c086785984f8fee4a884f9953c7d5c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fdafe004b25fe67e9e54b0eebbdd65e6b31060a3"
        },
        "date": 1693948002762,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30854,
            "range": "±5.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30328,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30253,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25967,
            "range": "±10.19%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29220,
            "range": "±3.40%",
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
          "id": "6d0052c24911a74f39760ad8bb9c4e054b23b14b",
          "message": "trie:  Rewrite findPath without outer promise (#3015)",
          "timestamp": "2023-09-05T20:53:38-04:00",
          "tree_id": "524d85217d114575c39ca1372fb447efe0dcbf1b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6d0052c24911a74f39760ad8bb9c4e054b23b14b"
        },
        "date": 1693961883487,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21310,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 23013,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22644,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20364,
            "range": "±8.68%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22104,
            "range": "±3.20%",
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
          "id": "8ca49a1c346eb7aa61acf550f8fe213445ef71ab",
          "message": "ethersStateManager: dumpStorage fix / test (#3009)\n\n* statemanager: add test for uncovered dumpStorage method\r\n\r\n* statemanager: add internal account dump method\r\nto storage cache class.\r\n\r\n* statemanager:  ethersStateManager:\r\ncall `_storageCache.dump` in `dumpStorage`",
          "timestamp": "2023-09-08T17:08:08+02:00",
          "tree_id": "3c58ea7da19f92134b2d111a99aeb3e08a616bdf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8ca49a1c346eb7aa61acf550f8fe213445ef71ab"
        },
        "date": 1694185903936,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30283,
            "range": "±5.58%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29928,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29554,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24998,
            "range": "±10.88%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28875,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "c1e2f955ad768784868b9e508e2f3f1182086a1a",
          "message": "trie: include null as possilbe value type in PUT (#3020)",
          "timestamp": "2023-09-12T16:53:58-07:00",
          "tree_id": "7e9966ea75e57def161b54758132723360fcc973",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1e2f955ad768784868b9e508e2f3f1182086a1a"
        },
        "date": 1694563039975,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31501,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31288,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31444,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26881,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29526,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "d2261ea5aaa1161deab2b0d53bbe452ef8f67a94",
          "message": "add DEBUG=ethjs to \"coverage\" test scripts (#3027)",
          "timestamp": "2023-09-14T14:34:26+02:00",
          "tree_id": "75f70107e0c3ad10056229038be9208433742bb2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2261ea5aaa1161deab2b0d53bbe452ef8f67a94"
        },
        "date": 1694695091553,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27651,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27542,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28117,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26960,
            "range": "±3.62%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21165,
            "range": "±11.25%",
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
          "id": "04aa4dad54b9e258db8c4e51de5801c9b0680d02",
          "message": "client: some skeleton improvements from observations on devnet syncs (#3014)\n\n* client: some skeleton improvements from observations on devnet syncs\r\n\r\n* skip filling chain on duplicate sethead\r\n\r\n* apply nits\r\n\r\n* add beacon sync sim for incline client\r\n\r\n* get the beacon sync to resolve\r\n\r\n* fix breaking skeleton spec\r\n\r\n* fix reverse block fetcher\r\n\r\n* apply feeback",
          "timestamp": "2023-09-14T22:05:28+05:30",
          "tree_id": "1fe291a8fa53de82a53ce23b8b16e119598d81bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/04aa4dad54b9e258db8c4e51de5801c9b0680d02"
        },
        "date": 1694709694469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30563,
            "range": "±5.57%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30281,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30327,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25730,
            "range": "±10.20%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29412,
            "range": "±3.10%",
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
          "id": "67a20de06d965a21ac045c543b533962f4ace859",
          "message": "tx: improve tx capability handling (#3010)\n\n* tx: TxCapability interfaces and rename generic capability to legacy\r\n\r\n* tx: txTypeBytes helper\r\n\r\n* tx: add missing methods and props to tx interfaces\r\n\r\n* tx: refactor and improve serialize helper\r\n\r\n* tx: implement update serialize helper and txTypeBytes helper\r\n\r\n* tx: refactor getDataFee for use in legacyTransaction\r\n\r\n* tx: remove redundant prop from EIP4844CompatibleTxInterface\r\n\r\n* tx: shorten compatibletxInterface name\r\n\r\n* tx: typedTransaction -> EIP2718CompatibleTx\r\n\r\n* tx: remove implements interface\r\n\r\n* tx: add legacytxinterface and move accesslists props to eip2930 interface",
          "timestamp": "2023-09-14T21:45:38+02:00",
          "tree_id": "415609fe0bd3aa0cc67f33d4d7dee384a261c77b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/67a20de06d965a21ac045c543b533962f4ace859"
        },
        "date": 1694720950485,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30362,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30208,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30177,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25232,
            "range": "±10.24%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28995,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jinsoo.han.mail@gmail.com",
            "name": "Jinsoo Han",
            "username": "Hann"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d2f4394f5657bb27d4447a31bc4f0848f8c6b1b5",
          "message": "StateManager: some devDependencies move to dependencies (#3026)\n\n* make clear ambiguous dependencies\r\n\r\n* add types for the debug package\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-09-15T09:56:13-04:00",
          "tree_id": "866fad186810ffcaefe6bcc03899ffb5bc826805",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2f4394f5657bb27d4447a31bc4f0848f8c6b1b5"
        },
        "date": 1694786383313,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30665,
            "range": "±5.09%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30376,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30537,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25740,
            "range": "±9.70%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29456,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      }
    ]
  }
}