//cspell:disable
export const trieTestNextPrevData = {
  source: 'https://github.com/ethereum/tests/blob/develop/TrieTests/trietestnextprev.json',
  commit: '7d66cbfff1e6561d1046e45df8b7918d186b136f',
  date: '2019-01-10',
  tests: {
    basic: {
      in: ['cat', 'doge', 'wallace'],
      tests: [
        ['', '', 'cat'],
        ['bobo', '', 'cat'],
        ['c', '', 'cat'],
        ['car', '', 'cat'],
        ['cat', '', 'doge'],
        ['catering', 'cat', 'doge'],
        ['d', 'cat', 'doge'],
        ['doge', 'cat', 'wallace'],
        ['dogerton', 'doge', 'wallace'],
        ['w', 'doge', 'wallace'],
        ['wallace', 'doge', ''],
        ['wallace123', 'wallace', ''],
      ],
    },
  },
}
