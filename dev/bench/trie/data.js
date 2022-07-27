window.BENCHMARK_DATA = {
  "lastUpdate": 1658930802441,
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
          "id": "5b1da6a5f5856ce079a86552ab5246105501972b",
          "message": "VM/EVM: Update and align README Documentation (#2016)\n\n* EVM: adopt README links\r\n\r\n* VM/EVM -> README : added distinkt introductory texts for the libraries\r\n\r\n* EVM: update README code example\r\n\r\n* VM -> README: added more fitting (and working) VM example\r\n\r\n* VM/EVM: example updates/fixes and moving around\r\n\r\n* VM/EVM -> README: added new sections on EVM/VM relationship\r\n\r\n* VM/EVM -> README: added EEI and State sections to EVM and VM READMEs\r\n\r\n* EVM/VM -> README: unify, adopt and deduplicate Chain Type, Hardfork, Genesis State and EIP sections\r\n\r\n* EVM/VM -> README: adopt event sections\r\n\r\n* EVM/VM -> README: adopt debug logger and internal structure sections\r\n\r\n* EVM/VM -> README: deduplicate Development docs",
          "timestamp": "2022-07-07T10:30:16+02:00",
          "tree_id": "e754999bd1fc0224d787f85580ea6943870d6633",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b1da6a5f5856ce079a86552ab5246105501972b"
        },
        "date": 1657182917276,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27511,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25403,
            "range": "±9.97%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27942,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27034,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45233,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 797,
            "range": "±7.09%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±68.95%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 78.35,
            "range": "±12.60%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.24,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "b30f914aeef2ca0bca2937f3e2674f1ff65b2426",
          "message": "Monorepo: remove default exports (#2018)\n\n* Monorepo: remove default exports and adjust imports in non-test files\r\n\r\n* Monorepo: adjust removal of default exports in test files\r\n\r\n* Monorepo: add no-default-export eslint rule\r\n\r\n* Monorepo: update README with non-default named imports",
          "timestamp": "2022-07-08T10:43:48+02:00",
          "tree_id": "16335b0243822917e43ab8ca67f35598a757c024",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b30f914aeef2ca0bca2937f3e2674f1ff65b2426"
        },
        "date": 1657270147145,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27283,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25360,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27904,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27633,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45904,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 831,
            "range": "±6.41%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 99.82,
            "range": "±66.66%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.08,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.36,
            "range": "±24.43%",
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
          "id": "12a81f6ca9205d5d4fc7668b67027ce4f950f20d",
          "message": "master-vm-copy-bug (#2027)\n\n* vm: include hardfork options in VM.copy()\r\n\r\n* vm: edit vm.copy() to only copy evm and derive rest\r\n\r\n* vm: add new tests for copying hardfork options\r\n\r\n* evm: add tests for copying of customOpcodes and customPrecompiles",
          "timestamp": "2022-07-08T11:16:40+02:00",
          "tree_id": "f61c2155bb2e149dd0e949d48ee1017bff609589",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/12a81f6ca9205d5d4fc7668b67027ce4f950f20d"
        },
        "date": 1657272067413,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32906,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30157,
            "range": "±8.81%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32928,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31444,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52636,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 954,
            "range": "±6.81%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 181,
            "range": "±9.16%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.18,
            "range": "±19.95%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.01,
            "range": "±92.11%",
            "unit": "ops/sec",
            "extra": "22 samples"
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
          "id": "01f38c8db0b962fe039c0c74ee76261e4f4014c4",
          "message": "Fix consensus validation bugs (#2031)\n\n* client: fix extradata in devnet settings\r\n* block: move consensus format validation to corret place",
          "timestamp": "2022-07-09T14:49:39-04:00",
          "tree_id": "95220d0e75e4ec28c0919936183e8e4a4c3460db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/01f38c8db0b962fe039c0c74ee76261e4f4014c4"
        },
        "date": 1657392840863,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33045,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30711,
            "range": "±6.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32230,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31853,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53765,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 749,
            "range": "±42.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 193,
            "range": "±5.99%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.83,
            "range": "±17.02%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.27,
            "range": "±58.61%",
            "unit": "ops/sec",
            "extra": "34 samples"
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
          "id": "11636eba74911bb1daaa9632875a6da060568a71",
          "message": "Further README Updates (#2028)\n\n* Block README update\r\n\r\n* Blockchain README update\r\n\r\n* Updated Common README, added generic BigInt Support section\r\n\r\n* StateManager README update\r\n\r\n* Trie README update\r\n\r\n* Util README update\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-11T11:14:13+02:00",
          "tree_id": "71c0cac7809cdee9c460e6f6f9d6d7b46197b4d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11636eba74911bb1daaa9632875a6da060568a71"
        },
        "date": 1657531159368,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 28140,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25783,
            "range": "±9.15%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27604,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27469,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45091,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 830,
            "range": "±6.40%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±67.93%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.17,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.72,
            "range": "±21.16%",
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
          "id": "964c5f51fbd339d925a8c39293f5d90ca4a7b696",
          "message": "Rename evm loggers (#2029)\n\n* Rename evm loggers\r\n\r\n* update readme\r\n\r\n* Correct typedoc links and comments\r\n\r\n* Various comment/readme updates\r\n\r\n* address feedback\r\n\r\n* fix import in readme",
          "timestamp": "2022-07-11T15:33:10+02:00",
          "tree_id": "53a80f9c02d973fbf402118b5704d923e1d8a028",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/964c5f51fbd339d925a8c39293f5d90ca4a7b696"
        },
        "date": 1657546664695,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33346,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30445,
            "range": "±9.22%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 33303,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32038,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53321,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 729,
            "range": "±50.25%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 189,
            "range": "±10.45%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.03,
            "range": "±18.98%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.56,
            "range": "±68.75%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "406372c11238b7f8f581a11ed2dde3478d40f38f",
          "message": "common: Update sepolia and ropsten configs for merge (#2005)\n\n* Update sepolia and ropsten configs for merge\r\n\r\n* add some bootnodes",
          "timestamp": "2022-07-12T17:06:19+05:30",
          "tree_id": "5428a2103611adf14ad9e8debc589450544a8441",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/406372c11238b7f8f581a11ed2dde3478d40f38f"
        },
        "date": 1657626048520,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33109,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30787,
            "range": "±7.23%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32501,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32056,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54813,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 787,
            "range": "±44.26%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 204,
            "range": "±7.58%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 73.38,
            "range": "±49.83%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.9,
            "range": "±16.57%",
            "unit": "ops/sec",
            "extra": "39 samples"
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
          "id": "8cc3a00273e8534c395d35f8ca972c5a249b55f8",
          "message": "Common, Client: added Sepolia DNS config and activation (#2034)",
          "timestamp": "2022-07-12T17:51:06+02:00",
          "tree_id": "4408ae8dc2dddc4c49f3a8cf842ae2d021d2143d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cc3a00273e8534c395d35f8ca972c5a249b55f8"
        },
        "date": 1657641379455,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 26335,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23730,
            "range": "±9.71%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26699,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 25771,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 42148,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 766,
            "range": "±6.61%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 159,
            "range": "±8.54%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 77.22,
            "range": "±10.85%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.84,
            "range": "±27.23%",
            "unit": "ops/sec",
            "extra": "28 samples"
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
          "id": "c17346ce62a0725800b89d180ca3c98d3ced79c1",
          "message": "Monorepo: eslint strict boolean expressions (#2030)\n\n* Monorepo: add @typescript-eslint/strict-boolean-expressions rule\r\n\r\n* util: isFalsy and isTruthy utils\r\n\r\n* blockchain: apply strict-boolean-expressions\r\n\r\n* util: apply strict-boolean-expressions\r\n\r\n* common: apply strict-boolean-expressions\r\n\r\n* tx: apply strict-boolean-expressions\r\n\r\n* trie: apply strict-boolean-expressions\r\n\r\n* evm: apply strict-boolean-expressions\r\n\r\n* devp2p: apply strict-boolean-expressions\r\n\r\n* vm: apply strict-boolean-expressions\r\n\r\n* stateManager: apply strict-boolean-expressions\r\n\r\n* ethash: apply strict-boolean-expressions\r\n\r\n* rlp: apply strict-boolean-expressions\r\n\r\n* block: apply strict-boolean-expressions\r\n\r\n* client: apply strict-boolean-expressions",
          "timestamp": "2022-07-13T11:38:30+02:00",
          "tree_id": "9f0b5b3674ef7b01add07c45ceb0da9a17bf4a3e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c17346ce62a0725800b89d180ca3c98d3ced79c1"
        },
        "date": 1657705375348,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32887,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 31005,
            "range": "±6.25%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32385,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32059,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53390,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 761,
            "range": "±43.43%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 197,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.63,
            "range": "±16.07%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.52,
            "range": "±57.10%",
            "unit": "ops/sec",
            "extra": "38 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jaypuntambekar@gmail.com",
            "name": "Jay Puntham-Baker",
            "username": "peebeejay"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a60b878c377a55cd17a6e633a59bc4400713eddb",
          "message": "[README] Add GitPOAP Badge to Display Number of Minted GitPOAPs for Contributors (#2035)",
          "timestamp": "2022-07-13T11:40:22+02:00",
          "tree_id": "b1b205635638e99482a9e940eb898d98a8e8a743",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a60b878c377a55cd17a6e633a59bc4400713eddb"
        },
        "date": 1657706687391,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33198,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30686,
            "range": "±7.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32859,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32352,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54139,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 813,
            "range": "±34.38%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 191,
            "range": "±9.67%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 92.63,
            "range": "±18.64%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.52,
            "range": "±8.48%",
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
          "id": "22a30ae3c421f9bc94831c1c3d637f373cc60b76",
          "message": "Miscellaneous fixes/improvements for evm, client, consensus and crypto (#2040)\n\n* Miscellaneous fixes/improvements for evm, client, consensus and crypto\r\n\r\n* skip header validation while runBlock if block picked from blockchain\r\n\r\n* update the ethereum-cryptography to 1.1.2 with 0 msgHash fix",
          "timestamp": "2022-07-15T11:16:16+02:00",
          "tree_id": "c2986abf5a61b6fb7e8063fcd6dbdf2d38375e07",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/22a30ae3c421f9bc94831c1c3d637f373cc60b76"
        },
        "date": 1657876862503,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33459,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30931,
            "range": "±7.17%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32834,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32261,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54217,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 784,
            "range": "±45.26%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 199,
            "range": "±7.86%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 105,
            "range": "±4.45%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.77,
            "range": "±86.09%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "3f319fefda8fbcea86ba177ef7a0a8e0ede18162",
          "message": "EVM: set sensible default caller account nonce (#2010)",
          "timestamp": "2022-07-15T12:36:09+02:00",
          "tree_id": "c53014eaca99bea17c422f341889e2cdfde54456",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3f319fefda8fbcea86ba177ef7a0a8e0ede18162"
        },
        "date": 1657881673025,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 29030,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24865,
            "range": "±11.06%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 28666,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 28882,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45566,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 858,
            "range": "±7.12%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 112,
            "range": "±45.48%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 81.26,
            "range": "±5.84%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.79,
            "range": "±24.60%",
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
          "id": "95433951d9a6c1e30937d54a23edaf7683f34213",
          "message": "client: Add instructions for sepolia merge (#2044)\n\n* Add instructions for sepolia merge\r\n\r\n* Update README.md",
          "timestamp": "2022-07-15T13:34:00+02:00",
          "tree_id": "f5d5e89816d1195448885c27d5455bb781568269",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/95433951d9a6c1e30937d54a23edaf7683f34213"
        },
        "date": 1657885280519,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 28525,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 26041,
            "range": "±9.31%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 28928,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 28206,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 47256,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 796,
            "range": "±7.11%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 99.45,
            "range": "±67.25%",
            "unit": "ops/sec",
            "extra": "38 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 83.96,
            "range": "±10.87%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 17.66,
            "range": "±5.94%",
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
          "id": "e2dbb1740cc0048460f968e88b8f12e977b5b05b",
          "message": "Add issue templates for new packages (#2046)",
          "timestamp": "2022-07-15T10:39:12-04:00",
          "tree_id": "c90c30f12a28546109f139d0608c7289bb40c2fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e2dbb1740cc0048460f968e88b8f12e977b5b05b"
        },
        "date": 1657896310412,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 26806,
            "range": "±7.39%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 26118,
            "range": "±7.45%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26966,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26650,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 34001,
            "range": "±14.60%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 842,
            "range": "±6.16%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 172,
            "range": "±10.08%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 52.94,
            "range": "±72.00%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.69,
            "range": "±23.46%",
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
          "id": "93b8e7e1711d9a7bd46bf42c998b52c0524e17fd",
          "message": "client: Remove browser from default npm scripts (#2042)",
          "timestamp": "2022-07-15T11:16:57-04:00",
          "tree_id": "30350d9a9f0bb52006ae3b21c8b5f760c04263cf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/93b8e7e1711d9a7bd46bf42c998b52c0524e17fd"
        },
        "date": 1657899060174,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 28422,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 26653,
            "range": "±9.68%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 28977,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27922,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45841,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 862,
            "range": "±6.61%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±67.24%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.81,
            "range": "±5.34%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.2,
            "range": "±73.23%",
            "unit": "ops/sec",
            "extra": "29 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "liboliqi@gmail.com",
            "name": "libotony",
            "username": "libotony"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "319d42b0737b303f1ce5dac52913de3a950d31d7",
          "message": "Trie: allow customizing hash algorithm in trie options (#2043)",
          "timestamp": "2022-07-16T17:22:51+02:00",
          "tree_id": "6be3d2432ce08084c9d7532b35da1e695aa904a9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/319d42b0737b303f1ce5dac52913de3a950d31d7"
        },
        "date": 1657985215068,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 20289,
            "range": "±8.02%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19588,
            "range": "±6.93%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 20561,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 20398,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26180,
            "range": "±6.66%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 665,
            "range": "±16.17%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 180,
            "range": "±9.71%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 60.02,
            "range": "±59.54%",
            "unit": "ops/sec",
            "extra": "38 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.86,
            "range": "±4.71%",
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
          "id": "76b349c4005bf39694d9aec6e5755124255b3e6b",
          "message": "DevP2P: add snap protocol (#1883)\n\n* devp2p: add snap protocol\r\n\r\n* a small add for client\r\n\r\n* devp2p: Snap devp2p tests (#1893)\r\n\r\n* Add tests for SNAP protocol\r\n\r\n* Fix linting issues\r\n\r\n* Remove unneeded switch block\r\n\r\n* don't offer snap yet, try only consuming from other peers\r\n\r\n* prevent disconnect on snap on status timeout as no status handshake on snap\r\n\r\n* rebase fixes\r\n\r\n* fixes\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: Amir G <indigophi@protonmail.com>",
          "timestamp": "2022-07-16T17:45:28+02:00",
          "tree_id": "0fae0eaa0d4d44d64174b8ed9e7a25833944e772",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/76b349c4005bf39694d9aec6e5755124255b3e6b"
        },
        "date": 1657986550645,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22083,
            "range": "±8.79%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21393,
            "range": "±6.50%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 22281,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22356,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26058,
            "range": "±10.67%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 1051,
            "range": "±4.78%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 158,
            "range": "±45.59%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.74,
            "range": "±14.32%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.13,
            "range": "±58.67%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "12fa5375e80ae49ba32331b5e420dfcb3f755af2",
          "message": "Disable hardhat tests CI job (#2048)",
          "timestamp": "2022-07-16T18:09:56+02:00",
          "tree_id": "92a3b5c7573112a98c62d4e77acade7485712084",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/12fa5375e80ae49ba32331b5e420dfcb3f755af2"
        },
        "date": 1657988031133,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 20570,
            "range": "±8.47%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21337,
            "range": "±6.78%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21314,
            "range": "±7.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22303,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 23835,
            "range": "±14.22%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 971,
            "range": "±5.98%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 143,
            "range": "±49.25%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.05,
            "range": "±7.25%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.26,
            "range": "±5.64%",
            "unit": "ops/sec",
            "extra": "34 samples"
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
          "id": "2dd63b91109188e5b4f5b251f47aae756f7e1841",
          "message": "Sepolia (Beta 2) Releases (#2045)\n\n* Block -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Blockchain -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Common -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Devp2p -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Ethash -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* EVM -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* RLP -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* StateManager -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Trie -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Tx -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Util -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* VM -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Client -> Release: bumped version to v0.6.0, added CHANGELOG entry, updated README\r\n\r\n* Client: Minor Merge README updates\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Devp2p, Trie: added missing CHANGELOG entries\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-17T17:51:03+02:00",
          "tree_id": "ae3f4807277a75c74ca00369ce7bd05a1911255d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2dd63b91109188e5b4f5b251f47aae756f7e1841"
        },
        "date": 1658073652204,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 22381,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 20754,
            "range": "±7.27%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21958,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 21715,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 29833,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 846,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 125,
            "range": "±49.31%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.54,
            "range": "±5.74%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.14,
            "range": "±67.40%",
            "unit": "ops/sec",
            "extra": "23 samples"
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
          "id": "6de3232dcb508c8756495c287d4b86d5bb8a49c4",
          "message": "Ensure EVM runs when nonce is zero (#2054)\n\n* vm/evm: ensure accounts with zero nonce run in EVM\r\n\r\n* Revert default changes, fix tests\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-20T16:15:56+02:00",
          "tree_id": "62f73bbda86796d685da8e645de673b6b13f7ef1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6de3232dcb508c8756495c287d4b86d5bb8a49c4"
        },
        "date": 1658326810120,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 21838,
            "range": "±5.35%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22035,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 20880,
            "range": "±7.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22663,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31072,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 706,
            "range": "±10.56%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 173,
            "range": "±4.43%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.61,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.87,
            "range": "±70.82%",
            "unit": "ops/sec",
            "extra": "22 samples"
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
      }
    ]
  }
}