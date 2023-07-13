window.BENCHMARK_DATA = {
  "lastUpdate": 1689271635834,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7e201d5569a807d164bc3df35f0a3163b9c504f",
          "message": "Replace `rustbn.js` with wasm-compiled `rustbn.wasm` module (#2834)\n\n* Proof of concept integration with rustbn wasm\r\n\r\n* needed fixes\r\n\r\n* Switch module to node16\r\n\r\n* turn on esmodule interop in client\r\n\r\n* Fix namespace import\r\n\r\n* Remove rustbn.ts code\r\n\r\n* clean up evm config\r\n\r\n* rename vitest config\r\n\r\n* Remove dep and fix events import\r\n\r\n* Fix browser tests npm script\r\n\r\n* remove old comment\r\n\r\n* Update dependency to point to ethjs repo\r\n\r\n* EVM: update EC precompile dependency to official newly published rustbn.wasm package\r\n\r\n* Rebuild package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-06-29T12:16:25+02:00",
          "tree_id": "0ef52c3cc8f84b972faec0a504b4d5163f24be43",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e7e201d5569a807d164bc3df35f0a3163b9c504f"
        },
        "date": 1688034571296,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33438,
            "range": "±4.70%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33560,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33334,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27943,
            "range": "±10.73%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31312,
            "range": "±2.54%",
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
          "id": "ecce06bc820fab2240e6efa0ef14f7b1f9d8e64e",
          "message": "Common, Other: Remove deprecated Ropsten and Rinkeby networks (#2813)\n\n* Remove ropstein from code\r\n\r\n* Update tests\r\n\r\n* Fix tests\r\n\r\n* Remove rinkeby from code\r\n\r\n* Update tests\r\n\r\n* Fix test\r\n\r\n* Fix linting error\r\n\r\n* Fix linting error\r\n\r\n* Fix genesis index.ts\r\n\r\n* Fix linting issue\r\n\r\n* Fix test\r\n\r\n* Update examples to remove Rinkeby\r\n\r\n* Update examples to remove Ropsten\r\n\r\n* Remove genesis state files for Ropsten and Rinkeby\r\n\r\n* Fix example\r\n\r\n* Remove ropsten from docs\r\n\r\n* Remove rinkeby from docs\r\n\r\n* Remove ropsten and rinkeby import symbols from package.json\r\n\r\n* Remove commented code\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for custom chain\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test\r\n\r\n* Reintroduce removed ropsten test for custom chain\r\n\r\n* Reintroduce ropsten tests\r\n\r\n* Fix test\r\n\r\n* Fix tests\r\n\r\n* Clean up naming and comments\r\n\r\n* Use goerli for hardfork mismatch test\r\n\r\n* fix the miner spec\r\n\r\n* fix pending block spec\r\n\r\n* fix other client errors\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-06-29T12:57:07+02:00",
          "tree_id": "66defcda16ee68bb4b7800c2b95bdb410eb2bb6e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ecce06bc820fab2240e6efa0ef14f7b1f9d8e64e"
        },
        "date": 1688036438431,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32288,
            "range": "±5.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29397,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32497,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31999,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30955,
            "range": "±3.08%",
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
          "id": "9fbc8b08f3ffc52b6381b690409564b6392e50b8",
          "message": "update node-versions (#2839)",
          "timestamp": "2023-06-29T13:37:26+02:00",
          "tree_id": "5659cc0b6c80b075acb8be06096fd322cf58988f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9fbc8b08f3ffc52b6381b690409564b6392e50b8"
        },
        "date": 1688039029071,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28634,
            "range": "±5.92%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28537,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29205,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25363,
            "range": "±10.72%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23098,
            "range": "±13.55%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "9132b40326493c44aca33c7fcfb0ad86efa450d5",
          "message": "VM Browser Example and Various Browser Compatibility Fixes (#2840)\n\n* EVM: update EC precompile dependency to new package name rustbn.wasm -> rustbn-wasm\n\n* Rebuild package-lock.json\n\n* Activate EVM CI browser test run\n\n* EVM: add dedicated vite.config.ts to avoid have to run npx vite pointing to browser config\n\n* VM/EVM: another vite.config.ts, exlude from linting\n\n* VM: guard DEBUG property setting to fix Vite breaking\n\n* EVM: update mcl-wasm import from require -> import\n\n* VM: add browser example\n\n* Make mcl namespace import\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-06-29T11:34:53-04:00",
          "tree_id": "4d369b022d2575607f4a45d739e9d5e7b9d6816a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9132b40326493c44aca33c7fcfb0ad86efa450d5"
        },
        "date": 1688053295862,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31328,
            "range": "±5.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31639,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31399,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25708,
            "range": "±11.32%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30528,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "499c49677bb6994df13a2642e4d04403f77bf42d",
          "message": "Revert default to namespace imports (#2842)\n\n* Revert default to namespace imports\r\n\r\n* Adjust debug import syntax to make ESM happy\r\n\r\n* Revert esModuleInterop changes\r\n\r\n* fix qheap import and typing\r\n\r\n* Revert more default to namespace imports\r\n\r\n* fix json imports\r\n\r\n* More namespace import fixes\r\n\r\n* Update cli test in workflow\r\n\r\n* fix kzg import\r\n\r\n* fix more json imports\r\n\r\n* Fix last tests\r\n\r\n* Fix test imports",
          "timestamp": "2023-06-30T20:56:18+02:00",
          "tree_id": "bc6e92371c30e22b7af43428218f61e9ea3dd9ed",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/499c49677bb6994df13a2642e4d04403f77bf42d"
        },
        "date": 1688151586648,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33587,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33290,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29407,
            "range": "±7.95%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32296,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30932,
            "range": "±2.70%",
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
          "id": "49cf0845b5234f4c8483c58ff6aeeb6bf7155ccf",
          "message": "Common: Fix genesis parsing for 4844 (#2847)\n\n* fix for genesis mismatch\r\n\r\n* fix for genesis mismatch\r\n\r\n* blockchain: remove unnecessary genesis field\r\n\r\n---------\r\n\r\nCo-authored-by: spencer-tb <spencer@spencertaylorbrown.uk>",
          "timestamp": "2023-07-03T12:01:55+02:00",
          "tree_id": "df91ed54f91f43da6a16b4ceb1dcdbc730fef69f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/49cf0845b5234f4c8483c58ff6aeeb6bf7155ccf"
        },
        "date": 1688378761023,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32282,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31942,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31934,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26421,
            "range": "±10.56%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30605,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "629c80f42d84f76ec96186b06f3dabd2caa352fa",
          "message": "VM/SM/Blockchain/Trie/EVM: Copy() -> shallowCopy() function renaming (#2826)\n\n* Rename vm copy function to shallowCopy\r\n\r\n* Rename StateManager copy function to shallowCopy\r\n\r\n* Rename evm copy function to shallowCopy\r\n\r\n* Rename Blockchain copy function to shallowCopy\r\n\r\n* Fix interface copy function naming\r\n\r\n* Rename Trie copy function to shallowCopy\r\n\r\n* Fix tests\r\n\r\n* Fix tests\r\n\r\n* Fix test\r\n\r\n* Update mocked objects in tests to reflect naming change\r\n\r\n* Fix test\r\n\r\n* Update examples and recipes to reflect naming changes\r\n\r\n* Fix tests\r\n\r\n* Update documentation to reflect naming changes\r\n\r\n* Update benchmarks and tests\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-03T13:09:25+02:00",
          "tree_id": "2f1df6dbd0d96b9e45a954301ad853ee68af557d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/629c80f42d84f76ec96186b06f3dabd2caa352fa"
        },
        "date": 1688382784302,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32186,
            "range": "±5.50%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32182,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31939,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25988,
            "range": "±11.24%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30742,
            "range": "±3.07%",
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
          "id": "d7131f555e3332955e5fab45cb9036f5b7fdb5b4",
          "message": "Update function docs to detail shallow copy behavior (#2855)",
          "timestamp": "2023-07-04T15:44:15+02:00",
          "tree_id": "e96ec5e98b72cbc58aaa2c4bf433e54551d725f4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d7131f555e3332955e5fab45cb9036f5b7fdb5b4"
        },
        "date": 1688478466025,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33924,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33799,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33266,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28587,
            "range": "±8.85%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31723,
            "range": "±2.50%",
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
          "id": "5f8552fedb45314bc4594d0978e64ff44abb835c",
          "message": "Monorepo: make _* methods protected / _common -> common (#2857)\n\n* Common: switch to a separated EventEmitter structure (API cleanliness)\r\n\r\n* EVM: added additional shallowCopy() test for event emitter functionality\r\n\r\n* Test fixes\r\n\r\n* Common: _* methods/properties -> protected\r\n\r\n* Common: make getInitializedChains() public\r\n\r\n* Tx: _* methods/properties -> protected\r\n\r\n* Block: _* methods/properties -> protected\r\n\r\n* Block: _common -> common\r\n\r\n* Small fix\r\n\r\n* Blockchain: _common -> common\r\n\r\n* EVM/VM: _common -> common\r\n\r\n* Client: _common -> common\r\n\r\n* Lint fixes\r\n\r\n* Client test fixes\r\n\r\n* Trie: _* methods/properties -> protected\r\n\r\n* StateManager: _* methods/properties -> protected\r\n\r\n* EVM: _* methods/properties -> protected",
          "timestamp": "2023-07-04T17:17:31+02:00",
          "tree_id": "5a562e8d13d31aa72ffd747a6ebae0e20a927606",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5f8552fedb45314bc4594d0978e64ff44abb835c"
        },
        "date": 1688484086205,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31781,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32122,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31764,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26578,
            "range": "±10.02%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30343,
            "range": "±3.19%",
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
          "id": "ef133de3c1de045b55abe0b441d74eb901e39227",
          "message": "monorepo/Util: deprecate node 16 / remove Node.js fetch primitive (#2859)\n\n* util: remove https usage\r\n\r\n* monorepo: update engine to node >=18\r\n\r\n* ci: update to node 18\r\n\r\n* monorepo: update monorepo and libp2pbrowser node version\r\n\r\n* monorepo: update @types/node\r\n\r\n* util: remove fetch check from test",
          "timestamp": "2023-07-05T10:29:09+02:00",
          "tree_id": "6bc830a8f201ba912300de9c74a96fcd4b35d001",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ef133de3c1de045b55abe0b441d74eb901e39227"
        },
        "date": 1688546523426,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21614,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21076,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19072,
            "range": "±9.90%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20959,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19682,
            "range": "±3.65%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "79761c10225c03e6d52517289c87baca45ab99e6",
          "message": "blockchain: remove genesis state dependancy from blockchain (#2844)\n\n* blockchain: remove genesis state dependancy from blockchain\r\n\r\nfix the blockchain init and statepassing from client\r\n\r\npass custom genesis from client's chain to blockchain\r\n\r\nsimplify stateroot fetch\r\n\r\nremove need to genesis state in blockchain\r\n\r\nremove package dependancy\r\n\r\nrebase fixes\r\n\r\nlint\r\n\r\nfix statemanager spec\r\n\r\nfix vm spec\r\n\r\nfix client spec\r\n\r\nfix client spec\r\n\r\n* lint\r\n\r\n* address genesisstate in test helper\r\n\r\n* fix client spec\r\n\r\n* add as a dev dependancy in trie for tests\r\n\r\n* cleanup genesis state references in client and add some comments\r\n\r\n* further cleanup genesis state passing\r\n\r\n* improve jsdocs\r\n\r\n* fix jsdocs\r\n\r\n* fix client sim runner",
          "timestamp": "2023-07-05T13:43:30+02:00",
          "tree_id": "731d22d29ff370032d20741d98111156a5678f46",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79761c10225c03e6d52517289c87baca45ab99e6"
        },
        "date": 1688558470462,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31468,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30817,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31045,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26237,
            "range": "±9.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29432,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "11f48f3182a228725210f46c04702755db792349",
          "message": "monorepo: fix tsc errors (#2864)",
          "timestamp": "2023-07-05T20:35:46-04:00",
          "tree_id": "8794aef70e860aa0f7dde6829107845301269e3e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11f48f3182a228725210f46c04702755db792349"
        },
        "date": 1688603960176,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31235,
            "range": "±4.79%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31177,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30909,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26491,
            "range": "±9.59%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29667,
            "range": "±3.11%",
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
          "id": "4c6b4bf84c6ddb63938df54c204c7a8b7ddacb69",
          "message": "devp2p: type improvements & cleanup (#2863)\n\n* devp2p: refactor types into src/types and type kbucketOptions\r\n\r\n* devp2p: migrate additional types to src/types.ts\r\n\r\n* devp2p: PeerOptions interface\r\n\r\n* devp2p: address sendMessage performance issue (useless debug message encoding)\r\n\r\n* devp2p: type node-ip utils\r\n\r\n* devp2p: improve types and get rid of most anys\r\n\r\n* devp2p: refactor arrayEquals with equalsBytes\r\n\r\n* client: fix RlpxSender protocol type issue\r\n\r\n* devp2p rename CustomContact to Contact and small typedoc fix\r\n\r\n* devp2p: remove unnecessary !\r\n\r\n* devp2p: declare debugMsgs inline instead of prior to debug call\r\n\r\n* devp2p: rename ProtocolLabel -> ProtocolType\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-06T09:44:29+02:00",
          "tree_id": "5f65669e3588cc0cb8fe431d379ca385b81e00b2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4c6b4bf84c6ddb63938df54c204c7a8b7ddacb69"
        },
        "date": 1688629750621,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20012,
            "range": "±5.97%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19504,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19825,
            "range": "±3.56%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17663,
            "range": "±10.21%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19030,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "4caa60785dfa066fe23db17cddef54127f5c4fcd",
          "message": "EVM runCode/runCall type cleanup (#2861)\n\n* evm: rename runCode to -> address\r\n\r\n* evm: remove pc option runCode\r\n\r\n* evm: unify interfaces\r\n\r\n* vm: fix vm tests\r\n\r\n* evm: re-introduce pc opt\r\n\r\n* evm: StateManager is now optional\r\n\r\n* evm: remove EVMInterface",
          "timestamp": "2023-07-06T11:46:40+02:00",
          "tree_id": "66942778ed2282d9bd6102572576e79e7b84682f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4caa60785dfa066fe23db17cddef54127f5c4fcd"
        },
        "date": 1688637081929,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19193,
            "range": "±6.79%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20116,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18814,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18402,
            "range": "±6.33%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19498,
            "range": "±3.48%",
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
          "id": "642bb0dfe0241a222a77d21db46c6d8e23b6f35f",
          "message": "evm: rename EVMOpts -> EVMCreateOpts (#2866)",
          "timestamp": "2023-07-06T13:11:30-04:00",
          "tree_id": "3a306747423c165c2966520d2f7f37d60463df4b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/642bb0dfe0241a222a77d21db46c6d8e23b6f35f"
        },
        "date": 1688663717827,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31178,
            "range": "±4.67%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30432,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30584,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25149,
            "range": "±9.97%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29112,
            "range": "±3.48%",
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
          "id": "2828cac296397cdace0be2794c918452f9cfcbc6",
          "message": "Add examples run to CI for all packages (#2862)\n\n* Add examples run to CI for all packages\r\n\r\n* Change ethash example files from ts to cts extension\r\n\r\n* Remove unused import\r\n\r\n* Set timeout on devp2p simple connection example\r\n\r\n* Remove examples run from genesis package",
          "timestamp": "2023-07-06T11:46:29-07:00",
          "tree_id": "12c42cd8eb043105383707669b231d98d4362bad",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2828cac296397cdace0be2794c918452f9cfcbc6"
        },
        "date": 1688669441864,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25810,
            "range": "±5.51%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25691,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26113,
            "range": "±3.33%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26034,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20282,
            "range": "±11.60%",
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
          "id": "364e80450d73d9e05b572f8f6d0713abc354d36f",
          "message": "evm/types: rename EVMCreateOpts -> EVMRunOpts (#2868)\n\n* evm/types: rename EVMCreateOpts -> EVMRunOpts\r\n\r\n* EVM: EVMCreateOpts -> EVMOpts\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-10T09:53:26+02:00",
          "tree_id": "aab0a556406e73cb3aaa0afb41e44c1b0cb7350d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/364e80450d73d9e05b572f8f6d0713abc354d36f"
        },
        "date": 1688975816717,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33207,
            "range": "±4.19%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31982,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32028,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28060,
            "range": "±8.34%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30391,
            "range": "±2.64%",
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
          "id": "31aa264005b655f2fc59ad18ec28ae2418d5da70",
          "message": "Remove BLS EIP 2537 (remove mcl-wasm package) (#2870)\n\n* monorepo: remove BLS / EIP 2537 / mcl-wasm\r\n\r\n* evm: remove unnecessary async EVM.create\r\n\r\n* evm: lint",
          "timestamp": "2023-07-10T13:15:11+02:00",
          "tree_id": "7e053b37a6a25c42cafaa3a9e7fe3de428c1473d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/31aa264005b655f2fc59ad18ec28ae2418d5da70"
        },
        "date": 1688988084011,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33068,
            "range": "±4.33%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32441,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32261,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27864,
            "range": "±9.44%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30574,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0747b4cac564200c4b5ee711ff01738ab558f8b1",
          "message": "Fix incomplete imports (#2871)",
          "timestamp": "2023-07-10T09:45:45-04:00",
          "tree_id": "02f65410c7180c403a13c926d133884d3095e41a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0747b4cac564200c4b5ee711ff01738ab558f8b1"
        },
        "date": 1688997382889,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31034,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31004,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30973,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25733,
            "range": "±9.86%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29706,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "786a244c8e709844fcc5c3a4185daa6f9740950a",
          "message": "Update `EthersStateManager`  (#2873)\n\n* Update ethersStateManager caching logic\r\n\r\n* empty\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-07-10T17:58:39-04:00",
          "tree_id": "382f9ed9611504adf12369b92e35e2f4c913f95f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/786a244c8e709844fcc5c3a4185daa6f9740950a"
        },
        "date": 1689026809084,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24907,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25001,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24642,
            "range": "±3.57%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24476,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19810,
            "range": "±11.27%",
            "unit": "ops/sec",
            "extra": "67 samples"
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
          "id": "0ccc16baf88c9e9b1252988c5364c293f79ee4f4",
          "message": "evm/vm: reintroduce evm interface (#2869)\n\n* evm/vm: reintroduce evm interface\r\n\r\n* evm: fix client build\r\n\r\n* vm: fix test runner\r\n\r\n* vm/evm: fix imports\r\n\r\n* evm/vm: reportAccessList -> startReportingAccessList\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-07-11T09:54:09+02:00",
          "tree_id": "51918dc17809162b54897a8fc314ad02a3b6adeb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0ccc16baf88c9e9b1252988c5364c293f79ee4f4"
        },
        "date": 1689062251169,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32953,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32370,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30767,
            "range": "±5.34%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28263,
            "range": "±9.08%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30310,
            "range": "±2.57%",
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
          "id": "0ea9df31d2de028bec02bf1f9613bd67701f37e0",
          "message": "Pre-Releases for Breaking Releases (RC1) (#2832)\n\n* Common: add first version of Buffer -> Uint8Array upgrade guide to CHANGELOG\r\n\r\n* Consolidate extensive Buffer -> Uint8Array guidance in Util README docs\r\n\r\n* Further simplify Buffer -> Uint8Array CHANGELOG library update section, add Util CHANGELOG entry\r\n\r\n* RLP, Tx: added Buffer -> Uint8Array CHANGELOG entries\r\n\r\n* Trie: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Devp2p: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Ethash: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Wallet: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Block: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Blockchain: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* StateManager: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* EVM: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* Util: update README upgrade helper section with updated hex <-> bytes method names\r\n\r\n* VM: added Buffer -> Uint8Array CHANGELOG entry\r\n\r\n* First round 4844 section for tx\r\n\r\n* StateManager: added refactoring / Caches / API Changes sections\r\n\r\n* Client: add new section for caches and 4844\r\n\r\n* Added HF section to various libraries (Shanghai default, Merge -> Paris, Cancun)\r\n\r\n* Various single change additions\r\n\r\n* Blockchain/Ethash/Trie: add Blockchain section and Ethash/Trie entries on DB abstraction\r\n\r\n* Add EEI/StateManager refactoring sections to EVM/VM CHANGELOG entries\r\n\r\n* Add Block L2 constructor section, several 4844 entries\r\n\r\n* First CJS/ESM section draft, additional change entries\r\n\r\n* Add dedicated Wallet introduction section\r\n\r\n* New 4844 sections for block, evm and VM, separate additions\r\n\r\n* Add KZG setup, tx blobsData sections, other separate additions (mainly 4844)\r\n\r\n* Add genesis package CHANGELOG entry, hardforkBy sections, separate additions\r\n\r\n* Add sections for block, tx validation method clean-up, EIP-6780 (SELFDESTRUCT in same tx), EIP-5656 (MCOPY), EVM opcode renamings\r\n\r\n* Expand hybrid CJS/ESM build section to all libraries\r\n\r\n* Various additions\r\n\r\n* Add prefixed hex string as default sections\r\n\r\n* Add Blockchain/VM sections for removed genesis dependency, devp2p section for typing and clean-up, other separate additions (removed Nodejs. 16 support)\r\n\r\n* Update packages/block/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/block/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/blockchain/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/evm/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/evm/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/rlp/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Update packages/vm/CHANGELOG.md\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Correct Buffer -> Uint8Array instructions\r\n\r\n* Small semantics change in Buffer -> Uint8Array section\r\n\r\n* Small changes\r\n\r\n* Add Cancun limited-EIPs note\r\n\r\n* Review updates\r\n\r\n* More review additions\r\n\r\n---------\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-07-11T13:50:07+02:00",
          "tree_id": "c4e3826198682a2870aea9bba4a59ea84d9ce25b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0ea9df31d2de028bec02bf1f9613bd67701f37e0"
        },
        "date": 1689076425148,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30277,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30152,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30297,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25475,
            "range": "±9.57%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28926,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "d2e8926cfd4f34362a18c0e45e20f44010da1351",
          "message": "Use ethereum-cryptography version 2.1.1 (#2879)\n\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-07-12T11:50:22-04:00",
          "tree_id": "062bbd1c752fae726c2c8feb1346c7832ba507cc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2e8926cfd4f34362a18c0e45e20f44010da1351"
        },
        "date": 1689177287841,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27263,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27404,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26864,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26647,
            "range": "±3.57%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21609,
            "range": "±11.79%",
            "unit": "ops/sec",
            "extra": "72 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0486f5a314d14e14ecc1b1b87e4cde3c7fe55366",
          "message": "Update eslint config with file extensions rule (#2881)\n\n* Turn on file extension eslint rule\n\n* Fix genesis linter\n\n* lint fixes\n\n* Add browser CI fixes",
          "timestamp": "2023-07-12T15:01:06-04:00",
          "tree_id": "37cf23ac83e7ce0fbf436aebb2ef8d1a44c8ba11",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0486f5a314d14e14ecc1b1b87e4cde3c7fe55366"
        },
        "date": 1689188674101,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32699,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32012,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31870,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27870,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30613,
            "range": "±2.57%",
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
          "id": "4b9a2288675dc679b72b04afeecc567a54736045",
          "message": "Troubleshoot discrepancies in codecov results (#2878)\n\n* Use just the coverage flag with vitest for the coverage script\r\n\r\n* Explicitly include codecov-actions@v3 import and flags for common\r\n\r\n* Use codecov-action@v3 with explicit flag in workflows for relevant packages\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-07-12T14:29:11-07:00",
          "tree_id": "6d55ad0548fd7017a5ac4da5f883fda7437fa471",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4b9a2288675dc679b72b04afeecc567a54736045"
        },
        "date": 1689197601374,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25723,
            "range": "±5.77%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26049,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25424,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25576,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20283,
            "range": "±11.66%",
            "unit": "ops/sec",
            "extra": "67 samples"
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
          "id": "b37557104af4d0a8084e01d6d6b7caae98e6deff",
          "message": "evm/vm: update TSTORE/TLOAD opcode byte (#2884)",
          "timestamp": "2023-07-13T11:57:09+02:00",
          "tree_id": "38c4a6534e112472b191f75e5520a41e1b18c20e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b37557104af4d0a8084e01d6d6b7caae98e6deff"
        },
        "date": 1689242526473,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32955,
            "range": "±5.15%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32096,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31974,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27228,
            "range": "±8.97%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30202,
            "range": "±2.63%",
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
          "id": "d196a05b116cda7b57233cf582f3f404d5bc89af",
          "message": "Move EVMOpts to types in EVM (#2885)\n\n* evm: move EVMOpts to types file\r\n\r\n* evm: remove stateManager from precompile inputs",
          "timestamp": "2023-07-13T12:39:46+02:00",
          "tree_id": "a2e75b0100206983805d39275468c501a7541d5b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d196a05b116cda7b57233cf582f3f404d5bc89af"
        },
        "date": 1689244990538,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32622,
            "range": "±4.12%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32240,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32132,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27870,
            "range": "±7.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29958,
            "range": "±2.67%",
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
          "id": "b039efead13d27fd5da95bf33b2b4f8ddd5e48eb",
          "message": "Update ethereum-cryptography from v2.1.1 -> v2.1.2 (#2882)\n\n* Update ethereum-cryptography from v2.1.1 -> v2.1.2\r\n\r\n* Rebuild package-lock.json",
          "timestamp": "2023-07-13T13:10:31+02:00",
          "tree_id": "a7988113f3d7d6df20d4bb1cd386deba8d3afac8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b039efead13d27fd5da95bf33b2b4f8ddd5e48eb"
        },
        "date": 1689246886645,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31547,
            "range": "±4.33%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30451,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30882,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25778,
            "range": "±10.28%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29418,
            "range": "±3.12%",
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
          "id": "fc80b2e1797b3a2718e68180101509693c771772",
          "message": "VM/genesis: fix small genesis API inconsistency, add test (#2886)",
          "timestamp": "2023-07-13T13:48:13+02:00",
          "tree_id": "4a68b60b7a571de4168c2b0b3552540819b6c7d9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fc80b2e1797b3a2718e68180101509693c771772"
        },
        "date": 1689249101888,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33016,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31803,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31764,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28073,
            "range": "±8.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30769,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "konjou@gmail.com",
            "name": "acolytec3",
            "username": "acolytec3"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88b54028b3a2807e07eea965282ef6eb489ca369",
          "message": "docs updates (#2887)",
          "timestamp": "2023-07-13T23:32:21+05:30",
          "tree_id": "803f29a1fc4e1beb51c6374e5c83748095e1d04c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/88b54028b3a2807e07eea965282ef6eb489ca369"
        },
        "date": 1689271634396,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18013,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18209,
            "range": "±3.94%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18182,
            "range": "±3.57%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18929,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16784,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "77 samples"
          }
        ]
      }
    ]
  }
}