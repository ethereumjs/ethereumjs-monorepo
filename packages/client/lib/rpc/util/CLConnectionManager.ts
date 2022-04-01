import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { Event } from '../../types'
import { short, timeDiff } from '../../util'
import type { Config } from '../../config'
import {
  ExecutionPayloadV1,
  ForkchoiceResponseV1,
  ForkchoiceStateV1,
  PayloadStatusV1,
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
  private numberFormatter: Intl.NumberFormat

  /** Default connection check interval (in ms) */
  private DEFAULT_CONNECTION_CHECK_INTERVAL = 10000

  /** Default payload log interval (in ms) */
  private DEFAULT_PAYLOAD_LOG_INTERVAL = 10000

  /** Default forkchoice log interval (in ms) */
  private DEFAULT_FORKCHOICE_LOG_INTERVAL = 10000

  /** Threshold for a disconnected status decision */
  private DISCONNECTED_THRESHOLD = 30000

  /** Threshold for an uncertain status decision */
  private UNCERTAIN_THRESHOLD = 15000

  /** Track ethereumjs client shutdown status */
  private _clientShutdown = false

  private _connectionCheckInterval?: NodeJS.Timeout /* global NodeJS */
  private _payloadLogInterval?: NodeJS.Timeout
  private _forkchoiceLogInterval?: NodeJS.Timeout

  private connectionStatus = ConnectionStatus.Disconnected
  private oneTimeMergeCLConnectionCheck = false
  private lastRequestTimestamp = 0

  private _lastPayload?: NewPayload
  private _lastForkchoiceUpdate?: ForkchoiceUpdate

  private _initialPayload?: NewPayload
  private _initialForkchoiceUpdate?: ForkchoiceUpdate

  get running() {
    return !!this._connectionCheckInterval
  }

  constructor(opts: CLConnectionManagerOpts) {
    this.config = opts.config
    this.numberFormatter = Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    })

    if (this.config.chainCommon.gteHardfork(Hardfork.MergeForkIdTransition)) {
      this.start()
    } else {
      this.config.events.on(Event.CHAIN_UPDATED, () => {
        if (this.config.chainCommon.gteHardfork(Hardfork.MergeForkIdTransition)) {
          this.start()
        }
      })
    }
    this.config.events.once(Event.CLIENT_SHUTDOWN, () => {
      this._clientShutdown = true
      this.stop()
    })
  }

  start() {
    if (this.running || this._clientShutdown) return

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
    if (this._connectionCheckInterval) {
      clearInterval(this._connectionCheckInterval)
      this._connectionCheckInterval = undefined
    }
    if (this._payloadLogInterval) {
      clearInterval(this._payloadLogInterval)
      this._payloadLogInterval = undefined
    }
    if (this._forkchoiceLogInterval) {
      clearInterval(this._forkchoiceLogInterval)
      this._forkchoiceLogInterval = undefined
    }
  }

  private _getPayloadLogMsg(payload: NewPayload) {
    const msg = `number=${Number(payload.payload.blockNumber)} hash=${short(
      payload.payload.blockHash
    )} parentHash=${short(payload.payload.parentHash)}  status=${
      payload.response ? payload.response.status : '-'
    } gasUsed=${this.compactNum(Number(payload.payload.gasUsed))} baseFee=${Number(
      payload.payload.baseFeePerGas
    )} txs=${payload.payload.transactions.length}`
    return msg
  }

  private _getForkchoiceUpdateLogMsg(update: ForkchoiceUpdate) {
    let msg = ''
    if (update.headBlock) {
      msg += `number=${Number(update.headBlock.header.number)} `
    }
    msg += `head=${short(update.state.headBlockHash)} finalized=${short(
      update.state.finalizedBlockHash
    )} response=${update.response ? update.response.payloadStatus.status : '-'}`
    if (update.headBlock) {
      msg += ` timestampDiff=${this.timeDiffStr(update.headBlock)}`
    }
    if (update.error) {
      msg += ` error=${update.error}`
    }
    return msg
  }

  private compactNum(num: number) {
    return this.numberFormatter.format(num).toLowerCase()
  }

  private timeDiffStr(block: Block) {
    return timeDiff(block.header.timestamp.toNumber())
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
    this._lastPayload = payload
  }

  /**
   * Updates the Consensus Client connection status on new RPC requests
   */
  updateStatus() {
    if (!this.running) this.start()
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

    if (this.config.chainCommon.hardfork() === Hardfork.MergeForkIdTransition) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        this.config.logger.warn('CL client connection is needed, Merge HF happening soon')
        this.config.logger.warn(
          '(no CL <-> EL communication yet, connection might be in a workable state though)'
        )
      }
    }

    if (
      !this.oneTimeMergeCLConnectionCheck &&
      this.config.chainCommon.hardfork() === Hardfork.Merge
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
      this.config.logger.info(`Last consensus payload received  ${this._getPayloadLogMsg(
        this._lastPayload
      )}
      `)
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
