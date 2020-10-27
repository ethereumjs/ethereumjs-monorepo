import type { LevelUp } from 'levelup'
import { Logger } from 'winston'
import Common from '@ethereumjs/common'

export interface Options {
    /**
     * Specify the chain and hardfork by passing a Common instance.
     *
     * If not provided this defaults to chain `mainnet` and hardfork `chainstart`
     */
    common?: Common,
    /**
     * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
     */
    db?: LevelUp
    /**
     * Logger (winston) with log level used
     */
    logger?: Logger,
}