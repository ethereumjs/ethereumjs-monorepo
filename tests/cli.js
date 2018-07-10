const tape = require('tape')
const c = require('./../lib/constants.js')

function requireUncached (module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

tape('[CLI]: options', t => {
  t.test('should test defaults', st => {
    const cliParser = requireUncached('./../lib/cliParser.js')
    const config = cliParser.getClientConfig()

    st.equal(config.networkid, c.DEFAULT_NETWORK_ID, 'default networkid is set')
    st.equal(config.loglevel, c.DEFAULT_LOG_LEVEL, 'default loglevel is set')
    st.equal(config.rpcport, c.DEFAULT_RPC_PORT, 'default rpcport is set')
    st.equal(config.rpcaddr, c.DEFAULT_RPC_ADDR, 'default rpcaddr is set')

    delete require.cache[require.resolve('yargs')]

    st.end()
  })

  t.test('should test valid networkid', st => {
    c.SUPPORTED_NETWORK_IDS.forEach((element) => {
      process.argv[2] = `--networkid=${element}`

      const cliParser = requireUncached('./../lib/cliParser.js')
      cliParser.fail((msg) => {
        st.fail('networkid allowed value should not fail')
      })

      cliParser.getClientConfig()

      st.equal(cliParser.argv.networkid, element, `${element} networkid is set`)

      delete require.cache[require.resolve('yargs')]
    })

    st.end()
  })

  t.test('should test invalid networkid', st => {
    process.argv[2] = '--networkid=invalid'

    const cliParser = requireUncached('./../lib/cliParser.js')
    cliParser.fail((msg) => {
      st.ok(msg.match(/Invalid values:\s*Argument: networkid/), 'networkid outside allowed values fails')

      delete require.cache[require.resolve('yargs')]

      st.end()
    })

    cliParser.getClientConfig()
  })

  t.test('should test valid loglevel', st => {
    c.SUPPORTED_LOG_LEVELS.forEach((element) => {
      process.argv[2] = `--loglevel=${element}`

      const cliParser = requireUncached('./../lib/cliParser.js')
      cliParser.fail((msg) => {
        st.fail('loglevel allowed value should not fail')
      })

      cliParser.getClientConfig()

      st.equal(cliParser.argv.loglevel, element, `${element} loglevel is set`)

      delete require.cache[require.resolve('yargs')]
    })

    st.end()
  })

  t.test('should test invalid loglevel', st => {
    process.argv[2] = '--loglevel=invalid'

    const cliParser = requireUncached('./../lib/cliParser.js')
    cliParser.fail((msg) => {
      st.ok(msg.match(/Invalid values:\s*Argument: loglevel/), 'loglevel outside allowed values fails')

      delete require.cache[require.resolve('yargs')]

      st.end()
    })

    cliParser.getClientConfig()
  })
})
