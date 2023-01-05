window.BENCHMARK_DATA = {
  "lastUpdate": 1672906312476,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "fd8c2827eed78c0d9394278552408e3c3a571db8",
          "message": "client: Use unpadded int/bigint to buffer in net protocols (#2409)\n\n* client: Correctly encode 0 in the devp2p protocols\r\n\r\n* lint\r\n\r\n* lint\r\n\r\n* respond with empty buffer than 0\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* fix return type\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* remove bufferlike\r\n\r\n* use unpadded versions\r\n\r\n* add spec test\r\n\r\n* fix typo\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-11-16T13:02:59+01:00",
          "tree_id": "5df9ff9913ada38f2f072b83095d8edc2d9c887b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fd8c2827eed78c0d9394278552408e3c3a571db8"
        },
        "date": 1668600333247,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19277,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18512,
            "range": "±4.53%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19718,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18998,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17100,
            "range": "±9.46%",
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
          "id": "5274b49e07ced73259617861e5115ddbc188427f",
          "message": "Optimize the fromSource dockerfile package install (#2425)\n\n* Optimize the fromSource dockerfile package install\r\n\r\n* fix the Dockerfile.fromSource",
          "timestamp": "2022-11-16T15:22:43+01:00",
          "tree_id": "dac7fb8f4442b1f0540f465a63560a1b2de4a67f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5274b49e07ced73259617861e5115ddbc188427f"
        },
        "date": 1668608722467,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17980,
            "range": "±3.93%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17522,
            "range": "±5.75%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18531,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18070,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16156,
            "range": "±10.29%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "a00251d4d4da850a29c4027e91ee5badf0c22df3",
          "message": "client: Implement withdrawals via engine api (#2401)\n\n* client: Implement v2 versions for execution api supporting withdrawals\r\n\r\n* create v2 endpoints and proxy them to main handlers\r\n\r\n* refac withdrawals to have a correct withdrawal object\r\n\r\n* fix lint\r\n\r\n* add v2 versions and withdrawal validator\r\n\r\n* extract out withdrawals as separate class\r\n\r\n* use withdrawal in newpayload\r\n\r\n* fix the v2 binding for fcu\r\n\r\n* add withdrawals to block building\r\n\r\n* add withdrawals to shanghai\r\n\r\n* fully working withdrawals feature\r\n\r\n* add withdrawals data in eth getBlock response\r\n\r\n* check genesis annoucement\r\n\r\n* fix and test empty withdrawals\r\n\r\n* add static helpers for trie roots\r\n\r\n* clean up trie roots\r\n\r\n* fix withdrawals root to match with other clients\r\n\r\n* skeleton improv + withdrawal root check\r\n\r\n* add the failing withdrawal root mismatch testcase\r\n\r\n* fix the stateroot mismatch\r\n\r\n* skip withdrawal reward if 0 on runblock too\r\n\r\n* fix spec\r\n\r\n* restore the buildblock's trieroot method\r\n\r\n* rename gen root methods\r\n\r\n* improve the jsdocs\r\n\r\n* genesis handling at skeleton sethead\r\n\r\n* cleanup skeleton\r\n\r\n* cleanup bigint literal\r\n\r\n* remove extra typecasting\r\n\r\n* add comments for spec vec source\r\n\r\n* withdrawal spec vector in test\r\n\r\n* improve var name\r\n\r\n* refactor withdrawal and enhance spec test\r\n\r\n* add zero amount withdrawal test case for vm block run\r\n\r\n* add spec test for buildblock with withdrawals",
          "timestamp": "2022-11-18T11:16:13+01:00",
          "tree_id": "941db929f0e4dcb72c52d4b036067d4343eaf41b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a00251d4d4da850a29c4027e91ee5badf0c22df3"
        },
        "date": 1668766756155,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14899,
            "range": "±4.03%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15014,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14294,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15031,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14616,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "77 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aleksandar.cakalic@gmail.com",
            "name": "Aleksandar Cakalic",
            "username": "Cussone"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "161a4029c2fc24e5d04da6ad3aab4ac3c72af0f8",
          "message": "common: Arbitrum One support (#2426)\n\n* Add `ArbitrumOne` to `enums.ts`\r\n\r\n* Add `ArbitrumOne` check to `static custom` method of `Common` class",
          "timestamp": "2022-11-18T18:21:09+01:00",
          "tree_id": "9ea70e8b577d0b2a9b6d99f94db8c23c7d87fa81",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/161a4029c2fc24e5d04da6ad3aab4ac3c72af0f8"
        },
        "date": 1668792243843,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18926,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19065,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18479,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18760,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18495,
            "range": "±1.51%",
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
          "id": "33f68c6827e75de3f266199855c34f2c136517e2",
          "message": "common: Parse post-merge hardfork config in parseGethParams and handle post-merge genesis block (#2427)\n\n* correctly set hf order\r\n\r\n* test specs\r\n\r\n* fix the merge hf push condition\r\n\r\n* try placing merge block in better wat\r\n\r\n* fix test spec for kiln\r\n\r\n* alternate fix of skipping only pos validation on genesis\r\n\r\n* move merge validations to non genesis\r\n\r\n* fix unsupported test case\r\n\r\n* correctly set hardfork\r\n\r\n* resolve test genesis poisioning\r\n\r\n* add comment\r\n\r\n* cli arg for mergeforkid placement\r\n\r\n* place merge only after genesis\r\n\r\n* fix tests\r\n\r\n* restore test\r\n\r\n* address another case for merge just post genesis\r\n\r\n* test case for the new edge case\r\n\r\n* add comment",
          "timestamp": "2022-11-22T14:33:46+01:00",
          "tree_id": "5f5c6cc0f865670de619cfc632499d8ea4851776",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/33f68c6827e75de3f266199855c34f2c136517e2"
        },
        "date": 1669124190663,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18151,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17505,
            "range": "±5.68%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18045,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15657,
            "range": "±10.73%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18390,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "256bdb92f6dd57f6b4e1ab4ca44b25ed37385c3c",
          "message": "EthJS DEBUG variable (#2433)\n\n* EVM: check for 'ethjs' DEVUG variable\r\n\r\n* vm: check for 'ethjs' DEBUG variable\r\n\r\n* devp2p: check for 'ethjs' DEVUG variable\r\n\r\n* statemanager: : check for 'ethjs' DEBUG variable\r\n\r\n* Update test scripts with 'ethjs' DEBUG variable",
          "timestamp": "2022-11-28T12:19:08+01:00",
          "tree_id": "eca08d01dd5ae997b79850a5c1448e0ce03c3c50",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/256bdb92f6dd57f6b4e1ab4ca44b25ed37385c3c"
        },
        "date": 1669634507833,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19329,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18534,
            "range": "±5.12%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19729,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19167,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17261,
            "range": "±8.95%",
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
          "id": "dc4cd91831bbfc145a1e6812a9da836c1eb2ae6a",
          "message": "Fix nonce problem (#2404)\n\n* vm/evm: update nonce before entering execution frame\r\n\r\n* vm/evm: update nonce in evm",
          "timestamp": "2022-12-02T10:11:02-05:00",
          "tree_id": "8f64a405e0eeb77a2ed1491de58fe5830c8a6a05",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dc4cd91831bbfc145a1e6812a9da836c1eb2ae6a"
        },
        "date": 1669994018827,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19456,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19435,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18949,
            "range": "±5.45%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19302,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18864,
            "range": "±1.53%",
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
          "id": "45490452b9709818c343b594b71b835674a2e1a9",
          "message": "evm: optimize memory extensions (MSTORE/MLOAD related ops) (#2405)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-02T10:59:51-05:00",
          "tree_id": "3422d1ea9f6bd1c714457a4e6a50d5b3407f045d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/45490452b9709818c343b594b71b835674a2e1a9"
        },
        "date": 1669997502465,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14155,
            "range": "±5.85%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14982,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13902,
            "range": "±8.47%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15561,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14619,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "48c3d85c630f20d1f83f2b4c5dfab1a286b8a33f",
          "message": "pre-shanghai: Eof testnet setup (#2316)\n\n* client: Shandong testnet single instance sim run\r\n\r\n* remove extra rebased code\r\n\r\n* reduce diff\r\n\r\n* lint\r\n\r\n* remove feeHistory stub\r\n\r\n* add shandong cleanup comment\r\n\r\n* rename shandong to eof\r\n\r\n* make NETWORK specification mandatory\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-05T22:53:55+05:30",
          "tree_id": "e2b782799244230320b5b9b925d777689465a822",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/48c3d85c630f20d1f83f2b4c5dfab1a286b8a33f"
        },
        "date": 1670261207334,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18396,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17724,
            "range": "±4.43%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18267,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16183,
            "range": "±10.49%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18671,
            "range": "±1.41%",
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
          "id": "b6a896bad4abc285fea1ea92f5c0e363c7f45ee6",
          "message": "evm: fix forfeiting refunds/selfdestructs when there is a codestore-out-of-gas error (chainstart/frontier only) (#2439)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-12-06T14:54:25+01:00",
          "tree_id": "d83261f98c0a3d6ec66284fa6373ed5f4154851d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b6a896bad4abc285fea1ea92f5c0e363c7f45ee6"
        },
        "date": 1670335021641,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19500,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18586,
            "range": "±4.97%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19660,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19128,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17001,
            "range": "±9.37%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "ea4288e644059faf109deae150ee68f18056c5e1",
          "message": "Fix logic bug in txPool.validate (#2441)\n\n* Fix logic bug in txPool.add\r\n\r\n* Fix sendRawTransaction test\r\n\r\n* Fix other broken test\r\n\r\n* Fix integration test",
          "timestamp": "2022-12-07T10:21:58+01:00",
          "tree_id": "25e635219765e90fe48092693463ca244349e542",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ea4288e644059faf109deae150ee68f18056c5e1"
        },
        "date": 1670405102127,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16613,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16257,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15501,
            "range": "±7.86%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16187,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15848,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "78 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "tim@daubenschuetz.de",
            "name": "Tim Daubenschütz",
            "username": "TimDaub"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0d398cba77d7e5d88566076b58379400c1f0d3b8",
          "message": "In readme, remove references to LevelDB abstraction (#2434)\n\n`LevelDB` abstraction was removed and can now not be imported through @ethereumjs/trie >= 5.0.0 anymore. Hence, for most examples in the readme.md file, we're removing references to a top-level exported `LevelDB` abstraction, and we're replacing it with the generic and in-memory `MapDB` implementation.",
          "timestamp": "2022-12-07T11:00:07+01:00",
          "tree_id": "6c17cd6db670c2bddf4dff98b2e0f637e6c53141",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0d398cba77d7e5d88566076b58379400c1f0d3b8"
        },
        "date": 1670407770382,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19363,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18391,
            "range": "±4.59%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19429,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18880,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17326,
            "range": "±7.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "f34d2376dc0a8bef096b69e890308428a33297a4",
          "message": "Common custom chain bugs (#2448)\n\n* Fix two edge case bugs",
          "timestamp": "2022-12-13T08:52:12-05:00",
          "tree_id": "18f0b73b684b8dab409c99e1471aa8a3a93bdf51",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f34d2376dc0a8bef096b69e890308428a33297a4"
        },
        "date": 1670939743681,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9531,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9421,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9666,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9175,
            "range": "±6.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9872,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "c1bf118ccd9cc48fbbad564a97eda63629f6bd16",
          "message": "Implement `debug_traceTransaction` RPC endpoint (#2444)\n\n* add basic debug_traceTransaction rpc endpoint\r\n\r\n* Add first test\r\n\r\n* WIP tests\r\n\r\n* Add test for simple code execution\r\n\r\n* Add more tests\r\n\r\n* rename test data file\r\n\r\n* add tracer opts validation\r\n\r\n* add structLog interface\r\n\r\n* Add storage to structLogs\r\n\r\n* add error to structLogs\r\n\r\n* Throw on enabling return data opt\r\n\r\n* Update tests\r\n\r\n* Remove invalid test\r\n\r\n* Add tests for other invalid params",
          "timestamp": "2022-12-13T10:27:56-05:00",
          "tree_id": "64eb1b9694f0895a2576edee9600c8bb5f6f60c8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1bf118ccd9cc48fbbad564a97eda63629f6bd16"
        },
        "date": 1670945446695,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18380,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17890,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16639,
            "range": "±9.05%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18618,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17729,
            "range": "±1.97%",
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
          "id": "7e77b0f434661b00c8056b541dcdae636c7f9c42",
          "message": "Exclude sim from client unit tests (#2447)",
          "timestamp": "2022-12-13T21:28:35+05:30",
          "tree_id": "5702d5f60d261e53cf91ebe8961009fb7ce56e1e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7e77b0f434661b00c8056b541dcdae636c7f9c42"
        },
        "date": 1670947272051,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19432,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19443,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18995,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19158,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18880,
            "range": "±1.53%",
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
          "id": "18753754fe905591085caf65f82b812be7146507",
          "message": "common: Implement hardfork by time (#2437)\n\n* common: Implement hardfork by time\r\n\r\n* fix the interface and add pass timestamp param\r\n\r\n* fix eval\r\n\r\n* fixes\r\n\r\n* fix next nextHardforkBlock\r\n\r\n* fix next hf\r\n\r\n* fix shanghai time\r\n\r\n* fix hf cond\r\n\r\n* handle edgecase\r\n\r\n* add some permuation combinations for two timestamp based hardforks\r\n\r\n* fix blockchain checkAndTransition hardfork\r\n\r\n* remove null/undefined hardforks from geth genesis while parsing\r\n\r\n* address feedback\r\n\r\n* incorp feedback\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Rename unofficial hardforks\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-14T10:51:35-05:00",
          "tree_id": "2a9cae3fa394c29795de79cf09e595bbd51c9530",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/18753754fe905591085caf65f82b812be7146507"
        },
        "date": 1671033252815,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18501,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18862,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17711,
            "range": "±7.79%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18623,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18364,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zyx1993@126.com",
            "name": "Jowie",
            "username": "JowieXiang"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d84b87787333c6306862cb2990525d87ce89039",
          "message": "Add eth_getTransactionByBlockHashAndIndex RPC Endpoint (#2443)\n\n* getTransactionByBlockHashAndIndex\n\n* add tests\n\n* fix only\n\n* Remove commented code\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-14T12:15:11-05:00",
          "tree_id": "94f31bbe5f6e3528419ca59f4b528e8e9ddecef1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9d84b87787333c6306862cb2990525d87ce89039"
        },
        "date": 1671038271398,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19232,
            "range": "±4.25%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18200,
            "range": "±5.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19623,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18910,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16965,
            "range": "±8.83%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "696b36fe9091cd67f3e0a70bc696e41bd16e57a2",
          "message": "New December Releases (#2445)\n\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs, some withdrawal module code docs (Util v8.0.3)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Common v3.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Trie v5.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Tx v4.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Block v4.1.0)\r\n\r\n* Added withdrawal code example to Block README\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (StateManager v1.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Devp2p v5.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Ethash v2.0.2)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (Blockchain v6.1.0)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (EVM v1.2.3)\r\n\r\n* Added CHANGELOG entry, bumped version number, updated upstream dependency versions, rebuild docs (VM v6.3.0)\r\n\r\n* Client -> Release: Bumped version to v0.6.6, added CHANGELOG entry\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Release updates (removed sharding and EOF internal HFs, CHANGELOG updates (in particular Hardfork-By-Time addition))\r\n\r\n* Remove extraneous comment\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-15T16:55:46+01:00",
          "tree_id": "54af64530cb76379ec4c18aee1c3e0b85176a38f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/696b36fe9091cd67f3e0a70bc696e41bd16e57a2"
        },
        "date": 1671119937140,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14862,
            "range": "±3.70%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14861,
            "range": "±4.73%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14035,
            "range": "±8.42%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15440,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14850,
            "range": "±2.57%",
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
          "id": "47403fc028e1098bd625ff32ee3b5441481cdfbf",
          "message": "Fix EVM test scripts (#2451)\n\n* Fix coverage test script\r\n\r\n* Fix tests\r\n\r\n* Update tests",
          "timestamp": "2022-12-16T10:51:10+01:00",
          "tree_id": "5b84d6ec2a001b95514d5ba854033f504c0d43c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/47403fc028e1098bd625ff32ee3b5441481cdfbf"
        },
        "date": 1671184432453,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19545,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18885,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19861,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19128,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17024,
            "range": "±8.37%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "9966408adb104f09747a65f7285585f63e90a8cf",
          "message": "client: Build block fixes (#2452)\n\n* set hardfork by time fixes\r\n\r\n* bump test coverage\r\n\r\n* further cleanup\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-12-16T16:36:17+01:00",
          "tree_id": "0dee1d57430a308fca99bbb074cd42950e55cd97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9966408adb104f09747a65f7285585f63e90a8cf"
        },
        "date": 1671205210442,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19482,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18857,
            "range": "±3.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19071,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17686,
            "range": "±8.22%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19477,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "89 samples"
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
          "id": "07b106fc0bed7d9019c11c0d6db19b854196bd0c",
          "message": "client: Add blockValue to the getPayload response (#2457)\n\n* client: Add blockValue to the getPayload response\r\n\r\n* fix withdrawal response",
          "timestamp": "2022-12-17T17:10:54-05:00",
          "tree_id": "090ad309113b1dd881258d7b58f09cbac049762c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/07b106fc0bed7d9019c11c0d6db19b854196bd0c"
        },
        "date": 1671315215929,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19267,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18884,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18604,
            "range": "±6.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18995,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18659,
            "range": "±2.06%",
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
          "id": "2eada55e427090b14e2c340e83678bc69f53566d",
          "message": "common: Update forkhash calculation for timebased hardforks (#2458)\n\n* common: Update forkhash calculation for timebased hardforks\r\n\r\n* update title of test",
          "timestamp": "2022-12-20T10:39:47+01:00",
          "tree_id": "609321c6c6b190b81653dc5d3e450c221934cb10",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2eada55e427090b14e2c340e83678bc69f53566d"
        },
        "date": 1671529355491,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17967,
            "range": "±4.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18285,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17620,
            "range": "±7.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17964,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17754,
            "range": "±2.00%",
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
          "id": "eee3ab8aa07cf1d5633b496319fbcec76b3c7310",
          "message": "common: Add eips 3651,3855,3860 to shanghai hf for Zhejiang shanghai testnet (#2459)",
          "timestamp": "2022-12-21T12:58:17+01:00",
          "tree_id": "e47f54c9b119ed3ee17028741570abe95e5ea55e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eee3ab8aa07cf1d5633b496319fbcec76b3c7310"
        },
        "date": 1671624053890,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19480,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19195,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19309,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18158,
            "range": "±8.25%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19345,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "bd67a97cf7696d7ceffe6b24ba1c83150f684a2e",
          "message": "common: Update setForkHashes to update timebased hardfork forkhashes (#2461)",
          "timestamp": "2022-12-23T20:09:31+05:30",
          "tree_id": "94bbcbd12534cbca20a7c37859943e21a17373c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bd67a97cf7696d7ceffe6b24ba1c83150f684a2e"
        },
        "date": 1671806630135,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18471,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18767,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17966,
            "range": "±7.04%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18535,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18336,
            "range": "±1.91%",
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
          "id": "7e1bc94e79ca73d189b29ab58d40ec9c82683743",
          "message": "client: Handle withdrawal bodies in the blockfetcher and skeleton sync fixes (#2462)\n\n* client: Handle withdrawal bodies in the blockfetcher\r\n\r\n* fix test\r\n\r\n* enhance coverage\r\n\r\n* improv coverage\r\n\r\n* limit count in reverse fetcher to not sync on/pre genesis\r\n\r\n* enhance coverage",
          "timestamp": "2022-12-24T00:36:29+05:30",
          "tree_id": "c82483106151ffd8a66f3f9a858aa056ccfb4f20",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7e1bc94e79ca73d189b29ab58d40ec9c82683743"
        },
        "date": 1671822581834,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15161,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16046,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14646,
            "range": "±8.36%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16196,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15366,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "572d7822d4bc9209e3d261c6e3bb799f89f66755",
          "message": "block: Handle hardfork defaults consistently (#2467)\n\n* block: handle hardfork defaults consistently\r\n\r\n* add test\r\n\r\n* fix test with the modified behavior",
          "timestamp": "2023-01-02T13:37:07-05:00",
          "tree_id": "8de36e8de02ed6488bea830a5d9995f5374a3c87",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/572d7822d4bc9209e3d261c6e3bb799f89f66755"
        },
        "date": 1672684978079,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9643,
            "range": "±3.26%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9581,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9796,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9389,
            "range": "±6.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9953,
            "range": "±1.97%",
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
          "id": "e8b87e3c729c0feaeecf5f2c946726a66b9ca619",
          "message": "common: add eip option to GethConfigOpts (#2469)\n\n* common: add eip options to GethConfigOpts\r\n\r\n* vm: simplify common setEIPs in 4895 test",
          "timestamp": "2023-01-03T19:49:34-05:00",
          "tree_id": "8fd4deffc41afb0e18107c39cb4bdf5683c6877a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e8b87e3c729c0feaeecf5f2c946726a66b9ca619"
        },
        "date": 1672793549696,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18505,
            "range": "±3.86%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16293,
            "range": "±7.58%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18376,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17801,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15609,
            "range": "±11.57%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "f917530f762d353480ba582323ced6970cc6687e",
          "message": "common: infer latest hardfork from geth genesis file (#2470)\n\n* common: improve geth genesis typings and infer latest hardfork if possible\r\n\r\n* common: adjust current hardfork setting placement\r\n\r\n* common: add test cases to check current hardfork setting",
          "timestamp": "2023-01-05T09:09:06+01:00",
          "tree_id": "2a92465f76de0c4e9a7022c16f0c0e0747048e02",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f917530f762d353480ba582323ced6970cc6687e"
        },
        "date": 1672906311802,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19256,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18273,
            "range": "±5.41%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19456,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18923,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17164,
            "range": "±7.94%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      }
    ]
  }
}