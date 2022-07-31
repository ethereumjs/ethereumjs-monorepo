window.BENCHMARK_DATA = {
  "lastUpdate": 1659284192154,
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
          "id": "a5273af40974ab66066c69c3fabbb7d9bd954c16",
          "message": "feat(trie): implement root hash persistence (#2071)\n\n* feat(trie): implement root hash persistence\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-28T10:13:39-04:00",
          "tree_id": "ccf2c5c94f694337cbc7875e31643811af117d16",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a5273af40974ab66066c69c3fabbb7d9bd954c16"
        },
        "date": 1659017833122,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23536,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22092,
            "range": "±5.64%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23227,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22914,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32185,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 834,
            "range": "±34.92%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 201,
            "range": "±8.95%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 104,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.46,
            "range": "±18.26%",
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
          "id": "dbc3ba8b7025e13de0a03415ff992d22b16e6875",
          "message": "block: Set hardforkbyblocknumber true on rlp block constructor (#2081)\n\n* Set hardforkbyblocknumber true on rlp block constructor\n\n* check for hardforkByTTD\n\n* Add coverage test",
          "timestamp": "2022-07-29T06:41:44-04:00",
          "tree_id": "4a756ac702cd4a22c3ecce5fd7778646ee4726c9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dbc3ba8b7025e13de0a03415ff992d22b16e6875"
        },
        "date": 1659091492743,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23158,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21551,
            "range": "±6.94%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23081,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 22788,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31721,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 806,
            "range": "±36.25%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 199,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.24,
            "range": "±15.50%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.58,
            "range": "±7.28%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "e6e9d2f4162bce1a3af1b0c9f4b22107a8fa7d90",
          "message": "Merge tests (#2064)\n\n* vm: add merge tests\r\n\r\n* vm/ci: fix test runner for Merge\r\n\r\n* vm: fix merge state tests\r\n\r\n* stash changes\r\n\r\n* vm/blockchain: fix PoS transition\r\n\r\n* vm: unstash changes\r\n\r\n* vm: fix state tests\r\n\r\n* blockchain: fix tests\r\n\r\n* ci: revert changes\r\n\r\n* vm: fix state tests\r\n\r\n* ci: update to required\r\n\r\n* ci: fix\r\n\r\n* blockchain: remove set common hf in block on update\r\n\r\n* blockchain: revert changes\r\n\r\n* vm: revert changes, update test runner\r\n\r\n* fix merge block ttd\r\n\r\n* fix the hardforkByTTD arg in runner\r\n\r\n* remove console.log\r\n\r\n* reverting checkAndTransitionHardForkByNumber args in customConsensus\r\n\r\n* lint\r\n\r\n* Remove console.log\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-29T18:42:15+05:30",
          "tree_id": "faadd3d006a94385122fb51739bdd68d5d370f0f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e6e9d2f4162bce1a3af1b0c9f4b22107a8fa7d90"
        },
        "date": 1659100548760,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 18691,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19031,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17187,
            "range": "±8.00%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 18678,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 25711,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 752,
            "range": "±7.72%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 129,
            "range": "±39.96%",
            "unit": "ops/sec",
            "extra": "50 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 75.5,
            "range": "±10.68%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.47,
            "range": "±31.90%",
            "unit": "ops/sec",
            "extra": "27 samples"
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
          "id": "dd6302a6a40a5aff3b689a16c9ec25a5ff916fd0",
          "message": "EVM/VM fixes (#2078)\n\n* reuse eei from evm when evm opt provided\r\n\r\n* Make vm evm property interface or class\r\n\r\n* fix EEI export\r\n\r\n* Add tests for eei sameness",
          "timestamp": "2022-07-29T09:31:32-04:00",
          "tree_id": "5ad722db12a413b9f5c36fade7b0abb42c0c6f41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dd6302a6a40a5aff3b689a16c9ec25a5ff916fd0"
        },
        "date": 1659101745278,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 19423,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 19395,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 17722,
            "range": "±8.86%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 19107,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 26493,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 800,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 114,
            "range": "±49.46%",
            "unit": "ops/sec",
            "extra": "48 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.35,
            "range": "±5.48%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.99,
            "range": "±26.27%",
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
          "id": "049c2a5159c44019910c932222d37e2435e1da9e",
          "message": "evm: add new exports requested by hardhat (#2063)\n\n* evm: add new exports requested by hardhat\r\n\r\n* vm: update typedoc\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-29T10:00:02-04:00",
          "tree_id": "f651de6c18c8ab29127ec647ad221b4327d77df5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/049c2a5159c44019910c932222d37e2435e1da9e"
        },
        "date": 1659103397102,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 23449,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 21696,
            "range": "±7.93%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23168,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23078,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 31633,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 954,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 148,
            "range": "±42.03%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.08,
            "range": "±19.15%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.77,
            "range": "±35.97%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "0b166bef0ff863d918e9f1e2a32e996edeb61d09",
          "message": "Optimize the github workflow checkouts (#2082)\n\n* Optimize the github workflow checkouts\r\n\r\n* revert recursive checkout as block and tx use eth tests\r\n\r\n* revert recursive checkout for vm state tests as they use eth tests\r\n\r\n* revert recursive vm blockchain tests as they use eth tests\r\n\r\n* revert recursive for vm covergae tests it has state tests which uses eth tests\r\n\r\n* move recurive from vm build to vm pr\r\n\r\n* enable recursive for vm build workflow for coverage state and blockchain tests\r\n\r\n* add recusive checkout in vm nightly slow tests",
          "timestamp": "2022-07-30T17:44:02+05:30",
          "tree_id": "a93a2273b961a4fdcc151e15cbff24185eda4b98",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b166bef0ff863d918e9f1e2a32e996edeb61d09"
        },
        "date": 1659183384868,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24116,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23499,
            "range": "±7.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 23905,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23592,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32760,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 721,
            "range": "±43.04%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±9.81%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.93,
            "range": "±19.43%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.9,
            "range": "±57.94%",
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
          "id": "2f9f3ea5e00fe05620e282a7fcef99593eeea027",
          "message": "client: allow eth_call without to for testing contract creation (#2084)",
          "timestamp": "2022-07-31T21:44:04+05:30",
          "tree_id": "f5940296e3c2b081784893c7123d34ac0690aa97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2f9f3ea5e00fe05620e282a7fcef99593eeea027"
        },
        "date": 1659284190967,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24014,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22248,
            "range": "±7.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 24106,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 23801,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 32859,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 757,
            "range": "±46.66%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 201,
            "range": "±8.85%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.04,
            "range": "±18.04%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.83,
            "range": "±11.86%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      }
    ]
  }
}