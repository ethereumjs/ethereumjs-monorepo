window.BENCHMARK_DATA = {
  "lastUpdate": 1666856936703,
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
          "id": "a7bb5ba8284894044bbb19f91f3804e901e6d2a0",
          "message": "common: Fix hardfork changes (#2331)\n\n* common: Fix hardfork changes\r\n\r\n* fix the spec hfs",
          "timestamp": "2022-10-06T11:27:56+02:00",
          "tree_id": "abee90fee7d51f42c93b816821300be728e81cc0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a7bb5ba8284894044bbb19f91f3804e901e6d2a0"
        },
        "date": 1665048984152,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19285,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18711,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17876,
            "range": "±6.08%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19344,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18478,
            "range": "±1.57%",
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
          "id": "1fbc0772a277a8a892d792f568e65f9e1ca9c4bd",
          "message": "TX: fix TX decoding when some values are actually arrays (#2284)\n\n* tx: fix decoding\r\n\r\n* Add tests for array inputs\r\n\r\n* Validate keys are valid tx data keys\r\n\r\n* tx: add more input value checks and fix the checker\r\n\r\n* Address feedback\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-06T11:11:59-04:00",
          "tree_id": "4d5bf07cbcc253d165e45f359d5063debe939774",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1fbc0772a277a8a892d792f568e65f9e1ca9c4bd"
        },
        "date": 1665069308045,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14243,
            "range": "±5.16%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14665,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12901,
            "range": "±9.43%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14667,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13994,
            "range": "±3.68%",
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
          "id": "284d4c1f90aea655661722a0905c68b921c0d55b",
          "message": "client: Provide txPool.txsByPriceAndNonce with correct vm for fetching txs to build block (#2333)",
          "timestamp": "2022-10-07T00:07:47+05:30",
          "tree_id": "bf352672577095cccca22828f6fa0b5e57280f14",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/284d4c1f90aea655661722a0905c68b921c0d55b"
        },
        "date": 1665081660859,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9544,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9905,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9206,
            "range": "±4.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9886,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9473,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "52b71f378e1328bcd7f2d5754ebd7fbc839f2d61",
          "message": "tx: cleanup npm test scripts (#2335)\n\n* tx: cleanup npm test scripts",
          "timestamp": "2022-10-07T12:43:01-04:00",
          "tree_id": "c4efb29286472b4d037d0faffa6d2b2e838da885",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52b71f378e1328bcd7f2d5754ebd7fbc839f2d61"
        },
        "date": 1665161160655,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15715,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15405,
            "range": "±5.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15789,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14901,
            "range": "±9.17%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15932,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "5738e2762b260df279a26d924d12348ce8a9d3ce",
          "message": "Unifies test directory naming (#2339)\n\n* common: move tests to test\r\n\r\n* evm: move tests to test\r\n\r\n* statemanager: move tests to test\r\n\r\n* vm: move tests to test\r\n\r\n* Fix paths in package.json\r\n\r\n* Fix tsconfig references\r\n\r\n* Fix karma config\r\n\r\n* Update doc references",
          "timestamp": "2022-10-08T13:35:07+05:30",
          "tree_id": "7c522c3e50a0bb2feaf4bbf4594a2f0671676b62",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5738e2762b260df279a26d924d12348ce8a9d3ce"
        },
        "date": 1665216459125,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19391,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18831,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18196,
            "range": "±6.03%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19432,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18747,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "113477227+ryptdec@users.noreply.github.com",
            "name": "Rypt Dec",
            "username": "ryptdec"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "eeca0cb1f534031cfd4a3c71866cd6d4c2475165",
          "message": "Fixing a typo in example3b.js and Readme.md for merkle_patricia_trees (#2340)\n\n* fix(trie): changing trie.root v4 => trie.root() >= v5\r\n\r\n* fix(trie): changing trie.root v4 => trie.root() >= v5\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2022-10-08T14:32:55-04:00",
          "tree_id": "88a21db0d4afb7e48181899e7f9ecb208ae999ca",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eeca0cb1f534031cfd4a3c71866cd6d4c2475165"
        },
        "date": 1665254389029,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18558,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17892,
            "range": "±5.22%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17223,
            "range": "±6.85%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17927,
            "range": "±6.99%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17776,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "83 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "12867336+HelloRickey@users.noreply.github.com",
            "name": "rickey",
            "username": "HelloRickey"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5821adda073be023c336a41954fe41e864732b2",
          "message": "Update README.md (#2342)\n\nUpdated link for Recursive Length Prefix",
          "timestamp": "2022-10-09T12:41:27-04:00",
          "tree_id": "eeda33b34fcf362a4d7d88dd526708713525c375",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5821adda073be023c336a41954fe41e864732b2"
        },
        "date": 1665333838400,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19301,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18802,
            "range": "±4.73%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17438,
            "range": "±7.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19395,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18745,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ndrozd@users.noreply.github.com",
            "name": "Nikita Drozd",
            "username": "ndrozd"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03587eb98ada83b51a402f06227e31b97450b23a",
          "message": "Added env check for debug mode + optimised the variable usage #1882 (#2311)\n\n* Added env check for debug mode + optimised the variable usage\r\n\r\nSolves DevP2P debug strings optimization #1882\r\n\r\n* Debug strings update (fixes for #2311)\r\n\r\n* fix examples\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-11T08:55:34-04:00",
          "tree_id": "8fd2db4bae39bf96fe1be59468484c6076255b00",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/03587eb98ada83b51a402f06227e31b97450b23a"
        },
        "date": 1665493133812,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18537,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17979,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16667,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18561,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17974,
            "range": "±1.90%",
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
          "id": "72fa1b0899a7f96b605a65385ef76e33da2b16df",
          "message": "Add Ethers State manager v2 (#2315)\n\n* first steps\r\n\r\n* add more tests\r\n\r\n* Add accounts and contract cache\r\n\r\n* Add runTx test\r\n\r\n* Remove vm hack\r\n\r\n* Switch accountCache to statemanager.cache\r\n\r\n* reorganize imports\r\n\r\n* Fix handling and tests for contract storage\r\n\r\n* Update accountExists to use getProof\r\n\r\n* Add getStateRoot and tests for read-only case\r\n\r\n* half-done runBlock test\r\n\r\n* Add example runBlock test\r\n\r\n* Add test deps\r\n\r\n* Remove package-lock\r\n\r\n* Add package-lock back\r\n\r\n* Fix bug with yParity in from-RPC\r\n\r\n* Typecast txdata values correctly\r\n\r\n* Remove unused dep and console logs\r\n\r\n* Remove unnecessary checks\r\n\r\n* lint\r\n\r\n* ethersStateManager: add trie callbacks\r\n\r\n* rm package-lock\r\n\r\n* rebase updates\r\n\r\n* More tweaks\r\n\r\n* add createProof\r\n\r\n* Fix runBlock issues and add helper\r\n\r\n* Clean up deps\r\n\r\n* Fix fromRPC tests\r\n\r\n* Fix tests again\r\n\r\n* Add correct blocktag to getCode/getstorage\r\n\r\n* Add storageTrie lookup\r\n\r\n* WIP test stuff\r\n\r\n* Dump contents of storage\r\n\r\n* log of value of slot retrieved from storageTrie\r\n\r\n* Remove storage cache map\r\n\r\n* Fix typo\r\n\r\n* Ethers state manager: implement storage cache (#2264)\r\n\r\n* ethersStateManager: update storage queries\r\n\r\n* Start work on storageTries\r\n\r\n* Remove console logs\r\n\r\n* Fix handling of deleted keys\r\n\r\n* block/fromRPC: fix converting CREATE txs\r\n\r\n* Implement clearContractStorage\r\n\r\n* fix hasStateRoot\r\n\r\n* Fix tests, clean up deps\r\n\r\n* Remove console logs\r\n\r\n* Reorganize logically and add docs\r\n\r\n* Fix comma\r\n\r\n* Incorporate feedback\r\n\r\n* mockProvider first draft\r\n\r\n* Add test data\r\n\r\n* Temporarily remove browser tests so unit tests will pass\r\n\r\n* Rework test data and imports\r\n\r\n* Add more test data and mock provider updates\r\n\r\n* Use mockProvider in all tests\r\n\r\n* Remove outdated test\r\n\r\n* Test fixes and error handling\r\n\r\n* Allow provider URL in constructor opts\r\n\r\n* Partially fix browser tests\r\n\r\n* Remove console log\r\n\r\n* switch require to await import\r\n\r\n* Skip API tests in browser\r\n\r\n* readme updates\r\n\r\n* Add new test to replay mainnet tx\r\n\r\n* Set common hf by blockTag\r\n\r\n* Address feedback\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Add additional API tests and putStorage updates\r\n\r\n* Address feedback\r\n\r\n* Update packages/statemanager/src/ethersStateManager.ts\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* Adjust provider instantiation logic\r\n\r\n* Remove erroneous console logs\r\n\r\n* Fix storage slot bug\r\n\r\n* Add error message for trie node delete branch node error\r\n\r\n* statemanager: remove cache [wip]\r\n\r\n* statemanager: store storage trie with consistent key\r\n\r\n* Use correct state root in verifyProof\r\n\r\n* Revise error message on missing node in trie.del\r\n\r\n* Add test for deleting slot happy path\r\n\r\n* lint\r\n\r\n* Update packages/block/src/from-rpc.ts\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* lint\r\n\r\n* Update package lock\r\n\r\n* Updated readme\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Address feedback\r\n\r\n* Switch from trie to cache + maps\r\n\r\n* Remove errant commit\r\n\r\n* More fixes\r\n\r\n* Add state root methods back\r\n\r\n* ethersStateManager: fix storage get\r\n\r\n* Remove unnecessary code\r\n\r\n* Reset runBlock test\r\n\r\n* remove package-lock.json\r\n\r\n* Fix package-lock\r\n\r\n* Address comments\r\n\r\n* Update comments/readme\r\n\r\n* Remove dynamic blocktag option; stateRoot methods\r\n\r\n* Update tests/testdata/docs\r\n\r\n* Fix lint\r\n\r\n* move getBlockfromProvider to block, update deps\r\n\r\n* Clean up imports\r\n\r\n* Add test for getBlockFromProvider\r\n\r\n* add txFromRpc method in transaction\r\n\r\n* block: Move rpc methods to static constructor\r\n\r\n* Move txFromRpc to TxFactory static constructor\r\n\r\n* Fix import/exports\r\n\r\n* Update test to use new static constructors\r\n\r\n* Fix logic bug\r\n\r\n* Revert test hacks\r\n\r\n* readme updates\r\n\r\n* Cleanup\r\n\r\n* Fix typing/wording\r\n\r\n* Add `earliest` back as blocktag option\r\n\r\n* Add tests to verify cached values dont call provider\r\n\r\n* fix block test\r\n\r\n* Add tests for normalizeTxParams\r\n\r\n* Fix readme\r\n\r\n* Move new test stuff to test/\r\n\r\n* Readme clarifications\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2022-10-11T23:05:03+02:00",
          "tree_id": "83e53777b5db29805fe299bea819c10218d71522",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/72fa1b0899a7f96b605a65385ef76e33da2b16df"
        },
        "date": 1665522497623,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10115,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10067,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10260,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9525,
            "range": "±6.94%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10323,
            "range": "±2.01%",
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
          "id": "9b0bedeebdaed824f9421e8425101e28a66de685",
          "message": "Broken Link (#2350)",
          "timestamp": "2022-10-12T10:08:08-04:00",
          "tree_id": "b4fb7ec57ebfbb9c631176da73ece3e974652d55",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9b0bedeebdaed824f9421e8425101e28a66de685"
        },
        "date": 1665583849030,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19127,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19069,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18350,
            "range": "±8.63%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19073,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18330,
            "range": "±4.65%",
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
          "id": "c16ab9495648b10fafa25643e1ca7fac7e2a7137",
          "message": "Finish the merge (#2351)",
          "timestamp": "2022-10-12T15:10:41-04:00",
          "tree_id": "c03514a53a5015c4e262317d317aaef678f9a390",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c16ab9495648b10fafa25643e1ca7fac7e2a7137"
        },
        "date": 1665601998040,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18776,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18756,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18190,
            "range": "±5.45%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18519,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18077,
            "range": "±1.76%",
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
          "id": "220832657401d6cc1f6ea662814a665cdee2e07c",
          "message": "Fix `tests` directory references  (#2352)\n\n* vm: fix retesteth\n\n* fix retesth readme\n\n* more rename tests to test",
          "timestamp": "2022-10-12T16:31:56-04:00",
          "tree_id": "4ad15898b0b48f5f034b40ee98cf163f7abb6c41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/220832657401d6cc1f6ea662814a665cdee2e07c"
        },
        "date": 1665606897052,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19234,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19314,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18672,
            "range": "±6.27%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19229,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18899,
            "range": "±1.60%",
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
          "id": "57bb8bbac85259a5b811bf1663be1c6556644d5b",
          "message": "evm: move 4399 to non-experimental (#2355)",
          "timestamp": "2022-10-12T20:12:02-04:00",
          "tree_id": "fad0125166e0bb4568cbe502c05a9f3a8c74dabd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/57bb8bbac85259a5b811bf1663be1c6556644d5b"
        },
        "date": 1665620078563,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18333,
            "range": "±3.16%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18363,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17710,
            "range": "±6.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18161,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17919,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "9204b576cb5deb5c40ddd2aed3779ff53d94c96a",
          "message": "Monorepo: fix broken eth.wiki links (#2354)\n\n* RLP: fix broken ethereum docs RLP link\r\n\r\n* Monorepo: update broken eth.wiki links\r\n\r\n* Add slashes\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-10-13T13:51:37+02:00",
          "tree_id": "f2e8b4cf3476ce0d4014952342ee64b5968048fe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9204b576cb5deb5c40ddd2aed3779ff53d94c96a"
        },
        "date": 1665662088463,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14401,
            "range": "±4.78%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 13856,
            "range": "±6.49%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15157,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14304,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13519,
            "range": "±8.42%",
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
          "id": "6eb5a85a48c3b6027ccf1d59a177c4103eaca0b1",
          "message": "client: fix validation logic for optional params in rpc (#2358)",
          "timestamp": "2022-10-14T12:50:59-04:00",
          "tree_id": "9c6b78b2760a138722ed771d1a1bb9b5fac09be9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6eb5a85a48c3b6027ccf1d59a177c4103eaca0b1"
        },
        "date": 1665766420109,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17457,
            "range": "±4.42%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17809,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16942,
            "range": "±6.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17170,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16899,
            "range": "±2.30%",
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
      }
    ]
  }
}