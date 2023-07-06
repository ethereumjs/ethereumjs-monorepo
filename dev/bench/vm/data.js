window.BENCHMARK_DATA = {
  "lastUpdate": 1688603961296,
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
          "id": "2fd4087ad2aec85580750e4748ce4b3a6a2b32af",
          "message": "genesis: Extract network genesis states into a separate genesis package (#2768)\n\n* genesis: Extract network genesis states into a separate genesis package\r\n\r\nmove the stats json\r\n\r\ngenesis working build\r\n\r\nbuild and working\r\n\r\nlint\r\n\r\ncleanup\r\n\r\nrefactor\r\n\r\nfix build\r\n\r\nadd spec coverage\r\n\r\nfix tests\r\n\r\nenhance coverage\r\n\r\nfix\r\n\r\nadd spec\r\n\r\n* rebase fixes\r\n\r\n* bring test uptodate with new framework\r\n\r\n* fix spec",
          "timestamp": "2023-06-19T10:19:22+02:00",
          "tree_id": "aa04bb43073deaa3ce0728ed335d00d40d56d2db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2fd4087ad2aec85580750e4748ce4b3a6a2b32af"
        },
        "date": 1687163004346,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32399,
            "range": "±5.36%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32433,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28927,
            "range": "±8.33%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31891,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30723,
            "range": "±2.52%",
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
          "id": "3bf46928a9a52133732a0fdd9fb22e65dcf21e4d",
          "message": "Common, Block, VM: Unify and Refactor getHardforkBy Options (#2798)\n\n* Common: getHardforkByBlockNumber() -> getHardforkBy(), adopt tests\n\n* Common: setHardforkByBlockNumber() -> setHardforkBy(), reintroduce BigIntLike\n\n* Fixes\n\n* Fix client test",
          "timestamp": "2023-06-19T10:49:48-04:00",
          "tree_id": "484d02ccacc45c5083cc5ee795de7ed82313395b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3bf46928a9a52133732a0fdd9fb22e65dcf21e4d"
        },
        "date": 1687186435080,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30103,
            "range": "±6.38%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30911,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30058,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25176,
            "range": "±10.46%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29105,
            "range": "±3.37%",
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
          "id": "df8d8d7077eaff7408a6cde510463a4cf3b367e5",
          "message": "Block, VM: Unify hardforkBy Options (#2800)\n\n* Block: hardforkByBlockNumber, hardforkByTTD -> setHardfork option\r\n\r\n* VM: hardforkByBlockNumber, hardforkByTTD -> setHardfork option (constructor and runBlock())\r\n\r\n* Block, VM: adopt hardforkByBlockNumber, hardforkByTTD usages in other libraries\r\n\r\n* blockchain: fix test\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\n\r\n* vm/block: lint\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-20T11:23:14+02:00",
          "tree_id": "f3cb43d5bf8679284f8676f53b8f5bb3ffcf0833",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/df8d8d7077eaff7408a6cde510463a4cf3b367e5"
        },
        "date": 1687253431244,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 34027,
            "range": "±4.53%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31030,
            "range": "±7.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33641,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32768,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 32005,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "d89b9762249c3ba2ea86ff050b83614cedd435b2",
          "message": "Fix npm run test:API script (#2802)",
          "timestamp": "2023-06-20T10:26:30-04:00",
          "tree_id": "6eb04f7268d7d94357aaa1484d14f66ddfa8df14",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d89b9762249c3ba2ea86ff050b83614cedd435b2"
        },
        "date": 1687271841128,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31833,
            "range": "±6.40%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32318,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31953,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31158,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25418,
            "range": "±10.96%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "5bc29db4ea3a3b854ee82c8176689a180c7f0ca1",
          "message": "Add extensions for new `util` file (#2803)",
          "timestamp": "2023-06-21T11:34:10+02:00",
          "tree_id": "40444a6384985b429cb4a0207ae045ff03b5c753",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5bc29db4ea3a3b854ee82c8176689a180c7f0ca1"
        },
        "date": 1687340412090,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32955,
            "range": "±4.79%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32709,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29557,
            "range": "±7.95%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31976,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31104,
            "range": "±2.41%",
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
          "id": "13403c56235f1bae1db26e22586970635479758e",
          "message": "Implement EIP6780: SELFDESTRUCT only in same transaction (v2) (#2771)\n\n* common/vm/evm: add eip6780\r\n\r\n* vm: add test\r\n\r\n* vm/statemanager: buffer->uint8array + lint\r\n\r\n* fix test\r\n\r\n* vm: fix eip6780 tests + lint\r\n\r\n* vm: add 6780 test comment\r\n\r\n* vm: update eip6780 tests to vitest\r\n\r\n* move from object to set\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-06-21T15:04:28+02:00",
          "tree_id": "e0037dbeb366d2844e62e9e264d40e543e6f631a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/13403c56235f1bae1db26e22586970635479758e"
        },
        "date": 1687353066809,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18545,
            "range": "±5.09%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19320,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19109,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18663,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18911,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
          "id": "005595cca658369730fa1015795fe6b626464028",
          "message": "Add json type assertions to ESM post build fixes (#2805)",
          "timestamp": "2023-06-21T16:43:36+02:00",
          "tree_id": "aa1d9e3809ec240a60f4b351fdfe70bc28ecdee3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/005595cca658369730fa1015795fe6b626464028"
        },
        "date": 1687358931009,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18794,
            "range": "±7.37%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19286,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19156,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19476,
            "range": "±3.80%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16789,
            "range": "±11.29%",
            "unit": "ops/sec",
            "extra": "67 samples"
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
          "id": "a37f51faf5d3d9cec4728576723ad7ea61736dab",
          "message": "Monorepo: Update lru-cache dependencies (ESM) / Switch Browser Test Provider (#2804)\n\n* StateManager: update lru-cache from v9 to v10 (seamless)\r\n\r\n* Trie: update lru-cache from v7 to v9, added undefined/null @ts-ignore and comment\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Trie: replace @ts-ignore by any\r\n\r\n* Util: fix browser tests (JSON import update)\r\n\r\n* Monorepo: add browser CI workflow run (temporary or permanent, TBD)\r\n\r\n* Add possibility to skip browser test files, excluding transactionRunner.spec.ts and eip4844.spec.ts for tx\r\n\r\n* Monorepo: update vitest from 0.32.0 -> 0.32.2, switched to playwright browser test provider, removed webdriverio\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Update packages to playwright test provider, updated browser workflow file\r\n\r\n* Add install step for playwright dependencies in ci\r\n\r\n* set isolate flag\r\n\r\n* Exclude account/address as these are failing\r\n\r\n* Add browser comment\r\n\r\n* Remove lint command\r\n\r\n* Remove util from browser tests for now\r\n\r\n* disable util, enable common\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-06-21T14:02:58-04:00",
          "tree_id": "3d978a108e114f34e0accba084343e4854df421b",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a37f51faf5d3d9cec4728576723ad7ea61736dab"
        },
        "date": 1687370891985,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18380,
            "range": "±6.41%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18681,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18278,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18734,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18316,
            "range": "±3.21%",
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
          "id": "2e785fa79d0cca07ebf4654965eec09149561cdc",
          "message": "VM/EVM: move selfdestruct type to set (#2806)\n\n* vm/evm: move selfdestruct type to set\r\n\r\n* evm: selfdestruct updates\r\n\r\n* vm: fix test runner\r\n\r\n* vm: fix setting hardfork correctly",
          "timestamp": "2023-06-22T22:49:02+05:30",
          "tree_id": "54f9e61e2a12b97e68c898bfe5f9accfbf44a955",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2e785fa79d0cca07ebf4654965eec09149561cdc"
        },
        "date": 1687454736641,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32192,
            "range": "±6.16%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32393,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32252,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26572,
            "range": "±10.21%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30761,
            "range": "±3.10%",
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
          "id": "3c1c835d993fdf4d1d538ff6777daa1ad7610d7d",
          "message": "EVM: move KZG precompile (#2811)\n\n* evm: move kzg-precompile, add multiple precompiles at same address support\r\n\r\n* evm: move bls precompiles\r\nevm: cleanup precompile getter\r\n\r\n* Export precompileAvailability from evm/precompiles/index.ts\r\n\r\n* evm: precompiles update export name\r\n\r\n---------\r\n\r\nCo-authored-by: CedarMist <134699267+CedarMist@users.noreply.github.com>",
          "timestamp": "2023-06-22T20:43:21+02:00",
          "tree_id": "086f145185d6672158c3d805ac58c0b1d8554195",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3c1c835d993fdf4d1d538ff6777daa1ad7610d7d"
        },
        "date": 1687460945922,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32378,
            "range": "±6.37%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32691,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29204,
            "range": "±8.26%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31935,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31184,
            "range": "±3.03%",
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
          "id": "e0282e3d02bd5d3fbd1f8ea0a1afe7a2d9440763",
          "message": "Monorepo: More LRU updates and ESM Fixes (#2809)\n\n* GitHub Actions browser workflow file fix\r\n\r\n* Fix yaml file\r\n\r\n* Util: switch to type commonjs for main package.json, skip provider tests, re-add to browser CI run\r\n\r\n* Common: switch to type commonjs in package.json\r\n\r\n* Tx: switch to type commonjs in package.json\r\n\r\n* Trie: switch to type commonjs in package.json, require fixes, skip stream.spec.ts, activate in browser CI workflow\r\n\r\n* Add missing import path\r\n\r\n* Bring back webdriverio for additional browser testing flexibility\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Block: fixes and re-add to browser CI workflow\r\n\r\n* Blockchain: fixes\r\n\r\n* Blockchain: update LRU cache from v7 to v10\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Blockchain: move Consensus interface to types.ts (fixes Blockchain test run so might be something generally quirky and generally can't hurt anyhow)\r\n\r\n* Genesis: require -> import (only temporary, will refactored anyhow, then: no central JSON-distribution-file)\r\n\r\n* Blockchain: reactivate browser test CI workflow\r\n\r\n* Wallet fixes\r\n\r\n* Wallet: update uuid from v8 to v9, require -> import, added @types/uuid\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Wallet: move main source to dedicated file, index.ts -> wallet.ts\r\n\r\n* Wallet: rework Wallet to have its own wallet.ts file and a distributing index.ts file\r\n\r\n* Wallet: add vitest.config.browser.ts, exclude index.spec.ts, add to CI browser test workflow\r\n\r\n* StateManager: switch type to commonjs in package.json, add vitest.config.browser.ts file, exlude two failing test files, activate CI browser test workflow\r\n\r\n* Util: test other browser test provider and browser in CI\r\n\r\n* Do not cancel browser workflow in progress to see all results\r\n\r\n* Partially switch back to (default) webdriverio provider, remove fail-fast from browser CI workflow, other fixes\r\n\r\n* Update crc dep\r\n\r\n* Remove sed from tsbuild\r\n\r\n* Trie: remove src/trie subfolder\r\n\r\n* Trie: adopt paths to new structure\r\n\r\n* Fix trie export\r\n\r\n* Switch genesisStates to js and migrate tape to vitest\r\n\r\n* Merge remote-tracking branch 'origin/master' into more-lru-updates-and-esm-fixes\r\n\r\n* fix trie test again\r\n\r\n* Remove broken karma test run\r\n\r\n* Remove karma tsconfig\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-22T16:01:17-04:00",
          "tree_id": "d994478459671f3841f8e31c89618978b4697679",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e0282e3d02bd5d3fbd1f8ea0a1afe7a2d9440763"
        },
        "date": 1687466367470,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32454,
            "range": "±5.58%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32932,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32323,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27252,
            "range": "±9.54%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31198,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "91f7c9d4986c9214a201976f18e2e84d6bc479e1",
          "message": "Genesis cleanup (#2815)\n\n* Cleanup genesis imports/types\r\n\r\n* ts config cleanup",
          "timestamp": "2023-06-23T09:54:25+02:00",
          "tree_id": "31f0feee9b5b506610e124d984005783b40b7b6c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/91f7c9d4986c9214a201976f18e2e84d6bc479e1"
        },
        "date": 1687507151479,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26959,
            "range": "±8.03%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27398,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27459,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26670,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24573,
            "range": "±8.61%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "distinct": false,
          "id": "c51d81ee8b0d500677fc9492430ae05170dd3960",
          "message": "tx: simplify validate methods (#2792)\n\n* tx: remove validate method and add isValid and getValidationErrors\r\n\r\n* tx: update usage of validate()\r\n\r\n* vm: update usage of tx.validate()\r\n\r\n* block: update usage of tx.validate() and unify validation method naming pattern\r\n\r\n* devp2p: update usage of validation methods\r\n\r\n* block: add missing await\r\n\r\n* block: fix tests\r\n\r\n* tx: split getMessageToSign into two methods\r\n\r\n* tx: split getMessageToSign into two methods\r\n\r\n* tx: update tx tests\r\n\r\n* tx: update docs\r\n\r\n* tx: refactor isValid logic\r\n\r\n* block: refactor transactionsAreValid logic\r\n\r\n* client: fix test\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-06-23T10:28:26+02:00",
          "tree_id": "b615c8d5f4bb70ec3bd2cd4dd9ab26aca489f67f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c51d81ee8b0d500677fc9492430ae05170dd3960"
        },
        "date": 1687509161694,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32232,
            "range": "±4.88%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32353,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31945,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26540,
            "range": "±10.90%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30277,
            "range": "±3.08%",
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
          "id": "d3055ae2c410b270d94792193f41b20afc730b41",
          "message": "Implement EIP5656 MCOPY (#2808)\n\n* common/evm: implement EIP5656 MCOPY\r\n\r\n* evm: add tests 5656\r\n\r\n* evm: add comment 5656 tests\r\n\r\n* evm: update correct 5656 gas\r\n\r\n* evm: lint\r\n\r\n* evm: fix test",
          "timestamp": "2023-06-25T19:39:46+02:00",
          "tree_id": "d320a80a18838c8deb625f4d5f3f5667c77585d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d3055ae2c410b270d94792193f41b20afc730b41"
        },
        "date": 1687715033101,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32301,
            "range": "±5.49%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32921,
            "range": "±2.77%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32272,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32168,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25513,
            "range": "±11.43%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "dfe77efa69b764fbf15f866bd01f668e9c4d01d3",
          "message": "Add tests for asyncEventEmitter (#2819)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-06-26T14:43:16+02:00",
          "tree_id": "3b647a192460a52604ad70ccf25b3317b834db13",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/dfe77efa69b764fbf15f866bd01f668e9c4d01d3"
        },
        "date": 1687783644706,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32614,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32596,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31859,
            "range": "±4.46%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24385,
            "range": "±14.30%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30185,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "9f46c956efbe243e06029a42e3f0a0df69bbc672",
          "message": "client: fix getStorageAt (#2825)",
          "timestamp": "2023-06-26T16:16:38-04:00",
          "tree_id": "1ede0db08d3160ce9d4971a2b4489d84e549461a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9f46c956efbe243e06029a42e3f0a0df69bbc672"
        },
        "date": 1687810848250,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32005,
            "range": "±6.60%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32073,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32330,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26585,
            "range": "±9.40%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31007,
            "range": "±3.13%",
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
          "id": "36aea11f381965b58174d40a35b2a0e042d81c04",
          "message": "update package: add @types/estree (#2836)",
          "timestamp": "2023-06-28T14:30:37-04:00",
          "tree_id": "4fac4f272beb7726526e106449867c08f641c67c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/36aea11f381965b58174d40a35b2a0e042d81c04"
        },
        "date": 1687977313758,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33601,
            "range": "±5.12%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33640,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33620,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31805,
            "range": "±4.60%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27706,
            "range": "±8.86%",
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
          "id": "71911d4bc5a011a4c396572259213d106b6a2008",
          "message": "Monorepo: Add Browser Examples (#2835)\n\n* Add browser example (RLP)\r\n\r\n* Add browser example (Util)\r\n\r\n* Align RLP example along Vite browser example\r\n\r\n* Add Common browser example\r\n\r\n* Add tx browser example\r\n\r\n* Add Trie browser example\r\n\r\n* Add Block browser example\r\n\r\n* Add Blockchain browser example\r\n\r\n* StateManager: further guard DEBUG check to fix vite browser bundling\r\n\r\n* Add StateManager browser example\r\n\r\n* More compact ordered lists in example files\r\n\r\n* Add Wallet browser example\r\n\r\n* EVM: remove promisify usage (Node.js primitive)\r\n\r\n* Minor\r\n\r\n* EVM: additional DEBUG check guard to prevent Vite bundling (and potentially others) from breaking\r\n\r\n* Add EVM browser example (not yet working)\r\n\r\n* Add async `emit` back sans util.promisify\r\n\r\n* Switch vm to non-promisify _emit\r\n\r\n* lint\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: acolytec3 <konjou@gmail.com>",
          "timestamp": "2023-06-28T15:40:34-04:00",
          "tree_id": "f3782e43b12a964560c67c1ca32638a643236919",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/71911d4bc5a011a4c396572259213d106b6a2008"
        },
        "date": 1687981489643,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31819,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32142,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27527,
            "range": "±10.32%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31768,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30343,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "e7e201d5569a807d164bc3df35f0a3163b9c504f",
          "message": "Replace `rustbn.js` with wasm-compiled `rustbn.wasm` module (#2834)\n\n* Proof of concept integration with rustbn wasm\r\n\r\n* needed fixes\r\n\r\n* Switch module to node16\r\n\r\n* turn on esmodule interop in client\r\n\r\n* Fix namespace import\r\n\r\n* Remove rustbn.ts code\r\n\r\n* clean up evm config\r\n\r\n* rename vitest config\r\n\r\n* Remove dep and fix events import\r\n\r\n* Fix browser tests npm script\r\n\r\n* remove old comment\r\n\r\n* Update dependency to point to ethjs repo\r\n\r\n* EVM: update EC precompile dependency to official newly published rustbn.wasm package\r\n\r\n* Rebuild package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-06-29T12:16:25+02:00",
          "tree_id": "0ef52c3cc8f84b972faec0a504b4d5163f24be43",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e7e201d5569a807d164bc3df35f0a3163b9c504f"
        },
        "date": 1688034571296,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33438,
            "range": "±4.70%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33560,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33334,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27943,
            "range": "±10.73%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31312,
            "range": "±2.54%",
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
          "id": "ecce06bc820fab2240e6efa0ef14f7b1f9d8e64e",
          "message": "Common, Other: Remove deprecated Ropsten and Rinkeby networks (#2813)\n\n* Remove ropstein from code\r\n\r\n* Update tests\r\n\r\n* Fix tests\r\n\r\n* Remove rinkeby from code\r\n\r\n* Update tests\r\n\r\n* Fix test\r\n\r\n* Fix linting error\r\n\r\n* Fix linting error\r\n\r\n* Fix genesis index.ts\r\n\r\n* Fix linting issue\r\n\r\n* Fix test\r\n\r\n* Update examples to remove Rinkeby\r\n\r\n* Update examples to remove Ropsten\r\n\r\n* Remove genesis state files for Ropsten and Rinkeby\r\n\r\n* Fix example\r\n\r\n* Remove ropsten from docs\r\n\r\n* Remove rinkeby from docs\r\n\r\n* Remove ropsten and rinkeby import symbols from package.json\r\n\r\n* Remove commented code\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test for custom chain\r\n\r\n* Reintroduce removed ropsten test for mainnet\r\n\r\n* Reintroduce removed ropsten test\r\n\r\n* Reintroduce removed ropsten test for custom chain\r\n\r\n* Reintroduce ropsten tests\r\n\r\n* Fix test\r\n\r\n* Fix tests\r\n\r\n* Clean up naming and comments\r\n\r\n* Use goerli for hardfork mismatch test\r\n\r\n* fix the miner spec\r\n\r\n* fix pending block spec\r\n\r\n* fix other client errors\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-06-29T12:57:07+02:00",
          "tree_id": "66defcda16ee68bb4b7800c2b95bdb410eb2bb6e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ecce06bc820fab2240e6efa0ef14f7b1f9d8e64e"
        },
        "date": 1688036438431,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32288,
            "range": "±5.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29397,
            "range": "±8.76%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 32497,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 31999,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30955,
            "range": "±3.08%",
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
          "id": "9fbc8b08f3ffc52b6381b690409564b6392e50b8",
          "message": "update node-versions (#2839)",
          "timestamp": "2023-06-29T13:37:26+02:00",
          "tree_id": "5659cc0b6c80b075acb8be06096fd322cf58988f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9fbc8b08f3ffc52b6381b690409564b6392e50b8"
        },
        "date": 1688039029071,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28634,
            "range": "±5.92%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28537,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29205,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25363,
            "range": "±10.72%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23098,
            "range": "±13.55%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "9132b40326493c44aca33c7fcfb0ad86efa450d5",
          "message": "VM Browser Example and Various Browser Compatibility Fixes (#2840)\n\n* EVM: update EC precompile dependency to new package name rustbn.wasm -> rustbn-wasm\n\n* Rebuild package-lock.json\n\n* Activate EVM CI browser test run\n\n* EVM: add dedicated vite.config.ts to avoid have to run npx vite pointing to browser config\n\n* VM/EVM: another vite.config.ts, exlude from linting\n\n* VM: guard DEBUG property setting to fix Vite breaking\n\n* EVM: update mcl-wasm import from require -> import\n\n* VM: add browser example\n\n* Make mcl namespace import\n\n---------\n\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-06-29T11:34:53-04:00",
          "tree_id": "4d369b022d2575607f4a45d739e9d5e7b9d6816a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9132b40326493c44aca33c7fcfb0ad86efa450d5"
        },
        "date": 1688053295862,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31328,
            "range": "±5.35%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31639,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31399,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25708,
            "range": "±11.32%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30528,
            "range": "±3.31%",
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
          "id": "499c49677bb6994df13a2642e4d04403f77bf42d",
          "message": "Revert default to namespace imports (#2842)\n\n* Revert default to namespace imports\r\n\r\n* Adjust debug import syntax to make ESM happy\r\n\r\n* Revert esModuleInterop changes\r\n\r\n* fix qheap import and typing\r\n\r\n* Revert more default to namespace imports\r\n\r\n* fix json imports\r\n\r\n* More namespace import fixes\r\n\r\n* Update cli test in workflow\r\n\r\n* fix kzg import\r\n\r\n* fix more json imports\r\n\r\n* Fix last tests\r\n\r\n* Fix test imports",
          "timestamp": "2023-06-30T20:56:18+02:00",
          "tree_id": "bc6e92371c30e22b7af43428218f61e9ea3dd9ed",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/499c49677bb6994df13a2642e4d04403f77bf42d"
        },
        "date": 1688151586648,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33587,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33290,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29407,
            "range": "±7.95%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 32296,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30932,
            "range": "±2.70%",
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
          "id": "49cf0845b5234f4c8483c58ff6aeeb6bf7155ccf",
          "message": "Common: Fix genesis parsing for 4844 (#2847)\n\n* fix for genesis mismatch\r\n\r\n* fix for genesis mismatch\r\n\r\n* blockchain: remove unnecessary genesis field\r\n\r\n---------\r\n\r\nCo-authored-by: spencer-tb <spencer@spencertaylorbrown.uk>",
          "timestamp": "2023-07-03T12:01:55+02:00",
          "tree_id": "df91ed54f91f43da6a16b4ceb1dcdbc730fef69f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/49cf0845b5234f4c8483c58ff6aeeb6bf7155ccf"
        },
        "date": 1688378761023,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32282,
            "range": "±4.77%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31942,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31934,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26421,
            "range": "±10.56%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30605,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "84 samples"
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
          "id": "629c80f42d84f76ec96186b06f3dabd2caa352fa",
          "message": "VM/SM/Blockchain/Trie/EVM: Copy() -> shallowCopy() function renaming (#2826)\n\n* Rename vm copy function to shallowCopy\r\n\r\n* Rename StateManager copy function to shallowCopy\r\n\r\n* Rename evm copy function to shallowCopy\r\n\r\n* Rename Blockchain copy function to shallowCopy\r\n\r\n* Fix interface copy function naming\r\n\r\n* Rename Trie copy function to shallowCopy\r\n\r\n* Fix tests\r\n\r\n* Fix tests\r\n\r\n* Fix test\r\n\r\n* Update mocked objects in tests to reflect naming change\r\n\r\n* Fix test\r\n\r\n* Update examples and recipes to reflect naming changes\r\n\r\n* Fix tests\r\n\r\n* Update documentation to reflect naming changes\r\n\r\n* Update benchmarks and tests\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-07-03T13:09:25+02:00",
          "tree_id": "2f1df6dbd0d96b9e45a954301ad853ee68af557d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/629c80f42d84f76ec96186b06f3dabd2caa352fa"
        },
        "date": 1688382784302,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 32186,
            "range": "±5.50%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32182,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31939,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25988,
            "range": "±11.24%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30742,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "d7131f555e3332955e5fab45cb9036f5b7fdb5b4",
          "message": "Update function docs to detail shallow copy behavior (#2855)",
          "timestamp": "2023-07-04T15:44:15+02:00",
          "tree_id": "e96ec5e98b72cbc58aaa2c4bf433e54551d725f4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d7131f555e3332955e5fab45cb9036f5b7fdb5b4"
        },
        "date": 1688478466025,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 33924,
            "range": "±4.69%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 33799,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 33266,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28587,
            "range": "±8.85%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 31723,
            "range": "±2.50%",
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
          "id": "5f8552fedb45314bc4594d0978e64ff44abb835c",
          "message": "Monorepo: make _* methods protected / _common -> common (#2857)\n\n* Common: switch to a separated EventEmitter structure (API cleanliness)\r\n\r\n* EVM: added additional shallowCopy() test for event emitter functionality\r\n\r\n* Test fixes\r\n\r\n* Common: _* methods/properties -> protected\r\n\r\n* Common: make getInitializedChains() public\r\n\r\n* Tx: _* methods/properties -> protected\r\n\r\n* Block: _* methods/properties -> protected\r\n\r\n* Block: _common -> common\r\n\r\n* Small fix\r\n\r\n* Blockchain: _common -> common\r\n\r\n* EVM/VM: _common -> common\r\n\r\n* Client: _common -> common\r\n\r\n* Lint fixes\r\n\r\n* Client test fixes\r\n\r\n* Trie: _* methods/properties -> protected\r\n\r\n* StateManager: _* methods/properties -> protected\r\n\r\n* EVM: _* methods/properties -> protected",
          "timestamp": "2023-07-04T17:17:31+02:00",
          "tree_id": "5a562e8d13d31aa72ffd747a6ebae0e20a927606",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5f8552fedb45314bc4594d0978e64ff44abb835c"
        },
        "date": 1688484086205,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31781,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 32122,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31764,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26578,
            "range": "±10.02%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30343,
            "range": "±3.19%",
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
          "id": "ef133de3c1de045b55abe0b441d74eb901e39227",
          "message": "monorepo/Util: deprecate node 16 / remove Node.js fetch primitive (#2859)\n\n* util: remove https usage\r\n\r\n* monorepo: update engine to node >=18\r\n\r\n* ci: update to node 18\r\n\r\n* monorepo: update monorepo and libp2pbrowser node version\r\n\r\n* monorepo: update @types/node\r\n\r\n* util: remove fetch check from test",
          "timestamp": "2023-07-05T10:29:09+02:00",
          "tree_id": "6bc830a8f201ba912300de9c74a96fcd4b35d001",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ef133de3c1de045b55abe0b441d74eb901e39227"
        },
        "date": 1688546523426,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21614,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21076,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19072,
            "range": "±9.90%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20959,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19682,
            "range": "±3.65%",
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
          "id": "79761c10225c03e6d52517289c87baca45ab99e6",
          "message": "blockchain: remove genesis state dependancy from blockchain (#2844)\n\n* blockchain: remove genesis state dependancy from blockchain\r\n\r\nfix the blockchain init and statepassing from client\r\n\r\npass custom genesis from client's chain to blockchain\r\n\r\nsimplify stateroot fetch\r\n\r\nremove need to genesis state in blockchain\r\n\r\nremove package dependancy\r\n\r\nrebase fixes\r\n\r\nlint\r\n\r\nfix statemanager spec\r\n\r\nfix vm spec\r\n\r\nfix client spec\r\n\r\nfix client spec\r\n\r\n* lint\r\n\r\n* address genesisstate in test helper\r\n\r\n* fix client spec\r\n\r\n* add as a dev dependancy in trie for tests\r\n\r\n* cleanup genesis state references in client and add some comments\r\n\r\n* further cleanup genesis state passing\r\n\r\n* improve jsdocs\r\n\r\n* fix jsdocs\r\n\r\n* fix client sim runner",
          "timestamp": "2023-07-05T13:43:30+02:00",
          "tree_id": "731d22d29ff370032d20741d98111156a5678f46",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79761c10225c03e6d52517289c87baca45ab99e6"
        },
        "date": 1688558470462,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31468,
            "range": "±4.48%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30817,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31045,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26237,
            "range": "±9.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29432,
            "range": "±3.25%",
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
          "id": "11f48f3182a228725210f46c04702755db792349",
          "message": "monorepo: fix tsc errors (#2864)",
          "timestamp": "2023-07-05T20:35:46-04:00",
          "tree_id": "8794aef70e860aa0f7dde6829107845301269e3e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11f48f3182a228725210f46c04702755db792349"
        },
        "date": 1688603960176,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31235,
            "range": "±4.79%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 31177,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30909,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 26491,
            "range": "±9.59%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 29667,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      }
    ]
  }
}