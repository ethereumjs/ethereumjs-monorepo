import { EOFContainer, EOFContainerMode } from './container.js'

import type { RunState } from '../interpreter.js'

export function setupEOF(runState: RunState) {
  const mode =
    runState.env.depth === 0 && runState.env.isCreate
      ? EOFContainerMode.TxInitmode
      : EOFContainerMode.Default

  runState.env.eof = {
    container: new EOFContainer(runState.code, mode),
    eofRunState: {
      returnStack: [],
    },
  }

  if (runState.env.eof.container.body.txCallData !== undefined) {
    runState.env.callData = runState.env.eof.container.body.txCallData
  }

  const pc = runState.env.eof.container.header.getCodePosition(0)
  runState.programCounter = pc
}
