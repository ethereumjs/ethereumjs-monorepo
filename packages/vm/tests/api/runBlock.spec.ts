import tape from 'tape'
import { Address, BN, rlp } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { LegacyTransaction } from '@ethereumjs/tx'
import { DefaultStateManager } from '../../lib/state'
import runBlock from '../../lib/runBlock'
import { setupPreConditions, getDAOCommon } from '../util'
import { setupVM, createAccount } from './utils'
import VM from '../../lib/index'

const testData = require('./testdata.json')

function setup(vm?: any) {
  // Create a mock, if no real VM object provided.
  // The mock includes mocked runTx and runCall which
  // always return an error.
  if (!vm) {
    const stateManager = new DefaultStateManager()
    vm = {
      stateManager,
      emit: (e: any, val: any, cb: Function) => cb(),
      _emit: () => new Promise((resolve) => resolve()),
      runTx: () => new Promise((resolve, reject) => reject(new Error('test'))),
      _common: new Common({ chain: 'mainnet', hardfork: 'byzantium' }),
    }
  }

  return {
    vm,
    data: testData,
    p: {
      runBlock: runBlock.bind(vm),
      putAccount: vm.stateManager.putAccount.bind(vm.stateManager),
    },
  }
}

tape('runBlock', async (t) => {
  const suite = setup()

  t.test('should fail when runTx fails', async (st) => {
    const blockRlp = suite.data.blocks[0].rlp
    const block = Block.fromRLPSerializedBlock(blockRlp)

    // The mocked VM uses a mocked runTx
    // which always returns an error.
    await suite.p
      .runBlock({ block, skipBlockValidation: true })
      .then(() => t.fail('should have returned error'))
      .catch((e) => t.equal(e.message, 'test'))

    st.end()
  })
})

tape('should fail when block gas limit higher than 2^63-1', async (t) => {
  const suite = setup()

  const block = Block.fromBlockData({
    header: {
      ...suite.data.blocks[0].header,
      gasLimit: Buffer.from('8000000000000000', 16),
    },
  })
  await suite.p
    .runBlock({ block })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('Invalid block')))

  t.end()
})

tape('should fail when block validation fails', async (t) => {
  const suite = setup()

  const blockRlp = suite.data.blocks[0].rlp
  const block = Object.create(Block.fromRLPSerializedBlock(blockRlp))
  block.validate = async () => {
    throw new Error('test')
  }

  await suite.p
    .runBlock({ block })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('test')))

  t.end()
})

tape('should fail when tx gas limit higher than block gas limit', async (t) => {
  const suite = setup()

  const blockRlp = suite.data.blocks[0].rlp
  const block = Object.create(Block.fromRLPSerializedBlock(blockRlp))
  // modify first tx's gasLimit
  const { nonce, gasPrice, to, value, data, v, r, s } = block.transactions[0]

  const gasLimit = new BN(Buffer.from('3fefba', 'hex'))
  const opts = { common: block._common }
  block.transactions[0] = new LegacyTransaction(
    { nonce, gasPrice, gasLimit, to, value, data, v, r, s },
    opts
  )

  await suite.p
    .runBlock({ block, skipBlockValidation: true })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('higher gas limit')))

  t.end()
})

tape('should correctly use the hardforkByBlockNumber option', async (t) => {
  const common1 = new Common({
    chain: 'mainnet',
    hardfork: 'muirGlacier',
  })

  // Have to use an unique common, otherwise the HF will be set to muirGlacier and then will not change back to chainstart.
  const common2 = new Common({
    chain: 'mainnet',
    hardfork: 'chainstart',
  })

  const privateKey = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )

  function getBlock(common: Common): Block {
    return Block.fromBlockData(
      {
        header: {
          number: new BN(10000000),
        },
        transactions: [
          LegacyTransaction.fromTxData(
            {
              data: '0x600154', // PUSH 01 SLOAD
              gasLimit: new BN(100000),
            },
            { common }
          ).sign(privateKey),
        ],
      },
      { common }
    )
  }

  const vm = new VM({ common: common1, hardforkByBlockNumber: true })
  const vm_noSelect = new VM({ common: common2 })

  const txResultMuirGlacier = await vm.runBlock({
    block: getBlock(common1),
    skipBlockValidation: true,
    generate: true,
  })
  const txResultChainstart = await vm_noSelect.runBlock({
    block: getBlock(common2),
    skipBlockValidation: true,
    generate: true,
  })
  t.ok(
    txResultChainstart.results[0].gasUsed.toNumber() == 21000 + 68 * 3 + 3 + 50,
    'tx charged right gas on chainstart hard fork'
  )
  t.ok(
    txResultMuirGlacier.results[0].gasUsed.toNumber() == 21000 + 32000 + 16 * 3 + 3 + 800,
    'tx charged right gas on muir glacier hard fork'
  )
  t.end()
})

tape('should run valid block', async (t) => {
  const vm = setupVM()
  const suite = setup(vm)

  const genesisRlp = suite.data.genesisRLP
  const genesis = Block.fromRLPSerializedBlock(genesisRlp)

  const blockRlp = suite.data.blocks[0].rlp
  const block = Block.fromRLPSerializedBlock(blockRlp)

  await setupPreConditions(suite.vm.stateManager._trie, suite.data)

  t.ok(
    suite.vm.stateManager._trie.root.equals(genesis.header.stateRoot),
    'genesis state root should match calculated state root'
  )

  const res = await suite.p.runBlock({
    block,
    root: suite.vm.stateManager._trie.root,
    skipBlockValidation: true,
  })

  t.equal(
    res.results[0].gasUsed.toString('hex'),
    '5208',
    'actual gas used should equal blockHeader gasUsed'
  )

  t.end()
})

// this test actually checks if the DAO fork works. This is not checked in ethereum/tests
tape(
  'should transfer balance from DAO children to the Refund DAO account in the DAO fork',
  async (t) => {
    const common = getDAOCommon(1)

    const vm = setupVM({ common })
    const suite = setup(vm)

    const block1: any = rlp.decode(suite.data.blocks[0].rlp)
    // edit extra data of this block to "dao-hard-fork"
    block1[0][12] = Buffer.from('dao-hard-fork')
    const block = Block.fromValuesArray(block1)
    await setupPreConditions(suite.vm.stateManager._trie, suite.data)

    // fill two original DAO child-contracts with funds and the recovery account with funds in order to verify that the balance gets summed correctly
    const fundBalance1 = new BN(Buffer.from('1111', 'hex'))
    const accountFunded1 = createAccount(new BN(0), fundBalance1)
    const DAOFundedContractAddress1 = new Address(
      Buffer.from('d4fe7bc31cedb7bfb8a345f31e668033056b2728', 'hex')
    )
    await suite.vm.stateManager.putAccount(DAOFundedContractAddress1, accountFunded1)

    const fundBalance2 = new BN(Buffer.from('2222', 'hex'))
    const accountFunded2 = createAccount(new BN(0), fundBalance2)
    const DAOFundedContractAddress2 = new Address(
      Buffer.from('b3fb0e5aba0e20e5c49d252dfd30e102b171a425', 'hex')
    )
    await suite.vm.stateManager.putAccount(DAOFundedContractAddress2, accountFunded2)

    const DAORefundAddress = new Address(
      Buffer.from('bf4ed7b27f1d666546e30d74d50d173d20bca754', 'hex')
    )
    const fundBalanceRefund = new BN(Buffer.from('4444', 'hex'))
    const accountRefund = createAccount(new BN(0), fundBalanceRefund)
    await suite.vm.stateManager.putAccount(DAORefundAddress, accountRefund)

    const res = await suite.vm.runBlock({
      block,
      skipBlockValidation: true,
      generate: true,
    })

    t.error(res.error, "runBlock shouldn't have returned error")

    const DAOFundedContractAccount1 = await suite.vm.stateManager.getAccount(
      DAOFundedContractAddress1
    )
    t.ok(DAOFundedContractAccount1.balance.isZero()) // verify our funded account now has 0 balance
    const DAOFundedContractAccount2 = await suite.vm.stateManager.getAccount(
      DAOFundedContractAddress2
    )
    t.ok(DAOFundedContractAccount2.balance.isZero()) // verify our funded account now has 0 balance

    const DAORefundAccount = await suite.vm.stateManager.getAccount(DAORefundAddress)
    t.ok(DAORefundAccount.balance.eq(new BN(Buffer.from('7777', 'hex')))) // verify that the refund account gets the summed balance of the original refund account + two child DAO accounts

    t.end()
  }
)
/*
async function runWithHf(hardfork: string) {
  const vm = setupVM({ common: new Common({ chain: 'mainnet', hardfork }) })
  const suite = setup(vm)

  const blockRlp = suite.data.blocks[0].rlp
  const block = Block.fromRLPSerializedBlock(blockRlp)

  await setupPreConditions(suite.vm.stateManager._trie, suite.data)

  const res = await suite.p.runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
  })
  return res
}*/
/* This test is now obsolete? The state roots were supposed to be 0 before the intermediate state roots were fixed. The correct state roots are all checked in the blockchain tests.
tape('should return correct HF receipts', async (t) => {
  let res = await runWithHf('byzantium')
  t.equal(res.receipts[0].status, 1, 'should return correct post-Byzantium receipt format')

  res = await runWithHf('spuriousDragon')
  t.deepEqual(
    res.receipts[0].stateRoot,
    Buffer.alloc(32),
    'should return correct pre-Byzantium receipt format')

  t.end()
})
*/
