window.BENCHMARK_DATA = {
  "lastUpdate": 1668521312821,
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
          "id": "28a333698c0984fbac0f90b030d428a30d20517a",
          "message": "evm: update imports/exports (#2303)\n\n* evm: update imports/exports\r\n\r\n* Update return type of evm.copy\r\n\r\n* Fix EVMEvents typing\r\n\r\n* Update vm import/exports\r\n\r\n* Pull event emitter types into evm\r\n\r\n* Internalize asynceventemitter\r\n\r\n* More typing\r\n\r\n* change async-eventemitter to eventemitter2\r\n\r\n* update package-lock\r\n\r\n* update package lock\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-10-17T12:23:56+02:00",
          "tree_id": "4c0764a6d918649944ff4452adafaf80d5a2ca39",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/28a333698c0984fbac0f90b030d428a30d20517a"
        },
        "date": 1666002800312,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 11260,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11305,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11221,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10657,
            "range": "±6.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11220,
            "range": "±2.31%",
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
          "id": "f8c731c687f0e67f9cf45856d975cb0596dd3def",
          "message": "common: Ignore merge hf in nextHardforkBlock (#2364)\n\n* common: Ignore merge hf in nextHardforkBlock\r\n\r\n* handle nextHardforkBlock for merge block and add tests",
          "timestamp": "2022-10-17T20:16:17+02:00",
          "tree_id": "f2170374b8dfa9e66b44cc3e89db9eaf834a66a8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f8c731c687f0e67f9cf45856d975cb0596dd3def"
        },
        "date": 1666030697547,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18255,
            "range": "±4.38%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18781,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17094,
            "range": "±8.04%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18786,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18112,
            "range": "±1.88%",
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
          "id": "2e8b1cfd8542e549949f134871fc05d7c34a678b",
          "message": "New Releases (#2361)\n\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Common v3.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Tx v4.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Trie v5.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Block v4.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (StateManager v1.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Devp2p v5.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Blockchain v6.0.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (EVM v1.1.0)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (VM v6.1.0)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream library dependencies (Client v0.6.4)\r\n\r\n* Monorepo: Updated package-lock.json\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* EVM: added getActiveOpcodes() as an optional method to EVMInterface\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-18T10:14:31+02:00",
          "tree_id": "490c00bede4928b3be01f986f59b2ed4bc8162de",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2e8b1cfd8542e549949f134871fc05d7c34a678b"
        },
        "date": 1666081018358,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15534,
            "range": "±3.72%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16387,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14469,
            "range": "±10.26%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15490,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14204,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "843265639073d8b7e6f3f4d15efa6108ea4a0ce8",
          "message": "vm/tests: print failing tests (#2367)",
          "timestamp": "2022-10-18T13:45:19+02:00",
          "tree_id": "1435f657f3abae499222a00a966f923382b3d29b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/843265639073d8b7e6f3f4d15efa6108ea4a0ce8"
        },
        "date": 1666093647951,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16180,
            "range": "±4.26%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16843,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15817,
            "range": "±7.06%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16727,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16196,
            "range": "±2.14%",
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
          "id": "1823287bca416cf617f1f0040d883f0d8252b5fa",
          "message": "New Util release v8.0.1, new client release v0.6.5 (v0.6.4 broken), update packaage-lock.json (#2371)",
          "timestamp": "2022-10-19T17:08:15+05:30",
          "tree_id": "a86a9279820d78f2f361df3e572a3b5660806333",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1823287bca416cf617f1f0040d883f0d8252b5fa"
        },
        "date": 1666179652723,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9279,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9681,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8836,
            "range": "±6.24%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9451,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9676,
            "range": "±2.51%",
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
          "id": "b5a2f4b94dd514c375de1974d7b834c6a315b6e4",
          "message": "Switch eventemitter2 to local asynceventemitter (#2376)\n\n* Switch eventemitter2 to local asynceventemitter\n\n* Add once to event emitter\n\n* add rest of event emitter methods\n\n* cast recalcitrant listener to any\n\n* evm: fix type issue asyncEvent test\n\n* Make callback optional and adjust test typing\n\n* util: stricter typing for asyncEventEmitter\n\n* Add source acknowledgements\n\n* Update packages/evm/test/asyncEvents.spec.ts\n\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\n\n* evm: lint\n\n* Update packages/evm/test/asyncEvents.spec.ts\n\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-10-20T19:33:00-04:00",
          "tree_id": "2100226b2708e3f162d9fc100a6abef31526ead1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b5a2f4b94dd514c375de1974d7b834c6a315b6e4"
        },
        "date": 1666308921309,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16167,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16740,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15145,
            "range": "±8.40%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16240,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15786,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "f886251449f635b64c08533ff052c1a786b75688",
          "message": "New Releases (EVM/VM Event Emitter Fix) (#2377)\n\n* Added CHANGELOG entry, bumped version number, updated ustream dependencies (Util v8.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated ustream dependencies (EVM v1.2.0)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated ustream dependencies (VM v6.2.0)\r\n\r\n* Updated package-lock.json",
          "timestamp": "2022-10-21T18:02:10+02:00",
          "tree_id": "a1e205b59a8c4f233bd370caecb3e114bd4c05d7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f886251449f635b64c08533ff052c1a786b75688"
        },
        "date": 1666368265157,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16280,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17420,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15959,
            "range": "±8.60%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17622,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16861,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "e6c2f6c1e96c431b3fa0f29ba899f05ef9f2a728",
          "message": "Fix devp2p link and specify language on code blocks (#2378)\n\n* specify language on code blocks on README.md for devp2p\r\n\r\n* fix link on devp2p packages to Node discovery protocol\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-24T10:58:36-04:00",
          "tree_id": "01dc66a41fb224c1159b33d33f68456bbf3c66f8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6c2f6c1e96c431b3fa0f29ba899f05ef9f2a728"
        },
        "date": 1666623650471,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15282,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15023,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14474,
            "range": "±7.10%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14476,
            "range": "±11.66%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15408,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "f9ff86196ac29a03c46bd2687bfb1f27fdfa1ebb",
          "message": "implementation of 'eth_getBlockTransactionCountByNumber' (#2379)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-24T11:32:59-04:00",
          "tree_id": "d47c13d674045556d2bec1c3a07c26307b7853fd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f9ff86196ac29a03c46bd2687bfb1f27fdfa1ebb"
        },
        "date": 1666625709328,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14821,
            "range": "±5.29%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15795,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15345,
            "range": "±6.80%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15152,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14651,
            "range": "±2.74%",
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
          "id": "72a0736b17c0241f2e9d0d23ad30bbd0ff9bddd9",
          "message": "client: Enhance skeleton sync to process batches of new payloads and fcUs (#2309)\n\n* client: Enhance skeleton sync to process batches of new payloads and fcUs\r\n\r\n* beacon sync run loop as now block execution callback is outside lock\r\n\r\n* set chain hardfork and log chain head\r\n\r\n* make flow concurrency safe\r\n\r\n* reset linked on backstep\r\n\r\n* fix skeleton specs\r\n\r\n* remove run with unlock\r\n\r\n* move locking to execution from vm\r\n\r\n* handle edge case\r\n\r\n* Stub out peers in peerpool\r\n\r\n* improve condition check\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* incorporate feedback\r\n\r\n* restore waiting for interval clearing\r\n\r\n* clearify return value\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-25T00:27:31+05:30",
          "tree_id": "a9a380f9a7aaaa2301ec109e69148e1a340718fa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/72a0736b17c0241f2e9d0d23ad30bbd0ff9bddd9"
        },
        "date": 1666637971468,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19413,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19764,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18806,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19300,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18711,
            "range": "±1.75%",
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
          "id": "fee6f1992ff1365f29c865f48916ae3aefa46e59",
          "message": "New EVM (EIP-3540) and Blockchain (ensure Lock) Releases (#2380)\n\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions (EVM v1.2.1)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions (Blockchain v6.0.2)\r\n\r\n* Updated package-lock.json",
          "timestamp": "2022-10-25T14:36:59+02:00",
          "tree_id": "6fdc850aafaee93e0a72ca7460cc4a95b22f6bdd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fee6f1992ff1365f29c865f48916ae3aefa46e59"
        },
        "date": 1666701620248,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9956,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10060,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9924,
            "range": "±5.53%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10223,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9978,
            "range": "±2.47%",
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
          "id": "a85081e4f7c93d6a02986dc1387dccdec3905b67",
          "message": "evm/vm: fix EIP3540 header lookalike parsing (#2381)",
          "timestamp": "2022-10-25T13:31:39-04:00",
          "tree_id": "8aa3578cd4285e252399715a73e2eec030891b54",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a85081e4f7c93d6a02986dc1387dccdec3905b67"
        },
        "date": 1666719309916,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9565,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9446,
            "range": "±4.15%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9726,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9253,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9803,
            "range": "±2.14%",
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
          "id": "985f2aa43c005573382b98423fcfd3bd368b2c8e",
          "message": "EVM: non-empty \"empty\" account bugfixes (#2383)\n\n* evm: fix mainnet bug EXTCODEHASH on origin account which appears empty but is not\r\n\r\n* evm: fix gas-related problems regarding non-empty \"empty\" accounts\r\n\r\n* vm: add consensus bug tests",
          "timestamp": "2022-10-26T16:20:57+02:00",
          "tree_id": "52ade1d4b2d4041987a55e6e32c71ba4908ff0da",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/985f2aa43c005573382b98423fcfd3bd368b2c8e"
        },
        "date": 1666794265161,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9732,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9717,
            "range": "±3.77%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9264,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9806,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9627,
            "range": "±2.71%",
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
          "id": "cc5bb5977b5d443ebb3437bfa0a2752e1b90e4d6",
          "message": "New EVM Bugfix Release v1.2.2 (#2384)\n\n* Added CHANGELOG entry, bumped version, updated upstream dependency versions (EVM v1.2.2)\r\n\r\n* Update packages/evm/CHANGELOG.md\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-26T18:39:39+02:00",
          "tree_id": "e1f8799503e1f00769065f0e84d272136224d162",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cc5bb5977b5d443ebb3437bfa0a2752e1b90e4d6"
        },
        "date": 1666802576857,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9753,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9478,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9649,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9100,
            "range": "±7.10%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9965,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "1c819323011c7af808bbca5eaa2de45eab70b289",
          "message": "fix link to Light client protocol on README.md (#2388)",
          "timestamp": "2022-10-27T09:46:21+02:00",
          "tree_id": "b64eab5208b43bedf56f6d9358efaeb036b092c3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1c819323011c7af808bbca5eaa2de45eab70b289"
        },
        "date": 1666856936041,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19223,
            "range": "±4.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19790,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18441,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19526,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18866,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "e0ea425aaae00c606f85db3eb3a3ddc09e3e45ad",
          "message": "fix devp2p README.md reference to `les.ts` (#2387)",
          "timestamp": "2022-10-27T15:41:36+02:00",
          "tree_id": "d073a67fb16185d8647330c91df6e08525c68b04",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e0ea425aaae00c606f85db3eb3a3ddc09e3e45ad"
        },
        "date": 1666878531763,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16536,
            "range": "±4.27%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17072,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16568,
            "range": "±5.94%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16890,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16408,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "9bdade6e95c5f1c184c97f2b3d8facc7ff10453e",
          "message": "devp2p README.md: fix link to eth protocol (#2385)",
          "timestamp": "2022-10-27T21:15:05+02:00",
          "tree_id": "7c47afbe69f01c94b4e9fb7037027c79d9243357",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9bdade6e95c5f1c184c97f2b3d8facc7ff10453e"
        },
        "date": 1666898283148,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17432,
            "range": "±4.04%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18053,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13118,
            "range": "±12.51%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11914,
            "range": "±13.73%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16650,
            "range": "±5.57%",
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
          "id": "e6c18851df309c96c6186d6facca3185024a11af",
          "message": "Integrate txpool fixes found in Shandong (#2382)\n\n* client: set stateroot when validating tx\r\n\r\n* fix miner and txpool test failures\r\n\r\n* More test fixes\r\n\r\n* Add fix for Transactions message parsing\r\n\r\n* fix txpool tests\r\n\r\n* test fixes\r\n\r\n* more test fixes\r\n\r\n* remove stray console log\r\n\r\n* use vmCopy for tx sender state validation\r\n\r\n* Fix test\r\n\r\n* Fix more tests\r\n\r\n* fix test\r\n\r\n* Add additional checks for chain height\r\n\r\n* Add explanatory comment\r\n\r\n* Add tests and fix newpooledtxhashes",
          "timestamp": "2022-10-29T22:00:22+05:30",
          "tree_id": "a48730acaa9057fd3a59400f9d723262d5a8b71d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6c18851df309c96c6186d6facca3185024a11af"
        },
        "date": 1667061230373,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9781,
            "range": "±4.00%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9805,
            "range": "±4.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9809,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9494,
            "range": "±7.56%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10147,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "5776107e9e0b2663062f084346acf80c84e498f4",
          "message": "Clean up `handleEth` (#2392)\n\n* client: change if...else if...  statements to switch statement.\r\n\r\n* client: change if...else if...  statements to switch statement.\r\n\r\n* Add test for newBlock after merge\r\n\r\n* Add test for GetBlockHeaders\r\n\r\n* add back commented out tests\r\n\r\n* More coverage tests\r\n\r\n* Add getPooledTxns test\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-31T14:10:34-04:00",
          "tree_id": "fdc91773642620f623d8b5210d7f116a85992e55",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5776107e9e0b2663062f084346acf80c84e498f4"
        },
        "date": 1667239991740,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19390,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19442,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19023,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19003,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18722,
            "range": "±1.82%",
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
          "id": "cd551ec3fae34518319437023848050b8e8ef7cd",
          "message": "evm: fix 3860 implementation + tests (#2397)\n\n* evm: fix 3860 implementation + tests\r\n\r\n* Adapt original EIP-3860 tests from vm\r\n\r\n* add test for Create2\r\n\r\n* Add test for CREATE\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-03T12:41:01-04:00",
          "tree_id": "ce3bb5d7e832c8c2d800826777ceb905516b205c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cd551ec3fae34518319437023848050b8e8ef7cd"
        },
        "date": 1667493816281,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19265,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19298,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18783,
            "range": "±5.51%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19124,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18724,
            "range": "±1.56%",
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
          "id": "4d8bbd10847659f885ccf489246b74b92f1c0066",
          "message": "Implement EIP4895: Beacon Chain withdrawals (#2353)\n\n* common: add eip 4895\r\n\r\n* block: implement EIP4895\r\n\r\n* vm: add EIP4895\r\n\r\n* block: eip4895 tests\r\n\r\n* vm: add eip4895 tests\r\n\r\n* block: fix trest\r\n\r\n* vm: fix tests\r\n\r\n* change withdrawal type to object format and add validator index\r\n\r\n* fix vm withdrawal spec\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-11-04T02:20:56+05:30",
          "tree_id": "ba26c5d6e0728e5afc4db1fe913fb27bd83af9de",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4d8bbd10847659f885ccf489246b74b92f1c0066"
        },
        "date": 1667508856437,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9704,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10131,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9628,
            "range": "±5.31%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9876,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9928,
            "range": "±2.39%",
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
          "id": "fd121bee508d2e8eb18e491f5a97182ab61224d3",
          "message": "client: Fix skeleton reset scenario when head announced before subchain 0 tail (#2408)",
          "timestamp": "2022-11-07T10:41:29+01:00",
          "tree_id": "13d08a625e5931442c76cad7159d4b65146f7bc7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fd121bee508d2e8eb18e491f5a97182ab61224d3"
        },
        "date": 1667814247188,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18970,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19078,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18210,
            "range": "±5.21%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18835,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18614,
            "range": "±1.68%",
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
          "id": "9d470d336fa2cd606dbac31c4c6f8a6a1981f878",
          "message": "client: Miscellaneous tx related fixes for eth methods  (#2411)\n\n* client: Extend RpcTx type with 1559 fields and make blockOpt optional in estimateGas\r\n\r\n* add optional block opt test\r\n\r\n* bundle validation\r\n\r\n* extract and add test for rpc tx field extenstion\r\n\r\n* Add test coverage\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-07T13:34:58-05:00",
          "tree_id": "f4ce386560caa137b33d2c6a1c1a080aa40de4a4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9d470d336fa2cd606dbac31c4c6f8a6a1981f878"
        },
        "date": 1667846294924,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9771,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10054,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9892,
            "range": "±4.24%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9951,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9968,
            "range": "±2.35%",
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
          "id": "6d23fd07290fb3217e3371b0c42425647e28e89c",
          "message": "Add txpool_content rpc method for pending txs fetch (#2410)\n\n* Add txpool_content rpc method for pending txs fetch\r\n\r\n* Fix rpc export\r\n\r\n* Add tests for `txpool_content`\r\n\r\n* address feedback\r\n\r\n* Include vm by default in rpc tests\r\n\r\n* Missed commits from shandong\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-09T12:05:56-05:00",
          "tree_id": "cd05f026435ca6444d7bc17bf0d52d515be443d1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6d23fd07290fb3217e3371b0c42425647e28e89c"
        },
        "date": 1668014108578,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19146,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18415,
            "range": "±4.90%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19435,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18814,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18368,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "5a300314a5377146f8115684ce5fbf3950e71164",
          "message": "Implementation of 'eth_gasPrice' (#2396)\n\n* support for eth_gasPrice\r\n\r\n* improve description\r\n\r\n* Update eth.ts\r\n\r\n* pr changes\r\n\r\n* update gas price main entry point for pr changes\r\n\r\n* removing tx lookup\r\n\r\n* adding minGasPrice config for 1559 chains\r\n\r\n* Update packages/client/lib/rpc/modules/eth.ts\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-11T12:49:06+01:00",
          "tree_id": "318e413a4ce57bcc01f034c209d84d5773b8e5bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5a300314a5377146f8115684ce5fbf3950e71164"
        },
        "date": 1668167508041,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18174,
            "range": "±4.91%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18556,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17468,
            "range": "±7.28%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18381,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17871,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "hossam.saraya@gmail.com",
            "name": "dlock",
            "username": "daedlock"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ccb47787b813c41697069b1aa025716372d27155",
          "message": "Change vm.evm.on to vm.evm.events.on (#2417)",
          "timestamp": "2022-11-11T12:46:53-05:00",
          "tree_id": "524d8932146f11b97fd017e4b19d498b6fdf78e2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ccb47787b813c41697069b1aa025716372d27155"
        },
        "date": 1668188965649,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19433,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18610,
            "range": "±5.42%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19863,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19120,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17591,
            "range": "±7.17%",
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
          "id": "a001b434b722a591d378835fbe3d81d78c04e924",
          "message": "stateManager: add EthersStateManager to exports (#2419)",
          "timestamp": "2022-11-14T13:44:48+01:00",
          "tree_id": "97a2fad3fb4060466630b829c50ec97ad3077877",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a001b434b722a591d378835fbe3d81d78c04e924"
        },
        "date": 1668430105702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10612,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10338,
            "range": "±4.73%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10770,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9981,
            "range": "±6.97%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10614,
            "range": "±2.75%",
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
          "id": "43966fc6ca77a92352e95a986d6bf4182783f813",
          "message": "client: Handle genesis and genesis extention properly for skeleton (#2420)",
          "timestamp": "2022-11-14T15:56:18+01:00",
          "tree_id": "84aa63ced90c8fe1391ec3e7b87f0c45b5fabaf5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/43966fc6ca77a92352e95a986d6bf4182783f813"
        },
        "date": 1668437953498,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15562,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16113,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15207,
            "range": "±8.67%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16244,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15951,
            "range": "±2.26%",
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
          "id": "fdd4397c91eaa1253d299f6b8b76a4cf861b0b68",
          "message": "client: Fix enode to ip4 and write the same to disk (#2407)\n\n* client: Fix enode to ip4 and write the same to disk\r\n\r\n* fix tests\r\n\r\n* handle test error\r\n\r\n* Add test for ipv6 parsing\r\n\r\n* update url\r\n\r\n* move writing to file to cli\r\n\r\n* Move function placement to make eslint happy\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-14T22:07:56+05:30",
          "tree_id": "63f1e557a29f250b0f73e32b5259079180fdb219",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fdd4397c91eaa1253d299f6b8b76a4cf861b0b68"
        },
        "date": 1668444075819,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10450,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10558,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10504,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10158,
            "range": "±6.85%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10757,
            "range": "±2.20%",
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
          "id": "614381a440119b2289c835c3770cb01dee62264f",
          "message": "client: Fix sendTransactions peer loop and enchance txpool logs  (#2412)\n\n* client: Enchance txpool logs with success/failure of add, broadcast, block selection logs\r\n\r\n* Txpool stats calculator on info or debug logging\r\n\r\n* remove console log\r\n\r\n* enable logging for txstats in test spec\r\n\r\n* add test cases for handled errors\r\n\r\n* add testcase for marking errored broadcasts\r\n\r\n* cover pool stats logger\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-11-15T09:05:16-05:00",
          "tree_id": "4543cd6b9321b3b01481cd5b542266c8679bc12e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/614381a440119b2289c835c3770cb01dee62264f"
        },
        "date": 1668521311436,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10462,
            "range": "±4.42%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10195,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10235,
            "range": "±6.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10728,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10580,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      }
    ]
  }
}