/** Ambient types for optional `node-llama-cpp` (not a package dependency). */
export type NodeLlamaCppModule = {
  getLlama: (opts?: { gpu?: false }) => Promise<{
    loadModel: (opts: { modelPath: string }) => Promise<{
      createContext: (opts: { contextSize: number }) => Promise<{
        dispose: () => Promise<void>
      }>
    }>
    dispose: () => Promise<void>
  }>
}
