import { EOFContainer } from './container.js'

import type { RunState } from '../interpreter.js'

export function setupEOF(runState: RunState) {
  runState.env.eof = {
    container: new EOFContainer(runState.code),
    eofRunState: {
      returnStack: [],
    },
  }
  const pc = runState.env.eof.container.header.getCodePosition(0)
  runState.programCounter = pc
}
