import type {
  CancelReason,
  VitestRunnerConfig,
  VitestRunnerImportSource,
  VitestRunnerInterface,
} from './ViTestRunner'
import type { File, Suite, TaskResult, Test, TestContext } from 'vitest'

export class VBlockChainTestRunner implements VitestRunnerInterface {
  public config: VitestRunnerConfig
  public constructor(config: Partial<VitestRunnerConfig>) {
    this.config = {
      root: process.cwd(),
      setupFiles: [],
      name: 'Vitest',
      passWithNoTests: false,
      sequence: {
        shuffle: false,
        seed: 0,
        hooks: 'stack',
        setupFiles: 'parallel',
      },
      maxConcurrency: 5,
      testTimeout: 5000,
      hookTimeout: 5000,
      ...config,
    }
  }
  public onBeforeCollect?(_paths: string[]): unknown {
    return
  }
  public onCollected?(_files: File[]): unknown {
    return
  }
  public onCancel?(_reason: CancelReason): unknown {
    return
  }
  public onBeforeRunTest?(_test: Test): unknown {
    return
  }
  public onBeforeTryTest?(_test: Test, _retryCount: number): unknown {
    return
  }
  public onAfterRunTest?(_test: Test): unknown {
    return
  }
  public onAfterTryTest?(_test: Test, _retryCount: number): unknown {
    return
  }
  public onBeforeRunSuite?(_suite: Suite): unknown {
    return
  }
  public onAfterRunSuite?(_suite: Suite): unknown {
    return
  }
  public runSuite?(_suite: Suite): Promise<void> {
    return Promise.resolve()
  }
  public runTest?(_test: Test): Promise<void> {
    return Promise.resolve()
  }
  public onTaskUpdate?(_task: [string, TaskResult | undefined][]): Promise<void> {
    return Promise.resolve()
  }
  public onBeforeRun?(_files: File[]): unknown {
    return
  }
  public onAfterRun?(_files: File[]): unknown {
    return
  }
  public extendTestContext?(context: TestContext): TestContext {
    return context
  }
  public importFile(_filepath: string, _source: VitestRunnerImportSource): unknown {
    return
  }
}
