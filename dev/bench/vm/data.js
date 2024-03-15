window.BENCHMARK_DATA = {
  "lastUpdate": 1710465765048,
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
          "id": "a2da337d6801688cf9129057825bb68cf6ee92e1",
          "message": "Monorepo: Make some errors more detailed (#3260)\n\n* tx: better chain id error\r\n\r\n* tx: error msg with backwards compatibility\r\n\r\n* monorepo: various error messages improvements\r\n\r\n* Update packages/blockchain/src/blockchain.ts\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/block/src/header.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* statemanager: extra info on errors\r\n\r\n---------\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-02-08T10:08:47+01:00",
          "tree_id": "0d31fa10b209f0abf8ef78a5c74c7ec1d0937b89",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a2da337d6801688cf9129057825bb68cf6ee92e1"
        },
        "date": 1707383496233,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40773,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38722,
            "range": "±3.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39029,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37060,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35991,
            "range": "±6.07%",
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
          "id": "45d03366b29d6e36a16d2fa945f8194a74ba83eb",
          "message": "common: schedule cancun for mainnet (#3270)",
          "timestamp": "2024-02-08T16:05:26+01:00",
          "tree_id": "9b5535b2820576324a27decb926d0c73cac563d0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/45d03366b29d6e36a16d2fa945f8194a74ba83eb"
        },
        "date": 1707405024292,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40838,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38367,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39095,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37578,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36936,
            "range": "±2.48%",
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
          "id": "b258fd9fe5e23bf4d299e632c8d2a33c0ebc7009",
          "message": "New Releases (Dencun, ESM Refactor, Trie/SM Proof Functionality, WASM Crypto, Other) (#3261)\n\n* New CHANGELOG entry, update package.json version number, updated upstream dependency versions (RLP v5.0.2)\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Util v9.0.2)\r\n\r\n* Some root README mermaid graph dependency additions\r\n\r\n* Update ethereum-cryptography dependencies from v2.1.2 -> v2.1.3 (all libraries)\r\n\r\n* Update @ethereumjs/wallet dependency versions\r\n\r\n* First (partial) package-lock.json rebuild\r\n\r\n* Bump version, added CHANGELOG entry (Wallet v2.0.2)\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions, new custom crypto example (Common v4.2.0)\r\n\r\n* Additional documentation adjustments\r\n\r\n* Rebuild Common and Util docs\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Tx v5.2.0)\r\n\r\n* Update tx hardware wallet signing example\r\n\r\n* Rebuild tx docs\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Block v5.1.0)\r\n\r\n* Review adjustments\r\n\r\n* Partial package-lock.json update\r\n\r\n* Spelling nits\r\n\r\n* Fix md5 import\r\n\r\n* Minor\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Trie v6.1.0)\r\n\r\n* Trie: simpler createFromProof example name\r\n\r\n* Rebuild trie docs\r\n\r\n* Partial package-lock.json rebuild\r\n\r\n* Some trie README updates\r\n\r\n* Some more doc updates\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (StateManager v2.2.0)\r\n\r\n* Fix Verkle tests and rebuild StateManager docs\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Ethash v3.0.2)\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Genesis v0.2.1)\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Devp2p v6.1.0)\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (Blockchain v7.1.0)\r\n\r\n* Partially rebuild package-lock.json\r\n\r\n* Rebuild blockchain docs\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (EVM v2.2.0)\r\n\r\n* Partially rebuild package-lock.json\r\n\r\n* Some EVM test fixes (TypeScript only)\r\n\r\n* Rebuild EVM docs\r\n\r\n* Install peer deps in common\r\n\r\n* Make tx CI happy\r\n\r\n* Fix the correct example\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* New CHANGELOG entry, update README, update package.json version, updated upstream dependency versions (VM v7.2.0)\r\n\r\n* Rebuild VM docs\r\n\r\n* Client: bump version to v0.10, add CHANGELOG entry\r\n\r\n* chore: typo\r\n\r\n* chore: typo in eip number\r\n\r\n* chore: rename verkle trie to verkle tree for consistency\r\n\r\n* chore: typos\r\n\r\n* Rebuild package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-02-08T16:40:31+01:00",
          "tree_id": "859b42116d70f849c104b8a5f43cde58ba4ab6dc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b258fd9fe5e23bf4d299e632c8d2a33c0ebc7009"
        },
        "date": 1707407021380,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41218,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38534,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38744,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38820,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37029,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "ff43fc1908f960429fa55fb5e9eb69ad0ebd37fb",
          "message": "Hotfix Releases (Missing Trie debug dependency) (#3271)\n\n* Some README additions\r\n\r\n* Correct release date\r\n\r\n* Trie: add missing debug dependency, bumped version to v6.1.1, added CHANGELOG entry, updated upstream dependency versions\r\n\r\n* Bumped version, added CHANGELOG, updated upstream dependency versions (@ethereumjs/tx v5.2.1)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream dependency versions (@ethereumjs/devp2p v6.1.1)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream dependency versions (@ethereumjs/statemanager v2.2.1)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream dependency versions (@ethereumjs/block v5.1.1)\r\n\r\n* Rebuild package-lock.json",
          "timestamp": "2024-02-08T18:08:23+01:00",
          "tree_id": "d303957adc1495d9219fead82cf32b5ae18b0f62",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ff43fc1908f960429fa55fb5e9eb69ad0ebd37fb"
        },
        "date": 1707412283071,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39438,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38640,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38198,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35467,
            "range": "±4.61%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36476,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "11f3a9cd156f94f5390c46ef58c9cce066eb869f",
          "message": "Verkle Dependency-related Hotfix Releases (#3272)\n\n* Add verkle dependency to state manager, bump version, add CHANGELOG entrry, update upstream dependency versions\r\n\r\n* Bump version, add CHANGELOG entry, update upstream dependency versions (EVM v2.2.1)\r\n\r\n* Bump version, add CHANGELOG entry, update upstream dependency versions (VM v7.2.1)\r\n\r\n* Rebuild package-lock.json",
          "timestamp": "2024-02-08T20:06:38+01:00",
          "tree_id": "b48612ca45b258864c2a3e92a6cc080458078048",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11f3a9cd156f94f5390c46ef58c9cce066eb869f"
        },
        "date": 1707419390531,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41083,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38237,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38874,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38677,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38022,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "simon@klein-homepage.de",
            "name": "box25",
            "username": "simone1999"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c62cce0ce5c21294a07b15d02a511f9d5be8ccc3",
          "message": "fixed requests.msgTypes in devp2p/examples/peer-communication.ts (#2778)\n\nthe intended behaviour from the requests.msgTypes dict of counters seems to be different from what was implemented.\r\nWith this fix the message counter should probably count the amount of received messages per peer and message type.\r\nThis counter later is used to disconect from peers that did not broadcast any blocks while submitting 8 other requests with the same message type to this node.\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-14T13:32:18+01:00",
          "tree_id": "00fe0c1802eb9af8f61f923a7834d917af98c2eb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c62cce0ce5c21294a07b15d02a511f9d5be8ccc3"
        },
        "date": 1707914107176,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40400,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39618,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39353,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36587,
            "range": "±4.70%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37473,
            "range": "±2.25%",
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
          "id": "c68ad7aeaf1f616decc75491210d8ab8dde2ed67",
          "message": "Remove nodejs import from trie.ts (#3280)\n\n* Remove nodejs import from trie.ts\r\n\r\n* Remove async trie stream dependency",
          "timestamp": "2024-02-15T10:37:43+01:00",
          "tree_id": "260221332bb117ee12ca93d634bb3f521ec7f8c8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c68ad7aeaf1f616decc75491210d8ab8dde2ed67"
        },
        "date": 1707990032157,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40211,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38493,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39348,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36262,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37001,
            "range": "±2.23%",
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
          "id": "5d522f731f6bee1b8626a3558fa8c5d5c0f6ebbd",
          "message": "block: rpc: also parse parentBeaconBlockRoot (#3283)\n\n* block: rpc: also parse parentBeaconBlockRoot\r\n\r\n* block: add rpc test",
          "timestamp": "2024-02-15T11:05:03+01:00",
          "tree_id": "184e6a80d812b62ff303d5155ecd41dfd00030cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5d522f731f6bee1b8626a3558fa8c5d5c0f6ebbd"
        },
        "date": 1707991670586,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40297,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38126,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38490,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38025,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34529,
            "range": "±6.03%",
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
          "id": "847383f4c821742b8702fa57a1d92692e6dc8cec",
          "message": "Properly apply statemanager `opts` in `fromProof` (#3276)\n\n* roperly applie statemanager opts in `fromProof\n\n* Add test for custom opts\n\n* Skip tests that break in browser\n\n* Remove console log\n\n* Update docs\n\n* More doc updates\n\n* Add second proof\n\n* Lint\n\n* Add second variant of fromProof",
          "timestamp": "2024-02-16T07:09:27-05:00",
          "tree_id": "f61cf879a5e16e830c786b18eeaddd34f78d32b9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/847383f4c821742b8702fa57a1d92692e6dc8cec"
        },
        "date": 1708085539877,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41183,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38796,
            "range": "±3.38%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39514,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38321,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37581,
            "range": "±2.36%",
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
          "id": "c0d5fc8c9eb59e5229b820814f0494eba46f018f",
          "message": "Add tests for verkle statemanager (#3257)\n\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-17T16:11:47-05:00",
          "tree_id": "beefe0f4ded60e0aca9d29ffa6e01d9d1bfe5a32",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c0d5fc8c9eb59e5229b820814f0494eba46f018f"
        },
        "date": 1708204608854,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41528,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39033,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39194,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38665,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34275,
            "range": "±6.25%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "5fb1cef5a7f71919f106de2fdf90dc908234e7a1",
          "message": "client: ensure executed block does not get pruned if head=final FCU (#3153)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-20T11:17:39+01:00",
          "tree_id": "2bafb9ccfef4095bcc9e5c84f7e8bd2223c484bd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5fb1cef5a7f71919f106de2fdf90dc908234e7a1"
        },
        "date": 1708424963047,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41190,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38696,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39447,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38413,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 33662,
            "range": "±7.77%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "6e9cc95fdb3d2e4b58a2e2bbb92a91134479f7c3",
          "message": "client: Snap Sync Debugging (#3200)\n\n* Initialize vm before openning snap sync\r\n\r\n* Use a field to track multiacconut requests\r\n\r\n* Fix store phase bug in storageFetcher\r\n\r\n* Cleanup\r\n\r\n* Check if rangeResult is undefined before accessing properties\r\n\r\n* Fix tests\r\n\r\n* Fix conditional\r\n\r\n* Remove redundant cast\r\n\r\n* Add comment to explain try block\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-20T12:07:11+01:00",
          "tree_id": "52edc0d0ca8340a57ce9b9aa1d446998c246ee12",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6e9cc95fdb3d2e4b58a2e2bbb92a91134479f7c3"
        },
        "date": 1708427534403,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40642,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38981,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39154,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38175,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34749,
            "range": "±5.79%",
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
          "id": "9994875902932128ee7c229d897bb36035e8c5cc",
          "message": "Remove devnet6 trusted setup (#3288)\n\n* Update to official trusted setup\r\n\r\n* Remove devnet6\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-21T10:40:52+01:00",
          "tree_id": "a038b0a931d5744dbb66d27999df61e217fe60c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9994875902932128ee7c229d897bb36035e8c5cc"
        },
        "date": 1708508621629,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39946,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39309,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38885,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36344,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36765,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "e1221c98f3be0ba4224416f10d91ed4aa50130d8",
          "message": "Client: Refactor Engine API (#3291)\n\n* Move engine.ts to dedicated engine API code folder\r\n\r\n* Move types to dedicated types.ts file\r\n\r\n* Move validators to a dedicated validators.ts file\r\n\r\n* Add dedicated util.ts file, move first two methods\r\n\r\n* Move next two methods to util.ts\r\n\r\n* Move last remaining methods to util.ts\r\n\r\n* Move CLConnectionManager from generic util folder to engine API RPC folder\r\n\r\n* Adjust test paths\r\n\r\n* Move validator initialization in Engine API constructor to dedicated private method\r\n\r\n* Some additional initValidators() structuring and documentation\r\n\r\n* Move util.ts to dedicated util folder, rename to generic.ts\r\n\r\n* Adjust paths\r\n\r\n* Add call-specific util files\r\n\r\n* Delete accidentally re-checked in util.ts file\r\n\r\n* Move first two methods to dedicated per-call util files\r\n\r\n* Move remaining per-call methods to dedicated util files\r\n\r\n* Add new validate4844BlobVersionedHashes helper\r\n\r\n* Better newPayload documentation\r\n\r\n* Better forkchoiceUpdate documentation, additional structuring\r\n\r\n* Additional documentation and Engine API doc references for remaining API calls",
          "timestamp": "2024-02-21T17:20:39+01:00",
          "tree_id": "2f185f505b3e1552a09a7176af9ce2138f93b0d5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e1221c98f3be0ba4224416f10d91ed4aa50130d8"
        },
        "date": 1708532609062,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40688,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39059,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39235,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36553,
            "range": "±5.23%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36752,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "0e186fd9ba59afecfd62217d56332d188db64008",
          "message": "trie: export \"Path\" interface (#3292)\n\n* trie: export \"Path\" interface\r\n\r\n* Move over Path interface export to types for consistency\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-02-26T11:09:32+01:00",
          "tree_id": "46746e80436d06f8e2b86cab47716d268f6b5955",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0e186fd9ba59afecfd62217d56332d188db64008"
        },
        "date": 1708942354225,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40706,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37630,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38723,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35844,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37465,
            "range": "±2.08%",
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
          "id": "d89a96382716b028b5bcc04014e701cfa98eeda8",
          "message": "Snap sync: use zero-element proof for checking validity of final, empty range result (#3047)\n\n* Use no-elements proof for final check in account fetcher\r\n\r\n* Use no-elements proof for final check in storage fetcher\r\n\r\n* Check inputs after zero element proof code section\r\n\r\n* Cleanup\r\n\r\n* Reject peer if zero-element proof fails\r\n\r\n* Add tests for zero-element proof\r\n\r\n* Remove proofTrie usage\r\n\r\n* Use hashing function in static version of verifyRangeProof\r\n\r\n* Include useKeyHashing in call to fromProof so that hashing function is used in proof verification\r\n\r\n* Use appliedKey for hashing function instead of the function directly passed in TrieOpts\r\n\r\n* Pass in hashing function for use in static proof verification calls\r\n\r\n* Fix static range proof verification errors\r\n\r\n* Use custom hashing function from opts if available\r\n\r\n* Add test to check if zero element range proof verification fails with remaining elements to the right\r\n\r\n* Check if parameters are as expected for zero-element proof\r\n\r\n* Fix linting issues\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Indigo Alpha <indigoalpha@indigos-mbp.mynetworksettings.com>",
          "timestamp": "2024-02-26T14:16:18+01:00",
          "tree_id": "867a4a436729954bc31b6e44307f99884856b6eb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d89a96382716b028b5bcc04014e701cfa98eeda8"
        },
        "date": 1708953544030,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40811,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38747,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39528,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38393,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36926,
            "range": "±2.17%",
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
          "id": "0596d16b3aa8781acdd4906a40d6d23cb7478ed1",
          "message": "Integrate `kzg-wasm` into monorepo (#3294)\n\n* Update to official trusted setup\n\n* Remove devnet6\n\n* Add kzg-wasm\n\n* Update block tests to use kzg-wasm\n\n* Update tests\n\n* Add more 4844 tests to browser run\n\n* Initial integration of kzg-wasm on git\n\n* Update kzg-wasm build\n\n* Fix linter weirdness\n\n* Move initKzg to `runTests`\n\n* Fix tests\n\n* More cleanup\n\n* Goodbye c-kzg\n\n* fix kzg references\n\n* Replace c-kzg with kzg-wasm in package.json\n\n* Update kzg wasm commit and vm tester config\n\n* Update initKzg to createKZG\n\n* fix copy pasta\n\n* Fix more copy pasta\n\n* update kzg-wasm to npm release\n\n* One last bit of copy pasta\n\n* Address feedback\n\n* client: remove try/catch blocks createKZG() and remove the initKZG stale comment\n\n---------\n\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-02-28T16:02:03-05:00",
          "tree_id": "d2586d84a3e1933c4722f433577c7c364c43de90",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0596d16b3aa8781acdd4906a40d6d23cb7478ed1"
        },
        "date": 1709154308435,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41687,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39584,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40328,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39252,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38785,
            "range": "±1.63%",
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
          "id": "b8f5b6df2a5e454f315d9b30b4f04e89fd92fdf8",
          "message": "Make trustedSetupPath in Util kzg module optional (#3296)",
          "timestamp": "2024-02-29T07:07:30-05:00",
          "tree_id": "4db1634662531c78ce25a026bc59e8564b28d4a9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b8f5b6df2a5e454f315d9b30b4f04e89fd92fdf8"
        },
        "date": 1709208610754,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40686,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40104,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39760,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36399,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37930,
            "range": "±1.81%",
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
          "id": "f01264cba33d8eb2c875b3e4e97e70ef4b02bf27",
          "message": "client: save preimages feature (#3143)\n\n* client: PreimageManager and Preimage storage in MetaDB\r\n\r\n* common: add getAppliedKey method to StateManagerInterface\r\n\r\n* evm: add preimage reporting\r\n\r\n* statemanager: add getAppliedKey methods to the statemanager implementations\r\n\r\n* vm: improve some types\r\n\r\n* vm: implement preimage reporting\r\n\r\n* client: add preimage saving\r\n\r\n* evm: update to unprefixedHexToBytes\r\n\r\n* vm: add reportPreimages test to runTx tests\r\n\r\n* vm: pass down reportPreimages arg from block to tx\r\n\r\n* client: pass down reportPreimages from client to vm through runBlock\r\n\r\n* client: unify config options naming\r\n\r\n* client: preimageManager test\r\n\r\n* client: test preimage, wip\r\n\r\n* common: add todo to gasPrices from 6800\r\n\r\n* statemanager: fix type issues\r\n\r\n* dev accessWitness class on the lines of geth impl\r\n\r\n* integrate accesswitness in evm/vm/runtx flow\r\n\r\n* plugin the gas schedule for tx origin and destination accesses\r\n\r\n* complete, debug and fix the call and create access charges\r\n\r\n* plug the access gas usage on the evm opcode runs\r\n\r\n* debug and fix the code chunk accesses and the poststate setting\r\n\r\n* implement access merging and accessed state tracking and traversing\r\n\r\n* also provide chunkKey for easy reference\r\n\r\n* decode raw accesses to structured ones and debug log them\r\n\r\n* debug and add the missing accesses for coinbase, withdrawals\r\n\r\n* stateManager: implement cache handling in the context of statelessness\r\n\r\n* modify poststate to use accesses from the accesswitness to compare and fix mising chunkKey in returned accesses\r\n\r\n* stateManager: getComputedValue\r\n\r\n* fixes for the getcomputedval fn helper for the code\r\n\r\n* correctly implement the getcontractcode with partial accessed segments available  and corresponding error handling in evm run\r\n\r\n* statemanager: tentative fixes & improvements to code cache handling\r\n\r\n* statemanager: checkpoint code cache\r\n\r\n* fix the code chunk comparision in post state verification\r\n\r\n* rename kaustinen2 local testnet data for\r\n\r\n* fix pre and post state null chunks handling and corresponding get computed fixes\r\n\r\n* setup the client to statelessly execute the verkle blocks randomly from anywhere the chain\r\n\r\n* setup to statelessly run block13 of kaustinen2 in client test spec for easy debugging\r\n\r\n* setup the client kaustinen2 stateless test to test and debug block 16\r\n\r\n* improve the post state witness mismatch logging to be more comprehensible for debugging\r\n\r\n* improve chunk verification tracking logging and fix post/prestate key coding from the witnesses\r\n\r\n* debug and fix code accesses and overhaul/fix accesscharges on create/call\r\n\r\n* add a more complete matching of generated and provided executed witnesses\r\n\r\n* fix return\r\n\r\n* debug, discuss and remove proof of absence charges for contract create for fixing the extra witnesses\r\n\r\n* only charge code accesses if accessed from state and when code is written on contract creation\r\n\r\n* handle bigint treeIndex for the bigint slot and debug/match the predersenhash with kauntinen2 usage\r\n\r\n* client: fix kaustinen tests and migrate to new testing framework\r\n\r\n* shift kaustinen 2 test to block 13\r\n\r\n* client: remove stale kaustinen2 test data\r\n\r\n* vm: adjust rewardAccount new common arg ordering and make it optional\r\n\r\n* add block12 to the spec list\r\n\r\n* move invalid opcode check outside jump analysis\r\n\r\n* small cleanup in runtx\r\n\r\n* add preimages spec\r\n\r\n* build various block scenarios for preimages gen\r\n\r\n* client: revert vmexecution preimages test\r\n\r\n* client: remove unnecessary boolean explicit comparison\r\n\r\n* client: remove unused import\r\n\r\n* client: revert re-ordering\r\n\r\n* stateManager: support non keccak256 applied keys\r\n\r\n* debug and persist preimages on runWithoutSetHead as well\r\n\r\n* add preimages for coinbase,withdrawals to the test and fix the spec to validate them\r\n\r\n* client: fix preimage tests ts errors\r\n\r\n* client: minor adjustments to preimage test\r\n\r\n* client: save preimages helper\r\n\r\n* vm: save preimages at the block level, new applyBlockResult type\r\n\r\n* common: make getAppliedKey optional\r\n\r\n* evm/vm: handle optional getAppliedKey\r\n\r\n* client: add preimage doc\r\n\r\n* trie: export \"Path\" interface (#3292)\r\n\r\n* trie: export \"Path\" interface\r\n\r\n* Move over Path interface export to types for consistency\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\n\r\n* Snap sync: use zero-element proof for checking validity of final, empty range result (#3047)\r\n\r\n* Use no-elements proof for final check in account fetcher\r\n\r\n* Use no-elements proof for final check in storage fetcher\r\n\r\n* Check inputs after zero element proof code section\r\n\r\n* Cleanup\r\n\r\n* Reject peer if zero-element proof fails\r\n\r\n* Add tests for zero-element proof\r\n\r\n* Remove proofTrie usage\r\n\r\n* Use hashing function in static version of verifyRangeProof\r\n\r\n* Include useKeyHashing in call to fromProof so that hashing function is used in proof verification\r\n\r\n* Use appliedKey for hashing function instead of the function directly passed in TrieOpts\r\n\r\n* Pass in hashing function for use in static proof verification calls\r\n\r\n* Fix static range proof verification errors\r\n\r\n* Use custom hashing function from opts if available\r\n\r\n* Add test to check if zero element range proof verification fails with remaining elements to the right\r\n\r\n* Check if parameters are as expected for zero-element proof\r\n\r\n* Fix linting issues\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Indigo Alpha <indigoalpha@indigos-mbp.mynetworksettings.com>\r\n\r\n* Integrate `kzg-wasm` into monorepo (#3294)\r\n\r\n* Update to official trusted setup\r\n\r\n* Remove devnet6\r\n\r\n* Add kzg-wasm\r\n\r\n* Update block tests to use kzg-wasm\r\n\r\n* Update tests\r\n\r\n* Add more 4844 tests to browser run\r\n\r\n* Initial integration of kzg-wasm on git\r\n\r\n* Update kzg-wasm build\r\n\r\n* Fix linter weirdness\r\n\r\n* Move initKzg to `runTests`\r\n\r\n* Fix tests\r\n\r\n* More cleanup\r\n\r\n* Goodbye c-kzg\r\n\r\n* fix kzg references\r\n\r\n* Replace c-kzg with kzg-wasm in package.json\r\n\r\n* Update kzg wasm commit and vm tester config\r\n\r\n* Update initKzg to createKZG\r\n\r\n* fix copy pasta\r\n\r\n* Fix more copy pasta\r\n\r\n* update kzg-wasm to npm release\r\n\r\n* One last bit of copy pasta\r\n\r\n* Address feedback\r\n\r\n* client: remove try/catch blocks createKZG() and remove the initKZG stale comment\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Make trustedSetupPath in Util kzg module optional (#3296)\r\n\r\n* client: add tx preimages to preimage test cases\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Indigo Alpha <indigoalpha@indigos-mbp.mynetworksettings.com>",
          "timestamp": "2024-03-01T12:46:35+01:00",
          "tree_id": "b7ccbb0c3d5731cae25f773b58d4f1a967e8b0f1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f01264cba33d8eb2c875b3e4e97e70ef4b02bf27"
        },
        "date": 1709293760331,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41309,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38547,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40119,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39103,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38078,
            "range": "±1.76%",
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
          "id": "b3c8c285b347245615de16a3f2e589c452d723e8",
          "message": "evm/vm: ensure  backwards compatability reportPreimages (#3298)",
          "timestamp": "2024-03-01T13:49:31+01:00",
          "tree_id": "a80e9695017cd4adf9e7158a49028b1e82e1896e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b3c8c285b347245615de16a3f2e589c452d723e8"
        },
        "date": 1709298086131,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42502,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40140,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40854,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39454,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39034,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "43524469+kyscott18@users.noreply.github.com",
            "name": "kyscott18",
            "username": "kyscott18"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f50249450a1dc3647b21b1c11bf1200c34b7811b",
          "message": "Update README.md (#3300)",
          "timestamp": "2024-03-02T22:25:24-05:00",
          "tree_id": "619fbf094e57f17b2887151fe035e7f5554e8268",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f50249450a1dc3647b21b1c11bf1200c34b7811b"
        },
        "date": 1709436489844,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41482,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39870,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40341,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39550,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35436,
            "range": "±6.61%",
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
          "id": "41a74688c4ba0c9bf195679e472cdbab0bc87246",
          "message": "packages: pin lru-cache version to fix build problems (#3285)",
          "timestamp": "2024-03-04T14:58:49+01:00",
          "tree_id": "4a1bc2ed3a63425fdebe1a9cee6f576e38eb42e1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/41a74688c4ba0c9bf195679e472cdbab0bc87246"
        },
        "date": 1709561020469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41795,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41215,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40830,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37266,
            "range": "±5.62%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39002,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "d8bd18b992bb80f4fe964bb595f637d14b5efe2a",
          "message": "update ethereum/tests to 13.1 (#3302)\n\n* update ethereum/tests to 13.1\r\n\r\n* vm: fix config\r\n\r\n* update ci test runner for vm\r\n\r\n* Update to fixed kzg wasm ver\r\n\r\n* vm/test: add excessBlobGas to state runner\r\n\r\n* Update kzg-wasm\r\n\r\n* update package-lock\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-06T18:53:12+01:00",
          "tree_id": "656da557d39ea87b061ce17c33bcc15b3f67ff6a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d8bd18b992bb80f4fe964bb595f637d14b5efe2a"
        },
        "date": 1709747774421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41007,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38405,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39584,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38605,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35334,
            "range": "±4.80%",
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
          "id": "a35bf07bc8e4288a3f605977fb176f487ff6632e",
          "message": "Implement eth_feeHistory (#3295)\n\n* implement effective priority fee retrieval\r\n\r\nimplement fee history rpc method\r\n\r\nrefactor and adjust return values\r\n\r\nadd integer validation\r\n\r\nadd test for maximum base fee increase\r\n\r\nfix backward compatibility\r\n\r\nadd remaining tests\r\n\r\nuse calcNextBaseFee from parent block header\r\n\r\nuse bigint array instead of number array for the optional param\r\n\r\nremove redundant bigIntMax\r\n\r\nretrieve initial base fee from common\r\n\r\n* client: fix build\r\n\r\n* client: partial fix tests\r\n\r\n* client: edit feeHistory tests\r\n\r\n* client/tx address some review\r\n\r\n* tx: make getEffectivePriorityFee redunt\r\n\r\n* tx: add getEffectivePriorityFee tests\r\n\r\n* vm: add todo\r\n\r\n* client: eth_feeHistory fixes + test additions\r\n\r\n* client/rpc: add rewardPrcentile check\r\n\r\n* client: add validation tests for the ratio\r\n\r\n* client: eth_feeHistory fix rewards?\r\n\r\n* Add partial tests for reward percentiles\r\n\r\n* client: feeHistory sort txs by prioFee\r\n\r\n* add more tests\r\n\r\n* client: add extra feeHistory rewards tests\r\n\r\n* vm: use getEffectivePriorityFee\r\n\r\n* client: update mock blockhash\r\n\r\n* add blob fee to feeHistory\r\n\r\n* block: add calcNextBlobGasPrice\r\n\r\n* client: fix feeHistory implementation and add test output\r\n\r\n* client: lint\r\n\r\n* separate validators for rewardPercentile and array\r\n\r\n* client: test rewardPercentile validator\r\n\r\n* Apply comments and add tests\r\n\r\n---------\r\n\r\nCo-authored-by: Marko <marko.ivankovic650@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>",
          "timestamp": "2024-03-07T13:48:01-05:00",
          "tree_id": "d9aaa60ec353cfc13f7c4b1f0ce459b3b7cd4436",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a35bf07bc8e4288a3f605977fb176f487ff6632e"
        },
        "date": 1709837455749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42115,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39565,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40875,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37024,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38911,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "5e3cfdda4bf714ddb0a11ca2dc0383c265512f25",
          "message": "Update rustbn-wasm usage  (#3304)\n\n* Update rustbn-wasm usage everywhere\r\n\r\n* Update package lock\r\n\r\n* use EVM.create\r\n\r\n* Update examples\r\n\r\n* Address feedback\r\n\r\n* Update rustbn-wasm commit hash\r\n\r\n* Remove console log\r\n\r\n* fix test\r\n\r\n* update rustbn again\r\n\r\n* update rustbn\r\n\r\n* Add bn128 to vm test runner init\r\n\r\n* Update to latest rustbn-wasm\r\n\r\n* Update rustbn-wasm to published v0.4.0 version\r\n\r\n* Rebuild package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-08T10:00:56+01:00",
          "tree_id": "f6b9ab47990530f7b23869d265f428894774877c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5e3cfdda4bf714ddb0a11ca2dc0383c265512f25"
        },
        "date": 1709888759339,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43487,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41127,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41535,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40415,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36024,
            "range": "±5.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "distinct": false,
          "id": "435606e693e4d5c0aea1b17b3fe441521bc585e9",
          "message": "Common Type Fixes (#3307)\n\n* Common: Improve typing for getHardforkBy()\r\n\r\n* Common: Fixes type issue in paramByHardfork()",
          "timestamp": "2024-03-11T11:22:54+01:00",
          "tree_id": "0818741f5057060f67d7120856a06cd669162ba9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/435606e693e4d5c0aea1b17b3fe441521bc585e9"
        },
        "date": 1710152976795,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43747,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41316,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41171,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39804,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34645,
            "range": "±6.19%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "891ee51431641021f7cc961833e5b8ac9e7060ba",
          "message": "Trie: add partialPath parameter to trie.findPath() (#3305)\n\n* trie: add optional \"partialPath\" parameter to findPath\r\n\r\n* trie: use partialPath input in findPath stack\r\n\r\n* trie: start findPath walk from end of partialPath\r\n\r\n* trie: identify starting point in debug log\r\n\r\n* trie: test findPath with partial\r\n\r\n* trie: test findPath on secure trie\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-11T14:26:59+01:00",
          "tree_id": "dee64964bfe52ae100173f3826f98872ea0624a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/891ee51431641021f7cc961833e5b8ac9e7060ba"
        },
        "date": 1710163908995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42778,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42411,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41873,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41042,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36556,
            "range": "±5.83%",
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
          "id": "20d088eb1583ef114d6039462c780cceba862d81",
          "message": "Fix node versions (#3286)\n\n* client tests: fix fetcher test\r\n\r\n* Switch test from testdouble to vitest mocks\r\n\r\n* Sort of fix test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-12T12:07:16-04:00",
          "tree_id": "5d36b6fa23451a2f87e9bfb72560ee8fe88987a7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/20d088eb1583ef114d6039462c780cceba862d81"
        },
        "date": 1710259801749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42719,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42745,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42236,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38639,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40266,
            "range": "±1.81%",
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
          "id": "6766a5dc4a531813c9d601e35e5021651c640641",
          "message": "EVM/VM create() Static Constructor Reworking (#3315)\n\n* EVM: make bn128 internal again (remove type in options), rename bn128 -> _bn128 for consistency, deprecate main constructor\r\n\r\n* EVM: move Common, Blockchain and StateManager initialization to async create constructor\r\n\r\n* Move all VM initialization to async create() constructor, kill _init() method and isInitialized parameter, move to async create() initializations where applicable\r\n\r\n* fix vm tests\r\n\r\n* fix remaining client test\r\n\r\n* blockchain: remove _init\r\n\r\n* Client test fixes\r\n\r\n* client: fix tests\r\n\r\n* Remove obsolete reference to blockchain._init\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-12T12:49:47-04:00",
          "tree_id": "7c72ee9c6d0d055be844d13e8ce20863c0b29b5e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6766a5dc4a531813c9d601e35e5021651c640641"
        },
        "date": 1710262353517,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 44481,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41589,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42712,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41290,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40619,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "yann.levreau@gmail.com",
            "name": "yann300",
            "username": "yann300"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906b36257645bab19999c3559efde9817266bb70",
          "message": "export getOpcodesForHF (#3322)\n\n* Update index.ts\r\n\r\nThis simply export `getOpcodesForHF`.\r\n\r\n* linting",
          "timestamp": "2024-03-14T21:17:32-04:00",
          "tree_id": "d2a4412279853e2e83fbd91a70658f318c3003e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/906b36257645bab19999c3559efde9817266bb70"
        },
        "date": 1710465763614,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 44040,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41881,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42728,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41423,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40280,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      }
    ]
  }
}