const tape = require('tape')

tape('JSON validity / Access', function (t) {
  t.test('should be able to require all JSON files', function (st) {
    const jsonFiles = [
      './../hardforks/chainstart.json',
      './../hardforks/homestead.json',
      './../hardforks/dao.json',
      './../hardforks/tangerineWhistle.json',
      './../hardforks/spuriousDragon.json',
      './../hardforks/byzantium.json',
      './../networks/mainnet.json',
      './../networks/ropsten.json',
      './../networks/rinkeby.json',
      './../networks/kovan.json'
    ]

    let loadedJson
    for (let jsonFile of jsonFiles) {
      loadedJson = undefined
      try {
        loadedJson = require(jsonFile)
      } catch (err) {}
      st.notEqual(loadedJson, undefined, `Parsing test for file ${jsonFile} successful`)
    }
    st.end()
  })

  t.test('should be able to access network params', function (st) {
    const common = require('./../index.js')
    st.equal(common.networks['1'].genesis.gasLimit, 5000, 'access from ./index.js (direct)')
    st.equal(common.networks[common.networks['mainnetId']].genesis.gasLimit, 5000, 'access from ./index.js (readable/explicit)')

    const networkParams = require('./../networks/index.js')
    st.equal(networkParams['1'].genesis.gasLimit, 5000, 'access from ./networks/index.js')

    const mainnetParams = require('./../networks/mainnet.js')
    st.equal(mainnetParams.genesis.gasLimit, 5000, 'access from ./networks/mainnet.js')

    st.end()
  })
})
