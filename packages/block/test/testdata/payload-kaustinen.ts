import type { BeaconPayloadJSON } from '../../src/index.ts'

export const payloadKaustinenData: BeaconPayloadJSON = {
  parent_hash: '0xec63025d318947bb19e62592700bff413774f5f4221fdf5f43483d2d4f7282e2',
  fee_recipient: '0xf97e180c050e5ab072211ad2c213eb5aee4df134',
  state_root: '0x23da55eeb85eb25e41ef77cf90f48cc233ca61dbd358ea4eb18e948f1a1eb8aa',
  receipts_root: '0xe0fe1a45471cde0fc7fe7dc68dcf471c7ef1e2bc8830a1af447ed482dfdb8496',
  logs_bloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  prev_randao: '0x64cb9d0e90916a35257e03799e8fe7b2fe9c57728c588a8c5c5f450a38108610',
  block_number: '16',
  gas_limit: '25393474',
  gas_used: '304213',
  timestamp: '1700826792',
  extra_data: '0xd983010c01846765746889676f312e32302e3130856c696e7578',
  base_fee_per_gas: '118604376',
  block_hash: '0xb0f9627cc04c9bbd449426fbceebfcfe70162c404d88cbfb2f92c446efccef2b',
  transactions: [
    '0xf8d4028443ad7d0e830186a08080b880637f6712f26b46d9af33fcbf777792e5fb8b4720632885c4cb6fa8e6672d075ccb06600d527f674a29362187f210c8cbe74d8b8e66305f2bf71c8712135ede6758c0c3c3173b602d527fe512799a5ce5d25b806c4bc17c11e4cf4af5e337c995baf62ca27ecccdca3457604d527fd00c13c9c1275fd3e9c3e275f59b9ae87c4983021e7ba009c22644a7771a0cfb7985a16d65a131b95ab30892b95d94766ac3f2166de19ba04e0b8189fcfd77d7b0bfbffeefe7c276d6a74008b8ea5d214e322df248e842ea',
    '0x01f8d683010f2c028443ad7d0e830186a08080b880b00e7fa3c849dce891cce5fae8a4c46cbb313d6aec0c0ffe7863e05fb7b22d4807674c6055527ffbfcb0938f3e18f7937aa8fa95d880afebd5c4cec0d85186095832d03c85cf8a60755260ab60955360cf6096536066609753606e60985360fa609953609e609a53608e609b536024609c5360f6609d536072609e5360a4609fc080a08fc6f7101f292ff1fb0de8ac69c2d320fbb23bfe61cf327173786ea5daee6e37a044c42d91838ef06646294bf4f9835588aee66243b16a66a2da37641fae4c045f',
    '0xf8e8038443ad7d0e830186a0947d6d36747b8ea52262e49b74bb9f87caa8daca6280b8806000603755246000601455600060f1553c366000605b557f75ef0f16a0868b2c405a9362ef681bfc366b9dd99b958e51d577ecca0a76721c60b6527f3d5d33647b161dc9e71615d1998c9a3af9766f97713c94d164df2c2b696c202760d6527fe95abb8c9fc1c1fd326c3449dc470e13c098d5fe60a4cc120c72c9d41873a95c83021e7ca0bf6aa963791f11ef2129d722ab5bf0d00a85f25531ed9ec426b933b10978a1faa039651aaf90292ca0635f599f72ac7a073dc65645a2cdea7f0b0c34e91291243a',
    '0x02f8db83010f2c03843b9aca008443ad7d0e830186a08080b8807faaf3e276bfe110e442190ef16d739b8055e9e211cee47504dabfb7d7663914c160af527f4b7418198af143733d1893086fd71782d8ae52f9bc7c7dfa8e8cedef9d4470b160cf527fb193983dea2a9d3fafdfd40d8e21a3876a136835585ed2ad36ac31ffce7c1eef60ef527fa7490cdb9efb515f429a3872e7c9b22b9eb6e6c001a0cd82cec9c75f3ece7920fb2f03bd6b52cbc0283906cb821d594f6db0d8c0e4efa0629894b5f4c8bb657939b9be2e503a866e9ae04559d4601ea2b85aa9f1d45001',
  ],
  execution_witness: {
    parentStateRoot: '0x',
    stateDiff: [
      {
        stem: '0x0e88cc6bf033a3ff779335e720d5a7edf907cc70ab7ff31375cd485db779fc',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: '1',
            currentValue: '0xa02a5714d2bf1400000000000000000000000000000000000000000000000000',
            newValue: '0xa8cddb4be60f1400000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '2',
            currentValue: '0x0200000000000000000000000000000000000000000000000000000000000000',
            newValue: '0x0400000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '3',
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: '4',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0x538469dc3579eaab593b006fd639cc3e684d89d72c47e146af14de3bc1d8d6',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '2',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '3',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '128',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0x8dc286880de0cc507d96583b7c4c2b2b25239e58f8e67509b32edb5bbf293c',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: '1',
            currentValue: '0xe8609d0137a50100000000000000000000000000000000000000000000000000',
            newValue: '0x28f57ad475bd0200000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '2',
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: '3',
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: '4',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0x944dd4f046fcf7d15be20d96506c27132625d36427c461925c3fcdde266f1e',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '1',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '2',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '3',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '4',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0xc484e43d783cf4f4eded1a8cee57e046e1ac2aaf6937ca4821263f0dbc759e',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
            newValue: null,
          },
          {
            suffix: '1',
            currentValue: '0x00c6e41919c21400000000000000000000000000000000000000000000000000',
            newValue: '0x80a7bc4cf5381400000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '2',
            currentValue: '0x0200000000000000000000000000000000000000000000000000000000000000',
            newValue: '0x0400000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '3',
            currentValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            newValue: null,
          },
          {
            suffix: '4',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0xe6dcb23b706bef86b024138db380c183135ec13b256b3c5df2ef89f502ef74',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '2',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '3',
            currentValue: null,
            newValue: null,
          },
        ],
      },
      {
        stem: '0xe9ae7df7c4873b986de83662c728236fb51a4b65a17c2cff179417305f30cb',
        suffixDiffs: [
          {
            suffix: '0',
            currentValue: null,
            newValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '1',
            currentValue: null,
            newValue: '0x0000000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '2',
            currentValue: null,
            newValue: '0x0100000000000000000000000000000000000000000000000000000000000000',
          },
          {
            suffix: '3',
            currentValue: null,
            newValue: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
          },
          {
            suffix: '4',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '128',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '129',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '130',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '131',
            currentValue: null,
            newValue: null,
          },
          {
            suffix: '132',
            currentValue: null,
            newValue: null,
          },
        ],
      },
    ],
    verkleProof: {
      otherStems: ['0x9444524c2261a7086dd332bb05d79b1c63e74913a97b7b85c680368b19db0e'],
      depthExtensionPresent: '0x0a101209120808',
      commitmentsByPath: [
        '0x1ba24c38c9aff43cf2793ed22a2fdd04282d558bcfad33589b5e4697c0662e45',
        '0x0de9b2e4fb439b894823a068a74e69d51b53163df509614239b95efd1c8251df',
        '0x5788aad2dc6a6395d1850740f0cf2c566d31dddc6a1c168113a242d5d380e1ac',
        '0x0fa21597f7807a78df4d0025d94afa9d544fad74bae7e9fabe9a5dd96eae7905',
        '0x1473a7ba8fa6c910e3a59fb1746484cf0f3eef394567c57b68cfefd75e0a4628',
        '0x402c1868e1aaba747dc0e00c3cb1cf39340d9cc90a34429da67fa1702fe48604',
        '0x1334eccc70ec78c896cbe5c99aa5dc90ab230bc02586512fbf7459ef54346821',
        '0x0574898a568127f92d0a5f8a2ca4fbf0a3db39e060d41b490049840e60666a9b',
        '0x708fb101a8e1323a8dbe02501a54ed40ab78ca37f3c018f793d853126f159d86',
        '0x6480d4463d8547240aac907548e430a939d5ad90ee44ae5f968ddb4037e8a578',
      ],
      d: '0x4b7e78004d063f6418f4ea02498b0ea211eedc482a4fd49f05735403be907a6e',
      ipaProof: {
        cl: [
          '0x39e9dc9695f1534fb6e883de9e4a1e8e1ec3bef91ad51ffcfb72e41898010558',
          '0x099be66677ffd008a86e3ba05ffb70fe1535886424303b1ed1324180fe41f12a',
          '0x6cabb149cdc43240b2398dad37febf662329f9af953e463f9662a72f6971adf1',
          '0x2cea63f2b132ed167454aa229d726399edab0263b90370a9d149b2f3220c2833',
          '0x08dd76bfdaec231d4732af246e4ae4b656fbf92b032d3471729e11328b6d1a08',
          '0x09e5f57d3e792c63d4800bbdf8ab0a102845cab98db81cfd0e79c8dce3747f3e',
          '0x4dfe893891819830dec0fb7eea2cb783fd9210607c886fa16d0484c68b45e1c7',
          '0x07e212a298f21a9adcc9b42925351f76260ec60166c413802369128bc6d9b8d2',
        ],
        cr: [
          '0x5aba75dd90c208635d6fbbd003fc7766a04ff7410095012d71be2105df3b958a',
          '0x6bf90b634ef36282fcab11c69c0e805cbb229bdde70374da3a2bdc90c9dfb777',
          '0x2959f7dc3e707358b348a6500711f8d4982ba7045bbbb98f683280459828665b',
          '0x6a6a545af490bc817f05991c5bf3baf68e6e57f15c941cac1b9d830ab7494871',
          '0x315ad7dd1ea1739a0449a7c55ea9d03ffa63b42983475e66b77bc911587a7605',
          '0x2442064885b7b419109d3acc55959ff71e28ca5f4964311cbc84d4a1fd150310',
          '0x67c63669a994760c4184050b8e4782b988c1387865fa09a60000e1ab35a13caa',
          '0x61ae59caee9d1365905b30486ac582c93a8e21d94477fe684bb0aeeaeb691bec',
        ],
        finalEvaluation: '0x02a346441c5cc6ae6e5c1300494434b0d4f20ab0a8179971631be9e4147589fc',
      },
    },
  },
}
