window.BENCHMARK_DATA = {
  "lastUpdate": 1658617020361,
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
          "id": "872e85ce17dc3a0635762f7957c05279b2e923d8",
          "message": "EVM: Cleanup EEI (#2003)\n\n* evm/vm: cleanup round 1\r\n\r\n* vm: mark some eei methods protected\r\n\r\n* evm: update EEI methods\r\n\r\n* client: fix build\r\n\r\n* evm: lint\r\n\r\n* client/vm/evm: fix tests\r\n\r\n* client: fix tests",
          "timestamp": "2022-06-30T09:39:37+02:00",
          "tree_id": "83f8ebbf3d31c26b247623b95f4f50d94364d469",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/872e85ce17dc3a0635762f7957c05279b2e923d8"
        },
        "date": 1656574994706,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28826,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27535,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27632,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25226,
            "range": "±7.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26999,
            "range": "±2.00%",
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
          "id": "c5260ba9add32f57921380abb32c2c1f9dc21de6",
          "message": "Monorepo: Beta 1 Releases (#1957)\n\n* Common -> Beta 1 Release: added Changelog entry\r\n\r\n* Util -> Beta 1 Release: added Changelog entry\r\n\r\n* Tx -> Beta 1 Release: added Changelog entry\r\n\r\n* Trie -> Beta 1 Release: added Changelog entry\r\n\r\n* Monorepo -> Beta 1 Release: Suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Trie, Common, Tx, Util -> Beta 1 Releases: Trie related review feedback, added esModuleInterop/allowSyntheticDefaultImports sections\r\n\r\n* Block -> Beta 1 Release: added CHANGELOG entry\r\n\r\n* Block -> Beta 1 Releases: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Blockchain -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Monorepo: added beta version numbers\r\n\r\n* Devp2p -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Ethash -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* RLP -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* StateManager -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* EVM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* VM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Block: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Blockchain: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Common: bumped version to 3.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Devp2p: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Ethash: bumped version to 2.0.0-beta.1, updated upstream dependency versions\r\n\r\n* EVM: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* RLP: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* StateManager: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Trie: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Tx: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Util: bumped version to 8.0.0-beta.1, updated upstream dependency versions\r\n\r\n* VM: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Monorepo: updated package-lock.json\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-30T11:21:53+02:00",
          "tree_id": "eb4eafb564f56a27a5c7b78e5bdf8c1476b7262e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5260ba9add32f57921380abb32c2c1f9dc21de6"
        },
        "date": 1656581169515,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25470,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22989,
            "range": "±6.08%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23552,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21367,
            "range": "±10.02%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24024,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "cfd7b7754490b072a035cceaba59c3dfb517effd",
          "message": "client: Fix rpc import broken after tuning off esModuleInterop (#2006)",
          "timestamp": "2022-07-01T15:03:22+05:30",
          "tree_id": "a163819c7e31d59f03a259e0ae75f8db6e3c4f3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfd7b7754490b072a035cceaba59c3dfb517effd"
        },
        "date": 1656668243920,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17721,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16575,
            "range": "±4.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17854,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17458,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17092,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "3ba0078675498af4287155d0a63d206422d3c9b0",
          "message": "evm: Remove vm example links (#2011)",
          "timestamp": "2022-07-04T14:48:20+02:00",
          "tree_id": "6131d4561972bf0baadbd5587024e5b9ed4f774c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ba0078675498af4287155d0a63d206422d3c9b0"
        },
        "date": 1656939180682,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14081,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14173,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13624,
            "range": "±5.63%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14846,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14980,
            "range": "±2.62%",
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
          "id": "6618e5551d3676221620f146357d9ecc485eec83",
          "message": "Blockchain: optional consensus (#2002)\n\n* blockchain: add optional consensus param\r\n\r\n* blockchain: add algorithm property to consensus\r\n\r\n* blockchain: rework consensus setup\r\n\r\n* fix examples\r\n\r\n* fix blockchain test runner\r\n\r\n* add more tests\r\n\r\n* add blockchain checks to clique\r\n\r\n* skip merge check on custom consensus\r\n\r\n* Fix consensus check and add more tests\r\n\r\n* lint fix",
          "timestamp": "2022-07-04T22:55:35+02:00",
          "tree_id": "5c9fa795f320946c0596a844563d17377c68526e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6618e5551d3676221620f146357d9ecc485eec83"
        },
        "date": 1656968428847,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15595,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14924,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14569,
            "range": "±6.43%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15037,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14746,
            "range": "±3.18%",
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
          "id": "5b1da6a5f5856ce079a86552ab5246105501972b",
          "message": "VM/EVM: Update and align README Documentation (#2016)\n\n* EVM: adopt README links\r\n\r\n* VM/EVM -> README : added distinkt introductory texts for the libraries\r\n\r\n* EVM: update README code example\r\n\r\n* VM -> README: added more fitting (and working) VM example\r\n\r\n* VM/EVM: example updates/fixes and moving around\r\n\r\n* VM/EVM -> README: added new sections on EVM/VM relationship\r\n\r\n* VM/EVM -> README: added EEI and State sections to EVM and VM READMEs\r\n\r\n* EVM/VM -> README: unify, adopt and deduplicate Chain Type, Hardfork, Genesis State and EIP sections\r\n\r\n* EVM/VM -> README: adopt event sections\r\n\r\n* EVM/VM -> README: adopt debug logger and internal structure sections\r\n\r\n* EVM/VM -> README: deduplicate Development docs",
          "timestamp": "2022-07-07T10:30:16+02:00",
          "tree_id": "e754999bd1fc0224d787f85580ea6943870d6633",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b1da6a5f5856ce079a86552ab5246105501972b"
        },
        "date": 1657182891209,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22479,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21282,
            "range": "±6.34%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21761,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21217,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18811,
            "range": "±9.63%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
        "date": 1657270098972,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25817,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24718,
            "range": "±5.53%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26139,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22289,
            "range": "±10.04%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24773,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1657272081049,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28507,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27098,
            "range": "±7.29%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27406,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23498,
            "range": "±12.30%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28639,
            "range": "±1.98%",
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
          "id": "01f38c8db0b962fe039c0c74ee76261e4f4014c4",
          "message": "Fix consensus validation bugs (#2031)\n\n* client: fix extradata in devnet settings\r\n* block: move consensus format validation to corret place",
          "timestamp": "2022-07-09T14:49:39-04:00",
          "tree_id": "95220d0e75e4ec28c0919936183e8e4a4c3460db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/01f38c8db0b962fe039c0c74ee76261e4f4014c4"
        },
        "date": 1657392816947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35654,
            "range": "±5.42%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35883,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31182,
            "range": "±9.21%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36052,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34068,
            "range": "±0.75%",
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
          "id": "11636eba74911bb1daaa9632875a6da060568a71",
          "message": "Further README Updates (#2028)\n\n* Block README update\r\n\r\n* Blockchain README update\r\n\r\n* Updated Common README, added generic BigInt Support section\r\n\r\n* StateManager README update\r\n\r\n* Trie README update\r\n\r\n* Util README update\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-11T11:14:13+02:00",
          "tree_id": "71c0cac7809cdee9c460e6f6f9d6d7b46197b4d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11636eba74911bb1daaa9632875a6da060568a71"
        },
        "date": 1657531154890,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19287,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18687,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19144,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18286,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18333,
            "range": "±5.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
        "date": 1657546680040,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16716,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15475,
            "range": "±7.67%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16384,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15977,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16321,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
        "date": 1657626056243,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28235,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27353,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27285,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24205,
            "range": "±11.36%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27725,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
        "date": 1657641320112,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 34326,
            "range": "±4.86%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 34837,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30860,
            "range": "±10.38%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 34877,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 33221,
            "range": "±0.50%",
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
          "id": "c17346ce62a0725800b89d180ca3c98d3ced79c1",
          "message": "Monorepo: eslint strict boolean expressions (#2030)\n\n* Monorepo: add @typescript-eslint/strict-boolean-expressions rule\r\n\r\n* util: isFalsy and isTruthy utils\r\n\r\n* blockchain: apply strict-boolean-expressions\r\n\r\n* util: apply strict-boolean-expressions\r\n\r\n* common: apply strict-boolean-expressions\r\n\r\n* tx: apply strict-boolean-expressions\r\n\r\n* trie: apply strict-boolean-expressions\r\n\r\n* evm: apply strict-boolean-expressions\r\n\r\n* devp2p: apply strict-boolean-expressions\r\n\r\n* vm: apply strict-boolean-expressions\r\n\r\n* stateManager: apply strict-boolean-expressions\r\n\r\n* ethash: apply strict-boolean-expressions\r\n\r\n* rlp: apply strict-boolean-expressions\r\n\r\n* block: apply strict-boolean-expressions\r\n\r\n* client: apply strict-boolean-expressions",
          "timestamp": "2022-07-13T11:38:30+02:00",
          "tree_id": "9f0b5b3674ef7b01add07c45ceb0da9a17bf4a3e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c17346ce62a0725800b89d180ca3c98d3ced79c1"
        },
        "date": 1657705582612,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35675,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36113,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31717,
            "range": "±10.36%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36261,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34457,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1657706426390,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31369,
            "range": "±6.82%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30857,
            "range": "±5.06%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30064,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24832,
            "range": "±14.31%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30040,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
        "date": 1657876917933,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16815,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15434,
            "range": "±8.15%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15688,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14765,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15204,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
        "date": 1657881607568,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35206,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36322,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30326,
            "range": "±10.47%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36487,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34420,
            "range": "±0.78%",
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
          "id": "95433951d9a6c1e30937d54a23edaf7683f34213",
          "message": "client: Add instructions for sepolia merge (#2044)\n\n* Add instructions for sepolia merge\r\n\r\n* Update README.md",
          "timestamp": "2022-07-15T13:34:00+02:00",
          "tree_id": "f5d5e89816d1195448885c27d5455bb781568269",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/95433951d9a6c1e30937d54a23edaf7683f34213"
        },
        "date": 1657885082852,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 34857,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35293,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31036,
            "range": "±9.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35178,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 33518,
            "range": "±0.42%",
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
          "id": "e2dbb1740cc0048460f968e88b8f12e977b5b05b",
          "message": "Add issue templates for new packages (#2046)",
          "timestamp": "2022-07-15T10:39:12-04:00",
          "tree_id": "c90c30f12a28546109f139d0608c7289bb40c2fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e2dbb1740cc0048460f968e88b8f12e977b5b05b"
        },
        "date": 1657896237733,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18852,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18575,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19439,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19233,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16874,
            "range": "±10.00%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
        "date": 1657898816101,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32280,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30336,
            "range": "±5.81%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30853,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27233,
            "range": "±11.11%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30837,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
        "date": 1657985218578,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12032,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11863,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11646,
            "range": "±5.57%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11935,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11764,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1657986529027,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23571,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22938,
            "range": "±3.61%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23182,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21045,
            "range": "±8.66%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23424,
            "range": "±1.46%",
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
          "id": "12fa5375e80ae49ba32331b5e420dfcb3f755af2",
          "message": "Disable hardhat tests CI job (#2048)",
          "timestamp": "2022-07-16T18:09:56+02:00",
          "tree_id": "92a3b5c7573112a98c62d4e77acade7485712084",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/12fa5375e80ae49ba32331b5e420dfcb3f755af2"
        },
        "date": 1657987995139,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23198,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22531,
            "range": "±4.55%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22864,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20785,
            "range": "±7.37%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23411,
            "range": "±1.32%",
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
          "id": "2dd63b91109188e5b4f5b251f47aae756f7e1841",
          "message": "Sepolia (Beta 2) Releases (#2045)\n\n* Block -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Blockchain -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Common -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Devp2p -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Ethash -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* EVM -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* RLP -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* StateManager -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Trie -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Tx -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Util -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* VM -> Beta 2 Release: updated CHANGELOG, bumped version, updated upstream dependency versions\r\n\r\n* Client -> Release: bumped version to v0.6.0, added CHANGELOG entry, updated README\r\n\r\n* Client: Minor Merge README updates\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Devp2p, Trie: added missing CHANGELOG entries\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-17T17:51:03+02:00",
          "tree_id": "ae3f4807277a75c74ca00369ce7bd05a1911255d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2dd63b91109188e5b4f5b251f47aae756f7e1841"
        },
        "date": 1658073753771,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 11896,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11779,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12037,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12013,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11799,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
        "date": 1658326810641,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12869,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12944,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12614,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12203,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12454,
            "range": "±3.02%",
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
          "id": "f805771c7cb5b57854f38885be2727918a45b183",
          "message": "Monorepo: only lint changed files (#2049)\n\n* only lint changed files on git push",
          "timestamp": "2022-07-20T11:30:27-04:00",
          "tree_id": "bc9d27e982d4ba7829ad203a5e45f945fbaf8996",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f805771c7cb5b57854f38885be2727918a45b183"
        },
        "date": 1658332164367,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20785,
            "range": "±4.03%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20060,
            "range": "±5.67%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20551,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20276,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18422,
            "range": "±9.78%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
        "date": 1658335015737,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22116,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21489,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21737,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19510,
            "range": "±7.91%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22099,
            "range": "±1.48%",
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
          "id": "d276fcc103533fdf7eec12b55f202efc74ceeea4",
          "message": "CI: ensure all hardforks and transitions run when there is a \"test all hardforks\" label on PR (#1901)\n\n* vm/tests: update CI\r\n* block: semi-address Berlin->London transition bug\r\n* vm: add test for transitionTests\r\n* ci: update runnerrs\r\n* common: fix test\r\n* vm: update test count\r\n* ci: add london",
          "timestamp": "2022-07-21T09:11:19-04:00",
          "tree_id": "2d1ddab2073a7f74b45aa72d2a55d43f4ca1e4c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d276fcc103533fdf7eec12b55f202efc74ceeea4"
        },
        "date": 1658409332145,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10624,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10380,
            "range": "±5.59%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10795,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10401,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10320,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
        "date": 1658543140647,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18436,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16982,
            "range": "±6.25%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17783,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17422,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17051,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
        "date": 1658617019830,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21034,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19979,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20768,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20380,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18477,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "76 samples"
          }
        ]
      }
    ]
  }
}