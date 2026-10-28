import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_0,
  EthereumJSErrorWithoutCode,
  bigIntToBytes,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  bytesToInt,
  bytesToUnprefixedHex,
  hexToBytes,
  intToBytes,
  isHexString,
} from '@ethereumjs/util'
import * as snappy from 'snappyjs'

import { DISCONNECT_REASON, ProtocolType } from '../types.ts'
import { assertEq, formatLogData, formatLogId } from '../util.ts'

import {
  ethUsesBlockRangeStatus,
  isDeprecatedPostMergeMessage,
  isMessageCodeAllowed,
} from './eth/codec.ts'
import { EthMessageCodeNames, EthMessageCodes as EthMsgCodes } from './eth/codes.ts'
import { forkValidationHead } from './eth/forkHead.ts'

import type { EthMessageCodes as EthMessageCodeType } from './eth/codes.ts'
import { Protocol } from './protocol.ts'

import type { Input } from '@ethereumjs/rlp'
import type { Peer } from '../rlpx/peer.ts'
import type { SendMethod } from '../types.ts'

export { EthMessageCodeNames, EthMessageCodes } from './eth/codes.ts'
export {
  buildGetBlockHeadersFromJSON,
  encodeGetBlockHeaders,
  ethUsesRequestId,
  getBlockHeadersQueryFromJSON,
  isMessageCodeAllowed,
  requestIdFromPayload,
} from './eth/codec.ts'

export interface EthStatusMsg extends Array<Uint8Array | Uint8Array[]> {}

/** eth/64–68 STATUS fields (td + best hash). */
export type EthStatusOpts = {
  td?: Uint8Array
  bestHash?: Uint8Array
  latestBlock?: Uint8Array
  genesisHash: Uint8Array
  /** eth/69+ block range (EIP-7642). */
  earliestBlock?: Uint8Array
  latestBlockHash?: Uint8Array
}

/** Ethereum wire protocol (ETH) sub-protocol for block and transaction exchange over RLPx. */
export class ETH extends Protocol {
  protected _status: EthStatusMsg | null = null
  protected _peerStatus: EthStatusMsg | null = null
  protected _peerStatusValidated = false
  private DEBUG: boolean = false

  // Eth64
  protected _hardfork: string = 'chainstart'
  protected _latestBlock = BIGINT_0
  protected _forkHash: string = ''
  protected _nextForkBlock = BIGINT_0

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, ProtocolType.ETH, version, EthMsgCodes)

    // Set forkHash and nextForkBlock
    if (this._version >= 64) {
      const c = this._peer.common
      this._hardfork = c.hardfork() ?? this._hardfork
      // Set latestBlock minimally to start block of fork to have some more
      // accurate basis if no latestBlock is provided along status send
      this._latestBlock = c.hardforkBlock(this._hardfork) ?? BIGINT_0
      this._forkHash = c.forkHash(this._hardfork)
      // Next fork block number or 0 if none available
      this._nextForkBlock = c.nextHardforkBlockOrTimestamp(this._hardfork) ?? BIGINT_0
    }

    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    this.DEBUG = globalThis.process?.env?.DEBUG?.includes('ethjs') ?? false
  }

  static eth62 = { name: 'eth', version: 62, length: 8, constructor: ETH }
  static eth63 = { name: 'eth', version: 63, length: 17, constructor: ETH }
  static eth64 = { name: 'eth', version: 64, length: 17, constructor: ETH }
  static eth65 = { name: 'eth', version: 65, length: 17, constructor: ETH }
  static eth66 = { name: 'eth', version: 66, length: 17, constructor: ETH }
  static eth67 = { name: 'eth', version: 67, length: 17, constructor: ETH }
  static eth68 = { name: 'eth', version: 68, length: 17, constructor: ETH }
  static eth69 = { name: 'eth', version: 69, length: 18, constructor: ETH }
  static eth70 = { name: 'eth', version: 70, length: 18, constructor: ETH }
  static eth71 = { name: 'eth', version: 71, length: 20, constructor: ETH }
  static eth72 = { name: 'eth', version: 72, length: 22, constructor: ETH }

  _handleMessage(code: EthMessageCodeType, data: Uint8Array) {
    const payload = RLP.decode(data)

    if (code !== EthMsgCodes.STATUS && this.DEBUG) {
      const debugMsg = this.DEBUG
        ? `Received ${this.getMsgPrefix(code)} message from ${
            this._peer['_socket'].remoteAddress
          }:${this._peer['_socket'].remotePort}`
        : undefined
      const logData = formatLogData(bytesToHex(data), this._verbose)
      this.debug(this.getMsgPrefix(code), `${debugMsg}: ${logData}`)
    }
    switch (code) {
      case EthMsgCodes.STATUS: {
        assertEq(
          this._peerStatus,
          null,
          'Uncontrolled status message',
          this.debug.bind(this),
          'STATUS',
        )
        this._peerStatus = payload as EthStatusMsg
        const peerStatusMsg = `${
          this._peerStatus !== undefined ? this._getStatusString(this._peerStatus) : ''
        }`
        if (this.DEBUG) {
          const debugMsg = this.DEBUG
            ? `Received ${this.getMsgPrefix(code)} message from ${
                this._peer['_socket'].remoteAddress
              }:${this._peer['_socket'].remotePort}`
            : undefined
          this.debug(this.getMsgPrefix(code), `${debugMsg}: ${peerStatusMsg}`)
        }
        this._handleStatus()
        this.events.emit('message', code, payload)
        break
      }

      case EthMsgCodes.BLOCK_RANGE_UPDATE: {
        if (!isMessageCodeAllowed(code, this._version)) return
        this._handleBlockRangeUpdate(payload as EthStatusMsg)
        break
      }

      default:
        if (!isMessageCodeAllowed(code, this._version)) return
        if (isDeprecatedPostMergeMessage(code, this._version)) return
        this.events.emit('message', code, payload)
        return
    }
  }

  _handleBlockRangeUpdate(payload: EthStatusMsg): void {
    if (payload.length < 3) return
    const earliest = bytesToBigInt(payload[0] as Uint8Array)
    const latest = bytesToBigInt(payload[1] as Uint8Array)
    if (earliest > latest) {
      this._peer.disconnect(DISCONNECT_REASON.USELESS_PEER)
      return
    }
    this.events.emit('blockRangeUpdate', {
      earliestBlock: payload[0] as Uint8Array,
      latestBlock: payload[1] as Uint8Array,
      latestBlockHash: payload[2] as Uint8Array,
    })
  }

  /**
   * Eth 64 Fork ID validation (EIP-2124)
   * @param forkId Remote fork ID
   */
  _validateForkId(forkId: Uint8Array[]) {
    const c = this._peer.common

    const peerForkHash = bytesToHex(forkId[0])
    const peerNextFork = bytesToBigInt(forkId[1])

    if (this._forkHash === peerForkHash) {
      // There is a known next fork
      if (peerNextFork > BIGINT_0) {
        const validationHead = forkValidationHead(c, this._latestBlock)
        if (validationHead >= peerNextFork) {
          const msg = 'Remote is advertising a future fork that passed locally'
          if (this.DEBUG) {
            this.debug('STATUS', msg)
          }
          throw EthereumJSErrorWithoutCode(msg)
        }
      }
    }

    const peerFork = c.hardforkForForkHash(peerForkHash)
    if (peerFork === null) {
      const msg = 'Unknown fork hash'
      if (this.DEBUG) {
        this.debug('STATUS', msg)
      }
      throw EthereumJSErrorWithoutCode(msg)
    }

    if (!c.hardforkGteHardfork(peerFork.name, this._hardfork)) {
      const nextHardforkBlock = c.nextHardforkBlockOrTimestamp(peerFork.name)
      if (
        peerNextFork === null ||
        nextHardforkBlock === null ||
        nextHardforkBlock !== peerNextFork
      ) {
        const msg = 'Outdated fork status, remote needs software update'
        if (this.DEBUG) {
          this.debug('STATUS', msg)
        }
        throw EthereumJSErrorWithoutCode(msg)
      }
    }
  }

  _handleStatus(): void {
    if (this._status === null || this._peerStatus === null) return
    clearTimeout(this._statusTimeoutId!)

    assertEq(
      this._status[0],
      this._peerStatus[0],
      'Protocol version mismatch',
      this.debug.bind(this),
      'STATUS',
    )
    assertEq(
      this._status[1],
      this._peerStatus[1],
      'NetworkId mismatch',
      this.debug.bind(this),
      'STATUS',
    )

    if (ethUsesBlockRangeStatus(this._version)) {
      assertEq(
        this._status[2],
        this._peerStatus[2],
        'Genesis block mismatch',
        this.debug.bind(this),
        'STATUS',
      )
      assertEq(
        this._peerStatus[3].length,
        2,
        'Incorrect forkId msg format',
        this.debug.bind(this),
        'STATUS',
      )
      this._validateForkId(this._peerStatus[3] as Uint8Array[])
      this.events.emit('status', {
        chainId: this._peerStatus[1],
        td: new Uint8Array(),
        bestHash: this._peerStatus[6] as Uint8Array,
        genesisHash: this._peerStatus[2] as Uint8Array,
        forkId: this._peerStatus[3],
        earliestBlock: this._peerStatus[4] as Uint8Array,
        latestBlock: this._peerStatus[5] as Uint8Array,
        latestBlockHash: this._peerStatus[6] as Uint8Array,
      })
    } else {
      assertEq(
        this._status[4],
        this._peerStatus[4],
        'Genesis block mismatch',
        this.debug.bind(this),
        'STATUS',
      )
      const status: {
        chainId: Uint8Array | Uint8Array[]
        td: Uint8Array
        bestHash: Uint8Array
        genesisHash: Uint8Array
        forkId?: Uint8Array | Uint8Array[]
      } = {
        chainId: this._peerStatus[1],
        td: this._peerStatus[2] as Uint8Array,
        bestHash: this._peerStatus[3] as Uint8Array,
        genesisHash: this._peerStatus[4] as Uint8Array,
        forkId: undefined,
      }

      if (this._version >= 64) {
        assertEq(
          this._peerStatus[5].length,
          2,
          'Incorrect forkId msg format',
          this.debug.bind(this),
          'STATUS',
        )
        this._validateForkId(this._peerStatus[5] as Uint8Array[])
        status.forkId = this._peerStatus[5]
      }

      this.events.emit('status', status)
    }

    this._peerStatusValidated = true

    if (this._firstPeer === '') {
      this._addFirstPeerDebugger()
    }
  }

  /**
   * Remote chain head from the last successful STATUS handshake, if any.
   *
   * eth/69+ uses `latestBlockHash` and `latestBlock`; earlier versions expose `bestHash` only.
   */
  peerStatusHead(): { bestHash: Uint8Array; latestBlock?: bigint } | null {
    if (!this._peerStatusValidated || this._peerStatus === null) {
      return null
    }
    if (ethUsesBlockRangeStatus(this._version)) {
      const bestHash = this._peerStatus[6] as Uint8Array
      const latestBlockBytes = this._peerStatus[5] as Uint8Array
      const latestBlock = latestBlockBytes.length > 0 ? bytesToBigInt(latestBlockBytes) : undefined
      return { bestHash, latestBlock }
    }
    return { bestHash: this._peerStatus[3] as Uint8Array }
  }

  getVersion() {
    return this._version
  }

  _forkHashFromForkId(forkId: Uint8Array): string {
    // Using deprecated bytesToUnprefixedHex for performance: used for string conversion in protocol handling.
    return bytesToUnprefixedHex(forkId)
  }

  _nextForkFromForkId(forkId: Uint8Array): number {
    return bytesToInt(forkId)
  }

  _getStatusString(status: EthStatusMsg) {
    const v = bytesToInt(status[0] as Uint8Array)
    const nid = bytesToInt(status[1] as Uint8Array)
    if (ethUsesBlockRangeStatus(v)) {
      let sStr = `[V:${v}, NID:${nid}, GenH:${formatLogId(
        bytesToHex(status[2] as Uint8Array),
        this._verbose,
      )}`
      if (status[3] !== undefined) {
        sStr += `, ForkHash: ${bytesToHex(status[3][0] as Uint8Array)}`
      }
      sStr += `, Earliest:${bytesToBigInt(status[4] as Uint8Array).toString()}`
      sStr += `, Latest:${bytesToBigInt(status[5] as Uint8Array).toString()}`
      sStr += `, LatestH:${formatLogId(bytesToHex(status[6] as Uint8Array), this._verbose)}]`
      return sStr
    }
    let sStr = `[V:${v}, NID:${nid}, TD:${status[2].length === 0 ? 0 : bytesToBigInt(status[2] as Uint8Array).toString()}`
    sStr += `, BestH:${formatLogId(
      bytesToHex(status[3] as Uint8Array),
      this._verbose,
    )}, GenH:${formatLogId(bytesToHex(status[4] as Uint8Array), this._verbose)}`
    if (v >= 64) {
      sStr += `, ForkHash: ${
        status[5] !== undefined ? bytesToHex(status[5][0] as Uint8Array) : '-'
      }`
      sStr += `, ForkNext: ${
        (status[5][1] as Uint8Array).length > 0 ? bytesToHex(status[5][1] as Uint8Array) : '-'
      }`
    }
    sStr += `]`
    return sStr
  }

  sendStatus(status: EthStatusOpts) {
    if (this._status !== null) return
    const forkHashB = hexToBytes(
      isHexString(this._forkHash) ? this._forkHash : `0x${this._forkHash}`,
    )
    const nextForkB =
      this._nextForkBlock === BIGINT_0 ? new Uint8Array() : bigIntToBytes(this._nextForkBlock)

    if (ethUsesBlockRangeStatus(this._version)) {
      if (status.earliestBlock === undefined || status.latestBlockHash === undefined) {
        throw EthereumJSErrorWithoutCode(
          'eth/69+ STATUS requires earliestBlock and latestBlockHash',
        )
      }
      const latestNum =
        status.latestBlock !== undefined ? bytesToBigInt(status.latestBlock) : this._latestBlock
      if (status.latestBlock !== undefined) {
        if (latestNum < this._latestBlock) {
          throw EthereumJSErrorWithoutCode(
            'latest block provided is not matching the HF setting of the Common instance (Rlpx)',
          )
        }
        this._latestBlock = latestNum
      }
      this._status = [
        intToBytes(this._version),
        bigIntToBytes(this._peer.common.chainId()),
        status.genesisHash,
        [forkHashB, nextForkB],
        status.earliestBlock,
        bigIntToUnpaddedBytes(latestNum),
        status.latestBlockHash,
      ]
    } else {
      if (status.td === undefined || status.bestHash === undefined) {
        throw EthereumJSErrorWithoutCode('eth/64–68 STATUS requires td and bestHash')
      }
      this._status = [
        intToBytes(this._version),
        bigIntToBytes(this._peer.common.chainId()),
        status.td,
        status.bestHash,
        status.genesisHash,
      ]
      if (this._version >= 64) {
        if (status.latestBlock) {
          const latestBlock = bytesToBigInt(status.latestBlock)
          if (latestBlock < this._latestBlock) {
            throw EthereumJSErrorWithoutCode(
              'latest block provided is not matching the HF setting of the Common instance (Rlpx)',
            )
          }
          this._latestBlock = latestBlock
        }
        this._status.push([forkHashB, nextForkB])
      }
    }

    if (this.DEBUG) {
      this.debug(
        'STATUS',

        `Send STATUS message to ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        } (eth${this._version}): ${this._getStatusString(this._status)}`,
      )
    }

    let payload = RLP.encode(this._status)

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      payload = snappy.compress(payload)
    }

    this._send(EthMsgCodes.STATUS, payload)
    this._handleStatus()
  }

  sendMessage(code: EthMessageCodeType, payload: Input) {
    if (this.DEBUG) {
      const logData = formatLogData(bytesToHex(RLP.encode(payload)), this._verbose)
      const messageName = this.getMsgPrefix(code)
      const debugMsg = `Send ${messageName} message to ${this._peer['_socket'].remoteAddress}:${this._peer['_socket'].remotePort}: ${logData}`

      this.debug(messageName, debugMsg)
    }

    if (code === EthMsgCodes.STATUS) {
      throw EthereumJSErrorWithoutCode('Please send status message through .sendStatus')
    }
    if (!isMessageCodeAllowed(code, this._version)) {
      throw EthereumJSErrorWithoutCode(`Code ${code} not allowed with version ${this._version}`)
    }
    if (isDeprecatedPostMergeMessage(code, this._version)) {
      throw EthereumJSErrorWithoutCode(`Code ${code} is deprecated after the merge`)
    }

    payload = RLP.encode(payload)

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      payload = snappy.compress(payload)
    }

    this._send(code, payload)
  }

  getMsgPrefix(msgCode: EthMessageCodeType): string {
    return EthMessageCodeNames[msgCode]
  }
}
