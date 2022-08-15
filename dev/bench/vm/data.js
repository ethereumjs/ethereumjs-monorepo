window.BENCHMARK_DATA = {
  "lastUpdate": 1660563018881,
  "repoUrl": "https://github.com/ethereumjs/ethereumjs-monorepo",
  "entries": {
    "Benchmark": [
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
          "id": "049c2a5159c44019910c932222d37e2435e1da9e",
          "message": "evm: add new exports requested by hardhat (#2063)\n\n* evm: add new exports requested by hardhat\r\n\r\n* vm: update typedoc\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2022-07-29T10:00:02-04:00",
          "tree_id": "f651de6c18c8ab29127ec647ad221b4327d77df5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/049c2a5159c44019910c932222d37e2435e1da9e"
        },
        "date": 1659103417462,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 11166,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 11511,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11009,
            "range": "±5.66%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11176,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11123,
            "range": "±2.66%",
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
          "id": "0b166bef0ff863d918e9f1e2a32e996edeb61d09",
          "message": "Optimize the github workflow checkouts (#2082)\n\n* Optimize the github workflow checkouts\r\n\r\n* revert recursive checkout as block and tx use eth tests\r\n\r\n* revert recursive checkout for vm state tests as they use eth tests\r\n\r\n* revert recursive vm blockchain tests as they use eth tests\r\n\r\n* revert recursive for vm covergae tests it has state tests which uses eth tests\r\n\r\n* move recurive from vm build to vm pr\r\n\r\n* enable recursive for vm build workflow for coverage state and blockchain tests\r\n\r\n* add recusive checkout in vm nightly slow tests",
          "timestamp": "2022-07-30T17:44:02+05:30",
          "tree_id": "a93a2273b961a4fdcc151e15cbff24185eda4b98",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0b166bef0ff863d918e9f1e2a32e996edeb61d09"
        },
        "date": 1659183395104,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 11911,
            "range": "±4.80%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12670,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11141,
            "range": "±6.23%",
            "unit": "ops/sec",
            "extra": "73 samples"
          },
          {
            "name": "Block 9422908",
            "value": 11812,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11868,
            "range": "±3.17%",
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
          "id": "2f9f3ea5e00fe05620e282a7fcef99593eeea027",
          "message": "client: allow eth_call without to for testing contract creation (#2084)",
          "timestamp": "2022-07-31T21:44:04+05:30",
          "tree_id": "f5940296e3c2b081784893c7123d34ac0690aa97",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2f9f3ea5e00fe05620e282a7fcef99593eeea027"
        },
        "date": 1659284185276,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18675,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17487,
            "range": "±7.00%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18286,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17850,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17898,
            "range": "±2.96%",
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
          "id": "6967774f40777d0438e8308caa5b9e3e7393f277",
          "message": "common: set the default hard fork to merge (#2087)\n\n* common: set the default hard fork to merge\r\n\r\n* Set hardfork to london in merge test\r\n\r\n* fix hardfork in miner integration test\r\n\r\n* update default in docs\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-01T23:50:25+05:30",
          "tree_id": "6109a591b9484fbe2344573e9640605b83b19374",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6967774f40777d0438e8308caa5b9e3e7393f277"
        },
        "date": 1659378148762,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23161,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22469,
            "range": "±4.40%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22884,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20868,
            "range": "±7.76%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22328,
            "range": "±5.22%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "afead41142ceb458a7f1377ff2a0228860cb274b",
          "message": "chore: set up `eslint-plugin-simple-import-sort` and `eslint-plugin-import` (#2086)",
          "timestamp": "2022-08-03T11:37:44+02:00",
          "tree_id": "3d2f0651bcfb434259bcad0e215dbd0c605f0139",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/afead41142ceb458a7f1377ff2a0228860cb274b"
        },
        "date": 1659519611052,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23323,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22401,
            "range": "±4.01%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22674,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22529,
            "range": "±1.80%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20080,
            "range": "±11.34%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "674b6e032444dfb724aff461a888335994ad1f62",
          "message": "chore: wip (#2093)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-03T13:28:07+02:00",
          "tree_id": "6de10e713fb7eb08b037273b5ca1e55bf1c942cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/674b6e032444dfb724aff461a888335994ad1f62"
        },
        "date": 1659526696674,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22923,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21779,
            "range": "±4.52%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22174,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21674,
            "range": "±4.08%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19041,
            "range": "±11.73%",
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
          "id": "5dc46fec979d46ff497d7f2db32135c78f62f451",
          "message": "client: Run execution in batches when not near head (#2096)\n\n* client: Run execution in batches when not near head\r\n\r\n* relax batching condition a bit\r\n\r\n* match the sync target height update text\r\n\r\n* relax batch condition for full sync",
          "timestamp": "2022-08-03T22:41:43+05:30",
          "tree_id": "1ccadb3dfd8e4d2376ad0ac5b5f73043f9ac3677",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/5dc46fec979d46ff497d7f2db32135c78f62f451"
        },
        "date": 1659546827091,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21565,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20793,
            "range": "±5.65%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21489,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21370,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18909,
            "range": "±10.57%",
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
          "id": "1d1c4e97dfdfc7a6a7fd629cbfb6a3ed85c6774e",
          "message": "common: Update the mergeForkIdTransition hardfork schedule (#2098)",
          "timestamp": "2022-08-03T18:34:18-04:00",
          "tree_id": "d07b4e789dffb5be7f0ce04e7b092a128c2a3752",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/1d1c4e97dfdfc7a6a7fd629cbfb6a3ed85c6774e"
        },
        "date": 1659566190244,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22161,
            "range": "±2.85%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21179,
            "range": "±5.90%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21798,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20805,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18299,
            "range": "±12.39%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "c7a8bec13d9a4d6dbb09bbf00775e679aca7a2b7",
          "message": "test(trie): run persistence suite for all types of tries (#2094)\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-03T21:23:56-04:00",
          "tree_id": "a35cff49bb3cf89587f1ddeaf146cd4f52b48579",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c7a8bec13d9a4d6dbb09bbf00775e679aca7a2b7"
        },
        "date": 1659576373702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21380,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20444,
            "range": "±6.79%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20637,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20393,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18032,
            "range": "±9.66%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "79163c0244dc87d3d207de89f0f3f04d07471ac3",
          "message": "chore: rename `rlp` package to `@ethereumjs/rlp` (#2092)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-04T10:30:25+02:00",
          "tree_id": "116d487cccdf42a67d991d850afbaaa55c355f88",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/79163c0244dc87d3d207de89f0f3f04d07471ac3"
        },
        "date": 1659601973560,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22843,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22196,
            "range": "±5.03%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22137,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22310,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20831,
            "range": "±8.42%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "623d8a0e4be6e5968314cb64cf305f96cf6ba873",
          "message": "chore: upgrade `eslint` to `^8.0.0` (#2095)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update .eslintrc.js\r\n\r\n* Update README.md\r\n\r\n* Update README.md",
          "timestamp": "2022-08-04T11:55:54+02:00",
          "tree_id": "557db3e86e97c71bab427634379e54853104dea5",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/623d8a0e4be6e5968314cb64cf305f96cf6ba873"
        },
        "date": 1659607122158,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20083,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18947,
            "range": "±6.66%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19661,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19394,
            "range": "±2.56%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17275,
            "range": "±10.49%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "80b08796399e39409d3e1901af8e7d58ffb95c2f",
          "message": "client: Add client protocol and synchronizer for snap sync (#1897)\n\n* a small add for client\r\n\r\n* don't offer snap yet, try only consuming from other peers\r\n\r\n* Add snap protocol/methods availability in the peer\r\n\r\n* Snap sync syncronizer stub\r\n\r\n* client: send empty list in case of non-existing headers\r\n\r\n* setup snap sender to make request\r\n\r\n* devp2p: fix ETH66 length\r\n\r\n* devp2p: update eth65/eth64 protocol length\r\n\r\n* client/snapsync: fix GetAccountRange encoding\r\n\r\n* decode account range response\r\n\r\n* Add other methods of snapsync\r\n\r\n* rebase fixes for new master\r\n\r\n* enable running snapsync with a forceSnapSync flag\r\n\r\n* fix fullethereumservice spec\r\n\r\n* fix rlpxpeer spec\r\n\r\n* compare directly to undefined\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* incorporate some review suggestions\r\n\r\n* compare directly to undefined\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* fix snap availability conditional\r\n\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-05T01:35:17+05:30",
          "tree_id": "b6fccdea54716bde8fed3f3fdb5577876a88d27d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/80b08796399e39409d3e1901af8e7d58ffb95c2f"
        },
        "date": 1659643659673,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19366,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18733,
            "range": "±5.33%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19186,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19170,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 16225,
            "range": "±10.46%",
            "unit": "ops/sec",
            "extra": "66 samples"
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
          "id": "291d698abed15ce7a2bfade97e768d00a70ed0fc",
          "message": "ci: retry `test-client` and `test-client-cli` jobs up to 3 times (#2104)\n\n* ci: retry `test-client-cli` job up to 3 times\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nchore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-05T05:46:29-04:00",
          "tree_id": "4937b0a268d394d7386aa23791590c2cedee1bd6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/291d698abed15ce7a2bfade97e768d00a70ed0fc"
        },
        "date": 1659692919703,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21750,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20681,
            "range": "±4.78%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21342,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21246,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18529,
            "range": "±10.35%",
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
          "id": "29493bced079f1cd57eac2562566aebebfb6cc9c",
          "message": "vm/blockchain: change and use BlockchainInterface (#2069)\n\n* vm/blockchain: change and use BlockchainInterface\r\n\r\n* vm: throw if header cannot be validated\r\n\r\n* blockchain: Add interface bits for client build\r\n\r\n* Add jsdocs to interface for new methods\r\n\r\n* Add last missing function and update docs\r\n\r\n* vm: add test for error case\r\n\r\n* Make most properties optional\r\n\r\n* fix example\r\n\r\n* typo\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-05T12:32:50+02:00",
          "tree_id": "2d1b2efcbb0dedec97b4df4ea2de1e45ff77be3c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/29493bced079f1cd57eac2562566aebebfb6cc9c"
        },
        "date": 1659695698001,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23325,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22607,
            "range": "±4.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22631,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20164,
            "range": "±9.00%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22790,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "86 samples"
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
          "id": "f6c12b97f10ec420a2f094a0c9eade8d7082d987",
          "message": "trie: remove unnecessary temp variables and buffer creation (#2103)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-05T07:26:44-04:00",
          "tree_id": "3107318484197d860674a6168e6e9567f8181871",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f6c12b97f10ec420a2f094a0c9eade8d7082d987"
        },
        "date": 1659698951429,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 14286,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 14599,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 13722,
            "range": "±5.69%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 13882,
            "range": "±2.75%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 13688,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
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
          "id": "0add7930a831c22e5f0397e3a2a07446d94d371e",
          "message": "chore(trie): add database example scripts (#2109)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update lmdb.js\r\n\r\n* Update lmdb.js",
          "timestamp": "2022-08-08T13:45:18+02:00",
          "tree_id": "42355fbc63982eda529eea77bf595fd13126249c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0add7930a831c22e5f0397e3a2a07446d94d371e"
        },
        "date": 1659959276887,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21767,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20566,
            "range": "±6.51%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21482,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21383,
            "range": "±2.19%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18982,
            "range": "±10.39%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "6c651af01d83b5ac4d41d57534389f880f24c2bb",
          "message": "ci: retry `devp2p` workflow up to 3 times (#2115)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-08T14:10:00+02:00",
          "tree_id": "eaa7cf44cf7ed97ac4f189d83140273202149089",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6c651af01d83b5ac4d41d57534389f880f24c2bb"
        },
        "date": 1659960819738,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23235,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22314,
            "range": "±4.75%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22633,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22399,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20366,
            "range": "±10.15%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "7247e69a80464fb6ab746126e82c16fb4f69c505",
          "message": "chore: run `prettier` on push for JSON and Markdown files (#2113)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n* chore: run `prettier` on push for JSON and Markdown files",
          "timestamp": "2022-08-08T21:31:47-04:00",
          "tree_id": "b9a012f17f2f16f4023f57c081b792226edae873",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7247e69a80464fb6ab746126e82c16fb4f69c505"
        },
        "date": 1660009136904,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21908,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21334,
            "range": "±4.90%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21499,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21363,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19244,
            "range": "±9.66%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "b049bee835d0945cd796b4bc54fcc3650662728b",
          "message": "chore: fix documentation building (#2118)\n\n* chore: wip\n\n* chore: wip\n\n* chore: wip\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\n\n* chore: wip\n\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-08T22:10:52-04:00",
          "tree_id": "732e639f9ff605263fd1ccb9861bd4426b524f22",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b049bee835d0945cd796b4bc54fcc3650662728b"
        },
        "date": 1660011419463,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18016,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17434,
            "range": "±6.09%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17575,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17686,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 15443,
            "range": "±10.12%",
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
          "id": "8a2a9ce20491db7b4184546b635d7ed828a8d124",
          "message": "client: Make fetcher typesafe in syncronizers (#2120)\n\n* client: Make fetcher typesafe in syncronizers\r\n\r\n* pass the forceSnapSync flag from arg to config\r\n\r\n* add spacing in getter",
          "timestamp": "2022-08-09T13:34:34+02:00",
          "tree_id": "d2db5c36ef2c34d0033e930cc653fdaffb19bcba",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8a2a9ce20491db7b4184546b635d7ed828a8d124"
        },
        "date": 1660045149793,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21592,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20733,
            "range": "±5.71%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20987,
            "range": "±2.16%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20915,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18455,
            "range": "±10.20%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "c1ee333c6c8b9a420a77cd2c1e921eff6c037abc",
          "message": "Make the client browser implementation work again... (#2091)\n\n* Initial work on client browser build\r\n\r\n* Browser tests work again\r\n\r\n* fix libp2p spelling bug\r\n\r\n* Fix import\r\n\r\n* replace util so jayson is excluded\r\n\r\n* Fix import\r\n\r\n* Add util polyfill\r\n\r\n* update readme, turn off source maps\r\n\r\n* Fix encoding error\r\n\r\n* Turn on debug logs in browser\r\n\r\n* instantiate blockchain in browser\r\n\r\n* remove sourcemaps, remove isTruthy\r\n\r\n* cleanup readme\r\n\r\n* fix test\r\n\r\n* remove unused import",
          "timestamp": "2022-08-10T11:34:00+02:00",
          "tree_id": "f0502ec89fef0b6e2911d1c08a2b12e610537eb6",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c1ee333c6c8b9a420a77cd2c1e921eff6c037abc"
        },
        "date": 1660124204208,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23244,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22208,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22511,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20930,
            "range": "±7.91%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22826,
            "range": "±5.06%",
            "unit": "ops/sec",
            "extra": "90 samples"
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
          "id": "77ead1b8f1b0661856e9f2fd951e7235d8ef8557",
          "message": "client: snap protocol tests (#2119)\n\n* Add snapprotocol tests\r\n\r\n* Add snapsync tests",
          "timestamp": "2022-08-10T17:15:44+05:30",
          "tree_id": "32c9988ff6bb1565190593758ce50b25ce4c90cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/77ead1b8f1b0661856e9f2fd951e7235d8ef8557"
        },
        "date": 1660132106077,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22127,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21156,
            "range": "±5.52%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21228,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21130,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19611,
            "range": "±9.25%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "f9b314a335b5bff51329cfc9bbf78fc07906a7f6",
          "message": "refactor(trie): default to `false` for `persistRoot` option (#2123)",
          "timestamp": "2022-08-10T09:41:39-04:00",
          "tree_id": "ed4c2c27ae92d3c1ee6735b565b400185e1aa3e2",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/f9b314a335b5bff51329cfc9bbf78fc07906a7f6"
        },
        "date": 1660139064098,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23180,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22228,
            "range": "±4.51%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22575,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22300,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 20853,
            "range": "±7.95%",
            "unit": "ops/sec",
            "extra": "79 samples"
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
          "id": "33e0c22dcd8c69849dd2438c197b713fb38fa3cb",
          "message": "chore(trie): add `gabrocheleau/merkle-patricia-trees-examples` with 5.0.0 compatibility (#2110)\n\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\n* Update packages/trie/examples/README.md\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-11T10:53:55+02:00",
          "tree_id": "853fc05fa8e3ec248b7228a004dcfcf1e3e69b76",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/33e0c22dcd8c69849dd2438c197b713fb38fa3cb"
        },
        "date": 1660208279076,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 12684,
            "range": "±3.92%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12775,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 12490,
            "range": "±6.34%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12815,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 12220,
            "range": "±2.76%",
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
          "id": "8c1d34d43119819fcd4da4c44e07b7c2ca1f807b",
          "message": "Monorepo Beta 3 Releases (#2122)\n\n* Bumped version, added CHANGELOG, updated upstream library versions (Block v4.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (Blockchain v6.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (Common v3.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (devp2p v5.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (ethash v2.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (evm v1.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (rlp v4.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (statemanager v1.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (trie v5.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (tx v4.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (util v8.0.0-beta.3)\r\n\r\n* Bumped version, added CHANGELOG, updated upstream library versions (vm v6.0.0-beta.3)\r\n\r\n* Common version correction\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\n\r\n* Client: bumped version to v0.6.1, added CHANGELOG\r\n\r\n* Updated/regenerated package-lock.json\r\n\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2022-08-11T17:08:54+02:00",
          "tree_id": "37df7cfeb4ea55497af14868772db895a43dcd98",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/8c1d34d43119819fcd4da4c44e07b7c2ca1f807b"
        },
        "date": 1660230703705,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22022,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21036,
            "range": "±4.98%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21558,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21397,
            "range": "±2.11%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19363,
            "range": "±8.98%",
            "unit": "ops/sec",
            "extra": "73 samples"
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
          "id": "06dc4d92e71579c7fc15994cff4c8e6b298117da",
          "message": "Upgrade jayson to v4.0 (#2129)",
          "timestamp": "2022-08-12T13:42:03-04:00",
          "tree_id": "aade061b3664db0ff1db1b6b1b799dc183438ceb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/06dc4d92e71579c7fc15994cff4c8e6b298117da"
        },
        "date": 1660326287331,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 11962,
            "range": "±4.93%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 12059,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422907",
            "value": 11139,
            "range": "±6.00%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422908",
            "value": 12013,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 11507,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "76 samples"
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
          "id": "b102f67c30f27963bbb20afc9ae3438bff95c940",
          "message": "chore: wip (#2127)\n\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-15T11:00:04+02:00",
          "tree_id": "95e57b0a81afe068be552a627778ceefb688acb3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b102f67c30f27963bbb20afc9ae3438bff95c940"
        },
        "date": 1660554131455,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21967,
            "range": "±3.22%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21229,
            "range": "±5.31%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21567,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19192,
            "range": "±9.29%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21758,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "85 samples"
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
          "id": "b5bcc79bfe385bff7ded147e0330e6e889091b93",
          "message": "docs: update README formatting (#2121)\n\n* docs(trie): update README\r\n\r\n* chore: wip\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>\r\n\r\nSigned-off-by: Brian Faust <hello@basecode.sh>",
          "timestamp": "2022-08-15T11:46:53+02:00",
          "tree_id": "81f96fd0d0213e60ca2a316054c37551389d4d55",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b5bcc79bfe385bff7ded147e0330e6e889091b93"
        },
        "date": 1660556951387,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22270,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 21503,
            "range": "±6.18%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21763,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21528,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19349,
            "range": "±10.81%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "4347f8b8263bd4de18a92e54eb6c3e1466dfb65e",
          "message": "chore: enable `eqeqeq` rule for `eslint` (#2134)",
          "timestamp": "2022-08-15T13:17:02+02:00",
          "tree_id": "dda4f3b716c0e3da5bae0901170998b4d2ba795a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4347f8b8263bd4de18a92e54eb6c3e1466dfb65e"
        },
        "date": 1660562351579,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 22181,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20883,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21713,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 21161,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18379,
            "range": "±11.39%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "7b97a2536eb47a810791b5793328c113758c49fc",
          "message": "blockchain: align comment and code for getIteratorHead() (#2126)",
          "timestamp": "2022-08-15T13:22:20+02:00",
          "tree_id": "97cfa8e3a4189425f0e4d4cf25138995b1a71b03",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7b97a2536eb47a810791b5793328c113758c49fc"
        },
        "date": 1660563017793,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 21678,
            "range": "±2.32%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20478,
            "range": "±6.59%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 21034,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 20967,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18482,
            "range": "±10.27%",
            "unit": "ops/sec",
            "extra": "71 samples"
          }
        ]
      }
    ]
  }
}