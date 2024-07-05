import { EOFContainer, EOFContainerMode } from './container.js'

import type { RunState } from '../interpreter.js'

export function setupEOF(runState: RunState, eofMode: EOFContainerMode = EOFContainerMode.Default) {
  runState.env.eof = {
    container: new EOFContainer(runState.code, eofMode),
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
