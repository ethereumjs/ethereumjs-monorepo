import createDebugLogger from 'debug'

import type { Debugger } from 'debug'

export class Cache {
  _debug: Debugger

  _checkpoints = 0

  _stats = {
    size: 0,
    reads: 0,
    hits: 0,
    writes: 0,
    dels: 0,
  }

  /**
   * StateManager cache is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

  constructor() {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    this.DEBUG = process?.env?.DEBUG?.includes('ethjs') ?? false

    this._debug = createDebugLogger('statemanager:cache')
  }
}
