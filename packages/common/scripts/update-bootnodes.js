const fs = require('fs')

// https://github.com/ethereum/go-ethereum/blob/master/params/bootnodes.go
const bootnodes = {
  // MainnetBootnodes are the enode URLs of the P2P bootstrap nodes running on
  // the main Ethereum network.
  MainnetBootnodes: {
    'bootnode-aws-ap-southeast-1-001':
      'enode://d860a01f9722d78051619d1e2351aba3f43f943f6f00718d1b9baa4101932a1f5011f16bb2b1bb35db20d6fe28fa0bf09636d26a87d31de9ec6203eeedb1f666@18.138.108.67:30303',
    'bootnode-aws-us-east-1-001':
      'enode://22a8232c3abc76a16ae9d6c3b164f98775fe226f0917b0ca871128a74a8e9630b458460865bab457221f1d448dd9791d24c4e5d88786180ac185df813a68d4de@3.209.45.79:30303',
    'bootnode-hetzner-hel':
      'enode://2b252ab6a1d0f971d9722cb839a42cb81db019ba44c08754628ab4a823487071b5695317c8ccd085219c3a03af063495b2f1da8d18218da2d6a82981b45e6ffc@65.108.70.101:30303',
    'bootnode-hetzner-fsn':
      'enode://4aeb4ab6c14b23e2c4cfdce879c04b0748a20d8e9b59e25ded2a08143e265c6c25936e74cbc8e641e3312ca288673d91f2f93f8e277de3cfa444ecdaaf982052@157.90.35.166:30303',
  },

  // GoerliBootnodes are the enode URLs of the P2P bootstrap nodes running on the
  // Görli test network.
  GoerliBootnodes: {
    // Upstream bootnodes
    'Upstream bootnode 1':
      'enode://011f758e6552d105183b1761c5e2dea0111bc20fd5f6422bc7f91e0fabbec9a6595caf6239b37feb773dddd3f87240d99d859431891e4a642cf2a0a9e6cbb98a@51.141.78.53:30303',
    'Upstream bootnode 2':
      'enode://176b9417f511d05b6b2cf3e34b756cf0a7096b3094572a8f6ef4cdcb9d1f9d00683bf0f83347eebdf3b81c3521c2332086d9592802230bf528eaf606a1d9677b@13.93.54.137:30303',
    'Upstream bootnode 3':
      'enode://46add44b9f13965f7b9875ac6b85f016f341012d84f975377573800a863526f4da19ae2c620ec73d11591fa9510e992ecc03ad0751f53cc02f7c7ed6d55c7291@94.237.54.114:30313',
    'Upstream bootnode 4':
      'enode://c1f8b7c2ac4453271fa07d8e9ecf9a2e8285aa0bd0c07df0131f47153306b0736fd3db8924e7a9bf0bed6b1d8d4f87362a71b033dc7c64547728d953e43e59b2@52.64.155.147:30303',
    'Upstream bootnode 5':
      'enode://f4a9c6ee28586009fb5a96c8af13a58ed6d8315a9eee4772212c1d4d9cebe5a8b8a78ea4434f318726317d04a3f531a1ef0420cf9752605a562cfe858c46e263@213.186.16.82:30303',

    // Ethereum Foundation bootnode
    'Ethereum Foundation bootnode':
      'enode://a61215641fb8714a373c80edbfa0ea8878243193f57c96eeb44d0bc019ef295abd4e044fd619bfc4c59731a73fb79afe84e9ab6da0c743ceb479cbb6d263fa91@3.11.147.67:30303',
  },

  // https://github.com/openethereum/openethereum/blob/master/ethcore/res/ethereum/kovan.json#L6783
  KovanBootnodes: {
    1: 'enode://16898006ba2cd4fa8bf9a3dfe32684c178fa861df144bfc21fe800dc4838a03e342056951fa9fd533dcb0be1219e306106442ff2cf1f7e9f8faa5f2fc1a3aa45@116.203.116.241:30303',
    2: 'enode://2909846f78c37510cc0e306f185323b83bb2209e5ff4fdd279d93c60e3f365e3c6e62ad1d2133ff11f9fd6d23ad9c3dad73bb974d53a22f7d1ac5b7dea79d0b0@3.217.96.11:30303',
    3: 'enode://740e1c8ea64e71762c71a463a04e2046070a0c9394fcab5891d41301dc473c0cff00ebab5a9bc87fbcb610ab98ac18225ff897bc8b7b38def5975d5ceb0a7d7c@108.61.170.124:30303',
    4: 'enode://2909846f78c37510cc0e306f185323b83bb2209e5ff4fdd279d93c60e3f365e3c6e62ad1d2133ff11f9fd6d23ad9c3dad73bb974d53a22f7d1ac5b7dea79d0b0@157.230.31.163:30303',
  },
}

/*
parse string and generate:
{
  "ip": "52.74.57.123",
  "port": 30303,
  "id": "1118980bf48b0a3640bdba04e0fe78b1add18e1cd99bf22d53daac1fd9972ad650df52176e7c7d89d1114cfef2bc23a2959aa54998a46afcf7d91809f0855082",
  "location": "SG",
  "comment": "Go Bootnode"
}
*/
const generateJson = (bootnodes) => {
  const nodes = []
  for (const b in bootnodes) {
    let enode = bootnodes[b]
    enode = enode.replace('enode://', '')
    const [id, rest] = enode.split('@')
    const [ip, port] = rest.split(':')
    const node = {
      ip,
      port: parseInt(port),
      id,
      location:
        b.includes('-aws-') || b.includes('-azure-')
          ? b.replace('bootnode-aws-', '').replace('bootnode-azure-', '')
          : '',
      comment: b,
    }
    console.log('node', node)
    nodes.push(node)
  }
  return nodes
}

const nameToJsonFile = {
  MainnetBootnodes: 'mainnet',
  GoerliBootnodes: 'goerli',
  KovanBootnodes: 'kovan',
}

for (let configName in bootnodes) {
  console.log('process ', configName)
  const fileName = nameToJsonFile[configName]
  const filePath = `./src/chains/${fileName}.json`
  const _newConfig = JSON.parse(fs.readFileSync(filePath))
  _newConfig.bootstrapNodes = generateJson(bootnodes[configName])
  fs.writeFileSync(filePath, `${JSON.stringify(_newConfig, null, 2)}\n`)
}
