window.BENCHMARK_DATA = {
  "lastUpdate": 1678185371946,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "25f5b676c90a49bf9e68188dc48751c4f1eba205",
          "message": "Revert ssz version to fix replaceAll error (#2555)\n\n* Fix ssz replace all\r\n\r\n* update libs to a working version",
          "timestamp": "2023-02-27T14:30:59+01:00",
          "tree_id": "f60014b6747424318abc2176b58bf1a30030e224",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/25f5b676c90a49bf9e68188dc48751c4f1eba205"
        },
        "date": 1677504823649,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15389,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14746,
            "range": "±5.01%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15451,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14999,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13607,
            "range": "±9.41%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "295e5a3caa69c226e8f8edfad4ea72a843bc0b4f",
          "message": "Hotfix Releases (SSZ and KZG dependency fixes) (#2556)\n\n* Added CHANGELOG updates, deprecation notes, updated version numbers, updated upstream dependency versions\r\n\r\n* Fixes\r\n\r\n* Updated package-lock.json",
          "timestamp": "2023-02-27T15:05:29+01:00",
          "tree_id": "dd043ea6ce2023023c11e8fa35cb465476161c43",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/295e5a3caa69c226e8f8edfad4ea72a843bc0b4f"
        },
        "date": 1677506908927,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 13529,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 13706,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13242,
            "range": "±6.64%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13493,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13355,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "6949e89427b9e791427ecb5c9eb5bc73f4648e97",
          "message": "Turn off libp2p by default (#2557)",
          "timestamp": "2023-02-28T22:18:34+01:00",
          "tree_id": "c9118b9f9882587ba6cd9f8ea73ee5a30eced784",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6949e89427b9e791427ecb5c9eb5bc73f4648e97"
        },
        "date": 1677619299758,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12555,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12583,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12603,
            "range": "±6.87%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12379,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12068,
            "range": "±2.79%",
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
          "id": "d592adee876d9fece9da77dc7da152c6513a24f8",
          "message": "Added v7 release reference in main README table (#2562)",
          "timestamp": "2023-03-02T12:13:40-05:00",
          "tree_id": "e6b9989b7e367a501c212630479e30481ebc1b92",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d592adee876d9fece9da77dc7da152c6513a24f8"
        },
        "date": 1677777402326,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15885,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15205,
            "range": "±4.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15888,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15484,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14050,
            "range": "±8.27%",
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
          "id": "f2a24273340f1c0a341be013f9aeadc17296290b",
          "message": "common: Schedule shanghai on goerli (#2563)\n\n* common: Schedule shanghai on goerli\r\n\r\n* update timestamp",
          "timestamp": "2023-03-03T08:55:00+01:00",
          "tree_id": "67a8d9fa11396c0a0e9fc60ff9d415765e972ad5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f2a24273340f1c0a341be013f9aeadc17296290b"
        },
        "date": 1677830303837,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 8441,
            "range": "±3.62%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 8816,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 8489,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 8435,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 8353,
            "range": "±2.50%",
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
          "id": "99640d6a84dbbc5abec0dcb0095d5ba17ae9ad1a",
          "message": "util/tx: Shift ssz back to case dependency free ES2019 compatible version (#2564)\n\n* util/tx: Shift ssz back to case dependency free ES2019 compatible version\r\n\r\n* update package lock\r\n\r\n* update karma ecma version",
          "timestamp": "2023-03-03T21:16:45+05:30",
          "tree_id": "1ca9e957e3f90f61fe1a9d06573f77460672f378",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/99640d6a84dbbc5abec0dcb0095d5ba17ae9ad1a"
        },
        "date": 1677858570080,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15709,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15351,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15457,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14765,
            "range": "±6.67%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15033,
            "range": "±1.87%",
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
          "id": "e1a2cca1ada35d7d4b7a94bdfa5d62a1195b5f36",
          "message": "VM: some optimization on the bnadd/bnmul precompiles to only copy over the necessary 128 bytes as input for the WASM call (#2568)",
          "timestamp": "2023-03-06T10:04:59-05:00",
          "tree_id": "58d124717f5f4dcecb84fcb5f16a84f96ab5f775",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e1a2cca1ada35d7d4b7a94bdfa5d62a1195b5f36"
        },
        "date": 1678115276197,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15641,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15098,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15698,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15083,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13527,
            "range": "±7.44%",
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
          "id": "6cd35aac660f82d831799830db7f7fd438dd0c96",
          "message": "EVM: Memory Fix & Other Optimizations (#2570)\n\n* EVM: Rename evm debug logger to evm:evm (one for package, one for class), consistency, also, logger will otherwise be left out when run with evm:*\r\n\r\n* VM: Rename message checkpoint to state checkpoint in debug message (there is a dedicated message checkpoint msg along msg logging)\r\n\r\n* EVM: CALL/CREATE debug exit msg differentiation\r\n\r\n* EVM: avoid buffer copy in memory read (performance)\r\n\r\n* EVM: Rewrite runCall() checkpoint/revert conditional for readability/simplification\r\n\r\n* EVM: Added EIP check for transient storage checkpointing",
          "timestamp": "2023-03-07T11:32:33+01:00",
          "tree_id": "78b158a5afae36bf2a20695935c3e556c5192b34",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6cd35aac660f82d831799830db7f7fd438dd0c96"
        },
        "date": 1678185370605,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 7819,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 7458,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 7894,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 7405,
            "range": "±5.38%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 7255,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "80 samples"
          }
        ]
      }
    ]
  }
}