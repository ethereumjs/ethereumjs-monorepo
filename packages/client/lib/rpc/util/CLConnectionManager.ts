import { Hardfork } from '@ethereumjs/common'
import { Event } from '../../types'
import type { Config } from '../../config'
import type { ExecutionPayloadV1, ForkchoiceStateV1 } from '../modules/engine'

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Lost = 'lost',
}

type CLConnectionManagerOpts = {
  config: Config
}

export class CLConnectionManager {
  private config: Config

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

  /**
   * Do not get or set this value directly.
   * Use the getter and setter without the underscore, i.e.
   * ```this.connectionManager.lastPayloadReceived = payload```
   */
  private _lastPayloadReceived?: ExecutionPayloadV1

  /**
   * Do not get or set this value directly.
   * Use the getter and setter without the underscore, i.e.
   * ```this.connectionManager.lastForkchoiceUpdate = state```
   */
  private _lastForkchoiceUpdate?: ForkchoiceStateV1

  private initialPayloadReceived?: ExecutionPayloadV1
  private initialForkchoiceUpdate?: ForkchoiceStateV1

  get lastPayloadReceived(): ExecutionPayloadV1 | undefined {
    return this._lastPayloadReceived
  }

  set lastPayloadReceived(payload: ExecutionPayloadV1 | undefined) {
    if (!payload) return
    if (!this.initialPayloadReceived) {
      this.initialPayloadReceived = payload
      this.config.logger.info(
        `Initial consensus payload received block=${Number(payload.blockNumber)} parentHash=${
          payload.parentHash
        }`
      )
    }
    this._lastPayloadReceived = payload
  }

  get lastForkchoiceUpdate(): ForkchoiceStateV1 | undefined {
    return this._lastForkchoiceUpdate
  }

  set lastForkchoiceUpdate(state: ForkchoiceStateV1 | undefined) {
    if (!state) return
    if (!this.initialForkchoiceUpdate) {
      this.initialForkchoiceUpdate = state
      this.config.logger.info(
        `Initial consensus forkchoice update headBlockHash=${state.headBlockHash.substring(
          0,
          7
        )}... finalizedBlockHash=${state.finalizedBlockHash}`
      )
    }
    this._lastForkchoiceUpdate = state
  }

  constructor(opts: CLConnectionManagerOpts) {
    this.config = opts.config
    this.config.events.on(Event.CHAIN_UPDATED, () => {
      if (
        this.config.chainCommon.gteHardfork(Hardfork.PreMerge) &&
        !this._connectionCheckInterval
      ) {
        this.start()
      }
    })
    this.config.events.once(Event.CLIENT_SHUTDOWN, () => {
      this.stop()
    })
  }

  start() {
    this._connectionCheckInterval = setInterval(
      this.connectionCheck.bind(this), // eslint-disable @typescript-eslint/await-thenable
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

  /**
   * Updates the Consensus Client connection status on new RPC requests
   */
  updateStatus() {
    if ([ConnectionStatus.Disconnected, ConnectionStatus.Lost].includes(this.connectionStatus)) {
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

      if (timeDiff <= 10000) {
        if (timeDiff > 2000) {
          this.connectionStatus = ConnectionStatus.Lost
          this.config.logger.warn('Losing consensus client connection...', { attentionCL: 'CL ?' })
        }
      } else {
        this.connectionStatus = ConnectionStatus.Disconnected
        this.config.logger.warn('Consensus disconnected', { attentionCL: null })
      }
    }

    if (this.config.chainCommon.hardfork() == Hardfork.PreMerge) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        this.config.logger.warn('No CL client connection available, Merge HF happening soon')
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
    if (!this.lastPayloadReceived) {
      this.config.logger.info('No consensus payload received yet')
    } else {
      const num = Number(this.lastPayloadReceived.blockNumber)
      this.config.logger.info(
        `Last consensus payload received block=${num} parentHash=${this.lastPayloadReceived.parentHash}`
      )
    }
  }

  /**
   * Regular forkchoice request logs
   */
  private forkchoiceLog() {
    if (this.connectionStatus !== ConnectionStatus.Connected) {
      return
    }
    if (!this.lastForkchoiceUpdate) {
      this.config.logger.info('No consensus forkchoice update received yet')
    } else {
      const { headBlockHash, finalizedBlockHash } = this.lastForkchoiceUpdate
      this.config.logger.info(
        `Last consensus forkchoice update headBlockHash=${headBlockHash.substring(
          0,
          7
        )}... finalizedBlockHash=${finalizedBlockHash}`
      )
    }
  }
}
