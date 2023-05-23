import { RLP } from '@ethereumjs/rlp'
import { Trie, decodeNode } from '@ethereumjs/trie'
import {
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountBodyToRLP,
  bigIntToBytes,
  bytesToHex,
  equalsBytes,
  hexStringToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Chain } from '../../../src/blockchain'
import { Config } from '../../../src/config'
import { LevelDB } from '../../../src/execution/level'
import { SnapProtocol } from '../../../src/net/protocol'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

tape('[SnapProtocol]', (t) => {
  t.test('should get properties', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('GetAccountRange should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    const root = new Uint8Array(0)
    const reqId = BigInt(1)
    const origin = hexStringToBytes(
      '0000000000000000000000000000000000000000000000000000000000000000'
    )
    const limit = hexStringToBytes(
      '0000000000000000000000000f00000000000000000000000000000000000010'
    )
    const bytes = BigInt(5000000)

    const payload = p.encode(
      p.messages.filter((message) => message.name === 'GetAccountRange')[0],
      {
        reqId,
        root,
        origin,
        limit,
        bytes,
      }
    )

    t.ok(
      JSON.stringify(payload[0]) === JSON.stringify(bigIntToBytes(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(
      JSON.stringify(payload[1]) === JSON.stringify(setLengthLeft(root, 32)),
      'correctly encoded root'
    )
    t.ok(JSON.stringify(payload[2]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(payload[3]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(
      JSON.stringify(payload[4]) === JSON.stringify(bigIntToBytes(bytes)),
      'correctly encoded bytes'
    )
    t.ok(payload)

    const res = p.decode(
      p.messages.filter((message) => message.name === 'GetAccountRange')[0],
      payload
    )

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(
      JSON.stringify(res.root) === JSON.stringify(setLengthLeft(root, 32)),
      'correctly decoded root'
    )
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)
    t.end()
  })

  t.test('AccountRange should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(hexStringToBytes(contractAccountRangeRLP)) as unknown
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
      bytesToHex(secondAccount[2]) ===
        '3dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40e',
      'storageHash of the second account'
    )
    t.ok(
      bytesToHex(secondAccount[3]) ===
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
      contractAccountRangeRLP === bytesToHex(payload),
      'Re-encoded payload should match with original'
    )
    t.end()
  })

  t.test('AccountRange encode/decode should handle account slim body correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const pSlim = new SnapProtocol({ config, chain })
    const pFull = new SnapProtocol({ config, chain, convertSlimBody: true })
    // accountRangeRLP is the corresponding response to getAccountRangeRLP
    const resData = RLP.decode(hexStringToBytes(accountRangeRLP))

    const fullData = pFull.decode(
      pFull.messages.filter((message) => message.name === 'AccountRange')[0],
      resData
    )
    const { accounts: accountsFull } = fullData
    t.ok(accountsFull.length === 3, '3 accounts should be decoded in accountsFull')
    const accountFull = accountsFull[0].body
    t.ok(equalsBytes(accountFull[2], KECCAK256_RLP), 'storageRoot should be KECCAK256_RLP')
    t.ok(equalsBytes(accountFull[3], KECCAK256_NULL), 'codeHash should be KECCAK256_NULL')

    // Lets encode fullData as it should be encoded in slim format and upon decoding
    // we shpuld get slim format
    const slimPayload = pFull.encode(
      pFull.messages.filter((message) => message.name === 'AccountRange')[0],
      fullData
    )
    const { accounts: accountsSlim } = pSlim.decode(
      pSlim.messages.filter((message) => message.name === 'AccountRange')[0],
      slimPayload
    )

    // 3 accounts are there in accountRangeRLP
    t.ok(accountsSlim.length === 3, '3 accounts should be decoded in accountsSlim')
    const accountSlim = accountsSlim[0].body
    t.ok(accountSlim[2].length === 0, 'storageRoot should be decoded in slim')
    t.ok(accountSlim[3].length === 0, 'codeHash should be decoded in slim')

    t.end()
  })

  t.test('AccountRange should verify a real sample', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const reqData = RLP.decode(hexStringToBytes(getAccountRangeRLP))
    const { root: stateRoot } = p.decode(
      p.messages.filter((message) => message.name === 'GetAccountRange')[0],
      reqData
    )
    // accountRangeRLP is the corresponding response to getAccountRangeRLP
    const resData = RLP.decode(hexStringToBytes(accountRangeRLP))
    const { accounts, proof } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      resData
    )

    const trie = new Trie({ db: new LevelDB() })
    try {
      const keys = accounts.map((acc: any) => acc.hash)
      const values = accounts.map((acc: any) => accountBodyToRLP(acc.body))
      await trie.verifyRangeProof(
        stateRoot,
        keys[0],
        keys[keys.length - 1],
        keys,
        values,
        <any>proof
      )
    } catch (e) {
      t.fail(`AccountRange proof verification failed with message=${(e as Error).message}`)
    }
    t.ok(
      equalsBytes(keccak256(proof[0]), stateRoot),
      'Proof should link to the requested stateRoot'
    )
    t.end()
  })

  t.test('GetStorageRanges should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    const root = new Uint8Array(0)
    const reqId = BigInt(1)
    const origin = hexStringToBytes(
      '0000000000000000000000000000000000000000000000000000000000000000'
    )
    const limit = hexStringToBytes(
      '0000000000000000000000000f00000000000000000000000000000000000010'
    )
    const bytes = BigInt(5000000)
    const accounts = [
      keccak256(hexStringToBytes('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')),
      hexStringToBytes('0000000000000000000000000f00000000000000000000000000000000000010'),
    ]

    const payload = p.encode(
      p.messages.filter((message) => message.name === 'GetStorageRanges')[0],
      {
        reqId,
        root,
        accounts,
        origin,
        limit,
        bytes,
      }
    )

    t.ok(
      JSON.stringify(payload[0]) === JSON.stringify(bigIntToBytes(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(
      JSON.stringify(payload[1]) === JSON.stringify(setLengthLeft(root, 32)),
      'correctly encoded root'
    )
    t.ok(JSON.stringify(payload[2]) === JSON.stringify(accounts), 'correctly encoded accounts')
    t.ok(JSON.stringify(payload[3]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(payload[4]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(
      JSON.stringify(payload[5]) === JSON.stringify(bigIntToBytes(bytes)),
      'correctly encoded bytes'
    )
    t.ok(payload)

    const res = p.decode(
      p.messages.filter((message) => message.name === 'GetStorageRanges')[0],
      payload
    )
    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(
      JSON.stringify(res.root) === JSON.stringify(setLengthLeft(root, 32)),
      'correctly decoded root'
    )
    t.ok(JSON.stringify(res.accounts) === JSON.stringify(accounts), 'correctly decoded accounts')
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(payload)
    t.end()
  })

  t.test('StorageRanges should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(hexStringToBytes(storageRangesRLP)) as unknown
    const { reqId, slots, proof } = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      data
    )
    t.ok(reqId === BigInt(1), 'correctly decoded reqId')
    t.ok(slots.length === 1 && slots[0].length === 3, 'correctly decoded slots')
    const { hash, body } = slots[0][2]
    t.ok(
      bytesToHex(hash) === '60264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79',
      'Slot 3 key'
    )
    t.ok(bytesToHex(body) === '8462b66ae7', 'Slot 3 value')

    const payload = RLP.encode(
      p.encode(p.messages.filter((message) => message.name === 'StorageRanges')[0], {
        reqId,
        slots,
        proof,
      })
    )
    t.ok(storageRangesRLP === bytesToHex(payload), 'Re-encoded payload should match with original')
    t.end()
  })

  t.test('StorageRanges should verify a real sample', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    // Get the handle on the data for the account for which storageRanges has been fetched
    const accountsData = RLP.decode(hexStringToBytes(contractAccountRangeRLP))
    const { accounts } = p.decode(
      p.messages.filter((message) => message.name === 'AccountRange')[0],
      accountsData
    )
    const lastAccount = accounts[accounts.length - 1]

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const data = RLP.decode(hexStringToBytes(storageRangesRLP))
    const { proof, slots } = p.decode(
      p.messages.filter((message) => message.name === 'StorageRanges')[0],
      data
    )
    // storageRangesRLP response is to the lastAccount's slots so slots[0] are the slots of
    // lastAccount
    const lastAccountSlots = slots[0]
    const lastAccountStorageRoot = (lastAccount.body as any)[2]
    const trie = new Trie({ db: new LevelDB() })
    try {
      const keys = lastAccountSlots.map((acc: any) => acc.hash)
      const values = lastAccountSlots.map((acc: any) => acc.body)
      await trie.verifyRangeProof(
        lastAccountStorageRoot,
        keys[0],
        keys[keys.length - 1],
        keys,
        values,
        <any>proof
      )
    } catch (e) {
      t.fail(`StorageRange proof verification failed with message=${(e as Error).message}`)
    }
    t.ok(
      equalsBytes(keccak256(proof[0]), lastAccountStorageRoot),
      'Proof should link to the accounts storageRoot'
    )
    t.end()
  })

  t.test('GetByteCodes should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })
    const reqId = BigInt(1)
    const hashes = [
      keccak256(hexStringToBytes('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')),
      hexStringToBytes('0000000000000000000000000f00000000000000000000000000000000000010'),
    ]
    const bytes = BigInt(5000000)

    const payload = p.encode(p.messages.filter((message) => message.name === 'GetByteCodes')[0], {
      reqId,
      hashes,
      bytes,
    })

    t.ok(
      JSON.stringify(payload[0]) === JSON.stringify(bigIntToBytes(BigInt(1))),
      'correctly encoded reqId'
    )
    t.ok(JSON.stringify(payload[1]) === JSON.stringify(hashes), 'correctly encoded hashes')
    t.ok(
      JSON.stringify(payload[2]) === JSON.stringify(bigIntToBytes(bytes)),
      'correctly encoded bytes'
    )
    t.ok(payload)

    const res = p.decode(
      p.messages.filter((message) => message.name === 'GetByteCodes')[0],
      payload
    )

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.hashes) === JSON.stringify(hashes), 'correctly decoded hashes')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)
    t.end()
  })

  t.test('ByteCodes should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    const codesRes = RLP.decode(hexStringToBytes(byteCodesRLP))
    const { reqId, codes } = p.decode(
      p.messages.filter((message) => message.name === 'ByteCodes')[0],
      codesRes
    )

    t.ok(reqId === BigInt(1), 'reqId should be 1')
    t.ok(codes.length === 1, 'code should be present in response')

    const payload = RLP.encode(
      p.encode(p.messages.filter((message) => message.name === 'ByteCodes')[0], {
        reqId,
        codes,
      })
    )
    t.ok(byteCodesRLP === bytesToHex(payload), 'Re-encoded payload should match with original')
    t.end()
  })

  t.test('ByteCodes should verify a real sample', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    /* eslint-disable @typescript-eslint/no-use-before-define */
    const codesReq = RLP.decode(hexStringToBytes(getByteCodesRLP))
    const { hashes } = p.decode(
      p.messages.filter((message) => message.name === 'GetByteCodes')[0],
      codesReq
    )
    const codeHash = hashes[0]
    const codesRes = RLP.decode(hexStringToBytes(byteCodesRLP))
    const { codes } = p.decode(
      p.messages.filter((message) => message.name === 'ByteCodes')[0],
      codesRes
    )
    const code = codes[0]
    t.ok(equalsBytes(keccak256(code), codeHash), 'Code should match the requested codeHash')
    t.end()
  })

  t.test('GetTrieNodes should encode/decode correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    const reqId = BigInt(1)
    const root = hexToBytes('04157502e6177a76ca4dbf7784e5ec1a926049db6a91e13efb70a095a72a45d9')
    const paths = [[hexToBytes('0x00')], [hexToBytes('0x00')]]
    const bytes = BigInt(5000000)

    const payload = p.encode(p.messages.filter((message) => message.name === 'GetTrieNodes')[0], {
      reqId,
      root,
      paths,
      bytes,
    })

    t.ok(
      JSON.stringify(payload[0]) === JSON.stringify(bigIntToBytes(reqId)),
      'correctly encoded reqId'
    )
    t.ok(JSON.stringify(payload[1]) === JSON.stringify(root), 'correctly encoded root')
    t.ok(JSON.stringify(payload[2]) === JSON.stringify(paths), 'correctly encoded paths')
    t.ok(
      JSON.stringify(payload[3]) === JSON.stringify(bigIntToBytes(bytes)),
      'correctly encoded bytes'
    )
    t.ok(payload)

    const res = p.decode(
      p.messages.filter((message) => message.name === 'GetTrieNodes')[0],
      payload
    )

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.root) === JSON.stringify(root), 'correctly decoded root')
    t.ok(JSON.stringify(res.paths) === JSON.stringify(paths), 'correctly decoded paths')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)
    t.end()
  })

  t.test('TrieNodes should encode/decode correctly with real sample', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    const nodesRes = RLP.decode(hexToBytes(trieNodesRLP)) as unknown
    const { reqId, nodes } = p.decode(
      p.messages.filter((message) => message.name === 'TrieNodes')[0],
      nodesRes
    )

    t.ok(reqId === BigInt(1), 'reqId should be 1')
    t.ok(nodes.length > 0, 'nodes should be present in response')

    // check that raw node data that exists is valid
    for (let i = 0; i < nodes.length; i++) {
      const node: Uint8Array = nodes[i]
      if (node !== null) {
        t.ok(decodeNode(node), 'raw node data should decode without error')
      }
    }

    const payload = RLP.encode(
      p.encode(p.messages.filter((message) => message.name === 'TrieNodes')[0], {
        reqId,
        nodes,
      })
    )
    t.ok(trieNodesRLP === bytesToHex(payload), 'Re-encoded payload should match with original')
    t.end()
  })
})

const getAccountRangeRLP =
  'f86501a06f2b67d566fd7e82160a07d68d209ff56b87f5da362d5d60919a65550c89ac2ea00000000000000000000000000000000000000000000000000000000000000000a0f000000000000000000000000f0000000000000000000000000000000000001064'
const accountRangeRLP =
  'f9097101f87ce6a000009b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625c411808080e6a00001b989dc49b9df17e95a9e1e50870aabf88e21b9d4cd4811b5507dad53517cc401808080eda00001ea42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefcb01870360051c8960008080f908efb90214f90211a0c1278c80295a5fd765db6f3ddb5848683d8451ce795e45cb45e58c2bbea38b23a09058fbfd1194da5ea2c32fe6621c87c311a521f3ade5a6fcdfb2ce6c77cc9457a0ca279fd327589e0862fe3108b5ded8d1591af95c21e49de44a7c530da86d1d5ba0060137d87fe07e9e74d2ced2631f31ff0f2e1a77ec8e55a0e3c0d95049aa3a81a0c7153c1a920cf18b4ddf2069572c60429a82fac1d617c7186eb5f2f6c67bb3eea008cb3728001b9e04fcf14818826a5c379cccc3f45df0b76c2a86bb7588354462a09bec68f4684acd7c0b81b49b6705cb90a21390046e5233eb8a3eceb362d7e699a0954b9259abd98bb1bbf3caef798f9b2c67394670c926900ccf5751253ed4f87aa003beafd9e8e865d5610de7f137d404814cf6c4a12085dae8892266de62ef660ba06236e72b0960753708738bacb7cb4f4ff1c8b2e915e9a18599c75603dda597eea0b063b409a64860fc0d300eba3d772b30680881d938e6ebaabd80f82a753b4414a0846bff10a2dd3084bd983544aaeaf01770867aa572162869a6fe77609bb36dbfa0e467d24298c2eabe85e2c94b8c923a1a514c12a5c9b8e2181216d8317e010693a0bad67c670ec6fd973215ff412f58f3f54a9018866b04869002d3e6e4208f4c2ea086fe0af717dc7e5c127ec7396e1d0e16fad054109942cb0a8dc4348ebb82398da011bb9f0056d3a9e901b99c73d2d3e76215b47c333365d8b8a73e1acade5bda4b80b90214f90211a0b00ba2f0bfa01de02b767dcdf38c7f5691e5c340def6df806741a59d85bd2a13a05658dbc276709dbf6bf2b28872227646841f6f0d0fe1da001a0d08725b9a060ca09c950f1c934b5298bdebd8e65a26bf8f6edb269cd3fcaaf37915695aa30e870fa05f46b447501b5831596af8212cdb5f5d00fa3c70e9eaa13f5b3731d4a2a1bf5ba0d247a7b93cca2a31070f508fb093576145e0f9a83ccff8fa2d6bf2ff42abd78ca0be5a7c7a50fe9ff7e9c6c0e1a8a960721fa3ca81dad009b3f74da76ac905c1eda0713fbc2d738d788f9de1e3b9c21cb51a8ef8814c0b2c650e93edfd442125fdb5a04174b732f2b7b079ad9941c2a445d2c23c604c5d448b9200c9bc24332f0d018ba04bc37f9ba4124a538df315d7d07718f30fd9e715cbf0837a89a4ea0e8db2852ea0a948b1640a4cfe054be12c3d92f4c7a8c2b93e87f5cbf0df9f6ebe89160b6ccaa0bf660df9cd53c9ce329942f8a6ce5e276fe29fde33e4ed94a73ffd11d116ac20a02051566c8da26729f53eaa1c08b8fb80d955a8dce41b52ea1a80d19604225e79a0d7977ed0bc385e1554e9fdc7fc1fa5f11e1ab354edcbb2b2bbc86b3458e16bfca07e455873c9ab889267be0090716d6b81981ee744a498e5e7c7e7537b3660e09da0f4e9fee500e1d0c09356223097b8b4bdd562575cbd6c7520a791b5d1d06bcc8ca075ea32ed4754e8fa6ac42396ec52159c755319ef139a40c89135780f02d2cd3d80b90214f90211a005d5c908571626e6429a2e60c12fb0a7cbb792990237b07f0b895262dd468002a0e8832065be7f27bfc9622718b3217e764a64139809e83a4f346974d0bf6d4cb1a0884edcf8063cd210c4f055c9a65fa9ba9f3140ed7b5ffea534eb46543747312ca06939eb03dfec57d4b19633637f591f9c9eaf823bb4b881cfee6d4f2cc438de15a0b3465275b807743c9d2babcc187bccfd4d5875e3be850ba15bdb49ecb0756b33a019f64beddb99d42a6d0aa559bb742099b75a56119110e536aec1e0dc8426d4bda00b2a64b5cfd0465225a77e8d36f33a8cd2e2955dd27f17858c6bff058560073da06d29ec54698740d1b0a31fbc108f7a7f34b54fca2469a1e741a7e6d238ca3223a089b0a60705c5aabdc613843831737ab0d4924dfaa98e36d0da5c5c701b9a184fa0beb52c58a15cbc60614935c901236d604e45a6fb777c5c2a96bbdaa6c5643401a091e8e3621e73c2f97d2f8a1e6aa0502c2d39c760c8ec75d5bb74dcb8c6042b07a0919f563a2f826f3375e0171d7aaed13d5d430231bb3ab153a804dea6ff3fad48a076199370d103d86301ddcfbac8dca567b32156d50d3884cefc52c86229b9c4dfa0d37db1d1a795c0ffd9fd3dab57c98b0986529ab1f32d306cdfd5063a2371875da019c8b72759269ffff97d1b3284696b037eb984c4520d3be799b49716e77d888fa08a5777ee67d4d9592dcd388b0f0f14a02225468f9d3339dc1d9ef25fb85f30f280b90174f90171a093c39d2f8d596b9d295b60221892e54bf39c276b77f25be68195379766ac6f1aa0f67ae81c632b1fcabbf55700389ff5735666139a48fcb88b1ec49e76d89f0dcda03ff27dc7b513d1790150232542a066f377c345d94891b818098ee07539656f8f80a04d0bd2a7147dd2e8dbd0b3e1166ec5f8f38e2509c4d7647bcb4d5f88bd0c015ba08d5f743d005ba218dbda14eb3e599616dfd95de81a52271cc7068c8d7d02b954a0319a502e4ba85543f9e87b56742ffa93e6bad838f6621173c268b6a47d927c66a0042be4c968761c0bb12a1663afc013d9224cdaafd24faa13af29ec685c5a9681808080a04c058f78c59efa16cf457b01f273d9a593d9bdb7b80bdee9172e1aa94bfb56e6a0e7198822750da3bafcda0bd58bc813c190a3e220710c8bb6eef3036061234dc0a028fb2d97af7dea9285b566bbd754bd20b8cb24abb865d382ebc14e7c2994be7fa0ac77041d0371ae76a4ffb9440a3bc827660d4bd2fc535cfd95c213524e89fd908080b86af8689f209b82f07b6d086a2f1574482af15472d565ea145ff42edfa412a1bd632625b846f8441180a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470b853f8518080808080808080808080a00cd5b0af242798bc101250a06cbfbdf37aec6ddb42aa1428ea9e51440650c3d18080a0f6d819bdf6861f54f23de70f48431954d5f0e20a0372ecb1cbdbf526beafd6b88080b870f86e9e3a42267f6ff20ada8604d602387163b25e87102bf3d214d52ceec8dcecefb84df84b01870360051c896000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

//await peer!.snap!.getAccountRange({
//   root: stateRoot,
//   origin: hexToBytes(
//     '27be64f6a1510e4166b35201a920e543e0579df3b947b8743458736e51549f0c'
//   ),
//   limit: hexStringToBytes('f000000000000000000000000f00000000000000000000000000000000000010'),
//   bytes: BigInt(100),
// })
const contractAccountRangeRLP =
  'f909cb01f897eda027be64f6a1510e4166b35201a920e543e0579df3b947b8743458736e51549f0ccb0187059d006abec0008080f867a027be7c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215f8440180a03dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40ea0e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66f9092eb90214f90211a03e317f72529393d592a14a980728964491a795b0b17bce46dd6462cd73178528a031d9a927f50c38e26b733420d54e018ad136a2acfb0f62ff0a530622d0910501a0e16176464ca43ffccd8dcac69c254e4c232b3736cb50b22fcba2aca674d97657a0c468309ef106b3c7c011c79bbf30f6d84f50e9ee70efcbb6e2ee3ed3532d8d5aa04b7a7527c301a3e8ccaa0065144bcca966d4dc1bf5091fffb59fee96235ddab7a0cc9f49ba7f69154937a24ce1bdce4c525c57fad23a866d35cdc14a0ffb4fd569a05c6688038fa3c868118abc35cb33757b11892df27f5949be6533822d38d023cba0bcd60cfb5cd40113a3b91ef2ef582a5598e1d1c02f4ef19eb3a01f4a7385d9e2a0b01c57e7623a52c797bfad0b234864f0478defd52a604f52c6c13240cf263582a0467b446d76308ce3f6afabbb9e50487842359da4c5ea803c98d01ea1100ee3a9a041cc43991ff1d05d306179415fd0108c80af2ed0ecc1968d54c4804a3a3e7d26a0de817ee6846ebffe2f0ba07b9e43a5531deb13fec227914fa829cf9e0b6b1feba0d110eeeee544612b96d241eb1923301192bc1937105c4f8d42950074d1b20523a042c0d15d6d12fed334ac2905230c9596dbac86c43e2f7659649a0aaabb614a59a05e4fde55ac428253d2bf44dbacdd90617c6c7a7037ccff59bf1bd5e8e9fd8cb1a0b93d6175cacaa3ff73e2be3aa1bf980a3a0f08554b46cc9346687b5436a9af9080b90214f90211a03fb9d5e64403a8b57c0d8f19b52be351600547e0810d2bd363ce27fca733c351a0cd52ee7470e730d3f28b2ffa8b6521061b79d5d6c19743953dc2c444a6a7a9a8a05ffa4be37e29f4506242483f75d1b2e6b834e38e2f3008ee278ef6f3859d3fbea01ad32ca2d763d2c80b1d2726a9e9d76b19f7aaa343c0ecdae7d4c528216c38aaa0ad31f5349953c3284cf53b6f64d5f50520d77415d68ac8c2c74e11e20328e930a048ad1822f5b77ed9199a0ed08dd819f609420f4859c68795ee85c60a337e77e5a08b8a8b33dfe0ac28f5528a76f4ba05475f0c11a1c1a43eff431a19c4e106241fa0a65e791df46225d6f86b19c29ecd3fb1515e43425cf62520c04b78dc05042db0a02767fe0d42f7171f249a3bca1fe485feeccab4a4e54562cf9d86246d61d69d45a026165555bfc36933cbae97d2c9ca3566789dd65b26f5b1459b883e5817c4d842a0e9847655d69a1d2765b177c9effca84e30a4358527378e0e2579290cd2bfe1d7a0176d992c06eac5d9709b0c88ab9662ff33d8832a3a656844adcfcda20a7a5d1ea0517bb9f09a79ac65969b60ed8cf88ad4469a8c089392993ed5ae36588d167ce3a06c2d5a9a44fcbdb4a78cadf1ff198e13a05a1cbfdfe4322b651a54fba43c80c4a0f31f6a2b80f6e5994e4d7a6d7ade8e374717ecb382a6c2e2fa84da289a7311dda0da149b02c25ec3cbe790d968f3f0796b1d97b47406c4e048c0876f188c8843db80b90214f90211a05692dce2e2b9e931f11de516711dfc9fd7f072aafa94246842327bb5cc88d299a05a34d682e1f48b5c7a561899cadf6d9f5728a28b47a2299c50c583401c8adcf4a09ac2be05ecbf11e8f04293413c3f265ba0f7936fdca301e70e863a3fd97351f2a0be65aeda766d5b431ba66f6fc7426d1d14225f4c7c21abf531b1179bd723de37a0d434197f2a4d480134b96f54df371cf553bc9d419bf7b8fe97915c3bafe5cc38a06a6f87d8033eb91704f16d3bc5ac7d1dd92ccea236a66f7bee58ea6ddbd66662a03dcae49ff1dba7426fe91798df52719aa8aec85bb8ecd290a8c7f3f625c0e04ca0da18286af20d2bef143807e6153ebef7c4bbce1a8758759e5c868245302dc522a082e530d64d6839289db6a7ba5fc084203054555b4c22b36c95792cb73afdb5c1a0a7b0b714bf64e738ffdc0bc2450469a1ee53e0eb2ac6604de791b93280d9522fa0649ce83d40c4071a4a6f3241cdc97884cad2820106df5a558cd1460a51af737ca0d9e5428057bd3ea9c9ee66fe928d1c5fe2291f038798b627a6ba32132aa446c8a036df1ab5e4a79ecb2083143256cda9964baab9af378806c66d8116c5ac9d1c18a0ab83c42863e83767739e3557582ab1a9ec0546202522bf8142d2abe4339ef547a07063deef264a623d2fe6e94863a6daedd8f4431aa15db5c5f08d60db15be8889a00d4901e40f514f6bf7ed86f0ad4ff104c73dd34583398b06044ffb6c0ef0ceaf80b90194f90191a021100e99c4cf6f11817174a1d6494935c5db672a4147e2d7c7b1183d1cd194dd80a0a60cc6818e6cb02b94dd71ee2cf9945b296bd1a97f18132865a8c4ee5f8d808fa0c82f7a3e2bd946f042a958ae4e45463b2bdfb41d13791b0284e741b8d088e809a01b33f2aff8cfe1f85607cda408ab1be19824112301cb5bf7ad39c33ca6a3ae6ca0136ee30ad667bd05b9032352046171e5a4b1cc6f0dab92447cd1e993d176d11380a002989ef278f5e1ea994d747aa0e03eff3781884176a11244bfa0093e0cbabaa0a0e2ce43841c561596e3c20ca0d9e65926877bb0563f97d8ba840bff17bc71eedc80a0355479422e131a63a41dfff1359c763783128c2ca46113cc2fad097716d980cea0ca2306ad965fd1fc2c374794f27f9ae974e4518acfc5a45c4fd243faecdbb968a0b70fe21f9920ffb1e85f76f3d68ace66fda9fba2a18ee40c56be30d205e163b180a0a87f04fea647cc1fab13bbd4f95c99da77b56d1ba3e70b2bfbeffb00b85bec2aa01736c3eae15545b633b8344eda0d6f53d3de180b9b1abd4d5f0452ef8a8d197880b873f871808080808080a091ce7aa54a929b46c827f31c7a50e4d820d7e0c940cf2fdfe8f489ef3f5ada62a0d9b516fbc9b3dc7ceb6045550fc6eb75301f312f7ce74374d8f90f7248dbfeac8080a0f92923e2c55de59cbd770ee6bb9cd1f6ddf481e60e80c25839faf29c8850dbad808080808080b870f86e9e34f6a1510e4166b35201a920e543e0579df3b947b8743458736e51549f0cb84df84b0187059d006abec000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470b869f8679e3c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215b846f8440180a03dc6d3cfdc6210b8591ea852961d880821298c7891dea399e02d87550af9d40ea0e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66'

// Even though we don't require using getStorageRangesRLP in the test, but this is here in case one
// wants to inspect the request that led to the response
//  await peer!.snap!.getStorageRanges({
//   root: stateRoot,
//   accounts: [
//     hexStringToBytes('27be7c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215'),
//   ],
//   origin: hexStringToBytes(
//     '0000000000000000000000000f00000000000000000000000000000000000000'),
//   limit: hexStringToBytes('f000000000000000000000000f00000000000000000000000000000000000010'),
//   bytes: BigInt(100),
// })
const _getStorageRangesRLP =
  'f88701a0842c311cc3e0242fe3877f10a06ff26581a5102ddc1d3de1198dc081e2407fe9e1a027be7c29a7a7d6da542205ed52b91990e625039a545702874be74db9f40fb215a00000000000000000000000000f00000000000000000000000000000000000000a0f000000000000000000000000f0000000000000000000000000000000000001064'
const storageRangesRLP =
  'f9020201f885f883e2a0011495c4db39fdb3ff374636d517fe5802b9856190833a6cec035be5d4928a7c01f7a0290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5639594c72da985e2209a8ea7bca2f2a5e2308b7c4a3929e7a060264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79858462b66ae7f90177b8d3f8d1a0072ebf377f0339cbfdf33e9ec4a7ca991324dacfcb249467567d260835778f4480a06abdc8e224c631c3998a6c2a982d3dddb4d071739433b45e8a086b0a02a5c9dd808080a0c3d3e38f431316e13d65759577651bbf81d8e25b5dc6b583bbbc9c2f5f332be680a06512473128eb2f4b680fdcfd7e3d05ec0ad9bdccbfe10dbea0e8519945ce8df7808080a04e4ac86a66b6adb6cceffd43be3970fb09804b6c63eabbacc87b3b6f8cb1729080a0d68af628d6ba5ce332a2182b0da71ca12010a9a80c37bd95244446c36fe65fb38080a3e2a0311495c4db39fdb3ff374636d517fe5802b9856190833a6cec035be5d4928a7c01b853f851a07a674b9ad2b903117d470c39b3f7070a9ffef66e9b6d5ef1df82a656dbcad0c4808080a0530024120eca2e19bde6a5bf7ffcea39cb938fa79f77cccb61121ea27032688b808080808080808080808080a8e7a020264186ee63f748d340388f07b244d96d007fff5cbc397bbd69f8747c421f79858462b66ae7'

// await peer!.snap!.getByteCodes({
//   hashes: [
//     hexStringToBytes('e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c66'),
//   ],
//   bytes: BigInt(50000),
// })
const getByteCodesRLP =
  'e601e1a0e68fe0bb7c4a483affd0f19cc2b989105242bd6b256c6de3afd738f8acd80c6682c350'
const byteCodesRLP =
  'f9182c01f91828b918256080604052600436106100a75760003560e01c80635daf08ca116100645780635daf08ca146105135780638da5cb5b14610601578063c127c24714610658578063ee8ca76e14610740578063f2fde38b14610826578063f602ae2714610877576100a7565b8063013cf08b146102565780630b1ca49a14610335578063373058b814610386578063391068211461039d578063400e39491461040257806358dc93bc1461042d575b6000600180808054905003815481106100bc57fe5b906000526020600020906008020190508060060160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561012557600080fd5b60018160060160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080600301600081548092919060010191905055506000349050808260070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507fa398b89ba344a0b23a0b9de53db298b2a1a868b396c1878b7e9dcbafecd49b133334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15050005b34801561026257600080fd5b5061028f6004803603602081101561027957600080fd5b81019080803590602001909291905050506108b4565b60405180878152602001806020018615151515815260200185151515158152602001848152602001838152602001828103825287818151815260200191508051906020019080838360005b838110156102f55780820151818401526020810190506102da565b50505050905090810190601f1680156103225780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b34801561034157600080fd5b506103846004803603602081101561035857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109af565b005b34801561039257600080fd5b5061039b610c0b565b005b3480156103a957600080fd5b506103ec600480360360208110156103c057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d94565b6040518082815260200191505060405180910390f35b34801561040e57600080fd5b50610417610dac565b6040518082815260200191505060405180910390f35b34801561043957600080fd5b506104fd6004803603604081101561045057600080fd5b81019080803590602001909291908035906020019064010000000081111561047757600080fd5b82018360208201111561048957600080fd5b803590602001918460018302840111640100000000831117156104ab57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610db2565b6040518082815260200191505060405180910390f35b34801561051f57600080fd5b5061054c6004803603602081101561053657600080fd5b8101908080359060200190929190505050610e12565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156105c45780820151818401526020810190506105a9565b50505050905090810190601f1680156105f15780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561060d57600080fd5b50610616610f01565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561066457600080fd5b5061073e6004803603604081101561067b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156106b857600080fd5b8201836020820111156106ca57600080fd5b803590602001918460018302840111640100000000831117156106ec57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610f26565b005b34801561074c57600080fd5b506108106004803603604081101561076357600080fd5b81019080803590602001909291908035906020019064010000000081111561078a57600080fd5b82018360208201111561079c57600080fd5b803590602001918460018302840111640100000000831117156107be57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061115e565b6040518082815260200191505060405180910390f35b34801561083257600080fd5b506108756004803603602081101561084957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506112ff565b005b34801561088357600080fd5b506108b26004803603602081101561089a57600080fd5b8101908080351515906020019092919050505061139b565b005b600181815481106108c157fe5b9060005260206000209060080201600091509050806000015490806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109735780601f1061094857610100808354040283529160200191610973565b820191906000526020600020905b81548152906001019060200180831161095657829003601f168201915b5050505050908060020160009054906101000a900460ff16908060020160019054906101000a900460ff16908060030154908060040154905086565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a0857600080fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610a5557600080fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b600160048054905003811015610b8c5760046001820181548110610aba57fe5b906000526020600020906003020160048281548110610ad557fe5b90600052602060002090600302016000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018201816001019080546001816001161561010002031660029004610b7192919061142d565b50600282015481600201559050508080600101915050610a9a565b50600460016004805490500381548110610ba257fe5b9060005260206000209060030201600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600182016000610be891906114b4565b600282016000905550506004805480919060019003610c0791906114fc565b5050565b600060018080805490500381548110610c2057fe5b90600052602060002090600802019050600115158160020160019054906101000a900460ff161515148015610c6457508060020160009054906101000a900460ff16155b610c6d57600080fd5b60008160070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008260070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000811115610d90573373ffffffffffffffffffffffffffffffffffffffff166108fc836000015483029081150290604051600060405180830381858888f1935050505015610d4857610d8f565b808260070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5050565b60036020528060005260406000206000915090505481565b60025481565b600080600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610e0057600080fd5b610e0a838361115e565b905092915050565b60048181548110610e1f57fe5b90600052602060002090600302016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ef15780601f10610ec657610100808354040283529160200191610ef1565b820191906000526020600020905b815481529060010190602001808311610ed457829003601f168201915b5050505050908060020154905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f7f57600080fd5b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081141561102c57600480549050600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506004805480919060010161102991906114fc565b90505b60405180606001604052808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001428152506004828154811061106a57fe5b906000526020600020906003020160008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010190805190602001906110db92919061152e565b50604082015181600201559050507f27b022af4a8347100c7a041ce5ccf8e14d644ff05de696315196faae8cd50c9b836001604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a1505050565b600080600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156111ac57600080fd5b600180548091906001016111c091906115ae565b90506000600182815481106111d157fe5b90600052602060002090600802019050838160000181905550828160010190805190602001906112029291906115e0565b5060008160020160006101000a81548160ff02191690831515021790555060008160020160016101000a81548160ff021916908315150217905550600081600301819055507ff970aa486598017b8116c2beb18c50d4584ecbc3c688817f59b26796725f31bf82846040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156112b0578082015181840152602081019050611295565b50505050905090810190601f1680156112dd5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a1600182016002819055508191505092915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461135857600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156113e857600080fd5b6000600180808054905003815481106113fd57fe5b90600052602060002090600802019050818160020160016101000a81548160ff0219169083151502179055505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061146657805485556114a3565b828001600101855582156114a357600052602060002091601f016020900482015b828111156114a2578254825591600101919060010190611487565b5b5090506114b09190611660565b5090565b50805460018160011615610100020316600290046000825580601f106114da57506114f9565b601f0160209004906000526020600020908101906114f89190611660565b5b50565b815481835581811115611529576003028160030283600052602060002091820191016115289190611685565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061156f57805160ff191683800117855561159d565b8280016001018555821561159d579182015b8281111561159c578251825591602001919060010190611581565b5b5090506115aa9190611660565b5090565b8154818355818111156115db576008028160080283600052602060002091820191016115da91906116e3565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061162157805160ff191683800117855561164f565b8280016001018555821561164f579182015b8281111561164e578251825591602001919060010190611633565b5b50905061165c9190611660565b5090565b61168291905b8082111561167e576000816000905550600101611666565b5090565b90565b6116e091905b808211156116dc57600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006116cb91906114b4565b60028201600090555060030161168b565b5090565b90565b61175f91905b8082111561175b5760008082016000905560018201600061170a91906114b4565b6002820160006101000a81549060ff02191690556002820160016101000a81549060ff0219169055600382016000905560048201600090556005820160006117529190611762565b506008016116e9565b5090565b90565b50805460008255600202906000526020600020908101906117839190611786565b50565b6117ed91905b808211156117e957600080820160006101000a81549060ff02191690556000820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006117e091906114b4565b5060020161178c565b5090565b9056fea265627a7a72315820dab2c528e4480dabb4e56f71d881f0f7d5e0025f206c1bd42f28582b67c1c99a64736f6c63430005110032'

// captured from a client that was fully synced up to block number 2023946 on the Sepolia network
// const getTrieNodesResult = await peer!.snap!.getTrieNodes({
//   root: Buffer.from("04157502e6177a76ca4dbf7784e5ec1a926049db6a91e13efb70a095a72a45d9", "hex"),
//   paths: [
//     [Buffer.from("", "hex")],
//     [Buffer.from("", "hex")],
//   ],
//   bytes: BigInt(5000000),
// })
const _getTrieNodesRLP =
  'eb01a0aa3cd09df0b7c0efbd473200c6db3117b51b68af7a5523334db0208d05e1729ec4c180c180834c4b40'
const trieNodesRLP =
  'f9043201f9042eb90214f90211a0a9ac33b1678bc29752428899dfdf20b68e681beabb147911ab3351bf5ad54d16a08771055e79da516f30ef2093acf2563a207353c9d189e4f03e0eff738bf555aca007d50972296a3141479449190f74f9594ffd26b279152c0d7a6a63507e6b9089a03f660f0caadd7931c779f36d48fdd23a97f3fb7cc2bf4d429dc2831c16ce5a32a05b97aaa9eb2aae115307d72688bb30a6ebac972ec6ba2d0bcb791ebf39d71916a010e1e7f29a5c06fc555582a970c71ef88c232efaf2ca51a2d49324616c2191a4a0c9505973461d0fe37936edfa00848f149b493c1ebdf3f17708fc6e08d2190324a00a95b5e4f0c4c50ce8be1bd0adca7db282837232cbc1fe3d75afee0fd31f32d3a0e704bcf809216973e3da205dfc2e8e0b0143dc2ca6746e0e7b65a6f88ef74e8ea0f4ed296b1dd56c26bab94eb29a8bdfba97df2df998f68425022435e4d1fb4ec0a02cc04a4870d97146d7c03f87ef1c6bc339027ea2cb63f15518f947b8662e5527a03e011d662ed4d68bf73a790d07e7fe4298a3f92488ccb5486888d972490f4c13a0eba9aa90bef59f1928fd7f864ec1b04155f0c979cf3fa43b4c46c0a973c95f56a0ff8a97113f81de7b80c90593dcac9637d7eb233f8b7fa7d2cabc05c4ae73af8da03c056af73e3d12557d1a93dd777326dc91e4e9bb30e0376cdf931169ba0659aaa0c6e6bc9f45fe9996716c3bdde66f89008ab614bb64e7f7f2e17795530c7d5a1d80b90214f90211a0a9ac33b1678bc29752428899dfdf20b68e681beabb147911ab3351bf5ad54d16a08771055e79da516f30ef2093acf2563a207353c9d189e4f03e0eff738bf555aca007d50972296a3141479449190f74f9594ffd26b279152c0d7a6a63507e6b9089a03f660f0caadd7931c779f36d48fdd23a97f3fb7cc2bf4d429dc2831c16ce5a32a05b97aaa9eb2aae115307d72688bb30a6ebac972ec6ba2d0bcb791ebf39d71916a010e1e7f29a5c06fc555582a970c71ef88c232efaf2ca51a2d49324616c2191a4a0c9505973461d0fe37936edfa00848f149b493c1ebdf3f17708fc6e08d2190324a00a95b5e4f0c4c50ce8be1bd0adca7db282837232cbc1fe3d75afee0fd31f32d3a0e704bcf809216973e3da205dfc2e8e0b0143dc2ca6746e0e7b65a6f88ef74e8ea0f4ed296b1dd56c26bab94eb29a8bdfba97df2df998f68425022435e4d1fb4ec0a02cc04a4870d97146d7c03f87ef1c6bc339027ea2cb63f15518f947b8662e5527a03e011d662ed4d68bf73a790d07e7fe4298a3f92488ccb5486888d972490f4c13a0eba9aa90bef59f1928fd7f864ec1b04155f0c979cf3fa43b4c46c0a973c95f56a0ff8a97113f81de7b80c90593dcac9637d7eb233f8b7fa7d2cabc05c4ae73af8da03c056af73e3d12557d1a93dd777326dc91e4e9bb30e0376cdf931169ba0659aaa0c6e6bc9f45fe9996716c3bdde66f89008ab614bb64e7f7f2e17795530c7d5a1d80'
