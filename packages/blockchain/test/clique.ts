import Common from '@ethereumjs/common'
import tape from 'tape'
import Blockchain from '../src'

tape('Clique', (t) => {
  t.test('should initialize a clique blockchain', async (st) => {
    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    const blockchain = new Blockchain({ common })

    const head = await blockchain.getHead()
    st.equals(head.hash().toString('hex'), common.genesis().hash.slice(2), 'correct genesis hash')

    st.deepEquals(
      blockchain.cliqueActiveSigners(),
      head.cliqueEpochTransitionSigners(),
      'correct genesis signers'
    )
    st.end()
  })
})
