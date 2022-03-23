import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { Event } from '../../types'
import type { Config } from '../../config'
import {
  ExecutionPayloadV1,
  ForkchoiceResponseV1,
  ForkchoiceStateV1,
  PayloadStatusV1,
  Status,
} from '../modules/engine'

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Uncertain = 'uncertain',
}

type CLConnectionManagerOpts = {
  config: Config
}

type NewPayload = {
  payload: ExecutionPayloadV1
  response?: PayloadStatusV1
}

type ForkchoiceUpdate = {
  state: ForkchoiceStateV1
  response?: ForkchoiceResponseV1
  headBlock?: Block
  error?: string
}

export class CLConnectionManager {
  private config: Config

  /** Threshold for a disconnected status decision */
  private DISCONNECTED_THRESHOLD = 30000

  /** Threshold for an uncertain status decision */
  private UNCERTAIN_THRESHOLD = 15000

  /** Default connection check interval (in ms) */
  private DEFAULT_CONNECTION_CHECK_INTERVAL = 10000

  /** Default payload log interval (in ms) */
  private DEFAULT_PAYLOAD_LOG_INTERVAL = 10000

  /** Default forkchoice log interval (in ms) */
  private DEFAULT_FORKCHOICE_LOG_INTERVAL = 10000

  private _connectionCheckInterval?: NodeJS.Timeout /* global NodeJS */
  private _payloadLogInterval?: NodeJS.Timeout
  private _forkchoiceLogInterval?: NodeJS.Timeout

  private connectionStatus = ConnectionStatus.Disconnected
  private oneTimeMergeCLConnectionCheck = false
  private lastRequestTimestamp = 0

  private _lastPayload?: NewPayload
  private _lastForkchoiceUpdate?: ForkchoiceUpdate
  private oneTimeSyncingResponseCheck = false

  private _initialPayload?: NewPayload
  private _initialForkchoiceUpdate?: ForkchoiceUpdate

  constructor(opts: CLConnectionManagerOpts) {
    this.config = opts.config
    if (this.config.chainCommon.gteHardfork(Hardfork.PreMerge)) {
      this.start()
    } else {
      this.config.events.on(Event.CHAIN_UPDATED, () => {
        if (this.config.chainCommon.gteHardfork(Hardfork.PreMerge)) {
          this.start()
        }
      })
    }
    this.config.events.once(Event.CLIENT_SHUTDOWN, () => {
      this.stop()
    })
  }

  start() {
    if (this._connectionCheckInterval) {
      // Return if already started
      return
    }
    this._connectionCheckInterval = setInterval(
      // eslint-disable @typescript-eslint/await-thenable
      this.connectionCheck.bind(this),
      this.DEFAULT_CONNECTION_CHECK_INTERVAL
    )
    this._payloadLogInterval = setInterval(
      this.payloadLog.bind(this),
      this.DEFAULT_PAYLOAD_LOG_INTERVAL
    )
    this._forkchoiceLogInterval = setInterval(
      this.forkchoiceLog.bind(this),
      this.DEFAULT_FORKCHOICE_LOG_INTERVAL
    )
  }

  stop() {
    const intervals = [
      this._connectionCheckInterval,
      this._payloadLogInterval,
      this._forkchoiceLogInterval,
    ]
    for (const interval of intervals) {
      if (interval) clearInterval(interval)
    }
  }

  private _getPayloadLogMsg(payload: NewPayload) {
    const msg = `number=${Number(
      payload.payload.blockNumber
    )} hash=${payload.payload.blockHash.substring(0, 7)}... parentHash=${
      payload.payload.parentHash
    } status=${payload.response ? payload.response.status : '-'}`
    return msg
  }

  private _getForkchoiceUpdateLogMsg(update: ForkchoiceUpdate) {
    let msg = `headBlockHash=${update.state.headBlockHash.substring(0, 7)}...`
    if (update.headBlock) {
      msg += ` number=${update.headBlock.header.number} timestampDiff=${this.timeDiffStr(
        update.headBlock
      )}`
    }
    msg += ` finalizedBlockHash=${update.state.finalizedBlockHash} response=${
      update.response ? update.response.payloadStatus.status : '-'
    }`
    if (update.error) {
      msg += ` error=${update.error}`
    }
    return msg
  }

  private timeDiffStr(block: Block) {
    const timeDiff = new Date().getTime() / 1000 - block.header.timestamp.toNumber()
    const min = 60
    const hour = min * 60
    const day = hour * 24
    let timeDiffStr = ''
    if (timeDiff > day) {
      timeDiffStr = `${Math.floor(timeDiff / day)} days`
    } else if (timeDiff > hour) {
      timeDiffStr = `${Math.floor(timeDiff / hour)} hours`
    } else if (timeDiff > min) {
      timeDiffStr = `${Math.floor(timeDiff / min)} mins`
    } else {
      timeDiffStr = `${Math.floor(timeDiff)} secs`
    }
    return timeDiffStr
  }

  lastForkchoiceUpdate(update: ForkchoiceUpdate) {
    this.updateStatus()
    if (!this._initialForkchoiceUpdate) {
      this._initialForkchoiceUpdate = update
      this.config.logger.info(
        `Initial consensus forkchoice update ${this._getForkchoiceUpdateLogMsg(update)}`
      )
    }
    this._lastForkchoiceUpdate = update
  }

  lastNewPayload(payload: NewPayload) {
    this.updateStatus()
    if (!this._initialPayload) {
      this._initialPayload = payload
      this.config.logger.info(
        `Initial consensus payload received ${this._getPayloadLogMsg(payload)}`
      )
    }
    if (!this.oneTimeSyncingResponseCheck) {
      if (payload.response?.status === Status.SYNCING) {
        this.config.logger.warn(
          `CL client is requesting payload verification on future blocks which requires optimistic sync (unimplemented)`
        )
        this.config.logger.warn(
          `Please restart your CL client sync from a present EL execution block`
        )
        this.oneTimeSyncingResponseCheck = true
      }
    }
    this._lastPayload = payload
  }

  /**
   * Updates the Consensus Client connection status on new RPC requests
   */
  updateStatus() {
    if (
      [ConnectionStatus.Disconnected, ConnectionStatus.Uncertain].includes(this.connectionStatus)
    ) {
      this.config.logger.info('Consensus client connection established', { attentionCL: 'CL' })
    }
    this.connectionStatus = ConnectionStatus.Connected
    this.lastRequestTimestamp = new Date().getTime()
  }

  /**
   * Regularly checks the Consensus Client connection
   */
  private connectionCheck() {
    if (this.connectionStatus === ConnectionStatus.Connected) {
      const now = new Date().getTime()
      const timeDiff = now - this.lastRequestTimestamp

      if (timeDiff <= this.DISCONNECTED_THRESHOLD) {
        if (timeDiff > this.UNCERTAIN_THRESHOLD) {
          this.connectionStatus = ConnectionStatus.Uncertain
          this.config.logger.warn('Losing consensus client connection...', { attentionCL: 'CL ?' })
        }
      } else {
        this.connectionStatus = ConnectionStatus.Disconnected
        this.config.logger.warn('Consensus client disconnected', { attentionCL: null })
      }
    }

    if (this.config.chainCommon.hardfork() == Hardfork.PreMerge) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        this.config.logger.warn('CL client connection is needed, Merge HF happening soon')
        this.config.logger.warn(
          '(no CL <-> EL communication yet, connection might be in a workable state though)'
        )
      }
    }

    if (
      !this.oneTimeMergeCLConnectionCheck &&
      this.config.chainCommon.hardfork() == Hardfork.Merge
    ) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        this.config.logger.warn(
          'Merge HF activated, CL client connection is needed for continued block processing'
        )
        this.config.logger.warn(
          '(note that CL client might need to be synced up to beacon chain Merge transition slot until communication starts)'
        )
      }
      this.oneTimeMergeCLConnectionCheck = true
    }
  }

  /**
   * Regular payload request logs
   */
  private payloadLog() {
    if (this.connectionStatus !== ConnectionStatus.Connected) {
      return
    }
    if (!this._lastPayload) {
      this.config.logger.info('No consensus payload received yet')
    } else {
      ;`Last consensus payload received ${this._getPayloadLogMsg(this._lastPayload)}
      `
    }
  }

  /**
   * Regular forkchoice request logs
   */
  private forkchoiceLog() {
    if (this.connectionStatus !== ConnectionStatus.Connected) {
      return
    }
    if (!this._lastForkchoiceUpdate) {
      this.config.logger.info('No consensus forkchoice update received yet')
    } else {
      this.config.logger.info(
        `Last consensus forkchoice update ${this._getForkchoiceUpdateLogMsg(
          this._lastForkchoiceUpdate
        )}`
      )
    }
  }
}
