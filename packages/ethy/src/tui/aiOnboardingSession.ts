import type { AiRuntimeController } from '../ai/aiRuntime.ts'
import type { HardwareSnapshot } from '../ai/hardwareCheck.ts'
import { discoverAllLocalModels } from '../ai/localProviders.ts'
import type { EthyAiConfig } from '../persist/userConfig.ts'
import type { TuiViewState, WidgetSpec } from '../spine/types.ts'
import type { KeyAction } from './prompt.ts'

export function buildOnboardingWidget(
  hardware: HardwareSnapshot,
): Extract<WidgetSpec, { kind: 'ai_onboarding' }> {
  const initialOption = hardware.lowHardware ? 1 : 0
  return {
    kind: 'ai_onboarding',
    initialOption,
    selectedOption: initialOption,
    selectedLocalIndex: 0,
    hardware,
    statusNote: 'P2P and sync continue in the background while you choose',
  }
}

export function reduceOnboardingKey(
  view: TuiViewState,
  action: KeyAction,
): { view: TuiViewState; committed?: EthyAiConfig } | undefined {
  const w = view.activeWidget
  if (w?.kind !== 'ai_onboarding') return undefined
  if (view.promptDraft.length > 0) return undefined

  let selected = w.selectedOption ?? w.initialOption ?? 0
  let localIdx = w.selectedLocalIndex ?? 0
  let sharePromptHistory = w.sharePromptHistory === true
  const models = w.discoveredModels ?? []

  if (action.type === 'up') {
    if (selected === 2 && models.length > 0 && localIdx > 0) {
      localIdx -= 1
    } else {
      selected = (selected - 1 + 3) % 3
      localIdx = selected === 2 && models.length > 0 ? models.length - 1 : 0
    }
  } else if (action.type === 'down') {
    if (selected === 2 && models.length > 0 && localIdx < models.length - 1) {
      localIdx += 1
    } else {
      selected = (selected + 1) % 3
      localIdx = 0
    }
  } else if (
    action.type === 'char' &&
    (action.ch === '1' || action.ch === '2' || action.ch === '3')
  ) {
    selected = Number.parseInt(action.ch, 10) - 1
    localIdx = 0
  } else if (action.type === 'char' && (action.ch === 'm' || action.ch === 'M')) {
    sharePromptHistory = !sharePromptHistory
  } else if (action.type === 'enter') {
    return {
      view,
      committed: configForOnboardingChoice(w, selected, localIdx, sharePromptHistory),
    }
  } else {
    return undefined
  }

  return {
    view: {
      ...view,
      activeWidget: {
        ...w,
        selectedOption: selected,
        selectedLocalIndex: localIdx,
        sharePromptHistory,
      },
    },
  }
}

export function configForOnboardingChoice(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
  option: number,
  localIndex: number,
  sharePromptHistory = widget.sharePromptHistory === true,
): EthyAiConfig {
  const shareField = sharePromptHistory ? { sharePromptHistory: true as const } : {}
  if (option === 1) {
    return { mode: 'off', memory: 'ephemeral' }
  }
  if (option === 2) {
    const models = widget.discoveredModels ?? []
    const hit = models[localIndex] ?? models[0]
    if (hit === undefined) {
      return { mode: 'off', memory: 'ephemeral' }
    }
    return {
      mode: 'local',
      localProvider: hit.provider,
      baseUrl: hit.baseUrl,
      model: hit.modelId,
      memory: 'ephemeral',
      ...shareField,
    }
  }
  return { mode: 'default', memory: 'ephemeral', ...shareField }
}

export async function hydrateOnboardingDiscovery(
  widget: Extract<WidgetSpec, { kind: 'ai_onboarding' }>,
): Promise<Extract<WidgetSpec, { kind: 'ai_onboarding' }>> {
  const discovered = await discoverAllLocalModels()
  return {
    ...widget,
    discoveredModels: discovered,
  }
}

export async function applyOnboardingCommit(
  runtime: AiRuntimeController,
  config: EthyAiConfig,
  sessionNoSave: boolean,
): Promise<void> {
  await runtime.setAiConfig(config, { persist: !sessionNoSave })
}
