const tape = require('tape')
const DB = require('../src/db')

tape('DB basic functionality', (t) => {
  const db = new DB()

  const k = Buffer.from('foo')
  const v = Buffer.from('bar')

  t.test('puts and gets value', (st) => {
    db.put(k, v, () => {
      db.get(k, (err, res) => {
        st.error(err)
        st.ok(v.equals(res))
        st.end()
      })
    })
  })

  t.test('dels value', (st) => {
    db.del(k, () => {
      db.get(k, (err, res) => {
        st.error(err)
        st.notOk(res)
        st.end()
      })
    })
  })

  t.test('batch ops', (st) => {
    const k2 = Buffer.from('bar')
    const v2 = Buffer.from('baz')
    const ops = [{ type: 'put', key: k, value: v }, { type: 'put', key: k2, value: v2 }]
    db.batch(ops, (err) => {
      st.error(err)
      db.get(k2, (err, res) => {
        st.error(err)
        st.ok(v2.equals(res))
        st.end()
      })
    })
  })
})

tape('DB input types', (t) => {
  const db = new DB()

  t.test('fails for invalid input', (st) => {
    try {
      db.get('test')
    } catch (e) {
      st.end()
    }
  })
})
