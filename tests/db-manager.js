const fs = require('fs')
const tape = require('tape')
const tmp = require('tmp')
const DBManager = require('../lib/chain/DBManager.js')
const Logger = require('./mocks/Logger.js')

tape('[DB]: Database functions', function (t) {
  const config = {}
  config.logger = Logger

  t.test('should test data dir creation', function (st) {
    const tmpdir = tmp.dirSync()
    config.datadir = `${tmpdir.name}/chaindb`

    new DBManager(config) // eslint-disable-line no-new

    st.ok(fs.existsSync(config.datadir), 'data dir exists')

    st.end()
  })
})
