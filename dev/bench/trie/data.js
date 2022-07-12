window.BENCHMARK_DATA = {
  "lastUpdate": 1657626049442,
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
          "id": "aff80c48d80f52352eb704e9d981eb1976a5149f",
          "message": "client: Miscellaneous fixes for beacon sync in reverseblockfetcher, skeleton, merge forkhash  (#1951)\n\n* Fix fetcher first,count tracking for reverseblockfetcher\r\n\r\n* some canonical fill logging improvs\r\n\r\n* set forkhash for merge as well\r\n\r\n* reverse block fetcher specs coverage enhancement\r\n\r\n* rename to numBlocksInserted for better clarity",
          "timestamp": "2022-06-15T01:39:54+05:30",
          "tree_id": "0e3cd8251a3be152d16f014784273151d3170b13",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/aff80c48d80f52352eb704e9d981eb1976a5149f"
        },
        "date": 1655237687966,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30776,
            "range": "±4.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 28026,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30699,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 30304,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 50244,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 948,
            "range": "±6.69%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 113,
            "range": "±71.42%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 97.75,
            "range": "±5.59%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 9.73,
            "range": "±98.24%",
            "unit": "ops/sec",
            "extra": "20 samples"
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
          "id": "d066bd387e372645edb04cc2897b27db59c36e65",
          "message": "Evm refactor (rebased on master a4c379a, 2022-06-13) (#1955)\n\n* vm: rename vmstate/eei\r\n\r\nvm: move eei/vmstate into new EEI dir\r\n\r\n* evm: setup type skeleton\r\n\r\n* vm/evm: update types\r\n\r\n* vm/eei: extra types\r\n\r\n* vm: extract EEI from EVM\r\n\r\n* vm: move types to correct place\r\n\r\nvm: fixes\r\n\r\n* vm: preliminary VmState removal\r\n\r\n* vm: add env to interpreter + extract getAddress from EEI\r\n\r\n* vm: extract getSelfBalance from EEI\r\n\r\n* vm: extract CallData* from EEI\r\n\r\n* vm: remove getCaller, getCodeSize, getCode, isStatic from EEI\r\n\r\n* vm: remove Tx-related methods from EEI\r\n\r\n* vm: remove block-related methods from EEI\r\n\r\n* vm: remove getChainId from EEI\r\n\r\n* vm: extract all call/selfdestruct/log-related logic from EEI\r\n\r\n* vm: extract environment from EEI\r\n\r\n* vm: remove evm/gasleft from EEI\r\n\r\n* vm: remove EIFactory. EVM now has singleton EEI\r\n\r\nvm: add comment\r\n\r\n* vm: add custom EEI/EVM options\r\n\r\n* vm: evm/eei/vm: rename certain properties, remove vmstate dependency\r\n\r\n* comment fix\r\n\r\n* vm/evm: ensure exp dynamic gas calculated in gas.ts not functions.ts\r\n\r\n* vm/evm: remove unnecessary item in Env\r\n\r\n* vm/interpreter: all state access via eei.state\r\n\r\n* vm/evm: remove gasRefund property and put this in runState\r\n\r\nvm: fix gas refunds on CREATE opcdoes\r\n\r\n* vm/evm: move `auth` from `_Env` to `RunState`\r\n\r\n* vm/evm: move return buffer into runstate\r\n\r\n* vm/evm: fix gas refunds\r\n\r\nvm/evm: fix gasRefund\r\n\r\n* vm/evm: move gasLeft as property of Interpreter into RunState\r\n\r\n* vm/evm: add AsyncEventEmitter type\r\nvm/evm: fixup TransientStorage/EEI creation\r\n\r\n* evm/interpreter: better type safety\r\n\r\n* client: fix build\r\n\r\n* evm: fix build\r\n\r\n* eei/evm: define EEI interface\r\n\r\n* evm/vm: use EEI Interface\r\n\r\n* evm/vm: add EVM interface and use this\r\n\r\n* vm: fix build\r\n\r\n* evm/eei: move transientStorage into EVM\r\n\r\n* evm: type cleanup\r\n\r\n* vm: ensure tests run (but fail)\r\n\r\n* VM -> API tests: fixed build\r\n\r\n* vm/tx: gasRefund always available\r\n\r\n* vm/tests: fix tests\r\n\r\n* vm: rename gas properties\r\n\r\n* client: fix build\r\n\r\n* vm: review and remove some TODOs\r\n\r\n* client: fix test builds\r\n\r\n* client: fix tests\r\n\r\n* vm/tests: remove transientstorage test\r\n\r\n* evm/eei: add copy methods\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-06-15T21:11:28+02:00",
          "tree_id": "877a063f1342f80668021ec04b62def987fca15e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d066bd387e372645edb04cc2897b27db59c36e65"
        },
        "date": 1655320578019,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30987,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 29045,
            "range": "±6.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30867,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 30442,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 51460,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 981,
            "range": "±5.41%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 146,
            "range": "±44.46%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 92.62,
            "range": "±15.86%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.79,
            "range": "±57.03%",
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
          "id": "c4d7682bcf46690c193bbc7be21ead6334569959",
          "message": "Disable client browser tests in Node nightly CI jobs (#1963)\n\n* Switch node nightly to run client unit tests\r\n\r\n* Set polyfill for async_hooks to stop webpack complaining\r\n\r\n* Add note about unsupported browser builds\r\n\r\n* have nightly run on branch pushes\r\n\r\n* Set supported node versions to 14, 16, 18\r\n\r\n* Have all node nightly tests run on 14 and above\r\n\r\n* Change client/devp2p to run on Node 14+\r\n\r\n* Fix typos\r\n\r\n* Remove push on branch from nightlys",
          "timestamp": "2022-06-16T12:39:20+02:00",
          "tree_id": "b2f7b598cba1181a8a8bcbf67e16b191a5f535bb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c4d7682bcf46690c193bbc7be21ead6334569959"
        },
        "date": 1655376282036,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27736,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25627,
            "range": "±8.61%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26848,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26546,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 46343,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 886,
            "range": "±6.22%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 109,
            "range": "±70.31%",
            "unit": "ops/sec",
            "extra": "38 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 93.8,
            "range": "±5.38%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.12,
            "range": "±76.40%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "2bd7ae6f62f8b063b3d271b38341ec9688554008",
          "message": "VM/Client: fix tests (#1969)\n\n* vm: remove accidentally added file\r\n\r\n* client: lint fixes\r\n\r\n* vm: fix vm.copy\r\n\r\n* vm: fix benchmarks\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-16T20:34:15+02:00",
          "tree_id": "2ec319b88acd6343e9440419d55f721cbce87f4e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2bd7ae6f62f8b063b3d271b38341ec9688554008"
        },
        "date": 1655404749221,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 34547,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 31996,
            "range": "±7.10%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 34215,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 33542,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52515,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 690,
            "range": "±50.15%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 185,
            "range": "±10.87%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.34,
            "range": "±20.16%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.71,
            "range": "±69.85%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "ddee04d6dd53377c879b61c7e4702a29ffb705fb",
          "message": "Devp2p-ethereum-cryptography-dependency (#1947)\n\n* devp2p: import ethereum-cryptography package\r\n\r\n* devp2p: update utils to use ethereum-cryptography\r\n\r\n* devp2p: update src components to use ethereum-cryptography\r\n\r\n* devp2p: update tests to use ethereum-cryptography\r\n\r\n* devp2p: remove secp256k1 dependency\r\n\r\n* Rebase on master\r\n\r\n* devp2p: replace 'hi-base32' dependency with '@scure/base'\r\n\r\n* devp2p: delete unused import\r\n\r\n* devp2p: replace `keccak` use with `@noble/hashes`\r\n\r\n* devp2p: replace base64url dependency with base64url from '@scure/base'\r\n\r\n* devp2p: use publicKeyConvert instead of getPublicKey\r\n\r\n* devp2p: use exported keccak256.create() from ethereum-cryptography\r\ndefine Hash type based on return type\r\n\r\n* devp2p: update ethereum-cryptography dependency to 1.1.0\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-18T03:21:24-06:00",
          "tree_id": "07cc5880d00e0e40e12d1333ce3d60a4d99390a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ddee04d6dd53377c879b61c7e4702a29ffb705fb"
        },
        "date": 1655544403690,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33105,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 29860,
            "range": "±7.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32885,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32380,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52813,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 730,
            "range": "±52.39%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±9.99%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 91.83,
            "range": "±20.49%",
            "unit": "ops/sec",
            "extra": "54 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.28,
            "range": "±11.36%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "71265541e5011d42e75e5bd0344ad1087e6a2d71",
          "message": "Trie (chore): reorganise files by technical domains (#1972)\n\n* chore(trie): reorganise files by technical domains\r\n\r\n* refactor(trie): break down `trie/node` into smaller files and renaming\r\n\r\n* chore(trie): install `@types/readable-stream` types",
          "timestamp": "2022-06-20T14:26:59+02:00",
          "tree_id": "9326c7b7ffb7d117cba3916f098c5b60c2018608",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/71265541e5011d42e75e5bd0344ad1087e6a2d71"
        },
        "date": 1655728333767,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33049,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30879,
            "range": "±7.01%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32390,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32062,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53284,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 776,
            "range": "±40.66%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 187,
            "range": "±9.36%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 91.17,
            "range": "±15.79%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.64,
            "range": "±58.26%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "252e283182f52caba166abcb767e563ea7458d7f",
          "message": "evm - Extract evm from vm as standalone package (#1974)\n\n* Extract evm from vm as standalone package\r\n\r\n* evm build\r\n\r\n* Build fixes\r\n\r\n* fix client build\r\n\r\n* move run tx spec back to vm\r\n\r\n* evm: update changelog\r\n\r\n* vm: fix state tests runner\r\n\r\n* vm: ensure tests run\r\n\r\n* evm: fix tests\r\n\r\n* client: fix tests\r\n\r\n* Remove extra test scripts\r\n\r\n* lint fix for vm\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-06-21T12:41:03+02:00",
          "tree_id": "6ba6c0d87788bcc8d05febc61f67ded9be18ad4d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/252e283182f52caba166abcb767e563ea7458d7f"
        },
        "date": 1655808643814,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24644,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 22379,
            "range": "±9.49%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 24563,
            "range": "±7.90%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 25221,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 41618,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 734,
            "range": "±8.11%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±66.26%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 69.02,
            "range": "±14.44%",
            "unit": "ops/sec",
            "extra": "52 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.71,
            "range": "±28.74%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "c5fb3169c004beca1de1340ebebb8838062dfb03",
          "message": " Monorepo: Remove esModuleInterop and allowSyntheticDefaultImports Options (cherry-picked) (#1975)\n\n* Monorepo: set esModuleInterop TS compiler option to false\r\n\r\n* client: change `import X` to `import * as X`\r\n\r\n* client: replace qheap with js-priority-queue\r\n\r\n* blockchain: change to import *\r\n\r\n* blockchain/tests: change to import *\r\n\r\n* block/test: change to import *\r\n\r\n* common: change to import *\r\n\r\n* common/tests: change to import *\r\n\r\n* devp2p: change imports to import * or require()\r\n\r\n* ethash/tests: change import tape to import * as\r\n\r\n* rlp/tests: change imports to import *\r\n\r\n* statemanager/test: change imports to import * as\r\n\r\n* trie/tests: change imports to import *\r\n\r\n* ts/tests: change imports to import *\r\n\r\n* util/tests: change imports to import *\r\n\r\n* vm: change json import to import *\r\n\r\n* vm/tests: change imports to import *\r\n\r\n* client/test: change imports to import *\r\n\r\n* vm/tests: fix API test imports\r\n\r\n* trie/benchmarks: fix benchmark test import\r\n\r\n* client: fix qheap import problem\r\n\r\n* Devp2p, EVM: fixed tests\r\n\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>",
          "timestamp": "2022-06-21T14:40:00+02:00",
          "tree_id": "05b40da563ff574d001fa8146b2cbbd9ec520835",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5fb3169c004beca1de1340ebebb8838062dfb03"
        },
        "date": 1655815811448,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33141,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 31374,
            "range": "±5.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32821,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32471,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54234,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 784,
            "range": "±45.08%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 203,
            "range": "±8.36%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 72.44,
            "range": "±50.31%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 20.81,
            "range": "±4.65%",
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
          "id": "1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040",
          "message": "Block validation methods, take 3 (#1959)\n\n* rename _validateHeaderFields\r\n\r\n* Move static consensus checks\r\n\r\n* block: fix header consensus validation tests\r\n\r\n* Move header.validate to blockhain\r\n\r\n* blockchain: fix tests related to headerValidate\r\n\r\n* move validateDifficulty to blockchain\r\n\r\n* block: fix difficulty tests\r\n\r\n* move blockchain dependendent validateUncle checks\r\n\r\n* block: fix `cliqueSigner` for default blocks\r\n\r\n* block: fix block tests\r\n\r\n* move blockchain dependent tests to blockchain\r\n\r\n* replace block.validate\r\n\r\n* Fix package build issues\r\n\r\n* ethash: fix test on invalidPOW\r\n\r\n* Move format level EIP1559 checks back to block\r\n\r\n* Fix EIP1559 tests, make validateGasLimit throw\r\n\r\n* blockchain: fix build issue\r\n\r\n* finish test fixes\r\n\r\n* various test fixes\r\n\r\n* vm: runTx fix\r\n\r\n* Add fix for kovan in genesis block\r\n\r\n* vm: last test fix\r\n\r\n* client: fix tests\r\n\r\n* client: miner and skeleton fixes\r\n\r\n* client: fix chainID test\r\n\r\n* client: fix skeleton tests\r\n\r\n* client: fix forkChoiceUpdate test\r\n\r\n* client: fix pendingBlock tests\r\n\r\n* new payload client instantiation fix plus lint cleanup\r\n\r\n* fix beaconsync integration spec\r\n\r\n* vm: fix examples\r\n\r\n* address feedback\r\n\r\n* test and parentheses fixes\r\n\r\n* test fixes\r\n\r\n* Remove unused clique check\r\n\r\n* Fix skeleton, again\r\n\r\n* fix skeleton, fix again\r\n\r\n* various client test fixes\r\n\r\n* clean up commented stubs\r\n\r\n* remove lint rule\r\n\r\n* client: fix integration test\r\n\r\n* blockchain: rename validation method\r\n\r\n* Update imports, fix qheap\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-21T18:09:39+02:00",
          "tree_id": "8b3ce968451effad1da644d499f4fe6aa1d26487",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040"
        },
        "date": 1655828424532,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 25956,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 23640,
            "range": "±9.23%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 26111,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 25362,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 41300,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 727,
            "range": "±6.92%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±64.03%",
            "unit": "ops/sec",
            "extra": "49 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 74.57,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.94,
            "range": "±19.80%",
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
          "id": "008c4691a3a0fe598eb82fb98835148296af9a1e",
          "message": "Blockchain file reorganization (#1986)\n\n* Move index to blockchain\r\n\r\n* Reorganize exports\r\n\r\n* blockchain: move types to types.ts\r\n\r\n* block: make _errorMsg protected",
          "timestamp": "2022-06-22T20:01:39+02:00",
          "tree_id": "74f41cbbc043cf10127368cfdc7350d73b106e6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/008c4691a3a0fe598eb82fb98835148296af9a1e"
        },
        "date": 1655921238946,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 26806,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24539,
            "range": "±10.49%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27000,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26415,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 44551,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 830,
            "range": "±7.49%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±64.95%",
            "unit": "ops/sec",
            "extra": "43 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 85.35,
            "range": "±6.05%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.52,
            "range": "±23.57%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "74d5937b115d419a7d3fd697bc9c321355204a33",
          "message": "Remove explicit browser builds as monorepo builds already target es2020 (#1985)\n\n* Remove explicity browser builds as monorepo builds\r\n\r\n* remove browser key from package.json except client",
          "timestamp": "2022-06-22T20:34:22+02:00",
          "tree_id": "4b99bdcca5166da67c9a1e243ad4c53604b6a270",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/74d5937b115d419a7d3fd697bc9c321355204a33"
        },
        "date": 1655923105025,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27558,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24935,
            "range": "±9.24%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27680,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 26985,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 44884,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 793,
            "range": "±6.82%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 131,
            "range": "±29.06%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 79.98,
            "range": "±11.93%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.47,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "859087d6077f93be87187edb8e8139ccbd098600",
          "message": "Evm refactor updates (#1977)\n\n* evm/vm: move EEI back into VM\r\n\r\n* vm: fix build\r\n\r\n* evm: move evm folder up\r\n\r\n* evm: lint\r\n\r\n* vm: lint\r\n\r\n* vm/evm: move files around\r\n\r\n* evm/vm: fix tests\r\n\r\n* evm: cleanup dependencies\r\n\r\n* evm: remove more dependencies\r\n\r\n* vm: fix build\r\n\r\n* vm: fix CI/tests (?)\r\n\r\n* client: fix tests (?)\r\n\r\n* client; test fixes",
          "timestamp": "2022-06-23T11:12:19+02:00",
          "tree_id": "759002ab4f8cd2d4f01444f85a67e0ecdf542c47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/859087d6077f93be87187edb8e8139ccbd098600"
        },
        "date": 1655975775413,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33057,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30447,
            "range": "±7.25%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32385,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31979,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53985,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 746,
            "range": "±42.73%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 190,
            "range": "±8.29%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.96,
            "range": "±16.48%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.02,
            "range": "±12.76%",
            "unit": "ops/sec",
            "extra": "25 samples"
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
          "id": "483a8e523fbcf835ea8f04e5a4dbce50983f7509",
          "message": "VM Folder restructure (#1991)\n\n* Rename index to vm.ts\r\n\r\n* vm: Move VMOpts to types, add index.ts\r\n\r\n* move all types to types.ts\r\n\r\n* vm: fix test imports\r\n\r\n* add param types in test\r\n\r\n* vm: fix type imports\r\n\r\n* Fix imports\r\n\r\n* vm: Fix benchmarks imports\r\n\r\n* Remove dist from vm imports\r\n\r\n* Fix bloom export\r\n\r\n* Fix test",
          "timestamp": "2022-06-23T22:00:16+02:00",
          "tree_id": "a926b43a5befbd88a5ab0d6699427fea46108e1d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/483a8e523fbcf835ea8f04e5a4dbce50983f7509"
        },
        "date": 1656014666370,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32434,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30344,
            "range": "±6.21%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32230,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31196,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52522,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 955,
            "range": "±5.56%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 144,
            "range": "±44.85%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.9,
            "range": "±16.19%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.77,
            "range": "±77.38%",
            "unit": "ops/sec",
            "extra": "24 samples"
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
          "id": "30bb25d9a13372aca4874e61ba9cd736a1d3cfc8",
          "message": "Add declaration map (#1992)",
          "timestamp": "2022-06-23T22:39:13+02:00",
          "tree_id": "e7609e9e7ecc265a4fc826969311d0ec4fbc17a9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/30bb25d9a13372aca4874e61ba9cd736a1d3cfc8"
        },
        "date": 1656017010752,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30046,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 27425,
            "range": "±10.85%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 31003,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29616,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 48701,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 915,
            "range": "±6.52%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 111,
            "range": "±65.89%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 96.01,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.54,
            "range": "±29.27%",
            "unit": "ops/sec",
            "extra": "24 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "micaiahreid@gmail.com",
            "name": "Micaiah Reid",
            "username": "MicaiahReid"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d49d08a740631e6899422056f1f6e00c432f85f2",
          "message": "remove untrue jsdoc comment on clearWarmedAccounts (#1997)",
          "timestamp": "2022-06-24T11:15:16-04:00",
          "tree_id": "8d9cc816fa2691c3c883aae4bd794ae1fe12a53a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d49d08a740631e6899422056f1f6e00c432f85f2"
        },
        "date": 1656083981126,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27944,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 26812,
            "range": "±9.62%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 29599,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29373,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 48091,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 777,
            "range": "±6.88%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 102,
            "range": "±67.73%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 86.5,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.31,
            "range": "±22.48%",
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
          "id": "c06d9dbd9da7c1febc278e41775b3b16679ccf13",
          "message": "vm: Fix declaration settings (#1999)",
          "timestamp": "2022-06-27T14:17:15+02:00",
          "tree_id": "fb749740071961041d221edac71f1129f167253f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c06d9dbd9da7c1febc278e41775b3b16679ccf13"
        },
        "date": 1656332487403,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 30635,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 28579,
            "range": "±7.64%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30132,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29764,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 48397,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 801,
            "range": "±7.52%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 106,
            "range": "±60.33%",
            "unit": "ops/sec",
            "extra": "40 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.52,
            "range": "±6.33%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.29,
            "range": "±62.73%",
            "unit": "ops/sec",
            "extra": "30 samples"
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
          "id": "5bcd389b8c98e2f8bcb243146ebad2f58ab5c251",
          "message": "EVM Types Cleanup (#2001)\n\n* EVM: reorder types, add some code docs\r\n\r\n* EVM: do not export the the replicated intermediary state interfaces, only the resulting dedicated VmStateAccess interface\r\n\r\n* EVM: rename VmStateAccess -> EVMStateAccess\r\n\r\n* EVM: rename RunCallOpts -> EVMRunCallOpts, RunCodeOpts -> EVMRunCodeOpts interfaces to have these more prominently stand out\r\n\r\n* EVM: removed/internalized TxContext interface\r\n\r\n* EVM: localized NewContractEvent type\r\n\r\n* EVM: simplified test command (removed test:API), moved test files one level up\r\n\r\n* EVM: fixed test import references\r\n\r\n* EVM: moved all result types to file bottom",
          "timestamp": "2022-06-28T12:21:33+02:00",
          "tree_id": "5aed83d9bf593f5f52e47ec02d30cd67180b99af",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5bcd389b8c98e2f8bcb243146ebad2f58ab5c251"
        },
        "date": 1656411938587,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32964,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 29837,
            "range": "±9.66%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32378,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32010,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52170,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 932,
            "range": "±6.96%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 130,
            "range": "±54.41%",
            "unit": "ops/sec",
            "extra": "64 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 95.44,
            "range": "±5.77%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 7.42,
            "range": "±85.42%",
            "unit": "ops/sec",
            "extra": "21 samples"
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
          "id": "932f4f9e24e22981b58961f5405a67768aaedfad",
          "message": "Master branch - Gray Glacier Support (#1988)\n\n* common: add GrayGlacier HF and EIP-5133\r\n\r\n* block/test: add grayGlacier tests\r\n\r\n* VM, EVM: added EIP-5133 and GrayGlacier HF support\r\n\r\n* VM, EVM -> Simplification: limit supported EIP check and EIP docs to inner EVM (will deterministically throw on instantiation)\r\n\r\n* EVM, VM: moved supported HF check to EVM to cover both EVM and VM\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-06-28T13:29:52+02:00",
          "tree_id": "1703b59db51b0dba2f8ae5d6182ad811fe9a1f41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/932f4f9e24e22981b58961f5405a67768aaedfad"
        },
        "date": 1656416081224,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 24728,
            "range": "±4.11%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 24547,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 21742,
            "range": "±11.91%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 24894,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 39664,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 700,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 125,
            "range": "±31.28%",
            "unit": "ops/sec",
            "extra": "54 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 68.58,
            "range": "±11.33%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 11.85,
            "range": "±35.27%",
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
          "id": "872e85ce17dc3a0635762f7957c05279b2e923d8",
          "message": "EVM: Cleanup EEI (#2003)\n\n* evm/vm: cleanup round 1\r\n\r\n* vm: mark some eei methods protected\r\n\r\n* evm: update EEI methods\r\n\r\n* client: fix build\r\n\r\n* evm: lint\r\n\r\n* client/vm/evm: fix tests\r\n\r\n* client: fix tests",
          "timestamp": "2022-06-30T09:39:37+02:00",
          "tree_id": "83f8ebbf3d31c26b247623b95f4f50d94364d469",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/872e85ce17dc3a0635762f7957c05279b2e923d8"
        },
        "date": 1656575014518,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33143,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30689,
            "range": "±7.41%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32557,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32419,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54691,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "93 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 777,
            "range": "±44.47%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 193,
            "range": "±8.73%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 94.97,
            "range": "±15.22%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.75,
            "range": "±57.31%",
            "unit": "ops/sec",
            "extra": "38 samples"
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
          "id": "c5260ba9add32f57921380abb32c2c1f9dc21de6",
          "message": "Monorepo: Beta 1 Releases (#1957)\n\n* Common -> Beta 1 Release: added Changelog entry\r\n\r\n* Util -> Beta 1 Release: added Changelog entry\r\n\r\n* Tx -> Beta 1 Release: added Changelog entry\r\n\r\n* Trie -> Beta 1 Release: added Changelog entry\r\n\r\n* Monorepo -> Beta 1 Release: Suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Trie, Common, Tx, Util -> Beta 1 Releases: Trie related review feedback, added esModuleInterop/allowSyntheticDefaultImports sections\r\n\r\n* Block -> Beta 1 Release: added CHANGELOG entry\r\n\r\n* Block -> Beta 1 Releases: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Blockchain -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Monorepo: added beta version numbers\r\n\r\n* Devp2p -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Ethash -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* RLP -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* StateManager -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* EVM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* VM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Block: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Blockchain: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Common: bumped version to 3.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Devp2p: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Ethash: bumped version to 2.0.0-beta.1, updated upstream dependency versions\r\n\r\n* EVM: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* RLP: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* StateManager: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Trie: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Tx: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Util: bumped version to 8.0.0-beta.1, updated upstream dependency versions\r\n\r\n* VM: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Monorepo: updated package-lock.json\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-30T11:21:53+02:00",
          "tree_id": "eb4eafb564f56a27a5c7b78e5bdf8c1476b7262e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5260ba9add32f57921380abb32c2c1f9dc21de6"
        },
        "date": 1656581172811,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33037,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30412,
            "range": "±8.26%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32708,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32300,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53081,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 703,
            "range": "±51.26%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 185,
            "range": "±10.30%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 88.33,
            "range": "±23.49%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 9.92,
            "range": "±100.58%",
            "unit": "ops/sec",
            "extra": "21 samples"
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
          "id": "cfd7b7754490b072a035cceaba59c3dfb517effd",
          "message": "client: Fix rpc import broken after tuning off esModuleInterop (#2006)",
          "timestamp": "2022-07-01T15:03:22+05:30",
          "tree_id": "a163819c7e31d59f03a259e0ae75f8db6e3c4f3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfd7b7754490b072a035cceaba59c3dfb517effd"
        },
        "date": 1656668259900,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 29065,
            "range": "±6.06%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 27690,
            "range": "±9.87%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30443,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 29242,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45760,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 789,
            "range": "±6.98%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±67.75%",
            "unit": "ops/sec",
            "extra": "43 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 86.55,
            "range": "±11.70%",
            "unit": "ops/sec",
            "extra": "56 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.29,
            "range": "±22.40%",
            "unit": "ops/sec",
            "extra": "32 samples"
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
          "id": "3ba0078675498af4287155d0a63d206422d3c9b0",
          "message": "evm: Remove vm example links (#2011)",
          "timestamp": "2022-07-04T14:48:20+02:00",
          "tree_id": "6131d4561972bf0baadbd5587024e5b9ed4f774c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ba0078675498af4287155d0a63d206422d3c9b0"
        },
        "date": 1656939157269,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33261,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30754,
            "range": "±6.78%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32337,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32612,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54881,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 780,
            "range": "±46.32%",
            "unit": "ops/sec",
            "extra": "68 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 204,
            "range": "±7.53%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 73.23,
            "range": "±52.32%",
            "unit": "ops/sec",
            "extra": "61 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 19.52,
            "range": "±13.77%",
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
          "id": "6618e5551d3676221620f146357d9ecc485eec83",
          "message": "Blockchain: optional consensus (#2002)\n\n* blockchain: add optional consensus param\r\n\r\n* blockchain: add algorithm property to consensus\r\n\r\n* blockchain: rework consensus setup\r\n\r\n* fix examples\r\n\r\n* fix blockchain test runner\r\n\r\n* add more tests\r\n\r\n* add blockchain checks to clique\r\n\r\n* skip merge check on custom consensus\r\n\r\n* Fix consensus check and add more tests\r\n\r\n* lint fix",
          "timestamp": "2022-07-04T22:55:35+02:00",
          "tree_id": "5c9fa795f320946c0596a844563d17377c68526e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6618e5551d3676221620f146357d9ecc485eec83"
        },
        "date": 1656968397393,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 31858,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25890,
            "range": "±12.57%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 30136,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31352,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52152,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 883,
            "range": "±6.85%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 106,
            "range": "±65.01%",
            "unit": "ops/sec",
            "extra": "41 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 92.19,
            "range": "±5.59%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 14.85,
            "range": "±33.68%",
            "unit": "ops/sec",
            "extra": "24 samples"
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
          "id": "5b1da6a5f5856ce079a86552ab5246105501972b",
          "message": "VM/EVM: Update and align README Documentation (#2016)\n\n* EVM: adopt README links\r\n\r\n* VM/EVM -> README : added distinkt introductory texts for the libraries\r\n\r\n* EVM: update README code example\r\n\r\n* VM -> README: added more fitting (and working) VM example\r\n\r\n* VM/EVM: example updates/fixes and moving around\r\n\r\n* VM/EVM -> README: added new sections on EVM/VM relationship\r\n\r\n* VM/EVM -> README: added EEI and State sections to EVM and VM READMEs\r\n\r\n* EVM/VM -> README: unify, adopt and deduplicate Chain Type, Hardfork, Genesis State and EIP sections\r\n\r\n* EVM/VM -> README: adopt event sections\r\n\r\n* EVM/VM -> README: adopt debug logger and internal structure sections\r\n\r\n* EVM/VM -> README: deduplicate Development docs",
          "timestamp": "2022-07-07T10:30:16+02:00",
          "tree_id": "e754999bd1fc0224d787f85580ea6943870d6633",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b1da6a5f5856ce079a86552ab5246105501972b"
        },
        "date": 1657182917276,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27511,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25403,
            "range": "±9.97%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27942,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27034,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45233,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 797,
            "range": "±7.09%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 103,
            "range": "±68.95%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 78.35,
            "range": "±12.60%",
            "unit": "ops/sec",
            "extra": "62 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 16.24,
            "range": "±5.17%",
            "unit": "ops/sec",
            "extra": "29 samples"
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
          "id": "b30f914aeef2ca0bca2937f3e2674f1ff65b2426",
          "message": "Monorepo: remove default exports (#2018)\n\n* Monorepo: remove default exports and adjust imports in non-test files\r\n\r\n* Monorepo: adjust removal of default exports in test files\r\n\r\n* Monorepo: add no-default-export eslint rule\r\n\r\n* Monorepo: update README with non-default named imports",
          "timestamp": "2022-07-08T10:43:48+02:00",
          "tree_id": "16335b0243822917e43ab8ca67f35598a757c024",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b30f914aeef2ca0bca2937f3e2674f1ff65b2426"
        },
        "date": 1657270147145,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 27283,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25360,
            "range": "±8.45%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27904,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27633,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45904,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 831,
            "range": "±6.41%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 99.82,
            "range": "±66.66%",
            "unit": "ops/sec",
            "extra": "42 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.08,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "65 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.36,
            "range": "±24.43%",
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
          "id": "12a81f6ca9205d5d4fc7668b67027ce4f950f20d",
          "message": "master-vm-copy-bug (#2027)\n\n* vm: include hardfork options in VM.copy()\r\n\r\n* vm: edit vm.copy() to only copy evm and derive rest\r\n\r\n* vm: add new tests for copying hardfork options\r\n\r\n* evm: add tests for copying of customOpcodes and customPrecompiles",
          "timestamp": "2022-07-08T11:16:40+02:00",
          "tree_id": "f61c2155bb2e149dd0e949d48ee1017bff609589",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/12a81f6ca9205d5d4fc7668b67027ce4f950f20d"
        },
        "date": 1657272067413,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 32906,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30157,
            "range": "±8.81%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32928,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31444,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 52636,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 954,
            "range": "±6.81%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 181,
            "range": "±9.16%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 87.18,
            "range": "±19.95%",
            "unit": "ops/sec",
            "extra": "58 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 10.01,
            "range": "±92.11%",
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
          "id": "01f38c8db0b962fe039c0c74ee76261e4f4014c4",
          "message": "Fix consensus validation bugs (#2031)\n\n* client: fix extradata in devnet settings\r\n* block: move consensus format validation to corret place",
          "timestamp": "2022-07-09T14:49:39-04:00",
          "tree_id": "95220d0e75e4ec28c0919936183e8e4a4c3460db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/01f38c8db0b962fe039c0c74ee76261e4f4014c4"
        },
        "date": 1657392840863,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33045,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30711,
            "range": "±6.60%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32230,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 31853,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53765,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 749,
            "range": "±42.60%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 193,
            "range": "±5.99%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.83,
            "range": "±17.02%",
            "unit": "ops/sec",
            "extra": "60 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 13.27,
            "range": "±58.61%",
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
          "id": "11636eba74911bb1daaa9632875a6da060568a71",
          "message": "Further README Updates (#2028)\n\n* Block README update\r\n\r\n* Blockchain README update\r\n\r\n* Updated Common README, added generic BigInt Support section\r\n\r\n* StateManager README update\r\n\r\n* Trie README update\r\n\r\n* Util README update\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-11T11:14:13+02:00",
          "tree_id": "71c0cac7809cdee9c460e6f6f9d6d7b46197b4d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11636eba74911bb1daaa9632875a6da060568a71"
        },
        "date": 1657531159368,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 28140,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 25783,
            "range": "±9.15%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 27604,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 27469,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 45091,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 830,
            "range": "±6.40%",
            "unit": "ops/sec",
            "extra": "67 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 104,
            "range": "±67.93%",
            "unit": "ops/sec",
            "extra": "39 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 89.17,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "57 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 15.72,
            "range": "±21.16%",
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
          "id": "964c5f51fbd339d925a8c39293f5d90ca4a7b696",
          "message": "Rename evm loggers (#2029)\n\n* Rename evm loggers\r\n\r\n* update readme\r\n\r\n* Correct typedoc links and comments\r\n\r\n* Various comment/readme updates\r\n\r\n* address feedback\r\n\r\n* fix import in readme",
          "timestamp": "2022-07-11T15:33:10+02:00",
          "tree_id": "53a80f9c02d973fbf402118b5704d923e1d8a028",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/964c5f51fbd339d925a8c39293f5d90ca4a7b696"
        },
        "date": 1657546664695,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33346,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30445,
            "range": "±9.22%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 33303,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32038,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 53321,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 729,
            "range": "±50.25%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 189,
            "range": "±10.45%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 90.03,
            "range": "±18.98%",
            "unit": "ops/sec",
            "extra": "59 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 12.56,
            "range": "±68.75%",
            "unit": "ops/sec",
            "extra": "35 samples"
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
          "id": "406372c11238b7f8f581a11ed2dde3478d40f38f",
          "message": "common: Update sepolia and ropsten configs for merge (#2005)\n\n* Update sepolia and ropsten configs for merge\r\n\r\n* add some bootnodes",
          "timestamp": "2022-07-12T17:06:19+05:30",
          "tree_id": "5428a2103611adf14ad9e8debc589450544a8441",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/406372c11238b7f8f581a11ed2dde3478d40f38f"
        },
        "date": 1657626048520,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "1k-3-32-ran",
            "value": 33109,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "1k-5-32-ran",
            "value": 30787,
            "range": "±7.23%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "1k-9-32-ran",
            "value": 32501,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "1k-1k-32-ran",
            "value": 32056,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "1k-1k-32-mir",
            "value": 54813,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Checkpointing: 100 iterations",
            "value": 787,
            "range": "±44.26%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Checkpointing: 500 iterations",
            "value": 204,
            "range": "±7.58%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Checkpointing: 1000 iterations",
            "value": 73.38,
            "range": "±49.83%",
            "unit": "ops/sec",
            "extra": "63 samples"
          },
          {
            "name": "Checkpointing: 5000 iterations",
            "value": 18.9,
            "range": "±16.57%",
            "unit": "ops/sec",
            "extra": "39 samples"
          }
        ]
      }
    ]
  }
}