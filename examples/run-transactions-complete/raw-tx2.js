var bidSig = '0x454a2ab3'
var time = '0000000000000000000000000000000000000000000000000000000000000045'

var rawTx2 = {
  nonce: '0x01',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x20710',
  value: '0x10',
  to: '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a',
  data: bidSig + time
}

module.exports = rawTx2
