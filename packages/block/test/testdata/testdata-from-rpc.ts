import type { JSONRPCBlock } from '../../src/index.ts'

export const testdataFromRPCData: JSONRPCBlock = {
  difficulty: '0x4aff04ba6f83',
  extraData: '0x657468706f6f6c202d20555331',
  gasLimit: '0x3d37da',
  gasUsed: '0x1551b',
  hash: '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
  logsBloom:
    '0x00000000004000000000000000000000000000000400000000000000000000000000000000000000000000000080000008000000000000000000000000000002000000000000000000000080000000000001800000000000000000008000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000004000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020001000000000000000000000000000000000000000000100000010000000000000000000000400000400000000000000000',
  miner: '0x4bb96091ee9d802ed039c4d1a5f6216f90f81b01',
  mixHash: '0xcb3723ab82e84594d0ec9ed5a45fd976d5aba09903826e5ed5e06ae893011eaa',
  nonce: '0xa76a9a500301e044',
  number: '0x2ca14a',
  parentHash: '0x24f155bdf17217767531f464636fe4b84b87a38c53127541f952b3052adbac95',
  receiptsRoot: '0x0eb6a50257911130ea2fa2e500e71e55e2dfc38eb97f64ca9cfca6faeabd693e',
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: '0x3d7',
  stateRoot: '0xdf97474b1b492cb6491cff267ca53c33aa42b611ba15239b4027a77275afeffc',
  timestamp: '0x586afa54',
  totalDifficulty: '0x61decf2ca7d9bbbf8',
  transactions: [
    {
      blockHash: '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
      blockNumber: '0x2ca14a',
      from: '0x41959417325160f8952bc933ae8317b4e5140dda',
      gas: '0x5e1b',
      gasPrice: '0x98bca5a00',
      hash: '0x542e06b2b8beb71305bf1bfd4d2088da9848d8795971d93d5f7893ecceef095b',
      input: '0x',
      nonce: '0x0',
      r: '0x7150d00a9dcd8a8287ad220010c52ff2608906b746de23c993999768091ff210',
      s: '0x5585fabcd1dc415e1668d4cbc2d419cf0381bf9707480ad2f86d0800732f6d7e',
      to: '0x0c7c0b72004a7a66ffa780637427fed0c4faac47',
      transactionIndex: '0x0',
      type: '0x0',
      v: '0x25',
      value: '0x44004c09e76a0000',
    },
    {
      blockHash: '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
      blockNumber: '0x2ca14a',
      from: '0x56ce1399be2831f8a3f918a0408c05bbad658ef3',
      gas: '0x5208',
      gasPrice: '0x4e3b29200',
      hash: '0xe9e15dd4f1070ec30ca4bfbe70738e78b0bb7d126a512e7dc9b22df5b64af791',
      input: '0x',
      nonce: '0x9d',
      r: '0x5d92c10b5789801d4ce0fc558eedc6e6cccbaf0105a7c1f909feabcedfe56cd9',
      s: '0x72cc370fa5fd3b43c2ba4e9e70fea1b5e950b4261ab4274982d8ae15a3403a33',
      to: '0xf4702bb51b8270729db362b0d4f82a56bdd66c65',
      transactionIndex: '0x1',
      type: '0x0',
      v: '0x1b',
      value: '0x120a871cc0020000',
    },
    {
      blockHash: '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
      blockNumber: '0x2ca14a',
      from: '0x1e9939daaad6924ad004c2560e90804164900341',
      gas: '0x9858',
      gasPrice: '0x4a817c800',
      hash: '0x3078eeb8227d104338666de260aac59c141a08f519856fd8b7253398d9347f51',
      input: '0x',
      nonce: '0x22f5d',
      r: '0x7ee15b226f6c767ccace78a4b5b4cbf0be6ec20a899e058d3c95977bacd0cbd5',
      s: '0x27e75bcd3bfd199e8c3e3f0c90b0d39f01b773b3da64060e06c0d568ae5c7523',
      to: '0xb8201140a49b0d5b65a23b4b2fa8a6efff87c576',
      transactionIndex: '0x2',
      type: '0x0',
      v: '0x25',
      value: '0xde4ea09ac8f1e88',
    },
    {
      blockHash: '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
      blockNumber: '0x2ca14a',
      from: '0xea674fdde714fd979de3edf0f56aa9716b898ec8',
      gas: '0x15f90',
      gasPrice: '0x4a817c800',
      hash: '0x9de43b061e5286ab1ad7494f50fac1ec9b541998800f9388ae6e7119f312c5cd',
      input: '0x',
      nonce: '0xfc02d',
      r: '0x59934eeace580cc2bdc292415976692c751f0bcb025930bd40fcc31e91208f3',
      s: '0x77ff34a10a3de0d906a0363b4bdbc0e9a06cb4378476d96dfd446225d8d9949c',
      to: '0xc4f381af25c41786110242623373cc9c7647f3f1',
      transactionIndex: '0x3',
      type: '0x0',
      v: '0x26',
      value: '0xe139507cd50c018',
    },
  ],
  transactionsRoot: '0xe307e6d0e13f41ed336e09d71deb59a354eee4121449f0286cfb076e767fd45b',
  uncles: [],
}
