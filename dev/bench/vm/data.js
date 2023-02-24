window.BENCHMARK_DATA = {
  "lastUpdate": 1677267782268,
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
          "id": "4428938ac30823f7eaa2950448e974ee48267c13",
          "message": "Remove trusted setups from build (#2522)\n\n* Move trusted setups out of build dir\r\n\r\n* update readme\r\n\r\n* Fix tests\r\n\r\n* add check for kzg\r\n\r\n* move trusted setup to client\r\n\r\n* Update readme\r\n\r\n* Rename trusted_setup.txt to devnet4.txt\r\n\r\n* Renamed trusted_setup.txt to devnet4.txt\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-02-09T11:35:43+01:00",
          "tree_id": "a5915e16b3d98ba32d5ee6e160a64362cc32cc75",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4428938ac30823f7eaa2950448e974ee48267c13"
        },
        "date": 1675939104267,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20459,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19692,
            "range": "±4.85%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20356,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18835,
            "range": "±8.92%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20501,
            "range": "±1.56%",
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
          "id": "e0917c433fbe93a3d9f9f2f8934e531568a71768",
          "message": "Fix blockchain interface getBlock() signature (remove null return option) (#2524)\n\n* Align Blockchain getBlock() interface signature with implementation (removed null return option), added test case for non-existing Block request\r\n\r\n* Improve getBlock() error message along NotFound DB error\r\n\r\n* Removed getBlock() null return assertion conditional logic throughout code base",
          "timestamp": "2023-02-09T14:48:05+01:00",
          "tree_id": "81e3325e65b15036b77ed183128741eeb4b2d835",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e0917c433fbe93a3d9f9f2f8934e531568a71768"
        },
        "date": 1675950647792,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19513,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18882,
            "range": "±3.61%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19063,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17658,
            "range": "±7.28%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19479,
            "range": "±1.18%",
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
          "id": "bad735bc2e25db8291aa3f2e2c8b206fdaba356f",
          "message": "Update trie docs (#2525)",
          "timestamp": "2023-02-09T15:00:34-05:00",
          "tree_id": "ce4ffe15c8e950141ff031baea82ada19f876f08",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bad735bc2e25db8291aa3f2e2c8b206fdaba356f"
        },
        "date": 1675973000930,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19342,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18821,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18945,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17503,
            "range": "±8.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19235,
            "range": "±1.36%",
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
          "id": "86d353a0e00b70c15fc1bafca172faa86c43f212",
          "message": "Client trusted setup path fixes (#2526)\n\n* Copy trustedSetup folder to client dist folder on build\r\n\r\n* Switch to self-contained trusted setup path creations where possible (particularly for bin/cli.ts in Client)",
          "timestamp": "2023-02-10T17:02:24+05:30",
          "tree_id": "fbcca325a386a92a4f50e95a84262636ce16aebf",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/86d353a0e00b70c15fc1bafca172faa86c43f212"
        },
        "date": 1676028940848,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15600,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14808,
            "range": "±5.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15921,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15245,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13694,
            "range": "±10.81%",
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
          "id": "562b0ff16662b68a1bbbe0110c941916edc793a6",
          "message": "Schedule shanghai on sepolia (#2527)\n\n* Schedule shanghai on sepolia\r\n\r\n* format",
          "timestamp": "2023-02-10T13:11:43+01:00",
          "tree_id": "8b120b054887833f5be698de02f275a70fad087f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/562b0ff16662b68a1bbbe0110c941916edc793a6"
        },
        "date": 1676031312184,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15549,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14229,
            "range": "±7.20%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15114,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15046,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13526,
            "range": "±10.52%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "0cf96546bab7c752114f3d03209add9429a4f1ba",
          "message": "allforks: Hive withdrawal fixes (#2529)\n\n* allforks: Hive fixes regarding withdrawal test vectors\r\n\r\n* check if newPayloadV2 withdrawals is null\r\n\r\n* add check for null on withdrawals and excessdatagas\r\n\r\n* fix sendtransaction hf setting\r\n\r\n* skip updating number to hash index on runWithoutSetHead\r\n\r\n* Fix setting the hardfork on vm in getTransactionReceipt\r\n\r\n* Remove bad console logs\r\n\r\n* Fix vm.copy\r\n\r\n* Correctly copy common in evm and eei copy\r\n\r\n* Remove unused client subdirectories\r\n\r\n* fix loading block/header which might not be in canonical chain\r\n\r\n* improv\r\n\r\n* add EEI.copy tests\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-14T23:09:29+05:30",
          "tree_id": "7f625a155a9b6a55633bb1d06be01288c7beb0c4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0cf96546bab7c752114f3d03209add9429a4f1ba"
        },
        "date": 1676396539651,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15814,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15348,
            "range": "±4.27%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15833,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15423,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14232,
            "range": "±7.07%",
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
          "id": "a1ca97339cf27fe4f119de50beabd4166811b777",
          "message": "client: create snap sync fetcher to sync accounts (#2107)\n\n* Add account fetcher base\r\n\r\n* Add accountfetcher import\r\n\r\n* Add AccountFetcher as possible type for Synchronizer.fetcher\r\n\r\n* Place call to getAccountRange inside of fetcher\r\n\r\n* Place call to getAccountRange() in accountfetcher and comment it out\r\n\r\n* Add account fetcher base\r\n\r\n* Add accountfetcher import\r\n\r\n* add account fetcher getter setter in snapsync\r\n\r\n* Change order of importing accountfetcher in index file\r\n\r\n* Change bytes parameter to be per task\r\n\r\n* Remove root and bytes from task inputs and make them fetcher variables\r\n\r\n* Correct log message\r\n\r\n* Add debug console log statement\r\n\r\n* Fix linting issues\r\n\r\n* Add account to mpt and check validity with root and proof\r\n\r\n* Set root of trie\r\n\r\n* Add checks to fetcher.request()\r\n\r\n* client/snap: fix getAccountRange return type\r\n\r\n* client/snap: pass first proof\r\n\r\n* client/snap: add utility to convert slim account to a normal RLPd account\r\n\r\n* client/snap: implement account range db dump\r\n\r\n* Update to use verifyRangeProof\r\n\r\n* Correct some messages\r\n\r\n* Update verifyProofRange input for first account hash to be fetcher origin\r\n\r\n* Fix linting issues\r\n\r\n* Store accounts in store phase\r\n\r\n* Add logic for dividing hash ranges and adding them as tasks\r\n\r\n* Increment count by 1 before next iteration\r\n\r\n* client/snap: remove unnecessary account fetcher logic\r\n\r\n* client/snap: correctly feed the right values to verifyRangeProof\r\n\r\n* lint fixes\r\n\r\n* small cleanup\r\n\r\n* fix account fetcher with previous fixes\r\n\r\n* overhaul and simplify the fetcher and add partial results handling\r\n\r\n* cleanup comments\r\n\r\n* fix fetch spec tests\r\n\r\n* Check if right range is missing using return value from verifyRangeProof\r\n\r\n* Add accountfetcher tests\r\n\r\n* Remove request test\r\n\r\n* Correct return type\r\n\r\n* Add request test\r\n\r\n* Add account fetcher base\r\n\r\n* Add accountfetcher import\r\n\r\n* Add AccountFetcher as possible type for Synchronizer.fetcher\r\n\r\n* Place call to getAccountRange inside of fetcher\r\n\r\n* Place call to getAccountRange() in accountfetcher and comment it out\r\n\r\n* Add account fetcher base\r\n\r\n* Add accountfetcher import\r\n\r\n* add account fetcher getter setter in snapsync\r\n\r\n* Change order of importing accountfetcher in index file\r\n\r\n* Change bytes parameter to be per task\r\n\r\n* Remove root and bytes from task inputs and make them fetcher variables\r\n\r\n* Correct log message\r\n\r\n* Add debug console log statement\r\n\r\n* Fix linting issues\r\n\r\n* Add account to mpt and check validity with root and proof\r\n\r\n* Set root of trie\r\n\r\n* Add checks to fetcher.request()\r\n\r\n* client/snap: fix getAccountRange return type\r\n\r\n* client/snap: pass first proof\r\n\r\n* client/snap: add utility to convert slim account to a normal RLPd account\r\n\r\n* client/snap: implement account range db dump\r\n\r\n* Update to use verifyRangeProof\r\n\r\n* Correct some messages\r\n\r\n* Update verifyProofRange input for first account hash to be fetcher origin\r\n\r\n* Fix linting issues\r\n\r\n* Store accounts in store phase\r\n\r\n* Add logic for dividing hash ranges and adding them as tasks\r\n\r\n* Increment count by 1 before next iteration\r\n\r\n* client/snap: remove unnecessary account fetcher logic\r\n\r\n* client/snap: correctly feed the right values to verifyRangeProof\r\n\r\n* lint fixes\r\n\r\n* small cleanup\r\n\r\n* fix account fetcher with previous fixes\r\n\r\n* overhaul and simplify the fetcher and add partial results handling\r\n\r\n* cleanup comments\r\n\r\n* fix fetch spec tests\r\n\r\n* Check if right range is missing using return value from verifyRangeProof\r\n\r\n* Add accountfetcher tests\r\n\r\n* Remove request test\r\n\r\n* Correct return type\r\n\r\n* Add request test\r\n\r\n* Add test for proof verification\r\n\r\n* Fix linting issues\r\n\r\n* Fix test\r\n\r\n* Update comment\r\n\r\n* reduce diff\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-02-15T00:28:11+05:30",
          "tree_id": "a87eced4289441d3ef2627858fdf57367be0dd48",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a1ca97339cf27fe4f119de50beabd4166811b777"
        },
        "date": 1676401254661,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15884,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15460,
            "range": "±4.03%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15947,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15447,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14469,
            "range": "±6.94%",
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
          "id": "c960deba1d0a38293b9c69435fed7aa045913622",
          "message": "allforks: Allow genesis to be post merge (#2530)\n\n* allforks: Allow genesis to be post merge\n\n* Fix block tests\n\n* Fix tests\n\n* Fix tests and testdata\n\n* Fix VM test\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-14T16:35:16-05:00",
          "tree_id": "451da5e2fd53aa46f7d17d4ede94a39489259ae8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c960deba1d0a38293b9c69435fed7aa045913622"
        },
        "date": 1676410725591,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8426,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8447,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8161,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8644,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8433,
            "range": "±2.21%",
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
          "id": "282d1c24c489f826181b4c758f66671201962782",
          "message": "client: Fix engine-auth and engine-exchange-capabilities hive test (#2531)\n\n* client: Increase allowed drift for engine auth staleness check\n\n* rename getcapabilities to exchangecapabilities\n\n* spec fixes\n\n* rename spec test\n\n* move to correct loc\n\n* lint",
          "timestamp": "2023-02-15T06:28:39-05:00",
          "tree_id": "634ff423d80baa2d5c18a1f0afaef4d298f03546",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/282d1c24c489f826181b4c758f66671201962782"
        },
        "date": 1676460711769,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 13097,
            "range": "±4.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 13104,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12519,
            "range": "±5.94%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12627,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12481,
            "range": "±2.60%",
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
          "id": "e9de55f488c59fb54ed2eaa07bcf63ec8d4c15e7",
          "message": "blockchain: Add extra validations for assuming nil bodies in getBlock (#2534)\n\n* blockchain: Add extra validations for assuming nil bodies in getBlock\r\n\r\n* coverage",
          "timestamp": "2023-02-17T11:55:46+01:00",
          "tree_id": "30068b1023fd775f05e0e8819ecb1bee75c57287",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e9de55f488c59fb54ed2eaa07bcf63ec8d4c15e7"
        },
        "date": 1676631539298,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12605,
            "range": "±5.11%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12634,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12297,
            "range": "±7.33%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12656,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12233,
            "range": "±2.72%",
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
          "id": "9c85aea08dcf6538292c9ad69553c2477e16a2c7",
          "message": "Isolating single peer run (#2535)",
          "timestamp": "2023-02-20T15:10:41+05:30",
          "tree_id": "263a7cd7593b6abd3269947fa477e81f40382d53",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9c85aea08dcf6538292c9ad69553c2477e16a2c7"
        },
        "date": 1676886251446,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 7998,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8030,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8052,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7892,
            "range": "±4.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7949,
            "range": "±2.01%",
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
          "id": "b7ebab96a5c114974c2fd6477b1e0fecf33e807e",
          "message": "Revert \"Isolating single peer run (#2535)\" (#2537)\n\nThis reverts commit 9c85aea08dcf6538292c9ad69553c2477e16a2c7.",
          "timestamp": "2023-02-20T16:00:45+05:30",
          "tree_id": "30068b1023fd775f05e0e8819ecb1bee75c57287",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b7ebab96a5c114974c2fd6477b1e0fecf33e807e"
        },
        "date": 1676889214105,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15264,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14593,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15407,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14806,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13334,
            "range": "±8.69%",
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
          "id": "2153e1c09c7923b15ad9a3a65bb9dbc751523dbe",
          "message": "withdrawals and transaction inclusion logic updates (#2533)\n\n* client: Modify pending block retention to cache size limit based\r\n\r\n* cache the block in builder\r\n\r\n* do not throw on double revert\r\n\r\n* update tx hf than throwing on mismatch on txRun\r\n\r\n* fix pendingblock issues\r\n\r\n* fix pendingBlock tests\r\n\r\n* Fix miner test\r\n\r\n* Fix runTx test.  Remove invalid tx hf branch\r\n\r\n* Fix withdrawals test\r\n\r\n* Fix buildBlock tests and revert logic\r\n\r\n* Change revert logic\r\n\r\n* Remove meaningless test\r\n\r\n* cleanup comments\r\n\r\n* apply feedback and lint\r\n\r\n* revert statemanager on buildblock revert\r\n\r\n* fix test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-20T12:52:37+01:00",
          "tree_id": "188bf83ac7a61fb99061b40185583ad6c5eb1f5a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2153e1c09c7923b15ad9a3a65bb9dbc751523dbe"
        },
        "date": 1676894117525,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16114,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15421,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16044,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15413,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14368,
            "range": "±7.33%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zgayjjf@qq.com",
            "name": "Jeff Jing",
            "username": "zgayjjf"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4d4631366f8373e672863cb87a3ca14425d9f321",
          "message": "Use literal value instead of formular for MAX_INTEGER_BIGINT (#2536)\n\n* feat: use static BigInt instead of calculated\r\n\r\n* chore: add description\r\n\r\n* Lint fix\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-02-20T13:45:42+01:00",
          "tree_id": "10ffc647e2d6c2d6b41531542ceca363aa4da86e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4d4631366f8373e672863cb87a3ca14425d9f321"
        },
        "date": 1676897306373,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15935,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15664,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15817,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15396,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14298,
            "range": "±7.72%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "4aa97537c6919eddf6629a762c0a1fa9c12ef97e",
          "message": "Devp2p Improvements and Clean-Ups / Client ID Integration (#2538)\n\n* devp2p: added singlePeerRun.ts script, new script folder setup structure\r\n\r\n* devp2p: removed outdated Parity DPT server ping response hack\r\n\r\n* devp2p: improved RLPx HELLO message logging (added protocol version and client ID)\r\n\r\n* Client: use client version for RLPx initialization\r\n\r\n* Minor",
          "timestamp": "2023-02-20T14:53:25+01:00",
          "tree_id": "469e3bf31e93cd8415c237cb51a9de7c1b82d9e4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4aa97537c6919eddf6629a762c0a1fa9c12ef97e"
        },
        "date": 1676901398017,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12778,
            "range": "±3.77%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12599,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12495,
            "range": "±6.70%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12433,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12039,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "1a7094d5430751fcf8a73ae00ff02c62eab8cb53",
          "message": "New Releases (Shanghai Support, EIP-4844 (experimental), Client Improvements) (#2521)\n\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (RLP v4.0.1)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/util v8.0.4)\r\n\r\n* Rebuild documentation (@ethereumjs/util)\r\n\r\n* Added withdrawal module to README (@ethereumjs/util)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/trie v5.0.3)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/common v3.0.3)\r\n\r\n* Rebuild documentation (@ethereumjs/common)\r\n\r\n* Added missing EIPs to README, general updates (@ethereumjs/common)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/statemanager v1.0.3)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/devp2p v5.1.0)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/tx v4.1.0)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/ethash v2.0.3)\r\n\r\n* Tx README/CHANGELOG fixes\r\n\r\n* Additional fixes\r\n\r\n* Even more fixes\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/blockchain v6.2.0)\r\n\r\n* Rebuild blockchain documentation\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/evm v1.3.0)\r\n\r\n* Rebuild EVM documentation\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/vm v6.4.0)\r\n\r\n* Added CHANGELOG entry, version bump, updated upstream dependency versions (@ethereumjs/block v4.2.0)\r\n\r\n* Tx libray KZG setup instruction generalization\r\n\r\n* Create and consolidate KZG setup instructions within a single source of truth, add references\r\n\r\n* Added 4844 and KZG setup instructions and refernces to the Blockchain library\r\n\r\n* Fixes\r\n\r\n* Bumped client version to v0.7.0, added CHANGELOG entry\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Completed CHANGELOG files\r\n\r\n* Update packages/util/CHANGELOG.md\r\n\r\n* Update packages/client/CHANGELOG.md\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-02-21T08:47:59+01:00",
          "tree_id": "e5f85bcf24015f9bacf077dd1a9b75fe287fcb9d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1a7094d5430751fcf8a73ae00ff02c62eab8cb53"
        },
        "date": 1676965844296,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15779,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15278,
            "range": "±4.79%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15656,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15360,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13993,
            "range": "±7.93%",
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
          "id": "8cd95e51513781e1d4f540a75d3745b4162e98c1",
          "message": "Various Hive related fixes (#2532)\n\n* add block preload parameter\r\n\r\n* Skip extradata check on genesis pow blocks\r\n\r\n* Reconfigure block preloading\r\n\r\n* open client\r\n\r\n* Fix chain rlp loading\r\n\r\n* fix resetting canonical head on reorg scenarios\r\n\r\n* remove unnecessary hf setting in chain putblocks\r\n\r\n* add and use reset canonical head for chain\r\n\r\n* fix blockchain test\r\n\r\n* fix breaking skeleton spec\r\n\r\n* fix reset canonical header and add fix\r\n\r\n* Adjust loop exit check and logging\r\n\r\n* add jsdoc\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-02-21T12:38:07+01:00",
          "tree_id": "5670386a8a4ea0d3dc9e880663c6462553368419",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cd95e51513781e1d4f540a75d3745b4162e98c1"
        },
        "date": 1676979965449,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8405,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8433,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8145,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8336,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8252,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "0f0a2dc96ca0b5520ba630d83ffbb57faa082b71",
          "message": "Client: Move to async Blockchain constructor / fix --startBlock option bug (#2540)\n\n* Move EthereumClient class to an async initialization via create() (clean Blockchain initialization)\r\n\r\n* Move to async Client Chain.create() constructor for safe Blockchain initialization\r\n\r\n* Minor\r\n\r\n* use resetCanonicalHead for startblock\r\n\r\n* lint\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-02-21T13:32:56+01:00",
          "tree_id": "92d9e3d08f01b08bf85c5162d9581ba455cc4fa5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0f0a2dc96ca0b5520ba630d83ffbb57faa082b71"
        },
        "date": 1676982939066,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16173,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15527,
            "range": "±4.94%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15966,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15442,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14283,
            "range": "±7.53%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "535cd8d6ce289064a7834fed740d87aeb139ef57",
          "message": "Fix broken URL to `packages/statemanager` (#2539)\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-21T14:54:25-05:00",
          "tree_id": "3a792515f4a7c850e73cf2bdf5d0ff4dfdcb414c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/535cd8d6ce289064a7834fed740d87aeb139ef57"
        },
        "date": 1677009465574,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15752,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15208,
            "range": "±4.37%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15633,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15249,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14093,
            "range": "±8.67%",
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
          "id": "70d93fd51ce5020143926ef45b4f85ed47cc019f",
          "message": "Fix the fetcher errored property colliding with Readable class (#2541)\n\n* Fix the fetcher errored property colliding with Readable class\r\n\r\n* Add unit test for error\r\n\r\n* Move test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-21T21:19:32+01:00",
          "tree_id": "768cc7fc9ad7d087334d9ba62b96958703e48e95",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/70d93fd51ce5020143926ef45b4f85ed47cc019f"
        },
        "date": 1677010956385,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15812,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15286,
            "range": "±3.95%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15809,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15388,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14199,
            "range": "±7.07%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "bbfe7c2bf681d2a2b57b5f90df5e84ceb6a57fa1",
          "message": "Miner-support-for-saveReceipts (#2544)\n\n* client/miner: collect receipts as blockbuilder builds\r\n\r\n* client/miner: save receipts to DB if saveReceipts is set\r\n\r\n* client/miner: add test for saveReceipts\r\n\r\n* Fix client tests\r\n\r\n* Easier to read conditionals\r\n\r\n* Client test fix\r\n\r\n* fix whitespace\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-02-23T08:10:52+01:00",
          "tree_id": "cdbe89e4889e3a56257c259921748867f3487438",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/bbfe7c2bf681d2a2b57b5f90df5e84ceb6a57fa1"
        },
        "date": 1677136413409,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16050,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15298,
            "range": "±4.36%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15850,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15414,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14111,
            "range": "±8.02%",
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
          "id": "e244a8b43dd5fd5870de9f2ac3f944ff4c71c14b",
          "message": "Fix devp2p DNS discovery ENR record decoding (#2546)",
          "timestamp": "2023-02-23T11:17:57+01:00",
          "tree_id": "fdb43a85e0ca0831237233973cf095a9ec911ebe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e244a8b43dd5fd5870de9f2ac3f944ff4c71c14b"
        },
        "date": 1677147669749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12575,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12407,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12462,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11647,
            "range": "±7.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12547,
            "range": "±2.45%",
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
          "id": "98f5712639e27484ca35cee790a564b48807fc42",
          "message": "Blockchain/Client: Total difficulty related HF switch fixes (#2545)\n\n* Total difficulty related HF switch fixes\r\n\r\n* Blockchain test fix\r\n\r\n* update parentTD usage and conditions\r\n\r\n* run execution on startup\r\n\r\n* stop miner at merge\r\n\r\n* fix miner spec\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-02-23T12:49:43+01:00",
          "tree_id": "00daf99dfd4ffcce8484b7758359456601f19220",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/98f5712639e27484ca35cee790a564b48807fc42"
        },
        "date": 1677153143233,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16238,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15554,
            "range": "±3.85%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16130,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15719,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14424,
            "range": "±7.25%",
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
          "id": "d085ab71f8a4e632b1a80b4a654b5513fc076fe8",
          "message": "Small Client UX Improvements (#2547)\n\n* Added more prominent Merge transition message with CL client notice and setup reference\r\n\r\n* Improve client Engine API JWT authentication logging\r\n\r\n* Additional mention of JSON RPC endpoint\r\n\r\n* Minor",
          "timestamp": "2023-02-23T13:30:57+01:00",
          "tree_id": "b9b0a0e0a35f998cfbc9bbcf1406e780c236222b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d085ab71f8a4e632b1a80b4a654b5513fc076fe8"
        },
        "date": 1677155625107,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15253,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14357,
            "range": "±5.25%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15407,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14838,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12889,
            "range": "±9.26%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "1838a1cf12de633f15528c91bfdbf167d7d7593b",
          "message": "blockchain: Revert to previous sane heads if block or header put fails (#2548)",
          "timestamp": "2023-02-23T14:57:42+01:00",
          "tree_id": "f4aff2e7876bc0221c08ecdc91061d607ff105c0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1838a1cf12de633f15528c91bfdbf167d7d7593b"
        },
        "date": 1677160827791,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16058,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15336,
            "range": "±4.58%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15925,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15510,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14395,
            "range": "±6.08%",
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
          "id": "ac78762268e2966d20446c9bdb31e5d8a50e7e22",
          "message": "Fix invalid head block reset bug (#2550)\n\n* Put original head back on failed reorg\r\n\r\n* Add comments\r\n\r\n* Update packages/client/lib/sync/skeleton.ts\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* Update packages/client/lib/sync/skeleton.ts\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>\r\n\r\n* fix build\r\n\r\n* add tests for canonical references\r\n\r\n---------\r\n\r\nCo-authored-by: g11tech <gajinder@g11.in>",
          "timestamp": "2023-02-24T07:58:36+01:00",
          "tree_id": "9509188fb4ee19f3d68ccace30f93c0481af25fb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ac78762268e2966d20446c9bdb31e5d8a50e7e22"
        },
        "date": 1677222126177,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 7733,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8138,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8564,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7923,
            "range": "±6.55%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8203,
            "range": "±2.24%",
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
          "id": "47c293da1f849f05000e7e70061d62d571ff3920",
          "message": "New Releases (Continuation) (#2549)\n\n* Updated CHANGELOG files, rebuild blockchain docs, added client Lodestar/EthereumJS README example\r\n\r\n* Fix typo\r\n\r\n* Client CHANGELOG addition\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-02-24T09:51:02+01:00",
          "tree_id": "b861300c540bc9eee169e371878e98ff6ed6c82a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/47c293da1f849f05000e7e70061d62d571ff3920"
        },
        "date": 1677228856733,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12641,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12827,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12413,
            "range": "±6.11%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12554,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12468,
            "range": "±2.53%",
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
          "id": "61e32b3f63ae2643fe4c459275b176f032b37f9b",
          "message": "Fix kzg imports in `tx` (#2552)\n\n* Fix kzg import\r\n\r\n* Remove edits from build script",
          "timestamp": "2023-02-24T14:40:14-05:00",
          "tree_id": "e8566b224625c8f2140d87ab97b08023c48c7780",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/61e32b3f63ae2643fe4c459275b176f032b37f9b"
        },
        "date": 1677267781118,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15467,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14774,
            "range": "±5.23%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15322,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14922,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13453,
            "range": "±8.95%",
            "unit": "ops/sec",
            "extra": "74 samples"
          }
        ]
      }
    ]
  }
}