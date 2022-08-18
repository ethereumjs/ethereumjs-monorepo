import { RLP } from '@ethereumjs/rlp'
import { CheckpointTrie, LevelDB } from '@ethereumjs/trie'
import { Account, bigIntToBuffer } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import * as tape from 'tape'

import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { SnapProtocol } from '../../../lib/net/protocol'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

tape('[SnapProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('GetAccountRange should encode/decode correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const root = {
      number: BigInt(4),
      stateRoot: Buffer.from([]),
    }
    const reqId = BigInt(1)
    const origin = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
    const limit = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)

    const res = p.decode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], [
      reqId,
      root,
      origin,
      limit,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], {
      reqId,
      root,
      origin,
      limit,
      bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.root) === JSON.stringify(root), 'correctly decoded root')
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(
      JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(root), 'correctly encoded root')
    t.ok(JSON.stringify(res2[2]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(res2[3]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(JSON.stringify(res2[4]) === JSON.stringify(bytes), 'correctly encoded bytes')
    t.ok(res2)
    t.end()
  })

  t.test('AccountRange should encode/decode correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(Buffer.from(contractAccountRangeRLP, 'hex')) as unknown
    const { reqId, accounts, proof } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      data
    )
    t.ok(reqId === BigInt(1), 'reqId should be 1')
    t.ok(accounts.length === 2, 'accounts should be 2')
    t.ok(proof.length === 7, 'proof nodes should be 7')

    const firstAccount = accounts[0].body
    const secondAccount = accounts[1].body

    t.ok(firstAccount[2].length === 0, 'Slim format storageRoot for first account')
    t.ok(firstAccount[3].length === 0, 'Slim format codehash for first account')
    t.ok(
      secondAccount[2].toString('hex') ===
        '3dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40e',
      'storageHash of the second account'
    )
    t.ok(
      secondAccount[3].toString('hex') ===
        'e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66',
      'codeHash of the second account'
    )
    const payload = RLP.encode(
      p.encode(p.messages.filter((message) => message.name === 'AccountRange')[0], {
        reqId,
        accounts,
        proof,
      })
    )
    t.ok(
      contractAccountRangeRLP === Buffer.from(payload).toString('hex'),
      'Re-encoded payload should match with original'
    )
    t.end()
  })

  t.test('AccountRange should verify a real sample', async (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const reqData = RLP.decode(Buffer.from(getAccountRangeRLP, 'hex'))
    const { root: stateRoot } = p.decode(
      p.messages.filter((message) => message.name === 'GetAccountRange')[0],
      reqData
    )
    // accountRangeRLP is the corresponding response to getAccountRangeRLP
    const resData = RLP.decode(Buffer.from(accountRangeRLP, 'hex')) as unknown
    const { accounts, proof } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      resData
    )

    const trie = new CheckpointTrie({ db: new LevelDB() })
    try {
      const accountRLP = await trie.verifyProof(
        stateRoot,
        accounts[accounts.length - 1].hash,
        proof
      )
      if (accountRLP === null) {
        throw Error('Account should have existed in the verification trie')
      }
    } catch (e) {
      t.fail(`AccountRange proof verification failed with message=${(e as Error).message}`)
    }
    t.ok(
      Buffer.from(keccak256(proof[0])).toString('hex') === stateRoot.toString('hex'),
      'Proof should link to the requested stateRoot'
    )
    t.end()
  })

  t.test('GetStorageRanges should encode/decode correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const root = {
      number: BigInt(4),
      stateRoot: Buffer.from([]),
      hash: () => {
        return Buffer.from([])
      },
    }
    const reqId = BigInt(1)
    const origin = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
    const limit = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)
    const accounts = [
      new Account(BigInt(0), BigInt('40000000000100000')),
      new Account(BigInt(2), BigInt('40000000000200000')),
    ]

    const res = p.decode(p.messages.filter((message) => message.name === 'GetStorageRanges')[0], [
      reqId,
      root,
      accounts,
      origin,
      limit,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetStorageRanges')[0], {
      reqId,
      root,
      accounts,
      origin,
      limit,
      bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.root) === JSON.stringify(root), 'correctly decoded root')
    t.ok(JSON.stringify(res.accounts) === JSON.stringify(accounts), 'correctly decoded accounts')
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(
      JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(root), 'correctly encoded root')
    t.ok(JSON.stringify(res2[2]) === JSON.stringify(accounts), 'correctly encoded accounts')
    t.ok(JSON.stringify(res2[3]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(res2[4]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(
      JSON.stringify(res2[5]) === JSON.stringify(bigIntToBuffer(bytes)),
      'correctly encoded bytes'
    )
    t.ok(res2)
    t.end()
  })

  t.test('StorageRanges should encode/decode correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(Buffer.from(storageRangesRLP, 'hex')) as unknown
    const { reqId, slots, proof } = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      data
    )
    t.ok(reqId === BigInt(1), 'correctly decoded reqId')
    t.ok(slots.length === 1 && slots[0].length === 3, 'correctly decoded slots')
    const { hash, body } = slots[0][2]
    t.ok(
      hash.toString('hex') === '60264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79',
      'Slot 3 key'
    )
    t.ok(body.toString('hex') === '8462b66ae7', 'Slot 3 value')

    const payload = RLP.encode(
      p.encode(p.messages.filter((message) => message.name === 'StorageRanges')[0], {
        reqId,
        slots,
        proof,
      })
    )
    t.ok(
      storageRangesRLP === Buffer.from(payload).toString('hex'),
      'Re-encoded payload should match with original'
    )
    t.end()
  })

  t.test('StorageRanges should verify a real sample', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })

    // Get the handle on the data for the account for which storageRanges has been fetched
    const accountsData = RLP.decode(Buffer.from(contractAccountRangeRLP, 'hex')) as unknown
    const { accounts } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      accountsData
    )
    const lastAccount = accounts[accounts.length - 1]

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(Buffer.from(storageRangesRLP, 'hex')) as unknown
    const { proof } = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      data
    )
    t.ok(
      Buffer.from(keccak256(proof[0])).toString('hex') ===
        (lastAccount.body as any)[2].toString('hex'),
      'Proof should link to the accounts storageRoot'
    )
    t.end()
  })

  t.test('GetByteCodes should encode/decode correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const reqId = BigInt(1)
    const hashes = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)

    const res = p.decode(p.messages.filter((message) => message.name === 'GetByteCodes')[0], [
      reqId,
      hashes,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetByteCodes')[0], {
      reqId,
      hashes,
      bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.hashes) === JSON.stringify(hashes), 'correctly decoded hashes')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(
      JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(hashes), 'correctly encoded hashes')
    t.ok(
      JSON.stringify(res2[2]) === JSON.stringify(bigIntToBuffer(bytes)),
      'correctly encoded bytes'
    )
    t.ok(res2)
    t.end()
  })
})

const getAccountRangeRLP =
  'f86501a06f2b67d566fd7e82160a07d68d209ff56b87f5da362d5d60919a65550c89ac2ea00000000000000000000000000000000000000000000000000000000000000000a0f000000000000000000000000f0000000000000000000000000000000000001064'
const accountRangeRLP =
  'f9097101f87ce6a000009b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625c411808080e6a00001b989dc49b9df17e95a9e1e50870aabf88e21b9d4cd4811b5507dad53517cc401808080eda00001ea42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefcb01870360051c8960008080f908efb90214f90211a0c1278c80295a5fd765db6f3ddb5848683d8451ce795e45cb45e58c2bbea38b23a09058fbfd1194da5ea2c32fe6621c87c311a521f3ade5a6fcdfb2ce6c77cc9457a0ca279fd327589e0862fe3108b5ded8d1591af95c21e49de44a7c530da86d1d5ba0060137d87fe07e9e74d2ced2631f31ff0f2e1a77ec8e55a0e3c0d95049aa3a81a0c7153c1a920cf18b4ddf2069572c60429a82fac1d617c7186eb5f2f6c67bb3eea008cb3728001b9e04fcf14818826a5c379cccc3f45df0b76c2a86bb7588354462a09bec68f4684acd7c0b81b49b6705cb90a21390046e5233eb8a3eceb362d7e699a0954b9259abd98bb1bbf3caef798f9b2c67394670c926900ccf5751253ed4f87aa003beafd9e8e865d5610de7f137d404814cf6c4a12085dae8892266de62ef660ba06236e72b0960753708738bacb7cb4f4ff1c8b2e915e9a18599c75603dda597eea0b063b409a64860fc0d300eba3d772b30680881d938e6ebaabd80f82a753b4414a0846bff10a2dd3084bd983544aaeaf01770867aa572162869a6fe77609bb36dbfa0e467d24298c2eabe85e2c94b8c923a1a514c12a5c9b8e2181216d8317e010693a0bad67c670ec6fd973215ff412f58f3f54a9018866b04869002d3e6e4208f4c2ea086fe0af717dc7e5c127ec7396e1d0e16fad054109942cb0a8dc4348ebb82398da011bb9f0056d3a9e901b99c73d2d3e76215b47c333365d8b8a73e1acade5bda4b80b90214f90211a0b00ba2f0bfa01de02b767dcdf38c7f5691e5c340def6df806741a59d85bd2a13a05658dbc276709dbf6bf2b28872227646841f6f0d0fe1da001a0d08725b9a060ca09c950f1c934b5298bdebd8e65a26bf8f6edb269cd3fcaaf37915695aa30e870fa05f46b447501b5831596af8212cdb5f5d00fa3c70e9eaa13f5b3731d4a2a1bf5ba0d247a7b93cca2a31070f508fb093576145e0f9a83ccff8fa2d6bf2ff42abd78ca0be5a7c7a50fe9ff7e9c6c0e1a8a960721fa3ca81dad009b3f74da76ac905c1eda0713fbc2d738d788f9de1e3b9c21cb51a8ef8814c0b2c650e93edfd442125fdb5a04174b732f2b7b079ad9941c2a445d2c23c604c5d448b9200c9bc24332f0d018ba04bc37f9ba4124a538df315d7d07718f30fd9e715cbf0837a89a4ea0e8db2852ea0a948b1640a4cfe054be12c3d92f4c7a8c2b93e87f5cbf0df9f6ebe89160b6ccaa0bf660df9cd53c9ce329942f8a6ce5e276fe29fde33e4ed94a73ffd11d116ac20a02051566c8da26729f53eaa1c08b8fb80d955a8dce41b52ea1a80d19604225e79a0d7977ed0bc385e1554e9fdc7fc1fa5f11e1ab354edcbb2b2bbc86b3458e16bfca07e455873c9ab889267be0090716d6b81981ee744a498e5e7c7e7537b3660e09da0f4e9fee500e1d0c09356223097b8b4bdd562575cbd6c7520a791b5d1d06bcc8ca075ea32ed4754e8fa6ac42396ec52159c755319ef139a40c89135780f02d2cd3d80b90214f90211a005d5c908571626e6429a2e60c12fb0a7cbb792990237b07f0b895262dd468002a0e8832065be7f27bfc9622718b3217e764a64139809e83a4f346974d0bf6d4cb1a0884edcf8063cd210c4f055c9a65fa9ba9f3140ed7b5ffea534eb46543747312ca06939eb03dfec57d4b19633637f591f9c9eaf823bb4b881cfee6d4f2cc438de15a0b3465275b807743c9d2babcc187bccfd4d5875e3be850ba15bdb49ecb0756b33a019f64beddb99d42a6d0aa559bb742099b75a56119110e536aec1e0dc8426d4bda00b2a64b5cfd0465225a77e8d36f33a8cd2e2955dd27f17858c6bff058560073da06d29ec54698740d1b0a31fbc108f7a7f34b54fca2469a1e741a7e6d238ca3223a089b0a60705c5aabdc613843831737ab0d4924dfaa98e36d0da5c5c701b9a184fa0beb52c58a15cbc60614935c901236d604e45a6fb777c5c2a96bbdaa6c5643401a091e8e3621e73c2f97d2f8a1e6aa0502c2d39c760c8ec75d5bb74dcb8c6042b07a0919f563a2f826f3375e0171d7aaed13d5d430231bb3ab153a804dea6ff3fad48a076199370d103d86301ddcfbac8dca567b32156d50d3884cefc52c86229b9c4dfa0d37db1d1a795c0ffd9fd3dab57c98b0986529ab1f32d306cdfd5063a2371875da019c8b72759269ffff97d1b3284696b037eb984c4520d3be799b49716e77d888fa08a5777ee67d4d9592dcd388b0f0f14a02225468f9d3339dc1d9ef25fb85f30f280b90174f90171a093c39d2f8d596b9d295b60221892e54bf39c276b77f25be68195379766ac6f1aa0f67ae81c632b1fcabbf55700389ff5735666139a48fcb88b1ec49e76d89f0dcda03ff27dc7b513d1790150232542a066f377c345d94891b818098ee07539656f8f80a04d0bd2a7147dd2e8dbd0b3e1166ec5f8f38e2509c4d7647bcb4d5f88bd0c015ba08d5f743d005ba218dbda14eb3e599616dfd95de81a52271cc7068c8d7d02b954a0319a502e4ba85543f9e87b56742ffa93e6bad838f6621173c268b6a47d927c66a0042be4c968761c0bb12a1663afc013d9224cdaafd24faa13af29ec685c5a9681808080a04c058f78c59efa16cf457b01f273d9a593d9bdb7b80bdee9172e1aa94bfb56e6a0e7198822750da3bafcda0bd58bc813c190a3e220710c8bb6eef3036061234dc0a028fb2d97af7dea9285b566bbd754bd20b8cb24abb865d382ebc14e7c2994be7fa0ac77041d0371ae76a4ffb9440a3bc827660d4bd2fc535cfd95c213524e89fd908080b86af8689f209b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625b846f8441180a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470b853f8518080808080808080808080a00cd5b0af242798bc101250a06cbfbdf37aec6ddb42aa1428ea9e51440650c3d18080a0f6d819bdf6861f54f23de70f48431954d5f0e20a0372ecb1cbdbf526beafd6b88080b870f86e9e3a42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefb84df84b01870360051c896000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

const contractAccountRangeRLP =
  'f909cb01f897eda027be64f6a1510e4166b35201a920e543e0579df3b947b8743458736e51549f0ccb0187059d006abec0008080f867a027be7c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215f8440180a03dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40ea0e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66f9092eb90214f90211a03e317f72529393d592a14a980728964491a795b0b17bce46dd6462cd73178528a031d9a927f50c38e26b733420d54e018ad136a2acfb0f62ff0a530622d0910501a0e16176464ca43ffccd8dcac69c254e4c232b3736cb50b22fcba2aca674d97657a0c468309ef106b3c7c011c79bbf30f6d84f50e9ee70efcbb6e2ee3ed3532d8d5aa04b7a7527c301a3e8ccaa0065144bcca966d4dc1bf5091fffb59fee96235ddab7a0cc9f49ba7f69154937a24ce1bdce4c525c57fad23a866d35cdc14a0ffb4fd569a05c6688038fa3c868118abc35cb33757b11892df27f5949be6533822d38d023cba0bcd60cfb5cd40113a3b91ef2ef582a5598e1d1c02f4ef19eb3a01f4a7385d9e2a0b01c57e7623a52c797bfad0b234864f0478defd52a604f52c6c13240cf263582a0467b446d76308ce3f6afabbb9e50487842359da4c5ea803c98d01ea1100ee3a9a041cc43991ff1d05d306179415fd0108c80af2ed0ecc1968d54c4804a3a3e7d26a0de817ee6846ebffe2f0ba07b9e43a5531deb13fec227914fa829cf9e0b6b1feba0d110eeeee544612b96d241eb1923301192bc1937105c4f8d42950074d1b20523a042c0d15d6d12fed334ac2905230c9596dbac86c43e2f7659649a0aaabb614a59a05e4fde55ac428253d2bf44dbacdd90617c6c7a7037ccff59bf1bd5e8e9fd8cb1a0b93d6175cacaa3ff73e2be3aa1bf980a3a0f08554b46cc9346687b5436a9af9080b90214f90211a03fb9d5e64403a8b57c0d8f19b52be351600547e0810d2bd363ce27fca733c351a0cd52ee7470e730d3f28b2ffa8b6521061b79d5d6c19743953dc2c444a6a7a9a8a05ffa4be37e29f4506242483f75d1b2e6b834e38e2f3008ee278ef6f3859d3fbea01ad32ca2d763d2c80b1d2726a9e9d76b19f7aaa343c0ecdae7d4c528216c38aaa0ad31f5349953c3284cf53b6f64d5f50520d77415d68ac8c2c74e11e20328e930a048ad1822f5b77ed9199a0ed08dd819f609420f4859c68795ee85c60a337e77e5a08b8a8b33dfe0ac28f5528a76f4ba05475f0c11a1c1a43eff431a19c4e106241fa0a65e791df46225d6f86b19c29ecd3fb1515e43425cf62520c04b78dc05042db0a02767fe0d42f7171f249a3bca1fe485feeccab4a4e54562cf9d86246d61d69d45a026165555bfc36933cbae97d2c9ca3566789dd65b26f5b1459b883e5817c4d842a0e9847655d69a1d2765b177c9effca84e30a4358527378e0e2579290cd2bfe1d7a0176d992c06eac5d9709b0c88ab9662ff33d8832a3a656844adcfcda20a7a5d1ea0517bb9f09a79ac65969b60ed8cf88ad4469a8c089392993ed5ae36588d167ce3a06c2d5a9a44fcbdb4a78cadf1ff198e13a05a1cbfdfe4322b651a54fba43c80c4a0f31f6a2b80f6e5994e4d7a6d7ade8e374717ecb382a6c2e2fa84da289a7311dda0da149b02c25ec3cbe790d968f3f0796b1d97b47406c4e048c0876f188c8843db80b90214f90211a05692dce2e2b9e931f11de516711dfc9fd7f072aafa94246842327bb5cc88d299a05a34d682e1f48b5c7a561899cadf6d9f5728a28b47a2299c50c583401c8adcf4a09ac2be05ecbf11e8f04293413c3f265ba0f7936fdca301e70e863a3fd97351f2a0be65aeda766d5b431ba66f6fc7426d1d14225f4c7c21abf531b1179bd723de37a0d434197f2a4d480134b96f54df371cf553bc9d419bf7b8fe97915c3bafe5cc38a06a6f87d8033eb91704f16d3bc5ac7d1dd92ccea236a66f7bee58ea6ddbd66662a03dcae49ff1dba7426fe91798df52719aa8aec85bb8ecd290a8c7f3f625c0e04ca0da18286af20d2bef143807e6153ebef7c4bbce1a8758759e5c868245302dc522a082e530d64d6839289db6a7ba5fc084203054555b4c22b36c95792cb73afdb5c1a0a7b0b714bf64e738ffdc0bc2450469a1ee53e0eb2ac6604de791b93280d9522fa0649ce83d40c4071a4a6f3241cdc97884cad2820106df5a558cd1460a51af737ca0d9e5428057bd3ea9c9ee66fe928d1c5fe2291f038798b627a6ba32132aa446c8a036df1ab5e4a79ecb2083143256cda9964baab9af378806c66d8116c5ac9d1c18a0ab83c42863e83767739e3557582ab1a9ec0546202522bf8142d2abe4339ef547a07063deef264a623d2fe6e94863a6daedd8f4431aa15db5c5f08d60db15be8889a00d4901e40f514f6bf7ed86f0ad4ff104c73dd34583398b06044ffb6c0ef0ceaf80b90194f90191a021100e99c4cf6f11817174a1d6494935c5db672a4147e2d7c7b1183d1cd194dd80a0a60cc6818e6cb02b94dd71ee2cf9945b296bd1a97f18132865a8c4ee5f8d808fa0c82f7a3e2bd946f042a958ae4e45463b2bdfb41d13791b0284e741b8d088e809a01b33f2aff8cfe1f85607cda408ab1be19824112301cb5bf7ad39c33ca6a3ae6ca0136ee30ad667bd05b9032352046171e5a4b1cc6f0dab92447cd1e993d176d11380a002989ef278f5e1ea994d747aa0e03eff3781884176a11244bfa0093e0cbabaa0a0e2ce43841c561596e3c20ca0d9e65926877bb0563f97d8ba840bff17bc71eedc80a0355479422e131a63a41dfff1359c763783128c2ca46113cc2fad097716d980cea0ca2306ad965fd1fc2c374794f27f9ae974e4518acfc5a45c4fd243faecdbb968a0b70fe21f9920ffb1e85f76f3d68ace66fda9fba2a18ee40c56be30d205e163b180a0a87f04fea647cc1fab13bbd4f95c99da77b56d1ba3e70b2bfbeffb00b85bec2aa01736c3eae15545b633b8344eda0d6f53d3de180b9b1abd4d5f0452ef8a8d197880b873f871808080808080a091ce7aa54a929b46c827f31c7a50e4d820d7e0c940cf2fdfe8f489ef3f5ada62a0d9b516fbc9b3dc7ceb6045550fc6eb75301f312f7ce74374d8f90f7248dbfeac8080a0f92923e2c55de59cbd770ee6bb9cd1f6ddf481e60e80c25839faf29c8850dbad808080808080b870f86e9e34f6a1510e4166b35201a920e543e0579df3b947b8743458736e51549f0cb84df84b0187059d006abec000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470b869f8679e3c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215b846f8440180a03dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40ea0e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66'

// Even though we don't require using getStorageRangesRLP in the test, but this is here in case one
// wants to inspect the request that led to the response
const _getStorageRangesRLP =
  'f88701a0842c311cc3e0242fe3877f10a06ff26581a5102ddc1d3de1198dc081e2407fe9e1a027be7c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215a00000000000000000000000000f00000000000000000000000000000000000000a0f000000000000000000000000f0000000000000000000000000000000000001064'
const storageRangesRLP =
  'f9020201f885f883e2a0011495c4db39fdb3ff374636d517fe5802b9856190833a6cec035be5d4928a7c01f7a0290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5639594c72da985e2209a8ea7bca2f2a5e2308b7c4a3929e7a060264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79858462b66ae7f90177b8d3f8d1a0072ebf377f0339cbfdf33e9ec4a7ca991324dacfcb249467567d260835778f4480a06abdc8e224c631c3998a6c2a982d3dddb4d071739433b45e8a086b0a02a5c9dd808080a0c3d3e38f431316e13d65759577651bbf81d8e25b5dc6b583bbbc9c2f5f332be680a06512473128eb2f4b680fdcfd7e3d05ec0ad9bdccbfe10dbea0e8519945ce8df7808080a04e4ac86a66b6adb6cceffd43be3970fb09804b6c63eabbacc87b3b6f8cb1729080a0d68af628d6ba5ce332a2182b0da71ca12010a9a80c37bd95244446c36fe65fb38080a3e2a0311495c4db39fdb3ff374636d517fe5802b9856190833a6cec035be5d4928a7c01b853f851a07a674b9ad2b903117d470c39b3f7070a9ffef66e9b6d5ef1df82a656dbcad0c4808080a0530024120eca2e19bde6a5bf7ffcea39cb938fa79f77cccb61121ea27032688b808080808080808080808080a8e7a020264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79858462b66ae7'
