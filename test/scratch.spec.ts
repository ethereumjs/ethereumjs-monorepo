import tape from 'tape'
import { DB } from '../src/db'
import { ScratchDB } from '../src/scratch'

tape('ScratchDB', (t) => {
  const upstream = new DB()
  const scratch = new ScratchDB(upstream)

  const k = Buffer.from('foo')
  const v = Buffer.from('bar')
  const k2 = Buffer.from('bar')
  const v2 = Buffer.from('baz')

  t.test('should fail to get non-existent value', async (st) => {
    const res = await scratch.get(k)
    st.notOk(res)
    st.end()
  })

  t.test('puts value to scratch', async (st) => {
    await scratch.put(k, v)
    const res = await scratch.get(k)
    st.ok(v.equals(res!))
    st.end()
  })

  t.test('should not have put value to upstream', async (st) => {
    const res = await upstream.get(k)
    st.notOk(res)
    st.end()
  })

  t.test('should put value directly to upstream', async (st) => {
    await upstream.put(k2, v2)
    const res = await upstream.get(k2)
    st.ok(v2.equals(res!))
    st.end()
  })

  t.test('scratch should get value from upstream', async (st) => {
    const res = await scratch.get(k2)
    st.ok(v2.equals(res!))
    st.end()
  })
})
