window.BENCHMARK_DATA = {
  "lastUpdate": 1675936876473,
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
          "id": "9b146527bb585885b071cd19f023584e8708b96e",
          "message": "client: Apply correct hf to peer fetched txs as well as filter and remove mismatching hf txs while building blocks (#2486)\n\n* client: Apply correct hf to peer fetched txes as well as filter and remove mismatching hf txs while building blocks\r\n\r\n* remove debugging inserts\r\n\r\n* also add check to match block and vm hf\r\n\r\n* add option to skip val\r\n\r\n* fix cond\r\n\r\n* add tests\r\n\r\n* add skip hardfork validation in block as well\r\n\r\n* fix spec tests\r\n\r\n* skip validation in vm examples run\r\n\r\n* handle the hf mismatch error properly\r\n\r\n* add skip hf validation to addtransaction and fix more specs\r\n\r\n* remove  debugging artifact\r\n\r\n* fix miner spec\r\n\r\n* skip hf validation in pending block spec\r\n\r\n* add comment\r\n\r\n* fix test\r\n\r\n* vm fx\r\n\r\n* altetrnatively skip hf validation for estimate gas\r\n\r\n* fix test\r\n\r\n* enhance covergae\r\n\r\n* enhance coverage",
          "timestamp": "2023-01-17T09:34:34+01:00",
          "tree_id": "b9d53cb3ada87d074bdd1d8e5c1b1b44e1f07eab",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9b146527bb585885b071cd19f023584e8708b96e"
        },
        "date": 1673944663056,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15275,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14975,
            "range": "±5.90%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14994,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14549,
            "range": "±8.92%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15157,
            "range": "±2.60%",
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
          "id": "64d8d3c6f050281e121c46ec4978fc30fc632a73",
          "message": "util: Change withdrawal amount representation from Wei to Gwei (#2483)\n\n* util: Change withdrawal amount representation for Wei to Gwei\r\n\r\n* cleanup\r\n\r\n* fix test\r\n\r\n* fix test\r\n\r\n* move unit to separate file\r\n\r\n* add missing file",
          "timestamp": "2023-01-17T14:31:37+05:30",
          "tree_id": "392122d9fc68c8f215d40bf392e43900abdaabec",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/64d8d3c6f050281e121c46ec4978fc30fc632a73"
        },
        "date": 1673946252655,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19254,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18597,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19187,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18859,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17708,
            "range": "±7.12%",
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
          "id": "8bcdb4883b6d6ae656c0929a31ebcb5374205590",
          "message": "Update Dockerfiles to use node 18 (#2487)",
          "timestamp": "2023-01-17T17:24:58+05:30",
          "tree_id": "ac90e2b163056a7cdef792286c9bcae94373ab68",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8bcdb4883b6d6ae656c0929a31ebcb5374205590"
        },
        "date": 1673956658833,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19470,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19053,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18541,
            "range": "±7.44%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19113,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18901,
            "range": "±1.76%",
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
          "id": "6508bf9213d32929e0e2456c9c4fcfabe4e9d3c6",
          "message": "util: Add ssz roots capability for withdrawals hash tree root (#2488)\n\n* util: Add ssz roots capability for withdrawals hash tree root\r\n\r\n* Fix karma setup\r\n\r\n* Update rlp to v4.0.0\r\n\r\n* add cl spec testcase\r\n\r\n* better naming\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-18T11:51:23-05:00",
          "tree_id": "c03aa0931ce219424a64426c8ed6c10cb119bdca",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6508bf9213d32929e0e2456c9c4fcfabe4e9d3c6"
        },
        "date": 1674060878527,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 13675,
            "range": "±3.77%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 13804,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13943,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13459,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12126,
            "range": "±11.84%",
            "unit": "ops/sec",
            "extra": "66 samples"
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
          "id": "3ec8845bdd032dc95f0b5f929caea26cc222d041",
          "message": "client: throw on unknown client cli arg (#2490)",
          "timestamp": "2023-01-19T14:01:40+01:00",
          "tree_id": "2bcd72159d753e27a9bd40f906d0ed309300c95f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ec8845bdd032dc95f0b5f929caea26cc222d041"
        },
        "date": 1674133470007,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19640,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19022,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19159,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17770,
            "range": "±7.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19557,
            "range": "±1.26%",
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
          "id": "2036b55d0720e090441a606115e6a7285c9f8d63",
          "message": "Implement EIP-4844 (#2349)\n\nAdd first round of EIP-4844\r\nCo-authored-by: harkamal <develop@g11tech.io>",
          "timestamp": "2023-01-19T14:56:29-05:00",
          "tree_id": "c5d67d6d3e5700c5cc861a19708695ffbd6c47f9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2036b55d0720e090441a606115e6a7285c9f8d63"
        },
        "date": 1674158361138,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18035,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17333,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17554,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16635,
            "range": "±6.01%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15932,
            "range": "±11.02%",
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
          "id": "f93a38a970b53e3ac7754d6f56015fa21e254c12",
          "message": "Fix bug in how precompiles activated by EIP are identified (#2489)\n\n* Move eip 2537 test to EVM",
          "timestamp": "2023-01-20T09:42:13-05:00",
          "tree_id": "ded8238aa5915fcae930b0c00e9822556e88b37a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f93a38a970b53e3ac7754d6f56015fa21e254c12"
        },
        "date": 1674225900877,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18717,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18159,
            "range": "±4.80%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18301,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16158,
            "range": "±10.00%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18456,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "4ba69d4524ffd29b65423155fc2647d3caca7975",
          "message": "Client and README Doc Updates (#2492)\n\n* Updated branch statuses on main repo README\r\n\r\n* Updated client installation instructions\r\n\r\n* Updated CL/EL run instructions, integrated and consolidated with RunAsElClient.md (deleted)\r\n\r\n* Added a ToC to client README\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-01-20T11:00:35-05:00",
          "tree_id": "ba24c287e9b8961ce770d011a7d6b033320d06b6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4ba69d4524ffd29b65423155fc2647d3caca7975"
        },
        "date": 1674230592482,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19767,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19162,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19365,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17859,
            "range": "±7.39%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19786,
            "range": "±1.10%",
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
          "id": "d336153f83bbf21a95acb322dbbd9ce424251c5a",
          "message": "Change client CLI params to camelCase (#2495)",
          "timestamp": "2023-01-21T20:18:33-05:00",
          "tree_id": "cd3f67fa64129d93428fe3880b35d0474f68cd8b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d336153f83bbf21a95acb322dbbd9ce424251c5a"
        },
        "date": 1674350479777,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18831,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18201,
            "range": "±5.20%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18528,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16419,
            "range": "±9.47%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19105,
            "range": "±1.41%",
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
          "id": "79352c430ea7538b88ea5373f6efbc0cb47acd96",
          "message": "Interop 4844 Docs Preparation & Alignment (#2493)\n\n* Align EOF and 4844 sim README naming\r\n\r\n* Moved EIP-4844 Interop prysm instructions out of sim folder, prepare for multi-client instructions, generalized documentation\r\n\r\n* Added .eslintignore for TS files in devnets folder\r\n\r\n* Modified Prysm start script to solely concentrate on genesis generation, extracted start command to docs\r\n\r\n* Extracted Prysm validator start command out of script, deleted script file\r\n\r\n* Remove leftover unused test data file\r\n\r\n* Clean up txGenerator\r\n\r\n* More INTEROP reorganization\r\n\r\n* Add WIP lighthouse setup\r\n\r\n* Remove extra echo\r\n\r\n* Generalize lighthouse instructions\r\n\r\n* Add bootnode script for lighthouse\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-22T16:21:34+01:00",
          "tree_id": "53a45433e7720ec435d6efdcaed96e4148b5a59b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79352c430ea7538b88ea5373f6efbc0cb47acd96"
        },
        "date": 1674401094012,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9892,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10169,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9611,
            "range": "±6.18%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10080,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10198,
            "range": "±2.26%",
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
          "id": "c788bf7610ccf18eb908ba6aa7639334116782a4",
          "message": "vm/tests: add shanghai support (#2496)",
          "timestamp": "2023-01-22T17:22:13+01:00",
          "tree_id": "e5f466b6dad07ca135927e7cc18cba979342c36f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c788bf7610ccf18eb908ba6aa7639334116782a4"
        },
        "date": 1674404725543,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15696,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14989,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15855,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15340,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14124,
            "range": "±9.98%",
            "unit": "ops/sec",
            "extra": "74 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "dimitris.apostolou@icloud.com",
            "name": "Dimitris Apostolou",
            "username": "rex4539"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ecd7b5d62dd874559bc059ec2da6a343a72bb634",
          "message": "Fix typos (#2485)",
          "timestamp": "2023-01-23T16:31:07+01:00",
          "tree_id": "907b11a50b7a3e32a94d62380b0d0d55b82c8224",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ecd7b5d62dd874559bc059ec2da6a343a72bb634"
        },
        "date": 1674488065477,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15493,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14465,
            "range": "±6.88%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15812,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15307,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13156,
            "range": "±10.90%",
            "unit": "ops/sec",
            "extra": "65 samples"
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
          "id": "a06fede7fd1cf851237ed9a8c057142901ab4e24",
          "message": "Interop Client CLI Improvements (#2497)\n\n* Added the chain ID to client start-up log output\r\n\r\n* Added custom genesis state account information log message\r\n\r\n* Some EVM, networking and sync startup log rewording to better align with actions taken and better reflect post-merge client behavior\r\n\r\n* Switched CL client needed log message from WARN to INFO level (expected behavior)\r\n\r\n* Added genesis timestamp to chain initialization log message, added timestamp-in-the-future warning log message\r\n\r\n* Added some more prominent post-Merge client mode message, added warnign if running post-Merge without Engine API\r\n\r\n* Moved timestamp warning log message further down the instantiation line due to race condition issues (mainnet)\r\n\r\n* Moved beacon sync skeleton put block and VM execution warn msgs to debug log level to avoid CLI overloading, moved fillLogIndex in skeleton to be class based, down-leveled interval log from 50 to 10\r\n\r\n* Moved skeleton announcement before tail msg to debug level\r\n\r\n* Added withdrawal number and excess data gas to last consensus payload log msg\r\n\r\n* fix tsDiff\r\n\r\n* Removed timestamp-in-future warning due to race conditions leading to test failures\r\n\r\n* fix loglevel parameter usage\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-24T00:17:45+01:00",
          "tree_id": "90f248d779ca55fd1f45760e1cd2945928a12cc7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a06fede7fd1cf851237ed9a8c057142901ab4e24"
        },
        "date": 1674516026656,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18914,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18526,
            "range": "±4.36%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18779,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16683,
            "range": "±9.42%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19397,
            "range": "±1.36%",
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
          "id": "91fca3babf5e7dcf46568c8a1844b621e90f2317",
          "message": "tx: Handle json fields in fromTxData for eip4844 tx (#2499)\n\n* tx: Handle json fields in fromTxData for eip4844 tx\r\n\r\n* cleanup the serialization code\r\n\r\n* fix spec\r\n\r\n* make ssz types more readable\r\n\r\n* fixes\r\n\r\n* Add bufferlike for other blob txdata fields\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-24T20:52:06+05:30",
          "tree_id": "978a810c5cc18ef07f552d94c6e310dd447b4098",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/91fca3babf5e7dcf46568c8a1844b621e90f2317"
        },
        "date": 1674573900296,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18983,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18639,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18732,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16722,
            "range": "±8.72%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19541,
            "range": "±1.38%",
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
          "id": "45b1af9de699b6e1fe9d03fb3aff766b0fc59761",
          "message": "tx: make kzgProof required field for network wrapper (#2501)",
          "timestamp": "2023-01-24T11:31:44-05:00",
          "tree_id": "8b1a875530dddefb3c122c509b6994b3aedda072",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/45b1af9de699b6e1fe9d03fb3aff766b0fc59761"
        },
        "date": 1674578080127,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18286,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17591,
            "range": "±6.29%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17761,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16153,
            "range": "±8.40%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17641,
            "range": "±6.16%",
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
          "id": "d0b53b4bd9a92977ac7d795b60eb97c6cf8890db",
          "message": "client/rpc/engine: fix forkchoiceUpdateV2 shanghai (#2502)",
          "timestamp": "2023-01-24T19:41:13+01:00",
          "tree_id": "fb2d8ab77f2b6f808dabe2a738e7c19744be1547",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d0b53b4bd9a92977ac7d795b60eb97c6cf8890db"
        },
        "date": 1674585844593,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18225,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17427,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18007,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16896,
            "range": "±6.53%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17008,
            "range": "±9.37%",
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
          "id": "7d7b0ad0915b560093a7e1ac5802432e40f436f5",
          "message": "Add checks for replacement data gas too low for blob txs (#2503)",
          "timestamp": "2023-01-24T22:17:06+01:00",
          "tree_id": "8e8df3ac647974c5b425d20f13d9f0ffe9b3e531",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7d7b0ad0915b560093a7e1ac5802432e40f436f5"
        },
        "date": 1674595196964,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18423,
            "range": "±3.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17786,
            "range": "±5.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18263,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16402,
            "range": "±9.10%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18654,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "f38bf6076c5a72513c9c3dcd82c43177355adbb6",
          "message": "engine-api-validators (#2504)\n\n* client/RPC: add validators for bytevectors\r\n\r\n* client/RPC: update validators for bytevectors\r\n\r\n* client/RPC: include typenames for bytevectors\r\n\r\n* client/RPC: make updates to newPayloadV2 method and validation\r\n\r\n* client/rpc: include tests for new validators\r\n\r\n* client/rpc: fix bytevector validators\r\n\r\n* client/rpc: allow '0x' for variableBytes32\r\n\r\n* client/rpc: flip conditional order in newPayloadV2\r\n\r\n* client/rpc: include status restriction in newPayloadV2\r\n\r\n* client/rpc: update engine_newPayloadV3 to spec\r\n\r\n* client/rpc: update validators for engine_newPayloadV3\r\n\r\n* client/rpc: alter order of bytevector validator checks\r\n\r\n* client/rpc: update bytevector validator tests\r\n\r\n* client/rpc: check for null hardfork timestamp\r\n\r\n* client/rpc: test newPayloadV2 with executionPayloadV1 test vectors\r\n\r\n* client/rpc: begin writing test for newPayloadv3\r\n\r\n* lib/rpc/validation: generalize uint/bytes validation\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-01-25T13:48:02+01:00",
          "tree_id": "5a00836a7c08da61164078d7a2b214ee30bacd5e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f38bf6076c5a72513c9c3dcd82c43177355adbb6"
        },
        "date": 1674651046387,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19357,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18519,
            "range": "±5.21%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18878,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17350,
            "range": "±7.37%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19337,
            "range": "±1.19%",
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
          "id": "5283b8821a017e7349dd53be26187363589cabf0",
          "message": "More Interop Improvements (#2506)\n\n* Fewer tx pool statistics\r\n\r\n* Only emit synchronized event if synchronized status change, explicitly set synchronized to false in non-synced case\r\n\r\n* Switch from interval to sequential payload and forkchoice logging after chain sync completed, added missing synchronized message\r\n\r\n* Adjusted skeleton canonical chain fill status log interval\r\n\r\n* Reduce RLPx server restarts in a post-Merge world\r\n\r\n* Lint fix\r\n\r\n* Test fixes\r\n\r\n* Test fixes",
          "timestamp": "2023-01-25T14:31:05+01:00",
          "tree_id": "0d4f9f90a1138c4ef375c44be63486c361ad574e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5283b8821a017e7349dd53be26187363589cabf0"
        },
        "date": 1674653697785,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19224,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18672,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18849,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17181,
            "range": "±8.07%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19215,
            "range": "±1.21%",
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
          "id": "7fa64079578b24e791c62be3fe3d6e634bb10f13",
          "message": "4844 Engine API Fixes (#2508)\n\n* Fix HF names in Engine API calls\r\n\r\n* Fix forkchoiceUpdatedV2 error cases",
          "timestamp": "2023-01-25T16:59:41-05:00",
          "tree_id": "02dc88a2044507da7cb5c321ff7ac2d6f664ed23",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7fa64079578b24e791c62be3fe3d6e634bb10f13"
        },
        "date": 1674684141823,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19551,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19017,
            "range": "±4.42%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19224,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17700,
            "range": "±7.36%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19541,
            "range": "±1.34%",
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
          "id": "e35296cc68296a5e33ce528a35b963299a131a83",
          "message": "More Interop Log Improvements (#2510)\n\n* Added HF change logging for new payload and FCU calls\r\n\r\n* Add payload to payload stats (blocks count, min/max block numbers, tx count per type)\r\n\r\n* Fix dataGasFee calculation\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-26T14:56:21-05:00",
          "tree_id": "835656e1cd06e51a36841b8c8d33a44d05778443",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e35296cc68296a5e33ce528a35b963299a131a83"
        },
        "date": 1674763142777,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19512,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18848,
            "range": "±3.94%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19026,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17752,
            "range": "±6.85%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19576,
            "range": "±1.07%",
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
          "id": "88dce6ea1fbaa0c3c51821efbcc9e0137e071618",
          "message": "vm: Add and use execHardfork while running a tx (#2505)\n\n* vm: Add and use execHardfork while running a tx\r\n\r\n* add spec\r\n\r\n* fix and add specs\r\n\r\n* improve comment\r\n\r\n* restructure exec hardfork\r\n\r\n* cleanup\r\n\r\n* empty commit to rerun CI\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-27T11:07:06-05:00",
          "tree_id": "520c0a8408cf33b606d0a65bbcf33c75009c77ba",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/88dce6ea1fbaa0c3c51821efbcc9e0137e071618"
        },
        "date": 1674835807770,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18203,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17380,
            "range": "±6.49%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18018,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16848,
            "range": "±5.61%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15699,
            "range": "±12.27%",
            "unit": "ops/sec",
            "extra": "77 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "mpetrunic@users.noreply.github.com",
            "name": "Marin Petrunić",
            "username": "mpetrunic"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d986218ad598d2a133cf8db9784c6e3a23bb6c2e",
          "message": "chore: reduce number of ethers dependencies (#2513)",
          "timestamp": "2023-01-27T15:22:48-05:00",
          "tree_id": "4eac04531bc8e5ef59dd70db5adf2ed49aebb1c6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d986218ad598d2a133cf8db9784c6e3a23bb6c2e"
        },
        "date": 1674851130640,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19626,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19210,
            "range": "±3.66%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19139,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17812,
            "range": "±7.02%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19761,
            "range": "±1.20%",
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
          "id": "02ec8920352776e7d8a3a94fef6e8bdc75694085",
          "message": "client: add new shanghai  engine apis (#2509)\n\n* add getCapabilities engine endpoint\r\n\r\n* add engine_getPayloadBodiesByHashV1\r\n\r\n* add getPayloadBodiesByRangeV1\r\n\r\n* Add tests and fix validatoring logic\r\n\r\n* remove console log\r\n\r\n* WIP building blocks\r\n\r\n* Add tests for new endpoints\r\n\r\n* Remove tape.only\r\n\r\n* Add tests for pre-shanghai blocks\r\n\r\n* Improve getCapabilities implementation\r\n\r\n* Fix vaildation\r\n\r\n* remove logging\r\n\r\n* Add getPayloadBody helper\r\n\r\n* Simplify getPayloadBody\r\n\r\n* Use `chain.headers.height` for latest block number",
          "timestamp": "2023-01-30T22:48:18+05:30",
          "tree_id": "a126694a7bc54a4b31bd4fa339dbc92dfc77138c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02ec8920352776e7d8a3a94fef6e8bdc75694085"
        },
        "date": 1675099812181,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19711,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19431,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18033,
            "range": "±7.34%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19672,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19042,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "mpetrunic@users.noreply.github.com",
            "name": "Marin Petrunić",
            "username": "mpetrunic"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ff921f8e8bdd375780238eed7e73d301a35bbe01",
          "message": "feat: remove async library (#2514)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-01-30T13:18:00-05:00",
          "tree_id": "f03449881dbf822ae819b9f2794238cf6f115b34",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ff921f8e8bdd375780238eed7e73d301a35bbe01"
        },
        "date": 1675102845478,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19381,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18817,
            "range": "±4.87%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18924,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17587,
            "range": "±8.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19414,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "52dbfc2026ae42ba6e607d287d616a23aa21bbe5",
          "message": "New client ci run (#2515)\n\n* Temporarily disable CI runs\r\n\r\n* Add mainnet test run to sim test\r\n\r\n* switch client ci run\r\n\r\n* Update single run script\r\n\r\n* small cleanup\r\n\r\n* further cleanup\r\n\r\n* add block inclusion check in beacon\r\n\r\n* Turn ci jobs back on\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <develop@g11tech.io>",
          "timestamp": "2023-01-31T22:37:49+05:30",
          "tree_id": "1d79c417c1f0adf8c69ec84b1628c465f6d315cf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52dbfc2026ae42ba6e607d287d616a23aa21bbe5"
        },
        "date": 1675185030790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19624,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18986,
            "range": "±3.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19146,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17782,
            "range": "±6.50%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19656,
            "range": "±1.14%",
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
          "id": "b8329bde10c1ab108437c4621cc534dbf94f8834",
          "message": "fixed for getPayloadBodiesByRange from hive (#2518)",
          "timestamp": "2023-02-06T14:08:30+01:00",
          "tree_id": "fba7915541d1ce036aa665963ed9ca099d3a2905",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b8329bde10c1ab108437c4621cc534dbf94f8834"
        },
        "date": 1675689077424,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19199,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18624,
            "range": "±4.31%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18913,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17693,
            "range": "±7.19%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19259,
            "range": "±1.36%",
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
          "id": "c5bb62a5ac38ee052a0c4be54e77f2b37e3a6619",
          "message": "blockchain.getBlock - return Null instead of throwing (#2516)\n\n* blockchain: update getBlock to return null instead of throw if block not found\r\n\r\n* blockchain: update getIteratorHead to return genesis hash if head block not found\r\n\r\n* blockchain: update calls to getBlock\r\n\r\n* blockchain: update blockchain tests\r\n\r\n* client: update calls to getBlock and getIteratorHead\r\n\r\n* client: update tests\r\n\r\n* vm: update tests\r\n\r\n* client: handle null returns for getBlock\r\n\r\n* vm: handle null returns for getBlock\r\n\r\n* client: return null if getBlock is not found\r\n\r\n* fix getTransactionByBlockHashAndIndex\r\n\r\n* fix getLogs\r\n\r\n* client: fix error throwing logic in eth_getLogs and engine_forkchoiceUpdatedV1\r\n\r\n* client: fix eth_getLogs error message\r\n\r\n* blockchain: fix return and write test for getIteratorHead\r\n\r\n* blockchain: add test coverage for getCononicalHeadHeader fail\r\n\r\n* blockchain: add test coverage for getCanonicalHead fail\r\n\r\n* blockchain: add test coverage for validateBlock fail\r\n\r\n* blockchain: remove extraneous null check\r\n\r\n* blockchain: add test coverage for findCommonAncestor fail\r\n\r\n* blockchain: add test coverage for consensus.validateDifficulty fail\r\n\r\n* client: add test coverage for getReceipts fail\r\n\r\n* client: add test for getLogs fail\r\n\r\n* client: simplify null check in updateIndex\r\n\r\n* client: add test coverage for exec.open() fail\r\n\r\n* client: add test coverage for exec.run() with invalid head block\r\n\r\n* client: simplify null check in skeleton\r\n\r\n* client: add test coverage for skeleton.getBlockByHash when block not found\r\n\r\n* client: remove extra type check\r\n\r\n* remove Buffer as return type for getIteratorHead, and remove checks for it\r\n\r\n* Removed unnecessary Block casts after getIteratorHead() calls\r\n\r\n* Replaced Block casts with non-null assertions where appropriate\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-02-07T13:13:25+01:00",
          "tree_id": "9d9ca08d45bb232728c2426f666c6796d2e89173",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5bb62a5ac38ee052a0c4be54e77f2b37e3a6619"
        },
        "date": 1675772170762,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19388,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18768,
            "range": "±4.39%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19030,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17087,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19332,
            "range": "±1.16%",
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
          "id": "40bca1131d7cba48af336146224e907e50387297",
          "message": "client: Fix client's sync state on startup or while mining or single node (test) runs (#2519)\n\n* client: Fix client's sync state on startup or while mining or single node (test) runs\r\n\r\n* fix spec\r\n\r\n* fix dangling txpool in spec\r\n\r\n* fix stalled test waiting for event\r\n\r\n* add some logging and test single run\r\n\r\n* start txpool on startup if starting from syncronized state\r\n\r\n* small inprov\r\n\r\n* enhance coverage\r\n\r\n* nits\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-09T09:58:43+01:00",
          "tree_id": "a7f8562df729b5ef7fbdb78ce4541d25c03b4804",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/40bca1131d7cba48af336146224e907e50387297"
        },
        "date": 1675933295312,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19618,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18761,
            "range": "±3.90%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18933,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17499,
            "range": "±7.33%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19492,
            "range": "±1.21%",
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
          "id": "956ad11691724c3f5572a3faaa5f680767719a87",
          "message": "Revert \"blockchain.getBlock - return Null instead of throwing (#2516)\" (#2523)\n\nThis reverts commit c5bb62a5ac38ee052a0c4be54e77f2b37e3a6619.",
          "timestamp": "2023-02-09T10:57:15+01:00",
          "tree_id": "a77c5650f2a55e6bdbc8e8460dacfe043fb2616d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/956ad11691724c3f5572a3faaa5f680767719a87"
        },
        "date": 1675936875772,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19616,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18878,
            "range": "±3.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19087,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17287,
            "range": "±8.42%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19496,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      }
    ]
  }
}