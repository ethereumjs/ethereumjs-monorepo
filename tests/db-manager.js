const fs = require('fs')
const tape = require('tape')
const tmp = require('tmp')
const DBManager = require('../lib/chain/DBManager.js')
const Logger = require('./mocks/Logger.js')

tape('[DB]: Database functions', t => {
  const config = {}
  config.logger = Logger

  t.test('should test object creation without logger', st => {
    const config = {}
    st.throws(() => new DBManager(config), /TypeError/)

    st.end()
  })

  t.test('should test object creation without datadir', st => {
    st.throws(() => new DBManager(config), /TypeError/)

    st.end()
  })

  t.test('should test data dir creation', st => {
    const tmpdir = tmp.dirSync()
    config.datadir = `${tmpdir.name}/chaindb`

    new DBManager(config) // eslint-disable-line no-new

    st.ok(fs.existsSync(config.datadir), 'data dir exists')

    st.end()
  })

  t.test('should test non-error on already created data dir', st => {
    const tmpdir = tmp.dirSync()
    config.datadir = `${tmpdir.name}/chaindb`

    fs.mkdirSync(config.datadir)

    st.ok(fs.existsSync(config.datadir), 'data dir exists before creating DBManager')

    new DBManager(config) // eslint-disable-line no-new

    st.ok(fs.existsSync(config.datadir), 'data dir exists after creating DBManager')

    st.end()
  })

  t.test('should test blockchain DB is initialized', st => {
    const tmpdir = tmp.dirSync()
    config.datadir = `${tmpdir.name}/chaindb`

    const dbm = new DBManager(config) // eslint-disable-line no-new

    const db = dbm.blockchainDB()
    const testKey = 'name'
    const testValue = 'test'

    db.put(testKey, testValue, function (err) {
      if (err) st.fail('could not write key to db')

      db.get(testKey, function (err, value) {
        if (err) st.fail('could not read key to db')

        st.equal(testValue, value, 'read value matches written value')
        st.end()
      })
    })
  })
})
