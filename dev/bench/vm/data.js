window.BENCHMARK_DATA = {
  "lastUpdate": 1689885773017,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "5c8a34026c01160ea3556d532207dc945139a232",
          "message": "client: improve new payload and fcu block executions (#2880)\n\n* client: improve new payload and fcu block executions\r\n\r\n* update comment\r\n\r\n* cleanup\r\n\r\n* further optimize the execution\r\n\r\n* new payload executed tracking\r\n\r\n* add vm pointer to client's chain and prune cached blocks\r\n\r\n* fix the getpayload exec",
          "timestamp": "2023-07-14T12:32:45+02:00",
          "tree_id": "de2d5f9fda932c2235a1015b2209066d74a974f1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5c8a34026c01160ea3556d532207dc945139a232"
        },
        "date": 1689330987835,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30796,
            "range": "±5.14%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30810,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30834,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25614,
            "range": "±9.79%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29174,
            "range": "±3.40%",
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
          "id": "47714a6020d283437ee811ebc789037bbe4124d4",
          "message": "VM: docs builder fix, EVM: cleanup types (#2888)\n\n* evm: move EVMResult, ExecResult into evm types\r\n\r\n* evm: fix precompile input type\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-14T13:53:07+02:00",
          "tree_id": "233aaf145ec5aed6d2ba6fb6f96d7e6ff41f3871",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/47714a6020d283437ee811ebc789037bbe4124d4"
        },
        "date": 1689335787761,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32993,
            "range": "±3.96%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31791,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31981,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27457,
            "range": "±9.82%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30656,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "0af73095b19c564791c5da107153edef2c787e4c",
          "message": "Update devp2p API names and access specifiers (#2889)\n\n* Change access specifiers for RLPx _privateKey, _id, _debug, _timeout\r\n\r\n* Renaming accessed id property in client tests\r\n\r\n* Change access specifiers for RLPx _maxPeers, _clientId, _remoteClientIdFilter, and _capabilities\r\n\r\n* Ignore error message from reassigning readonly property in tests\r\n\r\n* Change access specifiers for _common, _listenPort, and _dpt\r\n\r\n* Change access specifiers for _peersLRU, _peersQueue, _server, _peers, _refillIntervalId, and _refillIntervalSelectionCounter\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Ignore access errors for _eciesSession\r\n\r\n* Make common field public for Peer class\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Make id public readonly\r\n\r\n* Update names and access specifiers of Mac class fields\r\n\r\n* Update names and access specifiers of ECIES class fields\r\n\r\n* Update names and access specifiers of Peer class fields\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update example\r\n\r\n* Update names and access specifiers of class fields in protocol subpackage\r\n\r\n* Update names and access specifiers of class fields in ext subpackage\r\n\r\n* Update names and access specifiers of class fields in dpt subpackage\r\n\r\n* Update names and access specifiers of class fields in dns subpackage\r\n\r\n* Fix name of accessed field\r\n\r\n* Update tests",
          "timestamp": "2023-07-17T08:56:20+02:00",
          "tree_id": "799b19d9ccb9182461e44b531b44c278d7f67ad7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0af73095b19c564791c5da107153edef2c787e4c"
        },
        "date": 1689577185295,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32686,
            "range": "±4.65%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31925,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31851,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27626,
            "range": "±8.64%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30215,
            "range": "±2.54%",
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
          "id": "54e10a23c8095cc57ff9f0be5fa505fc48ed532b",
          "message": "common: add Cancun CFI EIPs for devnet8 and fix eip-4788 block building issues (#2892)\n\n* common: add Cancun CFI EIPs for devnet8\r\n\r\n* fix the parentBeaconBlockRoot related issues\r\n\r\n* fix issues\r\n\r\n* fix execution payload to block conversion for 4788\r\n\r\n* fix client specs\r\n\r\n* fix spec\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-17T10:28:34+02:00",
          "tree_id": "51e9e4a245596f83b4a99a012ee813e77e4b77b4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/54e10a23c8095cc57ff9f0be5fa505fc48ed532b"
        },
        "date": 1689582739478,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30704,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30641,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30421,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25132,
            "range": "±11.32%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29181,
            "range": "±3.49%",
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
          "id": "e33b0f8bb60348000cdaefd4ff72b6bc81de19d0",
          "message": "client: add shouldOverrideBuilder flag for getPayloadV3 (#2891)",
          "timestamp": "2023-07-17T11:08:31+02:00",
          "tree_id": "2b4826136e275eb34a2e0bdce7ddf26ee663fb12",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e33b0f8bb60348000cdaefd4ff72b6bc81de19d0"
        },
        "date": 1689585509352,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33164,
            "range": "±4.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32410,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32067,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28270,
            "range": "±8.15%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30674,
            "range": "±2.58%",
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
          "id": "66c98f386e4a7807978e3e8f0c19608d10849896",
          "message": "RC1 Releases (#2876)\n\n* Bump version, updated upstream dependency versions, updated README (RLP)\r\n\r\n* Update release date to 2023-07-13\r\n\r\n* Add generic Buffer -> Uint8Array README section\r\n\r\n* Add generic README unreleased note\r\n\r\n* Add generic ESM sections\r\n\r\n* Add a first browser example section to README (EVM)\r\n\r\n* Small updates\r\n\r\n* Renamed blobHelpers.ts -> blobs.ts (Util), moved Util encoding to Trie\r\n\r\n* Version bump, update upstream dependency versions, update README (Util)\r\n\r\n* Move encoding tests from Util to Trie\r\n\r\n* Version bump, update upstream dependency versions, update README (Common)\r\n\r\n* Rebuild docs\r\n\r\n* Version bump, update upstream dependency versions, update README (Trie)\r\n\r\n* Version bump, update upstream dependency versions, update README (devp2p)\r\n\r\n* Rebuild docs (Tx)\r\n\r\n* Version bump, update upstream dependency versions, update README (Tx)\r\n\r\n* Version bump, update upstream dependency versions, update README (Block)\r\n\r\n* Rebuild docs (Block)\r\n\r\n* Version bump, update upstream dependency versions, update README (Blockchain)\r\n\r\n* Rebuild docs (Blockchain)\r\n\r\n* Version bump, update upstream dependency versions, update README, added LICENSE file (Genesis)\r\n\r\n* Version bump, update upstream dependency versions, update README (StateManager)\r\n\r\n* Rebuild docs (StateManager)\r\n\r\n* Version bump, update upstream dependency versions, update README (Ethash)\r\n\r\n* Version bump, update upstream dependency versions, update README (EVM)\r\n\r\n* First part of VM README additions\r\n\r\n* Blockchain: remove level dependency, other changes\r\n\r\n* Dependency clean-up\r\n\r\n* Bump client version to v0.8.0\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Small updates\r\n\r\n* Add CHANGELOG introduction sections\r\n\r\n* Adjust Cancun HF CHANGELOG note (all EIPs included)\r\n\r\n* Bring release notes up to date\r\n\r\n* Rebuild Block, Common docs\r\n\r\n* Rebuild Ethash docs\r\n\r\n* Small updates and corrections\r\n\r\n* More small corrections",
          "timestamp": "2023-07-17T15:51:34+02:00",
          "tree_id": "680b78f0dc42a6f7fc8257ba4e8179857964af42",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/66c98f386e4a7807978e3e8f0c19608d10849896"
        },
        "date": 1689602157424,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24695,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25315,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24673,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24062,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18866,
            "range": "±11.52%",
            "unit": "ops/sec",
            "extra": "64 samples"
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
          "id": "6b2389219322b5279fb73281eccc4a8128bcd5a0",
          "message": "Small RC1 Release Cleanup Round (#2894)\n\n* EVM: add @ethereumjs/statemanager dependency, new RC.2 release\r\n\r\n* Some small clean-ups\r\n\r\n* VM constructor new VM() -> VM.create() doc update\r\n\r\n* Update packages/evm/README.md\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-07-17T20:36:20+02:00",
          "tree_id": "f1804204ff8b739f7a03bb0a616a3413a1fe7057",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6b2389219322b5279fb73281eccc4a8128bcd5a0"
        },
        "date": 1689619850260,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30358,
            "range": "±5.94%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30222,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29346,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25617,
            "range": "±9.03%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29539,
            "range": "±3.37%",
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
          "id": "894660973cfd06faae39f74c66a39616f5b2239f",
          "message": "client: migrate tests to vite (#2797)\n\n* client: migrate tests to vite\r\n\r\n* client: update test scripts\r\n\r\n* client: fix rpc engine tests\r\n\r\n* client: fix rpc engine tests\r\n\r\n* client: remove unnecessary stringification\r\n\r\n* client: fix more rpc tests\r\n\r\n* client: misc test fixes\r\n\r\n* client: fix ci script still using tape\r\n\r\n* Rename libp2p tests to avoid vitest running them\r\n\r\n* fix instanceof tests\r\n\r\n* Update vitest.config so that test:CLI runs\r\n\r\n* Update vitest.config so that test:CLI runs\r\n\r\n* Fixes for client.spec.ts\r\n\r\n* Fix error in sender.spec.ts\r\n\r\n* Fix test formatting rlpxserver.spec.ts\r\n\r\n* Update unit test config, randomize rpc port\r\n\r\n* test fixes\r\n\r\n* more test fixes\r\n\r\n* Fix engine tests\r\n\r\n* Partial test fixes\r\n\r\n* Fix merge integration test\r\n\r\n* fix fcu hex handling\r\n\r\n* Add timeouts and fix lightsync\r\n\r\n* Various test and type fixes\r\n\r\n* fix txpool tests\r\n\r\n* correct bytes2hex import\r\n\r\n* Fix lightethereumservice tests\r\n\r\n* client: fix lesprotocol test\r\n\r\n* Fix most full ethereum service tests\r\n\r\n* Fix fullethereumservice test\r\n\r\n* \"Fix\" flow control test\r\n\r\n* Fix rlxppeer test\r\n\r\n* client: fix lightsync integration test timeouts\r\n\r\n* client: update client ci\r\n\r\n* client: increase timeout for some tests\r\n\r\n* client: remove only from flowcontrol test\r\n\r\n* client: more test fixes\r\n\r\n* client: increase timeout for miner\r\n\r\n* client: increase timeout for miner\r\n\r\n* client: increase more timeouts and fix missing it statement\r\n\r\n* fix integration tests\r\n\r\n* fix lint rules\r\n\r\n* fix npm script\r\n\r\n* Fix lint file extension\r\n\r\n* Fix lint config, again\r\n\r\n* File path fix\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-18T10:56:04+02:00",
          "tree_id": "fd0ef2f3a54ea89c2075dd8b8f0734dac570ab03",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/894660973cfd06faae39f74c66a39616f5b2239f"
        },
        "date": 1689670937363,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32725,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32203,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31769,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27923,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30450,
            "range": "±2.82%",
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
          "id": "9fec1f405a36e94d176e6cc4b497fc0afbdaea71",
          "message": "Resolve access errors from doc build process (#2898)",
          "timestamp": "2023-07-18T15:15:19-04:00",
          "tree_id": "098a5c4e7228c43b38bfe19d99faf38a5efc12e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9fec1f405a36e94d176e6cc4b497fc0afbdaea71"
        },
        "date": 1689708706126,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30403,
            "range": "±5.81%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30938,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29941,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25142,
            "range": "±10.80%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29211,
            "range": "±3.46%",
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
          "id": "966d7dd7943a2dab20c83c6e6ef29a276756de3f",
          "message": "Devp2p EventEmitter refactor (#2893)\n\n* Change access specifiers for RLPx _privateKey, _id, _debug, _timeout\r\n\r\n* Renaming accessed id property in client tests\r\n\r\n* Change access specifiers for RLPx _maxPeers, _clientId, _remoteClientIdFilter, and _capabilities\r\n\r\n* Ignore error message from reassigning readonly property in tests\r\n\r\n* Change access specifiers for _common, _listenPort, and _dpt\r\n\r\n* Change access specifiers for _peersLRU, _peersQueue, _server, _peers, _refillIntervalId, and _refillIntervalSelectionCounter\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Ignore access errors for _eciesSession\r\n\r\n* Make common field public for Peer class\r\n\r\n* Update names and access specifiers of Peer fields\r\n\r\n* Make id public readonly\r\n\r\n* Update names and access specifiers of Mac class fields\r\n\r\n* Update names and access specifiers of ECIES class fields\r\n\r\n* Update names and access specifiers of Peer class fields\r\n\r\n* Ignore accessibility errors in examples\r\n\r\n* Update example\r\n\r\n* Update names and access specifiers of class fields in protocol subpackage\r\n\r\n* Update names and access specifiers of class fields in ext subpackage\r\n\r\n* Update names and access specifiers of class fields in dpt subpackage\r\n\r\n* Update names and access specifiers of class fields in dns subpackage\r\n\r\n* Fix name of accessed field\r\n\r\n* Update tests\r\n\r\n* Don't extend EventEmitter in RLPx class\r\n\r\n* Update tests\r\n\r\n* Update tests\r\n\r\n* Update examples\r\n\r\n* Update tests\r\n\r\n* Don't exten EventEmitter in Protocol class\r\n\r\n* Update tests\r\n\r\n* Update examples\r\n\r\n* Update tests\r\n\r\n* Don't extend EventEmitter in dpt class\r\n\r\n* Don't extend EventEmitter in kbucket class\r\n\r\n* Update tests\r\n\r\n* Update tests\r\n\r\n* Fix rlpxserver test\r\n\r\n* Fix tests\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-19T14:43:48-04:00",
          "tree_id": "5e8d6cc92cd46f6b00c75be2850c9c5e59ed5f0d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/966d7dd7943a2dab20c83c6e6ef29a276756de3f"
        },
        "date": 1689792516556,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18831,
            "range": "±6.57%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19208,
            "range": "±3.49%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19943,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19449,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18842,
            "range": "±3.38%",
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
          "id": "c1950acac1518ff15dc128d58253df4de81760b8",
          "message": "Troubleshoot failing node versions tests: Adjust timeouts in devp2p tests to avoid race conditions (#2895)\n\n* Make timeout and wait longer\r\n\r\n* Update comment\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-07-19T15:41:08-04:00",
          "tree_id": "f573b1cca55fe493289895b168088c04a0836fa1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1950acac1518ff15dc128d58253df4de81760b8"
        },
        "date": 1689795871592,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31963,
            "range": "±4.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31831,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31446,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27279,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29870,
            "range": "±2.68%",
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
          "id": "d19ee0e4c9c0e2a7a61ae38c791861a8e9fb0fd5",
          "message": "Adjust client unit test timeouts (#2901)\n\n* Extend timeout window for client unit tests\n\n* Remove specific test timeouts and up global to 3m\n\n* Fix cli tests\n\n* Fix client CI and vitest config\n\n* Fix cli job command\n\n* cleanup timeouts\n\n* fix imports\n\n* revert namespace import to require\n\n* extent client test timeout\n\n* extend integration test timeouts\n\n* skip problematic miner tests\n\n* lint",
          "timestamp": "2023-07-20T16:39:25-04:00",
          "tree_id": "47442b9a679dadf809e9c49706f01f80b18d26aa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d19ee0e4c9c0e2a7a61ae38c791861a8e9fb0fd5"
        },
        "date": 1689885772226,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32769,
            "range": "±4.22%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32157,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31968,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27275,
            "range": "±9.50%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29993,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      }
    ]
  }
}