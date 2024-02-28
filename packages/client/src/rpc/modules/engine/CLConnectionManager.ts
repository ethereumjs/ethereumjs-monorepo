import { Hardfork } from '@ethereumjs/common'

import { Event } from '../../../types'
import { short, timeDiff } from '../../../util'

import type { Config } from '../../../config'
import type {
  ExecutionPayloadV1,
  ExecutionPayloadV2,
  ExecutionPayloadV3,
  ForkchoiceResponseV1,
  ForkchoiceStateV1,
  PayloadStatusV1,
} from './types'
import type { Block } from '@ethereumjs/block'
import type winston from 'winston'

const enginePrefix = '[ CL ] '

enum logLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Uncertain = 'uncertain',
}

type CLConnectionManagerOpts = {
  config: Config
  inActivityCb?: () => void
}

type NewPayload = {
  payload: ExecutionPayloadV1 | ExecutionPayloadV2 | ExecutionPayloadV3
  response?: PayloadStatusV1
}

type ForkchoiceUpdate = {
  state: ForkchoiceStateV1
  response?: ForkchoiceResponseV1
  headBlock?: Block
  error?: string
}

type PayloadToPayloadStats = {
  blockCount: number
  minBlockNumber?: bigint
  maxBlockNumber?: bigint
  txs: { [key: number]: number }
}

const logCLStatus = (logger: winston.Logger, logMsg: string, logLevel: logLevel) => {
  //@ts-ignore
  logger[logLevel](enginePrefix + logMsg)
}
export class CLConnectionManager {
  private config: Config
  private numberFormatter: Intl.NumberFormat

  /** Default connection check interval (in ms) */
  private DEFAULT_CONNECTION_CHECK_INTERVAL = 10000

  /** Default payload log interval (in ms) */
  private DEFAULT_PAYLOAD_LOG_INTERVAL = 60000

  /** Default forkchoice log interval (in ms) */
  private DEFAULT_FORKCHOICE_LOG_INTERVAL = 60000

  /** Threshold for a disconnected status decision */
  private DISCONNECTED_THRESHOLD = 45000
  /** Wait for a minute to log disconnected again*/
  private LOG_DISCONNECTED_EVERY_N_CHECKS = 6
  private disconnectedCheckIndex = 0

  /** Threshold for an uncertain status decision */
  private UNCERTAIN_THRESHOLD = 30000

  /** Track ethereumjs client shutdown status */
  private _clientShutdown = false

  private _connectionCheckInterval?: NodeJS.Timeout /* global NodeJS */
  private _payloadLogInterval?: NodeJS.Timeout
  private _forkchoiceLogInterval?: NodeJS.Timeout

  private connectionStatus = ConnectionStatus.Disconnected
  private oneTimeMergeCLConnectionCheck = false
  private lastRequestTimestamp = 0

  private _lastPayload?: NewPayload
  private _payloadToPayloadStats: PayloadToPayloadStats = {
    blockCount: 0,
    minBlockNumber: undefined,
    maxBlockNumber: undefined,
    txs: {},
  }

  private _lastForkchoiceUpdate?: ForkchoiceUpdate

  private _initialPayload?: NewPayload
  private _initialForkchoiceUpdate?: ForkchoiceUpdate
  private _inActivityCb?: () => void

  get running() {
    return !!this._connectionCheckInterval
  }

  constructor(opts: CLConnectionManagerOpts) {
    this.config = opts.config
    this.numberFormatter = Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    })

    if (this.config.chainCommon.gteHardfork(Hardfork.MergeForkIdTransition) === true) {
      this.start()
    } else {
      this.config.events.on(Event.CHAIN_UPDATED, () => {
        if (this.config.chainCommon.gteHardfork(Hardfork.MergeForkIdTransition) === true) {
          this.start()
        }
      })
    }
    this.config.events.once(Event.CLIENT_SHUTDOWN, () => {
      this._clientShutdown = true
      this.stop()
    })
    this._inActivityCb = opts.inActivityCb
  }

  start() {
    if (this.running || this._clientShutdown) return

    this._connectionCheckInterval = setInterval(
      // eslint-disable @typescript-eslint/await-thenable
      this.connectionCheck.bind(this),
      this.DEFAULT_CONNECTION_CHECK_INTERVAL
    )
    this._payloadLogInterval = setInterval(
      this.lastPayloadLog.bind(this),
      this.DEFAULT_PAYLOAD_LOG_INTERVAL
    )
    this._forkchoiceLogInterval = setInterval(
      this.lastForkchoiceLog.bind(this),
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
    let msg = `number=${Number(payload.payload.blockNumber)} hash=${short(
      payload.payload.blockHash
    )} parentHash=${short(payload.payload.parentHash)}  status=${
      payload.response ? payload.response.status : '-'
    } gasUsed=${this.compactNum(Number(payload.payload.gasUsed))} baseFee=${Number(
      payload.payload.baseFeePerGas
    )} txs=${payload.payload.transactions.length}`

    if ('withdrawals' in payload.payload && payload.payload.withdrawals !== null) {
      msg += ` withdrawals=${(payload.payload as ExecutionPayloadV2).withdrawals.length}`
    }
    if ('excessBlobGas' in payload.payload && payload.payload.excessBlobGas !== null) {
      msg += ` blobGasUsed=${(payload.payload as ExecutionPayloadV3).blobGasUsed} excessBlobGas=${
        (payload.payload as ExecutionPayloadV3).excessBlobGas
      }`
    }
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
    if (update.error !== undefined) {
      msg += ` error=${update.error}`
    }
    return msg
  }

  private compactNum(num: number) {
    return this.numberFormatter.format(num).toLowerCase()
  }

  private timeDiffStr(block: Block) {
    const timeDiffStr = timeDiff(Number(block.header.timestamp))
    return timeDiffStr
  }

  lastForkchoiceUpdate(update: ForkchoiceUpdate) {
    this.updateStatus()
    if (!this._initialForkchoiceUpdate) {
      this._initialForkchoiceUpdate = update
      logCLStatus(
        this.config.logger,
        `Initial consensus forkchoice update ${this._getForkchoiceUpdateLogMsg(update)}`,
        logLevel.INFO
      )
    }
    this._lastForkchoiceUpdate = update
  }

  lastNewPayload(payload: NewPayload) {
    this.updateStatus()
    if (!this._initialPayload) {
      this._initialPayload = payload
      logCLStatus(
        this.config.logger,
        `Initial consensus payload received ${this._getPayloadLogMsg(payload)}`,
        logLevel.INFO
      )
    }
    this._lastPayload = payload
  }

  updatePayloadStats(block: Block) {
    this._payloadToPayloadStats['blockCount'] += 1
    const num = block.header.number
    if (
      this._payloadToPayloadStats['minBlockNumber'] === undefined ||
      this._payloadToPayloadStats['minBlockNumber'] > num
    ) {
      this._payloadToPayloadStats['minBlockNumber'] = num
    }
    if (
      this._payloadToPayloadStats['maxBlockNumber'] === undefined ||
      this._payloadToPayloadStats['maxBlockNumber'] < num
    ) {
      this._payloadToPayloadStats['maxBlockNumber'] = num
    }
    for (const tx of block.transactions) {
      if (!(tx.type in this._payloadToPayloadStats['txs'])) {
        this._payloadToPayloadStats['txs'][tx.type] = 0
      }
      this._payloadToPayloadStats['txs'][tx.type] += 1
    }
  }

  clearPayloadStats() {
    this._payloadToPayloadStats['blockCount'] = 0
    this._payloadToPayloadStats['minBlockNumber'] = undefined
    this._payloadToPayloadStats['maxBlockNumber'] = undefined
    this._payloadToPayloadStats['txs'] = {}
  }

  /**
   * Updates the Consensus Client connection status on new RPC requests
   */
  updateStatus() {
    if (!this.running) this.start()
    if (
      [ConnectionStatus.Disconnected, ConnectionStatus.Uncertain].includes(this.connectionStatus)
    ) {
      this.config.superMsg('Consensus client connection established')
    }
    this.connectionStatus = ConnectionStatus.Connected
    this.lastRequestTimestamp = new Date().getTime()
  }

  /**
   * Regularly checks the Consensus Client connection
   */
  private connectionCheck() {
    if (this.connectionStatus === ConnectionStatus.Connected) {
      this.disconnectedCheckIndex = 0
      const now = new Date().getTime()
      const timeDiff = now - this.lastRequestTimestamp

      if (timeDiff <= this.DISCONNECTED_THRESHOLD) {
        if (timeDiff > this.UNCERTAIN_THRESHOLD) {
          this.connectionStatus = ConnectionStatus.Uncertain
          logCLStatus(this.config.logger, 'Losing consensus client connection...', logLevel.WARN)
        }
      } else {
        this.connectionStatus = ConnectionStatus.Disconnected
        logCLStatus(this.config.logger, 'Consensus client disconnected', logLevel.WARN)
      }
    } else {
      if (
        this.config.chainCommon.gteHardfork(Hardfork.Paris) &&
        this.disconnectedCheckIndex % this.LOG_DISCONNECTED_EVERY_N_CHECKS === 0
      ) {
        logCLStatus(this.config.logger, 'Waiting for consensus client to connect...', logLevel.INFO)
        if (this._inActivityCb !== undefined) {
          this._inActivityCb()
        }
      }
      this.disconnectedCheckIndex++
    }

    if (
      this.config.chainCommon.hardfork() === Hardfork.MergeForkIdTransition &&
      !this.config.chainCommon.gteHardfork(Hardfork.Paris)
    ) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        logCLStatus(
          this.config.logger,
          'CL client connection is needed, Merge HF happening soon',
          logLevel.WARN
        )
        logCLStatus(
          this.config.logger,
          '(no CL <-> EL communication yet, connection might be in a workable state though)',
          logLevel.WARN
        )
      }
    }

    if (
      !this.oneTimeMergeCLConnectionCheck &&
      this.config.chainCommon.hardfork() === Hardfork.Paris
    ) {
      if (this.connectionStatus === ConnectionStatus.Disconnected) {
        logCLStatus(
          this.config.logger,
          'Paris (Merge) HF activated, CL client connection is needed for continued block processing',
          logLevel.INFO
        )
        logCLStatus(
          this.config.logger,
          '(note that CL client might need to be synced up to beacon chain Merge transition slot until communication starts)',
          logLevel.INFO
        )
      }
      this.oneTimeMergeCLConnectionCheck = true
    }
  }

  /**
   * Regular payload request logs
   */
  private lastPayloadLog() {
    if (this.connectionStatus !== ConnectionStatus.Connected) {
      return
    }
    if (!this.config.synchronized) {
      this.config.logger.info('')
      if (!this._lastPayload) {
        logCLStatus(this.config.logger, 'No consensus payload received yet', logLevel.INFO)
      } else {
        const payloadMsg = this._getPayloadLogMsg(this._lastPayload)
        logCLStatus(
          this.config.logger,
          `Last consensus payload received  ${payloadMsg}`,
          logLevel.INFO
        )
        const count = this._payloadToPayloadStats['blockCount']
        const min = this._payloadToPayloadStats['minBlockNumber']
        const max = this._payloadToPayloadStats['maxBlockNumber']

        const txsMsg = []
        for (const [type, count] of Object.entries(this._payloadToPayloadStats['txs'])) {
          txsMsg.push(`T${type}:${count}`)
        }

        logCLStatus(
          this.config.logger,
          `Payload stats blocks count=${count} minBlockNum=${min} maxBlockNum=${max} txsPerType=${
            txsMsg.length > 0 ? txsMsg.join('|') : '0'
          }`,
          logLevel.DEBUG
        )
        this.clearPayloadStats()
      }
    }
  }

  /**
   * Externally triggered payload logs
   */
  public newPayloadLog() {
    if (this._lastPayload) {
      const payloadMsg = this._getPayloadLogMsg(this._lastPayload)
      this.config.logger.info('')
      logCLStatus(
        this.config.logger,
        `New consensus payload received  ${payloadMsg}`,
        logLevel.INFO
      )
    }
  }

  /**
   * Regular forkchoice request logs
   */
  private lastForkchoiceLog() {
    if (this.connectionStatus !== ConnectionStatus.Connected) {
      return
    }
    if (!this.config.synchronized) {
      if (!this._lastForkchoiceUpdate) {
        logCLStatus(
          this.config.logger,
          `No consensus forkchoice update received yet`,
          logLevel.INFO
        )
      } else {
        logCLStatus(
          this.config.logger,
          `Last consensus forkchoice update ${this._getForkchoiceUpdateLogMsg(
            this._lastForkchoiceUpdate
          )}`,
          logLevel.INFO
        )
      }
    }
  }

  /**
   * Externally triggered forkchoice log
   */
  public newForkchoiceLog() {
    if (this._lastForkchoiceUpdate) {
      logCLStatus(
        this.config.logger,
        `New chain head set (forkchoice update) ${this._getForkchoiceUpdateLogMsg(
          this._lastForkchoiceUpdate
        )}`,
        logLevel.INFO
      )
    }
  }
}

/**
 * This middleware can wrap a methodFn to process its response for connection manager by
 * specifying an appropriate handler
 */
export function middleware(
  methodFn: (params: any[]) => Promise<any>,
  handler: (params: any[], response: any, errormsg: any) => void
): any {
  return function (params: any[] = []) {
    return methodFn(params)
      .then((response) => {
        handler(params, response, undefined)
        return response
      })
      .catch((e) => {
        handler(params, undefined, e.message)
        throw e
      })
  }
}
