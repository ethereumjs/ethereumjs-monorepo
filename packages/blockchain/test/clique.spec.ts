import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { Address, intToBuffer, ecsign } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'
import { CLIQUE_NONCE_AUTH, CLIQUE_NONCE_DROP } from '../src/clique'

tape('Clique: Initialization', (t) => {
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

  const COMMON = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
  const EXTRA_DATA = Buffer.alloc(97)
  const GAS_LIMIT = 8000000

  type Signer = {
    address: Address
    privateKey: Buffer
    publicKey: Buffer
  }

  const A: Signer = {
    address: new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex')),
    privateKey: Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    ),
    publicKey: Buffer.from(
      '40b2ebdf4b53206d2d3d3d59e7e2f13b1ea68305aec71d5d24cefe7f24ecae886d241f9267f04702d7f693655eb7b4aa23f30dcd0c3c5f2b970aad7c8a828195',
      'hex'
    ),
  }

  const B: Signer = {
    address: new Address(Buffer.from('dc7bc81ddf67d037d7439f8e6ff12f3d2a100f71', 'hex')),
    privateKey: Buffer.from(
      '86b0ff7b6cf70786f29f297c57562905ab0b6c32d69e177a46491e56da9e486e',
      'hex'
    ),
    publicKey: Buffer.from(
      'd3e3d2b722e325bfc085ff5638a112b4e7e88ff13f92fc7f6cfc14b5a25e8d1545a2f27d8537b96e8919949d5f8c139ae7fc81aea7cf7fe5d43d7faaa038e35b',
      'hex'
    ),
  }

  const C: Signer = {
    address: new Address(Buffer.from('8458f408106c4875c96679f3f556a511beabe138', 'hex')),
    privateKey: Buffer.from(
      '159e95d07a6c64ddbafa6036cdb7b8114e6e8cdc449ca4b0468a6d0c955f991b',
      'hex'
    ),
    publicKey: Buffer.from(
      'f02724341e2df54cf53515f079b1354fa8d437e79c5b091b8d8cc7cbcca00fd8ad854cb3b3a85b06c44ecb7269404a67be88b561f2224c94d133e5fc21be915c',
      'hex'
    ),
  }

  const D: Signer = {
    address: new Address(Buffer.from('83c30730d1972baa09765a1ac72a43db27fedce5', 'hex')),
    privateKey: Buffer.from(
      'f216ddcf276079043c52b5dd144aa073e6b272ad4bfeaf4fbbc044aa478d1927',
      'hex'
    ),
    publicKey: Buffer.from(
      '555b19a5cbe6dd082a4a1e1e0520dd52a82ba24fd5598ea31f0f31666c40905ed319314c5fb06d887b760229e1c0e616294e7b1cb5dfefb71507c9112132ce56',
      'hex'
    ),
  }

  const E: Signer = {
    address: new Address(Buffer.from('6f62d8382bf2587361db73ceca28be91b2acb6df', 'hex')),
    privateKey: Buffer.from(
      '2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6',
      'hex'
    ),
    publicKey: Buffer.from(
      'ca0a55f6e81cb897aee6a1c390aa83435c41048faa0564b226cfc9f3df48b73e846377fb0fd606df073addc7bd851f22547afbbdd5c3b028c91399df802083a2',
      'hex'
    ),
  }

  const initWithSigners = (signers: Address[]) => {
    const blocks: Block[] = []

    const extraData = Buffer.concat([
      Buffer.alloc(32),
      ...signers.map((s) => s.toBuffer()),
      Buffer.alloc(65),
    ])
    const genesisBlock = Block.genesis(
      { header: { gasLimit: GAS_LIMIT, extraData } },
      { common: COMMON }
    )
    blocks.push(genesisBlock)

    const blockchain = new Blockchain({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
      common: COMMON,
    })
    return { blocks, blockchain }
  }

  const addNextBlock = async (
    blockchain: Blockchain,
    blocks: Block[],
    signer: Signer,
    beneficiary?: [Signer, boolean]
  ) => {
    const number = blocks.length
    const lastBlock = blocks[number - 1]

    let coinbase = Address.zero()
    let nonce = CLIQUE_NONCE_DROP
    if (beneficiary) {
      coinbase = beneficiary[0].address
      if (beneficiary[1]) {
        nonce = CLIQUE_NONCE_AUTH
      }
    }

    const blockData = {
      header: {
        number,
        parentHash: lastBlock.hash(),
        coinbase,
        timestamp: lastBlock.header.timestamp.addn(15),
        extraData: EXTRA_DATA,
        gasLimit: GAS_LIMIT,
        nonce,
      },
    }
    let block = Block.fromBlockData(blockData, { common: COMMON, freeze: false })
    const signature = ecsign(block.header.hash(), signer.privateKey)
    const signatureB = Buffer.concat([signature.r, signature.s, intToBuffer(signature.v - 27)])

    const extraData = Buffer.concat([block.header.cliqueExtraVanity(), signatureB])
    blockData.header.extraData = extraData

    block = Block.fromBlockData(blockData, { common: COMMON, freeze: false })

    await blockchain.putBlock(block)
    blocks.push(block)
    return block
  }

  t.test('should throw if signer in epoch checkpoint is not active', async (st) => {
    const { blockchain } = initWithSigners([A.address])
      ; (blockchain as any)._validateBlocks = false
    const number = COMMON.consensusConfig().epoch
    const unauthorizedSigner = Address.fromString('0x00a839de7922491683f547a67795204763ff8237')
    const extraData = Buffer.concat([Buffer.alloc(32), A.address.toBuffer(), unauthorizedSigner.toBuffer(), Buffer.alloc(65)])
    const block = Block.fromBlockData({ header: { number, extraData, } }, { common: COMMON })
    try {
      await blockchain.putBlock(block)
      st.fail('should fail')
    } catch (error) {
      if (error.message.includes('checkpoint signer not found in active signers list: ' + unauthorizedSigner.toString())) {
        st.pass('correct error')
      } else {
        st.fail('should fail with appropriate error')
      }
    }
    st.end()
  })

  // Test Cases: https://eips.ethereum.org/EIPS/eip-225
  t.test('Clique Voting: Single signer, no votes cast', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address])
    const block = await addNextBlock(blockchain, blocks, A)
    st.equal(block.header.number.toNumber(), 1)
    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address])
    st.end()
  })

  t.test('Clique Voting: Single signer, voting to add two others', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address])
    await addNextBlock(blockchain, blocks, A, [B, true])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [C, true])
    st.deepEqual(
      blockchain.cliqueActiveSigners(),
      [A.address, B.address],
      'only accept first, second needs 2 votes'
    )
    st.end()
  })

  t.test('Two signers, voting to add three others', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address])
    await addNextBlock(blockchain, blocks, A, [C, true])
    await addNextBlock(blockchain, blocks, B, [C, true])
    await addNextBlock(blockchain, blocks, A, [D, true])
    await addNextBlock(blockchain, blocks, B, [D, true])
    await addNextBlock(blockchain, blocks, C)
    await addNextBlock(blockchain, blocks, A, [E, true])
    await addNextBlock(blockchain, blocks, B, [E, true])

    st.deepEqual(
      blockchain.cliqueActiveSigners(),
      [A.address, B.address, C.address, D.address],
      'only accept first two, third needs 3 votes already'
    )
    st.end()
  })

  t.test('Clique Voting: Single signer, dropping itself)', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address])
    await addNextBlock(blockchain, blocks, A, [A, false])

    st.deepEqual(
      blockchain.cliqueActiveSigners(),
      [],
      'weird, but one less cornercase by explicitly allowing this'
    )
    st.end()
  })

  t.test(
    'Clique Voting: Two signers, actually needing mutual consent to drop either of them',
    async (st) => {
      const { blocks, blockchain } = initWithSigners([A.address, B.address])
      await addNextBlock(blockchain, blocks, A, [B, false])

      st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address], 'not fulfilled')
      st.end()
    }
  )

  t.test(
    'Clique Voting: Two signers, actually needing mutual consent to drop either of them',
    async (st) => {
      const { blocks, blockchain } = initWithSigners([A.address, B.address])
      await addNextBlock(blockchain, blocks, A, [B, false])
      await addNextBlock(blockchain, blocks, B, [B, false])

      st.deepEqual(blockchain.cliqueActiveSigners(), [A.address], 'fulfilled')
      st.end()
    }
  )

  t.test('Clique Voting: Three signers, two of them deciding to drop the third', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address])
    await addNextBlock(blockchain, blocks, A, [C, false])
    await addNextBlock(blockchain, blocks, B, [C, false])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address])
    st.end()
  })

  t.test(
    'Clique Voting: Four signers, consensus of two not being enough to drop anyone',
    async (st) => {
      const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address, D.address])
      await addNextBlock(blockchain, blocks, A, [C, false])
      await addNextBlock(blockchain, blocks, B, [C, false])

      st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address, C.address, D.address])
      st.end()
    }
  )

  t.test(
    'Clique Voting: Four signers, consensus of three already being enough to drop someone',
    async (st) => {
      const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address, D.address])
      await addNextBlock(blockchain, blocks, A, [D, false])
      await addNextBlock(blockchain, blocks, B, [D, false])
      await addNextBlock(blockchain, blocks, C, [D, false])

      st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address, C.address])
      st.end()
    }
  )

  t.test('Clique Voting: Authorizations are counted once per signer per target', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address])
    await addNextBlock(blockchain, blocks, A, [C, true])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [C, true])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [C, true])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address])
    st.end()
  })

  t.test('Clique Voting: Authorizing multiple accounts concurrently is permitted', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address])
    await addNextBlock(blockchain, blocks, A, [C, true])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [D, true])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, B, [D, true])
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, B, [C, true])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address, D.address, C.address])
    st.end()
  })

  t.test('Clique Voting: Deauthorizations are counted once per signer per target', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address])
    await addNextBlock(blockchain, blocks, A, [B, false])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [B, false])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, A, [B, false])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address])
    st.end()
  })

  t.test('Clique Voting: Deauthorizing multiple accounts concurrently is permitted', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address, D.address])
    await addNextBlock(blockchain, blocks, A, [C, false])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, C)
    await addNextBlock(blockchain, blocks, A, [D, false])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, C)
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, B, [D, false])
    await addNextBlock(blockchain, blocks, C, [D, false])
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, B, [C, false])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address])
    st.end()
  })

  t.test('Clique Voting: Votes from deauthorized signers are discarded immediately', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address])
    await addNextBlock(blockchain, blocks, C, [B, false])
    await addNextBlock(blockchain, blocks, A, [C, false])
    await addNextBlock(blockchain, blocks, B, [C, false])
    await addNextBlock(blockchain, blocks, A, [B, false])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address], 'deauth votes')
    st.end()
  })

  t.test('Clique Voting: Votes from deauthorized signers are discarded immediately', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address])
    await addNextBlock(blockchain, blocks, C, [D, true])
    await addNextBlock(blockchain, blocks, A, [C, false])
    await addNextBlock(blockchain, blocks, B, [C, false])
    await addNextBlock(blockchain, blocks, A, [D, true])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address], 'auth votes')
    st.end()
  })

  // TODO: fix test case
  /*t.test('Clique Voting: Changes reaching consensus out of bounds (via a deauth) execute on touch', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address, B.address, C.address, D.address])
    await addNextBlock(blockchain, blocks, A, [C, false])
    await addNextBlock(blockchain, blocks, B)
    await addNextBlock(blockchain, blocks, C)
    await addNextBlock(blockchain, blocks, A, [D, false])
    await addNextBlock(blockchain, blocks, B, [C, false])
    await addNextBlock(blockchain, blocks, C)
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, B, [D, false])
    await addNextBlock(blockchain, blocks, C, [D, false])
    await addNextBlock(blockchain, blocks, A)
    await addNextBlock(blockchain, blocks, C, [C, true])


    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address])
    st.end()
  })

  // TODO: add two additional test cases, further last test cases not relevant yet
  t.test('Clique Voting: ', async (st) => {
    const { blocks, blockchain } = initWithSigners([A.address])
    await addNextBlock(blockchain, blocks, A, [B, true])

    st.deepEqual(blockchain.cliqueActiveSigners(), [A.address, B.address], '')
    st.end()
  })*/
})
