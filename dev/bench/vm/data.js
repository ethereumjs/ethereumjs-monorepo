window.BENCHMARK_DATA = {
  "lastUpdate": 1699372799314,
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
          "id": "02a7abb2f767b8bafdb7fa7e4440e69bd618c67c",
          "message": "Client: More UI Improvements / Fix TxPool not being started along FCU (#3100)\n\n* Client: expand super msgs to also take in multiline output\r\n\r\n* Client: adjust CL disconnect thresholds to avoid reconnect messages\r\n\r\n* Client: add note to explain subchains on subchain creation\r\n\r\n* Client: fix synchronized setting on FCU\r\n\r\n* Client: make tx pool started a super msg\r\n\r\n* fix switching client to syncronized state and start txpool\r\n\r\n---------\r\n\r\nCo-authored-by: harkamal <gajinder@g11.in>",
          "timestamp": "2023-10-11T17:54:08+05:30",
          "tree_id": "3168fb310cf386a2eadaf42fbcf785954971ce9d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/02a7abb2f767b8bafdb7fa7e4440e69bd618c67c"
        },
        "date": 1697027335122,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19125,
            "range": "±6.26%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422906",
            "value": 19800,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422907",
            "value": 19525,
            "range": "±3.92%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19914,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19192,
            "range": "±3.47%",
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
          "id": "2405da8d5c9ace9601f0312c48b7be997a9a8c29",
          "message": "Code cache should be able to save prestate without reading from statemanager DB (#3080)\n\n* Await accountEval when using it's return value in asserts\r\n\r\n* Fix account cache revert and _saveCachePreState\r\n\r\n* Do not use value from db for putting code into cache\r\n\r\n* Fix prestate save and revert logic\r\n\r\n* Update packages/statemanager/src/cache/code.ts\r\n\r\n* Check if key exists in map before checking the element to not overwrite undefined values\r\n\r\n* Change code comment to be more clear\r\n\r\n* Simplify save prestate check\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-12T11:10:03+02:00",
          "tree_id": "39b404bf239d2cea353a7c49e506bac345ca6f7a",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2405da8d5c9ace9601f0312c48b7be997a9a8c29"
        },
        "date": 1697102009095,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30312,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29588,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29725,
            "range": "±2.47%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28271,
            "range": "±4.98%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23874,
            "range": "±10.81%",
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
          "id": "a4d60587409cf423159b07c03482ae37f2739f7e",
          "message": "Change rpcDebug option to allow enabling/disabling specific rpc module logs (#3102)\n\n* Change rpcDebug option to allow enabling/disabling specific rpc module logs\r\n\r\n* Client: generalize --rpcDebug functionality to allow for arbitrary filters\r\n\r\n* Fix test\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-13T13:35:10+02:00",
          "tree_id": "61667a7312d70fc28f980495b310797f7012c9e7",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a4d60587409cf423159b07c03482ae37f2739f7e"
        },
        "date": 1697197327626,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 27826,
            "range": "±7.83%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28530,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28255,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28255,
            "range": "±3.14%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 26915,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "charmful0x@gmail.com",
            "name": "Darwin",
            "username": "charmful0x"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b4c229b0ec1be3fee052978db28ba904f9b92d0",
          "message": "docs: fix examples URLs path (#3103)",
          "timestamp": "2023-10-15T15:54:53-07:00",
          "tree_id": "283e54d45e40699be81814f068355c6a98e5a295",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/7b4c229b0ec1be3fee052978db28ba904f9b92d0"
        },
        "date": 1697410707046,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29302,
            "range": "±5.54%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28860,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28827,
            "range": "±3.03%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28379,
            "range": "±3.09%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23271,
            "range": "±10.53%",
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
          "id": "a8ac9bb876d474f1fd69ad1c3fc28c9509c99787",
          "message": "client: update c-kzg and use the offical trusted setup (#3107)\n\n* client: update c-kzg and use the offical trusted setup\r\n\r\n* update sims",
          "timestamp": "2023-10-20T09:10:58-04:00",
          "tree_id": "31c1f088375d0d53aa612fc59c18183ada53c21d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/a8ac9bb876d474f1fd69ad1c3fc28c9509c99787"
        },
        "date": 1697807668611,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28772,
            "range": "±5.35%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28741,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28516,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28501,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23379,
            "range": "±10.68%",
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
          "id": "df8c441ca06c88f35917fc452426ed0e11d45271",
          "message": "monorepo: address babel vulnerability (#3108)",
          "timestamp": "2023-10-21T19:17:13-04:00",
          "tree_id": "a4f73bb66a8bbaf22401b8efeb5c856e5e437dc8",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/df8c441ca06c88f35917fc452426ed0e11d45271"
        },
        "date": 1697931397727,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30153,
            "range": "±4.82%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29474,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29436,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28853,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24231,
            "range": "±10.96%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "d282e2e35258aa2751ba3828347d2ba99775df0c",
          "message": "trie: refactor lock class (#3109)\n\n* trie: refactor lock\r\n\r\n* trie: merge lock tests",
          "timestamp": "2023-10-22T01:01:33+01:00",
          "tree_id": "28db7d09722b48d50523c8128dc37205f009db2c",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/d282e2e35258aa2751ba3828347d2ba99775df0c"
        },
        "date": 1697933100261,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28728,
            "range": "±4.81%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28850,
            "range": "±2.83%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28571,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28209,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23314,
            "range": "±10.62%",
            "unit": "ops/sec",
            "extra": "71 samples"
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
          "id": "eeb74e4b55972678092bb3a24a8485b996b632de",
          "message": "Change execution stats intervals (#3106)\n\n* Report execution stats in time intervals\r\n\r\n* Format constant\r\n\r\n* Remove unused property\r\n\r\n* Client: further reduce execution/state stats interval from 40 -> 90 secs\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-23T10:23:25+02:00",
          "tree_id": "6368583ac94055591591c9e54cd8e1deb43b67dd",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/eeb74e4b55972678092bb3a24a8485b996b632de"
        },
        "date": 1698049865544,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18367,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 16652,
            "range": "±6.94%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17910,
            "range": "±3.45%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17622,
            "range": "±3.68%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17488,
            "range": "±3.47%",
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
          "id": "61af5c377d65821fb44829d72f9ca4c4ef8716c2",
          "message": "Write tests for slim format conversion helpers (#3114)\n\n* Write tests for slim format conversion helpers\r\n\r\n* Update packages/util/test/account.spec.ts\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-25T10:51:47+02:00",
          "tree_id": "aea45815f16024263ca1e4fc36c1a1870e361bb3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/61af5c377d65821fb44829d72f9ca4c4ef8716c2"
        },
        "date": 1698224156917,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23252,
            "range": "±7.76%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422906",
            "value": 23562,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22624,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22955,
            "range": "±3.56%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22383,
            "range": "±3.63%",
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
          "id": "25696acfeb0b4b0fa8a5bd14a85beb55cc189b55",
          "message": "Util internal tests and fix (#3112)\n\n* Add tests for internal util functions\r\n\r\n* Reimplement fromUtf8 function to not double-add the hex prefix\r\n\r\n* Do not try to pad an already padded string\r\n\r\n* Use bytesToUnprefixedHex for fromUtf8\r\n\r\n* Add more tests\r\n\r\n* Remove unused import\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-25T19:24:46+02:00",
          "tree_id": "99eb0b836cd54e4b1ca8f8bcabe425788f584830",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/25696acfeb0b4b0fa8a5bd14a85beb55cc189b55"
        },
        "date": 1698255109897,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30120,
            "range": "±4.46%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29721,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29527,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28810,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24365,
            "range": "±9.55%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "77292fe70f6fa74b91794c1a4f4567c1e6c2a81d",
          "message": "vm: better error message to avoid confusion with EIP1559 base fee (#3118)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-25T20:40:51+02:00",
          "tree_id": "104526d3b80148d0a49621dcc078381ca15d3782",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/77292fe70f6fa74b91794c1a4f4567c1e6c2a81d"
        },
        "date": 1698259503162,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 20159,
            "range": "±6.32%",
            "unit": "ops/sec",
            "extra": "75 samples"
          },
          {
            "name": "Block 9422906",
            "value": 20586,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 20243,
            "range": "±2.80%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 19780,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422910",
            "value": 19007,
            "range": "±3.31%",
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
          "id": "876e56087698db18aa6f6cbf74f7f9d84843664b",
          "message": "client/pendingBlock: ensure withdrawals only get added if they are not null && not undefined (#3119)\n\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-25T21:14:59+02:00",
          "tree_id": "c19d74577c017451c3e361794ff93835fe56d54d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/876e56087698db18aa6f6cbf74f7f9d84843664b"
        },
        "date": 1698261511353,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28410,
            "range": "±4.95%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28383,
            "range": "±2.92%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28452,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27475,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22653,
            "range": "±12.06%",
            "unit": "ops/sec",
            "extra": "70 samples"
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
          "id": "2353bc7cc72c2f10c8b505c31f02dde6601421d3",
          "message": "verkle: verkle package (#2923)\n\n* verkle: initial commit\r\n\r\n* verkle: scaffold verkle trie implementation and types\r\n\r\n* verkle: fix installation issues\r\n\r\n* verkle: move rust verkle wasm to verkle package\r\n\r\n* verkle: remove package json and readme from rust verkle wasm dir\r\n\r\n* util: add some bigint LE utils for verkle\r\n\r\n* verkle: refactor constants and cryptographic methods to the verkle package\r\n\r\n* verkle: remove unnecessary constants & methods\r\n\r\n* verkle: verkle node classes and types\r\n\r\n* verkle: get method and rawNode utils\r\n\r\n* verkle: handle case where array item is not found\r\n\r\n* verkle: wip findPath method\r\n\r\n* verkle: wip\r\n\r\n* verkle: fromRawNode method\r\n\r\n* verkle: update packages\r\n\r\n* verkle: minor adjustments\r\n\r\n* verkle: wip\r\n\r\n* verkle: add test case for put and get\r\n\r\n* verkle: wip insertstem and related methods for verkle nodes\r\n\r\n* verkle: internal node test\r\n\r\n* verkle: default values and minor fixes to internalNode\r\n\r\n* verkle: make internal verkle node options optional\r\n\r\n* verkle: leafNode basic test\r\n\r\n* verkle: remove unused import\r\n\r\n* verkle: setDepth method for leafNode and commented out code for create method\r\n\r\n* verkle: wip\r\n\r\n* verkle: add Point interface\r\n\r\n* verkle: general cleanup and improvements\r\n\r\n* verkle: minor test adjustments\r\n\r\n* verkle: readme and testing related updates\r\n\r\n* verkle: capital V for verkle workflow\r\n\r\n* Update packages/verkle/README.md\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/verkle/README.md\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/verkle/README.md\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update packages/verkle/README.md\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* verkle: use Lock from util package\r\n\r\n* client: undo removal of link\r\n\r\n* util: update byte<>int conversion helpers\r\n\r\n* verkle: use Uint8Array instead of hexstrings for db\r\n\r\n* verkle: add imports to example\r\n\r\n* verkle: update db to Uint8Arrays\r\n\r\n* verkle: revert to using strings as keys for cache\r\n\r\n* verkle: update crypto import\r\n\r\n* verkle: adjust Key and Value encoding in create method\r\n\r\n* verkle: adjust value encoding in db del method\r\n\r\n* verkle: add missing key and value encoding opts to batch options\r\n\r\n* verkle: remove extra line\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <konjou@gmail.com>\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>",
          "timestamp": "2023-10-26T09:19:07+02:00",
          "tree_id": "ee121eff2f32221d7bcd8fdd078355eec4badada",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/2353bc7cc72c2f10c8b505c31f02dde6601421d3"
        },
        "date": 1698304974548,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29388,
            "range": "±4.76%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29271,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29116,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28459,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24549,
            "range": "±8.78%",
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
          "id": "ffd9ede728b36f44ed631e0b6da261320eeff38e",
          "message": "verkle: fix ci (#3121)\n\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>",
          "timestamp": "2023-10-26T17:15:13-04:00",
          "tree_id": "344a456b0569357cdf5b1c20a412a0e69973b809",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ffd9ede728b36f44ed631e0b6da261320eeff38e"
        },
        "date": 1698355176089,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24543,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22532,
            "range": "±7.00%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23721,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22752,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23136,
            "range": "±3.74%",
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
          "id": "b8480333d91bacd97004c1c6e9f2ed2b28d9e448",
          "message": "Client Discovery Improvements (#3120)\n\n* Client: add explicit discovery startup logging\r\n\r\n* Client: add bootnodes format hint on CLI option help\r\n\r\n* Client: add option to pass in bootnode.txt file to --bootnodes CLI param, add CLI test\r\n\r\n* Client: replace goerli -> holesky in list with networks with activated DNS discovery\r\n\r\n* Devp2p: add new confirmed-peer mechanism for a more fine grained peer discovery, reactivated discV4 for client\r\n\r\n* Devp2p: add test setup for DPT, initialization, bootstrap(), addPeer() and confirmed/unconfirmed refresh() tests, fix bug in getClosestPeers()\r\n\r\n* Client: make onlyConfirmed exception for mainnet (since most peers are mainnet peers and peering then goes quicker)\r\n\r\n* Devp2p: increase network resilience for the case that no initial confirmation is possible\r\n\r\n* Devp2p: remove peer from confirmed peers list when being removed from DPT, fix tests\r\n\r\n* Fix tests\r\n\r\n* Client: add missing bootnode.txt test file",
          "timestamp": "2023-10-27T10:08:39-04:00",
          "tree_id": "4ea32229f34b3ac03dcd176391c6aaf145caa619",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/b8480333d91bacd97004c1c6e9f2ed2b28d9e448"
        },
        "date": 1698415942123,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28629,
            "range": "±5.47%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28649,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28672,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28178,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22581,
            "range": "±11.72%",
            "unit": "ops/sec",
            "extra": "69 samples"
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
          "id": "0443f9b9d8c053e3a76e827b82e7f91838f9896f",
          "message": "trie: use Uint8Array as value type in DB (#3067)\n\n* trie: use Uint8Array as value type in DB\r\n\r\n* trie: make string value default and add option for bytes\r\n\r\n* trie: values returned as uint8array option, now backwards compatible\r\n\r\n* trie: update hex conversion to right value\r\n\r\n* trie: write unprefixedHex root\r\n\r\n* client: add flag to use old version of DB\r\n\r\n* trie: ensure `view` is used if no db is provided in constructor\r\n\r\n* vm: only create tries when necessary\r\n\r\n* trie: fix test\r\n\r\n* trie: lint\r\n\r\n* trie: add encoding tests\r\n\r\n* block: remove `txTrie` and cache tx trie root\r\n\r\n* block: add cache\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-27T17:22:31+02:00",
          "tree_id": "4ca5a134f3f52026c05be073eabb982ede6d0216",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/0443f9b9d8c053e3a76e827b82e7f91838f9896f"
        },
        "date": 1698420412561,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 24525,
            "range": "±4.23%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 23769,
            "range": "±4.65%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 24131,
            "range": "±3.34%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23819,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 23435,
            "range": "±3.46%",
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
          "id": "4bd94388c445c49b0665fa7355b951e99bd136c9",
          "message": "EVM: prevent address creation for 2929 address tracking (#3122)",
          "timestamp": "2023-10-27T20:18:39+02:00",
          "tree_id": "e99eb0ba05dd4664a76d699cfcee5bf68d7ec020",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/4bd94388c445c49b0665fa7355b951e99bd136c9"
        },
        "date": 1698431139362,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29824,
            "range": "±4.05%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28778,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29150,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28400,
            "range": "±2.59%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24803,
            "range": "±8.37%",
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
          "id": "ac9830ff501e5ee4f77a7ec866b7704b247fb540",
          "message": "monorepo: fix browserify vulnerability (#3124)",
          "timestamp": "2023-10-30T13:36:37-04:00",
          "tree_id": "29f37fc5d3cb904aad73816eb597da4fbb703fa3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ac9830ff501e5ee4f77a7ec866b7704b247fb540"
        },
        "date": 1698688133798,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 23190,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22234,
            "range": "±5.07%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422907",
            "value": 22653,
            "range": "±3.53%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422908",
            "value": 22720,
            "range": "±3.54%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 21999,
            "range": "±3.76%",
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
          "id": "9f91d225c9cce0fabc19086668591a70cadeadb4",
          "message": "client: integrate snapsync on experimental basis (#3031)\n\n* client: integrate snapsync on experimental basis\r\n\r\nuse statemanager in snap fetchers and fix the snapsync startup and snapsync test\r\n\r\nfunctional snapsync integration with static peer state with hacks\r\n\r\nrebase fixes\r\n\r\nget static snapsync working again\r\n\r\ntypefix\r\n\r\nfix spec\r\n\r\ntrack safe and finalized in finalized\r\n\r\nintegrate building stat e with skeleton\r\n\r\nintegrate account fetcher with the skeleton\r\n\r\n* move naive snapprogess tracker to synchronizer\r\n\r\n* code cleanup and refactor\r\n\r\n* update the fetching strategy and small progress flags refac\r\n\r\n* add missing commit\r\n\r\n* track cl syncsyncronization for snapsync start\r\n\r\n* handle the sync failure and non completion scenarios\r\n\r\n* add rudimentary snap progress to el status logs\r\n\r\n* debug and fix the snapfetcher premature exits and add accountranges %age logging\r\n\r\n* fix vmstep back\r\n\r\n* track and log storage and byetcode progress\r\n\r\n* pretty print stateroot\r\n\r\n* Terminate storagefetcher after all storage and fragmented requests have been processed\r\n\r\n* further fixes and improvements\r\n\r\n* add early detection for snapsync state mismatch\r\n\r\n* storage and codefetcher fixes\r\n\r\n* lint\r\n\r\n* fix statemanager test\r\n\r\n* refactor finalized and safe block checks for availability and canonicality\r\n\r\n* fix skeleton spec\r\n\r\n* fix snap fetcher spec tests\r\n\r\n* simplify fetcher's fetchPromise assignment\r\n\r\n* fix cli spec\r\n\r\n* fix fullsync spec\r\n\r\n* improve the snapsync fetch flow\r\n\r\n* small fix\r\n\r\n* fix refac slip\r\n\r\n* further code improvs\r\n\r\n* fix valid log info\r\n\r\n* cleanup\r\n\r\n* increase coevragee\r\n\r\n* sim cleanup\r\n\r\n* add spec for formatBigDecimal\r\n\r\n* keep unfinalized non canonical blocks around to handle some reorgs without backfill\r\n\r\n* store annoucements in unfinalized\r\n\r\n* improvements for the backfill from skeleton unfinalized blocks\r\n\r\n* handle simple head reorg\r\n\r\n---------\r\n\r\nCo-authored-by: Amir <indigophi@protonmail.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-10-31T11:05:12+01:00",
          "tree_id": "7d19da58047bb47c2b13ab5e6fb7697a6088b215",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/9f91d225c9cce0fabc19086668591a70cadeadb4"
        },
        "date": 1698747001137,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 19242,
            "range": "±3.29%",
            "unit": "ops/sec",
            "extra": "72 samples"
          },
          {
            "name": "Block 9422906",
            "value": 18052,
            "range": "±7.17%",
            "unit": "ops/sec",
            "extra": "74 samples"
          },
          {
            "name": "Block 9422907",
            "value": 17995,
            "range": "±3.30%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 17901,
            "range": "±3.40%",
            "unit": "ops/sec",
            "extra": "71 samples"
          },
          {
            "name": "Block 9422910",
            "value": 18203,
            "range": "±3.71%",
            "unit": "ops/sec",
            "extra": "77 samples"
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
          "id": "6795fa6bf937429119c2dbdd8c073129aef27c09",
          "message": "Add rpcDebug stack collection to all rpc modules (#3127)\n\n* Add rpcDebug stack trace collection to admin rpc module\r\n\r\n* Add rpcDebug stack trace collection to engine rpc module\r\n\r\n* Add rpcDebug stack trace collection to net rpc module\r\n\r\n* Add rpcDebug stack trace collection to net txpool module",
          "timestamp": "2023-10-31T14:37:06-04:00",
          "tree_id": "706e3329858763adc039ab18e836cbbb1b31042d",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6795fa6bf937429119c2dbdd8c073129aef27c09"
        },
        "date": 1698777707702,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 18955,
            "range": "±3.25%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 17679,
            "range": "±5.26%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 18170,
            "range": "±3.12%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 18284,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 17616,
            "range": "±3.10%",
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
          "id": "ce9ff228a280f352424b8593270ae0711d18ecec",
          "message": "handle an edge case in newpayload block execution (#3131)\n\n* handle an edge case in newpayload block execution\r\n\r\n* comment cleanup\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-11-01T10:27:50+01:00",
          "tree_id": "4cd48a091e408459e5ccfeb6e9b97f9b4e3676d4",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ce9ff228a280f352424b8593270ae0711d18ecec"
        },
        "date": 1698831080254,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30756,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29797,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29809,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 29156,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24844,
            "range": "±10.03%",
            "unit": "ops/sec",
            "extra": "74 samples"
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
          "id": "ab4ba34e81fcc1e01b733fe37d2b657a67da5099",
          "message": "Minimal `rlpx` test suite (#3126)\n\n* Add rlpx tests and remove ts-ignore\r\n\r\n* Remove excess robot comments\r\n\r\n* Upload code coverage for devp2p\r\n\r\n* bump coverage\r\n\r\n* Update RLP coverage\r\n\r\n* update ci\r\n\r\n* use default coverage script\r\n\r\n* Update rlp test script\r\n\r\n* Revert non devp2p changes\r\n\r\n---------\r\n\r\nCo-authored-by: Holger Drewes <Holger.Drewes@gmail.com>",
          "timestamp": "2023-11-01T11:45:32+01:00",
          "tree_id": "b50989b3e6d8817fec12d94f63ceba3aca87e868",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/ab4ba34e81fcc1e01b733fe37d2b657a67da5099"
        },
        "date": 1698835722776,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40074,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38433,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38618,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35942,
            "range": "±4.26%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36867,
            "range": "±2.26%",
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
          "id": "c6d8b3998522612ea0f1a6c1c256fe5226c0fddf",
          "message": "New Minor Releases (Holesky, Dencun devnet-10, Client UX, Performance) (#3113)\n\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/rlp v5.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/util v9.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/common v4.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/genesis v0.2.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/trie v6.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/devp2p v6.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/tx v5.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/block v5.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/blockchain v7.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/statemanager v2.1.0)\r\n\r\n* Apply suggestions from code review\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/ethash v3.0.1)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/wallet v2.0.1)\r\n\r\n* Add dedicated EVM profiling section to README\r\n\r\n* Add EVM profiler image\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/evm v2.1.0)\r\n\r\n* Update CHANGELOG, version bump, updated upstream dependency versions (@ethereumjs/vm v7.1.0)\r\n\r\n* Bump @ethereumjs/client version to v0.9.0, update CHANGELOG\r\n\r\n* Rebuild docs\r\n\r\n* README updates\r\n\r\n* Rebuild package-lock.json\r\n\r\n* evm: fix typo\r\n\r\n* blockchain: update changelog\r\n\r\n* Update packages/tx/CHANGELOG.md\r\n\r\n* Update packages/tx/CHANGELOG.md\r\n\r\n* Minor adjustements\r\n\r\n* Update packages/vm/CHANGELOG.md\r\n\r\n* VM: fix block profiler\r\n\r\n* Update CHANGELOG files with recent changes\r\n\r\n* Rebuild package-lock.json\r\n\r\n* verkle: update rlp and util to x.0.1\r\n\r\n* Update devnet-10 -> devnet-11 in CHANGELOG files\r\n\r\n---------\r\n\r\nCo-authored-by: Scorbajio <indigophi@protonmail.com>\r\nCo-authored-by: Jochem Brouwer <jochembrouwer96@gmail.com>\r\nCo-authored-by: Gabriel Rocheleau <contact@rockwaterweb.com>",
          "timestamp": "2023-11-02T09:31:20+01:00",
          "tree_id": "d43f2135bb2fdf549977fb45c3d97798423eafbc",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c6d8b3998522612ea0f1a6c1c256fe5226c0fddf"
        },
        "date": 1698914093784,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29888,
            "range": "±4.18%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29444,
            "range": "±2.31%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29117,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 28905,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24795,
            "range": "±9.16%",
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
          "id": "fbcffb83cffed3d7c46fe9f1934b50ba5f31dfe0",
          "message": "vm: add missing gasPrice param to readme example tx (#3135)",
          "timestamp": "2023-11-02T10:14:03-04:00",
          "tree_id": "77ff192997f9d2e557bcdc6fd2526ad59affe074",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/fbcffb83cffed3d7c46fe9f1934b50ba5f31dfe0"
        },
        "date": 1698934699866,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 30150,
            "range": "±3.64%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 29532,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422907",
            "value": 29440,
            "range": "±2.44%",
            "unit": "ops/sec",
            "extra": "86 samples"
          },
          {
            "name": "Block 9422908",
            "value": 29009,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422910",
            "value": 24578,
            "range": "±9.25%",
            "unit": "ops/sec",
            "extra": "75 samples"
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
          "id": "3a00a3241c00ed0e82ad27a6f014b78b38822fdd",
          "message": "common: fix readme eip links (#3136)\n\n* common: fix readme eip links\r\n\r\n* evm: fix eip links\r\n\r\n* evm: undo bad replacing\r\n\r\n---------\r\n\r\nCo-authored-by: acolytec3 <17355484+acolytec3@users.noreply.github.com>",
          "timestamp": "2023-11-02T10:42:43-04:00",
          "tree_id": "327b9d9d291a4b3a103c1d7dcbcf2aa27911d7d3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/3a00a3241c00ed0e82ad27a6f014b78b38822fdd"
        },
        "date": 1698936346576,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 39970,
            "range": "±2.49%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 38773,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "89 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38294,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "88 samples"
          },
          {
            "name": "Block 9422908",
            "value": 35862,
            "range": "±5.02%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 36881,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "88 samples"
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
          "id": "6d64162c847c7cd145202ad7c0af276a286138cc",
          "message": "client: Patch fcu skeleton blockfill process to avoid chain reset (#3137)",
          "timestamp": "2023-11-03T08:51:24-04:00",
          "tree_id": "83ae6c1e2b581bb8b6841b2ef5184f1278c010b3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/6d64162c847c7cd145202ad7c0af276a286138cc"
        },
        "date": 1699016143699,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 25592,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "79 samples"
          },
          {
            "name": "Block 9422906",
            "value": 22559,
            "range": "±6.53%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422907",
            "value": 23461,
            "range": "±3.43%",
            "unit": "ops/sec",
            "extra": "81 samples"
          },
          {
            "name": "Block 9422908",
            "value": 23661,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22539,
            "range": "±3.50%",
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
          "id": "17234068dd115c60343510a176dd6f32e56d71c9",
          "message": "verkle: use rust-verkle-wasm from npm (#3141)\n\n* verkle: remove rust-verkle-wasm from local dir\r\n\r\n* verkle: add rust-verkle-wasm from npm and refactor\r\n\r\n* verkle: add some missing exports",
          "timestamp": "2023-11-05T12:01:17-07:00",
          "tree_id": "79e5e12d418e36d8dcefa9c4a1c0ab134c13e6cb",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/17234068dd115c60343510a176dd6f32e56d71c9"
        },
        "date": 1699211275913,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 28684,
            "range": "±4.88%",
            "unit": "ops/sec",
            "extra": "76 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28786,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28101,
            "range": "±3.15%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27567,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "83 samples"
          },
          {
            "name": "Block 9422910",
            "value": 22954,
            "range": "±10.84%",
            "unit": "ops/sec",
            "extra": "72 samples"
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
          "id": "49f3ccaeb11442f93e5e20ae0ee8e834397c5cd5",
          "message": "Client: fix rpc debug (#3125)\n\n* client: fix rpc debug\r\n\r\n* client/rpc: add verbosity filter\r\n\r\n* client: fix rpc test",
          "timestamp": "2023-11-05T15:40:24-07:00",
          "tree_id": "ad09314841b8c7c4a085d458e18aeea11f4d0973",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/49f3ccaeb11442f93e5e20ae0ee8e834397c5cd5"
        },
        "date": 1699224250010,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29399,
            "range": "±2.98%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422906",
            "value": 27099,
            "range": "±4.44%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422907",
            "value": 28030,
            "range": "±3.19%",
            "unit": "ops/sec",
            "extra": "84 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27565,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "80 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27289,
            "range": "±3.32%",
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
          "id": "76ed351cba0b1a70c5551ea2c30a712e637c1a0b",
          "message": "tsconfig: fix references (#3147)",
          "timestamp": "2023-11-07T10:54:33+01:00",
          "tree_id": "0c4bfe9eb62cf3dc9ab462d9a263da6845070bc3",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/76ed351cba0b1a70c5551ea2c30a712e637c1a0b"
        },
        "date": 1699351046849,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 40205,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422906",
            "value": 39697,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "90 samples"
          },
          {
            "name": "Block 9422907",
            "value": 38676,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422908",
            "value": 36048,
            "range": "±4.64%",
            "unit": "ops/sec",
            "extra": "82 samples"
          },
          {
            "name": "Block 9422910",
            "value": 37067,
            "range": "±2.15%",
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
          "id": "c545ba0f95bea2aa33cc08b2fce957b37dee95c7",
          "message": "client: add hive instructions (#3148)",
          "timestamp": "2023-11-07T10:56:05-05:00",
          "tree_id": "10acfc098cb4a9856016e5ea760910014a6cd393",
          "url": "https://github.com/ethereumjs/ethereumjs-monorepo/commit/c545ba0f95bea2aa33cc08b2fce957b37dee95c7"
        },
        "date": 1699372797947,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "Block 9422905",
            "value": 29379,
            "range": "±4.24%",
            "unit": "ops/sec",
            "extra": "77 samples"
          },
          {
            "name": "Block 9422906",
            "value": 28453,
            "range": "±3.01%",
            "unit": "ops/sec",
            "extra": "87 samples"
          },
          {
            "name": "Block 9422907",
            "value": 25840,
            "range": "±7.31%",
            "unit": "ops/sec",
            "extra": "78 samples"
          },
          {
            "name": "Block 9422908",
            "value": 27783,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "85 samples"
          },
          {
            "name": "Block 9422910",
            "value": 27006,
            "range": "±3.44%",
            "unit": "ops/sec",
            "extra": "84 samples"
          }
        ]
      }
    ]
  }
}