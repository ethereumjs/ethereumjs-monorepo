import Common from '@ethereumjs/common'
import tape from 'tape'
import Blockchain from '../src'

tape('Clique', (t) => {
  t.test('should initialize a clique blockchain', async (st) => {
    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    const blockchain = new Blockchain({ common, validateConsensus: false })
    await blockchain.getHead()
    st.end()
  })
})
