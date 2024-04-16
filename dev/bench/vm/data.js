window.BENCHMARK_DATA = {
  "lastUpdate": 1713229734722,
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
          "id": "b8f5b6df2a5e454f315d9b30b4f04e89fd92fdf8",
          "message": "Make trustedSetupPath in Util kzg module optional (#3296)",
          "timestamp": "2024-02-29T07:07:30-05:00",
          "tree_id": "4db1634662531c78ce25a026bc59e8564b28d4a9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b8f5b6df2a5e454f315d9b30b4f04e89fd92fdf8"
        },
        "date": 1709208610754,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40686,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40104,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39760,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36399,
            "range": "±5.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37930,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "f01264cba33d8eb2c875b3e4e97e70ef4b02bf27",
          "message": "client: save preimages feature (#3143)\n\n* client: PreimageManager and Preimage storage in MetaDB\r\n\r\n* common: add getAppliedKey method to StateManagerInterface\r\n\r\n* evm: add preimage reporting\r\n\r\n* statemanager: add getAppliedKey methods to the statemanager implementations\r\n\r\n* vm: improve some types\r\n\r\n* vm: implement preimage reporting\r\n\r\n* client: add preimage saving\r\n\r\n* evm: update to unprefixedHexToBytes\r\n\r\n* vm: add reportPreimages test to runTx tests\r\n\r\n* vm: pass down reportPreimages arg from block to tx\r\n\r\n* client: pass down reportPreimages from client to vm through runBlock\r\n\r\n* client: unify config options naming\r\n\r\n* client: preimageManager test\r\n\r\n* client: test preimage, wip\r\n\r\n* common: add todo to gasPrices from 6800\r\n\r\n* statemanager: fix type issues\r\n\r\n* dev accessWitness class on the lines of geth impl\r\n\r\n* integrate accesswitness in evm/vm/runtx flow\r\n\r\n* plugin the gas schedule for tx origin and destination accesses\r\n\r\n* complete, debug and fix the call and create access charges\r\n\r\n* plug the access gas usage on the evm opcode runs\r\n\r\n* debug and fix the code chunk accesses and the poststate setting\r\n\r\n* implement access merging and accessed state tracking and traversing\r\n\r\n* also provide chunkKey for easy reference\r\n\r\n* decode raw accesses to structured ones and debug log them\r\n\r\n* debug and add the missing accesses for coinbase, withdrawals\r\n\r\n* stateManager: implement cache handling in the context of statelessness\r\n\r\n* modify poststate to use accesses from the accesswitness to compare and fix mising chunkKey in returned accesses\r\n\r\n* stateManager: getComputedValue\r\n\r\n* fixes for the getcomputedval fn helper for the code\r\n\r\n* correctly implement the getcontractcode with partial accessed segments available  and corresponding error handling in evm run\r\n\r\n* statemanager: tentative fixes & improvements to code cache handling\r\n\r\n* statemanager: checkpoint code cache\r\n\r\n* fix the code chunk comparision in post state verification\r\n\r\n* rename kaustinen2 local testnet data for\r\n\r\n* fix pre and post state null chunks handling and corresponding get computed fixes\r\n\r\n* setup the client to statelessly execute the verkle blocks randomly from anywhere the chain\r\n\r\n* setup to statelessly run block13 of kaustinen2 in client test spec for easy debugging\r\n\r\n* setup the client kaustinen2 stateless test to test and debug block 16\r\n\r\n* improve the post state witness mismatch logging to be more comprehensible for debugging\r\n\r\n* improve chunk verification tracking logging and fix post/prestate key coding from the witnesses\r\n\r\n* debug and fix code accesses and overhaul/fix accesscharges on create/call\r\n\r\n* add a more complete matching of generated and provided executed witnesses\r\n\r\n* fix return\r\n\r\n* debug, discuss and remove proof of absence charges for contract create for fixing the extra witnesses\r\n\r\n* only charge code accesses if accessed from state and when code is written on contract creation\r\n\r\n* handle bigint treeIndex for the bigint slot and debug/match the predersenhash with kauntinen2 usage\r\n\r\n* client: fix kaustinen tests and migrate to new testing framework\r\n\r\n* shift kaustinen 2 test to block 13\r\n\r\n* client: remove stale kaustinen2 test data\r\n\r\n* vm: adjust rewardAccount new common arg ordering and make it optional\r\n\r\n* add block12 to the spec list\r\n\r\n* move invalid opcode check outside jump analysis\r\n\r\n* small cleanup in runtx\r\n\r\n* add preimages spec\r\n\r\n* build various block scenarios for preimages gen\r\n\r\n* client: revert vmexecution preimages test\r\n\r\n* client: remove unnecessary boolean explicit comparison\r\n\r\n* client: remove unused import\r\n\r\n* client: revert re-ordering\r\n\r\n* stateManager: support non keccak256 applied keys\r\n\r\n* debug and persist preimages on runWithoutSetHead as well\r\n\r\n* add preimages for coinbase,withdrawals to the test and fix the spec to validate them\r\n\r\n* client: fix preimage tests ts errors\r\n\r\n* client: minor adjustments to preimage test\r\n\r\n* client: save preimages helper\r\n\r\n* vm: save preimages at the block level, new applyBlockResult type\r\n\r\n* common: make getAppliedKey optional\r\n\r\n* evm/vm: handle optional getAppliedKey\r\n\r\n* client: add preimage doc\r\n\r\n* trie: export \"Path\" interface (#3292)\r\n\r\n* trie: export \"Path\" interface\r\n\r\n* Move over Path interface export to types for consistency\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\n\r\n* Snap sync: use zero-element proof for checking validity of final, empty range result (#3047)\r\n\r\n* Use no-elements proof for final check in account fetcher\r\n\r\n* Use no-elements proof for final check in storage fetcher\r\n\r\n* Check inputs after zero element proof code section\r\n\r\n* Cleanup\r\n\r\n* Reject peer if zero-element proof fails\r\n\r\n* Add tests for zero-element proof\r\n\r\n* Remove proofTrie usage\r\n\r\n* Use hashing function in static version of verifyRangeProof\r\n\r\n* Include useKeyHashing in call to fromProof so that hashing function is used in proof verification\r\n\r\n* Use appliedKey for hashing function instead of the function directly passed in TrieOpts\r\n\r\n* Pass in hashing function for use in static proof verification calls\r\n\r\n* Fix static range proof verification errors\r\n\r\n* Use custom hashing function from opts if available\r\n\r\n* Add test to check if zero element range proof verification fails with remaining elements to the right\r\n\r\n* Check if parameters are as expected for zero-element proof\r\n\r\n* Fix linting issues\r\n\r\n---------\r\n\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Indigo Alpha <indigoalpha@indigos-mbp.mynetworksettings.com>\r\n\r\n* Integrate `kzg-wasm` into monorepo (#3294)\r\n\r\n* Update to official trusted setup\r\n\r\n* Remove devnet6\r\n\r\n* Add kzg-wasm\r\n\r\n* Update block tests to use kzg-wasm\r\n\r\n* Update tests\r\n\r\n* Add more 4844 tests to browser run\r\n\r\n* Initial integration of kzg-wasm on git\r\n\r\n* Update kzg-wasm build\r\n\r\n* Fix linter weirdness\r\n\r\n* Move initKzg to `runTests`\r\n\r\n* Fix tests\r\n\r\n* More cleanup\r\n\r\n* Goodbye c-kzg\r\n\r\n* fix kzg references\r\n\r\n* Replace c-kzg with kzg-wasm in package.json\r\n\r\n* Update kzg wasm commit and vm tester config\r\n\r\n* Update initKzg to createKZG\r\n\r\n* fix copy pasta\r\n\r\n* Fix more copy pasta\r\n\r\n* update kzg-wasm to npm release\r\n\r\n* One last bit of copy pasta\r\n\r\n* Address feedback\r\n\r\n* client: remove try/catch blocks createKZG() and remove the initKZG stale comment\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\n\r\n* Make trustedSetupPath in Util kzg module optional (#3296)\r\n\r\n* client: add tx preimages to preimage test cases\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: harkamal <gajinder@g11.in>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Indigo Alpha <indigoalpha@indigos-mbp.mynetworksettings.com>",
          "timestamp": "2024-03-01T12:46:35+01:00",
          "tree_id": "b7ccbb0c3d5731cae25f773b58d4f1a967e8b0f1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f01264cba33d8eb2c875b3e4e97e70ef4b02bf27"
        },
        "date": 1709293760331,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41309,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38547,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40119,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39103,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38078,
            "range": "±1.76%",
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
          "id": "b3c8c285b347245615de16a3f2e589c452d723e8",
          "message": "evm/vm: ensure  backwards compatability reportPreimages (#3298)",
          "timestamp": "2024-03-01T13:49:31+01:00",
          "tree_id": "a80e9695017cd4adf9e7158a49028b1e82e1896e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b3c8c285b347245615de16a3f2e589c452d723e8"
        },
        "date": 1709298086131,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42502,
            "range": "±1.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40140,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40854,
            "range": "±1.34%",
            "unit": "ops/sec",
            "extra": "92 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39454,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39034,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "87 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "43524469+kyscott18@users.noreply.github.com",
            "name": "kyscott18",
            "username": "kyscott18"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f50249450a1dc3647b21b1c11bf1200c34b7811b",
          "message": "Update README.md (#3300)",
          "timestamp": "2024-03-02T22:25:24-05:00",
          "tree_id": "619fbf094e57f17b2887151fe035e7f5554e8268",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f50249450a1dc3647b21b1c11bf1200c34b7811b"
        },
        "date": 1709436489844,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41482,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39870,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40341,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39550,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35436,
            "range": "±6.61%",
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
          "id": "41a74688c4ba0c9bf195679e472cdbab0bc87246",
          "message": "packages: pin lru-cache version to fix build problems (#3285)",
          "timestamp": "2024-03-04T14:58:49+01:00",
          "tree_id": "4a1bc2ed3a63425fdebe1a9cee6f576e38eb42e1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/41a74688c4ba0c9bf195679e472cdbab0bc87246"
        },
        "date": 1709561020469,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41795,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41215,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40830,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37266,
            "range": "±5.62%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39002,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "d8bd18b992bb80f4fe964bb595f637d14b5efe2a",
          "message": "update ethereum/tests to 13.1 (#3302)\n\n* update ethereum/tests to 13.1\r\n\r\n* vm: fix config\r\n\r\n* update ci test runner for vm\r\n\r\n* Update to fixed kzg wasm ver\r\n\r\n* vm/test: add excessBlobGas to state runner\r\n\r\n* Update kzg-wasm\r\n\r\n* update package-lock\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-06T18:53:12+01:00",
          "tree_id": "656da557d39ea87b061ce17c33bcc15b3f67ff6a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d8bd18b992bb80f4fe964bb595f637d14b5efe2a"
        },
        "date": 1709747774421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41007,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38405,
            "range": "±3.11%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39584,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38605,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35334,
            "range": "±4.80%",
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
          "id": "a35bf07bc8e4288a3f605977fb176f487ff6632e",
          "message": "Implement eth_feeHistory (#3295)\n\n* implement effective priority fee retrieval\r\n\r\nimplement fee history rpc method\r\n\r\nrefactor and adjust return values\r\n\r\nadd integer validation\r\n\r\nadd test for maximum base fee increase\r\n\r\nfix backward compatibility\r\n\r\nadd remaining tests\r\n\r\nuse calcNextBaseFee from parent block header\r\n\r\nuse bigint array instead of number array for the optional param\r\n\r\nremove redundant bigIntMax\r\n\r\nretrieve initial base fee from common\r\n\r\n* client: fix build\r\n\r\n* client: partial fix tests\r\n\r\n* client: edit feeHistory tests\r\n\r\n* client/tx address some review\r\n\r\n* tx: make getEffectivePriorityFee redunt\r\n\r\n* tx: add getEffectivePriorityFee tests\r\n\r\n* vm: add todo\r\n\r\n* client: eth_feeHistory fixes + test additions\r\n\r\n* client/rpc: add rewardPrcentile check\r\n\r\n* client: add validation tests for the ratio\r\n\r\n* client: eth_feeHistory fix rewards?\r\n\r\n* Add partial tests for reward percentiles\r\n\r\n* client: feeHistory sort txs by prioFee\r\n\r\n* add more tests\r\n\r\n* client: add extra feeHistory rewards tests\r\n\r\n* vm: use getEffectivePriorityFee\r\n\r\n* client: update mock blockhash\r\n\r\n* add blob fee to feeHistory\r\n\r\n* block: add calcNextBlobGasPrice\r\n\r\n* client: fix feeHistory implementation and add test output\r\n\r\n* client: lint\r\n\r\n* separate validators for rewardPercentile and array\r\n\r\n* client: test rewardPercentile validator\r\n\r\n* Apply comments and add tests\r\n\r\n---------\r\n\r\nCo-authored-by: Marko <marko.ivankovic650@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: ScottyPoi <scott.simpson@ethereum.org>\r\nCo-authored-by: Scotty <66335769+ScottyPoi@users.noreply.github.com>",
          "timestamp": "2024-03-07T13:48:01-05:00",
          "tree_id": "d9aaa60ec353cfc13f7c4b1f0ce459b3b7cd4436",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a35bf07bc8e4288a3f605977fb176f487ff6632e"
        },
        "date": 1709837455749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42115,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39565,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40875,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37024,
            "range": "±5.43%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38911,
            "range": "±1.68%",
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
          "id": "5e3cfdda4bf714ddb0a11ca2dc0383c265512f25",
          "message": "Update rustbn-wasm usage  (#3304)\n\n* Update rustbn-wasm usage everywhere\r\n\r\n* Update package lock\r\n\r\n* use EVM.create\r\n\r\n* Update examples\r\n\r\n* Address feedback\r\n\r\n* Update rustbn-wasm commit hash\r\n\r\n* Remove console log\r\n\r\n* fix test\r\n\r\n* update rustbn again\r\n\r\n* update rustbn\r\n\r\n* Add bn128 to vm test runner init\r\n\r\n* Update to latest rustbn-wasm\r\n\r\n* Update rustbn-wasm to published v0.4.0 version\r\n\r\n* Rebuild package-lock.json\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-08T10:00:56+01:00",
          "tree_id": "f6b9ab47990530f7b23869d265f428894774877c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5e3cfdda4bf714ddb0a11ca2dc0383c265512f25"
        },
        "date": 1709888759339,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43487,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41127,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41535,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40415,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36024,
            "range": "±5.96%",
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
          "distinct": false,
          "id": "435606e693e4d5c0aea1b17b3fe441521bc585e9",
          "message": "Common Type Fixes (#3307)\n\n* Common: Improve typing for getHardforkBy()\r\n\r\n* Common: Fixes type issue in paramByHardfork()",
          "timestamp": "2024-03-11T11:22:54+01:00",
          "tree_id": "0818741f5057060f67d7120856a06cd669162ba9",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/435606e693e4d5c0aea1b17b3fe441521bc585e9"
        },
        "date": 1710152976795,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43747,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41316,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41171,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39804,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 34645,
            "range": "±6.19%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "891ee51431641021f7cc961833e5b8ac9e7060ba",
          "message": "Trie: add partialPath parameter to trie.findPath() (#3305)\n\n* trie: add optional \"partialPath\" parameter to findPath\r\n\r\n* trie: use partialPath input in findPath stack\r\n\r\n* trie: start findPath walk from end of partialPath\r\n\r\n* trie: identify starting point in debug log\r\n\r\n* trie: test findPath with partial\r\n\r\n* trie: test findPath on secure trie\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-11T14:26:59+01:00",
          "tree_id": "dee64964bfe52ae100173f3826f98872ea0624a2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/891ee51431641021f7cc961833e5b8ac9e7060ba"
        },
        "date": 1710163908995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42778,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42411,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41873,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41042,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36556,
            "range": "±5.83%",
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
          "id": "20d088eb1583ef114d6039462c780cceba862d81",
          "message": "Fix node versions (#3286)\n\n* client tests: fix fetcher test\r\n\r\n* Switch test from testdouble to vitest mocks\r\n\r\n* Sort of fix test\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-12T12:07:16-04:00",
          "tree_id": "5d36b6fa23451a2f87e9bfb72560ee8fe88987a7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/20d088eb1583ef114d6039462c780cceba862d81"
        },
        "date": 1710259801749,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42719,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42745,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42236,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 38639,
            "range": "±5.32%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40266,
            "range": "±1.81%",
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
          "id": "6766a5dc4a531813c9d601e35e5021651c640641",
          "message": "EVM/VM create() Static Constructor Reworking (#3315)\n\n* EVM: make bn128 internal again (remove type in options), rename bn128 -> _bn128 for consistency, deprecate main constructor\r\n\r\n* EVM: move Common, Blockchain and StateManager initialization to async create constructor\r\n\r\n* Move all VM initialization to async create() constructor, kill _init() method and isInitialized parameter, move to async create() initializations where applicable\r\n\r\n* fix vm tests\r\n\r\n* fix remaining client test\r\n\r\n* blockchain: remove _init\r\n\r\n* Client test fixes\r\n\r\n* client: fix tests\r\n\r\n* Remove obsolete reference to blockchain._init\r\n\r\n---------\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-12T12:49:47-04:00",
          "tree_id": "7c72ee9c6d0d055be844d13e8ce20863c0b29b5e",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6766a5dc4a531813c9d601e35e5021651c640641"
        },
        "date": 1710262353517,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 44481,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41589,
            "range": "±3.91%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42712,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41290,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40619,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "yann.levreau@gmail.com",
            "name": "yann300",
            "username": "yann300"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906b36257645bab19999c3559efde9817266bb70",
          "message": "export getOpcodesForHF (#3322)\n\n* Update index.ts\r\n\r\nThis simply export `getOpcodesForHF`.\r\n\r\n* linting",
          "timestamp": "2024-03-14T21:17:32-04:00",
          "tree_id": "d2a4412279853e2e83fbd91a70658f318c3003e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/906b36257645bab19999c3559efde9817266bb70"
        },
        "date": 1710465763614,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 44040,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41881,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42728,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41423,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 40280,
            "range": "±1.80%",
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
          "id": "a70312d8314b1ecab8b1fc03ace146ccfafb16ec",
          "message": "Integrate Simplified kzg-wasm Version / Deprecate Util.initKZG() (#3321)\n\n* Remove all Util.initKZG() calls\r\n\r\n* Remove all Util initKZG imports\r\n\r\n* Temporarily reference PR kzg-wasm version from GitHub in package.json files\r\n\r\n* More Util.initKZG() and import removals\r\n\r\n* Rename kzg-wasm createKZG() -> initKZG() (last step to avoid naming collisions)\r\n\r\n* various cleanup\r\n\r\n* Add finalized kzg-wasm version\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Remove kzg-wasm dependency from root package.json\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Rework Util blobsToCommitments() to not rely on a global kzg object (easy cases)\r\n\r\n* Rework Util blobsToCommitments() to not rely on a global kzg object (somewhat harder cases)\r\n\r\n* Fix blobsToCommitments() usage in the tx library 4844 tx initialization\r\n\r\n* Test fixes\r\n\r\n* Rename Util.initKZG() to original method name, some clean-ups\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-15T12:16:45+01:00",
          "tree_id": "59392cc03552acded20ff1b2c50b0d3b26123d60",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a70312d8314b1ecab8b1fc03ace146ccfafb16ec"
        },
        "date": 1710501591813,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43941,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41771,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42256,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41647,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37091,
            "range": "±5.76%",
            "unit": "ops/sec",
            "extra": "82 samples"
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
          "id": "e38a521e76963434c508371db46f3f4a6c7dd150",
          "message": "Fix RPCStateManager Inconsistincy (#3323)\n\n* Check if rlp is empty account instead of null\r\n\r\n* Add test to make sure RPCSM and DSM behave similarly when getting an account that does not exist",
          "timestamp": "2024-03-18T11:09:01+01:00",
          "tree_id": "84851421a9606b0ea3e105bf944e921b33eedb36",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e38a521e76963434c508371db46f3f4a6c7dd150"
        },
        "date": 1710756725298,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42885,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41351,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41896,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40649,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36334,
            "range": "±5.97%",
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
          "id": "a4130062d625011b39b9dc91ea477f06a49e7287",
          "message": "Update EIP-2935 to latest draft spec (#3327)\n\n* common: update EIP2935\r\n\r\n* evm: update blockhash opcode\r\n\r\n* vm: update eip2935 logic + edit tests\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-18T11:33:48+01:00",
          "tree_id": "ab7edb9bd55aa2763f01683103e823c80418b7f2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a4130062d625011b39b9dc91ea477f06a49e7287"
        },
        "date": 1710758205717,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43499,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42975,
            "range": "±1.23%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42588,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40463,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38412,
            "range": "±4.60%",
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
          "id": "48e6a301f32274d13e72ced26ba60df10ce2008a",
          "message": "4844 Browser Readiness Releases (#3297)\n\n* Add 4844-browser-readiness and KZG WASM setup instructions to tx CHANGELOG and README\r\n\r\n* Add all CHANGELOG files\r\n\r\n* Bump versions for block, blockchain, client and common, give internal verkle dependencies a caret range\r\n\r\n* Bump versions for devp2p, ethash, evm and genesis\r\n\r\n* Bump versions for statemanager, trie, tx and util\r\n\r\n* Bump versions for verkle, vm and wallet\r\n\r\n* Add changes from Preimage PR #3143\r\n\r\n* Added monorepo-wide docs:build command to root package.json\r\n\r\n* Rebuild docs\r\n\r\n* Update README and example files\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add various continued work PRs to the CHANGELOG entries\r\n\r\n* Bump EVM to v3.0.0 and VM to v8.0.0 (in-between breaking releases due to new EVM async create() constructor)\r\n\r\n* Rebuild package-lock.json\r\n\r\n* Add additional EVM/VM breaking release CHANGELOG notes, slight simplification of EVM.create() constructor calling\r\n\r\n* Add additional EVM/VM breaking release README notes\r\n\r\n* Rebuild docs\r\n\r\n* Some TypeScript test fixes\r\n\r\n* More CHANGELOG additions\r\n\r\n* Update CHANGELOG files (small PRs)\r\n\r\n* Update KZG related CHANGELOG and README entries and example code\r\n\r\n* EVM: make main constructor protected",
          "timestamp": "2024-03-18T13:21:44+01:00",
          "tree_id": "bd3a07636455f586ce7af9aeb2c3473d04211f91",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/48e6a301f32274d13e72ced26ba60df10ce2008a"
        },
        "date": 1710764840975,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42879,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40387,
            "range": "±3.78%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41189,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40254,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39548,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "willcory10@gmail.com",
            "name": "Will Cory",
            "username": "roninjin10"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30667e8424be5b8ff974c1011662ea0bcd0d2602",
          "message": "chore(common): Update Optimism hardfork (#3325)\n\n* chore(common): Update Optimism hardfork\r\n\r\n* Update packages/common/src/common.ts\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-03-20T13:36:21+01:00",
          "tree_id": "7a46828c802aa0f3efc611068b7cb78a5104b9e4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/30667e8424be5b8ff974c1011662ea0bcd0d2602"
        },
        "date": 1710938360559,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43471,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41070,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41683,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40534,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39843,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "89 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "willcory10@gmail.com",
            "name": "Will Cory",
            "username": "roninjin10"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5b3aa34d7c4aaef1089e58c915b61d9d53d0b27",
          "message": "fix: Export EVMOpts (#3334)\n\n* fix: Export EVMOpts\r\n\r\nEVMOpts are part of the EVM class but not publically available. Making it public has a few benefits:\r\n1. Makes it so typedoc can properly link to docs for EVMOpts\r\n2. Makes it so external users extend these options\r\n\r\n* fix: linter\r\n\r\n* docs: regenerate\r\n\r\n---------\r\n\r\nCo-authored-by: Will Cory <willcory@Wills-MacBook-Pro.local>",
          "timestamp": "2024-03-25T10:40:54+01:00",
          "tree_id": "156a89c245e7c0ea1b8874f13aa82bdc385df6db",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f5b3aa34d7c4aaef1089e58c915b61d9d53d0b27"
        },
        "date": 1711359836871,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42934,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41104,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41361,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40522,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36361,
            "range": "±5.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "70436988+exitatmosphere@users.noreply.github.com",
            "name": "Dmitriy",
            "username": "exitatmosphere"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d4592f8c335659b589f1c2db6795742769267690",
          "message": "fix `readline` import (#3331)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2024-03-25T10:21:37-04:00",
          "tree_id": "c5a0d5257da1d860112d4c8cb3dcf64328334aa4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d4592f8c335659b589f1c2db6795742769267690"
        },
        "date": 1711376676596,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42828,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42133,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42043,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40815,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36790,
            "range": "±5.66%",
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
          "id": "f3feabc34ec4ecdafbba4eaf09c9ef9d419f5ad4",
          "message": "common: configure and fix kaustinen4 verkle testnet sync (#3269)\n\n* common: configure syncing kaustinen3 verkle testnet\r\n\r\n* fix the vmexecution  for verkle stateless init\r\n\r\n* track and ignore the BLOCKHASH witness to avoid k3 blockhash issues\r\n\r\n* remove the tx to/from access fees\r\n\r\n* setup kaunstinen3 block15 stateless test execution for debugging\r\n\r\n* fix charging and waiving of tx origin/dest access fees\r\n\r\n* configure to run kaustinen4\r\n\r\n* setup to test the failing block 368\r\n\r\n* debug and fix the code chunking boundary conditions\r\n\r\n* skip missing chunk lookup on the invalid opcode if code not loaded from state/witness\r\n\r\n* setup to debug the failing block374 in spec\r\n\r\n* fix genesis spec\r\n\r\n* add block353 to the test spec and help debug nethermind/besu for access costs\r\n\r\n* add partial account functionality and set stateless verkle manager to use it\r\n\r\n* load all partial basic data in account and use the same in the get contact size/code\r\n\r\n* debug and fix block372 working including stem hack for k4\r\n\r\n* sync further and now setup failing block 479 for debugging\r\n\r\n* change stem formation for addresses less than 20 bytes to match kaustinen4 spec\r\n\r\n* update test to test more than one block\r\n\r\n* add capability to test spec run blocks off beacon url\r\n\r\n* debug and handle if CL returns payload with snake case witness\r\n\r\n* fix the comment\r\n\r\n* vm: clear verkle cache in runBlock if opt is true\r\n\r\n* add functionality to start stateless execution from any block in chain\r\n\r\n* configure client to decouple execution and keep syncing despite chain exec failing\r\n\r\n* modify the client to continue syncing ignoring block failures\r\n\r\n* save failing blocks if indicated by the flag\r\n\r\n* update test to pick generated testcases from dir\r\n\r\n* debug and add missing data in toexecutionwitness\r\n\r\n* fix the test spec for various scenarios\r\n\r\n* add witness errors to the debug log\r\n\r\n* debug and fix the issue for slot mismatch of a valid block - 521\r\n\r\n* add hack to get over the stem matching issue of kaustinen4 by bruteforcing actual and modifed stem calcs\r\n\r\n* allow one to provide witnesses to a rlped block via opts\r\n\r\n* restore stem calc to correct one\r\n\r\n* apply fix for codechunk comparision and better post state mismatches tracking\r\n\r\n* setup the kaustinen4 spec test to use geth test vectors\r\n\r\n* remove the code creation cost and fix the code creation write cost and fix the missing pass of witness\r\n\r\n* fix charging code read acceses for codecopy if from calldata and remoce gas charge on non zero value transfer\r\n\r\n* debug and match the create opcode gas consumptions\r\n\r\n* commit new vestors and a fix for the contract create costs to not charge sendvalue\r\n\r\n* add blockhash set/get accesses and remove ignoring them from post state witness checks\r\n\r\n* remove cold cost for sload and sstore\r\n\r\n* debug and fix 3 testcases in verkle stateless manager spec\r\n\r\n* fix rest of spec\r\n\r\n* make the get contract size optional in interface\r\n\r\n* fix lint\r\n\r\n* fix vm api test\r\n\r\n* restore kaustinen2 genesis for preimages spec\r\n\r\n* client spec and lint fixes\r\n\r\n---------\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2024-03-26T16:19:38+01:00",
          "tree_id": "2aeee6a5b9b6d243fe4248cc21aaee72c061beed",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f3feabc34ec4ecdafbba4eaf09c9ef9d419f5ad4"
        },
        "date": 1711466567111,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42895,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42417,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42406,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40710,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37224,
            "range": "±6.52%",
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
          "id": "5e1e8210f830edb6f2b140614af36b58aa9d9587",
          "message": "Add Drips Network FUNDING.json file (#3339)",
          "timestamp": "2024-03-28T21:05:26+01:00",
          "tree_id": "ce0d860509f832d0beaa6ea76bc8139af43eabb1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5e1e8210f830edb6f2b140614af36b58aa9d9587"
        },
        "date": 1711656653167,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42964,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 42166,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41983,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 40760,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35711,
            "range": "±7.56%",
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
          "id": "107660ec8430237026f45937a698cdc77d35c5b7",
          "message": "Use capitalized version for FUNDING.json (#3340)",
          "timestamp": "2024-03-28T21:59:32+01:00",
          "tree_id": "ef13442b4f686f5075c50f3f2710fab41b7702c1",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/107660ec8430237026f45937a698cdc77d35c5b7"
        },
        "date": 1711660381180,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43294,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40854,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41263,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41063,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39663,
            "range": "±1.72%",
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
          "id": "ad6c603d5f3018bb86bd13ff5d2fce46321cde91",
          "message": "monorepo: remove EIP 2315 (JUMPSUB) (#3342)\n\n* monorepo: remove EIP 2315 (JUMPSUB)\r\n\r\n* fix tests\r\n\r\n* Remove obsolete check for BEGINSUB\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-03T11:14:19-04:00",
          "tree_id": "33cf3afebef6f68de5ff3a5a9e2ec0b580ea6743",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ad6c603d5f3018bb86bd13ff5d2fce46321cde91"
        },
        "date": 1712157550004,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43499,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41488,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 42424,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422908",
            "value": 41432,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39847,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "87 samples"
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
          "id": "4be68d23c6390cca46b3235948f127707436f6fc",
          "message": "fix: run npm audit fix (#3346)",
          "timestamp": "2024-04-06T12:24:08-04:00",
          "tree_id": "c4b9d3b4558d7ad1131bf02d7e4bc9d8cf9c89aa",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4be68d23c6390cca46b3235948f127707436f6fc"
        },
        "date": 1712420816032,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41446,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39983,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 39989,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39391,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 39051,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "90 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "5858657+pldespaigne@users.noreply.github.com",
            "name": "pldespaigne",
            "username": "pldespaigne"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5045b0a501a66504d9aec9e6ad3fd817682cbbf",
          "message": "Fix ts-doc typo (#3347)\n\n* Fix ts-doc typo\r\n\r\n* fix indent",
          "timestamp": "2024-04-08T11:29:07-04:00",
          "tree_id": "a5b7d4a774974840d9795a4811d2ae0608d2a234",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/e5045b0a501a66504d9aec9e6ad3fd817682cbbf"
        },
        "date": 1712590814036,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41100,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40201,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40349,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39577,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35306,
            "range": "±5.82%",
            "unit": "ops/sec",
            "extra": "80 samples"
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
          "id": "44bbdd577fc889c25a8ab1faba5befbbac34d9a0",
          "message": "devp2p: increase timeout for test that sometimes fails in ci (#3351)",
          "timestamp": "2024-04-09T10:30:51+02:00",
          "tree_id": "db4765db042239f409dd5295c8c2b4ef96808642",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/44bbdd577fc889c25a8ab1faba5befbbac34d9a0"
        },
        "date": 1712651619030,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42056,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40263,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40758,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39454,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35217,
            "range": "±6.37%",
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
          "id": "6eccff78415190ea4e76f7b5a813a181c39daf15",
          "message": "common: configure and sync/fix verkle kaustinen5 (#3343)\n\n* common: configure and sync/fix verkle kaustinen5\r\n\r\n* apply fixes for 2020 sload cost removal and storage comparision when non existent storage written with zero\r\n\r\n* review 4762 and refactor/apply access fixes as well as partial account contract related fixed\r\n\r\n* debug and add contract complete accesses even when contract is created with no initcode\r\n\r\n* debug and fix the warm sload cost\r\n\r\n* debug failing block 114 and 157 and add missing accesses for codehash and balance\r\n\r\n* debug and fix the 2935 ringbuffer access\r\n\r\n* cleanup and commit the k5 fixes\r\n\r\n* lint fix",
          "timestamp": "2024-04-11T07:09:23-04:00",
          "tree_id": "636e209091d212cb0498c2a5246ee6d90064c89c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6eccff78415190ea4e76f7b5a813a181c39daf15"
        },
        "date": 1712833931787,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 41922,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 41201,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40772,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 37115,
            "range": "±6.92%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38626,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "86 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rodrigoheitie@hotmail.com",
            "name": "Rodrigo Herrera",
            "username": "rodrigoherrerai"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7d960df99d3fbc0113fa3b8d1ff8af518d235624",
          "message": "modify rpcStataManager getAccount (#3345)\n\n* modify rpcStataManager getAccount\r\n\r\n* fix type error\r\n\r\n* Update mock provider response for getProof on non-existent account to mirror infura\r\n\r\n* Update nonexistent account check to compare bytes\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2024-04-12T13:40:52-04:00",
          "tree_id": "7b7ecde89eddc5ed22f27e431ec4b77b223c328d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7d960df99d3fbc0113fa3b8d1ff8af518d235624"
        },
        "date": 1712943826196,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 42424,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40202,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 40756,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39681,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 38530,
            "range": "±1.80%",
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
          "id": "babbe20047afc0f7ad6c719b180b462bd8a74ea7",
          "message": "client: fix misc tsc issues (#3349)\n\n* client: fix misc tsc issues\n\n* Merge branch 'master' into client/fix-tsc-issues\n\n* Merge branch 'master' into client/fix-tsc-issues",
          "timestamp": "2024-04-15T21:03:03-04:00",
          "tree_id": "19b9be953d359cb86ab588555d79453dc52932eb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/babbe20047afc0f7ad6c719b180b462bd8a74ea7"
        },
        "date": 1713229733838,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 43034,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422906",
            "value": 40506,
            "range": "±3.08%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 41065,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 39977,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422910",
            "value": 35350,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "79 samples"
          }
        ]
      }
    ]
  }
}