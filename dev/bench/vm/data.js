window.BENCHMARK_DATA = {
  "lastUpdate": 1724074724510,
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
          "id": "8441f9c5341bba19a9ee5850d7253ba009d6ecb7",
          "message": "util: refactor bigint to address helper into Address.fromBigInt method (#3544)\n\n* util: refactor bigint to address helper into fromBigInt constructor\r\n\r\n* evm: refactor using fromBigInt method\r\n\r\n* refactor: address constructor usage\r\n\r\n* evm: wrapper helper for evm stack bigint addresses\r\n\r\n* Update packages/evm/src/opcodes/util.ts\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* util: remove redundant conversion\r\n\r\n* address: add test vectors for big int constructor\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2024-07-27T00:51:27+02:00",
          "tree_id": "60f414a7640262ced283a559287dc2d6145d57a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8441f9c5341bba19a9ee5850d7253ba009d6ecb7"
        },
        "date": 1722034440208,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37735,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36223,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36748,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36086,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35233,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "91 samples"
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
          "id": "bcb0a84f24afada45cb574ac3e9e4cc501d65681",
          "message": "RPC: add data field to RpcError / eth_call error (#3547)\n\n* RPC: add optional data field to RpcError\r\n\r\n* RPC: throw error with data in eth_call\r\n\r\n* update tests\r\n\r\n* add tests for error code\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-07-27T01:31:57+02:00",
          "tree_id": "6aac8fc267413b8d43333248c59a6814b34aaf1f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bcb0a84f24afada45cb574ac3e9e4cc501d65681"
        },
        "date": 1722036874364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38637,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36433,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37375,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35952,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35925,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "def477a9df2f6f15fac9255804cc2ecfb529f291",
          "message": "Block: extract static Header constructors (#3550)\n\n* Block: move BlockHeader statics to constructors.ts\n\n* Block: delete statics from Header class\n\n* update functions downstream\n\n* fix imports\n\n* fix imports\n\n* Block: simply RLP function name\n\n* fix error",
          "timestamp": "2024-07-30T14:46:55-04:00",
          "tree_id": "b9741357c636329998f986ddb7d3b6e8bef3a1b0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/def477a9df2f6f15fac9255804cc2ecfb529f291"
        },
        "date": 1722365371904,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38067,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36532,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37252,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36348,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35641,
            "range": "±1.91%",
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
          "id": "05ecf69ae9b3045b99dfce7e17b0150a3465830e",
          "message": "Block: rename constructor createBlock (#3549)\n\n* Block: rename constructor to createBlock\r\n\r\n* blockchain: rename helper function\r\n\r\n* client: rename helper function in test\r\n\r\n* Block: remove unused util.ts\r\n\r\n* fix test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-07-30T21:08:18-04:00",
          "tree_id": "68adb79eb7b1139be45f774ca19fa9fb09ecf8fc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/05ecf69ae9b3045b99dfce7e17b0150a3465830e"
        },
        "date": 1722388254794,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38513,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37092,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37409,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36870,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35990,
            "range": "±1.64%",
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
          "id": "d7d1dabd98c8a4ebe1bd8702d179e1b980cf37b6",
          "message": "statemanager: refactor logic into capabilities (#3554)\n\n* statemanager; modifyAccountFields capability\n\n* statemanager: refactor cache related capabilities\n\n* statemanager: small fixes\n\n* statemanager: remove duplicate types2\n\n* client: fix import\n\n* Merge remote-tracking branch 'origin/master' into statemanager/refactor-into-capabilities",
          "timestamp": "2024-08-05T10:35:01-04:00",
          "tree_id": "f12df39d0df8b82970a013fbc9c07eceb5692dd1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d7d1dabd98c8a4ebe1bd8702d179e1b980cf37b6"
        },
        "date": 1722868792992,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38403,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36463,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37029,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36673,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35876,
            "range": "±1.69%",
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
          "id": "d50803ec3c5d411ff3b308f6296b66b7fdfa66d8",
          "message": "check if genesis difficulty is greater than ttd (#3556)",
          "timestamp": "2024-08-05T18:08:44+02:00",
          "tree_id": "3776e7251bac57b6cc78ffc33f6dd9135580ced2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d50803ec3c5d411ff3b308f6296b66b7fdfa66d8"
        },
        "date": 1722874283229,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38736,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36927,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37337,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36775,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35824,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "ca24a8c529d82eebe1419263c235fc519aae80f1",
          "message": "Block: rename createHeader functions (#3558)\n\n* Block: rename blockHeader constructors\n\n* update function names downstream",
          "timestamp": "2024-08-05T15:13:13-04:00",
          "tree_id": "fd313390118088757d8772189d5644b19d109955",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ca24a8c529d82eebe1419263c235fc519aae80f1"
        },
        "date": 1722885348757,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37987,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36154,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36951,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36145,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35247,
            "range": "±1.82%",
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
          "id": "401d6505e46e508d008eaad07228e0ad6309d448",
          "message": "Proof function renaming (#3557)\n\n* Rename createProof to createMerkleProof\r\n\r\n* Rename createProof for verkle to createVerkleProof\r\n\r\n* Rename createProof to createMerkleProof\r\n\r\n* Rename updateFromProof to updateTrieFromMerkleProof\r\n\r\n* Rename verifyProof to verifyMerkleProof\r\n\r\n* Rename verifyProof on verkle to verifyVerkleProof\r\n\r\n* Fix comment\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-08-05T12:48:27-07:00",
          "tree_id": "3760b36e673c79522b43551eeb361118efba2afc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/401d6505e46e508d008eaad07228e0ad6309d448"
        },
        "date": 1722887462015,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38671,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36468,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37754,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36664,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35804,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "c00859be6d181e14d80a41de0ab9ba997721464e",
          "message": "cleanup code doc in `createCommonFromGethGenesis` (#3559)",
          "timestamp": "2024-08-06T09:16:46+02:00",
          "tree_id": "28a1fb2bb03f4bbda2f3a5af4daeccf1c0f618b9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c00859be6d181e14d80a41de0ab9ba997721464e"
        },
        "date": 1722928761050,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38806,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36633,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37456,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36929,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35895,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "d2cef57c90277af2173c0961c4b293fa6ca4c63f",
          "message": "Add EOF container validation script (#3553)\n\n* evm: export EOFContainer / validateEOF\n\n* evm: add eof container validator script\n\n* validator: terminal: false\n\n* evm: read from pipe (?)\n\n* Merge branch 'master' into eof-fuzz\n\n* Merge branch 'master' into eof-fuzz\n\n* Merge remote-tracking branch 'origin/master' into eof-fuzz",
          "timestamp": "2024-08-07T06:10:10-04:00",
          "tree_id": "5aedd7a15285e196c1ec1e0e81bcb622c6ff5857",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2cef57c90277af2173c0961c4b293fa6ca4c63f"
        },
        "date": 1723025568560,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38262,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36317,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37117,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36525,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35830,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "91 samples"
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
          "id": "12eb962929c3cb63b98fab427d58ba22e6e1bc68",
          "message": "Update default hardfork (#3566)\n\n* Update default hardfork\r\n\r\n* Fix tests\r\n\r\n* Fix test\r\n\r\n* Fix tests",
          "timestamp": "2024-08-07T11:39:52-07:00",
          "tree_id": "a130ed57648dd31c8f7d71b35374c607343b098d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/12eb962929c3cb63b98fab427d58ba22e6e1bc68"
        },
        "date": 1723056151526,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38366,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36809,
            "range": "±3.17%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37320,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36811,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35847,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "f9788a1c1ee703de2b9bbd3b930ad80f5aeea834",
          "message": "Add `admin_peer` RPC endpoint (#3570)\n\n* add initial implementation of admin_peers\r\n\r\n* add more fields\r\n\r\n* fix versions\r\n\r\n* add test",
          "timestamp": "2024-08-08T10:36:35+02:00",
          "tree_id": "7259ebf85bfe22983d9537386c8df23bf3e3eff9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f9788a1c1ee703de2b9bbd3b930ad80f5aeea834"
        },
        "date": 1723106354449,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38362,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36510,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37355,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36842,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36381,
            "range": "±1.72%",
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
          "id": "60212036cd253de5c9a7cfd2168845f533c13d92",
          "message": "EVM: Generic BN254 (alt_BN128) Interface for Precompiles / Use @noble/curves By Default (#3564)\n\n* Rename BN254 (alt_BN128) interface to match the more generic naming scheme started with BLS\n\n* Add bn254 EVM constructor option, use option for existing rustbn.js passing instead of separate constructor parameter\n\n* Add a thin wrapper interface around pure rustbn, use interface within createEVM() method\n\n* Naming adjustments\n\n* Switch over to use Uint8Array as input and output values for the interface, encapsule string conversions for rustbn\n\n* One-time WASM initialization fix\n\n* Add dummy Noble interface\n\n* Add custom (temporary) @noble/curves build to EVM package.json\n\n* Rebuild package-lock.json\n\n* Temporary fix for conflicting @noble/curves versions\n\n* Integrate Noble usage for multiplication\n\n* Add generic equalityLengthCheck, moduloLengthCheck methods from BLS utils to precompile utils\n\n* Fix test\n\n* Minor\n\n* Fixes\n\n* Add validity assertion for G1 point\n\n* Replace equality length check with byte length correction (chop off or right-pad) as stated in EIP\n\n* Fixes\n\n* Add BN254 add implementation\n\n* Add additional pairing modulo length check since not safe to rely on implementation\n\n* Some basic alignment\n\n* First try on pairing (not working yet)\n\n* First pairing tests passing\n\n* Fixes\n\n* Merge branch 'master' into evm-bn254-precompile-native-js\n\n* Update @noble/curves to final v1.5.0 release\n\n* Rebuild package-lock.json\n\n* Merge branch 'master' into evm-bn254-precompile-native-js\n\n* Use plain Noble BN254 by default, clean-up, interface type exports, new --bn254 option for VM test runners (default: rustbn.js)\n\n* Move rustbn-wasm dependency over to EVM dev dependencies, add to client dependencies\n\n* Rebuild package-lock.json\n\n* Integrate in client",
          "timestamp": "2024-08-08T10:42:31-04:00",
          "tree_id": "133b0aa4b2754beb8278790c910d92b4cfc0c054",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/60212036cd253de5c9a7cfd2168845f533c13d92"
        },
        "date": 1723128320219,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38719,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36481,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37428,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36962,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36183,
            "range": "±1.72%",
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
          "id": "e82ffec75f137b9db7b180bd5ba64a5772d90ae9",
          "message": "common/tx/vm: export access lists / authority lists from tx (#3577)",
          "timestamp": "2024-08-12T08:38:01-04:00",
          "tree_id": "fc27abf4d765e44486ffdbe296f531f9066396c0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e82ffec75f137b9db7b180bd5ba64a5772d90ae9"
        },
        "date": 1723466442782,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37582,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35840,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36824,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36161,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35220,
            "range": "±1.71%",
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
          "id": "837a83fbfd3b381bcfda92b9ff91a811905a2a8d",
          "message": "tx: Cleanup 7702 tests (#3578)",
          "timestamp": "2024-08-12T10:32:55-04:00",
          "tree_id": "cbbe6e9c588f30cdc697fe7d88692e29fcd3ac8b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/837a83fbfd3b381bcfda92b9ff91a811905a2a8d"
        },
        "date": 1723473340024,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39047,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36827,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37640,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36966,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36131,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "45e0a6d621011fc1b28315bac80e3bd939d0cc37",
          "message": "statemanager: cache and other refactors (#3569)\n\n* Revert \"statemanager: refactor logic into capabilities (#3554)\"\r\n\r\nThis reverts commit d7d1dabd98c8a4ebe1bd8702d179e1b980cf37b6.\r\n\r\n* statemanager: refactor modifyAccountFields\r\n\r\n* statemanager: adjust return statements\r\n\r\n* statemanager: refactor separate caches into caches class\r\n\r\n* statemanager: fix shallow copy logic\r\n\r\n* client: fix vmexecution statemanager cache opts\r\n\r\n* statemanager: refactor some capabilities to caches methods\r\n\r\n* statemanager: fix tests\r\n\r\n* statemanager: refactor caches into optional opt passed in directly to the sm\r\n\r\n* statemanager: adjust tests with refactored caches\r\n\r\n* client: adjust vm execution with update cache\r\n\r\n* vm: fix vm tests\r\n\r\n* vm: adjust test runners with non-default caches\r\n\r\n* statemanager: simplify handling of deactivate\r\n\r\n* statemanager: remove redundant checks\r\n\r\n* statemanager: remove non null asesertion\r\n\r\n* statemanager: remove cache opt from key naming\r\n\r\n* statemanager: refactor rpc state manager to use caches\r\n\r\n* statemanager: fix rpc state manager tests\r\n\r\n* client: vmexecution cache stats refactor\r\n\r\n* statemanageR: updategetproof json-rpc call format\r\n\r\n* statemanager: remove deactivate from caches\r\n\r\n* client: remove deactivate from vm execution instantiation\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-08-12T12:07:15-04:00",
          "tree_id": "25c8c5f791c52a91a86a2cf752743a73afd25984",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/45e0a6d621011fc1b28315bac80e3bd939d0cc37"
        },
        "date": 1723479168321,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38117,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36351,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37116,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36249,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35556,
            "range": "±1.95%",
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
          "id": "4470cc38c9ce08aa98b53e7fe8a3a1371e05c437",
          "message": "monorepo: type cleanup (#3580)",
          "timestamp": "2024-08-12T18:56:42+02:00",
          "tree_id": "3531d6622dc9dc7334de8a34303367c832fc8c99",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4470cc38c9ce08aa98b53e7fe8a3a1371e05c437"
        },
        "date": 1723481961756,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38892,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36539,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37650,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37005,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35904,
            "range": "±1.95%",
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
          "id": "a930add0ce28c13adf1e2c751f85de4cd8f59a2a",
          "message": "util: add string[] type to rpcParams type (#3579)\n\n* util: add string array to rpc params\r\n\r\n* statemanager: remove as any typecast\r\n\r\n* statemanager: commented out code cleanuip",
          "timestamp": "2024-08-12T11:39:26-06:00",
          "tree_id": "3dd8f2e164d1c0fc0444a043e89cc903c3ae8bf7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a930add0ce28c13adf1e2c751f85de4cd8f59a2a"
        },
        "date": 1723484523320,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37677,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35741,
            "range": "±3.62%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36534,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35950,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35089,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "699cde206ea9e92b55f771498ea0319455a3dbbd",
          "message": "Prometheus cleanup (#3583)\n\n* Update prometheus metrics documentation\r\n\r\n* Return 404 as default case for prometheus server\r\n\r\n* Fix lint error",
          "timestamp": "2024-08-13T09:45:05+02:00",
          "tree_id": "99920dd4da5522d2c7eb568bd9d4f44adf02dd20",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/699cde206ea9e92b55f771498ea0319455a3dbbd"
        },
        "date": 1723535288361,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37190,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35417,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36060,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35344,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34694,
            "range": "±1.81%",
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
          "id": "0686310b2391ad2bd6e65e0a65e5fb1d312923c2",
          "message": "Remove EIP-3074 (#3582)\n\n* Remove EIP-3074\r\n\r\n* Fix EVM example\r\n\r\n* vm/evm: remove more auth(call) references\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-08-13T14:17:31-04:00",
          "tree_id": "368615bc350d119eb030b2b82a7808c750fe636c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0686310b2391ad2bd6e65e0a65e5fb1d312923c2"
        },
        "date": 1723573215813,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38085,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36170,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37163,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36145,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35391,
            "range": "±1.82%",
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
          "id": "9cb2ca8b63152195f0e1fb889ae401f8b758ec72",
          "message": "Example test runner: make script more readable / ensure examples do not `process.exit` (#3585)\n\n* devp2p/vm: ensure examples do not process.exit\n\n* vm: fix genesis state example + make linter happy\n\n* Update examples-runner: run per-file\n\n* devp2p: try to exit dpt\n\n* revert change in devp2p\n\n* Merge remote-tracking branch 'origin/master' into fix-examples-test-runner",
          "timestamp": "2024-08-13T21:29:55-04:00",
          "tree_id": "26e93e44cc3c85a07dbc77c391237bf87c64368e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9cb2ca8b63152195f0e1fb889ae401f8b758ec72"
        },
        "date": 1723599158852,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38143,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36172,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37060,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36348,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35685,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "1054c4ae436a13e3ca4627f477a90919e7a11c9e",
          "message": "Block: treeshaking tasks (#3586)\n\n* Block: move block and header into directories\r\n\r\n* Block: move \"fromRPC\" functions into constructors\r\n\r\n* Block: update imports in tests\r\n\r\n* fix linting errors\r\n\r\n* Block: rename createBlockFromValuesArray\r\n\r\n* Block: rename BlockHeaderFromValuesArray\r\n\r\n* lint fix\r\n\r\n* Mini-change to re-trigger CI\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-08-14T10:13:34+02:00",
          "tree_id": "558b0eda7bc2a14da34250920b5cb613d1f64778",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1054c4ae436a13e3ca4627f477a90919e7a11c9e"
        },
        "date": 1723623544750,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38085,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36152,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37015,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36439,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35940,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "91 samples"
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
          "id": "08c1062d24d98230121b0ee6ba9e77383fcc922e",
          "message": "Consolidate `normalizeTxParams` method usage (#3588)\n\n* consolidate normalizeTxParams in `tx`\r\n\r\n* lint",
          "timestamp": "2024-08-14T20:20:47+02:00",
          "tree_id": "4e75b6d2cedc685de0749a219cc9e08cb63589e6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/08c1062d24d98230121b0ee6ba9e77383fcc922e"
        },
        "date": 1723660018142,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38157,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36277,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36937,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36014,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35571,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "7b4e98dc5143ef2125c117ccb2d7138e2732ada3",
          "message": "update polkadot/util dep (#3595)",
          "timestamp": "2024-08-15T16:13:36+02:00",
          "tree_id": "460d3eceecfde120766c8859e35ad655a74e680a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7b4e98dc5143ef2125c117ccb2d7138e2732ada3"
        },
        "date": 1723731502606,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38080,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36051,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36449,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36158,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35324,
            "range": "±1.81%",
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
          "id": "66d599310b8f113aa8f80d3d2367d85e5622fee0",
          "message": "statemanager: re architect shallow copy to improve tree shaking (#3596)",
          "timestamp": "2024-08-15T16:58:49+02:00",
          "tree_id": "3c55c61029ef3c31ca92a06aac446aa43837c1f0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/66d599310b8f113aa8f80d3d2367d85e5622fee0"
        },
        "date": 1723734088575,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38889,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36815,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37492,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37133,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36193,
            "range": "±1.75%",
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
          "id": "81ef4957082c9ccb5434a4096fd78bbdb55e2168",
          "message": "Minor Release PR master Branch Port (#3594)\n\n* New Minor Releases (Prague Outlook, Bundle Fixes, Bugfixes) (#3527)\r\n\r\n* Update to the correct release date for the old releases\r\n\r\n* Add new release date in CHANGELOG files\r\n\r\n* CHANGELOG entries for Kaustinen5 PR, Util partial account CHANGELOG, docs and example\r\n\r\n* PrefixedHexString PR CHANGELOG integration\r\n\r\n* Add EIP-6110/EIP-7002/EIP-7685 related release notes, documentation updates and examples\r\n\r\n* Additional EIP-6110/EIP-7002 README inclusions, EIP table updates\r\n\r\n* Add EIP-2935 BLS precompile release notes and a new EVM precompile doc setion and example\r\n\r\n* Add EOACodeEIP7702Tx example, README section and CHANGELOG entry\r\n\r\n* Additional EIP-7702 CHANGELOG and README additions\r\n\r\n* More 7702\r\n\r\n* Small additions and some fixes for BLS CHANGELOG entries\r\n\r\n* Verkle related CHANGELOG additions\r\n\r\n* Various CHANGELOG additions\r\n\r\n* Add EIP-7251 consoldiation requests block example and extensive README section, Util CHANGELOG/README for the new class and other CHANGELOG/README additions\r\n\r\n* Add proper EIP-2935 (Serve historical block hashes from state) release notes\r\n\r\n* Adjust EIP-2935/7709 release notes, add EIP-7610 (state-related retroactive EIP) release notes\r\n\r\n* Additional release notes\r\n\r\n* Version bumps (Util)\r\n\r\n* Version bumps (Common)\r\n\r\n* Version bumps (Trie)\r\n\r\n* Version bumps (Verkle)\r\n\r\n* Version bumps (Tx)\r\n\r\n* Version bumps (Wallet)\r\n\r\n* Version bumps (Genesis)\r\n\r\n* Version bumps (Devp2p)\r\n\r\n* Version bumps (Ethash)\r\n\r\n* Version bumps (Block)\r\n\r\n* Version bumps (Blockchain)\r\n\r\n* Version bumps (StateManager)\r\n\r\n* Version bumps (EVM)\r\n\r\n* Version bumps (VM, client)\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Update release dates in CHANGELOG files\r\n\r\n* Fix typos and URLs\r\n\r\n* Minor nits\r\n\r\n* Update packages/block/CHANGELOG.md\r\n\r\n* Update packages/block/CHANGELOG.md\r\n\r\n* More consistent and improved EIP-7685 Requests docs/CHANGELOGs\r\n\r\n* Ensure EthJS and Grandine talk (#3511)\r\n\r\n* jwt-simple: ensure unpadded payloads are accepted\r\n\r\n* jwt-simple: ensure encoded jwts are also unpadded\r\n\r\n* Make 7702 outdated status more clear\r\n\r\n* 2935 fix\r\n\r\n* Small fixes\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Lint fix\r\n\r\n* Add generic examples:build script in root package.json\r\n\r\n* Fixes\r\n\r\n* EVM example fix\r\n\r\n* shorten stupid decode-opcodes example\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-08-15T17:23:42+02:00",
          "tree_id": "6112a1df7c0feb093b285d2fd36b08c0c0ca068e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/81ef4957082c9ccb5434a4096fd78bbdb55e2168"
        },
        "date": 1723735595344,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37760,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35781,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36228,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35747,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35527,
            "range": "±1.91%",
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
          "id": "2563fb848812e19fee1a76fe4662bcc9f46520bf",
          "message": "tx: rename method names (remove EIP word) (#3597)",
          "timestamp": "2024-08-16T15:15:39+02:00",
          "tree_id": "d6b237e5be719b677ee213330d22709a1b7cd689",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2563fb848812e19fee1a76fe4662bcc9f46520bf"
        },
        "date": 1723814318364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 38023,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36053,
            "range": "±4.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36821,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36481,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35656,
            "range": "±1.64%",
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
          "id": "0aa744599aeb682a2a234d58f044955569f89dec",
          "message": "utils: refactor trie and verkle utils (#3600)\n\n* verkle: remove bytes utils\r\n\r\n* util: add matching bytes length util from verkle\r\n\r\n* util: refactor PrioritizedTaskExecutor\r\n\r\n* verkle: remove extra import",
          "timestamp": "2024-08-17T13:11:09+02:00",
          "tree_id": "63065d771367b7d3de7724d9ed49054498300996",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0aa744599aeb682a2a234d58f044955569f89dec"
        },
        "date": 1723893229905,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37918,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 37018,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36031,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36084,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34738,
            "range": "±1.87%",
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
          "id": "4a8761a89f01492763edde27824c4718d6a8bf34",
          "message": "Add CSpell checker to CI and fix typos (#3590)\n\n* monorepo: add cspell, add ALL unknown words to valid words\r\n\r\n* cspell: split unknown words in ts/md\r\n\r\n* filter out wrong words in cspell-ts.json\r\n\r\n* cspell ignore hex values\r\n\r\n* fix typos in all packages\r\n\r\n* cspell: use cache\r\n\r\n* cspell: update commands\r\n\r\n* cspell: update md/ts words\r\n\r\n* Typo fixes for README/CHANGELOG files\r\n\r\n* cspell: ensure all relevant monorepo md files are checked\r\n\r\n* ci: add cspell job\r\n\r\n* cspell: update command\r\n\r\n* temp add bogus to markdown\r\n\r\n* remove bogus spell\r\n\r\n* update ci name\r\n\r\n* fix remaining typos + add words to cspell dict\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\n* Update packages/util/CHANGELOG.md\r\n\r\n* address review\r\n\r\n* Remove almost all `cspell:ignore` (#3599)\r\n\r\n* remove almost all cspell:ignore\r\n\r\n* more spell changes\r\n\r\n* cspell: fix problems\r\n\r\n* evm: fix quadCoefficient\r\n\r\n* cspell: fixes\r\n\r\n* remove disable line\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-08-17T20:16:25+02:00",
          "tree_id": "4e573304dfd37aa2536270051b9a53f76b5ba410",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4a8761a89f01492763edde27824c4718d6a8bf34"
        },
        "date": 1723918756301,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37677,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35559,
            "range": "±3.65%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 37249,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36416,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35473,
            "range": "±1.81%",
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
          "id": "9856f660597edfc4e90b7bdce4e9bdc5b697553c",
          "message": "VM/SM: Bundle Optimizations (Default wo Caches+EVMMockBlockchain, SM Code put() Fix, VerkleSM out, runTx()+Code Opts) (#3601)\n\n* Use shallowCopy() Caches copy() optimization also for VerkleSM to avoid Caches bundling on non-Caches default\r\n\r\n* Fix default state manager missing direct code write when used without caches\r\n\r\n* Do not initialize caches for default VM state manager\r\n\r\n* Remove copy test not making sense any more under generalized cache/no-cache conditions\r\n\r\n* Some more solid/qualified EVM dummy blockchain + interface naming to allow for exporting\r\n\r\n* Use EVMMockBlockchain(Interface) as default for the VM, adjust some tests\r\n\r\n* Move @ethereumjs/blockchain to dev dependencies in VM\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Adjust/fix some client tests\r\n\r\n* Lint fix\r\n\r\n* Add Verkle SM methods as optional methods to interface, replace VerkleSM imports and castings in VM\r\n\r\n* Also align client (no real effect yet, but generally try to work more on the interfaces and not the classes directly)\r\n\r\n* Initialize runTx() default block with simpler constructor to avoid drawing all txs in\r\n\r\n* Fully switch to DEFAULT_HEADER in VM.runTx() to avoid drawing in block code\r\n\r\n* Opcode list size optimization\r\n\r\n* More optimizations\r\n\r\n* Precompile code optimizations\r\n\r\n* More optimizations (precompile index.ts file)\r\n\r\n* Some more\r\n\r\n* Some doc compatification\r\n\r\n* Add CSpell checker to CI and fix typos (#3590)\r\n\r\n* monorepo: add cspell, add ALL unknown words to valid words\r\n\r\n* cspell: split unknown words in ts/md\r\n\r\n* filter out wrong words in cspell-ts.json\r\n\r\n* cspell ignore hex values\r\n\r\n* fix typos in all packages\r\n\r\n* cspell: use cache\r\n\r\n* cspell: update commands\r\n\r\n* cspell: update md/ts words\r\n\r\n* Typo fixes for README/CHANGELOG files\r\n\r\n* cspell: ensure all relevant monorepo md files are checked\r\n\r\n* ci: add cspell job\r\n\r\n* cspell: update command\r\n\r\n* temp add bogus to markdown\r\n\r\n* remove bogus spell\r\n\r\n* update ci name\r\n\r\n* fix remaining typos + add words to cspell dict\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\n* Update packages/util/CHANGELOG.md\r\n\r\n* address review\r\n\r\n* Remove almost all `cspell:ignore` (#3599)\r\n\r\n* remove almost all cspell:ignore\r\n\r\n* more spell changes\r\n\r\n* cspell: fix problems\r\n\r\n* evm: fix quadCoefficient\r\n\r\n* cspell: fixes\r\n\r\n* remove disable line\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Fix spell check\r\n\r\n* Remove accidentally committed examples/test.ts file\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-08-19T15:36:01+02:00",
          "tree_id": "eba28bd07ea3435889e3f7b3d8cb1799de03a126",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9856f660597edfc4e90b7bdce4e9bdc5b697553c"
        },
        "date": 1724074723612,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 37877,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35937,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 36656,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35733,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34971,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      }
    ]
  }
}