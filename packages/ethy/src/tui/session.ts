import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'

import { MAX_AI_OVERVIEW_CHARS, buildDeterministicOverview } from '../ai/overviewNarrator.ts'
import { AiPulseNarrator } from '../ai/pulseNarrator.ts'
import type { EthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { readDomainSnapshots } from '../domains/domainManagers.ts'
import { describeNotice } from '../notify/board.ts'
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  CURSOR_HIDE,
  CURSOR_SHOW,
  cursorTo,
  syncOutputBegin,
  syncOutputEnd,
} from './ansi.ts'
import {
  createInitialViewState,
  cycleDomain,
  deepViewCommand,
  pushKeyChar,
  reducePromptKey,
} from './prompt.ts'
import { promptCaretPosition, renderFrame } from './renderFrame.ts'

const ASKING_LLM_NOTE = 'Asking the local model…'

function clampOverviewNote(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= MAX_AI_OVERVIEW_CHARS) return t
  return `${t.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}

/**
 * Presentation clock. This function only reads spine state, paints, and
 * handles keys. Sync and discovery must not run synchronous disk or ingest
 * work on this turn — see `runtime/lanes.ts`.
 */
export async function runEthySession(node: EthyNode): Promise<void> {
  const demoStart = Date.now()
  let view = createInitialViewState()
  let lastQuerySlot: number | undefined
  let escapeBuf = ''
  let lastPhase = node.spine.phase
  let lastEconomyHasBlocks = node.spine.economy?.hasBlocks === true
  let lastAllBucketsDone = node.spine.snapBuckets.every((b) => b.status === 'done')
  let lastOverviewMs = Date.now()
  const OVERVIEW_INTERVAL_MS = 30_000
  const llmConfigured = node.llm !== undefined
  let intentGeneration = 0
  let savedOverviewForIntent = ''
  let pulseNarrator: AiPulseNarrator | undefined

  const refreshOverview = (trigger: 'welcome' | 'pulse') => {
    const snapshots = readDomainSnapshots(node.spine)
    view = {
      ...view,
      aiOverview: buildDeterministicOverview(snapshots, trigger),
    }
  }
  refreshOverview('welcome')

  if (input.isTTY) {
    readline.emitKeypressEvents(input)
    input.setRawMode(true)
  }
  output.write(ALT_SCREEN_ON)

  const draw = () => {
    if (node.demo) {
      advanceDemo(node.spine, Date.now() - demoStart)
    }
    const now = Date.now()
    const hasBlocks = node.spine.economy?.hasBlocks === true
    const allBucketsDone = node.spine.snapBuckets.every((b) => b.status === 'done')
    if (!llmConfigured) {
      if (
        node.spine.phase !== lastPhase ||
        hasBlocks !== lastEconomyHasBlocks ||
        allBucketsDone !== lastAllBucketsDone
      ) {
        lastPhase = node.spine.phase
        lastEconomyHasBlocks = hasBlocks
        lastAllBucketsDone = allBucketsDone
        refreshOverview('pulse')
        lastOverviewMs = now
      } else if (now - lastOverviewMs >= OVERVIEW_INTERVAL_MS) {
        refreshOverview('pulse')
        lastOverviewMs = now
      }
    } else {
      if (
        node.spine.phase !== lastPhase ||
        hasBlocks !== lastEconomyHasBlocks ||
        allBucketsDone !== lastAllBucketsDone
      ) {
        lastPhase = node.spine.phase
        lastEconomyHasBlocks = hasBlocks
        lastAllBucketsDone = allBucketsDone
        pulseNarrator?.notePhase(node.spine)
      }
    }
    const flip = node.spine.headFlipSummary
    if (view.activeWidget === null && flip !== undefined) {
      view = { ...view, activeWidget: flip }
      node.spine.headFlipSummary = undefined
    }
    const cols = output.columns ?? 100
    const rows = output.rows ?? 30
    const lines = renderFrame(node.spine, view, cols, rows, describeNotice(node.notices, now))
    const caret = promptCaretPosition(cols, rows, view.promptDraft)
    output.write(CURSOR_HIDE)
    output.write(syncOutputBegin())
    output.write('\x1b[H')
    output.write(lines.join('\n'))
    output.write(cursorTo(caret.row, caret.col))
    output.write(syncOutputEnd())
    output.write(CURSOR_SHOW)
  }

  const applyIntentResult = (
    gen: number,
    result: Awaited<ReturnType<typeof node.intentEngine.handle>>,
    label: string,
    isNl: boolean,
  ) => {
    if (gen !== intentGeneration) return
    lastQuerySlot = result.querySlot
    const nextOverview =
      result.overviewNote !== undefined
        ? clampOverviewNote(result.overviewNote)
        : isNl && view.aiOverview === ASKING_LLM_NOTE
          ? savedOverviewForIntent || view.aiOverview
          : view.aiOverview
    view = {
      ...view,
      activeWidget: result.widget,
      interactionPage: 'main',
      interactionLabel: label,
      interactionTitle: isNl ? result.viewTitle : undefined,
      aiOverview: nextOverview,
    }
    if (isNl) {
      node.hybridEngine?.noteIntentInflight(-1)
    }
    draw()
  }

  const runIntent = (text: string, gen: number, isNl: boolean) => {
    if (isNl) {
      pulseNarrator?.abortInFlight()
      if (view.aiOverview !== ASKING_LLM_NOTE && view.aiOverview !== undefined) {
        savedOverviewForIntent = view.aiOverview
      }
      view = { ...view, aiOverview: clampOverviewNote(ASKING_LLM_NOTE) }
      node.hybridEngine?.noteIntentInflight(1)
      draw()
    }
    void node.intentEngine
      .handle({
        text,
        spine: node.spine,
        lastQuerySlot,
      })
      .then((result) => {
        applyIntentResult(gen, result, text, isNl)
      })
      .catch(() => {
        if (gen !== intentGeneration) return
        node.hybridEngine?.noteIntentInflight(-1)
        view = { ...view, aiOverview: savedOverviewForIntent || view.aiOverview }
        draw()
      })
  }

  if (llmConfigured && node.llm !== undefined && !node.demo && !node.headless) {
    pulseNarrator = new AiPulseNarrator({
      transport: node.llm.transport,
      onOverview: (text) => {
        view = { ...view, aiOverview: text }
        draw()
      },
      onUnhealthy: () => {
        refreshOverview('pulse')
      },
    })
    pulseNarrator.start(node.spine)
  }

  draw()
  const refreshTimer = setInterval(draw, node.demo ? 150 : 400)

  const onResize = () => draw()
  output.on('resize', onResize)

  await new Promise<void>((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      cleanup()
      resolve()
    }

    const onSignal = () => finish()
    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)

    const onData = (buf: Buffer) => {
      const chunk = buf.toString('utf8')
      let dirty = false
      for (const ch of chunk) {
        const step = pushKeyChar(escapeBuf, ch)
        escapeBuf = step.buffer
        const action = step.action
        if (action === undefined) {
          continue
        }
        dirty = true
        const {
          view: nextView,
          submittedLine,
          domainCycle,
          openDeepView,
          toggleDebug,
        } = reducePromptKey(view, action)
        view = nextView
        if (toggleDebug === true) {
          const w = view.activeWidget
          if (w?.debugPage !== undefined && w.debugPage.length > 0) {
            view = {
              ...view,
              interactionPage: view.interactionPage === 'debug' ? 'main' : 'debug',
            }
          }
        }
        if (domainCycle !== undefined) {
          view = {
            ...view,
            activeDomain: cycleDomain(view.activeDomain, domainCycle),
          }
        }
        if (openDeepView === true) {
          const cmd = deepViewCommand(view.activeDomain)
          const gen = ++intentGeneration
          runIntent(cmd, gen, false)
          dirty = false
        }
        if (submittedLine !== undefined) {
          const gen = ++intentGeneration
          const isNl = !submittedLine.trim().startsWith('/')
          runIntent(submittedLine, gen, isNl)
          dirty = false
        }
        if (view.shouldExit) {
          finish()
          return
        }
      }
      if (dirty) {
        draw()
      }
    }

    const cleanup = () => {
      process.off('SIGINT', onSignal)
      process.off('SIGTERM', onSignal)
      clearInterval(refreshTimer)
      output.off('resize', onResize)
      input.off('data', onData)
      pulseNarrator?.stop()
      node.hybridEngine?.clearMemory()
      if (input.isTTY) input.setRawMode(false)
      output.write(CURSOR_SHOW)
      output.write(ALT_SCREEN_OFF)
    }

    input.on('data', onData)
  })
}
