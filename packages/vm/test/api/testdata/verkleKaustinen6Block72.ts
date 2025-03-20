import type { BlockData } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

export const verkleKaustinen6Block72Data: Omit<BlockData, 'transactions'> & {
  transactions: PrefixedHexString[]
} = {
  header: {
    number: '0x48',
    parentHash: '0xf3ecb69d884749d580a08fed05e05ee3967dffc66844715c0d6640c853962d3b',
    coinbase: '0xf97e180c050e5ab072211ad2c213eb5aee4df134',
    stateRoot: '0x18d1dfcc6ccc6f34d14af48a865895bf34bde7f3571d9ba24a4b98122841048c',
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x1993dd7',
    gasUsed: '0xa410',
    timestamp: '0x6619131c',
    extraData: '0xd983010c01846765746889676f312e32302e3134856c696e7578',
    baseFeePerGas: '0x1737d',
    transactionsTrie: '0xe32d8329353256c4f60f7f029b8c26eb0638c9a32bfdfd37ad224b140e8c3b9f',
  },
  transactions: [
    '0xf86d0c843b9c728e82f618946177843db3138ae69679a54b95cf345ed759450d87b5303ad38b80008083021e7ba0d8b5a41fb5586ba0324acd075263efebfab044b86deba9aaffec8d137ec7c514a066725dd2ed9457e15f1bb5fd763b65f32febfaf55254cbd792096498538f8cf2',
    '0xf86d0d843b9c728e82f61894687704db07e902e9a8b3754031d168d46e3d586e87b5303ad38b80008083021e7ba08ff0849279b1d455cacb5593eeafbd005e77464f1c3f960ff2b543beb8f05218a02ec4a3c2271bee8d358cedc2ef00f950b00e70aed1a415442414d90d8ba58d34',
  ],
  withdrawals: [],
  executionWitness: {
    parentStateRoot: '0x',
    stateDiff: [
      {
        stem: '0x242271cf1aaa13ede9bb0a1550d6f181c6135afb92be8270221f03cc8a721e',
        suffixDiffs: [
          {
            suffix: 0,
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 1,
            currentValue: '0x5fd4526134640504000000000000000000000000000000000000000000000000',
            newValue: '0x5f54de346f94ba04000000000000000000000000000000000000000000000000',
          },
          {
            suffix: 2,
            currentValue: '0x2c01000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 3,
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: 4,
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0x96ed99018bcdb2439b664559f70a95ec161cfc6ef2b8e1b42ff61733e87f8e',
        suffixDiffs: [
          {
            suffix: 0,
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 1,
            currentValue: '0xebc17af0f95f7800000000000000000000000000000000000000000000000000',
            newValue: '0xfb9691f52c867800000000000000000000000000000000000000000000000000',
          },
          {
            suffix: 2,
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 3,
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: 4,
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0xab8fbede899caa6a95ece66789421c7777983761db3cfb33b5e47ba10f413b',
        suffixDiffs: [
          {
            suffix: 71,
            currentValue: null,
            newValue: '0xf3ecb69d884749d580a08fed05e05ee3967dffc66844715c0d6640c853962d3b',
          },
        ],
      },
      {
        stem: '0xd5f60a22f578b01222216496e3322676c2bd1a27f4814fff924ff5795b9dae',
        suffixDiffs: [
          {
            suffix: 0,
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 1,
            currentValue: '0x50cbdee5305851973c2e3b030000000000000000000000000000000000000000',
            newValue: '0x70aa9d4b87d1e6953c2e3b030000000000000000000000000000000000000000',
          },
          {
            suffix: 2,
            currentValue: '0x0c00000000000000000000000000000000000000000000000000000000000000',
            newValue: '0x0e00000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: 3,
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: 4,
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e3',
        suffixDiffs: [
          {
            suffix: 0,
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 1,
            currentValue: '0x923672e5275a0104000000000000000000000000000000000000000000000000',
            newValue: '0x92b6fdb8628ab604000000000000000000000000000000000000000000000000',
          },
          {
            suffix: 2,
            currentValue: '0x2c01000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: 3,
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: 4,
            currentValue: null,
            newValue: null,
          },
        ],
      },
    ],
    verkleProof: {
      otherStems: [],
      depthExtensionPresent: '0x0a120a1212',
      commitmentsByPath: [
        '0x12aea8e64b9762111a3b905875add74eab373159bfe597ea781ca8cb50b3d909',
        '0x6f49fa46e120d831d7cf73129d3a30cde094382ee39c78bfdef3b4843951ec74',
        '0x59d23e83ab112656855502a69724bd03f2922abb389e11e6ad0df408afa02c9b',
        '0x29297ab7e82f02e368f2d7c8719ff26ffffbcdf9c28ca636849189648139eb96',
        '0x3f36c433053f65ccc3c6e522db509bd62a6b019cdf0dea5f6228e76763bb84fa',
        '0x599eead7a274c667c6ac8c5c42e9a8a0ffb47e6d2e75818e21ff304e9273f08a',
        '0x0e029761fcf20de22f3f3e5cfff0b20e7b2510d81422ba70a92608b0672aac21',
        '0x6d112adf802bf565a2486bbe9511a53df41fad3b643025b4534d0cfc490a3070',
        '0x1c47dd00f5ecb06a3fa720f1dc767959acf418fdb5ed841b68a4017e426d2864',
        '0x105381b6bc5ce78b4b8bce6f4461d9669fc298f1ecab2f7ffcca3c82fa7e052e',
        '0x72e1694b8989f651c3e0b8ffc0673259442cff8aebadb93173a48d78cb658ef1',
        '0x3ec5a18b934ee02eb8223aea330a5689dc7714b441e29d7dccc0e1e2b02d97ff',
        '0x6ff5a48312a2d4e85ea7f3daf645cc021abff01ecf68ab414abff1dc35baed4a',
      ],
      d: '0x4cfe43b3414734150b9802c65151e75d5d92fc320ce2140270fc16417b7c323c',
      ipaProof: {
        cl: [
          '0x36a46804a95f56c4a7158b330b1c5eb84ac656c4feaee52ea7851fac41e42d42',
          '0x3ad84841a0cd19cd35b1797ddf99fba8138b0e4b5abf427951f8f88d47c6e7c3',
          '0x4b92628640181c77e9d1f6738d628dbf98fe092c37d83b4c90c275753d90dcb5',
          '0x0d1ad8cf83f9fbaa6de06b11c126e57d6a2a2cddec5b428607751b88f5b2bc1b',
          '0x36d385c06fc8ece1ad2a19986255de3d2f30bb6eff51a77b8d432087b3abb2ad',
          '0x52f0b473975a14a772a95ff8fa48c760f7dd22782c79172ef41caca3aacbb53b',
          '0x34a922c9f680409ccfd4b99986f6ffd612552bdfce9c2f918588528fa9f820d7',
          '0x0163b071289cbf08855d04cef13d0a535d1118435453e377425ce2065366c312',
        ],
        cr: [
          '0x47c3fbeeaa52d109f66593ce906c5ccf68b7a0cdd8990e91c39d6b1870bd8292',
          '0x1abc2aea76b3c95e991183a80347ff95b97b31401cad3e869a5f751bebd9ca4a',
          '0x257b8a32afa91bdc49594a15dbcbe9e7559b7f428ad884dfb4bad181363b1d35',
          '0x2009c886c328a936eba8602afedbbe0f4d205dc57166f4ab9f8dd23e3297abef',
          '0x17543c43190105af91150b93b30e9a93a14ed3572d8ee270b34145a70cd18c64',
          '0x6f55003eb26376a41ec43194b52c483c58dbdf2c4aef0056a457440e67455379',
          '0x7002d5427dcc3ce7b1f5fe03284b8d9d2e2ea4f2fe05383fe5d7a755dcd13485',
          '0x3d3d0f44ff77c53c58155f514df27edbdbb9585f7666038f478209997cf1ffb8',
        ],
        finalEvaluation: '0x10c46a855d6be4f7e48f287ce25c219c0f469cc00d83888d44efbd1342da1d2b',
      },
    },
  },
}
