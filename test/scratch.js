const tape = require('tape')
const ScratchDB = require('../src/scratch')
const DB = require('../src/db')

tape('ScratchDB', (t) => {
  const upstream = new DB()
  const scratch = new ScratchDB(upstream)

  const k = Buffer.from('foo')
  const v = Buffer.from('bar')
  const k2 = Buffer.from('bar')
  const v2 = Buffer.from('baz')

  t.test('should fail to get non-existent value', (st) => {
    scratch.get(k, (err, res) => {
      st.error(err)
      st.notOk(res)
      st.end()
    })
  })

  t.test('puts value to scratch', (st) => {
    scratch.put(k, v, () => {
      scratch.get(k, (err, res) => {
        st.error(err)
        st.ok(v.equals(res))
        st.end()
      })
    })
  })

  t.test('should not have put value to upstream', (st) => {
    upstream.get(k, (err, res) => {
      st.error(err)
      st.notOk(res)
      st.end()
    })
  })

  t.test('should put value directly to upstream', (st) => {
    upstream.put(k2, v2, () => {
      upstream.get(k2, (err, res) => {
        st.error(err)
        st.ok(v2.equals(res))
        st.end()
      })
    })
  })

  t.test('scratch should get value from upstream', (st) => {
    scratch.get(k2, (err, res) => {
      st.error(err)
      st.ok(v2.equals(res))
      st.end()
    })
  })
})
