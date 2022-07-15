window.BENCHMARK_DATA = {
  "lastUpdate": 1657881608168,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
        "date": 1655404754222,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25756,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24430,
            "range": "±6.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24954,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21178,
            "range": "±9.45%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24646,
            "range": "±2.29%",
            "unit": "ops/sec",
            "extra": "83 samples"
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
        "date": 1655544417493,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17049,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16655,
            "range": "±5.10%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17422,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17197,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16911,
            "range": "±2.71%",
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
          "id": "71265541e5011d42e75e5bd0344ad1087e6a2d71",
          "message": "Trie (chore): reorganise files by technical domains (#1972)\n\n* chore(trie): reorganise files by technical domains\r\n\r\n* refactor(trie): break down `trie/node` into smaller files and renaming\r\n\r\n* chore(trie): install `@types/readable-stream` types",
          "timestamp": "2022-06-20T14:26:59+02:00",
          "tree_id": "9326c7b7ffb7d117cba3916f098c5b60c2018608",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/71265541e5011d42e75e5bd0344ad1087e6a2d71"
        },
        "date": 1655728396935,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15489,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15120,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14512,
            "range": "±7.71%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15324,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14938,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
        "date": 1655808787702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15588,
            "range": "±4.47%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15303,
            "range": "±5.73%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15214,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15315,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13977,
            "range": "±2.90%",
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
          "id": "c5fb3169c004beca1de1340ebebb8838062dfb03",
          "message": " Monorepo: Remove esModuleInterop and allowSyntheticDefaultImports Options (cherry-picked) (#1975)\n\n* Monorepo: set esModuleInterop TS compiler option to false\r\n\r\n* client: change `import X` to `import * as X`\r\n\r\n* client: replace qheap with js-priority-queue\r\n\r\n* blockchain: change to import *\r\n\r\n* blockchain/tests: change to import *\r\n\r\n* block/test: change to import *\r\n\r\n* common: change to import *\r\n\r\n* common/tests: change to import *\r\n\r\n* devp2p: change imports to import * or require()\r\n\r\n* ethash/tests: change import tape to import * as\r\n\r\n* rlp/tests: change imports to import *\r\n\r\n* statemanager/test: change imports to import * as\r\n\r\n* trie/tests: change imports to import *\r\n\r\n* ts/tests: change imports to import *\r\n\r\n* util/tests: change imports to import *\r\n\r\n* vm: change json import to import *\r\n\r\n* vm/tests: change imports to import *\r\n\r\n* client/test: change imports to import *\r\n\r\n* vm/tests: fix API test imports\r\n\r\n* trie/benchmarks: fix benchmark test import\r\n\r\n* client: fix qheap import problem\r\n\r\n* Devp2p, EVM: fixed tests\r\n\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>",
          "timestamp": "2022-06-21T14:40:00+02:00",
          "tree_id": "05b40da563ff574d001fa8146b2cbbd9ec520835",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5fb3169c004beca1de1340ebebb8838062dfb03"
        },
        "date": 1655815902258,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28652,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 26867,
            "range": "±4.56%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27231,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24462,
            "range": "±8.87%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26537,
            "range": "±1.99%",
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
          "id": "1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040",
          "message": "Block validation methods, take 3 (#1959)\n\n* rename _validateHeaderFields\r\n\r\n* Move static consensus checks\r\n\r\n* block: fix header consensus validation tests\r\n\r\n* Move header.validate to blockhain\r\n\r\n* blockchain: fix tests related to headerValidate\r\n\r\n* move validateDifficulty to blockchain\r\n\r\n* block: fix difficulty tests\r\n\r\n* move blockchain dependendent validateUncle checks\r\n\r\n* block: fix `cliqueSigner` for default blocks\r\n\r\n* block: fix block tests\r\n\r\n* move blockchain dependent tests to blockchain\r\n\r\n* replace block.validate\r\n\r\n* Fix package build issues\r\n\r\n* ethash: fix test on invalidPOW\r\n\r\n* Move format level EIP1559 checks back to block\r\n\r\n* Fix EIP1559 tests, make validateGasLimit throw\r\n\r\n* blockchain: fix build issue\r\n\r\n* finish test fixes\r\n\r\n* various test fixes\r\n\r\n* vm: runTx fix\r\n\r\n* Add fix for kovan in genesis block\r\n\r\n* vm: last test fix\r\n\r\n* client: fix tests\r\n\r\n* client: miner and skeleton fixes\r\n\r\n* client: fix chainID test\r\n\r\n* client: fix skeleton tests\r\n\r\n* client: fix forkChoiceUpdate test\r\n\r\n* client: fix pendingBlock tests\r\n\r\n* new payload client instantiation fix plus lint cleanup\r\n\r\n* fix beaconsync integration spec\r\n\r\n* vm: fix examples\r\n\r\n* address feedback\r\n\r\n* test and parentheses fixes\r\n\r\n* test fixes\r\n\r\n* Remove unused clique check\r\n\r\n* Fix skeleton, again\r\n\r\n* fix skeleton, fix again\r\n\r\n* various client test fixes\r\n\r\n* clean up commented stubs\r\n\r\n* remove lint rule\r\n\r\n* client: fix integration test\r\n\r\n* blockchain: rename validation method\r\n\r\n* Update imports, fix qheap\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2022-06-21T18:09:39+02:00",
          "tree_id": "8b3ce968451effad1da644d499f4fe6aa1d26487",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1bd5c4fa9e2fbc4e9cbfb99ac8d98f383bc32040"
        },
        "date": 1655828168389,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14337,
            "range": "±4.16%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14197,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13824,
            "range": "±5.64%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14193,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13544,
            "range": "±2.73%",
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
          "id": "008c4691a3a0fe598eb82fb98835148296af9a1e",
          "message": "Blockchain file reorganization (#1986)\n\n* Move index to blockchain\r\n\r\n* Reorganize exports\r\n\r\n* blockchain: move types to types.ts\r\n\r\n* block: make _errorMsg protected",
          "timestamp": "2022-06-22T20:01:39+02:00",
          "tree_id": "74f41cbbc043cf10127368cfdc7350d73b106e6d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/008c4691a3a0fe598eb82fb98835148296af9a1e"
        },
        "date": 1655921204397,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26098,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25037,
            "range": "±5.19%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25573,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22180,
            "range": "±9.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25125,
            "range": "±2.18%",
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
          "id": "74d5937b115d419a7d3fd697bc9c321355204a33",
          "message": "Remove explicit browser builds as monorepo builds already target es2020 (#1985)\n\n* Remove explicity browser builds as monorepo builds\r\n\r\n* remove browser key from package.json except client",
          "timestamp": "2022-06-22T20:34:22+02:00",
          "tree_id": "4b99bdcca5166da67c9a1e243ad4c53604b6a270",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/74d5937b115d419a7d3fd697bc9c321355204a33"
        },
        "date": 1655923096654,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23428,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22784,
            "range": "±6.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24032,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21954,
            "range": "±7.14%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20842,
            "range": "±9.99%",
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
          "id": "859087d6077f93be87187edb8e8139ccbd098600",
          "message": "Evm refactor updates (#1977)\n\n* evm/vm: move EEI back into VM\r\n\r\n* vm: fix build\r\n\r\n* evm: move evm folder up\r\n\r\n* evm: lint\r\n\r\n* vm: lint\r\n\r\n* vm/evm: move files around\r\n\r\n* evm/vm: fix tests\r\n\r\n* evm: cleanup dependencies\r\n\r\n* evm: remove more dependencies\r\n\r\n* vm: fix build\r\n\r\n* vm: fix CI/tests (?)\r\n\r\n* client: fix tests (?)\r\n\r\n* client; test fixes",
          "timestamp": "2022-06-23T11:12:19+02:00",
          "tree_id": "759002ab4f8cd2d4f01444f85a67e0ecdf542c47",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/859087d6077f93be87187edb8e8139ccbd098600"
        },
        "date": 1655975748116,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28688,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27242,
            "range": "±4.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27573,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24776,
            "range": "±7.74%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26139,
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
          "id": "483a8e523fbcf835ea8f04e5a4dbce50983f7509",
          "message": "VM Folder restructure (#1991)\n\n* Rename index to vm.ts\r\n\r\n* vm: Move VMOpts to types, add index.ts\r\n\r\n* move all types to types.ts\r\n\r\n* vm: fix test imports\r\n\r\n* add param types in test\r\n\r\n* vm: fix type imports\r\n\r\n* Fix imports\r\n\r\n* vm: Fix benchmarks imports\r\n\r\n* Remove dist from vm imports\r\n\r\n* Fix bloom export\r\n\r\n* Fix test",
          "timestamp": "2022-06-23T22:00:16+02:00",
          "tree_id": "a926b43a5befbd88a5ab0d6699427fea46108e1d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/483a8e523fbcf835ea8f04e5a4dbce50983f7509"
        },
        "date": 1656014642872,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28364,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27202,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27836,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24851,
            "range": "±9.07%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26561,
            "range": "±2.00%",
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
          "id": "c06d9dbd9da7c1febc278e41775b3b16679ccf13",
          "message": "vm: Fix declaration settings (#1999)",
          "timestamp": "2022-06-27T14:17:15+02:00",
          "tree_id": "fb749740071961041d221edac71f1129f167253f",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c06d9dbd9da7c1febc278e41775b3b16679ccf13"
        },
        "date": 1656332455373,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26076,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24546,
            "range": "±6.17%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25009,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22022,
            "range": "±9.35%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24823,
            "range": "±2.22%",
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
          "id": "5bcd389b8c98e2f8bcb243146ebad2f58ab5c251",
          "message": "EVM Types Cleanup (#2001)\n\n* EVM: reorder types, add some code docs\r\n\r\n* EVM: do not export the the replicated intermediary state interfaces, only the resulting dedicated VmStateAccess interface\r\n\r\n* EVM: rename VmStateAccess -> EVMStateAccess\r\n\r\n* EVM: rename RunCallOpts -> EVMRunCallOpts, RunCodeOpts -> EVMRunCodeOpts interfaces to have these more prominently stand out\r\n\r\n* EVM: removed/internalized TxContext interface\r\n\r\n* EVM: localized NewContractEvent type\r\n\r\n* EVM: simplified test command (removed test:API), moved test files one level up\r\n\r\n* EVM: fixed test import references\r\n\r\n* EVM: moved all result types to file bottom",
          "timestamp": "2022-06-28T12:21:33+02:00",
          "tree_id": "5aed83d9bf593f5f52e47ec02d30cd67180b99af",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5bcd389b8c98e2f8bcb243146ebad2f58ab5c251"
        },
        "date": 1656411941664,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26200,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25478,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25752,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22496,
            "range": "±9.53%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25489,
            "range": "±2.20%",
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
          "id": "932f4f9e24e22981b58961f5405a67768aaedfad",
          "message": "Master branch - Gray Glacier Support (#1988)\n\n* common: add GrayGlacier HF and EIP-5133\r\n\r\n* block/test: add grayGlacier tests\r\n\r\n* VM, EVM: added EIP-5133 and GrayGlacier HF support\r\n\r\n* VM, EVM -> Simplification: limit supported EIP check and EIP docs to inner EVM (will deterministically throw on instantiation)\r\n\r\n* EVM, VM: moved supported HF check to EVM to cover both EVM and VM\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2022-06-28T13:29:52+02:00",
          "tree_id": "1703b59db51b0dba2f8ae5d6182ad811fe9a1f41",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/932f4f9e24e22981b58961f5405a67768aaedfad"
        },
        "date": 1656416018359,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 26981,
            "range": "±2.57%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 25238,
            "range": "±5.86%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26268,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22747,
            "range": "±9.89%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422910",
            "value": 25935,
            "range": "±2.09%",
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
          "id": "872e85ce17dc3a0635762f7957c05279b2e923d8",
          "message": "EVM: Cleanup EEI (#2003)\n\n* evm/vm: cleanup round 1\r\n\r\n* vm: mark some eei methods protected\r\n\r\n* evm: update EEI methods\r\n\r\n* client: fix build\r\n\r\n* evm: lint\r\n\r\n* client/vm/evm: fix tests\r\n\r\n* client: fix tests",
          "timestamp": "2022-06-30T09:39:37+02:00",
          "tree_id": "83f8ebbf3d31c26b247623b95f4f50d94364d469",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/872e85ce17dc3a0635762f7957c05279b2e923d8"
        },
        "date": 1656574994706,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28826,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27535,
            "range": "±4.41%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27632,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 25226,
            "range": "±7.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26999,
            "range": "±2.00%",
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
          "id": "c5260ba9add32f57921380abb32c2c1f9dc21de6",
          "message": "Monorepo: Beta 1 Releases (#1957)\n\n* Common -> Beta 1 Release: added Changelog entry\r\n\r\n* Util -> Beta 1 Release: added Changelog entry\r\n\r\n* Tx -> Beta 1 Release: added Changelog entry\r\n\r\n* Trie -> Beta 1 Release: added Changelog entry\r\n\r\n* Monorepo -> Beta 1 Release: Suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Trie, Common, Tx, Util -> Beta 1 Releases: Trie related review feedback, added esModuleInterop/allowSyntheticDefaultImports sections\r\n\r\n* Block -> Beta 1 Release: added CHANGELOG entry\r\n\r\n* Block -> Beta 1 Releases: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Blockchain -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\n\r\n* Monorepo: added beta version numbers\r\n\r\n* Devp2p -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Ethash -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* RLP -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* StateManager -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* EVM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* VM -> Beta 1 Releases: added CHANGELOG entry\r\n\r\n* Block: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Blockchain: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Common: bumped version to 3.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Devp2p: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Ethash: bumped version to 2.0.0-beta.1, updated upstream dependency versions\r\n\r\n* EVM: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* RLP: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* StateManager: bumped version to 1.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Trie: bumped version to 5.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Tx: bumped version to 4.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Util: bumped version to 8.0.0-beta.1, updated upstream dependency versions\r\n\r\n* VM: bumped version to 6.0.0-beta.1, updated upstream dependency versions\r\n\r\n* Monorepo: updated package-lock.json\r\n\r\n* Monorepo: Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-06-30T11:21:53+02:00",
          "tree_id": "eb4eafb564f56a27a5c7b78e5bdf8c1476b7262e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c5260ba9add32f57921380abb32c2c1f9dc21de6"
        },
        "date": 1656581169515,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25470,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22989,
            "range": "±6.08%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23552,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21367,
            "range": "±10.02%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24024,
            "range": "±2.49%",
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
          "id": "cfd7b7754490b072a035cceaba59c3dfb517effd",
          "message": "client: Fix rpc import broken after tuning off esModuleInterop (#2006)",
          "timestamp": "2022-07-01T15:03:22+05:30",
          "tree_id": "a163819c7e31d59f03a259e0ae75f8db6e3c4f3a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/cfd7b7754490b072a035cceaba59c3dfb517effd"
        },
        "date": 1656668243920,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 17721,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16575,
            "range": "±4.96%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17854,
            "range": "±2.65%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17458,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17092,
            "range": "±2.77%",
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
          "id": "3ba0078675498af4287155d0a63d206422d3c9b0",
          "message": "evm: Remove vm example links (#2011)",
          "timestamp": "2022-07-04T14:48:20+02:00",
          "tree_id": "6131d4561972bf0baadbd5587024e5b9ed4f774c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3ba0078675498af4287155d0a63d206422d3c9b0"
        },
        "date": 1656939180682,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14081,
            "range": "±3.51%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14173,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13624,
            "range": "±5.63%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14846,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14980,
            "range": "±2.62%",
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
          "id": "6618e5551d3676221620f146357d9ecc485eec83",
          "message": "Blockchain: optional consensus (#2002)\n\n* blockchain: add optional consensus param\r\n\r\n* blockchain: add algorithm property to consensus\r\n\r\n* blockchain: rework consensus setup\r\n\r\n* fix examples\r\n\r\n* fix blockchain test runner\r\n\r\n* add more tests\r\n\r\n* add blockchain checks to clique\r\n\r\n* skip merge check on custom consensus\r\n\r\n* Fix consensus check and add more tests\r\n\r\n* lint fix",
          "timestamp": "2022-07-04T22:55:35+02:00",
          "tree_id": "5c9fa795f320946c0596a844563d17377c68526e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6618e5551d3676221620f146357d9ecc485eec83"
        },
        "date": 1656968428847,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 15595,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14924,
            "range": "±4.29%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 14569,
            "range": "±6.43%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15037,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 14746,
            "range": "±3.18%",
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
          "id": "5b1da6a5f5856ce079a86552ab5246105501972b",
          "message": "VM/EVM: Update and align README Documentation (#2016)\n\n* EVM: adopt README links\r\n\r\n* VM/EVM -> README : added distinkt introductory texts for the libraries\r\n\r\n* EVM: update README code example\r\n\r\n* VM -> README: added more fitting (and working) VM example\r\n\r\n* VM/EVM: example updates/fixes and moving around\r\n\r\n* VM/EVM -> README: added new sections on EVM/VM relationship\r\n\r\n* VM/EVM -> README: added EEI and State sections to EVM and VM READMEs\r\n\r\n* EVM/VM -> README: unify, adopt and deduplicate Chain Type, Hardfork, Genesis State and EIP sections\r\n\r\n* EVM/VM -> README: adopt event sections\r\n\r\n* EVM/VM -> README: adopt debug logger and internal structure sections\r\n\r\n* EVM/VM -> README: deduplicate Development docs",
          "timestamp": "2022-07-07T10:30:16+02:00",
          "tree_id": "e754999bd1fc0224d787f85580ea6943870d6633",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5b1da6a5f5856ce079a86552ab5246105501972b"
        },
        "date": 1657182891209,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22479,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21282,
            "range": "±6.34%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21761,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21217,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18811,
            "range": "±9.63%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
        "date": 1657270098972,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25817,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 24718,
            "range": "±5.53%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 26139,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22289,
            "range": "±10.04%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24773,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1657272081049,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28507,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27098,
            "range": "±7.29%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27406,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23498,
            "range": "±12.30%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 28639,
            "range": "±1.98%",
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
          "id": "01f38c8db0b962fe039c0c74ee76261e4f4014c4",
          "message": "Fix consensus validation bugs (#2031)\n\n* client: fix extradata in devnet settings\r\n* block: move consensus format validation to corret place",
          "timestamp": "2022-07-09T14:49:39-04:00",
          "tree_id": "95220d0e75e4ec28c0919936183e8e4a4c3460db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/01f38c8db0b962fe039c0c74ee76261e4f4014c4"
        },
        "date": 1657392816947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35654,
            "range": "±5.42%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 35883,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31182,
            "range": "±9.21%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36052,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34068,
            "range": "±0.75%",
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
          "id": "11636eba74911bb1daaa9632875a6da060568a71",
          "message": "Further README Updates (#2028)\n\n* Block README update\r\n\r\n* Blockchain README update\r\n\r\n* Updated Common README, added generic BigInt Support section\r\n\r\n* StateManager README update\r\n\r\n* Trie README update\r\n\r\n* Util README update\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-07-11T11:14:13+02:00",
          "tree_id": "71c0cac7809cdee9c460e6f6f9d6d7b46197b4d6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/11636eba74911bb1daaa9632875a6da060568a71"
        },
        "date": 1657531154890,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19287,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18687,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19144,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18286,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18333,
            "range": "±5.24%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
        "date": 1657546680040,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16716,
            "range": "±3.58%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15475,
            "range": "±7.67%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 16384,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 15977,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16321,
            "range": "±3.14%",
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
          "id": "406372c11238b7f8f581a11ed2dde3478d40f38f",
          "message": "common: Update sepolia and ropsten configs for merge (#2005)\n\n* Update sepolia and ropsten configs for merge\r\n\r\n* add some bootnodes",
          "timestamp": "2022-07-12T17:06:19+05:30",
          "tree_id": "5428a2103611adf14ad9e8debc589450544a8441",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/406372c11238b7f8f581a11ed2dde3478d40f38f"
        },
        "date": 1657626056243,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28235,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27353,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 27285,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24205,
            "range": "±11.36%",
            "unit": "ops/sec",
            "extra": "66 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27725,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "8cc3a00273e8534c395d35f8ca972c5a249b55f8",
          "message": "Common, Client: added Sepolia DNS config and activation (#2034)",
          "timestamp": "2022-07-12T17:51:06+02:00",
          "tree_id": "4408ae8dc2dddc4c49f3a8cf842ae2d021d2143d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8cc3a00273e8534c395d35f8ca972c5a249b55f8"
        },
        "date": 1657641320112,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 34326,
            "range": "±4.86%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 34837,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30860,
            "range": "±10.38%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 34877,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 33221,
            "range": "±0.50%",
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
          "id": "c17346ce62a0725800b89d180ca3c98d3ced79c1",
          "message": "Monorepo: eslint strict boolean expressions (#2030)\n\n* Monorepo: add @typescript-eslint/strict-boolean-expressions rule\r\n\r\n* util: isFalsy and isTruthy utils\r\n\r\n* blockchain: apply strict-boolean-expressions\r\n\r\n* util: apply strict-boolean-expressions\r\n\r\n* common: apply strict-boolean-expressions\r\n\r\n* tx: apply strict-boolean-expressions\r\n\r\n* trie: apply strict-boolean-expressions\r\n\r\n* evm: apply strict-boolean-expressions\r\n\r\n* devp2p: apply strict-boolean-expressions\r\n\r\n* vm: apply strict-boolean-expressions\r\n\r\n* stateManager: apply strict-boolean-expressions\r\n\r\n* ethash: apply strict-boolean-expressions\r\n\r\n* rlp: apply strict-boolean-expressions\r\n\r\n* block: apply strict-boolean-expressions\r\n\r\n* client: apply strict-boolean-expressions",
          "timestamp": "2022-07-13T11:38:30+02:00",
          "tree_id": "9f0b5b3674ef7b01add07c45ceb0da9a17bf4a3e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c17346ce62a0725800b89d180ca3c98d3ced79c1"
        },
        "date": 1657705582612,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35675,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36113,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 31717,
            "range": "±10.36%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36261,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34457,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "81 samples"
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
        "date": 1657706426390,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 31369,
            "range": "±6.82%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 30857,
            "range": "±5.06%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30064,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422908",
            "value": 24832,
            "range": "±14.31%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 30040,
            "range": "±1.20%",
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
          "id": "22a30ae3c421f9bc94831c1c3d637f373cc60b76",
          "message": "Miscellaneous fixes/improvements for evm, client, consensus and crypto (#2040)\n\n* Miscellaneous fixes/improvements for evm, client, consensus and crypto\r\n\r\n* skip header validation while runBlock if block picked from blockchain\r\n\r\n* update the ethereum-cryptography to 1.1.2 with 0 msgHash fix",
          "timestamp": "2022-07-15T11:16:16+02:00",
          "tree_id": "c2986abf5a61b6fb7e8063fcd6dbdf2d38375e07",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/22a30ae3c421f9bc94831c1c3d637f373cc60b76"
        },
        "date": 1657876917933,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 16815,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 15434,
            "range": "±8.15%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422907",
            "value": 15688,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 14765,
            "range": "±3.60%",
            "unit": "ops/sec",
            "extra": "70 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15204,
            "range": "±3.98%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
        "date": 1657881607568,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 35206,
            "range": "±5.46%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 36322,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 30326,
            "range": "±10.47%",
            "unit": "ops/sec",
            "extra": "69 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36487,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34420,
            "range": "±0.78%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      }
    ]
  }
}