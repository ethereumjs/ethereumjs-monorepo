const promisify = require('util.promisify')
const tape = require('tape')
const { StorageReader } = require('../../../lib/state')

const mkStateManagerMock = () => {
  let i = 0
  return {
    getContractStorage: function (address, key, cb) {
      cb(null, i++)
    }
  }
}

tape('StateManager', (t) => {
  t.test('should get value from stateManager', async (st) => {
    const storageReader = new StorageReader(mkStateManagerMock())
    const getContractStorage = promisify((...args) => storageReader.getContractStorage(...args))
    const {
      original,
      current
    } = await getContractStorage(Buffer.from([1]), Buffer.from([1, 1]))

    st.equal(original, 0)
    st.equal(current, 0)
    st.end()
  })

  t.test('should retrieve original from cache', async (st) => {
    const storageReader = new StorageReader(mkStateManagerMock())
    const getContractStorage = promisify((...args) => storageReader.getContractStorage(...args))
    await getContractStorage(Buffer.from([1]), Buffer.from([1, 1]))
    const {
      original,
      current
    } = await getContractStorage(Buffer.from([1]), Buffer.from([1, 1]))

    st.equal(original, 0)
    st.equal(current, 1)
    st.end()
  })

  t.test('should cache keys separately', async (st) => {
    const storageReader = new StorageReader(mkStateManagerMock())
    const getContractStorage = promisify((...args) => storageReader.getContractStorage(...args))
    await getContractStorage(Buffer.from([1]), Buffer.from([1, 1]))
    const {
      original,
      current
    } = await getContractStorage(Buffer.from([1]), Buffer.from([1, 2]))

    st.equal(original, 1)
    st.equal(current, 1)
    st.end()
  })

  t.test('should cache addresses separately', async (st) => {
    const storageReader = new StorageReader(mkStateManagerMock())
    const getContractStorage = promisify((...args) => storageReader.getContractStorage(...args))
    await getContractStorage(Buffer.from([1]), Buffer.from([1, 1]))
    const {
      original,
      current
    } = await getContractStorage(Buffer.from([2]), Buffer.from([1, 1]))

    st.equal(original, 1)
    st.equal(current, 1)
    st.end()
  })

  t.test('should forward errors from stateManager.getContractStorage', async (st) => {
    const storageReader = new StorageReader({
      getContractStorage: (address, key, cb) => cb(new Error('test'))
    })
    const getContractStorage = promisify((...args) => storageReader.getContractStorage(...args))

    await getContractStorage(Buffer.from([2]), Buffer.from([1, 1]))
      .then(() => t.fail('should have returned error'))
      .catch((e) => t.equal(e.message, 'test'))

    st.end()
  })
})
