window.BENCHMARK_DATA = {
  "lastUpdate": 1662029496528,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "fffe4ab648855911c0a84b48e214a0843111aa67",
          "message": "refactor(trie): integrate `CheckpointTrie` behaviour into main `Trie` class (#2215)\n\n* trie: removed deprecated prove() function (renamed to createProof())\r\n\r\n* trie: added secure option to base trie, integrated secure trie functionality\r\n\r\n* trie: adopted secureTrie.spec.ts tests (5 failing)\r\n\r\n* trie: fixed copy function\r\n\r\n* trie: fixed secureTrie.spec.ts branching test\r\n\r\n* trie: additional test fixes\r\n\r\n* trie: removed secure.ts SecureTrie class definition file\r\n\r\n* trie: updated README\r\n\r\n* trie: removed secure export, unified prepareTrieOpts and expand to CheckpointTrie\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* trie: renamed _secure -> _hashKeys and _hash() -> _hashKeysFunction\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): always use `CheckpointDB` as internal database\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor: always support checkpointing\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor: prevent manual usage of `CheckpointDB` as option\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-08-24T11:46:13+02:00",
          "tree_id": "8c39acada8b8adc674e29940ff10e7beb59ee809",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fffe4ab648855911c0a84b48e214a0843111aa67"
        },
        "date": 1661334533274,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23224,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22375,
            "range": "±4.01%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22803,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22590,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20564,
            "range": "±8.28%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "7c0b0adc00f3d21cd2b3cff69c7588293103f5ed",
          "message": " refactor(trie): change `isCheckpoint` getter to `hasCheckpoints` checker (#2218)\n\n* trie: removed deprecated prove() function (renamed to createProof())\r\n\r\n* trie: added secure option to base trie, integrated secure trie functionality\r\n\r\n* trie: adopted secureTrie.spec.ts tests (5 failing)\r\n\r\n* trie: fixed copy function\r\n\r\n* trie: fixed secureTrie.spec.ts branching test\r\n\r\n* trie: additional test fixes\r\n\r\n* trie: removed secure.ts SecureTrie class definition file\r\n\r\n* trie: updated README\r\n\r\n* trie: removed secure export, unified prepareTrieOpts and expand to CheckpointTrie\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* trie: renamed _secure -> _hashKeys and _hash() -> _hashKeysFunction\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): always use `CheckpointDB` as internal database\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor: always support checkpointing\r\n\r\n* refactor(trie): change `isCheckpoint` getter to `hasCheckpoints` checker\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-08-24T12:58:54+02:00",
          "tree_id": "0557a9b602bd07e9ff83564386ec7addd321b175",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7c0b0adc00f3d21cd2b3cff69c7588293103f5ed"
        },
        "date": 1661341097308,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23149,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22095,
            "range": "±5.27%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22640,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21069,
            "range": "±7.03%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22610,
            "range": "±5.34%",
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
          "id": "2e9e493eab0e7a83ee7d9751d531dc9d462b4122",
          "message": "Merge pull request #2227 from ethereumjs/big-messy-bunch\n\nTrie: Property Renaming & Visibility / Getter-Setter & Dependency Removals",
          "timestamp": "2022-08-24T14:43:51+02:00",
          "tree_id": "6d0b8ac2138d7d3286a80308cfb71cabb6c19a75",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2e9e493eab0e7a83ee7d9751d531dc9d462b4122"
        },
        "date": 1661345246977,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18672,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17824,
            "range": "±4.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16935,
            "range": "±6.65%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18952,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17906,
            "range": "±2.48%",
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
          "id": "8cc931c031798b7ccb5c927286ea17043db907b5",
          "message": "Remove AsyncEventEmitter extension from EVM and VM (#2235)\n\n* vm/evm: remove event emitter dependency\r\n\r\nfix\r\n\r\n* evm: update interface\r\n\r\n* client: fix tests\r\n\r\n* evm: lint\r\n\r\n* evm: fix tests\r\n\r\n* vm: fix tests\r\nvm: lint\r\n\r\n* vm: remove double type EVMInterface | EVM\r\n\r\n* VM: casting and import cleanup\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-08-25T14:21:15+02:00",
          "tree_id": "5d34654129ab12a67808657bcc754d6d851579ba",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cc931c031798b7ccb5c927286ea17043db907b5"
        },
        "date": 1661430745962,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15086,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15055,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15440,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14252,
            "range": "±8.51%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15698,
            "range": "±2.35%",
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
          "id": "61486de62fd5b581241057162d93ccd6e1ff0577",
          "message": "Add explicit null checks back, throw on undefined (#2228)",
          "timestamp": "2022-08-25T15:05:37+02:00",
          "tree_id": "70642701c70e9cda0c2b5405cd2d6709d9ba37d3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/61486de62fd5b581241057162d93ccd6e1ff0577"
        },
        "date": 1661432904364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17898,
            "range": "±4.13%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18083,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17233,
            "range": "±6.71%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18099,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17535,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "e82ddaf83f129c8770aa95ea9e07aa23a01bc422",
          "message": "docs(trie): update upgrade guide (#2225)\n\n* trie: removed deprecated prove() function (renamed to createProof())\r\n\r\n* trie: added secure option to base trie, integrated secure trie functionality\r\n\r\n* trie: adopted secureTrie.spec.ts tests (5 failing)\r\n\r\n* trie: fixed copy function\r\n\r\n* trie: fixed secureTrie.spec.ts branching test\r\n\r\n* trie: additional test fixes\r\n\r\n* trie: removed secure.ts SecureTrie class definition file\r\n\r\n* trie: updated README\r\n\r\n* trie: removed secure export, unified prepareTrieOpts and expand to CheckpointTrie\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* trie: renamed _secure -> _hashKeys and _hash() -> _hashKeysFunction\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): rename `secure` to `useHashedKeys`\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor(trie): always use `CheckpointDB` as internal database\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* refactor: always support checkpointing\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* docs(trie): update upgrade guide\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update UPGRADING.md\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-08-25T15:08:02+02:00",
          "tree_id": "2effac6380541fb1ce5f47fb8901ea71776fd20d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e82ddaf83f129c8770aa95ea9e07aa23a01bc422"
        },
        "date": 1661433983630,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18668,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18049,
            "range": "±4.04%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17129,
            "range": "±6.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18028,
            "range": "±7.60%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18033,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "193e9e974be30ec4528353fc0cbd87ed9160403a",
          "message": "chore: rename `Semaphore` to `Lock` (#2234)",
          "timestamp": "2022-08-25T16:04:48+02:00",
          "tree_id": "7d130c5f00f8a47d626ca1b375e2a9614997c8b0",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/193e9e974be30ec4528353fc0cbd87ed9160403a"
        },
        "date": 1661436577887,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19612,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18917,
            "range": "±4.21%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18120,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19651,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19002,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "29068d8bd39bab7695657910a8c88fd1e0248b0f",
          "message": "devp2p: rename tests to spec.ts suffix (#2231)\n\n* tx: suffix tests with .spec.ts\r\n\r\n* devp2p: suffix tests with .spec.ts\r\n\r\n* devp2p: remove test index files and adjust test script\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-25T20:43:39-04:00",
          "tree_id": "fa463a40bfa061566f9308a85516881a610a22a8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/29068d8bd39bab7695657910a8c88fd1e0248b0f"
        },
        "date": 1661474834525,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10077,
            "range": "±3.67%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9818,
            "range": "±4.21%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10407,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9716,
            "range": "±6.39%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10563,
            "range": "±3.18%",
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
          "id": "4cf34e72ab22301b3b309b5d7000cd32e7d2626f",
          "message": "client: Fix hardfork issues in beacon sync (#2230)\n\n* client: Fix hardfork issues in beacon sync\r\n\r\n* revert headerdata changes\r\n\r\n* remove extra nextline\r\n\r\n* fix spec hardforks\r\n\r\n* fix skeleton and its specs\r\n\r\n* fix harforkby in uncle opts\r\n\r\n* fix uncle hardfork opts\r\n\r\n* increase coverage\r\n\r\n* add tests to block spec\r\n\r\n* fix the error message\r\n\r\n* add hardforkByChainTTD test\r\n\r\n* remove hardforkByChainTTD option\r\n\r\n* add tests for covering processStoreError",
          "timestamp": "2022-08-26T14:00:32+02:00",
          "tree_id": "a145a35880723648446b581ed6cf7524a753aebc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4cf34e72ab22301b3b309b5d7000cd32e7d2626f"
        },
        "date": 1661515427111,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14829,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14864,
            "range": "±4.17%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14345,
            "range": "±7.35%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15411,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14602,
            "range": "±2.77%",
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
          "id": "8d394cc41c2fac4ab8f85642c53406656d7dd015",
          "message": "Monorepo RC 1 Releases (#2237)\n\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (RLP v4.0.0-rc.1)\r\n\r\n* Minor\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Util v8.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Common v3.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Trie v5.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Tx v4.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Block v4.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Blockchain v6.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Ethash v2.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (StateManager v1.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (Devp2p v5.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (EVM v1.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version, updated upstream dependency versions (VM v6.0.0-rc.1)\r\n\r\n* New CHANGELOG entry, bumped library version (Client v0.6.2)",
          "timestamp": "2022-08-26T15:16:45+02:00",
          "tree_id": "9129511ae257a2ba3a10f68b8f47f5c0a3da4b95",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8d394cc41c2fac4ab8f85642c53406656d7dd015"
        },
        "date": 1661519997308,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10628,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10752,
            "range": "±3.83%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11069,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10854,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10107,
            "range": "±9.08%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "a87f179938d9b22902893dc4d1af0bf4b8b63e76",
          "message": "monorepo: update package lock for rc1 (#2238)",
          "timestamp": "2022-08-26T11:35:25-04:00",
          "tree_id": "66a06fa75174be53de0452844bf54cb55a8d5d77",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a87f179938d9b22902893dc4d1af0bf4b8b63e76"
        },
        "date": 1661528420565,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10355,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10128,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10570,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10285,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9607,
            "range": "±7.05%",
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
          "id": "c70a1585bb0ce3c8ad912189955c468677875d2d",
          "message": "update tests to 11.1 (#2244)",
          "timestamp": "2022-08-27T21:06:44-04:00",
          "tree_id": "59a026b53778c989cdebe7d1991e302cbde443df",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c70a1585bb0ce3c8ad912189955c468677875d2d"
        },
        "date": 1661648969234,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18238,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17801,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16638,
            "range": "±8.11%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18379,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17811,
            "range": "±2.15%",
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
          "id": "de21d490e60999f667733625a49cc72dc23f21b8",
          "message": "evm: add error which triggers if code size deposit exceeds the maximum size (#2239)\n\n* evm: add error which triggers if code size deposit exceeds the maximum size\r\n\r\n* evm: add test comment",
          "timestamp": "2022-08-29T17:11:32+02:00",
          "tree_id": "b3ebc267a7a9f8a6bf7458c0aee8abbadef66bbe",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/de21d490e60999f667733625a49cc72dc23f21b8"
        },
        "date": 1661786106645,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9708,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9587,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9444,
            "range": "±5.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9697,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9628,
            "range": "±2.63%",
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
          "id": "2d60261422437c2353e5b547dbde610494d37c5e",
          "message": "Invalid README examples (#2247)\n\n* Invalid README examples\n\n1. Blockchain cannot be used to initiate an EVM, it is not \"EVMOpts\". \r\n2. \"gasUsed\" is not of type \"ExecResult\"\n\n* Update README.md",
          "timestamp": "2022-08-29T16:43:13-04:00",
          "tree_id": "a75c018e71027241a6ab661a3216a1d9b3caa9ea",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2d60261422437c2353e5b547dbde610494d37c5e"
        },
        "date": 1661805956343,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19365,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18706,
            "range": "±5.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17942,
            "range": "±5.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19472,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18490,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "f06b9212bbc5717530ee03e9b1cff0c13299e9db",
          "message": "trie: remove isTruthy and isFalsy (#2249)",
          "timestamp": "2022-08-30T09:52:42-04:00",
          "tree_id": "9675b6fcc7bd9b4860c758fbd17d770d5476d05c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f06b9212bbc5717530ee03e9b1cff0c13299e9db"
        },
        "date": 1661867755970,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10920,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10413,
            "range": "±5.25%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11147,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11025,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9932,
            "range": "±9.37%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "f39b0b2c826031a3f56b30f154d80c85bebfd611",
          "message": "tx: remove isTruthy and isFalsy (#2250)\n\n* tx: remove isFalsy and isTruthy\r\n\r\n* client: refactor JsonRpcTx type to tx package",
          "timestamp": "2022-08-30T10:40:26-04:00",
          "tree_id": "419b470a35f67777dbf40c2301b68cb14d135781",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f39b0b2c826031a3f56b30f154d80c85bebfd611"
        },
        "date": 1661870999790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19839,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19341,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18401,
            "range": "±6.30%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19822,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19160,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "85 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "39158443+xdrkush@users.noreply.github.com",
            "name": "drkush",
            "username": "xdrkush"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "52d59618df319184f129422904df0cb2f1d4fe8b",
          "message": "Update: README.md -> Graph (#2242)",
          "timestamp": "2022-08-30T17:52:58+02:00",
          "tree_id": "283dca6b3a9b83f3ba890eb00833b0f47b8df049",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/52d59618df319184f129422904df0cb2f1d4fe8b"
        },
        "date": 1661875034658,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19362,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19018,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18430,
            "range": "±4.82%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19113,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19028,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "15790b324582369214e592ba3bdcb6b50f4b852c",
          "message": "vm: remove isTruthy and isFalsy (#2248)",
          "timestamp": "2022-08-30T12:30:50-04:00",
          "tree_id": "aba8c0e948a95c84899d15ce609ce19432c3783d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/15790b324582369214e592ba3bdcb6b50f4b852c"
        },
        "date": 1661877241470,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 9973,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9815,
            "range": "±4.45%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10510,
            "range": "±2.36%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10241,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9867,
            "range": "±7.37%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "2a31b5616c20c3f2ed53468777a03965c1621afc",
          "message": "blockchain: remove isTruthy and isFalsy (#2257)",
          "timestamp": "2022-08-30T13:02:28-04:00",
          "tree_id": "151a95c94691fc77bf007a8b10d804901bfe47f9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2a31b5616c20c3f2ed53468777a03965c1621afc"
        },
        "date": 1661879102402,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19830,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18695,
            "range": "±6.24%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17421,
            "range": "±9.93%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19710,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18905,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "742514acac7fa96c0da65698381435b4d604f515",
          "message": "common: remove isTruthy and isFalsy (#2255)",
          "timestamp": "2022-08-30T13:36:01-04:00",
          "tree_id": "1ebbb533278c53071713cbc05823a6a98606694a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/742514acac7fa96c0da65698381435b4d604f515"
        },
        "date": 1661881119763,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18790,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18313,
            "range": "±4.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17122,
            "range": "±8.22%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18907,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18255,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "f441c8378a95cf35716eb22b1ecc274cbb0f3b55",
          "message": "ethash: remove isTruthy and isFalsy (#2253)",
          "timestamp": "2022-08-30T14:12:22-04:00",
          "tree_id": "5c3049307063729f15f7581bc1a8a04bf1e15f09",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f441c8378a95cf35716eb22b1ecc274cbb0f3b55"
        },
        "date": 1661883471044,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18660,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17943,
            "range": "±5.50%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17399,
            "range": "±6.10%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17825,
            "range": "±6.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18069,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "94646f3d77515293f6b6745e1f71ceb74ad5aea1",
          "message": "stateManager: remove isTruthy and isFalsy (#2251)",
          "timestamp": "2022-08-30T14:43:37-04:00",
          "tree_id": "721dd046eb65e41ef1ccbaa73737f7d010304b47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/94646f3d77515293f6b6745e1f71ceb74ad5aea1"
        },
        "date": 1661885752865,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10219,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10197,
            "range": "±3.63%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10017,
            "range": "±5.24%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10237,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10165,
            "range": "±2.60%",
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
          "id": "1c3e0e6a41eaf0da9567f9e9af2bc4ca5396b825",
          "message": "monorepo: remove receiptRoot inconsistency (#2259)",
          "timestamp": "2022-08-30T15:52:04-04:00",
          "tree_id": "fbbd20f5644fa25dd264165ef8ff54ccd492bb13",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1c3e0e6a41eaf0da9567f9e9af2bc4ca5396b825"
        },
        "date": 1661889487274,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10233,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10147,
            "range": "±3.56%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 10219,
            "range": "±5.23%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11036,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10472,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "fababfef75fc2d0ad3be15510e0461f552b69e86",
          "message": "devp2p: remove isTruthy and isFalsy (#2254)\n\n* devp2p: remove isTruthy and isFalsy\n\n* Update packages/devp2p/src/protocol/les.ts\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-30T19:36:19-04:00",
          "tree_id": "9c1e32aea24ae038eb95ecdf6278c382325c53ea",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fababfef75fc2d0ad3be15510e0461f552b69e86"
        },
        "date": 1661902730346,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19592,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19448,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18844,
            "range": "±5.28%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19182,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18991,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "55ca254077729e7765993f18050edd98d32d8158",
          "message": "evm: remove isTruthy and isFalsy (#2252)\n\n* evm: remove isTruthy and isFalsy\r\n\r\n* evm: undo accidental revert of recent change\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-08-31T10:16:32-04:00",
          "tree_id": "c92f3ea6d01cb1e20a1acc7597f0111a78aa879b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/55ca254077729e7765993f18050edd98d32d8158"
        },
        "date": 1661955622810,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10132,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 9696,
            "range": "±4.86%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 9970,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 9773,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 9851,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "95875500fe6069978e9fb90faae0e0b72be37091",
          "message": "block: remove isTruthy and isFalsy (#2256)",
          "timestamp": "2022-08-31T10:44:32-04:00",
          "tree_id": "05d9bcdb5ec57e62c79a28ac58d4892c3d8150bd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/95875500fe6069978e9fb90faae0e0b72be37091"
        },
        "date": 1661957270750,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 10837,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 10532,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11128,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 10919,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 10203,
            "range": "±7.49%",
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
          "id": "67aca1bf3d29651a68672f9f99a16cfe4741a1d4",
          "message": "client: Update merge instructions (#2246)\n\n* client: Update merge instructions\r\n\r\n* add space\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* improve wording\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-31T14:54:27-04:00",
          "tree_id": "212b6d902b13bf801472fbbbd3f21a56fd69796a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/67aca1bf3d29651a68672f9f99a16cfe4741a1d4"
        },
        "date": 1661972976485,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12723,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11973,
            "range": "±4.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11886,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12262,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11754,
            "range": "±7.34%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "45e47e32aefb32402e65d94bb95496fa3fe4944e",
          "message": "client: remove isTruthy and isFalsy (#2258)\n\n* client: remove isTruthy and isFalsy\r\n\r\n* refactor: JsonRpc types\r\n\r\n* client: add check for 0\r\n\r\n* client: remove duplicate JsonRpcBlock type\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-31T16:07:32-04:00",
          "tree_id": "8fdd196798c23c836eccee4a6a04b17e01b89c52",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/45e47e32aefb32402e65d94bb95496fa3fe4944e"
        },
        "date": 1661976613193,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19000,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18451,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17121,
            "range": "±6.86%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19018,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17940,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
          "id": "1a9da6fc833e1156cfeab556639d3b52e46a9f88",
          "message": "util: remove isTruthy and isFalsy (#2261)",
          "timestamp": "2022-08-31T18:09:58-04:00",
          "tree_id": "93d2b63566320f85bd48892e8fe698251d3dcd57",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1a9da6fc833e1156cfeab556639d3b52e46a9f88"
        },
        "date": 1661983949500,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18880,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18283,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17019,
            "range": "±7.80%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18701,
            "range": "±2.01%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18164,
            "range": "±2.10%",
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
          "id": "ca7089ca5ab1916d52dc34fb7fcf00631ef89c6f",
          "message": "evm: Update examples (#2266)\n\n* evm: fix readme example\r\n\r\n* Update examples script runner\r\n\r\n* Add runCode example from readme\r\n\r\n* Remove non-working browser example\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-09-01T12:48:24+02:00",
          "tree_id": "797c3a74c8103dacff4dd9b68e912ba6758dbbf2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ca7089ca5ab1916d52dc34fb7fcf00631ef89c6f"
        },
        "date": 1662029495294,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15147,
            "range": "±3.84%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14038,
            "range": "±5.78%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14556,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14424,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13181,
            "range": "±9.15%",
            "unit": "ops/sec",
            "extra": "71 samples"
          }
        ]
      }
    ]
  }
}