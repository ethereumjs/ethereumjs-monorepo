import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { intToBuffer, ecsign } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'

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
    address: Buffer
    privateKey: Buffer
    publicKey: Buffer
  }

  const A: Signer = {
    address: Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex'),
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
    address: Buffer.from('dc7bc81ddf67d037d7439f8e6ff12f3d2a100f71', 'hex'),
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
    address: Buffer.from('8458f408106c4875c96679f3f556a511beabe138', 'hex'),
    privateKey: Buffer.from(
      '159e95d07a6c64ddbafa6036cdb7b8114e6e8cdc449ca4b0468a6d0c955f991b',
      'hex'
    ),
    publicKey: Buffer.from(
      'f02724341e2df54cf53515f079b1354fa8d437e79c5b091b8d8cc7cbcca00fd8ad854cb3b3a85b06c44ecb7269404a67be88b561f2224c94d133e5fc21be915c',
      'hex'
    ),
  }

  /*const D: Signer = {
    address: Buffer.from('83c30730d1972baa09765a1ac72a43db27fedce5', 'hex'),
    privateKey: Buffer.from(
      'f216ddcf276079043c52b5dd144aa073e6b272ad4bfeaf4fbbc044aa478d1927',
      'hex'
    ),
    publicKey: Buffer.from(
      '555b19a5cbe6dd082a4a1e1e0520dd52a82ba24fd5598ea31f0f31666c40905ed319314c5fb06d887b760229e1c0e616294e7b1cb5dfefb71507c9112132ce56',
      'hex'
    ),
  }*/

  const NONCE_AUTH = Buffer.from('ffffffffffffffff', 'hex')
  const NONCE_DROP = Buffer.from('0000000000000000', 'hex')

  const initWithSigners = (signers: Buffer[]) => {
    const blocks: Block[] = []

    const extraData = Buffer.concat([Buffer.alloc(32), ...signers, Buffer.alloc(65)])
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

    let coinbase = Buffer.alloc(20)
    let nonce = NONCE_DROP
    if (beneficiary) {
      coinbase = beneficiary[0].address
      if (beneficiary[1]) {
        nonce = NONCE_AUTH
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
    const block = Block.fromBlockData(blockData, { common: COMMON, freeze: false })
    const signature = ecsign(block.header.hash(), signer.privateKey)
    const signatureB = Buffer.concat([signature.r, signature.s, intToBuffer(signature.v)])
    //@ts-ignore
    block.header.extraData = Buffer.concat([block.header.cliqueExtraVanity(), signatureB])

    await blockchain.putBlock(block)
    blocks.push(block)
    return block
  }

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
      'only accept first two, third needs 3 votes already'
    )
    st.end()
  })
})
