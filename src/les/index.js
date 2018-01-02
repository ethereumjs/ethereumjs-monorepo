const { EventEmitter } = require('events')

// const createDebugLogger = require('debug')
// const debug = createDebugLogger('devp2p:les')

const MESSAGE_CODES = {
  // LES/1
  STATUS: 0x00,
  ANNOUNCE: 0x01,
  GET_BLOCK_HEADERS: 0x02,
  BLOCK_HEADERS: 0x03,
  GET_BLOCK_BODIES: 0x04,
  BLOCK_BODIES: 0x05,
  GET_RECEIPTS: 0x06,
  RECEIPTS: 0x07,
  GET_PROOFS: 0x08,
  PROOFS: 0x09,
  GET_CONTRACT_CODES: 0x0a,
  CONTRACT_CODES: 0x0b,
  GET_HEADER_PROOFS: 0x0d,
  HEADER_PROOFS: 0x0e,
  SEND_TX: 0x0c,

  // LES/2
  GET_PROOFS_V2: 0x0f,
  PROOFS_V2: 0x10,
  GET_HELPER_TRIE_PROOFS: 0x11,
  HELPER_TRIE_PROOFS: 0x12,
  SEND_TX_V2: 0x13,
  GET_TX_STATUS: 0x14,
  TX_STATUS: 0x15
}

class LES extends EventEmitter {

}

module.exports = LES
