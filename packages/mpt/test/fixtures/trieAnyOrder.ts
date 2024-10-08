//cspell:disable
export const trieAnyOrderData = {
  source: 'https://github.com/ethereum/tests/blob/develop/TrieTests/trieanyorder.json',
  commit: '7d66cbfff1e6561d1046e45df8b7918d186b136f',
  date: '2019-01-10',
  tests: {
    singleItem: {
      in: {
        A: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
      root: '0xd23786fb4a010da3ce639d66d5e904a11dbc02746d1ce25029e53290cabf28ab',
    },
    dogs: {
      in: {
        doe: 'reindeer',
        dog: 'puppy',
        dogglesworth: 'cat',
      },
      root: '0x8aad789dff2f538bca5d8ea56e8abe10f4c7ba3a5dea95fea4cd6e7c3a1168d3',
    },
    puppy: {
      in: {
        do: 'verb',
        horse: 'stallion',
        doge: 'coin',
        dog: 'puppy',
      },
      root: '0x5991bb8c6514148a29db676a14ac506cd2cd5775ace63c30a4fe457715e9ac84',
    },
    foo: {
      in: {
        foo: 'bar',
        food: 'bass',
      },
      root: '0x17beaa1648bafa633cda809c90c04af50fc8aed3cb40d16efbddee6fdf63c4c3',
    },
    smallValues: {
      in: {
        be: 'e',
        dog: 'puppy',
        bed: 'd',
      },
      root: '0x3f67c7a47520f79faa29255d2d3c084a7a6df0453116ed7232ff10277a8be68b',
    },
    testy: {
      in: {
        test: 'test',
        te: 'testy',
      },
      root: '0x8452568af70d8d140f58d941338542f645fcca50094b20f3c3d8c3df49337928',
    },
    hex: {
      in: {
        '0x0045': '0x0123456789',
        '0x4500': '0x9876543210',
      },
      root: '0x285505fcabe84badc8aa310e2aae17eddc7d120aabec8a476902c8184b3a3503',
    },
  },
}
