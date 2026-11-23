import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'

import { ChainDetectiveNarrator } from '../ai/chainDetective.ts'
import type { SlashDispatchCtx } from '../ai/deterministicEngine.ts'
import { selectLoreCards } from '../ai/ethereumLore.ts'
import { probeHardware } from '../ai/hardwareCheck.ts'
import { managedPhaseBlocksOverview } from '../ai/managedAiUi.ts'
import { inferModelTier, maxLoreCards } from '../ai/modelTier.ts'
import {
  buildDeterministicOverviewSections,
  clampOverviewSections,
} from '../ai/overviewNarrator.ts'
import { buildStoryBrief } from '../ai/storyBrief.ts'
import { directStory, recentLoreIds } from '../ai/storyDirector.ts'
import { buildDeterministicFieldNote } from '../ai/storyFallback.ts'
import type { EthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { readDomainSnapshots } from '../domains/domainManagers.ts'
import { chainConfigForNetwork } from '../net/chainHardfork.ts'
import { describeNotice } from '../notify/board.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { AiOverviewSections, InteractionHistoryEntry, TuiViewState } from '../spine/types.ts'
import { parseHelpDomainArg } from '../tools/help.ts'
import { parseStorySlashTrigger } from '../tools/storyTools.ts'
import {
  applyOnboardingCommit,
  buildOnboardingWidget,
  hydrateOnboardingDiscovery,
  reduceOnboardingKey,
} from './aiOnboardingSession.ts'
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  CURSOR_HIDE,
  CURSOR_SHOW,
  cursorTo,
  syncOutputBegin,
  syncOutputEnd,
} from './ansi.ts'
import { createInitialViewState, pushKeyChar, reducePromptKey } from './prompt.ts'
import { promptCaretPosition, renderFrame } from './renderFrame.ts'
import {
  activateHistoryEntry,
  activateLivePlazaFlip,
  applyLiveSlashRefresh,
  clearOverviewFocus,
  inferDomainForCommandOrPrompt,
  mergeOverviewFocus,
  openDomainHelp,
  openPlazaView,
  pushViewHistory,
  snapshotFlipWidget,
} from './viewHistory.ts'

const ASKING_LLM_NOTE = 'Asking the local model…'

function isHelpCommand(line: string): boolean {
  const cmd = line.trim().split(/\s+/)[0]?.toLowerCase()
  return cmd === '/help' || cmd === '/h'
}

export type EthySessionOpts = {
  showOnboarding?: boolean
  sessionNoSave?: boolean
}

export async function runEthySession(node: EthyNode, opts?: EthySessionOpts): Promise<void> {
  const demoStart = Date.now()
  let view = createInitialViewState(node.spine)
  let lastQuerySlot: number | undefined
  let escapeBuf = ''
  let lastPhase = node.spine.phase
  let lastEconomyHasBlocks = node.spine.economy?.hasBlocks === true
  let lastPlazaCarouselMs = 0
  let lastAllBucketsDone = node.spine.snapBuckets.every((b) => b.status === 'done')
  let lastOverviewMs = Date.now()
  const OVERVIEW_INTERVAL_MS = 30_000
  const llmConfigured = node.spine.aiMode !== 'off' && node.llm !== undefined

  if (opts?.showOnboarding === true && node.aiRuntime !== undefined) {
    const hw = probeHardware(node.dataDir ?? node.snapStore?.root ?? process.cwd())
    const onboarding = buildOnboardingWidget(hw)
    view = {
      ...view,
      aiOnboardingActive: true,
      activeWidget: onboarding,
      interactionPage: 'main',
    }
    void hydrateOnboardingDiscovery(onboarding).then((hydrated) => {
      if (view.activeWidget?.kind === 'ai_onboarding') {
        view = { ...view, activeWidget: hydrated }
        draw()
      }
    })
  }
  let intentGeneration = 0
  let savedOverviewSections: AiOverviewSections | undefined
  let detectiveNarrator: ChainDetectiveNarrator | undefined
  let unsubscribeManagedAi: (() => void) | undefined

  const slashCtx = (): SlashDispatchCtx => ({
    spine: node.spine,
    stateManager: node.stateManager,
    snapStore: node.snapStore,
    disconnectPeer: node.disconnectPeer,
    economy: node.economy,
    chain: chainConfigForNetwork(node.spine.network),
    journal: node.investigationJournal,
  })

  const refreshOverview = (trigger: 'welcome' | 'pulse') => {
    if (managedPhaseBlocksOverview(node.spine.managedAi?.phase)) {
      return
    }
    if (node.spine.economy?.hasBlocks === true) {
      const tier = inferModelTier(node.spine.managedAi?.label)
      const brief = buildStoryBrief(node.spine, node.economy, tier)
      if (brief !== undefined) {
        const lead = directStory(brief, node.investigationJournal)
        const lore = selectLoreCards(
          brief,
          lead.lens,
          recentLoreIds(node.investigationJournal),
          maxLoreCards(tier),
        )[0]
        if (lore !== undefined) {
          view = {
            ...view,
            aiOverviewSections: {
              dispatches: [buildDeterministicFieldNote(brief, lead.lens, lore, Date.now())],
              storyIndex: 1,
              storyCount: 1,
            },
          }
          return
        }
      }
      view = {
        ...view,
        aiOverviewSections: {
          bootstrapNote: 'Live blocks — field stories arrive once the historian cycles.',
        },
      }
      return
    }
    const snapshots = readDomainSnapshots(node.spine)
    view = {
      ...view,
      aiOverviewSections: clampOverviewSections(
        buildDeterministicOverviewSections(snapshots, trigger),
      ),
    }
  }
  refreshOverview('welcome')

  const navigateHistory = (direction: 'left' | 'right'): void => {
    const activateAtIndex = (index: number) => {
      const entry = view.viewHistory[index]
      if (entry === undefined) return
      const { overviewNote, ...activated } = activateHistoryEntry(entry, node.spine, slashCtx())
      const targetDomain = inferDomainForCommandOrPrompt(
        entry.kind === 'slash' ? entry.command : entry.prompt,
        view.activeDomain,
      )
      const nextSections =
        overviewNote !== undefined
          ? mergeOverviewFocus(
              clearOverviewFocus(view.aiOverviewSections),
              overviewNote,
              targetDomain,
            )
          : clearOverviewFocus(view.aiOverviewSections)
      view = {
        ...view,
        viewHistoryIndex: index,
        aiOverviewSections: nextSections,
        ...activated,
      }
    }
    if (direction === 'left') {
      if (view.viewHistoryIndex > 0) {
        activateAtIndex(view.viewHistoryIndex - 1)
      }
      return
    }
    if (view.viewHistoryIndex < view.viewHistory.length - 1) {
      activateAtIndex(view.viewHistoryIndex + 1)
    }
  }

  if (input.isTTY) {
    readline.emitKeypressEvents(input)
    input.setRawMode(true)
  }
  output.write(ALT_SCREEN_ON)

  const draw = () => {
    if (node.demo) {
      advanceDemo(node.spine, Date.now() - demoStart)
    }
    const nowDraw = Date.now()
    if (view.activeWidget === null || view.activeWidget.kind === 'start_page') {
      view = { ...view, carouselTick: view.carouselTick + 1 }
    } else if (view.activeWidget.kind === 'live_plaza' && nowDraw - lastPlazaCarouselMs >= 1000) {
      lastPlazaCarouselMs = nowDraw
      view = { ...view, carouselTick: view.carouselTick + 1 }
    }
    const now = Date.now()
    const hasBlocks = node.spine.economy?.hasBlocks === true
    const allBucketsDone = node.spine.snapBuckets.every((b) => b.status === 'done')
    if (node.spine.aiMode !== 'off') {
      if (
        node.spine.managedAi?.phase === 'deferred' &&
        (node.spine.phase === 'HEAD_FOLLOWING' || hasBlocks)
      ) {
        node.aiRuntime?.wakeIfDeferred()
      }
      const hasLiveDetective = detectiveNarrator !== undefined
      if (!hasLiveDetective) {
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
      } else if (
        node.spine.phase !== lastPhase ||
        hasBlocks !== lastEconomyHasBlocks ||
        allBucketsDone !== lastAllBucketsDone
      ) {
        const blocksJustArrived = hasBlocks && !lastEconomyHasBlocks
        lastPhase = node.spine.phase
        lastEconomyHasBlocks = hasBlocks
        lastAllBucketsDone = allBucketsDone
        if (blocksJustArrived) {
          detectiveNarrator?.noteBlocksReady(node.spine)
        }
      }
    }
    view = applyLiveSlashRefresh(view, node.spine, slashCtx())
    const flip = node.spine.headFlipSummary
    if (flip !== undefined) {
      const w = view.activeWidget
      if (w === null || w.kind === 'start_page') {
        if (flip.kind === 'live_plaza') {
          view = activateLivePlazaFlip(view, flip)
        } else {
          const title =
            flip.kind === 'key_value' || flip.kind === 'table'
              ? (flip.title ?? 'Head flip')
              : 'Head flip'
          view = snapshotFlipWidget(view, flip, title)
        }
      }
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
    const targetDomain = inferDomainForCommandOrPrompt(label, view.activeDomain)
    let nextSections = view.aiOverviewSections
    if (result.overviewNote !== undefined) {
      nextSections = mergeOverviewFocus(
        clearOverviewFocus(view.aiOverviewSections),
        result.overviewNote,
        targetDomain,
      )
    } else if (isNl && view.aiOverviewSections?.focusNote?.text === ASKING_LLM_NOTE) {
      nextSections = savedOverviewSections ?? clearOverviewFocus(view.aiOverviewSections)
    } else {
      nextSections = clearOverviewFocus(view.aiOverviewSections)
    }
    view = {
      ...view,
      activeWidget: result.widget,
      interactionPage: 'main',
      interactionLabel: label,
      interactionTitle: isNl ? result.viewTitle : undefined,
      aiOverviewSections: nextSections,
      showingHelp: false,
      aiOnboardingActive: result.openOnboarding === true ? true : view.aiOnboardingActive,
    }
    if (result.openOnboarding === true && result.widget.kind === 'ai_onboarding') {
      void hydrateOnboardingDiscovery(result.widget).then((hydrated) => {
        view = { ...view, activeWidget: hydrated }
        draw()
      })
    }
    if (result.aiLayoutRefresh === true) {
      if (node.spine.aiMode === 'off') {
        detectiveNarrator?.stop()
        detectiveNarrator = undefined
      } else if (node.llm !== undefined) {
        startDetectiveNarrator()
      }
    }
    if (isNl) {
      const entry: InteractionHistoryEntry = {
        kind: 'ai',
        prompt: label,
        viewTitle: result.viewTitle ?? label.slice(0, 48),
        widget: result.widget,
        overviewNote: result.overviewNote,
        page: 'main',
      }
      view = pushViewHistory(view, entry)
      node.hybridEngine?.noteIntentInflight(-1)
    } else if (!isHelpCommand(label) && result.openOnboarding !== true) {
      const cmdLower = label.trim().toLowerCase()
      const isAiControl = cmdLower === '/ai' || cmdLower.startsWith('/ai ') || cmdLower === '/clear'
      const entry: InteractionHistoryEntry = {
        kind: 'slash',
        command: label,
        label,
        page: 'main',
        frozenWidget: result.frozenSlashWidget ?? (isAiControl ? result.widget : undefined),
      }
      view = pushViewHistory(view, entry)
    }
    draw()
  }

  const runIntent = (text: string, gen: number, isNl: boolean) => {
    const storyTrigger = parseStorySlashTrigger(text)
    if (storyTrigger?.action === 'new') {
      void detectiveNarrator?.triggerNow(storyTrigger.lens)
    }
    if (isHelpCommand(text)) {
      const parts = text.split(/\s+/)
      const domain = parseHelpDomainArg(parts)
      view = openDomainHelp(view, node.spine, domain)
      draw()
      return
    }
    if (isNl && node.spine.aiMode !== 'off') {
      node.aiRuntime?.wakeIfDeferred()
      detectiveNarrator?.abortInFlight()
      detectiveNarrator?.noteUserPrompt(text)
      node.userInterest.notePrompt(text)
      if (view.aiOverviewSections?.focusNote === undefined) {
        savedOverviewSections = view.aiOverviewSections
      }
      const targetDomain = inferDomainForCommandOrPrompt(text, view.activeDomain)
      view = {
        ...view,
        aiOverviewSections: mergeOverviewFocus(
          view.aiOverviewSections,
          ASKING_LLM_NOTE,
          targetDomain,
        ),
      }
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
        view = {
          ...view,
          aiOverviewSections: savedOverviewSections ?? view.aiOverviewSections,
        }
        draw()
      })
  }

  const startDetectiveNarrator = () => {
    if (node.demo || node.headless) return
    if (node.spine.aiMode === 'off' || node.llm === undefined) return
    detectiveNarrator?.stop()
    const chain = chainConfigForNetwork(node.spine.network)
    detectiveNarrator = new ChainDetectiveNarrator({
      transport: node.llm.transport,
      economy: node.economy,
      stateManager: node.stateManager,
      chain,
      sandbox: node.sandbox,
      journal: node.investigationJournal,
      userInterest: node.userInterest,
      onOverview: (sections) => {
        view = { ...view, aiOverviewSections: sections }
        draw()
      },
      onUnhealthy: () => {
        deriveCapabilities(node.spine)
        draw()
      },
    })
    detectiveNarrator.start(node.spine)
  }

  if (node.aiRuntime !== undefined) {
    unsubscribeManagedAi = node.aiRuntime.subscribe((snap) => {
      if (snap.bootstrapNote !== undefined) {
        view = { ...view, aiOverviewSections: { bootstrapNote: snap.bootstrapNote } }
      }
      if (managedPhaseBlocksOverview(snap.phase)) {
        detectiveNarrator?.stop()
        detectiveNarrator = undefined
      }
      if (snap.phase === 'ready' && node.spine.aiMode !== 'off' && node.llm !== undefined) {
        startDetectiveNarrator()
      }
      draw()
    })
  }

  if (llmConfigured) {
    startDetectiveNarrator()
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
        const onboardingStep = reduceOnboardingKey(view, action)
        if (onboardingStep !== undefined) {
          if (onboardingStep.committed !== undefined && node.aiRuntime !== undefined) {
            void applyOnboardingCommit(
              node.aiRuntime,
              onboardingStep.committed,
              opts?.sessionNoSave === true,
            ).then(() => {
              view = {
                ...onboardingStep.view,
                aiOnboardingActive: false,
                activeWidget: { kind: 'start_page' },
              }
              if (node.spine.aiMode !== 'off' && node.llm !== undefined) {
                startDetectiveNarrator()
              }
              draw()
            })
          } else {
            view = onboardingStep.view
          }
          dirty = true
          if (dirty) draw()
          continue
        }
        const {
          view: nextView,
          submittedLine,
          helpToggle,
          viewHistoryNav,
          toggleDebug,
          openPlaza,
        } = reducePromptKey(view, action)
        view = nextView
        if (openPlaza === true) {
          view = openPlazaView(view, node.spine, slashCtx())
        }
        if (toggleDebug === true) {
          const w = view.activeWidget
          if (w?.debugPage !== undefined && w.debugPage.length > 0) {
            const nextPage = view.interactionPage === 'debug' ? 'main' : 'debug'
            view = {
              ...view,
              interactionPage: nextPage,
            }
            if (view.viewHistory.length > 0) {
              const idx = view.viewHistoryIndex
              const entry = view.viewHistory[idx]
              if (entry !== undefined) {
                const updated: InteractionHistoryEntry = { ...entry, page: nextPage }
                const hist = [...view.viewHistory]
                hist[idx] = updated
                view = { ...view, viewHistory: hist }
              }
            }
          }
        }
        if (helpToggle === true) {
          const onHelp = view.activeWidget?.kind === 'domain_help'
          if (!onHelp) {
            view = openDomainHelp(view, node.spine)
          } else if (view.viewHistoryIndex > 0) {
            navigateHistory('left')
          } else {
            const canPlaza =
              node.spine.phase === 'HEAD_FOLLOWING' ||
              (node.spine.demoClock === true && node.spine.economy?.hasBlocks === true)
            if (canPlaza) {
              view = openPlazaView(view, node.spine, slashCtx())
            }
          }
        }
        if (viewHistoryNav !== undefined) {
          navigateHistory(viewHistoryNav)
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
      detectiveNarrator?.stop()
      void node.aiRuntime?.stop()
      unsubscribeManagedAi?.()
      node.hybridEngine?.clearMemory()
      if (input.isTTY) input.setRawMode(false)
      output.write(CURSOR_SHOW)
      output.write(ALT_SCREEN_OFF)
    }

    input.on('data', onData)
  })
}
