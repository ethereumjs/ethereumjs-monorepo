window.BENCHMARK_DATA = {
  "lastUpdate": 1685529506753,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "micah@zoltu.net",
            "name": "Micah Zoltu",
            "username": "MicahZoltu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c9b0a455032a204f9a1dfc724eedbc4ec9fc7780",
          "message": " tx: Fix EIP-155 transaction encoding on chain ID 0\n\nWhen preparing Ethereum data for RLP encoding, you must convert all values to either byte arrays or lists.  Scalar values (positive integers) are converted to byte arrays by using the fewest bytes possible to represent the value in big endian format.  The canonical form of any scalar value prepped for RLP encoding is that any leading `0` bytes stripped.  In the case of `0`, this means that the only byte (`0x00`) is stripped and you are left with an empty array.\r\n\r\nMost of the values in this code are properly 0-stripped using `bigIntToUnpaddedBuffer`.  Unfortunately, it appears that the `chainId` was added without stripping leading zeros.  In most cases this doesn't matter, but if someone is running a chainId 0 blockchain and they want to EIP-155 encode their transaction, the previous code would result in an invalid transaction because only the canonical form is allowed.\r\n\r\nThis change fixes this bug and correctly prepares the chainId in EIP-155 transactions for RLP encoding.",
          "timestamp": "2023-04-29T21:55:42+05:30",
          "tree_id": "504941f4779c745c1b6bfc3d2797db5ce88b5d9c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c9b0a455032a204f9a1dfc724eedbc4ec9fc7780"
        },
        "date": 1682785669299,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16231,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15484,
            "range": "±4.00%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16302,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15689,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14940,
            "range": "±5.00%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "129968170+mitic2023@users.noreply.github.com",
            "name": "mitic2023",
            "username": "mitic2023"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "11a5ab8d947923619eabbd0ab591478409f22762",
          "message": "Update README.md (#2679)",
          "timestamp": "2023-05-05T10:17:45-04:00",
          "tree_id": "dc4836d5c2722dad2bf871ebad3c80373e649647",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11a5ab8d947923619eabbd0ab591478409f22762"
        },
        "date": 1683296394152,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14768,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14916,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14588,
            "range": "±5.90%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14682,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14496,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "pulasthi1989@gmail.com",
            "name": "Pulasthi Bandara",
            "username": "pulasthibandara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a5b6978944c3feef5078a6d6c0a93b235dd9666",
          "message": "Fix link for running EVM code in browser (#2682)",
          "timestamp": "2023-05-10T09:18:07+02:00",
          "tree_id": "bc48ba399bf23c6992061434283fe2b931c31265",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7a5b6978944c3feef5078a6d6c0a93b235dd9666"
        },
        "date": 1683703221389,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15122,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15079,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14395,
            "range": "±6.41%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14655,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14275,
            "range": "±2.44%",
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
          "id": "404054b60cd0ba597b699344eb860e05ae45c3a2",
          "message": "Monorepo: Remove Dynamic Node Versions check / Fix Test Runs (#2683)\n\n* Monorepo: remove dynamic external node version check, statically set to 16,18,20\r\n\r\n* Remove get-node-versions entirely\r\n\r\n* Remove pull request trigger\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-05-10T12:10:51+02:00",
          "tree_id": "06ad0a2d74fc1e572b6143cdc53262e1f6f5efc4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/404054b60cd0ba597b699344eb860e05ae45c3a2"
        },
        "date": 1683713611043,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8079,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8115,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8273,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7795,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8239,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "bd85ada1cc4bdbb5fcfff4e2bf5f55547bbfeb5b",
          "message": "trie: update references to old deleteFromDB constructor arg (#2695)",
          "timestamp": "2023-05-11T09:18:55-04:00",
          "tree_id": "32d789146bce7163d3dfdbf8bb9f36ca58e86a5d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bd85ada1cc4bdbb5fcfff4e2bf5f55547bbfeb5b"
        },
        "date": 1683811266003,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15105,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15113,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14644,
            "range": "±6.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14632,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14441,
            "range": "±2.46%",
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
          "id": "cf2b55d33cb8d0d4e63fb6805259c00514942bd2",
          "message": "Merge pull request #2701 from ethereumjs/develop-v7-merge-master\n\nMerge develop-v7 into master (v2?) (V7 releases)",
          "timestamp": "2023-05-15T14:32:56+02:00",
          "tree_id": "00dff3ff4a7f73bd50ac723fb784f90cdcc64a21",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cf2b55d33cb8d0d4e63fb6805259c00514942bd2"
        },
        "date": 1684154121400,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31936,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28689,
            "range": "±7.48%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30142,
            "range": "±8.43%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30932,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29908,
            "range": "±3.20%",
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
          "id": "2143619e786ad1e31d0d5dc3f96aef42a9c23ff0",
          "message": "evm: Fix the availability of versioned hashes in contract calls (#2694)\n\n* evm: Fix the availability of versioned hashes in contract calls\r\n\r\n* add spec tests\r\n\r\n* compress comments\r\n\r\n* compress comments\r\n\r\n* increase coverage\r\n\r\n* evm: ensure DATAHASH also works in CREATE/CREATE2 frames\r\n\r\n* vm: load c-kzg in tests\r\n\r\n* Fix dataGasPrice logic\r\n\r\n* Add precompile error handling\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-05-15T14:50:03-04:00",
          "tree_id": "63bc9af2f1e753fac9f136c7bbd8b5f0805f8202",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2143619e786ad1e31d0d5dc3f96aef42a9c23ff0"
        },
        "date": 1684176775398,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17579,
            "range": "±5.29%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17596,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18094,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 16387,
            "range": "±8.64%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17436,
            "range": "±3.20%",
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
          "id": "3b25d5616c5929b001235f202f6357481b7e7eb6",
          "message": "Merge pull request #2700 from ethereumjs/debug-file-logs\n\nclient: Enable default debug logging to file",
          "timestamp": "2023-05-16T08:58:28+02:00",
          "tree_id": "cafadade4e3118cc3f324fa3ded0bbaa6deddd04",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3b25d5616c5929b001235f202f6357481b7e7eb6"
        },
        "date": 1684220437508,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33006,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32322,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28647,
            "range": "±8.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31382,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30673,
            "range": "±2.45%",
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
          "id": "bef8f3f64b0a114e299c9ff402df031d148dca73",
          "message": "Merge pull request #2685 from ethereumjs/switch-to-esm-cjs-build\n\nMonorepo: Switch to hybrid ESM/CJS Build (WIP)",
          "timestamp": "2023-05-17T09:09:39+02:00",
          "tree_id": "419f29f2413fba7f19f83be1bfbf4e550895cc0e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bef8f3f64b0a114e299c9ff402df031d148dca73"
        },
        "date": 1684307608998,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22632,
            "range": "±14.33%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29133,
            "range": "±7.14%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28584,
            "range": "±8.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25881,
            "range": "±11.01%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17270,
            "range": "±12.52%",
            "unit": "ops/sec",
            "extra": "68 samples"
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
          "id": "a8200955fb540961915dbb5239ca581449cae6a8",
          "message": "Merge pull request #2704 from ethereumjs/eslint/add-package.json\n\neslint: add eslint package.json",
          "timestamp": "2023-05-17T11:34:59+02:00",
          "tree_id": "07b64acc1c29b0032fa205dced7986b7e4b25f45",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a8200955fb540961915dbb5239ca581449cae6a8"
        },
        "date": 1684316441096,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32292,
            "range": "±3.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32004,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27480,
            "range": "±9.37%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31107,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30145,
            "range": "±3.05%",
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
          "id": "5b393bf9feae0053521e04e6747214b2cc1b1af6",
          "message": "Monorepo: Deprecation Cleanup Work (#2706)\n\n* Common: remove deprecated nextHardforkBlock() and isNextHardforkBlock() methods\r\n\r\n* Common: remove deprecated isHardforkBlock() method\r\n\r\n* Blockchain: remove deprecated getHead() method\r\n\r\n* EVM: Rename SHA3 opcode -> KECCAK256\r\n\r\n* EVM: rename DIFFICULTY opcode to PREVRANDAO post Merge\r\n\r\n* Common: add prevrandaio gas price to EIP-4399 definition file",
          "timestamp": "2023-05-17T14:28:37+02:00",
          "tree_id": "77bd0ac0193c90408ffca929b0ccf42bcb6c6f47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b393bf9feae0053521e04e6747214b2cc1b1af6"
        },
        "date": 1684326701382,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32894,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30767,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32503,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31608,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30157,
            "range": "±2.73%",
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
          "id": "ffec3ed1992b7e40606f8aac2613fa24d8677f1c",
          "message": "block: Add helper to construct block from beacon payload (#2684)\n\n* block: Add helper to construct block from beacon payload\r\n\r\n* add comment\r\n\r\n* fix tests\r\n\r\n* fix spec\r\n\r\n* fix spec\r\n\r\n* apply feedback\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-05-17T09:56:15-04:00",
          "tree_id": "e3b827b4a8c988497e458874392c96e9a8330c74",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ffec3ed1992b7e40606f8aac2613fa24d8677f1c"
        },
        "date": 1684331960319,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31441,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29000,
            "range": "±7.53%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30809,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30413,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29708,
            "range": "±3.26%",
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
          "id": "3498ce970a1f61006a8a5eb0cda66212df3eeb96",
          "message": "tx: Normalize toJson for different tx types (#2707)\n\n* tx: Normalize toJson for different tx types\r\n\r\n* lint",
          "timestamp": "2023-05-17T17:14:34+02:00",
          "tree_id": "2deb946a6f6d147758c91f50fd81af83deb44e9b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3498ce970a1f61006a8a5eb0cda66212df3eeb96"
        },
        "date": 1684336687046,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20413,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20060,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19565,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20611,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20241,
            "range": "±2.82%",
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
          "id": "e75ebc23ad2573046d0f218a73f53ad29db7c0fa",
          "message": "evm/common: rename DATAHASH to BLOBHASH (#2711)",
          "timestamp": "2023-05-17T21:31:32+02:00",
          "tree_id": "2034d876cf94d123f3db9d8572571a72fd2fa72a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e75ebc23ad2573046d0f218a73f53ad29db7c0fa"
        },
        "date": 1684352110411,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31942,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31627,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27785,
            "range": "±8.41%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31041,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30095,
            "range": "±3.14%",
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
          "id": "3f2cd73058f0ffba3d38e14ca57a326e6fcaeb88",
          "message": "tx: ensure rpc txs are correctly decoded for v=0 (#2705)\n\n* tx: ensure rpc txs are correctly decoded for v=0\r\n\r\n* stateManager: fix test / rename fromRPCTx in tx to fromRPC in tests",
          "timestamp": "2023-05-21T12:21:05+05:30",
          "tree_id": "3c5f9f2fb5a3a5169c0c66bf70314f06a9950e45",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3f2cd73058f0ffba3d38e14ca57a326e6fcaeb88"
        },
        "date": 1684652046718,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31817,
            "range": "±4.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31815,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27912,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30706,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29953,
            "range": "±3.02%",
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
          "id": "dd8afc503e942bcd56c9aa565f8b13d3ac90dcd4",
          "message": "tx: De-sszify 4844 blob transaction (#2708)\n\n* tx: De-sszify 4844 blob transaction\r\n\r\n* add the network serialization\r\n\r\n* fix tests spec\r\n\r\n* fix wrong update\r\n\r\n* fix beacon payload data\r\n\r\n* fix client spec\r\n\r\n* increase spec coverage",
          "timestamp": "2023-05-22T11:02:29+02:00",
          "tree_id": "b6c7e77913d983a71ff91ead9858edc8093600e3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dd8afc503e942bcd56c9aa565f8b13d3ac90dcd4"
        },
        "date": 1684746340066,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31496,
            "range": "±4.98%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31454,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26774,
            "range": "±9.65%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30757,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29879,
            "range": "±3.29%",
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
          "id": "02f0b0b0f3ae1f5bb6461007be8458e58d13cc8f",
          "message": "client: Extend newPayloadV3 for blob versioned hashes checks (#2716)\n\n* client: Extend newPayloadV3 for blob versioned hashes checks\r\n\r\n* apply feedback\r\n\r\n* fix typo\r\n\r\n* improv comment\r\n\r\n* fix spec",
          "timestamp": "2023-05-22T13:07:11+02:00",
          "tree_id": "fdb25f67764c6560467332a7f2a114b5bbc499ac",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02f0b0b0f3ae1f5bb6461007be8458e58d13cc8f"
        },
        "date": 1684753845536,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31856,
            "range": "±4.12%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31520,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27587,
            "range": "±9.58%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32764,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29959,
            "range": "±3.16%",
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
          "id": "d3db69b4210d642eb3f0e708449a3cfd2a7cdacd",
          "message": "util: Remove ssz from monorepo (#2717)",
          "timestamp": "2023-05-22T13:59:41+02:00",
          "tree_id": "c1222a272282ac747f5b9e1990ca3f72fccc8b04",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d3db69b4210d642eb3f0e708449a3cfd2a7cdacd"
        },
        "date": 1684756961719,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32718,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32315,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28964,
            "range": "±8.62%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31392,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30572,
            "range": "±2.73%",
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
          "id": "d2a045150781d55d5b197bfeedf7540dde215c4a",
          "message": "Monorepo: update README.md branch status (#2719)",
          "timestamp": "2023-05-22T14:41:21+02:00",
          "tree_id": "3c1177cef030691d360debc2b3ac2436b7867132",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d2a045150781d55d5b197bfeedf7540dde215c4a"
        },
        "date": 1684760043756,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32823,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32362,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29667,
            "range": "±7.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31439,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30344,
            "range": "±2.62%",
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
          "id": "c1b29730be0ceab98a28cadc4d06d06f248966f2",
          "message": "Update rustbn.js and remove hotfix in evm (#2724)",
          "timestamp": "2023-05-23T20:55:42+02:00",
          "tree_id": "83c4a8c32ba80d272b11ffa685da537e88023290",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1b29730be0ceab98a28cadc4d06d06f248966f2"
        },
        "date": 1684868482233,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31835,
            "range": "±4.55%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31610,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27724,
            "range": "±8.93%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31449,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30499,
            "range": "±2.93%",
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
          "id": "13276b1d9f5044dfb19df3597c84c1ce3f8475a6",
          "message": "Client: Rename lib to src Folder (#2722)\n\n* Client: rename lib -> src folder\r\n\r\n* Client: rename lib references to src\r\n\r\n* Fix Karma tests\r\n\r\n* fix linter and ts config\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-05-23T15:44:58-04:00",
          "tree_id": "947e8d358d1cca8e174bbfabefb2f07e1f02ab1b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/13276b1d9f5044dfb19df3597c84c1ce3f8475a6"
        },
        "date": 1684871282857,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32263,
            "range": "±3.99%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31712,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28507,
            "range": "±8.10%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31480,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30529,
            "range": "±2.82%",
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
          "id": "453b60e8bd215bdf93211358cbee44cff3764ae9",
          "message": "evm: better error handling for contract creation errors (#2723)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-05-23T23:09:43+02:00",
          "tree_id": "d9a230535ad677e99abe841bfca03fab07346938",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/453b60e8bd215bdf93211358cbee44cff3764ae9"
        },
        "date": 1684876370968,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31483,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31398,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27473,
            "range": "±9.16%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30541,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29316,
            "range": "±3.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "fb6b221370ed688057d738d64576e2cca4c36d85",
          "message": "Make `ethersStateManager` more awesome (#2720)\n\n* Update ethers to latest version\r\n\r\n* Update mockprovider to match v6 API\r\n\r\n* Add more logging\r\n\r\n* fix test\r\n\r\n* various cleanup\r\n\r\n* Tell Karma to parse more modern syntax\r\n\r\n* Fix test helper\r\n\r\n* update lockfile-lint\r\n\r\n* fix node version\r\n\r\n* fix lockfile path\r\n\r\n* more fixes\r\n\r\n* Remove error condition\r\n\r\n* Add error messaging\r\n\r\n* StateManager: switch to ORDERED_MAP caches for EthersStateManager, remove console.log() from tests\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-05-24T09:44:57+02:00",
          "tree_id": "33729991e8054e63741880494f8100235cb3b6b5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fb6b221370ed688057d738d64576e2cca4c36d85"
        },
        "date": 1684914537763,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18105,
            "range": "±5.98%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18242,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18400,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18034,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17527,
            "range": "±3.12%",
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
          "id": "e9e3381e83ee116a29b0905dc5e19a02435e9982",
          "message": "Fix retesteth HF alias typo (#2727)",
          "timestamp": "2023-05-25T14:17:58+02:00",
          "tree_id": "741cd3e13f9c1ea87af4bd665f2d84a7feb5cad8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e9e3381e83ee116a29b0905dc5e19a02435e9982"
        },
        "date": 1685017292107,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25013,
            "range": "±6.63%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25388,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22841,
            "range": "±9.03%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21686,
            "range": "±11.46%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25078,
            "range": "±3.22%",
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
          "id": "515a7ba3e2e8f74d79f770f9b751ac90be185a3c",
          "message": "Merge pull request #2729 from ethereumjs/monorepo-add-wallet\n\nMonorepo Wallet Library Integration",
          "timestamp": "2023-05-26T21:19:03+02:00",
          "tree_id": "2d2fab2d76327547130a91fea78ff181d6b0c5db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/515a7ba3e2e8f74d79f770f9b751ac90be185a3c"
        },
        "date": 1685128952009,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31940,
            "range": "±5.24%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32000,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32078,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31157,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25954,
            "range": "±9.35%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "a225a000ea623f9e6ffdde3c058a73e2ed812725",
          "message": "Clean up `wallet` docs and readme (#2732)\n\n* Readme cleanup\r\n\r\n* Fix docs",
          "timestamp": "2023-05-27T12:31:46+02:00",
          "tree_id": "66a1ace77726b2f8dd90b5aa7c33eb445d62c8db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a225a000ea623f9e6ffdde3c058a73e2ed812725"
        },
        "date": 1685183785879,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16825,
            "range": "±6.78%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17450,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17208,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17103,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14177,
            "range": "±10.87%",
            "unit": "ops/sec",
            "extra": "70 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "44327614+GitMark0@users.noreply.github.com",
            "name": "GitMark0",
            "username": "GitMark0"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dd80af64d47f31b7a7e24120a656edebb933f8f8",
          "message": "fix unknown argument error (#2736)",
          "timestamp": "2023-05-30T13:31:22+02:00",
          "tree_id": "522fe183bcc026a40d085661b333c99a682ebf14",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dd80af64d47f31b7a7e24120a656edebb933f8f8"
        },
        "date": 1685446494394,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31226,
            "range": "±5.45%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31854,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31154,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30680,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24487,
            "range": "±11.10%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "a75c55c8cfa55eb754a045b6dbe936456bb0be54",
          "message": "block: swap withdrawal/opts in constructor (#2715)\n\n* block: swap withdrawal/opts in constructor\r\n\r\n* blockchain: fix pkg\r\n\r\n* vm: fix test runner\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-05-30T09:18:51-04:00",
          "tree_id": "ceb7901550a7871885e231abcb79e7c58e16ad8b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a75c55c8cfa55eb754a045b6dbe936456bb0be54"
        },
        "date": 1685452985718,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31294,
            "range": "±5.65%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31666,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31708,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30801,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22632,
            "range": "±12.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aadit2002nov@gmail.com",
            "name": "Aadit Palande",
            "username": "Coollaitar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dc075d4aaa2c78dbfc6d90fac33e8c9c38741204",
          "message": "Updated  ethereum-cryptography to ^2.0.0 (#2737)",
          "timestamp": "2023-05-30T11:53:31-04:00",
          "tree_id": "50830b0a2de99501992f5f774eaf5f0627f4d138",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dc075d4aaa2c78dbfc6d90fac33e8c9c38741204"
        },
        "date": 1685462765416,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31541,
            "range": "±5.88%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31814,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31739,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26133,
            "range": "±11.46%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30281,
            "range": "±3.04%",
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
          "id": "9c8f40799a2eb2d5631b7623a44434fd5dd1108f",
          "message": "Add minimal wallet CI workflow (#2738)\n\n* Add minimal wallet CI workflow\n\n* rename wallet job\n\n* remove obsolete build file",
          "timestamp": "2023-05-31T06:35:02-04:00",
          "tree_id": "ae0bb54a48006b11ae89d1d9c431bc862e0736d2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9c8f40799a2eb2d5631b7623a44434fd5dd1108f"
        },
        "date": 1685529505609,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31227,
            "range": "±5.44%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31835,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27837,
            "range": "±9.37%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 30730,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30161,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      }
    ]
  }
}