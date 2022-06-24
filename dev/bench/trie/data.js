window.BENCHMARK_DATA = {
  "lastUpdate": 1656083983039,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "8a65e1928bc555519d22d3a5d5f885a54eaf0eff",
          "message": "develop clean-up items (#1944)",
          "timestamp": "2022-06-08T13:05:28+02:00",
          "tree_id": "fecf01d02014ebf834478d6865498ccede9f81bd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8a65e1928bc555519d22d3a5d5f885a54eaf0eff"
        },
        "date": 1654686753631,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "[MemoryDB] 1k-3-32-ran",
            "value": 27734,
            "range": "±4.15%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[MemoryDB] 1k-5-32-ran",
            "value": 25384,
            "range": "±9.37%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "[MemoryDB] 1k-9-32-ran",
            "value": 27557,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-ran",
            "value": 27330,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-mir",
            "value": 43321,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 100 iterations",
            "value": 890,
            "range": "±6.69%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 500 iterations",
            "value": 116,
            "range": "±64.98%",
            "unit": "ops/sec",
            "extra": "44 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 1000 iterations",
            "value": 91.2,
            "range": "±5.27%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 5000 iterations",
            "value": 10.6,
            "range": "±69.93%",
            "unit": "ops/sec",
            "extra": "30 samples"
          },
          {
            "name": "[LevelDB] 1k-3-32-ran",
            "value": 25883,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "[LevelDB] 1k-5-32-ran",
            "value": 26528,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "[LevelDB] 1k-9-32-ran",
            "value": 25945,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-ran",
            "value": 25909,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-mir",
            "value": 42016,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 100 iterations",
            "value": 494,
            "range": "±78.96%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 500 iterations",
            "value": 150,
            "range": "±16.04%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 1000 iterations",
            "value": 69.37,
            "range": "±40.10%",
            "unit": "ops/sec",
            "extra": "54 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 5000 iterations",
            "value": 8.2,
            "range": "±109.44%",
            "unit": "ops/sec",
            "extra": "12 samples"
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
          "id": "5c093afe6030d572b31364761ae711f2cec75943",
          "message": "util: move package util to @ethereumjs namespace (#1952)\n\n* move package util to @ethereumjs namespace\r\n\r\n* fix the missed import\r\n\r\n* lint client",
          "timestamp": "2022-06-10T23:52:41+05:30",
          "tree_id": "fa3425d2c2c1652ae5ea41b8d9fa34dba015ed1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5c093afe6030d572b31364761ae711f2cec75943"
        },
        "date": 1654885753100,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "[MemoryDB] 1k-3-32-ran",
            "value": 30850,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "[MemoryDB] 1k-5-32-ran",
            "value": 28464,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[MemoryDB] 1k-9-32-ran",
            "value": 30761,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-ran",
            "value": 29481,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-mir",
            "value": 50956,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 100 iterations",
            "value": 939,
            "range": "±5.56%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 500 iterations",
            "value": 133,
            "range": "±53.31%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 1000 iterations",
            "value": 99.75,
            "range": "±4.59%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 5000 iterations",
            "value": 11.07,
            "range": "±76.33%",
            "unit": "ops/sec",
            "extra": "23 samples"
          },
          {
            "name": "[LevelDB] 1k-3-32-ran",
            "value": 28189,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[LevelDB] 1k-5-32-ran",
            "value": 27950,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "[LevelDB] 1k-9-32-ran",
            "value": 27941,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-ran",
            "value": 28088,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-mir",
            "value": 46126,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 100 iterations",
            "value": 430,
            "range": "±102.00%",
            "unit": "ops/sec",
            "extra": "35 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 500 iterations",
            "value": 191,
            "range": "±5.34%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 1000 iterations",
            "value": 93.39,
            "range": "±5.09%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 5000 iterations",
            "value": 13.93,
            "range": "±36.40%",
            "unit": "ops/sec",
            "extra": "33 samples"
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
          "id": "ab9a9d6f68a0e8c75aab1e9a8e363a1816160477",
          "message": "move mpt package to @ethereumjs namespace (#1953)",
          "timestamp": "2022-06-10T22:32:47+02:00",
          "tree_id": "5cba0582722f16cf002d0d2be5826806b8a3a01c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ab9a9d6f68a0e8c75aab1e9a8e363a1816160477"
        },
        "date": 1654893521558,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "[MemoryDB] 1k-3-32-ran",
            "value": 31401,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "[MemoryDB] 1k-5-32-ran",
            "value": 29262,
            "range": "±6.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "[MemoryDB] 1k-9-32-ran",
            "value": 31271,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-ran",
            "value": 31079,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-mir",
            "value": 53233,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 100 iterations",
            "value": 816,
            "range": "±43.09%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 500 iterations",
            "value": 205,
            "range": "±8.38%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 1000 iterations",
            "value": 98.73,
            "range": "±16.20%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 5000 iterations",
            "value": 20.3,
            "range": "±8.18%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "[LevelDB] 1k-3-32-ran",
            "value": 27932,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[LevelDB] 1k-5-32-ran",
            "value": 28522,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "[LevelDB] 1k-9-32-ran",
            "value": 19720,
            "range": "±60.44%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-ran",
            "value": 24611,
            "range": "±23.88%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-mir",
            "value": 47675,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 100 iterations",
            "value": 995,
            "range": "±4.65%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 500 iterations",
            "value": 89.86,
            "range": "±106.45%",
            "unit": "ops/sec",
            "extra": "35 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 1000 iterations",
            "value": 77.25,
            "range": "±36.40%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 5000 iterations",
            "value": 18.32,
            "range": "±5.45%",
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
          "id": "b9378efaacbcbbb48ead4b480dd1cf35966f2461",
          "message": "Util: Signature Code Cleanup (new) (#1945)\n\n* Util -> ecsign: remove function signature overloading, limit chainId, v to bigint, adopt tests and library usages\r\n\r\n* Util -> signature: fix misleading fromRpcSig() comment\r\n\r\n* Util -> signature: limit v and chainId input parameters to bigint\r\n\r\n* Util -> signature: fixed test cases\r\n\r\n* VM: EIP-3075 Auth Call test fixes\r\n\r\n* Util -> signature: simplify ecsign logic\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2022-06-13T11:53:44+02:00",
          "tree_id": "19ecabe3c210626a371c73848d4c0dfc96292f1c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b9378efaacbcbbb48ead4b480dd1cf35966f2461"
        },
        "date": 1655114365265,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "[MemoryDB] 1k-3-32-ran",
            "value": 29929,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "[MemoryDB] 1k-5-32-ran",
            "value": 28441,
            "range": "±7.48%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "[MemoryDB] 1k-9-32-ran",
            "value": 30621,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-ran",
            "value": 30015,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "[MemoryDB] 1k-1k-32-mir",
            "value": 50629,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 100 iterations",
            "value": 976,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 500 iterations",
            "value": 176,
            "range": "±10.50%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 1000 iterations",
            "value": 90.7,
            "range": "±16.34%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "[MemoryDB] Checkpointing: 5000 iterations",
            "value": 11.6,
            "range": "±74.05%",
            "unit": "ops/sec",
            "extra": "25 samples"
          },
          {
            "name": "[LevelDB] 1k-3-32-ran",
            "value": 28342,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "[LevelDB] 1k-5-32-ran",
            "value": 27951,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "[LevelDB] 1k-9-32-ran",
            "value": 27883,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-ran",
            "value": 27397,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "[LevelDB] 1k-1k-32-mir",
            "value": 46002,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 100 iterations",
            "value": 382,
            "range": "±97.91%",
            "unit": "ops/sec",
            "extra": "32 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 500 iterations",
            "value": 190,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 1000 iterations",
            "value": 46.05,
            "range": "±81.24%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "[LevelDB] Checkpointing: 5000 iterations",
            "value": 14.19,
            "range": "±44.31%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "a4c379ab7baa96fa30afb3828dcc0d34cc1234ea",
          "message": "refactor: migrate to `8.0.0` of `level` (#1949)\n\n* refactor: migrate to `8.0.0` of `level`\r\n\r\n* refactor: replace `level-mem` with `memory-level`\r\n\r\n* refactor: remove `MemoryDB`\r\n\r\n* refactor: https://github.com/Level/memory-level/blob/main/UPGRADING.md\r\n\r\n* wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-06-13T12:31:48+02:00",
          "tree_id": "fe35fbfb4937d305e64fadbdf28dd211ab4a201e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a4c379ab7baa96fa30afb3828dcc0d34cc1234ea"
        },
        "date": 1655116672005,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24574,
            "range": "±3.81%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24076,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 22463,
            "range": "±10.00%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 24753,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 40868,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 769,
            "range": "±6.93%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 107,
            "range": "±66.45%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 69.96,
            "range": "±19.97%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.71,
            "range": "±6.07%",
            "unit": "ops/sec",
            "extra": "28 samples"
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
          "id": "457863cdffb89992259dd9488ff4d0419d56252e",
          "message": "Fix client integration tests (#1956)\n\n* Re-enable integration tests\r\n\r\n* Remove hardcoded difficulty in mockchain blocks\r\n\r\n* Check for subchain before examining bounds\r\n\r\n* Copy common to avoid max listener warnings\r\n\r\n* make destroyServer async\r\n\r\n* Proper fix for setting difficulty in mockchain\r\n\r\n* reqId fix\r\n\r\n* remove the redundant while loop\r\n\r\n* wait for setTineout to clear out\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-14T02:51:40+05:30",
          "tree_id": "f3a03ed9cef74bd6f54c680d0225f9dd7a135b44",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/457863cdffb89992259dd9488ff4d0419d56252e"
        },
        "date": 1655155643141,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24349,
            "range": "±4.63%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23785,
            "range": "±7.25%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23406,
            "range": "±8.47%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 24866,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 41560,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 762,
            "range": "±7.25%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±67.98%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 68.7,
            "range": "±15.13%",
            "unit": "ops/sec",
            "extra": "55 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.92,
            "range": "±30.26%",
            "unit": "ops/sec",
            "extra": "26 samples"
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
          "id": "32d3f107f780f3a7d3df4ed375d69ecfd463fd5a",
          "message": "client: Fix blockchain db init (#1958)",
          "timestamp": "2022-06-14T10:39:35-04:00",
          "tree_id": "604e8061e9565db035c0e7f642499888e29d2e2a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/32d3f107f780f3a7d3df4ed375d69ecfd463fd5a"
        },
        "date": 1655217868768,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 31414,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 28987,
            "range": "±8.54%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 31123,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 30885,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 51727,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 993,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 141,
            "range": "±52.13%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 101,
            "range": "±4.97%",
            "unit": "ops/sec",
            "extra": "55 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.4,
            "range": "±66.65%",
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
          "id": "aff80c48d80f52352eb704e9d981eb1976a5149f",
          "message": "client: Miscellaneous fixes for beacon sync in reverseblockfetcher, skeleton, merge forkhash  (#1951)\n\n* Fix fetcher first,count tracking for reverseblockfetcher\r\n\r\n* some canonical fill logging improvs\r\n\r\n* set forkhash for merge as well\r\n\r\n* reverse block fetcher specs coverage enhancement\r\n\r\n* rename to numBlocksInserted for better clarity",
          "timestamp": "2022-06-15T01:39:54+05:30",
          "tree_id": "0e3cd8251a3be152d16f014784273151d3170b13",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aff80c48d80f52352eb704e9d981eb1976a5149f"
        },
        "date": 1655237687966,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30776,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 28026,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30699,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 30304,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 50244,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 948,
            "range": "±6.69%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 113,
            "range": "±71.42%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 97.75,
            "range": "±5.59%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 9.73,
            "range": "±98.24%",
            "unit": "ops/sec",
            "extra": "20 samples"
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
          "id": "d066bd387e372645edb04cc2897b27db59c36e65",
          "message": "Evm refactor (rebased on master a4c379a, 2022-06-13) (#1955)\n\n* vm: rename vmstate/eei\r\n\r\nvm: move eei/vmstate into new EEI dir\r\n\r\n* evm: setup type skeleton\r\n\r\n* vm/evm: update types\r\n\r\n* vm/eei: extra types\r\n\r\n* vm: extract EEI from EVM\r\n\r\n* vm: move types to correct place\r\n\r\nvm: fixes\r\n\r\n* vm: preliminary VmState removal\r\n\r\n* vm: add env to interpreter + extract getAddress from EEI\r\n\r\n* vm: extract getSelfBalance from EEI\r\n\r\n* vm: extract CallData* from EEI\r\n\r\n* vm: remove getCaller, getCodeSize, getCode, isStatic from EEI\r\n\r\n* vm: remove Tx-related methods from EEI\r\n\r\n* vm: remove block-related methods from EEI\r\n\r\n* vm: remove getChainId from EEI\r\n\r\n* vm: extract all call/selfdestruct/log-related logic from EEI\r\n\r\n* vm: extract environment from EEI\r\n\r\n* vm: remove evm/gasleft from EEI\r\n\r\n* vm: remove EIFactory. EVM now has singleton EEI\r\n\r\nvm: add comment\r\n\r\n* vm: add custom EEI/EVM options\r\n\r\n* vm: evm/eei/vm: rename certain properties, remove vmstate dependency\r\n\r\n* comment fix\r\n\r\n* vm/evm: ensure exp dynamic gas calculated in gas.ts not functions.ts\r\n\r\n* vm/evm: remove unnecessary item in Env\r\n\r\n* vm/interpreter: all state access via eei.state\r\n\r\n* vm/evm: remove gasRefund property and put this in runState\r\n\r\nvm: fix gas refunds on CREATE opcdoes\r\n\r\n* vm/evm: move `auth` from `_Env` to `RunState`\r\n\r\n* vm/evm: move return buffer into runstate\r\n\r\n* vm/evm: fix gas refunds\r\n\r\nvm/evm: fix gasRefund\r\n\r\n* vm/evm: move gasLeft as property of Interpreter into RunState\r\n\r\n* vm/evm: add AsyncEventEmitter type\r\nvm/evm: fixup TransientStorage/EEI creation\r\n\r\n* evm/interpreter: better type safety\r\n\r\n* client: fix build\r\n\r\n* evm: fix build\r\n\r\n* eei/evm: define EEI interface\r\n\r\n* evm/vm: use EEI Interface\r\n\r\n* evm/vm: add EVM interface and use this\r\n\r\n* vm: fix build\r\n\r\n* evm/eei: move transientStorage into EVM\r\n\r\n* evm: type cleanup\r\n\r\n* vm: ensure tests run (but fail)\r\n\r\n* VM -> API tests: fixed build\r\n\r\n* vm/tx: gasRefund always available\r\n\r\n* vm/tests: fix tests\r\n\r\n* vm: rename gas properties\r\n\r\n* client: fix build\r\n\r\n* vm: review and remove some TODOs\r\n\r\n* client: fix test builds\r\n\r\n* client: fix tests\r\n\r\n* vm/tests: remove transientstorage test\r\n\r\n* evm/eei: add copy methods\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-06-15T21:11:28+02:00",
          "tree_id": "877a063f1342f80668021ec04b62def987fca15e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d066bd387e372645edb04cc2897b27db59c36e65"
        },
        "date": 1655320578019,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30987,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 29045,
            "range": "±6.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30867,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 30442,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 51460,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 981,
            "range": "±5.41%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 146,
            "range": "±44.46%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 92.62,
            "range": "±15.86%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.79,
            "range": "±57.03%",
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
          "id": "c4d7682bcf46690c193bbc7be21ead6334569959",
          "message": "Disable client browser tests in Node nightly CI jobs (#1963)\n\n* Switch node nightly to run client unit tests\r\n\r\n* Set polyfill for async_hooks to stop webpack complaining\r\n\r\n* Add note about unsupported browser builds\r\n\r\n* have nightly run on branch pushes\r\n\r\n* Set supported node versions to 14, 16, 18\r\n\r\n* Have all node nightly tests run on 14 and above\r\n\r\n* Change client/devp2p to run on Node 14+\r\n\r\n* Fix typos\r\n\r\n* Remove push on branch from nightlys",
          "timestamp": "2022-06-16T12:39:20+02:00",
          "tree_id": "b2f7b598cba1181a8a8bcbf67e16b191a5f535bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c4d7682bcf46690c193bbc7be21ead6334569959"
        },
        "date": 1655376282036,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27736,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25627,
            "range": "±8.61%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26848,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26546,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 46343,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 886,
            "range": "±6.22%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 109,
            "range": "±70.31%",
            "unit": "ops/sec",
            "extra": "38 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 93.8,
            "range": "±5.38%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.12,
            "range": "±76.40%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "2bd7ae6f62f8b063b3d271b38341ec9688554008",
          "message": "VM/Client: fix tests (#1969)\n\n* vm: remove accidentally added file\r\n\r\n* client: lint fixes\r\n\r\n* vm: fix vm.copy\r\n\r\n* vm: fix benchmarks\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-16T20:34:15+02:00",
          "tree_id": "2ec319b88acd6343e9440419d55f721cbce87f4e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2bd7ae6f62f8b063b3d271b38341ec9688554008"
        },
        "date": 1655404749221,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 34547,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 31996,
            "range": "±7.10%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 34215,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 33542,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52515,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 690,
            "range": "±50.15%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 185,
            "range": "±10.87%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.34,
            "range": "±20.16%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.71,
            "range": "±69.85%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "ddee04d6dd53377c879b61c7e4702a29ffb705fb",
          "message": "Devp2p-ethereum-cryptography-dependency (#1947)\n\n* devp2p: import ethereum-cryptography package\r\n\r\n* devp2p: update utils to use ethereum-cryptography\r\n\r\n* devp2p: update src components to use ethereum-cryptography\r\n\r\n* devp2p: update tests to use ethereum-cryptography\r\n\r\n* devp2p: remove secp256k1 dependency\r\n\r\n* Rebase on master\r\n\r\n* devp2p: replace 'hi-base32' dependency with '@scure/base'\r\n\r\n* devp2p: delete unused import\r\n\r\n* devp2p: replace `keccak` use with `@noble/hashes`\r\n\r\n* devp2p: replace base64url dependency with base64url from '@scure/base'\r\n\r\n* devp2p: use publicKeyConvert instead of getPublicKey\r\n\r\n* devp2p: use exported keccak256.create() from ethereum-cryptography\r\ndefine Hash type based on return type\r\n\r\n* devp2p: update ethereum-cryptography dependency to 1.1.0\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-18T03:21:24-06:00",
          "tree_id": "07cc5880d00e0e40e12d1333ce3d60a4d99390a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ddee04d6dd53377c879b61c7e4702a29ffb705fb"
        },
        "date": 1655544403690,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33105,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 29860,
            "range": "±7.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32885,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32380,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52813,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 730,
            "range": "±52.39%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±9.99%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 91.83,
            "range": "±20.49%",
            "unit": "ops/sec",
            "extra": "54 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.28,
            "range": "±11.36%",
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
          "id": "71265541e5011d42e75e5bd0344ad1087e6a2d71",
          "message": "Trie (chore): reorganise files by technical domains (#1972)\n\n* chore(trie): reorganise files by technical domains\r\n\r\n* refactor(trie): break down `trie/node` into smaller files and renaming\r\n\r\n* chore(trie): install `@types/readable-stream` types",
          "timestamp": "2022-06-20T14:26:59+02:00",
          "tree_id": "9326c7b7ffb7d117cba3916f098c5b60c2018608",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/71265541e5011d42e75e5bd0344ad1087e6a2d71"
        },
        "date": 1655728333767,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33049,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30879,
            "range": "±7.01%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32390,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32062,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53284,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 776,
            "range": "±40.66%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 187,
            "range": "±9.36%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 91.17,
            "range": "±15.79%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.64,
            "range": "±58.26%",
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
          "id": "252e283182f52caba166abcb767e563ea7458d7f",
          "message": "evm - Extract evm from vm as standalone package (#1974)\n\n* Extract evm from vm as standalone package\r\n\r\n* evm build\r\n\r\n* Build fixes\r\n\r\n* fix client build\r\n\r\n* move run tx spec back to vm\r\n\r\n* evm: update changelog\r\n\r\n* vm: fix state tests runner\r\n\r\n* vm: ensure tests run\r\n\r\n* evm: fix tests\r\n\r\n* client: fix tests\r\n\r\n* Remove extra test scripts\r\n\r\n* lint fix for vm\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-06-21T12:41:03+02:00",
          "tree_id": "6ba6c0d87788bcc8d05febc61f67ded9be18ad4d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/252e283182f52caba166abcb767e563ea7458d7f"
        },
        "date": 1655808643814,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24644,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22379,
            "range": "±9.49%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 24563,
            "range": "±7.90%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 25221,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 41618,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 734,
            "range": "±8.11%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±66.26%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 69.02,
            "range": "±14.44%",
            "unit": "ops/sec",
            "extra": "52 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.71,
            "range": "±28.74%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "c5fb3169c004beca1de1340ebebb8838062dfb03",
          "message": " Monorepo: Remove esModuleInterop and allowSyntheticDefaultImports Options (cherry-picked) (#1975)\n\n* Monorepo: set esModuleInterop TS compiler option to false\r\n\r\n* client: change `import X` to `import * as X`\r\n\r\n* client: replace qheap with js-priority-queue\r\n\r\n* blockchain: change to import *\r\n\r\n* blockchain/tests: change to import *\r\n\r\n* block/test: change to import *\r\n\r\n* common: change to import *\r\n\r\n* common/tests: change to import *\r\n\r\n* devp2p: change imports to import * or require()\r\n\r\n* ethash/tests: change import tape to import * as\r\n\r\n* rlp/tests: change imports to import *\r\n\r\n* statemanager/test: change imports to import * as\r\n\r\n* trie/tests: change imports to import *\r\n\r\n* ts/tests: change imports to import *\r\n\r\n* util/tests: change imports to import *\r\n\r\n* vm: change json import to import *\r\n\r\n* vm/tests: change imports to import *\r\n\r\n* client/test: change imports to import *\r\n\r\n* vm/tests: fix API test imports\r\n\r\n* trie/benchmarks: fix benchmark test import\r\n\r\n* client: fix qheap import problem\r\n\r\n* Devp2p, EVM: fixed tests\r\n\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>",
          "timestamp": "2022-06-21T14:40:00+02:00",
          "tree_id": "05b40da563ff574d001fa8146b2cbbd9ec520835",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5fb3169c004beca1de1340ebebb8838062dfb03"
        },
        "date": 1655815811448,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33141,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 31374,
            "range": "±5.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32821,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32471,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54234,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 784,
            "range": "±45.08%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 203,
            "range": "±8.36%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 72.44,
            "range": "±50.31%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 20.81,
            "range": "±4.65%",
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
          "id": "1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040",
          "message": "Block validation methods, take 3 (#1959)\n\n* rename _validateHeaderFields\r\n\r\n* Move static consensus checks\r\n\r\n* block: fix header consensus validation tests\r\n\r\n* Move header.validate to blockhain\r\n\r\n* blockchain: fix tests related to headerValidate\r\n\r\n* move validateDifficulty to blockchain\r\n\r\n* block: fix difficulty tests\r\n\r\n* move blockchain dependendent validateUncle checks\r\n\r\n* block: fix `cliqueSigner` for default blocks\r\n\r\n* block: fix block tests\r\n\r\n* move blockchain dependent tests to blockchain\r\n\r\n* replace block.validate\r\n\r\n* Fix package build issues\r\n\r\n* ethash: fix test on invalidPOW\r\n\r\n* Move format level EIP1559 checks back to block\r\n\r\n* Fix EIP1559 tests, make validateGasLimit throw\r\n\r\n* blockchain: fix build issue\r\n\r\n* finish test fixes\r\n\r\n* various test fixes\r\n\r\n* vm: runTx fix\r\n\r\n* Add fix for kovan in genesis block\r\n\r\n* vm: last test fix\r\n\r\n* client: fix tests\r\n\r\n* client: miner and skeleton fixes\r\n\r\n* client: fix chainID test\r\n\r\n* client: fix skeleton tests\r\n\r\n* client: fix forkChoiceUpdate test\r\n\r\n* client: fix pendingBlock tests\r\n\r\n* new payload client instantiation fix plus lint cleanup\r\n\r\n* fix beaconsync integration spec\r\n\r\n* vm: fix examples\r\n\r\n* address feedback\r\n\r\n* test and parentheses fixes\r\n\r\n* test fixes\r\n\r\n* Remove unused clique check\r\n\r\n* Fix skeleton, again\r\n\r\n* fix skeleton, fix again\r\n\r\n* various client test fixes\r\n\r\n* clean up commented stubs\r\n\r\n* remove lint rule\r\n\r\n* client: fix integration test\r\n\r\n* blockchain: rename validation method\r\n\r\n* Update imports, fix qheap\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-21T18:09:39+02:00",
          "tree_id": "8b3ce968451effad1da644d499f4fe6aa1d26487",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040"
        },
        "date": 1655828424532,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 25956,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23640,
            "range": "±9.23%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26111,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 25362,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 41300,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 727,
            "range": "±6.92%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±64.03%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 74.57,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.94,
            "range": "±19.80%",
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
          "id": "008c4691a3a0fe598eb82fb98835148296af9a1e",
          "message": "Blockchain file reorganization (#1986)\n\n* Move index to blockchain\r\n\r\n* Reorganize exports\r\n\r\n* blockchain: move types to types.ts\r\n\r\n* block: make _errorMsg protected",
          "timestamp": "2022-06-22T20:01:39+02:00",
          "tree_id": "74f41cbbc043cf10127368cfdc7350d73b106e6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/008c4691a3a0fe598eb82fb98835148296af9a1e"
        },
        "date": 1655921238946,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 26806,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24539,
            "range": "±10.49%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27000,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26415,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 44551,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 830,
            "range": "±7.49%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±64.95%",
            "unit": "ops/sec",
            "extra": "43 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.35,
            "range": "±6.05%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.52,
            "range": "±23.57%",
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
          "id": "74d5937b115d419a7d3fd697bc9c321355204a33",
          "message": "Remove explicit browser builds as monorepo builds already target es2020 (#1985)\n\n* Remove explicity browser builds as monorepo builds\r\n\r\n* remove browser key from package.json except client",
          "timestamp": "2022-06-22T20:34:22+02:00",
          "tree_id": "4b99bdcca5166da67c9a1e243ad4c53604b6a270",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/74d5937b115d419a7d3fd697bc9c321355204a33"
        },
        "date": 1655923105025,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27558,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24935,
            "range": "±9.24%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27680,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26985,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 44884,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 793,
            "range": "±6.82%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 131,
            "range": "±29.06%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 79.98,
            "range": "±11.93%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.47,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "859087d6077f93be87187edb8e8139ccbd098600",
          "message": "Evm refactor updates (#1977)\n\n* evm/vm: move EEI back into VM\r\n\r\n* vm: fix build\r\n\r\n* evm: move evm folder up\r\n\r\n* evm: lint\r\n\r\n* vm: lint\r\n\r\n* vm/evm: move files around\r\n\r\n* evm/vm: fix tests\r\n\r\n* evm: cleanup dependencies\r\n\r\n* evm: remove more dependencies\r\n\r\n* vm: fix build\r\n\r\n* vm: fix CI/tests (?)\r\n\r\n* client: fix tests (?)\r\n\r\n* client; test fixes",
          "timestamp": "2022-06-23T11:12:19+02:00",
          "tree_id": "759002ab4f8cd2d4f01444f85a67e0ecdf542c47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/859087d6077f93be87187edb8e8139ccbd098600"
        },
        "date": 1655975775413,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33057,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30447,
            "range": "±7.25%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32385,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31979,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53985,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 746,
            "range": "±42.73%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±8.29%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.96,
            "range": "±16.48%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.02,
            "range": "±12.76%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "483a8e523fbcf835ea8f04e5a4dbce50983f7509",
          "message": "VM Folder restructure (#1991)\n\n* Rename index to vm.ts\r\n\r\n* vm: Move VMOpts to types, add index.ts\r\n\r\n* move all types to types.ts\r\n\r\n* vm: fix test imports\r\n\r\n* add param types in test\r\n\r\n* vm: fix type imports\r\n\r\n* Fix imports\r\n\r\n* vm: Fix benchmarks imports\r\n\r\n* Remove dist from vm imports\r\n\r\n* Fix bloom export\r\n\r\n* Fix test",
          "timestamp": "2022-06-23T22:00:16+02:00",
          "tree_id": "a926b43a5befbd88a5ab0d6699427fea46108e1d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/483a8e523fbcf835ea8f04e5a4dbce50983f7509"
        },
        "date": 1656014666370,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32434,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30344,
            "range": "±6.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32230,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31196,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52522,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 955,
            "range": "±5.56%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 144,
            "range": "±44.85%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.9,
            "range": "±16.19%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.77,
            "range": "±77.38%",
            "unit": "ops/sec",
            "extra": "24 samples"
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
          "id": "30bb25d9a13372aca4874e61ba9cd736a1d3cfc8",
          "message": "Add declaration map (#1992)",
          "timestamp": "2022-06-23T22:39:13+02:00",
          "tree_id": "e7609e9e7ecc265a4fc826969311d0ec4fbc17a9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/30bb25d9a13372aca4874e61ba9cd736a1d3cfc8"
        },
        "date": 1656017010752,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30046,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 27425,
            "range": "±10.85%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 31003,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29616,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 48701,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 915,
            "range": "±6.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 111,
            "range": "±65.89%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 96.01,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.54,
            "range": "±29.27%",
            "unit": "ops/sec",
            "extra": "24 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "micaiahreid@gmail.com",
            "name": "Micaiah Reid",
            "username": "MicaiahReid"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d49d08a740631e6899422056f1f6e00c432f85f2",
          "message": "remove untrue jsdoc comment on clearWarmedAccounts (#1997)",
          "timestamp": "2022-06-24T11:15:16-04:00",
          "tree_id": "8d9cc816fa2691c3c883aae4bd794ae1fe12a53a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d49d08a740631e6899422056f1f6e00c432f85f2"
        },
        "date": 1656083981126,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27944,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 26812,
            "range": "±9.62%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 29599,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29373,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 48091,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 777,
            "range": "±6.88%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 102,
            "range": "±67.73%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 86.5,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.31,
            "range": "±22.48%",
            "unit": "ops/sec",
            "extra": "31 samples"
          }
        ]
      }
    ]
  }
}