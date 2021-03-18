import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import VM from '../../lib'
import { Block } from '@ethereumjs/block'
import { Transaction } from '@ethereumjs/tx'
import Blockchain from '@ethereumjs/blockchain'

tape('BlockBuilder', async (t) => {
  t.test('should build a valid block', async (st) => {
    const common = new Common({ chain: 'mainnet' })
    const genesisBlock = Block.genesis({ header: { gasLimit: 50000 } }, { common })
    const blockchain = await Blockchain.create({ genesisBlock, validateConsensus: false })
    const vm = await VM.create({ common, blockchain })
    await vm.stateManager.generateCanonicalGenesis()
    const vmCopy = vm.copy()

    const blockBuilder = await vm.buildBlock({
      parentBlock: genesisBlock,
      blockOpts: { calcDifficultyFromHeader: genesisBlock.header, freeze: false },
    })

    // Set up tx
    const tx = Transaction.fromTxData(
      { to: Address.zero(), value: 1000, gasLimit: 21000, gasPrice: 1 },
      { common, freeze: false }
    )
    // set `from` to a genesis address with existing balance
    const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')
    tx.getSenderAddress = () => {
      return address
    }

    await blockBuilder.addTransaction(tx)
    const block = await blockBuilder.build()

    // block should successfully execute with VM.runBlock and have same outputs
    block.transactions[0].getSenderAddress = () => {
      return address
    }
    const result = await vmCopy.runBlock({ block })
    st.ok(result.gasUsed.eq(block.header.gasUsed))
    st.ok(result.receiptRoot.equals(block.header.receiptTrie))
    st.ok(result.stateRoot.equals(block.header.stateRoot))
    st.ok(result.logsBloom.equals(block.header.bloom))
    st.end()
  })

  t.test('should throw if adding a transaction exceeds the block gas limit', async (st) => {
    const common = new Common({ chain: 'mainnet' })
    const vm = await VM.create({ common })
    const genesis = Block.genesis({}, { common })

    const blockBuilder = await vm.buildBlock({ parentBlock: genesis })
    const gasLimit = genesis.header.gasLimit.addn(1)
    const tx = Transaction.fromTxData({ gasLimit }, { common })
    try {
      await blockBuilder.addTransaction(tx)
    } catch (error) {
      if (error.message.includes('tx has a higher gas limit than the remaining gas in the block')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw')
      }
    }
    st.end()
  })

  t.test('should revert the VM state if reverted', async (st) => {
    const common = new Common({ chain: 'mainnet' })
    const genesisBlock = Block.genesis({ header: { gasLimit: 50000 } }, { common })
    const blockchain = await Blockchain.create({ genesisBlock, validateConsensus: false })
    const vm = await VM.create({ common, blockchain })
    await vm.stateManager.generateCanonicalGenesis()

    const root0 = await vm.stateManager.getStateRoot()

    const blockBuilder = await vm.buildBlock({ parentBlock: genesisBlock })

    // Set up tx
    const tx = Transaction.fromTxData(
      { to: Address.zero(), value: 1000, gasLimit: 21000, gasPrice: 1 },
      { common, freeze: false }
    )
    // set `from` to a genesis address with existing balance
    const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')
    tx.getSenderAddress = () => {
      return address
    }

    await blockBuilder.addTransaction(tx)

    const root1 = await vm.stateManager.getStateRoot(true)
    st.ok(!root0.equals(root1), 'state root should change after adding a tx')

    await blockBuilder.revert()
    const root2 = await vm.stateManager.getStateRoot()

    st.ok(root2.equals(root0), 'state root should revert to before the tx was run')
    st.end()
  })
  t.test('should correctly seal a PoW block', (st) => {
    st.end()
  })
  t.test('should correctly seal a PoA block', (st) => {
    st.end()
  })
  t.test('should throw on invalid PoW', (st) => {
    st.end()
  })
})
