import type { LlmTransport, LlmTransportRequest } from './fixtureEngine.ts'
import type { NodeLlamaCppModule } from './nodeLlamaCpp.types.ts'

export type TryImportNodeLlamaCpp = () => Promise<NodeLlamaCppModule | undefined>

const NODE_LLAMA_MODULE = 'node-llama-cpp'

let defaultTryImport: TryImportNodeLlamaCpp = async () => {
  try {
    const mod = (await import(/* webpackIgnore: true */ NODE_LLAMA_MODULE)) as NodeLlamaCppModule
    return mod
  } catch {
    return undefined
  }
}

export function setTryImportNodeLlamaCppForTests(fn: TryImportNodeLlamaCpp): void {
  defaultTryImport = fn
}

export function resetTryImportNodeLlamaCppForTests(): void {
  defaultTryImport = async () => {
    try {
      const mod = (await import(/* webpackIgnore: true */ NODE_LLAMA_MODULE)) as NodeLlamaCppModule
      return mod
    } catch {
      return undefined
    }
  }
}

export async function tryImportNodeLlamaCpp(): Promise<NodeLlamaCppModule | undefined> {
  return defaultTryImport()
}

/** In-process transport when `node-llama-cpp` is installed externally. */
export class NodeLlamaCppTransport implements LlmTransport {
  private readonly mod: NodeLlamaCppModule
  private readonly modelPath: string
  private queue: Promise<void> = Promise.resolve()
  private llama?: Awaited<ReturnType<NodeLlamaCppModule['getLlama']>>
  private disposed = false

  constructor(mod: NodeLlamaCppModule, modelPath: string) {
    this.mod = mod
    this.modelPath = modelPath
  }

  async complete(req: LlmTransportRequest, signal?: AbortSignal): Promise<string> {
    if (this.disposed) throw new Error('NodeLlamaCppTransport disposed')
    const run = async (): Promise<string> => {
      const llama = await this.ensureLlama()
      const model = await llama.loadModel({ modelPath: this.modelPath })
      const ctx = await model.createContext({ contextSize: 4096 })
      try {
        const user = req.messages.find((m) => m.role === 'user')?.content ?? ''
        const system = req.messages.find((m) => m.role === 'system')?.content ?? ''
        const prompt = `${system}\n\n${user}`
        const evaluator =
          (ctx as { evaluate?: (p: string) => Promise<string> }).evaluate ??
          (model as { complete?: (p: string) => Promise<string> }).complete
        if (evaluator === undefined) {
          throw new Error('node-llama-cpp context has no evaluate/complete hook')
        }
        const text = await evaluator.call(ctx, prompt)
        if (signal?.aborted === true) throw new Error('aborted')
        return text
      } finally {
        await ctx.dispose()
      }
    }
    const next = this.queue.then(run, run)
    this.queue = next.then(
      () => undefined,
      () => undefined,
    )
    return next
  }

  private async ensureLlama(): Promise<Awaited<ReturnType<NodeLlamaCppModule['getLlama']>>> {
    if (this.llama !== undefined) return this.llama
    this.llama = await this.mod.getLlama({ gpu: false })
    return this.llama
  }

  async dispose(): Promise<void> {
    this.disposed = true
    if (this.llama !== undefined) {
      await this.llama.dispose()
      this.llama = undefined
    }
  }
}
